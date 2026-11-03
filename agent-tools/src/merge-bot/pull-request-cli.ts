import { readFile } from 'node:fs/promises';

import { err, ok, type Result } from '@oaknational/result';
import { typeSafeHasOwn } from '@oaknational/type-helpers';

import type { BranchArgSeams } from './branch-arg.js';
import { realFetch } from './github-fetch.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import { printable } from '../pr-watch/printable.js';
import { parsePullRequestArgs } from './pull-request-args.js';
import { dispatchWorkflow, workflowFile } from './pull-request-dispatch.js';
import {
  closePullRequest,
  commentOnPullRequest,
  replyToReviewComment,
} from './pull-request-github.js';
import { markReadyForReview, resolveReviewThread } from './pull-request-graphql.js';
import { openPullRequest } from './pull-request-open.js';
import {
  exitCodeFor,
  writePullRequestOutcome,
  type PullRequestOutcome,
} from './pull-request-report.js';
import { VALUE_FLAGS, type PullRequestRequest } from './pull-request-request.js';
import { PULL_REQUEST_USAGE } from './pull-request-usage.js';
import type { PushMint } from './push-mint.js';
import { RefFormatOracleUnavailableError } from './ref-format.js';
import {
  resolveBotIdentity,
  type BotIdentity,
  type BotRepository,
  type MergeBotResolveInput,
} from './resolve-identity.js';
import type { TokenScopeName } from './token-scopes.js';

/**
 * The `merge-bot pull-request` action: the bot's writes on a pull request's
 * conversation, and its workflow dispatch, at the front door. The argv
 * contract is `pull-request-args.ts`; the writes are `pull-request-open.ts`,
 * `pull-request-github.ts`, `pull-request-graphql.ts` and
 * `pull-request-dispatch.ts`; the report is `pull-request-report.ts`. Exit
 * map: 0 done, 1 operational failure, 2 usage, 3 typed refusal.
 *
 * Everything that can refuse without GitHub is settled BEFORE the mint — the
 * identity, the body file and its emptiness, the workflow file's shape — so
 * a refusal never mints a token it will not use. One token, minted at the
 * scope the verb needs and no wider, then carries the one verb's calls and
 * is dropped with the process.
 */

/** The action's composition surface. */
export interface PullRequestActionInput {
  readonly identityInput: MergeBotResolveInput;
  /** The token mint: `cli.ts` composes it over its mint seams; a test injects one whole. */
  readonly mint: PushMint;
  /** GitHub; defaults to the real fetch. */
  readonly fetchImpl?: GithubApiFetch;
  /** The body and reason files' reader; defaults to the filesystem. */
  readonly readFileImpl?: (path: string) => Promise<string>;
  /** The `--branch` check's seams (`branch-arg.ts`); its oracle defaults to asking the git binary. */
  readonly branchArgSeams?: BranchArgSeams;
  readonly stdout: Pick<NodeJS.WriteStream, 'write'>;
  readonly stderr: Pick<NodeJS.WriteStream, 'write'>;
}

/** The verb's write, given the token minted for it. */
type Write = (
  token: string,
  fetchImpl: GithubApiFetch,
) => Promise<Result<PullRequestOutcome, Error>>;

/** Everything settled before a token is minted: the identity and the write, or what stops the run. */
type Prepared =
  | { readonly kind: 'ready'; readonly identity: BotIdentity; readonly write: Write }
  | { readonly kind: 'failed'; readonly exit: number; readonly message: string }
  | { readonly kind: 'refused'; readonly reason: string };

/** The verbs that send a file, and the request shapes that name it. */
type BodiedRequest = Extract<PullRequestRequest, { bodyFile: string } | { reasonFile: string }>;

function isHelpFlag(value: string | undefined): boolean {
  return value === '--help' || value === '-h';
}

/** `--help` first, or right after a verb, reaches the usage text on stdout. */
function asksForHelp(rest: readonly string[]): boolean {
  const [first, second] = rest;
  return (
    isHelpFlag(first) ||
    (first !== undefined && typeSafeHasOwn(VALUE_FLAGS, first) && isHelpFlag(second))
  );
}

/** The file a request sends, read whole; a failure names the path. */
async function readBody(
  path: string,
  readFileImpl: PullRequestActionInput['readFileImpl'],
): Promise<Result<string, Error>> {
  const read = readFileImpl ?? ((file: string) => readFile(file, 'utf8'));
  try {
    return ok(await read(path));
  } catch (cause) {
    return err(
      new Error(
        `cannot read ${printable(path)}: ${cause instanceof Error ? cause.message : String(cause)}`,
        { cause },
      ),
    );
  }
}

/** The write for a verb that sends a body, the body read and non-empty. */
function bodiedWrite(request: BodiedRequest, repo: BotRepository, body: string): Write {
  if (request.verb === 'open') {
    return (token, fetchImpl) =>
      openPullRequest(fetchImpl, token, repo, {
        branch: request.branch,
        title: request.title,
        body,
        wipLimit: request.wipLimit,
      });
  }
  if (request.verb === 'comment') {
    return (token, fetchImpl) => commentOnPullRequest(fetchImpl, token, repo, request.pr, body);
  }
  if (request.verb === 'reply') {
    return (token, fetchImpl) =>
      replyToReviewComment(fetchImpl, token, repo, request.pr, request.comment, body);
  }
  return (token, fetchImpl) => closePullRequest(fetchImpl, token, repo, request.pr, body);
}

/** The write for a verb that sends no body and names a pull request. */
function bareWrite(
  request: Extract<PullRequestRequest, { verb: 'resolve' | 'ready' }>,
  repo: BotRepository,
): Write {
  return request.verb === 'resolve'
    ? (token, fetchImpl) => resolveReviewThread(fetchImpl, token, repo, request.pr, request.thread)
    : (token, fetchImpl) => markReadyForReview(fetchImpl, token, repo, request.pr);
}

/** The dispatch, once the file name passes its shape check; a name outside it is the refusal. */
function dispatchPrepared(workflow: string, identity: BotIdentity): Prepared {
  const file = workflowFile(workflow);
  return file.ok
    ? {
        kind: 'ready',
        identity,
        write: (token, fetchImpl) => dispatchWorkflow(fetchImpl, token, identity, file.value),
      }
    : { kind: 'refused', reason: file.error.message };
}

/** The body file read and non-empty, for a verb that sends one. */
async function bodiedPrepared(
  request: BodiedRequest,
  identity: BotIdentity,
  input: PullRequestActionInput,
): Promise<Prepared> {
  const file =
    request.verb === 'close'
      ? { flag: '--reason-file', path: request.reasonFile }
      : { flag: '--body-file', path: request.bodyFile };
  const body = await readBody(file.path, input.readFileImpl);
  if (!body.ok) {
    return { kind: 'failed', exit: 1, message: body.error.message };
  }
  if (body.value.trim() === '') {
    return {
      kind: 'refused',
      reason: `${file.flag} ${printable(file.path)} is empty; the file is sent verbatim, so nothing would be posted`,
    };
  }
  return { kind: 'ready', identity, write: bodiedWrite(request, identity, body.value) };
}

/** Identity and the verb's own precondition — all of it BEFORE the mint. */
async function prepare(
  request: PullRequestRequest,
  input: PullRequestActionInput,
): Promise<Prepared> {
  const identity = resolveBotIdentity({}, input.identityInput);
  if (!identity.ok) {
    return { kind: 'failed', exit: 2, message: identity.error.message };
  }
  if (request.verb === 'dispatch-workflow') {
    return dispatchPrepared(request.workflow, identity.value);
  }
  if (request.verb === 'resolve' || request.verb === 'ready') {
    return { kind: 'ready', identity: identity.value, write: bareWrite(request, identity.value) };
  }
  return bodiedPrepared(request, identity.value, input);
}

/** The scope the verb's token is minted at, and no wider; `token-scopes.ts` carries each row's warrant. */
function scopeFor(verb: PullRequestRequest['verb']): TokenScopeName {
  if (verb === 'dispatch-workflow') {
    return 'workflow-dispatch';
  }
  return verb === 'open' ? 'pull-request-work' : 'pull-request-conversation';
}

/** Mint the one token at the verb's scope, make the write, report. */
async function mintAndWrite(
  prepared: Extract<Prepared, { kind: 'ready' }>,
  request: PullRequestRequest,
  input: PullRequestActionInput,
): Promise<number> {
  const minted = await input.mint({ ...prepared.identity, scope: scopeFor(request.verb) });
  if (!minted.ok) {
    input.stderr.write(`merge-bot pull-request ${request.verb}: ${minted.error.message}\n`);
    return 1;
  }
  const outcome = await prepared.write(minted.value.token, input.fetchImpl ?? realFetch());
  if (!outcome.ok) {
    input.stderr.write(`merge-bot pull-request ${request.verb}: ${outcome.error.message}\n`);
    return 1;
  }
  writePullRequestOutcome(outcome.value, request.json, input);
  return exitCodeFor(outcome.value);
}

export async function runPullRequestAction(
  rest: readonly string[],
  input: PullRequestActionInput,
): Promise<number> {
  if (asksForHelp(rest)) {
    input.stdout.write(PULL_REQUEST_USAGE);
    return 0;
  }
  const parsed = parsePullRequestArgs(rest, input.branchArgSeams ?? {});
  if (!parsed.ok) {
    input.stderr.write(`merge-bot pull-request: ${parsed.error.message}\n`);
    // A missing git binary is an operational failure, never a usage mistake.
    return parsed.error instanceof RefFormatOracleUnavailableError ? 1 : 2;
  }
  const prepared = await prepare(parsed.value, input);
  if (prepared.kind === 'failed') {
    input.stderr.write(`merge-bot pull-request ${parsed.value.verb}: ${prepared.message}\n`);
    return prepared.exit;
  }
  if (prepared.kind === 'refused') {
    writePullRequestOutcome({ kind: 'refused', reason: prepared.reason }, parsed.value.json, input);
    return 3;
  }
  return mintAndWrite(prepared, parsed.value, input);
}
