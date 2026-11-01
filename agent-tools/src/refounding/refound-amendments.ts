import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';
import {
  compareByCodeUnit,
  denominatorFileSchema,
  freezeIdentityEntrySchema,
  parseJsonDocument,
} from './refounding-artefacts.js';

/**
 * The denominator-amendment artefact (`amendments/amendment-<n>.json`,
 * F1 §7): schema, strict parse, and the sequenced read every consumer
 * shares.
 *
 * @remarks
 * An amendment appends files to the denominator — an arrival routed to
 * freeze, or a sweep promotion. Each carries its file rows PLUS the per-file
 * identity proof in the SAME shape the freeze writes
 * (`proofs/freeze-identity.v1.json` entries), so a routed file is held to
 * the identical byte-identity contract as the S0 set. The effective
 * denominator every downstream check divides by is `v1 + all amendments`
 * (`mergeDenominator` in `refound-verify-freeze-model.ts` owns the
 * identity-proof refusals).
 *
 * The amendment WRITER is deliberately not built in tranche 3: routing an
 * arrival is R1's G3-gated mechanics (no `--amend` mode exists); this module
 * is the closed artefact contract the verifier, `refound-merge-recheck`,
 * and `refound-tile` read against (`consolidate-at-second-consumer`).
 *
 * @packageDocumentation
 */

/** Denominator-amendments directory relative to the artefact home (F1 §3, §7). */
const AMENDMENTS_SEGMENT = 'amendments';

const amendmentBasenamePattern = /^amendment-([1-9]\d*)\.json$/;

/**
 * One amendment document: appended denominator rows plus their identity
 * proofs. Closed shape (`strict-validation-at-boundary`); both arrays
 * non-empty — an amendment that appends nothing is not an amendment.
 */
const denominatorAmendmentSchema = z.strictObject({
  version: z.literal(1),
  files: z.array(denominatorFileSchema).min(1),
  identityProof: z.array(freezeIdentityEntrySchema).min(1),
});
export type DenominatorAmendment = z.infer<typeof denominatorAmendmentSchema>;

/** Parse an unknown value as a {@link DenominatorAmendment} at the read boundary. */
export const parseDenominatorAmendment = (value: unknown): Result<DenominatorAmendment, Error> =>
  parseWithSchema({ label: 'denominator amendment', schema: denominatorAmendmentSchema, value });

/** One parsed amendment paired with its filename sequence number. */
export interface NumberedAmendment {
  readonly sequence: number;
  readonly amendment: DenominatorAmendment;
}

/** List the amendment-directory entries; an absent directory is an empty list. */
async function listAmendmentEntries(amendmentsDirAbs: string): Promise<Result<string[], Error>> {
  try {
    return ok(await readdir(amendmentsDirAbs));
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return ok([]);
    }
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`cannot read amendments directory '${amendmentsDirAbs}': ${message}`));
  }
}

/** Extract each entry's sequence number, refusing strays in the artefact dir. */
function sequenceAmendmentEntries(
  entries: readonly string[],
): Result<readonly { name: string; sequence: number }[], Error> {
  const sequenced: { name: string; sequence: number }[] = [];
  for (const name of [...entries].sort(compareByCodeUnit)) {
    const match = amendmentBasenamePattern.exec(name);
    if (match?.[1] === undefined) {
      return err(
        new Error(
          `unexpected file '${name}' inside ${AMENDMENTS_SEGMENT}/ — only ` +
            `amendment-<n>.json documents may live there; refusing an ambiguous artefact home`,
        ),
      );
    }
    sequenced.push({ name, sequence: Number(match[1]) });
  }
  sequenced.sort((a, b) => a.sequence - b.sequence);
  return ok(sequenced);
}

/** Read and strictly parse one amendment document, naming it on failure. */
async function readAmendmentDocument(
  amendmentsDirAbs: string,
  name: string,
): Promise<Result<DenominatorAmendment, Error>> {
  let text: string;
  try {
    text = await readFile(path.join(amendmentsDirAbs, name), 'utf8');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`cannot read amendment '${name}': ${message}`));
  }
  const json = parseJsonDocument(name, text);
  if (isErr(json)) {
    return json;
  }
  const parsed = parseDenominatorAmendment(json.value);
  if (isErr(parsed)) {
    return err(new Error(`${name}: ${parsed.error.message}`));
  }
  return parsed;
}

/**
 * Read and strictly parse every `amendments/amendment-<n>.json` under the
 * artefact home, in sequence order (F1 §7: the denominator is versioned and
 * append-only). Refusals: a stray non-amendment file in the directory, a gap
 * in the numbering (a missing middle amendment is exactly the silent loss
 * this instrument exists to catch), and any unreadable, unparseable, or
 * schema-invalid document — each named by its file.
 */
export async function readAmendments(
  outDirAbs: string,
): Promise<Result<readonly NumberedAmendment[], Error>> {
  const amendmentsDirAbs = path.join(outDirAbs, AMENDMENTS_SEGMENT);
  const entries = await listAmendmentEntries(amendmentsDirAbs);
  if (isErr(entries)) {
    return entries;
  }
  const sequenced = sequenceAmendmentEntries(entries.value);
  if (isErr(sequenced)) {
    return sequenced;
  }
  const amendments: NumberedAmendment[] = [];
  for (const [index, entry] of sequenced.value.entries()) {
    if (entry.sequence !== index + 1) {
      return err(
        new Error(
          `amendment sequence gap: expected amendment-${String(index + 1)}.json, found ` +
            `'${entry.name}' — the numbering is append-only and contiguous; a missing ` +
            'amendment must be understood, never skipped',
        ),
      );
    }
    const document = await readAmendmentDocument(amendmentsDirAbs, entry.name);
    if (isErr(document)) {
      return document;
    }
    amendments.push({ sequence: entry.sequence, amendment: document.value });
  }
  return ok(amendments);
}
