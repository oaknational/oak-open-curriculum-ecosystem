---
fitness_line_target: 200
fitness_line_limit: 275
fitness_char_limit: 16500
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
---

# Distilled Learnings

Hard-won rules extracted from napkin sessions. Read this before
every session. Every entry earned its place by changing behaviour.

**Source**: Distilled from archived napkins
`napkin-2026-02-16.md` through `napkin-2026-05-10.md`
(sessions 2026-02-10 to 2026-05-10).

**Permanent documentation**: Entries graduate to permanent docs
when stable and a natural home exists. Always graduate useful
understanding — fitness management handles the consequences. What
remains here is repo/domain-specific context with no natural
permanent home, plus entries explicitly held pending validation.

**Recent graduations (2026-05-10 — Quiet Lurking Mask)**: QUAR-1
reformulation landed. *apply-don't-ask* → PDR-057 (empirical-
answerability pre-question gate; discharge action is reading, not
acting; destructive-operation guard problem structurally absent).
*stop-inventing-optionality* → PDR-058 (three-tier decomposition by
impact: decision optionality subsumed by PDR-057; design optionality
routes to closed-shape cure; outcome optionality routes to
falsifiability cure). Quarantine cleared at
`.agent/memory/operational/quarantine/apply-dont-ask-doctrine.md`;
pending-graduations entry flipped to graduated; PDR README index
updated; `read-before-asking` rule back-cites PDR-057 as its
doctrinal frame; `consolidate-at-third-consumer` cross-references
PDR-058 §Surface 2 boundary.

**Recent graduations (2026-05-09)** — focused consolidation pass on
`distilled.md` (Woodland Sheltering Glade): five planning-discipline
rules → PDR-018 amendment (lead-with-narrative, CLI-first
enumeration, locally-producible-evidence-first, split-client-
compatibility, dry-run-multi-step). Sequenced-Deferral Discipline
(three modes) → PDR-026 amendment. Per-Session Closure Owns the
Loop → PDR-026 amendment. Coordination Surface Discipline +
Inter-Agent Comms First-Class Primitive → `agent-collaboration.md`
directive amendments. Repo-Specific Codegen routing pointer →
`pending-graduations.md` entry tied to SDK codegen workspace
decomposition plan. 2026-05-07 Doctor Safe-Merge rotation entries
pruned (doctrine durable in PDR-049, PDR-050,
`memory-state-substrate-contracts.md`, archived doctor plan).

**Recent graduations (2026-05-06)**: Practice-Core portability,
directive-file <30% context budget, validators-must-recompute, and
re-apply-first-question-at-elaboration-boundaries graduated to new
files in `.agent/rules/`. Discoverable+actionable plans,
parent-reconciliation, narrative-section-drift-first, and
plan-following-vs-principle-following landed in
`docs/governance/development-practice.md` § Documentation Practice.
Apparently-orphaned-claim policy landed in
`.agent/memory/operational/collaboration-state-lifecycle.md`.
Citation-directionality is in
`.agent/rules/no-moving-targets-in-permanent-docs.md`.
TDD-compositionality and the multi-agent pointer/platform-
independence paragraphs were subsumed by existing directive content
(`testing-strategy.md`, `tdd-as-design.md`,
`agent-collaboration.md`) and deleted here.

**Verdict, not menu (2026-05-11 Flamebright Burning Lava)**: when
analysis is complete and a verdict exists in the agent's own
reasoning, the agent **presents the verdict** — not as a multiple-
choice quiz. Converting completed findings into `AskUserQuestion`
form is responsibility-passback; the diagnostic is *could the agent
rank these options by evidence already in context?* If yes, the quiz
is evasion. `AskUserQuestion` is reserved for: (a) genuine permission
gates, (b) decisions only the owner can make, (c) exploration when
the agent has no strong basis for verdict. Landed structurally:
`.agent/rules/present-verdicts-not-menus.md`, RULES_INDEX entry,
Claude + Cursor adapters, `jc-plan` skill §Before Writing item 1
amendment. Doctrinal anchors:
`feedback_no_responsibility_passback` (2026-05-09),
`feedback_answer_verification_questions_directly` (2026-04-24),
PDR-057 (apply-don't-ask), PDR-058 (stop-inventing-optionality).
Origin: the pattern recurred this session *despite* both feedback
memories being in context — evidence that user-memory alone is
insufficient and rule + skill structural surfacing is needed.

**Meta-observation (2026-05-09 historical-napkin-synthesis)**: the
fitness-as-trim impulse is doctrine-resistant under context
pressure. Three independent corrections in 2026-05-06 → 2026-05-09
on the same shape — agents reflexively trimming substance when
fitness signals fire. Two structural cures captured as
pending-graduations entries: lifecycle-aware fitness model and
active inline discipline-reminder text in fitness-validator output
at non-healthy zones. Source: §F1 of the synthesis report under
`research/agentic-engineering/continuity-memory-and-knowledge-flow/`.

---

## Recently Distilled — 2026-05-12 Napkin Processing (Dusky Lurking Shade)

Distilled from the oversized second 2026-05-12 active napkin and archived intact
at [`napkin-2026-05-12b.md`](archive/napkin-2026-05-12b.md). This pass
preserves knowledge first. Fitness numbers are advisory routing signals only;
entries below are deliberately not shortened to keep `distilled.md` green. The
next consolidation stages are: process this distilled section, then process
`pending-graduations.md`, then process `practice-bootstrap.md`.

### Collaboration And Commit Discipline

- **Peer-pair review is not peer-pair commit authorship.** In a peer-pair shape,
  the implementing agent stages and commits their own bundle under their own
  queue intent; the reviewing agent gates by review verdict, not by taking over
  `verify-staged` or `git commit`. Splitting stage-and-commit across agents
  breaks the commit-queue authorship invariant and invites silent attribution
  errors.
- **The gatekeeper verifies the gate's actual state before issuing GO.** A peer's
  commit landing is necessary evidence, never sufficient evidence that a
  downstream gate has cleared. When the blocked gate was `pnpm knip`, run
  `pnpm knip` or the exact failing gate before sending a green-light message.
- **Current memory/state means this session's memory/state.** Shared memory and
  state files are writable and commit-worthy, but peer-session dirty files are
  not automatically includable by a third agent. Cross-session absorption needs
  explicit owner/coordinator authorisation or a directed request to the owning
  agent.
- **When memory/state belongs to the current session, include it in the commit.**
  Do not leave this session's dirty `.agent/memory/**` or `.agent/state/**`
  residue behind as disposable cleanup; either commit it or name the precise
  post-commit mutation that remains.
- **Commit-queue intents are exact file-list contracts.** If a hook failure or
  follow-up fix introduces extra files, abandon the old intent and enqueue a
  widened one instead of verifying extra staged paths against the original
  fingerprint.
- **New source files require claim expansion before the next edit.** When an
  implementation creates a file outside the original claim, open a supplemental
  claim or widen the claim before continuing, not after the first write.
- **Shared-state lifecycle writes should be sequential unless the tool provides a
  transaction.** Parallel claim-close or archive writes can be correct by luck
  but still violate the lifecycle discipline.
- **Detached collaboration monitors need explicit lifecycle ownership.** A
  background monitor that keeps writing comms events after its responsible
  session ends is a live protocol defect. Start, stop, expiry, and owner-visible
  status must be part of the monitor contract.
- **Before committing collaboration-state outputs, verify monitor reality.** A
  continuity note saying a monitor stopped is not proof that the process stopped;
  fresh monitor events after a stop note are live-process evidence.
- **Advisory protocols decay under pressure unless the affordance enforces them.**
  P3's `commit-queue guard` is the concrete cure shape: refuse staging unless a
  fresh same-identity queue intent and `git:index/head` claim cover the paths.
- **Active-agent visibility is necessary but still operator-facing infrastructure.**
  P4's `claims active-agents` made active/stale/inactive/uncertain states visible;
  owner feedback shows the proper next operator surface is a real collaboration
  TUI, not tailing rendered Markdown.

### Collaboration Tooling Friction

- **Every collaboration-state verb that needs `--active` must advertise it.** The
  `comms direct` and `claims active-agents` help-text omissions produced the same
  discovery failure. Audit the whole collaboration-state CLI for missing
  required-state flags or default to canonical paths where that is safe.
- **Directed-message targeting needs discoverable presence.** Requiring a full
  recipient platform/model/session-prefix tuple before any directed message
  forces a broadcast round-trip. Presence should be queryable from fresh claims
  and recent comms evidence.
- **Shared-log mentions are not an inbox.** If a message targets a named agent,
  use a directed message or make shared-log mentions show up in the recipient's
  inbox; duplicating broadcast plus direct content is protocol friction.
- **Long comms bodies need file input.** `--body-file` and `--subject-file` would
  remove shell-quoting hazards from multi-paragraph `comms send`, `direct`, and
  `append` calls.
- **Agents need a protocol-position indicator.** A `commit-queue status` style
  command should report current intent, current phase, and the next required
  action with copy-and-paste commands.
- **Missing seen-files should mean an empty seen set.** `comms inbox` failing on a
  missing `--seen-file` path turns first-run observation into setup ceremony.
- **Built-CLI smoke must cover help and real read/write paths.** Source-level
  Vitest proof does not prove the built `pnpm agent-tools` surface is current;
  smoke both action help and one actual behaviour path after unified-CLI work.
- **A hot-path missing-build error should be an operator message, not a Node stack.**
  If `agent-tools/dist` is absent or stale, the wrapper should say to build
  agent-tools first.

### Fitness And Knowledge Curation

- **Fitness is a routing signal, not a brevity target.** When knowledge surfaces
  exceed limits because they hold real state, preserve the knowledge and route the
  structural pressure to distil, graduate, split, refine, or owner-approved limit
  review.
- **Archive before compaction.** A full-file archive snapshot preserves historical
  prose verbatim and lets the live continuity or napkin surface become
  operational again without knowledge loss.
- **Status reconciliation is not silent graduation.** When a due marker is stale
  because a durable home already exists, name the home in the index and make the
  action a metadata correction, not a new doctrine promotion.
- **Consolidation candidates must stay owner-visible.** Do not silently promote
  ADR/PDR-shaped doctrine from a consolidation pass; surface candidates and route
  decisions explicitly.
- **Old comms-events are buffers, not permanent archives.** At consolidation,
  read events older than seven days for reusable substance, route any substance
  to napkin/distilled/patterns/pending-graduations/permanent docs, then delete
  the processed buffer file and regenerate the rendered log.
- **Bulk retention cleanup should be chunked and rechecked.** Generated delete
  lists are safer in small verified chunks, followed by a stale-count rerun and
  regenerated derived logs.

### Gates, Profiling, And Tool Topology

- **Speed work cannot redefine the trigger's purpose.** Optimise only the gate
  work causing false ambient failures; do not weaken pre-commit's broken-code
  guard. Knip and depcruise are higher-standard gates for pre-push, `pnpm check`,
  and CI, not commit-boundary blockers.
- **Repo-check dry graphs must stay in lockstep with root `pnpm check`.** A
  profiling graph that still says `lint:fix` after the root command moved to
  non-mutating `lint` is misleading evidence.
- **Profiling records need environment notes.** Preserve early setup failures
  such as incomplete pnpm cache, missing Playwright browsers, or sandbox launch
  limits as evidence; do not flatten them into the final product failure.
- **Use a temporary Git index for dirty-tree hook timing.** It can stage a
  representative path set without touching the real index; if sandboxed object
  writes fail, rerun the timing outside the sandbox rather than accepting a
  no-staged measurement.
- **Root workspaces with no source logic still need explicit Knip shape.** Keep
  root `entry: ['package.json']` and `project: []` rather than deleting the root
  workspace and letting Knip discover unrelated platform files.
- **Agent-tools unified CLI can land dispatcher-first.** A built `agent-tools`
  entrypoint, forwarding legacy bins, and scripts that stop rebuilding on every
  hot invocation are enough to put later topic work in the right shape.
- **Forwarded legacy topic bins need help-path smoke.** The `commit-queue enqueue
  --help` regression showed value-bearing option assumptions can break help even
  when ordinary read commands pass.
- **Vitest tests for `agent-tools` command boundaries belong under
  `agent-tools/tests/` unless config intentionally changes.** Files under
  `agent-tools/scripts/` were not discovered by the package test include.

### Skill And Documentation Surface Discipline

- **Canonical skill bodies are the review target; wrappers are pointers.** For
  cross-tool `jc-*` skills, patch `.agent/skills/*/SKILL-CANONICAL.md` first and
  let portability checks prove adapter parity.
- **Skill docs drift on command topology even when workflow intent stays right.**
  Useful audit queries look for retired command paths, retired adapter paths,
  mutating proof commands, and stale workspace CLI invocations.
- **Redundant workflow skills should be retired into always-fired homes.**
  `worktrees`, `systematic-debugging`, `review`, `receiving-code-review`, and
  `finishing-branch` were redundant with reviewer routing, AGENT guidance,
  gates, commit, plan, and consolidation surfaces.
- **Parallel-agent decomposition is plan hygiene, not a narrow skill.** Plans
  should always seek independent, parallelisable cycles when the work shape
  allows; explicit delegation detail belongs only when a cycle is handed to
  another agent.
- **Guidance methodologies are not automatically skills.** Ephemeral-to-permanent
  homing is a shared methodology for session-handoff and consolidation; patterns
  are guidance checked from normal AGENT/practice-index paths.
- **Portability validation failures found during documentation work are real
  infrastructure findings.** Missing wrappers or adapter drift should be fixed
  even when adjacent to the original scope.

### Architecture And Planning Patterns

- **Unified contracts, platform-native invocation is the right multi-agent
  orchestration shape.** Invocation stays platform-specific; contract and
  coordination layers unify. The dispatcher orchestrates contracts and existing
  comms/claims rather than making each platform look like Codex.
- **Metacognition pays off when the initial frame is slightly wrong.** Pausing on
  "Claude vs Codex invoker" surfaced the stronger question: which layers are
  platform-native, which are shared, and which already exist?
- **Explicit open questions are design artefacts.** Naming unresolved decisions
  in a strategic brief is stronger than hiding them as undefined implementation
  choices.
- **Ship the minimal primitive when the wrapper fights the discipline.** The
  `codex-exec last-message` primitive plus ADR/future-plan deferral was the
  right landing after the richer `run` wrapper exceeded complexity limits.
- **Cross-platform peer review catches errors single-agent authoring misses.**
  Codex review of Claude-authored Codex guidance caught JSONL shape, sandbox,
  timeout, and co-authoring issues that local knowledge had missed.
- **A friction-ratchet threshold can protect complex tooling work.** Two of three
  complexity-friction signals on the codex-exec workstream now require
  `assumptions-expert` before richer CLI work resumes.
- **After two cycles land, re-plan the remaining workstream backwards from the
  end-goal.** The graph-stack pass found five substantive remaining-cycle shape
  changes after only WS1.1 and WS1.2 landed.
- **Deferral needs a retrospective-review tripwire.** A concept moved to a later
  increment must carry a binding obligation to revisit shipped surfaces for
  collapse, reshape, or removal once the concept lands.
- **Plan body gate definitions can drift; landed hooks are authoritative for
  implementation cycles.** Read `.husky/pre-commit` fresh rather than relying on
  a plan snapshot of the hook.
- **Reviewer nits that align with the next planned consumer should be absorbed
  immediately.** `TripleTerm.value: ''` was a tiny RDF/JS alignment now and a
  guaranteed churn commit later.
- **For equality on large discriminated unions, use per-kind checker-array
  dispatch.** It avoids both forbidden casts and cyclomatic-complexity breaches
  when TypeScript cannot correlate two union values from an equality guard.
- **Sub-path export barrels need depcruise no-orphan exceptions at scaffold time.**
  Pre-declared package exports consumed via `package.json` have no inbound import
  yet; the scaffold checklist must include the `.dependency-cruiser.mjs`
  exception beside workspace, Knip, tsconfig, and lockfile updates.

---

## Held Pending Validation

### Hypothesis-Layer Routing for Multi-Agent Cures → `hypothesis.md` family

Multi-agent collaboration cures route through the hypothesis layer
before graduating to doctrine. Substance lives at
[`hypothesis.md`][n-agent-hypothesis] (per-primitive coordination
cures), [`falsification-criteria.md`][n-agent-falsify]
(per-primitive falsifiability), and [`experiments.md`][n-agent-experiments]
(empirical validation at N≥3). Capture → hypothesis → empirical
validation → graduate. Treated-as-hypothesis they get tested;
shipped-as-design they get defended. Substrate validated at N=2;
not yet at N≥3.

[n-agent-hypothesis]: ../../prompts/agentic-engineering/collaboration/hypothesis.md
[n-agent-falsify]: ../../prompts/agentic-engineering/collaboration/falsification-criteria.md
[n-agent-experiments]: ../../prompts/agentic-engineering/collaboration/experiments.md

---

## Recently Distilled — 2026-05-12 Napkin Rotation

Distilled from the oversized 2026-05-12 napkin. Keep under validation before
graduating to rules, PDRs, or collaboration-state docs.

- **Pre-stage sequence is non-negotiable.** Queue-list-only is not an
  active-claims read. Before staging, re-read active `git:index/head` claims,
  check directed/shared comms, enqueue intent, open the claim, then run
  pathspec-only `git add`.
- **Bare `git reset HEAD` is cross-agent destructive.** In multi-agent windows,
  unstaging requires an explicit pathspec. Whole-index reset yanks peer staged
  bundles out from under their owners.
- **Verify actual commit contents after hooks.** `verify-staged` proves the
  pre-commit bundle. Hook chains can mutate stage, so compare the post-commit
  file list back to the queued bundle.
- **Quote glob-shaped collaboration patterns.** A bare
  `.agent/state/collaboration/comms-events/**` expands in the shell before the
  CLI can treat it as an area pattern.
- **Agent-tools must become a real unified CLI.** Build-on-every-invocation and
  per-topic bins are architectural defects, not just latency. New subcommands
  should wait for the P-Foundation unified entrypoint.
- **Peer sidebars are for design; helper pools are for logistics.** Comparable
  peer dialogue produced the design decision; coordinator-plus-helpers produced
  routing overhead.
- **Advisory protocols decay under pressure.** If a step can be skipped during
  time pressure, repeated sessions show that it will be skipped. Route durable
  cures toward enforcement or mechanical affordances.
- **Default agent pronouns to they/them.** Agent names do not imply gender.
  Gendered pronouns require self-declaration.
- **Inspect diffs after `markdownlint --fix` on prose-heavy files.** Literal
  plus signs, hash-number citations, and dash-led fragments can be rewritten
  into Markdown structure.

---

## Recently Distilled — 2026-05-10 Napkin Rotation

These entries merged during the 2026-05-10 deep consolidation pass and
remain pending one subsequent-session validation cycle before graduation.

### Curation And Doctrine-Holding

- **Reading doctrine is weaker than holding its frame at output time.**
  Foundational-doc work must lead with each section's role question:
  does this still serve its role? Metrics may inform the diagnosis, but
  optimisation vocabulary must not frame the work.
- **Target-architecture wording needs consuming-runtime evidence.** A
  shared package exposing a target schema is not proof that an app has
  migrated. Verify at least one composition root before using present
  tense in ADRs, runbooks, or operator docs.
- **Lettered-section edits must re-read the intro count.** Adding a new
  `a/b/c/d` child without re-reading the parent sentence lets "three
  rules" drift into a four-rule section.
- **Growth-axis metadata is live doctrine.** When a graduation lands in
  a directive, audit the file's `split_strategy` against the actual
  growth axis just introduced.

### Coordination And Commit Discipline

- **Commit-helper state writes still need peer-claim audits.** After any
  commit-queue completion or claim close, re-read active claims before
  the final state commit; helper-mediated writes can otherwise lose a
  fresh peer claim under rapid same-file updates.
- **Parent directives need operational cures when the rule keeps being
  rediscovered.** Five foreign-stage absorptions despite the explicit
  pathspec rule showed that the parent collaboration directive also had
  to name both `git add -- <paths>` and `git commit -- <paths>`.
- **Whole-tree hooks can block pathspec-only commits by design.**
  Pathspec discipline controls commit contents, not quality-gate scope.
  Minor peer-owned hook failures are repaired or coordinated; gates are
  not narrowed to the staged bundle.
- **Shell loops over multiline command output are unsafe in deletion
  paths.** Prefer `while IFS= read -r` over `for x in $(...)`, then
  verify after the action.

### Tooling And Test Proofs

- **Exact focused tests should use the runner directly when script
  forwarding drifts.** For agent-tools Vitest proof, prefer
  `pnpm --dir agent-tools exec vitest run <file>` when the package
  script starts running broader suites than the proof requires.
- **Unit test taxonomy beats historical local precedent.** Existing IO
  debt in a unit test file is not permission to add more; factor pure
  option parsers or formatters and test those directly.
- **Generators require populated source data.** A structurally valid
  generator run over sparse source data can produce semantically empty
  outputs; verify the expected dataset-size signal before trusting it.

### Planning Arithmetic And Disposition

- **Count targets derived from current state must name their derivation.**
  Concurrent same-day flow can invalidate an acceptance count before
  execution; re-derive the target at execution time and let substance
  preservation outrank stale arithmetic.
- **"Apply all of X" needs a disposition ledger, not one cycle per item.**
  When most inputs are redundant with canonical doctrine, thoroughness is
  every item having a recorded decision; implementation may be one small
  tranche plus a batched pending-graduations entry.

---

## Recently Distilled — 2026-05-09 Napkin Rotation

These entries merged this session and have not yet survived a
subsequent session without correction; held here for cross-session
validation per the step-7b stability criterion before any graduation.

### PR Closeout Discipline

- **PR closeout has two distinct evidence loops.** Gate state (checks,
  Sonar, CI) and reviewer-comment state are independent. A green PR can
  still need a comment-harvest pass — top-level comments, review
  summaries, and threads marked resolved/outdated may carry live
  feedback outside the check surface. Fetch and classify before the
  next edit.
- **PR title/body are an active review surface.** Branch scope drift
  makes stale metadata an actionable defect, not a wrapper. Rewrite
  title/body after `origin/main...HEAD` comparison before disposing
  any metadata-shaped review comment as `fixed`.
- **For planning PRs, report two verdicts separately.** PR technical
  readiness and plan decision-completeness are independent gates. A
  green PR must not collapse unresolved planning questions (topology
  findings, slice-plan findings, plan-internal contradictions) into
  implicit acceptance.
- **Remote metadata transitions are part of state handoff.** When a
  closeout moves from local/pending to pushed, refresh the live PR
  body and next-session records in the same handoff pass so the next
  session does not inherit stale blockers.

### Generator And Tooling Discipline

- **Generators are valid only when their source data is populated.**
  A code-only generator run in a sparse checkout can produce
  structurally valid but semantically empty output. For ground-truth
  generators, run the full download-then-codegen path when local bulk
  data is absent; verify the expected dataset size (e.g. `Total
  lessons: 12391`) before trusting output.
- **Check schema or CLI help before authoring claims from memory.**
  Natural-language plausibility (`--area-kind file`) is not a
  substitute for the schema vocabulary (`files`). Read
  `active-claims.schema.json` or `<cli> --help` first when authoring
  claims, areas, or any structured-vocabulary input from memory.
- **Self-lint surfaces deprecated helper drift.** Adding new candidate
  rules in the plugin self-lint lane catches maintenance drift early.
  When core ESLint helper types reject a locally-typed plugin, split
  the config at the type boundary rather than weakening the plugin
  type.

### Multi-Reviewer Dispatch Discipline

- **Each reviewer lens shrinks a different part of the audit-shape
  surface.** Parallel WS0 reviewers (test, fred, docs-adr) are not
  redundant; each catches BLOCKERs the others cannot see. Test caught
  literal-text assertions; fred caught a deferred boundary decision;
  docs-adr caught propagation-surface omissions. Plan WS0 dispatch
  expecting concrete cycle-shape correctives, not just nudges.

*"Decide at write time" deferrals are unmade load-bearing decisions*
graduated 2026-05-10 to the host pattern
[`deferred-at-write-time-is-unmade-load-bearing-decision`][def-at-write].

[def-at-write]: patterns/deferred-at-write-time-is-unmade-load-bearing-decision.md
