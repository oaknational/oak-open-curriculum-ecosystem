# Onboarding Simulations and Public-Alpha Readiness

**Status**: 🔄 Active (remediation complete, post-remediation rerun pending)
**Last Updated**: 2026-02-27  
**Owner Boundary**: `developer-experience/`

---

## Purpose

This is the canonical onboarding document for the repository.

It consolidates:

1. the multi-audience onboarding review reports,
2. merge-blocking onboarding remediation outcomes,
3. documentation and governance follow-on tracks, and
4. the required rerun process before public alpha.

This document is authoritative for onboarding status and next action.

---

## Consolidated Sources

Historical source snapshots are preserved for traceability:

- [onboarding.report.2026-02-25.md](./archive/superseded/onboarding.report.2026-02-25.md)
- [onboarding-review-report.2026-02-25.md](./archive/superseded/onboarding-review-report.2026-02-25.md)
- [onboarding-governance-follow-on.plan.2026-02-25.md](./archive/superseded/onboarding-governance-follow-on.plan.2026-02-25.md)
- [onboarding.plan.md](../semantic-search/archive/completed/onboarding.plan.md)
- [onboarding-documentation-follow-on.plan.md](./archive/completed/onboarding-documentation-follow-on.plan.md)

---

## Baseline Review Context (23 February 2026)

Methodology:

- 8 independent onboarding reviews via the `onboarding-reviewer` sub-agent
- persona lenses: junior dev, mid-level dev, lead dev, principal engineer,
  engineering manager, product owner, CTO, CEO
- plan restructuring reviewed by `architecture-reviewer-barney`

## Why Guardrails Exist

Quality gates, type-safety rules, TDD discipline, and architectural constraints
are the structural immune system of the codebase.

Without guardrails, human and AI development drifts, entropy accumulates, and
repository integrity degrades. The rules are not bureaucracy; they are the
mechanism that keeps structure coherent over time.

---

## Baseline Outcomes Snapshot

| Area | Outcome |
|---|---|
| Cross-cutting findings flagged by 4+ personas | 7 |
| Merge-blocking onboarding workstreams (A1-A8) | ✅ Complete (archived) |
| Documentation follow-on items (B7-B10) | ✅ Complete (archived) |
| Governance follow-on items (B1-B6) | 📋 Pending leadership input |
| CEO and Product Owner rerun after fixes | ✅ PASS (2026-02-23) |

### Audience Status (Baseline)

| Audience | Status | Time to first success |
|---|---|---|
| Junior developers | Critical gaps (then remediated) | Blocked initially |
| Mid-level developers | Gaps found | ~1-2 days |
| Lead developers | Gaps found | ~1 day |
| Principal engineers | Gaps found | ~2-4 hours |
| Engineering managers | Gaps found | Process clarity gap |
| Product owners | Critical gaps (then remediated path) | No clear path initially |
| CTOs | Gaps found | Discoverability and risk framing gaps |
| CEOs | Critical gaps | Mission framing absent at entry points |

### Cross-Cutting Findings (4+ Personas)

1. Broken `institutional-memory.md` link in `README.md`
2. Missing prerequisites in onboarding path
3. `pnpm make` docs drift (missing `subagents:check`)
4. `foundation/VISION.md` buried and under-discoverable
5. No human-facing explanation of the agentic practice
6. No documented PR/review process in human docs
7. `.env.example` contradiction on Elasticsearch requirement

---

## Track Status

### Track A: Merge-Blocking Onboarding Remediation

- **Status**: ✅ Complete
- **Archive**: [onboarding.plan.md](../semantic-search/archive/completed/onboarding.plan.md)
- Scope: A1-A8 foundational correctness, onboarding flow, and audience-path fixes.

### Track B (Docs): Documentation Follow-On

- **Status**: ✅ Complete
- **Archive**:
  [onboarding-documentation-follow-on.plan.md](./archive/completed/onboarding-documentation-follow-on.plan.md)
- Completed items:
  - B7 non-technical curriculum domain guide
  - B8 mission framing in milestone roadmap
  - B9 type-generation pipeline constraints/failure-modes doc
  - B10 documentation sustainability and scaling framing

### Track B (Governance): Leadership-Input Items

- **Status**: 📋 Not started
- These cannot be completed by documentation editing alone.

Status key: `[ ]` not started, `[~]` in progress, `[x]` complete.

- [ ] **B1. Add cost model and sustainability framing to `foundation/VISION.md`**
  - Requires infrastructure-cost evidence and team-model decisions.
- [ ] **B2. Create architectural risk register**
  - Requires organisation-level risk prioritisation.
- [ ] **B3. Add business-level risks and mitigations to `foundation/VISION.md`**
  - Requires reputational, operational, financial, and regulatory framing.
- [ ] **B4. Document agentic-practice transferability**
  - Requires explicit split of general-purpose vs Oak-specific components.
- [ ] **B5. Clarify ecosystem/open-source posture for non-technical audiences**
  - Requires policy decisions for contribution posture.
- [ ] **B6. Expand `SECURITY.md` for organisational risk assessment**
  - Requires data governance and security-posture decisions.

Traceability to baseline report:

| Item | Source finding |
|---|---|
| B1 | CTO: cost/sustainability framing absent |
| B2 | Principal/EM/CTO: no consolidated risk register |
| B3 | CEO/CTO: business risk framing absent |
| B4 | CTO: transferability claim not evidenced |
| B5 | CEO/CTO/PO: open-source posture unclear to non-technical readers |
| B6 | CTO: organisational-level security framing absent |

---

## Public-Alpha Rerun Requirement

A fresh onboarding simulation pass is required before Milestone 1 exit.

Rationale:

- repository state, plan structure, and UX framing changed materially after the
  baseline review,
- public-alpha entry requires confidence across technical and non-technical
  onboarding paths,
- governance/policy gaps must be re-evaluated against current docs and risk posture.

### Rerun Scope

Run updated onboarding simulations against current repository state for:

1. junior dev
2. mid-level dev
3. lead dev
4. principal engineer
5. engineering manager
6. product owner
7. CTO
8. CEO

### Rerun Inputs

- [README.md](../../../README.md)
- [docs/README.md](../../../docs/README.md)
- [docs/foundation/quick-start.md](../../../docs/foundation/quick-start.md)
- [docs/foundation/VISION.md](../../../docs/foundation/VISION.md)
- [high-level-plan.md](../high-level-plan.md)
- [user-experience/public-alpha-experience-contract.md](../user-experience/public-alpha-experience-contract.md)

### Rerun Output Contract

For each persona, capture:

1. entry-point success/failure in first 5 minutes,
2. time-to-first-success estimate,
3. blocker list (P0/P1/P2/P3),
4. trust and clarity observations,
5. remediation recommendations mapped to permanent-doc locations,
6. whether issue is docs-only or leadership/policy dependent.

### Pre-Alpha Exit Criteria (Onboarding)

All must be true:

1. no P0 onboarding blockers across the 8 personas,
2. no contradictory onboarding instructions in canonical entry points,
3. public-alpha UX baseline is clear in both technical and non-technical framing,
4. remaining governance items (B1-B6) are either resolved or explicitly accepted
   as deferred with owner, rationale, and review date.

---

## Post-Rerun Closure Process

After rerun completion:

1. mine settled findings into permanent docs (ADRs, `/docs/`, collection README files),
2. update this document with the new baseline and decision log,
3. archive rerun execution artefacts under `archive/completed/` with dates,
4. keep this file as the single active onboarding status hub.

---

## Delta Findings Added (Junior Simulation, 25 February 2026)

The following findings were added from a root-README-first junior simulation
run completed on **2026-02-25**.

Status key: `[ ]` not started, `[~]` in progress, `[x]` complete.

- [ ] **D1. Entry-point cognitive load remains high for junior contributors**
  - Evidence:
    - onboarding Step 2 requires reading multiple heavy directives before first
      implementation work (`onboarding.md`, `AGENT.md`, `rules.md`).
    - root README transitions quickly into practice internals for users who may
      still be orienting.
  - Impact:
    - slower confidence-building and delayed time-to-first-meaningful-change.
  - Recommended action:
    - add a strict "junior fast path" that preserves quality gates while
      minimising mandatory first-pass reading.
  - Classification: docs/process framing (no policy dependency).

- [ ] **D2. Local hook strictness creates early-journey friction**
  - Evidence:
    - pre-commit runs `format-check`, `markdownlint-check`, and
      `type-check/lint/test`.
    - pre-push runs secret scan, sdk-codegen/build verification, drift checks,
      and E2E.
  - Impact:
    - first contribution cycles can feel unexpectedly heavy to juniors.
  - Recommended action:
    - document expected hook/runtime cost up front in onboarding and provide a
      "what to run before first commit" expectation block.
  - Classification: docs/process framing (policy-preserving).

- [ ] **D3. Test-surface expectations are still easy to misread**
  - Evidence:
    - CI runs `pnpm test`; broader suites (`test:ui`, `test:e2e`, smoke) are
      covered via other local surfaces (`pnpm qg`, `pnpm check`, hooks).
  - Impact:
    - junior contributors may incorrectly assume CI is full-system coverage.
  - Recommended action:
    - add a concise test-surface matrix in onboarding and quick-start docs with
      plain-language intent per surface.
  - Classification: docs-only.

Notes:

- The credential mismatch and stale security-guide terminology findings were
  actioned directly in canonical docs on 2026-02-25 and are not tracked here as
  open D-items.

---

## Public-Alpha Rerun Results (26 February 2026)

### Rerun Context

- **Date**: 2026-02-26
- **Repository state**: All code work complete (Batches A–E3, R1–R4, O1–O12).
  G1–G3 gates complete with evidence. Commit `274a8245` on
  `feat/semantic_search_deployment`.
- **Personas**: Junior developer, principal engineer, CTO, CEO.
- **Method**: Read-only `onboarding-reviewer` simulations — no commands run,
  no files modified, only reading and reporting.
- **Reduced scope rationale**: The four personas were chosen to stress-test the
  four dimensions most critical for public-alpha readiness: discoverability
  (junior), architecture (principal), risk (CTO), and value (CEO). The full
  8-persona rerun from the baseline is not required at this stage because
  mid-level dev, lead dev, engineering manager, and product owner occupy
  intermediate positions on the same axes.

### Rerun Audience Summary (Post-Disposition)

| Audience | Verdict | Time to first success | Key concern |
|---|---|---|---|
| Junior developer | Minor gaps | Not blocked (reviewer false positives resolved) | Stale paths, jargon, cognitive load |
| Principal engineer | Strong with minor gaps | ~30 minutes reading | Documentation drift (counts, paths); CI coverage gap |
| CTO | Conditional go | N/A (decision-maker) | G6 (Clerk), G7 (Sentry), rate-limit verification — block open public alpha only |
| CEO | Minor gaps | Not blocked (repo name correct) | Value proposition framing; internal artefacts visible |

> **Note**: This table was updated after owner dispositions on 26 February 2026.
> R1 (repo name) resolved as false positive — the repo was intentionally renamed.
> R2 (missing files) resolved as false positive — all five files exist.

### CTO Verdict (Updated with Milestone Separation)

**Conditional Go for open public alpha.** Three conditions before approval:

1. **G6 must be complete** — Clerk production migration. Blocks open public
   alpha but NOT open private alpha.
2. **G7 must be verified** — Sentry observability. Blocks open public alpha
   but NOT open private alpha. At minimum: test event propagates, alerting
   configured, named monitor during watch window.
3. **Rate limiting must be verified on deployment target** — documented as
   deployment precondition (ADR-115, HTTP server README), must be confirmed
   active before open public alpha. Note: upstream curriculum API already has
   extensive rate limiting, so Oak's resources have baseline protection.

**Milestone progression**:

- **Closed private alpha** (current state): repo private, HTTP server
  private alpha.
- **Open private alpha** (M0 exit): repo public on GitHub, HTTP server
  still private alpha. Clerk/Sentry/rate-limiting NOT required.
- **Open public alpha** (M1 exit): repo public, HTTP server publicly
  accessible with production auth, observability, and rate limiting.

### Notable Strengths (Unanimous Across All Four Personas)

All four reviewers independently praised:

- Quality gates are genuine, not theatre (CTO: "self-correcting when TDD
  violations were found").
- ESLint-enforced architectural boundaries with their own test suite
  (principal: "rare and excellent").
- Zero type assertions in SDK source; zero skipped tests across 343+ files.
- Over 100 ADRs — "unusually high standard".
- Five-surface quality gate architecture with coverage matrix (ADR-121).
- VISION document is excellent (CEO: "clear, strategically coherent").

---

### Consolidated Findings

Status key: `[ ]` not started, `[~]` in progress, `[x]` complete.

#### P0 — Release Blocker

No P0 blockers remain after owner dispositions.

- [x] **R1. Repository name in clone URL and GitHub links** — RESOLVED
  (false positive)
  - Source: CEO
  - Original claim: README references `oak-open-data-ecosystem` but actual
    repo is `oak-mcp-ecosystem`.
  - **Owner disposition**: The repo was intentionally renamed from
    `oak-mcp-ecosystem` to `oak-open-data-ecosystem` as part of a planned
    rename (Phase 6 of SDK workspace separation). The documents referencing
    `oak-open-data-ecosystem` are CORRECT. The local git remote still shows
    the old name (`oak-mcp-ecosystem`) because GitHub handles the redirect.
    The local remote should be updated to `oak-open-data-ecosystem` but this
    is cosmetic, not a blocker.
  - Action: Update local git remote to new name. No document changes needed.

#### P1 — Must Fix Before Public Alpha

- [x] **R2. Five missing files on the onboarding path** — RESOLVED
  (false positive)
  - Source: Junior dev, principal engineer
  - Original claim: Five files linked from onboarding docs do not exist.
  - **Owner disposition**: All five files exist. Verified by glob search:
    1. `docs/domain/DATA-VARIANCES.md` — exists.
    2. `docs/governance/typescript-practice.md` — exists.
    3. `docs/engineering/extending.md` — exists.
    4. `docs/governance/curriculum-tools-guidance-and-playbooks.md` — exists.
    5. `docs/engineering/tooling.md` — exists.
  - This is consistent with the pattern recorded in the napkin: sub-agent
    reviewers produce false positives on file existence checks. Always
    verify reviewer claims against the filesystem before acting.

- [x] **R3. CONTRIBUTING.md stale code-generation path**
  - Source: Junior dev, principal engineer
  - Evidence: Line 35 references `packages/sdks/oak-curriculum-sdk/code-generation/`
    but the correct path is `packages/sdks/oak-sdk-codegen/code-generation/`
    (41 files found there; 0 at the old path).
  - Impact: Contributor following the "DO" list navigates to non-existent directory.
  - Fix: Update path. Quick win.
  - Classification: docs-only.

- [x] **R4. No maturity/status banner in README**
  - Source: CEO
  - Evidence: Root README never says "alpha", "beta", "experimental", or sets
    stability expectations. HTTP MCP README says "Status: private alpha" but
    the root README is silent.
  - Impact: External visitors cannot tell whether this is production-ready or
    experimental.
  - **Owner disposition**: Agreed. The milestone progression is: closed
    private alpha → open private alpha → open public alpha. The banner
    should reflect the current milestone state. At M0 exit (repo public):
    "**Status: Private Alpha**". At M1 exit: "**Status: Public Alpha**".
  - Fix: Add status banner reflecting current milestone. Update as
    milestones progress.
  - Classification: docs-only. Quick win. Blocks M0.

- [x] **R5. Value proposition buried under jargon**
  - Source: CEO
  - Evidence: Opening paragraph is technical jargon. The clearest description
    is at line 173.
  - **Owner disposition**: Agreed, but READMEs are for developers, not CEOs.
    The VISION document exists specifically for the CEO/stakeholder audience
    and is linked from a headline sentence at the top of the root README.
    The fix is to ensure the README opening is clear for a *developer*
    audience (not CEO), and that the VISION link remains prominent. The
    VISION doc should not be duplicated into the README.
  - Fix: Restructure README opening for developer clarity. Ensure VISION
    link is prominent and early. Combine with R6 restructure.
  - Classification: docs-only. Short-term. Blocks M0.

- [x] **R6. README structural redundancy**
  - Source: CEO, junior dev
  - Evidence: Same content appears 3–4 times across the README.
  - **Owner disposition**: Agreed. Edit for readability and discoverability.
    Consolidate duplicated sections. Combine with R5 and R36 into a single
    README restructure task.
  - Fix: Consolidate into one "What's in this repo" section. Remove
    duplication. Apply progressive disclosure.
  - Classification: docs-only. Short-term. Blocks M0.

- [x] **R7. ADR count inconsistent across documents**
  - Source: CEO, principal engineer
  - Evidence: Different exact counts cited across README, VISION, and other
    documents.
  - **Owner disposition**: Use "over 100" in the README. Remove exact counts
    from all other documents — the count changes frequently and exact numbers
    create a maintenance burden and credibility risk when they drift.
  - Fix: Replace exact ADR counts with "over 100" in README. Remove counts
    entirely from other documents.
  - Classification: docs-only. Quick win. Blocks M0.

- [x] **R8. `.agent/experience/` files (88) publicly visible**
  - Source: CEO
  - Evidence: 88 git-tracked files with titles using metaphorical language.
    `.agent/memory/napkin.md` contains "Mistakes and corrections" sections.
  - **Owner disposition**: Add explanatory documentation. Specifically:
    1. Add a note in `.agent/README.md` explaining that these are
       non-technical experience logs capturing the history of the repo in an
       orthogonal dimension to the git history. There is no "team" to
       remember how the repo was built because it was built through agentic
       engineering, so these insights are preserved for later analysis and
       knowledge mining.
    2. Create `.agent/experience/HUMAN.md` to explain the intent, linking
       back to the `.agent/README.md` for the fuller explanation. The
       purpose is to create an archive enabling future agent continuity
       between sessions and between agents.
  - Fix: Create `.agent/README.md` and `.agent/experience/HUMAN.md`.
  - Classification: docs-only. Short-term. Blocks M0.

- [ ] **R9. G6 — Clerk production migration incomplete**
  - Source: CTO
  - Evidence: Currently running on test instance (`pk_test_*`, `sk_test_*`).
  - **Owner disposition**: Agreed. Clerk blocks **open public alpha** (M1)
    but NOT **open private alpha** (M0). The milestone separation is:
    M0 (repo public) can proceed without Clerk production migration.
    M1 (public alpha with external users) requires it.
  - Fix: Complete Clerk production migration before M1.
  - Classification: engineering/ops. Blocks M1 only.

- [ ] **R10. G7 — Sentry observability not verified**
  - Source: CTO
  - Evidence: UX contract lists "basic Sentry logging is not working" as a
    no-go condition.
  - **Owner disposition**: Same as R9. Sentry blocks **open public alpha**
    (M1) but NOT **open private alpha** (M0).
  - Fix: Verify Sentry before M1. At minimum: (a) test event propagates,
    (b) error alerting configured, (c) named person monitoring during watch
    window.
  - Classification: engineering/ops. Blocks M1 only.

- [x] **R11. `DANGEROUSLY_DISABLE_AUTH` has no production guard** — DISMISSED
  - Source: CTO
  - Original claim: No runtime guard prevents auth bypass in production.
  - **Owner disposition**: Intentional. This is still an alpha, not beta or
    production. The ability to disable auth in production is a deliberate
    operational capability during the alpha phase. A production guard
    would be appropriate for beta or production, not alpha.
  - Action: No change. Revisit at beta milestone.

#### P2 — Should Fix Before Release

- [x] **R12. Security contact placeholder in governance doc**
  - Source: CTO
  - Evidence: `docs/governance/safety-and-security.md` (line 179) says
    "Report security issues to: [security contact to be added]". Root
    `SECURITY.md` correctly points to Oak's `.well-known/security.txt`.
  - **Owner disposition**: Agreed. The public Oak web application repo on
    GitHub has the correct details. Point to
    `www.thenational.academy/.well-known/security.txt` as the canonical
    document, possibly from within our own `SECURITY.md` file.
  - Fix: Update governance doc to reference `SECURITY.md` and the canonical
    Oak security.txt URL.
  - Classification: docs-only. Blocks M0.

- [ ] **R13. Rate limiting is documented precondition but not verified**
  - Source: CTO
  - Evidence: ADR-115 and HTTP server README state rate limiting must be in
    place before production. No evidence it is verified.
  - **Owner disposition**: Agreed. Rate limiting blocks **open public alpha**
    (M1). Add a rate-limiting assessment item to the release plan. Note that
    the upstream curriculum API has extensive rate limiting, so the baseline
    remains that Oak's resources are protected regardless.
  - Fix: Add rate-limiting assessment task. Verify active on deployment
    target before M1.
  - Classification: engineering/ops. Blocks M1 only.

- [ ] **R14. CI does not run E2E, UI, or smoke tests**
  - Source: CTO, principal engineer
  - Evidence: CI runs only: secrets scan, build, format, markdownlint,
    subagents check, lint, type-check, unit/integration tests. E2E coverage
    is in pre-push hook only.
  - **Owner disposition**: Agreed, but requires an audit to ensure that all
    E2E tests do not make network calls before adding them to CI. Smoke
    tests CANNOT be part of CI (they make real network calls by definition —
    see testing-strategy.md §Smoke test). The CI expansion should cover E2E
    and UI tests only, after verifying no network IO.
  - Assessment: Documented trade-off (ADR-121). Acceptable for alpha. Must
    be fixed before opening external contributions.

- [x] **R15. MCP server READMEs overwhelm with operational depth**
  - Source: CEO
  - Evidence: Stdio MCP README ~730 lines, HTTP MCP README ~1330 lines,
    dominated by log parsing, jq recipes, debugging workflows.
  - **Owner disposition**: Agreed. Edit for clarity, readability, progressive
    disclosure. Move highly technical operational material into `/docs/`
    folders within each workspace.
  - Fix: Separate product-facing README (install, configure, use) from
    operational documentation in `/docs/`.
  - Classification: docs-only. Blocks M0.

- [x] **R16. "Agentic Engineering Practice" section internal-facing**
  - Source: CEO
  - Evidence: README lines 162–169 describe internal practice with claim
    that "a single engineer, working with AI" produced the entire system.
  - **Owner disposition**: The README section should be reframed for an
    external audience. Additionally, the internal progression framework
    application document
    (`.agent/reference-docs/prog-frame/agentic-engineering-practice.md`)
    is for internal Oak use ONLY and MUST NOT be linked to from any other
    file in the repo. It should not be discoverable by external visitors.
    Add frontmatter to that document making this clear.
  - Fix: (1) Reframe README section for external audience. (2) Add
    "internal only, do not link" frontmatter to the progression framework
    document.
  - Classification: docs-only. Blocks M0.

- [x] **R17. Pervasive jargon without definitions**
  - Source: CEO
  - Evidence: "MCP", "Zod validators", "RRF", "ELSER", "ADR", "Turbo"
    used without definitions.
  - **Owner disposition**: Agreed. Expand key acronyms on first use. MCP
    especially needs a one-line explanation.
  - Classification: docs-only. Blocks M0.

- [x] **R18. CHANGELOG.md empty and references stale name**
  - Source: CEO
  - Evidence: Single entry under `[Unreleased]` with stale references.
  - **Owner disposition**: CHANGELOG.md is managed by the semantic release
    process, not manually. Clear it of all content — semantic-release will
    populate it when the first tagged release is created.
  - Fix: Clear CHANGELOG.md to empty/template state.
  - Classification: docs-only. Quick win.

- [x] **R19. No CI/licence badges in README**
  - Source: CEO
  - **Owner disposition**: Fine, but make sure it is clear that we have
    mixed licences (MIT for code, OGL for data via LICENCE-DATA.md).
  - Fix: Add licence badge(s) at minimum. Clarify dual-licence status.
    Build status badge when CI is public.
  - Classification: docs-only.

- [x] **R20. G1 evidence cites specific commit but not branch state** —
  DISMISSED
  - Source: CTO
  - Original claim: G1 evidence may not cover final release candidate.
  - **Owner disposition**: This is an agentic engineering project with one
    human contributor. There is no change advisory board or release freeze
    process. `pnpm qg` will be run at the final state before release, but
    a formal R0 commit freeze is not required.
  - Action: Run `pnpm qg` before release. No formal R0 process.

#### P3 — Polish

- [x] **R21. CONTRIBUTING.md Level 2 MCP env claim misleading**
  - Source: Junior dev
  - **Owner disposition**: Agreed.
  - Fix: Clarify that search functionality requires ES credentials.

- [x] **R22. Foundational ADR references repeated identically in 5+ docs**
  - Source: Junior dev
  - **Owner disposition**: Agreed. Edit for clarity, readability, and
    context at each reference point.
  - Fix: Add brief contextual framing at each reference point explaining
    why the ADR matters in that specific context.

- [x] **R23. quick-start.md generated docs path may not exist**
  - Source: Junior dev
  - **Owner disposition**: Agreed. Update the instruction.
  - Fix: Add a note: "This file is generated by `pnpm doc-gen` — if it does
    not exist, run that command first."

- [ ] **R24. Most docs lack a last-reviewed date**
  - Source: Junior dev
  - **Owner disposition**: Agreed. Add frontmatter to key documents with
    `last_updated` and `last_reviewed` dates. Create or update an ADR so
    the decision and reasoning are preserved and discoverable.
  - Fix: Establish `last_reviewed` convention across onboarding-path
    documents. Create ADR documenting the convention.

- [x] **R25. README `pnpm make` comment is implementation detail**
  - Source: Junior dev
  - **Owner disposition**: Agreed. Rephrase for plain-language framing.
    Ensure there is a build system document elsewhere with the detailed
    Turborepo task graph information.
  - Fix: Rephrase README comment. Create or verify build system docs in
    appropriate location.

- [x] **R26. Governance documentation volume high relative to product docs**
  - Source: Principal engineer
  - **Owner disposition**: Agreed. A brief intro document to governance would
    be useful. This is a new type of repository — there will not always be a
    human team working on it, so the repo contains more than the code, it
    contains the project context. This will become standard in agentic
    engineering: the repo IS the project. A brief orientation document should
    explain this framing without overwhelming.
  - Fix: Create a brief governance orientation document (e.g.
    `docs/governance/README.md` or similar) that explains why the governance
    volume exists and provides a 5-minute reading path.

- [ ] **R27. Stryker mutation testing — unclear integration status**
  - Source: Principal engineer
  - **Owner disposition**: Stryker was briefly used and now needs proper
    integration. It blocks **public beta** (M3) but NOT public alpha (M1).
    However, it remains a high-impact quality gateway that is not yet being
    used. Add to the agentic engineering enhancements roadmap and ensure it
    is sequenced properly.
  - Fix: Document Stryker status in testing strategy. Add to
    `.agent/plans/agentic-engineering-enhancements/roadmap.md` ensuring
    proper sequencing (already tracked as Phase 5).
  - Classification: Blocks M3 (public beta), not M1.

- [x] **R28. OAuth proxy opaque token dependency risk** — DISMISSED
  - Source: CTO
  - Original claim: If Clerk switches to JWT access tokens, validation
    will break.
  - **Owner disposition**: "If the service provider changes things then
    things will break" is not an insight. This is already documented in
    ADR-115 and requires no action beyond monitoring.
  - Action: No change. Already documented.

- [ ] **R29. Vercel log drain not documented as verified**
  - Source: CTO
  - Evidence: README mentions log drains but no evidence one is configured.
    Vercel's default log retention is 1 hour.
  - **Owner disposition**: Not verified, and that is a **public beta**
    blocker (M3), not a public alpha blocker (M1). The milestone
    documentation needs expanding to track this kind of operational
    readiness across milestones. Consider reworking high-level-plan.md.
  - Fix: Track as M3 blocker. Expand milestone documentation to capture
    operational readiness items.
  - Classification: Blocks M3 (public beta), not M1.

- [ ] **R30. No health check endpoint in post-deploy smoke checklist**
  - Source: CTO
  - Evidence: `/healthz` exists and is documented, but the post-deploy
    checklist focuses on OAuth and MCP paths. Uptime monitoring needs a
    simple health endpoint in the checklist.
  - Fix: Add `/healthz` to post-deploy smoke checklist. Configure external
    monitoring (e.g. Vercel Cron, Uptime Robot) before go-live.

- [ ] **R31. Known flaky test — widget-rendering.spec.ts**
  - Source: CTO
  - Evidence: Documented in `troubleshooting.md` (line 95–97) as known flaky
    as of 25 February 2026.
  - **Owner disposition**: Agreed. But: widget rendering was significantly
    altered recently — check whether the test is still flaky before
    investing in a fix. If the recent changes resolved it, update
    troubleshooting.md and close.
  - Fix: Verify current flakiness status. Fix or close accordingly.

- [x] **R32. Release workflow disables Husky hooks** — DISMISSED
  - Source: CTO
  - Original claim: Semantic-release commits bypass pre-push secret scan.
  - **Owner disposition**: Not an issue. The release workflow disables Husky
    because the quality gates are handled differently during automated
    release creation — the workflow itself runs the necessary checks.
    Husky hooks are for local development, not CI workflows.
  - Action: No change.

- [x] **R33. LICENSE (American) vs LICENCE-DATA.md (British) inconsistency**
  - Source: CEO
  - **Owner disposition**: UK spelling everywhere for everything. Great
    spot. Rename `LICENSE` to `LICENCE`. GitHub will still recognise it
    (tested with other repos). The British spelling rule applies
    universally.
  - Fix: Rename `LICENSE` to `LICENCE`. Update any references.

- [ ] **R34. Root-level config file clutter**
  - Source: CEO
  - Evidence: Various config files and temporary directories visible at
    repository root.
  - **Owner disposition**: The root is the canonical location for most
    tooling config files. It is cluttered, but most tools require their
    config at the root. Add a medium-priority tidy-up plan to
    `.agent/plans/developer-experience/` — non-blocking for any milestone.
  - Fix: Create a developer-experience tidy-up plan. Investigate which
    files can be consolidated or moved. `vercel_logs/` and `tmp/` should
    be gitignored if not already.
  - Classification: Non-blocking. Medium priority.

- [x] **R35. SDK README leads with architecture internals**
  - Source: CEO
  - **Owner disposition**: Agreed. Really good spot. This needs rewriting
    for appropriate audiences using progressive disclosure. Detailed
    technical information needs to be moved to appropriate `/docs/` files
    within the SDK workspace.
  - Fix: Reorder to lead with installation/usage. Move architecture details
    to workspace `/docs/` directory.

- [x] **R36. README quick start competes with surrounding sections**
  - Source: Junior dev
  - **Owner disposition**: Agreed. Edit for clarity, readability,
    discoverability. Subsume into the R5+R6 README restructure.
  - Fix: Part of the R5+R6+R36 README restructure task.

#### Reviewer Opinions (Not Findings)

The following are reviewer opinions that do not map to specific fixable
items but are worth recording for context:

- **Principal engineer**: "This codebase demonstrates an unusually high
  standard of architectural documentation, quality gate discipline, and type
  safety enforcement. For a public-alpha open-source project, this is
  substantially above the bar."
- **Principal engineer**: "The primary risk is not architectural drift or
  quality erosion, but the cognitive overhead of the governance layer for
  new contributors."
- **CTO**: "The engineering controls in this repository are materially
  stronger than what I typically see at public-alpha stage."
- **CTO**: "The quality gates are genuine (self-correcting when TDD
  violations were found), the security posture is multi-layered, and the
  architecture is well-governed."
- **CEO**: The VISION document was praised as "clear, strategically coherent,
  well-structured for both external developers and internal stakeholders."
  The "Two Audiences, One Vision" framing was called "effective."
- **CEO**: The CONTRIBUTING.md "Contribution Levels" (Level 1/2/3 by setup
  time) was called "an excellent UX pattern for new contributors."
- **CEO**: The SECURITY.md, BRANDING.md, CODE_OF_CONDUCT.md, and
  LICENCE-DATA.md were assessed as "professional and complete."
- **Junior dev**: ADR progressive disclosure was assessed as **PASS** —
  foundational ADRs consistently signposted, domain-specific handoffs
  well-structured.
- **Junior dev**: Command parity with package.json scripts was assessed as
  **PASS** — all documented commands exist and match their descriptions.

---

### Relationship to Prior Findings

| Rerun finding | Prior finding | Status |
|---|---|---|
| R1 (repo name) | New | Not previously identified |
| R2 (missing files) | New | Not present at baseline (post-rename breakage) |
| R3 (stale path) | New | Post-SDK-workspace-decomposition breakage |
| R4 (status banner) | Cross-cutting #5 (baseline) | Partially addressed but still missing at root |
| R5 (value prop buried) | Cross-cutting #5 (baseline) | Still present |
| R6 (README redundancy) | New | README grew during M1 development |
| R7 (ADR count) | New | Count changed during M1, not all references updated |
| R8 (experience files) | New | Experience files grew from 0 to 88 during M1 |
| R9 (G6 Clerk) | Existing gate | Unchanged |
| R10 (G7 Sentry) | Existing gate | Unchanged |
| R11 (auth guard) | New | Not previously identified |
| R12 (security contact) | New | Placeholder from initial creation |
| R14 (CI coverage) | D3 (delta, 2026-02-25) | Same underlying concern, broader framing |
| R15 (README length) | New | READMEs grew during operational docs additions |
| R17 (jargon) | Cross-cutting #5 (baseline) | Partially addressed but still present |
| R26 (governance volume) | D1 (delta, 2026-02-25) | Same concern from different persona |
| R31 (flaky test) | New | Not previously surfaced in onboarding context |
| R36 (quick start competing) | D1 (delta, 2026-02-25) | Specific manifestation of cognitive load finding |

### Relationship to Governance Track B Items

| Rerun finding | B-item | Overlap |
|---|---|---|
| R8 (experience files) | B4 (practice transferability) | R8 is a subset — public visibility of practice artefacts |
| R16 (practice section) | B5 (open-source posture) | R16 is the README manifestation of B5 |
| R13 (rate limiting) | B6 (security posture) | R13 is a deployment-specific instance |

---

### Pre-Alpha Exit Criteria Assessment (Post-Disposition)

| Criterion | M0 Status | M1 Status | Evidence |
|---|---|---|---|
| No P0 onboarding blockers | **PASS** | **PASS** | R1 resolved (false positive), R2 resolved (false positive) |
| No contradictory instructions | **FAIL** | **FAIL** | R7 (ADR count), R21 (MCP env requirements) — docs fixes |
| UX baseline clear | **FAIL** | **FAIL** | R4 (status banner), R5+R6 (README restructure), R17 (jargon) |
| Governance items resolved or deferred | **PARTIAL** | **PARTIAL** | B1–B6 unchanged. R8 decided (add explanatory docs). R9/R10 reclassified to M1 blockers only |

**Conclusion (updated after owner dispositions)**: The P0 category is now
clear — both items were false positives. The remaining blockers are
predominantly documentation restructuring (R4, R5, R6, R7, R17, R36) and
explanatory documentation (R8, R16, R26). No code changes block M0 (open
private alpha). M1 (open public alpha) additionally requires Clerk (R9),
Sentry (R10), and rate limiting (R13). Estimated remediation effort for
docs-only M0 blockers: 1 focused session.

---

### Remediation Priority (Post-Disposition)

**Resolved / Dismissed (no action needed)**:

- R1 — RESOLVED. Repo name correct (intentional rename). Update local remote.
- R2 — RESOLVED. All 5 files exist (reviewer false positive).
- R11 — DISMISSED. Auth disable intentional for alpha.
- R20 — DISMISSED. No CAB/release freeze for agentic project.
- R28 — DISMISSED. Not an insight.
- R32 — DISMISSED. Correct CI behaviour.

**M0 Blockers (must fix before repo goes public)**:

Quick wins (<30 minutes each):

1. R3 — fix CONTRIBUTING.md stale code-generation path
2. R4 — add status banner to README ("Private Alpha")
3. R7 — use "over 100" for ADRs, remove exact counts everywhere
4. R18 — clear CHANGELOG.md (semantic-release managed)
5. R33 — rename LICENSE to LICENCE (UK spelling everywhere)

Short-term (1 session):

6. R5 + R6 + R36 — README restructure (opening, redundancy, progressive disclosure)
7. R8 — create `.agent/README.md` and `.agent/experience/HUMAN.md`
8. R12 — fix security contact placeholder, point to Oak security.txt
9. R15 — MCP server README progressive disclosure, move ops docs to `/docs/`
10. R16 — reframe README practice section + add internal-only frontmatter
11. R17 + R25 — expand acronyms, replace implementation jargon
12. R19 — add licence badges (clarify mixed licences)
13. R21 — clarify CONTRIBUTING.md MCP env requirements
14. R22 — add contextual framing to repeated ADR references
15. R23 — add generated-docs note to quick-start
16. R26 — create brief governance orientation document
17. R35 — reorder SDK README for appropriate audiences

**M1 Blockers (must fix before open public alpha)**:

18. R9 — G6 Clerk production migration
19. R10 — G7 Sentry observability verification
20. R13 — rate-limiting assessment and verification

**Non-blocking (fix when convenient)**:

21. R14 — CI E2E/UI test expansion (needs network-call audit first)
22. R24 — last-reviewed date convention + ADR
23. R30 — add `/healthz` to post-deploy smoke checklist
24. R31 — verify widget-rendering test flakiness status
25. R34 — root-level config tidy-up plan

**M3 Blockers (public beta)**:

26. R27 — Stryker mutation testing integration (tracked in Phase 5 of
    agentic engineering roadmap)
27. R29 — Vercel log drain configuration and verification

---

## Post-Remediation Rerun

### Context

All 17 M0-blocking documentation remediation items (R3–R36) are complete
(commit `e1e83251`, 2026-02-27). The repository documentation has changed
materially: root README restructured (267→145 lines), MCP server READMEs
split into product-facing summaries + operational docs, SDK README
reordered, new explanatory files created, acronyms expanded, ADR
references contextually framed, licence naming standardised.

A fresh onboarding simulation is required to validate these changes
before M0 exit.

### Rerun Scope

Run onboarding simulations against the current repository state for
4 personas:

1. **Junior dev** — Can they clone, build, and make a first contribution
   following only the documentation?
2. **Lead dev** — Can they evaluate the architecture, understand the
   quality gates, and assess the codebase for team adoption?
3. **Engineering manager** — Can they understand the project's maturity,
   risk posture, and engineering practice from the public-facing docs?
4. **Product owner** — Can they understand the product value, capability
   staging, and milestone progression without technical background?

### Rerun Inputs

- [README.md](../../../README.md) (restructured)
- [CONTRIBUTING.md](../../../CONTRIBUTING.md) (updated)
- [docs/foundation/quick-start.md](../../../docs/foundation/quick-start.md) (updated)
- [docs/foundation/VISION.md](../../../docs/foundation/VISION.md) (updated)
- [docs/governance/README.md](../../../docs/governance/README.md) (enhanced)
- [.agent/README.md](../../README.md) (new)
- [.agent/experience/HUMAN.md](../../experience/HUMAN.md) (new)
- [packages/sdks/oak-curriculum-sdk/README.md](../../../packages/sdks/oak-curriculum-sdk/README.md) (restructured)
- [apps/oak-curriculum-mcp-stdio/README.md](../../../apps/oak-curriculum-mcp-stdio/README.md) (split)
- [apps/oak-curriculum-mcp-streamable-http/README.md](../../../apps/oak-curriculum-mcp-streamable-http/README.md) (split)

### Rerun Output Contract

For each persona, capture:

1. entry-point success/failure in first 5 minutes
2. time-to-first-success estimate
3. blocker list (P0/P1/P2/P3)
4. trust and clarity observations
5. whether previously-flagged issues (R3–R36) are now resolved
6. any new issues introduced by the restructuring

### Acceptance

- No P0 onboarding blockers across the 4 personas
- No contradictory onboarding instructions in canonical entry points
- All 17 remediated items verified as resolved from the persona's perspective
- Any new findings classified and recorded in this document

---

## Change Log

- **2026-02-27**: All 17 M0-blocking remediation items (R3–R36) complete.
  Post-remediation rerun section added for 4 personas (junior dev, lead
  dev, engineering manager, product owner). Rerun validates the
  restructuring and checks for regressions.
- **2026-02-26**: **Owner dispositions recorded for all 36 findings.** Key
  outcomes: R1 resolved (repo name correct — intentional rename, reviewer
  got it backwards); R2 resolved (all 5 files exist — reviewer false
  positive); R11 dismissed (auth disable intentional for alpha); R20
  dismissed (no CAB needed); R28 dismissed (not an insight); R32 dismissed
  (correct CI behaviour). Milestone separation introduced: closed private
  alpha → open private alpha (M0) → open public alpha (M1). R9 (Clerk),
  R10 (Sentry), R13 (rate limiting) reclassified to M1 blockers only.
  R27 (Stryker), R29 (log drain) reclassified to M3 blockers. Exit
  criteria assessment updated: no P0 blockers remain. CTO verdict updated
  with milestone-specific conditions. Remediation priority reorganised by
  milestone dependency.
- **2026-02-26**: Public-alpha rerun complete (4 personas: junior dev,
  principal engineer, CTO, CEO). Added §Rerun Results with consolidated
  findings (R1–R36), reviewer opinions, CTO conditional-go verdict, and
  updated exit criteria assessment.
- **2026-02-25**: Consolidated onboarding report + plan set into one canonical
  document; preserved legacy source snapshots in `archive/superseded/`.
- **2026-02-25**: Added delta findings D1-D3 from junior onboarding simulation.
