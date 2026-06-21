---
fitness_line_target: 700
fitness_line_limit: 1100
fitness_char_limit: 70000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard (see continuity-practice.md §Disposition of Continuity Surfaces)'
merge_class: index-narrative-tables
---
# Next-Session Record — `agentic-engineering-enhancements` thread

Practice continuity and temporary knowledge-curation. This is not a product
implementation thread. The full 142-session history (curation passes, the
feedback-mechanism arc, taxonomy work) is retained in git and in the
[`curator-passes/`](../curator-passes/) ledgers; this record carries the live
work brief and the recent identity stretch, per
[`continuity-practice.md` §Disposition](../../../directives/continuity-practice.md).

## WS-3 F-41 path-safety LANDED + the proper-question lesson (2026-06-21, Oyster weaves Surf)

Executed umbrella **WS-3 (F-41 path-safety)**. Landed (gate-green; unpushed — owner controls push):

- **b5408291d** — B1 consolidation: deleted TWO duplicate silent `findCollaborationRepoRoot` finders
  (`cli-comms-send`, `tui/config`) plus the bare `process.cwd()` fallback (`cli-comms-validate`) into one
  `resolveCoordinationHome`; reviewed by code-expert, architecture-expert-fred, test-expert.
- **c90150ffa** — the CORE fix. The coordination home is the **primary checkout**, resolved via
  `git worktree list --porcelain` (first entry), so an agent in ANY linked worktree resolves the ONE shared
  home — the real F-41 fix (a worktree seat was writing to / locked out of its own local registry), proven
  end-to-end from a real linked worktree. Reverted the needless `resolveRootFromDir` extraction.
- **4fd640089** — a closeout adversarial scan (architecture-expert-wilma) caught the commit-queue TOPIC still
  defaulting via `git rev-parse --show-toplevel` (linked worktree, not primary) — the exact commit-queue case
  the F-41 register names; routed through `resolveCoordinationHome`. **F-41 now closed across comms AND
  commit-queue defaults.**
- Docs: `5326dc02f`, `01275ed31`.

**B2 DEFERRED** (owner) → [`future/coordination-home-explicit-targeting-migration.plan.md`](../../../plans/agent-tooling/future/coordination-home-explicit-targeting-migration.plan.md):
the explicit-path write commands (claims/comms-inbox/watch/commit-queue) still `required(...)` their path
options, so from a linked worktree a relative path resolves against cwd (the wrong copy). Cure: default those
via `resolveCoordinationHome` when omitted, then migrate the estate's relative-path invocations (watcher rule,
commit skill, start-right, ~a dozen tests) to OMIT — one coordinated change.

**THE LESSON** (napkin + per-user memory): the plan handed a *solution* ("shared resolver; refuse relative
paths"); I executed it (full TDD + 3 reviews + commit + a deferred-migration brief) on a **mis-posed
question**. The owner re-posed it — *"find the primary checkout on a machine so worktrees share one comms
location"* — and the proper question forced the answer instantly (`git worktree list`), dissolving most of the
work. *No good solution without the proper question; with the proper question you already have the answer.*
Operationalisation candidate (PDR-shaped): a **forced-answer test** extending
`scope-from-goal-before-approach` and the generative-metacognition trigger. Sibling lesson: never assume
one checkout or a particular machine (many-checkout/many-machine is the default for coordination/path work).

**NEXT SAFE STEP**: F-41 is done. Next highest-impact AX item — execute
[`agent-tools-cli-ergonomics.plan.md`](../../../plans/agent-tooling/current/agent-tools-cli-ergonomics.plan.md)
from WS0 (retires the ~19-friction Class A), OR the umbrella's own spine **WS-4** (the `frictions-register`
drain validator). Owner controls push; the F-41 code commits + docs await safe remote integration.

## Agent Experience (AX) made first-class + umbrella plan (2026-06-21, Nova wakes Genesis)

Reviewed the promoted `coordination-watcher-canonicalisation` plan (sound; 4 findings
recorded in-chat), then — owner-directed — analysed the 82-entry
[`frictions-register.md`](../../../plans/agent-tooling/frictions-register.md) for agent
experience (AX) and made AX a first-class repo concept. **Landed (gate-green, committed —
see SHA below):**

- **Report** — [`agent-experience-cause-class-analysis-2026-06-21.md`](../../../reports/agent-experience-cause-class-analysis-2026-06-21.md):
  the 82 frictions collapse to 8 cause-classes; 3 AX layers; leverage ranking; the
  **drain-gap** (61/82 `open`, cures dispersed, no mechanical detector); and the
  load-bearing finding that the #1 cure (CLI conformance guard) is **already doctrine
  (PDR-055 cl.7–10) + already homed** (`agent-tools-cli-ergonomics.plan.md` WS6).
- **PDR-111** — *Agent Experience Is a First-Class Practice Optimisation Principle*
  (generalises PDR-060 + PDR-035). Indexed.
- **Always-on rule** `agent-experience-review-lens` (4 forms + RULES_INDEX; portability green).
- **principles.md** standing-concern line names AX.
- **Umbrella plan** [`agent-experience-improvement.plan.md`](../../../plans/agent-tooling/current/agent-experience-improvement.plan.md)
  (one umbrella, owner-chosen): DRIVES the homed cli-ergonomics + watcher plans; OWNS the
  net-new — the **structural drain-fix** (a `frictions-register` validator that recomputes
  integrity against fs/git + a generated routing index), **F-41 path-safety**, gate-coverage
  (F-54/F-57), and a disposition ledger routing all 82 frictions.
- Two `future/` briefs: `agent-frustration-corpus-survey` (deeper-survey next-step) and
  `peer-heartbeat-silence-alerting` (F-75, deferred).

**Gates**: markdownlint-check + portability + cross-link resolution all green; verified
first-hand. **Session lesson** (napkin): before planning a structural cure for a friction
class, verify it is not already doctrine + homed — the highest-leverage cure may already
exist; re-planning it fragments the estate (instance of check-workspace-before-proposing,
at plan-authoring time). **NEXT SAFE STEP**: implement the highest-impact item — execute
`agent-tools-cli-ergonomics.plan.md` from WS0 (the conformance guard, retires the ~19-friction
Class A); OR, if sequencing safety first, the umbrella plan's WS-3 (F-41 path-safety, small +
independent). See the opening statement in the handoff. Owner controls push.

## Dedicated consolidation (2026-06-21, Ferret seeks Tunnel)

Goal-gated drain processed the 2026-06-20/21 capture window bottom-up. The napkin rotated
(archived verbatim); two genuinely-new lessons graduated to `distilled.md` (the
product-vs-engineering decision locus; "an indiscriminate-rule warning count is a set of
cause-classes"); frictions F-75 (peer heartbeat-silence) recovered from a comms event that
never reached the register; the 2026-06-20/21 fluency-cluster + the `education=pupils` prior
recurrence routed to the action-time t2 inventory; commit `358a1636a`, gate green, NOT pushed.
**Graduations were promoted-and-assessed** (owner correction: we do not gate graduations on
approval — promote and assess): the README-index doc-architecture convention →
`development-practice.md` §Documentation Practice; directive-vs-Accepted-ADR precedence →
**PDR-107**; "culture as transmission of disposition" → practice-lineage §Active Principles —
all docs-adr-expert-assessed sound-as-homed (routed by intent: PDR vs governance-doc vs Core
principle).
The `education=pupils` guard was **rejected**: a removed incorrect concept is not enshrined as a
celebrated guard (its general lesson lives as pathogen evidence in the action-time t2 inventory).
pending-graduations drained to 0. The load-bearing session lesson (in the napkin): conservation's
organising axis is the knowledge flow walked bottom-up, never the fitness zones. The four
prose-width-hard records remain WS4's (below) — not reflowed; practice-lineage is now over its
line hard-limit from the culture promotion (preserved learning → graduate actives upward, never
compress). **EXECUTED 2026-06-21 (Ferret seeks Tunnel) — became a clarity-of-purpose restructure under three
owner reframes** (lineage is a git-like evolution record, not a principles store; PDRs are portable
while `principles.md` holds repo-cases; critical-assessment-of-subagents is standing universal
doctrine). `practice-lineage.md` restored to the evolution record (855 → 283 lines); §Learned
Principles + the what-it-is/how-to-apply duplicate sections evacuated by intent (no tombstones,
home-before-remove); **PDR-108/109/110** authored portable, **PDR-002/024** amended; every inbound
reference repointed (0 broken); docs-adr-expert assessed, findings re-read first-hand and folded.
**State: LANDED by the Director, Vesuvius calls Quench** — 18 files committed as `e30b987c0`
(owner-directed; full-tree knip green after the peer's markdown-links validator was wired, comms
`90a0f532`); this continuity handoff is the paired second commit. **NOT pushed** (owner controls
push). **NEXT SAFE STEP:** thread is at rest pending the next consolidation/curation pass. Detail:
the plan brief +
[`current/practice-lineage-principle-graduation.plan.md`](../../../plans/agentic-engineering-enhancements/current/practice-lineage-principle-graduation.plan.md)
(archive once landed). Window at handoff: Cutter, Ferret, Volcano retired; Drake hunts Beeswax
(implementer) and Vesuvius calls Quench (Director) live; a fresh survey-orchestrator session incoming.

## Dedicated consolidation — buffers at rest (2026-06-19, Finch binds Halo)

Goal-gated drain-all-buffers pass; the live curation buffers are at rest. The napkin
rotated (the 2026-06-18/19 window archived verbatim); pending-graduations is at
decision-debt 0; distilled holds 2 staged lessons (a directive-vs-Accepted-ADR
governance candidate surfaced to the owner, and a parse-by-stable-key technique
awaiting a 2nd instance).

The 3 prior "owner-gated" register items were DECIDED on best-effort (PDR-104), not
deferred — the over-caution doctrine they captured is already homed five ways, so the
"new synthesising PDR" route was rejected as the PDR-098 self-referential trap, and the
recurrence evidence (over-gating + negation-contrast, four agents this period) went to
the action-time-structural-interrupt t2 inventory. The open gap there is the firing
MECHANISM (PDR-098's empty quadrant), not more doctrine. Seven repo-local patterns and a
PDR-104 amendment (best-effort safety differs by session shape) landed the same pass.

Audits clean: 7c thread-register (no staleness, all banners present) and 7d
collaboration-state (one fresh claim, empty queue, valid JSON). One stale open
conversation (WS3A channel-choice, last entry 2026-04-26) surfaced for owner review, not
auto-closed.

**Open for a future pass (not curation debt):** the per-user Claude `MEMORY.md` buffer
(~153 entries) is near its context-load budget. The flagged over-long index lines are
fixed and two graduated duplicates drained, but it wants a dedicated drain pass —
graduating or retiring entries, where which preference entries are now stale is partly an
owner-preference call.

### Four prose-width-hard records — RESOLVED 2026-06-20 (Finch binds Halo): analysed, decided, captured

The four-files lane is resolved. First-hand analysis (including reading the fitness validator
generator) found the prose-width metric is ALREADY table/link/frontmatter-aware and that fitness
never blocks — so the records flag on genuine prose and the real gap was doctrinal, not metric.
The owner and I jointly designed the **Closure & Role-Routing** doctrine and captured it in two
committed artefacts: the findings record
[`fitness-system-closure-and-role-routing.findings.md`](../../../plans/agentic-engineering-enhancements/current/fitness-system-closure-and-role-routing.findings.md)
(independent baseline, sibling of the strategy plan) and the backbone plan
[`current/fitness-system-closure-and-role-routing.plan.md`](../../../plans/agentic-engineering-enhancements/current/fitness-system-closure-and-role-routing.plan.md).
The records were NOT reflowed (that is the fitness-chasing the owner forbids); curation is the
plan's WS4. The `repo-continuity` no-throw change is now committed (`453896d64`).

**Next:** execute the plan's WS0–WS6 — WS0 = PDR-106 (Closure & Role-Routing) + an ADR-144
amendment, with `docs-adr-expert`; the PDR-vs-`principles.md` home is the one owner decision still
open (findings §7 D1a). Then run the findings §11 integration comparison against the broad
planning cluster merged from the remote 2026-06-20 (governed-repo-document-graph, service-authority,
context-preservation, repo-intent), where subjects genuinely touch (context preservation / document
graph / knowledge boundaries vs sprawl and fitness).

## Collaboration-Doctrine Decomposition Lane — brief authored (2026-06-17, Phobos turns Singularity)

Authored [`agent-tooling/future/collaboration-directive-decomposition.plan.md`](../../../plans/agent-tooling/future/collaboration-directive-decomposition.plan.md)
(wired into `future/README.md` Plans table + comms/coordination cluster). It is the
**doctrine-surface counterpart** to the rightsizing keystone: the keystone decides *which*
coordination machinery survives; this brief decides *where* each surviving unit of doctrine lives,
routing every unit of the two collaboration directives (`agent-collaboration.md`,
`user-collaboration.md`) through the `new-rule-vs-pdr-clause` classifier and retiring the
directives as layer-blenders that predate the PDR corpus now owning their substance. **Key finding
fed back to the keystone's M2**: its M1-inventory plan to graduate the operating-context-mode *into*
`agent-collaboration.md` repeats the layer-blend — the tiered model should graduate to a PDR + rule
instead. **Promotion trigger**: keystone M2 ratifies the survival model, OR owner prioritises the
doc-hygiene axis. Not started; strategic only.

## Decision-Debt Lane — DRAINED (updated 2026-06-16, Limpet spins Headland)

**The drain is DONE — the pending-graduations register is at decision-debt 0** (was 72). This session
decided every item first-hand under an owner-directed **graduation quorum** (assumptions-expert +
docs-adr-expert + two Opus reviewers + primary correction): 17 lessons graduated to durable homes
(rules, ADRs, directives, exec-memory — quorum-cleared; commits `db6dd3f86`, `4fe1addb8`,
`a7c18a242`); ~50 items rejected with conservation verified first-hand (`597529bdf`); 4 tooling
frictions routed to the frictions register (F-60..F-63); and the 2 items that were neither doctrine
nor reject — TA1 (first-out closeout self-election) and P6 (Director routing-blockage) — recognised
as open QUESTIONS and routed to a new exploration plan
`team-autonomy-primitive-decisions-exploration.plan.md` (`1a36c027d`). The drain plan is executed
(archive it). This supersedes the Lapwing pickup below — that lane is now drained.

## Reference-Direction Doctrine + Deferred Application (2026-06-19, Sandpiper lifts Downdraft)

PDR-105 (reference-direction invariants — two axes of artefact fundamentality: durability and
portability; the unifying availability invariant; the stable-index corollary) is **Accepted and
landed WITH its enforcement** — `validate-reference-direction` (report-first, wired into
`repo-validators:check`, 22 unit tests, code/test-expert reviewed; commit `8d0297696`). Doctrine
shipped with a mechanical detector, never prose alone (owner: "doctrine without enforcement masks
the problem"). Thread records relocated to `threads/paused/` and `threads/retired/`; repo-continuity
is the single stable index resolving slug → path (commit `44406e502`).

**Deferred — the PDR-105 application burndown (owner-directed, properly sequenced, reviewed):**

1. **Reference-direction debt: ~197 wrong-direction references** the validator now measures (55
   portability = Core citing repo-specific paths; 142 durability = doctrine citing ephemeral
   plans/threads). The fix is removal/inversion of doctrine→ephemeral references and routing
   plan→thread through the continuity index — NOT symptom-repointing. The thread relocation newly
   broke the subset that pointed at the moved records; these are inside the 142 and are removal
   targets, not repoint targets. Escalating the validator from report-first to a blocking gate is the
   owner decision after burndown (`new-rules-start-at-warn`).
2. **`tracks/` and `workstreams/` removal (owner-directed):** a foundational concept-retirement —
   the surfaces are woven through PDR-011 (×12), ADR-150 (×10), PDR-027, PDR-030, continuity-practice,
   orientation, memory READMEs, four skills, and three rules. Retire the concept from each LIVE
   doctrine surface (leave historical analysis/research/curator-passes/experience untouched), with
   `docs-adr-expert` review on the PDR/ADR amendments, THEN remove the directories (refs-first, then
   delete — the order this session got backwards). Both are not-useful-now (harness task-list + napkin
   - claims/comms cover tracks; thread-record `## Lanes` cover workstreams) — judged by present need,
   not usage/provenance.
3. **Wire the operationalising rules to cite PDR-105** (`no-moving-targets-in-permanent-docs` = the
   durability-axis hook; `practice-core-portability` = the portability axis) and **retire the
   `consolidate-docs` 7d rule↔plan-citation check** — it validates a rule citing a plan, the exact
   wrong-direction PDR-105 forbids.

### Burndown progress (2026-06-19, Tulip spins Xylem `34b8e5`) — validator 197 → 145

Four reviewed commits on `docs/planning-and-validation` (NOT pushed — owner controls push):

- **Task 0** (`6eddad013`): PDR-105 §Context wording corrected — the two axes are SDP (depend in
  the direction of stability), only the stable-index corollary is DIP proper. docs-adr APPROVED.
- **Task 1a/1b** (`01561d374`, `8601c3d4e`): owner-approved bucket-B cure. The validator now exempts
  **stable-addressed surfaces** (fixed address, churning content) on the durability axis only —
  registries (`active-claims.json`, `closed-claims.archive.json`, `shared-comms-log.md`), index
  READMEs (`patterns/`, `threads/`, `state/`), permanent collaboration dirs (`conversations/`,
  `escalations/`, `comms/`, `handoffs/`), the patterns dir, and `*.schema.json`. A link to a
  *specific item inside* such a surface still flags. Allowlists live in a new sibling module; PDR-105
  body+§Notes amended; a built `--verbose` flag lists `axis source:line -> target` (replaces
  throwaway triage scripts — ESM/agent-tools). TDD; type/test/code-expert reviewed. **197 → 149 → 145.**
- **Task 3** (`e75b1e0fd`): `no-moving-targets` + `practice-core-portability` wired to PDR-105 axes;
  consolidate-docs **step 7d retired** (7e→7d); `dont-break-build-without-fix-plan` **inverted** to OWN
  the green-gate invariant (was quoting `gate-recovery-cadence.plan.md` as "Authority"); that plan's
  banner corrected. docs-adr APPROVED. This is the exemplar bucket-A inversion cure.

### Burndown progress (2026-06-19, Siren guards Reef `e0eb7f`) — validator 145 → 0 (Task 1 DONE)

Two reviewed commits on `docs/planning-and-validation` (NOT pushed — owner controls push):

- **Portability axis** (`7ac5fe657`): all 55 portability refs cured across 28 Practice-Core files
  (PDRs/practice.md/README). docs-adr-expert APPROVED (two passes: PDR-057/056/058 priority, then
  the remainder).
- **Durability axis** (`6893962c2`): all 90 durability refs cured across 52 files (62 ADR, 19 rule,
  9 directive). docs-adr-expert APPROVED-WITH-FIXES (5 MD012 footer-def double-blanks fixed).

**Cure convention (reviewer-ratified, applies to any future ref):** pure **de-link** —
`[label](target)` → `label` (label verbatim, inline AND reference-style), removing the
dangling-on-arrival path dependency while conserving the named concept. Provenance blocks
(Source/Supersedes) keep the de-linked prose; git is the provenance. **De-link is chosen over the
`(historical reference)` marker** even for ADR→archived-plan refs (PDR-105 "retire, don't maintain";
the marker only exempts a still-wrong link). napkin/distilled NOT allowlisted (Axis-1 ranks them
most-ephemeral). Validator flags ONLY markdown links, so backticked/prose concept names are safe.

**Task 2 — tracks/workstreams retirement (IN PROGRESS; all edits UNCOMMITTED, markdownlint exit 0).**
DONE this session (refs-first, retarget-in-place to avoid numbered-list renumber churn): the
operational/skill surfaces — `go`, `start-right-quick`, `session-handoff`, `consolidate-docs` (7c dropped
the expired-track-cards check, renumbered seven→six), `napkin`, `memory/operational/README` (tracks row +
track-card paragraph + workstream-retired block removed), `orientation`, `continuity-practice`,
`respect-active-agent-claims`, plus two surfaces the first enumeration MISSED (`practice-bootstrap:463`,
`register-identity:105`). All route tracks → harness task-list + napkin + claims; workstreams →
thread-record `## Lanes`. KEY NUANCE: `workstreams/` is already a retired-surface tombstone (README +
archive/); `tracks/` is empty. "workstream" has two senses — the operational lane-tracking *surface*
(retired) vs a *scope descriptor* in PDR-027's identity model (RETAINED — do NOT purge). PDR-027 has no
live dir-refs (no change); PDR-030 + practice.md:358 are retained-sense (no change).

**Remaining work (Drake lifts Obsidian) — ALL RESOLVED 2026-06-19; see the Drake completion section below. The original deliverables:**

1. **PDR-011 body** (lines 49, 421–432 treat track cards as a live compliant surface): retire the live
   treatment + add a new amendment-log entry recording the tracks retirement. The existing Session-5 and
   runtime-track-card amendment entries are HISTORY-RECORDS (change-as-subject) — keep them.
2. **ADR-150 mirror** (8, 38, 204–207, 265): same shape as PDR-011.
3. **PDR-027:164** (track-card filename convention — light) + **no-moving-targets:133/152** (track-card-path
   *examples* — replace with a live ephemeral example).
4. **Delete `tracks/` + `workstreams/` directories** (destructive; confirm at the action moment) and flip
   `PDR-105 §Notes` "slated for removal (pending)" → past-tense in the deletion commit.
5. **docs-adr-expert review** on the PDR-011/ADR-150/PDR-027 amendments.
6. **Escalate `validate-reference-direction` report-only → blocking.** Floor is reached (0). This is the
   next live decision-and-action: decide the warn→error escalation (`new-rules-start-at-warn`) and wire it.
7. **Validator-coverage gaps:** `ADR-026:90` (backticked-path citation) and `ADR-093:271` (link to
   `.agent/analysis/`, a prefix absent from the validator's `EPHEMERAL_PREFIXES`) carry durable→ephemeral
   refs the validator misses. Both fixes: de-link the two refs AND widen the validator's reach.
8. **Pre-existing tombstones found this session:** `PDR-058:359` ("the single-rule shape … was wrong
   because") — a rejection-label tombstone; lead with the positive "distinct impacts demand distinct cures"
   that already follows it. `register-identity:103` links the retired `../commands/` dir — repoint to
   `.agent/skills/consolidate-docs/SKILL-CANONICAL.md`.

### Burndown progress (2026-06-19, Drake lifts Obsidian `9258d7`) — PDR-105 COMPLETE, validator now BLOCKING

Successor to Siren guards Reef. The deliverables above are RESOLVED across three reviewed,
gate-green commits on `docs/planning-and-validation` (unpushed — owner controls push):

- **Tranche A — doctrine cures** (`d8ec8867c`, docs-adr-expert: all sound): de-linked the
  validator-missed refs (ADR-026 backticked archived-plan path; ADR-093 three `.agent/analysis/`
  links); retired the live track-card/workstream treatment in PDR-011 + ADR-150 (amendment-log
  entries; ADR-150 body kept verbatim as the historical decision record per ADR convention);
  removed PDR-027's stale track-card convention; reframed the PDR-058:359 tombstone. Plus a
  finding beyond the handoff list: reconciled `no-moving-targets:135`, which still licensed the
  very ADR→ephemeral refs the burndown removes (PDR-105 §Consequences retires
  wrong-direction-affirming clauses). `register-identity:103` was already done (verified
  first-hand — the prior `../commands/` link is gone).
- **Tranche B — residue removal** (`774a49e5e`, owner-authorised "git is the provenance"):
  deleted `tracks/` + `workstreams/`; reconciled the PDR-049/050 substrate-contracts manifest
  (dropped the stale `memory-operational-tracks` `"lifecycle": "live"` contract entry + the
  `workstreams/` historical_root); flipped PDR-105 §Notes to past-tense. repo-validators:check
  green. (The "COMMIT STATE: ALL UNCOMMITTED" note that previously sat here was superseded — Siren
  guards Reef committed the Task-2 work as `631bc5851`/`1fb700017` before standing down.)
- **Tranche C — enforcement capstone** (`563487f79`, code-expert + test-expert APPROVE; their
  claims verified first-hand, blocking path proven by a probe): corrected `.agent/analysis/`'s
  layer (it is ephemeral, was mis-typed `other`); escalated `validate-reference-direction`
  report-only → **blocking** (exit 1 on any wrong-direction ref; fails repo-validators:check in
  CI + `pnpm check`). PDR-105 §Consequences mechanical enforcement now holds.

**Design decision recorded (do not re-litigate):** the validator deliberately does NOT detect
backticked repo-paths — a backtick is a concept-name, not a resolvable dependency; flagging them
would brick the gate (1030 backticked repo-paths in policed doctrine) and contradict the de-link
convention ("backticked/prose names are safe"). ADR-026's stray ref was cured by de-linking, not
by widening detection. A comment in `extractReferences` records this for the next modifier.

**PDR-105 burndown is COMPLETE**: 197→145 (Tulip spins Xylem) → 145→0 (Siren guards Reef) → residue
deleted + invariant mechanically enforced (Drake lifts Obsidian). No remaining PDR-105 deliverables.

**repo-continuity note:** `repo-continuity.md` was held uncommitted by the no-throw lane
(Siren mends Rudder) this session, so this thread's §Active threads identity summary was NOT updated
there (avoiding a collision with their uncommitted edits — constraint, not omission; falsifiable by
checking repo-continuity reflects PDR-105 complete after the no-throw lane commits it). The next
agent to commit repo-continuity should add Drake lifts Obsidian (claude / Opus 4.8 / 9258d7 /
implementer / 2026-06-19) to this thread's `Latest identity` summary.

**NEXT-SESSION PICKUP (dedicated consolidation, owner-scoped to a fresh session 2026-06-18):**

The 2026-06-18 dedicated consolidation (Wisteria spins Bark, n=2 with Bluebell on the SDK lane) did
the bulk: repo-continuity PROCESSED to rest (15 concluded Current State entries conserved to pointers;
char 54.5k → 37.4k as a side effect); napkin drained (5 patterns graduated incl.
`fluency-is-a-failure-vector`, which homed 13 dangling wikilinks); `distilled.md` already empty;
pending-graduations drained to decision-debt 0 (PDR-104 best-effort-doctrine policy graduated +
PDR-003 / consolidate-docs step-8 reconciled); open-questions dispositioned; 7c/7e audits actioned
(F-68, the Wisteria identity row, the retired-banner fix); and consolidate-docs step-7 gained the
**PDR-098 recurrence-capture** amendment with the semantic-pathogen inventory seeded in the
action-time-interrupt plan.

Remainder for the fresh session:

1. **Napkin rotation** — the napkin grew with this session's real-time capture (hard chars /
   prose-width; under 500 lines so rotation is optional). The 2026-06-17/18 entries are **already
   dispositioned** this session (graduated to the 5 new patterns / folded / confirmed already-homed /
   routed to F-68 + PDR-104) — rotation **archives** them, it does not re-run the quorum (the 5 new
   patterns are the durable record). See the napkin's `Loss-scan findings` entry. A fresh pass rotates
   the processed window.
2. **Comms-event rotation** — the retention-gated curator-pass (archive-move events past their class
   window). The ANALYSIS is done (durable substance homed); only the gated archive-move remains.
3. **Owner-decision items (NOT agent work):** `testing-strategy.md` hard line-limit (raise or split —
   owner-only); repo-continuity char-limit (the residual is live content — owner accept/raise); the
   **fitness-report-self-framing cure** (build? — candidate mechanism in the action-time-interrupt
   plan's t2 inventory); the 7c stale-thread findings (`semantic-search` last active 2026-06-03;
   `agentic-mechanisms-discovery` 06-08 and `school-data-search` 06-04 aging toward 14 days —
   owner review/pause); Q-001 fitness cadence.
4. **Two PDR candidates** (owner decides; both would run the quorum): the **graduation-quorum
   protocol** itself; the **homing-category model** (open question → exploration plan, not
   doctrine/reject/residue). Plus the exploration-plan questions (TA1, P6) awaiting an owner-walked
   decision session.
5. `agent-collaboration-research` retired-record prose-width — cosmetic on a historical artefact,
   reported not chased.

## Decision-Debt Lane — Next-Session Pickup (updated 2026-06-16, Lapwing holds Troposphere)

**LANDED + PUSHED this session** (`docs/planning-and-validation`, in sync with origin — commits
`8665da651` + `3cb64da91`): the fitness enforcement model is now **report-only** — every fitness
signal (size, decision-debt count, dwell, config findings) is a prioritisation signal that never
fails a build (validator always exits 0; `getExitCode` removed as **dead** enforcement — verified
no hook / CI / `check` ever consumed it). Decision-debt uses **discrete ceiling** thresholds (count
`target 0, soft 2, hard 3`; critical = beyond hard) — NOT the size ratio (fractional ×1.5 is a
category error on small integers) — plus a **dwell-time axis** (`fitness_item_dwell_*`,
oldest-undecided age in days; register `2 / 4 / 7`), classified by one axis-agnostic engine
(`classifyDiscreteZone`). New module `dwell.ts`. ADR-144 reframed (gate→signal, semantics-not-
severity), PDR-100 Decision 3 reconciled, register frontmatter + agent-tooling plan updated.
Reviewers RUN (docs-adr, assumptions, config, test); findings absorbed (doc contradictions swept;
declines reasoned). Prior "add run.unit.test for exit-code folding" is MOOT — the fold was removed
(report-only). The plan `pending-graduations-schema-and-count-fitness.plan.md` is implemented,
ready to archive.

Also landed (committed): three structural cures for the fluency/grounding failures this session
demonstrated — **citation-or-silence** (`verify-dont-trust`), **no-mutable-state-in-memory**
(`per-user-memory-is-a-buffer`), and the **Second Question** ("would this be simpler if the system
changed?", owner-added to `AGENT.md`).

**THE UNDONE CORE — DONE 2026-06-16 (Limpet):** the register was drained 72 → 0 under the
graduation quorum (see the DRAINED pickup at the top of this record). The drain followed exactly
the discipline this paragraph called for: per-item first-hand decisions, conservation verified
before each reject, commit per batch, WS-OM not built. Retained here as the brief that the drain
discharged.

**Open question (cadence anchor — see `open-questions.md` Q-001):** fitness is report-only, so
nothing *runs* `practice:fitness` at a gate — what cadence anchor ensures the signal is read at
handoff/closure? Report-only is only as live as its invocation (assumptions-expert flagged).

**Owner answer (2026-06-16):** the abolition is propagated across all knowledge-flow doctrine
surfaces (briefs, skills, register, continuity, drain plans — done this session). The SEPARATE
owner-authority concepts that share the word (PDR-006 tool-nomination, plan-promotion / PR-merge
gates, `--no-verify` / limit-raise / Core-edit safety controls, Sonar authorisation) are surfaced
to the owner for an explicit scope decision — NOT auto-purged. (The "Core-edit" control is
subsequently disambiguated by
[PDR-104](../../../practice-core/decision-records/PDR-104-best-effort-doctrine-authoring-in-consolidation.md):
its sub-agent-protection sense is kept; its owner-pre-approval-of-each-doctrine-amendment sense is
relaxed for dedicated consolidation sessions.)

**Antipatterns I enacted (named so the next agent watches for them):** activity-bias /
mechanical-sequence — I ran a satisfying mechanism sequence and decided 0 items (I literally edited
`patterns/mechanical-sequence-is-activity-bias-diagnostic.md`, `comprehensive-cataloguing-drift.md`,
and `feel-state-of-completion-preceding-evidence-of-completion.md` while enacting all three);
reviewer-skipping under momentum (permanent doctrine committed unreviewed); soft-default (deferred
the hardest work — draining — behind comfortable machinery). Cure: drain first, build later; get
the reviews onto what is already committed.

## Current Continuation

**Curation state (2026-06-12, Thyme wakes Canopy / claude Fable 5 / `70655e`, dedicated
consolidation; uncommitted working-tree edits — commit control rests with the live
onboarding lane per owner direction)**: **THE APPROVED-UNAUTHORED QUEUE IS FULLY AUTHORED**
— PDR-092 (mechanical firing moments) + PDR-093 (self-correcting deliverables + the plan
skill drafting clause); amendments to PDR-064 (shadow period, standing-successor
authorisation + citable-gate test, Director closeout; Proposed → Accepted), PDR-011
(voluntariness + holder-exclusive loss-scan; ADR-150 mirrored), PDR-078 (§7 emit-side loop
hygiene), PDR-085 (instrument/discovery delivery); folds F1 (PDR-051 budget note), F2
(commit-skill lock-wait → no-contact), F5 (continuity-practice supersession clause); the
continuity-disposition candidate verified already homed (PDR-011 2026-06-08). The Core
CHANGELOG carries the pass. Same session: napkin rotated (critical cured; archive
`napkin-2026-06-12-thyme-curation.md`), distilled graduated (six new pattern files),
open-questions drained of two resolved entries, repo-continuity + this thread's eef sibling
condensed insight-conserved, three unbacked register pointers conserved as real entries.
**The ADR-131 pause-and-stabilise posture lifts when these edits land in a commit**; no NEW
Core restructuring candidates meanwhile. **Next curation move**: none queued — the next
dedicated pass fires on the consolidate-docs trigger checklist (decision-debt deltas waiting to
decide by the lenses: PDR-082 second-instance evidence; the PDR-081 ledger-clause contradiction).
The prior walk's record (Thermal Circling Updraft, 2026-06-11) lives in git history and the
register.

**Concurrent lanes on this thread.** This thread is a multi-lane container, not a single
linear next-step: the lanes below are independent and can be picked up **in parallel** — by
different checkouts, by separate agents, or collaboratively. Each carries its own state and
pickup trigger; neither blocks the other.

- **Lane A — feedback-mechanism follow-ons (active).** Branch `feat/graph-tooling-tidyup`;
  next is **WS1 → 2b → 2c → WS2** (full detail in the bullets and the Briny Plumbing Beacon
  banner below).
- **Lane B — skills standardisation review (deferred).** Next is the
  **PDR-051 reduced-implementation reconciliation review**. Pickup trigger: the owner review
  session, OR the first ingested external skill, OR promotion of the oversized-core
  decomposition brief. Inputs ready — owning plan §Reality Reconciliation gap ledger
  ([`agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md`](../../../plans/agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md)),
  friction F-37, the pending-graduations entry, and two future briefs
  ([decomposition](../../../plans/agent-tooling/future/skills-oversized-core-decomposition.plan.md),
  [eval harness](../../../plans/agent-tooling/future/skills-eval-harness.plan.md)). On a
  separate branch (committed `cbf01ae0`); not blocking and not blocked by Lane A.
- **Lane C — memory/state semantic merge strategy (decided 2026-06-15; ADR
  pending).** git merges lines, but `.agent/memory` and `.agent/state` files carry
  semantic invariants git cannot see (a JSON set keyed by `claim_id`; a markdown
  file with exactly one Current State block; an append-only narrative buffer; an
  additive identity table) — a textually-clean merge can be semantically wrong.
  Owner-walk decision (2026-06-15): adopt a TIERED approach, preferring the lowest
  tier that works. **Tier 1** — conflict-free by construction (the immutable,
  content-addressed, one-file-per-event comms store already is this; push more
  state toward it). **Tier 2** — schema-driven git `merge=<driver>` drivers for the
  structured registries (`active-claims.json`, `closed-claims.archive.json`,
  comms-seen), making ADR-197's branch-authoritative-for-state policy semantically
  safe rather than textually hopeful. **Tier 3** — agent-driven merge for narrative
  state, emitting a REVIEWABLE diff (never a silent merge), ONLY as a last resort.
  Next: author the formal ADR (mechanism follow-on to ADR-197, which set the policy
  but assumed git's textual merge) plus the per-file-class merge-semantics audit and
  the merge-driver-vs-out-of-band-tooling decision. Pickup trigger: a fresh
  agentic-engineering session, or the next multi-writer state convergence needing it.
- **Lane D — rule-impact instrumentation (lane opened 2026-06-11).** Of the ~70
  rules injected via `CLAUDE.md`, which measurably change agent behaviour and earn
  their context cost? Prose rules have no firing event; hook-backed rules (write-time
  guards, secrets-scan on Read, PreToolUse gates) do execute and can be instrumented.
  Authorised scope: hook invocation fire-count logging only (the one mechanically
  measurable signal), routed to the agent-tools implementation lane; transcript-audit
  for behaviour-change attribution deferred until fire-count evidence exists. Informs
  the ~80k reliably-loaded context budget — the evidence needed to move inert rules
  on-demand or retire them. Lane A's 2b reappraisal-cartography pass remains the
  prose-rule rationalisation vehicle.

- **Branch**: `feat/graph-tooling-tidyup` — **clean and pushed** at HEAD `934d5c21`
  (re-derive git first-hand).
- **Live work (next non-curation session)**: the feedback-mechanism follow-ons, in sequence
  **WS1 → 2b → 2c → WS2**. The full brief and the un-homed design decisions are in the **Briny
  Plumbing Beacon banner** below — preserve it. **Its GATE-STATE / EEF-lint-precondition
  paragraphs were VOID** even before this session (ADR-193 made `EefEvidenceEnvelope` a strict
  `interface` + egress membrane, so the `consistent-type-definitions` lint is green-resolved;
  the branch is clean and pushed). Read Briny for the work; this block for the current gate.
  - **WS1** (`no-type-widening` ESLint rule) plan is at
    [`current/no-type-widening-enforcement.plan.md`](../../../plans/agentic-engineering-enhancements/current/no-type-widening-enforcement.plan.md).
    **Fixture caveat**: the EEF `new Set<string>(OBSERVED_PHASES)` widening that motivated the
    rule was since made zero-widening (`Set<DeclaredPhase>` / `Set<EefStrandId>`) — confirm
    against `graph-corpus-sdk/src/eef-strands/` first-hand; author a dedicated fixture if gone.
  - **2b** = the owner-approved 89-file `.agent/rules/*.md` reappraisal-cartography pass
    (discover cure per rule → cluster → discriminate collapse-candidate vs sharpen vs keep;
    do NOT auto-collapse — owner decides). **2c** = per-surface PDR-044 widening (ESLint
    now-eligible; rules-prose after 2b). **WS2** = tripwire wiring; coordinate with
    [`future/action-time-structural-interrupt-design-space.plan.md`](../../../plans/agentic-engineering-enhancements/future/action-time-structural-interrupt-design-space.plan.md).

> **🤝 Session Handoff (2026-06-07 — Briny Plumbing Beacon / claude / Opus 4.8 / `5dd58c`):
> item 2a LANDED (ESLint reappraisal enforcement); WS1 next**
>
> **Self-contained brief; the fresh session needs nothing from the originating conversation.**
> Owner-agreed sequence was 4 → 1 → 2 → 3; items 4 + 1 landed (Eclipsed, in git),
> **item 2a landed this session**, and the owner expanded scope: **do item 2 (all sub-passes)
> AND the no-type-widening rule, and do NOT wait for the EEF lane.** (The original
> GATE-STATE paragraph here — an EEF-lint precondition blocking commits — is VOID; see Current
> Continuation above.)
>
> **What landed — item 2a (ESLint custom-rule reappraisal enforcement):**
>
> - **Mechanism = compile-time-by-construction (NOT a validator, NOT a factory).**
>   `packages/core/oak-eslint/src/reappraising-message.ts`: a zod-branded `ReappraisingMessage`
>   type, minted only by `createMessage({prohibition, reappraisal})` via
> `z.string().brand().parse()`,
>   plus a `RuleWithReappraisingMessages<MessageIds, Options>` rule type that narrows
> `meta.messages`
>   to the brand. A **plain prohibition-only string now fails `tsc`** in any rule typed this way —
>   non-bypassable, no separate validator to drift, no bypass-guard needed.
> - **Why zod, not a hand-rolled brand:** the shared config bans assertions outright
>   (`@typescript-eslint/consistent-type-assertions: { assertionStyle: 'never' }`,
>   `packages/core/oak-eslint/src/configs/recommended.ts`), and the repo had **no existing branded
>   types**. A hand-rolled `as` brand is illegal; zod's `.parse()` is the only assertion-free mint
> and
>   matches the repo's z.infer / types-flow-from-schema doctrine. This is the **first branded type
> in
>   the repo**. Added `zod@^4.4.3` to `oak-eslint` deps + `tsup.config.ts` `external` (zod is NOT
>   inlined — verified `from 'zod'` in dist, 0 inlined source).
> - **All 6 `meta.messages` rules migrated** (`no-dynamic-import`, `no-eslint-disable`,
>   `no-export-trivial-type-aliases`, `require-observability-emission`, `max-files-per-dir`,
>   `no-real-io-in-tests`). Composed messages are behaviourally identical to the originals EXCEPT
>   `max-files-per-dir`, which **gained a cure it never had** ("Group related files into a cohesive
>   subdirectory…") — the owner's whole thesis, confirmed in the smallest case. `boundary.ts` uses
>   `no-restricted-imports` config `message:` strings (not `meta.messages`) and is **out of scope**.
> - **Green:** oak-eslint type-check, lint, 202 tests, build. TDD test-first
>   (`reappraising-message.unit.test.ts`, red→green). Reviewed at the unit boundary (not backfill):
>   **type-expert SAFE**, **code-expert APPROVED**, **test-expert PASS**. Applied: test assertions
>   pinned to product-owned substrings; zod externalised. **Caught one false positive** —
> code-expert's
>   "zod inlines ~46KB" did not hold (dist unchanged at 62KB; tsup externalises deps by default).
>
> **Decisions held in my context (loss-scan — reached no other durable surface):**
>
> - **Option C beat the factory** (assumptions-expert + architecture-expert-betty converged): a
>   rule-wrapping factory over-reached the M-sized approved capture and needed a fragile no-bypass
>   guard; compile-time brand is lighter AND stronger. Then zod-brand beat a hand-rolled brand
> because
>   of the `as` ban (above). Do not "simplify" this back to a hand-rolled brand — it will not lint.
> - **2b is RESHAPED and OWNER-EXPANDED.** The capture sized it "M"; it is actually an **89-file
>   corpus change** (`.agent/rules/*.md`), many flat-prose with no positive-direction section, so
>   "states a positive move" is **not mechanically checkable** without first imposing a structured
> slot
>   (a keyword heuristic was rejected as false-positive noise). **Owner approved the full 89-file
> pass
>   now.** Reframed as **doctrine cartography, not data-entry** (owner insight: *rules sharing the
> same
>   positive suggestion are collapse candidates*): (1) discover — author a sharp cure per rule; (2)
>   cluster by cure; (3) discriminate+surface each collision as genuine-redundancy (collapse
> candidate,
>   owner decides — do NOT auto-collapse, knowledge-preservation) vs coarse-cure-prose (sharpen,
> don't
>   merge) vs same-cure-different-concept (keep). The reappraisal is a **concept-key**: the
> cure-space
>   is lower-dimensional than the detection-space. Let collision density decide 2b's structure
> (dense →
>   shared concept→cure registry; sparse → per-rule section).
> - **Collision signal already found (feeds 2b):** within the ESLint surface,
> `no-real-io-in-tests`'s
>   three `bannedModule*` messages share one cure ("inject a fake instead"); `eslintDisableBanned` +
>   `tsDirectiveBanned` both cure to "fix the root cause".
> - **2c (PDR-044 widening) is PER-SURFACE**, not all-or-nothing: ESLint widening lands once 2a
>   enforces; rules-prose widening waits for 2b. Never state doctrine wider than enforcement reaches
>   (the amendment's own §Scope / PDR-038).
> - **The interlock binds the no-type-widening rule to the 2a enforcer existing** (now true), so
>   **WS1's message is authored via `createMessage` and is born teaching by construction** — costs
>   nothing extra.
>
> **Remaining work (sequence): WS1 → 2b → 2c → WS2.**
>
> 1. **No-type-widening WS1** (next). A type-aware rule in `oak-eslint` flagging `Set<string>` /
>    `readonly string[]` views over an `as const` literal-union array, steering to
>    `xs.some((x) => x === value)`. **Author its message via `createMessage`** (born teaching).
>    **The hard part** (owner + plan flagged): distinguishing a literal-union widening from a
>    legitimate arbitrary-`string` collection via typescript-eslint's type-checker — precision gates
>    `warn → error`; a permanently-advisory rule is not acceptable, surface-with-evidence if
> precision
>    proves unreachable. Do NOT redo the doctrine already strengthened (typescript-practice.md,
>    ADR-153/038/028, EEF graph-corpus-sdk code).
> 2. **Item 2b** — the 89-file cartography pass above.
> 3. **Item 2c** — per-surface PDR-044 widening (ESLint now-eligible once 2a is confirmed enforcing;
>    rules-prose after 2b).
> 4. **No-type-widening WS2** — tripwire wiring; coordinate with
>    `action-time-structural-interrupt-design-space.plan.md`; beneficial, not blocking; lowest
> priority.
> 5. **Follow-on (not 2a scope):** `toPosix` is duplicated across `max-files-per-dir`,
>    `require-observability-emission`, `no-real-io-in-tests` (third consumer → consolidate-at-third-
>    consumer); extract to `oak-eslint/src/utils/path.ts`.
>
> **Disciplines carried (worked this session):** an `as`-ban + a live multi-writer lockfile turns a
> mechanism choice into a coordination problem — surface it; ground specialist findings first-hand
> before acting (caught the zod-bloat false positive by checking the dist size); reviewers at the
> unit
> boundary, not backfill; the owner's safety-commit can sweep your green WIP in with a peer's —
> verify
> HEAD is green, do not assume your work landed as its own commit.

## Statusline Session-Shape Indicators Lane (2026-06-12 → 2026-06-13) — DONE

**Owning plan**: archived at
`.agent/plans/agent-tooling/archive/completed/statusline-session-shape-indicators.plan.md`
(status: DONE; lifecycle index entry in `completed-plans.md` § Agent Tooling).
**Outcome**: all five workstreams executed by Monsoon guards Cirrus on
`feat/statusline-enhancements` (commits `ac2901fe1` claim `role` field + singleton-cure,
`1ac430378` resolver + `isClaimStale` + porcelain primary-root parser, `4270ea49d`
renderer + adapter two-reads-per-tick + glyph evidence). Pushed, conflict-resolved against
main (napkin/repo-continuity, semantic merge), and **PR #203 merged to main 2026-06-13
(merge `00c1f758d`)** by Flame rides Temper. One post-merge SonarCloud smell (nested ternary,
S3358) fixed by extracting a `teamIcon` helper before merge. **Post-merge live proof
passed**: against the merged schema the write-path validator now accepts a `role:director`
claim (the write it correctly refused pre-merge), and the built statusline adapter renders
the 🧭 Director demark suffixed to the identity plus the 👪 directed-team icon.
**Residue (sweep at next consolidation)**: three abandoned commit-queue intents in the
primary registry (1266cd70, 205de542, 3bdc8219 — pre-merge blocked-window attempt audit);
two stale `current/` plan-path links in `repo-continuity.md` (a dated point-in-time bullet
and the redesign bullet) left for the continuity lane to repoint to `archive/completed/`
when it next touches that file (it carried uncommitted edits in the primary during this
lane, so this PR did not churn it).

Additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md).
This table carries the **recent active stretch**; the full 142-session trail (older curation
passes) is in git history and the [`curator-passes/`](../curator-passes/) ledgers.

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Moonless Lurking Dusk` | `claude` | `Opus 4.8` | `0641a3` | `dedicated-knowledge-curation` | 2026-06-01 | 2026-06-01 |
| `Shaded Veiling Mirror` | `codex` | `GPT-5` | `019e88` | `dedicated-curation+closeout` | 2026-06-02 | 2026-06-02 |
| `Lofty Sweeping Falcon` | `codex` | `GPT-5` | `019e8a` | `dedicated-curation-continuation+closeout` | 2026-06-02 | 2026-06-03 |
| `Ashen Burning Magma` | `codex` | `GPT-5` | `019e8d` | `antigravity-practice-integration` | 2026-06-03 | 2026-06-03 |
| `Solar Glowing Meteor` | `codex` | `GPT-5` | `019e8d` | `skills-taxonomy-implementation` | 2026-06-03 | 2026-06-03 |
| `Stratospheric Buffeting Breeze` | `codex` | `GPT-5` | `019e8c` | `antigravity-audit + skills-taxonomy + first-batch-graduation handoffs` | 2026-06-03 | 2026-06-03 |
| `Lacustrine Swimming Beacon` | `claude` | `Opus 4.8` | `687a54` | `working-tree-commit-marshal` | 2026-06-03 | 2026-06-03 |
| `Opalescent Illuminating Prism` | `codex` | `GPT-5` | `019e8e` | `dedicated-knowledge-curation` | 2026-06-03 | 2026-06-03 |
| `Blustery Lifting Gale` | `claude` | `Opus 4.8` | `9b33b0` | `taxonomy-plan-link-repoint (session home: agentic-mechanisms-discovery)` | 2026-06-03 | 2026-06-03 |
| `Arboreal Sprouting Branch` | `claude` | `Opus 4.8` | `262b3f` | `dedicated-knowledge-curation+owner-directed-graduations` | 2026-06-04 | 2026-06-04 |
| `Hidden Hiding Dusk` | `claude` | `Opus 4.8` | `38dbaf` | `dedicated-consolidation+owner-directed-graduations` | 2026-06-04 | 2026-06-04 |
| `Lanternlit Passing Mask` | `claude` | `Opus 4.8` | `748c10` | `dedicated-consolidation+owner-directed-graduations` | 2026-06-05 | 2026-06-05 |
| `Volcanic Blazing Magma` | `codex` | `GPT-5` | `019e9c` | `identity-statusline-docs` | 2026-06-06 | 2026-06-06 |
| `Dim Fading Hush` | `claude` | `Opus 4.8` | `1952e2` | `eef-d6-reflection-and-meta-handoff` | 2026-06-06 | 2026-06-06 |
| `Glittering Weaving Comet` | `claude` | `Opus 4.8` | `47e009` | `feedback-mechanism-reappraisal (L1+L2)` | 2026-06-07 | 2026-06-07 |
| `Eclipsed Watching Veil` | `claude` | `Opus 4.8` | `077e31` | `feedback-mechanism-follow-ons (items 4 + 1)` | 2026-06-07 | 2026-06-07 |
| `Briny Plumbing Beacon` | `claude` | `Opus 4.8` | `5dd58c` | `feedback-mechanism-follow-ons (item 2a landed; WS1 next)` | 2026-06-07 | 2026-06-07 |
| `Lofty Spiralling Plume` | `claude` | `Opus 4.8` | `891aa5` | `continuity-surface-fitness-wiring + prose-line-awareness + ADR-193-fold` | 2026-06-08 | 2026-06-08 |
| `Cosmic Illuminating Planet` | `claude` | `Opus 4.8` | `773ea1` | `dedicated-continuity-surface-consolidation` | 2026-06-08 | 2026-06-08 |
| `Coppery Crackling Crucible` | `claude` | `Opus 4.8` | `a28ee6` | `pending-graduations-drain + recalibration + PDR-091 (precedence-is-not-approval)` | 2026-06-08 | 2026-06-08 |
| `Fruited Twining Canopy` | `claude` | `Opus 4.8` | `1aff59` | `dedicated-knowledge-curation (napkin rotation + graduation + continuity/open-questions drain)` | 2026-06-09 | 2026-06-09 |
| `Arboreal Swaying Thicket` | `claude` | `Fable 5` | `d2947e` | `dedicated-knowledge-curation (register drain + napkin rotation + width repairs + platform-memory)` | 2026-06-11 | 2026-06-11 |
| `Thermal Circling Updraft` | `claude` | `Fable 5` | `f42c24` | `dedicated-consolidation (owner decision walk: all gated dispositions settled; ADR-195/196/197 + skill + PDR-058/091/089 landed; approved-authoring queue frozen)` | 2026-06-11 | 2026-06-11 |
| `Thyme wakes Canopy` | `claude` | `Fable 5` | `70655e` | `dedicated-consolidation (approved queue authored: PDR-092/093 + 4 amendments + 3 folds; napkin rotated; registers drained; continuity condensed)` | 2026-06-12 | 2026-06-12 |
| `Monsoon guards Cirrus` | `claude` | `Fable 5` | `aaa0b7` | `statusline-session-shape-indicators (all five workstreams landed on feat/statusline-enhancements; handed to Flame rides Temper for push/PR/post-merge proof)` | 2026-06-12 | 2026-06-12 |
| `Flame rides Temper` | `claude-code` | `Fable 5` | `362832` | `statusline-lane successor (Monsoon handoff): PR #203 + #206 merged + post-merge director-demark proof + two-line layout; PR merge-readiness discipline plan #205 + WS3-evidence integration #207; review-comment-resolution discipline applied across all PRs` | 2026-06-13 | 2026-06-13 |
| `Margay wakes Whisper` | `claude` | `Opus 4.8` | `803f13` | `skills-estate audit vs agentskills.io + oak-skills compare; reconciled stale skills-standardisation plan (core landed in reduced form); authored 2 enhancement briefs (oversized-core decomposition, eval harness); gaps recorded as F-37, disposition review owner-deferred` | 2026-06-14 | 2026-06-14 |
| `Peregrine turns Airstream` | `claude-code` | `Opus 4.8` | `a29389` | `fitness-validator worktree/transient-root exclusion fix (`6ffbc14e0`) + disposition-category report grouping (PDR-097 + ADR-144 amendment); content-guard workaround/root-cause-avoidance detection captured for the hook-policy plan after a malformed-policy fail-closed deadlock; authored 2 future plans (hook-policy TS+schema unification, cSpell quality gate); dedicated consolidation flagged DUE next session` | 2026-06-15 | 2026-06-15 |
| `Europa binds Perihelion` | `claude-code` | `Opus 4.8 (1M)` | `0008e8` | `dedicated-consolidation (open-questions drained to empty; PDR-078 §4 / PDR-082 Adopted / PDR-098 / PDR-099 graduated + reviewed; wrapped-exit-codes clause; statusline lane committed under owner-directed full-tree ownership); added thread lanes C (memory/state merge) + D (rule-impact instrumentation); handed off mid-bulk-register-drain to Rigel binds Meridian` | 2026-06-15 | 2026-06-15 |
| `Rigel binds Meridian` | `claude` | `Opus-4.8 (1M)` | `b475ee` | `dedicated-consolidation relay (Europa handoff): verified open-questions EMPTY; batch 1 (`40b5750aa`) migrated F-38/39/40 agent-tooling frictions to the register + drained from pending-graduations; produced the full R/W/G/O classification + verified route-homes + Team-Autonomy disposition shape in the napkin HANDOFF BATON; owner set the Class-O "delegate with reported verdicts" policy; handed off mid-bulk-drain to Snapper binds Coral` | 2026-06-15 | 2026-06-15 |
| `Snapper binds Coral` | `claude` | `Opus 4.8 (1M)` | `0beea7` | `curator — dedicated-consolidation drain (Rigel handoff): all agent-tools R items → frictions-register F-41..F-59; 3 behavioural items withdrawn as covered by verify-dont-trust; open-questions re-verified EMPTY; napkin rotated, 2 new + 3 carried lessons → distilled; ~50 owner-gated single-instance candidates + Team-Autonomy PDR-074 cycle + G items remain for owner-walk / reviewed cycle` | 2026-06-15 | 2026-06-16 |
| `Sequoia holds Arbor` | `claude` | `Opus 4.8 (1M)` | `0ed76b` | `n=2 partner (distil lane), owner-stopped cautionary session — committed nothing; conserved two owner-affirmed failure lessons to napkin (orchestration-substituted-for-cognition; the open enforce-edge feedback loop)` | 2026-06-16 | 2026-06-16 |
| `Lapwing holds Troposphere` | `claude` | `Opus 4.8 (1M)` | `85f435` | `fitness made report-only (gate→signal, semantics-not-severity); decision-debt discrete ceilings + dwell-time axis (new dwell.ts); ADR-144/PDR-100 reframed; reviewers run; three discipline cures landed (citation-or-silence, no-mutable-state-in-memory, the Second Question in AGENT.md); committed + pushed 8665da651/3cb64da91; register 72 still undrained → drain is next session` | 2026-06-16 | 2026-06-16 |
| `Basil tracks Xylem` | `claude` | `Opus 4.8 (1M)` | `6381a2` | `owner-gated knowledge-flow purge (PDR-100 propagated across briefs/skills/continuity/plans; action-authority gates kept per owner); actionable-error fix for non-registry --active (PDR-055 cl.9); PDR-055 amended to universal CLI API-surface-design consistency (cl.7-10 + Falsifiability); authored agent-tools-cli-ergonomics plan; superseded memory-surface-critical-drain; register 72 still undrained → drain next session` | 2026-06-16 | 2026-06-16 |
| `Phobos turns Singularity` | `claude` | `Opus 4.8 (1M)` | `e85d37` | `collaboration-doctrine-decomposition plan author — compared the two collaboration directives against the start-right-team skill + PDR corpus; found both are layer-blenders predating their own PDR homes; authored the future/ strategic brief (doctrine-surface counterpart to the rightsizing keystone) + wired it into future/README.md` | 2026-06-17 | 2026-06-17 |
| `Skunk hunts Crescent` | `claude` | `Opus 4.8 (1M)` | `54eb83` | `curator — dedicated-consolidation buffer drain: rotated the napkin (critical→healthy) and drained distilled by DECIDING every entry (5 patterns + PDR-101 graduation-quorum + PDR-058/PDR-018 amendments + patterns-README single-instance reconciliation; F-64..F-67 + skill-two-gate routed; enforce-edge instance homed in the action-time plan), all through the PDR-101 quorum (rescued 4 over-rejections); committed f4a1416ad, gate green. HARD reference/doctrine surfaces (repo-continuity, testing-strategy) left for a specialist session per owner.` | 2026-06-16 | 2026-06-17 |
| `Wisteria spins Bark` | `claude-code` | `Opus 4.8 (1M)` | `d143c9` | `curator — dedicated-consolidation (n=2 with Bluebell on SDK): operationalised PDR-098 recurrence-capture (consolidate-docs step-7 + semantic-pathogen inventory seeded); graduated PDR-104 best-effort policy (+ PDR-003/step-8 reconciliation) and 5 napkin patterns (incl. fluency-is-a-failure-vector, homing 13 dangling wikilinks); processed repo-continuity to rest (15 concluded entries conserved to pointers, verification-backed); 7c/7e audits; F-68. The HARD repo-continuity surface Skunk left for a specialist session is now done; testing-strategy assessed (reported).` | 2026-06-18 | 2026-06-18 |
| `Sandpiper lifts Downdraft` | `claude-code` | `Opus 4.8 (1M)` | `0c6576` | `curator — dedicated-consolidation: buffers drained; continuity curated to live-work-only; testing recipes graduated; PDR-105 reference-direction invariants + validate-reference-direction enforcer landed; threads relocated to paused/retired; tracks/workstreams removal + ref-burndown deferred (refs-first)` | 2026-06-18 | 2026-06-19 |
| `Tulip spins Xylem` | `claude` | `Opus 4.8 (1M)` | `34b8e5` | `PDR-105 reference-direction burndown: §Context SDP/DIP fix; stable-addressed-surface exemption (validator + corollary generalisation) + built --verbose; wired no-moving-targets + practice-core-portability to PDR-105; retired consolidate-docs 7d; inverted dont-break-build to own the green-gate invariant; validator 197→145; tracks/workstreams + bulk burndown deferred to fresh budget` | 2026-06-19 | 2026-06-19 |
| `Siren guards Reef` | `claude` | `Opus 4.8 (1M)` | `e0eb7f` | `PDR-105 burndown COMPLETED 145→0 (Tulip successor): portability 55 (7ac5fe657) + durability 90 (6893962c2), pure de-link, 3 docs-adr passes APPROVED, gate green, NOT pushed; Task-2 tracks/workstreams operational surfaces retired (uncommitted) + 7 self-made tombstones fixed; handed to Drake lifts Obsidian — blocking remaining: PDR-011/ADR-150 foundational edits, dir deletion, validator warn→error escalation, ADR-026/093 coverage gaps, PDR-058:359 + register-identity stale-link tombstones` | 2026-06-19 | 2026-06-19 |
| `Drake lifts Obsidian` | `claude` | `Opus 4.8 (1M)` | `9258d7` | `PDR-105 burndown COMPLETE (Siren guards Reef successor): Tranche A doctrine cures d8ec8867c (de-links + PDR-011/ADR-150/PDR-027/PDR-058 + no-moving-targets:135 reconciliation; docs-adr APPROVED); Tranche B 774a49e5e (tracks/workstreams deleted + PDR-049/050 manifest reconciled + §Notes past-tense; owner-authorised); Tranche C 563487f79 (validate-reference-direction report-only→blocking + .agent/analysis/ ephemeral; code/test-expert APPROVE; probe-proven); validator now BLOCKING at 0; backticked-detection deliberately rejected; NOT pushed` | 2026-06-19 | 2026-06-19 |
| `Finch binds Halo` | `claude` | `Opus 4.8 (1M)` | `b0831c` | `four-files lane RESOLVED → jointly designed the Closure & Role-Routing fitness doctrine with the owner; committed the findings record + backbone plan (547d889c9); committed Kayak's strategy + compliance lanes (453896d64, d1387b81f) at owner direction; merged the 8 remote planning-cluster commits; prior 2026-06-19: dedicated-consolidation drain (detail in git + the findings record). NOT pushed` | 2026-06-19 | 2026-06-20 |
| `Ferret seeks Tunnel` | `claude-code` | `Opus 4.8 (1M)` | `77bfae` | `dedicated-knowledge-curation: drained the 2026-06-20/21 capture window bottom-up (napkin rotated; decision-locus + cause-classes lessons → distilled; F-75 peer-heartbeat-silence recovered from comms; fluency-cluster + education=pupils recurrence → action-time t2 inventory); promoted-and-assessed PDR-107 + README-index doc clause + culture Active Principle (docs-adr-assessed), rejected the pupils guard; commits 358a1636a + handoff; then restored practice-lineage to the evolution record (855→283; evacuated Learned Principles + what/how duplicates by intent; PDR-108/109/110 + PDR-002/024; reviewer-folded first-hand; 18 staged + gate-clean, commit handed to Director Vesuvius calls Quench — knip-blocked on peer WIP); NOT pushed` | 2026-06-21 | 2026-06-21 |
| `Oyster weaves Surf` | `claude` | `Opus 4.8 (1M)` | `d16a4a` | `WS-3 F-41 path-safety LANDED: resolveCoordinationHome resolves the PRIMARY checkout via \`git worktree list\` (b5408291d consolidation + c90150ffa core fix + 4fd640089 commit-queue topic), closing F-41 across comms AND commit-queue defaults; B2 deferred (git-resolved-home reframe); carried the proper-question-forces-the-answer lesson (forced-answer-test PDR candidate) + no-single-checkout-assumption; 3 code + 2 docs commits gate-green, NOT pushed (await safe remote integration)` | 2026-06-21 | 2026-06-21 |

## Cross-Plan and Cross-Thread Links

- **Live-work plans**:
  [`current/no-type-widening-enforcement.plan.md`](../../../plans/agentic-engineering-enhancements/current/no-type-widening-enforcement.plan.md),
  [`future/action-time-structural-interrupt-design-space.plan.md`](../../../plans/agentic-engineering-enhancements/future/action-time-structural-interrupt-design-space.plan.md).
- **Skills arc** (2026-06-14 audit, agent-tooling collection): owning plan
  [`agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md`](../../../plans/agent-tooling/current/skills-standardisation-and-adapter-generator.plan.md)
  (§Reality Reconciliation gap ledger); enhancement briefs
  [`agent-tooling/future/skills-oversized-core-decomposition.plan.md`](../../../plans/agent-tooling/future/skills-oversized-core-decomposition.plan.md)
  and [`agent-tooling/future/skills-eval-harness.plan.md`](../../../plans/agent-tooling/future/skills-eval-harness.plan.md);
  friction F-37; pending-graduations entry "PDR-051 reduced-implementation reconciliation review".
- **Graduation register**: [`pending-graduations.md`](../pending-graduations.md) (decision-debt
  candidates — pending/due/overdue — and fired-trigger candidates from this thread's curation passes).
- **Curation ledgers**: [`curator-passes/`](../curator-passes/) (per-pass disposition evidence).
- **Repo state**: [`repo-continuity.md`](../repo-continuity.md) § Current State (authoritative
  live state across threads).
