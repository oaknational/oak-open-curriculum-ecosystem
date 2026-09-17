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
- The same discipline covers **the agent's mental model of vendor and
  platform behaviour**, not only literal call shapes: training-time
  knowledge ≠ live docs. MCP client capability support, vendor CLI
  modes and version gaps, and SDK semantics are repeatedly wrong in
  the model's priors and must be checked against the latest published
  documentation — never against installed source alone or a
  remembered capability matrix (corpus-validated recurring class,
  2026-06-30; see also the per-user memory
  "Platform feature support — check official docs").
- **When probing a vendor refusal or normalisation before encoding it,
  enumerate the class's sub-cases and probe the EXACT spelling being
  encoded.** Two probes of different sub-cases can both be "right" and
  still mislead: turbo rejected an invalid escape while accepting (and
  normalising) a valid one, so a single-sub-case probe encoded the
  wrong verdict for the sibling spelling. Scratch fixtures also diverge
  from the real repo (git context, children-are-directories) — confirm
  the decisive probe in-repo before the shape is pinned (worked
  instance 2026-08-11, the turbo-inputs backslash/`..` matcher).
- **Plan-time vendor shapes are re-verified at EXECUTION time too**: a
  ratified plan pinned a fixed port where the module's live contract
  was `listen(0)` ephemeral — caught only by reading the module before
  invoking it, and cured as a recorded deviation in the run record,
  never a product-code hack (worked instance 2026-08-12).
- **Capability answers come from ORIGINAL vendor sources at time of use,
  never from prior repo research** (owner rule, 2026-07-25) — recorded
  capability verdicts are version-pinned so their staleness is
  self-declaring; internal research is provenance, never the verdict.
  Worked flip inside one hour: a ticket treated the repo's 2026-07-17
  "Codex hook discovery negative" (0.144.5) as governing while the
  vendor's 0.145.0 (four days old) shipped registry-level hook dispatch.
- **Check the capability's ARITY and COMPOSITION, not only that it
  exists** (worked instance 2026-07-25, `excludeAgent`): a plan invented
  a capability by composing two true facts (an exclusion keyword exists;
  two consuming surfaces exist) into a false third (both can be
  excluded) — the keyword accepts exactly one value. "Feature X exists"
  almost never licenses "X applies to all the cases I need"; read the
  mechanism's shape, not its headline.
- **A cure derived from a specification's compliant EXAMPLE is a
  hypothesis until the specification's NORMATIVE text is read** (worked
  instance 2026-09-01, MCP-655): a client refused an OAuth response for
  an RFC 9207 issuer mismatch; the first cure disclaimed the capability
  flag in the served metadata, with red-then-green tests, minutes from
  commit. Fetching RFC 9207 §2.4 showed the client "MUST extract the
  value of the `iss` parameter … if the parameter is present" and
  compare it regardless of the flag — the disclaim was honest and would
  have fixed no user, and the planned falsifier (deploy and try) would
  have cost a release cycle to learn what one fetch taught. Read the
  MUST/SHOULD text of the clause the cure relies on before the cure is
  built.

## Related Surfaces

- [`read-before-asking.md`](read-before-asking.md) — sibling discipline
  for project-internal shapes.
- [`plan-body-first-principles-check.md`](plan-body-first-principles-check.md)
  — the vendor-literal clause that permits deferral only inside the
  consuming WS.
- [PDR-018](../practice-core/decision-records/PDR-018-planning-discipline.md)
  §"DECISION-COMPLETE is the readiness gate (2026-05-14 amendment)" —
  the parent planning-discipline doctrine that this rule operationalises.
