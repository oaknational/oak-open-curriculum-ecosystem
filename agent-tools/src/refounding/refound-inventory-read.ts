import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import {
  INVENTORY_BASENAME,
  parseInventoryRecord,
  type InventoryRecord,
} from './refound-inventory-model.js';

/**
 * The strict read boundary for the committed `inventory.v1.jsonl` artefact,
 * shared by every downstream consumer that divides through the inventory
 * (`consolidate-at-second-consumer`): each non-empty line parses through the
 * closed record schema, and any malformed line refuses citing the artefact
 * file and line.
 *
 * @packageDocumentation
 */

/** Parse one non-empty inventory JSONL line through the strict boundary. */
function parseInventoryLine(line: string, lineNumber: number): Result<InventoryRecord, Error> {
  let json: unknown;
  try {
    json = JSON.parse(line);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(
      new Error(`${INVENTORY_BASENAME} line ${String(lineNumber)} is not valid JSON: ${message}`),
    );
  }
  const record = parseInventoryRecord(json);
  if (isErr(record)) {
    return err(
      new Error(`${INVENTORY_BASENAME} line ${String(lineNumber)}: ${record.error.message}`),
    );
  }
  return record;
}

/** Read and strictly parse the committed inventory JSONL as a `Result`. */
export async function readInventoryRecords(
  outDirAbs: string,
): Promise<Result<readonly InventoryRecord[], Error>> {
  const inventoryAbsPath = path.join(outDirAbs, INVENTORY_BASENAME);
  let text: string;
  try {
    text = await readFile(inventoryAbsPath, 'utf8');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`cannot read ${INVENTORY_BASENAME} at '${inventoryAbsPath}': ${message}`));
  }
  const records: InventoryRecord[] = [];
  const lines = text.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    if (line === '') {
      continue;
    }
    const record = parseInventoryLine(line, index + 1);
    if (isErr(record)) {
      return record;
    }
    records.push(record.value);
  }
  return ok(records);
}
