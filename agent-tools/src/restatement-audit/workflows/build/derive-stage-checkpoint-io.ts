/**
 * Contained checkpoint-file reading for `derive-stage-run-data.ts`
 * (file-length discipline split): every read resolves within the repository
 * through the injectable containment seam, then parses at the boundary.
 *
 * @packageDocumentation
 */

import { readFile } from 'node:fs/promises';

import { err, ok, type Result } from '@oaknational/result';

import { resolveReadPathWithinRepo } from '../../../core/flag-path-resolve.js';
import { parseValidateResult } from '../stage-io.js';
import type { ValidateResult } from '../stage-io.js';

/** The resolved containment seam threaded through every checkpoint read. */
export interface Containment {
  readonly repoRoot: string;
  readonly realpath: ((path: string) => string) | undefined;
}

async function readJson(
  filePath: string,
  containment: Containment,
): Promise<Result<unknown, Error>> {
  // Containment before I/O (the render-ledger-cli.ts precedent, AIP-126 item 7): a
  // checkpoint flag must never read/inline JSON from outside the repository. Relative
  // flags DELIBERATELY resolve against the repo root, not process.cwd(): pnpm pins the
  // script cwd to the agent-tools workspace wherever the operator stands, so a cwd base
  // would make the committed `.agent/reports/...` checkpoint paths unreachable — the
  // repo-root base is the deterministic convention every flag-path CLI here shares.
  const safePath = resolveReadPathWithinRepo(containment.repoRoot, filePath, {
    realpath: containment.realpath,
  });
  if (!safePath.ok) {
    return safePath;
  }
  try {
    const raw = await readFile(safePath.value, 'utf8');
    return ok(JSON.parse(raw));
  } catch (cause) {
    return err(
      new Error(
        `Cannot read checkpoint ${filePath}: ${cause instanceof Error ? cause.message : String(cause)}`,
        { cause },
      ),
    );
  }
}

export async function readAnd<T>(
  filePath: string | undefined,
  label: string,
  parse: (value: unknown) => Result<T, Error>,
  containment: Containment,
): Promise<Result<T, Error>> {
  if (filePath === undefined) {
    return err(new Error(`Missing required checkpoint flag for ${label}.`));
  }
  const json = await readJson(filePath, containment);
  return json.ok ? parse(json.value) : json;
}

export async function readValidateResults(
  paths: readonly string[],
  containment: Containment,
): Promise<Result<ValidateResult[], Error>> {
  const results: ValidateResult[] = [];
  for (const filePath of paths) {
    const parsed = await readAnd(filePath, '--validate-result', parseValidateResult, containment);
    if (!parsed.ok) {
      return parsed;
    }
    results.push(parsed.value);
  }
  return ok(results);
}
