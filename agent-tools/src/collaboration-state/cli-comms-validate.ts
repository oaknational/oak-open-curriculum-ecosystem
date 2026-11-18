import { err, unwrapOrThrow } from '@oaknational/result';

import { resolveCoordinationHomeForOptions } from './cli-coordination-home.js';
import { type Options } from './cli-options.js';
import { type CliRuntime } from './cli-runtime.js';
import {
  formatCollaborationStateIntegrityReport,
  validateCollaborationStateIntegrity,
} from './state-integrity.js';

export async function validateComms(
  options: Options,
  _env: unknown,
  runtime: CliRuntime,
): Promise<string> {
  // `comms validate` runs against the coordination home itself, so the
  // home doubles as the checkout root for the tracked surfaces.
  const home = resolveCoordinationHomeForOptions(options, runtime);
  const report = await validateCollaborationStateIntegrity({
    repoRoot: home,
    coordinationHome: home,
  });
  const formatted = formatCollaborationStateIntegrityReport(report);
  if (report.findings.length > 0) {
    return unwrapOrThrow<never>(err(new Error(formatted.trimEnd())));
  }

  return formatted;
}
