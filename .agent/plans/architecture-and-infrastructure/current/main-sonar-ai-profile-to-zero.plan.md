---
name: "Main Sonar AI Profile To Zero"
overview: "Drive main's Sonar AI quality-profile backlog (398 issues, 48 rule classes) to zero — fix or genuine-false-positive only, no suppression."
status: "DECISION-COMPLETE — ready for execution on a dedicated branch"
lineage:
  serves_thread: main-sonar-ai-profile-to-zero
  serves_stream: architecture-and-infrastructure / code-quality
  strategic_choice: "quality gate green at zero under the deliberately-adopted Sonar AI profile"
  derives_from: "owner direction 2026-06-24; supersedes retired main-critical-sonar-remediation; folds in archived sonarjs-activation-and-sonarcloud-backlog intent (Phase 5)"
todos:
  - id: phase-0-tracking-home-and-triage
    content: "Phase 0: tracking home + full first-hand triage by cause-class."
    status: completed
  - id: phase-1-cli-security
    content: "Phase 1: agent-CLI path-injection (S8707 x3) — local canonical-path validator + 3 sites."
    status: pending
  - id: phase-2-regex-strategy
    content: "Phase 2: regex safety (S8786/S5843/S6035) — generator fixes, per-workspace regex home, semver import, per-site FP."
    status: pending
    depends_on: []
  - id: phase-3-test-integrity
    content: "Phase 3: test integrity (S2699 BLOCKER, S5914 x12, S5906 x34, S6551)."
    status: pending
    depends_on: []
  - id: phase-4-design-major
    content: "Phase 4: design MAJORs (S3923/S4144 first, then S107/S3358/S4624/S6564/S4782/S6571/singles)."
    status: pending
    depends_on: []
  - id: phase-5-mechanical-idiom
    content: "Phase 5: enable matching unicorn rules, lint:fix, codemod residue, lock at error."
    status: pending
    depends_on: []
  - id: phase-6-gate-closure
    content: "Phase 6: prove zero open issues + green gate on branch; merge via code-owner gate."
    status: pending
    depends_on: [phase-1-cli-security, phase-2-regex-strategy, phase-3-test-integrity, phase-4-design-major, phase-5-mechanical-idiom]
---

# Main Sonar AI Profile To Zero

**Last Updated**: 2026-06-24
**Status**: DECISION-COMPLETE — ready for execution on a dedicated branch
**Thread**: `main-sonar-ai-profile-to-zero`
**Supersedes**: the retired `main-critical-sonar-remediation` lane (archived to
`.agent/plans-old-archive/architecture-and-infrastructure/archive/superseded/`).

## Context

The owner **deliberately activated the Sonar AI quality profile** on
`oaknational_oak-open-curriculum-ecosystem`. `main`'s gate is **ERROR**, failing
two new-code conditions (`new_vulnerabilities_severity` 15/9 — the S8707 class;
`new_code_smells_severity` 15/14 — margin of one). The target is **zero issues**,
reached by **fix or genuine-false-positive only** — never suppression, never rule
disables; generated files fixed at the generator. The backlog is **398 issues
across 48 rule classes**, dominated by recently-activated SonarJS idiom rules, with
a small genuine core (security, ReDoS-adjacent regex, test integrity) inside it.
This supersedes the retired `main-critical-sonar-remediation` lane, whose hotspot
crisis is resolved (0 outstanding).

## End Goal · Mechanism · Means

- **End goal**: `main` Sonar gate green at **zero** open issues under the AI
  profile, with no regression path left open.
- **Mechanism**: triage by cause-class (48 classes, not 398 problems); fix at the
  correct layer (generator for generated code; per-workspace regex home for
  hand-written patterns; local validator for CLI security); lock idiom rules into
  the local lint gate so zero is durable.
- **Means**: six phases, each an independently shippable small PR
  (ship-independent, coordinate-dependent), on a dedicated branch off fresh `main`.

## Owner Decisions (closed 2026-06-24)

1. **FP dismissals: authorised on first-hand proof.** Mark Sonar issues
   FALSE_POSITIVE with a **site-specific rationale** once the defect is proven
   absent at that exact site — no per-site re-approval. Applies to the verified
   S101 ×3 and any S8786 site confirmed linear-safe. Disposition *determination*
   is the agent's; this authorises the *act*.
2. **Idiom mechanism: enable → autofix → lock at error.** Enable the matching
   `eslint-plugin-unicorn` rules in `oak-eslint`, run `lint:fix`, then escalate
   those rules to `error` once violations are clean. Folds in the
   `sonarjs-activation-and-sonarcloud-backlog` intent.
3. Earlier-agreed: regex home = per-workspace `src/lib/regex/`; `semver.ts`
   refactors to import from the `semver` package; tier ordering as below.

## Verified Findings (first-hand, 2026-06-24)

| Claim | Verification | Disposition |
|---|---|---|
| S8707 ×3 genuine `argv`→`fs` path-injection | Read all 3 sites; `ci-turbo-report.ts` `argv[2]`→`resolveSummaryPath` returns as-is (L150); `prevent-accidental-major-version.ts:37`; `analyze-elser-failures.ts` `validateInputs` checks existence only | **FIX** |
| S101 ×3 `paths`/`operations` not renamable | `codegen-core.ts:201` calls `openapiTS(new URL(...))` with **no options**; names are openapi-typescript's fixed output, consumed by internal imports | **FALSE_POSITIVE** (authorised) |
| `path-utils.ts` regexes are generated | Emitter is `typegen/paths/generate-path-utils.ts`; patterns like `/{([^}]+)}/g` are **linear-safe** | **FP candidate — confirm per-site** |
| No existing path-containment validator | grep + agent; closest `agent-tools/src/core/repo-root.ts` is an upward sentinel walk | **New local helper** |
| Only 4 sonarjs + 2 unicorn rules enabled | `oak-eslint/src/configs/recommended.ts:67-90` — only `prefer-includes` sits in the commented "Potentials" block; the other matching idiom rules must be **added** | **Enable matching rules (Phase 5)** |
| "~159 autofixable via lint:fix" | Agent estimate; unicorn ≠ Sonar engine | **Hypothesis — prove by dry-run** |

## Issue Inventory & Reproduction (do not depend on temp files)

The 2026-06-24 inventory is regenerable; do not rely on any scratch file. Sonar
project key: `oaknational_oak-open-curriculum-ecosystem` (resolved automatically
by the MCP integration; do not pass explicitly). Baseline: **398 issues** = 394
code smells + 3 vulnerabilities + 1 bug; **0 outstanding security hotspots** (100%
reviewed); reliability C (3.0), security C (3.0).

Regenerate the inventory at execution start (re-derive — counts drift with main):

1. Quality gate: `get_project_quality_gate_status(projectKey=<key>)` — expect
   ERROR on `new_vulnerabilities_severity` and `new_code_smells_severity` until
   Phase 1/5 land.
2. All open issues: `search_sonar_issues_in_projects(projects=[<key>],
   issueStatuses=["OPEN","CONFIRMED"], ps=500)`. The result is large; save to a
   file and aggregate with jq rather than reading inline:

   ```bash
   # rule x count x severity x sample-message
   jq -r '[.issues[] | {rule,severity,message}] | group_by(.rule)
     | map({rule:.[0].rule, n:length, sev:(map(.severity)|unique|join(",")),
            msg:.[0].message}) | sort_by(-.n)[]
     | "\(.n)\t\(.rule)\t[\(.sev)]\t\(.msg[0:70])"' <file>
   # per-issue sites: rule, severity, file, line, message
   jq -r '.issues[] | "\(.rule)\t\(.severity)\t\(.component|sub("^[^:]+:";""))\t\(.textRange.startLine)\t\(.message)"' <file>
   ```

3. Security-quality filter: add `impactSoftwareQualities=["SECURITY"]` (returns the
   3 S8707). Rule detail: `show_rule(key)`.

The full class→phase→disposition map and the verified priority-class sites are in
the Appendix.

## Phases (each = one PR; 1–5 independent, 6 depends on all)

### Phase 0 — Tracking home + triage — DONE

Repo plan, thread record, retired-lane archive, full 48-class triage table, and
first-hand triage of the three high-priority classes.

### Phase 1 — CLI security (S8707 ×3) — clears the gate's security condition

- **Validator home (verdict)**: a small canonical-path helper, *local* — not a new
  workspace package. Two agent-tools sites → one helper in `agent-tools/src/core/`
  (e.g. `safe-path.ts`); the one `oak-search-cli` site → a local helper. Extract to
  a shared `packages/core/*` package only at a **third workspace**
  (`consolidate-at-third-consumer`). `security-expert` confirms the design.
- **Helper behaviour**: `realpathSync` the base dir + trailing `sep`; `realpathSync`
  the candidate; assert `startsWith(baseDir + sep)` (partial-traversal safe); never
  `path.resolve` as validator. Order: transform → normalise → sanitise → use.
- **TDD cycles** (one commit each): helper unit tests (containment passes; `../`
  escape rejected; partial-prefix `…-secret` rejected) + helper; then apply at each
  of the 3 sites with a site test proving traversal is rejected.
- **Acceptance**: 3 sites validated; `security-expert` GO; Sonar S8707 → 0 on the
  branch. **Proof**: `unit` (helper + sites) + branch Sonar re-scan.

### Phase 2 — Regex safety (S8786 ×15, S5843 ×2, S6035 ×1)

Per verified sub-class:

- **Generated output** (`path-utils.ts` ×2): if confirmed linear-safe → **FP** with
  rationale; if genuinely super-linear → fix at `generate-path-utils.ts`,
  `pnpm sdk-codegen`, regen + test.
- **Generator source** (`codegen-core.ts` `postProcessTypesSource` ×5,
  `sitemap-scanner-core.ts`, `typegen/response-map/shared.ts`,
  `typegen/validation/cross-validate.ts`, `verify-docs.ts`,
  `bulk/generators/analysis-report-generator.ts`): per-site — anchor/bound the lazy
  `[\s\S]*?`/global patterns that are genuinely super-linear; regen + test where
  output changes.
- **Hand-written** — the S8786 sites `derive.ts`, `markdown.ts`,
  `reference-document-builders.ts` **plus the one S6035 site**
  `identity-audit-markdown.ts:28` (alternation → character class; a regex finding,
  different rule): move patterns into a per-workspace `src/lib/regex/` module — each
  named, documented, anchored/bounded, unit-tested for linear behaviour, reused at
  call sites. (S6035 is counted under its own row, not the S8786 ×15.)
- **Vendored** (`semver.ts:33`): refactor to import the pattern from `semver`.
- **Runtime-only** (`vercel-ignore-production-non-release-build.mjs:21`): simplify in
  place (consolidation N/A).
- **Acceptance**: every regex site fixed or FP'd with rationale; regex-home modules
  tested. **Proof**: `unit` + regen diff review + branch Sonar.

### Phase 3 — Test integrity (S2699 BLOCKER, S5914 ×12, S5906 ×34, S6551)

`test-expert`-reviewed. Each fix makes the test **describe a system state** (not
audit-shaped): add the missing assertion (S2699); replace always-true/false
assertions with state assertions (S5914); specific matchers over generic (S5906).
Test and any product change land atomically. **Proof**: `unit`/`integration` green;
`test-expert` GO; Sonar → 0 for these rules.

### Phase 4 — Design MAJORs

`S3923` (dead conditional) and `S4144` ×3 (identical bodies) **first** — verify each
is not a latent copy-paste bug before deduping. The largest class here is **`S7785`
×17** (promise-chain → top-level await) — semantic, not mechanical: preserve error
handling at each site, do not blind-autofix. Then `S107` ×7 (options-object),
`S3358`, `S4624`, `S6564`, `S6661` ×2 (object spread over `Object.assign`), `S4782`,
`S6571` (`unknown` widening — `type-expert`), and the singles (`S2301`, `S2310`,
`S6582`, `S7746`, `S6606`, `S1135` ×2 — resolve/remove the TODOs). Generated-surface
hits (some S3358/S4624/S6564) → fix at generator + regen. **Proof**: `unit` +
`type-expert`/`architecture` review + branch Sonar.

### Phase 5 — Mechanical idiom bulk (~250) + lock-in

1. Enable matching `unicorn` rules in `oak-eslint/src/configs/recommended.ts`
   (`prefer-string-replace-all`, `prefer-number-properties`, `prefer-node-protocol`,
   `prefer-object-has-own`, `prefer-at`, `prefer-includes`, `prefer-string-raw`,
   `prefer-regexp-exec`, `prefer-global-this`).
2. `pnpm lint:fix` **dry-run** to **prove** actual coverage (not the ~159 estimate).
3. Codemod / manual residue: `S7763` (export-from) ×34, `S7735` (negated
   conditions) ×31 with readability review, `S6353` (`\d`) ×10 → into the regex
   home, `S7786` (TypeError) ×10 semantic review, small classes.
4. Escalate the enabled rules to `error` **once clean** (no warn-debt; the
   `new-rules-start-warn` concern does not bite after violations are cleared).
   Consider per-rule `sonarjs.configs.recommended` adoption here.
5. `config-expert` reviews the config change.

**Acceptance**: Sonar idiom classes → 0; enabled rules at `error` with a clean
tree. **Proof**: `pnpm lint` clean + branch Sonar.

### Phase 6 — Gate closure

Root `pnpm check` green; branch Sonar gate **green at zero open issues** (prove
zero issues, not merely a green gate — the new-code window can mask). Merge to
`main` via **@jimCresswell code-owner approval** (no `--admin`, no `--no-verify`).
Run `/oak-consolidate-docs`; mine durable lessons; archive the plan.

## Quality Gates

Per cycle: focused deterministic test + relevant package `pnpm type-check` /
`lint` / `test`. Per phase: targeted gates. Before merge: root `pnpm check`
(canonical aggregate) + Sonar gate. See
`../../templates/components/quality-gates.md`.

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Generated-file fix ripples across many files | Generator-first; `sdk-codegen` + `build`; review regen diff; test output |
| unicorn autofix coverage < estimate | Dry-run proves coverage; codemod the residue; no reliance on the ~159 figure |
| Enabling rules surfaces NEW violations beyond Sonar's set | Fix all before escalating to `error`; `config-expert` review |
| FP misjudgement (dismissing a real defect) | First-hand proof + site rationale; `security-expert` checks no S8707 is wrongly FP'd |
| Concurrent `main` churn (observed dirty `oak-sdk-codegen` files; multi-dev) | Branch from fresh `main`; coordinate via claims/comms; never stage others' files |
| Sonar `*_severity` gate semantics opaque | Acceptance = zero open issues, not just gate-green |

## Foundation Alignment

`principles.md` (no disabled gates; fix root cause); `sonar-disposition-policy.md`
(fix or genuine-FP; no accept-as-valve); `schema-first-execution.md` +
`generator-first-mindset` (generated code fixed at the generator); `tdd-as-design.md`
/ `testing-strategy.md` (atomic test+code landing); `use-result-pattern`,
`no-type-shortcuts`, `lint-after-edit`.

## Plan-Body First-Principles Check

Fires before: (a) "fixing" any generated-file regex — verify it is *genuinely*
super-linear first (the linear-safe ones are FPs, not fixes); (b) bulk-applying
`S7735` negated-condition autofix — confirm it does not harm readability per-site;
(c) marking any FALSE_POSITIVE — the proof must be site-specific, not
class-by-analogy (precedent is not correctness).

## Readiness Reviewers

`assumptions-expert` (plan proportionality) before execution start; per-phase
specialists — `security-expert` (P1), `test-expert` (P3), `type-expert` (P4),
`config-expert` (P5); `release-readiness-expert` + docs/onboarding before the P6
merge.

## Non-Goals

No rule disables; no suppression-as-pressure-valve; no generated-file hand-edits;
not chasing PR-only duplication metrics; not the broader strategy/plan-estate work;
no changes to core MCP descriptor/alias types without owner participation.

## Lifecycle Triggers & Learning Loop

Per `../../templates/components/lifecycle-triggers.md`: register claims at each
phase start; coordinate on the shared checkout; close claims + refresh continuity
on handoff; run `/oak-consolidate-docs` at completion (Phase 6).

## Verification (end-to-end)

1. Per fix: run the new/affected tests and the touched package's
   `type-check`/`lint`/`test`.
2. Per phase: push the phase PR; the branch SonarCloud scan confirms that class → 0
   and no new findings (regression guard).
3. Final: root `pnpm check` green; Sonar project query shows **0 open issues** and
   the quality gate OK; merge via code-owner approval.

## Remaining Questions

**None blocking.** Both owner decisions (FP-dismissal authorisation; idiom-rule
enable-autofix-lock) are closed above. Residual per-site dispositions (which exact
S8786 are linear-safe FPs vs real fixes) resolve first-hand *during* execution
under the standing FP authorisation, with site-specific rationale.

## Appendix — Full 48-Class Triage (sums to 398) + Priority Sites

Snapshot 2026-06-24; **re-derive at execution start** (counts drift). Generated-file
sites in any class route FIX-GEN (fix the emitter) or FP, never hand-edit.

### Phase 1 — Security (FIX)

| Rule | n | Sev |
|---|--:|---|
| `tssecurity:S8707` | 3 | MAJOR (HIGH security) |

Sites: `agent-tools/src/ci/ci-turbo-report.ts` (taint from `argv[2]` L247 → readFile
L77); `agent-tools/src/version-guard/prevent-accidental-major-version.ts:37`;
`apps/oak-search-cli/scripts/analyze-elser-failures.ts:166`.

### Phase 2 — Regex safety (FIX / FIX-GEN / FP / refactor)

| Rule | n | Sev | Disposition |
|---|--:|---|---|
| `typescript:S8786` | 15 | MAJOR | per-site: FP if linear-safe, else FIX/FIX-GEN |
| `typescript:S5843` | 1 | MAJOR | refactor → import from `semver` (`semver.ts:33`) |
| `javascript:S5843` | 1 | MAJOR | FIX in place (`vercel-ignore-…build.mjs:21`) |
| `typescript:S6035` | 1 | MAJOR | FIX (`identity-audit-markdown.ts:28`) |

S8786 sites: `codegen-core.ts` 183-187 (gen source), `path-utils.ts` 9,24
(GENERATED → emitter `typegen/paths/generate-path-utils.ts`; linear-safe → FP),
`sitemap-scanner-core.ts:152`, `typegen/response-map/shared.ts:21`,
`typegen/validation/cross-validate.ts:19`, `verify-docs.ts:55`,
`bulk/generators/analysis-report-generator.ts:123`, `agent-identity/derive.ts:197`,
`practice-fitness/markdown.ts:113`, `reference-document-builders.ts:178`.

### Phase 3 — Test integrity (FIX)

| Rule | n | Sev |
|---|--:|---|
| `typescript:S5906` | 34 | MINOR (specific assertion) |
| `typescript:S5914` | 12 | MAJOR (always pass/fail) |
| `typescript:S2699` | 1 | BLOCKER (no assertion — `with-es-client.integration.test.ts:185`) |
| `typescript:S6551` | 1 | MINOR |

### Phase 4 — Design / semantic MAJORs (FIX; generated hits → FIX-GEN)

| Rule | n | Sev | Note |
|---|--:|---|---|
| `typescript:S7785` | 17 | MAJOR | promise-chain → top-level await (preserve error handling) |
| `typescript:S107` | 7 | MAJOR | options-object |
| `typescript:S3358` | 6 | MAJOR | nested ternary |
| `typescript:S6564` | 4 | MAJOR | redundant type alias |
| `typescript:S4144` | 3 | MAJOR | identical bodies — verify not a copy-paste bug |
| `typescript:S4624` | 3 | MAJOR | nested template literals |
| `typescript:S4782` | 3 | MAJOR | redundant `undefined`+`?` |
| `typescript:S6661` | 2 | MAJOR | object spread over `Object.assign` |
| `typescript:S3923` | 1 | MAJOR | dead conditional — possible latent bug |
| `typescript:S2301` `S2310` `S6582` `S7746` | 1 each | MAJOR | per-site |
| `typescript:S6571` | 1 | MINOR | `unknown` widening (type-expert) |
| `typescript:S6606` `S1135`×2 | 1,2 | MINOR/INFO | nullish-assign; resolve TODOs |

### Phase 5 — Mechanical idiom (enable unicorn → lint:fix → codemod residue → lock at error)

| Rule | n | Mechanism |
|---|--:|---|
| `typescript:S7781` | 54 | unicorn/prefer-string-replace-all |
| `typescript:S7780` | 35 | unicorn/prefer-string-raw |
| `typescript:S7763` | 34 | codemod (export…from) — no unicorn rule |
| `typescript:S7735` | 31 | codemod negated-condition (readability review) |
| `typescript:S7773` | 19 | unicorn/prefer-number-properties |
| `typescript:S6594` | 15 | unicorn/prefer-regexp-exec (regex-family; generated → FIX-GEN/FP) |
| `typescript:S7786` | 10 | semantic (TypeError) — review, not blind |
| `typescript:S6353` | 10 | `\d` over `[0-9]` → regex home (generated → FIX-GEN/FP) |
| `typescript:S7755` | 9 | unicorn/prefer-at |
| `typescript:S7765` | 9 | unicorn/prefer-includes |
| `typescript:S6653` | 8 | unicorn/prefer-object-has-own |
| `typescript:S7772` | 8 | unicorn/prefer-node-protocol |
| `typescript:S4323` | 7 | codemod (union→alias) |
| `typescript:S7776` | 5 | refactor (Set + .has) |
| `typescript:S7718` | 4 | codemod (catch naming) |
| `typescript:S7770` | 3 | codemod (Boolean) |
| `javascript:S7764` | 2 | unicorn/prefer-global-this |
| `typescript:S6644`×2 `javascript:S6644`×1 `S7737`×2 `S7748`×2 `S7747`×1 `S7758`×1 | 9 | codemod / small |

### FP (authorised — first-hand proof + site rationale)

| Rule | n | Rationale |
|---|--:|---|
| `typescript:S101` | 3 | openapi-typescript's fixed `paths`/`operations` interface names; `openapiTS` called with no options (`codegen-core.ts:201`); renaming breaks the external idiom + all consumers |

Class-count total: **398** = P1 3 + P2 18 + P3 48 + P4 54 + P5 272 + FP 3 (S101).
Re-derive to confirm before execution; counts drift with main.
