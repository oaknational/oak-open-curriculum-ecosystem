import { err, ok, type Result } from '@oaknational/result';

import { printable } from '../pr-watch/printable.js';
import { readDefaultBranch } from './github-repository.js';
import { restProbe, unexpectedStatus } from './github-rest.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import type { Outcome } from './pull-request-github.js';
import type { BotRepository } from './resolve-identity.js';

/**
 * The `dispatch-workflow` verb of `merge-bot pull-request`: a workflow
 * dispatched on the repository's default branch, as the bot, so the
 * upstream carrier (the cross-fork-integration skill's first step) runs
 * under the bot's identity. The token this verb runs on is minted at the
 * `workflow-dispatch` scope, not the conversation verbs' `pull-request-work`
 * (`token-scopes.ts` carries why the two stay apart).
 *
 * The file name travels in a URL path, so only a plain `*.yml` or `*.yaml`
 * basename is admitted, and only {@link workflowFile} produces the value the
 * dispatch takes: a raw string cannot reach the path.
 */

/** A workflow file name the shape check admitted; made only by {@link workflowFile}. */
export interface WorkflowFile {
  readonly fileName: string;
}

/** A basename in ASCII letters, digits and `. _ -`, not dot-led, ending `.yml` or `.yaml`. */
const WORKFLOW_FILE = /^[A-Za-z0-9_-][A-Za-z0-9._-]*\.ya?ml$/;

/** Admit a workflow file name, or say why it is refused. */
export function workflowFile(value: string): Result<WorkflowFile, Error> {
  return WORKFLOW_FILE.test(value)
    ? ok({ fileName: value })
    : err(
        new Error(
          `--workflow "${printable(value)}" is not a plain workflow file name: a *.yml or *.yaml basename in ASCII letters, digits and . _ -, no slash`,
        ),
      );
}

/**
 * Dispatch the workflow on the default branch. GitHub answers a dispatch
 * with 204 and no body; any other status is a failure naming it.
 */
export async function dispatchWorkflow(
  fetchImpl: GithubApiFetch,
  token: string,
  repo: BotRepository,
  workflow: WorkflowFile,
): Promise<Result<Outcome<'dispatched'>, Error>> {
  const ref = await readDefaultBranch(fetchImpl, token, repo);
  if (!ref.ok) {
    return ref;
  }
  const label = 'POST /repos/{owner}/{repo}/actions/workflows/{file}/dispatches';
  const probe = await restProbe(fetchImpl, token, {
    method: 'POST',
    path: `/repos/${repo.owner}/${repo.repoName}/actions/workflows/${workflow.fileName}/dispatches`,
    body: { ref: ref.value },
    label,
  });
  if (!probe.ok) {
    return probe;
  }
  return probe.value.status === 204
    ? ok({ kind: 'dispatched', workflow: workflow.fileName, ref: ref.value })
    : err(unexpectedStatus(label, probe.value.status, probe.value.detail));
}
