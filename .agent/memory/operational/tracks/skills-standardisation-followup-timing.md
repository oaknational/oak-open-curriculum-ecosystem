# Skills standardisation follow-up — execution timing

Branch: feat/mcp-graph-support-foundation
Session start: 2026-05-09T18:08:35Z
Session start (local): Sat May  9 19:08:35 BST 2026

## Items

- [item-1-canonical-rename] 2026-05-09T18:15:53Z — 901f113f (rename) + 4b931cca (re-add 6 adapter-only skills wiped by --clear)
- [item-2-validator-check] 2026-05-09T18:24:33Z — a8351b33
- [item-3-retire-surfaces] 2026-05-09T18:27:34Z — 939900c7 (mirror) +  absorbed deletions
- [item-4-reviewer-dispatch] 2026-05-09 — 17176e29 (BLOCKER fix + cheap WARNs)

## Reviewer dispatch

Three reviewers ran in parallel on generator.ts, checker.ts, lock.ts, bin shim, tests at HEAD 939900c7. Verdicts and dispositions:

### code-reviewer (agent ad0605e2…) — APPROVED WITH SUGGESTIONS

- WARN lock.ts dead code (`loadLockedSkillIds` not wired) — DEFERRED. Reason: integration is a separate workstream; module header phrasing tightening can land with the wiring change.
- WARN legacy SKILL.md fallback — APPLIED in 17176e29.
- WARN clearGeneratedAdapters has no test coverage — DEFERRED. Reason: 1-hour budget; defer to next agent-tools quality pass.
- WARN parseFrontmatter widening — APPLIED in 17176e29 (also raised by type-reviewer as BLOCKER).
- Suggestions on `clearGeneratedAdapters` ENOENT logging and `--check` error-message wording — DEFERRED with same reason.

### type-reviewer (agent a75a364b…) — AT-RISK → resolved

- BLOCKER `parseFrontmatter` returns wider value than declared — APPLIED in 17176e29 (fresh-construct return).
- WARN `lock.ts:128` untyped bracket access on `error.params` — DEFERRED. Reason: runtime guard makes this safe; fix lands with lock wiring.
- WARN test asserts wider shape — APPLIED in 17176e29 (test updated to match narrowed shape).

### architecture-reviewer-fred (agent a5613d0e…) — ISSUES FOUND, no critical violations

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
