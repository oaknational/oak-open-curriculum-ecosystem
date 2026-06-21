import { optional, type Options } from './cli-options.js';
import { resolveCoordinationHome } from './coordination-home.js';
import {
  formatCollaborationStateIntegrityReport,
  validateCollaborationStateIntegrity,
} from './state-integrity.js';

export async function validateComms(options: Options, cwd: string): Promise<string> {
  const report = await validateCollaborationStateIntegrity({
    repoRoot: optional(options, 'repo-root') ?? resolveCoordinationHome(cwd),
  });
  const formatted = formatCollaborationStateIntegrityReport(report);
  if (report.findings.length > 0) {
    throw new Error(formatted.trimEnd());
  }

  return formatted;
}
