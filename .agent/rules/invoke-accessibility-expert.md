# Invoke Accessibility Expert

Operationalises [ADR-149 (Frontend Specialist Reviewer Gateway Cluster)](../../docs/architecture/architectural-decisions/149-frontend-specialist-reviewer-gateway-cluster.md), [ADR-147 (Browser Accessibility as a Blocking Quality Gate)](../../docs/architecture/architectural-decisions/147-browser-accessibility-as-blocking-quality-gate.md), and [ADR-129 (Domain Specialist Capability Pattern)](../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md).

When changes touch rendered UI, accessibility attributes, or browser-facing interaction patterns, invoke the `accessibility-expert` specialist in addition to the standard `code-expert` gateway.

## Trigger Conditions

Invoke `accessibility-expert` when the change involves:

- Rendered HTML/JSX components that produce browser-visible output
- ARIA attributes, roles, states, or properties
- Keyboard navigation, focus management, or tab order
- Colour values, contrast-sensitive styling, or theme-aware CSS
- Form inputs, labels, error messages, or validation feedback
- Interactive widgets (menus, dialogs, tabs, accordions, tooltips)
- MCP App view files (`widget/`, `*.view.tsx`, `index.html`)
- Touch target sizing or pointer interaction patterns
- Animation, motion, or transition behaviour

## Non-Goals

Do not invoke `accessibility-expert` for:

- MCP App packaging, `_meta.ui*`, resource registration, CSP, or host bridge lifecycle (use `mcp-expert`)
- Design token tier violations or CSS architecture (use `design-system-expert`)
- React component architecture, hooks, or render performance (use `react-component-expert`)
- Code quality, style, or naming (use `code-expert`)
- Test quality or TDD compliance (use `test-expert`)

## Overlap Boundaries

- **`code-expert`**: Always invoke as the gateway. `accessibility-expert` adds WCAG-specific depth.
- **`design-system-expert`**: Add when token-level contrast values may be the root cause. Complementary — `accessibility-expert` identifies the symptom, `design-system-expert` validates the token source.
- **`react-component-expert`**: Add when component architecture produces inaccessible HTML. Complementary — `accessibility-expert` assesses the output, `react-component-expert` assesses the structure.
- **`mcp-expert`**: Add when reviewing MCP App views. Per ADR-149, `accessibility-expert` owns DOM a11y inside the view; `mcp-expert` owns packaging and host lifecycle around it.

## Invocation

See `.agent/memory/executive/invoke-code-experts.md` for the full reviewer catalogue and invocation policy. The `accessibility-expert` canonical template is at `.agent/sub-agents/templates/accessibility-expert.md`.
