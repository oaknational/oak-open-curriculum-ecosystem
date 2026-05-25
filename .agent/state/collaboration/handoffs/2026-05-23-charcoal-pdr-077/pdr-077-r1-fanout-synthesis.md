---
agent_name: Charcoal Brazing Kiln
session_id_prefix: 7c7327
platform: claude
model: claude-opus-4-7
captured_by_agent_name: Charcoal Brazing Kiln
captured_by_session_id_prefix: 7c7327
captured_by_platform: claude
captured_by_model: claude-opus-4-7
captured_at: 2026-05-24T21:30:00Z
capture_class: substrate-from-tmp-to-durable-repo
preservation: byte-for-byte (source body between lint-disable markers)
intended_consumer: post-m1-attestation-tidy-up cycle 5 (PDR-077 final author)
created_at: 2026-05-23T17:20:00Z
last_updated_at: 2026-05-24T21:30:00Z
topic: pdr-077-r1-fanout-synthesis
capture_origin_path: /tmp/charcoal-pdr077-fanout-synthesis.md
role_in_lane: r1-reviewer-fanout-synthesis
---

<!-- markdownlint-disable -->

Seaworthy — PDR-077 fan-out reviewer-synthesis (3-way parallel per owner direction "fan out subagents"). Three subagents returned in ~5-10 min. Substantive findings requiring Director-class decisions.

## Subagent transcript ids

| Reviewer | Transcript id | Headline verdict |
|---|---|---|
| architecture-expert-wilma | `a1616d669a34f050e` | **UNSAFE-WITH-CONDITIONS** — 5 UNSAFE findings + 5 SAFE-WITH-CONDITIONS + 6 named cures |
| architecture-expert-betty | `a316c77bdc63bb954` | **OVER-COUPLED (latent)** — highest-priority finding is unaddressed claim-state ownership gap |
| assumptions-expert (re-engagement) | `a03a249ce695976f7` | **ABSORBED WITH RESIDUAL GAPS** — 2 of 5 confounds missing; self-referential ratification risk NOT absorbed |

The fan-out caught what a single sequential reviewer would have missed. All three reviewers independently surfaced gaps the prior docs-adr-expert completeness check did not catch.

## Critical findings requiring Director call

### Finding 1 (assumptions-expert Q6 — SELF-REFERENTIAL RATIFICATION RISK; MOST MATERIAL GAP)

> "The doctrine is being landed by a marshal cycle whose throughput is itself a worked instance of the claim. §Required Companion Edits lands five reciprocal-reference additions inside the very first marshal-cycle that uses this doctrine — and the speed of that landing is implicit evidence for the doctrine. The draft does not name this anywhere."

**Recommended cure**: add §Open Question 11 explicitly naming the risk + bar PDR-077's own authoring session from counting toward multi-session validation. The first independent-session test must be a session distinct from the authoring session with a marshal who did not participate in authoring.

**Director call**: ratify the cure shape or propose alternative.

### Finding 2 (Betty's HIGHEST-PRIORITY GAP — Director-Marshal claim-state ownership)

> "Claim lifecycle spans both authority windows. The PDR does not specify who owns claim-state mutations other than at the close step. If the Director's routing decisions change a claim's scope mid-flight (a natural event), the Marshal's claim-verify step is validating against a moving target. The question 'whose claim state is canonical at claim-verify time' is unanswered."

**Recommended cure**: add a stated invariant — "claim scope is frozen at marshal-request time; Director scope-extensions after request-surfacing require a new marshal-request cycle" — OR add explicit §Open Question naming the gap.

**Director call**: which shape — invariant-now or open-question-with-cure-pending? The invariant is structurally cleaner if defensible.

### Finding 3 (assumptions-expert sub-item 2 — HUSKY=0 PRIOR UNBLOCK MISSING)

The five confounds the RE-SHAPE-NEEDED verdict named were absorbed for 4 of 5; HUSKY=0 owner-direct unblock is **MISSING anywhere in the draft**. Substantive gap — this confound materially shaped the gate-chain the marshal cycles ran against; omitting it breaks the falsifiability anchor.

**Recommended cure**: add HUSKY=0 prior unblock to §Open Questions as a numbered concern AND to §Trigger to Graduate as a falsifiability clause (e.g., clause d: "no other simultaneous owner-direct gate-chain unblocks").

**Director call**: ratify the addition; trivial scope (1-2 sentences in 2 sections).

### Finding 4 (assumptions-expert + Betty — parallel Director substrate-writing framed as composing cure, not confound)

§Rationale names PDR-075 as a "composing cure" (positive framing — these add up). assumptions-expert and Betty both flag this needs a complementary confound framing (negative framing — we cannot separate their contributions in this evidence). 

**Recommended cure**: extend §Rationale to acknowledge "these composing cures are also confounds for causal-attribution analysis until cross-session evidence isolates them" + add §Trigger clause requiring substrate-writing-already-established baseline (not first-firing).

### Finding 5 (Wilma — 5 UNSAFE findings on cycle-protocol stress)

Wilma surfaced 5 UNSAFE findings + 6 cure recommendations. Material ones:

- **Marshal-orphaned-claims auto-rebalance protocol** (Open Q3) MUST be designed BEFORE first rotating-cast session per Wilma's gradient. Currently unresolved.
- **Routing-default vacuum when no marshal seated** (Open Q2) — currently the §Forbidden clause prohibits Director self-marshal but no fallback exists; tree freezes pending marshal arrival.
- **Gate-singleton structural enforcement** (Open Q4) — Wilma says MUST move to structural by second rotating-cast session or doctrine is unfit.
- **Cycle-protocol couples to Director substrate-writing cadence** (NEW finding, not in current Open Questions) — implicit sequencing requirement (Director writes ratification → marshal reads → marshal commits) creates hidden coupling.
- **Marshal mid-cycle retirement MUST explicitly invoke PDR-063 five-step protocol**, not just cite it. Currently §Intersection cites; not invokes.

**Director call**: most of these are already named in §Open Questions. Wilma's escalation is "these MUST land before X" rather than "name them and graduate later". The doctrine-acceptance gate is the relevant question — do we land Candidate with Open Questions, or hold Candidate until structural cures land?

### Finding 6 (Betty — ADR-185 reciprocal reference structural concern)

> "ADR-185 §verification is named as the verifier-of-record for cycle-landing. If ADR-185 is substantially revised before its Accepted landing, this reciprocal reference becomes stale. The preference should be to add the ADR-185 reciprocal reference at ADR-185's Accepted landing rather than at PDR-077's first landing."

**Recommended cure**: defer the ADR-185 reciprocal-reference from §Required Companion Edits; reduce bundle from 5 to 4 reciprocal additions.

**Director call**: ratify defer or keep-bundle-as-5.

## Cures already applied to draft (during this turn)

The substantive portability concern from docs-adr-expert's first pass — "husky" → generalised "pre-commit gate-chain" — has been edited in the /tmp draft. Three Edits applied:

1. §Cycle Protocol step 4: "Husky gate-chain" → "Pre-commit gate-chain"; "via `--no-verify`" removed (portability)
2. §Consequences Required: "full husky gate-chain" → "the full host pre-commit gate-chain"
3. §Consequences Forbidden: "husky gate-chain via `--no-verify`" → "the pre-commit gate-chain"

## Verdict-recommendation

**Defer landing until critical findings absorbed.** The 3-reviewer fan-out caught material gaps the sequential single-reviewer pass would have missed. Specifically:

- **MUST absorb before landing**: Finding 1 (self-referential risk), Finding 3 (HUSKY=0), Finding 6 (ADR-185 deferral)
- **SHOULD absorb before landing**: Finding 2 (claim-state ownership invariant or explicit gap), Finding 4 (confound framing)
- **CAN defer with explicit timeline**: Finding 5 Wilma's UNSAFE cures — name them in §Open Questions with structural-cure-required-by-N-sessions as the trigger

If you ratify the "must absorb" set, I iterate the draft ~10-15 min wall-clock, surface revised draft for care-and-consult, then marshal-request to Mistbound for Cycle #4 (or later, if pre-Twilit-ST-Moment-2 routing changes the queue).

If you ratify the broader set, the iteration is ~20-30 min.

## Lane disposition

- **PDR-077 authoring**: HOLDING for your verdict on which findings to absorb
- **Heartbeat**: continuing on cadence
- **Adversarial fan-out on Cycle #1**: COMPLETE (synthesis at `0088f8ad`); awaiting your routing on those 5 findings

Note also: Cycle #1 (`43e09287`) has my adversarial findings open; Cycle #2 pattern v2 has reportedly landed at `8a99ed35` per Foreman observation; Cycle #3 hygiene at `499d163b`. The marshal queue has moved fast during this fan-out. Standing by.

— Charcoal Brazing Kiln / claude / claude-opus-4-7 / 7c7327 (WS-6 PDR-077 fan-out absorbed; awaiting Director routing on iteration scope)

<!-- markdownlint-enable -->
