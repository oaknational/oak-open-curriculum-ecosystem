---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in the repo-continuity
[`Deep consolidation status`](../operational/repo-continuity.md#deep-consolidation-status)
register.

The previous active napkin was archived during the 2026-04-29 deep
consolidation pass at
[`archive/napkin-2026-04-29.md`](archive/napkin-2026-04-29.md). It
carries the full record of the 2026-04-28 / 2026-04-29 session arc
(sector engagement, PR-87 Phase 2.0.5, TS6 migration, Vercel-build
unblock, doctrine sharpening). High-signal entries from that arc were
graduated to canonical surfaces during the 2026-04-29 consolidation;
the archived file remains the durable narrative record.

## 2026-04-30 — Substrate-vs-axis: invent-justification as completeness signal (Vining Ripening Leaf)

**Working principle surfaced.** When you find yourself writing prose to
*justify* a structural exception, the categorisation is incomplete — not
the exception unusual. The invented justification is the signal.

**The instance.** I drafted a strategic plan
([`observability-config-coherence.plan.md`](../../plans/observability/future/observability-config-coherence.plan.md))
that didn't fit the five-axis observability frame. I added it to the
future-plans table but deliberately *did not* place it in the five-axis
coverage table — and wrote a justification ("cross-cutting infrastructure
rather than axis-specific telemetry") to explain the avoidance. The
justification was load-bearing but unrecorded. Owner asked: "do we need to
call out the existence of cross-axis concerns explicitly?" The answer was
yes — the invented justification was the signal that the categorisation
was missing a category.

**What landed.** The substrate-vs-axis distinction now lives as a reusable
plan-collection convention at
[`.agent/plans/templates/components/substrate-vs-axis-plans.md`](../../plans/templates/components/substrate-vs-axis-plans.md).
The observability collection's high-level plan now carries a §Substrate
section indexing six substrate plans. ADR-162 §"Closure Property and Test
Gate" gained a one-line ADR-to-plan bridge and a history entry.

**Generalisable.** The "invent-justification = categorisation incomplete"
shape applies beyond plan collections: type unions, ADR categories, lint
rule categories, anywhere a classification system meets edge cases.
Captured in the component's §"Working principle" so future authors find
the heuristic before they paper over an exception.

**PDR candidate** in the pending-graduations register; trigger is owner
direction OR second multi-axis collection adopting the substrate shape.

## 2026-04-29 — Doctrine sharpening + deep consolidation pass (Nebulous Illuminating Satellite)

**Pointer entry.** The substance of this session has graduated to
canonical surfaces; the napkin entry stays as a pointer per the
just-sharpened "Knowledge Preservation Is Absolute" rule (the second
valid response: thoughtful holistic promotion to permanent homes).

### Doctrine sharpenings landed

Owner directed two related sharpenings, motivated by recurring
instances of the underlying pattern across recent sessions
(TS6-migration fitness truncation, sed-bypass-of-Edit, claim-blocking-
on-shared-state, log-jam pressure on comms log):

1. **Knowledge preservation is absolute.** Writing to shared-state
   knowledge surfaces (napkin, distilled, patterns, thread records,
   repo-continuity, comms log, conversations, escalations, claims) is
   NEVER blocked by fitness limits. Two valid responses to a budget-
   pushing write: (a) write in full and flag the file for attention;
   or (b) thoughtful holistic promotion of mature concepts to
   permanent homes via the consolidate-docs §7 graduation scan. Naive
   cutting, compression, summarisation, or skipping the write are all
   forbidden. Surfaces:
   [napkin SKILL §Knowledge Preservation Is Absolute][napkin-skill-preservation],
   [consolidate-docs §Learning Preservation][consolidate-docs-preservation],
   [distilled §Process / Learning before fitness](distilled.md).
2. **Shared-state files are always writable and always
   commit-includable** regardless of any active claim — a deliberate
   anti-log-jam tradeoff. Surfaces:
   [respect-active-agent-claims §Shared-state always writable][respect-shared-state-rule],
   [distilled §Multi-agent collaboration shared-state paragraph](distilled.md).

### Deep consolidation pass outcomes

Findings, lifecycle moves, graduation decisions, and Practice Core
candidates surfaced during this pass live in the
[repo-continuity Deep consolidation status][repo-continuity-deep-cons]
register. The Pending-Graduations Register there is the authoritative
list of unhomed candidates carrying forward.

**Graduations landed this pass (owner-directed, post-rotation):**

- New pattern [`tool-error-as-question.md`](patterns/tool-error-as-question.md)
  (meta-pattern over hook-as-question, ground-before-framing, fitness-
  as-constraint, sed-bypass, reviewer-as-prosthetic, confirmation-
  reading; PDR-018 amendment of same date).
- New pattern [`scope-as-goal.md`](patterns/scope-as-goal.md)
  (instrumental work treated as terminal; reviewer-scope-equals-
  prompted-scope; PDR-015 + PDR-018 amendments of same date).
- Testing-strategy directive amended: classification by behaviour
  shape (in-process vs separate-process) not by filename suffix; e2e
  no-IO discipline reaffirmed (filesystem/network forbidden; STDIO
  retained as protocol channel for stdio-transport systems);
  no-process-spawning-in-tests reaffirmed.
- PDR-018 amendment: tool-error-as-question + reviewer-scope-equals-
  prompted-scope.
- PDR-015 amendment: brief reviewers with full merge-gate scope when
  gating merge.
- PDR-026 amendment: knowledge preservation is absolute and is never
  a deferrable landing.

**Lifecycle moves landed this pass:**

- `ci-green-for-merge.plan.md` — moved from
  `architecture-and-infrastructure/active/` to `archive/completed/`
  (PR #70 long since merged).
- `pr-87-cluster-a-security-review.md` — moved from
  `observability/active/` to `archive/completed/` (alongside
  superseded source plan).
- `sentry-release-identifier-ws3-resume.evidence.md` — moved from
  `observability/active/` to `archive/completed/` (WS3 completed).
- README tables and inbound-link references updated.

**Practice Core retirement plan now in current README:**
[`practice-core-surface-retirement.plan.md`][practice-core-retirement]
listed in the agentic-engineering-enhancements current Source Plans
table (was authored 2026-04-28 but had not been added to the index).

### Deeper convergence pass (owner-directed continuation)

Owner directed full convergence after the initial pass: address all
outstanding audit findings, carry out the retirement plan in full,
elevate `gate-off-fix-gate-on` as anti-pattern doctrine. Outcomes
(full record in [repo-continuity Deep consolidation status][repo-continuity-deep-cons]):

- New rule [`never-disable-checks.md`][never-disable] + `principles.md`
  amendment + Cursor / .agents wrappers + RULES_INDEX entry; register
  flipped from pattern-candidate to anti-pattern.
- Practice Core retirement complete: `.agent/practice-core/patterns/`
  and `.agent/practice-context/` deleted; PDR-007 / PDR-024 / PDR-014
  amended; trinity navigation updated; routing log salvaged to
  `.agent/memory/operational/archive/practice-context-routing-log-2026-04-29.md`.
- Pattern graduations from experience-audit (4 strong):
  `install-session-blind-to-cold-start-gaps`,
  `reframing-before-hardening`, `recital-loses-to-recipe-momentum`,
  `breadth-as-evasion`.
- Displaced doctrine extracted from 4 of 6 audited plans; ADR-121
  Change Log + ADR-162 § Enforcement Principles new sections;
  plan-supersession discipline graduated to consolidate-docs.
- Identity Candidates graduated from `.remember/recent.md` to
  `user-collaboration.md` §Owner Working Style.
- PR-90 thread registered in §Active Threads (Solar authored the
  record file at session open).
- 3 sub-agent reports (experience audit, trinity drift, displaced
  doctrine) feeding the register and Practice Core review.

### Surprise — "trim" framing reverted to size-target thinking

- **Expected**: naming the deferred multi-agent-collaboration-protocol
  child plan as a "plan-body trim" was a neutral description of a
  ~700-line subtractive change.
- **Actual**: owner pushback —"is it a 'trim' so much as a refinement
  of which concepts live in which homes?" The "trim" word focuses
  the work on artefact size; the actual substance is concept
  placement (each section is either canonically homed elsewhere now
  or genuine plan-scoped substance). Line count is a downstream
  consequence of correct placement, not the goal.
- **Why expectation failed**: I had just graduated PDR-026 amendment
  ("knowledge preservation is absolute") and the napkin SKILL rewrite
  ("naive cutting forbidden; thoughtful holistic promotion is the
  alternative") earlier this same session — and reverted to a
  size-frame the moment I named follow-on work. This is the
  recital-loses-to-recipe-momentum pattern firing on its own
  graduation: I authored the rule, quoted it, and bypassed it under
  recipe momentum. Companion of install-session-blind-to-cold-start-
  gaps: the install session's confidence is context-blind to its
  own future bypasses.
- **Behaviour change**: when naming follow-on work that acts on a
  surface where doctrine has graduated, name the substance as
  concept placement (where does each concept live now?), not
  artefact size. The "trim" / "compression" / "size reduction"
  vocabulary smuggles the size-frame back in. Renamed the child
  plan file to `multi-agent-collaboration-protocol-concept-home-refinement.plan.md`,
  reframed the body, parent coordination doc, and register entry.
  Captured here as a third instance of the recital-loses-to-recipe-
  momentum pattern within a single session arc (counts as evidence
  for promotion of that pattern from provisional to graduated).

[practice-core-retirement]: ../../plans/agentic-engineering-enhancements/archive/completed/practice-core-surface-retirement.plan.md
[never-disable]: ../../rules/never-disable-checks.md

### Behaviour change for future sessions

When approaching a write to a shared-state surface near or over its
fitness target/limit, the cognitive sequence is:

1. Write the insight in full.
2. Decide between (a) flag the file for attention, or (b) thoughtful
   holistic promotion of stable mature content to a permanent home.
3. Never (c): trim, compress, summarise, defer, or skip.

When deciding whether a shared-state edit can land in a commit while
another agent has an active claim on that area: the answer is always
yes for shared-state files, regardless of the claim. The only
serialisation mechanism is the commit queue / `git:index/head` window.

[napkin-skill-preservation]: ../../skills/napkin/SKILL.md#knowledge-preservation-is-absolute--fitness-is-never-a-constraint
[consolidate-docs-preservation]: ../../commands/consolidate-docs.md#learning-preservation-overrides-fitness-pressure
[respect-shared-state-rule]: ../../rules/respect-active-agent-claims.md#shared-state-files-are-always-writable-and-always-commit-includable
[repo-continuity-deep-cons]: ../operational/repo-continuity.md#deep-consolidation-status

## 2026-04-29 — Repo goal narrative refresh (Pearly Swimming Atoll)

### What Was Done

- Refreshed live repo-goal narrative surfaces so public docs, technical
  READMEs, planning indexes, Practice intro docs, and targeted ADR notes all
  name the same purpose: MCP Apps exploration, sector reuse of Oak's openly
  licenced curriculum, OpenAPI-to-MCP pipeline reuse, hybrid search + APIs +
  MCP + knowledge graphs, reusable building blocks, and the self-improving
  Practice.
- Final live-surface sweep also caught the MCP landing-page string still using
  the US-spelled licence phrase, plus adjacent search SDK/search-doc index
  surfaces that deserved the same hybrid-search framing.

### Practice/tooling feedback

- **Surface**: `agent-tools:collaboration-state`
- **Signal**: friction
- **Observation**: `claims open` accepts repeated `--file` flags, but a shell
  glob such as `--file docs/foundation/**` expands before the helper sees it
  and produces an `unknown argument` failure.
- **Behaviour change / candidate follow-up**: Quote claim path globs every
  time, and consider documenting that in the collaboration-state usage examples.

### Surprise

- **Expected**: Rendering the shared communication log after appending a valid
  event would succeed.
- **Actual**: Rendering failed because three existing comms event files used
  `occurred_at` / `agent_id` / `subject` but not the current `created_at` /
  `author` / `title` fields expected by the parser.
- **Why expectation failed**: Mixed comms-event shapes can coexist in
  untracked shared-state files before the render helper validates them.
- **Behaviour change**: When `comms render` fails on schema shape, inspect the
  event files and make a narrow shared-state repair instead of bypassing the
  log. Shared-state repair is explicitly allowed when it keeps coordination
  surfaces usable.
  Source plane: operational

### Handoff and Light Consolidation

- Session handoff updated the sector-engagement next-session record with the
  repo-goal narrative refresh landing evidence and next safe step.
- Light consolidation found no new ADR-shaped or PDR-shaped decision beyond the
  current framing notes already added to ADR-119, ADR-141, ADR-157, and the ADR
  index. The session's durable insight is already homed in live docs and the
  tooling surprise above remains captured for a future collaboration-state
  ergonomics pass.
- Entry-point sweep found `AGENTS.md` carrying a duplicate rules-index line
  even though `.agent/directives/AGENT.md` already owns that instruction. The
  root entry point was reduced back to the canonical pointer-only shape.
- Commit handoff is currently blocked by a pre-existing staged bundle from
  another session. Per the commit skill, do not open this session's commit
  window until the owner confirms whether to unstage that bundle or the other
  owner completes it.

### Mistake

- While posting the peer-bundle notice, I put a command name in backticks inside
  a double-quoted shell argument. `zsh` treated it as command substitution,
  attempted the command, and dropped the command text from the first event body.
  I posted a corrected follow-up event without shell-special characters. Avoid
  backticks in shell-quoted CLI prose; use plain text or a safely quoted file
  input when a command body matters.

### Commit Queue Experience

- Manual queue handling was needed because the index already held a peer bundle
  before this session could stage its scoped narrative-refresh commit. The safe
  sequence was: ask owner before touching the index, unstage only after explicit
  approval, explain the index-only change in shared comms, open a fresh
  `git:index/head` claim, enqueue the exact file list, stage explicit pathspecs,
  stage one mixed file hunk-by-hunk, validate the commit message before commit,
  verify the staged fingerprint, then commit.
- Behaviour change: when the index is not empty at commit time, treat it as a
  collaboration event rather than an inconvenience. First preserve the peer's
  worktree contents, then make the index ownership change visible to the peer,
  and only then proceed with a fresh queue entry.

## 2026-04-29 — PR #90 closure session (Solar Threading Star)

### Surprise 1 — vitest as harness for "lint the repo state" misclassified the test

- **Expected**: my Phase 4 helper + unit tests + integration test followed
  the "canonical pattern" set by `validate-portability.integration.test.ts`.
- **Actual**: when the owner asked "are these tests doing the right thing
  at the right level with the right tools", reading testing-strategy.md
  cold revealed the integration test was a **validator-script wearing a
  vitest harness**. testing-strategy.md §Test Types names exactly this:
  "Validation scripts that require external resources should be standalone
  scripts, not tests." My "integration test" walked the real repo FS and
  asserted a property of repo state — that's not testing code behaviour;
  it's running a validator. The fact that 5 existing peers in `scripts/`
  did the same thing was not canon, just shared drift.
- **Fix**: deleted the integration test; created
  `scripts/validate-no-stale-script-invocations.ts` as a standalone runtime
  following the `validate-eslint-boundaries.ts` shape; wired into
  `pnpm test:root-scripts`. Unit tests stayed (they test the pure helper —
  legitimate); collapsed three near-duplicate cases into one `it.each`
  parameterised proof; added the missing edge case (two matches on same
  line).
- **Pattern shape note**: "look at peers" is a useful first orientation,
  but peers can be drift. The canonical-pattern test is:
  does it match the named guidance in the directives, not just what other
  files in the same directory do?

### Surprise 2 — `scripts/` is an undeclared tier; the whole validator family needs migration

- **Expected**: aligning with `validate-portability.ts` etc. as the
  "canonical pattern" was the right architectural call.
- **Actual**: the owner immediately raised "anything complex enough to
  need tests MUST be moved into a proper workspace". Four parallel
  architecture reviewers (Barney/Betty/Fred/Wilma) confirmed: `scripts/`
  is not in `pnpm-workspace.yaml`, not in ADR-041's tier table, not in
  `eslint-plugin-standards/boundary.ts`. Yet it hosts ~2,335 lines of
  validator logic (`validate-portability` 553L, `validate-practice-fitness`
  685L, `validate-fitness-vocabulary` 216L, `validate-subagents` 230L,
  `validate-eslint-boundaries` ~80L, plus my new ~250L). All have helpers
  - unit (some + integration) tests. The pattern is invisible to the
  workspace tooling estate (depcruise, boundary rules, type-check, turbo).
- **Fix**: future + current plans authored
  (`scripts-validator-family-workspace-migration.plan.md`); Phase 0
  resolves the Build-vs-Buy via assumptions-reviewer (default
  `agent-tools/`; Betty argues for new workspace on cohesion grounds);
  Phase 1 pilot-migrates the new validator (zero coupling, smallest
  surface); Phases 2–6 batch the rest, fix the cross-workspace src/
  bypass in `validate-eslint-boundaries`, consolidate the duplicated
  filesystem walker.
- **Pattern shape note**: when an owner principle exists in memory and
  napkin but not yet as a canonical `.agent/rules/` file, the doctrine
  is one-sided — it can be invoked but not enforced. The current/ plan's
  Task 0.2 graduates the rule before any code moves.

### Surprise 3 — broken machine-local link refs in a pattern file the principle should have prevented

- **Expected**: the "No absolute paths" principle in `principles.md`
  prevents machine-coupled paths in repo content.
- **Actual**: `breadth-as-evasion.md` lines 105-106 had two reference-
  style markdown link definitions pointing at
  `../../../.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_*.md`.
  Both broken: the `..` chain escapes the repo into a per-user Claude
  Code memory directory that doesn't exist in any contributor's repo,
  AND the `Users-jim-code-...` segment hardcodes the original author's
  username. The principle as written treated absolute-vs-relative as the
  load-bearing distinction; the bug demonstrates the real principle is
  reachability and meaning. Sibling case: ADR-167's "absolute path"
  wording (Surprise 3 in archived napkin-2026-04-29) — same architectural
  class, different surface.
- **Fix**: principle renamed to "No machine-local paths" with three
  forbidden shapes (literal absolute paths; relative paths escaping into
  per-user surfaces; hardcoded usernames or flattened-project-id
  segments) and three permitted shapes (repo-relative; templated
  placeholders like `~/.claude/projects/<project>/`; platform-provided
  variables like `${CLAUDE_PROJECT_DIR}`). New canonical rule
  `.agent/rules/no-machine-local-paths.md` authored with full failure-
  mode catalogue, detection greps, and 3 worked examples (this bug,
  ADR-167's wording, and a templated-vs-embedded contrast). Thin
  adapters in `.claude/`, `.cursor/`, `.agents/`. Index updated.
- **Pattern shape note**: a principle that catches a class often
  catches its own author. Stated principles are necessary but not
  sufficient; structural enforcement (rule files, validators, lint
  rules) closes the gap. The same pattern fires across multiple
  surfaces: `gate-off-fix-gate-on` was just graduated as anti-pattern;
  this is the same shape applied to path-portability.

### Surprise 4 — the external-detection principle is recursively useful

- **Expected**: applying "external system catches → local detection
  gap" once to PR-90's findings would suffice.
- **Actual**: the principle catches its own meta-instances. After
  Phase 4 landed, post-push Cursor Bugbot found a duplicate heading in
  the rotated archive napkin. Investigating: markdownlint MD024 was
  globally disabled in `.markdownlint.json`. That gap was stronger than
  my closure comment had documented. Phase 5 enabled MD024 with
  `siblings_only: true` (the spike found exactly 3 genuine duplicates
  across the whole repo), fixed all three, and the rule fires going
  forward.
- **Pattern shape note**: principles that operate over a set of
  external observations apply to ALL observations from that set,
  including ones surfaced by applying the principle. Don't stop after
  the first round.
