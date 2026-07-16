/** Pure eligibility checks for known Claude Edit and Write hook fields. @packageDocumentation */
import { isAbsolute } from 'node:path';

import { nonBlankString } from '../core/json-narrowing.js';
import { type HookChange } from './types.js';

/** Whether a successful tool path is absolute and raw-parent-free. */
function isSafeToolFilePath(filePath: string): boolean {
  return isAbsolute(filePath) && !filePath.split(/[/\\]/u).some((segment) => segment === '..');
}

/** Narrow an external tool path to the absolute, raw-parent-free form accepted by the adapter. */
export function safeToolFilePath(value: unknown): string | undefined {
  const filePath = nonBlankString(value);
  return filePath !== undefined && isSafeToolFilePath(filePath) ? filePath : undefined;
}

/** Whether any source-bearing field contains a NUL byte. */
export function containsNullByte(...values: readonly string[]): boolean {
  return values.some((value) => value.includes('\u0000'));
}

/** Whether a response could be a supported success string for the named tool. */
export function isPotentialSuccessResponse(
  response: unknown,
  tool: HookChange['tool'],
): response is string {
  if (typeof response !== 'string') {
    return false;
  }
  if (tool === 'Write') {
    return (
      response.startsWith('File created successfully at: ') ||
      (response.startsWith('The file ') && response.includes(' has been updated successfully.'))
    );
  }
  return response.startsWith('The file ') && response.includes(' has been updated successfully.');
}

/** Whether a Write response names the exact source path in a supported success variant. */
export function isWriteSuccess(response: string, filePath: string): boolean {
  const created = `File created successfully at: ${filePath}`;
  const updated = `The file ${filePath} has been updated successfully.`;
  return (
    response === created ||
    response.startsWith(`${created}\n`) ||
    response === updated ||
    response.startsWith(`${updated}\n`)
  );
}
