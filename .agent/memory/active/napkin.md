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
