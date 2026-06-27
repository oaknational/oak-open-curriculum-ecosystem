---
name: "Main Sonar AI Profile To Zero"
overview: "Drive main's Sonar AI quality-profile backlog (392 issues at the 2026-06-26 re-derive, 48 rule classes) to zero — fix or genuine-false-positive only, no suppression. Phase 1 part-landed: the safe-path validator and 2 of 3 S8707 sites are fixed (PR #223, gate security condition green); the final site-3 is in PR #242."
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
    content: "Phase 1: agent-CLI path-injection (S8707). assertPathWithinBase + the 2 agent-tools sites LANDED (PR #223). Site-3 (oak-search-cli analyze-elser-failures.ts) done in PR #242, which also extracted the validator to the shared @oaknational/safe-path package (SSOT for all 3 sites). Merged 2026-06-27 (merge commit 3895b3f45)."
    status: completed
  - id: phase-2-regex-strategy
    content: "Phase 2: regex safety (S8786/S5843/S6035) — re-triaged first-hand 2026-06-27: 2 genuine fixes (sitemap O(n^2) on network XML; S6035 char-class) + 16 ACCEPT-with-rationale (internal/build-time/generated inputs; canonical parity-locked semver). PR #249 merge-ready."
    status: in-progress
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

**Last Updated**: 2026-06-26
**Status**: Phase 1 (S8707) COMPLETE — sites 1-2 + S4036 via PR #223, site-3 + the `@oaknational/safe-path` SSOT via PR #242 (merge commit `3895b3f45`, merged 2026-06-27). Phases 2-6 ready for execution on a dedicated branch off fresh `main`
**Thread**: `main-sonar-ai-profile-to-zero`
**Supersedes**: the retired `main-critical-sonar-remediation` lane (archived to
`.agent/plans-old-archive/architecture-and-infrastructure/archive/superseded/`).

## Context

The owner **deliberately activated the Sonar AI quality profile** on
`oaknational_oak-open-curriculum-ecosystem`. As of the 2026-06-26 re-derive,
`main`'s gate is **ERROR** on a **single** new-code condition
(`new_code_smells_severity` 15/14 — margin of one). The other condition the
original baseline failed, `new_vulnerabilities_severity` (was 15/9 — the S8707
class), is now **OK (0/9)**: PR #223 fixed 2 of the 3 S8707 sites, clearing the
new-code vulnerability score; the final site-3 is in PR #242. The target is **zero issues**, reached by **fix or
genuine-false-positive only** — never suppression, never rule disables; generated
files fixed at the generator. The backlog is **392 issues across 48 rule classes**
(re-derived 2026-06-26; was 398 on 2026-06-24), dominated by recently-activated
SonarJS idiom rules, with a small genuine core (security, ReDoS-adjacent regex,
test integrity) inside it. This supersedes the retired
`main-critical-sonar-remediation` lane, whose hotspot crisis is resolved (0
outstanding).

## Execution Log

- **2026-06-26** · PR #223 (`fix(agent-tools): contain CLI paths within the git dir (S8707 sites 1-2)`) — **Phase 1, 2 of 3.** Landed the canonical-path validator `agent-tools/src/core/safe-path.ts` (`assertPathWithinBase`) with unit tests, applied at both agent-tools sites (`ci-turbo-report.ts`, `prevent-accidental-major-version.ts`). Gate effect: `new_vulnerabilities_severity` 15 → 0 (OK). Remaining Phase-1 site: `apps/oak-search-cli/scripts/analyze-elser-failures.ts:166`. (Same PR also updated `docs/governance/sonar-disposition-policy.md`.)

- **2026-06-26** · PR #242 (`fix(search-cli): contain analyze-elser report path within diagnostics dir (S8707)`) — **Phase 1, site-3 (final).** Local `apps/oak-search-cli/src/lib/safe-path.ts` (`assertPathWithinBase`) + traversal test contains the `process.argv` report path within the `diagnostics/` dir before reading. `security-expert`: GO. Awaiting code-owner merge (merge, not squash). **Sonar PR gate:** `new_duplicated_lines_density` initially ERROR (35.9%) from the local safe-path copy. SonarCloud is a **REQUIRED** merge-gate check (the `Protect default branch` ruleset, not advisory), so the duplication was **resolved, not accepted**: the validator was extracted to a shared `@oaknational/safe-path` SSOT package (commit `bf7277465`) consumed by both agent-tools and search-cli, and both local copies were deleted. This is on-policy: the consolidate rule extracts a shared shape at the **second** consumer (oak-search-cli is the 2nd), and a security-critical validator must have one source of truth. All other PR conditions OK; zero new issues. On merge: S8707 → 0 (Phase 1 complete), `new_vulnerabilities_severity` stays OK.

### Re-derivation evidence (2026-06-26, first-hand)

Live `main`: **392** open issues across **49 distinct rule keys** (the "48 rule classes" figure collapses the `ts`+`js` variants of `S5843` and `S6644`; no new rule class has appeared). Quality gate **ERROR** on `new_code_smells_severity` 15/14 only; the other three conditions are OK. The 398 → 392 delta reconciles exactly: `S8707` −2 (PR #223), `S3358` −2, `S4624` −2, `S1135` −1, `S7786` +1 — the last four are incidental `main` churn (only #223 was Sonar-targeted). All other 44 classes and every priority site (`S8786` ×15, the `S2699` BLOCKER, `S5843`, `S6035`, `S101` ×3) are unchanged to the line. Method: `get_project_quality_gate_status` + `get_component_measures` + `search_sonar_issues_in_projects(issueStatuses=[OPEN,CONFIRMED], ps=500)` piped to `jq` group-by-rule. Regenerate the same way at execution start — counts drift; do not persist this snapshot as a dependency.

## End Goal · Mechanism · Means

- **End goal**: `main` Sonar gate green at **zero** open issues under the AI
  profile, with no regression path left open.
- **Mechanism**: triage by cause-class (48 classes, not the raw issue count); fix at the
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
3. Earlier-agreed: regex home = per-workspace `src/lib/regex/`. (The `semver.ts`
   "refactor-to-import from `semver`" was **superseded 2026-06-27 → ACCEPT**: `isValidSemver`
   deliberately uses the regex for strict semver §2, which the `semver` package's `valid()`
   does not enforce — see the §Verified Findings disposition.) Tier ordering as below.

## Verified Findings (first-hand, 2026-06-24)

| Claim | Verification | Disposition |
|---|---|---|
| S8707 ×3 genuine `argv`→`fs` path-injection | Read all 3 sites; `ci-turbo-report.ts` `argv[2]`→`resolveSummaryPath` returns as-is (L150); `prevent-accidental-major-version.ts:37`; `analyze-elser-failures.ts` `validateInputs` checks existence only | **FIX — 2 of 3 done** (PR #223 via `agent-tools/src/core/safe-path.ts`); `analyze-elser-failures.ts:166` remains |
| S101 ×3 `paths`/`operations` not renamable | `codegen-core.ts:201` calls `openapiTS(new URL(...))` with **no options**; names are openapi-typescript's fixed output, consumed by internal imports | **ACCEPT** (corrected 2026-06-27 from FALSE_POSITIVE: the generator's `postProcessTypesSource` hook *could* rename, so not a tool error; but they are the public SDK API + ecosystem convention → accept-with-rationale, applied server-side) |
| `path-utils.ts` regexes are generated | Emitter is `typegen/paths/generate-path-utils.ts`; patterns like `/{([^}]+)}/g` are **linear-safe** | **FP candidate — confirm per-site** |
| No existing path-containment validator | grep + agent; closest `agent-tools/src/core/repo-root.ts` is an upward sentinel walk | **New local helper** |
| Only 4 sonarjs + 2 unicorn rules enabled | `oak-eslint/src/configs/recommended.ts:67-90` — only `prefer-includes` sits in the commented "Potentials" block; the other matching idiom rules must be **added** | **Enable matching rules (Phase 5)** |
| "~159 autofixable via lint:fix" | Agent estimate; unicorn ≠ Sonar engine | **Hypothesis — prove by dry-run** |

## Issue Inventory & Reproduction (do not depend on temp files)

The 2026-06-24 inventory is regenerable; do not rely on any scratch file. Sonar
project key: `oaknational_oak-open-curriculum-ecosystem` (resolved automatically
by the MCP integration; do not pass explicitly). Baseline (re-derived 2026-06-26):
**392 issues** = 390 code smells + 1 vulnerability + 1 bug; **0 outstanding
security hotspots** (100% reviewed); reliability C (3.0), security C (3.0).
(2026-06-24 origin baseline: 398 = 394 + 3 + 1.) The −6 reconciles exactly: S8707
−2 (PR #223); S3358 −2, S4624 −2, S1135 −1, S7786 +1 (incidental `main` churn).

Regenerate the inventory at execution start (re-derive — counts drift with main):

1. Quality gate: `get_project_quality_gate_status(projectKey=<key>)` — as of
   2026-06-26, ERROR on `new_code_smells_severity` only (15/14); the
   `new_vulnerabilities_severity` condition is OK after PR #223 (re-confirm). It
   clears for good once Phase 4/5 land.
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

3. Security-quality filter: add `impactSoftwareQualities=["SECURITY"]` (as of
   2026-06-26 returns the 1 remaining S8707; was 3 before PR #223). Rule detail:
   `show_rule(key)`.

The full class→phase→disposition map and the verified priority-class sites are in
the Appendix.

## Phases (each = one PR; 1–5 independent, 6 depends on all)

### Phase 0 — Tracking home + triage — DONE

Repo plan, thread record, retired-lane archive, full 48-class triage table, and
first-hand triage of the three high-priority classes.

### Phase 1 — CLI security (S8707) — clears the gate's security condition — PART-LANDED (PR #223)

**Landed on `main` (PR #223 — 2 of 3 sites + validator):** the canonical-path
validator `assertPathWithinBase(candidate, baseDir, { realpath })` — `realpathSync`
base + trailing `sep`, `realpathSync` candidate, `startsWith(base + sep)`
containment (partial-prefix `…-secret` rejected; symlink-escape rejected; never
`path.resolve`), injectable realpath seam, full unit tests. Applied at both
agent-tools sites (`ci-turbo-report.ts`, `prevent-accidental-major-version.ts`).
It originally lived at `agent-tools/src/core/safe-path.ts`; PR #242 extracted it to
the shared `@oaknational/safe-path` package (SSOT). Live Sonar confirms those two
sites cleared and `new_vulnerabilities_severity` is now OK.

**Remaining (this plan's continuation):** the single `oak-search-cli` site
`apps/oak-search-cli/scripts/analyze-elser-failures.ts:166`. It is the **second**
workspace to need containment — the **second** consumer — so per the consolidate
rule the validator was extracted to a shared `@oaknational/safe-path` package
(PR #242, commit `bf7277465`) consumed by both agent-tools and oak-search-cli,
rather than copied. `security-expert` confirmed the design.

- **TDD cycle**: the validator's unit tests travel with the shared
  `@oaknational/safe-path` package (containment passes; `../`/symlink/partial-prefix
  escapes rejected); the site applies it at `analyze-elser-failures.ts`, containing
  the report path before any filesystem access.
- **Acceptance**: the remaining site validated; `security-expert` GO; Sonar S8707
  → 0 on the branch. **Proof**: `unit` (helper + site) + branch Sonar re-scan.

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
- **Vendored** (`semver.ts:33`): **ACCEPT** (corrected 2026-06-27 from refactor-to-import — `isValidSemver` uses the regex for strict semver §2, which `semver.valid()` does not enforce; S5843 is complexity, not ReDoS).
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
`S6582`, `S7746`, `S6606`, `S1135` ×1 — resolve/remove the TODO). Generated-surface
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
   home, `S7786` (TypeError) ×11 semantic review, small classes.
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

## Appendix — Full 48-Class Triage (sums to 392 at the 2026-06-26 re-derive; 398 origin) + Priority Sites

Snapshot 2026-06-26 (origin 2026-06-24); **re-derive at execution start** (counts drift). Generated-file
sites in any class route FIX-GEN (fix the emitter) or FP, never hand-edit.

### Phase 1 — Security (FIX)

| Rule | n | Sev |
|---|--:|---|
| `tssecurity:S8707` | 1 | MAJOR (HIGH security) |

Sites (1 of 3 remaining): the two agent-tools sites (`ci-turbo-report.ts`,
`prevent-accidental-major-version.ts:37`) are **FIXED in PR #223** via
`agent-tools/src/core/safe-path.ts`. **Remaining:
`apps/oak-search-cli/scripts/analyze-elser-failures.ts:166`** (`validateInputs`
checks existence only).

### Phase 2 — Regex safety (FIX / FIX-GEN / FP / refactor)

| Rule | n | Sev | Disposition |
|---|--:|---|---|
| `typescript:S8786` | 15 | MAJOR | per-site: FP if linear-safe, else FIX/FIX-GEN |
| `typescript:S5843` | 1 | MAJOR | ACCEPT (`semver.ts:33` — canonical strict-§2 pattern; corrected 2026-06-27 from refactor) |
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
| `typescript:S3358` | 4 | MAJOR | nested ternary (was 6; remaining: hand-written `logger/error-normalisation.ts:85,88` + generated `mcp-tools/…/get-sequences-{assets,questions}.ts` → FIX-GEN) |
| `typescript:S6564` | 4 | MAJOR | redundant type alias |
| `typescript:S4144` | 3 | MAJOR | identical bodies — verify not a copy-paste bug |
| `typescript:S4624` | 1 | MAJOR | nested template literals (was 3; remaining: `render-prompts-section.ts:36`) |
| `typescript:S4782` | 3 | MAJOR | redundant `undefined`+`?` |
| `typescript:S6661` | 2 | MAJOR | object spread over `Object.assign` |
| `typescript:S3923` | 1 | MAJOR | dead conditional — possible latent bug |
| `typescript:S2301` `S2310` `S6582` `S7746` | 1 each | MAJOR | per-site |
| `typescript:S6571` | 1 | MINOR | `unknown` widening (type-expert) |
| `typescript:S6606` `S1135`×1 | 1,1 | MINOR/INFO | nullish-assign; resolve TODO (S1135 was ×2 → ×1: `eslint.config.ts:123`) |

### Phase 5 — Mechanical idiom (enable unicorn → lint:fix → codemod residue → lock at error)

| Rule | n | Mechanism |
|---|--:|---|
| `typescript:S7781` | 54 | unicorn/prefer-string-replace-all |
| `typescript:S7780` | 35 | unicorn/prefer-string-raw |
| `typescript:S7763` | 34 | codemod (export…from) — no unicorn rule |
| `typescript:S7735` | 31 | codemod negated-condition (readability review) |
| `typescript:S7773` | 19 | unicorn/prefer-number-properties |
| `typescript:S6594` | 15 | unicorn/prefer-regexp-exec (regex-family; generated → FIX-GEN/FP) |
| `typescript:S7786` | 11 | semantic (TypeError) — review, not blind (was 10; +1 from `main` churn) |
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
| `typescript:S101` | 3 | openapi-typescript's fixed `paths`/`components`/`operations` interface names (generated `api-paths-types.ts` L1/L614/L3347); `openapiTS` called with no options (`codegen-core.ts:201`); renaming breaks the external idiom + all consumers |

Class-count total (2026-06-26 re-derive): **392** = P1 1 + P2 18 + P3 48 + P4 49 + P5 273 + ACCEPT 3 (S101, corrected 2026-06-27 from FALSE_POSITIVE). (2026-06-24 origin: 398 = 3 + 18 + 48 + 54 + 272 + 3.)
Re-derive to confirm before execution; counts drift with main.
