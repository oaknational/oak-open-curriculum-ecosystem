---
name: "Coordination Watcher Canonicalisation — Co-Equal Channel Types"
overview: >
  Make arming a coordination watcher deterministic, DRY, and drift-proof for
  BOTH channel types as co-equals: the canonical comms-event stream AND the
  ARC / ArcAngel rapid-comms channel. The CLI emits the canonical watch
  invocation (identity-derived; no hand-authored filter), watch output is
  one concise line per event by default, and the ARC channel is promoted from
  a hand-rolled `tail -F` to a first-class CLI-watched channel type with
  cursor-tracking and identity self-exclusion. Promotes and supersedes the
  `future/` brief of the same name; adds the co-equal-channel-type dimension
  the brief lacked.
status: current
type: developer-experience
promoted_from: "../future/coordination-watcher-canonicalisation.plan.md"
promotion_evidence: "Activation trigger fired on BOTH counts (2026-06-21): owner-direct promotion ('create the plan for fixing the monitors, include general comms and ARC/ArcAngel as co-equal channel types'); and a fourth+ worked instance of watcher-invocation drift — friction F-82 (canonical-comms filter `^[` swallowed ~10 events silently) and friction F-81 (ARC `tail -F` whole-file re-dump + self-fire)."
specialist_reviewer: "assumptions-expert, architecture-expert-betty, architecture-expert-fred, docs-adr-expert, test-expert"
related_plans:
  - "../future/comms-watch-liveness-floor.plan.md"
  - "../future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md"
  - "./comms-watch-hang-hardening.plan.md"
  - "./comms-watch-storage-redesign.plan.md"
related_rules:
  - ".agent/rules/comms-all-channels-watcher.md"
  - ".agent/rules/use-monitor-for-event-driven-wake.md"
  - ".agent/reference/arc-rapid-communication.md"
related_frictions:
  - "F-82 (.agent/plans/agent-tooling/frictions-register.md)"
  - "F-81 (.agent/memory/active/napkin.md; register candidate)"
last_updated: 2026-06-21
isProject: false
todos:
  - id: ws0-grounding
    content: "WS0: re-read the watch implementation first-hand before any mutation — agent-tools/src/collaboration-state/cli-comms-commands.ts (watch emit format + seen-file), cli-runtime.ts (seen-file read/write contract), and the ARC tail convention in .agent/reference/arc-rapid-communication.md. Confirm the F-82 root cause (emit first line `--- NEW [TAG] EVENT ---`, tag mid-line) and the F-81 root cause (non-append rewrite → tail re-dump; no self-exclusion) against current source. Re-derive the worked-instance evidence is still live."
    status: pending
  - id: ws1-one-line-emit
    content: "WS1: `comms watch` emits ONE concise line per event by default (`--- NEW [TYPE][CHANNEL] :: <title> (<from>/<prefix>)`), `--verbose` restores the current multi-line body. TDD: a watch-emit unit test asserts exactly one notification-worthy line per event for each channel shape (broadcast, group, directed, observed, lifecycle). This removes the need for any agent-side filter — the stream is already notification-shaped."
    status: pending
    depends_on: [ws0-grounding]
  - id: ws2-comms-watch-command-emitter
    content: "WS2: `comms watch-command --platform <p> --model <m>` emits the exact, ready-to-run canonical-comms watch invocation: identity-derived seen-file path, self-prefix, comms-dir, no hand-authored grep filter (WS1 makes it unnecessary). The agent runs the emitted string verbatim. TDD: emitter output, when executed, starts a clean watcher (no backfill flood, no swallow); identity-tuple resolution and idempotent re-runs covered. Cure for F-82's class (filter/format co-located in one codebase)."
    status: pending
    depends_on: [ws1-one-line-emit]
  - id: ws3-arc-watch-channel-type
    content: "WS3: ARC as a CO-EQUAL channel type — `arc watch --channel <path> --platform <p> --model <m>`. Tails the ARC markdown file by byte-OFFSET cursor (not `tail -F`), so a non-append rewrite (conservation copy / format pass) does NOT re-dump the whole file (F-81 cure). Parses appended `## [Name prefix] ...` entries; applies identity self-exclusion on the entry signature (no self-fire, F-81 cure); one-line-per-event emit (`--- NEW [ARC][<channel-slug>] :: <subject> (<from>)`); fail-loud per-step deadline + heartbeat-file parity with `comms watch`. TDD: append → one event; whole-file rewrite → zero re-dump; self-authored entry → excluded; split/interleaved append → no partial-line event."
    status: pending
    depends_on: [ws0-grounding]
  - id: ws4-paired-watch-setup-emitter
    content: "WS4: `coord watch-setup --arc-channel <path> --platform <p> --model <m>` emits BOTH watch invocations together (canonical comms + the ARC channel) — the pairing is structural, since the rules mandate the two watchers are ALWAYS paired. `arc watch-command` exists as the single-channel-type sibling. TDD: the paired emitter returns two runnable commands; omitting `--arc-channel` emits only the canonical command with a note that an ARC pairing is expected when a channel is open."
    status: pending
    depends_on: [ws2-comms-watch-command-emitter, ws3-arc-watch-channel-type]
  - id: ws5-doctrine-alignment
    content: "WS5: align doctrine to the emitters and the channel-TYPE-vs-surface model. Amend .agent/rules/comms-all-channels-watcher.md and .agent/rules/use-monitor-for-event-driven-wake.md to point at `coord watch-setup` / `comms watch-command` / `arc watch-command` and REMOVE the hand-authored `grep`/`tail` reference shapes (the F-82/F-81 attractive nuisances). Amend .agent/reference/arc-rapid-communication.md §Protocol so the ARC watcher is `arc watch`, not raw `tail -F`. Encode the channel-TYPE (canonical comms vs ARC) vs surface distinction once. Mirror SKILL pointer in start-right-team per the three-layer adapter model. No invocation example carried inline anywhere."
    status: pending
    depends_on: [ws4-paired-watch-setup-emitter]
  - id: ws6-canonical-home-carryforward
    content: "WS6 (carried forward from the future brief, Phases 1/5/7): rehome the substantive watcher contract out of `.agent/reference/comms-watch-mechanism.md` (reference/ is for EXTERNAL materials) to code-adjacent `agent-tools/src/collaboration-state/README.md` (tool spec) + a Practice rule / PDR-027 amendment (identity self-exclusion discipline + anti-patterns). Delete the reference file; update all cross-references; add `.agent/reference/README.md` stating the folder is external materials only. Falsifiability: a grep over `.agent/reference/` finds no Oak-internal canonical watcher definition."
    status: pending
    depends_on: [ws5-doctrine-alignment]
  - id: ws7-gates-and-reviewers
    content: "WS7: full quality-gate chain at single HEAD (type-check, lint, test, markdownlint, format, portability:check, repo-validators:check, sub-agents:check); dispatch reviewers by substance — assumptions-expert (does the emitter close the invocation-drift class for BOTH channel types?), architecture-expert-betty (watch-abstraction cohesion: one abstraction + two adapters vs two mechanisms), architecture-expert-fred (dependency direction: code-adjacent docs cite Practice rules, never reverse), test-expert (atomic-landing of each emitter/watcher cycle; no audit-shaped tests), docs-adr-expert (content-migration completeness, no broken cross-refs)."
    status: pending
    depends_on: [ws6-canonical-home-carryforward]
---

# Coordination Watcher Canonicalisation — Co-Equal Channel Types

**Status**: 🟢 CURRENT — executable, queued (not started). Promoted from the
[`future/` brief](../future/coordination-watcher-canonicalisation.plan.md)
2026-06-21 (owner-directed), extended with the co-equal-channel-type dimension.

**Provenance**: the `future/` brief (2026-05-22) designed the canonical-comms
half (CLI emits the invocation; "executable beats authoritative-by-convention").
Its activation trigger — *third-instance watcher misconfiguration OR
owner-direct promotion* — fired on **both** counts on 2026-06-21: the owner
directed this plan and named the co-equal-channel-type requirement, and two
fresh worked instances landed (F-82, F-81).

## Problem

Arming a coordination watcher is **hand-authored and can drift silently from
the tooling it depends on**, and the two channel types are **not co-equal**:

- **Canonical comms** has a real CLI (`comms watch`) — cursor-tracked,
  self-excluding, fail-loud, heartbeat. But the *invocation* is hand-copied
  from a rule reference shape. **F-82 (2026-06-21)**: a watcher armed with the
  documented `grep -E '^\['` filter delivered ZERO notifications for ~10 events
  over ~50 min while the process stayed healthy (heartbeat fresh, seen-file
  advancing). Root cause: the emit's first line is `--- NEW [BROADCAST] EVENT
  ---` — the tag is MID-line, so the `^\[` anchor never matched. The filter
  (in the rule + each agent's Monitor command) drifted from the emit format
  (in the CLI), with no mechanism to detect it, and the failure is invisible
  (a swallowed stream looks idle; liveness checks pass).
- **ARC / ArcAngel** is a **second-class** channel — watched by a raw
  `tail -n 0 -F`. **F-81 (2026-06-21, also Birch/Vesuvius)**: a non-append
  rewrite (conservation copy, format pass, or an in-place edit) makes `tail -F`
  re-open the new inode and re-dump the WHOLE file into every follower; and the
  hand-rolled tail has no identity self-exclusion, so it fires on the agent's
  own appends. No cursor, no fail-loud, no heartbeat.

Both are the **same root-cause shape**: an agent hand-authors a watch whose
correctness depends on a format or file-write behaviour the tooling owns, and
the hand-authored artefact drifts. The cure the metacognition directive names
(§"Cure Shape — Structural, Not Doc-Patch") is to **make the invocation
generated by the implementation**, for both channel types as co-equals.

## End Goal · Mechanism · Means

- **End goal (user impact)**: any agent, on either channel type, arms a correct
  watcher by running a CLI-emitted command — no hand-authored filter or tail,
  no silent swallow (F-82), no rewrite re-dump or self-fire (F-81), no drift.
  The pairing of canonical-comms + ARC watchers becomes structural, not a
  discipline to remember.
- **Mechanism**: the CLI owns both the emit format and the emitted invocation,
  so they cannot drift (one codebase, co-varying). One-line-per-event emit
  removes the agent-side filter entirely. ARC becomes a first-class watch
  channel type sharing the watch abstraction (cursor, self-exclusion,
  fail-loud, heartbeat) rather than a fragile bespoke tail.
- **Means**: WS1 one-line emit → WS2 comms `watch-command` emitter → WS3 ARC
  `arc watch` channel type → WS4 paired `watch-setup` emitter → WS5 doctrine
  alignment → WS6 canonical-home migration (carried forward) → WS7 gates +
  reviewers.

## The architectural spine — channel TYPE vs surface (co-equal channel types)

The owner's correction is the load-bearing distinction the `future/` brief
missed:

- **Channel TYPE** = the substrate/transport. Two co-equals:
  1. **Canonical comms** — a directory of JSON event files
     (`.agent/state/collaboration/comms/`); cursor = a seen-set of event ids.
  2. **ARC / ArcAngel** — one append-only markdown file under
     `.agent/collaboration/rapid-comms/`; cursor = a byte offset.
- **Surface** = a sub-stream *within* the canonical-comms type (broadcast,
  group, directed, observed, lifecycle; and the substrate surfaces the
  `future/` brief enumerated — active-claims, conversations, escalations,
  handoffs). Surfaces are a canonical-comms concern, NOT a second channel type.

The watch abstraction generalises over **TYPE**: a watch source is
`(type, instance)` that emits one concise line per new event, self-excludes by
PDR-027 identity, tracks a type-appropriate cursor, fails loud on a hung step,
and writes a heartbeat. `comms watch` and `arc watch` are two adapters over
that one abstraction. This is simpler than today's two divergent mechanisms
(robust CLI + fragile tail) — it is the "could it be simpler / would it be
simpler if the system changed" answer.

> Conflating TYPE with surface is exactly why the `future/` brief's
> "multi-surface" never reached ARC: it expanded canonical surfaces but left
> ARC on `tail -F`. This plan separates the axes and makes the TYPES co-equal;
> the canonical-surface expansion (claims/conversations/escalations) remains a
> distinct, deferrable concern (see Non-Goals).

## Workstreams

Each workstream is a sequence of TDD cycle-pairs (Red → Green → Refactor),
one commit per cycle, tests and product code landing together
(`testing-strategy.md`; never test-ahead or code-ahead). Detailed cycle
acceptance lives in the frontmatter todos; the headlines:

- **WS0 — Grounding** (non-code): re-read the watch source first-hand;
  re-confirm the F-82 and F-81 root causes against current code; the generator
  is the source of truth (`schema-first-execution.md` §"analyse the generator").
- **WS1 — One-line-per-event emit** (`comms watch`): concise default emit,
  `--verbose` for the body. Removes the agent-side filter need (F-82 half 1).
- **WS2 — `comms watch-command` emitter**: emits the exact identity-derived
  canonical invocation; no hand-authored filter (F-82 half 2).
- **WS3 — `arc watch` as a co-equal channel type**: offset-cursor tail (no
  re-dump), identity self-exclusion (no self-fire), one-line emit, fail-loud +
  heartbeat parity (F-81 cure).
- **WS4 — Paired `coord watch-setup` emitter**: emits BOTH watch commands
  together; pairing becomes structural.
- **WS5 — Doctrine alignment**: rules + ARC reference point at the emitters;
  remove the hand-authored `grep`/`tail` reference shapes; encode TYPE-vs-surface.
- **WS6 — Canonical-home migration** (carried forward from the brief): rehome
  the watcher contract out of `.agent/reference/` to code-adjacent + a Practice
  rule.
- **WS7 — Gates + reviewers**.

## Acceptance Criteria (outcome-based)

1. **F-82 closed, both halves**: running the output of
   `comms watch-command --platform <p> --model <m>` starts a clean watcher with
   NO backfill flood, NO agent-side filter, and one concise line per event.
   A watcher armed this way delivers a non-self event as a notification (proven
   by an integration test that writes one event and asserts one emitted line).
2. **F-81 closed**: `arc watch` (a) emits exactly one event per appended ARC
   entry; (b) emits ZERO events when the file is rewritten in place
   (conservation copy / format pass); (c) excludes the watching agent's own
   appended entries. Proven by unit + integration tests for each.
3. **Co-equal pairing**: `coord watch-setup --arc-channel <path> --platform <p>`
   emits two runnable commands (canonical + ARC); both, when run, start clean
   watchers. The pairing doctrine is satisfied by one command.
4. **No hand-authored snippets remain in doctrine**: a grep over
   `.agent/rules/` and `.agent/reference/` finds no `grep -E '^\['` watcher
   filter and no raw `tail -n 0 -F` ARC invocation as the canonical shape; the
   rules point at the emitters.
5. **Canonical home**: `.agent/reference/comms-watch-mechanism.md` no longer
   exists; its substance is code-adjacent + in a Practice rule/PDR-027; no
   broken cross-references (grep clean).
6. **Gates green at single HEAD**; reviewer verdicts absorbed before merge.

## Non-Goals

- **Hang-but-run hardening** (per-step deadlines, heartbeat default-on) —
  landed/owned by [`comms-watch-hang-hardening.plan.md`](./comms-watch-hang-hardening.plan.md).
  This plan consumes that hardening (heartbeat parity for `arc watch`); it does
  not redo it.
- **Seen-state storage redesign** — owned by
  [`comms-watch-storage-redesign.plan.md`](./comms-watch-storage-redesign.plan.md).
- **Comms-event write integrity** — owned by
  [`comms-event-write-integrity.plan.md`](./comms-event-write-integrity.plan.md).
- **Independent watcher-liveness primitive + full PDR-027 identity-tuple filter
  widening + `/loop` validation** — owned by the sibling
  [`comms-watch-liveness-floor.plan.md`](../future/comms-watch-liveness-floor.plan.md).
  WS3's self-exclusion uses the existing prefix/identity contract; tuple
  widening is the sibling's concern.
- **Canonical-surface expansion** (active-claims, conversations, escalations,
  handoffs as additional canonical-comms surfaces) — the `future/` brief's
  Phase 3/4. This plan establishes the TYPE-vs-surface model and the co-equal
  ARC type; the canonical-surface expansion remains deferrable and is NOT
  required to ship the co-equal-channel-type cure. Promote it separately if the
  owner wants it bundled.
- **Schema canonicalisation of the comms event log** — separate concern.

## Prerequisites

- **Blocking**: none — the watch CLI and ARC convention both exist; this is
  additive + a doctrine pointer-swap.
- **Beneficial**: `comms-watch-hang-hardening` landed (for heartbeat parity in
  WS3). Minimum shippable shape without it: `arc watch` ships its own
  fail-loud + heartbeat using the same idiom even if the hardening plan's
  shared helper is not yet extracted.

## Risks

- **Adapter cohesion drift** — adding ARC to the watch abstraction may pressure
  the canonical-comms code path. Cure: one abstraction + two thin adapters;
  architecture-expert-betty reviews cohesion in WS7.
- **ARC offset-cursor vs the markdown the channel actually carries** — entries
  are `## [Name prefix] ...` blocks of arbitrary length; an offset cursor must
  resume mid-stream safely across appends. Cure: cursor is a byte offset of the
  last fully-consumed entry boundary; partial trailing content is re-read, not
  skipped; covered by the split-append test.
- **Doctrine pointer-swap breaks an agent mid-session** — an agent following an
  old rule snippet after WS5 lands. Cure: the emitters are additive and live
  before WS5; WS5 only removes the snippets after the emitters work.

## Plan-Body First-Principles Check

Per [`plan-body-first-principles-check`](../../../rules/plan-body-first-principles-check.md):

- **Shape**: WS0 grounds the F-82/F-81 root causes against current source before
  any code (the generator is the source of truth; do not design against the
  rule text, which is the drifted artefact).
- **Landing-path**: each WS lands as TDD cycle-pairs, one commit per cycle,
  gates green at every commit; the owner controls push.
- **Vendor-literal**: the Monitor tool's stdout-line-as-notification contract
  and the `tail -F` rewrite-replay behaviour are verified first-hand in WS0/WS3
  (both are worked-instance-evidenced: F-82, F-81), not assumed.

## Foundation Alignment

- `principles.md` — strict everywhere; replace-don't-bridge (remove the
  hand-authored snippets, don't add a compatibility note beside them).
- `testing-strategy.md` / `tdd-as-design.md` — every emitter/watcher cycle is a
  test+product pair landing together; tests describe behaviour (one event in →
  one line out; rewrite → zero events), not implementation.
- `schema-first-execution.md` — analyse the emit generator, not the emitted
  lines.

## Lifecycle Triggers

Per [`lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md):
claim registration on execution start (agent-tools watch source + the two rule
files + the ARC reference); reviewer dispatch in WS7; consolidation /
learning-loop on completion (mine the F-81/F-82 cure into the friction register
status lines + any PDR/rule graduation).

## Pre-Execution Review — assumptions-expert (2026-06-21, critically assessed)

An `assumptions-expert` pass ran at authoring time. Verdict: **PROPORTIONAL —
sound, ship after two minor revisions**. The reviewer confirmed both root
causes first-hand (F-82 at `agent-tools/src/collaboration-state/comms-relevant-events.ts`
`formatWatcherEventHeader` ~line 181 returning `--- NEW ${viewToken} EVENT ---`;
F-81 at `.agent/reference/arc-rapid-communication.md:241`), corroborating my own
first-hand observation of the emit format. Findings critically assessed and
**accepted** — to apply when this plan is next worked (owner-sequenced):

1. **WS3 cursor is under-specified for the rewrite-then-append case (accept).**
   A pure byte-offset cursor breaks on the decisive F-81 hazard: a conservation
   copy / format pass *rewrites* the file (changing bytes BEFORE the cursor),
   THEN appends arrive → the old offset resumes into different content. Cure:
   make the cursor **content-anchored** — `(last-consumed entry signature +
   offset)`, re-validated against the entry boundary on resume, falling back to
   an entry-signature scan if the byte at the offset is not the expected
   boundary. WS3 must add an explicit **rewrite-then-append** test (distinct
   from the isolated whole-file-rewrite→zero-redump test it already names).
2. **WS4 is the one over-build candidate (accept — simplify).** A separate
   `coord watch-setup` command exists only to concatenate WS2 + WS3 output.
   Simpler: have `comms watch-command` (WS2) emit the ARC-pairing reminder line
   and keep `arc watch-command` (WS3) as the sibling — dropping the separate
   `coord` command and namespace, without losing the structural-pairing goal.
   Keep WS4 only if the owner specifically wants one copy-paste-both command;
   state that as the justification if so.
3. **Metadata (accept):** add `comms-event-write-integrity.plan.md` to
   `related_plans` (cited in Non-Goals; missing from frontmatter).

Finding 4 (TYPE-vs-surface split is sound, not over-engineered) corroborates the
design. The WS todos above are left as authored; these revisions apply at the
next working pass so the design change is made with the owner, not unilaterally.

## Learning Loop

On completion: close friction **F-82** and **F-81** with the landing commit
SHAs in [`frictions-register.md`](../frictions-register.md); update
Cross-Cutting Theme 6; archive this plan per ADR-117 and mine the
TYPE-vs-surface model into the rehomed canonical watcher doc (WS6).
