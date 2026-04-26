# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in the register at
[`../operational/repo-continuity.md § Deep consolidation status`](../operational/repo-continuity.md#deep-consolidation-status).

---

## 2026-04-26 — API consumer boundary + ooc-issues thread refresh (Cursor / GPT-5.5 / Codex)

**Surprise (minor):** external issue **Issue 1** listed HTTP paths and a
"progressions" contrast that the published OpenAPI snapshot in
`oak-sdk-codegen` does not enumerate; the report had to be reconciled to
**observed/expected/impact/reproduce** and to label **stale** the old
`oak-openapi-bug-report` GraphQL list snippet (list handler now uses
`published_mv_threads_1`, not `threads`).

**Lesson:** consumer docs must stay aligned with the **public contract** and
**this monorepo’s boundary** (API-only; no direct MV/Hasura) — see
`docs/architecture/openapi-pipeline.md` **Consumer data boundary**. RCA on
`oak-openapi` belongs in the issue file as *informational*, not as ecosystem
work items.

**Promotion trigger:** N/A (documentation capture). Distillation candidate
only if the API-only boundary repeats as a near-violation.

---

## 2026-04-26 — Sharded Stroustrup — alignment-check before per-system claim validation

**Surprise**: when validating an observability claim across local
git, GitHub, Vercel, and Sentry, I jumped straight from "Sentry shows
last_commit `9bcc8ffc` not current HEAD `66de47a2`" to a hypothesis
about Sentry release-publish idempotency without first establishing
which systems were actually aligned. Owner caught this:
*"validate your assumption ... by comparing local head, github head,
and the Vercel preview build latest state, to see what commit each is
at. All changes should be pushed before a validation like this."*

**Lesson** (candidate for distilled.md graduation): **before
investigating per-system observability claims, run an alignment
check across all relevant systems first**. For a Vercel/Sentry/GitHub
observability stack, that means:

1. local HEAD == origin/<branch> HEAD (no unpushed commits)
2. local working tree clean OR all unstaged changes are out of scope
3. Vercel latest deployment SHA == origin HEAD SHA
4. Sentry last_deploy timestamp post-dates the latest Vercel deploy
   AND Sentry last_commit == origin HEAD SHA
5. GitHub PR head SHA == origin HEAD SHA

If any of these disagree, **establish why before claiming anything
about runtime correctness**. Otherwise you may be testing the wrong
artefact entirely.

In my session (2026-04-26): items 1, 2, 3, 5 passed; item 4 failed
(Sentry last_commit was `9bcc8ffc`, four commits behind origin HEAD).
Investigating WHY revealed: Turbo build-task caching skipped fresh
Sentry plugin runs for the four post-`9bcc8ffc` commits because
production code didn't change — so the cached log replay covered the
entire MCP-HTTP build. **Mechanism is Turbo cache, NOT Sentry
release-publish idempotency** (my initial Phase 2 hypothesis was
wrong about the mechanism, right about the outcome).

**Promotion trigger**: second instance of "alignment-check skipped
on observability validation" or owner direction.

**Pattern candidate name**: `alignment-check-precedes-claim-validation`
(sibling to `workspace-first-before-external-tooling`).

---

**Rotation**: 2026-04-25 (Jiggly Pebble consolidation, after WS0 of
the multi-agent collaboration protocol landed at `63c66c88`).
Outgoing napkin (1422 lines, sessions 2026-04-22 through 2026-04-25,
including the WS0 landing session and the parallel observability-
thread agent's pushed-handoff entry) archived to
`archive/napkin-2026-04-25.md`.

Distillation merged into `distilled.md`:

- **Multi-agent collaboration** section pointing at the new
  `agent-collaboration.md` directive, the shared communication log at
  `.agent/state/collaboration/log.md`, and the two foundational
  tripwire rules (`dont-break-build-without-fix-plan`,
  `respect-active-agent-claims`).
- **Reviewer phasing** — adversarial structural reviewers (Wilma)
  catch boundary / threat-model / lifecycle; pre-landing reviewers
  (`docs-adr`, `assumptions`) catch citation-level and observability
  gaps. Sequence the two distinct phases.
- **ADR/PDR citation discipline** — verify filename and substance
  against the live decision-record file before citing; plan-body
  glosses are shorthand, not authoritative.

Pattern candidates retained in the pending-graduations register at
`repo-continuity.md § Deep consolidation status`:

- *the-frame-was-the-fix* — **graduated 2026-04-25** to
  [`.agent/memory/active/patterns/the-frame-was-the-fix.md`](../patterns/the-frame-was-the-fix.md)
  after cross-experience scans across two consolidate-docs runs
  reached the same conclusion (six original instances + a
  frame-held variant from the WS0 landing session; eight instances
  total).
- *advisory-not-enforced for agent-participating systems* (WS0
  landing provided same-day operational evidence; trigger remains
  "second cross-system instance").
- *operational-seed-per-workstream for protocol plans*.
- *discussion-before-absorption gate per adversarial-review output*
  (sibling to PDR-015 assumption-challenge gate).
- *tripwire-rules-need-observable-artefacts* (new this rotation,
  surfaced by `assumptions-reviewer` on `respect-active-agent-claims`
  during WS0 landing).
- *parallel-track-pre-commit-gate-coupling* — **graduated 2026-04-25**
  to [`.agent/memory/collaboration/parallel-track-pre-commit-gate-coupling.md`](../collaboration/parallel-track-pre-commit-gate-coupling.md)
  as the founding entry of the new collaboration-patterns memory
  class (WS2 of the multi-agent collaboration protocol). Three
  instances (Frodo prettier 2026-04-24, Pippin auto-staging
  2026-04-24, Jazzy knip 2026-04-25) preserved in the archived
  napkin.

Prior rotations: 2026-04-22 (sessions 2026-04-22 through 2026-04-24,
archived to `archive/napkin-2026-04-22b.md`); 2026-04-22 (sessions
2026-04-19 through 2026-04-21, archived to `archive/napkin-2026-04-22.md`).

---

## 2026-04-25 — Fresh Prince — WS1 landing and owner-directed pause

**Surprise: the protocol applied to itself, bidirectionally, in the
landing session.** WS1 of the multi-agent-collaboration-protocol was
implemented while the WS0 surfaces were live. I declared intent in the
shared communication log at session-start, ran four reviewers in parallel during
implementation, and the parallel Jiggly Pebble session (observability
thread, PR-87 quality-finding analysis) appended their own
shared-communication-log
entry mid-session declaring explicit non-overlap with WS1 surfaces.
The protocol's first bidirectional coordination event happened during
the very landing commit that promoted the shared communication log to a structured
registry. Not surprising as design *ambition*; surprising as observed
*reality* without any further iteration. The "knowledge and
communication, not mechanical refusals" frame held in production for
two independent sessions on the same day.

**Surprise: the assumptions-reviewer caught my own rule violating the
register's named pattern.** The pending-graduations register has a
candidate `tripwire-rules-need-observable-artefacts` (originally
captured 2026-04-25 by `assumptions-reviewer` on
`respect-active-agent-claims` during WS0 landing). My WS1 rule draft
had an unobservable no-overlap branch — an agent who skipped
consultation and just registered a claim was post-hoc indistinguishable
from one who consulted and found no overlap. This is the **third
instance** of the same pattern. I absorbed the finding by mandating a
`notes` artefact on no-overlap claims (or a shared-communication-log entry on
fast-path). Promotes the pattern from candidate to ADR/PDR-ready —
captured in 6b below.

**Surprise: owner-directed pause is itself a load-bearing planning
move.** Mid-session, owner directed pause of WS3/WS4/WS5 on evidence
gate, which I'd been quietly deprioritising as "the next thing." The
pause is the *correct* move (WS5 IS the evidence harvest; landing WS3
without overlap-conversation evidence would freeze schema decisions
prematurely). The reflexive "next workstream is next" assumption was
suppressing the simpler answer: stop and let evidence accumulate.
Captures the practice's first question — *could it be simpler without
compromising quality?* — at the **workstream-sequencing** level, not
just within a single workstream.

**Correction: long URLs in markdown reference-link declarations
flagged as prose-line-width violations.** Bit me three times during
WS1 (ADR-150 link target; protocol-plan link in two operational
files). The fitness validator's `kind: 'prose'` classifier
(`scripts/validate-practice-fitness.mjs:185-221`) recognises
frontmatter, code-fences, and tables, but not markdown reference-link
declarations (`[label]: url`). Workaround during WS1: shortest-possible
alias keys (`[p]:` rather than `[protocol-plan]:`) so the URL fits
under 100 chars. Long-term either: (a) rename ADRs to shorter slugs,
or (b) upgrade the validator to recognise `^\[[\w-]+\]:` as a
non-prose line kind. Captured for graduation register.

**Correction: structured pause needs five surfaces, not three.** The
pause itself was clean (one commit, all gates first try) but required
touching: (1) source plan YAML todos + body Status section, (2)
thread next-session record, (3) repo-continuity Active Threads, (4)
roadmap Adjacent entry, (5) current-plans README. Five surfaces per
pause is high — there's a structural pattern here worth capturing
(see 6b candidates).

**What worked: parallel reviewer dispatch caught complementary
issues.** Fred caught state-vs-memory boundary correctness; config
caught the schema additive-only / `additionalProperties: false`
internal contradiction; assumptions caught the unobservable tripwire
branch and the missing `freshness_seconds` rationale; docs-adr caught
the step-7e anchor parity gap and the ADR-150 plain-text reference.
Four lenses, four orthogonal finding sets. The investment in
parallel-dispatching paid off — sequential dispatch would have been
~4× slower and produced the same set.

## 2026-04-25 — Fresh Prince — register-promotion pass and the protocol's first multi-turn dance

**Surprise: the protocol's first multi-turn coordination dance under
real concurrent load.** Keen Dahl was working PR-87 Phase 0 on the
observability thread while I was running the register-promotion pass
on the agentic-engineering-enhancements thread. We both claimed
`repo-continuity.md`, `active-claims.json`, `log.md`. **Three back-and-
forth turns** via the structured registry plus shared communication log: my
overlap-ping → Keen Dahl narrowed their claim and added a heartbeat →
both commits landed cleanly with additive merges. The `heartbeat_at`
field saw its first real use in production coordination, not just
self-application. The protocol passed under conditions it was
designed for — concurrent agents, shared surfaces, no orchestrator —
without anyone needing to retreat to mechanical refusal or owner
escalation.

**Surprise: instance-count-as-trigger is the wrong measure for
owner-correction graduations.** The user explicitly named this:
"multiple occurrences is not the right measure, we need to evaluate
them and choose if and how to promote." Three of the four
owner-correction items had no second instance, but on substance one
was already-graduated (direct-answer in user-collaboration), one had
clear small landing site (fitness-compression in consolidate-docs §
9), and one generalised cleanly to a PDR-018 amendment (plan-placement).
The trigger condition format itself ("second instance, or owner
direction") creates an asymmetric gate where instance-count gates
forever even when substance is ready and owner-direction gates
trivially. Worth recording: **owner-direction-triggered candidates
should be evaluated on substance at consolidation, not held
indefinitely waiting for an unlikely second instance.**

**Correction: I added a register entry for `tripwire-rules-need-
observable-artefacts` as a NEW row instead of updating the existing
1-instance entry to 3 instances + `due`.** The duplicate sat in the
register through one commit before the metacognition step caught it.
Lesson: **before adding a register entry, check for an existing
entry on the same candidate and update-in-place rather than appending
a sibling.** Captured in the metacognition observation that the
register accumulates without cross-cutting review.

**What worked: PDR-003 care-and-consult under self-direction.** Three
Practice Core PDR amendments landed in one commit. PDR-003 says
"owner approves each amendment before editing Core surfaces" — the
owner pre-approved the substance ("yes to promoting everything that
is ready") and I drafted-and-landed in the same turn. The drafts
faithfully captured the substance the owner approved. The discipline
worked because the substance had been precisely surfaced before
approval, not handed over as "do whatever you think is best."

**What worked: the consolidate-docs cross-experience scan caught a
register-hygiene problem.** Without the metacognition pass before
listing the register, I would have presented 17 entries entry-by-
entry and missed the duplicate, the stale-graduated, and the two
mergeable siblings. The cross-cutting view turns 17 decisions into
~5 decisions plus housekeeping.

<!-- New session entries appended below this line. -->

## 2026-04-26 — Keen Dahl session (VERCEL_BRANCH_URL bug + magic-strings refactor + next-session plan)

### What surprised me

**The bug was sitting in plain sight in tests that "passed".** The
`release.unit.test.ts` fixture was `https://feat-x-poc-oak.vercel.thenational.academy`
and the production code was `new URL(branchUrl).hostname`. Both
"agreed" on the wrong contract. The schema-first directive's
`§Test Data Anchoring` warns about this exactly: *"Tests that agree
with code on the wrong contract are worse than no tests."* I knew
that principle and still missed the bug for a session and a half
before the owner pointed at the real Vercel docs. Tests passing is
necessary but not sufficient evidence of correctness; the question
"do my fixtures match the production shape?" needs a separate gate.

**Workspace-first applies to packages, not just diagnostic logs.**
Three times in one session I missed that the workspace already had
what I was about to propose: (1) the smoking-gun build log was in
`vercel_logs/`, (2) `gh pr checks 87` listed Vercel as a 4th failing
check the brief omitted, (3) `@oaknational/env` already had the
schema infrastructure I was about to duplicate. Same shape three
times. Captured all three as memories. The general principle:
**before proposing infrastructure, search the workspace; before
investigating a failure, search the workspace; before trusting a
brief's enumeration, search the workspace.**

**Half-applied refactors look like full ones until lint says otherwise.**
I added `RELEASE_ERROR_KINDS` as the runtime constant + derived type
but left call sites using magic strings. ESLint caught it via
`@typescript-eslint/no-unused-vars` ("constant is only used as a
type"). Owner reframed: that lint rule isn't *opposing* the
constant-type-predicate pattern, it's *catching the half-applied
state*. The full pattern is (1) `as const` constant + (2) derived
type + (3) call sites use the constant; the lint rule fires when
(1)+(2) exist but (3) is missing. Same fix, different framing —
"satisfy lint" is the wrong frame, "complete the pattern" is the
right one.

### What worked

**Subagent transcript recovery** — when the assumptions-reviewer
ran out of credits, the full transcript was on disk at
`~/.claude/projects/<project>/<session>/subagents/agent-<id>.jsonl`
including every tool call. I read what the prior agent had already
processed and briefed a fresh dispatch with that context as a
"don't re-read these in full" preamble. The retry delivered a
substantive review (3 MAJOR + 2 MINOR + 2 POSITIVE) in 3 tool uses
instead of timing out again. Captured as `feedback_subagent_transcript_recovery`.

**Cross-reviewer absorption catches things one reviewer misses.**
code-reviewer NIT-6 (assumptions-reviewer routing for net-new
findings) and assumptions-reviewer MAJOR-C (Phase 5 boundary leak
on PR-87 plan-body edits) are the same finding from two angles —
one names the specialist, the other names the trigger condition.
Combining them gives the cleanest absorption: the trigger condition
re-dispatches the specialist. **Two reviewers is genuinely better
than one when their lenses are different.**

**Defer-validation-to-actual-execution at config-load boundaries.**
`vitest.smoke.config.ts` was throwing on missing Elasticsearch creds
at module-load — but `pnpm knip` loads vitest configs to discover
entry points and never runs the tests. Same fix shape as the smoke
test categorisation question itself: the *test files* are correctly
categorised, but the *config-evaluation side effect* was conflated
with *test execution*. Defer the validation to `setupFiles` (which
only runs at execution time) and the config loads cleanly for
static analysis.

### Corrections / mistakes

**I framed PR #87's failing Vercel check as "Phase-1+ work"** at the
end of the original session. Owner correction: "all gate failures
are blocking at all times, regardless of cause or location" — this
is a literal repo principle, not a slogan. Pre-existing red gates
do not get rebadged as "later work" just because they predate the
current session. The bug-fix that unblocked the gate was a 1-line
regex change and an extra Zod refinement; the inhibitor wasn't
effort, it was framing.

**I proposed adding a Zod schema to `sentry-build-environment.ts`**
without surveying `@oaknational/env`. The owner's correction
("we already have this infrastructure") triggered three findings:
the existing `SentryEnvSchema` exists in `core/env`; the
`@oaknational/env-resolution` `resolveEnv` already does the
schema-validate-then-narrow flow; and `@oaknational/env` was the
right home for the new `BuildEnvSchema`. The rework was small once
diagnosed but the *original proposal* would have created a parallel
implementation.

### Pattern candidates (for register update at next consolidation)

- **Test fixtures encoding the same wrong assumption as production
  code** — instances: `BRANCH_URL_FEAT_X = 'https://...'` in two
  separate test files. Both test files passed. Both had to be
  rewritten with realistic shapes. Pattern candidate: *captured-
  real-shape regression tests as the only defence against
  fixture-code conflation*. Likely cross-cuts other test data.

- **Workspace-first across artefact classes** — three captured
  instances in one day (logs, PR-state, packages) suggests a
  general principle: **before consulting external systems or
  proposing new infrastructure, exhaust workspace inventory.** May
  warrant lifting from feedback memories to a Practice rule. The
  three feedback files name the specific failure modes; a single
  rule would name the general class.

- **Half-applied constant-type-predicate as a lint-detectable state**
  — `@typescript-eslint/no-unused-vars` already catches the (1)+(2)
  half; a custom `prefer-runtime-constant-over-string-literal` would
  catch the (3) half. The future plan
  `recurrence-prevention-after-vercel-branch-url-bug.plan.md`
  already names a related rule (`no-bare-discriminator-union`); the
  two could be one rule with two failure modes.

- **Config-load side effects vs test-execution side effects** — the
  smoke-config issue is the canonical instance. Pattern candidate:
  *config files MUST be safely loadable for static analysis without
  the resources their tests require*. Generalisable across vitest,
  ESLint, prettier, knip, depcruise — any tool that loads configs
  to discover entry points.

## 2026-04-26 — Codex — collaboration-plan exploration

### Observations

**Paused plan state can lag behind its evidence surfaces.** The
multi-agent collaboration plan and thread record still said, before
this refresh, that the paused-on-evidence gate had one coordination data
point. The shared communication log later recorded a third/fourth real
coordination event and explicitly said this should be surfaced for owner
inspection without auto-resuming WS3+. Behaviour change: before treating
a paused evidence gate as still below threshold, read the evidence surface
named by the plan (`.agent/state/collaboration/log.md`, closed claims,
and napkin) rather than trusting the status block alone.

**Platform independence note should become doctrine, not just plan
commentary.** The owner's new plan note strengthens an existing
theme: platform-specific agent-team features may help build the
repo-owned collaboration system, but they must never become an
operational dependency of it. This fits ADR-125/PDR-009 style
canonical-first portability: markdown/JSON/rules/commands/skills are
the system substrate; platform-native collaboration features are
optional build aids and evidence sources, not part of the protocol.

**General principle: platform agnostic by default, platform specific by
choice.** Where something can be platform agnostic, it should be. We use
platform-specific tools to our advantage, but at every turn we strive for
platform independence as a core value and intent. Platform-native systems
may feed lessons back into repo-owned surfaces; they must not become the
operational surface itself.

### Metacognition / Handoff

**Best next step: harvest before building.** The evidence threshold appears
met, but the impact the owner asked for is better judgement, not automatic
forward motion. The next constructive move is an owner-directed WS5 evidence
harvest: read the shared communication log, claims, and napkin observations,
then decide whether WS3's conversation/sidebar schema is still the right
next implementation. Starting WS3 without that harvest would recreate the
stale-status problem in a subtler form.

**Operational constraint: finish repo-level handoff after the active claim
clears.** Session-handoff wants `repo-continuity.md` updated, but Sharded
Stroustrup owns that file right now. The honest bridge from action to impact
is to leave the thread record precise, leave a log note, and make the
repo-continuity reconciliation falsifiable once their claim closes.
