---
lineage:
  serves_thread: agentic-engineering-enhancements
  serves_stream: continuity-memory-and-knowledge-flow
  strategic_choice: agent-as-thinker capabilities are Practice substance (PDR-035)
  derives_from: .agent/practice-core/decision-records/PDR-122-agentic-judgment-pipelines.md
todos:
  - id: graduate-discovered-buffer
    content: "Drain the distilled buffer (the v2 corpus-analysis discoveries) to durable homes via consolidate-until-done — the shared conservation machinery, NOT a bespoke graduation step (PDR-122: the pipeline is a FEEDER into PDR-014 capture->distil->graduate->enforce). Drive from the pre-staged disposition ledger below; the run VERIFIES each disposition first-hand (the triage is a starting hypothesis, not the authority). Every buffer item ends with a recorded decision. The distilled buffer ends empty or owner-decision-gated."
    status: completed
  - id: author-conserve-by-default-rule
    content: "Author the always-applied firing rule agentic-judgment-conserve-by-default (operationalises PDR-122 invariant 2; PDR-122 Consequences names it). ONE commit lands the canonical rule + THREE platform forwarders + the index entry: .agent/rules/agentic-judgment-conserve-by-default.md (canonical body, opening with a one-paragraph gist AND an explicit sentence justifying always-on over trigger-loaded — the irreversible-discard harm class), .claude/rules/...md (forwarder), .cursor/rules/...mdc (alwaysApply frontmatter + pointer), .agents/rules/...md (one-line forwarder), and the RULES_INDEX.md entry (carrying the same always-on rationale). Verify the live adapter-tier count and exact index format first-hand against an exemplar (verify-dont-trust has all four tiers — .agent/.claude/.cursor/.agents) before authoring; reconcile the index's own three-vs-four-on-disk-forms wording while there."
    status: completed
  - id: promote-tooling-to-skill-and-scripts
    content: "Promote the conserved corpus-analysis tooling to a repeatable capability: the oak-corpus-analysis skill (drives one run end-to-end: cost gate -> launch Workflow -> aggregation driver -> graduate-or-decide -> hand kept candidates to consolidate-until-done) + agent-tools scripts (corpus-analysis-aggregate, corpus-analysis-cost-gate, corpus-analysis-partition) built as tested library code with thin bin entries. TOUCHES THE AGENT-TOOLS SUBSTRATE: the CLI invocation model (tsx-on-source vs built-dist) is a CROSS-LANE decision DEFERRED to the agent-tools-architecture-standard WS0 — do NOT pre-commit it here; build the driver ADR-178-neutral and document an interim invocation matching the nearest settled precedent. The skill carries the harness-Workflow operational footguns."
    status: pending
    depends_on: [author-conserve-by-default-rule]
  - id: sweep-discoverability-surfaces
    content: "Presence is not discoverability (C45): sweep the current/README index (this plan + the v3 plan), the agentic-engineering-enhancements thread record, and link the reference hub (agentic-corpus-discoverability-and-deep-dive-hub) so the graduated patterns, the new rule, and the skill are reachable from fresh-agent navigation."
    status: pending
    depends_on: [graduate-discovered-buffer, author-conserve-by-default-rule, promote-tooling-to-skill-and-scripts]
---

# Corpus-analysis conservation — graduate the discoveries, fire the doctrine, make the tooling repeatable

> **STATUS: WS-A + WS-B LANDED (2026-07-02 dedicated consolidation, Rosemary stirs Bracken); WS-C
> (tooling promotion) + WS-D (discoverability sweep) remain.** WS-A executed via
> `consolidate-until-done`: all 13 dispositions re-verified first-hand — 4 already-covered
> confirmed; 4 amendments landed (the watcher rule's silent-failure class, the vendor rule's
> mental-model-drift clause, `harness-shell-and-commit-edge-cases`, the reframing pattern's
> mid-execution-reshape section); 5 new patterns landed and indexed; the Workflow footguns homed in
> `bounded-structured-output-for-workflows`; the Decision-Lenses worked example homed in
> `precedence-is-not-approval`. WS-B landed the rule + three forwarders + the always-on RULES_INDEX
> row + the four-forms index wording fix.
>
> Prior banner: REVIEWED — READY FOR EXECUTION (2026-06-30, Linnet binds Leeward).
> `assumptions-expert` + `docs-adr-expert`: READY-WITH-AMENDMENTS, all integrated (ledger-discipline
> citation corrected from ADR-117; honest 13+2 denominator; `.agents/` fourth adapter tier added to
> WS-B; always-on rationale carried into the rule body; WS-C ship-now-on-interim clarified;
> new-pattern cross-links). All four "already-covered" verdicts confirmed first-hand by two
> independent passes. Deliverable 2 of the v3 + conservation session. Decoupled from and
> parallel-safe with the v3 rerun: the v2 discoveries are valid now; v3 adds *finer* mechanisms, it
> does not invalidate the broad patterns. Recommending conservation wait for v3 would be a false
> dependency.

The explicit impact of this thread is **the curation, conservation, discoverability and utility of
understanding** — homed knowledge (PDRs/ADRs/rules/skills/guidance), repeatable not heroic. Filing
information away is not enough; a lesson that sits in a buffer does not fire when the next agent
needs it. The v2 large-corpus-analysis run was a discovery FEEDER
([PDR-122](../../../practice-core/decision-records/PDR-122-agentic-judgment-pipelines.md)); this
plan drains what it surfaced into durable homes, fires the doctrine the run established, and turns
the heroic one-off tooling into a repeatable capability.

## End goal

The v2 discoveries live where they fire: every discovered pattern homed or recorded as
already-covered; PDR-122 invariant 2 operationalised as an always-applied rule that fires when any
agent designs a fan-out → judge → aggregate pipeline; and the corpus-analysis tooling promoted to a
skill + tested agent-tools scripts so the v3 rerun (and any future corpus analysis) is repeatable,
not reconstructed by hand. The distilled buffer ends empty or owner-decision-gated.

## Mechanism

Conservation is a shared machine, not a per-feeder bespoke step (PDR-122). Three moves deliver the
impact: (WS-A) run the existing `consolidate-until-done` machinery over the buffer, pre-staged with
a verified disposition ledger so it is fast and correct; (WS-B) author the firing rule so the
conserve-by-default invariant *fires at design time*, not just sits in a PDR; (WS-C) promote the
tooling so the FEEDER itself is repeatable — closing the loop, since a future run of the
`oak-corpus-analysis` skill feeds back into `consolidate-until-done` (WS-A's machine).

## Means — the disposition ledger (WS-A)

"Apply all of X" is thoroughness as *every item recorded*, not every item a separate execution
cycle — the disposition-ledger discipline for "apply all of X" inputs (the plan architecture,
oak-plan), sized to unique substance. The 13 un-homed candidates were triaged first-hand against the
durable-home corpus this session (the v2 meta stage's absence-of-claim is a weak signal —
frequently a false negative). The `consolidate-until-done` run **re-verifies each disposition
first-hand**; this ledger is the starting hypothesis and the proof nothing is dropped. Counts are
derivation-anchored to 2026-06-30; re-derive at execution.

| Candidate | Disposition | Home | Action |
| --- | --- | --- | --- |
| C20 TDD-atomic-breached-by-rush | already-covered | `tdd-as-design.md` / PDR-087 / `no-skipped-tests.md` / PDR-043 / `principles.md` | record; no new home |
| C24 build-artefacts-as-codegen-DI | already-covered | ADR-156 / ADR-031 / ADR-043 / `schema-first-execution.md` | record; no new home |
| C35 data-is-the-source-of-truth | already-covered | `verify-data-supports-shape-before-building.md` | record; no new home |
| C38 context-depth-confabulation | already-covered | PDR-063 / `verify-dont-trust.md` | record; no new home |
| C15 comms-infra-silent-failures | partially-covered | `comms-all-channels-watcher.md` | amend: add a named silent-failure-class section + the un-homed "events land in a retired directory" sub-mode |
| C21 vendor/SDK-mental-model | partially-covered | `verify-vendor-call-shapes-at-plan-author-time.md` | amend: add the agent-mental-model-drift case (training-time knowledge ≠ live docs) |
| C30 shell/markdown footguns | partially-covered | `harness-shell-and-commit-edge-cases.md` | amend: add zsh backtick command-substitution + `rg -r` vs `-n` misuse |
| C47 reshape-needs-full-sweep | partially-covered | `delivering-a-reframing-is-a-consumer-walk.md` | amend: add the mid-execution plan-reshape trigger + cross-file-type (.ts/.mjs/.json/indexes) propagation obligation |
| C22 static-analysers-need-shape-changes | new-pattern | `patterns/static-analyser-shape-vs-runtime-and-staleness.md` | new: static-shape-fix-vs-runtime-defence + stale-snapshot push-and-re-analyse + knip root-entry edge |
| C23 turbo/cache-false-green | new-pattern | `patterns/turbo-cache-false-green.md` | new: cached gate replay, remote cache poisoning, cached `format:root` diverging from the hook; cure = `--force` / authoritative hook |
| C33 process-with-no-committed-assets | new-pattern | `patterns/process-with-no-committed-assets.md` | new: graduate the 1/3 watchlist seed (commit-invisible meta-activity; the write-more-doctrine meta-trap) |
| C41 FRAME-1 dogfooding self-similarity | new-pattern | `patterns/live-dogfooding-as-directional-confirmation.md` | new: the interpretive move — live friction against the gap you are building for is confirmation, not noise |
| C49 schedule-not-scope-reduction | new-pattern (novel) | `patterns/conditional-trigger-framing-stalls-plans.md` | new: concrete sequence positions + full interface day one; conditional-trigger framing stalls |

Also drained in the same run (recorded in the ledger):

- **Harness-Workflow operational footguns** (args-arrives-as-a-JSON-string; `.output` wraps the
  return under `.result`; `node --check` false-positives top-level `return`; ~50k tokens/voter at
  high effort; seeded-continuation > blind resume). The corpus-specific ones home in the
  `oak-corpus-analysis` skill (WS-C); the harness-general ones (args/`.result`/`node --check`) home
  in a short harness-Workflow gotchas note for any workflow author. Triage in the run.
- **The Decision-Lenses worked example** (this session's matrix overturned + refined + pruned a
  reviewed-and-committed design). Reinforces existing doctrine (Decision Lenses, no-cheap-cure,
  precedence-is-not-approval, FRAME-1); home as a worked example on the Decision-Lenses surface or a
  short pattern. Triage in the run.

**Auditable denominator:** 13 triaged candidates (4 already-covered → no-action; 9 substance → 4
amendments + 5 new patterns) **plus** 2 buffer items triaged in the run (the Workflow footguns; the
Decision-Lenses worked example) = the full distilled buffer. "Buffer ends empty or owner-gated" is
measured against this set.

**Cross-link, don't merge.** Two new patterns sit beside existing neighbours and must add a sibling
cross-link rather than duplicate or merge (stable-index discipline): `turbo-cache-false-green` ↔
`wrapped-exit-codes-false-green` (distinct: cache-replay vs wrapper-exit) and
`static-analyser-shape-vs-runtime-and-staleness` ↔ `static-analysis-registration-with-scaffold`
(distinct: shape-fix-vs-runtime-defence vs registration). They are additive siblings.

## Means — the firing rule (WS-B) and the tooling promotion (WS-C)

WS-B authors `agentic-judgment-conserve-by-default` (always-applied, per PDR-122 §Consequences):
LLM emits only atomic per-item judgments; deterministic code does all counts/thresholds/routes; no
irreversible discard on a single voter (diverse-lens quorum required); conserve by default. Body
kept tight (directive-file-context-budget); opens with a one-paragraph gist; composition links
PDR-122, `strict-validation-at-boundary`, `verify-dont-trust`,
`knowledge-preservation-over-fitness-warnings`, `permanent-doc-is-the-consolidation-record`. The
canonical rule + three platform forwarders (`.claude`, `.cursor`, `.agents`) + the RULES_INDEX entry
land in one commit (the authoring contract), with the always-on-over-trigger-loaded rationale (the
irreversible-discard harm class) carried in the rule body and the index entry, not only here.

WS-C promotes the tooling. The deterministic aggregation driver, cost-gate, and partition deriver
are built as **tested library code** (the module's public surface — `parseVoterOutcome`,
`recallReport`, `meetsGraduateGate`, `checkMapCoverage`, `corroborateAgainstHomes`, `adjudicate` —
already exists; these are thin typed wrappers). The `oak-corpus-analysis` skill drives one run end
to end and hands kept candidates to `consolidate-until-done`. **The CLI invocation model is
deferred**: see the cross-lane note below.

## Acceptance criteria

- **WS-A**: every distilled-buffer item carries a recorded disposition; the 5 new patterns and 4
  amendments land and are verified first-hand against the actual mechanism; the 4 already-covered
  verdicts are confirmed by reading the cited home (not trusted); the distilled buffer drains to
  empty or owner-decision-gated. Proof: the curator-pass run-record + `git` evidence of the new/
  amended files + a clean `distilled.md`.
- **WS-B**: the rule fires (present in `RULES_INDEX.md`, always-on; `.claude` + `.cursor` adapters
  present; one commit); the body passes the new-rule-vs-pdr-clause test (it operationalises, it does
  not restate PDR-122). Proof: `subagents:check` / `portability:check` green; the RULES_INDEX entry.
- **WS-C**: the three scripts exist with unit tests green; the `oak-corpus-analysis` skill drives a
  run end-to-end and hands off to `consolidate-until-done`; the invocation-model decision is
  recorded as deferred to WS0 with an interim documented. Proof: `agent-tools:test` green;
  `subagents:check`; the skill file + a dry-run note.
- **WS-D (sweep)**: the v3 plan, this plan, the new patterns, the rule, and the skill are reachable
  from the current/README index, the thread record, and the reference hub. Proof: index rows
  present; no orphan per `repo-validators:check`.

## Proof contract

| Acceptance id | Proof level | Command / observation |
| --- | --- | --- |
| graduate-discovered-buffer | non-code | curator-pass run-record; `distilled.md` empty/gated; new+amended files in git |
| author-conserve-by-default-rule | integration | `pnpm subagents:check` + `pnpm portability:check` green; RULES_INDEX entry present |
| promote-tooling (scripts) | unit | `pnpm agent-tools:test` green incl. new bin-script tests |
| promote-tooling (skill) | value-proxy | skill drives a run end-to-end (or documented dry-run) and hands off to consolidate-until-done |
| sweep-discoverability | non-code | index rows present; `pnpm repo-validators:check` reports no orphan |

## Prerequisites

- **WS-C ships NOW on the documented interim invocation — it does NOT wait for WS0.** The
  agent-tools-architecture-standard WS0 keystone fork (tsx-on-source vs built-dist vs hybrid) lives
  in `future/` and is owner-deferred; it determines only the *long-term* CLI invocation model and is
  **not a hard gate**. WS-C builds the tested library driver + thin bin entries + a documented
  interim invocation matching the nearest settled precedent (verified: `skills:check`'s
  `build && node dist/...`), and is brought into conformance at the architecture plan's WS5
  convergence. WS-A and WS-B have no dependency on WS0 at all.
- **Beneficial** — the v3 rerun (separate plan). Conservation does NOT block on it; the v2
  discoveries are the input here.

## Non-goals

- **A bespoke graduation step.** WS-A runs `consolidate-until-done` (the shared machine); building a
  corpus-analysis-specific graduation would re-implement and fragment the conservation engine
  (PDR-122).
- **Settling the agent-tools architecture.** That is WS0's job; WS-C conforms later.
- **Re-deriving or re-running the v2 findings.** They are the input (the corrected findings JSON).
- **Folding the firing rule into PDR-122.** It operationalises the PDR as a per-session behavioural
  rule; folding an operational checklist into a governance PDR crosses the rule/PDR boundary
  (`new-rule-vs-pdr-clause`).

## Risks

| Risk | Mitigation |
| --- | --- |
| A triaged "already-covered" verdict is a false positive → a real lesson silently dropped | The `consolidate-until-done` run re-verifies each disposition first-hand by reading the cited home; the ledger records the home so the check is cheap and auditable (conserve-by-default) |
| The new always-on rule adds context-budget cost for little firing | Body kept tight, opens with a gist; PDR-122 §Consequences already decided always-applied because a missed pipeline design is an irreversible-discard harm; the trigger is precise |
| WS-C picks a CLI invocation model that WS0 later overturns | The model is explicitly deferred; only the ADR-178-neutral library + thin bins are built now; convergence is a named WS5 item in the architecture plan |
| Over-fragmenting the deliverable across collections | The plan homes by dominant purpose (knowledge conservation — would exist without agent-tools); WS-C's agent-tools-substrate surface is flagged in-line for owner routing, not silently mixed |

## Plan-body first-principles check

Per [`plan-body-first-principles-check`](../../../rules/plan-body-first-principles-check.md): the
**shape clause** fires at WS-A — the disposition ledger sizes work to unique substance (9 substance
items, not 13 cycles), and the run must not manufacture homes for the 4 already-covered; the
**landing-path clause** fires at WS-B — all four on-disk rule forms land in one commit, no partial
landing; the **vendor-literal clause** fires at WS-C — the RULES_INDEX format, the `.cursor` `.mdc`
frontmatter, and the agent-tools build/invocation conventions are verified first-hand against
exemplars before authoring, never from memory.

## Readiness reviewers

Before READY FOR EXECUTION: `assumptions-expert` (proportionality of the ledger vs N-cycle inflation;
the deferred-WS0 framing for WS-C); `docs-adr-expert` (the firing rule and the new patterns are
significant doctrine — completeness, new-rule-vs-pdr boundary, drift). A config/architecture lens is
beneficial for WS-C's wiring once WS0 resolves.

## Learning loop

This plan IS a learning-loop execution (it drains the distilled buffer and homes the discoveries).
WS-C closes the loop structurally: the promoted skill is a repeatable FEEDER whose future runs flow
back into `consolidate-until-done`.

## Lifecycle triggers

Per [`lifecycle-triggers`](../../templates/components/lifecycle-triggers.md): WS-A is itself a
consolidation pass (curator-pass run-record); WS-B/WS-C completion sweep the discoverability
surfaces (WS-D); archival of this plan mines any residual into permanent homes per ADR-117.

## Lineage

Serves the `agentic-engineering-enhancements` thread, continuity/memory/knowledge-flow stream.
Derives from PDR-122 (the doctrine this conserves and operationalises) and the corrected findings at
[`.agent/reports/agentic-engineering/large-corpus-analysis-tooling/`](../../../reports/agentic-engineering/large-corpus-analysis-tooling/).
Sibling to [`large-corpus-analysis-v3-extraction-grain.plan.md`](./large-corpus-analysis-v3-extraction-grain.plan.md)
(decoupled — runs in parallel). WS-C carries a cross-lane dependency on
[`../../agent-tooling/future/agent-tools-architecture-standard.plan.md`](../../agent-tooling/future/agent-tools-architecture-standard.plan.md)
(WS0 invocation model) and lands discovery via
[`agentic-corpus-discoverability-and-deep-dive-hub.plan.md`](./agentic-corpus-discoverability-and-deep-dive-hub.plan.md).
