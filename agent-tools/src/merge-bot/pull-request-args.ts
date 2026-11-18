import { err, map, ok, type Result } from '@oaknational/result';
import { typeSafeHasOwn } from '@oaknational/type-helpers';

import { printable } from '../pr-watch/printable.js';
import type { BranchArgSeams } from './branch-arg.js';
import {
  branchName,
  collectFlags,
  nodeId,
  nonBlank,
  positiveInteger,
  usageError,
  type Collected,
} from './pull-request-flags.js';
import {
  PULL_REQUEST_VERBS,
  VALUE_FLAGS,
  type PullRequestRequest,
  type PullRequestVerb,
} from './pull-request-request.js';

/**
 * The argv contract for `merge-bot pull-request`: a closed grammar of seven
 * verbs, each with its own closed flag set (`pull-request-request.ts`),
 * parsed to a typed request. The flag walk and the value grammars are
 * `pull-request-flags.ts`; this file assembles each verb's request. Nothing
 * the grammar does not name passes through: an unknown verb or flag, a
 * missing or repeated flag, a value outside its grammar, each is a refusal
 * that names what was expected and carries the usage text.
 */

function isVerb(value: string): value is PullRequestVerb {
  return typeSafeHasOwn(VALUE_FLAGS, value);
}

/** A verb's request, assembled from the flags it was given. */
type Builder = (collected: Collected, seams: BranchArgSeams) => Result<PullRequestRequest, Error>;

/** A request on an existing pull request, built from its number and the verb's own flags. */
type ExistingBuilder = (pr: number, collected: Collected) => Result<PullRequestRequest, Error>;

/** An existing-pull-request builder in the common shape: `--pr` is read first. */
function withPr(build: ExistingBuilder): Builder {
  return (collected) => {
    const pr = positiveInteger(collected, '--pr');
    return pr.ok ? build(pr.value, collected) : pr;
  };
}

/** The `open` request: four required values. */
const openRequest: Builder = (collected, seams) => {
  const branch = branchName(collected, seams);
  if (!branch.ok) {
    return branch;
  }
  const title = nonBlank(collected, '--title');
  if (!title.ok) {
    return title;
  }
  const bodyFile = nonBlank(collected, '--body-file');
  if (!bodyFile.ok) {
    return bodyFile;
  }
  return map(positiveInteger(collected, '--wip-limit'), (wipLimit) => ({
    verb: 'open',
    branch: branch.value,
    title: title.value,
    bodyFile: bodyFile.value,
    wipLimit,
    json: collected.json,
  }));
};

/**
 * The `dispatch-workflow` request: the file name as given, non-blank. Its
 * shape is the verb's own refusal (`pull-request-dispatch.ts`), made before
 * the mint, so a name with a slash is refused as a value and never as a
 * mistyped flag.
 */
const dispatchRequest: Builder = (collected) =>
  map(nonBlank(collected, '--workflow'), (workflow) => ({
    verb: 'dispatch-workflow',
    workflow,
    json: collected.json,
  }));

/** The `reply` request's two flags beyond `--pr`. */
const replyRequest: ExistingBuilder = (pr, collected) => {
  const comment = positiveInteger(collected, '--comment');
  if (!comment.ok) {
    return comment;
  }
  return map(nonBlank(collected, '--body-file'), (bodyFile) => ({
    verb: 'reply',
    pr,
    comment: comment.value,
    bodyFile,
    json: collected.json,
  }));
};

/** Every verb's builder: the two that name no pull request, and the five that do. */
const REQUESTS: Readonly<Record<PullRequestVerb, Builder>> = {
  open: openRequest,
  'dispatch-workflow': dispatchRequest,
  comment: withPr((pr, collected) =>
    map(nonBlank(collected, '--body-file'), (bodyFile) => ({
      verb: 'comment',
      pr,
      bodyFile,
      json: collected.json,
    })),
  ),
  reply: withPr(replyRequest),
  resolve: withPr((pr, collected) =>
    map(nodeId(collected, '--thread'), (thread) => ({
      verb: 'resolve',
      pr,
      thread,
      json: collected.json,
    })),
  ),
  ready: withPr((pr, collected) => ok({ verb: 'ready', pr, json: collected.json })),
  close: withPr((pr, collected) =>
    map(nonBlank(collected, '--reason-file'), (reasonFile) => ({
      verb: 'close',
      pr,
      reasonFile,
      json: collected.json,
    })),
  ),
};

/**
 * Parse the argv after `pull-request` into a typed request.
 *
 * @param rest - The verb and its flags.
 * @param seams - The `--branch` check's oracle; the real git binary unless injected.
 */
export function parsePullRequestArgs(
  rest: readonly string[],
  seams: BranchArgSeams = {},
): Result<PullRequestRequest, Error> {
  const [verb, ...flags] = rest;
  if (verb === undefined || !isVerb(verb)) {
    const problem = verb === undefined ? 'a verb is required' : `unknown verb "${printable(verb)}"`;
    return err(usageError(`${problem}; the verbs are ${PULL_REQUEST_VERBS.join(', ')}`));
  }
  const collected = collectFlags(verb, flags);
  return collected.ok ? REQUESTS[verb](collected.value, seams) : collected;
}
