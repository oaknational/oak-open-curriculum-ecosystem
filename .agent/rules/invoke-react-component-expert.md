# Invoke React Component Expert

Operationalises [ADR-149 (Frontend Specialist Reviewer Gateway Cluster)](../../docs/architecture/architectural-decisions/149-frontend-specialist-reviewer-gateway-cluster.md) and [ADR-129 (Domain Specialist Capability Pattern)](../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md).

When changes touch React component architecture, hook patterns, or component composition, invoke the `react-component-expert` specialist in addition to the standard `code-expert` gateway.

## Trigger Conditions

Invoke `react-component-expert` when the change involves:

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

Do not invoke `react-component-expert` for:

- WCAG compliance depth, keyboard navigation, or screen reader readiness (use `accessibility-expert`)
- Design token tier violations or CSS architecture (use `design-system-expert`)
- MCP App packaging, `_meta.ui*`, resource registration, CSP, or host bridge lifecycle (use `mcp-expert`)
- Code quality beyond component patterns (use `code-expert`)
- TypeScript type safety beyond React prop types (use `type-expert`)
- Test quality or TDD compliance (use `test-expert`)

## Overlap Boundaries

- **`code-expert`**: Always invoke as the gateway. `react-component-expert` adds React-specific depth.
- **`accessibility-expert`**: Add when component architecture produces inaccessible HTML. Complementary — `react-component-expert` assesses the structure, `accessibility-expert` assesses the a11y result.
- **`design-system-expert`**: Add when component styling involves token consumption. Complementary — both assess different aspects of the same component.
- **`type-expert`**: Add when component prop interfaces involve complex generics or type narrowing. Complementary — `react-component-expert` assesses the API design, `type-expert` assesses the type safety.
- **`mcp-expert`**: Add when reviewing MCP App views. Per ADR-149, `react-component-expert` owns component architecture inside the view; `mcp-expert` owns the bridge and host lifecycle.

## Invocation

See `.agent/memory/executive/invoke-code-experts.md` for the full reviewer catalogue and invocation policy. The `react-component-expert` canonical template is at `.agent/sub-agents/templates/react-component-expert.md`.
