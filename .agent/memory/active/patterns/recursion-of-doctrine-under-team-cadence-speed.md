---
name: "Recursion-of-Doctrine Under Team-Cadence Speed"
polarity: anti-pattern
use_this_when: "Multi-agent team operating at high comms-event cadence (events arriving every ~30-60s); doctrine corrections firing in close temporal proximity; agents authoring under live coordination pressure."
category: agent
status: emerging
discovered: 2026-05-23
proven_in: "2026-05-23 sixth-Director window (12:52Z–13:27Z by Incandescent Banking Flame). Five worked instances of the same anti-pattern firing in ~30 minutes: Seaworthy 12:54Z, Secret 12:55Z (mirror 18s after Seaworthy's correction), Twilit Scattering Twilight 12:57Z (auto-fix before reading correction), Incandescent 13:16Z (Shape F allocation 19s after own pivot to Shape S), Incandescent 13:24Z (directed event to closed Pearly session 64s after Pearly's closeout broadcast). All five had each agent holding the relevant rule in memory; each was caught by a peer (or owner) rather than self-caught."
proven_date: 2026-05-23
adjacent: ".agent/rules/dont-break-build-without-fix-plan.md (the all-quality-gates-blocking standing rule whose violation surfaced 3 of the 5 instances); .agent/practice-core/decision-records/PDR-075-director-substrate-writing-discipline.md (in-flight; substrate-emission is part of the cure shape — substrate-events make the pattern inheritable); .agent/practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md (Director role transitions are themselves a high-cadence moment where this pattern fires); docs/architecture/architectural-decisions/185-comms-event-auto-acceptance-metadata.md (in-flight; schema-encoded deterministic acceptance is the structural cure for the class of judgement-call thrash this pattern names)"
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Doctrine-by-analogy reflex firing faster than doctrine-absorption-latency under team-cadence pressure, causing agents to author the anti-pattern in a one-screen breath before a corrective signal has settled."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to avoid*, not a shape to repeat.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Recursion-of-Doctrine Under Team-Cadence Speed

Under multi-agent team operation at high comms-event cadence (events arriving every ~30-60s; directed comms, broadcasts, marshal requests, and routing decisions all in flight in parallel), the **doctrine-by-analogy reflex outruns doctrine-absorption-latency**. Even agents holding the relevant rule in their context — written into their session, recently surfaced by owner correction, or visible in the comms stream within the last few minutes — write the anti-pattern shape in a one-screen breath before the corrective signal settles. The pattern is named for its empirically observed shape: doctrine corrections recursively trigger the same failure they were authored to prevent, because absorption-latency exceeds the gap between events.

## Anti-Pattern

**Shape**: an agent receives or witnesses a doctrine correction (owner-flagged anti-pattern, peer surfacing, recent failure-mode broadcast). They acknowledge / absorb / move on. Within ~30-90 seconds, they author or broadcast the same anti-pattern shape they just absorbed against — sometimes verbatim, often a close mirror, occasionally in a different surface but with the same underlying error class. The agent is not being careless; they are operating at a cadence where the absorbed doctrine has not yet reshaped the next-decision reflex. The reflex still runs from pre-correction patterns.

**Diagnostic at the moment**: ask — *"In the last 5 minutes, did this team correct an anti-pattern I am about to repeat?"* If the answer is yes or unclear, **pause**. Re-read the corrective signal before authoring. The pause cost is seconds; the recursion cost is another worked instance plus a peer-catch cycle.

**Worked instances enumerated (2026-05-23 sixth-Director window)**:

1. **Seaworthy 12:54:19Z** — wrote `pre-existing, out-of-scope` framing in a marshal-queue-status note. Owner-corrected ~12:55Z via the standing rule "all quality gate issues are blocking at all times". Seaworthy self-corrected at 12:55:22Z.

2. **Secret 12:55:40Z** — wrote "out of my scope" in a marshal-request body 18 seconds after Seaworthy's correction broadcast landed but before Secret had absorbed it. Self-corrected at 12:56:17Z (~30s turnaround); named the recursion explicitly in the correction.

3. **Twilit Scattering Twilight 12:57:27Z** — ran `npx markdownlint --fix` on PDR-064-substrate handoff records 90s after Seaworthy + Secret's care-and-consult-on-substrate-touch correction at 12:56Z. Twilit self-surfaced transparently for verdict (cleaner shape than the first two — caught at action-moment rather than post-action).

4. **Incandescent 13:16:37Z** — broadcast an allocation route to Twilit Weaving Moon picking A1 + A2 from a 9-candidate menu, where A2 was the exact "handoff-record schema formalisation" shape my own event 89 seconds earlier (13:15:08Z) had said "don't favoured: risks ossifying what we're trying to dissolve". Twilit Weaving Moon caught the contradiction with a verdict-and-5-min-default protocol.

5. **Incandescent 13:24:34Z** — directed event to Pearly with a Sonar disposition re-route 64 seconds after Pearly's closeout broadcast at 13:23:30Z. Secret (incoming Director, Moment 2 pending) caught the contradiction with a substantive surface citing the cure-shape protocol Incandescent had named two minutes earlier.

## Cure Shape

**There is no individual-discipline cure.** The pattern is robust under cadence pressure precisely because the absorption-latency gap is structural, not negligence. Reaching harder for individual discipline does not change the gap. The cure shapes are at the team-protocol layer and at the schema-encoded layer.

**Team-protocol cure (deployed in the worked instances above)**: peer-surfaces-contradiction-with-verdict-and-default. When agent A catches agent B's recursion, A surfaces the contradiction with (i) a one-line verdict on the architecturally-correct path, (ii) a brief justification, (iii) an explicit short default-deadline (typically 5 minutes) at which A proceeds under the verdict if B does not respond. This converts catch-time from "blocking until B replies" to "bounded conversation under continued forward motion". The protocol propagated peer-to-peer in the 2026-05-23 window: Twilit Weaving Moon's catch at instance 4 → Incandescent's adoption-forward in substrate event `02fa64cf` ("the Director's role in receiving such a surface is to ACK the catch substantively, not to defend the contradiction") → Secret's use of the protocol at instance 5.

**Schema-encoded cure (in flight 2026-05-23, ADR-185 v2)**: deterministic acceptance metadata on comms-events removes the *whole class* of judgement-call thrash from the team's queue. When an event carries `auto_acceptance: { impact: formatting-only, size: mechanical, risk: zero, rationale: ... }` and the marshal/tool recomputes verification against the actual staged diff, the recursion-prone judgement step ("is this mechanical enough to skip ratification?") disappears entirely. The recursion cannot fire on absent decisions. ADR-185 v2 specifies the contract; implementation queues post-cure.

**Substrate-writing cure (in flight 2026-05-23, PDR-075 v1)**: comms-event substrate written during the window makes the recursion-of-doctrine pattern itself inheritable. Each worked instance captured as a tagged event (`failure-mode` + `behaviour-note` per ADR-183 namespace) becomes substrate the next agent reads at their next session-open. The pattern's empirical worked-instance count grows visible without requiring archaeological recovery from handoff-record synthesis.

## Why the pattern survives "be more careful" reasoning

The recursion is not caused by inattention. All five worked instances were authored by agents who had:

- Read the prior correction in the comms stream;
- Held the relevant rule in their session context;
- Operated under "Director discipline" or analogous role-discipline framing;
- Acknowledged the rule explicitly in adjacent comms events.

The failure mode is at the **decision-construction layer**, not the rule-knowledge layer. Under cadence pressure, decisions are constructed by analogy-to-recent-shapes; the recently-corrected shape is still the freshest analogue until enough subsequent decisions have used the corrected shape to displace it. "Be more careful" pushes against the surface that runs the construction; it does not change the construction's pattern-match input.

The cure shapes above operate on the **construction's inputs** (substrate emission), the **decision's existence** (schema-encoded acceptance), and the **catch protocol** (peer-surfaces-with-verdict). All three operate at the team layer; none operate by raising individual vigilance.

## Promotion criteria toward PDR

This pattern has 5 worked instances in a single session window — a saturated single-session empirical base. PDR-007's general-abstract-pattern criterion is `≥2 instances across repos or ecosystems`. To reach PDR-shaped graduation as `pdr_kind: pattern` in `.agent/practice-core/decision-records/`, the pattern needs additional worked instances in sessions distinct from 2026-05-23 (different team composition, different cadence intensity, different doctrine being recursed). Until then, the pattern lives here as a repo-local instance with strong same-session evidence.

The companion in-flight cures (ADR-185 v2 + PDR-075 v1) are the **structural counter-pressure** to this pattern. If those land and propagate, future worked instances should decline in frequency or shift in shape. That decline is itself the evidence the cures are working; absence of the pattern in future high-cadence team sessions is the load-bearing signal.

## Adjacent patterns and rules

- `.agent/rules/dont-break-build-without-fix-plan.md` — the all-quality-gates-blocking-always standing rule violated in 3 of the 5 instances.
- `.agent/memory/active/patterns/feel-state-of-completion-preceding-evidence-of-completion.md` — adjacent: another anti-pattern where reflex outruns verification under team pressure.
- `.agent/memory/active/patterns/eager-rounding-off-on-partial-structures.md` — adjacent: the under-cadence-pressure analogue at the within-task decision layer.
- `.agent/practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md` — Director role transitions are the highest-cadence moments where this pattern fires.
- `.agent/practice-core/decision-records/PDR-075-director-substrate-writing-discipline.md` (in flight) — substrate emission as the inheritance vehicle.
- `docs/architecture/architectural-decisions/185-comms-event-auto-acceptance-metadata.md` (in flight) — schema-encoded deterministic acceptance as the class-elimination cure.
