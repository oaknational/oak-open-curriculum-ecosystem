import { z } from 'zod';

/**
 * The recorded-harvest boundary for `pr-tally`: the four reads the delivery
 * node names (commits in branch order, review threads with every comment,
 * the paged reviews connection with each review's commit and body, and the
 * issue comments), recorded once from GitHub's GraphQL surface and read
 * here from a file. The consumed fields are validated strictly and a missing
 * or misshapen one fails loud; unknown keys are stripped, as `pr-watch`'s
 * boundary parsers do, so a recording may carry fields this reader does not
 * consume. Every connection carries its `pageInfo`, and a recording with any
 * `hasNextPage: true` is refused — a truncated recording is not a fixture
 * (`agent-tools/tests/pr-tally/fixtures/README.md`).
 *
 * @remarks
 * This module does no IO. The recording query is in the fixtures README;
 * the command that runs it lands with the node's todo 2.
 */

const pageInfoSchema = z.object({
  hasNextPage: z.boolean(),
  endCursor: z.string().nullable(),
});

const commitNodeSchema = z.object({
  commit: z.object({ oid: z.string().min(1), committedDate: z.string().min(1) }),
});

const threadCommentSchema = z.object({
  databaseId: z.number().int().nonnegative(),
  author: z.object({ login: z.string().min(1) }).nullable(),
  createdAt: z.string().min(1),
  body: z.string(),
  pullRequestReview: z
    .object({
      id: z.string().min(1),
      databaseId: z.number().int().nonnegative().optional(),
      commit: z.object({ oid: z.string().min(1) }).nullable(),
    })
    .nullable(),
});

const reviewThreadSchema = z.object({
  id: z.string().min(1),
  isResolved: z.boolean(),
  isOutdated: z.boolean(),
  path: z.string().min(1),
  line: z.number().int().positive().nullable(),
  originalLine: z.number().int().positive().nullable().optional(),
  startLine: z.number().int().positive().nullable().optional(),
  originalStartLine: z.number().int().positive().nullable().optional(),
  comments: z.object({ pageInfo: pageInfoSchema, nodes: z.array(threadCommentSchema).min(1) }),
});

const reviewSchema = z.object({
  id: z.string().min(1),
  databaseId: z.number().int().nonnegative().optional(),
  author: z.object({ login: z.string().min(1) }).nullable(),
  state: z.string().min(1),
  commit: z.object({ oid: z.string().min(1) }).nullable(),
  // GitHub returns null for the authenticated user's own PENDING draft; `pr-watch` normalises it to ''.
  submittedAt: z.string().nullable(),
  body: z.string(),
});

const issueCommentSchema = z.object({
  databaseId: z.number().int().nonnegative(),
  author: z.object({ login: z.string().min(1) }).nullable(),
  createdAt: z.string().min(1),
  body: z.string(),
});

const connection = <T extends z.ZodType>(node: T) =>
  z.object({ pageInfo: pageInfoSchema, nodes: z.array(node) });

const recordedHarvestSchema = z.object({
  number: z.number().int().positive(),
  headRefOid: z.string().min(1),
  baseRefName: z.string().min(1),
  mergeCommit: z.object({ oid: z.string().min(1) }).nullable(),
  commits: connection(commitNodeSchema),
  reviewThreads: connection(reviewThreadSchema),
  reviews: connection(reviewSchema),
  comments: connection(issueCommentSchema),
});

type RecordedHarvestShape = z.infer<typeof recordedHarvestSchema>;

/** One comment on a review thread, its author flattened to a login (`''` when GitHub omits it). */
interface HarvestedThreadComment {
  readonly databaseId: number;
  /** The id of the review record GitHub created for this comment; a signed reply's review is excluded from anchoring. */
  readonly reviewId: string | null;
  readonly author: string;
  readonly createdAt: string;
  readonly body: string;
}

/** One review thread with its round binding read from its first comment's originating review. */
interface HarvestedThread {
  readonly id: string;
  readonly isResolved: boolean;
  readonly isOutdated: boolean;
  readonly path: string;
  /** The current line, `null` once a later push outdates the thread. */
  readonly line: number | null;
  /** The line at the time of the review — survives outdating; `null` on a recording that predates the field. */
  readonly originalLine: number | null;
  /** The id of the review the first comment belongs to; `null` for a thread opened outside a review. */
  readonly reviewId: string | null;
  /** The commit that review bound to — the thread's round; `null` when unbound. */
  readonly reviewCommitOid: string | null;
  readonly comments: readonly HarvestedThreadComment[];
}

/** One review from the paged connection, carrying its own commit binding. */
interface HarvestedReviewRecord {
  readonly id: string;
  /** The REST id, when the recording carried it — the id a disposition line names. */
  readonly databaseId: number | null;
  readonly author: string;
  readonly state: string;
  readonly commitOid: string | null;
  readonly submittedAt: string;
  readonly body: string;
}

/** One issue comment on the pull request. */
interface HarvestedIssueComment {
  readonly databaseId: number;
  readonly author: string;
  readonly createdAt: string;
  readonly body: string;
}

/** The recorded harvest, flattened for the tally: commits in branch order, threads bound to their rounds. */
export interface RecordedHarvest {
  readonly number: number;
  readonly headRefOid: string;
  readonly baseRefName: string;
  readonly mergeCommitOid: string | null;
  /** Branch order as GitHub lists the pull request's commits — the authoritative head order. */
  readonly commits: readonly { readonly oid: string; readonly committedDate: string }[];
  readonly reviewThreads: readonly HarvestedThread[];
  readonly reviews: readonly HarvestedReviewRecord[];
  readonly comments: readonly HarvestedIssueComment[];
}

function truncatedConnections(shape: RecordedHarvestShape): string[] {
  const top = (['commits', 'reviewThreads', 'reviews', 'comments'] as const).filter(
    (name) => shape[name].pageInfo.hasNextPage,
  );
  const nested = shape.reviewThreads.nodes
    .filter((thread) => thread.comments.pageInfo.hasNextPage)
    .map((thread) => `reviewThreads[${thread.id}].comments`);
  return [...top, ...nested];
}

type ThreadShape = RecordedHarvestShape['reviewThreads']['nodes'][number];

function flattenComment(comment: ThreadShape['comments']['nodes'][number]): HarvestedThreadComment {
  return {
    databaseId: comment.databaseId,
    reviewId: comment.pullRequestReview?.id ?? null,
    author: comment.author?.login ?? '',
    createdAt: comment.createdAt,
    body: comment.body,
  };
}

// The round binding lives on the FIRST comment's originating review (the
// skill's Phase 3 harvest contract); later comments are replies.
function bindingOf(thread: ThreadShape): {
  reviewId: string | null;
  reviewCommitOid: string | null;
} {
  const review = thread.comments.nodes[0]?.pullRequestReview ?? null;
  return { reviewId: review?.id ?? null, reviewCommitOid: review?.commit?.oid ?? null };
}

function flattenThread(thread: ThreadShape): HarvestedThread {
  return {
    ...bindingOf(thread),
    id: thread.id,
    isResolved: thread.isResolved,
    isOutdated: thread.isOutdated,
    path: thread.path,
    line: thread.line,
    originalLine: thread.originalLine ?? null,
    comments: thread.comments.nodes.map(flattenComment),
  };
}

/**
 * Parse a recorded harvest (the `pullRequest` object of the recording query,
 * as the fixtures README states it) into the flattened shape the tally reads.
 *
 * @throws a ZodError when the input is not the recorded shape, or names the
 *   truncated connections when any `pageInfo.hasNextPage` is true — strict
 *   validation at the boundary, never a silent partial corpus.
 */
export function parseRecordedHarvest(raw: unknown): RecordedHarvest {
  const shape = recordedHarvestSchema.parse(raw);
  const truncated = truncatedConnections(shape);
  if (truncated.length > 0) {
    throw new Error(
      `truncated recording is not a fixture: hasNextPage is true on ${truncated.join(', ')}`,
    );
  }
  return {
    number: shape.number,
    headRefOid: shape.headRefOid,
    baseRefName: shape.baseRefName,
    mergeCommitOid: shape.mergeCommit?.oid ?? null,
    commits: shape.commits.nodes.map((node) => ({
      oid: node.commit.oid,
      committedDate: node.commit.committedDate,
    })),
    reviewThreads: shape.reviewThreads.nodes.map(flattenThread),
    reviews: shape.reviews.nodes.map((review) => ({
      id: review.id,
      databaseId: review.databaseId ?? null,
      author: review.author?.login ?? '',
      state: review.state,
      commitOid: review.commit?.oid ?? null,
      submittedAt: review.submittedAt ?? '',
      body: review.body,
    })),
    comments: shape.comments.nodes.map((comment) => ({
      databaseId: comment.databaseId,
      author: comment.author?.login ?? '',
      createdAt: comment.createdAt,
      body: comment.body,
    })),
  };
}
