---
pdr_kind: governance
---

# PDR-033: Vendor-Doc Review for Unknown Unknowns in Third-Party Platform Plans

**Status**: Accepted
**Date**: 2026-04-26
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(governance vs engineering vs general-pattern routing — vendor-doc
review is governance about how plans are reviewed, not an engineering
pattern);
[PDR-012](PDR-012-review-findings-routing-discipline.md)
(review-findings routing — vendor-doc review produces findings that
follow the same routing discipline);
[PDR-015](PDR-015-reviewer-authority-and-dispatch.md)
(reviewer authority and dispatch — vendor-specialist reviewers are
the sub-agent that performs vendor-doc review and applies its findings
under PDR-015's authority);
[PDR-018](PDR-018-planning-discipline.md)
(planning discipline — plan revision after vendor-doc review is a
planning act, not a code act);
[PDR-031](PDR-031-build-vs-buy-attestation.md)
(build-vs-buy attestation — vendor-doc review is the natural input
to attestation when the vendor's first-party offering is being
evaluated).

## Context

Plans that target a third-party platform (Sentry, Clerk, Vercel,
Elasticsearch, OpenAI / Anthropic, Linear, GitHub, Stripe, Algolia,
the next-vendor-in-line) describe how to integrate with the platform
and which capabilities to use. Plans are written from the authors'
internal knowledge of what the platform offers; review of the plan
checks reasoning *inside the plan's worldview*.

This is structurally insufficient on the cross-section of (plan
authored from internal knowledge) ∩ (third-party platform). Two
distinct failure modes have been observed:

**Failure mode 1 — capability gaps.** The plan is internally
coherent but does not capture vendor capabilities the authors did
not know about. Internal review cannot find these: reviewers operate
inside the same worldview the plan was authored in, so capabilities
absent from the plan are absent from the review surface too.

*Empirical instance (2026-04-26 morning, Sentry on
oak-open-curriculum-ecosystem)*: a 3499-line maximisation plan,
multi-reviewer-cycled, was scanned against Sentry's official
documentation in a single doc-traversal session. Six material
capabilities the plan did not capture surfaced (custom error
fingerprinting, ignoreErrors / denyUrls SDK-side allow-list, flush /
shutdownTimeout review under Lambda freeze cycle, cron monitoring,
Performance Issue auto-detection, Spotlight dev-mode sidecar). The
plan's review cycles caught real reasoning errors but were
structurally blind to the missing-capabilities class.

**Failure mode 2 — contract violations.** The plan correctly
captures a vendor capability and proposes an implementation that
*violates the vendor's documented contract*. Internal reviewers
check shape and discipline (is the test well-formed? is the type
well-designed?) but cannot detect a vendor-contract violation from
inside the codebase — they read for code quality, not vendor-doc
conformance.

*Empirical instance (2026-04-26 afternoon, Sentry fingerprinting
on the same repo)*: an implementation drafted
`event.fingerprint = ['<class-name>']` for known error families.
`code-reviewer` and `test-reviewer` both passed the shape with
NIT/MINOR findings; both implicitly accepted the single-element
form. `sentry-reviewer` flagged a MAJOR by reading Sentry's
official fingerprinting docs: a single-element fingerprint is a
**full override** that collapses every event of the class into one
issue, losing stack-aware discrimination within the family. The
canonical Sentry shape is the **hybrid** form
`['{{ default }}', '<class-name>']`. The contract violation was
invisible to in-house reviewers and visible only to the
vendor-specialist reviewer.

Both failure modes share one structural property: **only a reviewer
that grounds against the vendor's official documentation can detect
them**. The class of finding is "vendor-doc conformance"; the
class of reviewer is "vendor specialist".

## Decision

**Plans that target a third-party platform MUST schedule a vendor-doc
review pass before declaring the plan ready, AND substantive
implementation choices that interact with the vendor's API contract
MUST schedule the matching vendor-specialist reviewer.**

Two distinct review acts:

### Vendor-doc review at plan time

The vendor-doc review is a single doc-traversal session asking:
*"What capabilities does this vendor offer that this plan does not
reference?"*

Two outputs land in the plan:

1. **Capability gap list** — items the plan should add. Either added
   to the plan body as new items, or added to a follow-up plan with
   a named promotion trigger.
2. **Informed-decline list** — capabilities the vendor offers that
   this project deliberately won't use, with rationale. The decline
   list prevents future readers from re-discovering and
   re-evaluating the same surface area.

The review fires:

- At plan authorship time (every new plan targeting a third-party
  platform).
- Periodically thereafter (every major plan revision; opportunistically
  during related work).
- After vendor releases that materially change the platform's
  capability set.

### Vendor-specialist reviewer at implementation time

For substantive implementation choices that interact with the
vendor's API contract — error reporting shape, authentication flow
shape, payload format, callback contract, schema choice, query
shape, retry policy — the matching vendor-specialist reviewer MUST
be deliberately scheduled. Vendor-specialist reviewers ground
against the official documentation; in-house reviewers (code,
test, type, architecture) check shape and discipline but cannot
detect a vendor-contract violation from inside the codebase.

Existing vendor-specialist reviewers in this Practice include
`sentry-reviewer`, `clerk-reviewer`, `elasticsearch-reviewer`,
`vercel:*`, `mcp-reviewer`. New vendor-specialist reviewers are
authored as new ones become needed.

The two review acts compose: vendor-doc review at plan time finds
the capabilities to use; vendor-specialist review at implementation
time validates the use against the contract. Skipping either leaves
a structural gap.

## Consequences

### Positive

- Capability gaps and contract violations are caught structurally
  rather than by chance. Both failure modes that motivated this PDR
  would have been caught earlier had this discipline been in place.
- The decline list captures *why* a capability was not used, so
  future agents do not re-discover it as a fresh question.
- Vendor-specialist reviewers gain a clear remit ("you check
  vendor-doc conformance; the in-house reviewers check the rest").
- Plans targeting third-party platforms become more honest about
  the surface area they are choosing from.

### Negative

- Adds a review pass to every plan that targets a third-party
  platform. The cost is one doc-traversal session at plan time and
  one vendor-specialist reviewer dispatch at substantive
  implementation time.
- Authors who write internal-knowledge plans must remember to
  schedule the vendor-doc review even when they feel they "know
  the platform". The discipline is a checklist item, not an
  intuition.

### Neutral

- The vendor-specialist reviewer roster grows organically as new
  vendors are integrated. No central registry needed beyond what
  the Practice already maintains for sub-agents.

## Adopter Scope

**Genotype** (per PDR-019). This PDR applies across every Practice-
bearing repo that integrates with third-party platforms. The
specific vendor-specialist reviewers and the doc URLs vary per repo;
the discipline of "vendor-doc review at plan time + vendor-specialist
review at implementation time" is invariant.

## Notes

- First named in `.agent/memory/active/napkin.md` (2026-04-26 entries
  by Sharded Stroustrup and Frolicking Toast). The pattern instance
  in `.agent/memory/active/patterns/vendor-doc-review-for-unknown-
  unknowns.md` cites this PDR.
- The two empirical instances both occurred on the same vendor
  (Sentry) and the same repo on the same day. The graduation
  argument is that the *failure mode* is platform-agnostic even
  though the instances clustered: any plan targeting any third-
  party platform is structurally vulnerable to the same gap. A
  cross-platform second instance is not required for graduation
  because the structural argument does not depend on platform
  variety.
- The discipline of dispatching the vendor-specialist reviewer at
  implementation time is amplified by PDR-015's parallel-dispatch
  amendment (2026-04-26 amendment). Vendor specialists are
  routinely dispatched in parallel with `code-reviewer` /
  `test-reviewer`, not sequentially.
