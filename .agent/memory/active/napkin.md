---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in the repo-continuity
[`Deep consolidation status`](../operational/repo-continuity.md#deep-consolidation-status)
register.

The previous active napkin was archived during the 2026-04-30 deep
consolidation pass at
[`archive/napkin-2026-04-30.md`](archive/napkin-2026-04-30.md). It
carries the full record of the 2026-04-29 / 2026-04-30 session arc
(deep consolidation, PR-90 closure, sector-engagement narrative
refresh, observability config-coherence + substrate-vs-axis convention,
canonical-first skill-pack ingestion future plan).

High-signal entries from that arc graduated to:

- `docs/engineering/testing-tdd-recipes.md § Validator Script vs
  Integration Test` — the contrast pattern + scripts/-tier note;
- `distilled.md § Process` — the new "stage by explicit pathspec"
  and "hash presence without recompute is silent drift" entries;
- `repo-continuity.md § Pending-Graduations Register` — the
  commit-bundle-leakage candidate from this session's post-mortem.

## 2026-04-30 — Post-mortem + fitness remediation lane (Verdant Sheltering Glade)

Session opened on the owner-deferred housekeeping-with-intent lane
recorded in `repo-continuity.md § Deep Consolidation Status` after
Vining Ripening Leaf. Five mandatory outputs queued; full record lives
in this session's experience file [the-bundle-was-the-signal][exp].

[exp]: ../../experience/2026-04-30-verdant-the-bundle-was-the-signal.md

### Surprise — the bundle was the signal

- **Expected**: commit `75ac6b75` did what its message said —
  "record owner-deferred handoff post-mortem + remediation lane".
- **Actual**: the diff bundled 51 lines of legitimate continuity work,
  372 lines of parallel `agentic-engineering-enhancements` plan work,
  and 3 lines of unrelated `.claude/settings.json` cloudflare-plugin
  enable. The commit message is true for one slice of the diff and
  silent about the rest.
- **Why expectation failed**: I assumed the closing-session staging
  picked the queued bundle and stopped there. Wildcard staging
  (`git add -A` or moral equivalent) over a working tree containing
  another session's WIP defeats the queue.
- **Behaviour change**: stage by explicit pathspec from the queued
  intent; treat files-outside-the-named-intent at commit time as a
  coordination event, not a convenience. Surfaced as candidate
  doctrine in the pending-graduations register
  (commit-bundle-leakage-from-wildcard-staging). Same shape as Vining's
  own working principle: *the invented justification is the signal that
  the structure has not caught up to the shape of the work* — applied
  to a staging boundary, the message-vs-diff alignment requiring prose
  to bridge IS the signal.

### Fitness remediation outcomes

- Napkin rotated 2026-04-30 (this session). Outgoing archived to
  `archive/napkin-2026-04-30.md`. Distilled gained two new entries
  (stage-by-pathspec, hash-without-recompute), pruned the long
  testing-strategy line by graduating to testing-tdd-recipes.md, and
  pruned the duplicated shared-state-always-writable paragraph to a
  pointer.
- Distilled.md remains in HARD zone after rotation (314/275 lines):
  two PDR candidates pending owner direction (stated-principles-require-
  structural-enforcement and external-system-findings-tell-you-about-
  your-local-detection-gap) would graduate ~25 lines if directed; the
  remainder is canonical pointer registry.
- repo-continuity.md history archive landing this session.
- Distilled critical-line at line 268 (172 chars) closed by the
  testing-tdd-recipes graduation; same surface no longer carries the
  inline deep-path link.
- Substrate-vs-axis PDR disposition recorded in this session's handoff.

### Pattern note — substrate-vs-axis applied to staging

The substrate-vs-axis distinction Vining named for plan collections
generalises: when a categorisation system meets an edge case that wants
prose to justify, the system is missing a category. Applied to staging,
the categorisation `(this-session-intent | parallel-session-intent |
unrelated)` was implicit; the bundle-leakage made the missing category
visible. Recording the substrate-vs-axis component as a *plan-collection*
convention may have under-scoped its applicability — it is reusable
beyond plan collections.

## 2026-04-30 — Sentry build-scripts `trimToUndefined` hygiene (Leafy Bending Dew)

- **What landed.** One shared [`trim-to-undefined.ts`][trim-helper] helper:
  **unset** (`undefined`) and **present-but-empty-after-trim** (`''`) are
  separate `if` branches — no collapsed falsy shortcut. Duplicate privates
  dropped from sentry identity + plugin modules; small vitest module proves
  the boundary.

[trim-helper]: ../../../apps/oak-curriculum-mcp-streamable-http/build-scripts/trim-to-undefined.ts

- **Handoff.** Cursor session `/jc-session-handoff` **without** git commit —
  **active Claude Code instance should own** staging + conventional commit when
  it next touches the branch (surfaced on thread record +
  `repo-continuity.md` §Last refreshed / §Next safe step).

- **ADR/PDR (6b)**. Nothing qualifies — pure refactor clarity.

## 2026-04-30 — pnpm/action-setup pin saga (Briny Lapping Harbor)

Vercel production was red on every `chore(release)` commit since 1.6.1.
Three prior commits had "fixed" the lockfile by deleting the orphan first
YAML document; each fix was undone by the next release. This session
ended the cycle.

### Surprises

**Surprise 1 — I called valid pnpm output "corruption" three times.** The
multi-document YAML stream is a legitimate format. The commit-message
language ("recurring pnpm lock corruption") inherited that frame
unexamined, and I propagated it for the first half of the investigation.
Owner reframed: "it's not corruption at all, it's perfectly valid and
what we are seeing is some kind of split brain." The reframe was the
fix — every "delete the orphan document" commit had been authored under
the wrong frame, manufacturing the next loop.

**Surprise 2 — I proposed disabling a canonical default after the
reframe.** Within the same response, after accepting the split-brain
framing, I offered "set `managePackageManagerVersions: false`" as
Option B with equal weight to "investigate the actual mismatch."
Owner: "we are not turning off a canonical, standard, and default
feature! Step back, ultrathink." The shape: I keep collapsing
"understand the contract mismatch" into "remove the variable that
introduces the failure mode." Twin to fix-the-producer-not-the-consumer
but worse — silencing the producer's *correct* behaviour.

**Surprise 3 — I proposed bumping action-setup to v6.0.3.** Owner:
"we're using the wrong release, we should have taken the sha from
latest, not from the highest number." `gh api .../releases/latest`
returns v5.0.0; the entire v6.0.x saga is unmarked Latest, and the
maintainers are holding it deliberately. Three reframes, all the same
shape: I produced a path that "works in frame" instead of finding the
right frame.

**Surprise 4 — I proposed a brittle structural gate alongside the
real fix.** Plan body initially included a multi-document
`pnpm-lock.yaml` rejection check (`grep '^---$'`). Owner: "remove the
surface 2 proposed check, it will break as soon as pnpm 11 is
released, it's too brittle, we already have a strong signal in the
build logs, the thing that has changed is that now we know what it
means. The real problem is more general, how do we make sure that we
are pinning to latest, not to 'highest'." Sharp distinction: the
build-log signal "expected a single document in the stream" was
load-bearing both 2026-04-29 and 2026-04-30, but only became
*recognised as* load-bearing in this session. A static gate would
freeze the recognition into the wrong shape (rejecting valid pnpm 11
output once Latest moves). The structural fix lives at the pinning
mechanism; the build log + reading discipline is the insurance. Plan
revised: one structural surface (pin-to-Latest) + methodology
insurance, not two parallel gates.

### Doctrine surfaced

**Pin GitHub Actions to maintainer-Latest, not highest version.** The
two diverge precisely when a release line is unstable — exactly when
divergence matters most. Captured in pending-graduations register;
future plan
[`build-pipeline-composition-safeguards.plan.md`](../../plans/architecture-and-infrastructure/future/build-pipeline-composition-safeguards.plan.md)
covers the validator + Dependabot config + multi-doc lockfile gate.

**Composition obscurity is composition cost, not bug cost.** When a
bug spans multiple sensible-in-isolation layers (`pnpm/action-setup@v6`
→ pnpm 11 launcher → multi-doc YAML → pnpm 10 fast vs. slow path →
Vercel fresh state → Node 24 strict URLSearchParams), no single layer
is wrong; the composition fails. Investigation methodology must load
*early*: read the build log first, workspace-first before remote
tooling, upstream issue tracker before local theory, version
archaeology when regression appeared. Recasts the 2026-04-29
"lockfile-corruption diagnosis discipline" candidate into a sharper
form; both triggers (second instance + owner direction) have fired.

### Method note — when frame is the fix, agent stops jumping

Three reframes from owner in one session is high-cost. The agent-side
discipline: when investigation is open, do not couple analysis to a
proposed action. State the frame, surface the evidence, let the owner
choose the path. The "Option A or Option B" structure I kept defaulting
to encoded a hidden bias toward action.
