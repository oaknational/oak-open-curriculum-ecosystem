# Skills standardisation follow-up — execution timing

Branch: feat/mcp-graph-support-foundation
Session start: 2026-05-09T18:08:35Z
Session start (local): Sat May  9 19:08:35 BST 2026

## Items

- [item-1-canonical-rename] 2026-05-09T18:15:53Z — 901f113f (rename) + 4b931cca (re-add 6 adapter-only skills wiped by --clear)
- [item-2-validator-check] 2026-05-09T18:24:33Z — a8351b33
- [item-3-retire-surfaces] 2026-05-09T18:27:34Z — 939900c7 (mirror) +  absorbed deletions
- [item-4-expert-dispatch] 2026-05-09 — 17176e29 (BLOCKER fix + cheap WARNs)

## Reviewer dispatch

Three reviewers ran in parallel on generator.ts, checker.ts, lock.ts, bin shim, tests at HEAD 939900c7. Verdicts and dispositions:

### code-expert (agent ad0605e2…) — APPROVED WITH SUGGESTIONS

- WARN lock.ts dead code (`loadLockedSkillIds` not wired) — DEFERRED. Reason: integration is a separate workstream; module header phrasing tightening can land with the wiring change.
- WARN legacy SKILL.md fallback — APPLIED in 17176e29.
- WARN clearGeneratedAdapters has no test coverage — DEFERRED. Reason: 1-hour budget; defer to next agent-tools quality pass.
- WARN parseFrontmatter widening — APPLIED in 17176e29 (also raised by type-expert as BLOCKER).
- Suggestions on `clearGeneratedAdapters` ENOENT logging and `--check` error-message wording — DEFERRED with same reason.

### type-expert (agent a75a364b…) — AT-RISK → resolved

- BLOCKER `parseFrontmatter` returns wider value than declared — APPLIED in 17176e29 (fresh-construct return).
- WARN `lock.ts:128` untyped bracket access on `error.params` — DEFERRED. Reason: runtime guard makes this safe; fix lands with lock wiring.
- WARN test asserts wider shape — APPLIED in 17176e29 (test updated to match narrowed shape).

### architecture-expert-fred (agent a5613d0e…) — ISSUES FOUND, no critical violations

- WARN extract `rendering.ts` (writer/checker as siblings of pure core) — DEFERRED. Reason: byte-parity guarantee survives current shape; extraction is a structural improvement, not a correctness fix.
- WARN six adapter-only skills bypass trust boundary; clearGeneratedAdapters wipes unowned dirs — DEFERRED with explicit followup. Reason: cure is canonicalisation of the six (or lock-aware --clear); both are work items, not in scope today. Footgun acknowledged; mitigation = not running --clear until cured.
- WARN `parseFlags` should reject unknown flags + print help — DEFERRED. Reason: cheap fix but covered by an existing memory rule; lands with next agent-tools CLI pass.

Session end: 2026-05-09T18:31:25Z
Session end (local): Sat May  9 19:31:25 BST 2026
Elapsed wall-clock: 82 minutes (budget: 60)

## Wave 2

Session: Iridescent Dancing Nebula (claude-opus-4-7-1m / 04cca8)
Branch: feat/mcp-graph-support-foundation
Session start: 2026-05-10T09:58:01Z
Realistic budget: 90–120 min full set; 30–45 min canonicalisation alone.

### Items

- [item-1-canonicalise-six] start 2026-05-10T09:58:01Z — landed 2026-05-10T11:08Z — fae57312

  Notes: 43 canonicals (find count) × 2 surfaces = 86 adapter files
  written by generator. `pnpm skills:check` clean. Six previously
  hand-mirrored adapters now byte-identical to generator output. Codex-
  specific paragraph in `.agents/skills/jc-review/SKILL.md` was wiped
  by regeneration; same content already lives in `.agent/commands/review.md`
  (Step 3 — Codex Preflight), so no information loss. Pre-commit retry
  needed once: first attempt blocked by format-check on an unrelated
  untracked `ONBOARDING.md` (owner-removed during session interruption);
  second attempt succeeded with no `--no-verify` use.

  Reviewer dispatch (parallel, post-fae57312):
  - code-expert: APPROVED WITH SUGGESTIONS (1 suggestion: pointer-canonical
    marker for the 6 thin canonicals — superseded by retirement plan, see below)
  - architecture-expert-fred: APPROVED. Wave 1 trust-boundary WARN
    concretely closed: --clear + regenerate now deterministic for all 86
    adapters. ADR-125 §2026-04-17 amendment permits canonical-skill ↔
    canonical-command composition; no layer violation. One non-finding
    observation: PDR-051/ADR-125 retire-`.agent/commands/` statement
    mismatches the live state where 6 canonicals still point at it.

### Wave 2 pivot — owner direction 2026-05-10T10:30Z

Owner re-framed Wave 2 after Item 1 landing: ".agent/commands still exists;
I expected that to be gone by now." Architecture-expert-fred's non-finding
observation became the keystone — Item 1's pointer-shape preserves the very
surface PDR-051 + ADR-125 §2026-05-09 retire.

Plan-time code-expert dispatch on the proposed full-retirement migration
(agentId a49d706db87f87853) returned APPROVED WITH SUGGESTIONS with five
critical findings, including reclassifying `chatgpt-report-normalisation.md`
from delete-only to inline (45 lines of substantive content not in canonical),
reversing commit order (validator refactor first), and fixing pre-existing
validator drift in Commit 1.

Surface deeper than initial estimate: validate-portability.ts (~80 LoC
refactor), agent-tools/src/core/health-probe-{shared,parity}.ts (~50 LoC
removal), .claude/settings.json (~30 perms), 5 ADRs, ~10 live docs.
Realistic cost: 3–4 focused hours.

Owner direction (post plan-time review): stop Wave 2 punch-list mode; create
plan-file for retirement; queue Items 3–6 as separate workstream. Honours
standing rules `feedback_no_speed_pressure` + `feedback_ground_state_before_planning`.

- [wave-2-pivot-to-plan] 2026-05-10T10:38Z — handoff:
  - `.agent/plans/agent-tooling/current/agent-commands-retirement.plan.md` (new)
  - This timing file's role for retirement work transfers to the plan's
    todo state and Reviewer Findings section.

Session end: 2026-05-10T10:38:36Z
Wave 2 elapsed: ~40 min active (interruption gap excluded). Item 1 actual
work + reviewer dispatch + plan-time review + plan authoring.

### Items 3–6 disposition

Still pending. Independent of retirement plan. Agent-tools quality work:
lock.ts wiring, rendering.ts extraction, parseFlags strict, clearGeneratedAdapters
tests. Surface to retirement plan's `tracked-follow-ups` or queue separately
to a fresh agent-tools quality plan.
