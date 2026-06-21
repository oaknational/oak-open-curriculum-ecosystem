# Survey Orchestration — State & Successor Handoff (v2, substance re-aim)

> 2026-06-21. From **Pinnace hunts Marsh** (868a9b, claim `f0055992`) to the next survey
> orchestrator. **Eventual successor (owner-pre-positioned): Aardvark turns Whisper.**
> SELF-CONTAINED: read this + `04` (unchanged method/pacing) + `00`/`01`/`02`/`03` + the V0 lens
> ([`../../plans/product-development-governance/plan-node-schema.v0.md`](../../plans/product-development-governance/plan-node-schema.v0.md))
> + the brief
> ([`../../plans/product-development-governance/future/deep-plan-estate-survey.plan.md`](../../plans/product-development-governance/future/deep-plan-estate-survey.plan.md))
> + the substance re-aim ArcAngel channel
> ([`../../collaboration/rapid-comms/2026-06-21-survey-substance-and-v1-fold-ganymede-herds-penumbra-and-pinnace-hunts-marsh.md`](../../collaboration/rapid-comms/2026-06-21-survey-substance-and-v1-fold-ganymede-herds-penumbra-and-pinnace-hunts-marsh.md)),
> and you can resume immediately. Everything is input-to-verify.

## THE BIG CHANGE since 04 — owner-ratified SUBSTANCE RE-AIM

The owner re-aimed the survey from FORM (V0 conformance, edges, tree) toward **SUBSTANCE**: prove the
corpus *effectively implements* the strategy, the bad is removed, the speculative is isolated, and **no
useful content or intent is lost — provably**. Four first-class *verified* outputs (beyond conformance
+ traceability), per the ArcAngel channel:

1. **Per-strategic-choice effectiveness/adequacy** — are the serving plans adequate to *achieve* the
   choice, where are the real gaps (gaps → authored new plans, not deferred discussions). CROSS-plan →
   **Pass-2** widening + Pass-3 synthesis. **Ganymede herds Penumbra is drafting this spec.**
2. **Per-plan content-quality** — is what is *in* the plan good, or merely present and conformant.
3. **good / bad / speculative** trichotomy → dispositions: good → keep/remix; bad → remove
   (archive-with-disposition, recoverable); speculative → isolate in a home **outside `.agent/plans/`**.
4. **No-loss audit** — per removed/archived/extracted item, the useful content + intent traced to where
   it now lives, checkably. **Ganymede is drafting the audit-output format.**

**Instrument change (DONE, this session):** `survey-pass1.workflow.js` `HolisticFinding` now carries
three per-plan substance fields, captured from **sub-batch 1b-04 onward**:

- `substance_class`: `good | bad | speculative` (+ `substance_rationale`, file:line).
- `content_quality`: `strong | adequate | weak | empty` (+ `content_quality_note`, file:line).
- `salvage_value`: the no-loss INPUT — content+intent to preserve if removed/archived/extracted,
  AND any embedded speculative section of an otherwise-good plan (so embedded ideas are never dropped).

**Division of labour (n=2 peer, no Director):** Pinnace/successor own the live instrument (Pass-1 fields,
the `substance_class`→disposition mapping). Ganymede owns the Pass-2 effectiveness/adequacy spec, the
no-loss audit-output format, and the trichotomy→disposition encoding-defaults spec, plus the V1-fold /
Stage-3 restructure that consumes the synthesized outputs.

## Pass-1 coverage state (see `coverage-ledger.md` for the live table)

| Unit | Plans | Schema | Status |
| --- | --- | --- | --- |
| Smoke (cross-collection sample) | 5 | old (form-only) | validation only; findings are PROSE in `03`, NOT a `pass1-*.json` — re-survey these 5 in their collections' batches (or extract from `03`) for the structured inventory |
| 1a (agentic-engineering-enhancements) | 35 | old (form-only) | COMPLETE + conserved + committed `fc108b684` → `pass1-agentic-engineering-batch1a.json` |
| 1b-01 / 1b-02 / 1b-03 (AEE) | 4 / 8 / 12 | old (form-only) | COMPLETE + conserved + committed `fc108b684` → `pass1-agentic-engineering-batch1b-0{1,2,3}.json` |
| 1b-04 (AEE) | 11 | **NEW (substance)** | in flight / first run with the substance fields → finishes AEE 70/70 → `pass1-agentic-engineering-batch1b-04.json` |

After 1b-04: the full **agentic-engineering-enhancements** collection (70 plans) is Pass-1 complete.

## Two obligations the re-aim creates

1. **BACK-FILL the 59 old-schema plans** (1a + 1b-01/02/03) with the three substance fields, via a
   **focused holistic-only pass** (the 3 fields ONLY — no conformance/specialist/verify redo), **before
   Pass-3 synthesis** (Ganymede confirmed: keeps all 286 plans uniform-provenance; do NOT fold into
   Pass-2, which is a different lens). Timing is the orchestrator's; the only constraint is before Pass-3.
2. **Remaining Pass-1**: ~216 plans across the **15 collections other than agentic-engineering-enhancements**
   (derive from `worklist-plans.tsv`), in **~35-plan atomic sub-batches, ONE per owner-reset window**.
   `product-development-governance` is **safe to survey** (Drake's `4bf5d49fd` settled the spec edits).

## How to run a sub-batch (UNCHANGED from 04, + commit discipline)

- **Script (durable, re-aimed):** `survey-pass1.workflow.js` in this dir. Copy it to your OWN session
  scratchpad and `Workflow({scriptPath: "<your copy>", args: [<≤~35 plan paths>]})`. `args` is the
  plan-path ARRAY (defensively parsed). Model tiering + concurrency handled inside.
- **CONSERVE each return immediately** to `pass1-<collection>-<range>.json` (the task output file wraps
  the workflow return under `j.result` — write `j.result`, not the whole file).
- **COMMIT each increment to the repo** by explicit pathspec (owner directive, stated twice: *"record
  intermediate results to the repo, do not lose intermediate results"*). A working-tree JSON is NOT
  "recorded in the repo" — it is one `git reset`/`clean` from loss. Docs commits are near-instant
  (FULL TURBO cache). Update `coverage-ledger.md` as you go.

## Remaining phases (after Pass 1) — UNCHANGED from 04

- **Pass 2** — cross-cutting relational passes (4 angles) PLUS the per-choice effectiveness/adequacy
  widening (Ganymede's spec). Barrier after Pass 1. Separate workflow.
- **Pass 3** — synthesis + completeness-critic, loop-until-dry (2 clean rounds). Run the back-fill
  BEFORE this. Separate workflow, orchestrator-in-the-loop.
- **Four+ dated outputs:** conformance-and-traceability inventory → Stage-3 work-list; cross-cutting
  patterns; taxonomy grounding → V1; coverage ledger; PLUS the re-aim's effectiveness/adequacy verdict,
  good/bad/speculative inventory, and the no-loss audit.

## Team & routing (n=2 owner-visible, PDR-082 — NO Director)

- **Ganymede herds Penumbra** (74cb92) — peer; owns V1-fold/Stage-3 + the re-aim spec (Pass-2
  effectiveness, no-loss audit format, trichotomy→disposition defaults). Coordinate peer-to-peer on the
  ArcAngel channel above.
- **Routing (Director dissolved, owner adjudicates):** the SYNTHESIZED taxonomy-grounding + conformance
  inventory + substance outputs (post Passes 1–3) route **DIRECTLY to Ganymede**. Raw per-plan Pass-1
  findings are NOT V1 input; Ganymede stays survey-gated until synthesis. Ganymede's intent-alignment
  forks + locked-contradiction re-ratification candidates go DIRECTLY to the owner.
- **Heartbeat is DROPPED** in n=2 owner-visible mode (consumer-absent exemption); keep the all-channels
  comms watcher running.

## Discipline (non-negotiable) + lessons

input-to-verify (every subagent finding); **HALT-don't-fabricate** (can't read → `unreadable`, never
invent); `file:line` for every claim; re-derive divergent counts; V0 is **provisional** (estate evidence
contradicting a LOCKED decision → owner re-ratification candidate, never suppressed); **no PII**; **log
every coverage bound** in the ledger.

- **Fresh session ≠ fresh window.** The session limit is **account-level**, shared across the rotating
  cast — it resets on an owner-managed schedule (last reset ~12:18 UTC; a prior limit reset 17:20 London).
  One ~35-plan sub-batch ≈ one window. Do not assume a fresh session has fresh budget; pace to resets.
- **Conserve granularity < session-death granularity.** Run small Workflow calls (~8–12 plans) and
  conserve+commit each on return, so a mid-run death costs ≤ one increment.

## Your claim & pickup contract

My claim `f0055992` (orchestrator, area `.agent/reports/plan-estate-survey-2026-06-21/**`, writes ONLY
this dir). On retirement I close it and broadcast this handoff. You: read this + `04` end-to-end + the
re-aimed `survey-pass1.workflow.js` first-hand; open your own orchestrator claim on the report dir; arm
the all-channels comms watcher (heartbeat is dropped at n=2); then continue from **Next safe step**.

## Next safe step

(1) Conserve+commit 1b-04 (finishes AEE 70/70). (2) Run the remaining 15 collections in ~35-plan atomic
sub-batches, one per owner-reset window, conserving+committing each. (3) Back-fill the 59 old-schema
plans with the 3 substance fields (focused holistic-only) before Pass-3. (4) Pass-2 (with Ganymede's
effectiveness spec) → Pass-3 synthesis → the dated outputs + no-loss audit. Owner controls push.
