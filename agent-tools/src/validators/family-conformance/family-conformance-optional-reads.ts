import { err, ok, type Result } from '@oaknational/result';

import { isJsonObject } from '../../core/json.js';

/**
 * The validator's optional reads as pure readings: which failure of a read or
 * presence check is the file's absence and which is an input the validator
 * could not read, and how root-file presence readings collect into the set
 * the formatter check consumes.
 *
 * @packageDocumentation
 */

/** One root file's presence reading: present, absent, or unreadable. */
export type RootFilePresence = Result<'absent' | 'present', Error>;

/**
 * Classifies a failed optional read or presence check. Only `ENOENT` is the
 * file's absence (a hook on one side only, a CI workflow not yet written, a
 * forbidden formatter file that should be missing); any other failure (a
 * permission refusal, an I/O error) is an input the validator could not read
 * and surfaces as such, since reading it as absence would report a missing
 * file or an ordinary drift where the validator's documented input-error path
 * is owed.
 *
 * @param name - The repository-relative path that was read or checked.
 * @param failure - What the read or check threw.
 * @returns `absent` for `ENOENT`; otherwise the failure as the validator's input error.
 */
export function classifyOptionalReadFailure(
  name: string,
  failure: unknown,
): Result<'absent', Error> {
  if (isJsonObject(failure) && failure.code === 'ENOENT') {
    return ok('absent');
  }
  const reason = failure instanceof Error ? failure.message : String(failure);
  return err(new Error(`${name} could not be read: ${reason}`));
}

/**
 * Collects the present root files from each name's reading, in the names'
 * order; the first unreadable file ends the collection as the validator's
 * input error.
 *
 * @param names - The root file names, in the order their readings were taken.
 * @param readings - One presence reading per name.
 * @returns The names read as present, or the first reading that failed.
 */
export function collectPresentRootFiles(
  names: readonly string[],
  readings: readonly RootFilePresence[],
): Result<ReadonlySet<string>, Error> {
  const present = new Set<string>();
  for (const [index, reading] of readings.entries()) {
    if (!reading.ok) {
      return reading;
    }
    const name = names[index];
    if (reading.value === 'present' && name !== undefined) {
      present.add(name);
    }
  }
  return ok(present);
}
