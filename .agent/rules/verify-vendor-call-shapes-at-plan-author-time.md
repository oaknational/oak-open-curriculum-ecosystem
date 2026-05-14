# Verify Vendor Call Shapes At Plan-Author Time

When a plan body pins the call shape of an external dependency — an
npm package, a CLI vendor binary, a system tool with named flags — the
plan author MUST verify the pinned shape against the dependency's
installed-or-published documentation at plan-author time. "Well-known
utility library" is not permission to pin a call shape from memory.
Stable API across a v0.x line is necessary but insufficient evidence
that the call shape *I remember* matches the *current* shape.

## Why This Rule Exists

Worked example 2026-05-14: a plan body pinned `tinyglobby` as
`glob({ patterns, ... })` from memory; the actual current export is
`glob(patterns, options)` positional. The drift was caught at WS
execution rather than plan-author time — cheap at plan-author time;
expensive at WS execution. The drift sits at exactly the layer where
"verify at execution time" should have been "verify now": the literal
function signature.

## How To Apply

- Open the dependency's published README or installed `.d.ts` types
  before pinning any call shape in a plan body. Cite the version
  pinned in the lockfile, not a memory of a prior version.
- If the dependency is not yet installed and not published, name the
  pin as a WS-internal decision (the WS that adds the dep also pins
  the shape); the plan body records the *expected* shape and the
  WS becomes drift-detection rather than decision-making.
- Re-verify on each major dependency upgrade if the call shape is
  named in any active plan body.

## Related Surfaces

- [`read-before-asking.md`](read-before-asking.md) — sibling discipline
  for project-internal shapes.
- [`plan-body-first-principles-check.md`](plan-body-first-principles-check.md)
  — the vendor-literal clause that permits deferral only inside the
  consuming WS.
- [PDR-018](../practice-core/decision-records/PDR-018-planning-discipline.md)
  §"DECISION-COMPLETE is the readiness gate (2026-05-14 amendment)" —
  the parent planning-discipline doctrine that this rule operationalises.
