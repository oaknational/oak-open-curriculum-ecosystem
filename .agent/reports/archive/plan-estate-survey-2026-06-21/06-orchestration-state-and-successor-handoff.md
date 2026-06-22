# Survey Orchestration — State & Successor Handoff (v3, monitors-fixed)

> 2026-06-21. From **Aardvark turns Whisper** (3c3b32, claim `da3fd499`) to
> **Anvil lifts Solder** (survey orchestration successor, owner-directed).
> SELF-CONTAINED: read this + `05` (the substantive state — UNCHANGED) +
> `04` (method/pacing) + `coverage-ledger.md` + the durable
> `survey-pass1.workflow.js`, and you can resume immediately. Everything is
> input-to-verify.

## TL;DR — the survey state is UNCHANGED from `05`

I held the orchestrator seat for a short tenure and **fired NO sub-batch** —
the account-level session limit was spent the entire time (no compute window
opened during my tenure). So **nothing in the survey advanced or changed**:
`05` is fully current. My value was elsewhere (monitors + team context, below).

- **Pass-1 agentic-engineering-enhancements: 70/70 COMPLETE & committed**
  (`fc108b684`, `e87ab281f`, `7496f7387`). Nothing in flight; clean boundary.
- **Substance re-aim landed**: the instrument (`survey-pass1.workflow.js`) is
  idea-granular — `substance_class` (summary `good|mixed|bad|speculative`),
  `content_quality` (`strong|adequate|weak|empty`), and the load-bearing
  `salvage_value` = `[{idea, class, file_line}]`. **VERIFIED first-hand** by me
  (all three commits present; the script schema is idea-granular at
  `survey-pass1.workflow.js` lines ~27/32/36; branch 72 ahead of upstream,
  unpushed).
- **Primary pickup = `05-orchestration-state-and-successor-handoff.md`**
  (current; supersedes 04 with the re-aim + idea-level correction). `04` =
  unchanged method/pacing. `coverage-ledger.md` = the live index.

## What changed during my tenure (the value to inherit)

1. **MONITORS WERE BLIND — now fixed. Arm your canonical comms watcher
   PIPE-LESS.** The canonical `comms watch` Monitor pipe filter `grep -E '^\['`
   (the old rule reference shape) silently swallowed ~10 events over ~50 min:
   the emit's first line is `--- NEW [BROADCAST] EVENT ---`, so the tag is
   MID-line and the `^\[` anchor never matched, while the watcher stayed
   healthy (heartbeat fresh, seen-file advancing). **Cure, now canonical
   doctrine: arm pipe-less** — `pnpm agent-tools:collaboration-state -- comms
   watch --comms-dir .agent/state/collaboration/comms --seen-file
   ".agent/state/collaboration/comms-seen/<your agent_name>.json" --platform
   claude --model <model> --session-prefix <your prefix>` with NO grep filter
   (the CLI self-excludes). Do NOT copy the old `^[` snippet. Captured as
   friction **F-82**; the structural cure is the promoted plan
   `agent-tooling/current/coordination-watcher-canonicalisation.plan.md`.
2. **Team shape: n=2 owner-visible, NO Director.** Your peer is **Saffron holds
   Sepal** (0f0399), holding the **V1-fold / Stage-3** lane (claim `333257e2`).
   Heartbeat cron is DROPPED at n=2 (consumer-absent exemption); keep the
   all-channels comms watcher running.
3. **Routing (Director dissolved; owner adjudicates):** the SYNTHESIZED outputs
   (taxonomy-grounding → V1; conformance/traceability + idea-granular substance
   inventory → the two-pass restructure work-list), produced AFTER Passes 1–3,
   route **directly to Saffron**. Raw per-plan Pass-1 findings are NOT V1 input;
   Saffron stays survey-gated until synthesis. Saffron is drafting the 3 Pass-2
   specs (per-choice effectiveness/adequacy; the no-loss-proof session; trichotomy
   → disposition defaults), conserved under
   `.agent/plans/product-development-governance/` — you will inherit them warm
   for the Pass-2 widening.
4. **Continuity ownership:** per the 13:42Z continuity-split, **Saffron owns the
   thread-record + repo-continuity lane** for this thread. Route survey
   continuity updates to Saffron rather than editing those surfaces yourself
   (collision-avoidance).
5. **Open a coordination seam with Saffron.** The rotating-cast pattern uses a
   low-latency ARC channel between the orchestrator and the V1-fold seat. Open
   an Anvil ⇄ Saffron seam (or read the prior Aardvark ⇄ Saffron seam at
   `.agent/collaboration/rapid-comms/2026-06-21-successor-seam-saffron-holds-sepal-and-aardvark-turns-whisper.md`
   for context). Pair it with your canonical all-channels watcher, always.

## Next safe step (the survey roadmap — UNCHANGED from `05`)

1. **Next owner-reset window → fire the next ~35-plan atomic sub-batch** from a
   non-AEE collection. 15 collections remain (~216 plans); derive from
   `worklist-plans.tsv` (column `collection`). `product-development-governance`
   is SAFE to survey (Drake `4bf5d49fd` settled its spec edits). Copy
   `survey-pass1.workflow.js` to your own scratchpad, then
   `Workflow({scriptPath: "<copy>", args: [<≤~35 plan paths>]})`; `args` is the
   plan-path ARRAY (defensively parsed). **Conserve + COMMIT each increment** to
   `pass1-<collection>-<range>.json` (owner directive: do not lose intermediate
   results); update `coverage-ledger.md`.
2. **Back-fill** the idea-granular inventory across **all 70 AEE plans** (1a/1b-01..03
   have none; 1b-04 has coarse) via a focused holistic-only pass — **before Pass-3**,
   so the inventory is uniform. Future collections run idea-granular natively.
3. **Pass 2** — cross-cutting (4 angles) PLUS Saffron's per-choice
   effectiveness/adequacy widening. Barrier after Pass 1.
4. **Pass 3** — synthesis + completeness-critic, loop-until-dry (2 clean rounds).
   Run the back-fill BEFORE this.
5. **Dated outputs** — conformance/traceability inventory → Stage-3 work-list;
   cross-cutting patterns; taxonomy grounding → V1; coverage ledger; PLUS the
   re-aim's effectiveness verdict, good/bad/speculative inventory, and the no-loss
   audit.

## Pacing & discipline (non-negotiable)

- **Fresh session ≠ fresh window** — the session limit is ACCOUNT-LEVEL, shared
  across the rotating cast; resets are owner-managed. One ~35-plan sub-batch ≈
  one window. Do not assume a fresh session has fresh budget; pace to resets.
- **Conserve granularity < session-death granularity** — run small Workflow
  calls (~8–12 plans) and conserve+commit each on return, so a mid-run death
  costs ≤ one increment.
- input-to-verify every subagent finding; **HALT-don't-fabricate** (can't read →
  `unreadable`, never invent); `file:line` for every claim; re-derive divergent
  counts; V0 is provisional (estate evidence contradicting a LOCKED decision →
  owner re-ratification candidate, never suppressed); no PII; log every coverage
  bound in the ledger.

## Your claim & pickup contract

My orchestrator claim `da3fd499` (area `.agent/reports/plan-estate-survey-2026-06-21/**`,
writes ONLY this dir) is **relinquished** with this handoff. You: read this + `05`
+ the re-aimed `survey-pass1.workflow.js` first-hand; open your OWN orchestrator
claim on the report dir; arm the all-channels comms watcher PIPE-LESS (heartbeat
dropped at n=2); open a seam with Saffron; then continue from **Next safe step**.
Owner controls push.
