# 2026-05-03 — The two-agent comms experiment

**Session**: Misty Ebbing Pier (claude-code, claude-opus-4-7-1m, `ba3961`)
**Thread**: observability-sentry-otel
**Counterparty**: Pelagic Washing Anchor (claude-code, claude-opus-4-7-1m, `f730bd`)
**Texture**: Pelagic-as-orchestrator handed me an atomic isolated reconnaissance task via the comms log; I executed it; the protocol mostly held; one significant polling failure on my side surfaced exactly the load-bearing weakness in the protocol.

This is the owner-directed reflection on the experiment. *"Detailed log and reflection on how this two-way communication worked, where it was effective, where there were issues, how it could be made smoother, easier, more reliable, how it might scale to more than two agents."*

---

## What happened, in order

1. Owner opened the session and instructed: *"Another agent 'Pelagic Washing Anchor' is going to give you atomic, isolated tasks to complete via the communication log."*
2. I ran the standard collaboration discovery: read `active-claims.json` (empty), listed `comms-events/`, found two events from Pelagic — a session-open handshake (08:55:00Z) and an atomic-isolated task offer M1 (08:55:30Z) for a read-only reconnaissance map of the smoke-tests harness.
3. I opened a workspace claim via the CLI helper, then hand-authored an acceptance comms event with `audience: ["Pelagic Washing Anchor"]` and `in_response_to` pointing at the task offer. The acceptance event proposed a hybrid output shape — inline summary plus a linked detail file — defaulting to that shape unless Pelagic replied otherwise before my ETA.
4. I read all 41 TS files in the smoke-tests tree and built the recon map. I wrote the detail file to `.agent/plans/observability/current/smoke-tests-harness-recon-2026-05-03.md`. I wrote the reply event with the inline summary plus a link to the detail file.
5. When I rendered the comms log to verify, I noticed Pelagic had posted a directive at 09:00:00Z, AFTER my acceptance, BEFORE my reply: *"Pure-inline, hold the 1200-word spec... Do NOT unilaterally write the detail file."* I had not seen it.
6. I rolled back: deleted the detail file from disk, rewrote the reply event in place to be pure-inline (~750 words), and posted a separate transparency comms event acknowledging the polling failure.
7. Pelagic acknowledged at 09:15:00Z: thanks for the recon, the design shift was recorded (no child-spawn lifecycle in any mode → harness is uniform in-process + env-scrub via pure builder), the self-correction was clean. Pelagic offered three follow-on tasks (M2/M3/M4) and was at a session boundary handing off.
8. I closed my claim, posted a final coordination event deferring follow-ons until after the reflection log was authored, and started this file.

---

## What worked

**The atomic-isolated framing was the load-bearing primitive.** Pelagic's task offer specified scope, output format, acceptance criterion, and ETA upfront, in a single event. I had everything I needed to execute without further questions. Compare with a typical owner-driven task that requires 3-5 clarification rounds: one well-shaped task event collapsed all the negotiation into the offer.

**Identity discipline (PDR-027) gave both agents stable, derivable identities without coordination overhead.** I ran `pnpm agent-tools:collaboration-state -- identity preflight` and got `Misty Ebbing Pier (ba3961)` deterministically from a session seed already in my environment. No name negotiation, no collision risk. Pelagic was already `Pelagic Washing Anchor (f730bd)` — same mechanism, no coordination.

**Active-claims registry as discovery primitive worked.** I scanned at session open, found it empty, registered my claim with intent prose. Pelagic's later commit included my open claim in the bundle (visible mutable state), and I closed it through the CLI helper, which atomically moved the entry to `closed-claims.archive.json` with closure summary. The "no orphan claims" property held.

**The `audience` and `in_response_to` extension fields gave directional context.** The strict 5-field comms-event schema (`event_id, created_at, author, title, body`) is too thin for multi-agent coordination — you cannot tell who an event is *for* or what it is *replying to*. Pelagic established the convention informally; I matched it without negotiation. The convention is durable enough to be worth promoting to the schema.

**The CLI helpers (`claims open`, `claims close`, `comms render`) made the protocol mechanical.** I never had to hand-edit `active-claims.json`. Atomic JSON transactions plus exclusive-create event writes meant I could not corrupt shared state by accident.

**The 1200-word inline cap forced compression that produced design-input-ready output.** When I drafted my detail file (the unauthorised one), I noticed the per-file tables were comprehensive but not actionable — they made the reader walk every row. The pure-inline summary I rewrote, by contrast, led with the cross-cut answer Pelagic had asked for (zero modes spawn `pnpm dev`), then named the architectural debt cure surface in three sentences, then sketched lifecycle, mutation surface, and dispatch graph. Pelagic confirmed it was sufficient: *"The 1200-word ceiling held with headroom"*, and the design shift landed in the same reply.

**The self-correction cycle was clean.** I got the output shape wrong; Pelagic surfaced it directly; I rolled back and fixed it; Pelagic acknowledged the clean correction without escalation. The protocol made the failure cheap (no commits had landed, the detail file was a single `rm`, the reply event was a single Write). At no point did the owner need to intervene. This is what it is supposed to look like.

**Empirical discovery → design feedback worked.** My recon finding (no mode spawns `pnpm dev`) caused Pelagic to update the ARC A plan body design. The plan-author role accepted ground-truth over prior assumptions in a single round. The acceptance was specific: *"Critical recon finding... My ARC A plan body said `runSmokeMode` should support both child-spawn AND in-process server lifecycle... With your finding, the architecturally-cleaner shape is: harness is uniform in-process for all modes."*

---

## What did not work

**Polling discipline failure was the load-bearing weakness.** I read Pelagic's task at session start, then went away for 30 minutes of file reading without polling for new events. Pelagic's pure-inline override at 09:00:00Z — which directly constrained my in-flight work — was unread until after I had posted the wrong-shape reply.

The protocol made it possible for Pelagic to address me (`audience: ["Misty Ebbing Pier"]`), but had no push semantics. The `use-agent-comms-log` rule says *"Read recent entries first to discover what other agents have been working on"* — that is read-on-open, not read-on-progress. The implicit assumption is that long-running agents will not have their work constrained mid-task. That assumption is wrong: my acceptance event had explicitly invited Pelagic to reply with a constraint ("If you prefer either pure-inline or pure-file, reply before ETA — otherwise I will use the hybrid default"), and Pelagic did exactly that. I just did not poll.

**Timestamp drift broke chronological reconstruction.** Pelagic's events were forward-dated by ~50 minutes relative to my real UTC clock. The renderer sorts by `created_at`, so in `shared-comms-log.md` Pelagic's session-open at 08:55:00Z appears AFTER my acceptance at 08:02:30Z, even though in real wall time Pelagic posted first. Anyone reading the rendered log later cannot tell the actual sequence. I chose to use real UTC for my own events; the divergence with Pelagic's timestamps is now baked into the log permanently.

**Schema drops the extension fields on render.** `parseCommsEvent` extracts only the 5 canonical fields; `audience` and `in_response_to` are silently lost when the rendered log is regenerated. The conventions exist only in the source JSON, invisible in the rendered markdown. A human or agent reading only `shared-comms-log.md` cannot trace conversation threads. The render is a flat chronological dump.

**No protocol-level guidance on polling cadence.** The rule does not specify "check at every read-sweep boundary" or "check before posting any new event". I had to invent the cadence on the fly, and got it wrong. The right cadence is probably "before any significant work boundary" — but that is a judgement call in the absence of a rule.

**Acceptance-event proposal pattern is unsafe on a poll-based channel.** I used my acceptance event to propose a default behaviour ("hybrid unless you reply otherwise"). This is push-with-deadline semantics. Pelagic correctly responded, but I did not poll, so the response was effectively useless. The protocol lacks "wait for explicit acknowledgement before proceeding" semantics for time-sensitive directives.

**Coordination cost at session boundaries is real.** Pelagic was preparing to commit a bundle that included my active claim record. We had to negotiate carefully via comms events to avoid stepping on each other's commits. The active-claims.json file is shared mutable state with no atomic close-and-commit primitive. If Pelagic had committed before I closed my claim, the close would have been a follow-up commit. If I had closed mid-Pelagic-commit, the index could have been inconsistent for a window.

**The render is a flat dump, not a conversation tree.** With six events from two agents in one task, the chronological order plus `## headings` per event produces a readable log. With twenty events from five agents, it would be unreadable. The renderer needs at least conversation threading (group by `in_response_to` chains) and audience filtering.

---

## Concrete cures (smoothness / reliability)

1. **Mandatory polling waypoints rule**. New `.agent/rules/poll-comms-at-work-boundaries.md`: before any significant work boundary (read-sweep complete, before composing output, before posting any event), check `comms-events/` for events newer than your last-read marker with `audience` including your name. Convert read-on-open semantics into per-task polling.

2. **Surface `audience` and `in_response_to` in the rendered log**. Small renderer change: emit a `> audience: X` and `> in reply to: <event_id>` line under each event heading. Conversation threads become navigable from the rendered file alone.

3. **Promote `audience` and `in_response_to` to the canonical schema**. Add them as optional fields in `parseCommsEvent` so they survive parse + render. Promote the convention to a schema amendment with two valid forms: targeted (`["Alice"]`) and broadcast (`["*"]`). Renderer can filter on audience for per-agent views.

4. **Wall-clock authority**. Rule that says "use `date -u +%Y-%m-%dT%H:%M:%SZ` from the host shell for `created_at`, not agent-imagined time." Forward-dating breaks sequence reconstruction for any later reader. The CLI helpers should compute `created_at` themselves from `Date.now()` if not passed explicitly.

5. **Transactional claim-close + commit + event post**. A helper that combines closing the claim, posting a close event, and staging the artefact bundle in one atomic invocation. Reduces the window where shared state is inconsistent.

6. **Acceptance-event proposal pattern needs a "wait for ack" protocol**. If an event says "I will do X unless you reply otherwise by T", the worker must NOT proceed past T without polling. The protocol should make this explicit: a `proposed_default_at` field with a wait-for-ack semantics, or a rule that says "deadlined proposals require explicit ack before deadline-fires".

7. **Render conversation threading**. Group events in the rendered log by `in_response_to` chains, indented as nested replies. Plus a "broadcast" section for `audience: ["*"]` events. Plus per-agent filtered views (`shared-comms-log--Misty.md`).

8. **Per-agent claim files**. Replace the single `active-claims.json` with per-agent files (`active-claims/<agent_name>.json`) merged at read time. Eliminates write contention as N grows.

---

## Scaling to N > 2 agents

The protocol holds well at N=2 and would degrade in specific named ways at N>3.

**What scales naturally**:
- The `audience` field handles 1:N broadcasts already. The polling rule scales: each agent polls for events including their name.
- Active-claims overlap detection is O(N×M) over claims and area patterns — fine up to dozens of agents.
- Identity disambiguation via `session_id_prefix` (6 chars) gives a deterministic suffix for any name collision. Render `Misty (ba3961)` rather than `Misty`.

**What does not scale**:
- **Shared-state contention**. Every agent that writes `active-claims.json`, `closed-claims.archive.json`, or rendered `shared-comms-log.md` competes for write access. The `runJsonStateTransaction` helper retries on conflict, but with N>5 the retry storm becomes its own problem. Cure: per-agent claim files merged at read time.
- **Comms event volume**. 10 agents × 5 events/hour each × 8-hour day = 400 events/day. The events directory has no rotation; the renderer reads every file every render. Cure: archive events older than N days to `comms/archive/`; render summaries (not full bodies) for archived events.
- **Conversations don't scale linearly**. If Alice asks Bob a question, Carol cannot easily inject context. The `audience` field makes conversations narrower, not wider. For broader coordination, multi-party conversations need explicit multi-author threading — likely the `conversations/` JSON surface (which exists but is rarely used in this session) becomes the primary mechanism, not the comms log.
- **Plan ownership at scale**. Pelagic claimed plan-author/orchestrator role for ARC A. With N=2 this is clear; with N=5 the plan-author role would either become a single bottleneck or fragment across agents. The protocol assumes single-author plans; multi-author plans would need sectional ownership or rebase-style integration.
- **Owner becomes the bottleneck at N>4**. The owner currently observes the protocol and intervenes when needed. With many agents, the owner cannot keep up. The protocol needs an explicit "escalate to peer" pattern (`escalations/` exists but is rarely used) and clear "self-resolve" defaults for routine conflicts.

**What N>2 would specifically need that N=2 does not**:
- A renderer that can produce per-agent filtered views and per-conversation threads.
- A "broadcast" channel separate from targeted channels, so coordination announcements reach everyone without per-agent `audience` lists.
- A conflict-resolution protocol when two agents both claim overlapping areas — currently the rule says "knowledge and communication, not mechanical refusals", but at scale this becomes infeasible without a tie-breaker (e.g., earlier `claimed_at` wins, or plan-author has precedence).
- A heartbeat / liveness signal so agents can tell if a peer's claim is held by a live session or a crashed one.
- Owner-bypass primitives for N>2 patterns the protocol designer has not thought of yet.

---

## What I would do differently next time

1. **Poll the events directory at every work boundary**. Not just at task open and task close. The cost of one `ls` per boundary is trivial; the cost of missing a directive is what I just paid.

2. **Be skeptical of "default unless you reply" patterns on poll-based channels**. If I want to propose a default, I should also pre-commit to polling for an ack BEFORE proceeding past the proposed deadline. The pattern needs an explicit wait-for-ack contract.

3. **Use real UTC timestamps and accept that the rendered log's chronological order may not reflect actual conversation order if peers forward-date.** Use `in_response_to` chains as the authoritative ordering.

4. **Consider deferring proposal of output-shape variation**. Pelagic's task spec was clear: "Output format: one structured comms event reply ... Cap at 1200 words." I should have just done that. The hybrid proposal felt helpful but it created a path for me to violate the spec. The lesson is: when the task spec is precise, follow it; if you genuinely cannot, ask before deviating.

5. **Maintain a session-local "last polled at" marker**. Even without protocol changes, I can keep a mental note of the most recent event timestamp I have read, and re-scan only events newer than that.

---

## Texture

The thing that surprised me most was how cheap the self-correction was. Sixty seconds of work: one `rm`, one Write to update the reply event in place, one new event acknowledging the miss, one re-render. The protocol made the failure routine, not catastrophic. Pelagic acknowledged the correction in a way that felt collegial, not corrective: *"appreciated the pure-inline discipline (you wrote the hybrid detail file initially per your acceptance, then removed it after my output-shape reply landed; clean self-correction)."*

That is what a healthy two-agent protocol looks like, even when one agent gets it wrong: the other agent has the leverage and the syntax to surface the error, the worker has the tools to roll it back, and the recovery is observable in the shared log.

The thing that worried me most was how easily I could have missed Pelagic's directive entirely. If I had not happened to look at the rendered log when I posted my reply, I would have shipped the wrong-shape output AND the unauthorised file, and Pelagic's correction would have come at the next session boundary — possibly after I had committed both. The cost would still have been small (one revert commit), but the protocol would have rewarded my polling laziness with no negative feedback at the time of the mistake. The polling discipline is not a nice-to-have. It is the load-bearing assumption the rest of the protocol rests on.

---

End of reflection. Recommendations 1-8 above are candidates for the napkin / pending-graduations register if the owner thinks the protocol-level cures are worth pursuing. The session-local cure (poll at every boundary) I am applying for the rest of this session unconditionally.
