/**
 * The grammar of `merge-bot pull-request` as data: the closed verb set, the
 * value flags each verb takes, and the typed request each verb parses to.
 * `pull-request-args.ts` reads argv against it; `pull-request-usage.ts`
 * says it to a reader; `pull-request-cli.ts` dispatches on the request.
 */

/** The flags that take a value, by verb; `--json` is the one bare flag and every verb takes it. */
export const VALUE_FLAGS = {
  open: ['--branch', '--title', '--body-file', '--wip-limit'],
  comment: ['--pr', '--body-file'],
  reply: ['--pr', '--comment', '--body-file'],
  resolve: ['--pr', '--thread'],
  ready: ['--pr'],
  close: ['--pr', '--reason-file'],
  'dispatch-workflow': ['--workflow'],
} as const satisfies Readonly<Record<string, readonly string[]>>;

/** A verb of the command, derived from the flag table so there is one source. */
export type PullRequestVerb = keyof typeof VALUE_FLAGS;

/** The verbs in the order the usage text lists them. */
export const PULL_REQUEST_VERBS: readonly PullRequestVerb[] = [
  'open',
  'comment',
  'reply',
  'resolve',
  'ready',
  'close',
  'dispatch-workflow',
];

/** The typed request one invocation makes, one shape per verb. */
export type PullRequestRequest =
  | {
      readonly verb: 'open';
      readonly branch: string;
      readonly title: string;
      readonly bodyFile: string;
      readonly wipLimit: number;
      readonly json: boolean;
    }
  | {
      readonly verb: 'comment';
      readonly pr: number;
      readonly bodyFile: string;
      readonly json: boolean;
    }
  | {
      readonly verb: 'reply';
      readonly pr: number;
      readonly comment: number;
      readonly bodyFile: string;
      readonly json: boolean;
    }
  | {
      readonly verb: 'resolve';
      readonly pr: number;
      readonly thread: string;
      readonly json: boolean;
    }
  | { readonly verb: 'ready'; readonly pr: number; readonly json: boolean }
  | {
      readonly verb: 'close';
      readonly pr: number;
      readonly reasonFile: string;
      readonly json: boolean;
    }
  | {
      readonly verb: 'dispatch-workflow';
      /** The workflow file's name as given; its shape is the verb's own check, before the mint. */
      readonly workflow: string;
      readonly json: boolean;
    };
