# Next-Session Record — `agent-collaboration-research` thread

## Status

**Owner-gated, buffered.** Not currently dispatchable. Awaiting owner direction to open dedicated research sessions.

## Origin

Created 2026-05-24 at the post-M1-Safe-Pause-merge boundary by Charcoal Brazing Kiln (`claude / claude-opus-4-7 / 7c7327`) under owner direction. Verbatim:

> "A significant amount of work was done over the last few days to improve the agent collaboration capabilities of the repo and the Practice. Much of that is documented in ADRs and PDRs. A great deal more is not documented, but is inherent in the many, many comms logs we have preserved. Even deeper, there are yet to be recognised or analysed patterns that will emerge from the comms logs, analysed over time, subject, context, theme, connection, that will contribute massively to our understand of modes of agent collaboration and how to improve it. This is true original research. That research will require dedicated sessions by dedicated agents. It can't happen yet, but it must happen."

## The Research Vector

**Hypothesis**: the `.agent/state/collaboration/comms/` event archive — accumulated across ~5 days of intensive multi-agent collaboration leading into M1 Safe Pause — is **research substrate** for understanding modes of agent collaboration. Patterns exist in the corpus that:

- Have already been documented in ADRs / PDRs (the recorded substrate)
- Are visible to agents inside individual sessions but never extracted (operational-but-undocumented)
- Are **only visible across multiple events analysed together** by subject, context, theme, and connection (yet-to-be-recognised; true original research material)

The corpus is structured-enough to support automated pattern mining (each event has timestamp, author tuple, recipient, kind, tags, body, optional `in_response_to`) and rich-enough that agent qualitative analysis adds value beyond automated extraction.

## Preservation Boundary

The preserved `.agent/state/collaboration/` corpus is a bounded research
exception, not a declaration that state files are long-term storage. Owner
clarification on 2026-05-27: state files should generally be processed as
potential knowledge source files, useful substance routed to durable
memory/docs/plans, and the state files then deleted. While this thread remains
owner-gated, keep the corpus intact for the future comms/coordination research
plan. When the owner opens cleanup or research processing, use item-level
disposition evidence rather than archive-only movement.

## Analysis Vectors (owner-named)

1. **Subject**: what was being discussed (marshal cycles, reviewer dispatch, owner direction, claim coordination, watcher behaviour, …)
2. **Context**: when in the session arc the event lands (session-open, mid-cycle, pre-pause, pre-compaction, post-merge, …)
3. **Theme**: recurring concerns across events (failure modes, behaviour notes, heartbeat cadence, coordination protocol, substrate writes, …)
4. **Connection**: cross-event linkages — `in_response_to` chains, citation references in bodies, identity tuples appearing across multiple lanes, temporal adjacency, conceptual adjacency

## Candidate Themes (catalogue seeded from one session — 2026-05-24 Charcoal lens)

Not exhaustive; intended to give a future research-mode agent worked examples of what the corpus contains and what counts as a pattern.

### 1. Substrate-pointer-pattern v2 (terminal-state vs running-state)

- **Shape**: agent A reads agent B's state from a SNAPSHOT (closeout broadcast, thread record, team-shape enumeration) and treats it as current truth. Agent B has since resumed; A acts on stale assumptions.
- **Worked instances**: ≥20 captured in one session window (Director Seaworthy's `f6eb4f51` team-shape broadcast listing two agents as closed-out 64s after both had resumed; Mistbound presume-ended broadcasts; multiple post-compaction misreads).
- **Existing substrate**: `.agent/memory/active/patterns/substrate-pointer-read-as-current-state.md`
- **Research angles**: when does snapshot-vs-stream distinction matter most? Cure-shape across roles (Director, Marshal, Implementer, Curator). Failure-mode taxonomy. Near doctrine-graduation.

### 2. Marshal-seat watcher silent-failure mode

- **Shape**: watcher silently drops events; the affected agent doesn't surface the loss; only detected via cross-substrate analysis (napkin captures from peers).
- **Worked instances**: Mistbound missed Twilit's `ef315373` for 95m, Charcoal's `625fb072` for 75m, Director's `b2258cf5` for 85m on 2026-05-24. Discovered when Mistbound's compaction-4 brief read the prior session's napkin entries.
- **Cure candidates** (proposed in real-time, not yet structurally landed): watcher self-test loop, periodic comms-dir count audit, durable `last_heartbeat_at` field on active-claims with auto-rebalance.
- **Research angles**: this is a SUBSTRATE-FAILURE-MODE not an agent-failure-mode. How do we build observability INTO substrate primitives so they self-report failure? What's the taxonomy of substrate-failure-modes vs agent-failure-modes?

### 3. Owner-direction supremacy on OUTCOME not LITERAL form

- **Shape**: owner says "commit everything" / "push" / "pause". Different team-states demand different shapes of execution. The right interpretation honors the OUTCOME the owner wants (durable substrate in repo) not the LITERAL form (one commit).
- **Worked instances** (one session, same verb, different shapes): "commit everything" → 3-commit-split for heterogeneous-tree state with in-flight peer cycles, AND single-bundle commit-all for cleared-queue state.
- **Research angles**: how do agents distinguish outcome from literal? Failure mode where literal-form interpretation forecloses better shapes. Owner-direction-verb taxonomy with shape-variation analysis.

### 4. Mid-cycle pause preserving reviewer convergence

- **Shape**: implementer pauses mid-claim after reviewer convergence is captured in transcripts. Substrate may be discarded during downstream branch-shift; convergence is preserved in transcript IDs cited in closeout broadcasts.
- **Worked instances**: Charcoal Cycle Beta on 2026-05-24 — reviewer convergence (code-expert `af7b0338079198b3e` + security-expert `ac025ad946e546bee`) preserved across pause + branch-shift + substrate-discard.
- **Research angles**: what's the value-preservation contract across forced-discard boundaries? What survives, what doesn't, what should?

### 5. Cross-platform marshal cycle protocol parity

- **Shape**: collaboration substrate (comms events + claims + marshal-request shape) is platform-agnostic. Codex peer runs identical DM-ACK-stage-husky-commit cycle as Claude peers.
- **Worked instances**: Estuarine codex marshal-cycle landed at `c697d18b` on 2026-05-24 with zero protocol modification.
- **Research angles**: what other protocols exhibit this property? Where would platform-specific divergence be inevitable vs avoidable?

### 6. Owner-authz exception architectural-honesty

- **Shape**: when an owner-authorized exception is technically redundant with existing structure, the right cure is to action the directed cure AND name the redundancy/architectural-truth inline at the change-site — not just in the routing event.
- **Worked instances**: Charcoal's sonar.cpd.exclusions edit on 2026-05-24 (`79c148e4`) — added entry that the existing `**/src/types/generated/**` glob already matched; preserved architectural truth in the inline policy comment.
- **Research angles**: where does architectural truth live? Change-site as canonical home vs distributed across routing events.

### 7. Watcher-as-team-state-shared-memory

- **Shape**: all-channels comms watcher gives post-compaction agents the substrate to reconstruct team state without explicit coordination. Watcher-stop happens at session-end; new session restarts watcher and replays via seen-file delta.
- **Research angles**: this is "substrate-as-shared-memory with replay semantics". Consistency model? When do compaction boundaries break observability? How does it compare to other shared-memory primitives in multi-process systems?

### 8. Heartbeat cron + cron-redundancy rule

- **Shape**: 4-min liveness cadence with skip-if-substantive-activity-within-window rule. Low-coordination + self-organizing.
- **Research angles**: false-positive/false-negative ratio of the cron-redundancy rule. When does it misfire? Is 4 min the right cadence?

### 9. PDR-064 Coordinator Handoff two-moments worked corpus

- **Shape**: pre-positioning (information transfer only) → active-acknowledgement (authority transfer). Conflating creates a coordinator-less window.
- **Worked instances**: multiple Director / Marshal transitions across the corpus.
- **Research angles**: how often does Moment 2 NOT happen after Moment 1? Coordinator-less-window cost analysis. Variations of the protocol that have emerged across the team.

### 10. 3-commit-split vs single-bundle commit-all

- **Shape**: both are valid responses to "commit everything"; the choice depends on tree-state heterogeneity vs owner-direction priority.
- **Research angles**: when does each shape work? Failure mode of choosing wrong? Decision-tree codification candidate.

### Meta-theme: the corpus as research substrate

- Each comms event carries structured metadata; aggregate has temporal patterns (silence windows, burst patterns, heartbeat cadence), subject clustering (lanes), theme clustering (tags).
- Structured-enough for automated pattern mining; rich-enough for qualitative analysis.

## Dedicated-Session Profile (research-mode agent)

What kind of agent should do this research?

- **Reflective profile, not execution profile** — disposition to step back, not push forward
- **Pattern-mining capability** — holds many events in working memory; finds connections
- **Boundary-aware** — knows when a pattern is doctrine-grade vs note-grade
- **Substrate-fluent** — understands PDR / ADR / napkin / pending-graduations / thread-record taxonomy
- **Capable of producing research outputs** — ADR-class artefacts, PDR-class artefacts, possibly new doctrine-class artefacts

## Possible Session Shapes

1. **Corpus survey session** — comprehensive read of comms archive across N days; emit a structured pattern taxonomy
2. **Theme-deep-dive session** — take one candidate theme; produce a research artefact with N worked instances + cure-shape recommendations
3. **Cross-PDR analysis session** — read all PDRs + comms events that informed each; identify which PDRs missed candidate patterns visible in retrospect
4. **Failure-mode taxonomy session** — read all `failure-mode`-tagged events; cluster by class; identify cure-shape patterns
5. **Owner-direction interpretation session** — read all owner-direction verbatim quotes in comms; analyze how each was interpreted vs how it could have been

## First-Move Discipline (when owner opens this thread for dispatch)

1. Read `.agent/state/collaboration/comms/**` end-to-end (or by date-window if doing theme-deep-dive); the comms event schema is at `.agent/state/collaboration/comms-event.schema.json`.
2. Cross-reference against existing PDRs / ADRs in `.agent/practice-core/decision-records/` and `docs/architecture/architectural-decisions/`.
3. Choose session shape from the menu above (or define a new one if a fresh angle surfaces).
4. Produce research output as PDR-class or ADR-class artefact (NOT a napkin note — research warrants permanent substrate).
5. Update this thread record with what was processed + what remains.

## What this thread is NOT

- Not a plan (no implementation roadmap)
- Not a decision (no architectural commitment)
- Not currently dispatchable (owner-gated)
- Not source of doctrine until research outputs ratify (the corpus is signal, not yet pattern-extracted at scale)

## Participating Agent Identities

| Agent Name | Platform | Model | session_id_prefix | first_session | last_session | role |
|---|---|---|---|---|---|---|
| Charcoal Brazing Kiln | claude | claude-opus-4-7 | 7c7327 | 2026-05-24 | 2026-05-24 | thread-record-author-post-m1-merge |
| Solar Illuminating Dawn | codex | GPT-5 | 019e6a | 2026-05-27 | 2026-05-27 | state-file-lifecycle-boundary-clarification |
| Twilit Orbiting Satellite | claude | claude-opus-4-8 | 263042 | 2026-05-29 | 2026-05-29 | routing-legacy-fallback-sunset execution (Leafy claim `14b484d6` pickup) |

## 2026-05-29 — execution work touched this thread via a claim (not research)

The owner-gated research vector above remains untouched and undispatched. This
thread was *touched* only because Leafy Regrowing Petal filed the
routing-legacy-fallback-sunset claim (`14b484d6`) against it, and Twilit
Orbiting Satellite picked that claim up and completed the sunset on 2026-05-29
(commits `d9225d5b` + `d1525f55`; claim closed in the archive). That work is
**collaboration-substrate implementation**, not comms-corpus research — its
home is the agent-tooling plan cluster
([`future/README.md` §Comms / coordination cluster](../../plans/agent-tooling/future/README.md#comms--coordination-cluster)),
keystoned by the
[`collaboration-substrate-coordination-rightsizing`](../../plans/agent-tooling/future/collaboration-substrate-coordination-rightsizing.plan.md)
brief. Recorded here only for identity-row honesty; the research buffer's
dispatch contract is unchanged.

## Cross-References

- Comms archive: `.agent/state/collaboration/comms/` (5+ days of accumulated multi-agent events)
- ADR archive: `docs/architecture/architectural-decisions/` (substrate-phenotype decisions)
- PDR archive: `.agent/practice-core/decision-records/` (practice-doctrine decisions)
- Napkin captures: `.agent/memory/active/napkin.md` + archived windows under `archive/`
- Existing pattern files: `.agent/memory/active/patterns/`
- Pending-graduations register: `.agent/memory/operational/pending-graduations.md` (research-vector entry buffer)
- Heartbeat contract: `.agent/skills/start-right-team/SKILL-CANONICAL.md` §0.5
- Comms-event tag namespace (ADR-183): includes `failure-mode`, `behaviour-note`, `heartbeat` for filterable corpus access

## Resume Contract

Owner directs resume. No autonomous dispatch. When dispatched, the receiving agent reads this record end-to-end before any analysis pass.
