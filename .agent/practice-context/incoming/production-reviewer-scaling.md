# Production Reviewer Scaling — Lessons from 17+ Sub-Agents

**Origin**: oak-open-curriculum-ecosystem, 2026-03-23
**Status**: Proven — 14 canonical templates, 9 shared components, 17+
platform-adapted reviewers operating in production

## The Scaling Problem

The portable Practice Core describes a minimum viable reviewer roster of
3 agents (code-reviewer, test-reviewer, type-reviewer). The guidance is
correct for bootstrapping. But production repos that grow beyond 5–6
reviewers hit three problems:

1. **Template sprawl** — each new reviewer template duplicates the same
   reading requirements, identity format, output structure, and severity
   classification
2. **Consistency drift** — independent templates diverge in quality,
   depth, and format over time
3. **Persona conflation** — architecture review needs multiple
   perspectives (principles-first, simplification-first, systems-thinking,
   adversarial resilience) but a single `architecture-reviewer` template
   can only embody one

## The Three-Layer Composition Solution

Oak-mcp-ecosystem evolved a three-layer system:

### Layer 1: Components (`.agent/sub-agents/components/`)

Reusable prompt building blocks. Each component is a leaf node with no
inter-dependencies:

- `subagent-identity.md` — three-line identity declaration format
- `reading-discipline.md` — universal reading requirements
- `dry-yagni.md` — DRY and YAGNI guardrails for review findings
- `reviewer-team.md` — how multiple architecture personas collaborate
- 4 persona files (Fred, Barney, Betty, Wilma) — distinct architecture
  review perspectives

### Layer 2: Templates (`.agent/sub-agents/templates/`)

Platform-agnostic assembled workflows. Each template composes components
and adds specialisation-specific analysis steps:

- 10 standard reviewers (code, test, type, config, security, docs-adr,
  plus 4 architecture personas)
- 4 domain specialists (elasticsearch, clerk, mcp, ground-truth-designer)
- 3 operational reviewers (release-readiness, onboarding, subagent-architect)

### Layer 3: Wrappers (`.cursor/agents/`, `.claude/agents/`)

Thin platform adapters. Each contains only activation metadata and a
pointer to the canonical template.

## The Architecture Persona Pattern

The most reusable innovation is modelling architecture review as
**4 distinct personas** sharing one template but composed with different
persona components:

| Persona  | Lens                    | Asks                                              |
| -------- | ----------------------- | ------------------------------------------------- |
| Fred     | Principles-first        | Does this comply with the ADRs?                   |
| Barney   | Simplification-first    | Can this be simpler without losing quality?        |
| Betty    | Systems-thinking        | What are the long-term change-cost trade-offs?     |
| Wilma    | Adversarial resilience  | What fails under stress? What are the edge cases? |

Each persona is a component file. The architecture-reviewer template
composes with whichever persona is appropriate. A single review can
invoke all four for comprehensive coverage.

## When to Scale

- **3 reviewers** (code, test, type) — sufficient for POC and early
  production
- **5–6 reviewers** — add security and config when the repo touches auth,
  secrets, or complex tooling config
- **10+ reviewers** — add architecture personas, docs-adr, and domain
  specialists when the repo has multiple packages, ADR infrastructure,
  and domain-specific concerns
- **Component extraction** — invest in shared components when you notice
  3+ templates duplicating the same reading requirements or output format

## Porting Advice

- Start with inline reviewers (no composition layer) for repos with fewer
  than 5 reviewers
- Extract components only when duplication becomes measurable (3+ templates
  sharing the same block)
- The architecture persona pattern is portable to any repo that needs
  multi-perspective architecture review — the personas are universal, not
  domain-specific
- Validate that every template's reading-requirements references resolve
  (silent degradation is the worst failure mode for reviewer infrastructure)
