---
name: restatement-remediation
overview: >-
  Kill the authored-restatement-of-derivable-state error class across the doc
  estate (the generator behind PR #390's eight review rounds), pin the cures
  with prevention validators, and thereby open the settling gate for
  plan-corpus-refounding. The evidence-grade fleet substrate is a by-product,
  never the goal.
lineage:
  serves_thread: strategy-and-plan-estate-holistic-review
  serves_stream: agentic-framework
  strategic_choice: FRAME-1
  derives_from: >-
    PR #390 review-round evidence (8 rounds / ~38 findings, one generator) +
    the owner's remediation-before-the-push directive, 2026-07-16
todos:
  - id: d1-pr-lifecycle-hardening
    content: >-
      Land the pr-lifecycle skill amendments (round tally, step-back trigger,
      review-round state machine, explicit-merge boundary) via their own PR,
      shepherded under the discipline they add.
    status: completed
  - id: d2-restatement-audit-module
    content: >-
      Build the restatement-audit module (TDD, corpus-analysis substrate) and
      land it via its own PR.
    status: completed
    # Landed via PR #393 (merge SHA:9a5bf6bc2, 2026-07-16). The post-#393
    # review-spec boundary hardening is AIP-126 (PR #409) — a v2-cycle
    # precondition tracked in Linear, not a reopening of this todo.
  - id: d2-fleet-run
    content: >-
      Run the T3+U audit fleet to a verified fix-ledger, under the v2 spec and
      its dispatch conditions.
    status: pending
    depends_on: [v2-cycle]
  - id: d2a-continuity-truth-pass
    content: >-
      True the durable coordination records to current reality, establish the
      volatility layering (fast-moving operational values live in the claim's
      handoff record; durable identity, team shape, and milestone state stay
      in durable records), and re-home this plan in-repo.
    status: completed
  - id: v2-cycle
    content: >-
      Between module merge and any Job 2 dispatch: gazetteer/key v2 builds,
      the F8 discriminating experiment, the re-pilot (all keyed rows +
      negative-control battery), and the measured S3 cost/correctness pilot.
    status: pending
    depends_on: [d2-restatement-audit-module]
  - id: d3-cures-and-prevention
    content: >-
      Apply the fix-ledger cures + prevention v1 (row-envelope schema,
      falsifier registry, gate-status validator, doctrine rule) in one PR,
      validators red-then-green pinning the fixes; carries the
      continuity-instrument contract amendments and the director-handoff
      current-state extraction assigned to Deliverable 3 in the body.
    status: pending
    depends_on: [d2-fleet-run]
  - id: freeze-recut-check
    content: >-
      After Deliverable 3 lands, run refound-verify-freeze +
      refound-merge-recheck and rule the frozen-v2 recut per the freeze rule.
    status: pending
    depends_on: [d3-cures-and-prevention]
---

# PR-lifecycle hardening + restatement-audit fleet + prevention mechanisms

Re-homed in-repo 2026-07-16 (Sequencing item 2a): this file is the canonical copy of the
owner-approved remediation plan; the per-user plan-mode working copy points here.

## What this plan is actually for (recorded 2026-07-16, owner-prompted)

Three nested layers, each in service of the next. (1) IMMEDIATE: kill one measured error
class — authored restatement of derivable state — across the doc estate, and prevent its
return mechanically. (2) THE MISSION IT GATES: plan-corpus-refounding — this work IS the
owner's "settled state before the big push"; the refounding consumes and produces this
estate, so it must not resume on a self-contradicting base. (3) BY-PRODUCT, never goal:
the evidence-grade fleet substrate (calibration gates, deterministic joins, spend pilots,
provenance protocol) consolidating under consolidate-at-second-consumer — it transfers to
other fleet research (measured: the module build reused ~everything but domain schemas;
the pilot refused a ~14M-token untrusted run for ~100k), but every investment in it must
trace to a forcing fact from THIS audit. FALLBACK (the approach's falsifier): if the v2
re-pilot fails the canary gate again, do not iterate a third time by default — ship the
prevention validators regardless (they are fleet-independent), hand-audit the
highest-traffic files, accept unproven completeness on the tail, and put that decision to
the owner.

## Context

PR #390 (the r2 refounding protocol docs) took **8 review rounds / ~38 Copilot findings**, and
the merge raced a composing review round. Concept-exploration over the full finding corpus
identified one generator — **authored restatement of derivable state** — in three classes:
(1) workflow/authorisation status restated across documents → staleness; (2) closed sets /
populations / denominators restated in prose at every mention → local patches mint
contradictions; (3) shared facts copied across sibling documents → one change invalidates the
rest. The only artefact untouched across all rounds was the *generated* one (the sample
manifest). The owner directed: harden the pr-lifecycle skill (count comments per push, detect
non-convergence and step back, never merge while a review round is in flight); design a
low-power fleet with high-power support to find ALL instances of the generator's classes; the
Director fixes them; and design prevention mechanisms.

Owner decisions taken: sweep scope **T3+U** (protocol + coordination + doctrine + active
plans PLUS the untracked live coordination tier — handoff records, ARC channels, live arc
reports; untracked files are FIRST-CLASS: local because high-traffic and ephemeral, never
because they matter less — owner directive 2026-07-16; the corpus is enumerated at
dispatch time, never frozen here); the fleet runs on a
**dedicated fresh audit seat** (Vole hunts Perch, 36c6ca); **PR #391 merges under the new
rules**; **no follow-ups** — remediation designs land as plan items in this arc (change
plan of record:
`.agent/reports/agentic-engineering/restatement-remediation-change-plan-2026-07-16.md`).

## Deliverable 1 — pr-lifecycle skill amendments

File: `.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md` (wrapper
`.claude/skills/oak-pr-lifecycle/SKILL.md` is a pointer, unchanged). House amendment
convention: inline dated parentheticals at the phase they modify + a failure-modes bullet.
The binding contract is the amended skill itself
(`.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md`, landing via PR #392 and shepherded
under the very discipline it adds); this plan does not restate the skill's mechanics
(cite-not-restate — the error class this plan remediates). Stable acceptance criteria:
a persisted per-round tally over BOTH finding surfaces (review threads AND review
bodies) with a step-back trigger on non-convergence; a reviewer-state gate binding
every expected reviewer's latest review to the current tip before merge-ready; the
compound watch floor including that tip-binding read; an explicit-merge-only boundary;
and the PR #390 worked instance recorded in the skill's failure modes.

## Deliverable 2 — the restatement-audit fleet (T3+U)

> **The v1 fleet design below is SUPERSEDED (2026-07-16) — do not dispatch from it;
> the binding replacement is
> [`v2-spec.v1.md`](../../../reports/restatement-audit/v2-spec.v1.md) (its FOLD blocks
> authoritative).** The measured basis (stable): the canary pilot FAILED its acceptance
> gate at 1/8 rows clean (the corrected, adversarially-verified scorecard is the napkin
> entry "Owner-directed re-assessment of the canary pilot" + comms events
> 4e96399f/c8c3f819/873028bb), and S3 at borrowed voter costs alone breached the 6M
> ceiling — the measured S3 cost pilot is decision-critical. The v2 spec supersedes:
> the finder decision procedure, the S1 haiku calibration gate (incoherent under
> measured subject divergence), the canary key (SHA-pinned versioning + deterministic
> preflight + a negative-control battery across the four non-authored assertionKinds + group-(h)
> rows), the gazetteer (alias/canonicalisation structure — measured join failure: 43
> predicates over 62 instances), and the P12 arithmetic. The module and the stage SHAPE
> below remain sound. Job 2's dispatch conditions are named in the spec (§9) and their
> CURRENT state lives in the Director claim's handoff record, never here.

Reuses the proven corpus-analysis substrate; **no new agent templates** (the four `corpus-*`
agentTypes carry capability envelopes; task instructions ride the dispatch prompts).

**New module `agent-tools/src/restatement-audit/`** (TDD; mirrors
`agent-tools/src/corpus-analysis/`):

- `schemas.ts` — zod SSOT for finder-instance / cluster / voter / ledger shapes, inlined into
  dispatch prompts via the `agent-schemas.ts` derive pattern. Finder instance:
  `{id, file, line, quote(≤200), factClass, subject, subjectFromGazetteer, predicate,
  valueNorm, assertionKind(authored|citation|history|generated), confidence}`.
  `factClass` enum: `status-assertion | closed-set-membership | count | denominator |
  threshold | coverage-mapping | named-tool-or-artefact | date-claim`.
  **Fact-key = `(factClass, subject, predicate)`** — the gazetteer makes it exact-joinable.
- `normalize.ts` + `join.ts` (+ unit tests) — deterministic layer-1 join: group by fact-key;
  >1 distinct `valueNorm` → CONFLICT; 1 value in ≥2 files → LATENT. All counting in code.
- `workflows/{map,reduce,validate,meta}.workflow.ts` (+ `.meta.ts`) — registered in
  `workflow-builder.ts` `STAGE_DEFINITIONS`; reuse `harness-types.ts`,
  `run-orchestration.ts` (`runCapped`, jitter, `assessMapCompleteness`), checkpoints between
  stages.

**Stages** (per the Plan-agent design, verified against the substrate):

| Stage | Agents | Tier | Notes |
|---|---|---|---|
| S0 seed | code + Director | — | Gazetteer (gate ids, lane ids, falsifier ids, artefact/tool names, stage vocab) inlined into every finder; ≥8-row canary key incl. the LIVE design-doc line-116 "one-of-7-seed-ids" vs line-97 8-value conflict |
| S1 map | ~38 finder windows (≤6 files/≤1.5k lines) | sonnet/low; haiku scale-out after a 3-window dual-run calibration gate (haiku must find ⊇ sonnet's gazetteer-subject instances) | corpus-mapper agentType; compiled decision procedure (5 trigger classes, quote+line mandatory, banned gap-bridging vocabulary, NO cross-file reasoning) |
| S2 join | code first; 1–3 reducer calls for free-text-subject residuals only | opus/high, zero tools | reducer clusters, never verdicts; code recounts |
| S3 verify | 2 voters × judgment-needed clusters (~100–140) | sonnet/high, zero tools | conjunctive tests: sameFact, authoredNotCited, genuineConflict, liveSurface; ALL judgment-needed clusters vote (exact-key skip-voting optimisation dropped 2026-07-16 — ambiguous spec, ceiling headroom; Director ruling) |
| S4 meta | 1 | opus/high, Glob/Grep/Read | byte-verifies every surviving quote (`grep -F`), resolves splits, assigns `sourceOfTruth` + `proposedCure` |

**Output**: `.agent/reports/restatement-audit/fix-ledger.v1.json` + `.md` rendering. Cure
menu (closed): `cite-register | extract-to-data | derive-from-generator |
delete-restatement | mark-as-history | new-single-source`. `sourceOfTruth: null` rows feed
prevention design, not just patches.

**P12 declaration (T3+U)**: ceiling **480 invocations / 6M tokens** (amended 2026-07-16
with the untracked-tier corpus group: handoffs/*.md, rapid-comms/*.md, live arc reports —
gazetteer/canary-key files classified DERIVED, finders treat as `generated` sources);
batch-sequential with the deterministic breaker; canary gate (all keyed rows found,
register cache-row correctly NOT flagged) or the evidence is not trusted; run-health
metric: `subjectFromGazetteer:false` rate >40% = re-seed the gazetteer, halt to Director.

**Venue**: a dedicated fresh audit seat — **Vole hunts Perch (36c6ca)**, owner-staffed
2026-07-16, which supersedes the earlier module-ownership line: Vole builds the module
(Job 1) AND runs the fleet (Job 2), per the brief at
`.agent/state/collaboration/handoffs/2026-07-16-audit-brief-team-mango.md`. The Director
keeps the judgment artefacts (gazetteer, canary key — both delivered) and the fixes:
applied from the verified ledger via PR(s) with the prevention validators pinning them.

## Deliverable 3 — prevention v1 (ships with the fix PR)

| # | Mechanism | New paths | Mirrors |
|---|---|---|---|
| a | Row-envelope schema-as-data: the lens-row contract becomes a real JSON Schema; the design doc's fenced block must equal the schema's pretty-printed `examples[0]`; the future dispatch consumes the schema file | `.agent/plans-refounding/r2-evidence/lane-assignment-row.schema.json`; `agent-tools/src/validators/row-envelope/` | `validate-ratified-lists.ts` |
| b | Falsifier registry-as-data (`{id, population, formula, threshold, primeCandidate}` ×6); validator recomputes registry↔seed§Falsifiers↔any doc naming a falsifier id | `.agent/plans-refounding/falsifier-registry.v1.json`; `agent-tools/src/validators/falsifier-registry/` | `freeze-rule.json` ↔ packet bridging |
| c | Gate-status cite-not-restate: scan `.agent/plans-refounding/**` + `.agent/memory/operational/*.md` for gate-id+status co-occurrence outside the two sanctioned homes; hits must link to `owner-gate-register.md`; "Ratification record" sections exempt | `agent-tools/src/validators/gate-status-assertions/` | `validate-reference-direction` |
| e | Doctrine rule naming the anti-pattern, three classes, cure menu | `.agent/rules/single-source-shared-facts.md` (canonical) + its forwarder forms (`.claude/rules/`, `.cursor/rules/*.mdc`, `.agents/`) + the `RULES_INDEX.md` row | `validators-must-recompute-not-just-record.md` |

Wiring: scripts in `agent-tools/package.json` + chained into `docs-validators:check` (root
`package.json:39`). **(d) generalised declared-fact registry: DEFERRED** — build only if the
ledger histogram shows ≥2 recurring fact classes with no data home.

## Sequencing

1. Skill amendments PR (#392) — plus the round-2 fix set (four designed cures in the
   compaction record §3) — governs #391's merge and every PR after.
2. `restatement-audit` module (Vole Job 1) + the T3+U run (Vole Job 2, amended corpus +
   ceiling) lands the ledger. Director inputs delivered; corpus amendment event sent.
   **AMENDED 2026-07-16 (pilot verdict)**: between Job 1's merge and any Job 2 dispatch
   sits the v2 cycle — Director v2 spec (join-key architecture, taxonomy extension, gate
   respec, pre-dispatch provenance protocol) + gazetteer/key v2 + zero-LLM precision
   measurement + Vole's F8 discriminating experiment + re-pilot (all keyed rows +
   negative-control battery) + the measured S3 cost/correctness pilot; owner ceiling
   decision ONLY if measured spend >6M.
2a. **Continuity-truth pass (NEW 2026-07-16, cold-path review)**: the untracked cures are
   DONE (live current-state record + claim handoff pointer; DISCHARGED banner on the
   compaction record; HALT banner on the audit brief's Job 2). The tracked refreshes ride
   a small dedicated PR ahead of Deliverable 3: `director-handoff.md` CURRENT HANDOFF
   STATE rewrite (stale at Barnacle/2026-07-14 — two tenures old; supersede into the
   conserved details block), `repo-continuity.md` strategy-row dated append, thread-record
   section, and RE-HOME THIS PLAN IN-REPO — DONE 2026-07-16: this file
   (`.agent/plans/product-development-governance/active/restatement-remediation.plan.md`)
   is the re-homed canonical copy; it lived at a machine-local per-user plans path cited
   by in-repo briefs, which `no-machine-local-paths` forbids, and the per-user working
   copy now points here.
3. I apply the ledger cures + prevention v1 in one PR (validators red first against the
   pre-fix tree where applicable, green after — pinning the fixes). Deliverable 3 also
   carries: the continuity-instrument contract amendments (session-handoff SKILL +
   handoff-messages rule), the director-handoff CURRENT-HANDOFF-STATE extraction, and the
   repo-continuity split verdicts (continuity review, 2026-07-16); the `continuity
   render` generated-state projection is specced as a tooling item from fleet-pattern
   capture.
4. PR #391: DONE — merged 2026-07-16 ahead of item 1's PR landing, as the ratified
   "Independent of 1–3" allows; the new discipline was applied manually (round-owed gate
   recomputed on the tip: Copilot bound, 0 unresolved, >2h quiet) because it preceded #392's landing
   (merge commit `SHA:eca8fb2d6`, merge method, admin bypass; corrected diagnosis
   2026-07-16: the permanent blocker is the required "SonarCloud Code Analysis" status
   context, which nothing posts on ANY commit — docs tips, code tips, or main — so
   auto-merge can never fire repo-wide and every merge has been riding admin bypass;
   the code-owner leg auto-satisfies for the sole-owner author. Governance cure carded
   to the owner; the never-fires recognition folds into Deliverable 1's Phase-7
   amendment).
5. **Freeze recut decision (criteria-gated, owner-sanctioned at the moment)**: after
   Deliverable 3 lands, run `refound-verify-freeze` + `refound-merge-recheck`; cut
   frozen-v2 per the freeze rule's v2 arm when unsanctioned deltas touch denominator
   files OR the cures materially alter frozen-copied proof inputs; re-derive denominator,
   re-run tiling to green, re-anchor Walk A on the v2 cut. Neither criterion firing = v1
   stands with the classification as evidence. (Change plan of record §C4.)

## Verification

- Skill PR: its own shepherd runs the new tally + reviewer-state gate (first worked
  instance); merged at truly-green under them.
- Audit module: `pnpm check` green (join/normalize unit-tested); the two-level v2
  acceptance gate — map-recall over the v2 keyed rows plus the text-vs-text
  pipeline-integrity gate — passes per its binding definition in
  [`v2-spec.v1.md`](../../../reports/restatement-audit/v2-spec.v1.md) (§3) before any
  ledger row is trusted.
- Prevention validators: each demonstrates red on a synthetic drift fixture and green on the
  repaired tree; `docs-validators:check` green in the fix PR; unit tests per validator.
- Fleet run health: completeness check on zero-instance windows; gazetteer-miss rate <40%;
  ceiling respected (H-halts route to Director).

## Constraints carried

- No fleet launches from existing sessions (the audit seat cure); my session does code/doc
  edits and PRs only.
- The classifier may gate individual actions in my session; per the routing rule each gets
  one attempt and a verbatim surface — plan approval is the authorisation context for the
  edits named here.
- Handoff/coordination records stay untracked; no handover commits.
