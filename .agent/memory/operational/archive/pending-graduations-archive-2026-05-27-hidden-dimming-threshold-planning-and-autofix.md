---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Graduate ready items to PDRs, ADRs, rules, skills, templates, or permanent docs"
merge_class: active-register-shard
fitness_content_role: reference
---

# 2026-05-25 Planning and Auto-Fix Candidates

Live active shard split from `pending-graduations.md` and the outgoing active
napkin by Breezy Flowing Dock on 2026-05-25. This is not an archive: process
each entry before removing this shard or its pointer from the main register.

The shard preserves fresh planning, role-emission, template, and multi-agent
auto-fix observations from Briny Fathoming Dock and Hushed Stalking Shade. The
long-form narrative remains in the archived active napkin and companion
experience files; this shard carries the live queue substance.

## Entries

### Recursive meta-cure for plan-authoring

Metadata:

- captured: 2026-05-25
- source: Briny Fathoming Dock role-metacognition session
- target: pdr-amend:PDR-018-planning-discipline
- trigger: second worked instance
- size: M
- status: pending

The structural cure proposed for multi-agent role-emission
(substrate-bound citation binding so freshness is mechanically auditable)
applies recursively to plan-authoring itself. Every plan emission depends on
doctrine-landscape ground truth: PDRs, ADRs, rules, and patterns the plan
composes against. Without freshness binding, the plan can emit doctrine
proposals against a stale model.

Proposed cure shape: open doctrine-heavy plans with explicit doctrine-landscape
revision citations at author-time. Reviewers then audit freshness, and stale
plan emissions become auditable from the plan body alone.

Falsifiability: a second plan-authoring session proposes doctrine against a
stale landscape that a cited-revision freshness check would have exposed.

### Reviewer fan-out cost imbalance

Metadata:

- captured: 2026-05-25
- source: Briny Fathoming Dock role-metacognition session
- target: pdr-or-skill:reviewer-fanout-as-check-not-substitute
- trigger: second reviewer finding naming missed landscape verification
- size: M
- status: pending

Six sub-agent reviewers absorbed findings that one pre-author
landscape-verification pass should have caught: multi-role overreach,
layer-split leakage, and lifecycle exclusion. Reviewer fan-out is a check
against autonomous due diligence, not a substitute for it.

Cure shape: for doctrine-only landings, default to three reviewers per cycle
unless the substrate is security-class or API-class. Reserve larger fan-out for
cases where the extra lenses are structurally required, not where the author
has skipped the landscape read.

Falsifiability: a reviewer finding says, in substance, "the plan-author should
have caught this by reading existing PDR/ADR/rule material" in another
doctrine-heavy planning session.

### Status maturity inversion for deferred substrate decisions

Metadata:

- captured: 2026-05-25
- source: Briny Fathoming Dock role-metacognition session
- target: adr-or-pdr:deferred-substrate-status-discipline
- trigger: second deferred-substrate status mismatch
- size: S
- status: pending

Substrate phenotype ADRs usually land `Accepted` alongside implementation.
Landing an ADR as `Accepted` while the paired PDR is still `Candidate` and the
implementation is deferred creates a maturity mismatch: future agents may read
the ADR as decided and validated when the doctrine is still unimplemented.

Cure shape: use `Status: Proposed` for a repo-bound substrate ADR when the
paired PDR is still candidate-stage and implementation is deferred. Move to
`Accepted` on the first worked instance of implemented substrate.

Falsifiability: a second deferred substrate ADR/PDR pair lands with status
pressure between proposed doctrine and unimplemented phenotype, or a reviewer
flags a future `Accepted` ADR whose implementation evidence is absent.

### Closeout is a state declaration, not a behavioural commitment

Metadata:

- captured: 2026-05-25
- source: Hushed Stalking Shade post-closeout reflection
- target: skill-amend:start-right-team-reduced-bootstrap-closeout-reinvitation
- trigger: second bounded-reinvitation-after-closeout
- size: S
- status: pending

An agent who emits final-heartbeat-end plus team-member-closeout has truthfully
said "I am standing down at this moment." A subsequent owner invitation to
engage is a new turn, not a contradiction of the prior closeout.

Cure shape: bounded reinvitation after closeout should name a reduced-bootstrap
mode for single-write reflection or owner-requested note capture. Full watcher
and heartbeat infrastructure is for extended presence, not every one-off
post-closeout write.

Falsifiability: a second session receives a bounded owner reinvitation after a
formal closeout, and the agent needs to distinguish one-off capture from full
team re-entry.

### Plan-template friction surfaced during human-composer-tui authoring

Metadata:

- captured: 2026-05-25
- source: Hushed Stalking Shade human-composer-tui plan authoring
- target: plan-templates-or-skill:plan-templates-refresh
- trigger: owner aside 2026-05-25 + third plan-authoring friction instance
- size: M
- status: pending

Authoring the 786-line `human-composer-tui.plan.md` against the planning skill
surfaced three template-shape observations that may compose into a template
refresh slice:

1. Markdownlint MD032 friction around `**Acceptance**:` followed immediately by
   a bullet list.
2. A load-bearing `## Assumptions` block, with PDR-026 falsifiability, was
   reviewer-demanded but template-absent.
3. A `## Cross-references` section with explicit categories is now well-formed
   across `comms-watch-storage-redesign.plan.md` and
   `human-composer-tui.plan.md`, but not present in the feature-workstream
   template.

Natural home: refresh `.agent/plans/templates/feature-workstream-template.md`,
or ratify the requirements in `.agent/skills/plan/SKILL-CANONICAL.md` so the
template inherits structurally.

Falsifiability: a third plan-authoring session in the next consolidation
cadence repeats the same three frictions.

### Human-composer-tui plan landing

Metadata:

- captured: 2026-05-25
- source: Hushed Stalking Shade
- target: audit-trail
- trigger: plan-completion landing reference
- size: S
- status: graduated

`.agent/plans/agent-tooling/current/human-composer-tui.plan.md` was authored
at `97a470dd`, cross-linked at `d735fce9`, and listed in
`agent-tooling/current/README.md` at `5344ab5b`. The plan body is the durable
substance; this entry exists only to help future agents locate the plan from
the pending-graduations register.

### Multi-agent auto-fix awareness

Metadata:

- captured: 2026-05-25
- source: Hushed Stalking Shade post-closeout broadcast + experience files
- target: rule:multi-agent-auto-fix-awareness
- trigger: second-instance
- size: S
- status: pending

Before running any repo-wide auto-fix command in a multi-agent window, name the
peer-owned files in the working tree and confirm whether the auto-fix should
touch them. Examples include `pnpm markdownlint:root`, `pnpm format:root`, and
similar whole-repo fixers. The `husky` pre-commit hook chain promotes auto-fix
output into the staged set; this is correct in a single-agent window and a
commit-attribution hazard in a multi-agent window.

Worked instance: commit `78a90723` (2026-05-25, Hushed Stalking Shade).
`pnpm markdownlint:root` fixed Hushed's intended markdown issue and also
touched four Stormy Surfing Dock plan-freshness files under Stormy's active
claim. A hook-side `git add` also added an untracked plan file. Both Hushed and
Stormy diagnosed the event as a sweep incident whose substance could remain
landed while attribution drift had to be captured.

Composition: this candidate narrows
[`monitor-branch-touched-files`](../../rules/monitor-branch-touched-files.md)
to repo-wide auto-fix commands whose working-tree footprint is invisible at
invocation time.

Falsifiability: a second multi-agent session has the same sweep incident with
a different repo-wide auto-fix command, or the same command in a distinct
agent/session window.
