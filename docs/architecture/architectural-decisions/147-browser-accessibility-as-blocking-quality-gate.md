# ADR-147: Browser Accessibility as a Blocking Quality Gate

**Status**: Accepted
**Date**: 2026-04-02
**Related**: [ADR-121 (Quality Gate Surfaces)](121-quality-gate-surfaces.md), [ADR-129 (Domain Specialist Capability Pattern)](129-domain-specialist-capability-pattern.md), [ADR-141 (MCP Apps Standard)](141-mcp-apps-standard-primary.md), [ADR-149 (Frontend Specialist Reviewer Gateway Cluster)](149-frontend-specialist-reviewer-gateway-cluster.md)

## Context

This repository is building React MCP App views (WS3 Phases 4-5) that
render inside host-provided iframes. The existing quality gate taxonomy
(ADR-121) has eight gate categories covering formatting, types, linting,
static analysis, testing, mutation testing, build, and specialist review.
None addresses browser accessibility.

The testing strategy has no vocabulary for browser-specific proof
surfaces. Without a blocking gate, accessibility regressions can ship
silently — discovered only by end users or downstream audits.

Incoming Practice evolution (opal-connection-site, 2026-03-28) proposed
browser proof surfaces and a 9th quality gate category. The proposal was
assessed and adopted into the Practice Core at provenance index 19.

## Decision

Add WCAG 2.2 AA compliance as a 9th blocking quality gate for all
UI-shipping workspaces.

### Standard

- **Target**: WCAG 2.2 Level AA
- **Tolerance**: Zero — no `skipRules`, no accepted violations
- **Themes**: Both light and dark themes must pass independently

### Tooling

- **Playwright** + **axe-core** (`@axe-core/playwright`) as the test
  harness
- Tests run via `test:a11y` script in UI-shipping workspaces. Currently
  enforced in `pnpm check` (local); promotion to pre-push and CI is
  tracked in the quality gate hardening plan (item 0d) and will add
  `test:a11y` to both surfaces simultaneously per ADR-121's pre-push
  === CI principle
- Tests must avoid real network calls so GitHub Actions runners can
  exercise them without internet access

### MCP App Testing — Two Required Levels

MCP App HTML resources are self-contained documents that render inside
host-provided iframes. Testing requires two complementary levels:

1. **Resource-level a11y tests**: Serve the HTML resource content
   directly to a Playwright page. Inject design token CSS as a test
   fixture. Run axe-core. This proves DOM accessibility in isolation
   but does not prove correct MCP App packaging.

2. **MCP App integration verification**: Use upstream `basic-host` or
   a supported MCP Apps host to verify the resource loads correctly
   with sandbox, CSP, `ui/initialize`, and postMessage bridge. This
   proves correct packaging but is not sufficient for a11y proof.

Both levels are required; neither is sufficient alone.

### Gate Position

`test:a11y` runs after `test:ui` and before `smoke:dev:stub` in the
canonical gate sequence. See ADR-121 for the coverage matrix amendment.

## Rationale

### Why blocking, not advisory

Accessibility is a binary correctness property for user-facing surfaces,
not a best-effort aspiration. Advisory gates create backlogs that grow
indefinitely. A blocking gate ensures violations are caught at the point
of introduction, when the fix is cheapest.

### Why WCAG 2.2, not 2.1

WCAG 2.2 (October 2023) adds criteria for focus appearance, dragging
movements, and consistent help — all relevant to interactive MCP App
views. Targeting the current standard avoids a near-term upgrade.

### Why zero-tolerance

`skipRules` configurations drift and accumulate. Each skipped rule
requires ongoing justification and review. Starting with zero-tolerance
establishes the correct baseline; if a rule genuinely cannot be
satisfied, the team must resolve the underlying issue, not suppress the
signal.

### Why Playwright + axe-core

Playwright provides cross-browser testing with headless CI support.
axe-core is the industry-standard accessibility testing engine covering
the automatable subset of WCAG 2.2 checks. Manual review remains
necessary for criteria that cannot be machine-verified. The combination
is well-supported, actively maintained, and does not require
browser-specific plugins.

## Consequences

### Positive

- Accessibility regressions are caught before merge
- MCP App views ship with verified WCAG 2.2 AA compliance
- The two-level MCP App testing approach separates a11y proof from
  packaging proof, enabling focused debugging

### Negative

- UI-shipping workspaces gain a new CI step (Playwright browser install,
  test execution). Mitigation: Playwright's CI caching and headless mode
  keep overhead manageable
- Teams must resolve all axe-core violations before merging. Mitigation:
  this is the intended behaviour — violations should block

### Cross-References

- ADR-121 amended to add `test:a11y` to the coverage matrix
- `accessibility-reviewer` (ADR-149) is the enforcement agent for this
  gate in code review
- `docs/governance/accessibility-practice.md` provides detailed
  implementation guidance
