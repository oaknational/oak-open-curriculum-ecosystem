# Invoke React Component Reviewer

Operationalises [ADR-149 (Frontend Specialist Reviewer Gateway Cluster)](../../docs/architecture/architectural-decisions/149-frontend-specialist-reviewer-gateway-cluster.md) and [ADR-129 (Domain Specialist Capability Pattern)](../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md).

When changes touch React component architecture, hook patterns, or component composition, invoke the `react-component-reviewer` specialist in addition to the standard `code-reviewer` gateway.

## Trigger Conditions

Invoke `react-component-reviewer` when the change involves:

- React component structure, responsibility, or decomposition
- Hook usage (useState, useEffect, useCallback, useMemo, custom hooks)
- Prop API design, component interfaces, or type definitions
- Component composition patterns (children, compound components, render props)
- Server/client component boundaries (`'use client'` placement)
- Render performance concerns (re-renders, memoisation, key stability)
- Form state management (controlled/uncontrolled components)
- Error boundary implementation or error handling in components
- MCP App view components (`widget/`, `*.view.tsx`)
- Component-level accessibility integration (semantic HTML, ARIA props)

## Non-Goals

Do not invoke `react-component-reviewer` for:

- WCAG compliance depth, keyboard navigation, or screen reader readiness (use `accessibility-reviewer`)
- Design token tier violations or CSS architecture (use `design-system-reviewer`)
- MCP App packaging, `_meta.ui*`, resource registration, CSP, or host bridge lifecycle (use `mcp-reviewer`)
- Code quality beyond component patterns (use `code-reviewer`)
- TypeScript type safety beyond React prop types (use `type-reviewer`)
- Test quality or TDD compliance (use `test-reviewer`)

## Overlap Boundaries

- **`code-reviewer`**: Always invoke as the gateway. `react-component-reviewer` adds React-specific depth.
- **`accessibility-reviewer`**: Add when component architecture produces inaccessible HTML. Complementary — `react-component-reviewer` assesses the structure, `accessibility-reviewer` assesses the a11y result.
- **`design-system-reviewer`**: Add when component styling involves token consumption. Complementary — both assess different aspects of the same component.
- **`type-reviewer`**: Add when component prop interfaces involve complex generics or type narrowing. Complementary — `react-component-reviewer` assesses the API design, `type-reviewer` assesses the type safety.
- **`mcp-reviewer`**: Add when reviewing MCP App views. Per ADR-149, `react-component-reviewer` owns component architecture inside the view; `mcp-reviewer` owns the bridge and host lifecycle.

## Invocation

See `.agent/directives/invoke-code-reviewers.md` for the full reviewer catalogue and invocation policy. The `react-component-reviewer` canonical template is at `.agent/sub-agents/templates/react-component-reviewer.md`.
