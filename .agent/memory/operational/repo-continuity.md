---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
---

# Repo Continuity

**Last refreshed**: 2026-04-30T22:30Z (Leafy Bending Dew / `cursor` /
`composer` / `8d0db5` — `observability-sentry-otel` MCP app **product code**:
extracted shared `apps/oak-curriculum-mcp-streamable-http/build-scripts/trim-
to-undefined.ts` (`trimToUndefined` treats **`undefined`** and **post-trim
`''`** explicitly; no ternary collapsing). Removed duplicate helpers from
`sentry-build-plugin-identity.ts` and `sentry-build-plugin.ts`; added
`trim-to-undefined.unit.test.ts`; `vitest run` green for that file +
`sentry-build-plugin.unit.test.ts`. **Not committed**: owner direction — **the
active Claude Code session on this repo/branch should own staging + conventional
commit** for this bundle (Cursor handoff omitted commit deliberately). Fitness
budget and deep consolidation gate explicitly out of scope for this Cursor
closeout.)

**Earlier refresh**: 2026-04-30T15:45Z (Dewy Budding Sapling / claude-code /
claude-opus-4-7-1m / `7e8db7` — `fix/sentry-identity-from-env` branch context
only; no production code, schema, or runtime configuration touched. Practice
work on the `agentic-engineering-enhancements` thread: investigated current
skill-portability pipeline (`.agent/skills/` canonical + `.claude/`/`.cursor/`/
`.agents/` thin wrappers + `skills-lock.json` + `pnpm portability:check`);
drafted vendor-agnostic future strategic plan
`canonical-first-skill-pack-ingestion-tooling.plan.md` that closes the unbuilt
`pnpm agent-tools:canonicalise-vendor-skills` mitigation flagged in the
portability-remediation plan. Plan never names a delivery vendor — ecosystems
referenced as illustrative only; tool source must contain no vendor-keyed
conditionals (validator-enforceable rule). Promotion gated on PASS from
assumptions-reviewer + architecture-reviewer-fred|betty|barney|wilma; reviews
blocking later, not required now per owner direction. Discovery surfaces
wired: future/README, collection README, roadmap, sibling adapter-generation
forward-link, portability-remediation Phase 6 forward-link. Validators green:
portability:check passed (12 commands, 36 skills, 45 rules, 22 reviewer
adapters, 47 Cursor triggers, 45 Claude rules, 45 .agents rules, 40 command
adapters across 4 platforms); markdownlint clean. Owner direction: skip the
final consolidation gate this handoff — handled elsewhere.)

**Earlier refresh**: 2026-04-30T07:30Z (Vining Ripening Leaf / claude-code /
claude-opus-4-7-1m / `bce99d` — `fix/sentry-identity-from-env` branch / PR #91
preview verification + observability-config-coherence strategic plan +
substrate-vs-axis-plans convention component + ADR-162 closure-property
ADR-to-plan bridge. No production code touched. Build `dpl_wTvPsL48u6bCn89Vscw29uot8M9H`
verified READY via Sentry MCP + Vercel MCP: release
`poc-oak-open-curriculum-mcp-git-fix-sentry-identity-from-env` correctly
attributed to commit `837fcfde` with env=preview, 5 bootstrap spans + 10 DEBUG
logs landed. Sentry-identity-from-env fix is working in production. No
remediation deemed urgent for this branch — observability-config-coherence
plan items all involve broader structural change. PDR candidate captured:
substrate-vs-axis-plans convention + working principle "invent-justification-
as-signal". Single commit landing all session artefacts at handoff close.)

2026-04-29 incremental refresh entries (Solar Threading Star, Nebulous
Illuminating Satellite, Squally Diving Anchor) archived 2026-04-30 to
[`archive/repo-continuity-session-history-2026-04-30.md`](archive/repo-continuity-session-history-2026-04-30.md).
Older 2026-04-28 / 2026-04-29 incremental refresh entries archived to
[`archive/repo-continuity-session-history-2026-04-29.md`](archive/repo-continuity-session-history-2026-04-29.md).
Even older history lives in the 2026-04-22, 2026-04-26, and 2026-04-28
archives in the same directory.

## Current State

+ Branch `fix/sentry-identity-from-env` carries PR #91 (OPEN). PR #90
  merged 2026-04-29T20:43:22Z. The 2026-04-30 Vining session moved
  Sentry build-plugin identity from hardcoded literals to env vars and
  authored `observability-config-coherence.plan.md` + the
  substrate-vs-axis-plans convention. The 2026-04-30 Leafy session
  followed with the `trimToUndefined` boundary-helper refactor; commit
  delegated to the active Claude Code session.
+ Vercel release pipeline is healthy: PR #91 preview build verified
  READY via Sentry MCP + Vercel MCP (release attributed to commit
  `837fcfde`, env=preview, 5 bootstrap spans + 10 DEBUG logs landed).
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
4. *Resolved 2026-04-29*: `pr-90-build-fix-landing` thread registered
   in Active Threads; thread record at canonical path was authored by
   Solar Threading Star at session open.
5. ADR/PDR candidates surfaced by 2026-04-29 deep consolidation — see
   `Pending-Graduations Register` below for the full queue and the
   in-session summary at the consolidation closeout.

## Deep Consolidation Status

**Status (2026-04-30 Verdant Sheltering Glade, deferral CLOSED — `not
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

Schema: `captured-date`, `source-surface`, `graduation-target`,
`trigger-condition`, `status`. `consolidate-docs` uses this as the live
queue. Graduated and merged history is preserved in git and the archived
continuity snapshots.

+ 2026-04-29; PR-90 closure session — `scripts/validate-*` family is
  structural drift relative to ADR-041 / §Separate-Framework-from-Consumer /
  owner-direction "complex-with-tests must live in workspace"; 4 parallel
  architecture reviewers convergent; future + executable plans authored
  ([`current/scripts-validator-family-workspace-migration.plan.md`](../../plans/architecture-and-infrastructure/current/scripts-validator-family-workspace-migration.plan.md));
  Phase 0 of the executable plan graduates the owner-direction rule to
  `.agent/rules/no-workspace-evading-scripts.md` and authors ADR delta or
  peer ADR via docs-adr-reviewer; trigger: owner directs Phase 0 OR third
  validator class accumulated; status: pending.
+ 2026-04-29; PR-90 closure session — `external-systems-shouldnt-be-the-
  first-detector` principle introduced by owner mid-session, drove Phases 4
  and 5 (TS-invocation gate + MD024 enable). Recursively useful (caught its
  own meta-instances via Cursor Bugbot napkin finding). **GRADUATED
  2026-04-30 by Verdant Sheltering Glade per owner direction "promote
  both now"** to
  [PDR-039 External-System Findings Reveal Local Detection Gaps](../../practice-core/decision-records/PDR-039-external-findings-reveal-local-detection-gaps.md);
  status: graduated 2026-04-30.
+ 2026-04-29; PR-90 closure session — testing-strategy.md §Test Types named
  "validation scripts that require external resources should be standalone
  scripts, not tests" caught my Phase 4 misclassification (vitest-as-
  validator-harness). The principle is sound but lives in one paragraph;
  worth elaborating in `docs/engineering/testing-tdd-recipes.md` with the
  contrast pattern (validator script + helper unit tests vs integration test
  on real-FS repo state); trigger: second similar misclassification OR
  owner direction; status: pending.
+ 2026-04-29; PR-90 closure session — Vercel build emits 2 warning classes
  (pnpm `@humanfs/node` bin defect; 3 env vars not in `turbo.json`).
  Captured in
  [`future/vercel-build-warning-elimination.plan.md`](../../plans/architecture-and-infrastructure/future/vercel-build-warning-elimination.plan.md).
  Trigger: third warning class accumulates OR owner direction; status:
  pending (future plan).
+ 2026-04-29; owner-requested PR lifecycle skill note;
  `.agent/skills/pr-lifecycle/SKILL.md` plus possible PDR amendment for
  gate-honest PR stewardship; trigger: first real PR shepherding run using
  the skill OR second repeated PR feedback / CI / Sonar / reviewer-wait
  friction instance; status: pending. Evidence:
  [`pr-lifecycle-skill.plan.md`](../../plans/agentic-engineering-enhancements/future/pr-lifecycle-skill.plan.md).
+ 2026-04-24; napkin + `.remember/` wiring commits; PDR-011 amendment for
  plugin-managed ephemeral capture surfaces; trigger: second
  plugin-managed in-repo capture surface or owner direction; status:
  pending.
+ 2026-04-23; ADR-163 release/version boundary and vendor passthrough
  audit; trigger: observability-thread consolidation audit; status:
  pending-audit.
+ 2026-04-23; session-handoff entrypoint sweep; PDR-014 amendment for
  platform-specific entry points as homing substance; trigger: second
  drift instance and owner request; status: pending.
+ 2026-04-25; multi-agent protocol WS architecture; pattern candidate
  `operational-seed-per-workstream`; trigger: second protocol-plan
  instance or owner direction; status: pending.
+ 2026-04-25; collaboration protocol self-application evidence;
  `infrastructure-alive-at-install`; trigger: one instance from a
  different lane or owner direction; status: pending.
+ 2026-04-26; workspace-first failure cluster; rule or
  recurrence-prevention amendment for workspace inventory before external
  tooling/new infra; trigger: second cross-session instance or owner
  direction; status: pending.
+ 2026-04-26; OpenAPI/OOC issues boundary; rule with teeth for API-only
  consumer data boundary; trigger: second near-violation or owner
  direction; status: pending.
+ 2026-04-26; observability validation correction; alignment check
  before per-system claim validation; trigger: second skipped-alignment
  instance or owner direction; status: pending.
+ 2026-04-26; WS3A closeout; protocol observability by consolidation
  audit before new visible surfaces; trigger: second protocol slice with
  the same shape or owner direction; status: pending.
+ 2026-04-28; CLI first-touch friction on the collaboration-state CLI
  (`--help` self-rejects; dispatch keys undiscoverable; `--platform`
  redundant when env-derived; claim file-list verbose; no `whoami`);
  future strategic plan candidate for promotion to `current/`; trigger:
  second instance OR owner direction; **status: ready for promotion**
  (both triggers fired 2026-04-30 — owner observed warnings during
  Verdant Sheltering Glade session, AND the session itself accumulated
  new evidence). Second-instance evidence (2026-04-30):
  `pnpm agent-tools:agent-identity` does not inherit
  `PRACTICE_AGENT_SESSION_ID_CLAUDE` through `pnpm --filter` (forcing
  --seed); `comms append` requires `--events-dir`, `--now`,
  `--created-at` with no discoverable defaults; `claims open` requires
  `--active`, `--thread`, `--area-kind` (with `--area-kind` rejecting
  intuitive values like `shared-state` — only `files`/`workspace`/`plan`/
  `adr`/`git` are accepted); `comms render` uses `--output` not
  `--output-file`. Each error is a single iteration cost but they
  compound to ~5–8 round-trips per session-open. Evidence + plan:
  [`agent-coordination-cli-ergonomics-and-request-correlation.plan.md`](../../plans/agentic-engineering-enhancements/future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md).
+ 2026-04-28; cross-thread comms event request/response correlation gap
  (no `audience`, no `in_response_to`, no TTL/escalation timer);
  minimal correlation primitive on the comms event schema as recommended
  first promotion slice; trigger: second silently-rotted cross-thread
  request OR owner direction; status: pending.
+ 2026-04-28; stance-staleness within a single conversation
  (parallel-agent state moves between forming a stance and reporting it);
  doctrine candidate for `agent-collaboration.md` and start-right
  skills; trigger: second instance OR owner direction; status: pending.
+ 2026-04-28; PR-87 Phase 2 pre-phase security review surfaced
  X-Forwarded-For spoofing on Vercel as MUST-FIX; pattern candidate
  `pre-phase-adversarial-review-expands-cluster-scope`; trigger: second
  cross-session instance OR owner direction; status: pending.
+ 2026-04-29; small-work bypass of coordination surfaces; rule or
  continuity-practice amendment binding session-open registration to
  *first edit* rather than to thread join; trigger: owner-flagged AND
  named for separate investigation; status: pending. Cross-reference:
  [`passive-guidance-loses-to-artefact-gravity`](../active/patterns/passive-guidance-loses-to-artefact-gravity.md).
+ 2026-04-29; test misnaming as exemption mechanism (a `.e2e.test.ts`
  suffix used as filename certificate to escape in-process restrictions);
  testing-strategy amendment to classify tests by behaviour shape, not
  by filename suffix; trigger: second observed instance OR owner
  direction; status: pending.
+ 2026-04-29; agent-infrastructure failure visibility (non-blocking
  agentic-platform hooks fail silently by default); PDR candidate
  extracting the canonical contract from
  [ADR-167](../../../docs/architecture/architectural-decisions/167-hook-execution-failures-must-be-observable.md)
  to Practice Core; trigger: second platform implementing a thin
  wrapper, OR owner direction; status: pending.
+ 2026-04-29; recurring myopia patterns at every signal surface
  (reviewer-as-prosthetic; confirmation-reading-vs-exploration;
  hook-as-obstacle; fitness-as-constraint; sed-bypass); pattern
  candidate or PDR amendment for "tool-error-as-question" meta-pattern;
  trigger: third surface OR owner direction; status: pending. Evidence:
  [`hook-as-question-not-obstacle.md`](../active/patterns/hook-as-question-not-obstacle.md);
  [`ground-before-framing.md`](../active/patterns/ground-before-framing.md).
+ 2026-04-29; scope-as-goal anti-pattern (treating instrumental work as
  terminal because the work-list was full; reviewer "GO WITH CONDITIONS"
  reading as green light when arc-scope ≠ branch-scope); pattern or
  PDR-018 amendment about reviewer-scope-equals-prompted-scope;
  trigger: second cross-session instance OR owner direction; status:
  pending. Evidence: napkin 2026-04-29 Verdant Regrowing Pollen
  session-end summary in
  [`archive/napkin-2026-04-29.md`](../active/archive/napkin-2026-04-29.md).
+ 2026-04-29; lockfile-corruption diagnosis discipline (read build log
  before extending speculation list; speculation lists are negative
  hypotheses, not narrowing tools); pattern candidate or distilled
  process entry; trigger: second instance OR owner direction; status:
  pending. Evidence: napkin 2026-04-29 Verdant Regrowing Pollen
  Surprise 1.
+ 2026-04-29; reviewer-scope-equals-prompted-scope (a reviewer's
  "GO WITH CONDITIONS" reads as green only if reviewer scope ≡ branch
  merge-gate scope; brief reviewers with full merge gate when
  gating merge); PDR-015 amendment OR new pattern; trigger: second
  cross-session instance OR owner direction; status: pending. Evidence:
  napkin 2026-04-29 Verdant Regrowing Pollen Surprise 4.
+ 2026-04-29; experience-audit emergent patterns (medium strength,
  ≥3 instances each, surfaced by 2026-04-29 deep consolidation pass);
  pattern candidates for promotion at second-instance OR owner
  direction; status: pending. Evidence: experience-audit report
  in 2026-04-29 deep consolidation closeout. Six candidates:
  + **silent-degradation-in-green-systems** — tests pass while
    running system is broken (tsx vs dist, characterisation tests
    that never ran, mapping promises a builder never delivers).
  + **plans-are-load-bearing-and-age** — plans encode world-state
    at authoring time and drift; mischaracterisations have the same
    structural risk as bugs.
  + **verify-the-premise-before-solving** — reviewer findings are
    hypotheses about the system, not facts; the fact lives in code.
    Pairs with `ground-before-framing`.
  + **complexity-cascade-feels-productive** — over-engineering
    feels like progress; the simple solution is invisible while in
    the spiral. Pairs with `workaround-gravity`.
  + **bridging-language-smuggles-old-shapes** — "deprecated notice",
    "follow-up", "compatibility layer", "stretch goal" perform
    preservation while preventing the new shape from existing.
  + **fix-the-producer-not-the-consumer** — when a consumer cannot
    use a type/function/structure correctly, the fix is in the
    producer; one template fix → 24 generated files cleaned.
+ 2026-04-29; doctrine-tests-itself-on-the-session-of-its-landing
  (the strongest test of a newly-authored rule is whether the
  session that authored it obeys it; corollary: install-session
  self-application is the acid test); PDR candidate (sibling of
  PDR-029 / install-session-blind-to-cold-start-gaps); trigger:
  owner direction (≥4 cross-session instances already documented);
  status: pending. Evidence: experience-audit report; instance
  patterns include 2026-04-22-the-rule-tested-itself,
  2026-04-21-the-recursive-session,
  2026-04-25-fresh-prince-the-protocol-applied-to-itself,
  2026-04-21-installing-a-tripwire-i-cannot-test.
+ 2026-04-29; open-up-the-value-early (when extra work closes a
  coordination gap that the surrounding decisions would otherwise
  ship with, the move is to open up that value within the current
  arc rather than ship the original arc and defer); PDR candidate
  (strategic test about composability of surrounding decisions,
  distinct from "do it now"); trigger: owner direction OR fourth
  cross-session instance; status: pending. Evidence: experience-
  audit report; instance patterns include
  2026-04-21-session-3-doctrine-bundle-opening-up-value-early
  (canonical naming), 2026-04-22-the-rule-tested-itself,
  2026-04-18-observability-as-principle.
+ 2026-04-29; sentry-observability-maximisation-mcp.plan.md displaced
  doctrine (build-vs-buy attestation + six metacognition guardrails);
  PDR creation candidate ("Build-vs-Buy Attestation as Plan Authoring
  Discipline"), plus ADR-163 §6 amendment to outcome-not-CLI form;
  trigger: owner direction (PDR creation needs explicit approval per
  PDR-003 care-and-consult posture); status: pending. Evidence:
  displaced-doctrine sub-agent report from 2026-04-29 deep
  consolidation pass.
+ 2026-04-29; multi-agent-collaboration-protocol.plan.md concept-home
  refinement; doctrine has graduated to canonical surfaces
  (agent-collaboration directive, respect-active-agent-claims rule,
  distilled.md, consolidate-docs §7e, PDR-029 Family A.3); plan body
  still narrates the doctrine alongside execution status; the work is
  routing each section to its canonical home (or keeping it as
  plan-scoped substance), not a size-target trim — line count falls
  because duplication is removed; trigger: owner direction (preserves
  audit-trail role for WS5 evidence harvest); status: pending. Evidence:
  displaced-doctrine sub-agent report from 2026-04-29 deep consolidation
  pass; child plan at
  [`multi-agent-collaboration-protocol-concept-home-refinement.plan.md`](../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol-concept-home-refinement.plan.md).
+ 2026-04-29; trinity Active Principles + bootstrap structural
  extensions for the five 2026-04-29 doctrine sharpenings (knowledge-
  preservation absolute, shared-state always-writable, tool-error-as-
  question, scope-as-goal, behaviour-shape testing classification);
  amendments queue for `practice.md` §Philosophy + Collaboration,
  `practice-lineage.md` Active Principles, `practice-bootstrap.md`
  §Napkin + §Sub-agents, `practice-verification.md` shared-state
  smoke-test addition; trigger: owner direction (per PDR-003 care-
  and-consult; sub-agent assessed as healthy-lag, not silent rot);
  status: pending. Evidence: trinity-drift sub-agent report from
  2026-04-29 deep consolidation pass.
+ 2026-04-30; commit-bundle-leakage-from-wildcard-staging — wildcard
  `git add -A` (or moral equivalent) over a working tree containing
  another session's WIP produces a commit whose message is true for one
  slice of the diff and silent about the rest. Surfaced 2026-04-30 by
  the `75ac6b75` post-mortem (51 lines of legitimate continuity work
  bundled with 372 lines of parallel Practice-thread plan work plus 3
  lines of unrelated `.claude/settings.json` plugin enable). Corrective
  shape: stage by explicit pathspec from the queued intent; verify
  staged-bundle-matches-intent before commit; treat
  files-outside-the-named-intent as a coordination event. Already
  partially in distilled.md § Process; trigger for full graduation
  (rule + commit-skill amendment): second cross-session instance OR
  owner direction. Status: pending. Evidence:
  [`experience/2026-04-30-verdant-the-bundle-was-the-signal.md`](../../experience/2026-04-30-verdant-the-bundle-was-the-signal.md).
+ 2026-04-30; substrate-vs-axis-plans convention + working principle
  "invent-justification-as-signal"; **GRADUATED 2026-04-30 by Verdant
  Sheltering Glade per owner direction "general principles are PDRs, if
  there are two principles there are two PDRs; specific instances are
  ADRs"** to two new PDRs:
  [PDR-036 Friction-as-Structural-Finding](../../practice-core/decision-records/PDR-036-friction-as-structural-finding.md)
  (generative principle) and
  [PDR-037 Substrate-vs-Axis Plan Categorisation](../../practice-core/decision-records/PDR-037-substrate-vs-axis-plan-categorisation.md)
  (Practice-governance applied to plan collections). The convention
  component file at
  [`templates/components/substrate-vs-axis-plans.md`](../../plans/templates/components/substrate-vs-axis-plans.md)
  remains as the canonical worked-example artefact, now cited from PDR-037.
  Status: graduated 2026-04-30.
+ 2026-04-29; pre-2026-02-15 experience corpus extraction backlog
  (~80 files dating from 2025-01 through 2026-02-15 contain
  inline doctrine, code blocks, principle catalogues that displace
  the subjective register; healthy post-2026-02-15 corpus shows
  the audit discipline now works as intended); one-time extraction
  task; trigger: owner direction; status: pending. Evidence:
  experience-audit report. Recommended extraction approach:
  preserve subjective texture, strip technical content, link to
  canonical homes; group by similar source files (phase-* cluster,
  2025-01 cluster, 2025-08 cluster) for batch processing.

Older graduated entries (PDR-018, PDR-026, PDR-029, PDR-033, PDR-034,
ADR-153, ADR-164, etc.) are preserved in
[`archive/repo-continuity-session-history-2026-04-29.md`](archive/repo-continuity-session-history-2026-04-29.md)
and earlier archive files for full audit trail.
