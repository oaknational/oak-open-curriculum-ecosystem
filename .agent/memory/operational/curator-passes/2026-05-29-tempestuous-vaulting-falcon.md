---
fitness_content_role: reference
---

# 2026-05-29 Tempestuous Vaulting Falcon Curation Pass

Mode: owner-ratified execution of the pending-graduations **decision packet** that
[`2026-05-28-sunlit-waxing-moon.md`](2026-05-28-sunlit-waxing-moon.md) left for
ratification. Owner direction 2026-05-29: *"implement your suggestions … this is
about knowledge curation, preserving learning, and making sure that the
documentation, memories, Practice Core, Principles, and all other guiding
surfaces remain useful and impactful."*

Scope this pass: **Group C** (withdrawal candidates) re-verified and executed;
**Group A** (graduations + the `due` reflection item) re-grounded and authored
(home corrections recorded below). Groups B / D / E are surfaced for the owner,
not actioned this pass.

## Load-bearing finding — the recursion of "verify the auditor"

The Sunlit ledger established that its **predecessor** (Leafy's verification
report) was ~50% false-negative, and therefore re-verified before acting. This
pass establishes that the **Sunlit ledger's own Group C "recommend withdraw"
verdicts repeated the same failure mode one level deeper.**

An adversarial re-verification workflow (18 independent agents, refute-biased,
knowledge-preservation default) checked each Group C "covered by X" home against
the live repo. Result:

- **15 of 18** "recommend withdraw" verdicts were **wrong** — the named
  coverage home does **not** contain the item's actual substance. Withdrawing
  would have lost a valid learning signal. Disposition flipped to **keep**.
- **3 of 18** were correct — substance genuinely preserved elsewhere, or thin
  with no signal lost. These were withdrawn this pass (each independently
  re-confirmed by the main agent before removal).

So the ledger's Group C verdicts were ~83% wrong in the withdraw direction. The
**META gate** Sunlit set (do not mass-act; re-verify before any irreversible
withdrawal) was exactly right, and this pass is its discharge. A naive
"drain the buffer" pass would have destroyed 15 signals.

This is itself a graduation-worthy lesson (see Group A note on item 25 /
consolidate-docs trigger refinement, and the distilled candidate below): **a
curation ledger is a claim; a withdraw recommendation is the highest-stakes
claim; re-verify it adversarially before removal, and bias to keep.** It extends
`feedback_validate_specialist_findings_before_acting` and the Sunlit ledger's own
"verify the auditor" note to the recursive case (the auditor of the auditor is
also a claim).

## Method

- Workflow: `group-c-withdrawal-reverification` — 18 Sonnet agents (concurrent-Opus
  quota envelope respected), one per candidate, each instructed to refute the
  "covered by X" claim against the live repo and default to keep if uncertain.
- The 3 withdraw verdicts were independently re-confirmed by the main agent
  (grep/read of the named home) before any register removal — subagent verdicts
  are themselves claims (`validate-findings-before-acting`).
- The 15 keep verdicts require no action (keeping loses nothing); their evidence
  is recorded below so a future curator does not re-litigate.

## Group C — re-verified disposition (all 18)

| # | Item | Re-verified | Action | Where the substance actually lives / why |
| --- | --- | --- | --- | --- |
| 1 | Intent notes as abandonment coordination | not-covered | **KEEP** | Commit skill covers the mechanical abandon-note; the *coordination-infrastructure* signal (notes field as durable peer-readable substrate) is unhomed. Trigger (2nd peer-abandonment) unmet. |
| 5 | Portable reference arrives without plan slot | not-covered | **KEEP** | The *reference* acquired plan homes; the *three-question grounding pattern* did not. Conflation in the withdraw claim. |
| 9 | Owner re-decision on evidence-refuted premise | not-covered | **KEEP** | "Owner Direction Beats Plan" governs agent-vs-plan precedence, not evidence-refutes-premise → re-surface. Distinct, unhomed. |
| 13 | Generated insight artefact decay/honesty | not-covered | **KEEP** | no-moving-targets governs SHAs, not insight-artefact decay-tiers / evidence-vs-interpretation labelling. Unhomed methodology. |
| 14 | Recurrence-rank as graduation weighting | thin-no-signal-lost | **WITHDRAW** | Ten cures preserved in PDR-056 + source report; weighting-mechanism never adopted and second-instance triggers already implement its function. |
| 15 | Owner reply preferences / default reply shape | partial | **KEEP** | user-collaboration covers verification-answer shape only; general "lead with answer" default-reply norm not enumerated anywhere. |
| 17 | Owner affirmation phrase corpus | not-covered | **KEEP** | The course-correct pattern *explicitly excludes* affirmation phrases and points back to this register. |
| 19 | In-flight consolidation workflow-gap patching | not-covered | **KEEP** | PDR-014 (consolidation quality) and PDR-048 (capture-at-moment) do not encode "patch the workflow gap in the session that exposed it". |
| 20 | Fat-baton handoff inline diagnostics | partial | **KEEP** | handoff-messages-self-contained is structural; the concrete tactic (inline the already-run diagnostic so the receiver skips the rerun) is unnamed. |
| 29 | PR-87 pre-phase adversarial security review | partial | **KEEP** | Security substance fully homed (ADR-158 + safety-and-security.md); the *pre-phase-timing* pattern signal is absent from the adversarial-review component. |
| 35 | Skill/doc surface audit follow-ups | not-covered | **KEEP** | Five concrete audit heuristics have no landed home; the gating skills-audit plan is NOT STARTED; source napkin is archived. |
| 45 | directory-survey before plan-stub | not-covered | **KEEP** | consolidate-at-third-consumer governs extraction timing; PDR-045 governs package survey — neither names plan-estate / `future/` survey before stub-spawn. |
| 47 | napkin + `.remember/` wiring | covered | **WITHDRAW** | session-handoff §232-240 + consolidate-docs fully specify `.remember/` handling; PDR-011's "napkin or equivalent" is the portability-correct abstraction — an amendment would violate `practice-core-portability`. |
| 48 | session-handoff entrypoint sweep | partial | **KEEP** | The sweep behaviour exists (skill §6d); the *governance question* (promote to PDR-014?) is open and unrecorded in PDR-014. |
| 49 | operational-seed-per-workstream | not-covered | **KEEP** | Claimed migration "into thread/lane state" never happened; substance lives only in an archived napkin + one plan-specific instantiation. |
| 50 | infrastructure-alive-at-install | partial | **KEEP-WATCH** | PDR-029 has a *self-application requirement* (prescriptive), not the cross-arc *observational pattern*. Trigger (different-lane instance) unmet. |
| 51 | observability validation correction | not-covered | **KEEP** | verify-dont-trust governs trusting-peer-summaries; the 5-step cross-system commit-alignment checklist + Turbo-cache finding live only in an archived napkin. |
| napkin-redundant-config | Owner-authorised redundant config marker | covered | **WITHDRAW** | Fully homed in `sonar-disposition-policy.md` Block 2 (mechanical redundancy + owner-ratified audit-trail purpose + date + expansion discipline). |

**Net: 15 KEEP, 3 WITHDRAW.** Withdrawals executed this pass: 14, 47,
napkin-redundant-config — each with substance confirmed preserved elsewhere
(knowledge-preservation screen passed). All 15 keeps retain their existing
owner-gated trigger; their dispositions in the Sunlit ledger's Group C
("recommend withdraw") are **superseded by the keep verdicts above.**

## Group A — home corrections found during independent re-grounding

The Group A "evidence met" verdicts were re-grounded independently (not trusted
from the ledger, given the Group C finding). Two homes were corrected:

- **#37 (never-bare-"deferred" / sequence-or-admit):** the Sunlit ledger
  recommended extending `no-moving-targets-in-permanent-docs.md`. That is a
  **category error** — that rule governs *transient values in permanent docs*;
  the bare-deferred doctrine governs *unsequenced statuses in ephemeral plans*.
  The correct home is the **PDR-058 optionality family**: PDR-058 §Decision
  already names *"sequencing optionality"* as an anticipated adjacent surface.
  #37 is that surface (the sequencing analogue of outcome-optionality).
- **#22+23 (falsifiable-outcome / no-fantasy-infrastructure):** this is
  PDR-058's **Surface 3 (outcome optionality)** rule sibling, which PDR-058
  explicitly left for its own evidence trail ("possibly merged with
  don't-shoehorn-a-value-claim"). Evidence trail now met (two named instances).
  Not a budget violation — PDR-058 architected this graduation.

Group A authoring status and the two new Practice-Core PDRs (TDD-as-design;
reviewers-carry-doctrine) plus the `due` reflection reframe (PDR-011 / ADR-150 /
session-handoff §6c) are main-agent-drafted for owner sanctity review per the
Sunlit ledger's sanctity classification.

## Distilled candidate (this pass)

**"A withdraw recommendation is the highest-stakes curation claim; re-verify it
adversarially against the live repo before removal, and bias to keep."** Two
recursive instances now (Leafy report ~50% wrong → Sunlit re-verified; Sunlit
Group C ~83% wrong → this pass re-verified). Graduation target: a distilled.md
entry + candidate amendment to the consolidate-docs / curation discipline
(register item 25 names the adjacent "owner-directed drain evaluates on
substance" refinement).
