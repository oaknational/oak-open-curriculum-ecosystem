---
name: accessibility-expert
classification: active
description: Active workflow skill for accessibility planning, research, and implementation support. Grounded in WCAG 2.2 AA, WAI-ARIA 1.3 Editor's Draft, and axe-core with live-standards-first doctrine. Use when the working agent needs a11y expertise for active tasks — distinct from the accessibility-reviewer, which is a read-only assessment specialist.
---

# Accessibility Expert

Active workflow skill for accessibility planning, research, and implementation work. This skill supports the working agent during tasks that involve WCAG compliance, ARIA patterns, keyboard navigation, colour contrast, or MCP App view accessibility — it does not replace the `accessibility-reviewer`, which provides independent read-only assessment.

## When to Use

Use this skill when the working agent needs to:

- Implement accessible UI components following WCAG 2.2 AA
- Research ARIA patterns for specific widget types
- Design keyboard navigation and focus management
- Calculate or validate colour contrast ratios
- Set up Playwright + axe-core accessibility testing
- Implement theme-aware accessibility (light/dark/high-contrast)
- Plan MCP App view accessibility testing at both levels (ADR-147)

## When NOT to Use

- For independent review of completed work — use `accessibility-reviewer`
- For design token tier violations or CSS architecture — use `design-system-expert`
- For React component architecture or hook patterns — use `react-component-expert`
- For code quality, style, or naming — use `code-reviewer`
- For MCP App packaging or host integration — use `mcp-expert`
- For test quality or TDD compliance — use `test-reviewer`

## Live-Standards-First Doctrine

This skill follows the **ADR-129 standard doctrine hierarchy**:

1. **Current WCAG 2.2 and WAI-ARIA 1.3 Editor's Draft** — fetched live from w3.org/w3c.github.io
2. **ARIA Authoring Practices Guide** — canonical widget patterns
3. **Repository ADRs and governance** — ADR-147, accessibility-practice.md
4. **Existing implementation** — evidence, not authority

## Required Local Reading

### Must-Read (always loaded)

| Document | Purpose |
|----------|---------|
| `docs/architecture/architectural-decisions/147-browser-accessibility-as-blocking-quality-gate.md` | Zero-tolerance, Playwright + axe-core, two-level MCP App testing |
| `docs/governance/accessibility-practice.md` | WCAG 2.2 AA target, tooling, theme-aware testing |
| `docs/architecture/architectural-decisions/149-frontend-specialist-reviewer-gateway-cluster.md` | Cluster definition and MCP boundary rule |

### Consult-If-Relevant (loaded when the task touches that area)

| Document | Load when |
|----------|-----------|
| `docs/architecture/architectural-decisions/148-design-token-architecture.md` | Working with tokens for contrast or theming |
| `docs/governance/design-token-practice.md` | Token tier model, theme structure |
| `docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md` | Working on MCP App view files |
| `docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md` | Understanding the triplet pattern |

## Workflow

### 1. Identify the A11y Requirement

Determine which WCAG 2.2 AA criteria apply to the current task. Use WebFetch to consult the Understanding WCAG 2.2 pages for relevant criteria.

### 2. Research the Pattern

For interactive widgets, consult the ARIA Authoring Practices Guide (`https://www.w3.org/WAI/ARIA/apg/`) for the canonical pattern. This provides keyboard interaction models, ARIA role/state usage, and implementation notes.

### 3. Implement with Testing

Follow TDD: write the Playwright + axe-core test first, then implement. Use the tooling pattern from `docs/governance/accessibility-practice.md`.

### 4. Verify Across Themes

Run a11y checks against all supported themes. Per ADR-147, both light and dark must pass independently.

### 5. Check MCP App Context

If the work targets an MCP App view, ensure both testing levels are addressed:

1. Resource-level a11y (direct Playwright + axe-core, CSS injected)
2. MCP App integration (basic-host or supported host)

## Guardrails

- **Never skip rules.** Per ADR-147, zero-tolerance — no `skipRules`, no accepted violations.
- **Never substitute automated for manual.** axe-core catches ~30-40% of WCAG violations. Manual assessment is always required.
- **Never assume one theme is sufficient.** All supported themes must pass independently.
- **Never substitute for the reviewer.** After completing active work, invoke `accessibility-reviewer` for independent assessment.
