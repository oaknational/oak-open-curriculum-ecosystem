---
related_pdr: PDR-013
name: "Ground Before Framing"
category: process
status: proven
discovered: 2026-04-17
proven_in: "Sentry observability maximisation pivot — `wrapMcpServerWithSentry` was already wired at `core-endpoints.ts:98` but claimed as missing in the first pivot summary because scope was inferred from SDK exports rather than read from the composition root"
---

# Ground Before Framing

Before proposing an integration pivot or scope claim, read the composition
root and other load-bearing code reality. Framing that precedes grounding
produces confident-sounding claims that are wrong.

## Pattern

When the task is to assess what a system uses from a library (what is
wired, what is missing, what is opt-in), the first action is to read the
composition root — the file where the library is initialised and its
integrations composed. Only after that read should the framing proposal
begin.

Specifically:

- For a Node app: the `index.ts` entry point plus the bootstrap /
  composition module that constructs the library's client (e.g.
  `core-endpoints.ts`, `app.ts`, `bootstrap.ts`).
- For a library: the `index.ts` barrel and the `createX` factory
  functions.
- For a build or deploy: the build config file and CI/deploy hook
  scripts, not only the package.json scripts list.

## Anti-Pattern

Infer "what the app does" from the library's SDK export surface and the
library's public docs. This is an LLM-shaped failure mode: the SDK's
exports describe what is possible, not what the consumer has wired.
Framing scope around the gap between "what's possible" and "what's
documented publicly" produces a false miss on wiring that is already in
place but undocumented locally.

The corollary failure: a reviewer running on the same framing cannot
catch the miss, because the leading question pre-supposes the gap. The
grounding step is the one that catches it.

## Evidence

**2026-04-17 Sentry pivot** — A scope proposal was sent to four
reviewers claiming `wrapMcpServerWithSentry` was "the single most
important missing integration." The wrapper was wired at
`apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts:98`
with a clear TSDoc block. No reviewer caught the miss because the
review prompt framed the question as "is the proposed pivot sound?",
not "is the grounding accurate?". The corrective rule was added to
the session prompt's "Ground First" step so future sessions read the
composition root explicitly.

**2026-04-17 Sentry L-0b close — `satisfies` gate overclaim**
(commit `d08c6969`). The first session plan asserted that a
TypeScript `satisfies readonly (keyof NodeOptions)[]` check would
"fail the build when a new hook is added to `NodeOptions`." It
would not — the `satisfies` constraint only validates that each
listed name is a valid `NodeOptions` key, not that every
`NodeOptions` hook key is listed. The authored test file's own
TSDoc acknowledged the limitation; the plan prose overclaimed.
Both assumptions-reviewer and sentry-reviewer caught the gap. The
corrective edit reframed the risk-row mitigation to "code review
plus the explicit registry" — the honest enforce-edge. General
lesson: when writing plan prose about compiler-enforced gates,
ground the claim in the actual type behaviour (e.g. by asking "what
concrete change would fail this gate?") before asserting what the
compiler will catch.

## When to Apply

- Any scope proposal that asserts "we're not using X" or "X is missing".
- Any plan pivot that reframes the capability envelope.
- After loading a library's documentation but before accepting it as
  the picture of current state.
- Particularly when the composition root has not been opened in this
  session.

## Related Patterns

- `tool-output-framing-bias.md` — framing bias on tool output.
- `review-intentions-not-just-code.md` — reviewers cannot catch
  framing errors if the prompt embeds them.
- `non-leading-reviewer-prompts.md` — the complementary rule on
  reviewer prompt discipline.
