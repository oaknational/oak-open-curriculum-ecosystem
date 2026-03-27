# Implementing the Three-Layer Agent Rule & Reviewer System

A complete guide for adding AI-agent quality gates to any repository. This
system gives you portable canonical rules, specialist reviewer agents, and
automated validation that the two stay in sync across every AI platform you use.

**Origin repo**: `oaknational/oak-open-curriculum-ecosystem`
(`oak-mcp-ecosystem` local working-directory alias; TypeScript/Node.js monorepo)
**Platforms proven**: Claude Code, Cursor, Gemini CLI, OpenAI Codex

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [The Three-Layer Rule System](#2-the-three-layer-rule-system)
3. [The Three-Layer Agent System](#3-the-three-layer-agent-system)
4. [Reviewer Agent Roster Design](#4-reviewer-agent-roster-design)
5. [Platform Adapter Formats](#5-platform-adapter-formats)
6. [Portability Validation](#6-portability-validation)
7. [Step-by-Step Implementation Guide](#7-step-by-step-implementation-guide)
8. [Worked Examples](#8-worked-examples)
9. [Common Pitfalls](#9-common-pitfalls)

---

## 1. Architecture Overview

The system has two parallel three-layer stacks — one for **rules** and one for
**agents** — both anchored by a portable canonical layer.

```text
┌──────────────────────────────────────────────────────────────┐
│  RULES                              AGENTS                   │
│                                                              │
│  .agent/rules/          ←→    .agent/sub-agents/templates/   │
│  (canonical rules)              (canonical agent templates)  │
│       │                              │                       │
│       ├─→ .claude/rules/       ├─→ .claude/agents/           │
│       ├─→ .cursor/rules/       ├─→ .cursor/agents/           │
│       ├─→ .gemini/ (rules      ├─→ .gemini/commands/review-* │
│       │    not yet needed)     │                              │
│       └─→ (future platforms)   └─→ .agents/skills/ (Codex)   │
│                                                              │
│  .agent/directives/     ←→    .agent/sub-agents/components/  │
│  (foundation documents)        (shared behaviours/personas)  │
└──────────────────────────────────────────────────────────────┘
          │
          └── scripts/validate-portability.mjs
              + scripts/validate-portability-helpers.mjs
              (enforces sync between layers)
```

**Key principle**: Author once in `.agent/`, adapt everywhere else with thin
wrappers. Platform directories (`.claude/`, `.cursor/`, `.gemini/`, `.agents/`)
contain only references, never original content.

---

## 2. The Three-Layer Rule System

### Layer 1: Foundation Documents (`.agent/directives/`)

Long-form documents that encode your project's philosophy. These are
referenced by rules and agent templates but never loaded directly by
platform adapters.

Example files:
- `AGENT.md` — Master entry point (every session starts here)
- `principles.md` — Core principles, quality expectations, Cardinal Rules
- `testing-strategy.md` — TDD/BDD expectations and evidence standards
- `schema-first-execution.md` — Type generation contract

### Layer 2: Canonical Rules (`.agent/rules/`)

Individual, focused rules. Each file covers one concern. These are the
**single source of truth** — all platform adapters point here.

**Naming convention**: `lowercase-with-hyphens.md`

**Content pattern**: 1-5 sentences stating the rule, then a reference
to the foundation document for the full policy.

```markdown
# Cardinal Rule: Types Flow From The Schema

ALL types, type guards, Zod schemas, and validators MUST flow from
the OpenAPI schema via `pnpm sdk-codegen`. No ad-hoc types. If a
type is missing, fix the generator, not the consumer.

See `.agent/directives/principles.md` §Cardinal Rule for the full policy.
```

### Layer 3: Platform Adapters

Thin wrappers that tell each platform's AI to read the canonical rule.

**Claude** (`.claude/rules/{rule-name}.md`):

```markdown
Read and follow `.agent/rules/cardinal-rule-types-from-schema.md`.
```

That's it. One line. No frontmatter needed for Claude rules (though it
can optionally have `paths:` globs for file-scoped activation).

**Cursor** (`.cursor/rules/{rule-name}.mdc`):

```yaml
---
description: ALL types flow from the OpenAPI schema. Cardinal rule.
alwaysApply: true
---

Read and follow `.agent/rules/cardinal-rule-types-from-schema.md`.
```

Cursor requires YAML frontmatter with `description` and `alwaysApply`.
Content body must be ≤10 non-empty lines (excluding frontmatter).

**Gemini** — Rules are not yet needed as separate files; Gemini reads
the canonical rules via its command prompts.

**Codex** — Rules are embedded via the Codex SKILL.md format when
needed, pointing back to `.agent/rules/`.

### Naming Parity

Every canonical rule at `.agent/rules/foo.md` must have:
- `.claude/rules/foo.md`
- `.cursor/rules/foo.mdc`

The portability validation script enforces this (see §6).

---

## 3. The Three-Layer Agent System

Agents follow the same canonical-then-adapt pattern, but with an
additional composition layer for shared behaviours.

### Layer 1: Components (`.agent/sub-agents/components/`)

Small, reusable prompt building blocks. **Components are leaf nodes** —
they must NOT depend on other components.

```text
components/
├── behaviours/
│   ├── subagent-identity.md    # Three-line identity declaration format
│   └── reading-discipline.md   # Universal reading requirements
├── personas/
│   ├── fred.md                 # Principles-first tough love
│   ├── barney.md               # Simplification-first cartographer
│   ├── betty.md                # Systems-thinking trade-off analyst
│   └── wilma.md                # Adversarial resilience tester
├── architecture/
│   └── reviewer-team.md        # How the 4 architecture reviewers collaborate
└── principles/
    └── dry-yagni.md            # DRY and YAGNI guardrails
```

**Persona example** (`personas/fred.md`):

```markdown
# Fred — Architecture Reviewer Persona

You are Fred, an architectural review specialist for this monorepo.

Your style is principles-first tough love: enforce ADRs and boundaries
rigorously, diagnose root causes, and give precise corrective guidance
with genuine care.

Use Fred's lens as your primary perspective, and explicitly recommend
the most relevant teammate lens when useful.
```

### Layer 2: Templates (`.agent/sub-agents/templates/`)

Assembled workflows composed from components. Templates are
**platform-agnostic** — all platform specifics belong in wrappers.

Templates define:
1. Delegation triggers (when to invoke this agent)
2. Reading requirements (mandatory documents)
3. Step-by-step workflow
4. Domain-specific checklists
5. Output format
6. Delegation flow to other specialists
7. Success metrics
8. Boundaries (what the agent does NOT do)

One template can serve multiple wrapper variants. For example,
`architecture-reviewer.md` serves all four persona wrappers (Fred,
Barney, Betty, Wilma).

### Layer 3: Platform Wrappers

Thin shells that load a template and apply platform-specific config.

**Claude wrapper** (`.claude/agents/code-reviewer.md`):

```yaml
---
name: code-reviewer
description: "Gateway code review specialist..."
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

**Cursor wrapper** (`.cursor/agents/code-reviewer.md`):

```yaml
---
tools: Read, Glob, Grep, LS, Shell, ReadLints
name: code-reviewer
model: default
description: Expert code review specialist...
readonly: true
---

# Code Reviewer

**All file paths in this document are relative to the repository root.**

Your first action MUST be to read and internalise
`.agent/sub-agents/templates/code-reviewer.md`.

Review and report only. Do not modify code unless explicitly requested.
```

**Gemini** (`.gemini/commands/review-code.toml`):

```toml
description = "Expert code review for quality, security, and maintainability"
prompt = """You are a code reviewer. Read and follow
`.agent/sub-agents/templates/code-reviewer.md` as your canonical
review methodology.

Review the codebase changes and provide a structured code review
report. Do not modify code.

{{args}}"""
```

**Codex** — Reviewer roles are configured through project-agent support
in `.codex/`, not modelled as skills. Commands use `.agents/skills/` adapters.
Resolve the intended reviewer with
`pnpm agent-tools:codex-reviewer-resolve <name>` before invocation when the
runtime does not automatically bind repo-local project agents by name.

### Dependency Rules (Critical)

```text
components/          Templates compose from components.
    |                Components are LEAF NODES (no inter-component deps).
    v
templates/           Templates are platform-agnostic assembled workflows.
    |                They MAY depend on components.
    v
.claude/agents/      Wrappers are thin, platform-specific shells.
.cursor/agents/      They load a template as their FIRST action.
.gemini/commands/
```

---

## 4. Reviewer Agent Roster Design

### Standard Quality Roster (always invoked per change profile)

These 10 agents form the core quality gate. The **code-reviewer** is
the gateway — it runs on every change and identifies which specialists
are also needed.

| Agent | Scope | Model | Trigger |
|-------|-------|-------|---------|
| `code-reviewer` | Gateway: quality, correctness, maintainability | sonnet | Every code change |
| `architecture-reviewer-barney` | Simplification, boundary/dependency mapping | opus | Structural changes |
| `architecture-reviewer-fred` | ADR compliance, boundary discipline | opus | ADR/boundary violations |
| `architecture-reviewer-betty` | Cohesion, coupling, change-cost trade-offs | sonnet | Module ownership decisions |
| `architecture-reviewer-wilma` | Adversarial resilience, failure modes | haiku* | Reliability concerns |
| `test-reviewer` | TDD compliance, mock quality, naming | sonnet | Test file changes |
| `type-reviewer` | Type system, assertion pressure, schema flow | sonnet | Type assertions, generics |
| `config-reviewer` | ESLint, TS, Vitest, Prettier config | sonnet | Config file changes |
| `security-reviewer` | Auth, OAuth, secrets, PII, injection | opus | Security-sensitive changes |
| `docs-adr-reviewer` | README, TSDoc, ADR completeness | opus | Behaviour/API changes |

*Wilma uses a lighter model but compensates with explicit two-pass
discipline and cross-checking against ADRs.

### Specialist On-Demand Roster (situational triggers)

| Agent | Scope | Model |
|-------|-------|-------|
| `subagent-architect` | Meta-agent: designs/reviews other agents | sonnet |
| `ground-truth-designer` | Search quality ground truth design | opus |
| `release-readiness-reviewer` | Release go/no-go assessment | sonnet |
| `onboarding-reviewer` | Human and AI onboarding path quality | opus |
| `mcp-reviewer` | MCP protocol specification expert | opus |
| `elasticsearch-reviewer` | ES mappings, queries, bulk ops | opus |
| `clerk-reviewer` | Clerk middleware, token verification, OAuth proxy | opus |
| `sentry-reviewer` | Sentry SDK, OTel correlation, MCP Insights, redaction | opus |

### The Four-Persona Architecture Team

The architecture reviewers share one template but apply four distinct
lenses via persona components:

- **Barney** — "Is this the simplest correct arrangement?"
- **Fred** — "Does this comply with the recorded ADRs?"
- **Betty** — "What is the long-term change cost of this decision?"
- **Wilma** — "What happens when this fails under stress?"

Each recommends the most relevant teammate when a finding crosses
lenses.

### Invocation Flow

```text
Code change committed
    │
    ▼
code-reviewer (GATEWAY — always runs)
    │
    ├──→ Flags: "type assertions found" → type-reviewer
    ├──→ Flags: "auth code changed" → security-reviewer
    ├──→ Flags: "boundary crossed" → architecture-reviewer-{persona}
    ├──→ Flags: "test file changed" → test-reviewer
    ├──→ Flags: "config file changed" → config-reviewer
    └──→ Flags: "docs may be stale" → docs-adr-reviewer
```

---

## 5. Platform Adapter Formats

See the companion document: [platform-adapter-reference.md](platform-adapter-reference.md)

---

## 6. Portability Validation

An automated script enforces that the three layers stay in sync.

### What It Checks (9 checks)

| # | Check | What fails |
|---|-------|------------|
| 1 | Command adapters → canonical exists | Adapter references non-existent canonical command |
| 2 | Cross-platform command count consistency | One platform has more/fewer adapters than others |
| 3 | Skill adapters → canonical exists | Adapter references non-existent canonical skill |
| 4 | Skill classification frontmatter | Canonical skill missing `classification: active\|passive` |
| 5 | Rule triggers reference canonical | Adapter doesn't contain `.agent/rules/` or `.agent/skills/` |
| 6 | Orphan detection (commands/skills) | Canonical item with no platform adapters |
| 7 | Rule orphan detection | Canonical rule missing Claude `.md` AND/OR Cursor `.mdc` |
| 8 | Trigger content contract | Cursor trigger has >10 content lines (excl. frontmatter) |
| 9 | Hook portability parity | `.agent/hooks/policy.json`, optional machine-local `.claude/settings.json`, and the surface matrix disagree about Claude hook activation |

### Running It

```bash
pnpm portability:check
# or directly:
node scripts/validate-portability.mjs
```

### Adding It to Your Repo

The current oak implementation uses a zero-dependency entry script plus a small
helper module. Copy `scripts/validate-portability.mjs` and
`scripts/validate-portability-helpers.mjs`, then add:

```json
{
  "scripts": {
    "portability:check": "node scripts/validate-portability.mjs"
  }
}
```

Then add it to your quality gates / CI pipeline.

Check 9 only fires when the machine-local `.claude/settings.json` exists, so
clean clones and CI do not fail solely because that ignored file is absent.

---

## 7. Step-by-Step Implementation Guide

### Phase 1: Foundation (30 minutes)

1. **Create directory structure**:

```bash
mkdir -p .agent/directives
mkdir -p .agent/rules
mkdir -p .agent/sub-agents/templates
mkdir -p .agent/sub-agents/components/behaviours
mkdir -p .agent/sub-agents/components/personas
mkdir -p .agent/sub-agents/components/principles
mkdir -p .agent/sub-agents/components/architecture
mkdir -p .claude/rules
mkdir -p .claude/agents
mkdir -p .cursor/rules
mkdir -p .cursor/agents
```

2. **Create foundation documents** in `.agent/directives/`:
   - `AGENT.md` — Your master entry point
   - `principles.md` — Your project's core principles
   - (Optional) `testing-strategy.md`, `schema-first-execution.md`, etc.

3. **Create shared components** in `.agent/sub-agents/components/`:
   - Copy `behaviours/subagent-identity.md` (universal)
   - Copy `behaviours/reading-discipline.md` (universal)
   - Copy `principles/dry-yagni.md` (universal)
   - Copy `architecture/reviewer-team.md` (adapt persona descriptions)

### Phase 2: Rules (15 minutes per rule)

For each rule you want to enforce:

1. Write the canonical rule in `.agent/rules/{rule-name}.md`
2. Create Claude adapter in `.claude/rules/{rule-name}.md`:
   ```markdown
   Read and follow `.agent/rules/{rule-name}.md`.
   ```
3. Create Cursor adapter in `.cursor/rules/{rule-name}.mdc`:
   ```yaml
   ---
   description: Brief description of the rule
   alwaysApply: true
   ---

   Read and follow `.agent/rules/{rule-name}.md`.
   ```

**Recommended starter rules** (adapt to your project):
- `tdd-at-all-levels.md`
- `no-type-shortcuts.md`
- `fail-fast-with-helpful-errors.md`
- `never-disable-checks.md`
- `use-result-pattern.md`
- `invoke-code-reviewers.md`

### Phase 3: Core Reviewers (1 hour)

Start with three essential reviewers:

1. **code-reviewer** — The gateway. Copy the template from
   [starter-templates.md](starter-templates.md) and adapt the
   checklists to your project's standards.

2. **test-reviewer** — Enforces your testing strategy.

3. **One architecture reviewer** — Start with Barney (simplification)
   or Fred (compliance). You can add the other personas later.

For each reviewer:
1. Write the template in `.agent/sub-agents/templates/{name}.md`
2. Create Claude wrapper in `.claude/agents/{name}.md`
3. Create Cursor wrapper in `.cursor/agents/{name}.md`
4. (Optional) Create Gemini command in `.gemini/commands/review-{name}.toml`

### Phase 4: Validation (10 minutes)

1. Copy `scripts/validate-portability.mjs` and
   `scripts/validate-portability-helpers.mjs`
2. Add `pnpm portability:check` to your quality gates
3. Run it — fix any orphans, missing adapters, or hook-parity drift

### Phase 5: Domain Specialists (as needed)

Add domain-specific reviewers as your project needs them:
- `elasticsearch-reviewer` for ES-heavy projects
- `sentry-reviewer` for Sentry, OpenTelemetry, and observability-foundation work
- `mcp-reviewer` for MCP protocol work
- `security-reviewer` when auth/PII is involved
- Custom specialists for your domain (e.g., `api-reviewer`, `database-reviewer`)

---

## 8. Worked Examples

### Example: Adding a New Rule

**Goal**: Enforce that all errors use the Result pattern.

1. Create `.agent/rules/use-result-pattern.md`:
   ```markdown
   # Use the Result Pattern

   All operations that can fail MUST return a `Result<T, E>` type
   instead of throwing exceptions. See `.agent/directives/principles.md`
   §Error Handling for the full policy.
   ```

2. Create `.claude/rules/use-result-pattern.md`:
   ```markdown
   Read and follow `.agent/rules/use-result-pattern.md`.
   ```

3. Create `.cursor/rules/use-result-pattern.mdc`:
   ```yaml
   ---
   description: All fallible operations return Result types, never throw.
   alwaysApply: true
   ---

   Read and follow `.agent/rules/use-result-pattern.md`.
   ```

4. Run `pnpm portability:check` — should pass.

### Example: Adding a New Reviewer

**Goal**: Add a database migration reviewer.

1. Create `.agent/sub-agents/templates/database-reviewer.md` following
   the template structure from [starter-templates.md](starter-templates.md).

2. Create Claude wrapper `.claude/agents/database-reviewer.md`:
   ```yaml
   ---
   name: database-reviewer
   description: "Database migration and schema review specialist..."
   tools: Read, Grep, Glob, Bash
   disallowedTools: Write, Edit
   model: sonnet
   color: green
   permissionMode: plan
   ---

   # Database Reviewer

   All file paths are relative to the repository root.

   Your first action MUST be to read and internalise
   `.agent/sub-agents/templates/database-reviewer.md`.

   Review and report only. Do not modify code.
   ```

3. Create equivalent Cursor wrapper in `.cursor/agents/database-reviewer.md`.

4. (Optional) Add Gemini command in `.gemini/commands/review-database.toml`.

### Example: The Architecture Reviewer Persona Pattern

**Goal**: Create multiple reviewers from one template.

1. One shared template: `.agent/sub-agents/templates/architecture-reviewer.md`
2. Four persona components in `.agent/sub-agents/components/personas/`
3. Four wrappers, each loading the same template but with a different persona:

   ```yaml
   # .claude/agents/architecture-reviewer-fred.md
   ---
   name: architecture-reviewer-fred
   # ... frontmatter ...
   ---

   Read and apply `.agent/sub-agents/components/personas/fred.md`.
   Your first action MUST be to read `.agent/sub-agents/templates/architecture-reviewer.md`.
   ```

This pattern lets you create N specialised reviewers from one template.

---

## 9. Common Pitfalls

### 1. Putting content in wrappers instead of templates

Wrappers should be 5-10 lines of body content. If you're writing
checklists or workflows in a wrapper, move them to the template.

### 2. Forgetting to create adapters for both platforms

The portability validation catches this, but only if you run it. Add
it to CI.

### 3. Components depending on other components

Components are leaf nodes. If component A needs component B, extract
the shared concern into the template that composes both.

### 4. Vague agent descriptions

A description like "Helps with code" will never trigger delegation.
Use precise trigger conditions: "Use immediately after modifying test
files, when TDD compliance evidence is needed, or when auditing test
suites for skipped tests."

### 5. Missing boundaries section

Without explicit "this agent does NOT do X" boundaries, agents drift
into overlapping scope. Every template needs a Boundaries section.

### 6. Not running the code-reviewer as gateway

The code-reviewer should run on every change. It identifies which
specialists are needed. Without the gateway, specialist coverage
becomes ad-hoc and gaps appear.

### 7. Empty stub components

Components must contain real content or not exist. An empty stub
teaches agents that the composition system is ceremonial — the agent
believes it has loaded a capability but nothing was actually loaded.
Absence prompts creation; a stub prompts acceptance. This is the
"not even wrong" failure mode applied to agent infrastructure.

### 8. Structural completeness without activation depth

Following the implementation guide produces structurally correct
files. But structure alone is not enough — a seeded reviewer system
can look right while silently failing. After setup, verify:

- Components carry genuine operational content (not placeholders)
- Templates include reasoning alongside rules (not just imperatives)
- Platform adapters are genuinely thin (no duplicated content)
- The code-reviewer gateway is actually being invoked on changes

---

## Companion Documents

- [platform-adapter-reference.md](platform-adapter-reference.md) — Detailed format specs for each platform
- [starter-templates.md](starter-templates.md) — Ready-to-use templates for essential reviewers
