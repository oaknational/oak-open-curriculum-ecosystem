# Invoke Design System Expert

Operationalises [ADR-149 (Frontend Specialist Reviewer Gateway Cluster)](../../docs/architecture/architectural-decisions/149-frontend-specialist-expert-gateway-cluster.md), [ADR-148 (Design Token Architecture)](../../docs/architecture/architectural-decisions/148-design-token-architecture.md), and [ADR-129 (Domain Specialist Capability Pattern)](../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md).

When changes touch design tokens, CSS custom properties, theming, or visual consistency patterns, invoke the `design-system-expert` specialist in addition to the standard `code-expert` gateway.

## Trigger Conditions

Invoke `design-system-expert` when the change involves:

- DTCG JSON token definitions or token schema changes
- CSS custom property definitions, naming, or scoping
- Token build pipeline configuration or transforms
- Three-tier referencing (palette → semantic → component usage)
- Theme structure, theme switching mechanisms, or mode definitions
- Style containment or CSS scoping in components
- Token consumption patterns in views or components
- Contrast metadata or colour token pair validation
- `packages/design/` workspace files
- Visual consistency across components or views

## Non-Goals

Do not invoke `design-system-expert` for:

- WCAG compliance, keyboard navigation, or screen reader readiness (use `accessibility-expert`)
- React component architecture, hooks, or render performance (use `react-component-expert`)
- MCP App packaging, `_meta.ui*`, resource registration, CSP, or host bridge lifecycle (use `mcp-expert`)
- Code quality, style, or naming beyond token conventions (use `code-expert`)
- Test quality or TDD compliance (use `test-expert`)

## Overlap Boundaries

- **`code-expert`**: Always invoke as the gateway. `design-system-expert` adds token-specific depth.
- **`accessibility-expert`**: Add when token contrast values may fail WCAG thresholds. Complementary — `design-system-expert` validates the token source, `accessibility-expert` validates the rendered result.
- **`react-component-expert`**: Add when component architecture affects how tokens are consumed. Complementary — both assess different aspects of the same component.
- **`mcp-expert`**: Add when reviewing MCP App views. Per ADR-149, `design-system-expert` owns token usage inside the view; `mcp-expert` owns the resource packaging that delivers the token CSS.
- **`architecture-expert-fred`**: Add when `packages/design/` dependency direction rules are involved.

## Invocation

See `.agent/memory/executive/invoke-code-experts.md` for the full reviewer catalogue and invocation policy. The `design-system-expert` canonical template is at `.agent/sub-agents/templates/design-system-expert.md`.
