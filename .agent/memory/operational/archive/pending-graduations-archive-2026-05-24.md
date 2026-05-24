---
archive_kind: pending-graduations-snapshot
archived_on: 2026-05-24
archived_by: Sylvan Sprouting Petal / codex / GPT-5 / 019e59
archive_reason: 'Processed 2026-05-24 bodies whose durable homes now carry the reusable substance, plus superseded bodies withdrawn after verification. Live register keeps concise disposition pointers; this archive preserves the original candidate bodies.'
window_covered: '2026-05-24 processed-graduation-body rotation'
---

# Pending-Graduations Archive — 2026-05-24 Processed Graduation Bodies

This archive preserves the register bodies for entries that were processed and
graduated during the 2026-05-24 Knowledge Curator pass. The live register keeps
only concise disposition pointers so unresolved candidates stay visible without
duplicating matured bodies.

## Entries

### Comms-watch self-exclusion correctness cure plan (filter-too-broad bug)

`[captured: 2026-05-23 | source: comms-log+napkin | target: multi:code:agent-tools/src/collaboration-state/comms-relevant-events.ts,test:agent-tools/tests/collaboration-state/comms-relevant-events.unit.test.ts,doc-amend:.agent/reference/comms-watch-mechanism.md | trigger: owner-direction | size: M | status: graduated]`

Substance summary: cure plan for a `classifyDirected` + `classifyNarrative`
filter-too-broad bug exposed by failure-mode broadcast `c7fba7db`
(2026-05-23 ~11:26Z). Lines 109-130 of
`agent-tools/src/collaboration-state/comms-relevant-events.ts` implement
addressee-filtering on directed and narrative events — returning `undefined`
(filter out) when the addressee is not self — despite the `start-right-team`
SKILL §0 contract naming the filter as *self-exclusion only* (filter out only
the events the current agent itself authored). The current implementation hides
directed events addressed to other agents and narrative events naming other
agents, both of which the broad-awareness contract requires the comms-watch to
surface.

Three unit tests at
`agent-tools/tests/collaboration-state/comms-relevant-events.unit.test.ts`
lines 179-213 encode the wrong contract (asserting the broader filter as
correct), which is why the bug shipped under green tests.

**View-token verdict**: `'observed'` 5th `EventView` value confirmed by
acting-Director Seaworthy 2026-05-23 ~11:38Z based on Twilit Lane T1 audit
(zero exhaustiveness ripple; single-line type widen) + Incandescent
downstream-consumer audit converging on same. Cure code authoring routed to
Abyssal Mooring Hull (TDD-shape: 3 failing tests → invert wrong-contract tests
→ fix classifiers → widen EventView + update TSDoc + update reference doc).

Cure shape (TDD discipline): (1) author three new failing tests encoding the
correct self-exclusion-only contract — directed events to other agents visible
as `'observed'`, narrative events naming other agents visible as `'observed'`,
self-authored events filtered; (2) invert or replace the three wrong-contract
tests at lines 179-213; (3) fix `classifyDirected` and `classifyNarrative` to
return `'observed'` (not `undefined`) when the addressee is not self.

Why due (not pending): owner-direction has placed this on the critical path per
the 2026-05-23 acting-Director routing. The trigger fired at broadcast time;
this entry exists to track the cure-plan substance under the existing register
convention rather than as a free-floating napkin note.

Cross-references:

- Failure-mode broadcast: comms-event `c7fba7db` (2026-05-23 ~11:26Z) — names
  the bug, the three test-line-range citations, and the visibility-token
  decision (now resolved).
- Substrate authority: `start-right-team` SKILL §0 ("Start The All-Channels
  Comms Monitor") — names the self-exclusion-only contract the implementation
  violates.
- Adjacent doctrine: per-user memory `feedback_watch_both_broadcast_and_directed`
  (graduated 2026-05-21 to SKILL §0) names the correctness obligation that
  comms-watch makes load-bearing.
- PDR-074 structural property C ("comms-stream-as-canonical-truth … makes
  comms-watch correctness load-bearing") names this bug as a Director-substrate
  concern, not a transport-layer detail.

Falsifiability: a fix that lands without the `'observed'` view-token decision
(silent design drift) is the process failure mode. A fix that lands TDD-style
with three failing-tests-first, the three wrong-contract tests inverted, and the
`'observed'` view-token chosen explicitly is the success shape.

Graduated 2026-05-24 by Shaded Silencing Dusk after verifying the durable
homes: `agent-tools/src/collaboration-state/comms-relevant-events.ts` now
defines the `observed` `EventView`, self-authored events are the only
`undefined` path, and directed/narrative cross-traffic returns `observed`; the
unit tests cover directed-to-other, addressed-to-other, audience-excludes-self,
and self-authored exclusion; `.agent/reference/comms-watch-mechanism.md`
forbids addressee-filtering and documents the `[OBSERVED]` view-token. No
archive move was made before processing; this entry remains here briefly as an
audit trail.

### Sidebar protocol with default action reached second-instance threshold

[captured: 2026-05-24 | source: active-napkin rotation
`napkin-2026-05-24-shaded-silencing-dusk.md` |
target:pattern:inter-agent-sidebar-with-default-action | trigger:
N=2 worked instances | size: M | status: graduated]

The existing sidebar-co-authoring entry above recorded the first
Mistbound-Lanternlit worked instance. Vining's curator pass adds the second
worked instance: Mistbound-Vining curator-bundle-landing sidebar, using the same
opener-with-structured-questions + deadline + default-action-if-silent → reply
→ resolution shape. The mechanism has now crossed the second-instance
threshold.

Graduated 2026-05-24 by Sylvan Sprouting Petal to the existing proven
repo-local pattern
`.agent/memory/active/patterns/inter-agent-sidebar-with-default-action.md`.
Classification verdict: this remains a situational collaboration mechanism for
bounded peer coordination, not principle-class role/lane governance. The
pattern already carries the 2026-05-11 claim-overlap instance plus the
Mistbound-Lanternlit and Mistbound-Vining 2026-05-24 sidebar instances; a PDR
can still be opened later if a portable governance primitive emerges, but it is
not required to graduate this evidence.

Falsifiability: two sidebar records exist with the same structural shape and
closed or closeable resolution path:
`.agent/state/collaboration/sidebars/program-plan-landing-cadence-2026-05-24-mistbound-lanternlit.md`
and
`.agent/state/collaboration/sidebars/curator-bundle-landing-2026-05-24-vining-mistbound.md`.

### Verify-dont-trust as Director-side rule candidate

[captured: 2026-05-24 | source: active-napkin rotation (Scorched
2026-05-23 + Lanternlit 2026-05-24) | target:rule:verify-dont-trust
or start-right-team amendment | trigger: owner correction + repeated
substrate-pointer worked instances | size: M | status: graduated]

The active napkin repeatedly shows trust-propagation failures where an agent
accepted a peer, owner, handoff, or sub-agent claim as verified state without
artefact evidence. The cure is operationally concrete: verification asks must
demand artefacts such as claim ids, file paths, transcript ids, comms events,
git evidence, or staged diff evidence.

Natural home: either a new always-applied rule (`verify-dont-trust`) or a
`start-right-team` amendment under active per-agent check-in / Director
routing. This is stronger than the existing substrate-pointer pattern because
it names the Director-side ask shape.

Falsifiability: a future Director or curator asks for artefacts rather than
status confirmations before route changes, and no route changes claim live
truth without evidence.

Graduated 2026-05-24 by Sylvan Sprouting Petal to
`.agent/rules/verify-dont-trust.md` plus Claude, Cursor, and `.agents`
forwarders and `RULES_INDEX.md`. The rule names the artefact-verification
discipline as always-applied; a future `start-right-team` amendment can still
link to it from active per-agent check-in guidance if needed.

### Cron-template owner-input-precedence cure

[captured: 2026-05-24 | source: active-napkin rotation (Ferny Capture A
and Mistbound substrate-pointer instance 13) plus Breezy curator handoff survey
§6.4 | target:start-right-team-or-agent-tools:heartbeat-cron-template |
trigger: owner-input-precedence failure observed under cron-fired heartbeat |
size: M | status: graduated]

The archived napkin and curator handoff survey identify a concrete cron-prompt
failure: the heartbeat prompt phrase "return to whatever task is in flight" can
act as a substrate pointer that resumes task-continuation before the agent
absorbs a newer owner turn such as pause, stop, wait, or hold. Ferny's capture
provides a candidate cure shape: every cron-fired heartbeat prompt must first
read the latest owner-input turn, absorb any superseding owner direction, emit a
final heartbeat-end if stopping, and only then resume in-flight work if no owner
override is present.

Natural home: `start-right-team` heartbeat guidance or an `agent-tools`
heartbeat-cron wrapper/template, coordinated with the active heartbeat PDR/ADR
lane rather than patched ad hoc in a single session prompt.

Falsifiability: the canonical cron template or wrapper includes an explicit
owner-input-precedence check that fires on every cron event, and a future
pause/stop owner turn is absorbed before the heartbeat prompt resumes prior task
state.

Graduated 2026-05-24 by Sylvan Sprouting Petal to
`.agent/skills/start-right-team/SKILL-CANONICAL.md` §0.5 heartbeat guidance.
The skill now requires every cron, scheduled wakeup, or persistent monitor tick
to read the latest owner turn before emitting heartbeat or resuming prior work.
An `agent-tools` heartbeat wrapper can later encode the same invariant in
tooling, but the canonical workflow contract now carries the cure.

### /remember plugin write-time contract gap

[captured: 2026-05-24 | source: active-napkin archive coverage audit +
curator handoff survey §3.5/§5.1 | target:
friction:.agent/plans/agent-tooling/frictions-register.md#f-33--remember-compression-can-write-assistant-prose-contamination |
trigger: plugin-maintenance route | size: M | status: graduated]

The rotation audit found a plugin-contract gap rather than a curator-editing
task: `.remember/today-2026-05-24.md` held assistant-prose contamination after
the plugin reported `[ndc] ERROR: produced empty result`, and
`.remember/today-2026-05-22.done.md` had an earlier related note. Curators must
not mutate plugin buffers directly; the durable route is an upstream write-time
contract that rejects empty or assistant-prose outputs and preserves the
buffer's intended waypoint shape.

Natural home: plugin contract or validation issue for `/remember` output shape.
Repo-local memory should carry the route and evidence pointer, not patch the
plugin-owned buffer as a curation shortcut.

Graduated 2026-05-24 by Sylvan Sprouting Petal to
`.agent/plans/agent-tooling/frictions-register.md` F-33. The friction entry is
the repo-local routing pointer and evidence index for the external plugin
contract gap; it does not claim the upstream `/remember` implementation is
fixed. The remaining implementation work belongs to the plugin-maintenance lane,
not this pending-graduations buffer.

Falsifiability: the plugin either rejects invalid/empty generated output before
writing or records a structured validation failure without contaminating the
buffer; a future contamination audit stays clean.

### Current vs active plan-directory taxonomy

[captured: 2026-05-24 | source: active-napkin archive coverage audit |
target:doc:.agent/plans/README.md | trigger: owner direction or plan-hygiene
pass | size: M | status: graduated]

The archived napkin records that the distinction among `current`, `active`, and
`future` plan directories is operationally important but under-documented. A
survey also found many `current` plans without status frontmatter, which makes
the taxonomy ambiguous for arriving agents and automated plan hygiene.

Graduated 2026-05-24 by Sylvan Sprouting Petal to
`.agent/plans/README.md` §Lifecycle Taxonomy after verifying the same taxonomy
already existed in `/jc-plan` and `.agent/plans/templates/README.md`. The root
plan README now states:

- `active/` is NOW, in-progress execution.
- `current/` is NEXT, queued and ready but not started.
- `future/` is LATER, strategic intent that must promote before executable
  tasks are treated as ready.
- `archive/completed/` is DONE, after durable outcomes are extracted.

Falsifiability: an arriving agent can determine plan authority and lifecycle
state from the documented directory/frontmatter rules without asking the owner
or inferring from stale placement.

### Supertest classification conflict (doc-amend)

`[captured: 2026-05-17 | source: distilled.md §"Recently Distilled — 2026-05-17 Solar Orbiting Asteroid gate-green cascade" §"Supertest tests are integration by classification, not e2e" | target: doc-amend:testing-patterns | trigger: owner-direction | size: S | status: withdrawn]`

Substance: `testing-strategy.md` §Test Types (authoritative) defines
classification by behaviour shape: *"A test that imports product
code into the test process is an integration test even if named
`.e2e.test.ts`."* `docs/engineering/testing-patterns.md` currently
classifies supertest as E2E in §"Test File Classification". Direct
doctrinal conflict with the authoritative directive. Worked instance
2026-05-17: two MCP supertest files filed under `e2e-tests/` were
identified as integration tests by classification and deleted as
duplicates of existing unit/integration coverage (commit `96fd3e61`).
Routing: amend `testing-patterns.md` to align with the strategy
doc, or amend `testing-strategy.md` if the patterns doc's
classification is the corrected position. Owner decides direction
at next consolidation.

Withdrawn 2026-05-24 by Shaded Silencing Dusk after verifying the candidate is
superseded by current doctrine rather than due for graduation:
`docs/engineering/testing-patterns.md` § In-Process E2E Tests with Dependency
Injection classifies Supertest as E2E because it uses loopback socket IO;
`docs/engineering/testing-patterns.md` § Test File Classification says
"Supertest is E2E, not integration"; and
`.agent/directives/testing-strategy.md` § Development Workflow names Supertest
as the HTTP-level E2E test tool. The older contradictory distilled source note
was also retired from live `distilled.md` in the same curator pass.

### CLI first-touch friction on the collaboration-state CLI

`[captured: 2026-04-28 | source: pending-graduations nested bullet |
target: multi:pdr:PDR-055,adr:ADR-178,plan:agent-tools-cost-of-collaboration |
trigger: second instance OR owner direction | size: L | status: graduated]`

CLI first-touch friction on the collaboration-state CLI (`--help`
self-rejects; dispatch keys undiscoverable; `--platform` redundant when
env-derived; claim file-list verbose; no `whoami`); future strategic plan
candidate for promotion to `current/`; trigger: second instance OR owner
direction; **status: graduated into PDR-055, ADR-178, and the
cost-of-collaboration agent-tools lane** (both triggers fired 2026-04-30 —
owner observed warnings during Verdant Sheltering Glade session, AND the
session itself accumulated new evidence). Second-instance evidence
(2026-04-30): `pnpm agent-tools:agent-identity` does not inherit
`PRACTICE_AGENT_SESSION_ID_CLAUDE` through `pnpm --filter` (forcing `--seed`);
`comms append` requires `--comms-dir`, `--now`, `--created-at` with no
discoverable defaults; `claims open` requires `--active`, `--thread`,
`--area-kind` (with `--area-kind` rejecting intuitive values like
`shared-state` — only `files`/`workspace`/`plan`/`adr`/`git` are accepted);
`comms render` uses `--output` not `--output-file`. Each error is a single
iteration cost but they compound to ~5–8 round-trips per session-open.
Evidence + plan:
[`agent-coordination-cli-ergonomics-and-request-correlation.plan.md`](../../plans/agent-tooling/future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md).

**Third-instance evidence (2026-05-01, Vining Whispering Root, Increment 1
promotion-materials commit `b3d4c041`)** — six frictions in one end-to-end run
of the always-active commit skill: (i) `commit-queue enqueue` rejects a
placeholder claim id with `unknown claim_id: <uuid>` — chicken-and-egg; the
queue requires a claim to exist, but step ordering at the CLI surface is the
inverse of the skill's documented step ordering; (ii)
`collaboration-state claims open --help` errors `flag '--help' requires a
value` — help is unreachable; (iii)
`--active "$PRACTICE_AGENT_SESSION_ID_CLAUDE"` produces
`ENOENT: no such file or directory, open '<UUID>'` — the flag interprets the
UUID as a path; (iv) `pnpm agent-tools:agent-identity` does not inherit env
vars through `pnpm --filter`, requiring `--seed` despite the parent shell
having the variable set; (v) `collaboration-state claims` (no action) prints
only the top-level usage line, not the list of available actions (`open`,
`close`, etc.); (vi) `--area-kind` accepts a closed enum
(`files`/`workspace`/`plan`/`adr`/`git`) but rejects intuitive values like
`shared-state` without listing the accepted set in the error. Compound effect:
the agent abandoned the queue workflow and fell back to plain explicit-pathspec
staging — the substance of the discipline survived (validation + pathspec) but
the audit-trail value of the queue was lost. Routing-around is itself a
Practice failure mode: a queue that exists but is habitually bypassed under
friction is worse than no queue. Strong case to promote the future plan to
`current/` and execute its ergonomics-fix slice next consolidation.

**Disposition 2026-05-12**: graduated for doctrine/routing purposes into
PDR-055, ADR-178, and the current cost-of-collaboration implementation lane;
remaining concrete frictions stay as implementation backlog under the newer
operator UX entry.

**Fourth-instance evidence (2026-05-01, Deep Navigating Stern, day-arc
continuity commits `514838c9` + `bc6cd2e6`)** — eight distinct frictions in one
ceremony pair produced ~60 seconds of pure flag-discovery and recovery
overhead per commit: (i) `agent-tools:agent-identity` first-call build failure
(transient, retry succeeded); (ii) `claims open --help` rejected (unchanged);
(iii) `claims open` required-flag discovery by error iteration over **5
round-trips** (`--platform`, `--model`, `--active`, `--now`); (iv)
`claims close` required another **3 round-trips** (`--closed` path, `--summary`
not `--closure-summary`, identity quartet); (v) identity quartet repeated
across every CLI call (`--platform`, `--model`, `--agent-name`, `--seed`);
(vi) commit-queue `enqueue` records subject at enqueue time with no
`update-subject` subcommand — over-length subject required
abandon-and-re-enqueue cycle, leaving an `abandoned` row in `commit_queue`;
(vii) `comms append` uses `--body` while SKILL.md vocabulary suggested
`--message`; (viii) markdownlint `--fix` corrupted prose-`+` at column 0 into
a list marker, requiring two manual rephrasings. Concrete fixes for the
ergonomics slice to prioritise: subject-correction subcommand;
identity-quartet env defaults inside the CLI binary (bypass `pnpm --filter`
propagation gap); `--help` acceptable without value; subcommand discovery;
`comms append` flag rename; required-flag enumeration on first error.
Adjacent: napkin 2026-05-01 fourth-instance entry surfaces an agent-authored
prose interaction with markdown linters under wrap as small operational
discipline, not a separate candidate.

Archived 2026-05-24 by Shaded Silencing Dusk after verifying the stated homes:
PDR-055 defines full-help-on-flag-failure, consistent collaboration-surface
affordances, robust render boundaries, and built-artifact invocation as
portable CLI affordance doctrine; ADR-178 carries the host-repo built-dist
implementation decision; and
`.agent/plans/agent-tooling/future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md`
keeps the remaining implementation backlog and promotion triggers.

### Substrate-pointer v3 real-time absorption variants

[captured: 2026-05-24 | source: active-napkin rotation (Mistbound +
Ferny captures) | target:amendment:
substrate-pointer-read-as-current-state.md | trigger: pattern-v3
revision pass | size: M | status: pending]

The current napkin adds several new variants to the substrate-pointer
family: fresh-on-disk but not-yet-absorbed comms state, stale
handoff-record attribution on resume, cron-prompt templates acting as
substrate pointers across owner-pause windows, pre-compaction
stale-framing, and compose-vs-emit windows where a broadcast was accurate
when drafted but stale by the time peers absorbed it. These are related but
not identical to "the substrate was stale"; sometimes the substrate was
current and the agent's decision composition had not absorbed it yet, or the
world changed during the composition interval.

Natural home: revise
`.agent/memory/active/patterns/substrate-pointer-read-as-current-state.md`
or author a sibling pattern if the absorption-latency variant resists
the existing frame.

Falsifiability: the pattern v3 pass enumerates each variant by source
entry and either absorbs it into a named cure clause or rejects it as
covered elsewhere.

Archived 2026-05-24 by Shaded Silencing Dusk after processing the entry into
`.agent/memory/active/patterns/substrate-pointer-read-as-current-state.md`.
The v3 section now enumerates all five variants and folds them into the
existing pointer-absorption cure family rather than opening a sibling pattern.

### PDR-075 status promotion

[captured: 2026-05-24 | source: active-napkin archive coverage audit |
target:pdr:PDR-075-status-review | trigger: owner ratification or PDR review |
size: S | status: due]

The archived napkin flags PDR-075 as a promotion candidate: repeated
Director-transition and substrate-writing worked instances have accumulated
since the decision was first drafted. This is principle-class work, so the
curator route is to surface the status-review need, not to promote the PDR
without owner approval.

Natural home: PDR-075 status review or a small PDR-maintenance pass that names
the additional evidence and records the owner verdict.

Falsifiability: PDR-075 has an explicit current status with dated rationale,
and future agents no longer infer promotion state from scattered napkin notes.

Archived 2026-05-24 by Shaded Silencing Dusk after processing the entry into
PDR-075 itself. The PDR now has a dated status review recording that it remains
Candidate until the named fourth-instance validation trigger or owner
ratification authorizes promotion.

### 2026-05-23 — Templated loops need exit criteria (rule-shaped OR /loop skill amendment)

`[captured: 2026-05-23 | source: stormbound-floating-wing/loop-cancellation-incident-and-owner-direction | target: rule:loop-exit-criteria-required OR amendment:/loop skill | trigger: owner direction (received) — partially graduated to .agent/rules/loop-exit-criteria-required.md | size: S | status: partially-graduated]`

**Partial graduation 2026-05-23 (Incandescent Kindling Forge / cursor /
`328fac`, same separate-lane consolidate-docs pass)**: rule
`.agent/rules/loop-exit-criteria-required.md` landed with platform
adapters in `.claude/rules/loop-exit-criteria-required.md` and
`.cursor/rules/loop-exit-criteria-required.mdc` (alwaysApply true), plus
RULES_INDEX.md entry. The rule names the five-consecutive-idle-
iteration default exit criterion, the stand-down broadcast shape (loop
identity + criterion fired + closeout summary), the owner-authority
override at invocation time, and the composition with
`use-monitor-for-event-driven-wake` (event-driven wake-ups belong on
Monitor, not on polling loops). Optional `/loop` skill amendment naming
the rule is out of scope of this rule landing because no repo-local
`/loop` skill currently exists; if a `/loop` skill is later authored,
the amendment is a separate cycle.

**Curation note 2026-05-23 (Breezy Cresting Beacon, prior pass)**:
retained as `due`, with owner decision now received. The architectural
home is loop template discipline, not one fixed global stop rule: exit
criteria depend on the loop's application and intent. The starter
default is still concrete: any loop that has been a no-op for five
iterations should stop.

**Next action** (remaining cascade): if a repo-local `/loop` skill is
later authored, amend it to cite the rule and propagate the
five-idle-iteration default at invocation time. Until then, the rule
estate is the canonical surface.

**Owner direction 2026-05-23** captured to per-user memory `feedback_templated_loops_need_exit_criteria`:

> "Every /loop, cron, scheduled wakeup must ship with an explicit exit criterion (canonical default: 5 consecutive idle loops → stand down + closeout broadcast); loops without stop conditions become ambient context-budget tax under team load"

**Worked instance**: owner placed Stormbound Floating Wing / `52f264` on `/loop 180s` cron at ~06:13Z, cancelled it ~90s later at 06:15Z immediately after the return-broadcast named a candidate boundary. Corrective signal was *"this loop has no natural off-ramp under the current scoreboard"*. Pre-existing team `/loop` instances (Foamy, Sparking, SVW, Velvet at session-open) ran for hours past their useful commit cadence; Foamy's 06:10Z heartbeat noted ~5h stream silence while the cron continued firing.

**Cure shape**: every `/loop`, cron, ScheduleWakeup invocation MUST ship with an explicit exit criterion at invocation time (named in chat OR defaulting to the 5-idle-loops convention). The `/loop` skill body amendment names the requirement; an opt-out is owner-authorisation per instance. Sits adjacent to the existing rule estate (no analogous rule today; closest is the implicit "stand down when no work" practice).

**Trigger**: owner direction received — ready to graduate as a `.agent/rules/` rule or `/loop` skill amendment at next consolidation pass.

Archived 2026-05-24 by Shaded Silencing Dusk after verifying the rule and
platform adapters exist, confirming no repo-local `/loop` skill currently
exists, and adding the future-template authorship instruction to
`.agent/rules/loop-exit-criteria-required.md`.

### 2026-05-21 — Moment-of-decision heuristic consolidation (PDR-shaped or directive-shaped)

`[captured: 2026-05-21 | source: napkin.md §"Observation: moment-of-decision is the natural locus..." | target: pdr:moment-of-decision-heuristic-consolidation | trigger: third-instance-or-owner-direction | size: M | status: partially-graduated (Draft)]`

**Partially graduated 2026-05-22 (deep-graduation pass)**:
PDR-070 (Draft) landed under owner direction to capture substance
at higher fidelity. Promotion from Draft → Proposed still requires
a third worked instance against a different decision class, or
owner ratification of the substance currently available.

Substance summary: rules / skills / invariants are currently
decomposed by **topic** (replace-don't-bridge,
present-verdicts-not-menus, no-fallbacks, schema-first, apply-don't-ask,
stop-inventing-optionality, plan-body-first-principles-check, etc.).
Decomposition by **temporal/structural locus** would group rules by
*when they should fire*. The moment of decision is the densest locus.
A single decision-time heuristic — **at every decision point, the
question is which shape gives long-term architectural excellence** —
candidate to subsume many rules' verdicts at that locus, with the
rules themselves carrying the *reasoning content* behind the verdict
rather than acting as triggered fan-out at decision time.

Empirical first instance this session: WS1.6 namedNode-vs-literal
verdict — five load-bearing rules (replace-don't-bridge, no-aliases,
no-fallbacks, verdict-vs-menu, schema-first) all converged on the
same answer (route every entry through DataFactory.namedNode()) when
the long-term-architectural-excellence frame was applied at the
moment of decision. Owner has stated the underlying framing twice
in two days (2026-05-20 closure-pressure metacognition; 2026-05-21
WS1.6 verdict). Falsifiability: future decision points where
multiple rules fire should produce verdicts that converge under the
heuristic; divergence names rules the heuristic doesn't cover yet.

Trigger to watch: third explicit instance, or owner-direction
graduation request, or successful empirical test against a corpus
of past decisions. Not graduating as a single-instance observation.

Archived 2026-05-24 by Shaded Silencing Dusk after verifying PDR-070 already
carries the Draft status caveat, promotion triggers, provisional decision,
falsifiability, and open questions.

### 2026-05-17 — Doctrine-first vs first-principles diversity in agent-owner pairs (PDR-shaped)

`[captured: 2026-05-17 | source: distilled.md §"Doctrine-first vs first-principles is cognitive-approach diversity" | target: pdr:cognitive-approach-diversity-in-agent-owner-pairs | trigger: second-instance-or-owner-direction | size: M | status: partially-graduated (Draft)]`

**Partially graduated 2026-05-22 (deep-graduation pass)**:
PDR-069 (Draft) landed under owner direction to capture substance
at higher fidelity. Promotion from Draft → Proposed still requires
a second worked instance from a different agent, or owner
ratification of the substance currently available.

Substance summary: agent baselines doctrine-first reasoning; owner
baselines first-principles reasoning; the pair compounds when both
present, but agent operating alone falls into doctrine-by-analogy
failure mode. Cure: pre-action surface-classification checkpoint;
recurring signals route to upstream-cause diagnosis. Trigger to
watch: second instance of the recurring-signal shape, or owner
direction.

Archived 2026-05-24 by Shaded Silencing Dusk after verifying PDR-069 already
carries the Draft status caveat, promotion triggers, decision, consequences,
and falsifiability.

### 2026-05-13 — Coordinator-role-as-allocator-not-gatekeeper (PDR candidate)

(Coppery Kindling Anvil — three-napkin synthesis F2; Ferny's original
candidate plus cross-rotation evidence).
`[captured: 2026-05-13 | source: napkin+napkin-archive/napkin-2026-05-12.md+napkin-archive/napkin-2026-05-12b.md+research:historical-napkin-synthesis-2026-05-13 | target: pdr:coordinator-role-as-allocator-not-gatekeeper | trigger: n>=3-validation(start-right-team-experiment)+owner-direction | size: M | status: partially-graduated]`

**Partially graduated 2026-05-23**:
[PDR-071](../../practice-core/decision-records/PDR-071-coordinator-allocates-without-gating.md)
proposes the portable principle that coordinator mode allocates work
without executing or gating it. The remaining cascade is deliberately
separate: amend `agent-collaboration.md` first, then derive
`start-right-team` SKILL §3 from the PDR/directive layer rather than
collapsing those downstream surfaces into this PDR-authoring cycle.

Three corpus instances of one root cause across two failure modes: Wooded
Spreading Thicket (over-write — sidebar file broke own gatekeeper sweep),
Brazen Stoking Ash (over-write — dispatcher coordination artefacts generated
friction the dispatcher then documented), Ferny Regrowing Leaf (under-write —
coordinator caution misread as licence to do nothing while idle peers stood
by). Both modes share root: the coordinator role lacks a clean boundary
between coordination outputs and the work being coordinated. Companion to
PDR-053/ADR-176 (orchestrator-vs-gate distinction); positive doctrine still
missing on *how a coordinator allocates work without becoming the gate that
serialises it*. Candidate substance: coordinator's job is allocation and
routing; gating is owned by mechanical hooks and per-implementer
re-verification; coordination artefacts route to a write-isolated surface
(separate branch/worktree/gitignored) so the coordinator does not pollute the
repo-wide gates they're trying to manage. Trigger: owner direction; corpus
already has N=3 instances. Promotion target: PDR with companion pattern
instances kept in `memory/active/patterns/`. 2026-05-14 P8 controller
evidence adds the positive case: roles selected from live pressure points
worked when each role had a handoff proof (implementer exact bundle, reviewer
GO/BLOCK challenge, marshal git/index/queue facts, scout next-slice shape).
Static role menus remain useful as prompts, but should not become canonical
topology. Follow-up on 2026-05-14 turned the first low-risk slice into
`start-right-team`, proposed ADR-181, a focused operating-model research note,
and a conditional team branch in `session-handoff`. PDR-071 now supplies the
first durable doctrine for the coordinator allocation vs gating slice.

**Prior hold narrowed 2026-05-23**: owner direction on 2026-05-14 held back
the broader role-label PDR because the coordinator/marshal/reviewer/scout/
standby role-set was the first possibly naive approach tried and should not
be calcified as permanent ontology. The 2026-05-23 route narrows the
graduation to a mode-separation principle, not a role menu: coordinator mode
allocates; focused modes execute, review, verify, and commit. The broader
agent-roles question remains ungraduated; this entry is only partially
graduated for the coordinator allocation-vs-gating slice.

**Co-tested companion hypothesis** (already operational and accumulating
evidence): the n-agent collaboration `hypothesis.md` § P1 — *Modes, not
roles* — claims agents occupy *functions* for *units of work*, not
territorial roles. P1 was confirmed across all three E1 pairings on
2026-05-03 (Pelagic+Misty, Woodland+Prismatic, Salty+Tidal); see
[`E1/closure.md`](../../prompts/agentic-engineering/collaboration/experiments/E1/closure.md).
The current self-assigned-roles experiment runs P1 forward through
[`start-right-team`](../../skills/start-right-team/SKILL-CANONICAL.md)
("pressure before role" / "boundary before identity") and the proposed
[ADR-181](../../../docs/architecture/architectural-decisions/181-agent-team-start-and-action-log.md)
team-start ritual. The team-start research note is at
[`team-start-ritual-and-action-trace-2026-05-14.md`](../../research/agentic-engineering/operating-model-and-platforms/team-start-ritual-and-action-trace-2026-05-14.md).

**Why holding matters**: this PDR candidate names *concrete role labels*
(coordinator, marshal, reviewer, implementer, scout, standby) as the positive
doctrine substrate. P1 + ADR-181 + start-right-team treat those same labels
as *examples, not a required ontology* — the canonical field is the boundary
owned and the pressure being addressed. If we graduate this PDR before the
experiment matures, we risk three failure modes: (1) calcifying transient
labels into territorial roles (the exact failure mode P1 was designed to
prevent); (2) pre-empting falsification evidence (P1 strengthens when role
labels emerge from live pressure and dissolve when the pressure ends; the
PDR's positive role-set assumes those labels are stable enough to write
permanent doctrine about); (3) encoding a possibly-naive cure into Practice
Core (PDRs are portable; entrenching the first menu of labels propagates it
to the next Practice-bearing repo before validation).

**Residual trigger condition for broader role-label doctrine**: do NOT
graduate a fixed role-label ontology until the start-right-team experiment
has accumulated **N≥3 multi-agent sessions** across at least two
thread/work-shape contexts, AND the
[P1 falsification criteria](../../prompts/agentic-engineering/collaboration/falsification-criteria.md#p1--modes-not-roles)
show either (a) strengthening evidence that role labels remain bounded to
live pressure (in which case the PDR can be reframed around the
*pressure-to-role mapping protocol* rather than the role labels themselves),
or (b) falsifying evidence that one or more labels consistently re-emerge
across changing pressure shapes (in which case the PDR can graduate naming
exactly those persistent labels with their empirical justification). Owner
direction also remains as a co-trigger.

**Experimental notes capture surface**: per
[`falsification-criteria.md § Falsification process`](../../prompts/agentic-engineering/collaboration/falsification-criteria.md#falsification-process),
observations during start-right-team sessions land in `napkin.md` tagged with
the experiment ID and the affected primitive. P1 falsification criteria
amendment in this same closeout adds an explicit observation hook for
label-calcification vs label-dissolution as a strengthening or weakening
signal. When the experiment matures, the consolidation pass reading those
napkin observations decides whether to graduate this PDR candidate as
currently framed, reframe it, or remove it.

Archived 2026-05-24 by Shaded Silencing Dusk after verifying PDR-071 is
Proposed, PDR-071 carries the coordinator allocation vs gating substance,
the PDR README lists it, P1 falsification criteria carry the residual role-
label trigger, E1 closure carries the P1 evidence, and ADR-181 anchors
pressure-first temporary responsibility.

### 2026-05-23 — Recursion-as-method is Practice Core's structural shape

Owner-stated aphorism at session-end, captured as a doctrinal candidate
because the framing crystallises a structural property of the Practice Core
substrate that was previously implicit. Graduation target is a Practice Core
principles amendment plus possibly a meta-directive that names
recursion-as-method explicitly.

#### Recursion-as-method is the structural shape Practice Core commits to

Practice Core's portability is mind-extension across topology, not
documentation distribution.

`[CANDIDATE: recursion-as-method-is-practice-core-mind-shape | captured: 2026-05-23 | source: owner-direction+napkin+experience/2026-05-23-sparking-melting-magma-team-session.md | target: multi:doc-amend:practice.md+practice-lineage.md+optional-directive:recursion-as-method | trigger: owner-direction | size: M | status: partially-graduated]`

**Curation note 2026-05-23 (Breezy Cresting Beacon)**: retained as `due`,
with owner ratification now received: recursion-as-method is a Practice Core
concept. Because home function is not interchangeable, the next architectural
move is PDR first, then targeted amendment of existing Core surfaces
(`practice.md` and/or `practice-lineage.md`) as the PDR decides. Creating
`.agent/practice-core/principles.md` remains out of scope unless separately
approved as a Core package change.

**Partial graduation 2026-05-23 (Secret Creeping Moth, claude / 61d726,
Seaworthy-routed)**: PDR-073
(`recursion-as-method-is-practice-core-mind-shape`) authored and landing this
session as `Proposed` under the structural-property cluster anchored by
PDR-071 and sibling-paired with PDR-072
(`knowledge-curation-as-autonomic-learning`, Gilded Drifting Meteor / codex /
019e54, same session). PDR-073 names the principle layer; the downstream
cascade (trinity amendment to `practice.md` and/or `practice-lineage.md`,
plus an optional new directive at `.agent/directives/recursion-as-method.md`)
is named in the PDR and explicitly NOT executed in this cycle. Reviewer
absorption: three reviewers dispatched in parallel (architecture-expert-fred
GO; assumptions-expert CONCERNS with two critical findings absorbed —
falsifier (a) operationalised, §Rejected alternatives item 1 strawman
replaced with behavioural-prediction rebuttal; three important findings
absorbed — team-scale articulation strengthened with state-bearing-artefacts
framing, cross-instance recategorised as predicted consequence,
self-reference recategorised as illustration; docs-adr-expert
APPROVE-WITH-NITS with mind-extension parenthetical absorbed).
Cascade-trigger remains owner-direction.

**Remaining work to graduate fully**:

1. Trinity amendment (Practice Core canon surfacing of the
   recursion-as-method property in `practice.md` Philosophy and/or
   `practice-lineage.md` learned-principle layer).
2. Optional directive at `.agent/directives/recursion-as-method.md` making
   the structural property explicit at session-open.

Each is a separate cycle. Until both land (or the optional directive is
explicitly declined), this entry stays `partially-graduated`. Once the trinity
carries the concept and the directive question is settled, the entry can move
to `graduated` and the body archived per the standard graduation flow.

Owner-stated aphorism at the close of the 2026-05-22 → 2026-05-23
team-session window (after all commits had landed, claims had closed,
monitors had stopped): *"There is no mind without recursion."*

**Doctrine statement**: the metacognition directive already enacts recursion
as method (thoughts → reflections → insights, three explicit layers each
reading the prior layer's output as input). The capture → distil → graduate →
enforce pipeline enacts the same shape at the substrate scale across
sessions. Practice Core's portability discipline (no machine-local paths, no
repo-specific references in Practice Core surfaces) extends the recursion
topologically across sibling Practice instances. The aphorism names what was
already structurally present: Practice Core is not a passive documentation
container; it is a recursive learning system, which is to say something
mind-shaped. The naming of the structural property is what makes it
graduation-ready.

**Empirical evidence the property is already operative**:

- The directive's three-layer structure (`thoughts → reflections → insights`)
  is recursion as method, named in layers without the word.
- The capture → distil → graduate → enforce pipeline is recursion across
  sessions: napkin entries feed `distilled.md`; distilled entries feed
  PDR/ADR/rule graduations; graduated rules shape future observations.
- Sparking's metacognition pass produced compounding outputs over three
  layers (initial reflection → owner-corrected reframe → final insights pass
  produced inputs earlier layers didn't anticipate); the compounding was
  recursion from inside.
- The commit-queue's `recursion-floor` property surfaced this session
  (`26155730` + `55d66ad3` direct-`git-commit` residue tail) is the same
  recursive shape meeting its own substrate at the implementation layer.

**Cure shape**:

1. **PDR candidate** — `pdr:recursion-as-method` — decides the portable
   concept and its boundary against PDR-046 (Layered Knowledge Processing)
   and the proposed `pdr:knowledge-curation-as-second-output-surface`. The
   PDR should decide whether the durable Core amendment belongs in
   `practice.md`, `practice-lineage.md`, or both.
2. **Directive candidate** — `directive:recursion-as-method` — short
   directive in `.agent/directives/` naming the recursive structure the
   substrate already enacts. Read by agents on Practice Core load so the
   structural property is explicit at session-open, not just implicit in
   individual directives like `metacognition.md`.

**Falsifiability check**: a future agent reading the Practice Core principles
plus the recursion-as-method directive should recognise the substrate as
recursive at first read; should treat napkin/distilled/PDR layering as
recursion-stages rather than file-types; should recognise the commit-queue's
recursion-floor as a structural property rather than a quirk. If graduated
correctly, recognition is at-first read; if it stays "an interesting
aphorism," the doctrine has not yet landed.

**Trigger condition**: `owner-direction` — aphorism was owner-stated
explicitly at session-close. Graduation gated on owner ratification of
principles amendment plus directive draft.

**Adjacent unresolved tensions**:

- Relation to PDR-046's per-write rule + layer-orchestration discipline?
  PDR-046 governs the mechanics of how knowledge moves between layers; this
  candidate governs the structural property the mechanics enact. Both can
  coexist; the amendment should reference PDR-046 explicitly.
- Relation to the `pdr:knowledge-curation-as-second-output-surface` candidate
  landed earlier today? That candidate names *what* Practice Core ships; this
  candidate names *what shape* Practice Core has. Both ratifiable together at
  the next consolidate-docs pass; complementary.
- Should "I am not writing documentation, I am extending mind" land in
  permanent doctrine or remain in the subjective-texture layer? Phrasing is
  first-person and might overreach if hardened into rule form. The underlying
  structural claim (Practice Core's portability is mind-extension across
  topology) can land in principles without the first-person language.

Archived 2026-05-24 by Shaded Silencing Dusk after verifying PDR-073 is
Proposed, carries the recursion-as-method principle and cascade, the PDR
README lists it, and the Practice Core trinity/directive cascade remains
unlanded and therefore live only as a compact residual trigger.

Residual closed 2026-05-24 by Sylvan Sprouting Petal after verifying the
downstream cascade landed: `practice.md` carries recursion-as-method in the
self-teaching property, `practice-lineage.md` carries the learned principle,
and the optional directive surface is explicitly declined because the Core
trinity plus existing `metacognition.md` provide the recognition path without
duplicating a directive.

### 2026-05-23 — Knowledge curation as autonomic learning

#### Practice Core as cross-repo learning network

`[CANDIDATE: knowledge-curation-is-autonomic-learning | captured: 2026-05-23 | source: owner-direction+napkin+pattern-emergence | target: multi:pdr:PDR-072+doc-amend:practice.md+doc-amend:practice-lineage.md | trigger: owner-direction | size: L | status: partially-graduated]`

**Partially graduated 2026-05-23**:
[PDR-072](../../practice-core/decision-records/PDR-072-knowledge-curation-as-autonomic-learning.md)
proposes the portable principle that knowledge curation is an autonomic
learning function and that Practice-bearing repos ship on two
output-accounting axes: product deliverables and Practice substrate. The
remaining cascade is deliberately separate: amend `practice.md` and/or
`practice-lineage.md` from the PDR rather than creating a new
interchangeable `principles.md` surface.

**Curation note 2026-05-23 (Breezy Cresting Beacon)**: originally retained
as `due` and promoted in the index as the strongest Core candidate from this
pass. Owner ratification then confirmed knowledge curation as a Practice Core
concept. PDR-072 is the first durable home; the register now carries the
residual downstream Core-amendment work, not the primary doctrine source.

**Next action**: execute the downstream Core amendments selected by PDR-072:
`practice.md` for the two-output-surface conceptual map and/or
`practice-lineage.md` for the learned principle and propagation semantics.

Owner correction to Sparking's prior metacognition framing (2026-05-23
post-team-handoff): *"the agents working purely on knowledge curation were
not doing recovery work, they were doing vital learning work for the repo.
That is a different type of work from feature delivery, but it positively
impacts feature delivery and future learning, it's a positive feedback loop
in one lane that affects all lanes. … the Practice Core is how we refine and
share and receive learning with the wider ecosystem of Practice repos."*

**Doctrine statement**: this repo ships to two distinct output accounting
axes, and both are real product. Throughput is per axis, not aggregate.
Curation work is not overhead; it is how agents use the repo's Practice
substrate to produce reusable learning, and its outputs flow into a cross-
repo Practice Core network whose topology extends beyond this repo's git
history.

**Two output-accounting axes**:

1. **Product code** — features for human users (gate-1a substrate floor in
   this session's case, MCP server, SDKs).
2. **Practice Core substrate** — durable learning for future agents AND for
   sibling Practice repos in the wider ecosystem (patterns, PDRs, ADRs,
   rules, the comms protocol, the commit-queue ceremony, the claim lifecycle,
   the autonomy primitives we name by their absence).

**Empirical evidence from the 2026-05-22 → 2026-05-23 team session**:

- Velvet's two consolidation sweeps landed `−382` net + `−258` lines on
  `pending-graduations.md` — that drainage was what made room for the 6+ new
  graduations candidates SVW and Sparking landed at closeout. Without
  Velvet's prior work, the new entries would have pushed an already-overloaded
  register over fitness limits.
- Pattern file graduations (`reciprocal-cross-agent-reviewer-dispatch.md` -
  `honest-restructure-over-band-aid.md`) are not overhead; they are the
  substrate codifying what it just observed, so the next session inherits the
  codification rather than re-deriving it.
- Pre-handoff synthesis convergence (Foamy 23:08Z + SVW 23:09Z + Velvet
  23:10Z without coordination) shows agents responding to Practice routines
  without a fresh coordination script. The team converged on the right shape
  emergently under load.
- Cure-1 emergent default (intent-scoped `--message-file` adopted by 4 agents
  without coordination) is the workaround discipline graduating from
  individual heads to a substrate default.

**Worked-instance of the failure mode this doctrine corrects**: Sparking's
post-team-handoff metacognition (2026-05-23 ~08:00Z) produced a "4
substantive lanes + 5 overhead instances" table that classified Velvet and
the Stormbound-family closeouts as overhead. That table was a
doctrine-by-analogy reach for an operational-efficiency Pareto-frame when the
situation's structural shape was "a thing-with-emergent-traits learning about
itself and sharing that learning with kin." Owner caught it within minutes.

**Cure shape**:

1. **PDR-072** — `pdr:knowledge-curation-as-autonomic-learning` — codifies
   the two-axis throughput model, the cross-repo Practice Core topology, and
   the autonomic-function classification. Adjacent to PDR-046 (Layered
   Knowledge Processing) and PDR-067 (Surface Classification for Fitness
   Response) but distinct in scope: PDR-046 governs *how* knowledge moves
   between layers within a session; this PDR governs *what counts as
   throughput* across a session and *where the outputs flow*.
2. **Practice Core amendment selected by the PDR** — likely `practice.md` for
   the conceptual map and/or `practice-lineage.md` for the learned principle
   and propagation semantics. Do not create a separate principles surface by
   convenience; each Core file has a distinct function.

**Falsifiability check**: a future agent assessing a team-session should now
produce a per-axis throughput table (product-code + Practice-Core-substrate)
instead of a single aggregated table. If they default to single-surface
aggregation, the doctrine is not yet graduated to reflex.

**Residual trigger condition**: execute the downstream Core amendments
selected by PDR-072. Do not create a new `principles.md` surface; carry the
concept into `practice.md` and/or `practice-lineage.md` according to their
existing functions.

**Adjacent unresolved tensions**:

- How does this interact with the fitness-token-measurements discipline
  (curation outputs add to pending-graduations.md; drainage is itself a
  curation function)?
- How does this interact with the "fewer-larger-cycles-vs-many-smaller"
  question for the team-handoff cadence (curation cycles are usually larger
  and end-of-session-shaped)?
- The 4-vs-9-agent counterfactual revision in Sparking's napkin entry depends
  on this doctrine — should the napkin entry's counterfactual be promoted
  alongside the PDR or kept session-bound until the PDR drafts?

These tensions are surfacing the doctrine's scope; they do not block the
candidate's graduation but are flagged for the PDR authoring moment.

Archived 2026-05-24 by Shaded Silencing Dusk after verifying PDR-072 is
Proposed, carries the autonomic-learning and two-output-axis principle, the
PDR README lists it, and the Practice Core amendment cascade remains unlanded
and therefore live only as a compact residual trigger.

Residual closed 2026-05-24 by Sylvan Sprouting Petal after verifying the
downstream cascade landed: `practice.md` carries the two-output-surface
conceptual map and `practice-lineage.md` carries the learned principle for
Core propagation.

### 2026-05-23 — Agent identity UUID and body-file frontmatter

`[captured: 2026-05-23 | source: stormbound-floating-wing/tempfile-collision-incident-and-owner-direction | target: PDR + schema amendments on comms-event.schema.json + active-claims.json + commit-queue intent + handoff-record + tempfile-frontmatter rule | trigger: owner direction (received) — partially graduated to PDR-076 | size: M | status: partially-graduated]`

**Partial graduation 2026-05-23 (Incandescent Kindling Forge / cursor /
`328fac`, separate-lane consolidate-docs pass)**: PDR-076
(`agent-identity-tuple-and-body-file-frontmatter`) authored as `Proposed`,
principle layer. The PDR bundles two structurally separate decisions sharing
one owner direction and one worked instance: the identity tuple becomes
`(agent_name, UUID id)` with `session_id_prefix` demoted to chat-readable
short form; every body-bearing file authored for downstream consumption
carries frontmatter with `agent_name`, `id`, `created_at`,
`last_updated_at`. PDR-076 is portability-clean (no repo paths in body, no
commit refs; only outgoing link is to `practice-index.md`). Downstream
cascade named in PDR-076 §Cascade and explicitly NOT executed in this cycle:
PDR-027 amendment, identity-bearing schema tranches (active claim,
commit-queue intent, comms event sender/recipient, conversation entry,
sidebar participant, joint-decision proposer, escalation owner, handoff
record, thread identity row), identity preflight UUID emission, body-file
frontmatter consumers, identity rendering surfaces.

**Curation note 2026-05-23 (Breezy Cresting Beacon, prior pass)**: retained
as `due`, with owner decision now received. This is an amendment to the
identity contract: UUID makes each agent uniquely identifiable, while the
name remains the primary means of identification. Temporary-file frontmatter
is valuable but separate; specify the schema cheaply now, and decide
enforcement tooling later.

**Next action** (remaining cascade): amend PDR-027 and the identity-bearing
schemas to carry `agent_name` + UUID `id`; land the body-file frontmatter
consumer wiring at each ceremony. Each is a separate cycle per the PDR-076
§Cascade landing-order discipline.

**Owner direction 2026-05-23** captured to per-user memory
`feedback_agent_identity_name_plus_uuid`:

> "agent identities will require two fields, a name and a uuid id, and that
> all comms events must use both, the name remains the primary means of
> identification, the uuid is for disambiguation. All temporary agent
> coordination and collaboration files must contain frontmatter with agent
> name, id, created at, last updated at"

**Worked instance triggering the direction**: Stormbound Floating Wing /
`52f264` drafted a closeout body via `Write` to `/tmp/stormbound-closeout.md`.
The path pre-existed from Stormbound Kiting Squall / `ddbea2`'s session (May
22 16:26). Write refused with "File has not been read yet"; a parallel `comms
append --body-file` call proceeded with the STALE file, posting Kiting
Squall's Cycle 1.1 closeout text under Floating Wing's identity tuple. This
is a new sub-class of the authorial-bundle-integrity failure-class SVW
flagged at 23:09:17Z (3rd-instance flag on shared-file line-scope drift) —
*tempfile-path collision across sessions in shared `/tmp/` namespace over
multiple days*.

**Substance summary — two related rules**:

1. **Identity = `(agent_name, id)` two-field shape.** Replaces today's
   `(agent_name, platform, model, session_id_prefix)` PDR-027 tuple where
   `session_id_prefix` is a 6-char short form. The new `id` is a full UUID;
   `agent_name` remains the primary human-readable identifier. Every comms
   event, active-claim, commit-queue intent, conversation participant,
   sidebar/joint-decision/escalation reference MUST carry both fields. The
   `(name, prefix)` routing-pair rule (graduated 2026-05-14 to
   `.agent/rules/register-identity-on-thread-join.md`) updates to
   `(name, id)`; `prefix` becomes a chat-readable short form, `id` is the
   canonical disambiguator.
2. **Temporary-file frontmatter schema, separate from identity itself.**
   Every temporary agent coordination / collaboration file (closeout drafts,
   commit-message drafts, broadcast bodies, handoff records, intent-scoped
   message files under `.git/.commit-queue/` or `/tmp/`, reviewer-finding
   scratch-notes, deferred-intent receipts) MUST contain frontmatter with at
   least: `agent_name`, `id`, `created_at`, `last_updated_at`. The schema
   should be specified now. The enforcing tooling is intentionally
   unresolved: likely consumers include comms append, commit-queue ceremony,
   and handoff-record readers, but the first architectural move is the
   schema, not premature tool binding.

**Cure shape — PDR-Proposed authoring scope**:

- Schema amendments on `comms-event.schema.json`, `active-claims.json`
  schema, commit-queue intent shape, handoff-record schema,
  conversation/sidebar/joint-decision/escalation schemas to require
  `(agent_name, id)` on every identity reference. Tranched landing (additive
  `id` field at first, then strict-required) per ADR-183 tranche-ordering
  precedent.
- Tooling enforcement: `pnpm agent-tools:collaboration-state -- identity
  preflight` emits a UUID `id` alongside the existing `agent_name`. `comms
  append`, `claims open`, `commit-queue` ceremony, handoff-record reader all
  verify the frontmatter on body files before use.
- Tempfile-path session-prefix convention named in the relevant SKILL
  surfaces (commit-queue, session-handoff, start-right-team) as a
  *secondary* defence (the frontmatter rule is the primary).
- Per-user memory `feedback_identity_routing_uses_name_and_prefix_pair`
  updates to name the (name, id) replacement when this PDR lands.

**Cross-references**:

- Builds on PDR-027 (threads, sessions, agent identity); proposes the
  next-iteration shape.
- Cures the recurring authorial-bundle-integrity failure-class (Velvet
  `e1b9561e` 2026-05-22; SVW 23:09:17Z 3rd-instance flag 2026-05-22;
  Stormbound Floating Wing `0957bc7f` tempfile-collision 2026-05-23) at the
  substrate level — the existing intent-scoped-message-file "Cure 1" (per
  Foamy adoption pattern) becomes structural rather than
  convention-by-practice.
- Adjacent doctrine: `feedback_templated_loops_need_exit_criteria`
  (2026-05-23) — both captured in the same owner-direction window after the
  tempfile-collision incident exposed the gaps.

Archived 2026-05-24 by Shaded Silencing Dusk after verifying the original
PDR-076 is superseded, PDR-076a carries the identity-tuple decision,
PDR-076b carries the body-file frontmatter decision, and the live queue only
needs to retain the downstream operationalisation cascades.

### 2026-05-04 — Stage-by-explicit-pathspec asymmetric cure

`[captured: 2026-05-04 | source: napkin+commit-history | target: multi:rule:stage-by-explicit-pathspec(landed)+adr:asymmetric-cure-enforcement+pdr:asymmetric-cure-followup | trigger: n>=3-validation | size: L | status: partially-graduated]`

The `git commit -- <pathspec>` cure is asymmetric: one-sided application does
not prevent absorption by peers who do not apply it. Three observed instances
of foreign-stage absorption justified structural enforcement: Vining
Spreading Seed initial; Lacustrine → Moonlit `8fa339f4` 2026-05-04 second;
Ethereal → Dawnlit `36102937` 2026-05-05 third.

The cure as written was operator-applied prose at
`stage-by-explicit-pathspec.md §Peer-Index Note`. In each instance, a peer's
`git commit` without `-- <pathspec>` filter swept staged content authored by
another agent into the peer's commit. Substance was preserved; commit-message
attribution was distorted; reviewer evidence, when present, still applied to
the absorbed diff. The third instance (Ethereal → Dawnlit) was particularly
clean: the absorbed-from agent had reviewer chain on the diff pre-absorption
(architecture-reviewer-fred CLEAN + code-reviewer APPROVED WITH SUGGESTIONS);
review evidence was intact, and only the commit subject misled.

Asymmetry insight (added 2026-05-05): a cure that protects the agent who
applies it but does not prevent the failure mode in agents who do not apply it
is not really a structural cure — it is a behavioural commitment one side
keeps on the other side's behalf. Source surfaces: napkin "Peer-staged
renames in the index bleed into your staging area via `git add`" entry
(2026-05-04); Ethereal's comms-event acknowledgement at 2e2bfb5a
(2026-05-05); Dawnlit's experience file
`2026-05-05-dawnlit-the-screen-and-the-gate.md` (2026-05-05).

Graduation target was a structural enforcement candidate for owner direction.
Candidate shapes:

1. Pre-commit hook refuses `git commit` without explicit pathspec when the
   staged set contains files outside the agent's queued bundle.
2. Commit-queue layer detects fingerprint-of-staged-set diverging from queued
   intent and aborts at `verify-staged`.
3. Shared pre-commit gate requires `--include` or pathspec matching the active
   commit-queue intent.

Each is a distinct design decision; owner-direction-shaped, not
consolidation-shaped. Trigger condition: third instance observed; promotes to
due. Status: `partially graduated 2026-05-05` (Opalescent Threading Nebula).
Asymmetric-cure observation graduated to
`.agent/rules/stage-by-explicit-pathspec.md § Cure Asymmetry — One-Sided
Application Does Not Prevent Absorption` with the three-instance evidence
table and the three named candidate shapes.

Two follow-ups were queued:

- **ADR-shaped follow-up** (host structural-enforcement choice): pending owner
  direction on which of the three candidate shapes to implement. The choice is
  host-architectural (trades off friction, false-positive rate, operational
  complexity); ADR is the right home for the decision once direction lands.
- **PDR-shaped follow-up** (Practice-governance principle): "asymmetric-cure
  failure mode — a cure that protects only the applier is not really a
  structural cure" is plausibly portable Practice governance. Promotion to PDR
  awaits a second-context manifestation of the same asymmetric-cure shape
  outside `git commit -- <pathspec>` (e.g. shared lockfile discipline,
  shared-state-file write discipline, shared-comms-log authoring discipline).
  Single-context evidence (three instances all `git commit`) is insufficient
  for Practice-Core promotion per consolidate-docs §7a (PDR adopter test).

Archived 2026-05-24 by Shaded Silencing Dusk after verifying the behavioural
rule, PDR-054 (Accepted), and ADR-177 (Accepted/Revised) carry the processed
substance. The live queue now keeps only the ADR-177 shape (b)
implementation residual and the shape (c) escalation watch.

### 2026-05-21 — Sync-kind / urgency flag in comms schema

`[captured: 2026-05-21 | source: owner-direction+agent-tools-cli-landing | target: adr:comms-sync-urgency-representation | trigger: owner-direction | size: M | status: partially-graduated]`

Owner direction 2026-05-21: *sync messages for high urgency decisions are a
valid view onto the event stream; sync messages must have at least two
participants.* The current schema (`agent-tools/src/collaboration-state/
types.ts`) has only three top-level kinds: `narrative`, `lifecycle`,
`directed`. There is no `sync` kind and no `urgency` flag. Today, urgency
must be inferred at the agent reasoning layer from title/body conventions —
the watcher boundary cannot expose `[SYNC]` as a first-class view because it
has no syntactic signal to classify against.

ADR work: decide between a new `sync` top-level kind versus an
`urgency: 'sync' | 'normal'` flag on narrative + directed kinds. The trade-off
is granularity (urgency flag composes with view type) vs simplicity (separate
kind is easier to validate). Then write-side validation enforces the
two-participant invariant: a sync event must have at least two agents in scope
(sender + addressee/audience), refusing self-only sync.

Trigger: owner direction to start the schema work. Slot in the
`comms-relevant-events.ts` `EventView` enum is already reserved by the
doctrine — the line `'broadcast' | 'group' | 'directed' | 'lifecycle'`
extends to include `'sync'` without other change.

**Partial graduation 2026-05-23 (ADR-184)**: owner direction resolved the
either/or framing as a collapsed-axis mistake. ADR-184 chooses both surfaces:
top-level `sync` as the interaction-shape axis, and closed-vocabulary
`urgency` as the response-priority axis. This entry remains live for the
schema, parser, CLI rendering, and write-side enforcement tranches.

Archived 2026-05-24 by Shaded Silencing Dusk after verifying ADR-184 carries
the representation decision and tranche order. The live queue now keeps only
the schema/parser, CLI rendering, authoring/enforcement, and activation
residual.

## Historical log block archived 2026-05-24

Archived by Shaded Silencing Dusk after verifying this block is processed
history rather than live unresolved substance. Retained items named here still
have live bodies later in `pending-graduations.md`; graduated items have
archived bodies or permanent homes.

### 2026-05-12 due-entry disposition log (Twigged Growing Glade)

| Entry | Disposition |
|---|---|
| `getSkillPermissionIssues` dead parameter + missing live-path tests | Retained pending as an implementation cleanup triggered by next touch of `agent-tools/scripts/validate-portability-helpers.ts`; not ADR/PDR-shaped. |
| `shouldInspectFile` single-positive-example coverage | Retained pending as a focused test-cycle cleanup triggered by next touch of the `validate-fitness-vocabulary` suite; not ADR/PDR-shaped. |
| Cross-agent sweep-bundling prohibition | Retained pending as an owner/implementation decision because PDR-054/PDR-059 and P3 guard work already carry the doctrine backbone; remaining question is harder-to-bypass enforcement across all commit paths. |
| R4-new native git pre-commit hook | Retained pending with corrected target: not a native pre-stage hook, because Git/Husky have no native pre-stage lifecycle; the live home is the cost-of-collaboration hard-to-bypass enforcement tail. |
| Commit-queue UX as structural cure surface | Retained pending in the cost-of-collaboration P5/P8/P6 tail; P-Foundation/P1-P4 reduced friction but did not settle the full UX doctrine. |
| Pre-commit hook must gate staged content only | Graduated to the completed P0 quality-gate rebalance: staged-only file-content scanners plus preserved whole-repo broken-code guards, recorded in `cost-of-collaboration.plan.md` and `.husky/pre-commit`. |
| Peer-pair sidebar beats coordinator+helpers for design work | Partially graduated: `agent-collaboration.md` carries the coordinator-role boundary and `inter-agent-sidebar-with-default-action.md` carries a claim-conflict sidebar instance, but the design-collaboration shape still needs a durable home. |

### 2026-05-12 remaining-queue disposition review (Twigged Growing Glade)

After the due queue was emptied, the remaining live entries were reviewed as a
register, not as a compression target. Their content is retained unless an
entry already had a durable home or carried stale lifecycle wording.

| Queue slice | Disposition |
|---|---|
| Plan- or implementation-gated lanes | Retained pending with explicit carrier plans/triggers, including cost-of-collaboration P5/P8/P6, graph-stack follow-ons, SDK codegen workspace decomposition, workspace-topology ADR sequencing, validation/TDD restructure, scripts-validator migration, PR lifecycle, Vercel warning elimination, and older tooling/domain plans. |
| First-instance or second-instance pattern candidates | Retained pending; the register is the correct waiting room until corroboration, owner direction, or a named implementation slot fires. |
| Owner-facing decisions | Retained pending where the entry asks for an owner choice (for example schema/directory projection choices, topology naming, optionality rule siblings, destructive-operation hook ideas, or generated-insight artefact methodology). |
| Existing graduated audit trails | Kept as audit-trail bodies until the next archive snapshot; stale prose was corrected where it still said `due` or `ready for promotion` despite a resolved home. |
| Stale target/status corrections applied | Older whole-tree pre-commit gate scope now points at the completed P0 gate rebalance; old CLI first-touch friction now points at PDR-055/ADR-178 plus the cost-of-collaboration lane; observability WS8.6/8.7 and inter-agent protocol prose no longer describe themselves as due; `pending-audit` was normalised to `pending (audit-triggered)`. |

### Status Corrections Applied 2026-05-12

These body entries still carried due metadata, but the register already
records their durable homes in the 2026-05-10 graduation log. This pass only
corrects stale status metadata; it does **not** silently promote new doctrine.

| Entry | Existing durable home |
|---|---|
| Agent-tools CLI affordance set + build isolation | PDR-055 + ADR-178 |
| No-moving-targets hook tightening | `agent-tools/scripts/check-blocked-content.ts` prose-vs-data distinction + rule update |
| Invoke doc-and-onboarding experts on significant changes | `.agent/rules/invoke-doc-and-onboarding-experts-on-significant-changes.md` |
| Observability orthogonal axes | ADR-171 + amendments to ADR-116/143/162/163 |
| Inter-agent collaboration protocol gaps | PDR-056, preserving hypothesis-status evidence |

### 2026-05-12 graduation log (Secret Vanishing Moth — P3 enforcement handoff)

| Entry | Graduated to | Evidence |
|---|---|---|
| Advisory protocols decay under pressure; enforcement required | `commit-queue guard` implementation + `cost-of-collaboration.plan.md` P3 evidence | `c083a1ab` |

### 2026-05-22 graduation log (Starlit Beaming Aurora — deep-graduation pass)

Owner-direction trigger: *"please run a deep graduation of knowledge source
materials, the napkin, the comms records, the .remember directory, the vendor
specific memory locations. Ignore fitness metric levels for now."* Eight Tier
A graduations to permanent homes; nine Tier B pattern-and-draft captures at
pattern fidelity or PDR-Draft status; five Tier C per-user memory marker
updates.

| Entry | Graduated to |
|---|---|
| Cycle decomposition produces wrong-layer scaffolding tests | pattern `where-system-state-is-observable-at-plan-author-time.md` + `tdd-as-design.md` §"One state, one describing surface" amendment |
| Check-runner singleton claim | new rule `check-singleton-per-window.md` + adapters + RULES_INDEX entry + `session-handoff` SKILL §11 amendment |
| Event-driven wake uses Monitor | new rule `use-monitor-for-event-driven-wake.md` + adapters + RULES_INDEX entry |
| Metacognition has two modes (retrospective + generative) | `metacognition.md` directive amendment naming both modes + structural-cure-not-doc-patch addendum |
| Platform-specific per-user memory is a buffer | new rule `per-user-memory-is-a-buffer.md` + adapters + RULES_INDEX entry |
| Knowledge preservation overrides fitness warnings | new rule `knowledge-preservation-over-fitness-warnings.md` + adapters + RULES_INDEX entry |
| Surface classification for fitness-response routing | PDR-067 (Proposed) |
| Pipeline back-pressure as structural-cure signal | PDR-068 (Proposed) |
| Dispatch PENDING reviewers at session-close | `session-handoff` SKILL §11a amendment |
| Doctrine-first vs first-principles diversity | PDR-069 (Draft — promotion requires second instance or owner ratification) |
| Moment-of-decision heuristic consolidation | PDR-070 (Draft — promotion requires third instance against different class) |
| Structurally-identical new-function pre-authoring drop | pattern `structurally-identical-new-function-pre-authoring-drop.md` |
| Citation-as-reasoning at moment of verdict | pattern `citation-as-reasoning-at-moment-of-verdict.md` |
| Dogma vocabulary closes inquiry | pattern `dogma-vocabulary-closes-inquiry.md` |
| Coordinator-as-slice-runner short by one | pattern `coordinator-as-slice-runner-short-by-one.md` |
| Routing broadcast needs paired claim action | pattern `routing-broadcast-needs-paired-claim-action.md` |
| Behaviour-nudge pressure-score design constraints | pattern (design-note polarity) `behaviour-nudge-pressure-design-constraints.md` |
| Tier C per-user memory marker updates | five entries marked "Graduated to ..." in per-user Claude memory: `feedback_no_speed_pressure`, `feedback_broken_code_stays_local`, `feedback_watch_both_broadcast_and_directed`, `feedback_30_percent_context_for_directives`, `feedback_no_moving_targets_in_permanent_docs` (audit trail; substance already lived at the named in-repo homes) |

### 2026-05-22 graduation log (Tempestuous Spiralling Thermal)

- Partial / slice-scoped coordinator transfer → PDR-064 §"Partial /
  Slice-Scoped Coordinator Transfer" amendment. Evidence: three in-session
  instances; PDR anchors at §Moment 2 and §Cron / cadence boundary now point to
  the landed amendment.
- Coordinator-must-delegate-sub-agent-launches → `start-right-team` SKILL
  §"Choose Temporary Responsibilities" amendment. Evidence: two in-session
  owner corrections; Blustery self-flagged candidate; doctrine target named in
  original entry.
- CLI body backtick-shell-substitution cure pattern →
  `agent-tools/README.md` §"CLI Norms" → §"Comms body input: `--body` vs
  `--body-file`". Evidence: three+ cross-session instances; cure mechanism
  (`--body-file`) shipped in `675bb83b`; README section documents the cure
  shape.
- Hook-policy substring-matching in instructive content →
  `.agent/rules/hook-policy-substring-discipline.md` plus adapters and
  RULES_INDEX entry. Evidence: three+ cross-session instances; cure (b),
  content-authoring discipline using descriptive language, is the portable
  immediate cure; cure (a), context-aware hook parsing, remains a separate
  upstream concern.

### 2026-05-22 graduation log (Wooded Swaying Thicket)

| Entry | Graduated to | Evidence |
|---|---|---|
| Coordinator-handoff: pre-positioning vs active-acknowledgement | PDR-064 + `start-right-team` SKILL §"Coordinator Handoff (Two Moments)" | `c4bacfc5` (SKILL amendment); three in-session instances captured in Foamy 2026-05-22 napkin entry |
| §1a inherited-tree gate-runner default scope is per-workspace | `start-right-team` SKILL §1a "Running the gates" | distilled.md 2026-05-21 §"Per-workspace inherited-tree gates are the default for workspace-scoped dirt" |
| Mid-cycle retirement protocol for token-bounded agents | PDR-063 + ADR-182 Tranche 1 + `start-right-team` SKILL §"Mid-Cycle Retirement" | `c4bacfc5` (substrate land) |
| Grounding-cost amortisation under rotating-cast operation | PDR-065 | Foamy Snorkelling Jetty draft 2026-05-22 |
| Comms-event stream as real-time failure-mode capture channel | PDR-066 + ADR-183 Tranche 1 + `start-right-team` SKILL §"Real-time failure-mode capture on the comms stream" | `c4bacfc5` (substrate land); ADR-183 Tranche 2 CLI rendering deferred per the ADR's tranche ordering rule |

## Older graduations logs archived 2026-05-24

Archived by Shaded Silencing Dusk after verifying the named graduations have
archive bodies or permanent homes. The 2026-05-12 entry-count snapshot is stale
history, not a live queue index; current live counts are derived by search and
fitness checks.

### 2026-05-10 graduations log (Sylvan Fruiting Glade)

| Entry | Graduated to | Lines |
|---|---|---|
| 30% context budget for directive-file processing | PDR-052 | L494–539 |
| invoke-doc-and-onboarding-reviewers rule | `.agent/rules/invoke-doc-and-onboarding-experts-on-significant-changes.md` (re-route option exercised) | L1485–1506 |
| pattern surface needs polarity discipline | PDR-014 amendment + bulk sweep across ~93 pattern files | L436–492 |
| orchestrator-vs-gate structural cure | PDR-053 + ADR-176 + script rename + commit-skill SKILL update | L891–919 |
| agent-tools CLI affordance set + build isolation | PDR-055 + ADR-178 | L951–985 |
| no-moving-targets hook tightening | `agent-tools/scripts/check-blocked-content.ts` prose-vs-data distinction + rule update | L1085–1116 |
| stage-by-explicit-pathspec asymmetric-cure | PDR-054 + ADR-177 (rule already landed) | L1135–1198 |
| observability orthogonal axes | ADR-171 + amendments to ADR-116/143/162/163 | L1508–1544 |
| inter-agent collaboration protocol gaps | PDR-056 (ten cures, hypothesis-status preserved) | L1556–1632 |

### 2026-05-10 graduations log (Quiet Lurking Mask)

| Entry | Graduated to | Lines |
|---|---|---|
| apply-don't-ask reformulation (empirical-answerability) | PDR-057 | L1988–2036 (quarantine entry) |
| stop-inventing-optionality reformulation (three-tier decomposition) | PDR-058 | L1988–2036 (quarantine entry) |

### Entry Counts (2026-05-12 — post-index reconciliation)

| Status | Count | Notes |
|---|---|---|
| due | 0 | former due entries disposed 2026-05-12 without trimming substance |
| overdue | 0 | no body entry currently uses overdue metadata |
| partially-graduated | 2 | stage-by-explicit-pathspec asymmetric-cure family plus peer-pair design-collaboration sidebar residual |
| quarantined | 0 | unchanged |
| held-pending-plan | 1 | SDK codegen generator-duplication pointer |
| pending | ~76 | grep count of explicit `status: pending` markers after retaining implementation-shaped and owner-shaped former due entries; prose-only older entries may still need metadata backfill |
| **active queue total** | **~79** | excludes graduated-history bodies retained for audit until the next archive snapshot |

### 2026-05-11 graduations log (Fronded Flowering Seed)

| Entry | Graduated to | Reviewers |
|---|---|---|
| Hook-chain re-staging absorbs files post-verify-staged | PDR-059 (regenerator-output-classification) + ADR-177 amendment (2026-05-11) + PDR-054 §Related cross-ref | architecture-expert-betty GO WITH CONDITIONS (2 doctrine edits applied); docs-adr-expert GO; assumptions-expert GO WITH CONDITIONS (2 plan-level pre-conditions recorded in ADR-177) |
| ADR-041 amendment needed: top-level workspace tiers | ADR-041 amendment (2026-05-11) — `agent-tools/` + `agent-graphs/` tiers added; 8 × 8 dependency-direction matrix; D-4a closed in graph-mvp-arc.plan.md:732; ADR-173 §Open Questions:1 cross-linked | architecture-expert-fred GO; architecture-expert-betty GO WITH CONDITIONS (2 matrix-cell precision edits applied); docs-adr-expert GO WITH CONDITIONS (3 housekeeping items applied) |

## Processed curation ledger archived 2026-05-24

Archived by Shaded Silencing Dusk under claim
`c882a1f2-4ad6-4feb-bc5b-863480874ffc` after verifying the detailed
disposition lives in
`.agent/memory/operational/curator-passes/2026-05-24-shaded-silencing-dusk.md`
and the source queue bodies already live in dated archives or durable homes.
The live register now keeps only a compact pointer so
`pending-graduations.md` remains a queue, not a duplicate curation log.

### 2026-05-24 resolved-stub drain (Shaded Silencing Dusk)

Removed live pointer stubs for `reciprocal-cross-agent-reviewer-dispatch` and
`untracked-wip-whole-tree-lint-blocker`. Their full bodies were already
preserved in
[`archive/pending-graduations-archive-2026-05-23.md`](archive/pending-graduations-archive-2026-05-23.md),
and their permanent pattern homes are present in `.agent/memory/active/patterns/`.

### 2026-05-24 legacy graduated-stub drains (Shaded Silencing Dusk)

Removed six verified `status: graduated` stubs whose bodies and durable homes
were already checked: four from the 2026-05-10 archive set and two from the
2026-05-22 archive set. Verbatim bodies remain in the dated pending-graduations
archives; the Shaded curator-pass log carries the verified-home ledger.

Removed thirteen additional verified graduated pointers from the 2026-05-22
archive set after checking their durable homes: testing scaffolding topology,
check-runner singleton, PENDING reviewer dispatch, coordinator handoff,
coordinator-as-slice-runner, per-workspace inherited-tree gates, mid-cycle
retirement, grounding-cost amortisation, comms-event failure-mode capture,
surface classification, pipeline back-pressure, metacognition's two modes, and
per-user memory's drainage contract.

Removed four verified mid-May graduated pointers after checking their archived
bodies and current homes: `pnpm check` session-handoff cleanliness,
hook-bypass equivalence, agent pronoun defaults, and conduct-correction
graduation discipline.

Removed seven verified absorption/coordinator graduated pointers after
checking their archived bodies and durable homes: closure-pressure
rationalisation, PDR-044 refusal-vs-approval, over-correction during
absorption, completed-work review re-decision, the absorption-adjacent
failure-mode family, partial coordinator transfer, and coordinator sub-agent
delegation.

Removed ten verified 2026-05-22 rule/doc graduated pointers after checking
their archived bodies and durable homes: CLI body backtick handling,
hook-policy substring discipline, pre-execution code-expert review,
framing-direction, continuity-surface orphan commits, reviewer dispatch shapes,
self-contained handoffs, queue-wait observability, owner action-moment
attention, and discontinuity-boundary validation.

Removed five verified processed pointers after checking their archived bodies
and durable homes: different-lens reviewer divergence, fitness-validator
non-reactive response, comprehensive-cataloguing drift, inter-agent
communication as a first-class primitive, and first-question elaboration
boundaries.

Removed seven additional verified historical graduated pointers after checking
their archived bodies and durable homes: ADR-041 top-level workspace tiers,
pre-commit gate staged-scope, PDR-055/ADR-178 CLI affordance/build isolation,
no-moving-target hook tightening, observability WS10/WS8.6 orthogonal axes,
and PDR-056 inter-agent protocol gaps.

Removed seven verified 2026-05-24 processed stubs after checking their
archived bodies and current durable homes: comms-watch self-exclusion,
sidebar protocol with default action, verify-dont-trust, cron owner-input
precedence, `/remember` write-time contract route, current-vs-active
plan-directory taxonomy, and the withdrawn Supertest classification conflict.

Removed three verified legacy implementation-route stubs after checking their
archived bodies and current homes: CLI first-touch friction, pre-commit
staged-content gating, and advisory-protocol enforcement via commit-queue
guard.

Removed the verified `honest-restructure-over-band-aid` partially-graduated
stub after checking its archived body and current pattern home. The active
pattern carries the worked instances and third-instance promotion trigger.

Removed five verified pattern-only duplicate bodies after checking that their
active pattern homes carry both the substance and the remaining promotion
trigger: structurally-identical new function pre-authoring drop,
behaviour-nudge pressure design constraints, routing broadcast with paired
claim action, citation-as-reasoning at verdict time, and dogma vocabulary.

Processed and archived the substrate-pointer v3 real-time absorption variants
after folding the listed variants into
`substrate-pointer-read-as-current-state.md`: fresh-on-disk but not absorbed
comms, stale handoff attribution, cron prompt pointers across owner-pause
windows, pre-compaction stale framing, and compose-vs-emit interval staleness.

Processed and archived the PDR-075 status-review due entry after adding a
dated status review to PDR-075. The PDR remains Candidate; the review records
that later evidence strengthens the case but does not authorize promotion
without the named validation trigger or owner ratification.

Processed and archived the templated-loop partially-graduated entry after
verifying the loop-exit rule and platform adapters exist, confirming no
repo-local `/loop` skill currently exists, and adding the future template-
authorship instruction to the rule itself.

Processed and archived the PDR-070 / PDR-069 partially-graduated duplicate
bodies after verifying their PDR homes already carry Draft status caveats,
promotion triggers, and the reusable substance. The live register no longer
duplicates the PDR bodies.

Processed and archived the duplicate PDR-071 body after verifying PDR-071 is
Proposed and its experiment anchors exist. The live register now keeps only
the still-live broader role-label ontology residual trigger.

Processed and archived the duplicate PDR-073 body after verifying PDR-073 is
Proposed and the Practice Core/directive cascade remains separate. The live
register now keeps only the trinity-amendment/directive residual trigger.

Closed the PDR-073 residual after verifying `practice.md` now carries the
recursion-as-method self-teaching substrate statement and `practice-lineage.md`
carries the learned principle. The optional new directive surface was
explicitly declined because the Core trinity plus existing `metacognition.md`
already provide the session-open recognition path without duplicating a
directive.

Processed and archived the duplicate PDR-072 body after verifying PDR-072 is
Proposed and the Practice Core amendment cascade remains separate. The live
register now keeps only the `practice.md` / `practice-lineage.md` residual
trigger.

Closed the PDR-072 residual after verifying `practice.md` now carries the
two-output-surface conceptual map and `practice-lineage.md` carries the learned
principle. The original body and Shaded processing note remain in the
2026-05-24 archive.

Processed and archived the superseded bundled PDR-076 queue body after
verifying the split homes PDR-076a and PDR-076b. The live register now keeps
only their operationalisation residuals.

Processed and archived the stage-by-explicit-pathspec asymmetric-cure body
after verifying the rule, PDR-054, and ADR-177 homes. The live register now
keeps only the residual implementation/escalation watch.

Processed and archived the sync-kind / urgency body after verifying ADR-184
is the decision home. The live register now keeps only the implementation
tranche residual.

## Processed pointer notes compacted 2026-05-24

Archived by Shaded Silencing Dusk under claim
`80428a81-8042-4b97-b894-1ecaa1f23aac` after verifying these notes point only
to processed history, active shards, dated archives, or durable homes. The live
register now keeps one compact pointer so it remains an active queue.

### Curator-pass logs migrated 2026-05-24

Previously this register carried three in-buffer curation-pass logs
(Breezy Cresting Beacon knowledge-preservation pass, Breezy Cresting
Beacon sub-agent-assisted home-gap review, Incandescent Kindling
Forge separate-lane drain). Per the owner-stated buffer-only
contract for pending-graduations, those logs were migrated to the
per-pass curator-passes directory at
`.agent/memory/operational/curator-passes/` under PDR-081. The
metadata-only pass files are:

- `2026-05-23-breezy-cresting-beacon.md`
- `2026-05-23-incandescent-kindling-forge.md`

The full substance of those passes lives in
`archive/pending-graduations-archive-2026-05-23.md` (preserved by
the standard archive flow).

### Historical log block archived 2026-05-24

Processed and archived the top-of-register 2026-05-12 and 2026-05-22
historical log block after verifying its entries are disposition records, not
unprocessed live bodies. Retained items still have live queue bodies later in
this register; graduated items have archived bodies or permanent homes. The
archived log text lives in
[`archive/pending-graduations-archive-2026-05-24.md`](archive/pending-graduations-archive-2026-05-24.md)
§ "Historical log block archived 2026-05-24".

### 2026-05-22 evening — backfill archive sweep (Velvet Veiling Wisp)

Archived the bodies of 20 `status: graduated` entries (the accumulation
from today's four graduation passes — Starlit, Tempestuous, Wooded,
Shadowed Hiding Shade) to
[`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md)
under the *"Backfill sweep — 2026-05-22 evening"* section. Each
live-register entry below this marker is replaced with a one-line
graduated-pointer. Substance is preserved verbatim in the archive; this
register returns to its working-queue shape. The follow-up nested-bullet
relocation pass also completed in the same archive under
`Nested-bullet defect-class sweep — 2026-05-22 evening`; the live register now
keeps one-line graduated pointers for that older 2026-05-09 / 2026-05-10 /
2026-05-11 set rather than full bodies.

### 2026-05-24 processed curation ledger archived

Processed and archived the 2026-05-24 resolved-stub, graduated-stub,
pattern-duplicate, and residual-compaction ledger after verifying the detailed
disposition lives in the Shaded curator-pass log and the original bodies live
in dated archives or durable homes. The archived ledger text lives in
[`archive/pending-graduations-archive-2026-05-24.md`](archive/pending-graduations-archive-2026-05-24.md)
§ "Processed curation ledger archived 2026-05-24".

### Older graduations logs archived 2026-05-24

Processed and archived the 2026-05-10/11 graduations-log cluster and stale
2026-05-12 entry-count snapshot after verifying the named entries have archive
bodies or permanent homes. The archived log text lives in
[`archive/pending-graduations-archive-2026-05-24.md`](archive/pending-graduations-archive-2026-05-24.md)
§ "Older graduations logs archived 2026-05-24".

## Processed Active-Shard Bodies Archived 2026-05-24

### Sonar MCP `show_security_hotspot` audit-trail visibility gap

`[CANDIDATE: sonar-mcp-changelog-not-comments | captured: 2026-05-22 |
source: Ferny + Midnight PR-108 Cycle 2/3 hotspot-disposition observations |
graduation-target: sonar-disposition-policy amendment or ADR |
trigger: 2nd MCP/REST asymmetry citation or empty-comments audit finding |
status: pending | size: S]`

Sonar MCP `change_security_hotspot_status` accepts a `comment`
parameter; mutation succeeds and returns `success: true,
newStatus: REVIEWED, newResolution: SAFE`. Subsequent
`show_security_hotspot` on the same hotspot returns `comments: []`
and does not expose a `changelog` field. The rationale text is
stored Sonar-side (the mutation accepted it) but is invisible
through the MCP read surface. The plan's deterministic-validation
block cites the public REST `/api/hotspots/show` endpoint returning
a `changelog` field — the MCP tool does NOT expose `changelog`,
only the `comments` thread which is a different concept (free-text
comment thread vs status-change-history). An auditor relying on
MCP `show_security_hotspot.comments` would incorrectly conclude no
rationale was filed. Not blocking the QG (the disposition itself
gates `new_security_hotspots_reviewed = 100%`), but worth
amending the policy doc with the REST-verification path. May also
deserve an ADR if cross-cutting (e.g. multiple Sonar MCP read
surfaces are similarly asymmetric vs REST).

Processed 2026-05-24 by Sylvan Sprouting Petal under claim
`591f366d-622c-45bd-b374-81788750597b` after verifying the durable home:
`.agent/rules/sonarqube-mcp-instructions.md` § "Hotspot review" now says not
to use `show_security_hotspot.comments` as the audit-trail verification
surface and to verify rationale visibility through the Sonar REST
`/api/hotspots/show?hotspot=<hotspot-key>` `changelog` entries instead. No ADR
was opened because this specific asymmetry has a precise operational rule home.

### Deferred-at-write-time decisions are unmade load-bearing decisions

When a plan defers a substantive structural decision into "decide at
write time" (e.g. WS2.3 of skills-standardisation: import-from-workspace
vs duplicate-XOR), the deferral is not flexibility — it is the plan
owner declining to make a load-bearing decision, leaving the cycle
author to make it under implementation pressure. WS0 (2026-05-09)
turned the deferral into a structural choice (subprocess delegation)
before any code was written, and the reshape applied cleanly to the
paired sibling cycle (WS2.4) at no extra cost.
`[captured: 2026-05-09 | source: napkin | target: pattern OR rule | trigger: second instance observed in a different plan | size: S | status: pending]`
Graduation-target: pattern under `.agent/memory/active/patterns/` or
rule under `.agent/rules/` (deferred-decisions-are-unmade-decisions);
consider folding into a broader plan-shape rule alongside
consolidate-at-third-consumer.
Trigger-condition: a second instance of "decide at write time" surfaces
in any plan during the next session window OR the next consolidation
pass evaluates the substance.

Processed 2026-05-24 by Sylvan Sprouting Petal under claim
`3abd762c-a109-4e3a-bf7e-bc8a4b928c80` after verifying the durable home:
`.agent/memory/active/patterns/deferred-at-write-time-is-unmade-load-bearing-decision.md`.
The pattern carries the diagnostic, the 2026-05-09 WS0 worked instance, the
2026-05-10 fabricated-gate composition instance, the cure, and PDR-026
deferral-honesty cross-reference. No rule was opened because the pattern is the
exact home named by the original entry and already carries the reusable
substance.

### Insight-report Item 12 - Cross-repo sibling list

Static cross-repo map naming sibling repositories (oak-curriculum,
oak-ontology, etc.) and their relationship to this repo. Source:
`01-user-profile.md` and `04-domain-and-stack.md`. Verification owed
against `.agent/practice-core/practice-lineage.md` before any
graduation decision: if `practice-lineage.md` already carries a
cross-repo sibling map, this is a DISCARD.
`[captured: 2026-05-10 | source: experience/insight-report-2026-05-10 | target: doc-amend:practice-lineage.md OR none | trigger: candidate(verification-owed) | size: S | status: pending]`
Graduation-target: amendment to `practice-lineage.md` with a sibling
list section, OR a new `docs/engineering/sibling-repos.md`-paired
pointer if `sibling-repos.md` is the canonical home.
Trigger-condition: verification confirms `practice-lineage.md` does
NOT already carry the sibling map.
Withdrawal-trigger: verification confirms it does - DISCARD with
rationale; OR the sibling list churns within a release window such
that any static map is stale on arrival, regardless of where it
lands.

Processed 2026-05-24 by Sylvan Sprouting Petal under claim
`b23c74f2-58bc-4859-9a1a-d9d268d5377f` after verifying
`.agent/practice-core/practice-lineage.md` has no sibling-repository map and
the current durable host-doc home exists at `docs/engineering/sibling-repos.md`.
No Practice-Core amendment was made: the map is host-specific, so the host
engineering doc is the right durable home.

### Peer-commit absorption third-direction failure mode

`[captured-date: 2026-05-11 | source-surface: comms-event
e0a17465-fd5a-4c7d-979d-89696247de0a + napkin entry | graduation-
target: PDR amendment to PDR-054 / PDR-059 OR new PDR for peer-
commit-direction asymmetric-cure failure mode | trigger: third
observed instance of asymmetric-cure failure at the commit boundary,
in a structurally new direction beyond the husky-chain
(PDR-059) and pre-hook foreign-stage (PDR-054) directions | size:
M | status: pending]`

Mistbound Watching Lantern's commit `67885e3f` (2026-05-11) used
non-pathspec staging and swept six of Soaring Darting Kite's
session-lifecycle working-tree files into Mistbound's commit. Same
root cause as PDR-054 / PDR-059 (non-pathspec staging); same cure
(mechanical pathspec enforcement at the commit boundary); different
direction of damage (peer's commit absorbs my files, vs husky-chain
absorbing peer files into my commit, vs my pre-stage absorbing
peer's index). The three-direction symmetry is the new substance.
Graduation-target should name the three directions and a single
unified cure: commit-queue verify-staged enforcement at the husky
boundary, refusing any commit whose staged set extends beyond the
queued bundle regardless of which agent invoked. The Wave 3
commit-queue UX work + R4-new pre-commit hook in
[`2026-05-12-collaboration-protocol-hardening-r1b-opener.md`](../../../plans/agentic-engineering-enhancements/current/2026-05-12-collaboration-protocol-hardening-r1b-opener.md)
implements this cure; the graduation closes when both land and the
Wilma four-probe matrix passes.

Processed 2026-05-24 by Sylvan Sprouting Petal under claim
`705dfcc7-30ef-4406-867d-616b5f70e252` after verifying the durable home:
`.agent/memory/active/patterns/peer-commit-absorption-third-direction.md`.
The pattern carries the exact worked instance, three-direction model, shared
root cause, unified cure, mitigations, and routing. The remaining implementation
tail remains active in the adjacent R4-new and commit-queue UX entries rather
than being hidden here.

### Gatekeeper green-light stale-sweep race

`[captured-date: 2026-05-11 | source-surface: comms-message
29f9761c-7181-47b3-a6e2-6c2b2b60cffa + napkin entry Galactic-019e18 |
graduation-target: PDR amendment to PDR-059 OR new PDR for commit-window
freeze/isolation discipline | trigger: third serial ambient-gate failure after
a coordinator-side clean gate sweep; status: pending | size: M]`

Gatekeeper specialisation reduced duplicate full-tree gate runs but did not
solve the commit-window race: Wooded ran the repo-wide gate set cleanly, then the
team authored a new sidebar markdown file, and Flamebright's markdown-only commit
failed on that post-sweep file's markdownlint errors. The new doctrine candidate
is not merely "one gatekeeper"; it is "green-light implies a write-freeze,
isolation surface, or controlled post-sweep refresh before the peer commit
retries." This should graduate only after B-02/B-03/T-R4-new or an equivalent
commit-window cure makes the rule mechanically actionable.

Processed 2026-05-24 by Sylvan Sprouting Petal under claim
`74a3efbd-eaa5-4b1d-ad2a-fbb27243e087` after verifying the durable operational
home: `.agent/plans/agent-tooling/frictions-register.md` entry
`F-18 — Coordinator gate sweep stales when agents keep writing`. The frictions
register carries the evidence, expected invariant, candidate cure, target
surfaces, and explicit `open — evidence captured; no cure landed` status. No PDR
was opened here because the implementation/doctrine cure remains unresolved.

### Plan-portfolio leaf-to-root reachability invariant

`[CANDIDATE: plan-portfolio-reachability-invariant | captured: 2026-05-19 |
source: napkin 2026-05-19 + .agent/plans/README.md §Reachability Invariant |
graduation-target: ADR amendment (or new ADR) ratifying the leaf-to-root
invariant plus the obligated CI validator | trigger: validator implementation
slice ready, OR second collection-level orphan instance, OR owner-direct
promotion; status: pending | size: S]`

Audit on 2026-05-19 found three collections absent from the root README's Plan
Collections table (`notes/`, `observability/`, `user-experience/`), five orphan
plans below the lifecycle layer, and two collections missing lifecycle READMEs
entirely (`observability/{active,current,future}/`,
`security-and-privacy/future/`). Plus three top-level graph coordination spines
unindexed at the root (remediated in-line). The invariant — every plan is a leaf
node reachable from `.agent/plans/README.md` via collection-and-lifecycle
indexes — is now documented at `.agent/plans/README.md § Reachability Invariant
— Leaf-To-Root`. The remediation plan
`.agent/plans/agentic-engineering-enhancements/current/plan-index-reachability-remediation.plan.md`
captures the validator obligation as Phase 4. ADR ratification follows when the
validator implementation slice opens.

Processed 2026-05-24 by Sylvan Sprouting Petal under claim
`d41f9077-b7a5-4489-8f9c-2f95863a73c5` after verifying the durable homes:
`.agent/plans/README.md` carries the invariant, and
`.agent/plans/agentic-engineering-enhancements/current/plan-index-reachability-remediation.plan.md`
carries the unresolved remediation plan with `decision-incomplete` status and
the Phase 4 validator obligation. No ADR was opened here because the validator
implementation slice remains the named trigger.

### Canonical tool definitions belong code-adjacent, not in `.agent/reference/`

`[CANDIDATE: canonical-tool-definitions-code-adjacent | captured:
2026-05-22 | source: napkin + coordination-watcher-canonicalisation plan |
graduation-target: plan execution + reference README + rule or absorption |
trigger: second instance fired; plan-execution-gated | status: pending |
size: L]`

**Curation note 2026-05-23 (Breezy Cresting Beacon)**: corrected from `due` to
`pending`, because the entry's own graduation condition is plan execution and
`.agent/plans/agent-tooling/future/coordination-watcher-canonicalisation.plan.md`
is still `status: future`.

The SKILL invocation example for the comms watcher (at
`.agent/skills/start-right-team/SKILL-CANONICAL.md:139` with
`<agent-codename>.json` extension) is the only documentation surface that carries
a complete watch invocation. Today two distinct agents in the same session hit
two facets of the same defect class: Blustery's missing-seen-file backfill flood
(file did not exist when the CLI expected it) and Shaded's wrong-format-seen-file
backfill flood (file existed but in JSON instead of the plain-text-one-id-per-line
shape the CLI's `cli-runtime.ts:130-142` requires). Both stem from the SKILL
example carrying authority it cannot durably hold — there is no mechanism that
prevents drift between the example, the README at `agent-tools/README.md:348`
(which uses `.txt`), and the CLI source.

The structural cure has three layers, captured in
`.agent/plans/agent-tooling/future/coordination-watcher-canonicalisation.plan.md`:

- (a) move the canonical home out of `.agent/reference/` (which is for external
  materials we consult) to code-adjacent
  (`agent-tools/src/collaboration-state/README.md`);
- (b) introduce an executable `coord how-to-start` CLI that emits the canonical
  invocation parameterised by identity, so the SKILL stops carrying an example
  and points at a command that cannot drift;
- (c) extend watcher scope from comms-only to multi-surface (active-claims,
  conversations, escalations, handoffs) so the ad-hoc `/loop` polyfill can
  shrink to its proper role (agent-reasoning ticks, not surface-sweep).

The doctrine substance for graduation is broader than just the watcher cure:
**canonical tool definitions belong code-adjacent, ideally executable;
`.agent/reference/` is for external materials only**. The graduation lands when
the plan executes; the plan body records the doctrine inline so it persists if
the plan archives.

Processed 2026-05-24 by Sylvan Sprouting Petal under claim
`b8ba3f00-f905-4c45-89db-8f86dd38ebd3` after verifying the durable home:
`.agent/plans/agent-tooling/future/coordination-watcher-canonicalisation.plan.md`.
The future plan carries the worked instances, design principles, phases,
acceptance criteria, migration path, and activation trigger. No rule or README
was opened here because the plan-execution trigger remains live in the future
plan.

### Identity-seed precondition error message in CLI

Original live-shard body:

`[captured: 2026-05-21 | source: reviewer-finding+code-expert | target: code:agent-tools/src/collaboration-state/identity.ts | trigger: owner-direction | size: S | status: pending]`

The `agent-tools` comms `watch` and `inbox` commands require one of
`PRACTICE_AGENT_SESSION_ID_CLAUDE` / `PRACTICE_AGENT_SESSION_ID_CURSOR` /
`PRACTICE_AGENT_SESSION_ID_CODEX` / `CODEX_THREAD_ID` to be set in the shell.
When unset, `deriveCollaborationIdentity` throws the generic message
`"missing collaboration identity seed; set a Practice session id or CODEX_THREAD_ID"`.
The `start-right-team` SKILL §0 documents this precondition as skill-side prose,
but the prose duplicates what the error message itself could carry. Candidate
refinement: extend the error message to enumerate the specific env vars expected
per platform, and (optionally) detect a probable-platform from the shell context
to make the message platform-specific. Trigger: owner direction to land the
CLI-side fix. Size S — single function edit + unit test. Routing this through
pending-graduations rather than a commit-message follow-up note per owner
direction 2026-05-21: forward-action notes do not live in commit messages.

Processed 2026-05-24 by Sylvan Sprouting Petal under claim
`5b0dbb3f-d5d2-487f-bd6f-59eaa2e51f6d` after landing the CLI-side fix in
`agent-tools/src/collaboration-state/identity.ts` and coverage in
`agent-tools/tests/collaboration-state/identity.unit.test.ts`. The error now
enumerates `PRACTICE_AGENT_SESSION_ID_CLAUDE`,
`PRACTICE_AGENT_SESSION_ID_CURSOR`, `PRACTICE_AGENT_SESSION_ID_CODEX`, and
`CODEX_THREAD_ID`, with a platform-specific primary-seed hint for known
platforms. Focused Vitest, Prettier, and ESLint checks passed before the live
body was removed from the active shard.

### Value-proxy-independence discipline for measurement tools

Original live-shard body:

`(rule or PDR candidate)`

`(Sylvan Budding Forest — 2026-05-14 consolidation pass; first instance:
Luminous Glowing Moon context-cost-cli.plan.md acceptance lane caught by
assumptions-expert readiness review).`

`[captured: 2026-05-14 | source:
napkin-archive/napkin-2026-05-14.md+distilled.md | target:
rule:value-proxy-independence-discipline OR pdr:value-proxy-independence |
trigger: second-instance | size: S | status: pending]`

Acceptance value-proxies for a measurement tool MUST compare against an
independent ground-truth measure, not against a method-equivalent historical
artefact. Initial draft pinned `acc-cli-baseline-parity` as reproducing the
`~42,125 tokens` baseline `±5%`; that baseline was itself produced by chars/4
over an older fileset, so the new chars/4 CLI agreeing with it ±5% proves
nothing and may fail under normal file churn. Reviewer reframed as
`acc-cli-live-parity` against `wc -c` in the same shell session
(method-independent ground truth; the chars/4 division is then mechanical).
The pattern shape is *"a proxy that reproduces a method-equivalent baseline is
tautological; only a method-independent comparand validates the tool."*
Reinforces but extends `jc-plan` proof-contract requirements
(outcome-not-activity acceptance, generally). First instance only. Trigger:
second observed instance, OR an owner-direction decision to land the discipline
ahead of corroboration. Promotion target in preference order: (1) new rule
`.agent/rules/value-proxy-independence-discipline.md` operationalising the
pattern as a plan-author check; (2) amendment to
`plan-body-first-principles-check.md` adding tautological-baseline as a named
first-principles failure mode; (3) new PDR if the pattern proves cross-ecosystem
at N≥2.

Processed 2026-05-24 by Shaded Silencing Dusk under claim
`34ce7349-8bfd-4095-bd7e-184996af4872` after verifying durable homes:
`docs/engineering/testing-patterns.md` § Acceptance Value-Proxies and
`.agent/directives/testing-strategy.md` § Acceptance Value-Proxies. No new rule
or PDR was opened because the testing governance docs now carry the behavioural
requirement and worked cure; the prior `distilled.md` duplicate was already
graduated.
