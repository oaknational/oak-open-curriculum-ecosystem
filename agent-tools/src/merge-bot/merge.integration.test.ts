import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { PrStateReading } from '../pr-watch/state-types.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import { ReadingUnavailableError, runMergeExecution, type MergeExecutionInput } from './merge.js';
import { settledReading, SETTLED_HEAD_OID } from './test-helpers/pr-state-reading.js';

/**
 * Integration over injected ports (constant fakes, no process, no network):
 * the reading seam replaces pr-watch's gh-level assembly (whose fidelity is
 * pr-watch's own proof), the fetch port captures the settings GET and the
 * merge PUT, and the assertions pin the call SHAPES the plan's acceptance
 * criteria name — merge-commit method and the verdicted tip's sha in the
 * body (never-squash and tip-consistency as behaviour).
 */

const HEAD_OID = SETTLED_HEAD_OID;

const makeReading = settledReading;

/** A fetch port capturing every call; responses served from a constant table. */
function makeFetchPort(input: {
  readonly settingsBody?: unknown;
  readonly mergeStatus?: number;
  readonly mergeBody?: unknown;
}): { fetchImpl: GithubApiFetch; calls: { url: string; init?: RequestInit }[] } {
  const calls: { url: string; init?: RequestInit }[] = [];
  const fetchImpl: GithubApiFetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).endsWith('/pulls/42/merge')) {
      return {
        status: input.mergeStatus ?? 200,
        json: () => Promise.resolve(input.mergeBody ?? { merged: true, sha: 'mergesha1' }),
      };
    }
    return {
      status: 200,
      json: () => Promise.resolve(input.settingsBody ?? { allow_merge_commit: true }),
    };
  };
  return { fetchImpl, calls };
}

function makeInput(
  reading: PrStateReading,
  fetchImpl: GithubApiFetch,
  overrides: Partial<MergeExecutionInput> = {},
): MergeExecutionInput {
  return {
    identity: { appId: '1', keyPath: '/dev/null', owner: 'acme', repoName: 'widgets' },
    prNumber: 42,
    expectedReviewers: ['copilot-pull-request-reviewer'],
    nowIso: '2026-08-06T09:00:00Z',
    seams: {
      mint: () =>
        Promise.resolve(
          ok({ token: 'test-token-value', expiresAt: '2026-08-06T10:00:00Z', installationId: 7 }),
        ),
      readReading: () => ok(reading),
      fetchImpl,
    },
    ...overrides,
  };
}

describe('runMergeExecution', () => {
  it('merges a settled tip with the merge-commit method and the verdicted sha in the body', async () => {
    // Quiet window: reading time 08:05, now 09:00 — comfortably elapsed.
    const { fetchImpl, calls } = makeFetchPort({});

    const outcome = await runMergeExecution(makeInput(makeReading(), fetchImpl));

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.value).toMatchObject({ kind: 'merged', sha: 'mergesha1' });
      // The irreversible act carries its own grounds (security H3): the
      // verdict evidence travels on the outcome, machine-readably.
      if (outcome.value.kind === 'merged') {
        expect(outcome.value.evidence.join('\n')).toContain('every expected reviewer leg settled');
      }
    }
    const mergeCall = calls.find((call) => call.url.endsWith('/pulls/42/merge'));
    expect(mergeCall).toBeDefined();
    expect(mergeCall?.init?.method).toBe('PUT');
    const body: unknown = JSON.parse(String(mergeCall?.init?.body));
    expect(body).toEqual({ merge_method: 'merge', sha: HEAD_OID });
  });

  it('refuses a non-settled verdict by name and never calls the merge endpoint', async () => {
    const { fetchImpl, calls } = makeFetchPort({});
    const reading = makeReading({
      checks: { total: 3, passed: 2, failed: 1, pending: 0 },
      namedChecks: [{ name: 'lint', bucket: 'failed' }],
      checksGreenAt: null,
    });

    const outcome = await runMergeExecution(makeInput(reading, fetchImpl));

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.value.kind).toBe('refused');
      if (outcome.value.kind === 'refused') {
        expect(outcome.value.reason).toContain('CHECKS-RED');
        // The verdict travels as a FIELD so the CLI poll loop reads it by
        // name, never by parsing the prose reason.
        expect(outcome.value.verdictState).toBe('CHECKS-RED');
        expect(outcome.value.evidence.join('\n')).toContain('failed check: lint');
      }
    }
    expect(calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
  });

  it('refuses loudly when the settings read omits allow_merge_commit, and never merges', async () => {
    const { fetchImpl, calls } = makeFetchPort({ settingsBody: { full_name: 'acme/widgets' } });

    const outcome = await runMergeExecution(makeInput(makeReading(), fetchImpl));

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.message).toContain('allow_merge_commit');
    }
    expect(calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
  });

  it('refuses when merge commits are disallowed, without a squash fallback call', async () => {
    const { fetchImpl, calls } = makeFetchPort({ settingsBody: { allow_merge_commit: false } });

    const outcome = await runMergeExecution(makeInput(makeReading(), fetchImpl));

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.value.kind).toBe('refused');
      if (outcome.value.kind === 'refused') {
        expect(outcome.value.reason).toContain('merge commits');
        expect(outcome.value.verdictState).toBe('SETTLE-READY');
      }
    }
    expect(calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
  });

  it('surfaces a moved tip loudly when the merge endpoint answers 409', async () => {
    const { fetchImpl } = makeFetchPort({
      mergeStatus: 409,
      mergeBody: { message: 'Head branch was modified. Review and try the merge again.' },
    });

    const outcome = await runMergeExecution(makeInput(makeReading(), fetchImpl));

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.message).toContain('409');
      expect(outcome.error.message).toContain(HEAD_OID);
    }
  });

  it('fails fast on an empty minted token before reading anything', async () => {
    const { fetchImpl, calls } = makeFetchPort({});
    let readingRead = false;
    const input = makeInput(makeReading(), fetchImpl);
    const withEmptyMint: MergeExecutionInput = {
      ...input,
      seams: {
        ...input.seams,
        mint: () =>
          Promise.resolve(ok({ token: '', expiresAt: '2026-08-06T10:00:00Z', installationId: 7 })),
        readReading: () => {
          readingRead = true;
          return ok(makeReading());
        },
      },
    };

    const outcome = await runMergeExecution(withEmptyMint);

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.message).toContain('empty');
    }
    expect(readingRead).toBe(false);
    expect(calls).toHaveLength(0);
  });

  it('classifies the verdict BEFORE reading repo settings: a MERGED PR refuses by name even with the settings endpoint down', async () => {
    // Ordering as behaviour: the settings GET is a fallible network call, so
    // asking it before the verdict is classified turns a DOCUMENTED typed
    // refusal (exit 3) into an operational failure (exit 1) whenever that
    // read fails — on a PR that was already merged, no less.
    const calls: string[] = [];
    const settingsDownFetch: GithubApiFetch = (url) => {
      calls.push(String(url));
      return Promise.reject(new Error('getaddrinfo ENOTFOUND api.github.com'));
    };

    const outcome = await runMergeExecution(
      makeInput(makeReading({ state: 'MERGED' }), settingsDownFetch),
    );

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.value.kind).toBe('refused');
      if (outcome.value.kind === 'refused') {
        expect(outcome.value.verdictState).toBe('MERGED');
        expect(outcome.value.reason).toContain('MERGED');
      }
    }
    // Not merely "the merge endpoint was never called": NOTHING was fetched.
    expect(calls).toHaveLength(0);
  });
});

describe('runMergeExecution — unreadable responses and reading failures (security D2/H4)', () => {
  it('reports merge state UNKNOWN when the PUT body is unreadable — a typed error, never a thrown escape into the usage path', async () => {
    // A 200 whose body-read dies (edge drop mid-body): the merge very likely
    // LANDED — reporting this as anything but state-unknown invites a
    // supervisor retry against an already-merged PR.
    const { fetchImpl } = makeFetchPort({});
    const dyingFetch: GithubApiFetch = (url, init) => {
      if (String(url).endsWith('/pulls/42/merge')) {
        return Promise.resolve({
          status: 200,
          json: () => Promise.reject(new Error('socket hang up')),
        });
      }
      return fetchImpl(url, init);
    };

    const outcome = await runMergeExecution(makeInput(makeReading(), dyingFetch));

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.message).toContain('UNKNOWN');
      expect(outcome.error.message).toContain(HEAD_OID);
      expect(outcome.error.message).toContain('re-read');
    }
  });

  it('an unreadable body behind a gateway status is also state-UNKNOWN, naming the status', async () => {
    const { fetchImpl } = makeFetchPort({});
    const gatewayFetch: GithubApiFetch = (url, init) => {
      if (String(url).endsWith('/pulls/42/merge')) {
        return Promise.resolve({
          status: 502,
          json: () => Promise.reject(new Error('unexpected token < in JSON')),
        });
      }
      return fetchImpl(url, init);
    };

    const outcome = await runMergeExecution(makeInput(makeReading(), gatewayFetch));

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.message).toContain('UNKNOWN');
      expect(outcome.error.message).toContain('502');
    }
  });

  it('a READABLE 5xx is still state-UNKNOWN — a gateway can answer 502 after the upstream accepted the PUT', async () => {
    // Unlike the 409 above (the endpoint's own deterministic refusal — the
    // merge did NOT happen), a 5xx proves nothing either way: the PUT left,
    // and only a re-read can say whether it landed.
    const { fetchImpl, calls } = makeFetchPort({
      mergeStatus: 502,
      mergeBody: { message: 'Bad gateway' },
    });

    const outcome = await runMergeExecution(makeInput(makeReading(), fetchImpl));

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.message).toContain('UNKNOWN');
      expect(outcome.error.message).toContain('502');
      expect(outcome.error.message).toContain('re-read');
    }
    // Indeterminate means STOP: exactly one PUT was ever sent.
    expect(calls.filter((call) => call.url.endsWith('/pulls/42/merge'))).toHaveLength(1);
  });

  it('a 200 whose body does not say merged is state-UNKNOWN too — never a deterministic parse error', async () => {
    // The invariant after the PUT leaves: only 200-and-schema-valid is
    // MERGED, only a readable 4xx is definitely-not-merged, everything else
    // is indeterminate — including a 200 answering with an edge envelope.
    const { fetchImpl } = makeFetchPort({ mergeBody: {} });

    const outcome = await runMergeExecution(makeInput(makeReading(), fetchImpl));

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.message).toContain('UNKNOWN');
      expect(outcome.error.message).toContain('re-read');
    }
  });

  it('surfaces an unreadable settings body as a typed error naming the read', async () => {
    const { fetchImpl } = makeFetchPort({});
    const badSettingsFetch: GithubApiFetch = (url, init) => {
      if (String(url).endsWith('/repos/acme/widgets')) {
        return Promise.resolve({
          status: 200,
          json: () => Promise.reject(new Error('socket hang up')),
        });
      }
      return fetchImpl(url, init);
    };

    const outcome = await runMergeExecution(makeInput(makeReading(), badSettingsFetch));

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.message).toContain('repo settings');
    }
  });

  it('translates a REJECTED settings request into a typed error naming the read, never a throw', async () => {
    // A rejected promise, not a status: DNS failure, connection reset, TLS
    // refusal. Unwrapped it escapes as a throw onto the usage-error path.
    const { fetchImpl } = makeFetchPort({});
    const downFetch: GithubApiFetch = (url, init) =>
      String(url).endsWith('/repos/acme/widgets')
        ? Promise.reject(new Error('ECONNRESET'))
        : fetchImpl(url, init);

    const outcome = await runMergeExecution(makeInput(makeReading(), downFetch));

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.message).toContain('repo settings');
      expect(outcome.error.message).toContain('request failed');
      expect(outcome.error.message).toContain('ECONNRESET');
    }
  });

  it('reports merge state UNKNOWN when the PUT itself is REJECTED — the request left, so the merge may have landed', async () => {
    // Same class as the unreadable body and the same answer: a connection
    // dropping while the response headers were in flight can follow a merge
    // that already landed.
    const { fetchImpl } = makeFetchPort({});
    const droppedFetch: GithubApiFetch = (url, init) =>
      String(url).endsWith('/pulls/42/merge')
        ? Promise.reject(new Error('socket hang up'))
        : fetchImpl(url, init);

    const outcome = await runMergeExecution(makeInput(makeReading(), droppedFetch));

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.message).toContain('UNKNOWN');
      expect(outcome.error.message).toContain(HEAD_OID);
      expect(outcome.error.message).toContain('re-read');
    }
  });

  it('a failed reading surfaces as the typed ReadingUnavailableError the poll loop can classify', async () => {
    const { fetchImpl } = makeFetchPort({});
    const input = makeInput(makeReading(), fetchImpl);
    const withFailingReading: MergeExecutionInput = {
      ...input,
      seams: {
        ...input.seams,
        readReading: () => err(new ReadingUnavailableError('mergeable UNKNOWN — transient')),
      },
    };

    const outcome = await runMergeExecution(withFailingReading);

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error).toBeInstanceOf(ReadingUnavailableError);
      expect(outcome.error.message).toContain('transient');
    }
  });
});

describe('runMergeExecution — target grammar (security H2)', () => {
  it('routes the merge target through pr-watch reviewed grammar, refusing path-traversal shapes', async () => {
    const { fetchImpl, calls } = makeFetchPort({});
    const input = makeInput(makeReading(), fetchImpl, {
      identity: { appId: '1', keyPath: '/dev/null', owner: 'acme', repoName: '..' },
    });

    const outcome = await runMergeExecution(input);

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error.message).toContain('grammar');
    }
    expect(calls.some((call) => call.url.endsWith('/merge'))).toBe(false);
  });
});
