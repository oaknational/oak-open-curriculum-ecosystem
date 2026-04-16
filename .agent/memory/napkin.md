## Napkin rotation — 2026-04-16

Rotated at 525 lines after 12 sessions (2026-04-14g through
2026-04-16) covering metacognitive correction on native wrappers,
start-right grounding, native wrapper compatibility gap investigation,
investigation answers, plan rewrite around value, plan validation and
simplification, recovering removed scope to companion plans, parent
plan reconciliation, parent metadata parity, education skills
exploration, native Sentry MCP adoption implementation, and cleanup
commit 2 (circular chain break). Archived to
`archive/napkin-2026-04-16.md`. Merged 3 new entries into
`distilled.md`:

- Reconcile parent when child changes runtime truth (Process)
- All gates blocking, no "pre-existing" exceptions (Process)
- "Tests use it" is migration surface, not justification (Process)

Extracted 2 new patterns:

- `patterns/circular-test-justification.md` (testing)
- `patterns/test-claim-assertion-parity.md` (testing)

Previous rotation: 2026-04-14 at 641 lines.

---

## Session 2026-04-16 — Sentry handoff refresh

## Session 2026-04-16 — OAuth supported-scope split for dynamic clients

### Surprise

Expected:
The existing OAuth metadata tests would already protect the distinction between
required tool scopes and PRM-advertised supported scopes.

Actual:
The security policy used one source of truth for both concerns, and the test
suite had encoded the now-stale assumption that `openid` must never appear in
`scopes_supported`.

Why expectation failed:
We had optimised around an earlier Clerk invalid-scope incident and baked that
 workaround into generation, tests, docs, and ADR narrative instead of keeping
tool-enforcement scope separate from dynamic-client compatibility scope.

Behaviour change:
Keep protected-tool required scopes minimal, but model PRM-advertised supported
scopes as a separate generated contract and regression-test both surfaces so
Codex/client fixes do not break other OAuth consumers.

### Surprise

Expected:
Updating the active Sentry plans would leave the restart surfaces broadly in
sync.

Actual:
The parent plan, collection index, strategic index, and continuation prompts
still taught conflicting closure criteria and next-step sequencing until they
were swept together.

Why expectation failed:
Authority drift showed up first in narrative and handoff surfaces rather than
in todo metadata.

Behaviour change:
When a live plan is repartitioned, sweep parent, child, index, strategic, and
prompt surfaces together before trusting the restart story.

### Surprise

Expected:
Once validation was the only remaining branch-critical work, the next session
would naturally pivot toward the search observability lane.

Actual:
The user clarified the intended order: finish validation, then continue with
the MCP-server-confined expansion plan, and leave broader search observability
to a later session and PR.

Why expectation failed:
I over-inferred sequencing from the plan topology instead of treating the
user's explicit priority correction as the authoritative state change.

Behaviour change:
When the user sharpens sequencing across companion plans, rewrite all restart
surfaces immediately and treat that correction as a first-class status update.

## Session 2026-04-16 — Vercel production release gating

### Surprise

Expected:
The new root `package.json` version policy could be enforced entirely through
the build command.

Actual:
That would have turned every non-release production deployment into a failed
build, which the user correctly called out as useless noise. The right control
point is Vercel's ignore-build path, not the build itself.

Why expectation failed:
I initially optimised for fail-fast validation without distinguishing product
misconfiguration from intentionally skipped production deployments.

Behaviour change:
When the desired outcome is "do not deploy this class of build", prefer the
deployment platform's explicit cancel/skip surface over converting expected
non-events into failing builds.

## Session 2026-04-16 — Workspace-owned build scripts and gate cleanup

### Surprise

Expected:
Moving the Vercel ignore-build script into an MCP workspace-owned
`build-scripts/` folder would be a tidy structural change with only local
follow-on fixes.

Actual:
The move exposed knock-on quality-gate issues across shared version handling,
Sentry config exports, search CLI runtime-config sizing, and `knip` export
hygiene. One turbo MCP test run also failed transiently even though the direct
package suite passed cleanly.

Why expectation failed:
I underestimated how many repo-level constraints converge on "simple" build
script changes once version metadata is shared across workspaces and all gates
are treated as blocking.

Behaviour change:
When moving logic out of root `scripts/`, immediately expect follow-on fixes in
shared config surfaces, export maps, and static analysis, and use `pnpm check`
as the authoritative closure signal rather than package-local success.

## Session 2026-04-16 — Shared Vercel build policy extraction

### Surprise

Expected:
Extracting the Vercel ignore-build policy into a new core workspace would be
mostly about moving code and wiring imports.

Actual:
The clean reusable shape was slightly split-brain: runtime metadata belongs in
a normal shared package, but Vercel's `ignoreCommand` still wants an app-local
entrypoint, so the best structure is a tiny app wrapper over shared workspace
logic rather than a pure package-only move.

Why expectation failed:
I initially treated "shared across apps" and "directly callable by Vercel" as
the same packaging problem, but they have different execution constraints.

Behaviour change:
For reusable Vercel deployment policy, keep the policy engine in a core
workspace and leave each app with a minimal local adapter script that matches
Vercel's entrypoint contract.

## Session 2026-04-16 — Collection-level observability drift sweep

### Surprise

Expected:
The earlier observability handoff sweep had already brought the relevant
restart surfaces into alignment.

Actual:
Collection-level index files such as
`architecture-and-infrastructure/README.md`,
`architecture-and-infrastructure/current/README.md`, and
`architecture-and-infrastructure/roadmap.md` still taught the pre-split story
that Search CLI adoption was the next implementation step.

Why expectation failed:
I corrected the parent plan, child/companion plans, and session prompts first
but did not complete the same sweep across the collection index layer.

Behaviour change:
When a workstream is repartitioned or re-sequenced, sweep collection README and
roadmap indexes alongside the active plans and prompts before declaring the
continuity story clean.

## Session 2026-04-16 — Turbo-sensitive MCP rate-limit proof

### Surprise

Expected:
Because the MCP rate-limit integration test passed in isolation, the same test
would remain stable inside the commit hook's concurrent turbo run.

Actual:
The test timed out only under the hook's broader concurrent gate load even
though the behaviour under test was correct.

Why expectation failed:
The assertion was valid, but the default per-test timeout underrepresented the
cost of full-app bootstrap inside the repo's real gate topology.

Behaviour change:
For broad integration tests that boot the full app and prove boundary
behaviour, set an explicit timeout that matches the real gate environment
instead of relying on the default unit-test-oriented timeout.

## Session 2026-04-16 — Report normalisation contract hardening

### Surprise

Expected:
The report-normalisation skill already enforced sibling clean-file output and
source preservation strongly enough to prevent in-place overwrite ambiguity.

Actual:
The skill and command wording still allowed in-place edits by interpretation,
which caused avoidable confusion about "validation against original markdown."

Why expectation failed:
The output contract was presented as optional modes instead of a hard invariant
set. The guidance mixed flexible phrasing with strict validation language.

Behaviour change:
For this workflow, encode non-negotiable invariants directly: always emit
`*-clean.md`, never overwrite source, source markdown defines structure, DOCX
repairs citations/links, and drift proof compares clean vs source.
