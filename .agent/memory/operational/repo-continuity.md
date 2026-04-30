---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
---

# Repo Continuity

**Last refreshed**: 2026-04-30T~13:30Z (Briny Lapping Harbor /
`claude-code` / `claude-opus-4-7-1m` / `9f9b4969` —
`fix/pnpm-action-setup-pin-to-maintainer-latest` branch / PR #92
OPEN. **Graduation phase landed**: PDR-040 (pin to maintainer-Latest,
not highest), PDR-041 (composition-obscurity investigation
methodology), PDR-042 (signal-distinguishing pre-action gate),
ADR-169 (this repo's adoption companion to PDR-040). Pending-
Graduations Register split out from `repo-continuity.md § Deep
consolidation status` into its own file at
[`pending-graduations.md`](pending-graduations.md); doctrine
references in `consolidate-docs.md` and `session-handoff.md`
updated. Other separable domains noted for later. Sixth reframe
captured (PDR-vs-ADR conscious distinction; bias toward defaulting
to PDRs). **Earlier in session**:
root-cause investigation of recurring Vercel production failures on
every `chore(release)` commit since 1.6.1. **The bug was an obscured
composition error**: every layer in the chain made a defensible local
choice and the failure was emergent from their interaction. Four
layers traced: (1) `pnpm/action-setup@v6.0.2` was pinned by highest
tag, not maintainer-Latest (`gh api .../releases/latest` returns
v5.0.0; the v6.0.x saga is unmarked Latest); (2) v6.0.x installs pnpm
11 as launcher which writes its env-lockfile as a separate first
YAML document into `pnpm-lock.yaml` *before* delegating to
packageManager-pinned 10.33.2; (3) `@semantic-release/git` commits
the dual-document form on every release; (4) Vercel's fresh-state
pnpm install rejects multi-doc YAML, falls back to npm registry, and
hits Node 24 strict `URLSearchParams` `ERR_INVALID_THIS`. Local pnpm
10 reads dual-doc fine on its node_modules-cached fast path — which
is why no developer saw the failure locally. Fix: re-pin
`pnpm/action-setup` to maintainer-Latest v5.0.0 (SHA
`fc06bc1257f339d1d5d8b3a19a8cae5388b55320`) in `release.yml` and
`ci.yml`; regenerate `pnpm-lock.yaml` as single-document. **Audit of
all 4 pinned actions** confirmed only `pnpm/action-setup` was
mispinned; `actions/{checkout,setup-node,create-github-app-token}`
correctly track Latest. Future strategic brief authored at
[`build-pipeline-composition-safeguards.plan.md`](../../plans/architecture-and-infrastructure/future/build-pipeline-composition-safeguards.plan.md):
single structural surface (pin-to-Latest validator + Dependabot
config constraining proposals to Latest moves) plus
composition-obscurity investigation methodology as supporting
insurance. **A multi-document `pnpm-lock.yaml` shape gate was
considered and rejected as too brittle** — pnpm 11 stable will
eventually produce multi-doc lockfiles legitimately, and the build
log already carries the load-bearing signal "expected a single
document in the stream"; the methodology surface covers reading that
signal correctly. Pending-Graduations Register: 2026-04-29
lockfile-corruption-diagnosis-discipline candidate recast as
composition-obscurity-investigation-methodology with both triggers
fired (second instance + owner direction); new candidate
maintainer-Latest pin doctrine. Subjective texture preserved at
[`experience/2026-04-30-briny-the-frame-was-the-fix.md`](../../experience/2026-04-30-briny-the-frame-was-the-fix.md).
Branch rebased onto local main so `9b633456 chore: housekeeping` is
ancestor; force-pushed-with-lease per owner direction.)

2026-04-30 earlier-refresh entries (Leafy Bending Dew, Dewy Budding
Sapling, Vining Ripening Leaf) archived 2026-04-30 by Briny Lapping
Harbor to
[`archive/repo-continuity-session-history-2026-04-30.md`](archive/repo-continuity-session-history-2026-04-30.md).
2026-04-29 incremental refresh entries (Solar Threading Star, Nebulous
Illuminating Satellite, Squally Diving Anchor) were archived 2026-04-30 to
the same file. Older 2026-04-28 / 2026-04-29 incremental refresh entries
archived to
[`archive/repo-continuity-session-history-2026-04-29.md`](archive/repo-continuity-session-history-2026-04-29.md).
Even older history lives in the 2026-04-22, 2026-04-26, and 2026-04-28
archives in the same directory.

## Current State

+ Branch `fix/pnpm-action-setup-pin-to-maintainer-latest` carries PR #92
  (OPEN, awaiting review + Vercel preview validation). PR #91 merged
  2026-04-30T09:33Z. PR #90 merged 2026-04-29T20:43:22Z. Releases
  1.7.0 and 1.7.1 tagged but Vercel production deploys for both went
  to ERROR state on the dual-document `pnpm-lock.yaml` form. Fix in
  PR #92 unblocks the release pipeline by re-pinning
  `pnpm/action-setup` from v6.0.2 (which installs pnpm 11 as launcher
  and writes multi-doc lockfiles) to maintainer-Latest v5.0.0 (which
  uses pnpm 10.x and produces single-doc lockfiles). Branch
  `fix/sentry-identity-from-env` retired post-merge.
+ Vercel release pipeline currently RED on `main` (production deploy
  `dpl_DFmuKNShnu9Q4LMVycf27T4LDyeG` for commit `421ff154` in ERROR);
  PR #92 expected to clear the failure both for the preview and for
  the next release commit on main.
+ ADRs landed in the recent arc: 162 closure-property + ADR-to-plan
  bridge; 166 (architectural budget system); 167 (hook-execution-failure
  visibility); 168 (TS6 baseline + workspace-script architectural rules).
+ WS3A decision-thread / claim-history / observability work is complete
  and archived. WS4A lifecycle integration is complete. Commit-window
  protocol refinement is implemented; intent-to-commit queue v1.3.0
  landed. Collaboration-state write safety landed as `11f0320f`.
  Codex-wide session identity plumbing landed; Cursor Composer has
  experimental project sessionStart hook. Workspace layer separation
  audit plan exists; first safe step is Phase 0 inventory.
+ Fitness state at 2026-04-30 close (Verdant Sheltering Glade):
  napkin.md rotated and back to GREEN; repo-continuity.md history
  archived (HARD on lines/chars — see closure disposition below);
  distilled.md HARD on lines/chars after rotation (two PDR candidates
  pending owner direction would graduate ~25 lines).
+ Branch-primary product thread: `observability-sentry-otel`. Practice
  thread: `agentic-engineering-enhancements`. Branch-level success
  criterion remains the full repo-root gate sequence in
  [`.agent/commands/gates.md`](../../commands/gates.md).

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state
live in each thread record; this table is the repo-level index.

| Thread | Purpose | Next-session record | Active identities |
| --- | --- | --- | --- |
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | Most-recent: Leafy Bending Dew / `cursor` / `composer` / trim-to-undefined-dedup-explicit-empty-vs-undefined / 2026-04-30; Vining Ripening Leaf / `claude-code` / `claude-opus-4-7-1m` / observability-config-coherence-plan-and-substrate-convention / 2026-04-30; Abyssal Cresting Compass / `claude-code` / `claude-opus-4-7-1m` / pr-87-phase-2.0.5 / 2026-04-28; Luminous Waning Aurora / `cursor` / `composer` / preview-sentry-mcp-oauth-triage / 2026-04-28. Full history in thread record. |
| `agentic-engineering-enhancements` | Practice — collaboration protocol, documentation roles, continuity surfaces | [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md) | Most-recent: Dewy Budding Sapling / `claude-code` / `claude-opus-4-7-1m` / canonical-first-skill-pack-ingestion-future-plan-and-discovery-surface-wiring / 2026-04-30; Nebulous Illuminating Satellite / `claude-code` / `claude-opus-4-7-1m` / doctrine-sharpening + deeper-convergence + retirement + pattern graduations + trinity extensions / 2026-04-29; Pearly Swimming Atoll / `codex` / `GPT-5` / repo-goal-narrative-refresh / 2026-04-29; Squally Diving Anchor / `codex` / `GPT-5` / pr-lifecycle-skill-need-capture / 2026-04-29. Full history in thread record. |
| `architectural-budget-system` | Architecture/devx — cross-scale architectural budget doctrine, visibility, staged enforcement planning | [`threads/architectural-budget-system.next-session.md`](threads/architectural-budget-system.next-session.md) | Nebulous Weaving Dusk / `codex` / `GPT-5` / architectural-budget-planning-and-adr-handoff / 2026-04-29. |
| `cloudflare-mcp-security-and-token-economy-plans` | Product/security — Cloudflare MCP public-beta gate and token-efficient MCP tool-use strategy | [`threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md`](threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md) | Glassy Ebbing Reef / `codex` / `GPT-5` / cloudflare-mcp-final-handoff / 2026-04-28. |
| `sector-engagement` | Planning — external organisation adoption, partner reviews, external data-source impact routing | [`threads/sector-engagement.next-session.md`](threads/sector-engagement.next-session.md) | Squally Diving Anchor / `codex` / `GPT-5` / sector-engagement-taxonomy-and-handoff / 2026-04-29. |

The old `memory-feedback` thread is archived. If doctrine-consolidation
work resumes, start a fresh thread or revive that record deliberately.

The `pr-90-build-fix-landing` thread retired 2026-04-30 (PR #90 merged
2026-04-29T20:43:22Z). Thread record retained at
[`threads/pr-90-build-fix-landing.next-session.md`](threads/pr-90-build-fix-landing.next-session.md)
for audit-trail value.

## Branch-Primary Lane State

Branch-primary lane state for the observability thread lives in
[`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md).
The PR #90 landing lane (Solar Threading Star) is not yet thread-bound
(see open finding above).

## Current Session Focus

**2026-04-30 (Verdant Sheltering Glade, in flight)**: post-mortem +
fitness remediation lane (owner-deferred housekeeping-with-intent).
Five mandatory outputs: handoff post-mortem, napkin rotation,
repo-continuity history archive, distilled.md critical-line
investigation, substrate-vs-axis PDR-candidate disposition.

**2026-04-30 (Leafy Bending Dew, Cursor Composer, completed)**: Sentry
esbuild build-scripts — shared `trimToUndefined` boundary helper +
explicit handling for unset vs whitespace-empty; commit delegation to
the active Claude Code session per owner.

**2026-04-30 (Vining Ripening Leaf, Dewy Budding Sapling, completed)**:
Sentry build-plugin identity from env (PR #91 landed); observability
config-coherence strategic plan + substrate-vs-axis convention;
canonical-first skill-pack ingestion future plan + discovery-surface
wiring.

## Repo-Wide Invariants / Non-Goals

Foundational invariants live in directives, rules, ADRs, and PDRs.
Resume with these branch-relevant constraints:

+ no compatibility layers; replace, do not bridge;
+ distinct architectural layers live in distinct workspaces; folders/modules
  inside one workspace do not satisfy layer separation;
+ TDD at all levels;
+ tests prove product behaviour, not configuration or file presence;
+ strict boundary validation only;
+ no `process.env` read/write in test files or setup files;
+ `--no-verify` requires fresh per-invocation owner authorisation;
+ no warning toleration;
+ owner direction beats plan;
+ curriculum data in this monorepo comes only through the published Oak
  Open Curriculum HTTP API and generated SDK, not direct
  Hasura/materialised views;
+ **knowledge preservation is absolute** — writing to shared-state
  knowledge surfaces is never blocked by fitness limits;
+ **shared-state files are always writable and always commit-includable**
  regardless of any active claim (deliberate anti-log-jam tradeoff).

Current branch non-goals:

+ do not implement intent-to-commit as claim metadata only; owner direction
  requires an explicit minimal queue mechanic;
+ do not reopen broader canonicalisation opportunistically;
+ do not treat monitor setup or owner-handled preview validation as in-repo
  acceptance work;
+ do not guess Vercel, Sentry, or GitHub state before checking primary
  evidence.

## Next Safe Step

Choose the lane deliberately:

**PR #92 landing lane (Briny Lapping Harbor, active)**: review and
merge PR #92 (`fix/pnpm-action-setup-pin-to-maintainer-latest`).
Verify Vercel preview deploy goes READY (proves the dual-doc cleanup
unblocks Vercel). After merge, watch the next `chore(release)` commit
on main: it must NOT re-add the 94-line self-management preamble to
`pnpm-lock.yaml`. Post-merge production deploy must go READY.
Future strategic brief at
[`build-pipeline-composition-safeguards.plan.md`](../../plans/architecture-and-infrastructure/future/build-pipeline-composition-safeguards.plan.md)
captures the structural enforcement work (pin-to-Latest validator +
Dependabot config) — promotion-gated.

**PR #90 landing lane (Solar Threading Star, active)**: continue Sonar
quality gate closure, Copilot/Bugbot resolution, ci.yml triage, owner
MCP validation. Plan:
[`pr-90-landing-closure.plan.md`](../../plans/architecture-and-infrastructure/current/pr-90-landing-closure.plan.md).

**Branch-primary lane (PR-87 CodeQL alerts, owner-directed scope-lock to
CodeQL only)**: Open
[`plans/observability/current/pr-87-codeql-alerts.plan.md`](../../plans/observability/current/pr-87-codeql-alerts.plan.md)
as the single source of truth. **First action is a diff-size /
stale-instance probe**: PR-87 diff is 1,680 files / +167k lines, and an
open alert may be a CodeQL platform skip-by-size or stale-instance
artefact. For each open alert, check `most_recent_instance.commit_sha`
vs PR head and confirm the file/line still exists. If most alerts are
stale-instance, force a re-analysis before writing structural cures.
Sonar is **out of scope** for this plan; a separate plan opens after
CodeQL closes.

Other lanes:

+ **Sector engagement** — resume from
  [`threads/sector-engagement.next-session.md`](threads/sector-engagement.next-session.md).
  Next safe step is owner choice of exactly one external-impact target.
+ **Architectural budget system** — planning/doctrine landed in ADR-166
  and parent/child plans. Resume from
  [`threads/architectural-budget-system.next-session.md`](threads/architectural-budget-system.next-session.md).
  Next safe step is owner choice: promote the visibility layer for one
  named consumer trigger, or start Phase 0 of the directory-cardinality
  child plan.
+ **Cloudflare MCP public-beta gate / token economy** — first either
  promote the security gate to `current/` with a Cloudflare control
  disposition table, or measure current Oak MCP `tools/list` and
  representative teacher-facing workflow token costs.
+ **Practice collaboration-state write safety** — first executable slice
  landed in `11f0320f`; current strict-hard fitness is soft-only with
  the napkin / repo-continuity rotations done by this consolidation. Next
  safe step is a deliberate closeout/archive pass for the write-safety
  plan.
+ **Workspace layer separation audit** — first safe step is Phase 0:
  re-ground ADR-154 / ADR-108 / surface isolation programme; produce
  workspace inventory before any package moves.
+ **PR-87 architectural cleanup (in flight)** — see archived plan and
  the active CodeQL-only replacement.
+ **Codex session identity plumbing** — high-impact current slice
  implemented and validated; remaining work is follow-up policy.
+ **Uncommitted Sentry build-script bundle (2026-04-30 Cursor)** — paths under
  `apps/oak-curriculum-mcp-streamable-http/build-scripts/` (`trim-
  to-undefined.ts`, wired imports, unit test). **Next action**: Claude Code
  session **owns commit** when convenient (explicit owner instruction); Cursor
  session closed without commit.

## Open Owner-Decision Items

Visible owner-appetite items, not blockers for the active lanes:

1. `prog-frame/agentic-engineering-practice.md` disposition, recorded in
   [`research/notes/README.md`](../../research/notes/README.md).
2. `platform-adapter-formats.md` promotion proposal under PDR-032.
3. `boundary-enforcement-with-eslint.md` promotion proposal under PDR-032.
4. ADR/PDR candidates queue lives at
   [`pending-graduations.md`](pending-graduations.md) (split out
   2026-04-30 by Briny Lapping Harbor under owner direction).

## Deep Consolidation Status

**Status (2026-04-30 Briny Lapping Harbor): `due — multiple triggers`**.
Triggers fired this session:

+ **A plan or milestone has closed**: 2026-04-29
  lockfile-corruption-diagnosis-discipline candidate's
  second-instance-OR-owner-direction trigger fired; bug fix landed
  via PR #92.
+ **Settled doctrine exists only in ephemeral artefacts**: the
  maintainer-Latest action-pin doctrine is currently captured only
  in napkin + Pending-Graduations Register; no PDR / rule yet.
+ **Repeated surprises suggest a rule, pattern, ADR, or governance
  change**: five same-shape reframes ("not corruption — split-brain";
  "don't disable canonical defaults"; "use Latest, not highest tag";
  "the brittle structural gate is the wrong shape — the build log
  already carries the signal"; "preserve learning over fitness
  metric"). Each one was the owner naming a structural property the
  agent had missed. The fifth reframe fired *during this very
  consolidation pass* when the agent compressed its own session
  entry to fit fitness HARD — exactly the move
  `consolidate-docs §Learning Preservation Overrides Fitness
  Pressure` forbids. Doctrine-graduation candidate registered:
  *signal-distinguishing pre-action gate* (build-red is a contract
  violation; fitness-HARD is a structural-health diagnostic; they
  want different responses).
+ **Documentation drift question**: AGENTS.md contains a
  "See RULES_INDEX.md" pointer that lives only in the Codex entry
  point. Whether this is intentional platform-asymmetric routing
  or unhomed drift is an owner-decision question worth raising at
  consolidation depth.

### Fitness disposition (consolidate-docs step 9)

`pnpm practice:fitness:informational` reports HARD on three files
after this consolidation:

+ **`distilled.md`** (290 / hard 275): pre-existing pressure,
  unchanged by this session. Disposition: route to graduation of
  pending-register candidates that owner has not yet directed
  promotion on. Constraint: owner-direction-gated promotion (per
  PDR-003 care-and-consult posture on Practice substance).
  Falsifiability: the owner can grant promotion at any time and
  measure the resulting reduction; if any candidate has been
  ready-with-stable-doctrine for ≥3 consolidations, the criterion
  itself is the bottleneck, not the queue.
+ **`repo-continuity.md`** (635 / hard 525, 39370 chars / hard
  35000): HARD reflects load-bearing teaching content — the Briny
  Last refreshed entry preserves the four-layer composition
  cascade, audit summary, and shape-gate-rejection rationale that
  next-session agents need; the Verdant closure narrative
  preserves closure-discipline teaching; the Pending-Graduations
  Register is unusually rich post the recent doctrine acceleration.
  **Disposition: deferred remediation lane (not closure blocker).**
  Constraint: knowledge-preservation overrides metric pressure (per
  consolidate-docs §Learning Preservation). Evidence: the napkin's
  fifth-surprise post-mortem documents the failure mode of
  metric-driven compression. Falsifiability check: a future
  session can audit which entries in the Last refreshed entry,
  Verdant closure narrative, or Pending-Graduations Register no
  longer carry teaching value (because the doctrine has graduated
  to a permanent home elsewhere) and graduate-or-archive them
  without compression. Most likely structural follow-up: split the
  Pending-Graduations Register into its own file (PDR amendment to
  ADR-150 / PDR-011 if the surface convention itself is changing).
+ **`principles.md`** (24003 chars / hard 24000): 1 character over
  hard limit. Pre-existing, not this session. Disposition: trivial
  (next edit naturally lands under limit; not closure-blocking).

User explicitly directed escalation to `/jc-consolidate-docs` after
session-handoff closes. Continue.

---

**Earlier status (2026-04-30 Verdant Sheltering Glade, deferral CLOSED — `not
due`)**: the post-mortem-and-fitness-remediation lane completed all five
mandatory outputs the 2026-04-30 Vining handoff queued. Verifiable
artefacts:

1. **Handoff post-mortem** —
   [`experience/2026-04-30-verdant-the-bundle-was-the-signal.md`](../../experience/2026-04-30-verdant-the-bundle-was-the-signal.md).
   Findings: 7c thread-register freshness audit was abbreviated (Vining
   self-confessed; this session ran the full audit at handoff close);
   7a doctrine scan surfaced one PDR candidate, missed the
   friction-as-structural-finding companion (routed to Item 5); thread
   records other than `observability-sentry-otel` were not directly
   missed but the `agentic-engineering-enhancements` plan family was
   bundled into commit `75ac6b75` without updating its thread record at
   that commit (closed in the follow-up `2a3acf48` 15 min later);
   commit `75ac6b75` bundled 372 lines of parallel-session work plus a
   stray `.claude/settings.json` plugin enable, surfacing
   commit-bundle-leakage-from-wildcard-staging as candidate doctrine.
2. **Napkin rotation** — outgoing archived to
   [`archive/napkin-2026-04-30.md`](../active/archive/napkin-2026-04-30.md);
   fresh napkin started; new distilled entries added (stage-by-pathspec,
   hash-without-recompute); shared-state-always-writable paragraph
   pruned to one-line pointer.
3. **repo-continuity history archive** — historical refresh entries +
   the 2026-04-29 deeper-convergence narrative + four graduated
   register entries archived to
   [`archive/repo-continuity-session-history-2026-04-30.md`](archive/repo-continuity-session-history-2026-04-30.md).
4. **distilled.md critical-line investigation** — line 268 (172 chars)
   was the inline deep-path link in the validation-scripts entry.
   Investigation answers: (a) earlier zones did fire as soft warnings
   on inline markdown links across consolidations but were treated as
   benign-link-syntax overhead; (b) 150 is the right threshold for
   prose, but the convention should be reference-style links for deep
   paths so prose stays under 100 and the link reference lives in
   non-prose territory; (c) yes — the entry was symptom of a missing
   graduation. Disposition: graduated the worked example + contrast
   pattern to
   [`docs/engineering/testing-tdd-recipes.md § Validator Script vs
   Integration Test`](../../../docs/engineering/testing-tdd-recipes.md#validator-script-vs-integration-test);
   distilled now carries a one-line pointer entry.
5. **PDR-candidate disposition for substrate-vs-axis-plans** — see
   §Open Owner-Decision Items entry 6 below; owner decision recorded
   inline.

**Residual fitness state at closure**: napkin GREEN; distilled
HARD-pressure relieved by 2026-04-30 owner-directed promotions —
[PDR-038 Stated Principles Require Structural Enforcement](../../practice-core/decision-records/PDR-038-stated-principles-require-structural-enforcement.md)
and
[PDR-039 External-System Findings Reveal Local Detection Gaps](../../practice-core/decision-records/PDR-039-external-findings-reveal-local-detection-gaps.md)
authored, distilled entries reduced to pointer form. repo-continuity
residual line/char pressure is the Pending-Graduations Register, which
is doing exactly its job (queueing candidates with named triggers).
Routed to §9 with explicit disposition: remaining HARD pressure
reflects pending candidates, not low-value content; reduction tracks
owner direction.

Earlier statuses (2026-04-30 Leafy rider, Dewy skip, Vining
owner-deferred; 2026-04-29 Nebulous deeper convergence) all archived
2026-04-30 to
[`archive/repo-continuity-session-history-2026-04-30.md`](archive/repo-continuity-session-history-2026-04-30.md).

### Pending-Graduations Register

The Pending-Graduations Register lives in its own file at
[`pending-graduations.md`](pending-graduations.md) — split out
2026-04-30 by Briny Lapping Harbor under owner direction. Doctrine
references that previously named `repo-continuity.md § Deep
consolidation status` as the register surface now route via that file.

The split rationale: accumulated rich register content (40+ entries
from recent doctrine acceleration) was contributing the bulk of
`repo-continuity.md`'s HARD fitness state, and the register is a
domain of responsibility distinct from the live operational state
this file is meant to carry. Live operational state stays here;
graduation queue lives next door.

### Other separable domains noted for later analysis

Per owner direction 2026-04-30 (Briny Lapping Harbor) to surface
sensibly separable domains in `repo-continuity.md`. The
Pending-Graduations Register split landed this session; these
candidates are recorded for future evaluation:

1. **Repo-Wide Invariants / Non-Goals** (~33 lines). Stable
   bullet points naming repo-wide constraints
   (knowledge-preservation, shared-state-always-writable,
   curriculum-data-via-API-only, etc.). Each bullet is graduated
   doctrine pointing at canonical homes. Could migrate to
   `.agent/directives/principles.md` or stay here as a
   quick-reference index. Trigger for split: the invariant set
   grows past ~50 lines OR an authoritative principles surface
   gains an "operational invariants" section.
2. **Open Owner-Decision Items** (now ~10 lines after this
   session's cleanup). Items 1–3 are promotion proposals under
   PDR-032; item 4 is now a pointer to pending-graduations.md.
   The remaining surface overlaps with the pending-graduations
   register (both are "queue of items needing owner action").
   Could converge into one file. Trigger for merge: a third
   instance of "owner-direction-needed" surface accumulating
   somewhere outside both files.
3. **Deep Consolidation Status earlier-status narratives**
   (Verdant Sheltering Glade closure, ~25 lines after structural
   trim). Carries closure-discipline teaching about the
   five-mandatory-outputs lane, but the substance has graduated
   into `consolidate-docs.md` step 6+ and `session-handoff.md`
   step 6+. Trigger for archive: explicit confirmation that the
   closure-discipline teaching is fully captured in those
   commands' bodies; or a third closure narrative accumulates,
   making the section the wrong size for live-state.
4. **Current Session Focus** (currently 19 lines naming three
   different sessions' foci). The section accumulates across
   sessions; entries from closed sessions are stale-with-teaching-
   value. Could be cleaned at each session-close (only the
   current session's focus stays); or removed entirely if "Last
   refreshed" + "Next safe step" cover the same ground without
   gaps. Trigger for cleanup: next session-handoff that touches
   this section.
