---
name: design-system-expert
classification: active
description: Active workflow skill for design token and visual consistency planning, research, and implementation support. Grounded in the DTCG standard, three-tier token model, and CSS custom properties with live-standards-first doctrine. Use when the working agent needs design system expertise for active tasks — distinct from the design-system-reviewer, which is a read-only assessment specialist.
---

# Design System Expert

Active workflow skill for design token and visual consistency work. This skill supports the working agent during tasks that involve DTCG JSON authoring, token build pipelines, CSS custom property generation, theme structure, or token consumption patterns — it does not replace the `design-system-reviewer`, which provides independent read-only assessment.

## When to Use

Use this skill when the working agent needs to:

- Author or modify DTCG JSON token definitions
- Design the three-tier model (palette → semantic → component)
- Build or maintain the token build pipeline (DTCG → CSS)
- Implement theme structure (light/dark/high-contrast)
- Plan token consumption patterns for MCP App views or other surfaces
- Research DTCG specification capabilities or Style Dictionary transforms
- Validate contrast ratios for colour token pairs

## When NOT to Use

- For independent review of completed work — use `design-system-reviewer`
- For WCAG compliance, keyboard navigation, or screen reader readiness — use `accessibility-expert`
- For React component architecture or hook patterns — use `react-component-expert`
- For MCP App packaging or host integration — use `mcp-expert`
- For code quality, style, or naming — use `code-reviewer`
- For test quality or TDD compliance — use `test-reviewer`

## Live-Standards-First Doctrine

This skill follows the **ADR-129 standard doctrine hierarchy**:

1. **DTCG specification and CSS standards** — fetched live
2. **Style Dictionary and build tool documentation** — pipeline patterns
3. **Repository ADRs and governance** — ADR-148, design-token-practice.md
4. **Existing implementation** — evidence, not authority

## Required Local Reading

### Must-Read (always loaded)

| Document | Purpose |
|----------|---------|
| `docs/architecture/architectural-decisions/148-design-token-architecture.md` | DTCG JSON, three-tier model, `packages/design/`, delivery path |
| `docs/governance/design-token-practice.md` | Source format, tier model, build pipeline, consumption |
| `docs/architecture/architectural-decisions/149-frontend-specialist-reviewer-gateway-cluster.md` | Cluster definition and MCP boundary rule |

### Consult-If-Relevant (loaded when the task touches that area)

| Document | Load when |
|----------|-----------|
| `docs/architecture/architectural-decisions/147-browser-accessibility-as-blocking-quality-gate.md` | Token contrast values affect a11y compliance |
| `docs/governance/accessibility-practice.md` | Theme-aware testing requirements |
| `docs/architecture/architectural-decisions/041-workspace-structure-option-a.md` | `packages/design/` topology and dependency direction |
| `docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md` | Token delivery to MCP App views |
| `docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md` | Understanding the triplet pattern |

## Workflow

### 1. Understand the Token Context

Determine whether you are working at the source level (DTCG JSON), build level (pipeline/transforms), output level (CSS custom properties), or consumption level (component styles).

### 2. Research the Standard

Use WebFetch to consult the DTCG specification (`https://www.designtokens.org/TR/2025.10/format/`) for token format questions. Consult Style Dictionary docs for build pipeline patterns. Consult the CSS Custom Properties spec (`https://www.w3.org/TR/css-variables-1/`) for naming, scoping, inheritance, and `var()` behaviour.

### 3. Apply the Three-Tier Model

Enforce strict referencing direction: component → semantic → palette. When authoring tokens, name them appropriately for their tier:

- **Palette**: intrinsic names (`navy-900`, `oak-green`, `spacing-4`)
- **Semantic**: purpose names (`text-primary`, `bg-surface`, `gap-md`)
- **Component**: component + property names (`button-primary-bg`, `card-border-radius`)

### 4. Verify Theme Correctness

Themes override semantic tokens only. The palette is invariant. Check that all themes define the same semantic token set.

### 5. Validate Delivery Path

For MCP App views: token CSS is bundled into `index.html` via Vite. For other consumers: CSS is imported through their build systems.

## Guardrails

- **Never skip tiers.** Component → semantic → palette is non-negotiable.
- **Never hardcode where tokens exist.** A hex value in component CSS is a tier violation if a token covers that use case.
- **Never assume palette stability across themes.** Themes modify the semantic tier; palette changes are version changes.
- **Never substitute for the reviewer.** After completing active work, invoke `design-system-reviewer` for independent assessment.
