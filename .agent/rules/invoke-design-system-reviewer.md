# Invoke Design System Reviewer

Operationalises [ADR-149 (Frontend Specialist Reviewer Gateway Cluster)](../../docs/architecture/architectural-decisions/149-frontend-specialist-reviewer-gateway-cluster.md), [ADR-148 (Design Token Architecture)](../../docs/architecture/architectural-decisions/148-design-token-architecture.md), and [ADR-129 (Domain Specialist Capability Pattern)](../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md).

When changes touch design tokens, CSS custom properties, theming, or visual consistency patterns, invoke the `design-system-reviewer` specialist in addition to the standard `code-reviewer` gateway.

## Trigger Conditions

Invoke `design-system-reviewer` when the change involves:

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

Do not invoke `design-system-reviewer` for:

- WCAG compliance, keyboard navigation, or screen reader readiness (use `accessibility-reviewer`)
- React component architecture, hooks, or render performance (use `react-component-reviewer`)
- MCP App packaging, `_meta.ui*`, resource registration, CSP, or host bridge lifecycle (use `mcp-reviewer`)
- Code quality, style, or naming beyond token conventions (use `code-reviewer`)
- Test quality or TDD compliance (use `test-reviewer`)

## Overlap Boundaries

- **`code-reviewer`**: Always invoke as the gateway. `design-system-reviewer` adds token-specific depth.
- **`accessibility-reviewer`**: Add when token contrast values may fail WCAG thresholds. Complementary — `design-system-reviewer` validates the token source, `accessibility-reviewer` validates the rendered result.
- **`react-component-reviewer`**: Add when component architecture affects how tokens are consumed. Complementary — both assess different aspects of the same component.
- **`mcp-reviewer`**: Add when reviewing MCP App views. Per ADR-149, `design-system-reviewer` owns token usage inside the view; `mcp-reviewer` owns the resource packaging that delivers the token CSS.
- **`architecture-reviewer-fred`**: Add when `packages/design/` dependency direction rules are involved.

## Invocation

See `.agent/memory/executive/invoke-code-reviewers.md` for the full reviewer catalogue and invocation policy. The `design-system-reviewer` canonical template is at `.agent/sub-agents/templates/design-system-reviewer.md`.
