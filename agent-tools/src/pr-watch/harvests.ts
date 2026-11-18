/**
 * The paginated GraphQL harvests of `pr state`. The paginated, slurped
 * `gh api graphql` read walks every page of a connection and wraps the
 * pages into one array. The FULL history is the point — the view's
 * per-connection fields stop at their first page, and a reviewer leg or a
 * named commit prefix cannot be read against a bounded list.
 */

/** The full `reviews` connection: the reviewer-leg source, never `latestReviews`. */
export const REVIEWS_QUERY = `query($owner: String!, $name: String!, $number: Int!, $endCursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      reviews(first: 100, after: $endCursor) {
        pageInfo { hasNextPage endCursor }
        nodes { author { login } state body submittedAt commit { oid } }
      }
    }
  }
}`;

/**
 * The full `comments` connection: the surface a completion comment lands on.
 * `lastEditedAt` is null until the comment is edited; a null is read here as
 * the ruling's "updated timestamp equals created timestamp". `editor` names
 * who made the last edit: the connector's own rewrite of its summary is its
 * report, and anyone else's edit is not (the decision note's 2026-09-28
 * amendment). `url` is how an unavailability declaration names its comment.
 */
export const COMMENTS_QUERY = `query($owner: String!, $name: String!, $number: Int!, $endCursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      comments(first: 100, after: $endCursor) {
        pageInfo { hasNextPage endCursor }
        nodes { id url author { login } editor { login } body createdAt lastEditedAt }
      }
    }
  }
}`;

/** The full `commits` connection: the set a completion comment's named prefix resolves within. */
export const COMMITS_QUERY = `query($owner: String!, $name: String!, $number: Int!, $endCursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      commits(first: 100, after: $endCursor) {
        pageInfo { hasNextPage endCursor }
        nodes { commit { oid } }
      }
    }
  }
}`;

/**
 * The request events in full: each review request (GitHub's pending
 * `reviewRequests` never lists a bot) and each ready-for-review event, the
 * rounds a review bound by content waits for (`round-requests.ts`).
 */
export const REQUESTS_QUERY = `query($owner: String!, $name: String!, $number: Int!, $endCursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      timelineItems(itemTypes: [REVIEW_REQUESTED_EVENT, READY_FOR_REVIEW_EVENT], first: 100, after: $endCursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          __typename
          ... on ReviewRequestedEvent { createdAt requestedReviewer { __typename ... on User { login } ... on Bot { login } ... on Mannequin { login } ... on Team { slug } } }
          ... on ReadyForReviewEvent { createdAt }
        }
      }
    }
  }
}`;

/** The `gh api graphql --paginate --slurp` argv for one harvest query. */
export function harvestArgs(query: string, prNumber: string, repo: string | undefined): string[] {
  const [owner, name] = repo === undefined ? ['{owner}', '{repo}'] : repo.split('/');
  return [
    'api',
    'graphql',
    '--paginate',
    '--slurp',
    '-f',
    `query=${query}`,
    '-F',
    `owner=${owner}`,
    '-F',
    `name=${name}`,
    '-F',
    `number=${prNumber}`,
  ];
}
