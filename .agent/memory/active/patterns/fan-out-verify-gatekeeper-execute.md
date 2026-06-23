---
name: "Fan Out the Verify, Gatekeep the Execute"
polarity: pattern
use_this_when: "Structuring a multi-agent or workflow session that mixes verification work with irreversible or coordination-dependent moves (delete, commit, merge, reshaping shared indexes)."
category: agent
related_pdr: PDR-089
proven_in: "Controller session 2026-06-09 (deletion-safety verification); 25-agent adversarial refutation of 18 proposed withdrawals 2026-06-11 (14 refuted)"
proven_date: 2026-06-11
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Serialising cheap verification through one context (losing independent scrutiny) and, worse, fanning out irreversible execution (losing the single accountable first-hand gatekeeper)."
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat: split multi-agent
> work by reversibility — verification fans out, execution stays
> serial and first-hand.

## The shape

The value in a controller / multi-agent session splits cleanly by
**reversibility**:

- **The verification half** — independent reads, conservation checks,
  "is this claim true?" — is fan-out-shaped. A workflow with an
  adversarial-skeptic stage IS the critical-assessment discipline
  mechanised: each finder's claim gets a refuter. Twice-proven for
  withdrawal decisions specifically (2026-05-29 and 2026-06-11: both
  passes refuted ~80% of proposed buffer-item withdrawals resting on
  the same conflations — "the instance has a home" read as "the
  substance has a home"; absence-of-recurrence read as permission to
  drop an unhomed signal). Graduated as PDR-089 Decision 8.
- **The execution half** — irreversible or coordination-dependent
  moves (delete, commit, merge, reshape shared indexes) — is NOT
  fan-out-shaped: it stays serial, gatekeeper-owned, and first-hand,
  because agent/workflow output (even a high-confidence verdict) is
  input-to-verify, never a fact.

The integration cuts both ways and both matter: over-escalated
verdicts get overridden on first-hand re-read (a reviewer's "all
blocked"; a workflow's "deletion-safe"), AND mechanical refuters catch
real instances the first-hand author missed. Fan out the verify, own
the execute, ground the load-bearing claims yourself.
