---
fitness_line_target: 200
fitness_line_limit: 270
fitness_char_limit: 16000
fitness_line_length: 100
overflow_disposition: 'leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see §Disposition of Continuity Surfaces)'
---

# Continuity Practice

Continuity is an engineering property: the next session can recover
orientation quickly and truthfully after interruption, handoff,
compaction, or restart.

This is not a claim about model consciousness or private memory. It is
a practice design problem handled through directives, commands,
plans, operational memory, active memory, and permanent documentation.

## Surface Roles

Each continuity surface has one job. Do not let live state, doctrine,
and historical explanation collapse into one file.

| Surface | Role |
| --- | --- |
| This directive | Strategy, rules, and process for continuity |
| `.agent/memory/operational/repo-continuity.md` | Compact repo-level active state |
| `.agent/memory/operational/threads/<slug>.next-session.md` | Per-thread identity, landing target, and lane state |
| `.agent/memory/active/napkin.md` | Session observations, surprises, and corrections |
| `.agent/memory/active/distilled.md` | Refined cross-session lessons conserved between capture and graduation |
| Permanent docs, ADRs, PDRs, rules | Graduated doctrine and enforcement |

The rule of thumb: if a claim should remain true across many sessions,
it belongs here or in permanent doctrine. If it answers "what is live
right now?", it belongs in operational memory.

**Tracking tiers.** The substrate has three tiers on the tracking axis,
and **only local state is git-ignored**: *memory* (knowledge — tracked),
*repo state* (work-in-progress that is checkout-portable — tracked;
`repo-continuity.md` and `threads/*.next-session.md` live here), and
*local state* (checkout/session-specific — git-ignored; `.agent/state/`
claims and comms). The discriminator: *would this be true on another
checkout?* If yes it is repo state (tracked); if it is true only for this
checkout right now it is local state. This is the existing boundary — ADR-203
keeps the live coordination tier of `.agent/state/collaboration/` (comms,
handoffs, the claims registry, the rendered log) untracked-by-design while its
decision-provenance surfaces (`conversations/`, `escalations/`, `sidebars/`)
stay tracked, and PDR-094 (v4, 2026-07-26) governs the extraction-gated
archive disposition — full extraction first, then the raw source archives
as obligation-free mining substrate, never as a hedge. Full
table: `.agent/memory/README.md` §Tracking Tiers.

## Disposition of Continuity Surfaces

This section is scoped to the **continuity surfaces** —
`repo-continuity.md` and `threads/<slug>.next-session.md` — and to the
journal-shaped records and registers beside them that accumulate finished
history (`director-handoff.md`, `frictions-register.md` and
`review-cost-ledger.md`, where the estate keeps them). Other surface
types (the napkin, distilled, buffers) have their own disposition notes
and lifecycles; nothing here changes them or the fitness apparatus.

The fitness checker **only surfaces a signal** when a surface crosses its
thresholds — it takes no action. The agent who sees the signal decides
what to do, guided by the surface's `overflow_disposition` note. For a
continuity surface, crossing a threshold is a routing signal, not a
trigger to shrink the file; the question is "what is the state of the
work this content describes?". Two dispositions:

1. **The work is live** — it still needs doing. The content **stays in
   place**, verbatim, however large. A truthful record of live work is
   worth more than a tidy file.
2. **The work is finished** — landed, abandoned, or superseded.
   **Graduate, then archive** (owner decision, 2026-09-17): first, every
   entry that would change a reader's behaviour is written into its
   permanent home (ADR, PDR, governance doc, plan, pattern, rule, or — for
   a still-live operational fact — the compact current-state surface), and
   the home is read back to confirm it holds the substance; then the
   finished history moves whole to a dated archive beside the surface
   (`archive/<surface>-YYYY-MM-DD.md`; a second archive of one surface on one
   day takes a letter suffix, `-YYYY-MM-DDb.md`, and an existing archive is
   never overwritten), its body proven byte-identical to the moved
   range against the committed blob, as the napkin rotation proves its
   archive (the body is everything after the archive's own frontmatter, where
   it carries one; where the finished ranges are not contiguous, each range
   moves whole in file order with nothing between them, and the body is
   compared with the same ranges cut from the pre-move blob (the surface as
   committed at `HEAD` before the move) and joined in that order; no snapshot
   of the whole file is written, because that commit stays in history as the
   move commit's parent); and the live surface
   keeps only the live state and a one-line pointer to the archive (the path
   written inline as code: the link validator's target set excludes archive
   directories, and the commit gate refuses a markdown link into one). Git retains the literal
   record either way; the archive keeps it readable without a checkout of history.

"Appropriate handling" of a record has three outcomes, not one: curated
(disposition 2 run to its end), left live with the verdict recorded on the
surface, or found homed elsewhere and archived whole; a report that names which
outcome each file got is the honest measure, where a count of files "done" is
not. A record is handled when the lifecycle question has been answered for every
section and the answer left a proof (an archive blob, a recorded verdict, a
named home), never when the file is smaller (2026-09-20 and 2026-09-21).

**Archiving happens only after full processing, never as a means to tick a
box** (owner, 2026-09-19, verbatim: "archiving happens ONLY after full
processing, not as a means to tick a box"). The archive is the lifecycle's
last step, taken once every entry in the range has been read and its
behaviour-changing substance is proven in its home. It is never a parking
place for uncurated content, and a surface whose entries are not all
processed stays where it is, whatever its fitness readout says.

A memory surface's lifecycle has four parts, and a surface is curated only
when it has all four: a **role** (what it is for), a **disposition** for
finished content (the two above), a **trigger** (the moment and the skill
step that run the disposition: the `consolidate-docs` skill's continuity
step, beside napkin rotation), and a **proof** that nothing was lost (the
byte-identity check, and the runbook's token and neighbour checks below).
Until 2026-09-17 only the napkin had all four; the continuity surfaces had
a disposition and a runbook that no skill step invoked, so they grew. Every
surface that grows carries fitness frontmatter, and every continuity
surface's `overflow_disposition` note points here; this section is the
canonical statement for that surface type. Splitting, sharding or renaming
a surface for score is still not a disposition: moving content elsewhere is
not the same as conserving its insight.

### Runbook — curating a continuity surface

The repeatable operational procedure for disposition #2 (a runbook per
[PDR-120](../practice-core/decision-records/PDR-120-runbooks-are-a-content-kind-not-a-surface.md),
embedded here in the doctrine it enacts):

1. **Per entry, ask "live or finished?"** — never infer from age or fitness status.
   Every entry is read before anything moves. The reading is the curating seat's own: a surface
   too large for one context is split into pieces the seat reads in turn with its notes kept as
   it goes, never dispatched to readers (the owner, 2026-10-11: "Consolidation sessions are
   single agent only, work via subagents loses all direct understand and therefore loses
   lessons", withdrawing the set-of-readers reading of 2026-09-20), because a summary of a block
   is not the block and the understanding that makes a lesson homeable is formed only in the
   reading. The join checks (every cross-reference resolves, every id occurs once, a status
   stated in another entry agrees) run at the seams between pieces; the split method and its
   checks are `consolidate-until-done` step 7.
2. **Route by disposition.** Finished and insight-homed → the entry joins the range to
   archive, but *verify the home holds it first* (the `verify-dont-trust` rule; "it's
   all homed" is a convenient claim to check, not trust). Finished and un-homed → route
   the insight to its permanent home, *then* add it to the range. Live → keep,
   compacted (a compact pointer, not the landing narrative). Compact bloated index-table cells to
   the index shape — lane state lives in the thread record, not here.
   A curated record points at its plan and never restates the sequence: the join
   between a lane's record and its plan is where the record's next step lives
   on. One surface owns each volatile fact (which pull request is live, what
   landed, how many rounds) and the others link, so a restatement is derived or
   absent (2026-09-21, one fact hand-restated across five surfaces and
   drifting).
3. **Verify losslessness mechanically.** Before the rewrite, confirm that the
   surface has no uncommitted change (`git diff --quiet HEAD -- <surface>` exits
   0; a pending change is committed first), so that `HEAD` holds the whole
   pre-move surface. After the rewrite, before committing: the
   archive's body (everything after its own frontmatter, where it carries one)
   equals the moved range's bytes in the pre-move blob, `git show HEAD:<surface>`
   (that `HEAD` becomes the move commit's parent; for ranges that are not
   contiguous, the same ranges are cut from that blob and joined in file order);
   every live-pointer token from
   the pre-curation file still appears in the live surface (`grep -F` each); every
   curated passage's statement about a neighbour is re-read against the neighbour (a
   passage saying an "UNCOMMITTED" block had since been committed was the only place
   that fact lived, 2026-09-17; a token grep cannot see it); the
   index-table row count is unchanged; the link-reference count is unchanged;
   `markdownlint` is clean. An *empty dropped-token set is the proof* — the "I kept
   everything" assertion is not (the loss-detector mirrors the `semantic-merge` skill
   §Verify and
   [PDR-119](../practice-core/decision-records/PDR-119-agent-memory-as-an-event-graph-with-renderers.md)).

## Continuity Questions

### Operational continuity

Can the next session answer:

- which thread is active?
- which plan is authoritative?
- what must not be violated?
- what is the next safe step?

### Epistemic continuity

Can the next session recover recent corrections, uncertainty, and
changed understanding rather than just a task list?

### Institutional continuity

Can learning survive beyond the current session and become shared
repo practice?

## Process Loops

Two loops exist, and they are not the same.

### Lightweight Continuity Loop

Every session closes with `wrap` (owner ruling 2026-07-28), which runs
`session-handoff` as its continuity component.

The component's responsibilities are deliberately narrow:

- record landed or unlanded outcome against the landing target;
- refresh compact active state in `repo-continuity.md`;
- update touched thread records;
- capture surprises and corrections in the napkin;
- run the consolidation gate.

It does not imply full review, commit, push, or deep convergence.

### Deep Consolidation Loop

Use `consolidate-docs` only when deep convergence is due.

Triggers include:

- plan or milestone closure;
- settled doctrine or design rationale stranded in ephemeral artefacts;
- practice exchange that needs processing;
- napkin, distilled, pattern, or fitness pressure that requires action;
- repeated surprises suggesting a rule, pattern, ADR, or PDR;
- documentation drift or stale cross-references that need graduation.

Deep consolidation owns graduation, pattern extraction, napkin
rotation, fitness management, and practice exchange.

## Continuity Contract

The live continuity contract belongs in
`.agent/memory/operational/repo-continuity.md`.

`session-handoff` refreshes it using these fields:

- `Active threads`;
- `Branch-primary lane state`;
- `Current session focus`, only when distinct from the branch-primary lane;
- `Repo-wide invariants / non-goals`;
- `Next safe step`;
- `Deep consolidation status`.

Keep that file compact and operational. Active plans remain
authoritative for scope, sequencing, acceptance criteria, and
validation. Thread records carry per-thread identity and lane state.

Do not create a generic "standing decisions" bucket. Standing
decisions live in their proper homes: ADRs, PDRs, directives, rules,
plans, or thread records.

Lane state folds into `threads/<slug>.next-session.md` per PDR-027.

## Continuation Records

Permanent skills and directives carry routing behaviour. Thread records
and handoff records carry volatile facts: branch, controlling
plan, next safe step, active team expectation, validation state, and commit
evidence.

Write continuation records as current-state pointers, not as skill bodies.
After a commit window lands, replace phrases such as "ready to land" with the
actual commit evidence or an explicit unlanded state. A stale "ready to land"
phrase after the work has committed is a continuity defect because the next
session cannot tell whether it should stage work, verify a commit, or move on.

**Supersession refreshes the whole auto-surfaced chain.** A pass that
supersedes a decision, plan state, or next step MUST update the first
surfaces a fresh session reads — the thread-record top and the
`repo-continuity.md` next-safe-step entry — not only the plan body or the
deep artefact. A superseded fact that survives on an auto-surfaced
continuity surface outranks the correction in practice, because the next
session reads the continuity chain first. (Owner-approved fold,
2026-06-11 walk.)

## GO

`GO` is a complementary execution cadence, not a handoff surface.

Use it after `start-right-quick` when:

- the session is likely to span more than one focused execution block;
- multiple active plan surfaces are in play;
- the risk of drift is rising and the todo list needs re-grounding.

`GO` starts from the session-start workflow, `repo-continuity.md`,
the relevant thread record, and the active plan set. Close every
session with `wrap` (which runs `session-handoff`). Use
`consolidate-docs` only when the trigger checklist says deep
convergence is due.

## Surprise Pipeline

Surprise is useful when it changes behaviour.

The pipeline is:

`capture -> distil -> graduate -> enforce`

- **Capture** surprises and corrections in the napkin as they happen.
- **Distil** recurring or high-signal observations into `distilled.md`
  or a pattern candidate.
- **Graduate** stable understanding into an ADR, PDR, governance doc,
  README, TSDoc, or rule.
- **Enforce** recurring failure modes through a command boundary,
  pattern, rule, quality gate, or amended decision record.

Use the napkin surprise shape: expected, actual, why the expectation
failed, and behaviour change.

## Non-Goals

- No new continuity reviewer or specialist by default.
- No giant opaque memory layer.
- No vector-memory substitute for disciplined handoff.
- No default full consolidation at every session end.
- No operational history in this directive; history belongs in
  archives, git, plans, or active-state records while still live.
