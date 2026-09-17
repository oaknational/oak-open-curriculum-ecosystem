# Vendor-memory graduation audit — 2026-08-05

Owner-directed ("analyse the Claude vendor memory and look for any learning
that is not already present in the repo"). Executed by the Director seat
(Petrel holds Turbulence, a0892f) as a 15-reader schema-forced workflow over
the complete Claude per-user memory corpus for this repository: 362 memory
files (~926 KB), every file read in full, every verdict grounded in repo
searches. Full per-memory verdicts:
[the fleet result JSON](vendor-memory-graduation-audit-2026-08-05-fleet-result.json).

## Headline

| Verdict | Count | Meaning |
| --- | --- | --- |
| present | 280 | substance already in a repo surface (cited per row) |
| partial | 46 | topic present; a named refinement is missing |
| absent | 29 | durable learning with no repo home |
| ephemeral | 5 | session/week-scoped; should not graduate |
| vendor-scoped | 2 | Claude-harness mechanics; platform-notes home |

Graduation value: **27 high**, 41 medium, 15 low, 279 none.

## Critical assessment (first-hand, by the synthesising seat)

- **Absent-verdict reliability: verified.** Four load-bearing "absent/high"
  claims were re-checked first-hand and all four held, including the
  sharpest: `.agent/skills/ticket-management/SKILL-CANONICAL.md:31`
  references a rule `linear-mcp-team-and-project-hygiene` that exists
  nowhere in the estate — a dangling doctrine pointer, a landing gap in the
  repo itself, not merely an unlanded memory.
- **A known bias, quantified.** The audit prompt counted buffer surfaces
  (napkin, operational docs) as repo presence; buffers rotate, so
  buffer-only presence is still a graduation candidate. Only **8 of 280**
  present-verdicts rest solely on buffer citations — reclassify those as
  partial (list in §Buffer-only presents below).
- **Shadow-corpus finding (structural, found before the fleet ran).**
  Only ~127 of the 362 memory files are indexed in `MEMORY.md`; **236 are
  unindexed and therefore never loaded into any session** — two-thirds of
  the vendor memory is already dark. Graduating high-value content into the
  repo matters more than the index gap (repo surfaces are load-bearing for
  every platform, not just Claude), but the index gap explains how absent
  learning accumulated unnoticed.
- **Proportion.** 306 of 362 memories (present + ephemeral + none-value)
  need no action. The actionable surface is the 27 high rows below plus a
  triage pass over the 41 mediums.

## The 27 high-value rows (verbatim from the fleet, spot-verified sample)

| Memory | Verdict | Gap | Suggested home |
| --- | --- | --- | --- |
| `priority-order-bugs-features-research-floor` | absent | The general standing ordering (bugs > features > speculative research, WITH a protected non-zero floor for research so 'improving how we improve' never starves) is not stated anywh | .agent/directives/ (a routing-priority section) or a new .agent/rules/ entry for |
| `probe-the-deployment-before-planning` | absent | The named collective blind spot — that artefact-only grounding (docs/ADRs/code) and artefact-shaped review converge and miss what a 30-second curl against the running system would  | verify-dont-trust.md (add a 'deployed surfaces' clause) or a new rule |
| `director-lens-productive-looking-rabbit-holes` | partial | The five concrete Director detection mechanisms (size-at-routing, size-echo-at-pickup, deliverable-type-check-on-every-report, owner-surprise-test-on-every-card, integral-check-at- | PDR-117 §The Director role, as a new 'detecting drift' subsection |
| `dispositions-need-verified-failure-scenarios` | absent | No rule states the discriminating test proven across the 326-thread corpus: a disposition is grounded only in a VERIFIED concrete inputs→wrong-output scenario (or its verified abse | .agent/rules/pr-comments-resolve-and-recheck.md (tighten the rationale bar) or a |
| `dont-transmit-assumptions-as-truth` | partial | The specific fire-signal vocabulary self-check (writing impossible/never/cannot/always/static/already-handled/nothing-else/only is itself the trigger to run the cheapest falsifying | .agent/rules/verify-dont-trust.md (add the vocabulary tripwire and the real-vs-t |
| `ends-before-means-front-of-chain-first` | partial | The core, sharpest claim — that what/why/why-now must be established in CONVERSATION with the owner before building ANY structure, and that probing artefacts/code/deployments is st | .agent/directives/principles.md (near 'First Question') or metacognition.md |
| `additions-never-subtract-standing-capabilities` | partial | The generalizable behavioural principle (diff every proposal against the capability baseline; owner-declared non-negotiables get a same-day validator) lives only in a rotating oper | .agent/rules/additions-never-subtract-standing-capabilities.md (or a clause on c |
| `adrs-state-should-be-means-live-in-plans` | absent | The entire refinement is missing: (1) ADRs are legitimately allowed to state should-be without means, (2) an audit must find a means-home (ticket/plan) for every not-yet-true shoul | A rule alongside no-moving-targets-in-permanent-docs.md and plan-body-first-prin |
| `all-tickets-mcp-team-only` | absent | The entire substance is missing, and the ticket-management skill has a dangling reference to a rule that was never authored — a genuine landing gap, not just an unlanded memory. | .agent/rules/linear-mcp-team-and-project-hygiene.md (fill the dangling pointer a |
| `bot-identity-always-never-owner-credential-fallback` | partial | The 2026-08-04 standing carve-out — 'I do not have to approve PRs, you can use my identity to do that' (GitHub PR *approvals* only may go under jimCresswell, due to the code-owner  | Add the approval-carve-out clause to .agent/rules/bot-identity-on-third-party-sy |
| `clerk-mcp-read-only-mcp-app-project-only` | absent | The binding access-control ruling (Clerk MCP calls are read-only unless Jim says otherwise; every call scoped to the MCP app project only, never other Clerk projects) is missing fr | A short standalone rule, or a clause on invoke-clerk-expert.md |
| `comms-events-are-ephemeral-not-storage` | absent | The three-tier durability hierarchy (comms = ephemeral transport; PR bodies/plans/tickets = temporary; ONLY permanent docs [ADRs, rules, docs/] = durable) is entirely missing, AND  | permanent-doc-is-the-consolidation-record.md (add the hierarchy clause) + amend/ |
| `corrected-directions-retrue-artifacts-harvest-facts` | partial | The operational two-list sweep this memory adds — every owner correction fires (1) a RESIDUE pass re-truing every stale ticket/plan/queue/record that still encodes the old directio | A clause on no-tombstones-for-removed-ideas.md, or a short standalone rule trigg |
| `ui-design-show-in-chrome` | absent | No rule states the specific standing directive: UI-design work must be shown to the owner rendered in Chrome (via claude-in-chrome tools) at each design iteration worth a look, not | Extend owner-attention-at-action-moments.md with a design-review clause, or add  |
| `worktree-prune-standing-policy` | absent | The standing policy itself (provably-safe = clean AND ancestor-of-origin/main proven per item, then delete without per-item ask, for worktrees AND local branches, plus content-supe | Amend worktree-hygiene.md §6 (or add a new clause) to state the standing prune p |
| `generality-depth-gradient` | partial | The general ARTICULATED philosophy — "the deeper the layer, the more general it must be", investment-bar rising with depth, counter-instances as falsifiers against generality-by-as | .agent/directives/principles.md |
| `idle-waiting-is-resource-waste` | absent | The whole teaching is missing: at every wait boundary, ask whether startable lane work exists; if yes, start it (delegating sweeps to subagents); if genuinely none, ask the Directo | .agent/rules/use-monitor-for-event-driven-wake.md or a new rule composing with l |
| `linear-mcp-team-and-project-hygiene` | absent | The full ruling is missing: mint only in team MCP App Pathfinder, never AI Platform (AIP-); pick the correct project at mint time; the classification test for "ours" (creator + con | a new .agent/rules/linear-mcp-team-and-project-hygiene.md, filling the dangling  |
| `merge-rulings-no-admin-no-direct-merge-arm-allowed` | partial | The critical, later-evolved operational mechanics are missing entirely: the split-ruleset design (checks-only ruleset with no bot bypass vs a second ruleset carrying only the code- | .agent/skills/pr-lifecycle/SKILL-CANONICAL.md merge-mechanics section, replacing |
| `never-invent-public-copy` | absent | No rule states: public copy must assemble from approved existing sources with every factual claim traceable; product naming/policy phrasing/numbers are never coined by the agent; g | new rule (e.g. never-invent-public-copy.md) alongside editorial-tone.md, or a se |
| `no-change-freezes-observability-and-fast-response` | absent | No repo surface states the standing principle: never propose a change/code/merge freeze as risk control (including on launch days); the doctrinal question is instead whether observ | docs/architecture/architectural-decisions/162-observability-first.md (add the fr |
| `no-code-without-first-hand-review` | partial | No rule states the crisp, general standing prohibition in its own terms: code enters the repo ONLY via a reviewed PR, no matter the author's confidence or the smallness of the chan | a new rule (e.g. no-code-without-first-hand-review.md) cross-referenced from coo |
| `open-prs-merged-closed-or-owned` | absent | No permanent-doc home for the standing PR-hygiene drive: zero open PRs (drafts included) as a continuous duty; the only non-terminal state is 'owned by a live lane actively being d | .agent/skills/pr-lifecycle/SKILL-CANONICAL.md or a new rule (e.g. open-prs-merge |
| `owner-channel-answer-first` | absent | No directive states: when an owner message lands mid-turn, the agent's next output is a direct text answer/acknowledgment — first, before any further tool-call chain — never buried | .agent/directives/user-collaboration.md §Working Model |
| `reviewer-dispatch-model-fallback` | absent | the standing dispatch-time rule (on model unavailability, retry once then fall back to a MORE capable model at LOWER effort — never downgrade tier, never stall) is unwritten anywhe | PDR-015 (reviewer-authority-and-dispatch) new amendment, or a new rule beside in |
| `reviewer-subagents-run-on-opus` | absent | the standing owner ruling (every Agent-tool reviewer dispatch passes model:opus explicitly, overriding the agent definition's default) is unwritten | PDR-015 new amendment or a new rule beside invoke-code-experts.md |
| `safety-asks-bind-the-referent-itself` | absent | the rule that a 'make X safe' instruction binds the REFERENT named, in place — a pushed copy/branch/snapshot is a supplement never a discharge, test = 'if this exact path were dele | important-state-not-in-temp-files.md (sibling clause) or a new rule |

## Buffer-only presents (reclassify as partial)

`feedback_evidence_discipline_in_diagnostics`,
`feedback_handoff_under_goal_hook_needs_clear`,
`feedback_director_handover_precedes_own_closeout`,
`feedback_director_routes_live_before_process_work`,
`project_next_lane_agent_operability_plan_consolidation`,
`project_specialist_agent_design_overhaul`,
`falsifiable-structure-at-the-surface-works`,
`colleagues-run-on-trust-never-chased`.

## Disposition (recorded, not executed)

Graduating 27+ items is curation-lane work, not a same-day sweep: each row
needs its named home authored (several are new rules or PDR clauses), and
`new-rule-vs-pdr-clause` discipline applies per item. Recommended routing:
a curator pass at fleet reopening, working this report's high table top-down,
with the dangling `linear-mcp-team-and-project-hygiene` pointer first (it is
a repo defect today). The owner's word gates the start, per the week-off
regime this report was authored under.
