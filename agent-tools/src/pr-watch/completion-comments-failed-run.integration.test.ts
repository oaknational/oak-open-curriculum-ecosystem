import { describe, expect, it } from 'vitest';

import { readCompletionComments } from './completion-comments.js';
import type { CompletionComment } from './completion-comments.js';
import { NO_CONTENT } from './content-binding.js';
import { readDeclaredStandIns } from './declared-unavailable.js';
import { computeReviewerLegs } from './reviewer-legs.js';
import { COPILOT, settledReading } from './state-reading-fixture.js';
import { computePrVerdict } from './states.js';
import { isVendorErrorReview } from './vendor-error-reviews.js';

/**
 * The door over a Codex run that failed while the connector was over its
 * usage quota: the reader, the classifier, the legs, the declared stand-in
 * and the verdict composed, with no gh. The connector posts no review
 * object; it rewrites its summary's Code Review row to **Failed**, naming
 * the head it tried, and posts a usage-limits notice. The row is the
 * vendor's failed run on that head (an error review: it satisfies no leg,
 * is counted, and proves a declaration of unavailability), and the notice
 * is printed, never a refusal. Fixtures: the summary and the notice the
 * connector posted on pull request 362, whole, as read on 2026-10-27
 * (summary created 2026-10-22T09:19:04Z, last edited by the connector at
 * 15:05:57Z; notice at 15:06:00Z), and Copilot's review of the same head at
 * 15:00:13Z. The other commit is synthetic.
 */

const CODEX = 'chatgpt-codex-connector';
const BOT = 'el-graphael';
const HEAD = '8f2b7fd38f2ae98898b7c23c3edfcacfd1694ed8';
const OLD = '6123105a51fdfabb37e39ff45361d0136ac51317';
const FAILED_AT = '2026-10-27T15:05:57Z';
const FAILED_ROW =
  '| 📝 **Code Review** | ⚠️ **Failed** <relative-time datetime="2026-10-27T15:05:50.901506Z">2026-10-27T15:05:50.901506Z</relative-time><br/>We couldn’t complete this review. Comment `@codex review` to try again. | `8f2b7fd` | Manual request |';
const FAILED_QUOTE = '📝 **Code Review** | **Failed** | `8f2b7fd` | Manual request';
const SUMMARY_BODY = [
  '<!-- codex-pull-request-review-summary -->',
  '<!-- codex-review-state:v1 {"code_review":{"commit_sha":"8f2b7fd38f2ae98898b7c23c3edfcacfd1694ed8","has_any_findings":true,"has_unresolved_findings":true,"status":"failed"},"security_review":{"commit_sha":null,"has_any_findings":null,"has_unresolved_findings":null,"status":null}} -->',
  '',
  '## Codex Review Summary',
  '',
  'This comment shows the latest Codex review activity on this pull request.',
  '',
  '| Review | Status | Commit | Review trigger |',
  '| --- | --- | --- | --- |',
  FAILED_ROW,
  '',
  '',
  '',
  '<details> <summary>ℹ️ About Codex in GitHub</summary>',
  '<br/>',
  '',
  '[Your team has set up Codex to review pull requests in this repo](https://chatgpt.com/codex/cloud/settings/general). Reviews are triggered when you',
  '- Open a pull request for review',
  '- Mark a draft as ready',
  '- Comment "@codex review" or "@codex security review".',
  '',
  'Codex reacts with 👀 while any review is running, comments if it has suggestions, and reacts with 👍 once all reviews finish with no findings.',
  '',
  '</details>',
].join('\n');
const NOTICE_BODY =
  'Codex usage limits have been reached for code reviews. Please check with the admins of this repo to increase the limits by adding credits.';

const SUMMARY: CompletionComment = {
  id: 'IC_kwDORdPTys8AAAABebr1Sg',
  author: CODEX,
  body: SUMMARY_BODY,
  createdAt: '2026-10-22T09:19:04Z',
  lastEdit: { at: FAILED_AT, by: CODEX },
};
const NOTICE: CompletionComment = {
  id: 'IC_kwDORdPTys8AAAABgC7w_A',
  author: CODEX,
  body: NOTICE_BODY,
  createdAt: '2026-10-27T15:06:00Z',
  lastEdit: null,
};
const COPILOT_REVIEW = {
  author: COPILOT,
  state: 'COMMENTED',
  body: '<!-- ccr-overview-v2 -->\n\n### 🔵 Needs a closer look\n\nThe research report has unresolved consistency and evidence-qualification issues.',
  commitOid: HEAD,
  submittedAt: '2026-10-27T15:00:13Z',
};
const DECLARATION_URL = 'https://github.com/acme/widgets/pull/362#issuecomment-9';
const DECLARATION = {
  id: 'IC_9',
  url: DECLARATION_URL,
  author: BOT,
  body: `**${CODEX} leg unavailable on head SHA:${HEAD}.**\n\nThe connector is over its usage quota.`,
  createdAt: '2026-10-27T15:20:00Z',
  lastEdit: null,
};
const CHECKS_GREEN_AT = '2026-10-27T15:10:00Z';
const INSIDE_THE_WINDOW = '2026-10-27T15:15:00Z';
const AFTER_THE_WINDOW = '2026-10-27T16:00:00Z';

const reading = readCompletionComments({
  comments: [SUMMARY, NOTICE],
  commits: [OLD, HEAD],
  reviewers: [COPILOT, CODEX],
});

function legsAt(now: string) {
  return computeReviewerLegs({
    headRefOid: HEAD,
    content: NO_CONTENT,
    expectedReviewers: [CODEX],
    reviews: reading.reviews,
    reviewRequests: [],
    roundRequests: [],
    checksGreenAt: CHECKS_GREEN_AT,
    now,
    reviewConfiguration: { kind: 'unread', reason: 'the test reading declares none' },
  });
}

const declared = readDeclaredStandIns({
  declarations: [{ login: CODEX, url: DECLARATION_URL }],
  comments: [DECLARATION],
  poster: BOT,
  expectedReviewers: [COPILOT, CODEX],
  reviews: [COPILOT_REVIEW, ...reading.reviews],
  requests: [],
  isErrorReview: isVendorErrorReview,
  now: AFTER_THE_WINDOW,
});

function verdictAt(now: string, declaredUnavailable = declared) {
  return computePrVerdict(
    settledReading({
      headRefOid: HEAD,
      expectedReviewers: [COPILOT, CODEX],
      reviews: [COPILOT_REVIEW],
      completionComments: reading,
      declaredUnavailable,
      checksGreenAt: CHECKS_GREEN_AT,
    }),
    now,
  );
}

const ERROR_NOTE =
  '; 1 tip-bound vendor error review ignored (the vendor could not review this tip)';

describe('the reader over the failed run', () => {
  it('hands the legs one error review bound to the head, as the row was posted, and one notice; it refuses nothing', () => {
    expect(reading).toStrictEqual({
      reviews: [
        {
          id: SUMMARY.id,
          author: CODEX,
          state: 'COMMENTED',
          body: FAILED_ROW,
          commitOid: HEAD,
          submittedAt: FAILED_AT,
          transport: 'completion-comment',
        },
      ],
      refused: [],
      notices: [
        {
          id: NOTICE.id,
          author: CODEX,
          reportedAt: '2026-10-27T15:06:00Z',
          quote:
            'Codex usage limits have been reached for code reviews. Please check with the admins of this repo to increase the limits ',
        },
      ],
    });
  });

  it('the classifier reads the review the reader made as a vendor error review', () => {
    expect(reading.reviews.map((review) => isVendorErrorReview(review.body))).toStrictEqual([true]);
  });
});

describe('the Codex leg over the failed run alone', () => {
  it('is OWED inside the checks-green window, counting the error review it ignored', () => {
    expect(legsAt(INSIDE_THE_WINDOW)).toStrictEqual([
      {
        reviewer: CODEX,
        state: 'OWED',
        detail: `no substantive review binds the current tip${ERROR_NOTE}`,
      },
    ]);
  });

  it('is SKIPPED by the timeout arm once the window elapses, never SATISFIED', () => {
    expect(legsAt(AFTER_THE_WINDOW)).toStrictEqual([
      {
        reviewer: CODEX,
        state: 'SKIPPED',
        skipReason: 'timeout',
        detail: `timeout: no substantive tip-bound review one quiet window after checks green (${CHECKS_GREEN_AT})${ERROR_NOTE}`,
      },
    ]);
  });
});

describe('a declaration of the connector’s unavailability on that head', () => {
  it('is proven by the failed run, timed at the summary’s rewrite', () => {
    expect(declared.refused).toStrictEqual([]);
    expect(declared.standIns.map((standIn) => standIn.proof)).toStrictEqual([
      { kind: 'error-review', at: FAILED_AT },
    ]);
  });
});

describe('the verdict over the failed run and the notice', () => {
  it('waits on the Codex leg inside the window, printing the failed run and the notice beside the blocking leg', () => {
    const verdict = verdictAt(INSIDE_THE_WINDOW, { standIns: [], refused: [] });

    expect(verdict.state).toBe('SILENT-WAIT-NO-REVIEWER');
    expect(verdict.evidence).toContain(`most blocking reviewer leg: ${CODEX}`);
    expect(verdict.evidence).toContain(
      `${CODEX}: completion comment ${SUMMARY.id} at ${FAILED_AT} read as the vendor's failed run on the tip; "${FAILED_QUOTE}" (transport: completion-comment)`,
    );
    expect(verdict.evidence).toContain(
      `${CODEX}: vendor notice at 2026-10-27T15:06:00Z — "Codex usage limits have been reached for code reviews. Please check with the admins of this repo to increase the limits "`,
    );
  });

  it('settles NO-REVIEW after the window, never UNCLASSIFIED-EVIDENCE: the failed run is the vendor’s answer', () => {
    const verdict = verdictAt(AFTER_THE_WINDOW, { standIns: [], refused: [] });

    expect(verdict.state).toBe('SETTLED-NO-REVIEW');
    expect(verdict.evidence.join('\n')).not.toContain('refused');
    expect(verdict.evidence).toContain(
      `${CODEX}: SKIPPED — timeout: no substantive tip-bound review one quiet window after checks green (${CHECKS_GREEN_AT})${ERROR_NOTE}`,
    );
    expect(verdict.evidence.join('\n')).toContain(
      `${CODEX}: vendor notice at 2026-10-27T15:06:00Z`,
    );
  });

  it('is SETTLE-READY with the connector declared unavailable on that head: the stand-in answers the leg the failed run proves', () => {
    const verdict = verdictAt(AFTER_THE_WINDOW);

    expect(verdict.state).toBe('SETTLE-READY');
    expect(verdict.evidence).toContain(
      `${CODEX}: SATISFIED — substantive review binds current tip${ERROR_NOTE}`,
    );
    expect(verdict.evidence).toContain(
      `${CODEX}: declared unavailable at 2026-10-27T15:20:00Z by ${DECLARATION_URL} (proof: error-review at ${FAILED_AT}) read as a review of the tip (transport: declared-stand-in)`,
    );
  });
});

describe('a failed row the reader accepts but the error classifier does not', () => {
  // The reader's row grammar ends at the line; the classifier's requires every
  // trailing cell closed by a pipe. A row between the two would reach the legs
  // as a substantive review of the head, so the reader refuses it by name.
  const OPEN_TAIL_ROW = FAILED_ROW.replace(/\|\s*$/u, '');
  const openTail = readCompletionComments({
    comments: [{ ...SUMMARY, body: SUMMARY_BODY.replace(FAILED_ROW, OPEN_TAIL_ROW) }, NOTICE],
    commits: [OLD, HEAD],
    reviewers: [COPILOT, CODEX],
  });

  it('is the shape the two grammars disagree on', () => {
    expect(isVendorErrorReview(OPEN_TAIL_ROW)).toBe(false);
  });

  it('is refused by name and reaches no leg as a review', () => {
    expect(openTail.reviews).toStrictEqual([]);
    expect(openTail.refused.map((refusal) => refusal.precondition)).toStrictEqual([
      'reports a failed run in a row the error classifier does not read',
    ]);
  });
});
