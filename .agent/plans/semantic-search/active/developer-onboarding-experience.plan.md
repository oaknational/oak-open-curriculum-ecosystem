# Developer Onboarding Experience

**Status**: Ready -- execute all workstreams
**Parent**: [../README.md](../README.md) | [../roadmap.md](../roadmap.md)
**Last Updated**: 2026-02-13

---

## Instruction

This plan creates a clear, verified onboarding journey for Oak team
developers and AI agents. It is intentionally split out from
`public-release-readiness.plan.md` so public release blockers stay
focused on secrets, legal, package metadata, and publication flow.

Target outcome: a new developer can go from fresh clone to a first
successful change without hidden context, stale commands, or broken
navigation.

**Directive lock (rules.md)**: no backwards compatibility layers.
Onboarding migrations must be clean breaks. Do not keep compatibility
pages, aliases, or fallback routes once the canonical path is set.

---

## Scope

**In scope**:

- Onboarding entry points and progressive disclosure across docs
- Command accuracy and drift prevention
- Documentation link integrity for onboarding-related documents
- Credential/access/contribution messaging consistency
- Release operator onboarding for SDK npm publication
- Clean-break removal of legacy onboarding entry points (no compatibility shims)

**Out of scope**:

- New product features
- Changes to the SDK/publication scope decision (handled elsewhere)
- Rewriting repository architecture or tooling fundamentals

---

## Reality Snapshot (2026-02-13)

| Area | Reality in repository | Impact |
| --- | --- | --- |
| Legacy onboarding compatibility layer remains | `docs/onboarding.md` currently exists as a compatibility pointer | Violates no-backwards-compatibility rule; final state must remove it |
| Stale command names in top-level docs | `README.md` still references `pnpm dev:smoke`; root script is `pnpm smoke:dev:stub` | New developers run failing commands |
| Contribution policy drift | `CONTRIBUTING.md` still states external contributions are welcome | Conflicts with public release policy |
| Version/runtime drift | `CONTRIBUTING.md` says Node.js 22+, root `package.json` enforces `24.x` | Setup inconsistency and local failures |
| Broken onboarding references | `docs/agent-guidance/ai-agent-guide.md` points to missing files (`../development/onboarding-journey.md`, `../quick-reference.md`) | Dead links in onboarding path |
| Missing/incorrect doc references | `docs/agent-guidance/ai-agent-guide.md` points to `docs/troubleshooting.md` (missing); `docs/development/environment-variables.md` points to `docs/vercel-environment-config.md` (missing) | Credibility loss and navigation breaks |
| Release onboarding ambiguity | `.releaserc.mjs` and workflow exist, but docs do not clearly explain SDK-only public release operation | Release process knowledge remains tribal |

---

## Workstream Status

| ID | Workstream | Status |
| --- | --- | --- |
| WS1 | [Canonical onboarding journey](#workstream-1-canonical-onboarding-journey) | Pending (reopened for clean break) |
| WS2 | [Command truth and drift removal](#workstream-2-command-truth-and-drift-removal) | Pending |
| WS3 | [Link integrity and navigation](#workstream-3-link-integrity-and-navigation) | Pending |
| WS4 | [Credential, access, and contribution messaging](#workstream-4-credential-access-and-contribution-messaging) | Pending |
| WS5 | [Release operator onboarding (SDK-only)](#workstream-5-release-operator-onboarding-sdk-only) | Pending |
| WS6 | [First-day rehearsal and sign-off](#workstream-6-first-day-rehearsal-and-sign-off) | Pending |
| QG | [Quality gates](#quality-gates) | Pending |

**Recommended order**: WS1 -> WS2 -> WS3 -> WS4 -> WS5 -> WS6 -> QG.

WS1 defines the structure. WS2/WS3 remove mechanical friction. WS4
aligns policy and secret handling. WS5 handles release-specific
onboarding. WS6 validates with a real first-day rehearsal.

---

## Workstream 1: Canonical Onboarding Journey

**Problem**: The onboarding story still includes a compatibility layer.
The final state must be a clean break with one canonical path only.

### Actions

1. Define one canonical onboarding entry document:
   `docs/development/onboarding.md`.
2. Delete `docs/onboarding.md` in a clean break once all references are
   updated. Do not keep compatibility pointers.
3. Ensure all top-level entry points (`README.md`, `docs/README.md`,
   `CONTRIBUTING.md`) route to the canonical onboarding path.
4. Add a concise "choose your path" section in onboarding:
   SDK/docs work (no secrets), service work (minimal secrets), search
   + release work (full credentials).
5. Run a repository-wide link sweep to remove references to the deleted
   legacy onboarding path.

### Completion checklist

- [ ] One canonical onboarding document defined and referenced everywhere
- [ ] Legacy onboarding page removed (clean break, no pointer page)
- [ ] Root README and docs index point to the same onboarding path
- [ ] Persona-based onboarding paths documented
- [ ] Repository-wide references to deleted onboarding path removed

---

## Workstream 2: Command Truth and Drift Removal

**Problem**: Onboarding docs reference commands that do not match root
scripts, creating immediate setup friction.

### Actions

1. Treat root `package.json` scripts as command source of truth.
2. Update onboarding-related docs to remove stale names and aliases:
   examples include `pnpm dev:smoke` and `pnpm format` where root uses
   `pnpm smoke:dev:stub` and `pnpm format:root`.
   Remove old aliases entirely; do not preserve dual command naming.
3. Align command explanations in:
   `README.md`, `CONTRIBUTING.md`, `docs/development/onboarding.md`,
   `docs/quick-start.md`, and onboarding-adjacent agent guidance.
4. Add a lightweight drift check (manual checklist or scripted check)
   so future command renames do not silently desynchronise docs.

### Completion checklist

- [ ] All onboarding-facing docs use real root command names
- [ ] Obsolete command references removed from onboarding path
- [ ] Command source-of-truth rule documented
- [ ] Drift prevention step added to documentation maintenance process

---

## Workstream 3: Link Integrity and Navigation

**Problem**: Broken local links and missing target files exist in
onboarding-adjacent docs.

### Actions

1. Run a markdown link integrity pass focused on onboarding docs and
   their immediate references.
2. Repair or remove missing links, including known broken paths in
   agent guidance and environment docs.
   Use direct replacements; do not add compatibility redirects.
3. Ensure progressive disclosure is explicit:
   root README -> onboarding -> workspace README -> deep docs/ADR.
4. Add link-check validation to docs QA for onboarding changes.

### Completion checklist

- [ ] Broken onboarding-path links fixed or removed
- [ ] No references to missing onboarding docs remain
- [ ] Progressive disclosure path is explicit and navigable
- [ ] Link-check step documented for ongoing maintenance

---

## Workstream 4: Credential, Access, and Contribution Messaging

**Problem**: Onboarding text currently conflicts with public release
policy around contribution boundaries and credential handling.

### Actions

1. Align all onboarding-facing docs with policy:
   real keys only in local untracked `.env*`; never in tracked files;
   `.env.example` must contain placeholders only.
2. Align contribution language with current public policy
   (public code visibility, no external PR/issues at this stage).
3. Update Node runtime references to Node.js `24.x` where onboarding
   docs still mention older versions.
4. Clarify task-to-credential matrix:
   what can be done with zero credentials vs minimal credentials vs full
   search/release credentials.

### Completion checklist

- [ ] Credential policy is consistent across onboarding docs
- [ ] Contribution policy is consistent across onboarding docs
- [ ] Node.js version references aligned to `24.x`
- [ ] Credential requirement matrix is accurate and explicit

---

## Workstream 5: Release Operator Onboarding (SDK-only)

**Problem**: Release tooling exists, but there is no concise onboarding
runbook for maintainers responsible for npm publication.

### Actions

1. Produce a release runbook for the current scope decision:
   publish only `@oaknational/oak-curriculum-sdk` in the first cycle.
2. Document chosen release automation strategy:
   semantic-release or changesets, including rationale.
3. Document release prerequisites and secrets:
   npm token, GitHub token expectations, branch and commit conventions.
4. Include dry-run and rollback guidance, plus expected outputs:
   next version preview, changelog/release notes, npm artefact checks.
5. Cross-link the runbook from onboarding and public release plans.

### Completion checklist

- [ ] SDK-only publication scope is explicit in onboarding docs
- [ ] Release automation approach documented with operator steps
- [ ] Prerequisites and required secrets documented
- [ ] Dry-run and rollback procedure documented
- [ ] Runbook linked from onboarding and release planning docs

---

## Workstream 6: First-Day Rehearsal and Sign-off

**Problem**: Documentation can appear correct without proving that a new
developer can actually follow it.

### Actions

1. Run a fresh-clone onboarding rehearsal using only documented steps.
2. Record time-to-first-success for two paths:
   no-secrets path (docs/SDK work) and credentials path (service/search).
3. Capture blockers and ambiguities found during rehearsal and fix them.
4. Add a short "onboarding acceptance" checklist to close the plan.

### Completion checklist

- [ ] Fresh-clone rehearsal completed from documented steps only
- [ ] No-secrets path validated end-to-end
- [ ] Credentials path validated end-to-end
- [ ] Issues discovered during rehearsal fixed and documented
- [ ] Onboarding acceptance checklist completed

---

## Quality Gates

After onboarding documentation changes:

```bash
pnpm format:root
pnpm markdownlint:root
pnpm type-check
pnpm lint
pnpm test
```

If release/onboarding scripts are changed, run `pnpm qg` before closing.

### Completion checklist

- [ ] Documentation formatting/linting passes
- [ ] Updated onboarding paths validated manually
- [ ] Link integrity checks pass
- [ ] Release runbook reviewed against current workflow/config

---

## Related Documents

| Document | Purpose |
| --- | --- |
| `active/public-release-readiness.plan.md` | Public release blockers and npm readiness |
| `README.md` | Primary public entry point |
| `CONTRIBUTING.md` | Contributor policy and workflow |
| `docs/development/onboarding.md` | Canonical onboarding path |
| `docs/development/environment-variables.md` | Credential setup and safety |
| `.releaserc.mjs` | Release automation configuration |
| `.github/workflows/release.yml` | CI release workflow |
