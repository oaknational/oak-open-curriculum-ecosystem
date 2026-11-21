import type { Result } from '@oaknational/result';

import type { MergeOutcome } from '../merge.js';
import type { GithubApiFetch } from '../mint-installation-token.js';

/**
 * The fetch port the merge-door suites share: a constant table by URL
 * serving the base ref, the base branch's rules (by page), the merge
 * settings and the merge PUT, recording every URL asked for; one URL
 * substring may be made to answer 502. One owner
 * (consolidate-at-second-consumer): variation is expressed through
 * `options` at call sites, never by editing this base.
 */

export interface DoorPortOptions {
  /** The contexts the served rules require; absent, the estate's two. */
  readonly required?: readonly string[];
  /** A URL substring whose reads answer 502. */
  readonly failing?: string;
  /** Rules served by page; absent, one page carrying `required`. */
  readonly rulesPages?: readonly (readonly unknown[])[];
}

export interface DoorPort {
  readonly fetchImpl: GithubApiFetch;
  /** Every URL the product asked the port for, in order. */
  readonly calls: { url: string }[];
}

export function makeDoorPort(options: DoorPortOptions = {}): DoorPort {
  const calls: { url: string }[] = [];
  const required = options.required ?? ['run-quality-gates', 'CodeQL'];
  const defaultRules = [
    {
      type: 'required_status_checks',
      parameters: { required_status_checks: required.map((context) => ({ context })) },
    },
  ];
  const rulesAnswer = (url: string): unknown => {
    const page = Number(/[&?]page=(\d+)/u.exec(url)?.[1] ?? '1');
    if (options.rulesPages === undefined) {
      return page === 1 ? defaultRules : [];
    }
    return options.rulesPages[page - 1] ?? [];
  };
  const answer = (url: string): unknown => {
    if (url.endsWith('/pulls/42/merge')) {
      return { merged: true, sha: 'mergesha1' };
    }
    if (url.endsWith('/pulls/42')) {
      return { base: { ref: 'main' } };
    }
    return url.includes('/rules/branches/main') ? rulesAnswer(url) : { allow_merge_commit: true };
  };
  const fetchImpl: GithubApiFetch = (url) => {
    calls.push({ url });
    if (options.failing !== undefined && url.includes(options.failing)) {
      return Promise.resolve({ status: 502, json: () => Promise.resolve({}) });
    }
    return Promise.resolve({ status: 200, json: () => Promise.resolve(answer(url)) });
  };
  return { fetchImpl, calls };
}

/** Whether the port was asked to merge. */
export function mergeAsked(port: DoorPort): boolean {
  return port.calls.some((call) => call.url.endsWith('/pulls/42/merge'));
}

/** The refusal's verdict state, or undefined when the outcome was not a refusal. */
export function refusedState(outcome: Result<MergeOutcome, Error>): string | undefined {
  return outcome.ok && outcome.value.kind === 'refused' ? outcome.value.verdictState : undefined;
}

/** The refusal's evidence lines, or none when the outcome was not a refusal. */
export function refusedEvidence(outcome: Result<MergeOutcome, Error>): readonly string[] {
  return outcome.ok && outcome.value.kind === 'refused' ? outcome.value.evidence : [];
}
