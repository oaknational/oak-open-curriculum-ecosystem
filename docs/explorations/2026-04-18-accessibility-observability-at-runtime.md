---
title: Accessibility Observability at Runtime — What Is Capturable, What Resists Observation
date: 2026-04-18
status: informed-plan-accessibility-observability
---

# Accessibility Observability at Runtime — What Is Capturable, What Resists Observation

This exploration defines the runtime-capturable accessibility signal set for
the Oak MCP App browser widget, and — equally — names the runtime signal that
resists observation, is privacy-unsafe, or is redundant with the dev-time
correctness gate. It is the evidence base for
[`accessibility-observability.plan.md`](../../.agent/plans/observability/current/accessibility-observability.plan.md),
whose MVP commits to four runtime emission types (preference tags, frustration
proxies, widget session outcome, keyboard-only boolean) with named open
questions on thresholds, inference reliability, and stage vocabulary.

---

## 1. Problem statement

[ADR-162 (Observability-First)](../architecture/architectural-decisions/162-observability-first.md)
commits to an accessibility axis as part of the five-axis MVP principle. The
MCP App widget composition root at
[`apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx`](../../apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx)
has zero Sentry wiring and zero observability emission today — any runtime
signal begins here. The parallel executable plan
[`sentry-observability-maximisation-mcp.plan.md § L-12`](../../.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
will land `@sentry/browser` into the widget; accessibility emissions compose
into that wiring.

WCAG 2.2 Level AA conformance is already _proven_ at dev-time by Playwright +
axe-core as a blocking quality gate
([ADR-147](../architecture/architectural-decisions/147-browser-accessibility-as-blocking-quality-gate.md);
[`docs/governance/accessibility-practice.md`](../governance/accessibility-practice.md)).
Runtime _experienced_ accessibility is a different question, and the tooling
available to answer it is partial at best.

This exploration answers, for the widget specifically:

1. **What runtime signal is capturable** — signals the browser exposes that
   survive the [ADR-160 redaction barrier](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
   without loss and without user identification.
2. **What can be inferred** from that signal (with named reliability caveats).
3. **What resists observation** — signal types the browser does not expose,
   exposes only at a privacy cost we will not pay, or exposes unreliably.
4. **Where runtime telemetry fundamentally cannot replace dev-time proof** —
   and why the dev-time gate stays as the correctness surface regardless of
   runtime coverage.

---

## 2. Honest starting position

The conclusion is not hidden in the body of this document. It is stated here
so no reader has to hunt for it.

**Accessibility correctness is proven at dev-time. Runtime telemetry does not
replace that proof and cannot be positioned as if it did.**

Two concrete consequences follow from this:

- Playwright + axe-core as a blocking gate (ADR-147;
  `wcag2a wcag2aa wcag21a wcag21aa wcag22aa` tag set; zero-tolerance on
  violations; zero skipped or disabled rules; both `light` and `dark` theme
  projects) is the _correctness surface_ for WCAG 2.2 AA. Runtime emission
  does not, and will not, produce a WCAG conformance verdict for a given
  session.
- Runtime telemetry tells us about **preferences expressed**, **flows
  abandoned**, **retries clustered**, and **navigation mode at session
  granularity**. It does NOT tell us whether a user running assistive tech
  failed silently, whether a semantic label was misleading, or whether a
  dialog was announced correctly by a screen reader. Those questions live
  in user research, manual audits, and opt-in feedback — not in passive
  observation.

The rest of this document separates "runtime signal that is capturable, safe,
and useful for cohort-level product and a11y analytics" from "runtime signal
that would be nice but is unreliable, privacy-unsafe, or redundant with the
dev-time gate." The plan that this exploration blocks makes the MVP scope
decision from exactly that separation.

---

## 3. Scope and non-scope

**In scope**: browser-side, widget-runtime signal emitted once per session
(preferences) or in response to observable user behaviour (frustration
proxies, session outcome, keyboard-only).

**Out of scope**:

- Server-side accessibility telemetry (the MCP server is not an a11y surface
  for end users; engineers are the users).
- Replacement or relaxation of the ADR-147 blocking gate (dev-time axe-core
  is the correctness surface; runtime complements, does not substitute).
- Real-time WCAG-verdict emission (§4.7 explains why this is rejected).
- Any emission whose fields would require redaction that would destroy the
  signal (§4.5, §4.6).

---

## 4. Options considered

Seven options. Four are recommended for MVP; three are explicitly rejected
with rationale so the closed-set decision is legible.

Each option states: what it is, how it would work, pros, cons and typical
failure modes, privacy and redaction-barrier posture, and a verdict.

### 4.1 Preference media-query tags — **MVP-IN (recommended)**

**What**. Emit `a11y_preference_tag` once per session at widget-load time,
carrying the user's browser-reported accessibility preferences.

**How**. In the widget mount path (the existing `App` component at
[`widget/src/App.tsx`](../../apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx)),
a new hook reads `window.matchMedia(...)` for each preference key, packages
the results into a single event, and dispatches it through the widget's
observability adapter on first mount. De-duplication is enforced at the hook
level (one emission per session; remount does not re-emit).

The candidate key set is drawn from the W3C Media Queries Level 5 user
preference section ([`#mf-user-preferences`](https://www.w3.org/TR/mediaqueries-5/#mf-user-preferences)):

- `prefers-reduced-motion` — stable, widely supported.
- `prefers-color-scheme` — stable, widely supported.
- `prefers-contrast` — supported in current Chromium, Firefox, Safari.
- `forced-colors` — supported; indicates Windows High Contrast Mode or
  equivalent.
- `prefers-reduced-transparency` — newer; browser coverage is uneven
  (Chromium stable; Firefox/Safari partial as of authoring).
- `prefers-reduced-data` — newer; coverage partial (open question §5.6).

Font-scaling may also be derived from
`getComputedStyle(document.documentElement).fontSize` compared against the
CSS root default. This is less reliable than media-query preferences (it
depends on when the read fires, and browsers differ in how user-set font
sizes affect `rem`). Flag as best-effort rather than authoritative.

**Pros**.

- User-agent-reported; no user identification; categorical only.
- `matchMedia` is a stable DOM API with a well-documented interface
  ([MDN `Window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)).
- Safe under ADR-160: no field requires redaction, no field widens beyond
  a closed enum of known values (for each preference, the spec defines the
  closed value set).
- Single emission per session — low volume, low cost.
- Directly actionable for product and a11y reviewers: "X% of sessions
  request `reduced-motion`, Y% request `high-contrast`" is a first-order
  question they can ask on day one of public beta.

**Cons and failure modes**.

- A preference is an _expression_, not an _outcome_. A user setting
  `prefers-reduced-motion` tells us they dislike motion; it does not tell us
  they completed their flow successfully. Preference tags must join to
  outcome events to be load-bearing beyond distributional reporting.
- At per-user granularity, the combination of preference tags could
  contribute to a fingerprinting surface. MVP emits at cohort / session
  granularity only; no per-user persistence beyond a hashed session ID
  (correlation keys contract owned by
  [`observability-events-workspace.plan.md`](../../.agent/plans/observability/current/observability-events-workspace.plan.md)).
- Newer preference keys (`reduced-transparency`, `reduced-data`) have
  uneven coverage; sessions from browsers without support simply do not
  emit those keys, which is acceptable but must not be misread as "no
  user preference" (absence ≠ "off").

**Privacy / redaction posture**. All fields are categorical closed-set
enums. No field is user-identifying on its own. Aggregation risk is
mitigated by session-granularity emission (no per-user accumulation across
sessions). ADR-160 redaction barrier passes cleanly.

**Verdict**. **MVP-IN**. Lowest-cost, highest-reliability runtime
accessibility signal available. Unblocks data-scientist first-order
questions on launch day.

---

### 4.2 Frustration-proxy events — **MVP-IN, thresholds open**

**What**. Emit `frustration_proxy_event` when observed user behaviour
clusters match a heuristic threshold for frustration — rage-click,
rapid-retry, or form-resubmit-after-error.

**How**. A widget-side listener accumulates click timestamps per target and
submit-retry counts per form component. When a local window crosses the
threshold, it emits a single event carrying the proxy type, the target-type
category (closed enum), and a coarse timing descriptor. Per the plan's
acceptance model, this is "incidence counting," not "frustration
measurement"; the event proves the behaviour pattern, not its cause.

**Threshold proposal** (for post-beta calibration):

- **Rage-click** — 3 or more clicks on the same target within 800ms.
- **Rapid-retry** — 3 or more submit events within 5s following an error
  response.
- **Form-resubmit-after-error** — resubmit within 10s of the previous
  response being an error.

These numbers are a starting point, not a calibrated truth. See §5.1.

**Pros**.

- Captures behavioural signal that preference tags cannot: a user may
  express `reduced-motion` and still fail silently; a rage-click cluster
  is a direct behavioural signal that the interaction is not working for
  them.
- Exists as a known pattern in product analytics literature (PostHog's
  autocapture, for example, implements a variant of this). The mechanism
  is not novel; only the integration into our event schema is.
- Cohort-level signal is independently useful ("which targets are the
  most rage-clicked?") even without per-user analysis.

**Cons and failure modes**.

- **False positives from latency**. A user clicking three times in 800ms
  on a button that is slow to respond is not frustrated with the UI; they
  are frustrated with the _wait_. A slow network will cause frustration
  proxies to spike without any UI defect. This is a known false-positive
  mode and must be documented in the a11y runbook.
- **Cultural and device-class variance**. Mobile touch users routinely
  double-tap; some users triple-click in lieu of drag; some keyboards
  double-register. Thresholds that work for desktop users may misfire on
  mobile and vice versa.
- **"Rage" is an inference, not a ground truth**. The event schema name
  (`frustration_proxy_event`, not `rage_event`) reflects this; the event
  proves the pattern, not the emotion.
- Threshold values are arbitrary until post-beta calibration; until then,
  the signal is qualitative rather than quantitative.

**Privacy / redaction posture**. Target-type category is a closed enum
(`button`, `link`, `input`, `form`, `other`) — no raw DOM selectors, no
innerText, no user-supplied content. Timing descriptors are coarse
(millisecond buckets) — no raw timestamps. ADR-160 passes cleanly. Raw
cursor traces, keystroke capture, and innerText of clicked elements are
explicitly not collected.

**Verdict**. **MVP-IN**. Thresholds marked as post-beta-calibration open
questions in the plan.

---

### 4.3 Keyboard-only session boolean — **MVP-IN, inference reliability open**

**What**. A session-level boolean (`widget_session_outcome.keyboard_only`)
set to `true` if the session observed no pointer events and `false`
otherwise, enabling cohort-level "what share of sessions are keyboard-only"
analysis.

**How**. At session start, initialise `seenPointerEvent = false`. On any
`pointerdown` / `click` / `mousemove`, set it to `true` (sticky). At
session-end, include `keyboard_only: !seenPointerEvent` in the outcome
event (§4.4).

Fallback inference (named in the blocked plan's risk row, to activate if
the primary proves unreliable in the field): "keyboard-first detected" —
true if the _first_ interaction event was a key event; false otherwise.
This is coarser but less sensitive to accidental pointer events mid-
session.

**Pros**.

- Answers a first-order question ("what share of our users are navigating
  keyboard-only?") without requiring per-user tracking.
- Joins cleanly to preference tags: "what share of `reduced-motion` users
  are also keyboard-only?" is immediately answerable.
- No library required; native DOM events only.

**Cons and failure modes**.

- **False positives** when a user hovers without clicking: `pointerdown`
  fires but `click` does not. The primary inference treats
  `pointerdown`-without-click as "used a pointer"; this is the correct
  read for "keyboard-only" semantics.
- **False negatives** from accidental trackpad taps: a keyboard-primary
  user who brushes the trackpad once is classified as "mixed." This is
  the failure mode the fallback inference ("keyboard-first detected")
  mitigates.
- The inference does not distinguish "keyboard-only by preference" from
  "keyboard-only because the pointer is broken" — both present as
  `keyboard_only: true`. At cohort level this is acceptable; at per-user
  level it is not a claim we make.

**Privacy / redaction posture**. Boolean only; no raw event stream, no
timestamps. ADR-160 passes trivially.

**Verdict**. **MVP-IN**. Primary inference ships; fallback retained as a
named contingency if field evidence shows the primary is unreliable.
Reliability calibration is an open question (§5.2).

---

### 4.4 Incomplete-flow correlation via `widget_session_outcome` — **MVP-IN, stage vocabulary open**

**What**. Emit `widget_session_outcome` at session end carrying a closed-
enum `outcome` field (`success`, `abandoned_during_<stage>`,
`error_during_<stage>`) and the preceding session's preference tags and
keyboard-only boolean by correlation-key reference.

**How**. Instrument the widget runtime state machine (currently in
[`widget/src/app-runtime-state.ts`](../../apps/oak-curriculum-mcp-streamable-http/widget/src/app-runtime-state.ts),
consumed via `useReducer` in `App.tsx`) to mark the current stage. On
`beforeunload` or on an explicit success signal, emit the outcome event.

**Why this is MVP-in despite the stage-vocabulary open question**. The
event shape — outcome + stage + correlation reference — is load-bearing
regardless of the exact stage vocabulary. The vocabulary becomes concrete
when
[`observability-events-workspace.plan.md`](../../.agent/plans/observability/current/observability-events-workspace.plan.md)
lands the schema, which will itself be informed by exploration 4
(event schemas) and product-owner input. The plan is to ship with a
provisional vocabulary and refine it from real usage.

**Pros**.

- The join surface between a11y signal and product outcome: "what
  fraction of `reduced-motion` sessions abandoned during `<stage>`?"
- Captures product-usability signal independently of the a11y-specific
  questions, and combines the two cleanly in post-hoc analysis.
- Outcome-at-session-end is a standard product-analytics pattern; does
  not require novel infrastructure.

**Cons and failure modes**.

- `beforeunload` is not guaranteed to fire (mobile background kills, tab
  crashes, browser force-closes). Some fraction of abandonment events
  will be silent. Cohort reporting should treat "no outcome event" as a
  fourth outcome category, not as "success by default."
- Stage vocabulary is a decision not yet made. Using the wrong vocabulary
  produces uninformative events that are hard to re-categorise without
  replay.
- Outcome is a cohort-level signal; any per-user inference of
  abandonment cause is over-reading.

**Privacy / redaction posture**. Stage is a closed enum; outcome is a
closed enum; correlation reference uses the hashed session ID contract.
No free-text fields, no per-user identifiers. ADR-160 passes cleanly.

**Verdict**. **MVP-IN**. Stage vocabulary is the named open question
(§5.4), blocked on exploration 4 and product-owner input.

---

### 4.5 Screen-reader / assistive-tech detection — **MVP-OUT**

**What**. Infer screen-reader presence via one or more of: user-agent
sniffing for AT product names; invisible-focus tracking; `aria-live`
"probe-and-listen" patterns; OS-level AT-API signals where exposed.

**How it would work** (for completeness of rejection rationale):

- UA sniffing: match `navigator.userAgent` against known AT strings
  (`NVDA`, `JAWS`, etc.).
- Invisible focus tracking: render a hidden focusable element that is
  only reached by AT-style focus traversal.
- `aria-live` probe: insert a live-region message and detect if it was
  consumed.

**Why rejected**.

- **User identification**. AT product name is a user-identifying signal
  (often narrowing a cohort to a small number of individuals). It fails
  ADR-160 at the redaction boundary: a field that requires per-user
  redaction is not a field we ship.
- **Fingerprinting risk**. Detecting AT presence is a meaningful
  fingerprinting signal; combined with other observable signals it
  narrows identity further. The risk/benefit is lopsidedly against us.
- **Reliability**. AT users routinely spoof a standard UA to avoid
  second-class experiences. UA sniffing has false-negative rates that
  make the signal useless even before the privacy question.
- **Inferior alternative exists**. The a11y questions this signal would
  answer ("are AT users succeeding?") are better answered by user
  research, manual audits, and opt-in feedback. Those produce higher-
  quality signal at lower privacy cost.

**Verdict**. **MVP-OUT**. Any AT-specific question belongs to user
research and opt-in feedback channels, not passive observation.

---

### 4.6 Motor-control / jitter inference — **MVP-OUT**

**What**. Infer motor-control challenges from observable input
characteristics: click-latency variance, mis-click distance from target,
cursor-jitter traces, double-activation patterns.

**Why rejected**.

- **Raw input capture is PII-equivalent**. Cursor traces and keystroke
  timing patterns are personally identifying at sufficient resolution;
  the redaction required to make them safe destroys the signal.
- **Classification is unreliable**. Motor-control variance overlaps
  heavily with device-class variance (trackpad vs. mouse vs. touchscreen)
  and with task-class variance (fine-grained tasks produce jitter in
  anyone). A classifier that works on clean data does not survive field
  conditions.
- **Ethical questions**. Inferring disability status without consent is
  not a line we cross, even in service of accessibility.

**Verdict**. **MVP-OUT**. The signal cannot be collected safely; the
alternative (opt-in accessibility preference indication) is already
partly covered by §4.1 preference tags.

---

### 4.7 Runtime axe-core emission — **MVP-OUT**

**What**. Ship `axe-core` into the production widget bundle and emit
detected WCAG violations as events during live sessions.

**Why rejected**.

- **Tooling misfit**. The axe-core project describes itself as a
  dev/test-time tool ([repository README](https://github.com/dequelabs/axe-core)
  installs via `--save-dev`). It is not designed for production bundle
  use; its invariants and performance profile assume test-time
  execution.
- **Bundle cost**. axe-core is several hundred kilobytes minified. The
  widget is delivered to every MCP host; the bundle-size cost is direct
  user-perceivable latency on first load.
- **No new information**. ADR-147 already establishes Playwright +
  axe-core as a blocking CI gate. A violation that reaches production
  would already have been caught; a violation that was _not_ caught by
  dev-time axe-core will also not be caught by runtime axe-core because
  both use the same rule engine.
- **Cost without compensating benefit**. The dev-time gate produces
  structural proof; runtime re-execution produces the same proof, just
  later, more expensively, and without a clean blocking surface.

**Verdict**. **MVP-OUT**. The dev-time gate is the correctness surface.
Runtime re-execution of the same rule engine does not extend it.

---

### 4.8 Summary table

| #   | Option                           | Verdict                        | Why                                                     |
| --- | -------------------------------- | ------------------------------ | ------------------------------------------------------- |
| 4.1 | Preference media-query tags      | MVP-IN                         | Safe, stable, high-signal; directly actionable          |
| 4.2 | Frustration-proxy events         | MVP-IN (thresholds open)       | Behavioural signal preference tags cannot capture       |
| 4.3 | Keyboard-only session boolean    | MVP-IN (reliability open)      | Cohort-level navigation-mode signal; trivial cost       |
| 4.4 | Incomplete-flow correlation      | MVP-IN (stage vocabulary open) | Join surface between a11y and product outcome           |
| 4.5 | Screen-reader / AT detection     | MVP-OUT                        | User-identifying; fingerprinting risk; unreliable       |
| 4.6 | Motor-control / jitter inference | MVP-OUT                        | PII-equivalent input capture; unreliable classification |
| 4.7 | Runtime axe-core emission        | MVP-OUT                        | Tooling misfit; bundle cost; no new information         |

---

## 5. Research questions still open

Each question names a calibration trigger or decision owner — no vague
intent (per
[`patterns/nothing-unplanned-without-a-promotion-trigger.md`](../../.agent/memory/patterns/nothing-unplanned-without-a-promotion-trigger.md)).

### 5.1 Frustration-proxy thresholds

**Question**. Are the proposed thresholds (rage-click: 3 clicks / 800ms;
rapid-retry: 3 submits / 5s; form-resubmit: 10s) calibrated correctly for
Oak's user population and device mix?

**Trigger for answer**. Calibration pass against the first 30 days of
post-beta traffic; adjust thresholds if false-positive rate exceeds the
runbook's operational threshold (to be set in the a11y runbook at plan
WS3.1).

**Owner**. Plan WS6 documentation propagation absorbs the calibration
result.

### 5.2 Keyboard-only inference reliability

**Question**. Does the primary inference ("no pointer events = keyboard-
only") produce a false-positive rate (accidental trackpad taps
reclassifying keyboard-only sessions as mixed) or false-negative rate
(hover-without-click reclassifying pointer sessions as keyboard-only)
high enough to require the fallback?

**Trigger for answer**. First 30 days of post-beta traffic; compare
primary-inference and fallback-inference distributions on the same
session data; switch if divergence exceeds 10% at the cohort level.

**Owner**. Plan WS5 `react-component-reviewer` pass reviews the
implementation; plan WS6 absorbs the switch if required.

### 5.3 Font-scaling detection approach

**Question**. Is `window.getComputedStyle(document.documentElement).fontSize`
compared against the CSS default a reliable indicator of user font-scale
preference, or do cross-browser differences make it too noisy?

**Trigger for answer**. Spike during WS2 GREEN against Chromium, Firefox,
Safari on current stable versions. If noise exceeds 10% of sessions,
drop the derived `font_scaling` key from `a11y_preference_tag` and leave
it as a future capture if a reliable API emerges.

**Owner**. Plan WS2.1 implementer decides based on spike evidence.

### 5.4 Widget session stage vocabulary

**Question**. What is the closed-enum vocabulary of `<stage>` values for
`abandoned_during_<stage>` and `error_during_<stage>`?

**Trigger for answer**. Exploration 4 (structured event schemas for
curriculum analytics) authors the vocabulary from product-owner input;
`observability-events-workspace.plan.md` absorbs it.

**Owner**. Product owner (named in direction-setting session §3.5);
exploration 4 formalises.

### 5.5 Preference-tag fingerprinting surface area

**Question**. At what granularity does the combination of preference
tags + other observable session features narrow identity? Is session-
level emission sufficient, or does the cohort-level aggregation need to
coarsen further?

**Trigger for answer**. Schema-design review at
`observability-events-workspace.plan.md` WS1 RED; `security-reviewer`
assesses combined-field entropy and recommends coarsening if needed.

**Owner**. `security-reviewer` + `docs-adr-reviewer` at schema-landing
time.

### 5.6 `prefers-reduced-data` and `prefers-reduced-transparency` stability

**Question**. Are these newer preference keys stable enough across Oak's
target browser matrix (Chromium, Firefox, Safari, Edge at current stable)
to include in the MVP `a11y_preference_tag` emission, or should they be
MVP-deferred until coverage matures?

**Trigger for answer**. Browser-support audit during WS2.1 against
current stable versions. Any key with <80% user coverage at that time
moves to post-MVP and is emitted conditionally (present if supported;
absent otherwise — which is already the correct semantic).

**Owner**. Plan WS2.1 implementer; documented in event catalog.

---

## 6. Informs

This exploration is the evidence base for:

- [`.agent/plans/observability/current/accessibility-observability.plan.md`](../../.agent/plans/observability/current/accessibility-observability.plan.md)
  — the four MVP-IN options (§4.1–§4.4) map directly to the plan's four
  emission types (preference tags, frustration proxies, keyboard-only
  boolean, widget session outcome). The three MVP-OUT options (§4.5–§4.7)
  map directly to the plan's Non-Goals. The open questions (§5.1–§5.6)
  map directly to the plan's Risk Assessment rows and WS6 documentation
  propagation.
- [`.agent/plans/observability/current/observability-events-workspace.plan.md`](../../.agent/plans/observability/current/observability-events-workspace.plan.md)
  — the schema shapes for `a11y_preference_tag`, `frustration_proxy_event`,
  and `widget_session_outcome` derive from the field enumerations above;
  the stage vocabulary for `widget_session_outcome` is delegated to
  exploration 4 (event schemas) and the plan.
- [ADR-162](../architecture/architectural-decisions/162-observability-first.md)
  § Enforcement — the reviewer-matrix question "Does this capability have
  a loop across each applicable axis?" applies concretely to the widget
  via the emissions in §4.1–§4.4.

---

## 7. References

### Architectural decisions

- [ADR-147 — Browser Accessibility as a Blocking Quality Gate](../architecture/architectural-decisions/147-browser-accessibility-as-blocking-quality-gate.md).
  Establishes Playwright + axe-core as the correctness surface; this
  exploration deliberately does not attempt to replace that gate.
- [ADR-160 — Non-Bypassable Redaction Barrier as Principle](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md).
  Every proposed MVP-IN emission passes the barrier without loss; every
  rejected option fails it (or fails an adjacent privacy principle).
- [ADR-162 — Observability-First](../architecture/architectural-decisions/162-observability-first.md).
  Five-axis principle committing to an accessibility axis at MVP.

### Governance and project documents

- [`docs/governance/accessibility-practice.md`](../governance/accessibility-practice.md)
  — Oak's WCAG 2.2 AA posture, axe-core tag set, theme-aware testing,
  MCP App two-level testing, gate position.
- [`docs/explorations/README.md`](./README.md) — exploration document
  shape (followed by this document).
- [`docs/explorations/2026-04-18-observability-strategy-and-restructure.md § 3.12`](./2026-04-18-observability-strategy-and-restructure.md#312-accessibility-observability--best-effort--open-question)
  — direction-setting session, owner framing for this exploration.
- [`patterns/findings-route-to-lane-or-rejection.md`](../../.agent/memory/patterns/findings-route-to-lane-or-rejection.md)
  — every rejected option in §4 carries an explicit rationale; nothing
  is deferred without a home.
- [`patterns/nothing-unplanned-without-a-promotion-trigger.md`](../../.agent/memory/patterns/nothing-unplanned-without-a-promotion-trigger.md)
  — every open question in §5 carries a named trigger.
- [`patterns/ground-before-framing.md`](../../.agent/memory/patterns/ground-before-framing.md)
  — the recommendation set follows from the actual widget composition
  root, not from SDK-surface speculation.

### Code

- [`apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx`](../../apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx)
  — widget composition root. Confirms no Sentry wiring and no
  observability emission today; `@sentry/browser` lands via L-12 of the
  maximisation plan and a11y emissions compose into that wiring.
- [`apps/oak-curriculum-mcp-streamable-http/widget/src/app-runtime-state.ts`](../../apps/oak-curriculum-mcp-streamable-http/widget/src/app-runtime-state.ts)
  — widget runtime state machine; the stage-tracking for §4.4 integrates
  here.
- [`packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts`](../../packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts)
  — the Node-side redaction barrier conformance pattern; the widget-side
  equivalent lands via L-12-prereq (browser-safe redaction core
  extraction) and the events workspace conformance helper.

### External specs and tooling

- [W3C Media Queries Level 5 — User Preference Media Features](https://www.w3.org/TR/mediaqueries-5/#mf-user-preferences)
  — defines `prefers-reduced-motion`, `prefers-color-scheme`,
  `prefers-contrast`, `forced-colors`, `prefers-reduced-transparency`,
  `prefers-reduced-data`.
- [MDN `Window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)
  — canonical API reference; returns `MediaQueryList`.
- [axe-core repository (dequelabs/axe-core)](https://github.com/dequelabs/axe-core)
  — stated purpose: accessibility testing engine for dev/test-time use;
  installed as a dev dependency. Confirms §4.7's tooling-misfit verdict.
