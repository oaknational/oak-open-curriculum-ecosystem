---
name: "Staged Doctrine Consolidation and Graduation"
overview: "Six-session staged execution of the overdue consolidation backlog: patterns, doctrine bundle, active tripwires (two families), outgoing triage, and a holistic final fitness exploration."
todos:
  - id: s1-decisions-patterns-tripwire-artefactmap
    content: "Session 1: Record Phase 0 decisions as standing; author two patterns (inherited-framing + passive-guidance); install first Family-A tripwire (plan-body-first-principles-check rule, front-loaded to cover Sessions 2-3); refresh practice.md Artefact Map; brief experience entry."
    status: completed
  - id: s2-napkin-rotation-distilled
    content: "Session 2: Napkin rotation (1611 → archive/napkin-2026-04-21.md); distilled merge-and-prune; Deep consolidation status refresh; pending-graduations register schema formalised; register bound into session-handoff (step 7) and consolidate-docs (step 7 preamble)."
    status: completed
  - id: s3-doctrine-bundle
    content: "Session 3: Landed 6/6 under bundle rhythm — 4 new portable PDRs (PDR-027 Threads/Identity, PDR-028 Executive-Memory Feedback Loop, PDR-029 Perturbation-Mechanism Bundle with Family A Classes A.1 + A.2 + Family B + platform parity load-bearing, PDR-030 Plane-Tag Vocabulary authored mid-bundle from docs-adr-reviewer OWNER-DECISION 1) + 2 amendments (PDR-011 thread-scope, PDR-026 per-thread-per-session + Notes/Graduation-intent structural refactor). All owner-approved per PDR-003. Mid-arc checkpoint 1 outcome: proceed."
    status: completed
  - id: s4-tripwires-cross-linking
    content: "Session 4 LANDED 2026-04-21 with two mid-session revisions via PDR-029 Amendment Log: (1) 'active tripwire' = markdown-ritual step naming authoritative sources, not code; (2) Class-A.1 Layer-2 'standing-decision register surface' RETRACTED — A.1 Layer 2 is served by the existing foundation-directive grounding (principles + ADR/PDR/rules) per the first amendment. Landed: Task 4.0 platform-agnostic commit skill at canonical .agent/commands/commit.md with adapters and AGENT.md citation; Class A.1 plan-body rule forward-reference resolved to PDR-029 (no register surface authored); Class A.2 session-open identity rule at .agent/rules/register-identity-on-thread-join.md with Claude+Cursor adapters; Class A.2 session-close gate as documentation walkthrough in /session-handoff step 7c; Class A.2 stale-identity audit as documentation walkthrough in /jc-consolidate-docs step 7c; Active identities column in repo-continuity.md § Active threads formalised as THE register; Family B meta-tripwires (taxonomy-seam meta-check + cross-plane path scan + orphan-item signal); cross-plane path rules (executive-memory-drift-capture rule + cross_plane pattern frontmatter + executive-impact workstream tag + Source plane napkin tag); observability thread record migrated from legacy path to threads/ canonical location; Practice Core CHANGELOG + roadmap sync. Seven + decomposition items graduated across two close passes. New standing decision: 'Misleading docs are blocking' (also itself decomposition-pending into a PDR at Session 5). Platform parity load-bearing: canonical + Claude + Cursor + Codex adapters + AGENT.md citation for every Family A rule; documentation-first for every gate/probe/view; no code layer where markdown suffices."
    status: pending
  - id: s5-evaluate-then-extend
    content: "Session 5 (REFRAMED 2026-04-21 Session 4 late close — owner direction: 'there is no alternative thread, we need this work to be FINISHED, properly, carefully, fully, choosing long-term architectural excellence at every point'): MANDATORY SEQUENCE, not a choice. Stage 1 evaluate-and-simplify FIRST (close OAC Phase 4 which is overdue from 2026-04-20 and has pilot-evidence artefact; simplification pass with delete-bias against Session-4 doctrine additions — thread-vs-workstream collapse, PDR-029 consolidating revision, nine pattern candidates pruning, Family-A tripwire retention, ~15 register entries each keep/merge/retire; answer thread/workstream/track first-principles check with three sub-items). Stage 2 extension (outgoing triage + ten-item decomposition) runs only if stage 1 closes cleanly with budget remaining, otherwise moves wholly to Session 6. Thread does not switch. The observability-sentry-otel thread waits."
    status: pending
  - id: s6-fitness-exploration
    content: "Session 6 (meta-consolidation): Holistic review of every fitness hard/soft-zone file; owner decides compress/raise/restructure/split per file; apply; close arc under --strict-hard."
    status: pending
isProject: false
---

# Staged Doctrine Consolidation and Graduation

**Last Updated**: 2026-04-21 (Session 4 in flight — Tasks 4.0, 4.1, 4.2.a, 4.2.b, 4.2.c, 4.3 landed; PDR-029 Amendment Log entry codifying "active means markdown-ritual, not code" landed mid-session after owner metacognition surfaced the platform-coupling bias in the original script-based shape; Tasks 4.2.b/c/3 reshaped to documentation-first; Tasks 4.4, 4.5, 4.6 remaining. Session 3 had landed at 6/6 under bundle rhythm with four new portable PDRs [PDR-027, PDR-028, PDR-029, PDR-030] + two amendments [PDR-011 thread-scope, PDR-026 per-thread-per-session].)
**Status**: 🟡 Session 4 in flight — Tasks 4.4, 4.5, 4.6 + close remaining
**Scope**: Six-session staged execution of the overdue consolidation backlog surfaced by the 2026-04-21 dry-run. Each session commits to a bounded landing target per PDR-026; context is preserved across session boundaries via operational memory.

**Related artefacts**:

- Dry-run analysis (preserved):
  [`../../../reference/agentic-engineering/consolidation-design/consolidation-dry-run-2026-04-21.md`](../../../reference/agentic-engineering/consolidation-design/consolidation-dry-run-2026-04-21.md)
- Memory-feedback execution plan (partially consumed by this plan):
  [`memory-feedback-and-emergent-learning-mechanisms.execution.plan.md`](memory-feedback-and-emergent-learning-mechanisms.execution.plan.md)
- Memory-feedback metacognition:
  [`../future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md`](../future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md)
- Thread record this plan extends:
  [`../../../memory/operational/threads/memory-feedback.next-session.md`](../../../memory/operational/threads/memory-feedback.next-session.md)
- Consolidation command being sequenced:
  [`../../../commands/consolidate-docs.md`](../../../commands/consolidate-docs.md)

---

## Context

The 2026-04-21 consolidation dry-run surfaced that the overdue
backlog is **three tiers of work stacked under one name**, plus
**two large backlogs** (outgoing, experience) whose audit exceeds
the scale of a routine consolidation. Running all 11 steps in one
pass would produce either a multi-hour session with high context
pressure or a partial pass that leaves load-bearing pieces open.
Owner decision (2026-04-21, this arc): stage the work into six
sessions, with explicit session break points.

### Owner decisions recorded (this arc, 2026-04-21)

The following decisions govern the staged execution. (Original
plan text expected them to land in a dedicated "standing-decision
register surface" prescribed by PDR-029 Class-A.1 Layer 2; that
prescription was **retracted** late in Session 4 per PDR-029's
second 2026-04-21 Amendment Log entry. The decisions live in
their proper homes instead: plan-local meta-decisions stay in
this plan body; Practice-governance decisions decompose into
PDRs via Session 5 / next consolidation; architectural decisions
decompose into ADRs; procedural rules into `.agent/rules/`;
meta-principles into `principles.md`.)

1. **Three-plane memory taxonomy is RATIFIED** as the working
   frame, with the explicit caveat that **meta-tripwires are
   required** to periodically re-evaluate whether the three seams
   are correct, whether concepts are missing, and whether the
   model needs to move to a different level of abstraction. The
   meta-tripwires are **Family B** installed in Session 4.
2. **Three-plane memory taxonomy is PORTABLE.** It lands as a
   Practice-Core PDR in `.agent/practice-core/decision-records/`,
   not as a host-local doctrine file. Downstream: the
   Executive-Memory Feedback Loop PDR (Session 3) and the
   Threads/Sessions/Agent-Identity PDR (Session 3) both land as
   portable PDRs.
3. **Fitness functions are NOT BLOCKING** for the graduation work
   in Sessions 1–5. The `pnpm practice:fitness --strict-hard` gate
   is *tolerated to fail* at the close of Sessions 1–5. Session 6
   is a **holistic fitness exploration** as the final meta-
   consolidation step — compress, raise limits, restructure, or
   split per file, owner-decided. `--strict-hard` MUST pass at
   end of Session 6.
4. **Experience scan is a separate session** with its own plan.
   `.agent/experience/` (128 files dating to 2025-01) is too
   large to audit as step 4 of a single consolidation. A dedicated
   `experience-audit.plan.md` is queued as a future plan after
   Session 6.
5. **Staged execution is the shape**, with excellence — no
   shortcuts, no deferred-without-cause. Each session lands its
   target fully or explicitly re-scopes in handoff.
6. **Session break points are explicit and protected.** Each
   session ends with handoff discipline (per `session-handoff.md`):
   thread record updated, continuity surface refreshed, napkin
   entries captured, next-session preconditions named. Context
   budget is the primary reason; coherence is the secondary.

### Dry-run insight preserved

The full dry-run projection (11-step walkthrough, tier analysis,
risk table, metacognitive reflection on the self-applying nature
of the pass) is preserved at
[`../../../reference/agentic-engineering/consolidation-design/consolidation-dry-run-2026-04-21.md`](../../../reference/agentic-engineering/consolidation-design/consolidation-dry-run-2026-04-21.md).
This plan is its operational consequence.

---

## Design Principles

1. **Cadence-first ordering.** Sessions ordered by firing
   frequency of the mechanisms they install: patterns accumulate
   before PDRs; tripwires fire per-session; outgoing-triage fires
   at PDR-007 review; fitness-exploration fires at meta review.
2. **Self-application.** The pass extracts `inherited-framing-
   without-first-principles-check` and `passive-guidance-loses-
   to-artefact-gravity`. The pass itself must not reproduce those
   failures. Session 1 authors the patterns *before* the work they
   would apply to accumulates further. Session 3's Perturbation
   Bundle PDR explicitly includes active-tripwire design so the
   pattern is not reproduced in its own extraction.
3. **Owner-gated doctrine.** PDR-003 care-and-consult applies.
   Every PDR and amendment is drafted by the agent and reviewed by
   the owner. No ad-hoc sub-agent dispatch on Core edits.
4. **Per-session landing commitment (PDR-026).** Each session
   commits to ONE landing target. Cross-session spread within a
   session is anti-pattern.
5. **Session break points preserve context.** Handoff discipline
   runs at the end of every session. The next session starts cold
   from memory surfaces, not from conversation continuity.
6. **Markdown-first, grep-compatible.** No new tooling; no ML;
   registers and tripwires land as markdown structures a human can
   read and simple scripts can scan.

### Session Discipline

Reference: [`../../templates/components/session-discipline.md`](../../templates/components/session-discipline.md).

The four disciplines apply to every session in this plan:

1. **Session count is a template, not a contract.** Six is the
   current projection from the 2026-04-21 dry-run. Sessions may
   compress, split, or re-order based on discovery at each close.
   The landing-target orientation is load-bearing; the count is
   not. Compressions and splits are recorded in the thread record
   and (if material) in this plan's todo list.
2. **Mid-arc checkpoints** fire at the close of Session 3 (after
   the doctrine bundle lands) and Session 5 (before the fitness
   exploration). Each checkpoint asks: *"does the rest of the arc
   still make sense? Owner decides proceed / adjust / pause."*
3. **Context-budget thresholds** per session: wall-clock ~30 min
   of continuous agent work, OR approaching three-quarters of
   available context, triggers close at the next natural boundary
   with full handoff discipline. Sessions 2 (napkin rotation) and
   3 (doctrine drafting) are the most at risk of breaching;
   authors should watch them explicitly.
4. **Metacognition at session open** — every session opens with
   the first-principles check (*"what did I inherit here; has it
   been ratified; does its shape still fit?"*). Invoke
   `/jc-metacognition` against the plan context if the answer is
   uncertain. Most valuable for Sessions 1–3; Sessions 4–6 can
   rely on accumulated ratifications unless new doctrine has
   landed since.

### Non-Goals (YAGNI)

- ❌ Audit of `.agent/experience/` (128 files) — deferred to
  dedicated session and plan.
- ❌ `--strict-hard` closure at end of Sessions 1–5 (owner
  decision 3).
- ❌ Automation of the consolidation itself. The command is
  owner-invoked per session.
- ❌ Retroactive identity attribution for `f9d5b0d2` beyond the
  existing napkin note. Start attribution forward from 2026-04-22.
- ❌ New platforms or adapters. Scope is Practice memory + doctrine.
- ❌ Compressing Core content just to satisfy fitness. Session 6's
  exploration considers every valid response including raising
  limits or restructuring.

---

## Reviewer Scheduling

Phase-aligned per PDR-015.

**Pre-execution** (before Session 1 starts):

- `assumptions-reviewer` — challenges the six-session staging
  itself; checks proportionality.
- `docs-adr-reviewer` — scans the projected PDR set for
  overlap with existing ADRs/PDRs.

**Mid-cycle** (within sessions):

- `docs-adr-reviewer` — after each PDR draft and each amendment
  (Session 3; Session 4 rule cross-linking).
- `architecture-reviewer-barney` + `architecture-reviewer-betty` —
  after Session 4 (tripwires change boundary/authority shapes).
- `assumptions-reviewer` — at Session 6 start (is the fitness
  exploration well-framed?).

**Close** (at plan close after Session 6):

- `release-readiness-reviewer` — GO / GO-WITH-CONDITIONS / NO-GO
  on the arc close.
- `onboarding-reviewer` — do the new conventions and rules appear
  in onboarding paths?
- `docs-adr-reviewer` — final coherence check across all landed
  PDRs, rules, and CHANGELOG.

---

## Foundation Document Commitment

Before every session, re-read:

1. `.agent/directives/principles.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`
4. `.agent/directives/metacognition.md`
5. `.agent/directives/orientation.md`
6. This plan's *Owner decisions recorded* block.

Ask at each session: *"Could it be simpler without compromising
quality or value?"*

---

## Session break-point discipline

Every session ends with:

1. **Landing outcome recorded** per PDR-026 in the thread record
   ([`threads/memory-feedback.next-session.md`](../../../memory/operational/threads/memory-feedback.next-session.md)).
2. **Continuity surface refreshed** —
   [`repo-continuity.md`](../../../memory/operational/repo-continuity.md)
   Deep consolidation status reflects what landed and what remains.
3. **Napkin entries captured** — any surprise, correction, or
   meta-observation from the session lands in
   [`napkin.md`](../../../memory/active/napkin.md) in the standard
   surprise format.
4. **Identity row updated** — this session's identity row in the
   thread record updates `last_session`; new identities add rows
   (per the proposed additive-identity rule landing in Session 3).
5. **Next-session preconditions named** — what the next session
   needs on hand before it starts (PDR approvals, owner inputs,
   repo state).
6. **`pnpm markdownlint:root`** exits 0. (Fitness gate tolerated
   to fail per owner decision 3 until Session 6.)
7. **No commits without owner authorisation** per the
   `--no-verify` fresh-authorisation invariant and standard
   session-handoff lightweight discipline. Owner decides commit
   boundaries per session.

The next session starts by:

1. Reading `repo-continuity.md` end-to-end.
2. Reading the thread record.
3. Reading this plan's relevant session section.
4. Running the foundation-document commitment above.
5. Applying the first-principles check (Session 3 tripwires will
   codify this).
6. Beginning work only after identity row is updated.

---

## Session 1 — Foundation close + Pattern authoring + Artefact Map refresh

**Landing target**: two patterns authored; `practice.md` Artefact
Map refreshed; owner decisions recorded in `repo-continuity.md §
Standing decisions`; brief experience entry.

**Preconditions** (all already met at plan landing):

- Owner has ratified the three-plane taxonomy (decision 1).
- Owner has confirmed portability (decision 2).
- Owner has deferred fitness (decision 3).
- Owner has deferred experience scan (decision 4).
- Owner has chosen staged shape (decision 5).
- Session break points understood (decision 6).

### Task 1.1 — Record Phase 0 decisions as standing

**Where**: new section `repo-continuity.md § Standing decisions`.
(Historical note: the original plan expected this section to
migrate into a dedicated "standing-decision register surface"
prescribed by PDR-029 Class-A.1 Layer 2. That prescription was
retracted late in Session 4 per PDR-029's second 2026-04-21
Amendment Log entry. Section reframed at Session 4 close as a
pointer to proper-artefact homes instead.)

**Content**: the six owner decisions above, with date (2026-04-21)
and reason (dry-run of this arc).

**Acceptance**:

1. ✅ All six decisions are present verbatim or lightly edited
   for prose flow.
2. ✅ Each has a `recorded:` date and `reason:` line.
3. ✅ Section is greppable (`grep -n "Standing decisions"`).

**Deterministic validation**:

```bash
grep -n "Standing decisions" .agent/memory/operational/repo-continuity.md
grep -c "recorded:" .agent/memory/operational/repo-continuity.md
# Expected: ≥6 matching lines for recorded:
```

### Task 1.2 — Author `inherited-framing-without-first-principles-check` pattern

**Destination**:
`.agent/memory/active/patterns/inherited-framing-without-first-principles-check.md`

**Frontmatter** per `.agent/memory/active/patterns/README.md`.

**Content**:

- Definition of the pattern.
- **Six instances** cited by date and context (three on 2026-04-20
  + three on 2026-04-21 — 4th, 5th, 6th caught by external
  friction mechanisms described in napkin).
- **Three-clause first-principles check** from 2026-04-21 napkin
  entries:
  - (1) Is the test-shape right for the Oak behaviour being
    proven?
  - (2) Does the test-file naming match the landing path the plan
    implies (pre-commit vs CI gates)?
  - (3) Does this literal token in the plan body match the
    vendor's current API surface, or is it a doc-level word the
    plan borrowed?
- **Countermeasure link** forward to Session 4 Family-A tripwires.

**Acceptance**:

1. ✅ File exists with valid frontmatter.
2. ✅ All six instances cited.
3. ✅ Three-clause check reproduced verbatim.
4. ✅ Cross-link to the Family-A tripwires (forward reference;
   resolved in Session 4).

### Task 1.3 — Author `passive-guidance-loses-to-artefact-gravity` pattern

**Destination**:
`.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md`

**Content**:

- Definition of the pattern (guardrails that earn their cost only
  when environmentally enforced).
- **Two instances**:
  - The three perturbation mechanisms (first-principles
    metacognition prompt, standing-decision register, non-goal
    re-ratification ritual) not firing on the 4th/5th/6th
    inherited-framing instances.
  - The chat-text next-session opener bypassing the authoritative
    `next-session-opener.md` during the memory-feedback-plan
    session.
- **Heath-brothers tripwire framing** (Decisive ch. 9; Switch
  ch. 8) — a tripwire is a pre-committed rule that converts a
  continuous decision into a discrete trigger event.
- **Countermeasure link** forward to Session 3 Perturbation
  Bundle PDR and Session 4 tripwire installation.

**Acceptance**:

1. ✅ File exists with valid frontmatter.
2. ✅ Both instances cited.
3. ✅ Heath-brothers framing named.
4. ✅ Forward cross-links to Session 3 and Session 4.

### Task 1.4 — Install the first Family-A tripwire (front-loaded)

**Why front-loaded**: Sessions 2 and 3 do substantial work
(napkin rotation; PDR drafting). Without an installed tripwire,
those sessions carry the same `inherited-framing` and
`passive-guidance` exposure the staged plan is extracting. The
highest-leverage protection is to install at least one rule-layer
tripwire in Session 1 so the rest of the arc is covered.

**Destination**:
`.agent/rules/plan-body-first-principles-check.md`.

**Content**: the three-clause check from the inherited-framing
pattern, framed as an always-applied rule:

> Before authoring tests, implementations, or doctrine prescribed
> by a plan body, run the three-clause first-principles check:
>
> 1. Is the test-shape (or implementation-shape, or doctrine-
>    shape) right for the Oak-authored behaviour being proven,
>    or is it a vendor/configuration/framework assertion in
>    disguise?
> 2. Does the file naming carry a tooling contract (pre-commit,
>    CI gate, lint config) that constrains how or when this can
>    land?
> 3. Does any literal token taken from the plan body (especially
>    vendor API values, config keys, file paths) match the
>    current upstream surface, or is it a doc-level word the
>    plan borrowed?
>
> If any clause fails, surface the mismatch to the owner before
> writing code or doctrine.

**Citations**:

- `.agent/memory/active/patterns/inherited-framing-without-first-principles-check.md`
  (authored in Task 1.2 of this same session; the rule cites the
  pattern file).
- **Forward reference**: the Perturbation-Mechanism Bundle PDR
  landing in Session 3 will retroactively govern this rule. The
  rule cites the forward reference explicitly and is amended in
  Session 3 to replace the forward reference with the concrete
  PDR number.

**Acceptance**:

1. ✅ Rule file exists at
   `.agent/rules/plan-body-first-principles-check.md`.
2. ✅ Rule cites the pattern file from Task 1.2.
3. ✅ Rule lists all three clauses verbatim.
4. ✅ Forward reference to Session 3 PDR explicit.
5. ✅ Rule appears in rule-discovery paths (`.agent/directives/AGENT.md`
   or equivalent).
6. ✅ `docs-adr-reviewer` agrees the rule is well-formed.

**Deterministic validation**:

```bash
ls .agent/rules/plan-body-first-principles-check.md
grep -n "three-clause\|first-principles" .agent/rules/plan-body-first-principles-check.md
grep -l "plan-body-first-principles-check" .agent/directives/
```

### Task 1.5 — Refresh `practice.md` Artefact Map

**Change**: the row describing `.agent/memory/` is rewritten from
a single-thing description to explicitly enumerate the three modes
(`active/`, `operational/`, `executive/`) with their read triggers
and refresh cadences. Cite `.agent/memory/README.md` for detail.

**Acceptance**:

1. ✅ The `.agent/memory/` row names all three modes.
2. ✅ Practice Core `CHANGELOG.md` records the amendment.
3. ✅ Owner has approved the edit per PDR-003.

### Task 1.6 — Brief experience entry (optional)

**Destination**:
`.agent/experience/2026-04-21-threads-sessions-identity.md`
(or similar).

**Content**: reflective note on the session vs thread distinction
and the active-vs-passive guardrail insight. Not a technical
write-up; an experience record per the `.agent/experience/`
convention.

**Acceptance**:

1. ✅ File exists if the session naturally produces a reflective
   surplus; skip otherwise.

### Session 1 close

- Apply the session break-point discipline.
- Update thread record: Session 1 landing reported; Session 2
  preconditions named (none beyond owner presence).
- `pnpm markdownlint:root` exits 0.

---

## Session 2 — Napkin rotation + Distilled merge-and-prune + Pending-graduations register schema

**Landing target**: napkin rotated to archive; distilled refined;
pending-graduations register has a formal schema; Deep consolidation
status refreshed.

**Preconditions**: Session 1 landed.

### Task 2.1 — Rotate napkin

**Source**: `.agent/memory/active/napkin.md` (currently ~1324
lines).

**Process** per `consolidate-docs.md` step 6:

a. Extract every "Patterns to Remember", "Mistakes Made", "Key
   Insight", "Lessons" entry.
b. Merge into `distilled.md` (compare against existing; add new;
   update refined; skip duplicate; investigate contradiction).
c. Prune distilled entries already captured in permanent
   documentation.
d. Archive outgoing napkin to
   `.agent/memory/active/archive/napkin-2026-04-21.md`.
e. Create fresh `napkin.md` with a session heading documenting
   the distillation.

**Acceptance**:

1. ✅ Archive file exists at
   `.agent/memory/active/archive/napkin-2026-04-21.md`.
2. ✅ New `napkin.md` is under 100 lines, with a distillation
   heading.
3. ✅ `distilled.md` deltas are sensible (additive for new
   learnings; prune for graduated content).

### Task 2.2 — Formalise pending-graduations register schema

This is the Phase 2 work from the memory-feedback execution plan,
folded in here because the schema formalisation fits the napkin
rotation naturally (both re-shape `repo-continuity.md § Deep
consolidation status`).

**Change**: `repo-continuity.md § Deep consolidation status` is
rewritten from prose-plus-bullets to a structured list per the
schema in the memory-feedback execution plan:

- `captured-date` (YYYY-MM-DD)
- `source-surface` (e.g. `napkin`, `distilled`, `workstream brief`,
  `executive surface`)
- `graduation-target` (one of: `pattern | PDR | ADR | rule | practice-md | other`)
- `trigger-condition` (concrete signal moving to "due")
- `status` (one of: `pending | due | overdue | graduated`)

Schema documented in-line at the top of the section.

**Acceptance**:

1. ✅ Schema fields present and greppable.
2. ✅ Every current item is recast into the schema.
3. ✅ Items graduated in Session 1 (two patterns + Artefact Map)
   now have `status: graduated` with cross-reference to the new
   pattern files.

### Task 2.3 — Bind the register to session workflows

**Changes**:

- `.agent/commands/session-handoff.md` gains a step: "Review and
  refresh the pending-graduations register; add new items; update
  `last_session` entries."
- `.agent/commands/consolidate-docs.md` step 7 preamble names the
  register as an input.

**Acceptance**:

1. ✅ Both commands name the register by path.
2. ✅ Next session-handoff is expected to exercise the binding.

### Session 2 close

- Apply session break-point discipline.
- Fresh napkin has a `2026-04-21 distillation` heading and a
  session-close stub.
- Update thread record; Session 3 preconditions named (owner
  available for PDR-003 review; drafting slots allocated).

---

## Session 3 — Doctrine bundle drafting (owner-gated)

**Landing target**: three new PDRs drafted and approved; two PDR
amendments drafted and applied.

**Preconditions**: Sessions 1–2 closed; owner available for
per-amendment review per PDR-003.

**Sub-sessions are natural here.** Each PDR is drafted, owner
reviews, then next PDR. Record progress in thread record at each
review boundary; resume from there if context pressure requires a
break.

**Drafting and review rhythm** (named explicitly so pacing is not
surprising):

> **Bundle rhythm (default)**: author all five drafts (3 PDRs +
> 2 amendments) in a single authoring sitting; owner reviews the
> bundle in one review sitting; agent applies approved changes in
> order; owner signs off on the bundle at close. Five drafts, two
> review sittings, one sign-off.
>
> **Sequential rhythm (alternative)**: author PDR 1 → owner
> reviews → apply → author PDR 2 → owner reviews → apply → …
> Five drafts, five review sittings, five sign-offs.

Bundle rhythm is the default: fewer context switches, clearer
coherence review across the five documents, one integration point
at sign-off. Sequential rhythm is reserved for cases where an
earlier PDR's review materially changes the design of a later
one. Owner chooses the rhythm before Task 3.1 starts; the choice
is recorded in the thread record as a session-scoped decision.

Mid-session context-budget check (per Session Discipline): if the
authoring sitting approaches the three-quarter context mark
before all five drafts complete, split at the next PDR boundary
and continue in a sub-session. Do not compress drafting quality
to fit budget.

### Task 3.1 — PDR: Threads, Sessions, and Agent Identity

**Destination**: new file in
`.agent/practice-core/decision-records/` (next number after
PDR-026 — likely PDR-027).

**Content**:

- Thread as continuity unit; session as time-bounded agent
  occurrence.
- Identity schema (platform, model, session_id_prefix,
  agent_name, role, first_session, last_session).
- **Additive identity rule**: joining a thread adds an identity;
  never overwrites.
- Cross-reference to the thread convention installed in the
  2026-04-21 memory-feedback session at
  `.agent/memory/operational/threads/README.md`.
- Portable per owner decision 2.

**Acceptance**:

1. ✅ PDR exists with correct numbering and frontmatter.
2. ✅ Three-plane taxonomy referenced.
3. ✅ Owner has approved the draft per PDR-003.
4. ✅ The PDR cites its establishing work (this plan + napkin).

### Task 3.2 — PDR: Executive-Memory Feedback Loop

**Destination**:
`.agent/practice-core/decision-records/PDR-NNN-executive-memory-feedback-loop.md`.

**Content**:

- Definition of the drift-detection surface convention
  (`Last verified accurate` + `Known drift / pending update`).
- Graduation channel: napkin tag `Source plane: executive` routes
  through step 5 cross-plane scan into pending-graduations
  register.
- Cross-references to ADR-131 (self-reinforcing improvement loop)
  and the thread convention.
- Portable per owner decision 2.

**Acceptance**:

1. ✅ PDR exists with correct numbering and frontmatter.
2. ✅ Cites ADR-131 and memory/README.md.
3. ✅ Owner has approved the draft per PDR-003.

### Task 3.3 — PDR: Perturbation-Mechanism Bundle with active tripwires

**Historical note (2026-04-21 late-Session-4)**: this Task
description reflects the Session 3 drafting intent for PDR-029.
PDR-029 landed with this substance and was subsequently amended
TWICE in Session 4 per its Amendment Log: (1) "active" tripwire
layers are markdown-ritual steps naming authoritative sources,
not code; (2) Class-A.1 Layer-2 "standing-decision register
surface" was retracted — A.1 Layer 2 is served by the existing
foundation-directive grounding. Both amendments take precedence
over the Task 3.3 content below.

**Destination**:
`.agent/practice-core/decision-records/PDR-NNN-perturbation-mechanism-bundle.md`.

**Content**:

- The three original perturbation mechanisms (first-principles
  metacognition prompt; standing-decision register; non-goal
  re-ratification ritual) promoted from passive register to
  documented Practice doctrine.
- **Active-tripwire requirement**: the bundle MUST include at
  least two environmentally-enforced tripwires in each of
  Family A's two classes. **Family A has two classes**, both
  instances of the `passive-guidance-loses-to-artefact-gravity`
  failure mode:
  - **Class A.1 — Plan-body inherited-framing.** The three-
    clause first-principles check that fires on shape-entry.
    Session 1 landed the always-applied rule at
    `.agent/rules/plan-body-first-principles-check.md`. Session 4
    installs the standing-decision register surface as the
    second complementary layer.
  - **Class A.2 — Agent-registration / identity discipline.**
    Tripwires that convert "agent should remember to register
    on thread join and de-register on session close" (passive)
    into environmentally-triggered steps (active). Three
    complementary layers: a session-open identity-registration
    rule; a session-close identity-update gate in
    `/session-handoff`; a platform-neutral stale-identity
    health probe. See Session 4 Tasks 4.2 and 4.3 for concrete
    installs.
  The PDR NAMES the tripwire layers from the Heath-brothers
  table in the 2026-04-21 fourth-half napkin entry and
  specifies the default install picks for Session 4 per class
  above.
- **Platform parity is load-bearing.** The PDR makes explicit
  that any Family A rule MUST have canonical + Claude +
  Cursor adapters AND an AGENT.md citation so Codex and Gemini
  sessions discover the rule at session open. The PDR makes
  explicit that any Family A probe MUST use platform-neutral
  inputs (thread identity tables, tracks frontmatter, continuity
  surface fields) OR, if it must consult live session state,
  MUST provide cross-platform parity (Claude + Cursor + Codex
  minimum). Claude-only probes that assert cross-platform
  claims are forbidden.
- **Meta-tripwires (Family B)** for the memory-taxonomy itself —
  periodic re-evaluation of whether the three-plane seams are
  correct, whether concepts are missing, and whether a different
  abstraction level is needed. The PDR names the Family-B layer
  defaults:
  - Per-consolidation step: "did any content resist classification
    into one of the three planes in this pass?"
  - Accumulation-triggered: ≥N patterns with `cross_plane: true`
    in a rolling window signals seam review.
  - Orphan-item signal: pending-graduations items whose
    graduation-target cannot name a clean plane.
  - (At least two install in Session 4.)
- Portable per owner decision 2.

**Acceptance**:

1. ✅ PDR exists with correct numbering and frontmatter.
2. ✅ Both families of tripwires are named with default install
   picks.
3. ✅ Heath-brothers framing cited.
4. ✅ Owner has approved the draft per PDR-003.
5. ✅ PDR is self-applying: the tripwires it names are the ones
   Session 4 must install, not abstract guidance.

### Task 3.4 — Amendment: PDR-011 (Continuity Surfaces and Surprise Pipeline)

**Change**: extend PDR-011 to frame the pipeline as *thread-
scoped at the upper lifecycle*, session-scoped at the lower
lifecycle. Capture → distil → graduate → enforce still applies;
the top level is now a thread not a session.

**Acceptance**:

1. ✅ PDR-011 amended in place.
2. ✅ Thread ↔ session relationship named.
3. ✅ Owner has approved.
4. ✅ PDR-011 `Status` frontmatter notes the amendment and date.

### Task 3.5 — Amendment: PDR-026 (Per-Session Landing Commitment)

**Change**: clarify that a landing commitment is per-thread-per-
session — i.e. a session commits to landing one thread's target,
and cross-thread spread in a single session is anti-pattern.

**Acceptance**:

1. ✅ PDR-026 amended in place.
2. ✅ Per-thread phrasing present.
3. ✅ Owner has approved.

### Session 3 close

- Apply session break-point discipline.
- Practice Core `CHANGELOG.md` has entries for each landed PDR +
  each amendment.
- Thread record: Session 3 landing reported; Session 4
  preconditions named (PDRs must be present as targets for the
  tripwires).
- `docs-adr-reviewer` pass run on the bundle (can be mid-cycle if
  session bandwidth permits).
- **Mid-arc checkpoint 1** (per Session Discipline §2): review
  remaining sessions (4, 5, 6) against the doctrine just landed.
  Does the rest of the arc still make sense? Owner decides
  proceed / adjust / pause. Outcomes:
  - *Proceed*: no changes; Session 4 starts on preconditions.
  - *Adjust*: plan amendments captured in this file; affected
    todos updated; thread record notes the adjustment.
  - *Pause*: thread record reflects the pause; next-session
    landing target re-stated with the resume condition.

---

## Session 4 — Active tripwire installation + Agent-identity infrastructure + Rule cross-linking + Roadmap sync

**Landing target**: all required Family A tripwires installed
across both classes (plan-body + agent-registration); Family B
tripwires installed; platform-neutral stale-identity health probe
operational with unit coverage; derivable active-agent-register
view available via a named command; `/session-handoff` enforces
identity discipline as a hard gate; rules cite their PDRs with
full platform parity (Claude + Cursor + AGENT.md citation);
cross-plane path rules installed; roadmap has an entry for this
plan.

**Preconditions**: Session 3's PDRs approved and landed — in
particular the Perturbation-Mechanism Bundle PDR with its two
Family A classes (plan-body + agent-registration) and the
Threads/Sessions/Agent-Identity PDR.

**Doctrine-and-operations requirement.** Session 4 delivers both
the **doctrine** that classifies these mechanisms as tripwires
(citations into the Session 3 PDRs) AND the **reliable
operational processes** that actually fire on the right cadence.
Doctrine without firing cadence is the `passive-guidance-loses-
to-artefact-gravity` failure mode; Session 4 must not reproduce
it in its own extraction.

### Task 4.0 — Author platform-agnostic commit skill (tooling prerequisite)

**Why front-loaded**: owner-directed fold-in at Session 3 close
(2026-04-21, option **b** from the scheduling question after
observing *"that happens a lot, we need a platform agnostic
commit skill that lays out the commit format requirements"*).
Session 4 will author many new artefacts and commit them in
tranches; having the commit skill in place first amortises
across those commits and closes the passive-guidance exposure
window on commit authoring at the same time Session 4 closes
the windows on plan-body inheritance (Class A.1) and agent-
registration (Class A.2).

**Motivating failure mode**: `passive-guidance-loses-to-
artefact-gravity` (PDR-029's motivating pattern) applied to
commit authoring. Commitlint rules fire at commit-msg hook time
but not at draft time. Every session hits rework: subject-case
violations, header-length violations, missing Co-Authored-By
footer. The hook is a tripwire, but a post-hoc one; by then
the full message has been drafted and must be re-authored. The
skill installs a pre-draft tripwire: constraints are enumerated
inline BEFORE the agent drafts, not AFTER the commit-msg hook
rejects.

**Destinations**:

- **Canonical**: `.agent/skills/jc-commit/shared/jc-commit.md`
  (or equivalent canonical location per repo's skill
  convention).
- **Claude adapter**: `.claude/skills/jc-commit/SKILL.md`.
- **Cursor adapter**: `.cursor/skills/jc-commit/SKILL.md`.
- **Codex adapter**: `.agents/skills/jc-commit/SKILL.md`.
- **AGENT.md citation**: skill path listed in
  `.agent/directives/AGENT.md` development-commands or essential
  skills section so non-loader platforms discover it at session
  open.

**Skill behaviour**:

1. Read the repo's commitlint config at invocation time —
   check for `commitlint.config.{js,cjs,mjs,ts}`,
   `.commitlintrc.{json,yaml,yml}`, `package.json`
   `commitlint` field, or `.husky/commit-msg`. Fall back
   gracefully if none found.
2. Enumerate the constraints inline before drafting:
   - Header maximum length (from `header-max-length` rule).
   - Subject-case restrictions (from `subject-case` rule —
     typically lowercase-start, acronyms preserved).
   - Type vocabulary (from `type-enum` rule — typically
     `feat`/`fix`/`chore`/`docs`/`refactor`/`test`/`style`).
   - Scope rules if configured.
   - Required footers (Co-Authored-By when collaborating; any
     repo-specific trailers).
3. Offer a format-check pass before invoking `git commit` —
   verify the drafted header against enumerated constraints;
   if any constraint fails, surface the mismatch and the
   agent re-drafts before hitting the hook.
4. Provide a HEREDOC-wrapped invocation template that
   preserves multi-line body formatting.

**Platform parity requirement (load-bearing, per PDR-029)**:

- Canonical skill body is the source of truth; adapters are
  thin pointers.
- Constraint-enumeration logic reads repo files (commitlint
  config, husky config, package.json) — platform-neutral
  inputs.
- No platform-specific config-reading; every platform's
  adapter points at the same canonical skill.
- `pnpm portability:check` must pass on the adapter parity.

**Acceptance Criteria**:

1. ✅ Canonical skill file exists at
   `.agent/skills/jc-commit/shared/jc-commit.md` (or
   equivalent canonical location).
2. ✅ Claude, Cursor, and Codex adapter files exist and are
   thin pointers to the canonical.
3. ✅ `.agent/directives/AGENT.md` cites the skill path.
4. ✅ `pnpm portability:check` reports canonical/adapter parity.
5. ✅ Skill reads the repo's commitlint config programmatically
   (not hard-coded) and enumerates at least
   `header-max-length`, `subject-case`, `type-enum`.
6. ✅ Skill is **self-applying**: the Session 4 commit that
   lands the skill uses the skill to draft its own message.
7. ✅ A brief test — running the skill against this repo's
   commitlint config — produces the observed constraints
   (header ≤100 chars; subject-case restrictions; conventional-
   commits type vocabulary).

**Formal PDR-029 Class A.3 amendment**: DEFERRED. Install the
skill as an instance applying PDR-029's design principles
(firing cadence first; platform parity load-bearing; two
complementary layers target — skill as read-trigger + format-
check as workflow-invocation gate). If a second similar
artefact-gravity class emerges in a future session (e.g.
issue-title authoring, PR-body authoring), propose the formal
PDR-029 amendment at that point with both new classes in
scope, which is honest doctrine accumulation (second instance
triggers promotion) rather than single-instance generalisation.

**Deterministic Validation**:

```bash
ls .agent/skills/jc-commit/
ls .claude/skills/jc-commit/SKILL.md
ls .cursor/skills/jc-commit/SKILL.md
ls .agents/skills/jc-commit/SKILL.md
grep -n "jc-commit" .agent/directives/AGENT.md
pnpm portability:check
```

### Task 4.1 — Install Family A Class A.1 tripwires (plan-body inherited-framing)

**Shape revised late-Session-4 (2026-04-21)** — see PDR-029's second
2026-04-21 Amendment Log entry. The original drafting prescribed a
**standing-decision register surface** as Class A.1 Layer 2. Owner
metacognition late in Session 4 surfaced that "standing decision" is
not a category distinct from ADR / PDR / rule / principle / plan-
local meta-decision — it is a default property of any ratified
artefact. The prescribed register was a misc bucket. The amendment
retracts the register-surface prescription: A.1's Layer 2 intent
(owner-ratified decisions re-enter scope at every session) is served
by the existing foundation-directive grounding (`principles.md` +
ADR index + PDR tier + `.agent/rules/` tier) already read at
session open — which is a ritual-moment markdown-reading active
layer per PDR-029's first 2026-04-21 amendment.

**Class A.1 covers**: the plan-body first-principles check —
"is the shape prescribed by the plan right for the Oak-authored
behaviour being proven?" — and the related shape-entry failure
modes (inherited framing, doc-level vendor literals, silent
landing-path contracts).

**Installs** (revised):

- **Already-landed** (Session 1 Task 1.4): always-applied rule at
  [`.agent/rules/plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md).
  Session 4 updates the rule's `PDR-NNN, pending` forward reference
  to PDR-029 and cites the two 2026-04-21 amendments. Claude and
  Cursor adapters already exist.
- **Layer 2 by retrospective naming** (no new authoring): the
  existing foundation-directive grounding read at session open
  (`principles.md` + ADR index + PDR index + `.agent/rules/` tier)
  serves as A.1 Layer 2. Session 4 `start-right-quick` /
  `-thorough` updates name `threads/README.md` for Class A.2
  grounding but do NOT add a "standing-decisions" surface.

**Acceptance** (revised):

1. ✅ Plan-body rule's `PDR-NNN, pending` forward reference
   resolved to PDR-029 with citations to both 2026-04-21
   amendments.
2. ✅ No "standing-decisions" surface exists (post-retraction).
3. ✅ `start-right-quick` + `start-right-thorough` do not cite a
   "standing-decisions" surface (post-retraction).
4. ✅ AGENT.md does not cite a "standing-decisions" surface.
5. ✅ PDR-029's second 2026-04-21 Amendment Log entry codifies
   the retraction.

**Deterministic validation**:

```bash
# post-retraction: zero references to standing-decisions in live surfaces
grep -rn "standing-decisions" .agent/ docs/ | grep -v archive/ | grep -v CHANGELOG
# Expected: empty, OR only historical notes in the PDR-029 Amendment Log
# and the napkin/CHANGELOG narrating the retraction
```

### Task 4.2 — Install Family A Class A.2 tripwires (agent-registration / identity discipline)

**Class A.2 covers**: the agent-registration failure mode — the
additive-identity rule in `threads/README.md` is currently
**passive guidance** (prose in a README, agent-recall-dependent).
The same failure mode applies to de-registration (`last_session`
updates) and to stale-identity detection. Class A.2 installs
three complementary layers so no single failure mode (forgot to
read README; forgot to run session-handoff; tooling unused)
leaves the register silently wrong.

**Motivation**: owner question 2026-04-21 — "do we have a register
of which agents are working on what, processes to check/
register/de-register, means of detecting stale registrations?"
Answer at time of question: register-side primitives present as
prose; firing cadence absent. Self-application of the pattern
we just extracted.

**Installs**:

#### 4.2.a — Session-open identity-registration rule

**Destination**:
`.agent/rules/register-identity-on-thread-join.md`
(canonical) + `.claude/rules/register-identity-on-thread-join.md`
(thin pointer) + `.cursor/rules/register-identity-on-thread-join.mdc`
(with `alwaysApply: true` frontmatter + crisp `description:`).

**Content**:

> Before any edit, list the threads this session is touching.
> For each thread, open its next-session record
> (`.agent/memory/operational/threads/<slug>.next-session.md`)
> and either (a) update `last_session` on the matching identity
> row if your platform / model / `agent_name` match an existing
> row (per the additive-identity rule), or (b) add a new
> identity row if you are a new identity on this thread. Do not
> proceed until the row is written.

The rule cites the Threads/Sessions/Agent-Identity PDR from
Session 3 Task 3.1 and the `passive-guidance-loses-to-artefact-
gravity` pattern.

**Platform parity**:

- Claude: `.claude/rules/register-identity-on-thread-join.md`
  (auto-loaded).
- Cursor: `.cursor/rules/register-identity-on-thread-join.mdc`
  with `alwaysApply: true` (auto-loaded).
- Codex + Gemini: rule path listed explicitly in
  `.agent/directives/AGENT.md` under Essential Links or
  Grounding. `AGENT.md § **RULES**` now names the
  `.agent/rules/` tier as a whole and instructs non-loader
  platforms to read every file in it at session open (graduated
  in Session 2 extended scope, 2026-04-21), so the new rule is
  discoverable by tier membership; still list it explicitly in
  the grounding surface for redundancy.

**Discoverability amendments** (from onboarding-reviewer audit,
Session 2 extended scope; pending-graduations register items
`start-right-quick-missing-threads-step` and
`observability-thread-legacy-singular-path` consumed here):

- `.agent/skills/start-right-quick/shared/start-right.md` step 4
  gains a bullet naming `.agent/memory/operational/threads/README.md`
  as a read-at-grounding surface (alongside the existing
  `repo-continuity.md`, `workstreams/`, `tracks/` reads).
- `.agent/skills/start-right-thorough/shared/start-right-thorough.md`
  gains the same amendment.
- The rule body explicitly names the legacy singular path at
  `.agent/memory/operational/next-session-opener.md` for the
  `observability-sentry-otel` thread — until that record is
  migrated to
  `.agent/memory/operational/threads/observability-sentry-otel.next-session.md`,
  the rule applies to both paths. The migration itself is
  prioritised for Session 4 (or earlier if opportunity arises)
  to close the structural gap that invisibilises the identity
  rule on the observability thread.
- Distilled and `start-right-quick` gain a citation pointer to
  [`.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md`](../../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)
  so the constraint surfaces at tripwire design time
  (register item
  `passive-guidance-pattern-citation-in-distilled-and-start-right`).

**Acceptance**:

1. ✅ Canonical rule file exists with the three-plane citation.
2. ✅ Claude + Cursor adapter files exist.
3. ✅ `.agent/directives/AGENT.md` references the rule path
   (within the `.agent/rules/` tier citation that already
   landed in Session 2 extended scope).
4. ✅ `pnpm portability:check` reports canonical/adapter parity.
5. ✅ The rule is self-applying: the Session 4 session that
   installs it MUST itself register an identity row on the
   `memory-feedback` thread before writing the rule file.
6. ✅ `start-right-quick` step 4 and `start-right-thorough`
   name `threads/README.md` explicitly.
7. ✅ Rule body handles the legacy singular path OR the
   observability thread's next-session record is migrated to
   `threads/` as part of Session 4 close.
8. ✅ `distilled.md` cites
   `passive-guidance-loses-to-artefact-gravity.md` so the
   pattern surfaces at design time for any future rule/probe.

#### 4.2.b — Session-close identity-update gate in `/session-handoff`

**Shape revised mid-Session-4 (2026-04-21)** — see the PDR-029
Amendment Log entry of the same date. The original drafting
prescribed a `pnpm session-handoff:check` script with unit
tests in `agent-tools/`. Owner metacognition surfaced that
"active" tripwire layers in this infrastructure are satisfied
by ritual-moment markdown steps that name authoritative
sources, not by code execution. Code is reserved for work an
agent cannot reasonably perform by reading markdown; a script
here would platform-couple the tripwire to Claude (shell /
`pnpm` / runtime access) and degrade the platform-agnostic
promise that the rest of the infrastructure honours via
markdown-first. The revised shape is documentation-first.

**Change**: `.agent/commands/session-handoff.md` step 7c is a
**hard documentation gate** — four-step walkthrough the agent
performs by reading and writing markdown:

1. Read `.agent/memory/operational/repo-continuity.md § Active
   threads` — enumerate active threads structurally from the
   authoritative table (not from memory; self-reporting is the
   failure mode per `passive-guidance-loses-to-artefact-
   gravity`).
2. For each thread touched this session, open its next-session
   record at the declared `Next-session record` path (canonical
   `threads/<slug>.next-session.md` or legacy singular path for
   the observability thread until migration).
3. Confirm the matching identity row's `last_session` equals
   today's date per PDR-027's additive-identity rule; if not,
   fix it.
4. Do not proceed to step 8 until every touched thread is
   current. The "do not proceed" clause carries the same
   authority as a script `exit(1)` without platform coupling —
   any agent running the ritual is obligated to honour it.

**Structural enumeration** requirement (register item
`session-handoff-check-must-enumerate-threads` consumed here):
satisfied by the ritual step explicitly naming the
authoritative file and instructing the agent to read it. The
file IS the structural source; the instruction prevents
self-reporting. Any agent on any platform performs the same
enumeration by reading the same file.

**Acceptance**:

1. ✅ `session-handoff.md` step 7c names the gate as a required
   step with the four-step walkthrough.
2. ✅ Step text explicitly names `repo-continuity.md § Active
   threads` as the authoritative source and instructs
   enumeration from it (not from agent memory).
3. ✅ Step text handles both canonical `threads/<slug>` and
   legacy singular paths.
4. ✅ Self-applying: this Session 4 close itself walks the
   ritual — the install session is the first session to run
   the gate.
5. ✅ PDR-029 Amendment Log 2026-04-21 codifies the
   documentation-first shape so future sessions do not
   re-propose code.

#### 4.2.c — Stale-identity audit (documentation-first)

**Shape revised mid-Session-4 (2026-04-21)** — per the PDR-029
Amendment Log entry of the same date. The original drafting
prescribed a TypeScript probe at
`agent-tools/src/core/health-probe-agent-identities.ts`
registered in `claude-agent-ops health`. Revised: the probe is
a markdown checklist walked at `/jc-consolidate-docs` ritual
time. Code layer is reserved for work agents cannot perform by
reading markdown.

**Change**: `.agent/commands/consolidate-docs.md` step 7c is a
six-check audit walkthrough. For each active thread and each
track card, the agent reads markdown and records findings; the
audit is a named ritual step, so any agent running
`/jc-consolidate-docs` walks the checks. No scanner code.

**Inputs (platform-neutral)**:

- `.agent/memory/operational/threads/*.next-session.md`
  (identity tables).
- `.agent/memory/operational/repo-continuity.md § Active threads`
  (`Active identities` column).
- `.agent/memory/operational/tracks/*.md` (`expires_at`
  frontmatter).

**Checks** (walked by the agent at consolidation time):

1. Stale `last_session` on still-active threads (>14 days per
   the PDR-029 `IDENTITY_STALENESS_DAYS` threshold).
2. Orphan threads (active threads with zero current identities).
3. Missing required identity fields (platform / model /
   agent_name / session_id_prefix / role / first_session /
   last_session per PDR-027 schema).
4. Track cards with `expires_at` past today's date.
5. Duplicate identity rows (same platform/model/agent_name
   recorded twice instead of `last_session` update — additive-
   rule violation).
6. Every active thread has a corresponding next-session record
   file (canonical or legacy path; catches Active-threads
   table additions without a thread record). Register item
   `stale-identity-probe-sixth-check` consumed here.

**Platform parity**: by construction. The audit reads markdown
files every platform can read. No runtime required.

**Acceptance**:

1. ✅ `consolidate-docs.md` step 7c exists with the six-check
   walkthrough.
2. ✅ Each check names the authoritative source the agent
   reads.
3. ✅ Findings are surfaced as a numbered list for owner
   action; the audit does not mutate surfaces.
4. ✅ The ritual's "do not silently skip" posture provides
   enforcement force equivalent to `warn` exit codes without
   platform coupling.
5. ✅ PDR-029 Amendment Log 2026-04-21 codifies the
   documentation-first shape so future sessions do not
   re-propose a probe module.

### Task 4.3 — Active-agent register convention (documentation-first)

**Shape revised mid-Session-4 (2026-04-21)** — per the PDR-029
Amendment Log entry of the same date. The original drafting
prescribed a new CLI subcommand `pnpm agent-tools:claude-
agent-ops agents`. Revised: the `Active identities` column in
`repo-continuity.md § Active threads` **IS** the register. The
right-now view is reading the table. No CLI, no aggregation
code.

**Rationale**: owner's original question ("which agents are
working on what") is answered by the already-existing column.
A separate CLI layer would be derived data drifting from the
markdown; the markdown IS the derivable view.

**Changes**:

1. **`repo-continuity.md § Active threads`** gains framing
   that names the `Active identities` column as THE register
   per PDR-029 (as amended 2026-04-21). Column format:
   `platform / model / agent_name / role / last_session` per
   identity, comma-separated when multiple are active.
2. **`session-handoff.md` step 7b** refreshes the column at
   every handoff (in addition to the per-thread next-session
   record's full identity table). Two edits, both required,
   named as sub-steps under 7b.
3. **`consolidate-docs.md` step 7c** (Task 4.2.c) audits the
   column's correspondence to per-thread records (check 6).

**Platform parity**: by construction — markdown on every
platform.

**Acceptance**:

1. ✅ `repo-continuity.md § Active threads` has the preamble
   naming the column as the register.
2. ✅ `session-handoff.md` step 7b enumerates both the
   per-thread record update and the column refresh.
3. ✅ PDR-029 Amendment Log 2026-04-21 codifies the shape so
   future sessions do not re-propose a CLI subcommand.
4. ✅ The column is kept current at Session 4 close.

### Task 4.4 — Install Family B tripwires (memory-taxonomy meta)

**Defaults** (owner may override):

- **Per-consolidation taxonomy-check step**: amendment to
  `.agent/commands/consolidate-docs.md` step 5 (cross-session
  scan) gaining a bullet: *"Ask: did any napkin entry or pattern
  candidate in this pass resist classification into `active/`,
  `operational/`, or `executive/`? If so, capture as a seam-
  review candidate in the pending-graduations register with
  graduation-target: `taxonomy-review`."*
- **Orphan-item signal**: amendment to `repo-continuity.md § Deep
  consolidation status` / pending-graduations register schema
  gains a validator bullet: items with `graduation-target: other`
  that cannot be refined within two sessions flag the seam for
  taxonomy review.

**Acceptance**:

1. ✅ Both amendments landed.
2. ✅ `consolidate-docs.md` step 5 cross-plane question is
   present.
3. ✅ The seam-review mechanism is documented.

### Task 4.5 — Cross-plane path rules (memory-feedback execution plan Phase 3 work, folded in)

**Rules installed**:

- `.agent/rules/executive-memory-drift-capture.md` — the `active →
  executive` path rule from the memory-feedback execution plan
  Task 3.1. Cites the Executive-Memory Feedback Loop PDR and
  ADR-131.
- **Workstream-brief tag** convention for `executive-impact:`
  (operational → executive path).
- **Napkin tag convention** for `Source plane: executive`
  (executive → anywhere path).

**Acceptance**:

1. ✅ All three path mechanisms present.
2. ✅ Each cites the Executive-Memory Feedback Loop PDR.

### Task 4.6 — Practice Core CHANGELOG + Roadmap sync

**Changes**:

- Practice Core `CHANGELOG.md` has entries for all PDRs, amendments,
  patterns, and rules landed in Sessions 1–4 (including the
  agent-registration tripwires under Class A.2).
- Roadmap gets a brief entry for this plan in the Adjacent section.
- Memory-feedback execution plan gets a status update: Phase 0
  closed (answers recorded in `repo-continuity.md § Standing
  decisions`); Phases 1–5 consumed by this staged plan; Phase 6
  Executive-Memory Feedback Loop doctrine landed via Session 3
  PDR.
- Memory-feedback strategic plan in `future/` gets a closing
  note pointing to this plan as the operational consequence.
- `.agent/memory/operational/threads/README.md` cites the
  Threads/Sessions/Agent-Identity PDR (Session 3 Task 3.1) by
  number, replacing the "proposed, not yet ratified" framing;
  the identity schema and additive rule are now PDR-backed.
- `agent-tools/README.md` — **no changes under the revised shape**.
  The pre-revision plan named new CLI subcommands; the PDR-029
  Amendment Log entry (2026-04-21) resolved these as documentation
  walkthroughs in `/session-handoff` and `/jc-consolidate-docs`
  instead. No agent-tools changes in Session 4.

**Acceptance**:

1. ✅ Five surfaces updated under the revised shape (Practice Core
   CHANGELOG; roadmap; memory-feedback execution plan; memory-
   feedback strategic plan; threads README).
2. ✅ Cross-references consistent (the new PDR numbers replace
   all `PDR-NNN, pending` tokens across the repo).
3. ✅ Plan body itself updated to the revised shape per the
   *"Misleading docs are blocking"* standing decision installed
   this session.

**Deterministic validation**:

```bash
# Zero pending-PDR placeholders should remain after Session 4
grep -rn "PDR-NNN, pending" .agent/ docs/ | grep -v archive/
# Expected: empty or only archive files
```

### Session 4 close

**Shape revised mid-Session-4 (2026-04-21)** per the PDR-029
Amendment Log entry — scripts and CLIs replaced by documentation
walkthroughs in `/session-handoff` and `/jc-consolidate-docs`. In
agentic engineering, markdown IS infrastructure.

- Apply session break-point discipline.
- Thread record: Session 4 landing reported. Session 4 is the
  self-applying test for Task 4.2 — the identity-on-join rule,
  the session-close gate walkthrough, and the stale-identity audit
  walkthrough must all be exercised *on this session's own close*
  (the installing session is the first to walk the ritual).
- Walk `/session-handoff` step 7c (four-step documentation gate):
  enumerate active threads from `repo-continuity.md § Active
  threads`; open each touched thread's next-session record; verify
  `last_session` equals today's date; confirm no un-updated thread
  blocks close.
- Refresh `Active identities` column in `repo-continuity.md §
  Active threads` for each touched thread per step 7b.
- `pnpm portability:check` exits 0 (new rules canonical + Claude +
  Cursor adapters counted; AGENT.md citations present).
- `pnpm markdownlint:root` exits 0 (fitness-tolerated failures on
  unrelated pre-existing content remain acceptable per Standing
  decision on Sessions 1–5).
- Reviewer pass: `docs-adr-reviewer` (citation coherence across new
  rules, PDR-029 amendment, amended commands — **docs are
  infrastructure**);
  `architecture-reviewer-barney` + `architecture-reviewer-betty`
  (cross-plane structural review of the installed tripwire network
  + the register convention — boundary and authority changes in
  markdown are still boundary and authority changes);
  `onboarding-reviewer` (optional spot-check on cold-start
  discoverability of the newly-installed tripwires).
- No TypeScript unit tests this session — revised shape has no
  code to test; proof of tripwire behaviour accrues over time as
  subsequent sessions walk the rituals.

---

## Session 5 — Evaluate-and-simplify first (mandatory), then extend

**Framing revised at Session-4 late close (2026-04-21)** after two
owner interventions — the theatre-vs-value honest question, then
the direction *"there is no alternative thread, we need this work
to be FINISHED, properly, carefully, fully, choosing long-term
architectural excellence at every point."* Session 4 produced
substantial doctrine (two PDR-029 amendments, two new rules, two
documentation walkthroughs, index sweeps, ~15 register items,
nine pattern candidates across the session) with **zero empirical
firing evidence**. The Session 4 agent also missed a linked
authoritative workstream brief
(`operational-awareness-continuity.md`) despite the thread record
citing it.

Session 5 is **not** a choice between two postures. It is a
mandatory sequence with a conditional second stage.

### Stage 1 (mandatory) — Evaluate-and-simplify first

**Landing requirement**: stage 1 must close before stage 2 begins.
If stage 1 is substantial, stage 1 alone is Session 5's landing
target and stage 2 moves to Session 6 (alongside or replacing
parts of fitness exploration). Long-term architectural excellence
at every decision point: simplify before extending; delete before
adding; prove before elaborating.

1. **Close OAC Phase 4** — plan at
   [`archive/completed/operational-awareness-and-continuity-surface-separation.plan.md`](../archive/completed/operational-awareness-and-continuity-surface-separation.plan.md).
   Pilot evidence at
   `.agent/analysis/operational-awareness-pilot-evidence.md`.
   Refinements (a) and (b) appear landed via separate channels;
   (c) expiry-check helper and (d) napkin-promotion helper remain
   open; portability-posture decision remains open; six-surface
   doc propagation (plan Task 4.3) remains open. Close every
   open item — land, or defer with named trigger, or delete —
   no "partial complete". This is the one piece of the current
   arc with empirical-evidence grounding.
2. **Simplification pass with delete-bias** — per recently-added
   doctrine surface, first-principles-ask *"is this earning its
   keep at current scale, or is it speculative scaffolding?"* Each
   candidate gets a concrete resolution (keep + explicit reason /
   merge / delete / defer with named trigger):
   - **Thread vs workstream collapse**: 1:1 empirical mapping at
     both active threads. Doctrine permits 1:N but never been
     exercised. Resolve the structural question.
   - **PDR-029 consolidating revision**: two Amendment Log
     entries from one day; Amendment Log now longer than the
     Decision body. Rewrite the Decision section to absorb the
     amendments inline; preserve the log for provenance.
   - **Nine Session-4 pattern candidates**: `active-means-ritual-
     moment-not-code-execution`, `plan-body-framing-outlives-
     reviewers`, `new-doctrine-lands-without-sweeping-indexes`,
     `metacognition-cascade-reveals-deeper-misframes-per-pass`,
     `owner-repeats-principle-verbally-when-written-doctrine-
     is-insufficient`, `intent-vs-close-review-serve-different-
     boundary-scopes`, `doctrine-velocity-exceeds-impact-signal`,
     `hedged-link-in-ritual-is-read-as-none`, `owner-honest-
     question-as-critical-signal`. Promote only those with three
     solid instances; archive or delete the rest.
   - **Family-A tripwire installs**: any lacking a concrete
     near-term firing opportunity in Sessions 5–6 must name the
     trigger or be retired.
   - **Session-4 register entries** (~15 items across
     decomposition + first-principles checks + pattern
     candidates): each one — keep, merge, or retire.
3. **Answer the thread/workstream/track first-principles check**
   — three sub-items in the Due register: thread-vs-workstream
   collapse; track-naming-scope; naming-collision discipline.
   These must resolve in stage 1 because thread/workstream
   structure is the substrate the remaining decomposition work
   (stage 2) sits on.

**Stage 1 acceptance**: OAC Phase 4 fully closed; concrete list
of doctrine deletions/consolidations applied (not just
documented); owner-directed resolution on the three first-
principles questions; register pruned.

### Stage 2 (conditional) — Extension

Runs **only if** stage 1 closes cleanly with budget and coherence
remaining. Otherwise moves to Session 6.

**Landing target**: every file in `.agent/practice-context/outgoing/`
audited against PDR-007; promoted to a durable home or deleted.
Ten retracted-`standing-decisions.md` items decomposed into
ADR / PDR / rule / principle / plan-local homes per the register
entry.

**Preconditions**: Sessions 1–4 closed; stage 1 closed.

**Files under triage** (current state, 1481 lines across 10+ files):

- `cross-repo-transfer-operations.md` (59)
- `design-token-governance-for-self-contained-ui.md` (41)
- `health-probe-and-policy-spine.md` (51)
- `plan-lifecycle-four-stage.md` (44)
- `practice-maturity-framework.md` (59)
- `production-reviewer-scaling.md` (94)
- `reviewer-gateway-operations.md` (63)
- `seeding-protocol-guidance.md` (62)
- `starter-templates.md` (659)
- `three-dimension-fitness-functions.md` (143)
- `two-way-merge-methodology.md` (80)
- `agent-collaboration/` subdirectory — separate; scope to the
  directory's README.

### Task 5.1 — Triage decision per file

For each file, determine:

- **Ephemeral exchange** (sender→receiver context, expires after
  integration) → keep in place.
- **Portable Practice governance** → promote to PDR in
  `.agent/practice-core/decision-records/` then delete outgoing
  copy.
- **General abstract pattern** (≥2 instances, ecosystem-agnostic)
  → promote to `.agent/practice-core/patterns/` via synthesis
  then delete outgoing copy.
- **Host-local reference** → promote to `.agent/reference/` then
  delete outgoing copy.
- **Defect** (substance exists nowhere else, not properly
  ephemeral) → delete (per PDR-007 defect definition).

Each file's disposition is owner-approved before action.

**Acceptance**:

1. ✅ Every file has a disposition recorded.
2. ✅ Actions applied per disposition.
3. ✅ `outgoing/` contains only ephemeral exchange at close.
4. ✅ Any file promoted has its new home cited in the PDR/pattern/
   reference frontmatter.

### Session 5 close

- Apply session break-point discipline.
- Thread record; Session 6 preconditions named (owner available
  for per-file fitness decisions).
- **Mid-arc checkpoint 2** (per Session Discipline §2): review
  Session 6 against the arc so far. The fitness exploration is
  the final meta-consolidation; before it starts, confirm the
  scope still fits (which files are flagged now? did prior
  sessions' edits materially change the fitness map? does the
  compress/raise/restructure/split framework still cover the
  decisions needed?). Owner decides proceed / adjust / pause.

---

## Session 6 — Holistic fitness exploration (final meta-consolidation)

**Landing target**: every fitness hard/soft-zone file has an
owner-approved disposition (compress / raise / restructure /
split); all dispositions applied; `pnpm practice:fitness --strict-hard`
passes; the arc closes.

**Preconditions**: Sessions 1–5 closed. Owner available for
per-file review.

### Task 6.1 — Enumerate current fitness state

Run `pnpm practice:fitness:informational` and capture the full
state. Expected classes (current known, subject to drift from the
prior sessions' landing activity):

- **Hard-zone files** (blocking under `--strict-hard`): 5 known
  at 2026-04-21 dry-run — may be more or fewer after prior
  sessions' edits.
- **Soft-zone files**: 10 known at 2026-04-21 dry-run.

### Task 6.2 — Per-file disposition

For each flagged file, walk with the owner through the four-
option framework:

- **Compress**: remove entries already captured elsewhere; tighten
  prose. Owner-approved if the result preserves meaning.
- **Raise limits**: the file is legitimately dense and the target
  was set conservatively. `fitness_line_target` can be raised by
  agents; `fitness_line_limit`, `fitness_char_limit`, and
  `fitness_line_length` can only be raised by the owner.
- **Restructure**: the file's internal organisation masks density;
  restructure improves readability at the same size.
- **Split**: follow `split_strategy` frontmatter; extract a
  sub-file per the strategy.

**Special case — the three directives in hard zone**:

- `principles.md` (characters 25628/24000): substantial; cannot
  be simply compressed without risking doctrine. Owner to decide
  whether raising the limit is legitimate (the directive is
  stable and central) or whether sections should split to
  governance docs.
- `testing-strategy.md` (lines 564/550): similar trade-off.
- `orientation.md`, `artefact-inventory.md`: one-line prose fixes,
  trivial.

**Special case — `continuity-practice.md`** (`docs/governance/`):
governance doc, possibly affected by this arc's doctrine additions;
may already have resolved during Sessions 3–4 if the doctrine
changed.

**Acceptance**:

1. ✅ Every flagged file has a recorded disposition.
2. ✅ Every disposition is applied.
3. ✅ `pnpm practice:fitness --strict-hard` exits 0.
4. ✅ Any raised limits are documented (fitness frontmatter
   + rationale in the file or a note in the arc-close napkin
   entry).
5. ✅ `pnpm agent-tools:claude-agent-ops health` exits 0 and
   the stale-identity probe reports no `warn` for the
   `memory-feedback` thread at arc close (the identity row
   for this arc's final session is fresh; no orphan thread;
   no past-due track cards).
6. ✅ `pnpm agent-tools:claude-agent-ops agents` renders the
   final active-agent-register state cleanly.

### Task 6.3 — Arc close

- Apply final session break-point discipline.
- Thread record: arc landing reported.
- Practice Core `CHANGELOG.md` gains an arc-close entry summarising
  all doctrine landed, patterns extracted, tripwires installed,
  outgoing files promoted/deleted, fitness dispositions applied.
- Move this plan from `current/` to `archive/completed/` per
  ADR-117.
- Update `documentation-sync-log.md`.
- `/jc-consolidate-docs` runs cleanly with `--strict-hard` passing.
- Final adversarial review: `release-readiness-reviewer`,
  `onboarding-reviewer`, `docs-adr-reviewer`, `assumptions-
  reviewer`.

**Acceptance**:

1. ✅ All four reviewer passes complete; no unresolved BLOCKERs.
2. ✅ Arc-close CHANGELOG entry present.
3. ✅ Plan archived.
4. ✅ `documentation-sync-log.md` records the close.

---

## Risk Assessment

| Risk | Mitigation |
| --- | --- |
| Pass inherits 11-step recipe without first-principles check | Session 1 authors the pattern before the work accumulates further; the plan body stages away from the routine recipe |
| Pass reproduces `passive-guidance` by landing the Perturbation PDR without active tripwires | Session 3 Task 3.3 requires Family A + Family B tripwires named with defaults; Session 4 installs them |
| Class A.2 tripwires installed Claude-only, replicating the platform-specific probe anti-pattern | Session 4 Task 4.2 mandates canonical + Claude + Cursor adapters AND AGENT.md citation; probes MUST be platform-neutral by input OR provide cross-platform parity; `pnpm portability:check` is an acceptance criterion |
| Class A.2 identity-on-join rule lands as passive guidance itself (agent forgets to read it) | Three complementary layers (rule + session-handoff gate + staleness probe) — no single failure mode fully exposes the register; the rule is also self-applying at install time |
| Stale-identity probe emits false warns and gets ignored over time | Probe defaults to `warn` not `fail`; threshold configurable; Session 6 fitness exploration reviews probe health; pattern `passive-guidance-loses-to-artefact-gravity` re-applied if drift emerges |
| Context exhaustion within a session | Six-session shape; session break-point discipline; thread-record-first continuity |
| Owner-approval pacing on 3 PDRs + 2 amendments in one session | Session 3 explicitly allows sub-sessions with owner-review boundaries |
| Fitness drift into critical zone while Sessions 1–5 tolerate hard | Owner decision 3 accepts this; Session 6 is scoped to resolve |
| `docs-adr-reviewer` finds overlap between new PDRs and existing ones | Pre-execution reviewer pass scans; Session 3 drafts cite existing surfaces explicitly |
| Outgoing triage surfaces more substance than fits one session | Session 5 can split to 5a/5b at the file-list midpoint; thread record carries the split |
| Fitness resolution requires doctrine restructuring | Session 6 is scoped for this; owner-approved per file |
| Thread proliferation during doctrine authoring | Plan is on the `memory-feedback` thread throughout; new threads only if owner explicitly spawns one |
| Session 1 pattern authoring surfaces further instances | Capture in napkin; pattern files are append-friendly; no replan |

---

## Testing Strategy

This plan is doctrine + pattern + rule work on persistent memory
and Practice Core surfaces. It does not generate runtime code.

Validation is per-task deterministic-grep assertions against the
markdown artefacts. Per `testing-strategy.md`: tests prove product
behaviour, not configuration. This plan installs configuration;
the proof surface is the configuration's presence. Behavioural
proof accrues over time as the tripwires fire (Session 4 Family A
fires per-commit; Family B fires per-consolidation).

---

## Foundation Alignment

| Principle | How this plan honours it |
| --- | --- |
| First Question | Six-session shape is simpler than a single-pass that exceeds context or forces partial close |
| Strict and complete | Each session lands fully or explicitly re-scopes in handoff |
| No compatibility layers | Existing surfaces amended in place; no shims |
| TDD at all levels | N/A (no runtime code); validation is per-task grep assertions |
| Fail fast | Session break-point discipline catches drift early |
| Documentation propagation | Every session updates cross-references; Session 4 does the roadmap sync |
| PDR-003 care-and-consult | Every Core edit owner-approved |
| PDR-015 reviewer dispatch | Phase-aligned schedule defined |
| Cadence-first | Session ordering reflects firing cadence of installed mechanisms |

---

## Dependencies

**Blocking** (internal):

- Sessions sequential; each depends on prior.
- Session 3 depends on Session 1 patterns (for the PDRs to
  reference).
- Session 4 depends on Session 3 PDRs (tripwires cite them).
- Session 6 depends on all prior sessions (it resolves accumulated
  fitness pressure).

**Not blocking**:

- Sentry/OTel product thread runs in parallel on its own thread.
  §L-8 Vercel acceptance probe is the next target there; this
  plan does not block or gate it.
- Experience scan runs as its own future session with its own
  plan, after Session 6.

**Related plans**:

- [`memory-feedback-and-emergent-learning-mechanisms.execution.plan.md`](memory-feedback-and-emergent-learning-mechanisms.execution.plan.md)
  — partially consumed; Phase 0 answers landed here; Phases 1–5
  folded into this plan's Sessions; Phase 6 PDR landed in
  Session 3; Phase 7 learning loop runs throughout.
- Future `experience-audit.plan.md` — to be authored after
  Session 6 closes.
- Future `outgoing-triage-methodology.plan.md` — may capture the
  PDR-007 triage process as a reusable methodology, if Session 5
  surfaces one.

---

## Success Criteria (overall)

- ✅ Two patterns landed in `.agent/memory/active/patterns/`.
- ✅ `practice.md` Artefact Map describes the three memory modes.
- ✅ Napkin rotated; distilled refined; pending-graduations
  register has formal schema.
- ✅ Three new PDRs landed (Threads/Identity,
  Executive-Memory Feedback Loop, Perturbation Bundle with
  two-class Family A framing).
- ✅ Two PDR amendments landed (PDR-011, PDR-026).
- ✅ **Family A tripwires installed across both classes**
  (revised mid-Session-4 per PDR-029 Amendment Log —
  documentation-first, platform-agnostic by construction):
  - Class A.1 (plan-body inherited-framing): plan-body rule (S1).
    Layer 2 is served by the existing foundation-directive
    grounding (principles + ADR/PDR/rules tier) per PDR-029's
    second 2026-04-21 Amendment Log entry — the earlier
    prescribed "standing-decision register surface" was retracted
    as a misc bucket.
  - Class A.2 (agent-registration / identity discipline):
    session-open identity-registration rule
    (`.agent/rules/register-identity-on-thread-join.md`) with full
    platform parity (Claude + Cursor adapters + AGENT.md citation
    for Codex/Gemini); session-close identity-update gate as a
    four-step walkthrough in `/session-handoff` step 7c;
    stale-identity audit as a six-check walkthrough in
    `/jc-consolidate-docs` step 7c; `Active identities` column in
    `repo-continuity.md § Active threads` formalised as THE
    right-now register (no CLI needed — markdown IS the view).
  - Class A.3 (commit authoring): platform-agnostic commit skill
    at `.agent/commands/commit.md` with Claude + Cursor + Codex
    adapters + AGENT.md Commit Discipline citation (Task 4.0
    tooling prerequisite).
- ✅ Family B tripwires installed (memory-taxonomy meta-check +
  cross-plane path scan in `/jc-consolidate-docs` step 5;
  orphan-item signal in the pending-graduations register schema).
- ✅ Cross-plane path rules installed (executive-memory-drift-
  capture rule; `cross_plane: true` pattern frontmatter;
  `executive-impact:` workstream-brief tag; `Source plane:`
  napkin origin tag).
- ✅ **Rituals reliable, markdown-first, platform-agnostic**:
  `/session-handoff` step 7c gates identity discipline;
  `/jc-consolidate-docs` step 7c audits staleness; the `Active
  identities` column is the register. Any agent on any platform
  can read, walk, and update these surfaces. Docs ARE
  infrastructure in agentic engineering — there is no separate
  code layer to maintain.
- ✅ Outgoing directory contains only ephemeral exchange.
- ✅ Fitness `--strict-hard` passes.
- ✅ Roadmap synced; memory-feedback execution plan status
  reflects consumption.
- ✅ `documentation-sync-log.md` records the arc.
- ✅ Plan archived to `archive/completed/`.
- ✅ No unresolved BLOCKER findings from close-phase reviewers.
- ✅ No `PDR-NNN, pending` placeholders remain in live surfaces
  (all Session 1–4 forward references resolved to concrete
  PDR numbers).

---

## Consolidation

This plan *is* the staged consolidation. At end of Session 6, run
`/jc-consolidate-docs` for a clean-sheet pass: no overdue items,
no fitness blockers, fresh napkin, fresh distilled. Record
outcomes in `documentation-sync-log.md`. Archive per ADR-117.
