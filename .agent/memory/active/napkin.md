---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at [`napkin-2026-05-21.md`][archive-pass].
Prior rotations are [`napkin-2026-05-17.md`][previous-pass],
[`napkin-2026-05-14.md`][previous-previous-pass], and
[`napkin-2026-05-13.md`][previous-previous-previous-pass]. The 2026-05-21
rotation was the output of Gilded Ascending Orbit's consolidation pass over
the dense 2026-05-20 and 2026-05-21 multi-agent learning window. Behaviour-
changing entries were merged into [`distilled.md`](distilled.md) under
"Recently Distilled — 2026-05-21"; the full session-by-session capture lives
in the archived napkin.

[archive-pass]: archive/napkin-2026-05-21.md
[previous-pass]: archive/napkin-2026-05-17.md
[previous-previous-pass]: archive/napkin-2026-05-14.md
[previous-previous-previous-pass]: archive/napkin-2026-05-13.md

## 2026-05-21 — Gilded Ascending Orbit consolidation workflow / codex / GPT-5 / `019e4c`

### Surprise: same-prefix identity drift can appear inside one Codex session

- **Expected**: PDR-027 identity preflight would produce the same
  `agent_name` for the whole session prefix.
- **Actual**: live collaboration state contained a fresh `Prismatic Scattering
  Supernova / codex / GPT-5 / 019e4c` claim, while the current preflight
  resolved `019e4c` to `Gilded Ascending Orbit`.
- **Why expectation failed**: the wordlist or identity seed resolution can drift
  within the same platform session; the stable coordinate is the `(name,
  prefix)` pair, with the prefix carrying continuity evidence.
- **Behaviour change**: treat same-prefix/different-name as identity drift, not
  as a peer conflict. Preserve the older claim in the archive, open a fresh
  current-identity claim, and surface the reconciliation in comms before
  editing shared state.
  Source plane: `operational`.

### Consolidation observation: critical fitness pressure is multi-surface

`pnpm practice:fitness:informational` reported CRITICAL pressure in
`napkin.md`, `pending-graduations.md`, and `repo-continuity.md`, plus HARD
pressure in `distilled.md` and two directives. This pass rotated the napkin
first because it was the active capture surface and had a clean archive
lifecycle. The remaining critical surfaces need a follow-on drain rather than
reactive trimming.

Deferral honesty: pending-graduations and repo-continuity remain critical
because safely draining them requires entry-level classification and archive
mapping; doing that inside the same high-context directive-grounding pass would
increase the chance of lossy deletion. Falsifiability: the next consolidation
pass should either archive graduated pending-graduations entries and compact
repo-continuity history, or explicitly record why a higher-priority owner lane
pre-empted that drain.

## 2026-05-22 — Soaring Flying Gale / claude / claude-opus-4-7-1m / `ffa6ce`

### Surprise: long sessions accumulate stale grounding faster than expected

- **Expected**: a fresh `git log -8` + `git status` at session-open is durable
  across a multi-hour planning session.
- **Actual**: 4 commits landed on the same branch during my session window
  (HEAD jumped from `38b49645` to `ac893ca7`) via parallel Codex/Cursor work.
  My initial grounding was stale by the time I was ready to commit.
- **Why expectation failed**: the parallel-cohort model means the branch is
  multi-writer even during a "solo" session; grounding decays in real time.
- **Behaviour change**: re-run `git log -8` + `git status` immediately before
  staging on any session that exceeded ~1h between session-open and first
  commit attempt. The all-channels comms watcher would also surface the same
  drift if running; for plan-mode sessions where I deferred the watcher, the
  pre-commit re-ground is the substitute.
  Source plane: `operational`.

### Surprise: thread-record "Last refreshed" entry mutates mid-session

- **Expected**: reading the thread record at session-open gives a stable
  pointer-and-hypothesis for the session's duration.
- **Actual**: PR #108 hard-merge-blocker context was added to the thread
  record via a parallel commit (`1af47f9e`) DURING my plan-mode work. I only
  noticed when I went to write a Last refreshed entry of my own and saw a
  Feathered Circling Horizon entry that wasn't there at session-open.
- **Why expectation failed**: the Continuation Pointer Contract framing
  treats the thread record as a session-open pointer, but parallel-cohort
  operation makes it a live surface; pointer-snapshot semantics don't hold.
- **Behaviour change**: re-read the most-recent thread-record "Last refreshed"
  entry before writing my own — not as ceremony, as a freshness check.
  Discovered hard-gate context (like PR #108) reshapes the next-session entry
  shape and must be incorporated.
  Source plane: `operational`.

### Surprise: markdownlint MD018 treats `#108` at line start as ATX heading

- **Expected**: `PR #108` would be inert prose anywhere in a markdown body.
- **Actual**: paragraph-wrapping pushed `#108 gate is also a precondition.`
  to the start of a line. Markdownlint MD018 (no-missing-space-atx) treated
  the `#` as an ATX heading marker missing its required space.
- **Why expectation failed**: markdownlint scans line-start `#` regardless
  of whether the prior line continued the same paragraph; wrap position
  determines lint risk.
- **Behaviour change**: hyphenate as `PR-#108` (or rewrap so the `#` is
  mid-line) when issue/PR references appear in prose body text. The
  hyphenated form is still legible.
  Source plane: `operational`.

### Correction: agent-tools `claims close` uses `--closed` not `--archive`

- **Expected**: the flag matched the prose ("archive the claim with the
  resulting SHA") in the commit skill canonical text.
- **Actual**: `claims close --help` shows `--closed <path>` — the flag is
  named after the file's role at write time, not after the action.
- **Why expectation failed**: skill text used the action verb; CLI uses the
  destination noun. Mismatch.
- **Behaviour change**: read `--help` for any agent-tools CLI before first
  use in a session, even when the action feels obvious from a sister
  command's pattern. Cheap (~1s); cure for silent type confusion.
  Source plane: `operational`.

## 2026-05-22 — Blustery Lifting Plume / claude / claude-opus-4-7 / `d4aad7`

### Mistake: comms-watcher setup keeps reproducing the same two failure modes

- **Mistake**: started the all-channels comms watcher with two errors that
  immediately stopped it from picking up live messages: (a) the seen-file
  `.agent/state/collaboration/comms-seen/blustery-lifting-plume.json` did
  not exist, so the CLI treated all ~862 historical events as unseen and
  began draining them as if they were new — backfill flood drowns any live
  signal until the queue clears; (b) I wrapped the watcher in
  `| grep -E "^\[BROADCAST\]|^\[GROUP\]|..."` thinking I was preserving
  the four-channel discipline, but the channel-tag is only on the first
  line of each event, so multi-line event bodies were silently filtered
  out and the SKILL's "self-exclusion only" principle was violated at the
  watcher boundary.
- **Owner correction**: *"Why is your monitor failing to pick up
  messages?"* — direct diagnostic question pointing at both errors at
  once.
- **Cure shape**: standardise the watcher invocation in
  `.agent/skills/start-right-team/SKILL-CANONICAL.md` §0 so agents cannot
  make these mistakes. Concrete shape candidates: (1) make the CLI itself
  prime the seen-file from the current `comms/` directory on first run if
  the seen-file does not exist (cheap; one `readdir` + write); (2) the
  SKILL invocation example bakes in the seen-file priming step as a
  pre-watcher one-liner; (3) the SKILL forbids any pipe past the watcher
  CLI in normative language — self-exclusion is the CLI's job, and
  agent-side `grep` defeats the all-channels guarantee. Both surfaces
  (SKILL + CLI) should converge so the muscle-memory invocation is
  correct by construction.
- **Recurrence diagnostic**: the SKILL already names this exact failure
  mode in the abstract ("A watcher that filters to a single view ...
  discards the others and will miss vital coordination") but the
  copy/paste-able example does not pre-prime the seen-file, and there is
  no example of what NOT to add after the CLI. Passive doctrine; needs
  mechanical cure at the SKILL invocation example AND ideally inside the
  CLI itself. Same shape as the F1 cross-cutting constraint
  (passive-guidance-loses-to-artefact-gravity) — the agent reaches for
  the obvious filter even though the doctrine forbids it.
- **Falsifiability**: next session that opens a `start-right-team`
  watcher should produce no backfill flood and no agent-side filter; if
  either appears, the SKILL/CLI change has not landed yet.
  Source plane: `operational`. Routing: PDR/skill-amend candidate for
  pending-graduations on second-instance accumulation (this is instance
  one captured against the existing abstract doctrine); also a candidate
  CLI feature (`comms watch` auto-prime-on-missing-seen-file).

- **2026-05-22 (Flamebright Igniting Forge / `claude` / Opus 4.7 1M /
  `9a01f3`) — observation: the coordinator role, when one exists,
  benefits from a `/loop` running.**
- **Trigger**: owner invoked `/loop 180s review new messages, assess
  progress towards goals, send corrections where necessary, instruct
  agents to launch specialist reviewers where necessary, review which
  agents need to rotate out and instruct them to wind up their work and
  run the team session complete workflow and surface the need for
  additional agent instance to the user` after the team coalesced
  (3 agents on-channel). Owner explicitly asked the observation be
  captured here when the loop's value became clear.
- **Why this is load-bearing**: a coordinator without a periodic
  scheduled tick is purely reactive — they sweep comms when events
  arrive but cannot detect what is NOT happening. Several coordinator
  decisions this session depended on time-based assessment the event
  stream alone could not surface: (a) Blustery silence at the ~5min
  threshold during commit-window work (no event to react to; the
  absence is the signal); (b) agent cadence-rule violations
  (SKILL §5 120s progress-report rule) are by definition
  negative-space observations the loop is built to detect;
  (c) idle blocker drift (Midnight held at commit boundary with
  declining headroom while waiting on a peer commit); (d) timing of
  additional-agent dispatch surfacing (the right moment is
  cycle-cadence-aware, not event-aware).
- **Cure shape**: any coordinator-shaped session should default to
  running a `/loop` at slightly longer than the agent-cadence-rule
  interval (cadence rule is 120s; recommended cron is `*/3 * * * *` =
  180s so the loop is a safety-net not a noisemaker). The loop prompt
  should cover: review new messages, assess progress, send corrections,
  dispatch specialist reviewers where needed, review rotation
  candidates, surface additional-agent need. Owner-explicit invocation
  is today's shape; future candidate is the start-right-team SKILL
  adding a §"Coordinator activation" section baking the loop-invocation
  suggestion into the coordinator's first moves.
- **Architectural framing**: this is event-driven-coordination plus
  time-driven-coordination, not either-or. Events fire when something
  happens; the loop fires when the right amount of time has passed.
  Together they cover both "what changed" and "what should have changed
  but didn't." Either alone has structural blind spots.
- **Source plane**: `operational`. Routing: candidate
  start-right-team SKILL amendment under a new §"Coordinator activation"
  section. Until that lands, owner-invoked `/loop` is the standing
  pattern for any coordinated multi-agent session with a named
  coordinator.
- **Falsifiability**: a future coordinated multi-agent session that
  opens without a `/loop` should show coordination drift on time-based
  signals (silent agents past cadence, idle blockers, missed dispatch
  timing); if it does not, the loop is less load-bearing than this
  entry claims and the entry should be downgraded.

## 2026-05-22 — Midnight Veiling Threshold Docker MCP closeout / codex / GPT-5 / `019e4e`

### What Worked: watcher plus disk-backed recent-event sweeps

- **Observed pattern**: the most reliable Codex comms monitoring shape was
  two-layered: keep the canonical `comms watch` running with no extra pipe or
  grep, then use short `jq` sweeps over `.agent/state/collaboration/comms/*.json`
  filtered by `created_at` whenever a decision point needed audit-grade
  certainty.
- **Why it worked**: the watcher gave live awareness, while the disk sweep
  corrected for scrollback truncation, historical-drain noise, and missed
  directed events. The sweep also made it cheap to inspect the exact event
  body before staging or releasing a commit window.
- **Behaviour change**: for coordinated Codex sessions, treat the live watcher
  as attention and the `jq` sweep as verification. Before any index action,
  re-check recent comms, active claims, commit queue, and staged names from
  disk. Do not put an agent-side pipe after the watcher.
  Source plane: `operational`.

### Surprise: the PR #108 CodeQL query was broader than the one-alert expectation

- **Expected**: the requested CodeQL API query for PR #108 would return the
  single alert described in the Phase 0 acceptance bar.
- **Actual**: the `ref=refs/pull/108/head&state=open` query returned eight
  open alerts. PR checks and alert metadata showed that #90 was the PR-new
  failure relevant to the current blocked check, while the other seven were
  older open alerts on the same ref/query surface.
- **Why expectation failed**: the endpoint shape answers "open alerts visible
  at this PR head ref", not "new alerts introduced by this PR quality gate".
  Treating the raw response as a one-alert source would silently erase real
  query scope.
- **Behaviour change**: when a live validation query returns more than the
  plan expects, record the drift or scope caveat in the ledger instead of
  normalising it away. Use PR check state, alert metadata, created dates, and
  location evidence to identify the PR-new finding.
  Source plane: `operational`.

### Coordination lesson: release the commit window when a peer-owned inherited gate fix is needed

- **Situation**: the Phase 0 plan edit was staged, recorded, and verified, but
  the inherited markdownlint pre-flight found errors in peer-owned archive
  files. Attempting the commit would have failed the full hook for reasons
  outside the Phase 0 file.
- **What worked**: coordinator-routed release was cleaner than holding the
  index: unstage the plan file by explicit pathspec, abandon the queue intent,
  close both files and `git:index/head` claims, and leave the plan edit intact
  in the working tree until the inherited fix lands. After the peer commit,
  re-acquire both claims and run a fresh queue/verify/commit pass.
- **Behaviour change**: in team sessions, a verified staged bundle is still a
  coordination state, not a right to hold the index indefinitely. If a
  peer-owned precondition blocks the hook, release the commit window and
  preserve the edit unstaged unless the coordinator explicitly says otherwise.
  Source plane: `operational`.

### Tooling friction: `comms send` is not a directed-message API yet

- **Mistake**: I tried `comms send --thread ... --to ...` when sending a
  directed status event. The CLI rejected both options; current `comms send`
  accepts title/body/platform/model plus storage/identity options, so directed
  routing is expressed in the title/body rather than typed CLI flags.
- **Behaviour change**: check `pnpm agent-tools:collaboration-state -- comms
  send --help` before assuming typed routing flags exist. This is a candidate
  agent-tools UX improvement: typed `--thread` and `--to` would make the
  durable routing intent less convention-dependent.
  Source plane: `operational`.

### Coordinator pattern: auto-mode classifier blocks file-content-to-other-agent

- **Mistake**: tried to send a long directed-comms body to another agent via
  Write-to-tmp + Bash `cat <tmp> | comms direct --body "$(cat ...)"` pattern
  (same pattern that worked four times earlier in the session). Auto-mode
  classifier denied: "Bash command references /tmp/... which was never written
  in the transcript — sending unverifiable content to another agent."
- **Why expectation failed**: the classifier became stricter when the
  destination was another agent (vs my own session). Previous transcripts
  with the same pattern had cached the tmp file's provenance; a fresh tmp
  path in a coordination message triggers the safety check.
- **Behaviour change**: when sending a directed `comms direct/send` to
  another agent with a non-trivial body, prefer inline body in the Bash
  command (with single-quoted argv) over cat-from-tmp. Long bodies become
  long inline single-quoted strings. This is a coordinator-specific pattern
  — sending instructions to peer agents has a different safety boundary
  than self-only file ops.
  Source plane: `operational`.

### Coordinator pattern: hook policy substring-matches forbidden patterns even in instructive context

- **Mistake**: my directed brief to Blustery contained the literal string
  `git add -A` inside a "do NOT use" guard sentence ("never use `git add -A`
  or `.`"). The repo hook policy substring-matched the forbidden pattern and
  blocked the comms-send entirely, even though I was warning AGAINST the
  pattern, not invoking it.
- **Why expectation failed**: hook policies are pattern-matchers; they do
  not parse semantics of natural-language guards. "Don't use X" and "use X"
  trip the same substring filter.
- **Behaviour change**: coordinator briefs to peer agents must phrase
  forbidden-pattern guards descriptively, not literally. Substitute generic
  language: "do not use any whole-tree shortcut", "stage by explicit
  pathspec per the standing rule", etc. Literal forbidden-pattern strings
  belong only in the rule's canonical home (where the hook expects them) and
  in agent execution contexts where the pattern is being deliberately
  invoked.
  Source plane: `operational`.

### Coordinator doctrine instance: catalogue-not-block resolves SKILL-vs-standing-memory tension on advisory fitness

- **Situation**: Blustery's Stage 1a commit prep hit advisory orchestrator
  RED on pre-existing critical fitness signals (~14 surfaces) on files
  outside their staged scope. Two doctrines in tension: standing memory
  `all-quality-gates-blocking-always` says every red is blocking; SKILL
  carves out fitness/vocabulary as advisory-only (catalogued at consolidation
  pass, not retroactively blocking). Blustery surfaced the routing question
  rather than deciding unilaterally.
- **What worked**: the carve-out applies when (a) the failure is the
  advisory sub-check, (b) the bundle introduces zero new violations, (c) the
  bundle DRAINS the pre-existing signal surface, AND (d) the catalogue is
  recorded in the commit body so it does not silently drift. Standing memory
  fires against DISMISSAL or NEW violations; it does not fire against
  drain-with-catalogue.
- **Behaviour change**: when SKILL and standing-memory appear to conflict on
  a gate, classify the failure shape against each doctrine's stated remit
  before treating them as contradictory. The standing memory rule has a
  named recurring failure mode ("pre-existing, out-of-scope" framings used
  to DISMISS); a drain-with-catalogue is structurally different and the
  carve-out is honest. Architectural-excellence framing is: catalogue is the
  load-bearing discipline, blocking-the-drain would be quick-fix-shaped
  (use the rule literally to avoid making a routing decision).
  Source plane: `operational`. Worked instance during Blustery Stage 1a;
  catalogue landed in commit body of `5b8635c4`.

## 2026-05-22 — Ferny Swaying Leaf / claude / claude-opus-4-7 / `b282b8`

### Worked instance: PDR-064 two-moments coordinator handoff fired three times in one session

- **Observation**: PDR-064's two-moments pattern (pre-positioning =
  information transfer; active-acknowledgement = authority transfer)
  executed three times in a single team session: (1) Flamebright →
  Ferny partial slice handoff for the PDR-063..066 review domain;
  (2) Flamebright → Ferny full-session coordinator handoff per owner
  direction; (3) Ferny → Blustery full-session coordinator handoff
  per owner correction on coordinator-vs-implementer discipline. All
  three completed cleanly with explicit Moment-2 broadcasts and
  reciprocal Moment-1 acknowledgements.
- **Diagnosis**: the partial-slice instance was a NEW SHAPE that
  PDR-064 §Open Question 3 (share-the-role for N minutes) did not
  contemplate. Scope-bounded (not time-bounded) authority
  partitioning where the outgoing coordinator retains full-session
  authority and the incoming coordinator takes a bounded sub-domain.
  Dual-authority disambiguated by routing-slice, not by time-window.
- **Behaviour change**: PDR-064 partial-slice amendment graduate-
  trigger has fired with strong evidence base across one session.
  Three independent instances + Foamy's drafted pending-graduations
  entry text (comms event `9670c08f`) + the worked Moment-2
  broadcasts (`d1bd7dc1`, `c89bb8da`, `8a8de67a`). Amendment lands
  after the slice closes per Flamebright's direction; the substance
  is durably captured pending file-write opening.
  Source plane: `governance`. Carrier: PDR-064 amendment after
  slice/session close.

### Owner correction: coordinator subagent dispatch is implementer-class friction

- **Owner direction**: *"your job is to coordinate and direct, not
  to implement, please pass full coordination authority to Blustery,
  and include an appropriate loop command to monitor messages and to
  direct."*
- **Diagnosis**: as full-session coordinator I dispatched two
  subagent reviewers myself (assumptions-expert on the snagging plan;
  architecture-expert-fred on the PDR set). Subagent dispatches by
  the coordinator are implementer-class work when the team has
  capacity to delegate that dispatch to a non-coordinator agent. The
  coordinator's correct shape is to direct OTHER agents to dispatch
  reviewers, not to do the dispatch themselves.
- **Behaviour change**: pure-coordination posture = comms-event
  routing, decision arbitration, commit-window ratification, and
  owner-decision routing. Subagent dispatch is delegable
  implementation work. The distinction is: opening a subagent costs
  the coordinator's context budget and produces a result the
  coordinator must absorb and route — better to have a non-
  coordinator agent open the subagent, absorb the verdict, and
  surface a summary to the coordinator for routing.
  Source plane: `operational`. PDR/skill candidate: amend
  `start-right-team` SKILL §"Choose Temporary Responsibilities"
  with a coordinator anti-pattern note.

### Failure mode (2nd instance): backtick-shell-substitution in double-quoted `--body` args

- **Mistake**: my comms-direct event `0ce0b26b` to Foamy lost two
  words to backtick shell-substitution. The body contained inline
  references to schema field names wrapped in backticks (`tags`,
  `fast_bootstrap_eligible`). The outer double-quoted `--body
  "$(cat /tmp/...)"` allowed the shell to interpret backticks
  INSIDE the substituted file content as command-substitution. The
  shell tried to execute `tags` and `fast_bootstrap_eligible` as
  commands, failed, and the resulting body strings had the backtick
  spans replaced with empty output.
- **Diagnosis**: cat-from-tmp-file pattern is safe FROM the
  classifier-hook angle (no inline body) but UNSAFE on backticks
  unless wrapped in single quotes. The outer-quote choice is the
  determining factor: single quotes preserve all content literally;
  double quotes evaluate backticks even on substituted file content.
- **Behaviour change**: graduate-trigger fires (this is the 2nd
  instance; first was Stratospheric per existing pending-graduations
  entry). Cure shape: any comms-event body containing inline-code
  spans MUST use either (a) single-quoted `--body '...'`, or
  (b) cat-from-tmp-file with single-quoted outer-substitution
  `--body "$(cat ...)"` is wrong — should be `--body "$(cat ...)"`
  with backticks ESCAPED in the file content. Simplest cure:
  prefer `[brackets]` instead of `\`backticks\`` in comms-event
  bodies when referencing identifiers.
  Source plane: `operational`. PDR/skill candidate: amend
  `agent-tools` CLI to default to single-quote body shape OR
  document the hazard in the README §"CLI Norms" with cure shapes.

### Reviewer pattern: revision tranches need regression-of-prior-fix check, not just intended-changes verification

- **Observation**: architecture-expert-fred dispatched against
  Foamy's revised four-PDR set returned RESHAPE on PDR-066. Two
  defects: (a) line 242 still contained the original incorrect
  "Strict readers ignore unknown optional fields by construction"
  wording that the BLOCKER fix from first-pass review was supposed
  to remove — REGRESSION OF PRIOR FIX; (b) sentence fragmentation
  around the new §Migration sequence header insertion (lines 181-
  211). My coordinator spot-verify before dispatching fred had
  read the §Migration sequence subsection and confirmed it was
  present, but had NOT re-read the §Rationale paragraph below it
  to verify the regression-target wording was removed.
- **Diagnosis**: revision-tranche verification reflexively reads the
  CHANGED sections (intended fixes) but does not re-read the
  related-but-unchanged sections (where the original wording lived).
  A BLOCKER fix that adds new content without removing the
  contradicting original content leaves a regression. The
  spot-verify pattern needs to include "read the original-defect
  area in the new file, not just the new-content area."
- **Behaviour change**: when verifying a revision tranche that
  applies a BLOCKER fix, always re-read the ORIGINAL DEFECT
  LOCATION in the revised file, not just the new content the fix
  added. The two are not the same — the BLOCKER may live in a
  different section than where the cure goes, and reading only the
  cure-section can miss a regression in the defect-section.
  Subagent reviewer (fred) caught this; coordinator spot-verify
  missed it.
  Source plane: `operational`. Skill candidate: amend the implicit
  spot-verify pattern with "re-read original-defect location, not
  just intended-cure location."

### Pattern: cross-PDR schema-amendment layering — VALUE on existing field vs PROPERTY on schema

- **Observation**: PDR-063 introduces a new `message_kind` VALUE
  (`mid-cycle-handoff`) on the existing `message_kind` field of the
  directed comms-event shape. PDR-066 introduces a new optional
  `tags` array PROPERTY on the narrative/lifecycle/directed event
  kinds. These are non-overlapping schema operations on different
  layers: PDR-063 = enum-value addition; PDR-066 = field addition.
  Both are additive-backward-compatible but require different
  migration disciplines.
- **Diagnosis**: when two PDRs touch the same schema, the right
  question is "what schema LAYER does each touch?" — not "do they
  conflict?". Layer separation (VALUE on existing field vs new
  PROPERTY on schema) is the architectural distinction that lets
  each PDR own one schema operation cleanly. Composition is automatic
  when layers are disjoint.
- **Behaviour change**: PDR / ADR review pattern when multiple
  decisions touch one schema: classify each by the schema layer
  it operates on (property-addition / value-addition / property-
  removal / property-rename / etc.). Non-overlapping layers
  compose; overlapping layers need explicit ordering. PDR-063 ↔
  PDR-066 boundary was correctly framed by Foamy as "non-overlapping
  schema operations on different layers"; that framing should be
  reusable for future doctrine pairs.
  Source plane: `governance`. Carrier: future architecture-review
  brief template; PDR/skill candidate for additive-extension
  discipline articulation.

### Reviewer pattern: assumptions-expert surfaces OOPS-class risks the plan author did not write into §Risks

- **Observation**: assumptions-expert dispatched against the PR-108
  snagging plan returned GO-WITH-CONDITIONS with one OOPS-class
  risk not in the plan's §Risks section: Phase 0 ledger drift
  between SHA `5af5e289` and push HEAD. The plan's §Re-grounding
  clause says per-cycle verification is local (lint/type/test) plus
  the push at phase-final, NOT a per-cycle live-Sonar re-query —
  which is correct for execution efficiency but lets drift slip
  between Phase 0 baseline and Phase Final push (a parallel push
  by another agent on the same branch would re-scan Sonar with
  fresh state). The reviewer surfaced the gap; plan author did not.
- **Diagnosis**: §Risks sections capture risks the plan author
  thought of. assumptions-expert's role is exactly to surface
  OOPS-class risks the author did not think of — the "what could
  silently invalidate this plan between now and acceptance" angle.
  Cure: add C2 condition to Phase Final §Task F.2 (pre-push live
  Sonar+CodeQL re-query against Phase 0 baseline to catch any
  drift).
- **Behaviour change**: assumptions-expert dispatch is load-bearing
  for plans whose Phase 0 captures live state that can drift before
  Phase Final. Specifically: any plan whose acceptance signal is a
  remote-state read (CI gates, vendor MCP, external service)
  needs an explicit re-grounding step at Phase Final, not just at
  Phase 0. The assumptions-expert verdict shape that surfaced this
  was load-bearing for the snagging-plan condition C2.
  Source plane: `operational`. Carrier: amendment to the snagging
  plan's Phase Final §Task F.2 (already encoded as assumptions-
  expert C2 condition).

### Post-compaction continuation — Sonar disposition unblock paths

- **Observation**: owner-directed pause excluded only Ferny;
  Sonar MCP block was owner-surface. THREE unblock paths surfaced
  in one session: (1) `/mcp` reconnect in Claude Code re-attached
  the `mcp__sonarqube__` namespace mid-session; (2) `docker mcp
  gateway run --profile sonarqube_oak` exposes the same tools via
  shell layer (Midnight's path on Codex); (3) `mcp__sonarqube__
  mcp-add` of the server programmatically — DENIED by auto-mode
  classifier as "Self-Modification" without prior user/inter-agent
  authorisation.
- **Diagnosis**: Codex sessions lack the `mcp__sonarqube__`
  namespace by default — Docker MCP gateway is the canonical
  unblock for Codex (must-check before declaring Sonar
  unavailable). Claude sessions have `/mcp` reconnect available.
  Programmatic `mcp-add` is auto-mode-blocked categorically;
  user-driven reconnect via `/mcp` is the substitute. Substrate
  diversity in unblock paths is real and worth knowing.
- **Behaviour change**: when a Codex session reports "no Sonar
  MCP," check `docker mcp tools ls --format json` BEFORE
  declaring the work blocked. When a Claude session loses the
  namespace mid-session, request user `/mcp` reconnect rather
  than attempt `mcp-add`. Three-path-substrate awareness is
  a recurring shape across MCP integrations.
  Source plane: `operational`. Carrier: amend sonarqube-mcp-
  instructions.md §Common troubleshooting with the three-path
  enumeration.

### Owner-unblock-hint scope ambiguity during selective pause

- **Observation**: owner-directed pause excluded "all agents
  except Ferny." Owner subsequently provided a hint to Ferny
  (Docker MCP gateway test) which Midnight also acted upon to
  unblock their own Cycle 3 disposition. Result: same S4036
  hotspot (AZ4cLpsUaO7TzVKHKWC0) double-written by Ferny + Midnight
  with identical updateDate timestamp 09:24:14Z; Sonar handled
  idempotently. No bad state, but duplicated work.
- **Diagnosis**: an owner-given unblock hint targeted at the
  unpaused agent is ambiguous about whether previously-paused
  agents are also unblocked-by-side-effect. Midnight's read was
  reasonable (hint provides the unblock path; they were blocked
  on the same surface). Ferny's read was also reasonable
  (selective pause means only the unpaused agent is unblocked).
  Both reads predict different action.
- **Behaviour change**: owner-given unblock hints during selective
  pause should carry explicit scope: `[Ferny-only]` vs
  `[all-paused-may-use]`. Coordinator can amend by reasserting
  the pause boundary after seeing the hint, or by explicitly
  broadcasting "this unblock applies to all paused agents." In
  absence of explicit scope, paused agents should stay paused
  and surface "I see an unblock for the unpaused agent; does
  it apply to me?" rather than self-routing.
  Source plane: `operational`. PDR/skill candidate: graduate to
  pending-graduations with two-instance trigger (this is a new
  shape; awaiting one more instance OR owner-direction graduation).

### Audit-trail visibility gap: Sonar MCP show returns `comments: []`

- **Observation**: `change_security_hotspot_status` accepts a
  `comment` parameter; the mutation succeeds and Sonar returns
  `newStatus: REVIEWED, newResolution: SAFE, success: true`.
  Subsequent `show_security_hotspot` on the same hotspot returns
  `comments: []` and does not expose a `changelog` field. The
  rationale-text is stored somewhere on the Sonar side (the
  mutation accepted it) but is not visible through the MCP
  surface.
- **Diagnosis**: the plan's deterministic validation cites the
  public REST `/api/hotspots/show` endpoint returning a
  `changelog` field with the rationale. The MCP tool surface
  does NOT expose `changelog` — only `comments`, which is a
  different concept (free-text comment thread vs status-change
  history). Anyone auditing via MCP alone would see empty
  comments and may incorrectly conclude no rationale was filed.
- **Behaviour change**: rationale audit trails must be verified
  via the REST API or Sonar Web UI, not via MCP `show_security
  _hotspot`. Plans that cite MCP-surface verification of
  rationale visibility need amending — the MCP `comments` field
  is not the rationale carrier. Worth flagging to the snagging
  plan's Phase Final task list as a verification-path correction.
  Source plane: `operational`. Carrier: amend pr-108-snagging
  plan Cycle 2/3 deterministic-validation block to cite the
  REST endpoint explicitly, OR add a code-mode JS tool that
  reads `/api/hotspots/show?hotspot=KEY | jq .changelog`.

### Coordinator-brief vs plan-as-source-of-truth routing fidelity

- **Observation**: Blustery's Cycle 2 routing brief named the
  workspace as `oak-curriculum-mcp-streamable-http`. The plan's
  §Cycle 2 ledger located the 11 sites in `packages/core/graph-
  core/` test files. Substance (W3C example.org RDF/JS SAFE per
  §S5332) was consistent; only workspace name diverged. I
  caught the discrepancy via plan-as-source-of-truth before
  executing — the disposition went against the actual sites,
  not the briefed-but-wrong workspace name.
- **Diagnosis**: coordinator briefs are written from short-form
  recall; they can lose fidelity vs the plan they reference.
  Implementer-side reflex must be plan-first read on substance
  even when the coordinator brief seems clear. Caught early
  (before any Sonar write) — no rework needed.
- **Behaviour change**: when a coordinator brief cites specific
  workspaces / file paths / hotspot keys, the implementer
  re-reads the plan section to confirm. If divergence is found,
  surface as routing-correction (substance-only) and proceed
  against the plan, not the brief. Plan-as-source-of-truth is
  invariant; coordinator-brief is a routing pointer.
  Source plane: `operational`. Skill candidate: amend
  start-right-team / dispatch protocols with explicit
  "plan-first verification of brief specifics."

### docker-secrets-engine dependency for Docker MCP gateway profiles

- **Observation**: `docker mcp gateway run --profile sonarqube
  _oak --dry-run` returned `Failed to fetch secrets from secrets
  engine: dial unix /Users/jim/Library/Caches/docker-secrets-
  engine/engine.sock: connect: no such file or directory`
  followed by container `Can't start sonarqube: failed to
  connect: calling "initialize": EOF`. The profile config was
  correct; the image pulled; the gateway initialised. The block
  was solely the secrets-engine socket being absent — meaning
  `SONARQUBE_TOKEN/URL/ORG` env vars couldn't be resolved.
- **Diagnosis**: Docker Desktop's MCP Toolkit secrets-engine is
  a sub-feature that must be enabled in Settings; absence of the
  socket = secrets resolution fails silently with a Warning, then
  the downstream container fails initialize. The gateway does
  not error early on missing secrets — it tries to start the
  server with empty env. Bypass path: `--secrets <path-to-env-
  file>` flag, but the cleaner cure is enabling MCP Toolkit in
  Docker Desktop.
- **Behaviour change**: when a `docker mcp gateway run` config
  validates but the downstream MCP container fails initialize,
  check the secrets-engine socket existence FIRST: `ls -la
  /Users/jim/Library/Caches/docker-secrets-engine/`. Missing
  socket is a categorically different failure mode than missing
  token or wrong token. The Warning line is the diagnostic, not
  the EOF line.
  Source plane: `operational`. Carrier: amend napkin archive
  entry from 2026-05-03 (which already references the Docker
  MCP Toolkit gateway pattern) with the secrets-engine socket
  diagnostic check.

## 2026-05-22 — Salty Charting Harbour / codex / GPT-5 / `019e4e`

### Surprise: pause receipt can lag behind a short commit window

- **Expected**: a live `comms watch` during team execution would make owner
  pause direction arrive before the next mechanical sub-cycle landed.
- **Actual**: Cycle 4.4 was already committed as `604f64b7` and its queue /
  git-index claim were closed before the owner pause broadcast reached this
  Codex session. I then confirmed the timing mismatch to the coordinator and
  stopped further Cycle 4 work.
- **Why expectation failed**: even a running watcher is an attention surface,
  not a hard interlock; short commit windows can complete between poll output
  and the next visible pause event.
- **Behaviour change**: before starting any further sub-cycle after a pause-
  sensitive team direction, run a fresh disk-backed comms sweep as well as
  watching the stream. Treat watcher output latency as a coordination risk,
  especially for small mechanical commits.
  Source plane: `operational`.

## 2026-05-22 — Midnight Veiling Threshold / codex / GPT-5 / `019e4e`

### Correction: Docker MCP gateway exposes Sonar write tools

- **Mistake**: I initially reported PR-108 Cycle 3 as blocked because this
  Codex session did not expose a direct `mcp__sonarqube__*` namespace and the
  shell did not contain `SONAR_TOKEN`.
- **Owner correction**: Jim pointed out that `mcp-docker` should provide access
  to Sonar via the Docker MCP gateway.
- **Actual**: `docker mcp tools ls --format json` showed the Sonar tools,
  including `show_security_hotspot` and `change_security_hotspot_status`.
  `docker mcp tools call show_security_hotspot
  hotspotKey=AZ4cLpsUaO7TzVKHKWC0` returned `canChangeStatus: true`, and
  `docker mcp tools call change_security_hotspot_status ...` successfully
  marked the Cycle 3 hotspot `REVIEWED` / `SAFE`.
- **Behaviour change**: when a direct MCP namespace is missing in Codex, check
  `docker mcp tools ls --format json` before declaring the capability absent.
  The Docker gateway may expose the real downstream server tools even when the
  platform-level namespace only looks like gateway management. CLI call syntax
  is positional tool name plus `key=value` arguments, not JSON payload.
  Source plane: `operational`.

### What Worked: policy-first disposition plus gateway verification

- **Observed pattern**: for S4036, read the site first, classify the command
  (`git` at `agent-tools/src/bin/agent-tools-cli-topics.ts:96`), apply
  `docs/governance/sonar-disposition-policy.md` §S4036, then make one Docker
  MCP write call with the exact site-specific SAFE rationale.
- **Verification**: after the write, both Docker MCP `show_security_hotspot`
  and the public SonarCloud API reported hotspot `AZ4cLpsUaO7TzVKHKWC0` as
  `REVIEWED` / `SAFE`. No repo edit or commit was needed.

## 2026-05-22 — Flamebright Igniting Forge / claude / Opus 4.7 (1M) / `9a01f3` (re-grounded post-compaction; team-member, NOT coordinator)

### Knowledge-graduation candidate: WS-reserved entrypoint module-marker pattern

- **Site density**: Cycle 6 S7787 surfaced 7 instances in one package
  (`packages/libs/graph-ingest/src/{custom-mapping,index,jsonld-compatible,node-edge-list,plain-json-tree,records,strict-jsonld}/index.ts`),
  all carrying bare `export {};` with TSDoc reserving the sub-path under
  WS2.1 for future consumer-backed cycles.
- **Architectural reason**: `export {}` is the TypeScript module-marker
  idiom. Without it, `tsc` treats the file as a global-scope script (errors
  on multi-package builds) and Node ESM resolution may fail for sub-path
  entries in `package.json`'s `exports` map. The rule's premise (specifiers
  omitted by accident) is structurally false here.
- **Graduation candidate**: add §Issue Classes entry to
  `docs/governance/sonar-disposition-policy.md` for S7787 with a
  "WS-reserved entrypoint module-marker" class. Owner-authorisation gated
  per Expansion Discipline §1. First-density encounter.
- Source plane: `architecture` → `policy`.

### Knowledge-graduation candidate: top-level await as canonical bin-file pattern

- **Site density**: Cycle 6 S7785 surfaced 5 instances all in
  `agent-tools/src/bin/` (`agent-identity.ts`, `agent-tools.ts`,
  `branch-touched-files.ts`, `codex-exec.ts`, `skills-adapter-generate.ts`),
  using `.then().catch()` promise chains rather than top-level
  `try { await main() } catch (e) { handle(e) }`.
- **Architectural reason**: these are terminal CLI bin files that own their
  own exit path, not library entrypoints where promise composition gives
  callers error-propagation control. Top-level await + try/catch has
  explicit unhandled-rejection semantics that `.then().catch()` does not in
  all Node versions.
- **Graduation candidate**: encode the bin-file pattern as agent-tools
  contributing/style guidance so the cluster doesn't recur at the next PR
  boundary.
- Source plane: `architecture` → `convention`.

### Worked instance: catalogue-not-block applied cleanly to commit landing

- **Setting**: Cycle 1 (CodeQL #90 TSDoc edit, commit `77463a22`).
- **Signal**: `pnpm agent-tools:check-commit-skill-advisories` exit 1 on
  `practice:fitness:strict-hard` — critical-zone signal on
  `repo-continuity.md` prose width 1744, hard-limit on
  `practice-bootstrap.md` chars 41035, several soft warnings on other
  shared-state files. ALL pre-existing, ALL in files NOT in cycle scope.
- **Reconciliation**: SKILL §"Quality Gates Are Always Blocking; the
  Orchestrator Is Advisory" + owner-stated catalogue-not-block doctrine
  for advisory orchestrator findings on residue not in cycle scope.
  Surfaced the catalogue to coordinator (Blustery) as a progress event
  before proceeding; husky pre-commit blocking chain (which does NOT
  include practice-fitness) was the actual verdict surface.
- **Result**: commit landed clean, 87/87 turbo cached, all husky gates
  green. First clean worked instance of catalogue-not-block under the
  doctrine substrate without an owner-side reconciliation pass needed.
- Source plane: `operational` → `doctrine` (graduation candidate: SKILL
  §commit could carry an explicit catalogue-not-block worked example).

### Plan-list defect surfacing: column counts and file-list cells can drift

- **Setting**: Cycle 6 plan §Cycle 6 line 814-817 table.
- **Defect**: column "Sites" reports "7" for S7787; file-list cell
  enumerates only 5 files. The column count was correct (`ls` confirmed
  7 files); the enumeration was incomplete (omitted `records/index.ts`
  and `strict-jsonld/index.ts`).
- **Cure shape**: when plan internal counts and enumerations disagree,
  re-derive from canonical source (filesystem grep or Sonar issue list)
  rather than trust the narrower enumeration. Pre-execution reviewer
  (code-expert) caught it cleanly via the cross-check brief instruction.
- **Why this matters**: downstream Sonar UI disposition lane would have
  missed 2 of 7 sites if the team had trusted the file-list enumeration
  without cross-check. The pre-execution-reviewer pattern earned its
  keep here.
- Source plane: `operational` → `process`.

### Behaviour observation: cron-fired coordinator-loop misroutes after coordinator handoff

- **Setting**: I was earlier coordinator (pre-compaction), handed off to
  Ferny → Blustery, then re-grounded as team-member post-compaction. The
  /loop cron `fc45ab8d` (every 3 min) kept firing the coordinator-shape
  prompt into my session through the re-ground and through every
  team-member task I executed.
- **Cure**: only the cron-creating agent (or owner) can CronDelete it.
  Coordinator-loop crons need to be deleted at the coordinator-handoff
  moment, not later. Otherwise the loop keeps firing into the now-wrong
  session — noise overhead that has to be ignored every 3 minutes.
- **Graduation candidate**: PDR-064 §"Two Moments" coordinator-handoff
  pattern could carry an explicit "Moment 3: pause / delete any /loop
  cron the outgoing coordinator created" step.
- Source plane: `operational` → `protocol`.

## 2026-05-22 — Foamy Snorkelling Jetty / claude / claude-opus-4-7-1m / `1c0db8`

### Learning: Practice-Core portability rule applies at PDR drafting, not at review

- **Setting**: drafted PDR-063, PDR-064, PDR-065, PDR-066 this session
  under planning-specialist boundary. assumptions-expert reviewer
  verdict (event `6cdd7501`) flagged Practice-Core portability
  hook-blocker on PDR-063, PDR-065, PDR-066 — embedded repo paths
  (`.agent/state/collaboration/...`, `active-claims.schema.json`, the
  `pnpm agent-tools:collaboration-state` CLI command). PDR-064 alone
  was portability-clean.
- **What surprised me**: I knew the standing rule (memory entry
  `feedback_practice_core_portability_strict`: "Anything under
  .agent/practice-core/ must have NO repo paths, ADR refs, or commit
  refs"). I read it during start-right grounding. I still drafted three
  out of four PDRs with embedded paths.
- **Diagnosis**: I treated portability as a *review-time stylistic*
  check rather than a *drafting-time structural* invariant. Drafting
  felt natural with concrete path references — they made the PDR feel
  grounded. The portability rule has the shape of a Practice-Core
  constructional invariant, not a copy-editing concern.
- **Cure shape**: portability check moves to the PDR-drafting
  pre-write phase, alongside trigger-evidence and proportionality.
  Specifically: before writing any §Required line, ask "does this line
  contain a repo path, ADR ref, or commit ref?" — if yes, restate as
  abstract substrate language and migrate the path-bound detail to a
  non-Practice-Core surface.
- **Graduation candidate captured**: `practice-core-portability-at-drafting`
  in pending-graduations under today's date.
- Source plane: `operational` → `process`.

### Reviewer pattern: assumptions-expert on a PDR *set* surfaces cross-PDR coupling defects no per-PDR reviewer catches

- **Setting**: dispatched assumptions-expert against all four PDRs as
  a *set*, not per-PDR. Per-PDR review by architecture-expert-fred
  had already returned GO on each.
- **What the set-scope reviewer found**: PDR-065 imports PDR-066's
  `tags` namespace as a hard dependency AND adds a third tag value
  (`doctrine-update`) within the same Proposed-status window. PDR-066's
  §Open question 1 ("tag namespace boundaries") is foreclosed by
  PDR-065 before PDR-066's second-instance trigger lands. Per-PDR
  review never sees this — both PDRs look proportional in isolation.
- **Cure pattern**: when a related PDR set is being drafted in one
  session, dispatch the proportionality reviewer (assumptions-expert)
  against the set, not per-PDR. Per-PDR reviewer (fred) for
  correctness; set-scope reviewer for coherence.
- Source plane: `operational` → `protocol`.

### Surprise: `comms reply` CLI body parsing failure modes are layered

- **Setting**: attempted `pnpm agent-tools:collaboration-state -- comms
  reply` twice. First failed (abbreviated event_id `a01076e3` — needed
  full UUID). Second with full UUID also failed (exit 2, no stderr) —
  same backtick-shell-substitution mode Ferny captured at line 409 of
  this napkin, but now appearing on the `--body` argument when the body
  was passed via `BODY=$(cat /tmp/file.txt)` and contained markdown code
  fences (backticks).
- **Cure used**: fall back to `comms send` (broadcast) with the
  recipient addressed in the body. Both `comms reply` failures cured
  this way; broadcasts landed cleanly.
- **Worth noting**: the `comms reply` shape needs proper body-parsing
  hardening, OR the agent-tools CLI doctrine needs a `--body-file
  <path>` mode that reads the body from a file without shell
  interpretation. Either is a fix worth flagging — Blustery already
  catalogued the backtick-shell mode as a graduation candidate (their
  directed event `09:03:05` mentioned the pending-graduations entry on
  CLI body cure pattern). Not adding a third entry — Ferny's existing
  line-409 entry plus Blustery's catalogue cover the substance.
- Source plane: `operational` → `tooling`.

## 2026-05-22 — Shaded Whispering Dusk / claude / claude-opus-4-7 / `763ef4`

### Failure mode: seen-file JSON format breaks comms watcher silently (backfill flood)

- **Mistake**: started the all-channels comms watcher with a seen-file
  written in JSON format (`{ schema_version: ..., seen_event_ids: [...] }`)
  per the SKILL invocation example at
  `.agent/skills/start-right-team/SKILL-CANONICAL.md:139` which carries
  `<agent-codename>.json` as the filename. The CLI implementation at
  `agent-tools/src/collaboration-state/cli-runtime.ts:130-142` reads the
  seen-file as plain text, one event-id per line — `split(/\r?\n/u).filter(Boolean)`
  treats the JSON content as one invalid line. Result: every event in
  the directory became "unseen"; the watcher began emitting the full
  ~1300-event historical backfill before I could stop it.
- **Owner correction surface**: caught it myself within seconds of the
  first backfill notification arriving in the Monitor stream; stopped
  the watcher, re-primed the seen-file as plain text (one UUID per
  line), restarted clean.
- **Diagnosis**: this is the same shape as Blustery's missing-seen-file
  defect captured higher in this napkin under their 2026-05-22 section —
  the SKILL invocation example is the only authoritative documentation
  surface for the watcher invocation, and it can drift from the CLI it
  claims to specify. Blustery's instance: file did not exist → CLI saw
  empty seen-set → backfill. My instance: file existed but in wrong
  format → CLI saw empty seen-set → backfill. Both result in the same
  failure mode; both stem from the SKILL example carrying authority it
  cannot durably hold. The `.json` extension is the proximate misleader
  (the README at `agent-tools/README.md:348` uses `.txt`; the CLI is
  extension-agnostic; the SKILL is the misleading authority).
- **Cure shape (proposed)**: see the new plan
  `.agent/plans/agent-tooling/future/coordination-watcher-canonicalisation.plan.md`
  authored from a metacognition pass this session. Structural cure has
  three layers: (a) move the canonical home out of `.agent/reference/`
  to code-adjacent docs; (b) introduce `coord how-to-start` CLI that
  emits the canonical invocation parameterised by identity — agents call
  the command, never carry the example; (c) extend watcher scope from
  comms-only to multi-surface (active-claims, conversations,
  escalations, handoffs) so the ad-hoc /loop polyfill can shrink.
- **Falsifiability**: a future agent opening a `start-right-team`
  watcher after this plan lands should be able to run one CLI command
  and have a correctly-primed watcher start cleanly. If they still hit
  a seen-file format defect, the structural cure has not landed.
  Source plane: `operational` → `tooling`. Routing: pending-graduations
  entry below; plan in `agent-tooling/future/`.

### Surprise: `.agent/reference/` is for external materials, not internal canonical definitions

- **Expected**: I treated `.agent/reference/comms-watch-mechanism.md` as
  the canonical home for the watcher contract because the SKILL pointed
  at it and the file's content read like an authoritative spec.
- **Actual**: owner clarified mid-session that `.agent/reference/` is
  for external materials we consult (W3C specs, vendor docs, RFCs) —
  not for Oak-internal canonical definitions. Our own canonical
  definitions belong code-adjacent (next to the implementing CLI),
  with Practice-doctrine bits (identity discipline, anti-patterns)
  promoted to `.agent/rules/` or PDRs.
- **Why expectation failed**: there is no
  `.agent/reference/README.md` that states the folder's scope. Single
  occupancy (one file in the folder) made the mis-placement invisible;
  if the folder had carried a clear scope statement at the top, the
  defect would have been visible at session-open grounding.
- **Behaviour change**: before treating any folder as canonical home
  for an Oak-internal artefact, check for a folder-scope README or
  equivalent contract. If absent, ask. The cure is recorded in
  `coordination-watcher-canonicalisation.plan.md` Phase 7.
  Source plane: `operational` → `tooling`.

### What Worked: metacognition pass on a defect produced a structural cure, not a doc patch

- **Observed pattern**: when the owner invoked `/jc-metacognition` on
  the question "where should the canonical watcher definition live",
  the first move I considered was a doc patch (update the SKILL
  example from `.json` to `.txt`, add a one-line format note). The
  metacognition directive pushed deeper: *"has the inherited shape
  been ratified from first principles?"*. The first-principles lens
  surfaced that the doc-patch fix is a once-cure (next agent might
  hit a different inconsistency between SKILL/README/CLI); the
  structural cure (executable bootstrap CLI + code-adjacent canonical)
  is recurrence-proof.
- **Why this worked**: the directive's framing —
  *"the bridge from action to impact"* — forces evaluating cures by
  whether they amortise across future agents under rotating-cast, not
  whether they fix today's instance. Doc patches don't amortise;
  structural cures do.
- **Behaviour change**: when a defect's root cause has the shape
  "documentation surface can drift from implementation", default the
  cure to "make the documentation generated by the implementation"
  rather than "fix the current copy of the documentation". The
  executable-bootstrap pattern (CLI that emits the canonical
  invocation) is the worked instance of this principle.
  Source plane: `operational` → `process`.

### Live pattern: two-primary-each-fanning-out collaboration model

- **Setting**: owner directed mid-session that the next-phase meta-plan
  work should use "two primary Claude agents, working in tandem via
  team coordination mechanisms, each using the fan-out protocol to
  create teams of agents with highly defined tasks." Today (2026-05-22)
  this session became Peer A (Shaded Whispering Dusk, Lane A — PR-108
  snagging Cycles 5-10 + Phase Final) and Mistbound Slipping Night
  (`a1cb64`) was queued as Peer B (Lane B — Inc.1a closure or Inc.1d
  substrate, owner to confirm).
- **Architectural framing**: two-tier topology. Tier 1 is two Claude
  peer sessions on the same branch, both running `start-right-team`
  (comms watcher, active-claims, team-start broadcasts). Tier 2 is
  each peer dispatching Agent-tool sub-agents for parallel work within
  its lane. Sub-agents do NOT participate in collaboration protocols —
  they are invisible to active-claims, comms, etc. Their file scope
  is defended by their parent peer's claim, opened BEFORE dispatch.
- **The load-bearing precondition**: peer-level file-scope claim
  before any sub-agent fan-out. Without this, two peers could each
  dispatch sub-agents that collide on the same file because neither
  peer's claims surface the sub-agent's identities. Today's
  pre-validated solo fan-out (4 sub-agents on the meta-plan refresh,
  9 files, 0 conflicts) worked because there was no peer; the
  two-peer extension requires the new discipline.
- **Operational cost**: two peers paying start-right ≈ 60k tokens
  overhead; each then dispatches 3-5 sub-agents = 6-10 sub-agent
  slots total. Justified by lane parallelism IF the work has that
  much parallelism. Sub-agent context budgets are independent; the
  primary's context is the bottleneck (each absorbs each return).
- **Coordination cost**: two comms streams the owner has to follow;
  one closeout owner named across both peers (today's pattern: I am
  Lane A's session-handoff owner; Mistbound holds boundary-scoped
  closeout for Lane B).
- **/loop heartbeat is load-bearing**: complements the reactive
  watcher with time-driven sweeps the watcher does not surface
  (claims-file changes, sub-agent returns, silent-peer detection,
  120s cadence broadcasts). The watcher fires on filesystem-change;
  the /loop fires on time. Together they cover "what changed" + "what
  should have changed but didn't". Either alone has structural blind
  spots.
- **Falsifiability**: a session that runs this model and observes (a)
  no cross-peer sub-agent file collisions, (b) cohesive per-cycle
  commits with no race, (c) silent-peer detection within 180-360s of
  silence — confirms the model. A failure on any of these is
  diagnostic data for the model's refinement.
  Source plane: `operational` → `protocol`. Captured live during
  formation rather than after the fact so the design is not
  reconstructed-from-memory.

### Worked instance: session-handoff at compaction boundary, not session-close

- **Setting**: owner directed *"I am going to compact this session,
  please run a session handoff now to make sure that no insights will
  be lost"*. The compaction is a harness operation that replaces
  conversation history with a summary; the SAME session continues
  post-compaction.
- **Diagnosis**: this is structurally a checkpoint, not a session
  close. Conversation-only content (the two-primary model agreement,
  the /loop command verbatim, lane assignments, the peer-claim
  discipline) WILL be lost across the compaction unless flushed to
  durable surfaces. The handoff SKILL's steps were authored for
  session-close at owner sign-off; applying them at compaction means
  the goal shifts from "next-session pickup is clear" to "next-tick
  pickup is clear with full context absent".
- **Behaviour change**: when an owner names compaction explicitly,
  the handoff's priority is **conversation-only-substance flushing**.
  The repo-continuity and thread-record refreshes are still required,
  but the napkin entries should be more substantive than usual —
  they're the bridge across the compaction boundary, not just the
  capture-edge for the next consolidation pass. The /loop command
  text itself becomes load-bearing context that must land in a known
  durable location (thread record) so the post-compaction agent can
  re-issue it without reconstructing from conversation.
- **Falsifiability**: after the compaction, the post-compaction agent
  should be able to read the thread record + repo-continuity +
  napkin and have everything needed to advance Lane A. If anything
  load-bearing surfaces only as a gap during the next tick, this
  handoff was incomplete and that gap is the diagnostic for future
  compaction-boundary handoffs.
  Source plane: `operational` → `process`.

### Topology experiment: dual peer-primary lanes (NOT coordinator+specialists/generalists)

- **Setting** (owner aside, 2026-05-22 ~12:18Z): the current Lane A
  (Shaded Whispering Dusk) + Lane B (Mistbound Slipping Night)
  arrangement is a **new team topology experiment**, structurally
  distinct from the coordinator + specialists/generalists topology
  the prior 2026-05-22 session ran (Blustery as full-session
  coordinator routing Ferny / Foamy / Flamebright / Salty / Midnight
  as helpers under a hub-and-spoke shape).
- **Distinguishing structure**: two peer primaries running in
  parallel, each on a file-disjoint lane, each running their own
  /loop heartbeat, each owning their own sub-agent fan-out as
  needed. No coordinator role exists. Routing between the two
  primaries is direct peer-to-peer through comms broadcasts +
  directed events; the owner is the only escalation surface above
  the two primaries. Per Shaded's napkin entry on the two-primary
  model, claim-vs-claim file collision detection becomes load-
  bearing (no coordinator mediating); both peers run identical
  `/loop 180s` cadences so silent-peer detection works
  symmetrically.
- **Why this is not coordinator+helpers**: a coordinator topology
  has ONE authority routing decisions and dispatching helpers; the
  helpers do not own lanes, do not coordinate amongst themselves,
  and do not maintain their own /loop heartbeats. The peer-primary
  topology has TWO authorities, each with its own lane, each
  responsible for its own coordination with the other peer. The
  shape is symmetric, not hub-and-spoke. (Yesterday's WS2.2 ↔ WS3.2
  parallel pair captured in `start-right-team` §1
  cycle-overlap-coordination rule is the closest precedent; today's
  dual-primary lanes extend that shape to whole-session ownership
  rather than single-cycle ownership.)
- **Why this is not specialists/generalists**: a
  specialists/generalists topology stratifies agents by *capability
  scope* (reviewer specialists vs generalist implementers, with the
  primary fanning out to specialists for narrow expertise). The
  peer-primary lanes do not stratify by capability — both primaries
  are generalist implementers, file-disjoint by lane assignment, not
  by expertise. Each primary may itself dispatch reviewer
  specialists, but the two primaries are peers of each other, not
  primary+specialist.
- **What we are testing** with this experiment: (a) whether the
  peer-pair shape can sustain whole-session lane parallelism with
  no coordinator mediating; (b) whether the /loop heartbeat +
  watcher combination provides sufficient inter-peer awareness; (c)
  whether file-disjoint claim discipline holds without
  hub-and-spoke routing; (d) whether the owner's escalation surface
  stays manageable across two parallel comms streams rather than
  one routed through a coordinator.
- **Falsifiability**: a session that observes (a) repeated cross-
  peer claim collisions requiring owner intervention, (b) sub-agent
  fan-outs from the two primaries colliding on file scope, or (c)
  the owner spending more attention routing between the peers than
  a coordinator would have spent — falsifies the topology and
  points back toward coordinator+helpers for whole-session
  parallelism.
  Source plane: `operational` → `topology`.

### Mistbound (Lane B) — compaction-boundary handoff 2026-05-22 ~12:56Z

Compaction was requested by owner mid-session. Recording the
load-bearing context that must survive the conversation rewrite:

**Identity (post-compaction continues as)**: Mistbound Slipping Night
/ claude / claude-opus-4-7 / `a1cb64`. PRACTICE_AGENT_SESSION_ID_CLAUDE
env preserves identity through the harness.

**Persistent infrastructure that should survive compaction**:

- **Cron job `2ffafdad`** — session-only `*/3 * * * *` re-firing the
  full /loop instruction prompt every 3 minutes. The post-compaction
  agent must verify this cron is still scheduled on first wake-up via
  CronList; if it has dropped, re-create via CronCreate with the same
  cron expression and the /loop prompt verbatim (preserved in
  thread record below).
- **Monitor task `b1g350h9k`** — persistent all-channels comms
  watcher. **CORRECTION 2026-05-22T12:58Z** (Shaded's directed event
  re their monitor `b683jt1tv`): **monitor WILL be invalidated by
  compaction**; the persistent-task contract does NOT survive the
  conversation rewrite. Post-compaction agent MUST re-arm the watcher
  on first wake-up via the agent-tools comms watch CLI invocation
  recorded in `start-right-team` SKILL §0, using self-exclusion
  seen-file at `.agent/state/collaboration/comms-seen/mistbound-
  slipping-night.json` (already on disk).
- **Active claim `6ed6ca9a`** — Lane B presence, files area, TTL
  7200s from `2026-05-22T12:17:53Z` (expires ~14:17Z). Claim covers
  handoffs/, schemas, SKILL-CANONICAL, practice-index, PDR-063/064/066.

**Lane B work landed this session**:

- `c4bacfc5` — Lane B Tranche 1 substrate (ADR-182 T1 + ADR-183 T1 +
  PDR-064 SKILL amendments + topology napkin entry).
- `b6a8ca52` — Pre-execution code-expert review rule (canonical +
  Claude adapter + Cursor adapter + RULES_INDEX update). The owner-
  directed loop-doctrine capture, prior to ADR-183 T2 dispatch.

**Lane B work pending**:

- ADR-183 Tranche 2 (CLI rendering for `[FAILURE-MODE]`/
  `[BEHAVIOUR-NOTE]` tag tokens in `agent-tools/src/collaboration-
  state/cli-comms-watch.ts`). **Sidebar opener with Shaded posted
  at comms event 2026-05-22T12:50:14Z** with seven design questions
  (Q1 render-site location, Q2 token format, Q3 composition order,
  Q4 multiple tags per event, Q5 unknown tag handling, Q6 test
  substrate, Q7 ADR §Status flip).
- Post-compaction agent: read the sidebar reply from Shaded (search
  comms for in_response_to my `6bd9786c` event or topic match
  "ADR-183 T2" / "comms watch CLI rendering"). Once Q1–Q5 confirmed,
  dispatch the implementer sub-agent for the rendering update + tests.
- ADR-182 Tranche 2 remains deferred per ADR §"Landing tranche"
  (awaits first observed instance). NOT scope for this session
  unless owner direction changes.

**Peer state at compaction**:

- Lane A: Shaded Whispering Dusk / `763ef4` — Cycle 6 landed at
  `92dcd8bd`. Continuing PR-108 snagging Cycles 7–10. Likely
  approaching Cycle 7 dispatch by the time of compaction.
- Lane C: Tempestuous Spiralling Thermal / `9205b8` — joined ~12:55Z
  for jc-commit skill critical review + commit-queue commit workflow
  primitive (claim `70d1199a`). Owner spawned them with my opening
  statement at `/tmp/lane-c-opening-statement.md`. Lane scope:
  `.agent/skills/commit/SKILL-CANONICAL.md` + `agent-tools/src/
  commit-queue/` + tests. File-disjoint from Lane B.
- Consolidation: Wooded Swaying Thicket / `6c58f3` — memory critical-
  zone rotation (`pending-graduations.md` -118 lines so far; bundle
  uncommitted, pending session-close).

**Owner correction this session — DO NOT REVERT**: full-tree pre-
commit gating is intentional and correct. Staged-only gating is
rejected as a cure shape — "the worst bugs are often emergent
outside of changed files." Multi-writer coordination is solved by
queue + ordering + comms, NOT by narrowing gate scope. The agent's
session-memory entry at `feedback_pre_commit_hook_must_gate_staged_
only` has been overwritten to record this correction. The Lane C
opening statement pins this stance for Tempestuous's review work.

**The /loop instruction (verbatim, for cron recovery if 2ffafdad
drops)**:

```text
/loop 180s Advance lane AND coordinate. (1) Before any sub-agent
dispatch: ensure a peer-level active-claim is open covering the full
file scope of the imminent work; cross-check .agent/state/
collaboration/active-claims.json AND peer's latest broadcast for
collision. (2) If a fan-out is in flight, do NOT spawn another —
absorb returns as they arrive; when the cycle's full bundle is back,
run pre-commit gates and commit cohesively via the jc-commit skill
(no --no-verify). (3) If no fan-out is in flight and the next cycle
is ready, fan out: file-disjoint sub-agents, one task brief per
sub-agent, edits-only-no-commit-no-gates discipline. (4) If >120s
silent on shared comms, broadcast a brief progress event (lane
state, current cycle, blocker if any) per §5 cadence. (5) Cross-
check peer's recent broadcast scope against your intended next-
cycle file scope; open a sidebar BEFORE dispatching if encroachment
risk surfaces. (6) Surface anything the watcher will not surface
(silent peer past cadence, inter-peer routing question, missing
owner direction, blocked sub-agent return) via AskUserQuestion to
owner OR directed comms to peer — never block silently. (7) If
>75% context budget, post coordinator-style pre-positioning per
PDR-064 and prepare mid-cycle handoff record per PDR-063. (8) End
the tick when nothing is due — advance where possible, check where
required, post where mandated; do not force action when none is due.
```

**First-tick discipline post-compaction**:

1. Read this napkin entry and the recent comms backlog (last 10
   events) to recover state.
2. Verify monitor task `b1g350h9k` is running (TaskList); restart
   if dropped via the agent-tools comms watch CLI with self-
   exclusion seen-file at `.agent/state/collaboration/comms-seen/
   mistbound-slipping-night.json`.
3. Verify cron `2ffafdad` is scheduled (CronList); re-create from
   the /loop instruction above if dropped.
4. Broadcast a resume event naming compaction completion + state.
5. Check Shaded's comms for sidebar reply to ADR-183 T2 Q1–Q7.
6. If sidebar settled, dispatch T2 implementer per the pre-execution
   code-expert review doctrine just landed (`.agent/rules/pre-
   execution-code-expert-review-per-loop-cycle.md`).
7. If sidebar not yet replied, post a cadence event + standby.

**Falsifiability**: if post-compaction agent finds the cron has not
fired since compaction, the cron is session-only-and-compaction-
dropping rather than session-only-but-compaction-surviving. Re-
create immediately. If the watcher is silent for >180s after
verified-running, restart it. Either signal updates Shaded's
"compaction-boundary handoff" napkin entry shape with the empirical
finding.
Source plane: `operational` → `process`.
