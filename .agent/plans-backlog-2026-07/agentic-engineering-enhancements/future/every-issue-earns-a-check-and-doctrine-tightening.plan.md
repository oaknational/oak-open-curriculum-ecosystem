---
status: complete
kind: strategic
completed: 2026-07-06 — Strand D executed and merged via PR 310 (Zodiac herds Spectrum); the
  run-quality-gates-required item remains an open owner/admin action
owner_decision_required: false
lineage:
  serves_thread: agentic-engineering-enhancements
  derives_from: a machine-local Claude plan-mode artefact under ~/.claude/plans/ (host-local and transient; 2026-07-06, Cricket lifts Echo — homed here so it survives the session)
---

# Every issue earns a check + PR-lifecycle & source-policy doctrine tightening

> **Decision-complete plan — now EXECUTED.** Authored 2026-07-06 (Cricket lifts Echo, 2fffa2)
> during a PR-lifecycle closeout session: Strands A/B/C/E landed that session, and Strand D
> plus Strand D-reflexive were handed to the successor (**Zodiac herds Spectrum, 72dd40**), who
> executed them the same day — **merged to `main` via PR 310 (`18a2d8c17`)**. The one open
> residual is the Strand D-reflexive owner/admin ruleset action (`run-quality-gates` as a
> REQUIRED status check). The owner approved the original plan and issued the escalating
> foundational directive that D1 encodes. This was a self-contained doctrine PR — no product
> code, all `.agent/` doctrine + one ADR.

## Context (why this exists)

A session investigating slow pre-push secret scans surfaced several things at once, and the owner
issued a foundational directive from them. The concrete fixes (Strands A–C, E) landed; the
**doctrine those lessons exposed** is Strand D, not yet written.

## Owner directives locked (2026-07-06, verbatim intent)

- **Every issue earns a check (foundational).** "ALL issues, however they were found —
  exploration, exercise, review, external comments — MUST have checks of the appropriate kind to
  prevent them, and that class of issue, happening again." The check targets the **class**, not
  just the instance.
- **The "appropriate kind" spectrum** — a check is required, but its kind fits the class:
  behaviour → unit/integration/E2E test; types → the type-check gate / `satisfies` anchor;
  structural → ESLint/boundary rule; process/CI-coverage → a required status check or validator;
  content-quality invariant → construction + human review (NOT a false-positive-prone grep test).
- **Source is TypeScript + ESM only.** "ALL source code in this repo MUST be TypeScript unless
  absolutely impractical. Shell is permitted where it significantly reduces effort. If an action
  requires a JS file, that file must be compiled from a TypeScript file. All JS files must be ESM,
  absolutely no CJS modules allowed."
- **Merge gate (corrected).** A truly-green PR = all checks green AND all review threads resolved
  (fixed, or rejected as inaccurate) → merges via a **normal non-admin `gh pr merge`**. `--admin`
  is FORBIDDEN. Proven twice this session (#306, #305 merged cleanly once threads resolved).

## DONE this session (evidence — do NOT redo)

- **Strand A — #306 gitleaks pushed-range fix: MERGED** (`62208200`). Pure tested module
  `agent-tools/src/secret-scan/compute-push-scan-ranges.ts` + `.unit.test.ts` (7 cases encoding the
  two Cursor-found bugs: deletion-only push → `[]` not fallback; new-ref → `--not --remotes=<remote>`
  scoped), thin CLI `run-push-secret-scan.ts`, `.husky/pre-push` glue, knip entry registered.
- **Strand A' — S4036 SonarCloud finding on `run-push-secret-scan.ts:80`: ACCEPTED** (owner-authorised,
  via the Sonar MCP). Context false-positive ratified by code-expert + security-expert: a local
  pre-push hook spawning `gitleaks` by name is not an exploitable PATH-injection vector (dev controls
  own PATH; an attacker who can write an earlier PATH dir already has code-exec as that user), and a
  PATH-walk "fix" is mitigation theatre (re-implements `execvp`'s search, leaves transitive `git`
  unpinned). Accept persists on `main` (issue `AZ83pQPTrWVnXXDJK8a8`, RESOLVED). **Owner may still want
  the rationale pasted as a comment** on that issue for the audit trail (the MCP status-change tool has
  no comment field).
- **Strand B — #305 docs closeout: MERGED** (`d14a989a`). Copilot prose-wrap nit on
  `napkin.md` reworded (`7b6c2c1f`); thread resolved with the "prose class is guarded by review, not a
  test" note.
- **Strand C — #300–302: CLOSED by owner** (Sonar bot PRs; quality-gate workflow suppressed for the
  App identity, so green checks were misleading; #300 had a confirmed strict-mode type-break).
- **Strand E — housekeeping: DONE.** `main` fast-forwarded to `d14a989a`; merged branches
  `fix/gitleaks-pre-push-scope` + `docs/session-housekeeping` deleted.
- **Sonar MCP gateway repaired.** The Docker MCP gateway's `sonarqube` server had a one-char URL typo
  (`sonarcould.io`) in `~/.docker/mcp/mcp-toolkit.db` → every call `UnknownHostException`. Fixed via
  `mcp__MCP_DOCKER__mcp-config-set {server:"sonarqube", config:{org:"oaknational", url:"https://sonarcloud.io"}}`.
  The Sonar MCP tools (`search_sonar_issues_in_projects`, `change_sonar_issue_status`,
  `get_project_quality_gate_status`, etc.) now work for future Sonar dispositions.

## REMAINING — Strand D: the doctrine PR (one PR, separable commits)

Branch off latest `main`. Order D1 → D2 → D3. Mind fitness budgets (noted per file). Doctrine-only;
the pre-commit/pre-push hooks run the FULL turbo gate, so **commits and pushes take minutes — run them
backgrounded** (grounded fact from this session).

**Commit D1 — "every issue earns a check" foundational principle + operationalisations:**

- `.agent/directives/principles.md` (currently ~567 lines, over its 525 soft limit — keep the addition
  TIGHT, push elaboration to the operationalising homes): add a foundational bullet in **§Code Quality**
  (near "NEVER disable checks" / "Quality gates") — broader than §Testing because it spans
  type/structural/process/content checks. State: every issue, however discovered, is not resolved until
  a check of the **appropriate kind** exists that would catch the instance AND its class. Include the
  appropriate-kind spectrum (above) and the fix-the-class requirement.
- `.agent/directives/testing-strategy.md` (target 380 / limit 450): operationalise for tests — a real
  defect earns a test that reproduces it (Red) before the fix (Green); when not product-behaviour, the
  equivalent appropriate check.
- `.agent/rules/pr-comments-resolve-and-recheck.md`: add a clause — a comment identifying a **real**
  issue is "fixed" only when fixed AND covered by a check that would have caught it and its class; a
  bare fix without the guarding check is an incomplete disposition. Cross-reference principles.md +
  testing-strategy.md.

**Commit D2 — merge-gate correction (pr-lifecycle skill):**

- `.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md` Phase 7 (~lines 130–144): refine the merge-gate model
  — the gate is *merge-button-active-for-a-non-admin* = all checks green AND all review threads resolved
  (fixed or rejected-as-incorrect); a truly-green PR merges via a normal non-admin `gh pr merge`.
  Correct any "a clean agent merge is prohibited" wording; KEEP `--admin`-forbidden and the
  owner-notification clauses; frame `BLOCKED` as "unresolved threads or a genuinely required review,"
  not "any agent merge." Check for a generated-adapter step; if adapters are pointer files, editing the
  canonical suffices.

**Commit D3 — TypeScript/ESM source policy:**

- `docs/architecture/architectural-decisions/168-*.md` §5a: amend the shell exception from "the only
  `.sh` exception is Husky entry points" to "shell is permitted where it significantly reduces effort
  (Husky entry points remain the canonical instance)," dated.
- New agent-firing rule `.agent/rules/source-is-typescript-esm-only.md` + **all four on-disk forms**
  (`.claude/rules/` pointer, `.cursor/rules/*.mdc` with `alwaysApply: true`, `.agents/` forwarder,
  `RULES_INDEX.md` row) in one commit: all source is TypeScript unless absolutely impractical; required
  JS is compiled-from-TS (no hand-authored JS); ESM only, no CJS; shell only where it significantly
  reduces effort. Cite ADR-001 (ESM-only) + ADR-168. Per `new-rule-vs-pdr-clause.md` the tie-break
  favoured a new rule here (a repo-architecture source-policy invariant, not a PDR).

## REMAINING — Strand D-reflexive (dogfood the principle on THIS session's findings)

| Issue (how found) | Preventing check of the appropriate kind | Status |
|---|---|---|
| #306 deletion-only fallback bug (review) | `compute-push-scan-ranges.unit.test.ts` deletion-only case | ✅ landed (Strand A) |
| #306 new-remote-ref scoping bug (review) | same unit test — new-ref scoping case | ✅ landed |
| #300 strict-mode type-break (review) | type-check gate exists; the CLASS guard is the row below | see below |
| **Class: a PR is mergeable though the quality gate never ran** (exploration) | **make `run-quality-gates` a REQUIRED status check** in the branch ruleset so no gate-bypassed PR (incl. App-authored bot PRs) is mergeable | ⏳ **OWNER/ADMIN ACTION — flagged, not executed by agent** |
| Mis-declared "green" off `gh pr checks` alone (exercise) | the D2 Phase-7 correction + `pr-comments` re-harvest clause; `pnpm agent-tools:pr-watch` surfaces unresolved threads | D2 above |
| S4036 PATH-walk "mitigation theatre" (review) | doctrine: local-dev-tooling spawn-by-name is a context-FP; disposition is grounded accept, not a re-implemented PATH search (captured in napkin/distilled 2026-07-06) | conserved |
| gitleaks full-history slowness (exploration) | pushed-range unit tests (Strand A) + `no-unbounded-host-load` covers the class | ✅ |
| 26 MB blob-history bloat (exploration) | deferred to the merged bloat plan (#307) — its session adds a committed-blob-size check | deferred (see #307) |

**`run-quality-gates`-required is the highest-value item** — it prevents the entire #300–302 class. It
is an owner/admin ruleset edit; surface it to the owner, do not attempt it as the agent.

## Verification (Strand D)

- markdownlint + prettier (pre-commit gate covers both).
- Rule-registration completeness: 4 on-disk forms + `RULES_INDEX.md` row present for the new rule (the
  `subagents:check` / repo validators gate this).
- No product-code change → the turbo gate should be cache-heavy but still runs (~minutes; background it).
- Merge each PR only when truly green (all checks + 0 unresolved threads), re-checked at the merge
  instant per `pr-comments-resolve-and-recheck`.

## Execution order

1. Strand D commit D1 (principle + operationalisations).
2. Strand D commit D2 (merge-gate skill correction).
3. Strand D commit D3 (ADR-168 amendment + new 4-form TS/ESM rule).
4. Push, drive to green, merge (non-admin).
5. Strand D-reflexive: surface `run-quality-gates`-required to the owner (do not execute the admin edit).
