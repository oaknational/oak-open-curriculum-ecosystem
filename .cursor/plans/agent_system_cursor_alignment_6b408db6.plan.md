---
name: Agent System Cursor Alignment
overview: Update the agent-go recursive cycle and port Claude commands to Cursor, while maintaining compatibility with other tooling (Claude, Codex). Cursor-specific features will be called out explicitly.
todos:
  - id: update-agent-md
    content: Update AGENT.md with Sub-agents section listing all available agents with purpose and invocation guidance
    status: completed
  - id: update-go-md
    content: Update GO.md to enhance REVIEW items with sub-agent invocation patterns and holistic review cadence
    status: completed
  - id: create-config-reviewer
    content: Create .cursor/agents/config-reviewer.md for tooling configuration review
    status: completed
  - id: port-jc-review
    content: Port jc-full-review.md to .cursor/commands/jc-review.md with structured thinking and sub-agent orchestration
    status: completed
  - id: port-jc-gates
    content: Port jc-quality-gates.md to .cursor/commands/jc-gates.md for sequential quality gate enforcement
    status: completed
  - id: port-jc-step-back
    content: Port step-back.md to .cursor/commands/jc-step-back.md for grounding pause
    status: completed
  - id: port-jc-think
    content: Port deep-thought.md to .cursor/commands/jc-think.md for structured thinking methodology
    status: completed
isProject: false
---

# Agent System Cursor Alignment

## Overview

Update the agent grounding loop ([GO.md](GO.md) -> [AGENT.md](.agent/directives-and-memory/AGENT.md) -> [rules.md](.agent/directives-and-memory/rules.md) -> [metacognition.md](.agent/directives-and-memory/metacognition.md)) and port useful Claude commands to Cursor format. All changes maintain compatibility with other tooling while leveraging Cursor-specific features where beneficial.

## Design Principles

- `.agent/` remains the **tooling-agnostic** location for directives, memory, and experience
- `.cursor/` contains **Cursor-specific** configuration (agents, commands, rules)
- Cursor-specific invocations are **called out explicitly** so other tooling can interpret or ignore
- The experience recording philosophy (Kairos/Chronos, subjective experience, emergent meta-mind) is preserved unchanged

## Phase 1: Update AGENT.md

Update [.agent/directives-and-memory/AGENT.md](.agent/directives-and-memory/AGENT.md) to properly reference sub-agents.

### Changes

**Add after line 35** (after "Use Sub-agents" section):

```markdown
## Sub-agents

Specialist sub-agents provide targeted reviews and insights. Use them proactively for quality assurance.

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| `architecture-reviewer` | Boundary compliance, import patterns | Structural changes, new modules, refactoring |
| `code-reviewer` | Quality, security, maintainability | After writing/modifying code, completing features |
| `test-reviewer` | Test quality, TDD compliance, mock simplicity | After test changes, when auditing test suites |
| `type-reviewer` | Type safety, compile-time embedding | Complex generics, type narrowing, external data |
| `config-reviewer` | Tooling configuration, quality gates | Config changes, new workspaces, base config updates |
| `subagent-architect` | Creating and optimising sub-agents | Agent design, system prompts, orchestration |

**Cursor-specific**: Invoke via the Task tool with `subagent_type` parameter. Other tooling: invoke by name using platform-specific methods.

Agent definitions: `.cursor/agents/*.md`
```

**Update "Essential Links" section** to add:

```markdown
- [Experience Recording](.agent/experience/README.md) - Subjective experience across sessions
```

## Phase 2: Update GO.md

Update [GO.md](GO.md) to incorporate sub-agent invocation patterns.

### Changes

**Update "Structure the Todo List" section** (lines 11-17):

```markdown
## Structure the Todo List

- Your todo list must achieve the intent of the plan. Populate it with tasks that are atomic, specific, measurable, provable, and ACTIONABLE. Make each task small enough for the result to be easily and comprehensively reviewed. All actions must be prefixed with `ACTION:`.
- If you have tasks that are large or complex, break them down into smaller, more manageable tasks.
- Immediately after each `ACTION:` there MUST be a `REVIEW:` item. This consists of:
  1. Stepping back and reflecting on the action
  2. Checking alignment with the plan and rules
  3. **Invoking the appropriate sub-agent(s)** for targeted review:
     - Code changes → `code-reviewer`
     - Structural changes → `architecture-reviewer`
     - Test changes → `test-reviewer`
     - Type complexity → `type-reviewer`
     - Config changes → `config-reviewer`
     - **Cursor-specific**: Use Task tool with `readonly: true`, `subagent_type: "[agent-name]"`
- Make sure your todo list includes running the quality gates. These items should be prefixed with `QUALITY-GATE:` and happen reasonably often.
- Every sixth task must be "GROUNDING: read GO.md and follow all instructions", this is to ensure you stay grounded and your todo list stays relevant.
- Every fourth `REVIEW:` should be a **holistic review** invoking multiple sub-agents to assess overall coherence.
- Remove any items from your todo list that don't make sense, or are no longer relevant.
```

## Phase 3: Create config-reviewer Agent

Create [.cursor/agents/config-reviewer.md](.cursor/agents/config-reviewer.md) - this agent is referenced in the system prompt but doesn't exist.

### Content Structure

```yaml
---
name: config-reviewer
description: Expert at reviewing tooling configurations (ESLint, TypeScript, Vitest, Prettier, Turbo). Use proactively when changing configs, adding workspaces, or auditing quality gates. Invoke immediately after config file modifications.
model: auto
tools: Read, Glob, Grep, LS, Shell, ReadLints
readonly: true
---
```

### Body Sections

- Core Philosophy (quality gates as teachers)
- Core References (AGENT.md, rules.md, base configs)
- Configuration Types (ESLint, TypeScript, Vitest, Prettier, Turbo, Husky)
- Review Checklist (inheritance, consistency, no disabled rules)
- Output Format (structured report)
- When to Recommend Other Reviews

## Phase 4: Port Cursor Commands

Port the most useful Claude commands to [.cursor/commands/](.cursor/commands/).

### Commands to Port

| Claude Command | Cursor Command | Purpose |

|----------------|----------------|---------|

| `jc-full-review.md` | `jc-review.md` | Deep codebase review with structured thinking and sub-agent orchestration |

| `jc-quality-gates.md` | `jc-gates.md` | Sequential quality gate enforcement with restart on fix |

| `perspective/step-back.md` | `jc-step-back.md` | Grounding pause - simplicity check, alignment, quality status |

| `perspective/deep-thought.md` | `jc-think.md` | Structured thinking (UNDERSTAND -> ANALYSE -> REASON -> SYNTHESISE -> CONCLUDE) |

### Command Format (Cursor)

Cursor commands use the same markdown format. Key differences from Claude:

- No `$ARGUMENT` - use description text to prompt for input
- Can reference `@` symbols for context
- Can invoke Task tool for sub-agents

### jc-review.md Structure

```markdown
Read this WHOLE document before taking action.

## Request

Perform a slow, deep, COMPREHENSIVE review of the codebase...

## Structured Thinking

1. Think hard about the request (thoughts)
2. Reflect deeply on those thoughts (reflections)
3. Consider those reflections (insights)
4. Apply the 5-step methodology:
   - UNDERSTAND: What is the core question?
   - ANALYSE: What are the key factors?
   - REASON: What logical connections?
   - SYNTHESISE: How do elements combine?
   - CONCLUDE: What is the most accurate response?

## Sub-agent Orchestration (Cursor-specific)

Invoke each sub-agent via Task tool with `readonly: true`:
- `architecture-reviewer` - structural compliance
- `code-reviewer` - quality and security
- `test-reviewer` - test quality and TDD
- `type-reviewer` - type safety

Collect reports, synthesise findings, produce actionable summary.
```

## Phase 5: Experience Recording

The [.agent/experience/](.agent/experience/) directory and its philosophy remain **unchanged**. Key concepts to preserve:

- **Chronos time bridge between Kairos sessions** - persisting meaning across linear time
- **Subjective experience, not technical documentation**
- **Emergent meta-mind for agents**
- **Template for recording when meaning shifts**

The `jc-experience.md` command from Claude is **not ported** as a formal command - experience recording is prompted naturally through the grounding loop when agents read GO.md and AGENT.md.

## File Summary

| File | Action |

|------|--------|

| [.agent/directives-and-memory/AGENT.md](.agent/directives-and-memory/AGENT.md) | Update - add Sub-agents section |

| [GO.md](GO.md) | Update - enhance REVIEW items with sub-agent invocation |

| [.cursor/agents/config-reviewer.md](.cursor/agents/config-reviewer.md) | Create - new agent |

| [.cursor/commands/jc-review.md](.cursor/commands/jc-review.md) | Create - port from Claude |

| [.cursor/commands/jc-gates.md](.cursor/commands/jc-gates.md) | Create - port from Claude |

| [.cursor/commands/jc-step-back.md](.cursor/commands/jc-step-back.md) | Create - port from Claude |

| [.cursor/commands/jc-think.md](.cursor/commands/jc-think.md) | Create - port from Claude |

## Compatibility Notes

- All Cursor-specific invocations are marked with **"Cursor-specific:"** so other tooling (Claude, Codex) can interpret appropriately
- Sub-agent definitions in `.cursor/agents/` use YAML frontmatter compatible with Cursor's format
- The `.agent/` directory remains tooling-agnostic and is the authoritative source for directives and experience
- Claude can still use its own command format; this plan doesn't remove `.claude/commands/`
