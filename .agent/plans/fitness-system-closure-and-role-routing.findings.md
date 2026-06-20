# Fitness System — Closure & Role-Routing — Findings & Decision Record

**Type**: Session findings-and-decision record (independent baseline).
**Status**: Findings complete and committed (`547d889c9`). Written as the pre-pull
independent baseline; same-session events after the baseline (commits, the remote
merge, session-handoff, claim close) are recorded in the **Post-write update** note
below, which supersedes the write-time snapshots in §0 and §8.
**Thread**: `agentic-engineering-enhancements` (Practice continuity & curation).
**Session identity**: Finch binds Halo · claude · Opus 4.8 (1M) · session `b0831c` ·
2026-06-20.
**Branch**: `docs/planning-and-validation`.
**Sibling of**: `.agent/plans/vision-strategy-and-plan-estate.plan.md` (placed here
deliberately — see §0).

**Related artefacts** (all in-repo; not provenance pointers, working homes):

- `.agent/plans/agentic-engineering-enhancements/current/fitness-system-closure-and-role-routing.plan.md`
  — the executable backbone authored this session (untracked at write time).
- `.agent/directives/continuity-practice.md` — `§Disposition of Continuity Surfaces`,
  `§Surface Roles` (the doctrine to be extended).
- `docs/architecture/architectural-decisions/` — ADR-144 (three-zone fitness model;
  host mechanics to be amended).
- `agent-tools/src/practice-fitness/` — the validator (`markdown.ts`, `run.ts`).
- PDR-094 / ADR-199 + `.agent/reports/agentic-engineering/` — where the retired
  research record's insight is already homed.

## Post-write update (2026-06-20)

This record was authored as the **pre-pull independent baseline**, then — later the
same session, on owner direction — the work was committed and integrated. The
write-time snapshots further down (the §0 "not yet pulled" framing; the §8 claim,
working-tree, and remote bullets) are **superseded by this note**:

- **Committed** in three chunks by concern: findings record + backbone plan
  (`547d889c9`), compliance lane (`d1387b81f`), strategy lane (`453896d64`).
- **Remote merged** (`6f89ad64a`): the 8 broad planning-cluster commits are now in the
  tree. They have still **not been read or compared** — the §11 integration is pending.
- **Session-handoff** run (`b359631d8`): continuity surfaces refreshed; the curator
  claim is **closed**. Branch is 0 behind / 38 ahead, **unpushed** (owner controls push).

---

## 0. What this document is, and why it exists now

This is a **deeply detailed, self-contained record** of a jointly-designed (owner +
agent) resolution of a recurring Practice signal. It is written deliberately
**before** pulling or reading the fresh changes on the remote instance of this
branch.

At the time of writing, the remote `docs/planning-and-validation` was **8 commits
ahead** of local and carried **additional documents that are siblings in location**
(`.agent/plans/`) — **not in subject**. They relate to the fitness functions only
tangentially; they are **far broader** (the planning/validation/strategy estate). At
write time those commits had **not been fetched into the working tree, inspected, or
read** (they were merged later in the session — see the Post-write update) — by
explicit owner instruction ("do not pull the fresh changes from the remote until I tell you to") and
because it is the correct epistemic hygiene: writing our conclusions as an
**independent baseline** keeps the subsequent reconciliation clean. Reading theirs
first would anchor ours and destroy that value.

Therefore this document must stand entirely on its own — every finding, decision,
rejected option, rationale, and loose end is captured here, because the session
context that produced it will not survive to the comparison.

**Genre note (and a point of doctrinal honesty).** This file declares **no
`fitness_*` frontmatter**, so the fitness validator does not measure it. That is
*role-appropriate*, not a convenient exemption: it is a dated, frozen
findings/evidence record (the same genre as `*.research.md` and `.agent/reports/`),
whose role is to be a complete record, not a flow-controlled buffer. It is not an
accretion surface and nothing is pushed into it to relieve another file's budget, so
it cannot act as a gaming drain — the one residual question (is the findings/report
genre itself a closure frontier?) is logged in §7. Stating this explicitly is
deliberate: the doctrine below is *about* not leaving unmeasured surfaces, so this
one earns its non-measurement out loud.

---

## 1. Origin and session lineage

The task arrived as a narrow pointer inherited from the previous session: **four
long-lived continuity records sit at prose-line-width `hard`**, and the owner
directed that the next session "analyse these files, then jointly work out the
proper action for records of this shape, then save that decision as a future
protocol to refine."

The prior-session lane (in the `agentic-engineering-enhancements` thread record)
framed the open question as: *"reflow the reflowable prose while exempting genuine
table rows; raise/relax the width metric for this `merge_class`; split the metric
(table-aware); or accept-and-annotate?"*

**This document answers that lane and corrects its framing.** Two of those four
options ("split the metric (table-aware)", "exempt genuine table rows") presuppose
the metric is naive about tables. First-hand reading of the validator generator
showed it is already table-, link-, and frontmatter-aware (§3.2). The prior lane was
authored without reading the generator; this record sets it straight.

---

## 2. Owner framing — the north star (captured faithfully)

The owner supplied the framing that re-shaped the whole analysis. In substance:

1. **The fitness triad evolved as an anti-gaming measure.** "I tried fixing word
   count, the agent wrote long words; I tried fixing number of lines, the agents
   wrote long lines… the combination of number of lines and characters and line
   length is so that the system can't be gamed." The three dimensions are
   *interlocking*; relaxing one re-opens a gaming channel.
2. **Beyond anti-gaming, the goal is documents that remain useful and effective
   because they are not allowed to sprawl.** That is it. There may be more
   dimensions to consider, but that is the starting point.
3. **How the system works today is not a constraint.** Whether the gate blocks or
   not doesn't matter — it can be changed. Design from the goal, not the
   implementation.
4. **Maximise**: utility, agent experience, and effectiveness of knowledge transfer.
5. **An unmeasured surface is a surface to game.** When per-file *frontmatter* was
   proposed as the home for role declarations, the owner noted frontmatter must
   itself carry feedback ("it doesn't have to be the same measure, but there should
   be some kind of feedback that discourages sticking everything in the frontmatter
   to game the system").
6. **A plan with many todos is a signal** that it should be split / reorganised to
   deliver value along agile principles — and **frontmatter budgets can help surface
   that signal** (one declaration mechanism, surfaced uniformly).
7. **Interaction style**: this was framed as joint reflection, to be worked through
   in discussion, not via multiple-choice menus (captured as a refined feedback
   memory; the question tool stays appropriate for crisp/transactional forks).

---

## 3. First-hand findings (verified, with sources)

### 3.1 The four records are three different cases, not one

| Record | State | Genuine over-width prose lines | Max measurable prose width | What it actually is |
|---|---|---|---|---|
| `statusline-enhancements.next-session.md` | live | **1** | 136 / 100 (L40) | one dense set-notation sentence beside the identity table |
| `repo-continuity.md` | live | 18 | 107 / 100 (L80) | dense operational prose, mostly *just over* 100 |
| `agentic-engineering-enhancements.next-session.md` | live | 31 | 135 / 100 (L172) | dense narrative + numbered burndown lists |
| `retired/agent-collaboration-research.next-session.md` | **retired** | 81 | 112 / 100 (L63) | concluded WS7 session-boundary narrative; insight already homed |

(`napkin.md` is also width-`hard` at 109/100 over 9 lines, but it is a drainable
buffer from the prior session's close, **not** one of the four; out of scope here.)

### 3.2 The prose-width metric is already structure-aware (correction)

Source: `agent-tools/src/practice-fitness/markdown.ts`. `classifyLines` /
`classifyContentLine` assign each line a kind and the width check only applies to
`prose`. Excluded by construction:

- **frontmatter** (filtered before measuring);
- **code fences and code blocks**;
- **table rows** (`text.trim().startsWith('|')`);
- **link-reference definition lines** (`/^\[[\w.-]+\]:\s/`).

And for prose lines, `measurableProseWidth` **strips the unwrappable parts before
measuring**: inline-link targets `[visible](target)` keep only the visible text;
autolinks `<https://…>` and bare URLs are removed. The explicit rationale in-source:
the check exists "to flag prose a human could and should wrap," and a URL/path
cannot be wrapped.

**Consequence**: the flagged counts above are **genuine long prose sentences** —
after tables, links, and URLs are already exempted. "Make the metric table-aware" is
already done. The 1017-char table row in `repo-continuity` and the 174-char
frontmatter `overflow_disposition` literal are **not** what flags these files.

### 3.3 Fitness never blocks (verified end-to-end)

Source: `run.ts:175` returns exit `0` unconditionally, with an in-code comment that
"fitness never fails a build. The exit code is always 0; the mode governs report
framing only." Confirmed at the script entry: `validate-practice-fitness.ts` does
`process.exit(await runPracticeFitnessCheck())`, i.e. always 0. `--strict-hard`
changes report framing, not exit status.

**Consequence**: leaving a record at `hard` has **zero blocking consequence**. This
is a **signal-honesty and knowledge-flow** question, not a gate-pressure one. (This
retired an earlier worry that "leave-if-live" would keep a closure gate permanently
red — there is no such gate.)

### 3.4 The existing doctrine and its precise gap

`continuity-practice.md §Disposition of Continuity Surfaces` already governs these
records — but only for **size** (line/char count): *live → leave in place, verbatim,
"however large"; finished → conserve the durable insight into its permanent home,
then delete the curated residue (git retains the literal record).* It is **silent on
prose-width**. That silence is why the question recurs every session as a formatting
judgement call.

`§Surface Roles` already carries a table of what each surface is for (a good hook for
the role-declaration work). `threads/README.md` carries the **retirement-banner
convention** (retired records keep a banner and are indexed nowhere in active/paused).

### 3.5 The uncommitted no-throw change in `repo-continuity.md`

At session start the only dirty file was `repo-continuity.md`, carrying a peer
(Siren mends Rudder) update to the `§ Current State` no-throw entry: from the old
"ESLint no-throw → Result migration — IN EXECUTION (convert-all)" framing to
"**no-throw remediation — RESHAPED 2026-06-19; READY (survey-first); PAUSED for the
strategy thread**." Verified **accurate**: it matches the already-committed plan
reshape (`24b2b7f6a`), names the 4 conversions landed so far (`1556b9191` Merlin;
`93beffcfe` / `304b68f8d` / `61bdbc3e4` Siren mends Rudder, ~5 src throws of ~1000),
and notes unpushed/owner-controls-push. `repo-continuity`'s own invariant says shared
memory files are commit-includable when dirty.

**Reconciliation status**: NOT committed this session (no further changes). **Note**:
the working tree has since acquired **owner parallel edits** to `repo-continuity.md`
(and other strategy-thread files — §8), so the no-throw entry is now entangled with
owner edits; reconciliation must be done carefully by the owner / next session, not
mechanically.

### 3.6 The retired record carries a *live* work-list

`retired/agent-collaboration-research.next-session.md` is retired, and its findings
are homed (PDR-094, ADR-199, the `reports/agentic-engineering/` synthesis). But it
still carries a **standing live residual**: ~**1,707 coordination-tier comms events**
past the 7d window "awaiting curator disposition," plus the verification recipe, in
its `§"WS7 Closeout — Conserved Findings"`. So it is not purely frozen — a live
work-list runs through a retired record (its own small smell; see §5/§7).

---

## 4. The design journey — and what was rejected (so it is not re-litigated)

The final shape was reached by successive correction; recording the path prevents a
future agent (or the comparison) from re-opening settled-and-rejected options.

| Turn | Proposal considered | Verdict | Why |
|---|---|---|---|
| 1 | Reflow genuine prose / "accept-and-annotate" / make metric table-aware | superseded | metric already structure-aware (§3.2); reflow-as-a-pass is score-chasing |
| 2 | **Relax / raise `fitness_line_length` for the `index-narrative-tables` merge_class** | **REJECTED** | re-opens the exact "hide bloat in long lines" gaming channel the triad closed, on the highest-churn surfaces |
| 2 | Leave-if-live, keep 100, accept permanent red | weak | harmless (never blocks) but a perpetually-red signal trains agents to discount fitness — corrosive to the whole system |
| 2 | Wrap genuine prose as a dedicated pass | REJECTED | reflow-for-score; recurring churn on high-churn surfaces |
| 3 | Frontmatter as the home for role declarations | adopted | co-locates the curation routing with the artefact (active gate, not passive guidance) |
| 4 | Frontmatter left unmeasured ("it's free of the budget") | **REJECTED** | an unmeasured surface is a gaming drain by construction (owner catch) |
| 4 | Whole-file char budget (frontmatter + body counted together) | considered, **not chosen** | elegant (zero arbitrage) but legitimate metadata would compete with body budget |
| 4 | **Separate, smaller frontmatter char budget** | **DECIDED** | bounds frontmatter without penalising proper metadata; a "different measure" |
| 5 | Plan with many todos → split | adopted as **agile value-decomposition** | with the no-shard-for-score guard (count-driven sharding fragments the estate — a worse failure) |
| 6 | Retired record → exclude `threads/retired/` from the sweep | considered | superseded by the better cure: curate to a compact stub (insight is homed) and relocate the live work-list |

The arc in one line: *relax-width (wrong) → curation-trigger → closure principle →
frontmatter-as-substrate with its own budget → plan-todo routing → all of it
collapses into one mechanism and one principle.*

---

## 5. The locked design — the doctrine

### 5.1 The unifying principle — Closure & Role-Routing

The fitness system is **not N independent metrics**. It is **one philosophy with two
halves**:

- **Closure.** Measure every content-bearing surface — or the unmeasured one becomes
  the surface content is pushed into to game the measured ones. The triad's own
  history *is* this principle discovered one leak at a time (words → lines →
  line-length → frontmatter). Closure is **operationalised by each surface declaring
  its budgets in frontmatter, including frontmatter's own budget** — the recursion
  that makes the system self-describing. **Adding an unmeasured content-bearing
  surface is a defect by construction.**
- **Role-routing.** A budget overage routes to the **structural cure the surface's
  role implies**, never to trimming or sharding for score:
  - **memory / continuity** → graduate finished or mis-placed substance to its
    permanent home (knowledge conserved by *moving*, never by deletion);
  - **plans** → decompose into independently-valuable increments (agile vertical
    slices); a genuinely atomic large plan keeps its count, which itself flags
    big-bang risk to weigh with the owner;
  - **frontmatter** → stop dumping; reference the doctrine home instead.

**The anti-gaming guard transfers across all surfaces: never split, shard, reflow,
or trim to change a number.** Knowledge preservation is absolute; the cure is always
graduation/decomposition, never deletion or compression of substance.

### 5.2 Decisions

| # | Decision | Status |
|---|---|---|
| D1 | Name **Closure & Role-Routing** as durable doctrine | **DECIDED (yes to naming)** |
| D1a | Home: a new **PDR-106** (the philosophy — re-derived across any Practice-bearing repo) + an **ADR-144 amendment** (the host mechanics: frontmatter metric, role-routing of overages). Folding into `principles.md` instead is the lighter alternative but loses the decision-record's rationale/supersession machinery | **RECOMMENDED — owner not yet confirmed** (this was the open question when the session pivoted to writing this record) |
| D2 | **Separate, smaller frontmatter char budget** (distinct from the body char budget) | **DECIDED** |
| D3 | Extend `§Disposition`: a limit-hit on a surface is a **role-appropriate curation/restructure trigger**; graduate/decompose — never trim, reflow, or shard for score; **tighten the "however large" clause** (live protects *essential* live state from premature deletion, not unbounded sprawl); name **cross-file redundancy** as a sprawl channel the per-file triad cannot see | **DECIDED (direction)**; wording to be drafted (WS1) |
| D4 | Extend `§Surface Roles`: per-file **`purpose`** (one line) + this-file routing deltas in frontmatter; the **full type-level "for / not-for" lives once, keyed by `merge_class`**, to avoid re-introducing duplication. "Not-for" entries are **positive routing** (destinations), never negation-tombstones | **DECIDED (direction)** |
| D5 | **Plan-todo routing**: a plan's item-count overage routes to **agile value-decomposition**, with the no-shard-for-score / no-estate-fragmentation guard. Surfaced via the same frontmatter-declared-budget mechanism (reuse `item-count.ts`) | **DECIDED (direction)** |
| D6 | **Record-type templates** for the three continuity record shapes (operational index, thread next-session, retired-record stub), encoding the frontmatter fields and conventions so new records start on-role | **DECIDED (to author)** |
| D7 | Curate the four records to rest by **homing substance** (graduate finished content, relocate mis-placed detail), never by reflow. Retired record → compact banner-stub + relocate its live work-list. Reconcile the no-throw change carefully (now entangled with owner edits) | **DECIDED (direction)**; not executed this session |

### 5.3 Why this serves the three north-stars

- **Utility / non-sprawl**: a surface that declares its role stays on-role; the
  signal means "curate," which keeps the record a fast pickup surface.
- **Agent experience**: the limit fires → the agent reads the file's own
  `purpose`/routing → the right action is grounded in the artefact, not in recalled
  doctrine. Passive guidance becomes an active gate (the recurrence was passive
  guidance losing to artefact gravity).
- **Knowledge transfer**: the "not-for" routing list *is* the graduation map made
  local — it tells the next reader where each kind of content belongs.
- **Un-gameable end-to-end**: graduated content lands in ADRs/PDRs/plans that carry
  the *same* triad, so sprawl can't be shoved downstream; the separate frontmatter
  budget self-enforces "don't duplicate the type-role into every file."

---

## 6. Execution backbone (reference)

The executable form is
`.agent/plans/agentic-engineering-enhancements/current/fitness-system-closure-and-role-routing.plan.md`
(authored this session, untracked at write time). Its six workstreams, sequenced by
the agile principle the design itself adopts (doctrine ships first; enforcement
follows; each slice independently shippable):

- **WS0** — name the Closure & Role-Routing principle (PDR-106) + ADR-144 amendment.
- **WS1** — extend `continuity-practice.md` §Disposition + §Surface Roles.
- **WS2** — define the frontmatter `purpose`/routing fields + the separate
  `fitness_frontmatter_char_limit`; apply to the continuity record-types.
- **WS3** — author the three record-type templates.
- **WS4** — curate the four records to rest; reconcile no-throw; retire the research
  record to a stub and relocate its live work-list.
- **WS5** *(delegated → `agent-tooling/`)* — implement the frontmatter char-budget
  metric in `agent-tools/practice-fitness` (TDD).
- **WS6** — name the plan-todo → agile-decomposition routing; enable plans to declare
  an item-count budget.

**Estate boundary**: doctrine, templates, and curation live in
`agentic-engineering-enhancements/`; the validator code change (WS5) is the
`agent-tools/` workspace and is delegated to `agent-tooling/` per that collection's
scope boundary.

**Reviewers** (no backfill — at each stage): `docs-adr-expert` (doctrine, PDR/ADR);
`test-expert` + `config-expert` (validator metric); `assumptions-expert` (plan
proportionality, blocking legitimacy).

---

## 7. Open questions / decision-debt (nothing decided silently)

1. **PDR vs `principles.md` home for the principle** (D1a) — recommended PDR-106 +
   ADR-144 amendment; owner not yet confirmed.
2. **Frontmatter budget value** — to be set from the record *type's* legitimate
   metadata weight (principled), not fitted to current offenders. (The repeated
   174-char `overflow_disposition` literal is itself a candidate to replace with a
   short pointer once the budget bites.)
3. **Residual width disposition for genuine prose once doctrine lands** — curate;
   wrap only opportunistically when editing the line anyway; never a dedicated pass.
4. **Scope of the role-declaration / closure rollout** — applied to the continuity
   record-types now; propagate to other fitness-bearing files *as touched*, not a
   big-bang re-frontmatter. `MEMORY.md` and `napkin` (also width-`hard`) are
   explicitly **out of scope** here (per-user buffer drain is a separate lane).
5. **Retired-record cure** — lean: curate to a compact banner-stub (insight is
   homed) and **relocate the ~1,707-event live work-list to a live home** before the
   record is frozen; the alternative (exclude `threads/retired/` from the sweep) is
   inferior because it would hide the prompt to finish the retirement curation.
6. **Plan-todo metric wiring** — verify in execution whether `item-count.ts` already
   applies to plans or needs new config; do not assume.
7. **Closure frontier (honest residual)** — the findings/report/research genre is
   currently unmeasured by design (role = evidence). If that genre ever became a
   dumping pattern to keep buffers green, closure would need extending to it. Logged,
   not actioned.

---

## 8. Adversarial context sweep — everything that must not be lost

- **Verified source facts**: `markdown.ts` classification + `measurableProseWidth`
  stripping (§3.2); `run.ts:175` + `validate-practice-fitness.ts` exit-0 (§3.3). The
  four records' exact width numbers (§3.1).
- **Owner framing** (§2) — captured faithfully; it is the north star and the reason
  the analysis reshaped.
- **Rejected options + why** (§4) — relax-width, whole-file budget, wrap-as-pass,
  exclude-retired, "metric is naive" — all closed, with reasons, so they are not
  re-opened.
- **Prior-lane correction** — the four-files lane in the agentic thread record listed
  table-awareness as open; it is already implemented. This record supersedes that
  framing.
- **Memory written this session** (outside the repo, in Claude per-user memory):
  `feedback_joint_reflection_wants_discussion_not_menus` — created, then **refined**
  on owner correction to "don't over-generalise: discuss in joint reflective design;
  the question tool stays right for crisp/transactional forks — judge the work's
  shape." No other repo content was changed by me except the backbone plan (§6) and
  this document.
- **Curator claim** (collaboration state, untracked): a `curator`-role claim was
  opened on the lane files (`continuity-practice.md`, the four records, the backbone
  plan) at 2026-06-20T05:34:25Z. It is **now closed** (archived to
  `closed-claims.archive.json`) as part of the session-handoff.
- **Working-tree state**: at the baseline write-time these were uncommitted — a
  parallel strategy-lane session's edits across `napkin.md`, `repo-continuity.md`, the
  strategy thread record, `plans/compliance/roadmap.md`,
  `plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md`,
  `plans/vision-strategy-and-plan-estate.plan.md`, `.vscode/settings.json`, plus the
  strategy opener. The owner then assigned them to this session; they are **now
  committed** (`453896d64`, `d1387b81f`) by concern, and the tree is clean.
- **Remote**: at write-time the branch was **8 behind / 33 ahead**; the 8 remote
  commits were not yet fetched or read. They are **now merged** (`6f89ad64a`) but
  **still not read or compared** (the §11 integration is pending). Branch is now
  **0 behind / 38 ahead**, **unpushed** (owner controls push).
- **No-throw specifics** (§3.5): plan reshape `24b2b7f6a`; conversions `1556b9191`,
  `93beffcfe`, `304b68f8d`, `61bdbc3e4`; uncommitted in `repo-continuity`, now
  entangled with owner edits.
- **Host**: load fine (≈1.4 on 14 cores, falling); swap high (~6.2G) but no active
  thrashing — irrelevant to this markdown-only session, noted for completeness.

---

## 9. Session handoff

- **Identity / mode**: Finch binds Halo; `dedicated-knowledge-curation`, scoped to
  doctrine design + this record (not a buffer drain).
- **What landed**: this findings record; the executable backbone plan (§6); one
  refined per-user memory (§8). **No doctrine, code, or record-curation changes** —
  all execution is deliberately deferred (the owner directed "no further changes this
  session; write everything down").
- **Four-files lane status**: **analysed and decided** (this record). Awaiting (a)
  the owner's confirmation of the PDR/ADR home (D1a), (b) execution of WS0–WS6, and
  (c) the comparison against the remote sibling documents (§11).
- **Standing instruction carried forward**: **do not pull the remote** until the
  owner says so.
- **Next session pickup**: read this record first; then the backbone plan; do **not**
  read the remote siblings until the owner authorises the comparison; resolve D1a;
  begin WS0 with `docs-adr-expert`.

---

## 10. Metacognition reflection

What changed across the session, and why: the task arrived as a narrow pointer
("four files at `hard`") and the real scope was the **design philosophy of the
fitness system**. Generative metacognition working as intended — the pointer opened
to the goal.

Two **fluency catches** are worth keeping, because both were smooth moves that
bypassed the situational check the owner's framing supplied:

1. *"Width inherits leave-if-live; calibrate the limit up for this merge_class."* It
   matched an existing shape and arrived easily — and would have **punched a hole in
   the un-gameable triad** on the highest-churn surfaces. The check I skipped: *why
   does the triad exist?* (anti-gaming).
2. *"Frontmatter is free of the budget."* Presented an **unmeasured surface as a
   benefit** inside an anti-gaming conversation — the same error inverted. The owner
   caught it; the cure generalised into the **closure** half of the principle.

The deeper lesson is that the four conversational additions (continuity sprawl,
frontmatter gaming, plan todos, one-mechanism collapse) were never separate — they
were one principle surfacing in new surfaces. Naming **Closure & Role-Routing** is
the structural, recur-proof cure (per the metacognition directive's §Cure Shape):
the next agent who adds a surface inherits "ship it with feedback (closure) and route
its overage to the role-cure (role-routing)," instead of re-deriving it leak by leak.

Finally, the owner enforced an **independent-baseline protocol** (write ours before
reading theirs). That is good epistemic hygiene — it protects this derivation from
anchoring on the remote siblings, which is the entire point of §11.

---

## 11. Relationship to the remote siblings & integration protocol

The remote documents are **siblings in location, not subject** — they sit in
`.agent/plans/` alongside this record, but they are **far broader** than the fitness
functions (the planning/validation/strategy estate; the branch is
`docs/planning-and-validation`). So this is **not** a fitness-vs-fitness diff. This
record is one **well-formed, independent member** of that broader incoming set, and
the point of writing it first — uncontaminated by the remote — is that it can be
placed and reconciled into the estate cleanly rather than tangled into a merge.

When the owner authorises the pull, integrate it as follows:

1. **Place** this record (and its backbone plan) as a member of the `.agent/plans/`
   estate alongside the incoming siblings; confirm it does not duplicate one of them.
2. **Where subjects genuinely touch** (fitness, sprawl, validation discipline, plan
   conformance/traceability — note the strategy lane's own Body-3 work already
   invokes a plan-conformance validator and the fitness apparatus), apply the
   divergence discipline: crosswalk shared intent, name agreement (corroboration) vs
   difference (reconcile on merit, not recency), record dropped scope with
   supersession mappings — never a standalone crosswalk plan.
3. **Where they do not touch**, this is ordinary estate integration: cross-link, and
   let the broader planning/validation work own its scope.

Writing this as an independent baseline first is the value: an uncontaminated member
that slots into the broader estate, and a sharp signal wherever the subjects do meet.
