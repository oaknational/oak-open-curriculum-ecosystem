# pr-tally fixtures

Recorded harvests for the `pr-tally` command's tests (the delivery node
`.agent/plans/delivery/pr-tally.plan.md`, todo 3). Todo 1's integration suites read these
files — the tally builder's, the settlement suite, and the corpus suite that reads them through
the whole instrument; the unit suites take literal inputs; tests never call GitHub.

## `pr-135-harvest.json`

The four reads the node's mechanism names, recorded once from PR #135 of
`EngraphCode/open-curriculum-ecosystem` on 2026-09-12 after the PR merged
(merge commit `69a537717`) with the query below — `pageInfo` selected on every
connection, and every recorded `hasNextPage` is false, the machine-readable
evidence that each connection was exhausted — unedited apart from unwrapping
the GraphQL envelope to the `pullRequest` object and pretty-printing:

- `commits` — the branch's commits in PR order, the authoritative head order
  the tally sorts bindings against;
- `reviewThreads` — every thread with all of its comments; the first
  comment's `pullRequestReview.commit.oid` is the thread's round binding;
- `reviews` — the paged reviews connection with each review's commit and
  body (Copilot's suppressed-findings blocks and Codex's badge-and-heading
  items live in these bodies);
- `comments` — the issue comments, where the intake declaration, the
  suppressed-findings dispositions and the round reconciliations were
  recorded.

The recording query as run for PR #135 (the number is hard-coded; change it for another PR):

```graphql
query {
  repository(owner: "EngraphCode", name: "open-curriculum-ecosystem") {
    pullRequest(number: 135) {
      number
      headRefOid
      baseRefName
      mergeCommit {
        oid
      }
      commits(first: 50) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          commit {
            oid
            committedDate
          }
        }
      }
      reviewThreads(first: 50) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          isResolved
          isOutdated
          path
          line
          comments(first: 50) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              databaseId
              author {
                login
              }
              createdAt
              body
              pullRequestReview {
                id
                commit {
                  oid
                }
              }
            }
          }
        }
      }
      reviews(first: 50) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          author {
            login
          }
          state
          commit {
            oid
          }
          submittedAt
          body
        }
      }
      comments(first: 50) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          databaseId
          author {
            login
          }
          createdAt
          body
        }
      }
    }
  }
}
```

Every connection was under one page for PR #135 (7 commits, 17 threads, 26 reviews, 10
comments; the largest nested thread has two comments) and the recorded `pageInfo` says so. For a larger PR, page each connection to exhaustion before unwrapping: while any
`pageInfo.hasNextPage` is true, re-query that connection with `after: "<endCursor>"` and
concatenate its `nodes` — the nested thread `comments` connection included — as the node's
mechanism requires; a truncated recording is not a fixture.

What the corpus carries, each claim checked against the JSON with `jq` on 2026-09-12:

- nine reviewer reviews bound to five heads; two of the seven commits never reviewed
  (superseded before a review bound);
- four Copilot review bodies, every one carrying a suppressed-findings block with several
  findings; five Codex review bodies, all boilerplate — there is NO Codex body-only item in
  this corpus (every Codex finding on #135 is a thread), so that shape takes a fixture of its
  own at todo 1;
- seventeen seat thread replies (author `el-graphael`). Every one opens with a bar marker
  that satisfies the closed grammar (fourteen over-bar, three below-bar: `3996143642`,
  `3996223154`, `3996223195`). Five over-bar replies name no prong (`3996143427`,
  `3996143456`, `3996143594`, `3996188479`, `3996188520`). One reply carries the literal
  `Rejected` (`3996143642`); the two final below-bar replies carry no disposition verb and
  end "No write" (`3996223154`, `3996223195`); no `Routed to` example is recorded. The
  count reads the marker only, so all seventeen count;
- every one of those seventeen replies ends `— Nettle guards Pistil (2de368), Director`. The
  ratified self-reply predicate (`agent-tools/src/pr-watch/reviewer-legs.ts`,
  `SIGNATURE_SUFFIX`) requires the final line to END with the `(<six hex>)` prefix, so the
  role suffix makes every recorded reply read as NOT signed under the current code. The
  node's ledger carries the pickup question for todo 1: widen the predicate by dated
  amendment, or treat this corpus's replies as unsigned;
- ten issue comments: `jimCresswell`'s handback and its correction (`5644831605`,
  `5644834828`), a Codex summary and a Sonar badge, none dispositioning anything; and six
  by `el-graphael` — two resume-state records and the late intake declaration
  (`5644727301`, `5644730066`, `5645756283`), which disposition nothing, and three body-only
  disposition comments (`5645760733`, `5645857878`, `5645946537`) that batch findings from
  several heads under prose headings and tables, predating the one-line-per-finding form —
  and carrying the role suffix, so unsigned to the predicate: the corpus's undispositioned
  case for body-only items (a batched comment signed to the predicate would read manual);
- one push marked as the class fix (the epoch reset), in `5645857878`;
- the final head, `b50820152`, read by the intake contract: its two thread findings carry
  marked below-bar replies; its eight Copilot suppressed items are dispositioned only inside
  the batched comment `5645946537`, which carries the role suffix and so is not signed to
  the predicate: the machine reading of that round is undispositioned for all ten, never
  terminal success. The terminal-success reading is the seat's human tally on the PR; the
  tally builder's tests assert the open verdict over this corpus.

## `pr-136-harvest.json` and `pr-138-harvest.json`

Recorded on 2026-09-12 after each pull request merged (#136 at `2b1b15ab8`, #138 at
`e477e62f7`) with the query above widened for todo 1: `pageInfo` on every connection,
`originalLine`, `startLine` and `originalStartLine` on every thread (the anchor that survives
outdating — `line` is `null` on 18 and 19 of their threads), and `databaseId` on every review
(the REST id a one-line disposition names). Every recorded `hasNextPage` is false. The #135
recording predates the widened query and carries neither `originalLine` nor review
`databaseId`.

These two are the conforming corpora the node's todo 3 left owed — pull requests run under the
disposition format — and what they exercise, checked with the tally builder's own tests:

- #136: ten reviewed heads and one merge commit no reviewer bound; twenty thread replies, the
  first six signed with the role suffix (unsigned to the predicate) and the last fourteen with
  the bare prefix; two class-fix heads (`1ca90fece`, `bc6370624`); eight Copilot suppressed
  items across four reviews, none dispositioned in the one-line form. Read by the machine:
  the first two heads' findings and one item on each of five later heads are undispositioned,
  and epoch three's settled counts are 3, 2, 1, 0 — the seat's own tally on the PR — so the
  verdict is open on those obligations, never terminal.
- #135, read by the machine: every seat reply AND every seat comment carries the role suffix
  the predicate rejects, so nothing in it is a signed disposition; every finding is
  undispositioned, none manual, and the verdict is open. (A SIGNED batched comment naming a
  head would make that head's body items manual; this corpus has none.)
- #138: seven reviewed heads and one merge commit; every thread reply bare-signed and marked,
  so every thread is machine-dispositioned; twenty-three Copilot suppressed items, of which
  those on `db67da4d5`, `a1ec078e2` and `33cca25bc` carry one-line dispositions naming head,
  review id, anchor and item, while those on `352ad0ee5`, `84dd6291b`, `ebf90ac3b` and
  `fe81ac086` were never dispositioned in that form and read as undispositioned; one class-fix
  head (`a1ec078e2`); one suppressed item's disposition on `db67da4d5` named a thread from an
  EARLIER review as its key, and the dedup rule is same-review, so that item reads as
  undispositioned. The machine verdict at the final head is therefore `open`, not terminal
  success — the seat's human tally on the PR read it as terminal by disposition. Both readings
  are true; the recording shows which findings the format did not reach.
