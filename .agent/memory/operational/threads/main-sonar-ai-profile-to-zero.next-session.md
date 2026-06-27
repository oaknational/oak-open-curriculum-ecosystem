---
fitness_line_target: 400
fitness_line_limit: 700
fitness_char_limit: 45000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---

# main-sonar-ai-profile-to-zero Next Session

## Thread Identity

Thread: `main-sonar-ai-profile-to-zero`
Primary plan:
[`main-sonar-ai-profile-to-zero.plan.md`](../../../plans/architecture-and-infrastructure/current/main-sonar-ai-profile-to-zero.plan.md)
Supersedes the retired `main-critical-sonar-remediation` lane.

## Participating Agent Identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| claude-code | claude-opus-4-8-1m | 4b038c | Aspen tracks Root | analyst/plan-author | 2026-06-24 | 2026-06-24 |
| claude-code | claude-opus-4-8-1m | c57e0b | Lapwing weaves Downdraft | implementer | 2026-06-24 | 2026-06-25 |
| claude | claude-opus-4-8[1m] | c2b721 | Thyme lifts Compost | team-session-closer | 2026-06-25 | 2026-06-25 |
| claude | claude-opus-4-8 | 3b1f1c | Junk tracks Moorings | implementer | 2026-06-25 | 2026-06-25 |
| claude | claude-opus-4-8[1m] | 547586 | Alder tracks Topsoil | implementer | 2026-06-26 | 2026-06-26 |

## Landing Target For Next Session

**Phases 1 and 2 COMPLETE; the BLOCKER and all HIGH/regex classes are dispositioned.**
Phase 1 (S8707 ×3 + S4036) merged via PR #223 + #242 (`3895b3f45`); the S2699 test-assertion
BLOCKER + the S101 ×3 ACCEPT via **PR #246** (`5054cd9a0`); **Phase 2 (18 regex findings) via
PR #249** (`fix/sonar-phase2-regex-safety`, merge-ready 2026-06-27). **NEXT: Phase 3
(test-integrity).** Authoritative pickup is the §"2026-06-27 (Gull tracks Eyrie)" block and the
§"Next safe step — PHASE 3" block in the Lane State section below. Re-fetch live Sonar at start —
counts here drift.

## Lane State

**Objective**: drive `main`'s Sonar AI quality-profile backlog to **zero** —
fix or genuine-FP only, no suppression, generated files fixed at generator.

**Done this session (2026-06-24, Aspen tracks Root)**:

- Retired the stale `main-critical-sonar-remediation` lane (plan + evidence →
  `plans-old-archive/.../superseded/`; thread record → `retired/` with banner;
  `repo-continuity.md` tables updated).
- Authored this tracking home + the full 48-class triage table; the plan is now
  **DECISION-COMPLETE and owner-approved** (six phases, two owner decisions closed:
  FP-dismissal authorised on first-hand proof; idiom rules enable→autofix→lock-at-error).
- First-hand triage of the three HIGH-priority classes:
  - **S8707 ×3** (agent-CLI path-injection) — all genuine; fix = canonical-path
    validation. Gate-blocking (new vulnerabilities condition).
  - **Regex safety** (S8786 ×15, S5843 ×2, S6035 ×1) — five sub-classes;
    `path-utils.ts` is GENERATED (fix at generator); `semver.ts:33` is a
    vendored canonical pattern (accept/refactor candidate); hand-written sites
    are the per-workspace consolidation targets.
  - **Test integrity** (S2699 BLOCKER, S5914 ×12, S5906 ×34, S6551 ×1).

**Owner decisions — all CLOSED (2026-06-24, plan is DECISION-COMPLETE)**:

- Regex home: **`src/lib/regex/`** per workspace, hand-written sites only (not
  generated / generator-source / vendored). [owner: "agree to all"]
- `semver.ts:33`: the earlier "refactor-to-import from `semver`" was **superseded
  2026-06-27** — first-hand review found `isValidSemver` deliberately uses the regex for strict
  semver §2 (the `semver` package's `valid()` accepts a `v` prefix, which §2 rejects). Dispositioned
  **ACCEPT** (canonical vendored pattern; S5843 is complexity, not ReDoS).
- `S101 ×3`: **superseded 2026-06-27 — corrected FALSE_POSITIVE → ACCEPT.** The file IS generated,
  but the generator's `postProcessTypesSource` hook *could* rename the roots, so it is NOT a tool
  error (FP would be suppression). They are the public API of `@oaknational/sdk-codegen` + the
  universal openapi-typescript convention, so a rename is a breaking change for a MINOR cosmetic
  rule → **ACCEPT-with-rationale**. (A subagent second-opinion + first-hand verification drove the
  correction; see napkin 2026-06-27.)
- **Disposition bar (owner-ratified 2026-06-27, AskUserQuestion):** genuine code fix is the
  default; a site-specific architectural tension is a legitimate **ACCEPT-with-rationale**;
  **FALSE_POSITIVE is reserved for true tool errors only.** This supersedes the earlier
  "fix or genuine-FP only" framing in §Objective.
- Idiom rules: **enable → autofix → lock at error**.

Residual (non-blocking, resolved first-hand during execution): which exact S8786
sites are linear-safe FPs vs real fixes.

**Coverage note**: HIGH-priority classes read per-site first-hand;
design-MAJOR representative; mechanical-MINOR dispositioned at class level
(per-site confirmation collapses into the fix act). Full per-site first-hand of
every MINOR site is available on request.

**Current state (2026-06-26, Alder tracks Topsoil)**: Phase 1 is COMPLETE in
**PR #242** (branch `fix/sonar-site3-test-demask-local-edits`, off fresh `main`
`f0b87a2e3` — NOT the old `fix/sonar-s8707-cli-path-injection`, which was the stale
pre-squash #223 branch, 23 behind main; retire it). #242 (12 commits, all PUSHED,
**Sonar gate OK** — duplication 0%, all conditions pass, CI green) contains: site-3
containment fix; the validator extracted to a shared **`@oaknational/safe-path`**
SSOT package (`packages/core/safe-path`) — the required Sonar
`new_duplicated_lines_density` gate forced DRY at the **2nd** consumer; both local
copies deleted; the two `--passWithNoTests` de-masks (graph-ingest, graph-project);
plan/prompt/napkin/vscode updates; and the `consolidate-at-third-consumer` guidance
correction (extraction is at the **second** consumer — rule content, practice-index,
and closed-shape descriptions fixed; filename retained as a stable id; a clean rename
is a tracked follow-up). Worktrees `oak-pr-watch` and `oak-pilot-ws-e`: verified retire-only
(keepers already merged via #222/#224; nothing net-new).

**Review fixes LANDED (2026-06-26T20:35Z, Alder tracks Topsoil)**: the #242 bot-review
fixes are committed and the tree is green — (a) `12bad766e` analyze-elser contain-first
(Codex P2: dropped the redundant `existsSync(reportPath)`; contain the untrusted argv
path with `assertPathWithinBase` before any fs access; extracted `analyseReport()` so
`main()` clears `max-statements` — and `analyseReport` returns `void`, sidestepping the
`consistent-return` error that a `string`-returning resolver-helper extraction first
introduced), (b) `b0e70e375` safe-path test `./index`→`./index.js` (Copilot), (c) plan
prose → SSOT framing (Copilot) in the docs commit alongside this record. Verified
first-hand: `search-cli` lint 0 errors + type-check clean, `safe-path` 6/6. (The 160
`search-cli` lint *warnings* are pre-existing repo-wide ADR-088 `no-throw-statement`
migration warnings in unrelated files — zero added by this work.)

**Phase 1 MERGED (2026-06-27, Alder tracks Topsoil)**: #242 merged to `main` as **merge
commit `3895b3f45`** (a real two-parent merge, not a squash — all commits preserved;
auto-release 1.36.1 followed as `c69aa57ea`). All 5 review threads resolved AND replied
with per-thread dispositions; disposition summary `#issuecomment-4813412293`; CI green;
the `.agent/` semantic merge-impact analysis was clean (main unchanged since the branch
base, empty intersection — no manual merge needed). Claim `6bded07b` closed.

**Correction (knowledge integrity):** #242 merged `CLEAN` with no approval **because it was
agent-authored under the owner's shared gh auth and the sole code owner IS the author**
(GitHub auto-satisfies the code-owner gate and forbids self-approval) — the documented
author-dependent gate behaviour, NOT because "these paths aren't code-owner-gated." CODEOWNERS
is `* @jimCresswell`; every path is gated. An earlier note here claimed path-scoping — that was
a misdiagnosis (see [[project_main_merge_gate_codeowner]]).

**2026-06-27 (Gull tracks Eyrie, 483d97) — BLOCKER + S101 + Phase 2 landed:**

- **PR #246** (`5054cd9a0`, merged): S2699 BLOCKER fixed (`with-es-client.integration.test.ts`
  — explicit `.resolves.toBeUndefined()` assertion) + S101 ×3 dispositioned ACCEPT (see corrected
  decision above).
- **PR #249** (`fix/sonar-phase2-regex-safety`, merge-ready): Phase 2, 18 regex findings
  re-triaged **first-hand**. **2 genuine fixes** — `sitemap-scanner-core` `extractLocs` (real
  O(n²) triple-overlap on network XML; dropped redundant flanking `\s*`) and S6035
  `(?:—|\))`→`[—)]`. **16 ACCEPT-with-rationale** (server-side): 14 S8786 on
  internal/build-time/generated inputs (path strings, generated JSDoc, slugs, repo markdown — JS
  has no possessive quantifiers, so an atomic-emulation fix renumbers capture groups + forces
  consumer changes, disproportionate for non-adversarial input) + 2 S5843 canonical semver
  (complexity; the Vercel `ignoreCommand` `.mjs` copy is irreducible — runs before `pnpm install`,
  no node_modules/dist, parity-test-locked). **Key lesson** (napkin 2026-06-27): a ReDoS subagent's
  blanket "all 18 are false-positives" was WRONG — Sonar S8786's criterion is unanchored
  multi-position retry (O(n²) on non-match); these are genuine, not tool errors. Read the rule's
  own criterion before dispositioning.
- Backlog: 391 → ~370 open after Phase 2.

**Next safe step — PHASE 3 (test-integrity), for a fresh agent:** open a fresh branch off `main`
and re-fetch live Sonar. The lane: **S5914 ×12** (assertion always succeeds/fails — genuine test
defects, clear fixes; cluster in
`oak-sdk-codegen/code-generation/typegen/search/generate-subject-hierarchy.unit.test.ts` ×7 and
`.../typegen/validation/cross-validate.unit.test.ts` ×2, plus 3 singletons), **S5906 ×34**
(prefer-specific-assertion — improvements, spread across ~22 files), **S6551 ×1** (generated
`sdk-error-types.ts` — fix at generator or accept). Apply the **test-expert describe-vs-audit
lens** per site under the disposition bar above. A warm worktree `oak-sonar-zero` exists; the
empty branch `fix/sonar-phase3a-s5914-test-assertions` (off `main`) is already cut for the S5914
tranche. Then Phase 4 (design-MAJOR ~27) and Phase 5 (idiom-MINOR ~250 bulk, mostly ESLint
autofix) per the plan's triage table.

## Watch (not mine; flagged)

`oak-sdk-codegen` generated/schema files showed as modified mid-session
(parallel process; not this session's edits). Do not stage them in this lane.
