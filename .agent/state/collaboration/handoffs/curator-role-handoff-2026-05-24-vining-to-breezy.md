# Breezy Deep Curation Survey — 2026-05-24

**Sub-agent**: Breezy (dispatched by Vining Fruiting Dew on the active curator-pass session at `5149c2`).
**Pass kind**: Survey + Identify + Route (read-only intermediate working artefact).
**Doctrine reference**: PDR-081 (curator role); `curator-pass` SKILL; PDR-072 (curation as autonomic output); PDR-067 (surface classification); PDR-014 (capture→distil→graduate→enforce).
**Owner direction binding this pass**: *"They are not to worry about fitness limits while doing this, knowledge curation matters, numerical limits are secondary signals."*

This document is a working artefact for Vining. It is allowed to be substantial because it carries substance for the downstream metadata-only curator-pass log to point at. It is **not** itself the per-pass log file.

---

## 1. Surfaces Surveyed

| Surface | Depth | Disposition note |
|---|---|---|
| `.agent/practice-core/decision-records/PDR-081-curator-role-and-substrate-care-lane.md` | full | Doctrine; ratified workflow basis |
| `.agent/skills/curator-pass/SKILL-CANONICAL.md` | full | Workflow contract |
| `.agent/memory/operational/curator-passes/README.md` | full | Metadata-only contract |
| `.agent/memory/operational/curator-passes/2026-05-24-vining-fruiting-dew.md` | full | Prior pass; absorbed routed-knowledge list |
| `.agent/memory/active/distilled.md` | full (925 lines) | Healthy after recent rotations; carries clear graduation-target pointers |
| `.agent/memory/active/napkin.md` (2324 lines) | full of recent (2026-05-23 / 2026-05-24) + sampled middle | 30+ session entries; recent half (~2026-05-23 onward) carries explicit Candidates Surfaced blocks |
| `.agent/memory/operational/pending-graduations.md` (4657 lines) | head + index + headers sampled | Heavily curated 2026-05-22 / 2026-05-23 / 2026-05-24; live working queue + structural debt outlined below |
| `.agent/plans/**/current/*.plan.md` (~111 files) | enumerated; full read of `practice-infrastructure-hardening-program.plan.md` (R1.5; 2026-05-24) | Sampled others; structural notes on archive shape |
| `.agent/plans/**/active/*.plan.md` (~19 files) | enumerated | No status-frontmatter; structural defect noted |
| `.agent/plans/**/future/*.plan.md` (~97 files) | enumerated | Sampled |
| `.agent/plans/archive/completed/*.plan.md` | enumerated; spot-read `type-remediation.plan.md` | Healthy; substance archived |
| `~/.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/MEMORY.md` | full (index) | 88 entries; many marked graduated audit-trail |
| Claude per-user feedback memories | sampled ~15 substantive entries | Substantive un-graduated principle-class entries identified below |
| `.remember/now.md` | full | **Currently clean** (1000 bytes; 6 lines waypoint summary). Vining's earlier contamination-report `7e6dcba3` is real but the buffer has rotated since |
| `.remember/recent.md` | full | Clean; 8 IDENTITY CANDIDATE rows already graduated 2026-05-22 to distilled.md |
| `.remember/archive.md` | full | Clean; weekly summaries |
| `.remember/today-2026-05-24.md` | full | **CONTAMINATED lines 9–21** (Claude prose, contamination Vining flagged) |
| `.remember/today-2026-05-22.done.md` | full | **CONTAMINATED line 17** (Claude prose; smaller instance of same defect) |
| `.remember/today-2026-05-23.done.md` (144 lines) | sampled (first 50 lines) | Clean in sample; full structural inspection deferred |
| `.remember/today-*.done.md` 2026-04-24 → 2026-05-15 | line counts + grep scan | Clean; no contamination markers found |
| `.remember/logs/memory-2026-05-24.log` | sampled | Found `[ndc] ERROR: produced empty result` at 10:09:39 — direct evidence of the contamination-write failure mode |

---

## 2. Durable Knowledge Ready for Routing

Entries in this list have substance-stable + trigger-fired (or owner-direction-clearable) + a clear permanent home. Each is a routing event Vining can ratify with the owner.

### 2.1 — Important state not in temp files → new rule

- **Title**: `important-state-not-in-temp-files`
- **Source**: `.agent/memory/active/napkin.md` lines 2284–2298 (Ferny Capture D, 2026-05-24)
- **Substance**: Owner-stated rule (direct quote): *"important state and context must never be left in a temp file long-term, using it as a buffer is fine, but leaving it there for reference is not okay, everything of importance stays in the repo"*. Distinction: `/tmp/` as compose-buffer (write → emit/commit → done) is correct; `/tmp/` as durable-reference (a `.agent/` surface pointing at `/tmp/` for ongoing substrate) is the violation.
- **Proposed home**: new rule `.agent/rules/important-state-not-in-temp-files.md` (+ `.claude/`, `.cursor/` adapters + RULES_INDEX entry). Composes with existing `.agent/rules/no-machine-local-paths.md`.
- **Trigger**: **owner-direction (fired 2026-05-24)** + worked-instance (Ferny's `/tmp/ferny-ws8-reviewer-synthesis-window2.md` violation, self-cured this turn). Memory entry already exists at `feedback_*` level (per MEMORY.md mention: "Ferny Capture D — important-state-not-in-temp-files rule capture"); routing is rule-graduation.
- **Note**: This is already the subject of the most recent commits (`e25b4f5b`, `bba7c914` per session-open git log) — looks **partially graduated** as memory entry; rule-layer graduation is the pending move.

### 2.2 — Director-pure-direction-only → PDR (principle-class)

- **Title**: `director-pure-direction-only` graduation
- **Source**: `~/.claude/projects/.../memory/feedback_director_pure_direction_only.md`
- **Substance**: Multi-paragraph principle articulating the two-mode awareness (broad / focused) co-existence that makes a multi-agent team a recursive cognition substrate. Owner-stated 2026-05-23: *"your awareness is broad, their awareness is focussed, we need both and we need them to co-exist, the director only role is the load bearing mechanism enabling that."*
- **Proposed home**: new PDR — `pdr_kind: governance` — codifying the structural property. Composes/cross-references PDR-074 (Director value), PDR-075 (substrate-writing discipline), PDR-072 (curation-as-autonomic-output), PDR-046 (layered knowledge processing).
- **Trigger**: owner-direction (received and explicit). The entry is already cross-referenced as `[[feedback_director_pure_direction_only]]` by sibling memories — wiki-link adoption is evidence of internal-substrate consumption. Worked instance evidence in napkin Velvet entry (2026-05-23 lines 270–280: "Director-pure-direction discipline holds clean").
- **Note**: Currently a per-user-memory feedback; PDR-067 makes platform-specific per-user memory a buffer, not a personal store. The substance has cross-platform value.

### 2.3 — Long-term architectural excellence is always the answer → PDR or principles.md amendment

- **Title**: `long-term-architectural-excellence-is-always-the-answer`
- **Source**: `~/.claude/projects/.../memory/feedback_long_term_architectural_excellence_is_always_the_answer.md`
- **Substance**: Owner-stated overriding decision principle (2026-05-22): *"what does long-term architectural excellence look like here?"* is the ALWAYS question; cheap/fast/short-term framings are categorically excluded. Corollary: do not throw away prior edits. Composes with `feedback_no_cheap_cure_option` and `feedback_question_shape_known_bad_vs_adopt`.
- **Proposed home**: amendment to `docs/governance/principles.md` § Code Quality (or new principle), OR a new PDR if the structural-property layer is the right home. **Ambiguity flagged**: principle-class doctrine that is decision-shape-meta might be better in PDR (portable) than principles.md (repo-rooted). Vining/owner adjudicates.
- **Trigger**: owner-direction (fired). Already first-on-the-list in MEMORY.md, indicating it's the apex per-user-memory entry.

### 2.4 — Owner action is not a cure → PDR

- **Title**: `owner-action-is-not-a-cure`
- **Source**: `~/.claude/projects/.../memory/feedback_owner_action_is_not_a_cure.md`
- **Substance**: Every "owner-directed X worked" observation names a missing autonomy primitive, never a target cure shape. End goal is agent autonomy; owner intervention is stopgap. Owner-stated; densely cross-referenced by sibling memories.
- **Proposed home**: new PDR (structural-property cluster with PDR-074 / PDR-081 / `director-pure-direction-only`). Aligned with autonomy-primitives substrate being developed in PDR-074 §Five Autonomy Primitives.
- **Trigger**: owner-direction (fired) + N≥3 in-session uses of this lens (Velvet 2026-05-23 "Owner-action-is-not-a-cure guardrail"; Scorched window observations; Mistbound observations).

### 2.5 — No question when the answer is forced → PDR or rule

- **Title**: `no-question-when-answer-is-forced`
- **Source**: `~/.claude/projects/.../memory/feedback_no_question_when_answer_is_forced.md`
- **Substance**: When architectural-excellence + surface-function analysis leaves only one defensible option, do not surface as multiple-choice question; direct the move. Owner-stated 2026-05-23. Composes with `present-verdicts-not-menus` rule (already landed).
- **Proposed home**: existing rule `.agent/rules/present-verdicts-not-menus.md` amendment (add "no question when answer is forced" clause), OR new sibling rule. The latter is cleaner; the former preserves rule cohesion.
- **Trigger**: owner-direction (fired).

### 2.6 — Verification-discipline correction substrate ("don't trust, verify") → rule

- **Title**: `verify-dont-trust` (Director primitive)
- **Source**: `.agent/memory/active/napkin.md` lines 169–171 (Scorched 2026-05-23) + 189 (graduation candidate explicitly captured)
- **Substance**: "Don't trust, verify" is a deeper Director primitive than collapsed into "pure direction only". Verification asks demand concrete artefacts (subagent transcript ids, claim openings, file paths) NOT just status confirmations. Silence after concrete-artefact ask is stronger evidence than silence after generic status check.
- **Proposed home**: new rule `.agent/rules/verify-dont-trust.md` OR `start-right-team` SKILL §"Active per-agent check-in" amendment. Pattern-class also defensible.
- **Trigger**: 2nd-instance evidence — the substrate-pointer-pattern v2 already documents this failure mode at multiple sites (D1–D6, 15 instances by 2026-05-24); pattern v2 is the substantive substrate. Promotion of the cure-shape (verification-discipline) is the routing move. Owner-correction at ~15:03Z 2026-05-23 is the explicit owner-direction signal.

### 2.7 — Reviewer-pass + critical-analysis loop cures trust-without-reverification → pattern

- **Title**: `reviewer-pass-cures-trust-without-reverification`
- **Source**: `.agent/memory/active/napkin.md` lines 26–27, 44 (Lanternlit Listening Dusk, 2026-05-24)
- **Substance**: Dispatching dual-reviewer pass + critical-analysis loop on single-author substrate catches authoring-time failure modes (trust-without-reverification). Worked instance: docs-adr-expert + code-expert returned 21 findings on R1.2; critical-analysis verified 3 highest-stakes findings before absorbing.
- **Proposed home**: pattern file at `.agent/memory/active/patterns/reviewer-pass-cures-trust-without-reverification.md` OR amendment to existing `substrate-pointer-read-as-current-state.md` pattern (add cure-shape section).
- **Trigger**: 2nd worked instance — currently 1 (Lanternlit's R1.2 pass). **NOT yet ready**; capture-only until 2nd instance fires.

### 2.8 — Marshal-as-cycle-discipline throughput substrate → pattern (2nd instance now in)

- **Title**: `marshal-as-cycle-discipline`
- **Source**: `.agent/memory/active/napkin.md` lines 161–163 (Scorched 2026-05-23) + 187 (capture) + program plan WS-6 (PDR-077 DRAFT live in /tmp)
- **Substance**: Active-Director discipline + Ashen's commit-marshal role with armed monitors produced 9 marshal-class cycles + 1 Class A wrapper in single 58-min Director window. Cross-session evidence: Mistbound's 4-commit marshal arc (~14 min for 4 cycles by git timestamps) is the 2nd worked instance.
- **Proposed home**: PDR-077 (currently DRAFT-in-/tmp authored by Charcoal; needs scrubbing for `/tmp` violation per §2.1 above before landing) OR pattern file `.agent/memory/active/patterns/marshal-as-cycle-discipline.md`.
- **Trigger**: 2nd cross-session worked instance now in evidence (program plan WS-6 status: "SECOND worked instance of marshal-as-cycle-discipline in evidence: Mistbound's 4-commit marshal arc"). Ready for routing.
- **Coordination note**: PDR-077 is owned by Charcoal under active claim; route to Charcoal for first-author rights, not for redirection.

### 2.9 — PDR-075 substrate-writing discipline empirical validation (7+ instances) → PDR-075 status promotion

- **Title**: PDR-075 promotion from Candidate to Proposed
- **Source**: `.agent/memory/active/napkin.md` lines 173–175 (Scorched) + 191 (capture)
- **Substance**: Each consecutive PDR-075-substantive handoff adds to the ratification body. 7+ Director-transition worked instances accumulated (Incandescent→Secret 40-second bootstrap; Velvet window; Scorched window; etc.).
- **Proposed home**: PDR-075 frontmatter status edit from `Candidate` to `Proposed` (already at `b6ac6147`).
- **Trigger**: owner-direction (substance is sufficient for status change; owner ratification needed).

### 2.10 — PDR-vs-ADR portability distinction → PDR-079 (in-flight by Lanternlit)

- **Title**: `pdr-vs-adr-portability-distinction`
- **Source**: napkin lines 25, 43 (Lanternlit 2026-05-24) + program-plan WS-12
- **Substance**: PDRs are portable practice doctrine (no SHAs, no repo-paths, no branch names); ADRs are repo-bound architectural decisions (SHAs welcome). SHA-in-PDR = misclassification signal. Mechanical co-cure: scope `.agent/rules/no-moving-targets-in-permanent-docs.md` strictly to portable surfaces.
- **Proposed home**: PDR-079 (AUTHOR-IN-FLIGHT per program-plan WS-12).
- **Trigger**: owner-direction (received 2026-05-24).
- **Status**: in-flight by another agent (Lanternlit). Coordination, not redirection.

---

## 3. Home-Gaps Surfaced

Mature substance with no obvious permanent home. Each is a structural-cure proposal, not a routing move.

### 3.1 — `/loop` runbook canonical home

- **Substance**: Owner-pasted chat-text artefact that drifts across paste instances. `feedback_loop_runbook_code_expert_after_delivery.md` (graduated to rule 2026-05-22) already names this: *"the /loop runbook is currently a chat-text artefact that drifts between paste instances. It has the same shape as the canonical-tool-definitions-code-adjacent pattern... Capture in pending-graduations as 'canonical /loop runbook belongs in a SKILL or doc, not chat text'."*
- **Gap**: There is no `/loop` SKILL or doc in `.agent/skills/`. The runbook lives as an owner-paste fragment.
- **Cure proposal**: new SKILL `.agent/skills/loop-runbook/SKILL-CANONICAL.md` codifying the cadence/exit-criteria/code-expert-after-delivery loop. References existing rule `.agent/rules/pre-execution-code-expert-review-per-loop-cycle.md` and rule `.agent/rules/loop-exit-criteria-required.md`.
- **Authority**: principle-class change; owner ratification needed.

### 3.2 — Sidebar co-authoring model

- **Substance**: Napkin Lanternlit 2026-05-24 line 28: *"Sidebar co-authoring model worked on first deployment"*. Mistbound deployed sidebar R1.4 (resolving R1.3 Gap 5: parallel-writer coordination). Worked perfectly — clean handoff surface, no contention, polled-and-graceful.
- **Gap**: No PDR / pattern / SKILL describing the sidebar shape (opener with structured questions + deadline + default-action-if-silent). Existing partial cover: `start-right-team` SKILL has "Coordinator Handoff (Two Moments)" section but not sidebar-co-authoring shape; PDR-064 carries the boundary; `agent-collaboration.md` has some material.
- **Cure proposal**: after 2nd worked instance, graduate to PDR or pattern. Currently capture-only.
- **Adjacency**: existing memory `feedback_peer_sidebar_beats_coordinator_helpers.md` covers the choice; the *mechanism* (opener structure + polling) is what lacks a home.

### 3.3 — Comms CLI grounding primitives (`list --tail` + `show <event-id>`)

- **Source**: `project_comms_cli_grounding_gap.md` (Seaworthy 2026-05-23)
- **Substance**: agent-tools `comms` CLI lacks `comms list --tail N [--format summary]` and `comms show <event-id>`. Forces jq/ls fallback at Director-takeover and ad-hoc event reads.
- **Gap**: This is an implementation gap, not a doctrine gap. The right home is an agent-tools plan + implementation, not a PDR.
- **Cure proposal**: new plan at `.agent/plans/agent-tooling/current/comms-cli-grounding-primitives.plan.md` (or amendment to an existing agent-tools plan). Compose with rule `use-built-agent-tools-cli.md` (which presumes the CLI covers needs; this gap is counter-example).
- **Note**: Not principle-class; this is a routing event to the engineering work queue, not a graduation.

### 3.4 — Owner-coordinated team-wide refocus through per-agent compaction prompts

- **Source**: napkin lines 2314–2322 (Mistbound Capture B, 2026-05-24)
- **Substance**: Owner coordinated team-wide focus-sharpening on M1 Safe Pause by individually prompting each agent's pre-compaction with the same shape, rather than a Director broadcast. Worked instance of a routing mechanism orthogonal to Director-broadcast-team-wide-redirection.
- **Gap**: No PDR / pattern / SKILL names this mechanism. PDR-064 (coordinator handoff) covers single-handoff cases; PDR-075 (substrate-writing) covers handoff substrate; the team-wide-refocus mechanism through per-agent compaction is a new shape.
- **Cure proposal**: capture-only at this stage. Trigger condition: 2nd instance of owner-coordinated team-wide refocus. **Watch-list item, not ready.**

### 3.5 — `ndc` (now → daily-compressed) pipeline contamination contract gap

- **Source**: Vining curator broadcast `7e6dcba3` + my findings §5.1 below
- **Substance**: The `.remember/` plugin v0.7.2 `ndc` pipeline (now.md → today-YYYY-MM-DD.md compression) intermittently produces Claude assistant draft prose ("I don't have access to…", "To complete the compression task…", "Once you do, I'll apply…") interspersed with legitimate compressed waypoint summaries. Evidence: `today-2026-05-24.md` lines 9–21, `today-2026-05-22.done.md` line 17, and the `[ndc] ERROR: produced empty result` log entry at 10:09:39 on 2026-05-24.
- **Gap**: This is a write-time contract gap in an external plugin. Curator MAY NOT mutate `.remember/*` directly per owner rule.
- **Cure proposal**: structural-cure proposal to the `.remember/` plugin team (file an upstream issue) — write-time contract should validate output shape (compressed waypoint line format) and reject contaminated outputs; the `[ndc] ERROR: produced empty result` already exists as a contract violation signal — the contamination cases need equivalent detection.
- **Routing**: this is a comms broadcast move; substance lives at this report + Vining's broadcast `7e6dcba3`.

---

## 4. Stale or Superseded Substance (Flag for Archival, Not Deletion)

### 4.1 — `project_priority_sequence.md` (30 days old)

- **Content**: Names "Sentry/OTel release-identifier on feat/otel_sentry_enhancements" as priority #1.
- **Staleness**: System-reminder flags it as 30 days old. Current work surface is M1 Safe Pause on `feat/mcp-graph-support-foundation` per program plan. This entry was relevant on 2026-04-22; it does not describe 2026-05-24 priorities.
- **Routing**: per PDR-067 / `feedback_per_user_memory_is_a_buffer.md`, platform-specific per-user memory is a buffer; the buffer entry has expired its useful window. Archive-flag for owner-directed removal OR refresh.

### 4.2 — `project_l7_and_e_open_questions.md` (34 days old)

- **Content**: L-7 (Sentry release linkage) + userId-on-Sentry-scope open questions.
- **Staleness**: Some sub-questions resolved (Clerk canonical user-ID provider per `project_user_id_clerk_canonical.md`). L-7 open-questions may still be live. System-reminder flags 34 days old.
- **Routing**: partial-stale — needs owner pass to split into "still-open" + "now-closed" rather than archive-all.

### 4.3 — `project_observability_roadmap_2026-05-02.md` (22 days old)

- **Content**: Observability arc on `feat/eef_exploration` branch.
- **Staleness**: Branch `feat/eef_exploration` not the current working branch. Roadmap references "current work" that's no longer current.
- **Routing**: archive-flag or amend with current-branch-pointer.

### 4.4 — `project_memory_feedback_thread_focus.md`

- **Content**: Memory-feedback thread archived 2026-04-22.
- **Staleness**: Self-declared archived; safe to leave as audit-trail. **No action needed.**

### 4.5 — Plans with `status: current` frontmatter but stale substance

- Sample finding: `.agent/plans/architecture-and-infrastructure/current/main-critical-sonar-rebuild-from-updated-main.plan.md` and many others carry `status: current` but the substance may have been superseded by later cycles. **Plans-staleness sweep is a separate curator-pass scope** — too large for this single pass (111 current plans). Flag as carry-forward.

---

## 5. Structural Defects in the Substrate

### 5.1 — `.remember/` plugin write-time contamination (CONFIRMED)

- **Confirmation of Vining's `7e6dcba3` finding**: `.remember/now.md` has rotated to a CLEAN state (1000 bytes; 6 lines of waypoint summary) since Vining's broadcast. The contamination instances Vining flagged for now.md have already drained out of the rolling buffer.
- **New contamination instances found**:
  - `.remember/today-2026-05-24.md` lines 9–21: Claude assistant prose ("I don't have access to the actual timestamp or branch name for that final entry…", "To complete the compression task, I need you to provide:", "Once you do, I'll apply the compression rules…"). 13 lines of contamination interleaved with legitimate compressed entries.
  - `.remember/today-2026-05-22.done.md` line 17: "I don't have access to the current wall-clock time beyond knowing today is 2026-05-22…". Single-line contamination instance; surrounding entries are legitimate.
- **Direct log-evidence of failure mode**: `.remember/logs/memory-2026-05-24.log` 10:09:39 records `[ndc] ERROR: produced empty result`. The successful compressions at 07:40:07, 09:04:14, 11:10:41 produce legitimate compressed-line output (`4848→2785b (-42%)`, `4131→628b (-84%)`, `14471→428b (-97%)`); the failure mode is intermittent.
- **Forbidden cure**: curator MAY NOT mutate `.remember/*` directly. The cure is upstream contract amendment.
- **Cross-platform note**: contamination instances span 2026-05-22 and 2026-05-24 logs; the same failure mode fires across days. The defect is reproducible, not single-event.

### 5.2 — `.agent/plans` lacks status-frontmatter for active plans

- 12 of 111 `current/` plans have `status:` frontmatter; **99 do not**. Three (`planning-specialist-capability.plan.md`, `reviewer-gateway-upgrade.plan.md`, `sentry-specialist-capability.plan.md`) have no frontmatter at all.
- This is a structural defect: plans cannot be lifecycle-routed without status. The `repo-continuity.md` Active Threads index can't reliably distinguish active from stale plans.
- **Cure proposal**: directive or rule requiring `status:` frontmatter on all plan files, with enumerated vocabulary (`planning` / `active` / `paused` / `completed` / `archived`). Existing plans need a one-time sweep — large-cardinality work that's its own plan.

### 5.3 — Plans-directory shape inconsistency

- Three sibling directories under each domain: `current/`, `active/`, `future/`, plus `archive/` and `archive/completed/`. The distinction between `current/` and `active/` is not documented in any directive I found in this survey.
- This is a directory-taxonomy defect (PDR-023 documentation-structure-discipline candidate).
- **Cure proposal**: PDR or ADR or directive naming the directory shape unambiguously, OR collapse `current/` ↔ `active/` if the distinction is accidental.

### 5.4 — `pending-graduations.md` index drift

- The index section (lines 82–117) names current `due` candidates as 3 entries, but the file is 4657 lines deep. The `pending` slice at L262 lists "body markers — second-instance or owner-direction gated" but explicitly says *"entry-level summary index is intentionally omitted to avoid duplicating entry-body substance"* — so the index does not enumerate them.
- Result: scanning the file for what's actually live requires grepping `status: pending` across 4600+ lines. Index is honest about its omission but the file's overall navigability is degraded.
- **Cure proposal**: per the buffer-not-essay framing, larger structural cure is to drain the pending-graduations register more aggressively (which is what Vining's pass started). Carry-forward to next pass.

### 5.5 — Memory entries from MEMORY.md that don't have files in the memory/ directory

- `feedback_loop_runbook_code_expert_after_delivery.md` referenced in MEMORY.md but my initial `ls` didn't show it — re-check shows it IS present. False positive on my part. No defect.

### 5.6 — Curator-pass log file accumulation (latent risk)

- Per PDR-081 §Per-pass log contract, the metadata-only constraint exists precisely to prevent the per-pass log from becoming a buffer requiring a curator. This survey's working-artefact at `/tmp/breezy-deep-curation-survey-2026-05-24.md` is **substantively rich** — that's appropriate for a one-shot working artefact, but the curator-pass log file Vining authors downstream must point at this report, not embed its contents.
- **Watch-item, not a defect yet**: the contract was designed for exactly this case; the discipline is intact.

---

## 6. Cross-Surface Observations

Patterns observed across multiple source-surface families. Higher-signal because they spanned independent capture surfaces.

### 6.1 — "Owner action is not a cure" / "missing autonomy primitive" lens

- **Surfaces**: Claude per-user memory (`feedback_owner_action_is_not_a_cure.md`); napkin (Velvet 2026-05-23 lines 270–280, Scorched line 183, Mistbound captures); distilled.md ("Owner action is not a valid cure" entry in MEMORY.md).
- **Observation**: This lens is being **applied** across multiple agents in multiple sessions but has not graduated to PDR. It's the kind of substrate-property whose continued residence in per-user memory is the **buffer-not-personal-store** failure mode named by PDR-067.

### 6.2 — Substrate-pointer-pattern v2 → v3

- **Surfaces**: napkin (15 worked instances captured by 2026-05-24); pending-graduations (v3 candidates list); active patterns/ file (`substrate-pointer-read-as-current-state.md` — landed v2 at `8a99ed35`).
- **Observation**: Pattern is in mature production-use; cure-shapes (verification-discipline; cron-prompt owner-input-precedence; handoff-attribution-vs-working-tree) are accumulating as variant-class instances. v3 promotion candidate is ripe.

### 6.3 — `/tmp/` violations spanning multiple surfaces

- **Surfaces**: napkin (Ferny Capture D + Capture B `/tmp/ferny-ws8-reviewer-synthesis-window2.md` initial violation, then cure); program plan (WS-6: *"CAVEAT: review-trail substrate is in /tmp (session-local), not durable substrate — risk of loss across rotation"*); pending-graduations (no entry yet); comms broadcasts (Vining `7e6dcba3` includes durable-substrate-not-in-tmp framing).
- **Observation**: Owner rule was stated 2026-05-24 (Capture D); worked-instance friction has been accumulating for at least the prior week. The rule is now articulated; the routing-to-rule step is the move.

### 6.4 — Cron-prompt-template-as-substrate

- **Surfaces**: napkin (Ferny Capture A 2026-05-24 + Mistbound Surprise 2 instance 13); program plan WS-10 (heartbeat-cron mechanism design).
- **Observation**: The `.agent/skills/start-right-team/SKILL-CANONICAL.md` cron-template body has a load-bearing failure phrase: *"return to whatever task is in flight"* — overrides owner-input-precedence when cron fires before agent reads owner-input. Ferny provided concrete cure-shape text. **Substantive substrate landed in napkin but not yet routed to SKILL amendment.**
- **Proposed routing**: amendment to `start-right-team` SKILL §0.5 (heartbeat contract) absorbing Ferny's cure-shape text; this composes with WS-11 PDR-078 + ADR-186 work in flight.

### 6.5 — Recursion-of-doctrine under team-cadence speed

- **Surfaces**: napkin (Incandescent 2026-05-23 line 228, 5 worked instances; Velvet line; Scorched line); pending-graduations (pattern-shaped candidate); PDR-073 (`recursion-as-method-is-practice-core-mind-shape`).
- **Observation**: PDR-073 carries the principle; the pattern file for the failure-mode-under-cadence-speed has 5+ worked instances and is ready for promotion to a pattern file with PDR-073 cross-reference.

### 6.6 — Reviewer-pass cures trust-without-reverification

- **Surfaces**: napkin (Lanternlit 2026-05-24 lines 26–27, 44); cross-references substrate-pointer-pattern v2; pending-graduations capture.
- **Observation**: 1 worked instance currently; capture-only. Watch for 2nd worked instance.

---

## 7. Carry-Forward (Deliberately Deferred)

### 7.1 — Full plans-directory staleness sweep

- 111 current plans + 97 future + 19 active = 227 active-state plans. Comprehensive staleness audit requires its own scoped pass. **Carry-forward to plans-curator-pass.**

### 7.2 — Full `.remember/today-*.done.md` historical contamination audit

- Of the 24 `today-*.done.md` files surveyed, grep-scan found contamination in 2 (2026-05-22 + 2026-05-24). Files smaller than 50 lines were grep-only; larger files (today-2026-05-23.done.md, 144 lines) were sampled but not full-read. **Carry-forward for full-read audit** if it matters.

### 7.3 — Memory file freshness audit across all 88 entries

- I sampled ~15 memory files; the remaining 73 may contain similarly-stale or graduation-ready entries. **Carry-forward to per-user-memory-buffer-drain pass.**

### 7.4 — Adoption-gap signals on landed substrate

- PDR-081 (just landed) — too early to measure adoption.
- PDR-080, PDR-077 draft, PDR-076 split, ADR-186 (blocked-by-hook) — adoption-gap measurement is a separate pass at +1 week / +1 cross-session-window.

### 7.5 — Comms-event tag-namespace adoption signal

- Vining's pass log notes 0.07% adoption. Substantive recovery work to land tag-namespace adoption hooks/discipline is owner-allocated to a future cycle. **Watch-list only.**

### 7.6 — `pending-graduations.md` deep-drain on accumulated body entries

- 4657 lines, 60+ section headers, dozens of `status: pending` body entries that haven't been touched in weeks/months. Each entry requires substance-read + trigger-check + home-confirmation. **Beyond this pass's scope; separate dedicated curator pass.**

### 7.7 — `feedback_loop_runbook_code_expert_after_delivery.md` graduation pointer

- Memory entry is marked GRADUATED to rule `pre-execution-code-expert-review-per-loop-cycle.md`. The graduation is complete. But the `/loop` runbook SKILL home-gap §3.1 is still open. **Routing pointer**: §3.1 is the unfinished cascade work; flag for owner direction.

---

## 8. Summary Counts

| Category | Count |
|---|---|
| Durable knowledge ready for routing (§2) | 10 |
| Home-gaps surfaced (§3) | 5 |
| Stale / superseded substance flagged (§4) | 5 (4 memory + 1 plans-scope) |
| Structural defects in substrate (§5) | 6 (one was false positive, so 5 confirmed) |
| Cross-surface observations (§6) | 6 |
| Carry-forward items (§7) | 7 |

## 9. Highest-Signal Routing Moves (Vining's Triage Suggestion)

If owner has limited bandwidth for ratification this pass, the four highest-leverage moves are:

1. **§2.1 — `important-state-not-in-temp-files` rule landing** (owner-direction fired; memory entry already drafted per MEMORY.md mention; just needs rule-file authoring).
2. **§2.2 — `director-pure-direction-only` PDR graduation** (load-bearing principle; richly cross-referenced; owner-direction explicit).
3. **§2.4 — `owner-action-is-not-a-cure` PDR graduation** (autonomy-substrate keystone; composes with PDR-074 / PDR-081).
4. **§6.4 — `start-right-team` SKILL §0.5 cron-template amendment** (substantive cure-shape text in hand; WS-10 / WS-11 in flight; coordination with active work).

The remaining moves are sequence-flexible.

---

**End of report.** Substance lives here as a working artefact for Vining to absorb into the metadata-only curator-pass log + comms broadcast + onward owner-direction routing.
