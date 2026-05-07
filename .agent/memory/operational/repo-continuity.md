---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: "Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here"
merge_class: index-narrative-tables
---

# Repo Continuity

**Session close (2026-05-07 — Silvered Masking Moth / `codex` /
`GPT-5` / `019e03`, Doctor safe-merge gate implemented)**:
completed the memory/state substrate doctor safe-merge gate. Starting from
`bc56562c` on `fix/sonar-fixes-20260506`, the session reviewed `44c73e4d`,
normalised the closed-claims archive and two conversation files to satisfy the
collaboration schemas without deleting historical evidence, added strict mode
to the built `agent-tools` substrate CLI, added the root
`practice:substrate:check` alias through built output, refreshed the generated
shared comms log, and archived the doctor plan. Report mode now returns
`ok: true` with `blocking: 0`; strict mode returns `0` on the clean live
substrate. Follow-up owner direction deleted the whole legacy collaboration
comms tree and removed it from the live manifest/read-model header. The
requested `code-reviewer` pass found stale
live references and too-narrow retired-root scanning; those findings are fixed.
Repair mode, `--apply`, `--dry-run`, and consolidation integration remain
future arcs.

Historical session summaries and old next-safe-step queues moved to
[repo-continuity-session-history-2026-05-07.md](archive/repo-continuity-session-history-2026-05-07.md).

## Current State

+ Branch `fix/sonar-fixes-20260506` is pushed through `e1827ed8`.
+ The memory/state substrate doctor safe-merge gate is closed: report and
  strict modes return `ok: true` with `blocking: 0`, the root alias invokes
  built `agent-tools` output, the doctor plan is archived, and the legacy
  collaboration comms tree is deleted.
+ No active collaboration claims remain. The advisory commit queue only contains
  stale/abandoned historical entries.
+ Explicitly future arcs: repair mode, `--apply` / `--dry-run`, and
  consolidation integration. Start those with fresh plans rather than widening
  the safe-merge gate closure.
+ Residual Practice fitness pressure is routed, not hidden: `practice.md`
  remains HARD on character count and needs an owner-approved Core edit or
  threshold decision before a strict-hard fitness gate can be clean.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `main-critical-sonar-remediation` | Sonar remediation | [record][main-critical] | Stormy / `claude-code` / `228bc5` / 2026-05-06 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Twilit -> Ashen / `claude-code` / `7cf730` / 2026-05-05 |
| `agentic-engineering-enhancements` | Practice continuity | [record][agentic] | Silvered / `codex` / `019e03` / 2026-05-07 |
| `connecting-oak-resources` | Oak resource graph | [record][connecting] | Cosmic / `claude-code` / `d11500` / 2026-05-04 |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / `claude-code` / `e18e2c` / 2026-05-01 |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / `codex` / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / `codex` / 2026-04-28 |
| `sector-engagement` | External adoption | [record][sector] | Squally / `cursor` / 2026-04-30 |
| `eef` | EEF evidence corpus | [record][eef] | Gnarled / `claude-code` / `e18e2c` / 2026-05-01 |

[main-critical]: threads/main-critical-sonar-remediation.next-session.md
[observability]: threads/observability-sentry-otel.next-session.md
[agentic]: threads/agentic-engineering-enhancements.next-session.md
[connecting]: threads/connecting-oak-resources.next-session.md
[oer]: threads/exploring-open-education-resources.next-session.md
[budget]: threads/architectural-budget-system.next-session.md
[cloudflare]: threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md
[sector]: threads/sector-engagement.next-session.md
[eef]: threads/eef.next-session.md

## Branch-Primary Lane State

Current branch-primary lane state for `fix/sonar-fixes-20260506` lives in
[threads/main-critical-sonar-remediation.next-session.md](threads/main-critical-sonar-remediation.next-session.md).
The active Practice/tooling lane touched by the doctor work lives in
[threads/agentic-engineering-enhancements.next-session.md](threads/agentic-engineering-enhancements.next-session.md).

## Current Session Focus

**2026-05-07 (Silvered Masking Moth, codex, GPT-5, `019e03`,
agentic-engineering-enhancements thread, handoff + consolidation)**:
ran the owner-requested `jc-session-handoff` and `jc-consolidate-docs`
sequence after pushing the doctor safe-merge gate. Consolidation rotated the
active napkin, archived historical repo-continuity material, compacted the
active-thread register, and preserved the residual Core fitness pressure as a
routed owner-decision item rather than trimming Practice Core prose.

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
+ curriculum data in this monorepo comes only through the published Oak Open
Curriculum HTTP API and generated SDK, not direct Hasura/materialised views;
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

**After 2026-05-07 Silvered Masking Moth consolidation**: decide the next arc
explicitly. Safe options are: inspect remote PR/CI state for
`fix/sonar-fixes-20260506`, open a fresh repair-mode plan, or open a fresh
consolidation-integration plan. Do not extend the completed doctor safe-merge
gate to include those future arcs.

## Open Owner-Decision Items

Visible owner-appetite items, not blockers for the current branch state:

1. Residual `practice.md` HARD character pressure needs an owner-approved
   Core edit, threshold decision, or dedicated remediation lane. Constraint:
   Practice Core edits require owner approval under the Core care-and-consult
   rule; falsifiability is `pnpm practice:fitness --strict-hard`.
2. The pending-graduations queue remains SOFT and is intentionally calibrated
   for consolidation-pass access rhythm. Continue draining due entries in
   dedicated consolidation sessions.
3. Future doctor arcs are separate owner-choice lanes: repair mode and
   consolidation integration.

## Deep Consolidation Status

**Status (2026-05-07 Silvered Masking Moth, codex, GPT-5, `019e03`,
owner-requested `jc-session-handoff` + `jc-consolidate-docs`):
`completed this handoff — explicit owner request triggered deep convergence`.**
Completed actions: active napkin rotated to
[napkin-2026-05-07-doctor-safe-merge.md](../active/archive/napkin-2026-05-07-doctor-safe-merge.md),
repo-continuity historical material archived to
[repo-continuity-session-history-2026-05-07.md](archive/repo-continuity-session-history-2026-05-07.md),
active-thread register compacted, and collaboration-state schema checks passed.
No new ADR/PDR was promoted: the memory/state doctrine already lives in
PDR-049, PDR-050, the local substrate contract, and the archived doctor plan.
Residual hard pressure on `practice.md` is routed to owner-approved Core
remediation rather than edited reactively.
