---
title: Static Analysis Augmentation — SonarCloud, GitHub Advanced Security, and Code Decoration Techniques
date: 2026-04-18
status: active
---

# Static Analysis Augmentation

**Status**: Stub. Informs the post-MVP security posture captured by
[`future/security-observability-phase-2.plan.md`](../../.agent/plans/observability/future/security-observability-phase-2.plan.md).
Full analysis authored when the promotion trigger fires.

---

## 1. Problem statement

Oak already runs two static-analysis surfaces:

- **git-leaks** for secret scanning (per
  [`docs/governance/safety-and-security.md`](../governance/safety-and-security.md)).
- **GitHub Advanced Security** (GHAS) for code scanning.

Per the [direction-setting session §3.11](./2026-04-18-observability-strategy-and-restructure.md#311-security-observability-lightly-scoped):

> We could add in e.g. SonarCloud and potentially explore if there
> are any ways of decorating the code to enhance that analysis.

Two research questions:

1. Does **SonarCloud** add meaningfully different signal to what
   GHAS already surfaces, or is it duplicative?
2. Are there **code-decoration techniques** (type-annotation patterns,
   sanitiser-marker conventions, taint-tracking hints, structured
   doc-comments) that would measurably improve static-analysis signal
   quality for either GHAS, SonarCloud, or ESLint?

---

## 2. Scope (for full analysis when authored)

- GHAS's current ruleset coverage for Oak's stack (Node.js, TypeScript,
  Express, React, MCP SDK).
- SonarCloud's differential coverage — security hotspots, code smells,
  maintainability indicators not surfaced by GHAS.
- Code-decoration patterns examined: explicit sanitiser markers
  (`Trusted<T>` wrapper types); TSDoc `@security-sensitive` tags with
  ESLint rule enforcement; taint-tracking-friendly data-flow
  structuring.
- Cost / benefit for each candidate augmentation.

---

## 3. Research questions

1. What percentage of GHAS findings on Oak's codebase are
   low-severity / informational? High-severity coverage is the
   decision-relevant figure.
2. Does SonarCloud's TypeScript ruleset overlap meaningfully with
   `@oaknational/eslint-plugin-standards`'s custom rules, or is it
   complementary?
3. Are there code patterns in Oak's current surface that would
   benefit from a `Trusted<T>` / `Untrusted<T>` phantom-type
   discipline at validation boundaries?
4. What is the false-positive rate of GHAS on TypeScript code with
   heavy type narrowing (e.g. Zod schemas producing precise runtime
   types)?
5. Does a security-sensitive-function TSDoc tag, enforced by ESLint
   (e.g. "every exported function that calls `Sentry.captureException`
   with error-derived content must declare its redaction posture"),
   add value, or is it rule-multiplication without proportionate
   signal?
6. For any augmentation adopted, what gate placement is correct
   (pre-commit? PR check? nightly? audit only?) given Oak's
   [CI-boundary constraints](../architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md)?

---

## 4. Informs

- [`future/security-observability-phase-2.plan.md`](../../.agent/plans/observability/future/security-observability-phase-2.plan.md)
  — promotion trigger is "exploration 6 or 7 conclusions"; this is
  exploration 7.
- [`docs/governance/safety-and-security.md`](../governance/safety-and-security.md)
  — this exploration's recommendations feed back into the governance
  doc if adopted.
- [Exploration 6](./2026-04-18-cloudflare-plus-sentry-security-observability.md)
  — companion exploration on the security-observability surface.

---

## 5. Promotion trigger for full authorship

The exploration is authored in full when **any one of** the following
fires:

- GHAS surfaces a high-severity finding that SonarCloud would have
  caught differently or earlier.
- A code-review pattern emerges where reviewer findings repeatedly
  concern invariants that static analysis could encode
  (e.g. "this function accepts untrusted input without
  boundary-validation").
- The security-observability-phase-2 plan promotes to `active/` and
  requires a tool-stack decision.

---

## 6. References

- [Direction-setting session §3.11](./2026-04-18-observability-strategy-and-restructure.md#311-security-observability-lightly-scoped)
  — owner framing.
- [`docs/governance/safety-and-security.md`](../governance/safety-and-security.md)
  — current security-tooling posture.
- GHAS documentation, SonarCloud documentation — cited at authoring
  time.
- [ADR-161](../architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md)
  — CI-boundary constraint.
- [Exploration 6](./2026-04-18-cloudflare-plus-sentry-security-observability.md) —
  companion exploration.

(External GHAS and SonarCloud URLs are un-verified at stub time;
authoring-time verification required.)
