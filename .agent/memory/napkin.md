## Napkin rotation — 2026-04-11

Rotated at 523 lines after 6 sessions (2026-04-10m through
2026-04-11g) covering WS-0/1/2, pre-commit fixes, NC accuracy
and oak-kg namespace, attribution metadata, type extraction from
generated contracts, TS2430 gate fix (`Omit<Tool, '_meta'>`), and
quality gate hardening plan audit.
Archived to `archive/napkin-2026-04-11.md`. Merged 6 new entries
into `distilled.md`:
- Ground plans in verified data (Process)
- Never weaken gates to solve testing problems (Process)
- lint:fix can silently revert manual edits (Build System)
- Blanket replace_all corrupts mixed-case code (Build System)
- Verify reviewer fixes are on disk (Process)
- ESLint lint:fix can merge value+type imports was already present
Graduated 0 entries to permanent docs (distilled.md at 234 lines,
above 200 target — graduation deferred to next consolidation when
ADR-121 reconciliation provides a natural home for gate-surface
entries).
Previous rotation: 2026-04-10b at 570 lines.

---

### Session 2026-04-11g: Quality gate hardening plan audit

**Root cause: session started badly — planned from assumptions**
The session objective was to classify gate hardening by effort and
impact. The first plan attempt was rejected because it:
1. Assumed flaky tests were resolved (they weren't — never verified)
2. Proposed "forbidden-comment test exemptions" (weakening gates
   when the stated goal was strengthening them)
3. Skipped specialist plan review (user had to ask for it)

The structural failure: treated "produce a plan" as the task instead
of "verify the ground truth, then produce a plan." The correct
sequence: gather data → verify assumptions → draft plan → review
with specialists → present. Distilled as a process rule.

**Correction: ADR-121 drift is wider than the matrix**
The initial audit found 6 matrix errors. Specialist reviewers
(docs-adr, assumptions, architecture) expanded this to: 5 factual
errors + 2 verify-vs-mutate discrepancies + stale prose (Rationale,
Consequences, Design Principle #4 falsified) + ADR-147 contradiction
+ downstream doc drift (build-system.md, workflow.md,
accessibility-practice.md). The plan scope grew from "fix the
matrix" to "amend the ADR + reconcile the documentation estate."

**Surprise: eslint-disable remediation has zero progress**
The assumptions-reviewer surfaced that
`eslint-disable-remediation.plan.md` is "IN PROGRESS" but every
single todo is `pending`. Item 3 (promote no-eslint-disable to
error) is blocked indefinitely. This was a hidden assumption.

**Architectural decision: ESLint config standardisation is Tier 1**
Both assumptions and architecture reviewers independently flagged
that ESLint config standardisation was mis-tiered at Tier 3. It's
a prerequisite for all lint-rule promotions — must be Tier 1. The
effort estimate was also revised from 1-2 days to 2-3 days.

**Carry-forward items from archived napkin:**
- Generated tools have no human-friendly title (deferred, no plan)
- Synonym builders should become codegen-time (no plan)
- `static-content.ts` `process.cwd()` bug (tracked nowhere)
- Consolidate `security-types.ts` with `mcp-protocol-types.ts`
- Note contract re-export surface change for semver

**Open question: 3 owner decisions block ADR reconciliation**
1. Restore or redefine ADR-121 principle #4 (CI strict subset of
   pre-push)?
2. Is `pnpm check` verify-vs-mutate intentional or oversight?
3. Should `pnpm check` use `secrets:scan:all`?

---

### Session 2026-04-11h: Plan promotion and knip child plan

**Quality gate hardening promoted to current/**
Moved `quality-gate-hardening.plan.md` from `future/` to `current/`.
Owner decisions from session 2026-04-11g are resolved. ADR-121
reconciliation (`reconcile-gate-docs`) marked complete. Status updated
to reflect current lifecycle position. Updated both `future/README.md`
(struck-through row) and `current/README.md` (added quality-gate and
knip child plan rows).

**Knip triage: 904 findings across 8 categories**
Ran `pnpm knip` and captured verified data before planning:
- 96 unused files (dominated by oak-search-cli ground-truth-archive
  and hybrid-search experiments)
- 2 unused deps + 9 unused devDeps (likely real — manifest hygiene)
- 515 unused exports + 234 unused exported types (bulk is barrel
  re-exports in oak-search-cli and streamable-http)
- 45 config hints (stale ignores, drifted entry patterns)
- 2 unlisted binaries (lsof, ps — system utilities, not npm)
- 1 duplicate export (vitest.e2e.config.base.ts)

**Key open question: ground-truth-archive consumption**
~78 of the 96 unused files are in oak-search-cli, many in
`ground-truth-archive/`. Whether these are consumed via dynamic/glob
discovery or are genuinely dead is an open investigation — no
conclusion without evidence.

**Decision principle: evidence first, never presume false positive**
User directive: no finding may be labelled a false positive without
evidence-based proof. When investigation proves consumption via a
non-standard pattern, fix the pattern to be standard rather than
adding ignores. Reducing knip sensitivity is a gate weakness.

**Process learning: verified-data-first continues to pay off**
Running `pnpm knip` and recording the exact output before creating
the plan meant the plan has concrete counts, specific file lists,
and workspace-scoped triage. This avoids the session-2026-04-11g
anti-pattern of planning from assumptions.

**Owner input: stdio MCP server is deprecated**
The `apps/oak-curriculum-mcp-stdio` workspace is deprecated. Removing
it entirely is a valid remediation for its knip findings (2 unused
deps plus associated exports/files), but requires: (1) scanning for
useful learnings to extract, (2) removing all references except a
historical note. The HTTP server will eventually support stdio
transport but that is not a current priority — out of scope.

**Owner input: knip on all four gate surfaces**
At plan completion, knip must run on pnpm check, pre-commit, pre-push,
AND CI. This is stricter than the pre-push === CI principle alone —
pre-commit also gets knip so unused code never enters the repo at all.
