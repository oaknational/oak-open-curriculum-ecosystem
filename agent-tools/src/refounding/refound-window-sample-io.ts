import { lstatSync } from 'node:fs';
import { readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { err, flatMap, isErr, ok, type Result } from '@oaknational/result';

import { toGitPath } from '../core/git-relative-path.js';
import { parseFreezeRule, type FreezeRule } from './freeze-rule-schema.js';
import { parseSweepHit, type SweepHit } from './refound-sweep-model.js';
import {
  expectationsFromEvidence,
  parseWindowSampleEvidence,
  sweepHitsDigestFromEvidence,
  WINDOW_SAMPLE_SEGMENT,
  type WindowSampleExpectations,
  type WindowSampleManifest,
} from './refound-window-sample-schema.js';
import { type ByteSource } from './refound-window-sample-universe.js';
import {
  createWriteDirSegments,
  recheckOutDirContainment,
  type ManifestWriteTarget,
} from './refound-window-sample-write-guard.js';
import { parseJsonDocument, renderJsonArtefact, sha256Hex } from './refounding-artefacts.js';

/**
 * The leaf IO refusals of `refound-window-sample`, consumed by the
 * orchestration in `refound-window-sample-helpers.ts`: every read binds its
 * input to the S1 evidence (base sha, counts, exact artefact bytes) and the
 * write is atomic — nothing is ever written on a failed binding.
 *
 * @packageDocumentation
 */

/** Read one UTF-8 text file as a `Result`, naming the boundary on failure. */
async function readTextFile(label: string, absPath: string): Promise<Result<string, Error>> {
  try {
    return ok(await readFile(absPath, 'utf8'));
  } catch (cause: unknown) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return err(new Error(`cannot read ${label} at '${absPath}': ${message}`));
  }
}

/**
 * Read `sweep/sweep-hits.v1.jsonl`, verify its exact bytes against the
 * evidence-recorded SHA-256 (a same-count queue with hits moved elsewhere
 * would pass every arithmetic check yet change the sealed sample), then
 * strictly parse every row.
 */
export async function readSweepHits(
  hitsAbsPath: string,
  expectedSha256: string,
): Promise<Result<readonly SweepHit[], Error>> {
  let bytes: Buffer;
  try {
    bytes = await readFile(hitsAbsPath);
  } catch (cause: unknown) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return err(new Error(`cannot read sweep hits at '${hitsAbsPath}': ${message}`));
  }
  const actualSha256 = sha256Hex(bytes);
  if (actualSha256 !== expectedSha256) {
    return err(
      new Error(
        `sweep hits at '${hitsAbsPath}' are not the evidence-recorded queue: sha256 ` +
          `${actualSha256} disagrees with the recorded ${expectedSha256}; halting with ` +
          'nothing written',
      ),
    );
  }
  const rows: SweepHit[] = [];
  const rawLines = bytes.toString('utf8').split('\n');
  // Preserve interior blank rows (each a strict parse error at its TRUE line
  // number); strip only a single terminal empty from an optional final LF.
  const lines = rawLines.at(-1) === '' ? rawLines.slice(0, -1) : rawLines;
  for (const [index, line] of lines.entries()) {
    const label = `sweep hit line ${String(index + 1)}`;
    const row = flatMap(parseJsonDocument(label, line), parseSweepHit);
    if (isErr(row)) {
      return err(new Error(`${label}: ${row.error.message}`));
    }
    rows.push(row.value);
  }
  return ok(rows);
}

/** What the run consumes from the evidence: the counts and the hits digest. */
export interface EvidenceBindings {
  readonly expectations: WindowSampleExpectations;
  readonly sweepHitsSha256: string;
}

/**
 * Read the S1 evidence, verify the run base binds to it (the counts are
 * meaningless against any other commit), and extract the expectations plus
 * the recorded digest that binds the hits queue.
 */
export async function readEvidenceBindings(
  evidenceAbsPath: string,
  baseSha: string,
): Promise<Result<EvidenceBindings, Error>> {
  const text = await readTextFile('evidence', evidenceAbsPath);
  if (isErr(text)) {
    return text;
  }
  const evidence = flatMap(
    parseJsonDocument('window-sample evidence', text.value),
    parseWindowSampleEvidence,
  );
  if (isErr(evidence)) {
    return evidence;
  }
  if (evidence.value.runBaseSha !== baseSha) {
    return err(
      new Error(
        `--base ${baseSha} disagrees with the evidence's runBaseSha ` +
          `${evidence.value.runBaseSha} — the expectations bind to their own base; halting`,
      ),
    );
  }
  const sweepHitsSha256 = sweepHitsDigestFromEvidence(evidence.value);
  if (isErr(sweepHitsSha256)) {
    return sweepHitsSha256;
  }
  return ok({
    expectations: expectationsFromEvidence(evidence.value),
    sweepHitsSha256: sweepHitsSha256.value,
  });
}

/** Reads a file's raw bytes; the default binds `node:fs/promises` `readFile`. */
export type ReadFileBytes = (absPath: string) => Promise<Buffer>;

/**
 * Read the freeze rule, refuse a draft, and bind the live bytes to the rule at
 * the pinned base — a same-count rule swap can reshape the sealed sample, so
 * exact bytes or refuse. The rule file is read EXACTLY ONCE (`readRuleBytes`,
 * injectable for the single-read proof): the parsed rule and the byte
 * comparison both derive from that one buffer, so no swap between two reads can
 * pass the comparison against content never parsed (check-time == use-time).
 */
export async function readBoundRule(
  repoRoot: string,
  ruleAbsPath: string,
  source: ByteSource,
  readRuleBytes: ReadFileBytes = readFile,
): Promise<Result<FreezeRule, Error>> {
  let liveBytes: Buffer;
  try {
    liveBytes = await readRuleBytes(ruleAbsPath);
  } catch (cause: unknown) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return err(new Error(`cannot read freeze rule at '${ruleAbsPath}': ${message}`));
  }
  const ruleJson = parseJsonDocument('freeze rule', liveBytes.toString('utf8'));
  const rule = flatMap(ruleJson, parseFreezeRule);
  if (isErr(rule)) {
    return rule;
  }
  if (rule.value.ratifiedBy === null) {
    return err(
      new Error(
        'freeze rule is unratified; a draft-rule universe would disagree with the ratified ' +
          'sweep it samples',
      ),
    );
  }
  const binding = verifyRuleBinding(repoRoot, ruleAbsPath, liveBytes, source);
  if (isErr(binding)) {
    return binding;
  }
  return rule;
}

/** Bind the ALREADY-READ live bytes to the rule at the pinned base (no re-read). */
function verifyRuleBinding(
  repoRoot: string,
  ruleAbsPath: string,
  liveBytes: Buffer,
  source: ByteSource,
): Result<undefined, Error> {
  const ruleRelPath = toGitPath(path.relative(repoRoot, ruleAbsPath));
  const baseBytes = source.readBytes(ruleRelPath);
  if (isErr(baseBytes)) {
    return err(
      new Error(
        `freeze rule '${ruleRelPath}' is unreadable at the pinned base — the rule cannot ` +
          `be bound to the evidence tree: ${baseBytes.error.message}`,
      ),
    );
  }
  if (!liveBytes.equals(Buffer.from(baseBytes.value))) {
    return err(
      new Error(
        `freeze rule '${ruleRelPath}' differs from the rule at the pinned base — a rule swap ` +
          'can reshape the sealed sample while passing every count; halting with nothing written',
      ),
    );
  }
  return ok(undefined);
}

/** Writes the rendered artefact to the temp path; injectable for a hermetic failure proof. */
export type WriteArtefact = (tempAbsPath: string, contents: string) => Promise<void>;

/**
 * Write the manifest artefact. The write-time TOCTOU guard runs first:
 * {@link recheckOutDirContainment} re-canonicalises the pre-scan anchor, then
 * {@link createWriteDirSegments} creates each segment below it one at a time,
 * proving each a real directory as it is made. The manifest-path symlink probe
 * and the exclusive temp-write + atomic rename all run INSIDE the error
 * boundary, so any throwing probe or write returns `Err`, never a rejection.
 */
export async function writeManifest(
  target: ManifestWriteTarget,
  manifest: WindowSampleManifest,
  writeArtefact: WriteArtefact = (tempAbsPath, contents) =>
    writeFile(tempAbsPath, contents, { encoding: 'utf8', flag: 'wx' }),
): Promise<Result<WindowSampleManifest, Error>> {
  const contained = recheckOutDirContainment(target);
  if (isErr(contained)) {
    return contained;
  }
  const manifestAbsPath = path.join(target.outDirAbs, WINDOW_SAMPLE_SEGMENT);
  const writeDirAbs = path.dirname(manifestAbsPath);
  const materialised = createWriteDirSegments(target, writeDirAbs);
  if (isErr(materialised)) {
    return materialised;
  }
  const tempAbsPath = `${manifestAbsPath}.tmp-${String(process.pid)}`;
  try {
    const manifestStat = lstatSync(manifestAbsPath, { throwIfNoEntry: false });
    if (manifestStat?.isSymbolicLink() === true) {
      return err(
        new Error(
          `manifest path '${manifestAbsPath}' is a symlink — a write would follow it to an ` +
            'unverifiable destination; refusing',
        ),
      );
    }
    await writeArtefact(tempAbsPath, renderJsonArtefact(manifest));
    await rename(tempAbsPath, manifestAbsPath);
    return ok(manifest);
  } catch (cause: unknown) {
    await rm(tempAbsPath, { force: true }).catch(() => undefined);
    const message = cause instanceof Error ? cause.message : String(cause);
    return err(new Error(`window-sample artefact write failed: ${message}`));
  }
}
