import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
  mkdirSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { ok, unwrapErr, unwrapOrThrow } from '@oaknational/result';

import { createNodeAtomicPublicationPort } from '../dist/src/typescript-estate/atomic-publication-node.js';
import {
  RAW_EXTRACTION_FILE_NAME,
  publishRawExtraction,
} from '../dist/src/typescript-estate/atomic-publication.js';

/**
 * Built-form filesystem smoke for atomic publication (handoff step 3): real
 * directories, real descriptors, zero mocks. Proves exclusive temp creation,
 * symlink-target refusal, previous-artefact preservation on failure, and
 * atomic replacement — the four properties the in-memory port tests cannot
 * carry to the shipped form.
 */

function fail(message: string): never {
  process.stderr.write(`SMOKE FAIL: ${message}\n`);
  process.exit(1);
}

function publish(root: string, value: unknown, tempToken: string) {
  return publishRawExtraction({
    invokingGitRoot: root,
    outDirectory: 'out',
    value,
    maxSerializedOutputBytes: 65536,
    tempToken,
    validate: (candidate) => ok(candidate),
    publication: createNodeAtomicPublicationPort(root),
  });
}

const root = realpathSync(mkdtempSync(path.join(tmpdir(), 'atomic-publication-smoke-')));
const outDirectory = path.join(root, 'out');
const finalPath = path.join(outDirectory, RAW_EXTRACTION_FILE_NAME);

try {
  // 1. Happy path: publish into a not-yet-existing directory; exact bytes land;
  //    no temp residue remains beside the artefact.
  const first = unwrapOrThrow(publish(root, { alpha: 1 }, 'smoke-a'));
  if (first.outputPath !== finalPath) {
    fail(`unexpected output path '${first.outputPath}'`);
  }
  const firstBytes = readFileSync(finalPath);
  if (!firstBytes.equals(Buffer.from(first.bytes))) {
    fail('published bytes differ from the returned bytes');
  }
  if (readdirSync(outDirectory).length !== 1) {
    fail(`temp residue after success: ${readdirSync(outDirectory).join(', ')}`);
  }

  // 2. Atomic replacement: a second publish over the existing artefact swaps
  //    the complete new bytes in and leaves no residue.
  const second = unwrapOrThrow(publish(root, { alpha: 2 }, 'smoke-b'));
  if (!readFileSync(finalPath).equals(Buffer.from(second.bytes))) {
    fail('replacement did not land the second publish bytes');
  }
  if (readFileSync(finalPath).equals(firstBytes)) {
    fail('replacement left the first artefact in place');
  }
  if (readdirSync(outDirectory).length !== 1) {
    fail('temp residue after replacement');
  }

  // 3. Exclusive temp creation + previous-artefact preservation: a colliding
  //    temp file makes the O_EXCL create fail; the previous artefact is
  //    untouched and the foreign temp is not swept.
  const collidingTemp = path.join(outDirectory, `.${RAW_EXTRACTION_FILE_NAME}.tmp-smoke-c`);
  writeFileSync(collidingTemp, 'foreign');
  const collision = unwrapErr(publish(root, { alpha: 3 }, 'smoke-c'));
  if (collision.code !== 'PUBLICATION_FAILED') {
    fail(`collision produced '${collision.code}', expected PUBLICATION_FAILED`);
  }
  if (!readFileSync(finalPath).equals(Buffer.from(second.bytes))) {
    fail('previous artefact was not preserved through the failed publish');
  }
  if (readFileSync(collidingTemp, 'utf8') !== 'foreign') {
    fail('foreign temp file was modified or swept');
  }
  rmSync(collidingTemp);

  // 4. Symlink-target refusal: when the final path is a symlink, publication
  //    refuses, the symlink survives, and no temp residue is left behind.
  const symlinkRoot = realpathSync(
    mkdtempSync(path.join(tmpdir(), 'atomic-publication-smoke-link-')),
  );
  const linkOut = path.join(symlinkRoot, 'out');
  mkdirSync(linkOut, { recursive: true });
  const decoy = path.join(symlinkRoot, 'decoy.json');
  writeFileSync(decoy, '{"decoy":true}');
  symlinkSync(decoy, path.join(linkOut, RAW_EXTRACTION_FILE_NAME));
  const refused = unwrapErr(publish(symlinkRoot, { alpha: 4 }, 'smoke-d'));
  if (refused.code !== 'PUBLICATION_FAILED' || !refused.message.includes('symlink')) {
    fail(`symlink target was not refused: ${refused.code} ${refused.message}`);
  }
  if (readFileSync(decoy, 'utf8') !== '{"decoy":true}') {
    fail('symlink decoy target was modified');
  }
  if (readdirSync(linkOut).length !== 1) {
    fail('temp residue after symlink refusal');
  }
  rmSync(symlinkRoot, { recursive: true, force: true });

  // 5. Containment refusal: an escaping output directory never publishes.
  const escape = unwrapErr(
    publishRawExtraction({
      invokingGitRoot: root,
      outDirectory: '../escape',
      value: { alpha: 5 },
      maxSerializedOutputBytes: 65536,
      tempToken: 'smoke-e',
      validate: (candidate) => ok(candidate),
      publication: createNodeAtomicPublicationPort(root),
    }),
  );
  if (escape.code !== 'PUBLICATION_FAILED') {
    fail(`escaping outDirectory produced '${escape.code}', expected PUBLICATION_FAILED`);
  }
  if (existsSync(path.join(path.dirname(root), 'escape'))) {
    fail('escaping output directory was created');
  }

  process.stdout.write('typescript-estate atomic-publication smoke: PASS\n');
} finally {
  rmSync(root, { recursive: true, force: true });
}
