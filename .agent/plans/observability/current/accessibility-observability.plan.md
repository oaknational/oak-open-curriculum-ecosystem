---
name: "Accessibility Observability"
overview: >
  Best-effort runtime signal for the MCP App browser widget's accessibility
  profile: a11y_preference_tag emission on widget load (reduced-motion,
  high-contrast, font-scaling, prefers-color-scheme), frustration proxies
  (rage-click, rapid-retry), incomplete-flow correlation via
  widget_session_outcome, and a keyboard-only session boolean. Dev-time
  axe-core testing remains unchanged. Explicit open question: some a11y
  dimensions may be fundamentally unobservable at runtime.
derived_from: feature-workstream-template.md
foundational_adr: "docs/architecture/architectural-decisions/162-observability-first.md"
strategic_parent: "observability/future/sentry-observability-maximisation.plan.md"
blocked_on:
  - "docs/explorations/2026-04-18-accessibility-observability-at-runtime.md (exploration 3; blocks the runtime-capturable set)"
  - "observability-events-workspace.plan.md (for schemas)"
todos:
  - id: ws1-red
    content: "WS1 (RED): widget-side emission-site tests for a11y_preference_tag + frustration proxies + widget_session_outcome + keyboard-only boolean. All fail initially."
    status: pending
    priority: next
  - id: ws2-green
    content: "WS2 (GREEN): wire emissions from widget React components; compose conformance helper."
    status: pending
  - id: ws3-refactor
    content: "WS3 (REFACTOR): runbook entry; a11y-observation-openness documentation; cross-reference ADR-162 accessibility axis."
    status: pending
  - id: ws4-quality-gates
    content: "WS4: pnpm check exit 0; widget a11y suite still passes (axe-core dev-time coverage unchanged)."
    status: pending
  - id: ws5-adversarial-review
    content: "WS5: accessibility-reviewer (WCAG mapping of emissions) + react-component-reviewer (widget component hooks correctness) + sentry-reviewer."
    status: pending
  - id: ws6-doc-propagation
    content: "WS6: a11y runbook; event catalog; exploration 3 conclusions carried into this plan body."
    status: pending
isProject: false
---

# Accessibility Observability

**Last Updated**: 2026-04-18
**Status**: 🟡 PLANNING — blocks on exploration 3
**Scope**: Browser-widget runtime a11y signal. Dev-time axe-core remains unchanged.

---

## Context

Per the [direction-setting session report](../../../../docs/explorations/2026-04-18-observability-strategy-and-restructure.md#3-12-accessibility-observability-best-effort-open-question),
owner is explicit that some accessibility dimensions may resist runtime
observation. This plan commits to the **capturable** set and flags the
open question for further exploration.

### Problem Statement

Oak's a11y discipline today is dev-time: axe-core runs in widget tests,
the a11y-reviewer gates PRs, keyboard navigation is a first-class
requirement. Runtime evidence of how the widget behaves for users with
specific accessibility preferences is absent — we cannot tell whether
a user with reduced-motion reached the intended outcome.

### Existing Capabilities

- Widget bundle is shipped via the MCP App widget path at
  `apps/oak-curriculum-mcp-streamable-http/widget/` (approx).
- React component tooling for widget testing exists.
- `sentry-observability-maximisation-mcp.plan.md § L-12` wires
  `@sentry/browser` into the widget — this plan composes into that
  wiring.
- axe-core runs in widget tests.

---

## Design Principles

1. **Best-effort, named-open-question** — the plan commits to what is
   observable; dimensions that are not are flagged explicitly, not
   hand-waved.
2. **Preference tags on load, outcomes on unload** — capture the user's
   a11y preference profile at session start and the session outcome at
   end.
3. **Frustration proxies are heuristics, not facts** — rage-click and
   rapid-retry are high-signal but low-precision; this plan measures
   incidence without claiming causation.
4. **Dev-time axe-core stays** — runtime instrumentation does not
   replace dev-time checks; it complements them.

**Non-Goals** (YAGNI):

- Screen-reader session detection — privacy-sensitive; out of scope.
- Ambient light / motor-control inference — out of reach.
- Automated WCAG compliance scoring at runtime — axe-core does this
  at dev time; the runtime emissions support diagnosis, not compliance
  grading.

---

## Dependencies

**Blocking**:

- Exploration 3 — `docs/explorations/2026-04-18-accessibility-observability-at-runtime.md`.
  Defines the capturable set precisely (which media queries, rage-click
  threshold, keyboard-only inference rules).
- `observability-events-workspace.plan.md` — `a11y_preference_tag` and
  `widget_session_outcome` schemas.

**Related**:

- `sentry-observability-maximisation-mcp.plan.md § L-12` — browser Sentry
  wiring (parent emission path for widget).
- `observability/future/customer-facing-status-page.plan.md` — inherits
  session-outcome data.

---

## WS1 — Widget Emission Contract Tests (RED)

### 1.1: `a11y_preference_tag` on widget load

**Test**: `a11y-preference-tag.integration.test.ts` — mounts the widget
with media-query mocks for reduced-motion / high-contrast / font-scaling /
prefers-color-scheme; asserts a single conformant preference-tag event
emits on first load.

### 1.2: Frustration proxies

**Test**: `frustration-proxy.integration.test.ts` — simulates rage-click
+ rapid-retry; asserts the corresponding event types emit with the
correct thresholds (exact thresholds from exploration 3).

### 1.3: `widget_session_outcome`

**Test**: `widget-session-outcome.integration.test.ts` — simulates a
session reaching a success outcome, a session abandoning mid-flow;
asserts conformant outcome events.

### 1.4: Keyboard-only session

**Test**: `keyboard-only-session.integration.test.ts` — simulates an
all-keyboard session and a mixed session; asserts the boolean is
correct.

**Acceptance**: all tests compile and fail for expected reasons.

---

## WS2 — Widget Emission Implementation (GREEN)

### 2.1: Media-query preference capture

**File**: widget React component hook for a11y preferences (exact file
from L-12 wiring).

**Behaviour**: on mount, read `matchMedia` for reduced-motion,
high-contrast, forced-colors, prefers-color-scheme, prefers-font-size.
Emit one `a11y_preference_tag` event with captured values.

### 2.2: Frustration proxies

**Behaviour**: track click timestamps and retry attempts per component;
emit event when threshold met.

### 2.3: Session-outcome tracking

**Behaviour**: instrument widget state machine to emit an outcome event
at success points and at unload/abandonment.

### 2.4: Keyboard-only detection

**Behaviour**: session-level boolean; true if no pointer events received
during the session.

---

## WS3 — Documentation and Polish (REFACTOR)

### 3.1: A11y runbook

`docs/operations/a11y-runbook.md` (new) — how to read a11y-preference
distributions; what a spike in frustration proxies suggests;
keyboard-only session outcome comparison.

### 3.2: Open-question documentation

ADR-162 §Open Questions already references a11y observation limits.
This plan's body carries the operational consequence: "dimensions X, Y,
Z are not captured; this is deliberate per ADR-162 and exploration 3."

---

## WS4 — Quality Gates

```bash
pnpm check
```

Plus: `pnpm test:widget:a11y` must stay green (axe-core coverage
unchanged).

---

## WS5 — Adversarial Review

- `accessibility-reviewer` — WCAG mapping of preference keys; whether
  emitted categories are WCAG-aligned or ad-hoc.
- `react-component-reviewer` — hooks correctness; re-render safety of
  preference/outcome capture.
- `sentry-reviewer` — browser Sentry emission shape.

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Emission on every mount floods Sentry with preference events | One event per session; de-duplicate in the hook. |
| Frustration-proxy thresholds trigger false positives | Exploration 3 sets conservative thresholds; runbook includes "false-positive recalibration" section. |
| Keyboard-only inference is wrong during mouse-hover without click | Session boolean is "no pointer events received" (clicks + hovers); if inference proves unreliable, move to "explicit keyboard-first detected" only. |
| Open-question dimensions creep into scope | ADR-162 §Open Questions + this plan's Non-Goals hold the line; escalate to owner if a dimension turns out capturable. |

---

## Foundation Alignment

- ADR-162 — accessibility axis coverage (+ the ADR's own Open Question
  on a11y observation limits).
- ADR-160 — preference tags are categorical; no PII redaction
  complexity expected.
- ADR-143 — widget emissions flow through the same fan-out.

---

## Documentation Propagation

- A11y runbook.
- Event catalog.
- ADR-162 §Five Axes Accessibility entry.
- Widget README updates.

---

## Consolidation

Run `/jc-consolidate-docs`. Candidate pattern: **best-effort observation
with named open question** if it survives another validation (first
application of a pattern that names what is NOT observed as first-class
scope).

---

## Acceptance Summary

1. Four emission types wired in the widget.
2. All emission sites compose the conformance helper.
3. Exploration 3's conclusions are carried in this plan body.
4. Open-question dimensions are explicitly listed in the plan body.
5. `pnpm check` exit 0; `pnpm test:widget:a11y` green.
