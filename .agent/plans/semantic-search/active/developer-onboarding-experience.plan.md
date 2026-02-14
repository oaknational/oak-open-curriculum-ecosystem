# Developer Onboarding Experience

**Status**: Ready -- execute all workstreams
**Parent**: [../README.md](../README.md) | [../roadmap.md](../roadmap.md)
**Last Updated**: 2026-02-14

---

## Instruction

This plan creates a clear, verified onboarding journey for Oak team
developers and AI agents. It is intentionally split out from
`public-release-readiness.plan.md` (now archived) so public release blockers stay
focused on secrets, legal, package metadata, and publication flow.

Target outcome: a new developer can go from fresh clone to a first
successful change without hidden context, stale commands, or broken
navigation.

**Prerequisite**: before any onboarding changes can be made effectively,
a full audit of every markdown file in the repository is required.
The onboarding journey is a path *through* the documentation. You
cannot design or fix that path without first understanding the full
landscape: what exists, what is stale, what is redundant, what is
missing, and what entire areas are no longer relevant. WS0 produces
this audit. All subsequent workstreams consume its output.

**Directive lock (rules.md)**: no backwards compatibility layers.
Onboarding migrations must be clean breaks. Do not keep compatibility
pages, aliases, or fallback routes once the canonical path is set.

**Archive policy**: files in `archive/` directories are historical
records. They should be ignored during the audit except to note
cases where non-archived files link *into* an archive — such links
should be rare exceptions, not the norm.

---

## Scope

**In scope**:

- Full audit of every markdown file in the repository (WS0)
- Onboarding entry points and progressive disclosure across docs
- Command accuracy and drift prevention
- Documentation link integrity across the entire documentation surface
- Credential/access/contribution messaging consistency
- Release operator onboarding for SDK npm publication
- Clean-break removal of legacy content (no compatibility shims)
- Deletion or archival of documentation that is no longer relevant

**Out of scope**:

- New product features
- Changes to the SDK/publication scope decision (handled elsewhere)
- Rewriting repository architecture or tooling fundamentals
- Rewriting content in `archive/` directories (historical records)

---

## Reality Snapshot (2026-02-14)

Items marked ✅ were resolved during public release readiness and do not
require further action.

| Area | Reality in repository | Status |
| --- | --- | --- |
| Legacy onboarding compatibility layer | `docs/onboarding.md` exists as a compatibility pointer. Must be deleted (clean break). | Remaining |
| Stale command names in top-level docs | `README.md` and `CONTRIBUTING.md` commands corrected during public release readiness. | ✅ Fixed |
| Contribution policy | `CONTRIBUTING.md` rewritten: external contributions closed, Node.js 24.x, Result pattern. | ✅ Fixed |
| Version/runtime drift | `CONTRIBUTING.md` and all package.json files now say Node.js 24.x. | ✅ Fixed |
| `ai-agent-guide.md` deeply stale | References "Oak Notion MCP", GO.md pattern, `pnpm format` (should be `format:root`). Two dead links: `../development/onboarding-journey.md` and `../quick-reference.md` (both missing). `docs/troubleshooting.md` link wrong (file is at `docs/development/troubleshooting.md`). Needs substantial rewrite or deletion. | Remaining |
| Environment-variables broken link | `docs/development/environment-variables.md` references `docs/vercel-environment-config.md`; actual path is `apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md`. | Remaining |
| Release onboarding | `docs/development/release-and-publishing.md` now documents the publishing strategy. WS5 adds the operator runbook (dry-run, rollback, prerequisites). | Partially addressed |

---

## Workstream Status

| ID | Workstream | Status |
| --- | --- | --- |
| WS0 | [Full documentation audit](#workstream-0-full-documentation-audit) | Complete |
| WS1 | [Canonical onboarding journey](#workstream-1-canonical-onboarding-journey) | Pending (reopened for clean break) |
| WS2 | [Command truth and drift removal](#workstream-2-command-truth-and-drift-removal) | Pending |
| WS3 | [Link integrity and navigation](#workstream-3-link-integrity-and-navigation) | Pending |
| WS4 | [Credential, access, and contribution messaging](#workstream-4-credential-access-and-contribution-messaging) | Pending |
| WS5 | [Release operator onboarding (SDK-only)](#workstream-5-release-operator-onboarding-sdk-only) | Pending |
| WS6 | [First-day rehearsal and sign-off](#workstream-6-first-day-rehearsal-and-sign-off) | Pending |
| QG | [Quality gates](#quality-gates) | Pending |

**Recommended order**: WS0 -> Pre-onboarding fixes -> WS1 -> WS2 -> WS3 -> WS4 -> WS5 -> WS6 -> QG.

WS0 is a hard prerequisite — it produces the full landscape that
every subsequent workstream consumes. Without it, onboarding changes
are blind edits. **Expect WS0 to fill an entire session.** The repo
has 150+ non-archived markdown files; auditing them all is substantial
work. WS0 produces a report and does not fix anything — the fixes
come in the pre-onboarding plan and WS1-WS6.

**Pre-onboarding prerequisite**: Before starting WS1, execute the
[Pre-Onboarding Documentation Fixes](pre-onboarding-doc-fixes.plan.md)
plan. It resolves all non-onboarding documentation issues discovered
by WS0 (archival, broken links, wrong-location content, stale
references). Completing it first ensures WS1-WS6 can focus
exclusively on the onboarding journey.

WS1 defines the structure. WS2/WS3 remove mechanical friction. WS4
aligns policy and secret handling. WS5 handles release-specific
onboarding. WS6 validates with a real first-day rehearsal.

---

## Workstream 0: Full Documentation Audit

**Problem**: The repository contains markdown files across `docs/`,
workspace READMEs, root files, `.agent/`, and application-level docs.
Some of this content predates the current architecture (e.g. references
to "Oak Notion MCP", GO.md grounding patterns, Greek ecosystem naming).
Without a complete inventory and triage, onboarding changes risk
preserving stale content, missing redundancies, or routing new
developers through dead material.

### Actions

1. **List every markdown file** in the repository, excluding:
   - `node_modules/`
   - `dist/`
   - `.turbo/`
   - `archive/` directories (note their existence but do not audit
     their contents)
   - Generated API docs (`packages/sdks/oak-curriculum-sdk/docs/api-md/`)

2. **Audit each file** against the current state of the codebase and
   classify issues into these categories:

   | Category | What to look for |
   | --- | --- |
   | **Outdated content** | References to old project names ("Oak Notion MCP"), old SDK names (`@oaknational/oak-curriculum-sdk`), old Node.js versions, deprecated patterns (GO.md grounding, ErrorHandler, Greek ecosystem) |
   | **Broken links** | Links to files that do not exist, wrong relative paths, links into `archive/` from non-archived files (flag as exception — should be rare) |
   | **Redundancy** | Multiple files covering the same topic, compatibility pointer pages that should have been deleted, duplicated guidance across locations |
   | **No longer relevant** | Entire files or sections describing features, patterns, or systems that have been removed or replaced. Includes legacy agent guidance, stale research conclusions, and obsolete proposals |
   | **Mechanical issues** | Markdownlint violations, poor formatting, missing headings, inconsistent structure |
   | **Factual errors** | Wrong commands, incorrect paths, claims that contradict the current codebase |

3. **Group findings by area** rather than listing per-file. Example
   groupings: root files, `docs/development/`, `docs/architecture/`,
   `docs/agent-guidance/`, `docs/data/`, workspace READMEs,
   application docs, `.agent/directives/`, `.agent/plans/` (active),
   `.agent/prompts/`, `.agent/research/` (non-archived).

4. **Produce a triage report** as a new file at
   `.agent/research/documentation-audit-report.md`. For each group:
   - List files with a one-line summary of each file's purpose
   - State whether the file is current, stale, partially stale, or
     should be deleted/archived
   - List specific issues found
   - Recommend action: keep as-is, update, rewrite, delete, or archive

5. **Flag cross-cutting themes** that affect multiple files (e.g.
   "12 files still reference GO.md", "8 files use the old SDK name",
   "5 files reference Node.js 22"). These inform the scope of WS2-WS4.

### Output

The primary output of this workstream is the triage report. It does
**not** fix anything — it maps the terrain so that WS1-WS6 can
execute with full situational awareness.

### Completion checklist

- [x] Every non-archived markdown file listed and categorised
- [x] Issues grouped by area with specific file references
- [x] Cross-cutting themes identified and quantified
- [x] Triage report written to `.agent/research/documentation-audit-report.md`
- [x] WS1-WS6 actions reviewed against audit findings (WS1, WS2, WS3 updated)

---

## Workstream 1: Canonical Onboarding Journey

**Depends on**: WS0 audit report (identifies all onboarding entry
points, compatibility pages, and stale routing).

**Problem**: The onboarding story still includes a compatibility layer.
The final state must be a clean break with one canonical path only.

**WS0 audit findings**: `docs/development/onboarding.md` requires a
full rewrite — it references "Oak Notion MCP", removed packages
(`mcp-storage`, `mcp-transport`), wrong commands, and has 5+ broken
links. GO.md is referenced in 15 non-archive files but the grounding
pattern is superseded by AGENT.md + directives. `docs/usage/` and
`docs/research/` contain entirely stale Notion-era content.

### Actions

1. Review the WS0 audit to identify every file that functions as an
   onboarding entry point or compatibility pointer.
2. Define one canonical onboarding entry document:
   `docs/development/onboarding.md`.
3. Delete `docs/onboarding.md` and any other compatibility pointer
   pages identified in WS0. Clean break — no redirect pages.
4. **Rewrite** `docs/development/onboarding.md` from scratch — the
   current content is entirely Notion-era and cannot be patched.
5. Decide the fate of `GO.md`: delete and remove all 15 references
   (clean break), or formalise its complementary role alongside
   AGENT.md. Update AGENT.md accordingly.
6. Delete or rewrite `docs/usage/README.md` and
   `docs/usage/api-reference.md` (entirely Notion MCP content).
   Delete or rewrite `docs/research/README.md` (references
   non-existent research targets).
7. Ensure all top-level entry points (`README.md`, `docs/README.md`,
   `CONTRIBUTING.md`) route to the canonical onboarding path.
8. Add a concise "choose your path" section in onboarding:
   SDK/docs work (no secrets), service work (minimal secrets), search
   and release work (full credentials).
9. Run a repository-wide link sweep to remove references to any
   deleted pages.

### Completion checklist

- [ ] One canonical onboarding document defined and referenced everywhere
- [ ] Legacy onboarding page removed (clean break, no pointer page)
- [ ] Root README and docs index point to the same onboarding path
- [ ] Persona-based onboarding paths documented
- [ ] Repository-wide references to deleted onboarding path removed

---

## Workstream 2: Command Truth and Drift Removal

**Depends on**: WS0 audit report (identifies all files with command
drift and quantifies the cross-cutting "stale commands" theme).

**Problem**: `README.md` and `CONTRIBUTING.md` commands were fixed during
public release readiness. The remaining drift is in secondary docs,
especially `docs/agent-guidance/ai-agent-guide.md` which still uses
`pnpm format` (should be `pnpm format:root`) and other legacy patterns.

**WS0 audit findings**: 9 non-archive files contain stale `pnpm format`
commands. Drift also exists in `.cursor/commands/` (`jc-gates.md`,
`jc-start-right-thorough.md`) and `.claude/commands/jc-quality-gates.md`.
Two `.cursor/skills/` files reference deleted `test-query-*.ts` scripts.

### Actions

1. Treat root `package.json` scripts as command source of truth.
2. Sweep all onboarding-adjacent docs for command drift:
   `docs/development/onboarding.md`, `docs/quick-start.md`,
   `docs/agent-guidance/ai-agent-guide.md`, and any other files
   referencing pnpm commands.
   Remove old aliases entirely; do not preserve dual command naming.
3. `docs/agent-guidance/ai-agent-guide.md` needs substantial
   rework — it references "Oak Notion MCP", the GO.md grounding
   pattern, and stale command names. Decide: rewrite or delete.
4. Sweep `.cursor/commands/` and `.claude/commands/` for stale
   commands (`test:e2e:built`, `pnpm format`, `pnpm check-types`).
5. Update `.cursor/skills/ground-truth-design/SKILL.md` and
   `.cursor/skills/ground-truth-evaluation/SKILL.md` — replace
   deleted `test-query-*.ts` script references with CLI commands.
6. Add a lightweight drift check (manual checklist or scripted check)
   so future command renames do not silently desynchronise docs.

### Completion checklist

- [ ] All onboarding-facing docs use real root command names
- [ ] Obsolete command references removed from onboarding path
- [ ] Command source-of-truth rule documented
- [ ] Drift prevention step added to documentation maintenance process

---

## Workstream 3: Link Integrity and Navigation

**Depends on**: WS0 audit report (comprehensive broken-link inventory).

**Problem**: Broken local links and missing target files exist in
onboarding-adjacent docs. The worst offender is
`docs/agent-guidance/ai-agent-guide.md` (2 dead links to non-existent
files, 1 wrong-path link). `docs/development/environment-variables.md`
also has a wrong-path link to `vercel-environment-config.md`.

### Known broken links (from WS0 audit — 20+ instances)

Previously known:

- `docs/agent-guidance/ai-agent-guide.md` -> `../development/onboarding-journey.md` (missing)
- `docs/agent-guidance/ai-agent-guide.md` -> `../quick-reference.md` (missing)
- `docs/agent-guidance/ai-agent-guide.md` -> `docs/troubleshooting.md` (wrong path; file is at `docs/development/troubleshooting.md`)
- `docs/development/environment-variables.md` -> `docs/vercel-environment-config.md` (wrong path; file is at `apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md`)

Discovered by WS0 audit:

- `GROUND-TRUTH-PROCESS.md` referenced in 7+ places in oak-search-cli (does not exist; should be `GROUND-TRUTH-GUIDE.md` or `ground-truth-protocol.md`)
- `DIAGNOSTIC-QUERIES.md` referenced in 2 places in oak-search-cli (does not exist)
- `oak-components-theming.md` referenced in `apps/oak-search-cli/docs/README.md` (does not exist)
- `experimental-architecture-quick-reference.md` referenced in `docs/agent-guidance/README.md` (does not exist)
- ADR index links 020, 021, 023 point to main directory instead of `docs/archive/architecture/architectural-decisions/`
- ADR name mismatches in `docs/architecture/openapi-pipeline.md`: 029, 030, 031, 048
- 6 `apps/oak-search-cli/operations/` READMEs contain wrong-workspace content (streamable-http content in search CLI)
- `apps/oak-search-cli/evaluation/experiments/README.md` contains Clerk OAuth content (wrong workspace)
- `apps/oak-search-cli/src/lib/search-quality/ground-truth-archive/README.md` contains MCP testing strategy (wrong workspace)

### Actions

1. Use the WS0 audit's broken-link inventory as the starting list.
   Supplement with a targeted link integrity pass if any area was
   under-covered.
2. Fix or remove all broken links. Use direct replacements; do not
   add compatibility redirects.
3. Remove or archive files flagged as "no longer relevant" in WS0.
   Delete rather than redirect.
4. Ensure progressive disclosure is explicit:
   root README -> onboarding -> workspace README -> deep docs/ADR.
5. Add link-check validation to docs QA for onboarding changes.

### Completion checklist

- [ ] Broken onboarding-path links fixed or removed
- [ ] No references to missing onboarding docs remain
- [ ] Progressive disclosure path is explicit and navigable
- [ ] Link-check step documented for ongoing maintenance

---

## Workstream 4: Credential, Access, and Contribution Messaging

**Problem**: The top-level contribution and Node.js version messaging was
fixed during public release readiness. Remaining work is ensuring
consistency in secondary onboarding docs (e.g. `docs/development/onboarding.md`,
`docs/quick-start.md`, agent guidance) and clarifying the credential matrix.

### Actions

1. Verify all onboarding-facing docs align with credential policy:
   real keys only in local untracked `.env*`; never in tracked files;
   `.env.example` must contain placeholders only.
2. Verify contribution language is consistent across all docs
   (public code visibility, no external PR/issues at this stage).
   Top-level docs are correct; sweep secondary docs.
3. Verify Node.js `24.x` is stated consistently in all onboarding docs.
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

**Problem**: `docs/development/release-and-publishing.md` now documents the
publishing strategy (packages, versioning, automation, npm token setup).
What remains is expanding it into a full operator runbook with step-by-step
dry-run, rollback, and troubleshooting guidance.

### Actions

1. Expand `docs/development/release-and-publishing.md` into a full
   release operator runbook. It currently covers strategy; add
   step-by-step operator procedures.
2. Add dry-run walkthrough with expected terminal output.
3. Add rollback guidance (npm unpublish window, git revert).
4. Document release prerequisites: npm token creation steps,
   GitHub token expectations, branch and commit conventions.
5. Cross-link the runbook from onboarding docs.

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
pnpm lint:fix
pnpm test
```

If release/onboarding scripts are changed, also run `pnpm build`,
`pnpm test:e2e`, and `pnpm smoke:dev:stub`.

### Completion checklist

- [ ] Documentation formatting/linting passes
- [ ] Updated onboarding paths validated manually
- [ ] Link integrity checks pass
- [ ] Release runbook reviewed against current workflow/config

---

## Related Documents

| Document | Purpose |
| --- | --- |
| `archive/completed/public-release-readiness.plan.md` | ✅ Public release blockers and npm readiness |
| `README.md` | Primary public entry point |
| `CONTRIBUTING.md` | Contributor policy and workflow |
| `docs/development/onboarding.md` | Canonical onboarding path |
| `docs/development/release-and-publishing.md` | SDK publishing strategy and automation |
| `docs/development/environment-variables.md` | Credential setup and safety |
| `docs/agent-guidance/ai-agent-guide.md` | Stale agent guide — needs rewrite or deletion (WS2/WS3) |
| `.releaserc.mjs` | Release automation configuration |
| `.github/workflows/release.yml` | CI release workflow |
