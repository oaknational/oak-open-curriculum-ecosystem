import { readFile } from 'node:fs/promises';

import { auditCodexIdentityRecords } from './identity-audit.js';
import { required, type Options } from './cli-options.js';

/**
 * Run the report-only Codex identity audit over explicit file paths.
 *
 * @param options - Parsed collaboration-state CLI options.
 * @returns Pretty-printed JSON audit report.
 */
export async function auditIdentity(options: Options): Promise<string> {
  const report = auditCodexIdentityRecords({
    nowIso: required(options, 'now'),
    activeText: await readFile(required(options, 'active'), 'utf8'),
    closedText: await readFile(required(options, 'closed'), 'utf8'),
    threadRecordText: await readFile(required(options, 'thread-record'), 'utf8'),
    sharedLogText: await readFile(required(options, 'shared-log'), 'utf8'),
  });

  return `${JSON.stringify(report, null, 2)}\n`;
}
