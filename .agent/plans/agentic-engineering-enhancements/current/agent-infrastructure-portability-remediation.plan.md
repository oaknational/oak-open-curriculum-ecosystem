---
name: "Agent Infrastructure Portability — Audit and Remediation"
overview: >
  Comprehensive audit of the three-layer agent artefact model
  (ADR-125) across all platform directories, with remediation
  plan to achieve full compliance. Triggered by vendor skill
  installation (Clerk, MCP Apps) revealing systemic gaps in
  validation, adapter coverage, and documentation.
todos:
  - id: phase-1-canonicalise
    content: "Canonicalise vendor skills from platform dirs to .agent/skills/"
    status: completed
  - id: phase-2-thin-wrappers
    content: "Add missing thin wrappers across all platforms"
    status: completed
  - id: phase-3-validator
    content: "Enhance portability validator with reverse and form checks"
    status: completed
  - id: phase-4-settings
    content: "Clean up .claude/settings.json vendor permissions"
    status: completed
  - id: phase-5-docs
    content: "Update ADR-125, artefact inventory, and platform matrix"
    status: completed
  - id: phase-6-workflow
    content: "Establish documented post-install canonicalisation workflow"
    status: completed
  - id: phase-7-gates
    content: "Run quality gates and verify all checks pass"
    status: completed
isProject: false
---

# Agent Infrastructure Portability — Audit and Remediation

## Completion Note (2026-04-24)

This plan executed as part of the non-Planning Practice gap remediation.
The audit counts below are retained as the pre-remediation baseline.
Live truth is now enforced by `pnpm portability:check`, which currently
passes with 12 canonical commands, 36 canonical skills, 35 canonical
rules, 22 reviewer adapters, 37 Cursor triggers, 35 Claude rules, and
35 `.agents/rules` wrappers.

Resolution summary:

- vendor Clerk and MCP Apps skills canonicalised into `.agent/skills/`
  and recorded in `skills-lock.json`
- platform skill copies replaced with real thin-wrapper directories
  (no symlink adapters)
- missing skill wrappers and `.agents/rules/` wrappers added
- `.agents/agents/README.md` documents the intentional absence of
  portable sub-agent wrappers
- `scripts/validate-portability.mjs` now checks reverse links,
  thin-wrapper form, lock consistency, `.agents/rules`, symlink-free
  adapters, and Claude skill permissions
- ADR-125, PDR-009, the artefact inventory, and the surface matrix
  were amended with the current contract

## Source Strategy

- [ADR-125](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md) —
  three-layer model
- [agentskills.io specification](https://agentskills.io/specification) —
  cross-platform standard
- [artefact-inventory.md](../../memory/executive/artefact-inventory.md) —
  operational reference
- [cross-platform-agent-surface-matrix.md](../../memory/executive/cross-platform-agent-surface-matrix.md) —
  platform support matrix

## Preflight

Before any non-planning edits:

1. Re-read:
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. **Build-vs-Buy attestation**: not applicable — this plan
   remediates existing infrastructure, no new vendor adoption.
3. **Reviewer phase-alignment**: `assumptions-reviewer` PRE
   (validate audit claims); `architecture-reviewer-barney` and
   `architecture-reviewer-fred` MID (boundary and ADR
   compliance); `config-reviewer` MID (validator script
   changes); `docs-adr-reviewer` and `onboarding-reviewer`
   POST (documentation updates).

---

# Section 1: Audit Report

## 1.1 Architectural Context

### The Three-Layer Model (ADR-125)

| Layer | Location | Purpose |
| ----- | -------- | ------- |
| 1. Canonical | `.agent/` | Single source of truth for all agent infrastructure |
| 2. Platform adapters | `.agents/`, `.claude/`, `.cursor/`, `.codex/`, `.gemini/` | Thin wrappers pointing back to Layer 1 |
| 3. Entry points | `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` | Per-platform routing into `.agent/directives/AGENT.md` |

### The agentskills.io Standard

The [Agent Skills specification](https://agentskills.io/specification)
defines a cross-platform format adopted by 30+ agent platforms
(Claude Code, Cursor, Codex, VS Code, GitHub Copilot, Gemini CLI,
Junie, Roo Code, and others). Key points:

- **`.agents/skills/`** is the de facto cross-platform
  interoperability directory — agents scan it alongside their
  own platform-specific directory
- Skills are directories containing `SKILL.md` with YAML
  frontmatter (`name` + `description` required)
- Progressive disclosure: metadata at startup, full body on
  activation, resources on demand
- SKILL.md should be under 500 lines / 5,000 tokens

### Our Architectural Decision

The `vercel-labs/skills` CLI tool (v1.5.1) treats
`.agents/skills/` as the canonical location and creates
symlinks (or copies with `--copy`) outward to platform dirs.

**Our repo takes a different, stricter approach**: `.agent/`
(note: singular, no `s`) is the single canonical location. ALL
platform directories — including `.agents/` — contain thin
wrappers that delegate to `.agent/`. This gives us:

- Single source of truth with no drift
- No symlinks (repo has a no-symlinks rule)
- Full content only in `.agent/`, editable in one place
- Thin wrappers are cheap to regenerate after tool updates

This means after every `npx skills add/update`, a
**canonicalisation step** is needed: move full content from
platform dirs to `.agent/skills/`, replace platform copies
with thin wrappers.

## 1.2 Artefact Type Inventory

### Skills

**Canonical** (`.agent/skills/`): **24 directories**, each with
`SKILL.md` containing `classification: active|passive`
frontmatter.

| Canonical skill | `.agents/` | `.claude/` | `.cursor/` |
| --------------- | ---------- | ---------- | ---------- |
| accessibility-expert | THIN | MISSING | THIN |
| assumptions-expert | MISSING | MISSING | THIN |
| chatgpt-report-normalisation | THIN | MISSING | THIN |
| clerk-expert | THIN | MISSING | THIN |
| commit | THIN | MISSING | THIN |
| complex-merge | MISSING | MISSING | THIN |
| design-system-expert | THIN | MISSING | THIN |
| elasticsearch-expert | THIN | MISSING | THIN |
| finishing-branch | THIN | MISSING | THIN |
| go | MISSING | MISSING | THIN |
| ground-truth-design | THIN | MISSING | THIN |
| ground-truth-evaluation | THIN | MISSING | THIN |
| mcp-expert | THIN | MISSING | THIN |
| napkin | THIN | MISSING | THIN |
| parallel-agents | THIN | MISSING | THIN |
| patterns | THIN | THIN | THIN |
| react-component-expert | THIN | MISSING | THIN |
| receiving-code-review | THIN | MISSING | THIN |
| sentry-expert | MISSING | MISSING | THIN |
| start-right-quick | THIN | MISSING | THIN |
| start-right-thorough | THIN | MISSING | THIN |
| systematic-debugging | THIN | MISSING | THIN |
| tsdoc | MISSING | MISSING | THIN |
| worktrees | THIN | MISSING | THIN |
| **Totals** | **19 THIN, 5 MISSING** | **1 THIN, 23 MISSING** | **24 THIN, 0 MISSING** |

**Vendor skills** (full content, no canonical `.agent/skills/`
equivalent):

| Vendor skill | Source | `.agents/` | `.claude/` | `.cursor/` |
| ------------ | ------ | ---------- | ---------- | ---------- |
| clerk | clerk/skills | FULL | FULL | FULL |
| clerk-backend-api | clerk/skills | FULL | FULL | — |
| clerk-custom-ui | clerk/skills | FULL | FULL | FULL |
| clerk-nextjs-patterns | clerk/skills | FULL | FULL | FULL |
| clerk-orgs | clerk/skills | FULL | FULL | FULL |
| clerk-setup | clerk/skills | FULL | FULL | FULL |
| clerk-testing | clerk/skills | FULL | FULL | FULL |
| clerk-webhooks | clerk/skills | FULL | FULL | FULL |
| add-app-to-server | modelcontextprotocol/ext-apps | FULL | FULL | — |
| convert-web-app | modelcontextprotocol/ext-apps | FULL | FULL | — |
| create-mcp-app | modelcontextprotocol/ext-apps | FULL | FULL | — |
| migrate-oai-app | modelcontextprotocol/ext-apps | FULL | FULL | — |
| **Totals** | | **12 FULL** | **12 FULL** | **7 FULL** |

**Subdirectories** bundled with vendor skills (must move with
canonical content):

- `clerk-backend-api/`: `scripts/`, `evals/`
- `clerk-custom-ui/`: `core-2/`, `core-3/`
- `clerk-orgs/`: `evals/`, `references/`
- `clerk-setup/`: `evals/`
- `clerk-webhooks/`: `evals/`
- `clerk-nextjs-patterns/`: `references/`,
  `.claude-plugin/` (tool-generated, can be removed)

### Commands

**Canonical** (`.agent/commands/`): **12 active** + 3
experimental + 1 partial.

All 4 platforms have thin wrappers for all active commands.
**No gaps.** ✓

| Platform | Count | Format |
| -------- | ----- | ------ |
| `.cursor/commands/` | 10 `jc-*.md` | `@.agent/commands/…` |
| `.claude/commands/` | 10 `jc-*.md` | `Read and follow .agent/commands/…` |
| `.gemini/commands/` | 10 `jc-*.toml` | `prompt = "Read and follow…"` |
| `.agents/skills/` | 10 `jc-*/SKILL.md` | `Read and follow .agent/commands/…` |

**Note**: `.agents/` currently has no `commands/` directory —
commands are expressed as `jc-*` skill directories. This
follows the Codex convention where commands and skills share
the same surface. For the `.agents/` cross-platform standard,
this is acceptable since the agentskills.io spec does not
define a separate commands artefact type.

### Rules

**Canonical** (`.agent/rules/`): **31 rules**.

| Platform | Count | Format | Status |
| -------- | ----- | ------ | ------ |
| `.cursor/rules/` | 33 `.mdc` | `alwaysApply: true` + pointer | ✓ (31 canonical + 2 platform-specific) |
| `.claude/rules/` | 31 `.md` | Plain text pointer | ✓ |
| `.agents/` | 0 | — | **NO RULES ADAPTERS** |
| `.gemini/` | 0 | — | Rules via entry-point chain |

**Gap**: `.agents/` has no rules directory.

**Decision (D1)**: add `.agents/rules/` with 31 thin wrappers.
The agentskills.io spec focuses on skills, but platforms
scanning `.agents/` as their primary directory may also look
for rules. The thin-wrapper cost is negligible.

### Sub-agents

**Canonical** (`.agent/sub-agents/templates/`): **19 templates**

- 4 personas + shared components.

| Platform | Count | Format | Status |
| -------- | ----- | ------ | ------ |
| `.cursor/agents/` | 22 `.md` | Frontmatter + template loading | ✓ |
| `.claude/agents/` | 22 `.md` + 1 archived | Frontmatter + template loading | ✓ |
| `.codex/agents/` | 22 `.toml` + `config.toml` roster | TOML + developer_instructions | ✓ |
| `.agents/` | 0 | — | **NO SUB-AGENT ADAPTERS** |

**Gap**: `.agents/` has no agents directory.

**Decision (D1)**: create `.agents/agents/README.md` only —
explains the intentional omission and links to ADR-125 and
`.agent/sub-agents/templates/`. No thin wrappers for
sub-agents because invocation is platform-specific.

### Hooks

| Platform | Surface | Status |
| -------- | ------- | ------ |
| `.claude/settings.json` | 3 `PreToolUse` hooks | ✓ |
| `.agent/hooks/policy.json` | Hook policy status | ✓ |
| `.agents/` | No hooks surface | N/A — no standard |

## 1.3 Portability Validator Gap Analysis

**Script**: `scripts/validate-portability.mjs` (450 lines,
11 checks).

### Existing Checks

| # | Check | What it validates |
| - | ----- | ----------------- |
| 1 | Command adapters → canonical | Adapter refs match `.agent/commands/` |
| 2 | Cross-platform command count | All platforms have same count |
| 3 | Skill adapters → canonical | `.cursor/` and `.agents/` skills have canonical |
| 4 | Skill classification frontmatter | `active` or `passive` required |
| 5 | Rule triggers reference canonical | Content contains `.agent/rules/` or `.agent/skills/` |
| 6 | Orphan detection | Canonical with no platform adapter |
| 7 | Reviewer adapter parity | Cursor/Claude/Codex all have same reviewers |
| 8 | Rule orphan detection | Canonical rule has both Claude and Cursor adapters |
| 9 | Trigger content contract | Cursor `.mdc` files ≤10 content lines |
| 10 | Hook portability parity | `.agent/hooks/policy.json` ↔ `.claude/settings.json` |
| 11 | Skill permission parity | Claude commands registered in `settings.json` |

### Missing Checks

| Gap | Severity | Description | Lines affected |
| --- | -------- | ----------- | -------------- |
| **No reverse check** | HIGH | Platform adapters not verified to point back to `.agent/` canonical source | Check 3 (L201-225) only checks forward direction |
| **No form validation** | HIGH | No check that adapter content is a thin wrapper (not full content) | All skill/rule checks |
| **Vendor skills silently excluded** | HIGH | `isClerkSkill()` (L103) and `isMcpAppsVendorSkill()` (L108-117) skip vendor skills entirely | Check 3 (L214-217) |
| **Claude skills not checked** | MEDIUM | `skillAdapterPlatforms` (L206-209) only includes Cursor and Codex, not Claude | Check 3 |
| **Claude not in orphan check** | MEDIUM | Check 6 (L291-298) only checks `.cursor/` and `.agents/`, not `.claude/` | Check 6 |
| **No Claude rule size limit** | LOW | Check 9 (L341-367) only applies to `.cursor/rules/*.mdc` | Check 9 |
| **`skills-lock.json` not validated** | LOW | Lock file entries not cross-referenced with canonical skills or platform adapters | — |
| **`.agents/` not checked for missing canonical skills** | MEDIUM | 5 canonical skills missing from `.agents/skills/` not caught | Check 6 |

### Silent Exclusion Pattern (Critical)

Lines 103-117 and 214-217 of `validate-portability.mjs`:

```javascript
// Lines 103-117: exclusion functions
function isClerkSkill(name) {
  return name.startsWith('clerk');
}
const MCP_APPS_VENDOR_SKILLS = new Set([
  'add-app-to-server', 'convert-web-app',
  'create-mcp-app', 'migrate-oai-app',
]);

// Lines 214-217: applied in Check 3
if (isClerkSkill(dir) || dir.startsWith('jc-')) continue;
if (isSubagentAdapter(dir)) continue;
if (isMcpAppsVendorSkill(dir)) continue;
```

This means **all vendor skills bypass validation entirely**.
After canonicalisation (Phase 1), these exclusions should be
removed — vendor skills will have canonical sources and thin
wrappers like everything else.

## 1.4 Documentation Accuracy

### ADR-125 — Outdated Counts

| Artefact | ADR-125 claims | Actual | Delta |
| -------- | -------------- | ------ | ----- |
| Active skills | 2 | 12 | +10 |
| Passive skills | 10 | 12 | +2 |
| Total skills | 12 | 24 | +12 |
| Active commands | 10 | 12 | +2 |
| Sub-agent templates | 11 | 19 | +8 |
| Canonical rules | — (not counted) | 31 | — |

### ADR-125 — `.agents/` Characterisation

ADR-125 (lines 67-74) describes `.agents/` exclusively as the
**Codex** platform adapter layer. It does not recognise
`.agents/` as the cross-platform standard per agentskills.io.

### ADR-125 — Missing Sections

- No §Validation/Enforcement section (what `pnpm
  portability:check` should verify)
- No §Externally-Installed Skills section (vendor skill
  lifecycle: install → canonicalise → thin-wrap → lock)
- No reference to `skills-lock.json`
- No reference to agentskills.io standard

### Artefact Inventory — Outdated

`.agent/memory/executive/artefact-inventory.md` labels
`.agents/` as "Codex" throughout and does not include
`.agents/` in the "How to Create New Artefacts" sections for
all artefact types.

## 1.5 `npx skills` Interaction Analysis

### Installation Flow

```text
npx skills add clerk/skills --agent claude-code cursor --copy
    │
    ├─→ .agents/skills/clerk*/SKILL.md   (full content, primary)
    ├─→ .claude/skills/clerk*/SKILL.md   (full content, copy)
    └─→ .cursor/skills/clerk*/SKILL.md   (full content, copy)
```

### Post-Install Canonicalisation Workflow (Needed)

```text
1. npx skills add <source> --copy --all
2. For each new skill in .agents/skills/:
   a. Move full content to .agent/skills/<name>/
   b. Add classification: passive to frontmatter
   c. Replace .agents/skills/<name>/SKILL.md with thin wrapper
   d. Replace .claude/skills/<name>/SKILL.md with thin wrapper
   e. Replace .cursor/skills/<name>/SKILL.md with thin wrapper
3. Run pnpm portability:check (must pass)
```

### Open Question: `npx skills update`

When `npx skills update` runs, it will overwrite platform
files (including thin wrappers) with fresh full content from
upstream. This means:

- `.agents/skills/clerk/SKILL.md` (thin wrapper) → overwritten
  with full content
- `.claude/skills/clerk/SKILL.md` (thin wrapper) → overwritten
- `.cursor/skills/clerk/SKILL.md` (thin wrapper) → overwritten

**The canonical copy in `.agent/skills/` is untouched** (the
skills tool does not know about `.agent/`). So the content is
safe, but the thin wrappers need regenerating after every
update.

**Mitigation options**:

1. **Script the canonicalisation** as an agent-tool
   (`pnpm agent-tools:canonicalise-vendor-skills`) that
   detects full content in platform dirs and replaces with
   thin wrappers — **promoted to a dedicated future plan**:
   [`../future/canonical-first-skill-pack-ingestion-tooling.plan.md`](../future/canonical-first-skill-pack-ingestion-tooling.plan.md)
   (vendor-agnostic by construction; promotion gated on deep
   sub-agent reviews).
2. **Add a portability validator check** that catches full
   content in platform dirs (Phase 3, Check 14)
3. **Document the workflow** so the human operator knows to
   run canonicalisation after `npx skills update`

---

# Section 2: Remediation Plan

## Phase 1: Canonicalise Vendor Skills

**Goal**: Move 12 vendor skills from platform directories to
`.agent/skills/` as canonical content.

### Skills to canonicalise

Use `.agents/skills/<name>/` as the source (richest copy) for
each. All subdirectories (scripts/, evals/, references/,
core-2/, core-3/) move with the canonical content.

1. `clerk` (from `clerk/skills`)
2. `clerk-backend-api` (from `clerk/skills`)
3. `clerk-custom-ui` (from `clerk/skills`)
4. `clerk-nextjs-patterns` (from `clerk/skills`)
5. `clerk-orgs` (from `clerk/skills`)
6. `clerk-setup` (from `clerk/skills`)
7. `clerk-testing` (from `clerk/skills`)
8. `clerk-webhooks` (from `clerk/skills`)
9. `add-app-to-server` (from `modelcontextprotocol/ext-apps`)
10. `convert-web-app` (from `modelcontextprotocol/ext-apps`)
11. `create-mcp-app` (from `modelcontextprotocol/ext-apps`)
12. `migrate-oai-app` (from `modelcontextprotocol/ext-apps`)

### For each skill

1. Copy `.agents/skills/<name>/` to `.agent/skills/<name>/`
   (including all subdirectories)
2. Add `classification: passive` to SKILL.md frontmatter (all
   vendor skills are description-triggered, not slash-invoked)
3. Remove `.claude-plugin/` directories if present (tool
   artefact, not canonical content)
4. Replace `.agents/skills/<name>/SKILL.md` with thin wrapper
5. Replace `.claude/skills/<name>/SKILL.md` with thin wrapper
6. Replace `.cursor/skills/<name>/SKILL.md` with thin wrapper
   (where it exists)
7. Remove subdirectories from platform copies (evals/,
   scripts/, references/, core-2/, core-3/ — only canonical
   copy retains these)

### Thin wrapper format

```yaml
---
name: <name>
description: <description from original frontmatter>
---
```

```markdown
# <Name> (<Platform>)

Read and follow `.agent/skills/<name>/SKILL.md`.
```

### Acceptance

- `ls .agent/skills/clerk*/SKILL.md` shows all 8 Clerk
  skills as canonical
- `ls .agent/skills/{add-app-to-server,convert-web-app,create-mcp-app,migrate-oai-app}/SKILL.md`
  shows all 4 MCP Apps skills as canonical
- No platform directory contains full vendor skill content
- `pnpm portability:check` passes (after Phase 3 validator
  updates, or with temporary exclusion removal)

### Files affected

~48 SKILL.md files + subdirectory moves. Estimated 12 new
canonical directories, 36 thin wrapper replacements.

## Phase 2: Add Missing Thin Wrappers

**Goal**: Every canonical skill has thin wrappers in ALL
platform directories. Additionally, `.agents/` gets rules
adapters and an `agents/` README.

### Missing `.claude/skills/` wrappers (23)

Create thin wrappers for: accessibility-expert,
assumptions-expert, chatgpt-report-normalisation, clerk-expert,
commit, complex-merge, design-system-expert,
elasticsearch-expert, finishing-branch, go,
ground-truth-design, ground-truth-evaluation, mcp-expert,
napkin, parallel-agents, react-component-expert,
receiving-code-review, sentry-expert, start-right-quick,
start-right-thorough, systematic-debugging, tsdoc, worktrees.

### Missing `.agents/skills/` wrappers (5)

Create thin wrappers for: assumptions-expert, complex-merge,
go, sentry-expert, tsdoc.

### Missing `.cursor/skills/` wrappers (0)

All 24 canonical skills have Cursor wrappers. ✓

### New `.agents/rules/` directory (31 wrappers)

Create `.agents/rules/` with thin wrappers for all 31
canonical rules. Format follows the `.claude/rules/` pattern:
plain text pointer to `.agent/rules/<name>.md`.

### New `.agents/agents/README.md`

Create `.agents/agents/README.md` explaining that sub-agent
adapters are NOT provided in `.agents/` because sub-agent
invocation is deeply platform-specific (Cursor Task tool,
Claude Agent tool, Codex config.toml). Link back to ADR-125
and the canonical templates in `.agent/sub-agents/templates/`.

### Acceptance

- Every directory in `.agent/skills/` has a matching directory
  in `.agents/skills/`, `.claude/skills/`, and
  `.cursor/skills/`
- Every platform SKILL.md is a thin wrapper (≤15
  non-frontmatter lines, contains reference to
  `.agent/skills/`)
- `.agents/rules/` contains 31 thin wrappers matching
  `.agent/rules/`
- `.agents/agents/README.md` exists and explains the
  intentional omission

### Files affected

60 new files (23 Claude skill wrappers + 5 `.agents/` skill
wrappers + 31 `.agents/` rule wrappers + 1 README).

## Phase 3: Enhance Portability Validator

**Goal**: `scripts/validate-portability.mjs` catches all
current and future compliance violations.

### New Check 12: Claude skill adapter parity

Add `.claude/skills/` to the `skillAdapterPlatforms` array at
line 206-209. Every canonical skill must have a Claude adapter.

### New Check 13: Reverse direction validation

For each skill in `.agents/skills/`, `.claude/skills/`, and
`.cursor/skills/`, verify that `.agent/skills/<name>/SKILL.md`
exists. Replaces the silent vendor exclusion with explicit
validation.

### New Check 14: Thin-wrapper form validation

For each platform skill adapter, read the content and verify:

- Contains a reference to `.agent/skills/` or
  `.agent/commands/`
- Has ≤15 non-frontmatter content lines
- Flag violations as errors (not warnings)

Exclude `jc-*` directories (command adapters reference
`.agent/commands/`, not `.agent/skills/`).

### New Check 15: `skills-lock.json` consistency

Every entry in `skills-lock.json` must:

- Have a corresponding `.agent/skills/<name>/SKILL.md`
- Have thin wrappers in `.agents/skills/`, `.claude/skills/`,
  `.cursor/skills/`

### Existing check updates

- **Check 3** (L206-209): add Claude to
  `skillAdapterPlatforms`
- **Check 3** (L214-217): remove `isClerkSkill()` and
  `isMcpAppsVendorSkill()` exclusions
- **Check 6** (L291-298): add Claude to orphan detection
- **Check 8** (L322-339): add `.agents/rules/` to rule
  orphan detection (currently only checks Claude and Cursor)
- **Check 9** (L341-367): apply content-line limit to Claude
  rules and `.agents/` rules as well as Cursor

### Acceptance

- `pnpm portability:check` catches a simulated violation
  (temporarily add full content to a platform dir)
- All new checks produce clear error messages
- Zero false positives on the current (post-remediation)
  codebase

### Files affected

- `scripts/validate-portability.mjs` (~80 new lines)
- `scripts/validate-portability-helpers.mjs` (if helpers
  needed)

## Phase 4: Clean Up `.claude/settings.json`

**Goal**: Remove vendor-specific permissions that are no longer
needed.

### Changes

Remove these `Edit` permissions (vendor content now lives in
`.agent/`, not `.claude/`):

```json
"Edit(/.claude/skills/clerk/**)",
"Edit(/.claude/skills/clerk-custom-ui/**)",
"Edit(/.claude/skills/clerk-nextjs-patterns/**)",
"Edit(/.claude/skills/clerk-orgs/**)",
"Edit(/.claude/skills/clerk-setup/**)",
"Edit(/.claude/skills/clerk-testing/**)",
"Edit(/.claude/skills/clerk-webhooks/**)"
```

### Acceptance

- `.claude/settings.json` contains no `Edit` permissions for
  `.claude/skills/` vendor content
- `pnpm portability:check` still passes (Check 11)

### Files affected

`.claude/settings.json` (7 lines removed)

## Phase 5: Update Documentation

**Goal**: ADR-125, artefact inventory, and platform matrix
accurately reflect the current architecture.

### ADR-125 Amendments

1. **Update counts**: skills 12→24, templates 11→19,
   commands 10→12, add rules count 31
2. **Rename `.agents/`**: from "Codex" to "Cross-platform
   standard (agentskills.io)" throughout
3. **Add §Validation and Enforcement**: document what
   `pnpm portability:check` validates (all 15 checks)
4. **Add §Externally-Installed Skills**: document the
   vendor skill lifecycle (install → canonicalise →
   thin-wrap → lock) and `skills-lock.json`
5. **Reference agentskills.io**: as the external standard
   that `.agents/` implements

### Artefact Inventory

1. Update Platform Adapters table: `.agents/` →
   "Cross-platform (agentskills.io)"
2. Add `.agents/` to "How to Create New Artefacts" sections
3. Update counts where shown

### Cross-Platform Matrix

1. Update `.agents/` description from "Codex" to
   "Cross-platform standard"
2. Verify all artefact types are represented

### Acceptance

- ADR-125 counts match `pnpm portability:check` stats output
- Artefact inventory correctly describes `.agents/` as
  cross-platform standard
- A new contributor reading ADR-125 could correctly create a
  new skill with all platform adapters

### Files affected

- `docs/architecture/architectural-decisions/125-agent-artefact-portability.md`
- `.agent/memory/executive/artefact-inventory.md`
- `.agent/memory/executive/cross-platform-agent-surface-matrix.md`

## Phase 6: Post-Install Canonicalisation Workflow

**Goal**: make the workflow durable enough that vendor skill
updates cannot silently reintroduce full content in platform
directories.

### Implemented route

This slice chose a documented workflow plus validator enforcement,
not a new `agent-tools` CLI. That keeps the remediation scoped to
agent infrastructure portability and avoids adding another tool
surface before a second install/update event proves the need.

The active workflow is:

1. Install or update vendor skills with the external tool.
2. Move full content into `.agent/skills/<name>/`.
3. Add `classification: passive`.
4. Record the skill in `skills-lock.json`.
5. Replace every platform copy with a thin wrapper.
6. Run `pnpm portability:check`.

ADR-125 now records the workflow, and the portability validator
enforces the safety net: full platform content, missing wrappers,
missing lock entries, symlink adapters, and missing Claude skill
permissions fail the gate.

### Future trigger

If a future session performs another vendor skill install/update and
the manual workflow proves repetitive or error-prone, promote the
wrapper-script design into a separate `agent-tools` plan.

## Phase 7: Quality Gates

```bash
pnpm portability:check     # Must pass with all new checks
pnpm subagents:check       # No sub-agent regression
pnpm test:root-scripts     # Root validator/script coverage
pnpm agent-tools:build     # Agent-tools compile check
pnpm agent-tools:lint      # Agent-tools lint check
pnpm agent-tools:test      # Agent-tools test coverage
pnpm practice:fitness:informational # Non-blocking doctrine-size report
pnpm practice:vocabulary   # Fitness vocabulary consistency
pnpm format:root           # Formatting
pnpm markdownlint:root     # Markdown linting
git diff --check           # Whitespace check
```

---

# Section 3: Decisions (Resolved)

## D1: `.agents/` rules and sub-agents

**Decision**: YES for rules, NO for sub-agents (with README).

- `.agents/rules/` — 35 thin wrappers, one per canonical
  rule. Platforms scanning `.agents/` as their primary
  directory may look for rules there.
- `.agents/agents/README.md` — explains that sub-agent
  adapters are intentionally absent because sub-agent
  invocation is deeply platform-specific. Links to ADR-125
  and the canonical templates in
  `.agent/sub-agents/templates/`.

## D2: `npx skills update` overwrite protection

**Decision**: documented canonicalisation workflow + safety net.

The first remediation slice keeps the post-install workflow
manual and explicit: install/update upstream skills, move full
content into `.agent/skills/`, update `skills-lock.json`, restore
thin platform wrappers, then run `pnpm portability:check`. If a
future vendor-skill update proves this repetitive or error-prone,
promote wrapper tooling into a separate `agent-tools` plan.

The portability validator thin-wrapper, lock, symlink, and reverse-link
checks remain the active safety net — if someone runs `npx skills add`
directly and leaves full content in platform adapters, the quality gate
blocks the drift.

## D3: Canonicalisation tooling

**Decision**: defer CLI tooling until a repeated install/update event.

No `install-skill` or `update-skill` command is created in this
slice. The validator and documented workflow are sufficient for
the current remediation; tooling belongs in a future plan if the
manual workflow proves inadequate.

## D4: PR strategy

**Decision**: land with the non-Planning Practice remediation slice.

This work executed alongside the Practice structural remediation in
the current workspace while preserving concurrent Sentry-session work.
