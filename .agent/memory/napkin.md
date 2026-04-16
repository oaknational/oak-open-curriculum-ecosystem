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
