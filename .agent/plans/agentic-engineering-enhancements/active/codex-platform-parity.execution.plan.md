---
name: "Codex Platform Parity"
overview: "Create .codex/ project-agent layer and correct .agents/skills/ to achieve Cursor/Claude parity"
todos:
  - id: phase-0-audit
    content: "Phase 0: Audit current state and validate assumptions."
    status: done
  - id: phase-1-codex-agents
    content: "Phase 1: Create .codex/ directory with config.toml and reviewer agent adapters."
    status: done
  - id: phase-2-skill-cleanup
    content: "Phase 2: Remove reviewer-as-skill entries from .agents/skills/, fill gaps."
    status: done
  - id: phase-3-documentation
    content: "Phase 3: Update AGENT.md, practice-index.md, AGENTS.md, and run quality gates."
    status: done
---

# Codex Platform Parity

**Last Updated**: 2026-03-09
**Status**: ✅ COMPLETE
**Scope**: Create the `.codex/` project-agent layer for reviewer sub-agents and correct the `.agents/skills/` layer so reviewers are agents (not skills), achieving parity with Cursor and Claude platform adapters.

---

## Context

### Outcome

Codex has first-class access to the same reviewer sub-agents as Cursor and Claude, using the correct Codex mechanism (project agents via `.codex/config.toml`), not the wrong one (reviewer prompts modelled as skills).

### Impact

Any platform can invoke any reviewer. Platform choice no longer constrains review capability. The Practice's review system works identically regardless of whether the session is Cursor, Claude Code, or Codex.

### Value Mechanism

Platform parity removes a class of silent degradation: Codex sessions that should invoke specialist reviewers but cannot because the wiring doesn't exist. Each unreviewed change is a missed quality gate.

### Current State

- `.agents/skills/` contains 50 entries — a mix of commands (`jc-*`), utility skills, and **reviewers modelled as skills**. The reviewer-as-skill model is wrong: Codex project agents have read-only sandbox, high reasoning effort, and `approval_policy = "never"` — none of which are available to skills.
- `.codex/` does not exist. The Practice (practice.md, practice-bootstrap.md) documents Codex reviewer registration through `.codex/config.toml` + `.codex/agents/*.toml` but this has not been implemented in this repo.
- Cursor has 16 reviewer adapters in `.cursor/agents/`. Claude has 16 in `.claude/agents/`. Codex has zero in the correct location.

### Reference Implementation

`jimcresswell.net` (new-cv) has a working `.codex/` setup with `config.toml` + 5 agent adapters. The pattern is proven.

---

## Quality Gate Strategy

This plan creates only documentation/configuration files (`.md`, `.toml`). No product code changes. Quality gates:

```bash
pnpm format:root        # Format
pnpm markdownlint:root  # Markdown lint
pnpm subagents:check    # Sub-agent standards validation
```

Build/type-check/test gates are unaffected — no code changes.

---

## Non-Goals (YAGNI)

- ❌ Do NOT create an ADR for this — it implements the model already documented in practice-core and follows the reference in new-cv
- ❌ Do NOT touch Cursor or Claude adapters — they are already correct
- ❌ Do NOT modify canonical templates in `.agent/sub-agents/templates/` — they are consumed as-is
- ❌ Do NOT add Codex-specific features (multi-agent orchestration, CSV batch) — basic parity first
- ❌ Do NOT replace existing symlinks in `.claude/skills/` — address separately if needed

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md` — particularly no compatibility layers, no dead code
2. **Re-read** `.agent/directives/AGENT.md` §Agent Artefact Architecture
3. **Ask**: "Could it be simpler without compromising quality?"

---

## Resolution Plan

### Phase 0: Audit Current State

#### Task 0.1: Identify all reviewer-as-skill entries in `.agents/skills/`

Compare `.agents/skills/` directory listing against `.agent/sub-agents/templates/` and `.cursor/agents/`. Produce exact list of entries in `.agents/skills/` that are reviewer adapters (should be project agents, not skills).

**Acceptance Criteria**:

1. ✅ Complete list of reviewer skill directories to remove
2. ✅ Complete list of `.cursor/agents/*.md` files to use as composition reference for `.codex/agents/*.toml`
3. ✅ Confirmed that all 16 Cursor reviewer adapters have canonical templates

**Deterministic Validation**:

```bash
# Count Cursor reviewer adapters
ls .cursor/agents/*.md | wc -l
# Expected: 16

# Count canonical templates
ls .agent/sub-agents/templates/*.md | wc -l
# Expected: 13 (4 arch-reviewers share 1 template + 4 personas)
```

---

### Phase 1: Create `.codex/` Directory

#### Task 1.1: Create `.codex/config.toml`

Register all 16 reviewers as project agents. Follow the new-cv reference format: `[agents."name"]` with `description` and `config_file` fields. Enable `multi_agent` feature.

**Format per reviewer**:

```toml
[agents."code-reviewer"]
description = "Gateway reviewer for non-trivial changes."
config_file = ".codex/agents/code-reviewer.toml"
```

**Acceptance Criteria**:

1. ✅ `config.toml` has `[features]` section with `multi_agent = true`
2. ✅ All 16 reviewers registered with accurate descriptions (sourced from `.cursor/agents/` frontmatter)
3. ✅ All `config_file` paths point to `.codex/agents/{name}.toml`

#### Task 1.2: Create `.codex/agents/*.toml` — 16 thin adapter files

Each file follows the new-cv pattern:

```toml
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow `.agent/sub-agents/templates/{template-name}.md`.

This file is a thin Codex adapter. The canonical reviewer instructions live in
`.agent/sub-agents/templates/{template-name}.md`.

Mode: Observe, analyse and report. Do not modify code.
"""
```

For the 4 architecture-reviewer variants, the `developer_instructions` must compose both the shared template AND the individual persona, matching the Cursor adapter pattern:

```toml
developer_instructions = """
Read and apply `.agent/sub-agents/components/personas/{name}.md` for your persona identity and review lens.

Your first action MUST be to read and internalise `.agent/sub-agents/templates/architecture-reviewer.md`.

This file is a thin Codex adapter. Mode: Observe, analyse and report. Do not modify code.
"""
```

**The 16 files**:

| File | Template | Persona |
|---|---|---|
| `code-reviewer.toml` | `code-reviewer.md` | — |
| `test-reviewer.toml` | `test-reviewer.md` | — |
| `type-reviewer.toml` | `type-reviewer.md` | — |
| `config-reviewer.toml` | `config-reviewer.md` | — |
| `security-reviewer.toml` | `security-reviewer.md` | — |
| `docs-adr-reviewer.toml` | `docs-adr-reviewer.md` | — |
| `elasticsearch-reviewer.toml` | `elasticsearch-reviewer.md` | — |
| `mcp-reviewer.toml` | `mcp-reviewer.md` | — |
| `onboarding-reviewer.toml` | `onboarding-reviewer.md` | — |
| `release-readiness-reviewer.toml` | `release-readiness-reviewer.md` | — |
| `ground-truth-designer.toml` | `ground-truth-designer.md` | — |
| `subagent-architect.toml` | `subagent-architect.md` | — |
| `architecture-reviewer-fred.toml` | `architecture-reviewer.md` | `fred.md` |
| `architecture-reviewer-barney.toml` | `architecture-reviewer.md` | `barney.md` |
| `architecture-reviewer-betty.toml` | `architecture-reviewer.md` | `betty.md` |
| `architecture-reviewer-wilma.toml` | `architecture-reviewer.md` | `wilma.md` |

**Acceptance Criteria**:

1. ✅ 16 `.toml` files created in `.codex/agents/`
2. ✅ All reference canonical templates that exist in `.agent/sub-agents/templates/`
3. ✅ Architecture reviewers reference both shared template and individual persona
4. ✅ All use `sandbox_mode = "read-only"` and `approval_policy = "never"`
5. ✅ No substantive instructions in the adapters — only pointers to canonical sources

#### Task 1.3: Create `.codex/README.md`

Brief document explaining the Codex adapter model for this repo.

**Acceptance Criteria**:

1. ✅ Explains the split: `.agents/skills/` for skills and commands, `.codex/` for project agents
2. ✅ References AGENT.md and practice-core for the full model
3. ✅ Lists the reviewer roster with their template sources

---

### Phase 2: Clean Up `.agents/skills/` Reviewer Entries

#### Task 2.1: Remove reviewer-as-skill entries

Delete the reviewer directories from `.agents/skills/` that are now correctly wired through `.codex/agents/`. These are the entries that point to canonical reviewer templates — they should be project agents, not skills.

**Do NOT remove**:

- `jc-*` command adapters (9 entries) — commands are skills in Codex
- Utility skills (code-patterns, distillation, napkin, finishing-branch, etc.)
- Clerk skills
- Domain skills (elasticsearch-expert, ground-truth-design, ground-truth-evaluation, mcp-add-ui, mcp-convert-web, mcp-create-app, mcp-migrate-oai, parallel-agents, receiving-code-review, start-right-quick, start-right-thorough, systematic-debugging, worktrees)

**DO remove** (now wired through `.codex/agents/*.toml`):

- `architecture-reviewer-barney/`, `architecture-reviewer-betty/`, `architecture-reviewer-fred/`, `architecture-reviewer-wilma/`
- `code-reviewer/`, `config-reviewer/`, `docs-adr-reviewer/`
- `elasticsearch-reviewer/`, `ground-truth-designer/`
- `onboarding-reviewer/`, `release-readiness-reviewer/`
- `security-reviewer/`, `subagent-architect/`
- `test-reviewer/`, `type-reviewer/`

**Acceptance Criteria**:

1. ✅ All 15 reviewer-as-skill directories removed from `.agents/skills/`
2. ✅ All non-reviewer skills and commands remain untouched
3. ✅ `pnpm subagents:check` passes (if it validates `.agents/skills/`)

#### Task 2.2: Fill gaps — add mcp-reviewer skill adapter if needed

The mcp-reviewer exists in Cursor/Claude as an agent adapter but was missing from `.agents/skills/`. Since it is a reviewer, it now goes through `.codex/agents/mcp-reviewer.toml` (created in Phase 1). Verify it is NOT needed as a skill.

**Acceptance Criteria**:

1. ✅ mcp-reviewer is wired only through `.codex/agents/mcp-reviewer.toml`, not as a skill

---

### Phase 3: Documentation and Validation

#### Task 3.1: Update AGENT.md

Add `.codex/` to the Agent Artefact Architecture line (line 78).

**Acceptance Criteria**:

1. ✅ `.codex/` listed alongside `.cursor/`, `.claude/`, `.gemini/`, `.agents/`

#### Task 3.2: Update practice-index.md

Add `.codex/` row to the Artefact Directories table.

**Acceptance Criteria**:

1. ✅ `.codex/` row present with description "Codex project-agent configuration (reviewer sub-agents)"
2. ✅ Link resolves (directory exists)

#### Task 3.3: Update AGENTS.md

Verify the Codex Adapter Model section references `.codex/` correctly. Update if the section references are stale after Phase 2 changes.

**Acceptance Criteria**:

1. ✅ AGENTS.md Codex Adapter Model section accurately describes the new structure
2. ✅ References to `.codex/config.toml` and `.codex/agents/` are accurate

#### Task 3.4: Run quality gates

```bash
pnpm format:root
pnpm markdownlint:root
pnpm subagents:check
```

**Acceptance Criteria**:

1. ✅ All three gates pass
2. ✅ No reviewer-as-skill entries detected by `subagents:check`

---

## Success Criteria

### Overall

- ✅ `.codex/config.toml` registers all 16 reviewers
- ✅ `.codex/agents/` contains 16 thin adapter `.toml` files
- ✅ `.agents/skills/` contains only commands and utility skills (no reviewers)
- ✅ AGENT.md, practice-index.md, AGENTS.md all reference `.codex/`
- ✅ All quality gates pass
- ✅ Parity: Cursor (16 reviewers), Claude (16 reviewers), Codex (16 reviewers)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `subagents:check` fails after removing reviewer skills | Medium | Low | Check what `subagents:check` validates before removing |
| Codex doesn't discover `.codex/config.toml` | Low | Medium | Proven pattern in new-cv; test with `codex --ask-for-approval never` |
| Canonical template paths wrong in `.toml` files | Low | High (silent degradation) | Validate every path resolves before committing |

---

## Dependencies

**Blocking**: None — this is independent infrastructure work.

**Related Plans**: Practice-core integration (completed this session) documented the Codex model in portable files. This plan implements it locally.

**Prerequisites**:

- ✅ Practice-core integration complete (`.codex/` documented in practice.md)
- ✅ new-cv reference available for pattern validation
- ✅ All 13 canonical reviewer templates exist in `.agent/sub-agents/templates/`
- ✅ All 4 persona components exist in `.agent/sub-agents/components/personas/`

---

## References

- Codex multi-agent docs: `https://developers.openai.com/codex/multi-agent`
- Codex skills docs: `https://developers.openai.com/codex/skills`
- Codex AGENTS.md docs: `https://developers.openai.com/codex/guides/agents-md`
- Reference implementation: `jimcresswell.net/.codex/config.toml`
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/directives/AGENT.md`
  - `.agent/practice-core/practice.md` §Review System, §Artefact Map
  - `.agent/practice-core/practice-bootstrap.md` §Sub-agents, §Codex note
