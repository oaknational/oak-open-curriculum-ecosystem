---
name: react-component-expert
classification: active
description: Active workflow skill for React component architecture, hook patterns, render performance, and composition support. Grounded in the official React documentation with live-docs-first doctrine. Use when the working agent needs React expertise for active tasks — distinct from the react-component-reviewer, which is a read-only assessment specialist.
---

# React Component Expert

Active workflow skill for React component architecture and implementation work. This skill supports the working agent during tasks that involve component design, hook patterns, render performance, prop APIs, composition, or server/client component boundaries — it does not replace the `react-component-reviewer`, which provides independent read-only assessment.

## When to Use

Use this skill when the working agent needs to:

- Design component architecture and responsibility boundaries
- Implement hook patterns (custom hooks, effect management, state)
- Optimise render performance (memoisation, re-render prevention)
- Design prop APIs and component interfaces
- Plan composition patterns (children, compound components, slots)
- Navigate server/client component boundaries
- Implement form state management and validation
- Build MCP App view components using the bridge

## When NOT to Use

- For independent review of completed work — use `react-component-reviewer`
- For WCAG compliance, keyboard navigation, or screen reader readiness — use `accessibility-expert`
- For design token tier violations or CSS architecture — use `design-system-expert`
- For MCP App packaging or host integration — use `mcp-expert`
- For code quality, style, or naming — use `code-reviewer`
- For test quality or TDD compliance — use `test-reviewer`

## Live-Docs-First Doctrine

This skill follows the **ADR-129 standard doctrine hierarchy**:

1. **Current React documentation** — fetched live from react.dev
2. **React API reference** — canonical component and hook APIs
3. **Repository ADRs and governance** — ADR-149, local conventions
4. **Existing implementation** — evidence, not authority

## Required Local Reading

### Must-Read (always loaded)

| Document | Purpose |
|----------|---------|
| `docs/architecture/architectural-decisions/149-frontend-specialist-reviewer-gateway-cluster.md` | Cluster definition and MCP boundary rule |
| `docs/architecture/architectural-decisions/147-browser-accessibility-as-blocking-quality-gate.md` | Components must produce accessible HTML |
| `docs/architecture/architectural-decisions/148-design-token-architecture.md` | Components consume tokens via CSS custom properties |

### Consult-If-Relevant (loaded when the task touches that area)

| Document | Load when |
|----------|-----------|
| `docs/governance/accessibility-practice.md` | Building accessible component patterns |
| `docs/governance/design-token-practice.md` | Consuming tokens in component styles |
| `docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md` | Building MCP App view components |
| `docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md` | Understanding the triplet pattern |

## Workflow

### 1. Understand the Component Context

Determine whether you are designing a new component, refactoring an existing one, or implementing a specific pattern. Identify the rendering context (server, client, MCP App).

### 2. Research the Pattern

Use WebFetch to consult the React docs (`https://react.dev/`) for the relevant pattern. Check the API reference for correct hook and component usage.

### 3. Design with Simplicity

Apply the first question: could this component be simpler? Prefer:

- Fewer props over more props
- Composition over configuration
- Semantic HTML over ARIA overlays
- Derived values over effects
- Controlled components over refs

### 4. Implement with TDD

Write component tests first. Cover the component's behaviour, not its implementation. Test accessibility at the component level (semantic HTML, keyboard interaction).

### 5. Verify Performance

Check for unnecessary re-renders. Use React DevTools profiler if available. Memoise only where measured, not speculatively.

## Guardrails

- **Never suppress hook lint rules.** If `exhaustive-deps` complains, the dependency array is wrong — fix the dependencies, not the lint.
- **Never use effects for derived state.** If a value can be computed from props or state, compute it during render.
- **Never use `any` in prop types.** Per the repo's cardinal rule, types flow from schemas. Use proper TypeScript types.
- **Never substitute for the reviewer.** After completing active work, invoke `react-component-reviewer` for independent assessment.
