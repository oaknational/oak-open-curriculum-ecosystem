/**
 * Recompute-and-compare parity for the committed derived artefacts
 * (`facts.json`, `matrix.md`): `check` recomputes both from the live
 * tree and fails on any drift, so the evidence bank can never go stale
 * while the gate stays green (validators-must-recompute). Pure
 * comparisons only; IO stays with the command.
 */
import { err, ok, type Result } from '@oaknational/result';

import { getJsonValue, isJsonObject, parseJsonTextResult } from '../core/json.js';
import { renderFactsArtefact } from './facts-artefact.js';
import type { SubjectFacts } from './facts.js';

const MAX_NAMED_DRIFTS = 10;

function factsByDir(entries: readonly SubjectFacts[]): Map<string, string> {
  return new Map(entries.map((entry) => [entry.dirPath, JSON.stringify(entry)]));
}

function parseCommittedFacts(raw: string): Result<Map<string, string>, string> {
  const parsed = parseJsonTextResult(raw, 'facts.json');
  if (!parsed.ok) {
    return err(parsed.error.message);
  }
  if (!isJsonObject(parsed.value)) {
    return err('facts.json: not an object');
  }
  const facts = getJsonValue(parsed.value, 'facts');
  if (!Array.isArray(facts)) {
    return err('facts.json: no facts[] array');
  }
  const byDir = new Map<string, string>();
  for (const entry of Array.from(facts)) {
    if (!isJsonObject(entry) || typeof getJsonValue(entry, 'dirPath') !== 'string') {
      return err('facts.json: entry without a dirPath');
    }
    const dirPath = String(getJsonValue(entry, 'dirPath'));
    if (byDir.has(dirPath)) {
      return err(`facts.json: duplicate entry for subject ${dirPath}`);
    }
    byDir.set(dirPath, JSON.stringify(entry));
  }
  return ok(byDir);
}

/**
 * Compare live facts against the committed artefact. The verdict is the
 * byte comparison of the canonical rendering — envelope fields, entry
 * order, and formatting all count; the per-entry diff only decorates a
 * byte mismatch with the drifted subjects' names, so a differing
 * artefact always yields at least one problem.
 */
export function diffFactsParity(live: readonly SubjectFacts[], committedRaw: string): string[] {
  if (renderFactsArtefact(live) === committedRaw) {
    return [];
  }
  const drifted = namedEntryDrifts(live, committedRaw);
  if (drifted.length === 0) {
    return [
      'facts.json: artefact bytes differ from the recomputation (envelope or entry order) — run `facts` to regenerate',
    ];
  }
  return drifted;
}

function namedEntryDrifts(live: readonly SubjectFacts[], committedRaw: string): string[] {
  const committed = parseCommittedFacts(committedRaw);
  if (!committed.ok) {
    return [committed.error];
  }
  const liveByDir = factsByDir(live);
  const drifted: string[] = [];
  for (const [dirPath, liveJson] of liveByDir) {
    const committedJson = committed.value.get(dirPath);
    if (committedJson === undefined) {
      drifted.push(`facts.json: no entry for subject ${dirPath} — run \`facts\` to regenerate`);
    } else if (committedJson !== liveJson) {
      drifted.push(`facts.json: entry for ${dirPath} is stale — run \`facts\` to regenerate`);
    }
  }
  for (const dirPath of committed.value.keys()) {
    if (!liveByDir.has(dirPath)) {
      drifted.push(
        `facts.json: entry for ${dirPath} matches no derived subject — run \`facts\` to regenerate`,
      );
    }
  }
  if (drifted.length > MAX_NAMED_DRIFTS) {
    return [
      ...drifted.slice(0, MAX_NAMED_DRIFTS),
      `facts.json: …and ${String(drifted.length - MAX_NAMED_DRIFTS)} further drifted entries`,
    ];
  }
  return drifted;
}

/** Compare the recomputed matrix rendering against the committed matrix.md. */
export function diffMatrixParity(rendered: string, committedRaw: string): string[] {
  if (rendered === committedRaw) {
    return [];
  }
  return ['matrix.md: committed rendering differs from the recomputed one — run `render`'];
}
