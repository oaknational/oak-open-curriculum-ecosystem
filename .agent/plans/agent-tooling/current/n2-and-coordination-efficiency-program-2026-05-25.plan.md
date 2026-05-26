---
name: "Coordination Efficiency Program — Remaining Work"
overview: >
  Three remaining items after the 2026-05-26 enforcement bundle landed:
  rule corpus and SKILL topology refinement (WS0); identity routing-tuple
  disambiguation by session_id_prefix (WS1); SKILL cross-references for
  the three landed rules (WS4). Linear sequence. No parallel tracks. No
  follow-on sessions. Plan archives to completed/ when all three workstreams
  meet acceptance.
todos:
  - id: ws0-rule-corpus-and-skill-topology
    content: "WS0 — Extract start-right-team SKILL §0 + §0.5 into dedicated rule files; author rule-vs-PDR-clause decision rule; classify all rules as always-on vs trigger-loaded in RULES_INDEX.md; add mode-selection front-matter block to SKILL top. Acceptance: combined line count of SKILL + all .agent/rules/*.md DECREASES from a captured WS0-start baseline; validation test asserts every rule appears in RULES_INDEX with classification; four reviewers (Fred + Betty + docs-adr-expert + assumptions-expert) returned with no MUST-FIX outstanding; pnpm check green; single commit landed and pushed."
    status: pending
  - id: ws1-identity-routing-by-session-id-prefix
    content: "WS1 — Widen NarrativeCommsEvent schema fields addressed_to and audience from agent_name string to tuple {agent_name; session_id_prefix}; update comms-relevant-events.ts routing to use session_id_prefix as primary discriminator; permanent compat shim accepts legacy string form on read with collision warning. Acceptance: collision regression test passes (two events same agent_name different session_id_prefix correctly disambiguated); legacy string-form events still readable; three reviewers (code-expert + type-expert + test-expert) returned with no MUST-FIX outstanding; pnpm check green; single commit landed and pushed."
    status: pending
  - id: ws4-skill-cross-references-for-landed-rules
    content: "WS4 — Add three markdown links to start-right-team SKILL: §1 retirement-detection links to ping-before-escalate.md; §0 (thin pointer post-WS0) links to comms-all-channels-watcher.md; §0.5 (thin pointer post-WS0) links to liveness-heartbeat-cron.md. Acceptance: three links present; markdownlint clean; docs-adr-expert returned with no MUST-FIX outstanding; pnpm check green; single commit landed and pushed."
    status: pending
isProject: false
---

# Coordination Efficiency Program — Remaining Work

**Last updated**: 2026-05-26
**Status**: DECISION-COMPLETE for execution. Three remaining items, linear order, no follow-on sessions.
**Collection**: `agent-tooling/current/`
**Thread**: `agentic-engineering-enhancements`
**Authored**: Mistbound Passing Candle (claude / `e77243`) 2026-05-25
**Rewritten to scope down**: Feathered Winging Cliff (claude / `57e615`) 2026-05-26

## End goal

Lower per-session doctrine-load cost AND structurally cure the agent-name routing-tuple collision class. Three workstreams; each ships one structural cure; each lands as a single atomic commit.

## Mechanism

WS0 reduces total directive-load surface (SKILL + rules combined line count) while introducing structural classification (always-on vs trigger-loaded) and a rule-vs-PDR-clause decision rule. WS1 widens the comms-event schema so routing keys on the unique discriminator (`session_id_prefix`) rather than the non-unique display field (`agent_name`). WS4 makes the rules WS0 extracts discoverable from the SKILL where they fire.

## Predecessor work — minimal pointers

- WS0 SKILL decomposition shape was directed (verdict (c)+partial(a)) at commit `04d5cefa` 2026-05-25: extract `start-right-team` SKILL §0 (Comms watcher) and §0.5 (Liveness heartbeat) into dedicated rule files; keep a short mode-selection front-matter block at the SKILL top. This plan executes that verdict; do not re-litigate.
- WS4 cross-reference target B3 rule landed at commit `29ebda41` 2026-05-26: `.agent/rules/ping-before-escalate.md`. The other two WS4 targets are the rule files WS0 creates.
- Substrate authority for the rule-vs-PDR-clause decision rule: PDR-026 (falsifiability discipline) for new PDR lifecycle; existing `.agent/rules/` patterns for always-applied operational invariants.
- Falsifiability discipline anchor: PDR-026. Acceptance discipline anchor: `principles.md` "Architectural Excellence Over Expediency" + memory `feedback_pre_pose_option_viability_check` (LTAE-screen + verdict-not-menu).

## WS0 — Rule corpus and SKILL topology refinement

**Goal**: refactor rule corpus + SKILL surface so doctrine additions cost less per session.

**Substance** (decision-complete, no remaining choices):

1. Capture baseline metrics in the WS0 commit message body:
   - `WS0_BASELINE_SKILL_LINES = wc -l .agent/skills/start-right-team/SKILL-CANONICAL.md`
   - `WS0_BASELINE_RULES_LINES = wc -l .agent/rules/*.md | tail -1`
   - `WS0_BASELINE_COMBINED = WS0_BASELINE_SKILL_LINES + WS0_BASELINE_RULES_LINES`
2. Author `.agent/rules/new-rule-vs-pdr-clause.md` — the meta-rule defining when substance becomes a new rule vs a clause in an existing PDR vs a new PDR. Classification: `always-on` (applied at every doctrine-authoring moment).
3. Author `.agent/rules/comms-all-channels-watcher.md` — content extracted from `start-right-team` SKILL §0 (lines 127–272). Classification: `trigger-loaded`; firing trigger: "team session bootstrap".
4. Author `.agent/rules/liveness-heartbeat-cron.md` — content extracted from `start-right-team` SKILL §0.5 (lines 274–~430). Classification: `trigger-loaded`; firing trigger: "team session bootstrap".
5. Thin `start-right-team` SKILL §0 and §0.5 to pointer paragraphs: heading + 1–2 sentence rationale + markdown link to the extracted rule. Remove the verbose content (already present in the rule file).
6. Add mode-selection front-matter block at SKILL top (immediately after the YAML frontmatter and before §"Goal"). Compact routing surface naming SKILL modes: sole-contributor / team-closeout-owner / team-member-non-closeout-owner.
7. Update `RULES_INDEX.md` to add a two-tier table classifying each canonical rule under `.agent/rules/*.md` as `always-on` or `trigger-loaded`; trigger-loaded rules name their firing trigger as a short prose phrase in an adjacent column.
8. Author a validation test in `agent-tools/tests/rules/rules-index-classification.unit.test.ts` that asserts every file under `.agent/rules/*.md` appears in `RULES_INDEX.md` with a classification value of `always-on` or `trigger-loaded`. Test runs in `pnpm check` gate chain.
9. Dispatch four reviewers in parallel (sonnet, single message multi-Agent block): architecture-expert-fred (ADR compliance: ADR-119 three-layer, ADR-125 portability, ADR-150 continuity surfaces); architecture-expert-betty (cohesion of new topology + change-cost analysis); docs-adr-expert (rule/PDR/SKILL home decisions + decision-rule shape); assumptions-expert (proportionality of corpus-wide audit + classification criteria viability + acceptance-bar legitimacy).
10. Apply all reviewer findings before staging.
11. Stage by explicit pathspec; run `pnpm check`; commit; push.

**Files modified**:

- `.agent/skills/start-right-team/SKILL-CANONICAL.md` (thin §0 + §0.5; add mode-selection block at top)
- `.agent/rules/new-rule-vs-pdr-clause.md` (new)
- `.agent/rules/comms-all-channels-watcher.md` (new)
- `.agent/rules/liveness-heartbeat-cron.md` (new)
- `RULES_INDEX.md` (two-tier classification table)
- `.claude/rules/new-rule-vs-pdr-clause.md` + `.claude/rules/comms-all-channels-watcher.md` + `.claude/rules/liveness-heartbeat-cron.md` (one-line Claude forwarders)
- `.cursor/rules/new-rule-vs-pdr-clause.mdc` + `.cursor/rules/comms-all-channels-watcher.mdc` + `.cursor/rules/liveness-heartbeat-cron.mdc` (Cursor forwarders with `alwaysApply: true` frontmatter)
- `agent-tools/tests/rules/rules-index-classification.unit.test.ts` (new validation test)

**Acceptance (testable, all must hold)**:

- All three new rule files exist with the platform forwarders (`.claude/rules/` + `.cursor/rules/`) and `RULES_INDEX.md` entries.
- `start-right-team` SKILL line count ≤ 700 (down from 973 baseline; ≥273-line reduction).
- Combined `wc -l .agent/skills/start-right-team/SKILL-CANONICAL.md .agent/rules/*.md | tail -1` at completion < `WS0_BASELINE_COMBINED` captured in step 1.
- `RULES_INDEX.md` two-tier table covers every file under `.agent/rules/*.md` (no missing entries; no entries for non-existent files).
- Validation test passes in `pnpm check`.
- All four reviewers returned with no outstanding MUST-FIX findings.
- `pnpm check` green at the staged commit.
- Single commit landed at HEAD and pushed to origin. Commit subject: `refactor(rules): WS0 — corpus topology and SKILL extraction (start-right-team §0 + §0.5)`.

## WS1 — Identity routing-tuple disambiguation

**Goal**: structural cure for `agent_name` collision across sessions; route comms-event recipient matching by the unique `session_id_prefix` discriminator.

**Substance** (decision-complete):

1. Widen schema fields in `agent-tools/src/collaboration-state/types.ts` (currently at lines 142–143):
   - `addressed_to?: string` → `addressed_to?: { agent_name: string; session_id_prefix: string }`
   - `audience?: readonly string[]` → `audience?: readonly { agent_name: string; session_id_prefix: string }[]`
2. Update routing logic in `agent-tools/src/collaboration-state/comms-relevant-events.ts`:
   - `isSelfAuthored()` line 120: primary match by `session_id_prefix` (agent_name + platform retained in tuple for display, not as a comparator).
   - `classifyDirected()` line 129: same shape; match recipient tuple by `session_id_prefix`.
   - `classifyNarrative()` lines 137, 140: `addressed_to` and `audience` are now tuples; compare by `session_id_prefix` field.
3. Permanent legacy compat shim for read-side: when `addressed_to` or `audience` element is a string (legacy form, no prefix recorded), match by `agent_name` and emit a `behaviour-note`-tagged warning to stderr naming the colliding session_id_prefixes if more than one active claim resolves. Write-side emits tuple form only — type system rejects strings.
4. Author collision regression test in `agent-tools/tests/collaboration-state/comms-relevant-events-collision.unit.test.ts`:
   - Setup: two synthetic events with same `agent_name`, different `session_id_prefix`, both addressed via tuple form.
   - Assert: `classifyDirected` correctly attributes each event to its session_id_prefix recipient.
   - Assert: `classifyNarrative` correctly matches `addressed_to` and `audience` against each session.
   - Assert: legacy string-form `addressed_to: "SomeName"` matches by `agent_name` AND emits the collision warning to stderr when multiple session_id_prefixes share the name.
5. Audit `agent-tools/src/collaboration-state/identity.ts:53` (`validateSharedStateAgentId`) and `agent-tools/src/collaboration-state/identity-audit.ts:225` (`isAnonymousCodexAgent`): both currently use `agent_name === 'Codex'` as part of anonymous-agent detection. Change to primary-discriminator `session_id_prefix === 'unknown'`; retain `agent_name === 'Codex'` only as a secondary disambiguator. Document in inline comment why anonymous detection cannot rely on agent_name alone.
6. Dispatch three reviewers in parallel (sonnet): code-expert (gateway review, identifies further specialists; verifies all schema consumers updated); type-expert (CLI option types + identity tuple shape consistency); test-expert (TDD discipline, collision test atomic-landing, no mocks of global state).
7. Apply all reviewer findings before staging.
8. Stage by explicit pathspec; run `pnpm check`; commit; push.

**Files modified**:

- `agent-tools/src/collaboration-state/types.ts` (schema widening)
- `agent-tools/src/collaboration-state/comms-relevant-events.ts` (routing logic + legacy compat)
- `agent-tools/src/collaboration-state/identity.ts` (anonymous-detection primary discriminator)
- `agent-tools/src/collaboration-state/identity-audit.ts` (same)
- `agent-tools/tests/collaboration-state/comms-relevant-events-collision.unit.test.ts` (new)
- Any consumer of `NarrativeCommsEvent.addressed_to` or `.audience` (audit during execution; type system surfaces consumers via compile error)

**Acceptance (testable, all must hold)**:

- Schema fields `addressed_to` and `audience` are tuple-typed in `NarrativeCommsEvent`.
- Collision regression test exists and passes.
- Legacy string-form events still readable; collision warning fires on ambiguous `agent_name`-only resolution against multiple active session_id_prefixes.
- All existing `agent-tools` tests pass (no regressions); compile errors at write-sites have been resolved (every event emitter constructs tuples).
- Three reviewers returned with no outstanding MUST-FIX findings.
- `pnpm check` green at the staged commit.
- Single commit landed at HEAD and pushed to origin. Commit subject: `refactor(agent-tools): WS1 — comms routing by session_id_prefix (collision cure)`.

## WS4 — SKILL cross-references for landed rules

**Goal**: visibility of three landed rules from `start-right-team` SKILL where they are operationally invoked.

**Substance** (decision-complete):

1. Open `.agent/skills/start-right-team/SKILL-CANONICAL.md`.
2. In §1 "Register Presence" — at the paragraph naming retirement-detection broadcasts (singleton-lane coordination rule context or wherever the SKILL currently references retirement-detection), add a markdown link to `.agent/rules/ping-before-escalate.md`.
3. In §0 (now a thin pointer paragraph after WS0), confirm the markdown link to `.agent/rules/comms-all-channels-watcher.md` is present; if WS0 already added it, WS4 is a no-op for §0.
4. In §0.5 (now a thin pointer paragraph after WS0), same: confirm the link to `.agent/rules/liveness-heartbeat-cron.md`.
5. If WS0 already added §0 and §0.5 cross-references during its extraction step, WS4 reduces to step 2 only — the §1 retirement-detection link to `ping-before-escalate.md`.
6. Dispatch one reviewer (sonnet): docs-adr-expert (link correctness + section coherence post-WS0).
7. Apply findings.
8. Stage by explicit pathspec; run `pnpm check`; commit; push.

**Files modified**:

- `.agent/skills/start-right-team/SKILL-CANONICAL.md`

**Acceptance (testable, all must hold)**:

- §1 retirement-detection paragraph contains a markdown link to `.agent/rules/ping-before-escalate.md`.
- §0 (thin) contains a markdown link to `.agent/rules/comms-all-channels-watcher.md`.
- §0.5 (thin) contains a markdown link to `.agent/rules/liveness-heartbeat-cron.md`.
- `markdownlint .agent/skills/start-right-team/SKILL-CANONICAL.md` clean.
- docs-adr-expert returned with no outstanding MUST-FIX findings.
- `pnpm check` green at the staged commit.
- Single commit landed at HEAD and pushed to origin. Commit subject: `docs(skill): WS4 — start-right-team cross-references for B3 + WS0 extracted rules`.

## Program-level definition of done

The plan is complete when ALL of the following hold simultaneously:

- WS0 commit on origin/`docs/agent-collaboration-enhancements` (or the active branch at execution time).
- WS1 commit on origin/same branch.
- WS4 commit on origin/same branch.
- `pnpm check` green at each commit.
- Plan archived to `.agent/plans/agent-tooling/archive/completed/` per ADR-117.
- Closeout per session-handoff SKILL §1–8.

No partial-complete state is acceptable. If any reviewer flags MUST-FIX, apply the fix before the commit lands. If `pnpm check` is red, cure before commit; no `--no-verify` without fresh owner authorisation per individual commit per `no-verify-requires-fresh-authorisation`.

## Standing constraints

- Architectural excellence over expediency per `principles.md`. Cheap-cure framings are categorically excluded.
- LTAE-screen every decision; verdict-not-menu before any AskUserQuestion (per `feedback_pre_pose_option_viability_check` and `present-verdicts-not-menus.md` rule).
- All quality gates blocking, always.
- Stage by explicit pathspec; never `git add -A` or `git add .`.
- No `--no-verify` without fresh owner authorisation per individual commit.
- TDD: tests + product code atomic landing per workstream.
- Tests never read or write process.env; pass explicit literal inputs.
- Never use git to remove work.
- Apply all reviewer findings before commit.
- Use only built agent-tools CLI; never raw source invocations.
- Mid-cycle compaction: use PDR-063 handoff; continuation resumes the SAME plan post-compaction; the plan is not "follow-on session invention" because the work-unit is one cycle that may span compactions.

## Risks

| Risk | Mitigation |
|---|---|
| WS0 line-count acceptance bar misses load-cost reality (e.g., one massive rule file outweighs many small ones) | Reviewer dispatch (Betty cohesion + assumptions-expert proportionality) reviews the acceptance bar before any rule retirement happens. If reviewers flag the bar as wrong, surface to owner for direction before applying. |
| WS1 legacy compat shim hides real collisions in production data | Collision warning emits to stderr on every ambiguous resolution; if warnings fire at noticeable rate, surface to owner for migration plan. Permanent shim is acceptable; silent ambiguity is not. |
| WS4 cross-reference links break if WS0 changes filenames | WS4 runs AFTER WS0; the link targets are fixed by WS0's authoring step. WS4 verifies file existence before adding link. |
| Mid-execution compaction triggers PDR-063 handoff and continuation drifts | Handoff record captures the four PDR-063 sections at retirement; continuation reads the record before any source edit. Standing constraint above. |
| Reviewer dispatch returns MUST-FIX findings that re-open architectural decisions made in this plan | Reviewer brief explicitly states "execution legitimacy only; this plan's verdicts are owner-ratified". If a reviewer finds a genuine architectural error in this plan's verdicts, surface to owner for direction; do not re-litigate inside the workstream. |

## Lifecycle triggers

- WS0 opens first; WS1 opens after WS0 lands; WS4 opens after WS1 lands.
- This plan archives to `archive/completed/` immediately after WS4 lands.
- No future-plan trigger; the program ends with this plan's archival.

## Revision history

- 2026-05-25 — Plan authored decision-complete first-draft by Mistbound Passing Candle (claude / `e77243`). Original scope WS0–WS11.
- 2026-05-26 — Bundle execution by Feathered Winging Cliff + Torrid Firing Spark. A1 + E1 + B1 + B3 + E2 + B2 + E3 + owner consolidation + late polish + closeout commit shipped to origin (8 commits + 2 follow-on). Plan amendment captured the bundle execution outcome.
- 2026-05-26 — Owner audit surfaced two corrections: decorative "Cycle 1/Cycle 2" framing was unratified follow-on-session invention; plan body bloated with retrospective content already routed to other surfaces. Rewritten by Feathered Winging Cliff (claude / `57e615`) to contain only the three remaining items (WS0, WS1 #4, WS4 SKILL cross-references), decision-complete, linear, no follow-on session invention. Completed work routed to permanent homes per consolidate-docs scoped pass. Cycle-2 invention mistake captured in `napkin.md` and per-user memory `feedback_no_unauthorised_scope_invention_in_plans`.
