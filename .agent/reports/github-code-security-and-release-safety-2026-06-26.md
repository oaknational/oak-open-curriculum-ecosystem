# GitHub Code-Security & Release-Safety Assessment

**Status**: DRAFT — names decisions, does not make them (security posture and
release automation are owner decisions). Recommendations are tiered; the
auto-merge tier is explicitly gated on the CI-adequacy verdict in §6.
**Date**: 2026-06-26
**Author**: Wombat wakes Eventide (claude-opus-4-8[1m])
**Trigger**: Owner directive (2026-06-26) — investigate Dependabot and related
GitHub code-security features to maximise safety, security, and quality; and if
any move toward automatic merges implies automatic release of the MCP app to
production, assess whether CI is strong enough to prove a repo state is
release-safe.

> Method note: every claim about *this repo's* pipeline below was read
> first-hand from the named files/configs. GitHub-feature mechanics (§5, §7)
> are verified against current official docs; confidence and sources are noted
> per section. Sub-agent research was critically assessed before inclusion.

---

## 1. Executive summary

- **The repo already auto-releases to production.** For a *releasable* commit
  (`fix`/`feat`/`perf`/breaking), `merge to main → CI green → semantic-release
  bumps the root version → Vercel deploys the MCP app to prod`. The **only**
  human judgment gate in that chain is the **PR code-owner review**
  (`@jimCresswell`). CI + the version-advance check are the technical gates.
- **Therefore "auto-merge" is not a new capability — it is the removal of the
  one human gate.** Enabling unattended auto-merge (e.g. for Dependabot PRs)
  in a way that removes the code-owner review would make **CI the sole arbiter
  of production safety**. That is the pivot the owner correctly identified.
- **CI is strong but not yet sufficient to be the sole arbiter.** It is
  comprehensive on build/type/lint/unit/e2e/ui, but has concrete gaps (§6):
  the **WCAG accessibility suites are not run in CI**, the merge gate does not
  require the branch to be up-to-date with `main` (semantic-merge skew), and
  there is **no post-deploy verification or automated rollback**.
- **Net recommendation:** adopt the Tier-1 pure-win security features now;
  close the Tier-2 CI/release gaps next; treat unattended auto-merge-to-prod
  (Tier 3) as **NOT YET** — safe only once the Tier-2 gaps are closed and,
  even then, scoped narrowly with the code-owner gate retained or replaced by
  a merge queue + post-deploy verification.

---

## 2. Current security & quality posture (first-hand)

Already in place (verified):

| Capability | State | Source |
| --- | --- | --- |
| CodeQL code scanning | Active; **required** check; ruleset blocks medium+ security / error alerts | `main` ruleset `code_scanning` + `required_status_checks` |
| SonarCloud | Active; **required** check; `code_quality` rule at `warnings` severity | ruleset; `sonarqubecloud` PR comment |
| gitleaks secret scan | Runs in CI (`pnpm secrets:scan`) and pre-commit | `ci.yml` step "Run secret scan"; root `package.json` |
| Dependabot | npm + github-actions, weekly, all-deps grouped, PR limit 5; now ignores `@types/node` major | `.github/dependabot.yml` |
| Branch protection ruleset | "Protect default branch": code-owner review required, non-fast-forward, deletion blocked, 3 required checks | ruleset `13402577` |
| CODEOWNERS | `* @jimCresswell` (whole repo) | `.github/CODEOWNERS` |
| Copilot code review | Auto-review on push (`review_on_push: true`) | ruleset `copilot_code_review` |
| Tag protection | "release tag protections" ruleset | ruleset `17845755` |

Required status checks to merge to `main`: **CodeQL**, **SonarCloud Code
Analysis**, **run-quality-gates**. (Vercel deploy and Cursor Bugbot run but are
**not** required.) `required_approving_review_count: 0` but
`require_code_owner_review: true` — so every PR needs `@jimCresswell`'s
approving review because CODEOWNERS owns the whole tree.

**Repo is public; org plan is Team (65 seats).** Public visibility means every
GitHub code-security feature in §5 is **free** here. Authoritative live state
(`gh api repos/…/security_and_analysis`): secret scanning **enabled**,
Dependabot security updates **enabled**, Dependabot alerts **enabled**;
**push protection DISABLED**; non-provider patterns, validity checks, and AI
detection disabled. So the obvious free wins are push protection (§7 Tier-1)
and the not-yet-present dependency-review action.

---

## 3. The release/deploy pipeline (first-hand)

Read from `.github/workflows/ci.yml`, `release.yml`, `.releaserc.mjs`,
`apps/oak-curriculum-mcp-streamable-http/vercel.json`, and the Vercel
ignore-gate `runtime-only-scripts/vercel-ignore-production-non-release-build.mjs`.

1. **PR / push to `main`** → `ci.yml` `run-quality-gates` runs: secret scan,
   format, markdownlint, subagents, portability, repo-validators, shell lint,
   then turbo `sdk-codegen build type-check lint test test:e2e test:ui`, then
   knip + depcruise. Network-free per ADR-161.
2. **On CI success on `main`** → `release.yml` runs `semantic-release`.
   `.releaserc.mjs` uses default `commit-analyzer` rules: only
   `fix`/`feat`/`perf`/breaking trigger a release. semantic-release bumps the
   **root** `package.json` version + SDK version, writes CHANGELOG, commits
   `chore(release): X [skip ci]`, tags, and creates a GitHub release.
   **Both `@semantic-release/npm` plugins set `npmPublish: false`** — nothing
   is actually published to npm (the file's header comment claims it publishes
   the SDK; this is a config/comment drift worth correcting).
3. **Vercel production gate** — the MCP app (`private: true`) deploys via
   Vercel's Git integration. The `ignoreCommand` (ADR-163 §10 truth table)
   **cancels** a production build on `main` unless the root `package.json`
   version has **advanced** beyond the last deployed version. So prod deploy
   happens precisely on the semantic-release version-bump commit.

**Consequence for the dependency PR (#227):** it is a `chore(deps)` commit →
not releasable → merging it triggers **no release and no prod deploy**. The
updated deps land on `main`, are re-validated by CI-on-main, and ship with the
next `fix`/`feat` release.

---

## 4. Where the human is in the loop today

```text
PR opened
  → CI (CodeQL, SonarCloud, run-quality-gates)  [technical gate]
  → code-owner review by @jimCresswell          [HUMAN judgment gate]
  → merge to main
  → CI on main
  → semantic-release (if fix/feat/perf)          [version bump]
  → Vercel prod deploy of MCP app                [no further gate]
```

The single human judgment gate is the **code-owner review**. Everything after
merge is automatic. This is the load-bearing fact for the auto-merge question.

---

## 5. GitHub code-security feature landscape (verified, public-repo framing)

> **Licensing premise corrected by first-hand check:** this repo is
> **public** (`gh api … .visibility == "public"`). GitHub Advanced Security
> was split (2025) into paid **Code Security** and **Secret Protection** SKUs,
> but **all of these features are free for public repositories** — so the
> "paid licence" gate that applies to private repos does **not** apply here.
> Org plan is **Team** (65 seats); for a *public* org repo that does not block
> any feature below (merge queue's Enterprise-Cloud gate is private-repo-only).
> Mechanics below are verified against current `docs.github.com`; sub-agent
> findings were re-checked and corrected where they assumed a private repo.

**Live state (authoritative, `gh api repos/…`):** `secret_scanning` enabled;
`dependabot_security_updates` enabled; Dependabot alerts enabled;
**`secret_scanning_push_protection` DISABLED**; `non_provider_patterns`,
`validity_checks`, `ai_detection` disabled.

| Feature | Mechanics (verified) | Relevance here |
| --- | --- | --- |
| **Dependabot version updates** | `.github/dependabot.yml`; `groups`, `ignore`, `versioning-strategy`, `open-pull-requests-limit` (default 5). **`cooldown`** (minimum package age) GA 2025-07-01, version-updates only — delays adopting brand-new releases. | Grouping + `@types/node` ignore already set (#227). `cooldown` is a new supply-chain win (see §7). |
| **Dependabot security updates + alerts** | Alert = dependency-graph match vs GitHub Advisory DB; security update PRs bump only vulnerable deps to min-patched. Auto-triage rules can dismiss noise. | Both **already enabled**. Auto-triage presets available (free for public). |
| **Dependabot auto-merge** | Native "Allow auto-merge" + `dependabot/fetch-metadata` + `gh pr merge --auto`. Merges **when** required checks + required reviews pass — **cannot bypass** branch protection / CODEOWNERS (verified verbatim; matches my ruleset reading). Dependabot workflows get a **read-only token, no Actions secrets** by default. | Pivotal — see §6/§7. Even if enabled, current ruleset still waits for code-owner approval. |
| **Code scanning (CodeQL)** | Default (UI) or advanced (workflow) setup. Gating via **required status check** and/or **ruleset merge protection**. | **Both** are configured here (ruleset `code_scanning` rule + `CodeQL` required check) — stronger than the "legacy status check" the docs generalise. |
| **Secret scanning + push protection** | Push protection **blocks pushes containing secrets**. Repo/org/enterprise scope. Free for public. | Secret scanning ON; **push protection OFF** → Tier-1 win. |
| **Dependency review action** | `actions/dependency-review-action@v4` on `pull_request`; `fail-on-severity`, `deny-licenses`, `fail-on-scopes`. Needs dependency graph (on). Free for public. | **Not present** — would gate vulnerable/licence-bad deps at PR time (today only caught post-merge by alerts). Tier-1. |
| **Rulesets / branch protection** | Most-restrictive-wins; ruleset bypass is **explicit** (no implicit admin escape) — stronger than classic. Required reviews, CODEOWNERS, require-up-to-date. | Active ("Protect default branch"). `strict_required_status_checks_policy: false` → see §6 gap 2. |
| **Merge queue** | Serialises merges; tests the *post-merge* state; removes "up to date" thrash. **Available for org-owned public repos on any plan.** Caveat: required-check workflows must add the `merge_group` trigger or the merge hangs; built-in `GITHUB_TOKEN` cannot enqueue. | Available here. Candidate Tier-2 (esp. before auto-merge). |
| **Artifact attestations** | Signed build provenance (`actions/attest`), SLSA L2+. Free for public. | Optional supply-chain hardening for built artefacts. |
| **Private vuln reporting + advisories** | "Report a vulnerability" intake; CVE issuance (GitHub is a CNA). Free for public. | Low effort; worth enabling for a public repo. |

*Unverified/ambiguous (per the research pass, flagged honestly):* exact GHAS
unbundling date; full `versioning-strategy` per-ecosystem matrix; whether
`GITHUB_TOKEN` approvals count toward required reviews (strongly implied, no
verbatim doc); a reported npm `cooldown` bug; `actions/attest` vs
`attest-build-provenance` naming. None of these change the recommendations.

---

## 6. CI-adequacy assessment — is CI strong enough to be the sole release gate?

This is the pivotal question for any auto-merge-to-prod move. Assessed
first-hand against `ci.yml` and the ruleset.

**What CI proves well today:**

- Build, type-check, lint (0 errors tolerated for errors; warnings tracked),
  unit + integration tests, E2E (`test:e2e`), visual/UI (`test:ui`), knip,
  depcruise, secret scan, format, markdownlint, repo-validators, portability,
  sub-agent validation. CodeQL + SonarCloud gate security/quality.
- Reproducible and network-free (ADR-161), so a green local `pnpm check`
  implies green CI.

**Concrete gaps (each is a release-safety risk if CI becomes the sole gate):**

1. **Accessibility suites are not in CI.** `ci.yml` runs `test test:e2e
   test:ui` but **not** `test:widget`, `test:a11y`, `test:widget:ui`,
   `test:widget:a11y`. These Playwright suites are network-free (local server +
   chromium, like the `test:ui` suite CI *does* run), so the omission is a
   divergence from ADR-161's stated CI scope (`pnpm check`) and from the local
   `test:all`. Given the org mandates WCAG 2.2 AA, **a11y regressions can reach
   prod without any CI signal.** P1 to close before any auto-merge.
2. **Merge does not require the branch to be up-to-date with `main`**
   (`strict_required_status_checks_policy: false`). Two independently-green PRs
   can merge into a `main` that neither tested together (semantic-merge skew) —
   the classic "both green, main breaks" failure. A **merge queue** (or
   strict-up-to-date) closes this; it matters far more once human review is
   removed.
3. **No post-deploy verification or automated rollback.** Nothing runs against
   the deployed prod URL after a Vercel prod deploy (e2e/smoke run in CI
   against the in-process app, not prod). If a release is bad, detection is
   manual. A post-deploy smoke/health gate + documented/automated rollback is
   the compensating control that makes auto-release tolerable.
4. **Coverage is run but (apparently) not gate-enforced**, and mutation tests
   (`pnpm mutate`) are not in CI. Lower priority, but relevant to "prove a
   state is safe."
5. **semantic-release `npmPublish: false` vs header-comment drift** — not a
   safety gap, but the release config's stated intent and behaviour disagree;
   worth reconciling so the release contract is unambiguous.

**Verdict:** CI is a strong *assistive* gate behind a human reviewer, but **not
yet sufficient to be the sole arbiter of production safety.** Gaps 1–3 must be
closed before unattended auto-merge-to-prod could be considered safe.

---

## 7. Recommendations (tiered)

All Tier-1 items are **free** here (public repo) and low-risk. Each is a
separate small PR, not part of #227.

**Tier 1 — pure-win, adopt now:**

1. **Enable secret-scanning push protection** (currently OFF). Blocks secrets
   before they enter history; gitleaks already runs *after the fact*, this
   stops them at the push. Settings → Code security → Push protection.
2. **Add the dependency-review action** to the PR workflow
   (`actions/dependency-review-action@v4`, `fail-on-severity`, optional
   `deny-licenses`). Gates *newly-introduced* vulnerable/licence-bad deps at PR
   time — today they're only caught post-merge by Dependabot alerts.
3. **Add Dependabot `cooldown`** (minimum package age) to `dependabot.yml` so
   brand-new releases age before adoption — mitigates compromised-fresh-publish
   supply-chain attacks. (Verify the npm cooldown behaviour; a community bug was
   reported — UNVERIFIED.)
4. **Consider** enabling secret-scanning non-provider patterns + validity
   checks (broader coverage, free).
5. *Done in #227:* Dependabot grouping + `@types/node` major-ignore +
   tree-wide `@types/node` 24 override.

**Tier 2 — quality/safety hardening (close before any auto-merge):**

1. **Close the CI accessibility gap (P1).** Add `test:widget test:a11y
   test:widget:ui test:widget:a11y` to the `ci.yml` turbo run — they are
   network-free and chromium is already installed for `test:ui`. Without this,
   **WCAG 2.2 AA regressions reach prod with no CI signal**, despite the org
   mandate. This is the single highest-value gap.
2. **Adopt a merge queue** (available for this public repo) **or**
   require-branches-up-to-date, to kill semantic-merge skew. Merge queue is
   preferable (no author thrash, tests the post-merge state). Caveat: add the
   `merge_group` trigger to required-check workflows or merges hang.
3. **Add post-deploy verification + rollback.** A smoke/health check against
   the deployed prod URL after the Vercel deploy, plus a documented/automated
   rollback. This is the compensating control that makes *any* auto-release
   tolerable; today detection of a bad release is manual.
4. **Reconcile the semantic-release config drift** (`npmPublish: false` vs the
   header comment claiming SDK publication) so the release contract is
   unambiguous.
5. **Consider** a coverage threshold gate and a scheduled mutation-test run.

**Tier 3 — unattended auto-merge to prod: NOT YET.**

- Today's gate = 3 required checks + **code-owner review**. Enabling auto-merge
  *within the current ruleset* would still wait for code-owner approval
  (auto-merge cannot bypass CODEOWNERS — verified) — so it is not truly
  unattended and is relatively safe, but also delivers little (still needs the
  human).
- **Truly unattended** auto-merge requires relaxing the code-owner requirement,
  making **CI the sole arbiter of prod-safety**. Given the §6 gaps (a11y not
  gated, merge skew possible, no post-deploy verification), that is **not safe
  today**.
- If pursued *after* Tier-2: scope to **patch updates** (GitHub's documented
  recipe; dev-deps-only is a community pattern, not official), keep a merge
  queue + comprehensive CI + post-deploy verification + rollback, and rely on
  Dependabot's read-only-token/no-secrets model to bound blast radius. Even
  then, consider retaining a lightweight human gate for `production`-scope deps.

---

## 8. Decisions for the owner (named, not made)

| # | Decision | My recommendation | Reversible? |
| --- | --- | --- | --- |
| A | Enable secret-scanning push protection now? | **Yes** — free, pure-win | Yes |
| B | Add dependency-review action + Dependabot `cooldown`? | **Yes** — closes a PR-time supply-chain gap | Yes |
| C | Close the CI a11y/widget gap as a standalone PR? | **Yes, P1** — WCAG mandate is currently un-gated | Yes |
| D | Adopt a merge queue (or require-up-to-date)? | **Yes** before any auto-merge; merge queue preferred | Yes |
| E | Build post-deploy verification + rollback? | **Yes** — precondition for any auto-release confidence | Yes |
| F | Auto-merge posture? | **Stay manual now.** Revisit patch-only after C+D+E land; unattended only with a merge queue + post-deploy verification | Enabling is easy; a bad unattended release is the costly direction |
| G | Reconcile semantic-release `npmPublish`/comment drift? | **Yes** — small, removes ambiguity | Yes |

C, D, and E are the three that gate F. F is the genuinely consequential,
hardest-to-reverse decision and should not be taken until C–E are in place.

---

## 9. Sources & confidence

- Repo pipeline / ruleset / config / live security state: **high confidence**,
  read first-hand (files named inline; ruleset via `gh api
  .../rulesets/13402577`; state via `gh api .../security_and_analysis`).
- GitHub-feature mechanics: verified against current `docs.github.com` (key
  pages: dependabot options reference, automate-dependabot-with-actions,
  automatically-merging-a-pull-request, code-scanning merge-protection,
  enabling-push-protection, configure-dependency-review-action,
  managing-rulesets, managing-a-merge-queue). **Critically assessed, not taken
  on trust:** the research pass assumed a *private* repo — corrected here, the
  repo is public, so its paid-licence caveats do not apply; its "CodeQL is a
  legacy status check" generalisation is overridden by this repo's actual
  ruleset (both merge-protection and required-check configured). Remaining
  honest UNVERIFIED items are listed at the end of §5; none change the
  recommendations.
- This report **names** decisions; it does not make them. Security posture and
  release automation are owner decisions (§8).
