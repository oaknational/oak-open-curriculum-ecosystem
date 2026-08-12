import { Buffer } from 'node:buffer';
import { sep } from 'node:path';

import { err, ok, unwrapErr, unwrapOrThrow, type Result } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  createIdentitySecureFilePort,
  createSecureIdentityReadPort,
  type IdentityFileKind,
  type IdentityFileSystemPort,
  type IdentityNodeObservation,
} from './identity-secure-read.js';

const CHECKOUT = '/checkout';
const OWNER_ROOT = '/checkout/agent-tools/dist';
const SRC_DIR = '/checkout/agent-tools/dist/src';
const MEMBER = '/checkout/agent-tools/dist/src/member.js';

/** The product's error messages embed HOST-joined paths; expectations derive the same form. */
const hostForm = (posixPath: string): string => posixPath.split('/').join(sep);

interface MemoryNode {
  readonly kind: IdentityFileKind;
  readonly device: number;
  readonly inode: number;
  readonly bytes?: Uint8Array;
  readonly realpath?: string;
}

interface MemoryDescriptor {
  readonly path: string;
  readonly node: MemoryNode;
}

interface MemoryFixtureOptions {
  /** Remaps this path to a fresh symlink node during read() — one TOCTOU rename. */
  readonly driftDuringRead?: string;
  /** Binds the opened descriptor to this foreign node — an ancestor swap during open(). */
  readonly openHijack?: MemoryNode;
}

/**
 * Fail-closed in-memory filesystem port with real-descriptor semantics: a
 * descriptor is bound to the NODE it was opened on (fstat/read report that
 * node even if the path is later remapped), and `fstat`, `read`, and `close`
 * on a handle that is not currently live return an EBADF-style error, so
 * use-after-close and phantom reads fail by construction. `driftDuringRead`
 * models one concurrent rename landing between the descriptor read and the
 * post-read observation (idempotent, order-independent). `openHijack` models
 * an ancestor swap held exactly for the open() window: path observations see
 * the legitimate tree while the descriptor binds to the attacker's node.
 */
class MemoryIdentityFileSystem implements IdentityFileSystemPort<MemoryDescriptor> {
  readonly nodes = new Map<string, MemoryNode>();
  readonly #options: MemoryFixtureOptions;
  readonly #opened: string[] = [];
  readonly #live = new Set<MemoryDescriptor>();
  #nextInode = 1;

  constructor(options: MemoryFixtureOptions = {}) {
    this.#options = options;
  }

  // The product addresses the port in HOST-joined form; this fixture is
  // authored in POSIX form for readability. Keying and recording through one
  // normaliser makes the fake separator-blind, so the same fixture holds on
  // every platform.
  static #key(path: string): string {
    return path.split(sep).join('/');
  }

  mintNode(kind: IdentityFileKind, bytes?: Uint8Array): MemoryNode {
    this.#nextInode += 1;
    return { kind, device: 7, inode: this.#nextInode, bytes };
  }

  setNode(path: string, kind: IdentityFileKind, bytes?: Uint8Array): void {
    this.nodes.set(MemoryIdentityFileSystem.#key(path), this.mintNode(kind, bytes));
  }

  /** Every path a descriptor was successfully created against, in mint order. */
  get openedPaths(): readonly string[] {
    return Object.freeze([...this.#opened]);
  }

  /** Paths of descriptors that were opened and never closed. */
  get openDescriptorPaths(): readonly string[] {
    return Object.freeze([...this.#live].map(({ path }) => path));
  }

  lstat(path: string): Result<IdentityNodeObservation | undefined, Error> {
    const node = this.nodes.get(MemoryIdentityFileSystem.#key(path));
    return ok(
      node === undefined ? undefined : { kind: node.kind, device: node.device, inode: node.inode },
    );
  }

  realpath(path: string): Result<string, Error> {
    const node = this.nodes.get(MemoryIdentityFileSystem.#key(path));
    return node === undefined ? err(new Error(`missing ${path}`)) : ok(node.realpath ?? path);
  }

  openReadNoFollow(path: string): Result<MemoryDescriptor, Error> {
    const key = MemoryIdentityFileSystem.#key(path);
    const node = this.nodes.get(key);
    if (node === undefined) {
      return err(new Error(`missing ${path}`));
    }
    const descriptor: MemoryDescriptor = {
      path: key,
      node: this.#options.openHijack ?? node,
    };
    this.#opened.push(key);
    this.#live.add(descriptor);
    return ok(descriptor);
  }

  fstat(handle: MemoryDescriptor): Result<IdentityNodeObservation, Error> {
    if (!this.#live.has(handle)) {
      return err(new Error(`EBADF: descriptor for ${handle.path} is not open`));
    }
    return ok({
      kind: handle.node.kind,
      device: handle.node.device,
      inode: handle.node.inode,
    });
  }

  read(handle: MemoryDescriptor): Result<Uint8Array, Error> {
    if (!this.#live.has(handle)) {
      return err(new Error(`EBADF: descriptor for ${handle.path} is not open`));
    }
    if (this.#options.driftDuringRead !== undefined) {
      this.setNode(this.#options.driftDuringRead, 'symlink');
    }
    return handle.node.bytes === undefined ? err(new Error('unreadable')) : ok(handle.node.bytes);
  }

  close(handle: MemoryDescriptor): Result<void, Error> {
    if (!this.#live.delete(handle)) {
      return err(new Error(`EBADF: descriptor for ${handle.path} is not open`));
    }
    return ok(undefined);
  }
}

function secureFixture(options: MemoryFixtureOptions = {}): MemoryIdentityFileSystem {
  const fs = new MemoryIdentityFileSystem(options);
  for (const directory of ['/checkout/agent-tools', OWNER_ROOT, SRC_DIR]) {
    fs.setNode(directory, 'directory');
  }
  fs.setNode(MEMBER, 'file', Buffer.from('export {};\n'));
  return fs;
}

describe('secure identity read over a filesystem port', () => {
  it('returns the member bytes and leaves no descriptor open', () => {
    const fs = secureFixture();
    const reader = createSecureIdentityReadPort(createIdentitySecureFilePort(fs));

    const bytes = unwrapOrThrow(
      reader.readRegularFileNoFollow({
        chainRoot: CHECKOUT,
        ownerRoot: OWNER_ROOT,
        path: MEMBER,
      }),
    );

    expect(Buffer.from(bytes).toString()).toBe('export {};\n');
    expect(fs.openedPaths).toEqual([MEMBER]);
    expect(fs.openDescriptorPaths).toEqual([]);
  });

  it('refuses a symlink ancestor without ever opening the leaf', () => {
    const fs = secureFixture();
    fs.setNode(SRC_DIR, 'symlink');
    const reader = createSecureIdentityReadPort(createIdentitySecureFilePort(fs));

    const failure = unwrapErr(
      reader.readRegularFileNoFollow({
        chainRoot: CHECKOUT,
        ownerRoot: OWNER_ROOT,
        path: MEMBER,
      }),
    );

    expect(failure.message).toContain(`'${hostForm(SRC_DIR)}' is a symlink`);
    expect(fs.openedPaths).toEqual([]);
  });

  it('refuses bytes when the parent becomes a symlink during the read and leaves no descriptor open', () => {
    const fs = secureFixture({ driftDuringRead: SRC_DIR });
    const reader = createSecureIdentityReadPort(createIdentitySecureFilePort(fs));

    const failure = unwrapErr(
      reader.readRegularFileNoFollow({
        chainRoot: CHECKOUT,
        ownerRoot: OWNER_ROOT,
        path: MEMBER,
      }),
    );

    expect(failure.message).toContain(`'${hostForm(SRC_DIR)}' is a symlink`);
    expect(fs.openedPaths).toEqual([MEMBER]);
    expect(fs.openDescriptorPaths).toEqual([]);
  });

  it('refuses drift above the owner root when the chain top becomes a symlink after the read', () => {
    const fs = secureFixture({ driftDuringRead: '/checkout/agent-tools' });
    const reader = createSecureIdentityReadPort(createIdentitySecureFilePort(fs));

    const failure = unwrapErr(
      reader.readRegularFileNoFollow({
        chainRoot: CHECKOUT,
        ownerRoot: OWNER_ROOT,
        path: MEMBER,
      }),
    );

    expect(failure.message).toContain(`'${hostForm('/checkout/agent-tools')}' is a symlink`);
    expect(fs.openDescriptorPaths).toEqual([]);
  });

  it('refuses a descriptor bound to a different node than the validated leaf', () => {
    const fs = secureFixture();
    const attacker = fs.mintNode('file', Buffer.from('// ATTACKER BYTES\n'));
    const hijacked = secureFixtureWithHijack(fs, attacker);
    const reader = createSecureIdentityReadPort(createIdentitySecureFilePort(hijacked));

    const failure = unwrapErr(
      reader.readRegularFileNoFollow({
        chainRoot: CHECKOUT,
        ownerRoot: OWNER_ROOT,
        path: MEMBER,
      }),
    );

    expect(failure.message).toContain('is not the validated node');
    expect(hijacked.openedPaths).toEqual([MEMBER]);
    expect(hijacked.openDescriptorPaths).toEqual([]);
  });
});

function secureFixtureWithHijack(
  template: MemoryIdentityFileSystem,
  attacker: MemoryNode,
): MemoryIdentityFileSystem {
  const fs = new MemoryIdentityFileSystem({ openHijack: attacker });
  for (const [path, node] of template.nodes) {
    fs.nodes.set(path, node);
  }
  return fs;
}
