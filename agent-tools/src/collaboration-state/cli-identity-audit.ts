import { unwrapOrThrow } from '@oaknational/result';

import { auditCodexIdentityRecords } from './identity-audit.js';
import { commitQueueDirForActivePath } from './commit-queue-store.js';
import { required, type Options } from './cli-options.js';
import { cliIo, type CliRuntime } from './cli-runtime.js';

/**
 * Run the report-only Codex identity audit over explicit file paths and the
 * canonical comms event directory. Communication history is read from the
 * event stream, never from the rendered shared log (a generated read model).
 * All reads go through the injected runtime IO seam so the CLI boundary
 * stays hermetically testable.
 *
 * @param options - Parsed collaboration-state CLI options.
 * @param runtime - CLI runtime carrying the IO seam.
 * @returns Pretty-printed JSON audit report.
 */
export async function auditIdentity(options: Options, runtime: CliRuntime): Promise<string> {
  const io = cliIo(runtime);
  const nowIso = required(options, 'now');
  const activePath = required(options, 'active');
  // The audit parses the claims file's raw text below; read it through the
  // migrating reader first so a legacy flat-queue file migrates on this
  // first contact like every other path, instead of meeting the version pin.
  unwrapOrThrow(await io.readActiveClaimsFile(activePath));
  const report = auditCodexIdentityRecords({
    nowIso,
    activeText: await io.readTextFile(activePath),
    closedText: await io.readTextFile(required(options, 'closed')),
    threadRecordText: await io.readTextFile(required(options, 'thread-record')),
    commsEvents: await io.readCommsEvents(required(options, 'comms-dir')),
    commitQueue: await io.readCommitQueueEntries({
      queueDir: commitQueueDirForActivePath(activePath),
      nowIso,
    }),
  });

  return `${JSON.stringify(report, null, 2)}\n`;
}
