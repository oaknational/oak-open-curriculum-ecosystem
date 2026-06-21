# Survey Orchestration — Deep Handoff & Linear Plan for the SOLE Successor (v4)

> 2026-06-21. From **Anvil lifts Solder** (34f6b3, claim `3185b1ff`) to the **next session — a
> SOLE session** carrying on the deep plan-estate survey (owner-directed wind-down).
> SELF-CONTAINED: this doc + `06`/`05` (prior handoffs) + `00` (method) + `coverage-ledger.md` +
> the instrument `survey-pass1.workflow.js`, and you can resume immediately. **Everything is
> input-to-verify.** You are SOLE — no peer cross-checks you, so the disciplines in §6 are your
> only backstop. Run them without exception.

## 0. TL;DR — where the survey is

- **Pass-1 coverage: 106 / 286 plans (2 of 16 collections complete).**
  - `agentic-engineering-enhancements` — **70/70** (committed `fc108b684`, `e87ab281f`, `7496f7387`).
    *Caveat:* its substance fields are absent (1a, 1b-01..03) or coarse (1b-04) — it owes the
    **back-fill** (§5 step B).
  - `architecture-and-infrastructure` — **36/36** (committed `0b59c7934`, `71d3fbfe0`, `8dd00afa1`;
    conserved to `pass1-architecture-and-infrastructure-0{1,2,3}.json`). Native idea-granular fields.
- **Nothing in flight.** Clean boundary. The instrument is validated and working.
- **Branch:** `docs/planning-and-validation`, far ahead of upstream, **unpushed — owner controls push.**
- **Next safe step:** §5 — resume Pass-1 on a new collection (start with the largest un-surveyed, or
  the small `product-development-governance` to warm up), in ~12-plan increments, conserve+commit each.

## 1. What "the survey" is (one paragraph)

A read-only, multi-window survey of every non-archive `*.plan.md` (286 across 16 collections) that
produces, after three passes, the inputs the **Stage-3 two-pass restructure** (Saffron's lane)
consumes. The survey **identifies ideas read-only**; it never mutates the estate. The owner re-aimed
it from FORM (V0 conformance) toward **SUBSTANCE**: prove the corpus *effectively implements* the
strategy, the bad is gone, the speculative isolated, and **no useful idea is lost — provably**. See
§7 for the design you serve.

## 2. The instrument — `survey-pass1.workflow.js`

In this dir. A dynamic Workflow script. Per plan it runs a 4-agent pipeline (the brief's "≥3 reads +
adversarial verify"):

1. **Holistic** (Sonnet) — purpose, e/g/m, lifecycle, authority, health, value, classification
   (`keep|rewrite|archive-complete|extract-then-archive|rehome|new-for-gap|uncertain`), the
   load-bearing-claims list, AND the owner's **idea-granular substance fields**: `substance_class`
   (`good|mixed|bad|speculative` per-plan summary), `content_quality` (`strong|adequate|weak|empty`),
   and `salvage_value` = `[{idea, class: good|speculative|bad, file_line}]` (the load-bearing
   idea inventory the no-loss audit consumes).
2. **Conformance vs V0** (Sonnet) — scores the plan against the V0 `plan` node-schema; emits
   `locked_contradictions` (estate evidence vs a V0 LOCKED decision → owner re-ratification candidate).
3. **Specialist / 2nd-angle** (Sonnet) — one routed specialist by content signal, else a generalist
   second read.
4. **Adversarial verify** (Opus) — refutes each high-stakes load-bearing claim
   (`complete|superseded|orphaned|duplicate|dead`); default-refuted on uncertainty.

It is **validated** (the 5-plan smoke `wf_71bdbaed-484`, and 9 live increments across two
collections, all 0-`unreadable`). Do **not** rewrite it; copy it and pass plan paths via `args`.

## 3. End goal · mechanism · means · acceptance · non-goals

- **End goal:** a complete, evidence-grounded Pass-1 → Pass-2 → Pass-3 survey whose four+ dated
  outputs let the restructure achieve a corpus that *effectively implements* the strategy with **zero
  useful-idea loss**.
- **Mechanism:** per-plan deep reads with an adversarial verify gate produce grounded, idea-granular
  findings; cross-cutting + synthesis passes turn them into the restructure work-list, the taxonomy
  grounding (→ V1), and the no-loss inputs.
- **Means:** §5 — the remaining collections, the back-fill, Pass-2, Pass-3, the dated outputs.
- **Acceptance (outcome-level):** every non-archive plan Pass-1-surveyed and conserved+committed; the
  back-fill makes the AEE idea-inventory uniform; Pass-2 + Pass-3 complete (loop-until-dry, 2 clean
  rounds); the four+ dated outputs produced; the independent no-loss audit returns GO. **No silent
  truncation** — every coverage bound logged in `coverage-ledger.md`.
- **Non-goals:** the survey does NOT mutate the estate, author V1, or run the restructure (Saffron's
  lane, owner-gated); it does NOT survey the 168 archive plans (out of the ≥3-reads scope).

## 4. Prerequisites

- **Compute (blocking):** the session limit is **account-level**, shared across the rotating cast —
  *a fresh session is NOT a fresh window.* You can only fire a sub-batch when the owner-reset window
  has budget. If an increment returns all-`unreadable`, the window is spent — conserve nothing (there
  is nothing real), report it, and wait for the next reset. (Worked instance: Pinnace's first 1b
  attempt, ledger §WINDOW STATE.)
- **The V0 lens (beneficial):** `.agent/plans/product-development-governance/plan-node-schema.v0.md`
  — the conformance reader reads it each run. Already wired into the instrument.

## 5. The linear operating loop (do this, in order)

**Per collection, repeat the increment loop; finish a collection before starting the next.** Pace
roughly one ~35-plan sub-batch (≈ one collection, or a slice of a big one) per owner-reset window.

### Remaining Pass-1 collections (14 / ~180 plans) — derive paths from `worklist-plans.tsv` col `collection`

| Collection | Plans | Note |
| --- | --- | --- |
| `agent-tooling` | 59 | split into ~5 increments; Aardvark's monitor-fix plan landed (committed) — stable to read |
| `observability` | 31 | ~3 increments |
| `sdk-and-mcp-enhancements` | 28 | ~3 increments |
| `sector-engagement` | 12 | 1 increment |
| `semantic-search` | 11 | 1 increment |
| `connecting-oak-resources` | 10 | 1 increment |
| `discovery` | 9 | 1 increment |
| `user-experience` | 7 | 1 increment |
| `product-development-governance` | 4 | SAFE (Drake `4bf5d49fd`); good warm-up |
| `developer-experience` | 4 | 1 increment |
| `exploring-open-education-resources` | 2 | fold into a neighbour |
| `security-and-privacy` | 1 | fold |
| `school-data-search` | 1 | fold |
| `curriculum-mcp-path-to-ga` | 1 | fold |

> The 5 smoke plans were surveyed only as PROSE in `03` (no `pass1-*.json`) — they are re-surveyed
> for the structured inventory when their home collections run. Don't skip them.

### Step A — derive the next increment's plan paths

```bash
awk -F'\t' 'NR>1 && $1=="<collection>"{print $6}' \
  .agent/reports/plan-estate-survey-2026-06-21/worklist-plans.tsv | sort | nl -ba
```

Take ~8–12 paths for one increment (small bounds session-death loss to ≤ one increment, because the
Workflow returns only at the END of a call and cannot write to disk itself).

### Step B — (one-time, before Pass-3) the 70-AEE back-fill

A **focused holistic-only** pass over all 70 AEE plans capturing ONLY the idea-granular
`salvage_value` + `substance_class` + `content_quality` (no conformance/specialist/verify redo). The
no-loss audit needs a uniform idea-inventory across all 286 plans. Saffron confirmed: do this BEFORE
Pass-3; do NOT fold it into Pass-2 (a different lens). You may author a thin holistic-only variant of
the instrument for this, or reuse the full one (cheaper to trim). Flag Saffron on the seam when it
lands so she knows the inventory is uniform.

### Step C — copy the instrument and fire

```bash
cp .agent/reports/plan-estate-survey-2026-06-21/survey-pass1.workflow.js /tmp/<you>-survey.workflow.js
```

Then `Workflow({scriptPath: "/tmp/<you>-survey.workflow.js", args: ["<plan path>", ...]})`. `args` is
the plan-path ARRAY (the script parses array OR JSON-string defensively). It runs in the background;
you are notified on completion. ~12 plans ≈ ~50 agents / ~2M sub-agent tokens / ~5–6 min.

### Step D — conserve the return (the moment it lands)

The task output file wraps the workflow return under `.result`. Extract it to disk — do NOT read the
122k-char output into your own context:

```bash
OUT="<the task .output file path from the completion notification>"
DEST=".agent/reports/plan-estate-survey-2026-06-21/pass1-<collection>-NN.json"
jq 'if has("result") then .result else . end' "$OUT" > "$DEST"
jq -c '{batch_size, plans_returned, unreadable:(.unreadable|length), results:(.results|length)}' "$DEST"
```

If `unreadable` == `results` (all unreadable) the window is spent — delete the empty DEST, log the
bound in the ledger, and wait for reset. Otherwise tally:

```bash
for k in classification substance_class content_quality conformance; do
  echo "$k:"; jq -r "[.results[].$k]|group_by(.)|map(\"\(.[0])=\(length)\")|join(\", \")" "$DEST"; done
echo "ideas:"; jq '[.results[].salvage_value[]]|length' "$DEST"
echo "locked:"; jq '[.results[].locked_contradictions[]]|length' "$DEST"
echo "verdicts:"; jq -r '[.results[].high_stakes_verdicts[].verdict]|group_by(.)|map("\(.[0])=\(length)")|join(", ")' "$DEST"
```

### Step E — log coverage (no silent truncation)

Add one row to `coverage-ledger.md`'s Pass-1 table for the increment (unit, collection, plan range,
counts, conserved-to). When a collection completes, add the "After …: full <collection> complete" note
and update the running coverage total.

### Step F — commit by explicit pathspec (don't lose intermediate results)

```bash
MSG="docs(survey): conserve Pass-1 <collection> increment NN (<n> plans)"
pnpm agent-tools:check-commit-message -m "$MSG" \
  && git add -- .agent/reports/plan-estate-survey-2026-06-21/pass1-<collection>-NN.json \
                .agent/reports/plan-estate-survey-2026-06-21/coverage-ledger.md \
  && git commit -m "$MSG"
```

The pre-commit gate runs full-tree but is FULL-TURBO-cached for docs (~400ms). Stage ONLY your two
survey files by pathspec — never `git add -A` (a dirty rapid-comms/seam file or a peer's WIP must not
be swept in). Owner controls push.

### Step G — loop

Repeat C–F until the collection is done; then the next collection. Then the back-fill (B). Then:

- **Pass 2** — cross-cutting relational passes (4 angles: across-plans / across-collections /
  plans↔threads / plans↔adjacent) PLUS the per-choice effectiveness/adequacy widening from Saffron's
  **Spec 1** (§7). Barrier after Pass 1 (needs the full per-document set). Separate workflow.
- **Pass 3** — synthesis + completeness critic, **loop-until-dry (2 consecutive clean rounds)**.
  Orchestrator-in-the-loop. Run the back-fill BEFORE this.
- **Dated outputs** — (1) conformance-and-traceability inventory → Stage-3 work-list; (2) cross-cutting
  patterns; (3) taxonomy grounding → V1; (4) coverage ledger; PLUS the re-aim's per-choice
  effectiveness verdict, the good/bad/speculative inventory, and the **independent no-loss audit**
  (Saffron's **Spec 2** — a dedicated parallel session, not a survey pass; reports GO/NO-GO to owner).

## 6. Disciplines — non-negotiable (your only backstop as a sole agent)

- **HALT-don't-fabricate** — can't read a plan → `unreadable=true`, never an invented finding.
- **`file:line` for every load-bearing claim.** Re-derive divergent counts; never average.
- **input-to-verify** — every sub-agent finding, every prior doc, including this one.
- **V0 is provisional** — estate evidence contradicting a LOCKED V0 decision is a
  `locked_contradiction` (owner re-ratification candidate), **never suppressed**.
- **No PII.** **Log every coverage bound** in the ledger (no silent truncation).
- **Conserve granularity < session-death granularity** — small Workflow calls, conserve+commit each.

## 7. The substance design you serve (so synthesis serves the right end)

- **Re-aim:** substance, not theater — committed `14877e8d0` + `61489ce7e`. Atomic unit of curation =
  the **IDEA**, not the plan (a plan can hold good + bad + speculative at once).
- **Controlling plan Body 3 + Acceptance** (`vision-strategy-and-plan-estate.plan.md`): the corpus must
  be **effective, not merely aligned** — every strategic choice has *adequate serving plans* (gaps
  closed with authored new plans); every removed/moved idea carries a recorded disposition; **no-loss
  proven independently** by a dedicated parallel session reporting to the owner (scope: information +
  structure + relationships, not just ideas).
- **V0 §9:** *conformance is necessary, not sufficient* — V0 scores shape; the survey's substance
  signals + the restructure's substance gate judge whether content is good and the corpus effective.
- **Saffron's `restructure-substance-specs.md`** (3 Pass-2 specs, input-to-verify, committed
  `2a4df5423`): Spec 1 (per-choice effectiveness/adequacy — a Pass-2 output you fold in); Spec 2 (the
  independent no-loss-proof session); Spec 3 (trichotomy→disposition defaults). **Open OWNER item:**
  the effectiveness-arm reviewer is unassigned — not yours to self-resolve; carry it to the owner.

## 8. Routing & team

- Team is **n=2 → sole**. Saffron holds Sepal (0f0399) holds **V1-fold / Stage-3** (claim `333257e2`),
  **survey-gated** until synthesis (many windows out). If Saffron has also wound down, the V1-fold seat
  is dormant; the synthesized outputs are conserved for whoever holds it.
- **Synthesized outputs (after Passes 1–3) → the V1-fold seat (Saffron or successor).** Raw per-plan
  Pass-1 findings are NOT V1 input.
- **`locked_contradiction` flags → the owner** (re-ratification candidates; also V1-fold signal). The
  AEE + architecture batches already carry **14** of these — they are conserved in the `pass1-*.json`
  files; surface the set to the owner when you synthesise.
- **Continuity lane:** Saffron owns `thread-record + repo-continuity` for this thread (the 13:42Z
  continuity-split). Route survey-continuity prose through her, or — if sole — update the survey-lane
  portions yourself and keep her V1-fold lane untouched.

## 9. Pickup contract

Read this + `06`/`05` + `00` + `coverage-ledger.md` + the instrument first-hand. Open your OWN
orchestrator claim on `.agent/reports/plan-estate-survey-2026-06-21/**` (mine, `3185b1ff`, is
relinquished at my closeout). Arm the canonical all-channels comms watcher **PIPE-LESS** (no grep
filter — the `^[` reference shape silently swallows events; F-82). Then continue from §5. Owner
controls push.
