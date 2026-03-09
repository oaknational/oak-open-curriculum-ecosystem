# Platform Adapter Reference

Detailed format specifications for each AI platform's adapter files.
This is a companion to [reviewer-system-guide.md](reviewer-system-guide.md).

---

## Platform Support Status

| Platform | Rules | Agents | Commands | Status |
|----------|-------|--------|----------|--------|
| Claude Code | `.claude/rules/*.md` | `.claude/agents/*.md` | `.claude/commands/*.md` | Proven, production use |
| Cursor | `.cursor/rules/*.mdc` | `.cursor/agents/*.md` | `.cursor/commands/*.md` | Proven, production use |
| Gemini CLI | (via commands) | (via commands) | `.gemini/commands/*.toml` | Proven, production use |
| OpenAI Codex | (via entry-point chain) | `.codex/` project-agent config | `.agents/skills/*/SKILL.md` | Proven, production use |
| Anthropic Antigravity | TBD | TBD | TBD | Not yet investigated |

---

## Claude Code

### Rules (`.claude/rules/*.md`)

**Format**: Plain Markdown. Optional YAML frontmatter for file-scoped rules.

**Always-apply rule** (no frontmatter needed):

```markdown
Read and follow `.agent/rules/no-type-shortcuts.md`.
```

**File-scoped rule** (activates only for matching paths):

```markdown
---
paths:
  - '**/*.test.ts'
---

Read and follow `.agent/rules/no-global-state-in-tests.md`.
```

**Naming**: Same as canonical rule: `{rule-name}.md`

### Agents (`.claude/agents/*.md`)

**Format**: Markdown with YAML frontmatter.

**Required frontmatter fields**:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Agent slug (lowercase, hyphens). Must match invocation name. |
| `description` | string | Multi-line delegation trigger. Include `<example>` tags for best results. |
| `tools` | string | Comma-separated list of allowed tools (e.g., `Read, Grep, Glob, Bash`) |
| `model` | string | `sonnet`, `opus`, or `haiku` |

**Optional frontmatter fields**:

| Field | Type | Description |
|-------|------|-------------|
| `disallowedTools` | string | Tools explicitly forbidden (e.g., `Write, Edit` for read-only agents) |
| `color` | string | Visual identifier (`orange`, `blue`, `green`, `red`, `purple`, `pink`, `cyan`, `teal`, `yellow`) |
| `permissionMode` | string | `plan` for read-only, omit for full access |

**Body content**: Keep to 5-10 lines. Must include the template-loading instruction.

**Example** (read-only reviewer):

```yaml
---
name: code-reviewer
description: "Gateway code review specialist for quality, correctness, and
  maintainability. Invoke immediately after any code is written or modified.

  <example>
  Context: A developer has just implemented a new feature.
  user: \"Can you review my changes?\"
  assistant: \"I'll invoke code-reviewer to assess correctness and flag
  any specialists that should also review.\"
  </example>"
tools: Read, Grep, Glob, Bash
disallowedTools: Write, Edit
model: sonnet
color: orange
permissionMode: plan
---

# Code Reviewer

All file paths are relative to the repository root.

Your first action MUST be to read and internalise
`.agent/sub-agents/templates/code-reviewer.md`.

Review and report only. Do not modify code.
```

**Example** (persona variant):

```yaml
---
name: architecture-reviewer-fred
description: "Principles-first architecture reviewer focused on strict ADR
  compliance and boundary discipline..."
tools: Read, Grep, Glob, Bash
disallowedTools: Write, Edit
model: opus
color: blue
permissionMode: plan
---

# Architecture Reviewer: Fred

All file paths are relative to the repository root.

Read and apply `.agent/sub-agents/components/personas/fred.md`
for your persona identity and review lens.

Your first action MUST be to read and internalise
`.agent/sub-agents/templates/architecture-reviewer.md`.

Review and report only. Do not modify code.
```

**Example** (lighter model with compensation):

```yaml
---
name: architecture-reviewer-wilma
description: "Adversarial architecture reviewer..."
tools: Read, Grep, Glob, Bash
disallowedTools: Write, Edit
model: haiku
color: blue
permissionMode: plan
---

# Architecture Reviewer: Wilma

All file paths are relative to the repository root.

Read and apply `.agent/sub-agents/components/personas/wilma.md`.

Because you are operating on a lighter model, compensate through
disciplined depth: review slowly, do at least two explicit passes
(first for structure, second for edge cases), and only finalise
findings after cross-checking against the referenced ADRs and rules.

Your first action MUST be to read and internalise
`.agent/sub-agents/templates/architecture-reviewer.md`.

Review and report only. Do not modify code.
```

### Commands (`.claude/commands/*.md`)

**Format**: Plain Markdown. The filename becomes the slash command name.

```markdown
Read and follow `.agent/commands/commit.md`.
```

Invoked as `/jc-commit` in Claude Code.

---

## Cursor

### Rules (`.cursor/rules/*.mdc`)

**Format**: Markdown with Cursor-specific YAML frontmatter. Extension is `.mdc`.

**Required frontmatter fields**:

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Brief human-readable trigger description |
| `alwaysApply` | boolean | `true` for core rules, `false` for conditional |

**Content contract**: Body content must be **≤10 non-empty lines**
(excluding frontmatter). This is enforced by the portability validation.

**Example**:

```yaml
---
description: ALL types flow from the OpenAPI schema via pnpm sdk-codegen.
alwaysApply: true
---

Read and follow `.agent/rules/cardinal-rule-types-from-schema.md`.
```

### Agents (`.cursor/agents/*.md`)

**Format**: Markdown with YAML frontmatter.

**Required frontmatter fields**:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Agent slug (must match Claude wrapper name) |
| `model` | string | `default` or a specific model name |
| `description` | string | Delegation trigger (shorter than Claude — no example tags) |

**Optional frontmatter fields**:

| Field | Type | Description |
|-------|------|-------------|
| `tools` | string | Comma-separated tool list. Uses Cursor tool names: `Read, Glob, Grep, LS, Shell, ReadLints` |
| `readonly` | boolean | `true` to restrict write operations |

**Cursor tool name mapping** (differs from Claude):

| Claude | Cursor |
|--------|--------|
| `Bash` | `Shell` |
| `Read` | `Read` |
| `Glob` | `Glob` |
| `Grep` | `Grep` |
| (no equivalent) | `LS` |
| (no equivalent) | `ReadLints` |
| `Edit` | (not listed for read-only) |
| `Write` | (not listed for read-only) |

**Example**:

```yaml
---
tools: Read, Glob, Grep, LS, Shell, ReadLints
name: code-reviewer
model: default
description: Expert code review specialist for quality, security, and
  maintainability. Use proactively and immediately after writing or
  modifying code.
readonly: true
---

# Code Reviewer

**All file paths in this document are relative to the repository root.**

Your first action MUST be to read and internalise
`.agent/sub-agents/templates/code-reviewer.md`.

Review and report only. Do not modify code unless explicitly requested.
```

### Commands (`.cursor/commands/*.md`)

Same format as Claude commands.

---

## Gemini CLI

### Commands (`.gemini/commands/*.toml`)

**Format**: TOML with `description` and `prompt` fields.

Gemini does not have a separate rules or agents system. Instead,
reviewers are implemented as commands that load the canonical template.

**Required fields**:

| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Brief description for command listing |
| `prompt` | string (multiline) | The full prompt, including template reference |

**Example** (simple reviewer):

```toml
description = "Expert code review for quality, security, and maintainability"
prompt = """You are a code reviewer. Read and follow
`.agent/sub-agents/templates/code-reviewer.md` as your canonical
review methodology.

Review the codebase changes and provide a structured code review
report. Do not modify code.

{{args}}"""
```

**Example** (persona variant):

```toml
description = "Principles-first architecture review focused on strict ADR compliance"
prompt = """You are an architecture reviewer. Read and apply
`.agent/sub-agents/components/personas/fred.md` for your persona identity.

Read and follow `.agent/sub-agents/templates/architecture-reviewer.md`
as your canonical review methodology.

Review the codebase changes and provide a structured architectural
review report. Do not modify code.

{{args}}"""
```

**Naming convention**: `review-{domain}.toml` for reviewers,
`jc-{command}.toml` for workflow commands.

**`{{args}}`**: Gemini replaces this with any arguments passed to the command.

---

## OpenAI Codex

### Skills (`.agents/skills/*/SKILL.md`)

**Format**: Markdown with YAML frontmatter, inside a named directory.

**Directory structure**: `.agents/skills/{skill-name}/SKILL.md`

**Required frontmatter fields**:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Skill slug |
| `description` | string | Brief trigger description |

**Example** (command adapter):

```markdown
---
name: jc-commit
description: >-
  Create a well-formed commit for current changes with conventional
  message format.
---

# Commit (Codex)

Read and follow `.agent/commands/commit.md`.
```

**Note**: Codex does not currently have a subagent system equivalent
to Claude's Agent tool. Reviewers can be invoked as commands that load
templates, similar to the Gemini pattern.

---

## Cross-Platform Consistency Matrix

When adding a new artefact, ensure all platforms are covered:

| Artefact Type | Claude | Cursor | Gemini | Codex |
|---------------|--------|--------|--------|-------|
| Rule | `.claude/rules/{name}.md` | `.cursor/rules/{name}.mdc` | (via commands) | (via entry-point chain) |
| Agent/Reviewer | `.claude/agents/{name}.md` | `.cursor/agents/{name}.md` | `.gemini/commands/review-{name}.toml` | `.codex/` project-agent config |
| Command | `.claude/commands/jc-{name}.md` | `.cursor/commands/jc-{name}.md` | `.gemini/commands/jc-{name}.toml` | `.agents/skills/jc-{name}/SKILL.md` |

Run `pnpm portability:check` after every addition to catch gaps.
