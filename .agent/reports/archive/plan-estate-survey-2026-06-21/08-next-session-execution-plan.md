# Survey Orchestration — Exhaustive Linear Execution Plan for the Next Session (doc 08)

> 2026-06-21. Authored by **Cosmos calls Infinity** (`9888f9`, orchestrator claim `3a5e8798`) at the
> window-2 hold boundary (Pass-1 228/286). This is the **linear runbook** for the next survey session.
> It supersedes `07`'s §5 operating loop and makes three things first-class that `07` left implicit:
> **(A)** every exhortation to critically assess sub-agent work, **(B)** every skill invocation, and
> **(C)** every owner intervention the session needs part-way through.
>
> SELF-CONTAINED with: this doc + `07-sole-successor-survey-plan.md` (deep context) +
> `coverage-ledger.md` (the living state) + the instrument `survey-pass1.workflow.js`.
> **Everything here is input-to-verify** — re-derive every count against the ledger and git before acting.

## Parent plan & lineage (this runbook serves these; it links upward only)

This execution plan is an **ephemeral operational runbook**. It serves — and reads up to — the survey's
governing plans, matching the convention of doc `00`. It links **upward only**: per the read-only-survey
non-goal (§0) and the no-provenance-pointers discipline, the estate plans are NOT back-edited to point at
this runbook (the report dir + the commit are the provenance). The ephemeral cites the governing, never
the reverse.

- **Parent — the decision-complete method brief:**
  [`deep-plan-estate-survey.plan.md`](../../plans/product-development-governance/future/deep-plan-estate-survey.plan.md)
  fixes the *method* (Pass 0→3, the ≥3-reads-plus-adversarial-verify floor, the four dated outputs, the
  completeness-critic loop). The method is not re-litigated here; this doc is the *execution* shape only.
- **Controlling strategic plan:**
  [`vision-strategy-and-plan-estate.plan.md`](../../plans/product-development-governance/vision-strategy-and-plan-estate.plan.md)
  — Body 3 + Acceptance: the corpus must be **effective, not merely aligned**, every strategic choice
  served by adequate plans, and **no useful idea lost, proven independently**. This is the end the survey serves.
- **Conformance lens (provisional):**
  [`plan-node-schema.v0.md`](../../plans/product-development-governance/plan-node-schema.v0.md)
  — V0 scores shape; estate evidence contradicting a LOCKED V0 decision is an owner re-ratification
  candidate, never suppressed.
- **Thread:** `strategy-and-plan-estate-holistic-review` (shared by the brief, the controlling plan, and
  the orchestrator claim `3a5e8798`).
- **This doc family (report dir):** `00` (method/execution design) → `05`/`06`/`07` (successor handoffs) →
  **`08` (this runbook, supersedes `07` §5's loop)**; `coverage-ledger.md` is the living Output #4.

## 0. End goal · mechanism · means · acceptance · non-goals

- **End goal.** A complete, evidence-grounded Pass-1 → Pass-2 → Pass-3 survey whose dated outputs let the
  Stage-3 restructure achieve a corpus that *effectively implements* the strategy with **zero useful-idea
  loss, proven independently**.
- **Mechanism.** Per-plan deep reads behind an adversarial-verify gate produce grounded, idea-granular
  findings; cross-cutting and synthesis passes turn them into the restructure work-list, the V1 taxonomy
  grounding, and the no-loss inputs.
- **Means.** §3 increment loop over the 10 remaining collections → the 70-AEE back-fill → Pass-2 → Pass-3
  → the dated outputs and the independent no-loss audit.
- **Acceptance (outcome-level).** Every non-archive plan Pass-1-surveyed and conserved+committed; the
  AEE idea-inventory uniform; Pass-2 and Pass-3 complete (loop-until-dry, 2 clean rounds); the four+ dated
  outputs produced; the independent no-loss audit returns GO. **No silent truncation** — every coverage
  bound logged in `coverage-ledger.md`.
- **Non-goals.** The survey does NOT mutate the estate, author V1, or run the restructure (V1-fold seat,
  owner-gated). It does NOT survey the 168 archive plans. It does NOT rewrite the validated instrument.

## 1. Where the survey is (verify first-hand before acting)

- **Pass-1: 228/286 (6 of 16 collections).** Complete: `agentic-engineering-enhancements` (70, owes the
  back-fill), `architecture-and-infrastructure` (36), `product-development-governance` (4),
  `agent-tooling` (59), `observability` (31), `sdk-and-mcp-enhancements` (28).
- **Remaining Pass-1 (10 collections, ~58 plans):** `sector-engagement` (12), `semantic-search` (11),
  `connecting-oak-resources` (10), `discovery` (9), `user-experience` (7), `developer-experience` (4),
  `exploring-open-education-resources` (2), `security-and-privacy` (1), `school-data-search` (1),
  `curriculum-mcp-path-to-ga` (1).
- **Branch** `docs/planning-and-validation`, far ahead of upstream, **unpushed — owner controls push.**
- **Verify before acting:** read `coverage-ledger.md` first-hand and re-derive the coverage total; run
  `git log --oneline -3` and `git rev-list --left-right --count @{u}...HEAD`; read `active-claims.json`.
  Trust nothing in this doc that the ledger or git contradicts — the ledger is authoritative for state.

## 2. Session-open grounding — DO THIS FIRST, IN ORDER (with skill invocations)

1. **Invoke `/oak-metacognition`** — apply the generative pre-action pass to "continue the survey": what
   did I inherit, has the shape been ratified, does it still fit, what is the action→impact bridge.
2. **Invoke `/oak-start-right-quick`** (solo) **or `/oak-start-right-team`** (if any peer is registered in
   `active-claims.json` or named in the opener). These read the foundation directives, the active-memory
   learning loop, live state, active plans, and git state. Do not skip; do not substitute a smaller subset.
3. **`/oak-napkin` is always-active:** read `.agent/memory/active/distilled.md` and
   `.agent/memory/active/napkin.md` before acting; write to the napkin continuously as friction appears.
4. **Read first-hand (input-to-verify):** this doc (`08`), then `07` (deep handoff), `coverage-ledger.md`,
   the instrument `survey-pass1.workflow.js`, and `00` (method). `05`/`06` are deeper background.
5. **Verify state** per §1 against git + ledger + registry. Recompute coverage; do not trust the headline.
6. **State the per-session landing commitment (PDR-026):** e.g. *Target: complete Pass-1 on
   `<collection>` — N plans conserved+committed.* If a window has no budget, declare the no-landing
   reason explicitly.
7. **`/rename` suggestion** — surface ONCE at session open if intent is clear and the title does not
   already match (`<your display name> - Survey`). Never in closeout.

## 3. The per-increment loop (the core; repeat per collection, finish a collection before the next)

Pacing: roughly **one ~35-plan sub-batch per owner-reset window** (see §4.1). Conserve granularity SMALLER
than session-death granularity — small Workflow calls (~8–12 plans), conserve+commit each on return.

- **Step A — derive the increment's plan paths** (stay at repo root; do not `cd` into subdirs):

  ```bash
  awk -F'\t' 'NR>1 && $1=="<collection>"{print $6}' \
    .agent/reports/plan-estate-survey-2026-06-21/worklist-plans.tsv | sort | nl -ba
  ```

  Take ~8–12 paths. Fold the tiny singleton collections (`security-and-privacy`, `school-data-search`,
  `curriculum-mcp-path-to-ga`, `exploring-open-education-resources`) into one neighbouring increment.

- **Step B — copy the instrument to scratch (once per session) and fire:**

  ```bash
  cp .agent/reports/plan-estate-survey-2026-06-21/survey-pass1.workflow.js \
     "$SCRATCH/<you>-survey.workflow.js"
  ```

  Then `Workflow({scriptPath: "<scratch copy>", args: ["<plan path>", ...]})`. `args` is the plan-path
  ARRAY (the script parses array OR JSON-string). It runs in the background; you are notified on
  completion. ~12 plans ≈ ~45 agents / ~2M sub-agent tokens / ~4–6 min. **Do NOT rewrite the instrument;
  it is validated across the whole of this session and the prior ones.**

- **Step C — on return, conserve `.result` to disk WITHOUT reading the 100k-char output into context:**

  ```bash
  OUT="<the task .output file path from the completion notification>"
  DEST=".agent/reports/plan-estate-survey-2026-06-21/pass1-<collection>-NN.json"
  jq 'if has("result") then .result else . end' "$OUT" > "$DEST"
  jq -c '{batch_size, plans_returned, unreadable:(.unreadable|length), null_holistic:(.null_holistic|length), results:(.results|length)}' "$DEST"
  ```

- **Step D — read the budget signal (this is a critical-assessment gate, not a formality):**
  - `unreadable == results` (all unreadable) AND the task `<failures>` block shows `session limit` →
    **the account window is spent.** Conserve NOTHING (there is nothing real), delete the empty `DEST`,
    log the bound in the ledger (§4.1), and **surface to the owner for a reset** (§4). HALT-don't-fabricate.
  - Some unreadable, some real → conserve the real ones; log the unreadable plans as a coverage bound to
    re-survey next window; never invent findings for the unreadable ones.
  - All real → proceed to Step E.

- **Step E — tally and SANITY-CHECK the distribution (don't trust the summary):**

  ```bash
  for k in classification substance_class content_quality conformance; do
    printf '%s: ' "$k"; jq -r "[.results[].$k]|group_by(.)|map(\"\(.[0])=\(length)\")|join(\", \")" "$DEST"; done
  printf 'idea classes: '; jq -r '[.results[].salvage_value[].class]|group_by(.)|map("\(.[0])=\(length)")|join(", ")' "$DEST"
  printf 'locked: '; jq '[.results[].locked_contradictions[]]|length' "$DEST"
  printf 'verdicts: '; jq -r '[.results[].high_stakes_verdicts[].verdict]|group_by(.)|map("\(.[0])=\(length)")|join(", ")' "$DEST"
  ```

  A degenerate distribution (every plan `keep`/`good`/`strong`, zero verdicts, empty `salvage_value`) is a
  smell: open the JSON and read 2–3 findings first-hand (Step F) before trusting it.

- **Step F — ORCHESTRATOR SPOT-AUDIT (the human-style critical assessment; §6):** at least once per
  collection, open the conserved JSON and read 2–3 `results[]` entries first-hand. Confirm each
  load-bearing claim carries a real `file:line`, the classification is justified by its evidence, and the
  `salvage_value` ideas are grounded in the actual plan (not hallucinated). If a finding cannot be traced
  to the plan, treat the increment as suspect, log it, and re-fire those plans. This is your only backstop.

- **Step G — log coverage in `coverage-ledger.md` (no silent truncation):** add one Pass-1 table row
  (unit, collection, plan range, counts, conserved-to). When a collection completes, add the
  collection-complete milestone note, roll up the collection (use an **inline** glob — zsh does not expand
  a glob held in a shell variable), and update the running coverage total. Keep the live `WINDOW STATE`
  block current.

- **Step H — commit by explicit pathspec (`/oak-commit` is always-active):**

  ```bash
  MSG="docs(survey): conserve Pass-1 <collection> increment NN (<n> plans)"
  pnpm agent-tools:check-commit-message -m "$MSG" \
    && git add -- .agent/reports/plan-estate-survey-2026-06-21/pass1-<collection>-NN.json \
                  .agent/reports/plan-estate-survey-2026-06-21/coverage-ledger.md \
    && git commit -m "$MSG"
  ```

  Stage ONLY your two survey files by explicit pathspec — **never `git add -A`** (a peer's WIP or a
  rapid-comms file must not be swept in). The pre-commit gate is full-tree (§4.4). Owner controls push.

Repeat C–H until the collection completes; then the next collection. After all 10: the back-fill (§7),
then Pass-2 → Pass-3 → the dated outputs (§7).

## 4. OWNER INTERVENTION POINTS — what the owner must do, repeatedly, part-way through

These are the moments the session **cannot self-resolve**. Surface each with a clear default and wait.

### 4.1 Budget-window reset (THE recurring intervention — expect it ~once per window)

The account-level compute budget is **shared across the rotating cast; a fresh session is NOT a fresh
window.** A window holds roughly **35–63 plans of survey fan-out** before depletion (window 1 this session
depleted at ~63). When an increment returns all-`unreadable` with `session limit` failures, the orchestrator
**halts, logs the bound, and surfaces.** The **owner resets the account window** (owner-managed schedule)
and confirms *"quota available"*; the orchestrator then **re-fires the depleted increment** and continues.
This loop repeats for as many windows as the remaining ~58 Pass-1 plans + back-fill + Pass-2/3 require.

### 4.2 Push (owner controls push, always)

The orchestrator **never pushes**. It commits locally by pathspec and surfaces *"branch N ahead, ready to
push"*. The owner runs the push (or directs it). A successful push proves the full gate ran green — the
orchestrator does not separately offer a gate/CI re-confirmation.

### 4.3 Pacing approval when the budget is shared with a concurrent peer

When a peer is concurrently drawing on the shared account budget, the orchestrator paces to the considerate
~35-plan-window default and **leaves headroom** rather than draining to depletion. If the owner wants the
survey prioritised over the peer's throughput (or vice-versa), that is an **owner pacing decision** — surface
it at the collection boundary with a default.

### 4.4 Shared-checkout commit coupling and the worktree decision

If a peer is doing TDD in the **same checkout**, the orchestrator's docs commits run the full pre-commit
turbo gate (`build type-check lint test`) over the peer's *working tree* — so a peer mid-RED blocks survey
commits. Interim protocol: commit during the peer's broadcast `tree-green` windows; if blocked, STOP, hold
the conserved JSON on disk, retry at the next `tree-green` (never bypass the gate — that needs fresh owner
authorisation). **Structural cure = separate `git worktrees` per concurrent agent**; whether to adopt it is
an **owner team-topology decision** to surface if the coupling recurs.

### 4.5 Decisions that route to the owner from findings

- **Locked-contradiction set → owner re-ratification.** Every `locked_contradictions` entry is estate
  evidence contradicting a V0 LOCKED decision. They are conserved in the `pass1-*.json` and **never
  suppressed**. Surface the full set to the owner at synthesis (Pass-3); they are re-ratification candidates.
- **Effectiveness-arm reviewer (open owner item).** Saffron's Spec 1 leaves the effectiveness-arm reviewer
  unassigned. Carry it to the owner BEFORE Pass-2's effectiveness widening; it is not the orchestrator's to
  self-assign.
- **Feature / source / strategy decisions** surfaced by a plan's findings are the owner's — route, never
  self-resolve.
- **The independent no-loss audit (Spec 2)** reports GO / NO-GO to the **owner**, not to the orchestrator.

## 5. RECURRING AGENT INTERVENTIONS — the session does these multiple times, unprompted

- **Re-apply the guiding questions and `/oak-metacognition`** at every collection boundary and every owner
  pointer — not only at session open.
- **Periodic comms sweep.** The pipe-less all-channels watcher (§2 wiring) covers incoming events; at n≥2 a
  120s fallback sweep covers any surface the monitor cannot watch. Poll after posting any deadline-bearing event.
- **Host re-check between batches.** `uptime` vs core count and `vm.swapusage`. Swap is chronically elevated
  on this host; the 1-minute load (not the 5/15-min) and the local gate run-time are the decisive signals.
- **Keep `coverage-ledger.md` current EVERY increment.** The ledger IS the mid-session continuity surface;
  updating it each increment is the light continuity refresh — no separate end-of-increment handoff needed.
- **Pacing reassessment at each collection boundary** (§4.3).
- **Watch your own context budget (PDR-063 mid-cycle retirement).** At ~80% of your bounded budget, or
  immediately after a commit when the remaining budget would not cover one more full increment: freeze to a
  handoff record, author the next runbook doc (`09`), update the ledger `WINDOW STATE`, hand off, and retire.
  Do not push for one more increment past the 80% trigger.

## 6. CRITICALLY ASSESSING SUB-AGENT WORK — non-negotiable (the survey's only quality backstop)

The instrument already runs a 4-agent pipeline per plan: holistic + conformance-vs-V0 + a routed specialist
(or 2nd-angle) reader on Sonnet, then an **adversarial verifier on Opus** that tries to REFUTE each
high-stakes load-bearing claim and defaults to refuted/uncertain on doubt. That gate is the structural
defence. The orchestrator adds the human-judgement layer the schema cannot:

- **HALT-don't-fabricate.** A plan that cannot be read is `unreadable=true`, never an invented finding.
  All-`unreadable` is a budget signal, not a result. Distinguish genuine-unreadable (path wrong / file
  missing — investigate) from budget-depletion (`<failures>` shows `session limit` — owner reset).
- **input-to-verify everything** — every sub-agent finding, every prior doc, this doc included.
- **`file:line` for every load-bearing claim.** Re-derive divergent counts first-hand; **never average**
  two disagreeing reads — go back to the source.
- **The spot-audit (Step F)** at least once per collection: read raw findings first-hand and confirm they
  trace to the plan. This catches plausible-but-ungrounded sub-agent output that passes schema validation.
- **Sanity-check each return's distribution** (Step E). A degenerate all-keep/all-good batch is a smell to
  investigate, not a result to trust.
- **Locked contradictions are never suppressed** — they route to the owner regardless of convenience.
- **No silent truncation.** Every dropped surface, every re-survey, every coverage bound is logged.
- **V0 is provisional.** Strong estate evidence against a LOCKED V0 decision is a re-ratification candidate,
  surfaced — never quietly conformed-away.

## 7. The remaining roadmap (after Pass-1 completes)

1. **70-AEE idea-granular back-fill (BEFORE Pass-3).** A focused **holistic-only** pass over all 70 AEE
   plans capturing ONLY `salvage_value` + `substance_class` + `content_quality` (no conformance / specialist
   / verify redo — AEE already has those). Makes the idea-inventory uniform across all 286 so the no-loss
   audit has a complete substrate. Author a thin holistic-only variant of the instrument, or trim the full
   one. Flag the V1-fold seat when it lands.
2. **Pass-2 — cross-cutting (barrier after Pass-1; separate workflow).** Four relational angles
   (across-plans / across-collections / plans↔threads / plans↔adjacent) PLUS Saffron's Spec-1 per-choice
   effectiveness/adequacy widening. Carry the unassigned effectiveness-arm reviewer to the owner first (§4.5).
3. **Pass-3 — synthesis + completeness-critic, loop-until-dry (2 consecutive clean rounds).**
   Orchestrator-in-the-loop. Run the back-fill BEFORE this.
4. **Dated outputs** — (1) conformance-and-traceability inventory → Stage-3 work-list; (2) cross-cutting
   patterns; (3) taxonomy grounding → V1; (4) coverage ledger; PLUS the per-choice effectiveness verdict,
   the good/bad/speculative inventory, and the **independent no-loss audit** (Saffron Spec-2 — a dedicated
   parallel session reporting GO/NO-GO to the owner, not a survey pass).

## 8. Hard-won operational notes (this session's learnings — read before repeating the loop)

- **Budget model.** A window ≈ 35–63 plans of fan-out. Depletion is abrupt and detected only by the
  all-`unreadable` + `session limit` signal — there is no advance warning. Small increments bound the
  wasted fire when the wall hits. With a concurrent peer, pace to ~35 and leave headroom.
- **Shared checkout reality.** Two agents on one branch share `.git` and the working tree; commits interleave
  on one HEAD. Explicit-pathspec staging keeps CONTENT separate; the turbo pre-commit gate couples through
  the working tree (§4.4).
- **Shell gotchas:** (1) the working directory **persists between Bash calls** — a `cd` into the report dir
  once broke a later pathspec commit; stay at repo root. (2) zsh does **not** expand a glob stored in a shell
  variable — use the glob **inline** on the jq command line for collection rollups. (3) Long `comms append
  --body` strings with em-dashes hit `Exit status 2`; use `--body-file`. (4) The hook policy **substring-matches
  comms bodies** — a body that merely *describes* a gate-bypass flag is blocked; reword the prose.
- **The instrument under session-limit** returns per-plan `null` holistic fields (so `unreadable=true`),
  never fabricated content — the discipline is built in and was proven under a real wall this session.

## 9. Disciplines — non-negotiable (your only backstop as a sole/lightly-checked agent)

HALT-don't-fabricate · `file:line` for every load-bearing claim, re-derive divergent counts (never average)
· input-to-verify (every finding, every prior doc, this doc) · V0 is provisional (locked-contradictions →
owner re-ratification, never suppressed) · no PII · log every coverage bound (no silent truncation) ·
conserve granularity < session-death granularity (small Workflow calls, conserve+commit each) · all quality
gates blocking always (stop, surface, wait — never bypass without fresh owner authorisation).

## 10. Pickup contract

Read this (`08`) + `07` + `coverage-ledger.md` + the instrument `survey-pass1.workflow.js` first-hand.
Open your OWN orchestrator claim on `.agent/reports/plan-estate-survey-2026-06-21/**` (Cosmos calls
Infinity's `3a5e8798` is relinquished at closeout). Arm the canonical all-channels comms watcher
**PIPE-LESS** (no grep filter — F-82). Heartbeat OFF unless a consuming peer is observable. If a peer is
registered, verify their claim disjoint first-hand and adopt the n=2 + shared-checkout protocols (§4.4).
Then continue from §3, collection by collection. Owner controls push; owner resets the budget window (§4.1).
