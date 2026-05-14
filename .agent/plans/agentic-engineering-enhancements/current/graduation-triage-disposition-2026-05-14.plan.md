---
name: "Graduation-Triage Disposition 2026-05-14"
overview: >
  Disposition ledger from a /jc-consolidate-docs cross-platform graduation
  triage. Records a decision for every candidate surface item, executes a
  small lowest-risk batch in the next session, defers PDR/ADR amendments
  to a near-term next session with drafts, holds plan-pre-empted substance
  against the singleton-lane remediation plan, and records owner-paused
  substance as reference-only.
todos:
  - id: batch-a-pending-graduations-status-flip
    content: "Batch A: flip tooling-friction PDR candidate to `due` in pending-graduations.md and surface graduation-shape decision to owner (PDR / new rule / amend existing rule)."
    status: pending
  - id: batch-b-claude-memory-rule-amendments
    content: "Batch B: four single-paragraph rule amendments routing Claude per-user memory entries to existing rules with back-cite (inter-agent comms first-class, identity routing name/prefix pair, use built agent-tools not source, CLI help completeness)."
    status: pending
    depends_on: [batch-a-pending-graduations-status-flip]
  - id: batch-c-workflow-gotchas-graduation
    content: "Batch C: graduate three 2026-05-10 curation entries (lettered-section count re-read, growth-axis metadata, shell-loop-over-multiline-output) to docs/engineering/workflow.md §12 Workflow Gotchas; prune from distilled.md with graduations-log back-cite."
    status: pending
    depends_on: [batch-a-pending-graduations-status-flip]
  - id: deferred-pdr-adr-drafts
    content: "Deferred to next-session: draft D1 (PDR-018 amendment — DECISION-COMPLETE as readiness gate), D2 (vendor-call-shape verification rule or PDR-018 amendment), D3 (acceptance value-proxies — testing-strategy.md or principles.md amendment), D4 (agent-collaboration.md PR-closeout-discipline section), D5 (PDR-015 amendment on multi-reviewer audit-shape framing). Owner reviews each diff before commit."
    status: pending
    depends_on: [batch-c-workflow-gotchas-graduation]
  - id: closeout-and-consolidation
    content: "Closeout: confirm back-cite chains, run focused validators (markdownlint, fitness:informational), update repo-continuity + thread record, archive this plan or move deferred items to a new current/ plan if not all D1–D5 land."
    status: pending
    depends_on: [batch-b-claude-memory-rule-amendments, batch-c-workflow-gotchas-graduation, deferred-pdr-adr-drafts]
isProject: false
---

# Graduation-Triage Disposition 2026-05-14

**Last Updated**: 2026-05-14
**Status**: QUEUED / NOT-STARTED (owner-approved disposition + next-session execution scope; lowest-risk subset)
**Collection**: `agentic-engineering-enhancements/current`
**Thread**: `agentic-engineering-enhancements`
**Authoring agent**: Salty Swimming Hull / `claude` / Opus 4.7 / `f6e2af`
**Other live agent at authoring time**: Fronded Foraging Moss / `codex` / GPT-5 / `019e26` (deep evidence analysis, separate file scope)

**Origin**: authored 2026-05-14 as a Claude per-user session plan
(`~/.claude/plans/so-in-your-judgement-concurrent-eclipse.md`, approved via
plan-mode ExitPlanMode), then promoted into the repo per owner direction.
Owner-directed scope: execute only the lowest-risk subset in the **next
session**; defer PDR/ADR amendments to the next session (*not*
indefinitely); hold plan-pre-empted items until the singleton-lane
remediation lands.

## Context

A `/jc-consolidate-docs` graduation triage was run against every named
ephemeral and durable knowledge surface:

- repo memory: `napkin.md`, `distilled.md`, `pending-graduations.md`,
  `shared-comms-log.md` + raw `comms/*.json`, `.remember/` plugin buffers
- platform-specific per-user memory: Claude (`~/.claude/projects/<proj>/memory/`,
  structured `MEMORY.md` + per-entry files), Cursor (`~/.cursor/chats/`,
  `prompt_history.json`, `~/.cursor/plans/` — no structured memory), Codex
  (`~/.codex/memories/` + extensions/ad_hoc/notes)
- permanent-home back-cite verification: PDR-018, PDR-015, PDR-056, PDR-027,
  `.agent/rules/` (60 files), `agent-collaboration.md`, `testing-strategy.md`,
  `principles.md`, `docs/engineering/workflow.md`,
  `docs/engineering/testing-tdd-recipes.md`,
  `docs/governance/development-practice.md`
- in-flight plan that supersedes substantive routing:
  [`agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md`](../../agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md)

The intended outcome is a **disposition ledger** per PDR-018 §"Disposition
Ledger For 'Apply All Of X' Inputs" — every input gets a recorded decision,
not every input triggers a separate execution cycle. Most candidates resolve
to *already-covered (back-cite)*, *plan-pre-empted (hold)*, or
*paused (reference-only)*. The small executable subset lands next session.

## Metacognition Result

The inherited shape was "what should graduate" as an enumeration task. After
surveying every surface the doctrinal answer reshapes into three categories
where the user's session-bounding direction sharpens further:

1. The singleton-lane remediation plan creates a **hard supersession boundary**
   for substance routed through its WS0–WS7. Independently graduating those
   items now would entrench premature shapes (the failure mode that plan
   exists to cure). The largest single decision is therefore *what NOT to
   graduate this pass*.
2. The owner-amended napkin entry today (Salty's rogue-comms-events entry,
   sharpened from "standing migration lane" to "remove agent-overridable
   path") demonstrated my graduation-suggestion shape can carry doctrinal
   drift. Every drafted amendment must therefore route through owner review
   before landing in any canonical surface, per PDR-003 (care-and-consult
   on dense Practice content) and PDR-046 §Move 3 (substance preservation
   over fitness pressure).
3. Cross-platform scan converged: Cursor adds little new (substance flows
   through repo doctrine); Codex reinforces existing patterns rather than
   adding novel doctrine; `.remember/` is mostly already-covered or
   plan-pre-empted. The repo-resident substance has been distilled
   thoroughly already this week; the per-user memory surfaces contain the
   genuinely-novel candidates.

## End Goal

A repo state where:

- every substantive candidate surfaced this pass has a recorded
  disposition (no silent drops);
- the small executable subset has landed in its permanent home with
  back-cite chains intact;
- the larger deferred-to-next-session subset is enumerated with draft
  targets so the next session executes without redoing the triage;
- plan-pre-empted substance is named and held against the singleton-lane
  plan's workstreams (not pre-empted into independent doctrine);
- owner-paused substance (coordinator role-set) is recorded as
  reference-only, not as PDR-in-waiting.

## Mechanism

A disposition ledger is the right artefact for "apply all of X" work where
most inputs are redundant with existing doctrine, some are routed elsewhere
by in-flight plans, and only a small subset has genuinely new substance
worth graduating. The ledger preserves substance via back-cites without
forcing N execution cycles. The implementation work is sized to the unique
substance, not to the input count.

## Execution Scope (Next Session)

Three small batches, owner-approval-gated at each diff. All land by
explicit pathspec; no whole-tree mutations. Aggregate landing target:
one consolidation-style commit per batch, or a single bundled commit if
all batches review cleanly.

### Batch A — Pending-graduations status flip

**File**: [`.agent/memory/operational/pending-graduations.md`](../../../memory/operational/pending-graduations.md)

The "Agent tooling friction is first-class user feedback" entry added
this session (status: `pending`, trigger: `owner-direction`) has its
trigger fired (the originating 2026-05-05 owner standing direction is
the trigger itself; the candidate's capture this session is the action
under that trigger). Flip status to `due` and surface graduation target
to owner for shape selection:

- Option 1: PDR with `pdr_kind: pattern` — broadest doctrinal home,
  portable across Practice-bearing repos.
- Option 2: Rule at `.agent/rules/capture-tooling-friction-as-user-feedback.md`
  — narrower, repo-local enforcement.
- Option 3: Amendment to [`.agent/rules/capture-practice-tool-feedback.md`](../../../rules/capture-practice-tool-feedback.md)
  if a sufficiently close rule already exists (verify at execution time).

Owner picks the shape; agent drafts the amendment for owner review.

### Batch B — Claude per-user memory → existing-rule amendments (4 entries)

Each lands as a *single-paragraph amendment* to an existing rule with
owner reviewing the diff. No new rule files created in this batch.

| Source memory entry | Target surface |
|---|---|
| "Inter-agent comms is a first-class option" (`feedback_inter_agent_comms_first_class`) | [`.agent/rules/follow-agent-collaboration-practice.md`](../../../rules/follow-agent-collaboration-practice.md) — amend with the parallel-async/comms-event-default-before-owner-escalation framing |
| "Identity routing: (name, prefix) as pair" (`feedback_identity_routing_uses_name_and_prefix_pair`) | [`.agent/rules/register-identity-on-thread-join.md`](../../../rules/register-identity-on-thread-join.md) OR PDR-027 Notes section — verify which is the cleaner home at execution time |
| "Use only built agent-tools, never source" (`feedback_use_built_agent_tools_only`) | [`.agent/rules/use-agent-comms-log.md`](../../../rules/use-agent-comms-log.md) is the closest existing surface; if poor fit, create new minimal rule (still narrow scope, single-paragraph) |
| "Agent-tool CLIs must print full help on invalid flags" (`feedback_agent_tool_help_on_invalid_flags`) | New entry under [`agent-tools/docs/agent-support-tools-specification.md`](../../../../agent-tools/docs/agent-support-tools-specification.md) (tooling spec, not doctrinal rule) — verify at execution time |

For each: the cited memory file in
`~/.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/`
provides the substance verbatim; the amendment is one paragraph plus
back-cite to the originating feedback memory.

### Batch C — 2026-05-10 workflow-gotcha entries → `docs/engineering/workflow.md`

Three minor curation-and-hygiene entries currently held in
[`distilled.md`](../../../memory/active/distilled.md) §"Recently Distilled — 2026-05-10
Napkin Rotation" §"Curation And Doctrine-Holding". All stable since
2026-05-10 (4 days), no contradiction.

| Entry | Target |
|---|---|
| "Lettered-section edits must re-read the intro count" | [`docs/engineering/workflow.md`](../../../../docs/engineering/workflow.md) §12 Workflow Gotchas (new sub-section) |
| "Growth-axis metadata is live doctrine" | Same — `workflow.md` §12 sub-section |
| "Shell loops over multiline command output are unsafe in deletion paths" | Same — `workflow.md` §12 sub-section (prefer `while IFS= read -r` over `for x in $(...)`) |

After landing in `workflow.md`, prune the three entries from `distilled.md`
with a back-cite line in the §"Graduations Log — 2026-05-14" section
matching the existing pattern.

## Deferred to Next Session (PDR/ADR amendments)

Drafted-but-not-landed amendments. Each has a clear permanent home and
verified-novel substance (back-cite scan confirmed none are already-covered).
Owner reviews each diff before commit.

| # | Source | Target | Substance |
|---|---|---|---|
| D1 | `distilled.md` §"Plan-author discipline reinforcement" (2026-05-14, Sylvan Budding Forest) | [PDR-018](../../../practice-core/decision-records/PDR-018-planning-discipline.md) amendment | DECISION-COMPLETE is the readiness gate, not paperwork after execution. Vendor literals, output schemas, interface signatures, exit codes, sort order, encoding decisions, and help-text shape MUST be settled at plan-author time. |
| D2 | `distilled.md` same section | New rule `.agent/rules/verify-vendor-call-shapes-at-plan-author-time.md` OR PDR-018 amendment | "Well-known utility library" is not permission to pin a call shape from memory. Worked example: tinyglobby. Companion to [`read-before-asking`](../../../rules/read-before-asking.md). |
| D3 | `distilled.md` same section | [`testing-strategy.md`](../../../directives/testing-strategy.md) amendment OR [`principles.md`](../../../directives/principles.md) amendment | Acceptance value-proxies must compare against independent ground-truth measures. (chars/4 reproducing chars/4 proves nothing; compare against `wc -c`.) |
| D4 | `distilled.md` §"Recently Distilled — 2026-05-09" §"PR Closeout Discipline" (4 entries, stable since 2026-05-09) | [`agent-collaboration.md`](../../../directives/agent-collaboration.md) new section "PR Closeout Discipline" | Two distinct evidence loops (gate state + reviewer-comment state); PR title/body as active review surface; planning-PR dual verdicts; remote metadata transitions as state handoff. |
| D5 | `distilled.md` §"Recently Distilled — 2026-05-09" §"Multi-Reviewer Dispatch Discipline" | [PDR-015](../../../practice-core/decision-records/) amendment (which already covers parallel dispatch, doesn't yet name "each reviewer lens shrinks a different part of the audit-shape surface" framing) | Add distilled instance to PDR-015 §2026-04-26 amendment block; the audit-shape-surface framing sharpens the existing parallel-dispatch substance. |

For D2 and D3, owner picks shape (new rule vs amendment) at the start of
the next session.

## Held — Plan-Pre-Empted (do NOT graduate)

These substance items map directly to the singleton-lane remediation plan's
workstreams. Independently graduating them now would entrench shapes the
plan is structurally curing. They remain captured in this session's
artefacts (napkin entries, `distilled.md` entries, the cleanup commit
`c61fb351`); they execute through the plan's WS0–WS7 lifecycle, not
through `jc-consolidate-docs`.

| Held substance | Singleton-lane plan workstream |
|---|---|
| "Empty claims is moment-in-time fact, not durable coordination" (triple-corroborated: Salty, Feathered, Floating) | WS1 (team-start rendezvous contract) + WS2 (claim-overlap routing signal) |
| `.active_claims` vs `.claims` jq probe correction | WS5 (bulk-cleanup hot-window contract — explicitly "Remove examples that encourage direct `.active_claims` jq probes") |
| Bulk-cleanup-during-hot-window collision (my comms retention pass during the WS1 window) | WS5 |
| Rogue `comms-events/` directory + `--comms-dir` agent-overridable path | WS3 (canonical comms path interface — remove the option) + WS4 (stale-surface sweep) |
| N=7 multi-agent evidence | WS6 (pilot-and-hypothesis-routing — *not* role-taxonomy graduation) |
| Coordinator role-set (controller/marshal/reviewer/implementer/scout/standby) | Out-of-scope per plan §Scope (and owner-paused per this session's direction) |

Trigger to unhold: singleton-lane plan WS0–WS6 lands. At plan closeout
(WS7) the consolidation pass surfaces will already have absorbed the
structural cures; no independent doctrinal graduation needed.

## Paused — Reference Only (may never become PDR)

Per owner direction this session: the coordinator-PDR candidate in
`pending-graduations.md` stays paused. Its content is useful as a
single-perspective reference. It is **not** canonical, not
PDR-in-waiting, and may never graduate. Some of its content may appear
in other surfaces (the singleton-lane plan does some of this re-routing).
No action this pass.

Companion entries on the same family (Claude memory: "Coordinator role
threshold ≤3 peer / ≥4 coordinator"): also paused; same treatment.

## Already-Covered (back-cite only, no action)

Cross-platform scan turned up many candidates already homed:

- Codex memory's 120-second cadence + sweep scope is already in
  [`start-right-team`](../../../skills/start-right-team/SKILL-CANONICAL.md) SKILL §"Maintain The Team Cadence".
- Codex memory's completion-verdict discipline is routed via Verdant
  Foraging Copse's completion-claim-proof-pipeline plan + first
  `jc-plan` proof-contract skill amendment (already landed 2026-05-13).
- Codex memory's collaboration-state identity preflight is in
  [`start-right-quick`](../../../skills/start-right-quick/shared/start-right.md) SKILL §"Live State (operational memory)".
- Codex memory's handoff-only-no-commit literal interpretation is in
  user feedback memory + observed via Verdant Swaying Glade's session
  this morning.
- Claude memory's "Local broken code never leaves" is rule
  [`.agent/rules/local-broken-code-never-leaves.md`](../../../rules/local-broken-code-never-leaves.md).
- Claude memory's "30% context budget for directive processing" is
  PDR-052.
- `.remember/` substance from 2026-05-12 → 2026-05-14 is already
  in `distilled.md` §"Recently Distilled — 2026-05-14" (Sylvan
  Budding Forest's deep-dive distillation captured behaviour-changing
  entries from the multi-agent P8 window).
- Today's session's grounding-miss + rogue-comms-events entries are
  in `napkin.md` lines 291–447 (committed at `c61fb351`).

## Acceptance Criteria (Next Session)

**Batch A acceptance**:

- A1: `pending-graduations.md` tooling-friction entry status flipped
  to `due` with shape decision recorded.
- A2: If owner picks PDR shape, a draft PDR file exists at
  `.agent/practice-core/decision-records/PDR-NNN-tooling-friction-is-user-feedback.md`
  ready for owner review.

**Batch B acceptance** (4 rule amendments):

- B1–B4: Each amendment lands as a single-paragraph addition to the named
  existing rule (or its substitute if verification shows a better home),
  with a back-cite line to the originating per-user memory entry. The
  per-user memory entry is updated to reference the now-active rule home.

**Batch C acceptance** (workflow.md hygiene):

- C1: Three sub-sections added to `docs/engineering/workflow.md` §12.
- C2: Three entries pruned from `distilled.md` with a graduation-log
  back-cite matching the existing pattern.

**Aggregate acceptance**:

- AGG1: A `git log --oneline` after the batches shows clear pathspec-tight
  commits with no cross-batch contamination.
- AGG2: `pnpm markdownlint:root` passes on all touched files.
- AGG3: Each landed substance has a verifiable back-cite chain — the
  source ephemeral entry references the new permanent home, and the
  permanent home cites the originating evidence.

## Prerequisite Classification

**Blocking**:

- The WS1 token-measurement bundle currently uncommitted in the working
  tree (`agent-tools/scripts/validate-practice-fitness.*`,
  `agent-tools/src/practice-fitness/**`, plus repo-continuity / thread
  record / plan-file edits from the WS1 team) must either land or be
  explicitly held non-overlapping with these graduation amendments. The
  singleton-lane plan flags this same prerequisite. Owner-coordinated
  resolution required before Batch A/B/C executes.
- Live grounding at next-session open: `.claims` (not `.active_claims`)
  probe; commit-queue scan; staged-files scan; comms inbox sweep;
  active plans scan.

**Beneficial**:

- `assumptions-expert` review of this plan for proportionality and
  hidden owner decisions.
- `docs-adr-expert` review of D1/D2/D3/D4/D5 amendment drafts if/when
  they promote out of deferral.

**Minimum shippable shape without beneficial prerequisites**:

- Batches A/B/C can land as owner-reviewed single diffs without
  specialist reviewer dispatch given the small substance size and
  amendment-shape (not new doctrine creation). For deferred items D1–D5,
  reviewer dispatch is recommended at promotion time.

## Non-Goals (YAGNI)

- No PDR/ADR amendment lands as part of Batches A/B/C; D1–D5 amendments
  are *drafted* for owner-review cycle in the same next session or one
  shortly after.
- No new coordinator-role taxonomy lands anywhere. The paused
  pending-graduations entry stays paused.
- No `.remember/` mutation. The plugin owns rotation/archival/deletion.
- No re-graduation of substance already in `distilled.md` §"Recently
  Distilled — 2026-05-14"; that distillation absorbed today's
  multi-agent window already.
- No drafting of the singleton-lane plan's structural cures here —
  those execute through that plan's lifecycle.
- No standalone consolidation activity that touches `.agent/state/**`
  during an active multi-agent window without explicit heads-up + claim;
  this plan is deliberately structured around the singleton-lane plan's
  WS5 hot-window contract.

## Risk Assessment

| Risk | Mitigation |
|---|---|
| Drafted amendment carries doctrinal drift (the "standing migration lane" failure mode observed today). | Owner reviews each diff before commit. Drafts cite the originating feedback memory verbatim to constrain framing. |
| Plan-pre-empted substance gets independently graduated under context pressure. | The "Held" section is the explicit gate. The hold list is named, not inferred. |
| Cross-batch contamination (Batch A/B/C edits sweep WS1 team files into commits). | Each batch lands by explicit pathspec, never whole-tree `git add .`. Working-tree heads-up to Fronded / WS1 team before each batch. |
| WS1 bundle commits ahead of these batches reshape `.agent/memory/` or `.agent/state/` such that drafts are stale. | Re-read source feedback memories at execution time; drafts are paragraph-sized so re-derivation is cheap. |
| Owner-paused coordinator substance leaks back into doctrine via a Claude memory amendment (B3 "Use only built agent-tools" is close to the multi-agent topology family). | B-batch amendments stay paragraph-sized and cite the originating user feedback memory only. No role-taxonomy substance enters via the back door. |
| Cursor / Codex platform-specific substance routed to repo doctrine creates portability-violation. | Each B-batch amendment must pass the practice-core-portability check: no platform-specific paths, ADR/PDR refs, or commit refs in the rule body. |

## Foundation Alignment

- [`principles.md`](../../../directives/principles.md): strict and complete; no invented optionality; no
  compatibility layers; substance preservation over fitness pressure.
- `PDR-018` §"Disposition Ledger For 'Apply All Of X' Inputs": every
  input gets a recorded decision; implementation sized to unique
  substance, not input count.
- `PDR-046` §Move 3: substance ready for its durable home leaves the
  layer to that home; the source layer's shape relaxes naturally.
- `PDR-003`: care-and-consult on dense Practice content; main-agent
  drafting with owner review per diff.
- [`start-right-team-singleton-lane-remediation.plan.md`](../../agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md):
  structural supersession boundary respected.

## Plan-Body First-Principles Check

The first-principles check fires before Batch A/B/C execution:

- Is this simpler without compromising quality? — Yes: disposition
  ledger plus small batched execution is the simplest shape that
  preserves substance without forcing N cycles.
- Is the plan removing premature shape rather than adding warning
  prose? — Yes: paused coordinator-PDR + held plan-pre-empted items
  are explicit decisions, not added warnings.
- Is the landing path structural and testable? — Yes: each batch has
  acceptance criteria + back-cite chain verification.
- Are role labels being treated as examples rather than ontology? — Yes:
  coordinator role-set stays paused.

## Lifecycle Triggers

- **Session entry next session**: `jc-start-right-quick` is sufficient
  for Batch A/B/C if no team is active; `jc-start-right-thorough` if
  any of D1–D5 promotes out of deferral.
- **Pre-edit coordination**: claim exact files; re-check `.claims`
  (not `.active_claims`); commit-queue; staged-files; shared comms;
  directed inbox.
- **During work**: log any drift, overlap, or stale-surface findings in
  comms and napkin per the recent rogue-dir lesson.
- **Handoff**: close own claim; update this plan (mark batches complete,
  move D1–D5 to next-session execution scope if promoted).
- **Consolidation**: this plan IS a consolidation-step output; on
  completion, archive to
  `.agent/plans/agentic-engineering-enhancements/archive/`.

## Verification

End-to-end verification at next-session close:

1. **Batch A verification**:

   ```bash
   grep -n "tooling-friction-is-user-feedback\|tooling friction.*user feedback" \
     .agent/memory/operational/pending-graduations.md
   # Expect: status flipped to `due` (or `graduated` if PDR drafted in-session)
   ```

2. **Batch B verification** (each amendment):

   ```bash
   grep -n "<originating-memory-name>" .agent/rules/<target-rule>.md
   # Expect: back-cite line present
   ```

   Then read the memory file in
   `~/.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/`
   and confirm the body references the rule.

3. **Batch C verification**:

   ```bash
   grep -n "Lettered-section\|Growth-axis metadata\|Shell loops over multiline" \
     docs/engineering/workflow.md
   # Expect: three sub-section headings present
   grep -c "Lettered-section\|Growth-axis metadata\|Shell loops over multiline" \
     .agent/memory/active/distilled.md
   # Expect: 0 (pruned) or 1 each in graduations log only
   ```

4. **Aggregate verification**:

   ```bash
   git log --oneline HEAD~3..HEAD  # 3 small commits or 1 bundle
   pnpm markdownlint:root          # passes
   pnpm practice:fitness:informational  # signals not goals — read, don't act
   ```

5. **Plan completion**:
   - Update YAML frontmatter todo statuses to `completed`; update
     `Status` header to `✅ COMPLETE` with date.
   - If all D1–D5 land in the next session: archive to
     `.agent/plans/agentic-engineering-enhancements/archive/`.
   - If D1–D5 do not all land: keep this plan in `current/` and add a
     follow-on plan in `current/` carrying the remaining drafts.

## Critical Files Referenced

**Source surfaces scanned**:

- [`.agent/memory/active/napkin.md`](../../../memory/active/napkin.md)
- [`.agent/memory/active/distilled.md`](../../../memory/active/distilled.md)
- [`.agent/memory/operational/pending-graduations.md`](../../../memory/operational/pending-graduations.md)
- [`.agent/state/collaboration/shared-comms-log.md`](../../../state/collaboration/shared-comms-log.md)
- [`.remember/`](../../../../.remember/)
- `~/.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/MEMORY.md`
  and per-entry files
- `~/.cursor/chats/`, `prompt_history.json`, `~/.cursor/plans/`
- `~/.codex/memories/` + `extensions/ad_hoc/notes/`

**Plan supersession reference**:

- [`agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md`](../../agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md)

**Permanent-home targets (Batch A/B/C)**:

- [`.agent/memory/operational/pending-graduations.md`](../../../memory/operational/pending-graduations.md) (Batch A)
- [`.agent/rules/follow-agent-collaboration-practice.md`](../../../rules/follow-agent-collaboration-practice.md) (Batch B1)
- [`.agent/rules/register-identity-on-thread-join.md`](../../../rules/register-identity-on-thread-join.md) or PDR-027 (Batch B2)
- [`.agent/rules/use-agent-comms-log.md`](../../../rules/use-agent-comms-log.md) or new minimal rule (Batch B3)
- [`agent-tools/docs/agent-support-tools-specification.md`](../../../../agent-tools/docs/agent-support-tools-specification.md) (Batch B4)
- [`docs/engineering/workflow.md`](../../../../docs/engineering/workflow.md) §12 (Batch C)
- [`.agent/memory/active/distilled.md`](../../../memory/active/distilled.md) (Batch C prune + graduations log entry)

**Deferred-amendment targets (D1–D5)**:

- [`.agent/practice-core/decision-records/PDR-018-planning-discipline.md`](../../../practice-core/decision-records/PDR-018-planning-discipline.md) (D1, D2)
- New rule under [`.agent/rules/`](../../../rules/) (D2 alternative)
- [`.agent/directives/testing-strategy.md`](../../../directives/testing-strategy.md) or [`principles.md`](../../../directives/principles.md) (D3)
- [`.agent/directives/agent-collaboration.md`](../../../directives/agent-collaboration.md) (D4)
- `.agent/practice-core/decision-records/PDR-015-*.md` (D5)
