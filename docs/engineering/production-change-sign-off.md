# Production Change Sign-Off

Who has to agree before a change merges depends on one question:

> Does this change alter what a user-facing app runs or serves in production?

The user-facing apps are the MCP app (`apps/oak-curriculum-mcp-streamable-http`)
and the search app (`apps/oak-search-cli`). Everything else in the repository,
the demo apps included, is not user-facing.

This page is the rubric for answering that question and for what follows from
the answer. It applies to every pull request, whoever or whatever opens it. It
was written during a dependency pass, so its examples are dependency updates,
but the classes are about the effect of a change and not about its kind.

## The four classes

| Class                                                        | What it is                                                                                                                                                                         | Sign-off before merge                                                                      |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **A. No production effect**                                  | Nothing a user-facing app runs or serves changes.                                                                                                                                  | The ordinary merge path.                                                                   |
| **B. Production code path, no intended change in behaviour** | A user-facing app runs or serves the changed code, the change is an in-range patch or minor (or an equivalent refactor), and it alters no configuration and no intended behaviour. | The ordinary merge path, plus a named proof in the pull request.                           |
| **C. Trust, privacy or request-path boundary**               | The change touches authentication or authorisation, what leaves the process for a third party, or the code every request passes through.                                           | The repository owner's explicit go-ahead on that pull request, after a specialist review.  |
| **D. Major version or rewrite on a production path**         | A major version of a production dependency, or a change that needs a production code path rewritten.                                                                               | A ticket first. The owner decides, case by case, what each one needs before it is started. |

"The ordinary merge path" is the one
[`pr-lifecycle`](../../.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md)
defines: checks green, every review thread answered and resolved, the review
round settled.

### Class A: no production effect

Lint and test tooling; the demo apps; `agent-tools`; documentation and
Practice files; a dependency reached only by development tooling. Build
tooling, CI workflows and their action pins belong here too, on one condition.

The condition: the artefact a user-facing app ships, and the path by which it
is deployed, are unchanged. A bundler or compiler update that changes what an
app ships is class B, and the proof is a comparison of the built output
before and after. A change to a workflow that builds, releases or deploys a
user-facing app, or to an action that workflow runs, is classified by what it
does to that artefact and that path: class B when both are provably the same,
class C when it touches credentials, tokens or what is deployed where.

### Class B: production code path, no intended change in behaviour

Examples: React in the MCP app's widget, `express`, the Elastic client, the
OpenTelemetry API, the command-line libraries the search app uses.

The pull request names its proof:

- the test suite that exercises the changed code, by name, and its result;
- for the MCP app, that the pull request's Vercel preview was checked, and
  what was looked at;
- anything the pull request's checks do **not** exercise.

A class B change that turns out to need a configuration change, or to change
behaviour, is no longer class B. Reclassify it and say so on the pull request.

### Class C: trust, privacy or request-path boundary

Examples: the Sentry SDK's configuration or its redaction hooks, the Clerk
authentication clients, the Hono adapter on the `/mcp` request path, the
PostHog event policy, security headers, the OAuth proxy.

Size does not move a change out of this class. A one-line patch to a
dependency on the request path is class C, and so is a change meant to
preserve behaviour exactly.

Before merge:

1. A specialist reviews the change: the reviewer for the vendor or boundary
   concerned (Sentry, Clerk, security), given the diff and asked to disprove
   the claim it makes.
2. The pull request states what was decided and what was left out, so the
   owner is asked about a specific claim.
3. The owner gives an explicit go-ahead **for that pull request**. A go-ahead
   for one pull request does not carry to the next, and an instruction to
   "carry on" with a body of work is not a go-ahead for a class C change
   inside it.

An agent working a class C pull request does not start the merge tool on it,
and stops one that is already running, until the go-ahead is on record. It
says on the pull request that the change is held and why.

### Class D: major version or rewrite on a production path

Examples from the pass that produced this page: `@sentry/node` 11,
`@clerk/mcp-tools` 1.0, `@modelcontextprotocol/ext-apps` 2, `posthog-node` 6.

These are raised on a ticket with the evidence (what breaks, which call sites,
what proof would be needed) and are not done inside a maintenance pass. There
is no fixed recipe for them: the owner decides, case by case, what each one
needs (a plan, a named reviewer, a staged rollout, or nothing more than a
class C sign-off) before it is started. Several found in one pass share one
ticket, split when one is taken up. The
documented version holds in [Build System](./build-system.md#dependency-updates)
are a separate mechanism: a hold records why a version cannot be taken yet; a
class D ticket records work that can be done and has not been planned.

## Classifying a change

- Classify by the call sites, never by the package's reputation or the size
  of the diff. Find where the changed code is imported and which app runs it.
- A change in more than one class takes the highest. Where the parts
  separate cleanly, split the pull request so the lower-class part is not
  held with the higher.
- When the class is unclear, treat the change as the higher class and ask.
- State the class in the pull request description, with the reason in one
  sentence.

## What this page does not decide

- Whether a change is a good idea. A class A change can still be wrong.
- Review quality. Every class goes through the same review and checks; the
  classes add a sign-off, they do not replace anything.
- Release timing. See [Release and Publishing](./release-and-publishing.md).
