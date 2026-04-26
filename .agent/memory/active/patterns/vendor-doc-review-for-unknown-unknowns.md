---
related_pdr: PDR-033
name: Vendor-Doc Review for Unknown Unknowns
use_this_when: >-
  Authoring or reviewing a plan that targets a third-party platform,
  or reviewing substantive implementation choices that interact with
  a vendor's API contract.
category: process
proven_in: .agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md
proven_date: 2026-04-26
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Plans authored from internal knowledge silently miss vendor capabilities (capability gaps) AND ship implementations that violate vendor-documented contracts (contract violations) — both invisible to in-house reviewers operating inside the same worldview."
  stable: true
---

## Principle

Plans targeting a third-party platform are blind to two distinct
classes of error that only vendor-doc-grounded review can find:
capability gaps (what the vendor offers that the plan didn't capture)
and contract violations (what the plan proposes that the vendor's
docs forbid). Schedule both review acts deliberately:
**vendor-doc review at plan time** and **vendor-specialist reviewer
dispatch at substantive implementation time**.

This pattern is the engineering instance of [PDR-033](../../../practice-core/decision-records/PDR-033-vendor-doc-review-for-unknown-unknowns.md).
The PDR carries the cross-repo doctrine; this file carries the
in-repo proof and operational mechanics.

## Pattern

### At plan time — vendor-doc review

1. **Schedule a doc-traversal session** asking *"What capabilities
   does this vendor offer that this plan does not reference?"*
   Cheap relative to the cost of a missed capability. One pass per
   plan authorship is enough.
2. **Produce two outputs**:
   - **Capability gap list** — items the plan should add. Either
     fold into the plan body or route to a follow-up plan with a
     named promotion trigger.
   - **Informed-decline list** — capabilities the project
     deliberately won't use, with rationale. Prevents future
     readers from re-discovering the same surface area as if it
     were unexplored.
3. **Re-run periodically**: after major plan revisions, after
   vendor releases that materially change the platform's
   capability set, opportunistically during related work.

### At implementation time — vendor-specialist reviewer dispatch

1. **For substantive implementation choices that interact with the
   vendor's API contract** (error reporting shape, authentication
   flow shape, payload format, callback contract, schema choice,
   query shape, retry policy), dispatch the matching
   vendor-specialist reviewer alongside the in-house reviewers.
2. **Vendor-specialist reviewers ground against the official
   documentation**; in-house reviewers (`code-reviewer`,
   `test-reviewer`, `type-reviewer`, `architecture-reviewer-*`)
   check shape and discipline but cannot detect a vendor-contract
   violation from inside the codebase.
3. **Routine, not exceptional**: the dispatch is a default member
   of the parallel-review set per PDR-015's 2026-04-26 amendment,
   not a special escalation.

## Anti-pattern

- Treating "I know this platform" as a substitute for the
  doc-traversal session. The very point of vendor-doc review is to
  surface what the author did not know to write down. Internal
  confidence is structurally insufficient.
- Treating in-house reviewers as adequate for vendor-contract
  questions. Code-reviewer + test-reviewer can pass a contract
  violation with NIT/MINOR findings while the implementation
  collapses every event of a class into one Sentry issue (the
  empirical case below).
- Skipping the informed-decline list. Without it, future agents
  re-discover the same vendor capabilities and either re-evaluate
  them from scratch or quietly add them without the original
  decline rationale.

## Why fitness signals fired

Two empirical instances on Sentry on the same repo on 2026-04-26:

1. **Capability gap (morning)**. Sharded Stroustrup ran a
   doc-traversal session against Sentry's official docs after the
   3499-line maximisation plan had already been multi-reviewer-
   cycled. Six material capabilities the plan did not capture
   surfaced (custom error fingerprinting, ignoreErrors / denyUrls
   SDK-side allow-list, flush / shutdownTimeout review under Lambda
   freeze cycle, cron monitoring, Performance Issue auto-detection,
   Spotlight dev-mode sidecar). Captured in
   `.agent/memory/active/napkin.md` 2026-04-26 entry.

2. **Contract violation (afternoon)**. Frolicking Toast drafted
   `event.fingerprint = ['<class-name>']` for known error families
   while implementing the Tier 2 fingerprinting sub-item.
   `code-reviewer` and `test-reviewer` both passed the shape with
   NIT/MINOR findings. `sentry-reviewer` flagged a MAJOR by reading
   Sentry's [official fingerprinting docs](https://docs.sentry.io/platforms/javascript/guides/node/usage/sdk-fingerprinting/):
   single-element fingerprint is a full override; the canonical
   shape is the hybrid form `['{{ default }}', '<class-name>']`
   which preserves stack-aware default grouping. Absorbed in
   commit `6c65e75d`.

The two failure modes share one structural property: in-house
reviewers operating inside the codebase's worldview cannot detect
either. The class of finding is "vendor-doc conformance"; the class
of reviewer is "vendor specialist".

## Cross-references

- [PDR-033](../../../practice-core/decision-records/PDR-033-vendor-doc-review-for-unknown-unknowns.md)
  — general cross-repo doctrine.
- [PDR-015](../../../practice-core/decision-records/PDR-015-reviewer-authority-and-dispatch.md)
  2026-04-26 amendment — parallel reviewer dispatch makes
  vendor-specialist reviewers a routine member of the dispatch
  set when vendors are involved.
- `.agent/memory/active/napkin.md` 2026-04-26 entries — original
  evidence captures.
- Vendor-specialist reviewers currently in this Practice:
  `sentry-reviewer`, `clerk-reviewer`, `elasticsearch-reviewer`,
  `vercel:*`, `mcp-reviewer`. New vendor specialists are authored
  as new vendors are integrated.
