import { createHash } from 'node:crypto';
import { chmod, lstat, mkdir, readFile, writeFile } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { type AdapterDeployment, type RuntimeExecutablePins } from './activation.js';
import { type FingerprintExecutables } from './fingerprint-io.js';
import { captureExecutablePin, verifyExecutablePin } from './runtime-executable-pin-io.js';
import { type RuntimeIntegrityError } from './runtime-integrity-types.js';

const MAX_ADAPTER_BUNDLE_BYTES = 4 * 1_024 * 1_024;
const ADAPTER_BUNDLE_NAME = 'codex-hook-review-hook.bundle.mjs';

export type { RuntimeIntegrityError } from './runtime-integrity-types.js';

export async function sha256AdapterBundle(
  projectRoot: string,
): Promise<Result<string, RuntimeIntegrityError>> {
  const path = join(projectRoot, 'agent-tools', 'dist', ADAPTER_BUNDLE_NAME);
  const bundle = await readBoundedBundle(path);
  return bundle.ok ? ok(sha256(bundle.value)) : bundle;
}

export async function deployAdapterBundle(input: {
  readonly projectRoot: string;
  readonly userHome: string;
  readonly expectedSha256: string;
}): Promise<Result<AdapterDeployment, RuntimeIntegrityError>> {
  const source = join(input.projectRoot, 'agent-tools', 'dist', ADAPTER_BUNDLE_NAME);
  const content = await readBoundedBundle(source);
  if (!content.ok) {
    return content;
  }
  if (sha256(content.value) !== input.expectedSha256) {
    return err({ kind: 'bundle-changed' });
  }
  const { baseDirectory, deploymentsDirectory, directory, entryPath } = deploymentLayout(input);
  const directories = await ensurePrivateDirectories([
    baseDirectory,
    deploymentsDirectory,
    directory,
  ]);
  if (!directories.ok) {
    return directories;
  }
  const written = await writeDeploymentEntry(entryPath, content.value, input.expectedSha256);
  if (!written.ok) {
    return written;
  }
  const permission = await setDeploymentEntryPermission(entryPath);
  return permission.ok ? ok({ entryPath, sha256: input.expectedSha256 }) : permission;
}

function deploymentLayout(input: { readonly userHome: string; readonly expectedSha256: string }): {
  readonly baseDirectory: string;
  readonly deploymentsDirectory: string;
  readonly directory: string;
  readonly entryPath: string;
} {
  const baseDirectory = join(input.userHome, '.codex-hook-review');
  const deploymentsDirectory = join(baseDirectory, 'deployments');
  const directory = join(deploymentsDirectory, input.expectedSha256);
  return { baseDirectory, deploymentsDirectory, directory, entryPath: join(directory, 'hook.mjs') };
}

async function writeDeploymentEntry(
  entryPath: string,
  content: Buffer,
  expectedSha256: string,
): Promise<Result<void, RuntimeIntegrityError>> {
  try {
    await writeFile(entryPath, content, { flag: 'wx', mode: 0o500 });
    return ok(undefined);
  } catch (error: unknown) {
    if (!isAlreadyExists(error)) {
      return err({ kind: 'deployment-write-failed', path: entryPath });
    }
    const existing = await matchesBundle(entryPath, expectedSha256);
    if (!existing.ok) {
      return existing;
    }
    if (!existing.value) {
      return err({ kind: 'deployment-conflict', path: entryPath });
    }
    return ok(undefined);
  }
}

async function setDeploymentEntryPermission(
  entryPath: string,
): Promise<Result<void, RuntimeIntegrityError>> {
  try {
    await chmod(entryPath, 0o500);
    return ok(undefined);
  } catch {
    return err({ kind: 'deployment-permission-failed', path: entryPath });
  }
}

async function ensurePrivateDirectories(
  paths: readonly string[],
): Promise<Result<void, RuntimeIntegrityError>> {
  for (const path of paths) {
    let details: Awaited<ReturnType<typeof lstat>>;
    try {
      await mkdir(path, { recursive: true, mode: 0o700 });
      details = await lstat(path);
    } catch {
      return err({ kind: 'deployment-directory-failed', path });
    }
    if (!details.isDirectory() || details.isSymbolicLink()) {
      return err({ kind: 'deployment-directory-invalid', path });
    }
    try {
      await chmod(path, 0o700);
    } catch {
      return err({ kind: 'deployment-permission-failed', path });
    }
  }
  return ok(undefined);
}

export async function verifyAdapterDeployment(
  deployment: AdapterDeployment,
): Promise<Result<boolean, RuntimeIntegrityError>> {
  if (!isAbsolute(deployment.entryPath)) {
    return ok(false);
  }
  return matchesBundle(deployment.entryPath, deployment.sha256);
}

export async function captureRuntimeExecutablePins(
  executables: FingerprintExecutables,
): Promise<Result<RuntimeExecutablePins, RuntimeIntegrityError>> {
  const [node, claude, codex, gitleaks] = await Promise.all([
    captureExecutablePin(executables.node),
    captureExecutablePin(executables.claude),
    captureExecutablePin(executables.codex),
    captureExecutablePin(executables.gitleaks),
  ]);
  if (!node.ok) {
    return node;
  }
  if (!claude.ok) {
    return claude;
  }
  if (!codex.ok) {
    return codex;
  }
  if (!gitleaks.ok) {
    return gitleaks;
  }
  return ok({
    node: node.value,
    claude: claude.value,
    codex: codex.value,
    gitleaks: gitleaks.value,
  });
}

export async function verifyRuntimeExecutablePins(
  pins: RuntimeExecutablePins,
): Promise<Result<boolean, RuntimeIntegrityError>> {
  const results = await Promise.all([
    verifyExecutablePin(pins.node),
    verifyExecutablePin(pins.claude),
    verifyExecutablePin(pins.codex),
    verifyExecutablePin(pins.gitleaks),
  ]);
  const failure = results.find((result) => !result.ok);
  if (failure !== undefined && !failure.ok) {
    return failure;
  }
  return ok(results.every((result) => result.ok && result.value));
}

async function readBoundedBundle(path: string): Promise<Result<Buffer, RuntimeIntegrityError>> {
  let details: Awaited<ReturnType<typeof lstat>>;
  try {
    details = await lstat(path);
  } catch {
    return err({ kind: 'bundle-read-failed', path });
  }
  if (!details.isFile() || details.isSymbolicLink() || details.size > MAX_ADAPTER_BUNDLE_BYTES) {
    return err({ kind: 'bundle-invalid', path });
  }
  let content: Buffer;
  try {
    content = await readFile(path);
  } catch {
    return err({ kind: 'bundle-read-failed', path });
  }
  if (content.byteLength > MAX_ADAPTER_BUNDLE_BYTES) {
    return err({ kind: 'bundle-invalid', path });
  }
  return ok(content);
}

async function matchesBundle(
  path: string,
  expectedSha256: string,
): Promise<Result<boolean, RuntimeIntegrityError>> {
  const bundle = await readBoundedBundle(path);
  return bundle.ok ? ok(sha256(bundle.value) === expectedSha256) : bundle;
}

function sha256(content: Buffer): string {
  return createHash('sha256').update(content).digest('hex');
}

function isAlreadyExists(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'EEXIST';
}
