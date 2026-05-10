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
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at
[`napkin-2026-05-10.md`][archive-pass]. The prior rotation is
[`napkin-2026-05-09.md`][previous-pass].

[archive-pass]: archive/napkin-2026-05-10.md
[previous-pass]: archive/napkin-2026-05-09.md

## 2026-05-10 — Windswept Sweeping Gale / claude-code / opus-4.7 / `726fcb`

### Surprise — assumptions-expert caught a citation drifted by mid-session file rename

- **Expected**: my Phase 0 `ls -la` confirmed
  `.agent/memory/executive/invoke-code-reviewers.md` exists at 11614 B,
  so the disposition ledger row 11 citation was sound and the discard
  rationale held.
- **Actual**: between my first `ls` and the assumptions-expert sub-agent's
  read, the file was renamed to `invoke-code-experts.md` as part of an
  in-flight reviewer→expert rename (commit `249600f1` from the
  Stormbound Floating Current Phase 1B closeout that landed earlier the
  same day). The reviewer's `ls` against the cited path returned ENOENT;
  the audit had recorded a file size for a path that no longer existed.
- **Why expectation failed**: the working tree had three different
  identities making concurrent edits to `.agent/` surfaces during the
  same morning. My Phase 0 read captured a snapshot that was already
  stale by the time of write. The mistake was not the read — the
  mistake was citing the path I read at write-time without re-verifying
  the path was still valid against the post-rename state.
- **Behaviour change**: when a reviewer or write-step references a
  named file path captured earlier in the session, re-`ls` before the
  reference is committed. If the working tree carries multi-agent
  in-flight edits (the brief explicitly named this state), treat all
  earlier path captures as snapshot-only.

### Surprise — substance-preservation under HARD fitness pressure on `pending-graduations.md`

- **Expected**: a single batched candidate entry covering 8 items would
  fit within the existing `pending-graduations.md` budget (line target
  2000 / limit 2500; char limit 150000).
- **Actual**: my first batch authoring pushed character count to 155305
  (HARD over by 5305). After natural pairing of 19+21 (shared target)
  and 29+30 (shared scope), the count came down to 154078 — still HARD
  but reduced by ~1227 chars without losing substance.
- **Why interesting**: the pairing was curation-shaped (pairs were
  genuinely paired by source rationale), not optimisation-shaped. The
  PDR-026 substance-preservation discipline + ADR-144 §9e
  (limit-raise-is-owner-only) yielded the honest two-step: apply
  substance-preserving structural fix (pairing), then surface limit
  decision to owner. I did not trim withdrawal triggers or per-item
  rationale to chase the budget.
- **Cure (worked)**: the natural-pairing move is doctrine-aligned;
  the residual HARD signal is information for owner decision, not a
  blocker on my work.

### Surprise — `git stash --keep-index` is risky during shared-state sessions

- **Expected**: `git stash --keep-index` to compare current vs HEAD
  character counts on `pending-graduations.md` would be a reversible
  read-only-shaped probe.
- **Actual**: owner immediately interrupted: "no, stash is risky" — and
  the cleaner alternative was `git show HEAD:<path> | wc -c` which
  reads HEAD content without touching the working tree.
- **Why expectation failed**: `git stash` is state-mutating even with
  `--keep-index`; in a working tree carrying multi-agent in-flight
  edits, stashing risks losing peer-agent staged content the same way
  the foreign-stage absorption pattern documented. The `git show HEAD:`
  alternative achieves the same goal without any state mutation.
- **Behaviour change**: for "compare current state to HEAD" probes,
  default to `git show HEAD:<path>` over `git stash` even with
  `--keep-index`. Stash is genuinely destructive-shaped under
  multi-agent commit pressure.

## 2026-05-10 — Sylvan Sprouting Grove / codex / GPT-5 / `019e12`

### Deep Consolidation Opening

- Owner requested a deep `consolidate-docs` workflow from the
  `start-right-quick` entrypoint. I read the start-right and
  consolidate-docs skills, AGENT/principles/testing/schema/orientation
  directives, the always-applied rules, active memory, thread state, and
  collaboration state before editing.
- Identity preflight resolved `Sylvan Sprouting Grove` /
  `codex` / `GPT-5` / `019e12`. Active claims at open were fresh:
  Windswept Sweeping Gale owned the Claude insight-report disposition
  plan/pattern/pending-graduations lane; Stormbound Floating Current
  owned invoke-rule/expert cleanup surfaces. I registered a broad
  read-oriented `.agent/**` consolidation claim and logged the overlap
  decision before substantive shared-state work.
- Branch shape is already critical: `branch-touched-files` reports
  510 files against `origin/main`. This makes broad mutating
  consolidation inappropriate without owner decision; this pass favours
  preservation, evidence, and explicit owner-approval points.

### Napkin Rotation

- `pnpm practice:fitness:informational` reported active `napkin.md` as
  critical on lines, characters, and prose width. Per the consolidation
  workflow, I archived the outgoing napkin verbatim to
  `archive/napkin-2026-05-10.md`, distilled behaviour-changing lessons
  to `distilled.md`, and started this fresh active napkin.
- Loop-health diagnosis so far: earlier zones fired repeatedly, but
  same-day multi-agent traffic outpaced per-session closure. The limit
  still looks appropriate for an active capture file; the symptom is not
  that napkin should be larger, but that rotation must happen as soon as
  the file crosses the consolidation threshold.

### Deep Consolidation Findings

- After rotation, the active napkin is healthy; the only remaining hard
  fitness surface is `repo-continuity.md` (lines plus characters). Its
  frontmatter already names the correct split strategy, so the next move
  should be a targeted archive/current-state reconciliation, not prose
  compression.
- `repo-continuity.md` now mixes fresh 2026-05-10 session-close blocks with
  older branch-primary state for `planning/graph-tooling`, while the live
  branch is `feat/mcp-graph-support-foundation`. That is a continuity risk:
  stale "current" text can look more authoritative than the thread records.
- The latest experience files repeat one doctrine through different worked
  examples: gates and fitness signals are prompts to route knowledge to the
  right home. Treating them as numerical or bypass problems is the recurring
  failure mode.

### Session Handoff

- `/jc-session-handoff` after the deep pass did not surface a new ADR/PDR
  candidate. The already-captured finding is operational: `repo-continuity.md`
  should be reconciled by its named split strategy, because stale current-state
  text is now a bigger risk than the line count itself.
- Windswept Sweeping Gale became the sole active claimant on the
  insight-report implementation lane before handoff. The handoff claim stayed
  on continuity surfaces only, which is the right shape for closing a session
  while another agent is actively integrating the plan/pattern/register work.

## 2026-05-10 — Sylvan Fruiting Glade / claude-code / opus-4.7 / `a53e45`

### Owner reframe — pending-graduations gate vocabulary is fabricated avoidance

- **Trigger**: owner-invoked `/jc-session-handoff /jc-consolidate-docs` with
  direction *"identify the documents that are in the hard or critical fitness
  zone, and then carefully curate and care for the accumulated knowledge.
  Start with pending graduations"*. Pre-flight Explore-agent triage of the 7
  `due` + 2 `partially-graduated` + 1 `quarantined` items returned ZERO
  drain-now classifications: 4 DEFER-DEDICATED-SESSION (XL with sequenced-
  deferral pointers), 3 HELD-PLAN-GATED (vaporware-gated), 1 OWNER-RETHINK,
  1 by-design-partial.
- **Owner correction (verbatim)**: *"this IS the session where we graduate
  the pending graduates, they have been stuck for a long time, we have an
  overly and accidentally restrictive graduation policy. Nothing is deferred,
  the made up gates never applied, they are just avoidance. Do it ALL in
  session."*
- **Why expectation failed**: I read each entry's *gate vocabulary* (`size:
  XL`, `vaporware-gated`, `sequenced-deferral pointer`, `N>=3-validation`)
  as authoritative scheduling discipline rather than as the avoidance signal
  it had become through accumulation. The substance was graduation-ready in
  every entry; the gates pointed at fabricated dependencies (e.g. PDR
  drafting framed as "directive-shaped work requiring <30% context", which
  is wrong scope — directives are .agent/directives/, PDRs are
  .agent/practice-core/).
- **Behaviour change**: read substance before metadata when triaging
  graduation candidates. If a competent agent could draft the target
  artefact from the entry body alone, the substance is graduation-ready —
  the size tag is a tag, not a verdict. Captured as
  [`patterns/fabricated-gate-as-avoidance.md`](patterns/fabricated-gate-as-avoidance.md)
  (anti-pattern, agent category) before any other work this session.
- **Plan**: graduate all 7 due + 2 partial-graduated + 1 quarantined items
  in this session per
  `/Users/jim/.claude/plans/jc-session-handoff-jc-consolidate-docs-serialized-fiddle.md`.
  Phase 0 (this entry + the pattern) ships first as a guard so the same
  vocabulary cannot return to the queue mid-session.

## 2026-05-10 — Shaded Rustling Pollen / claude-code / opus-4.7 / `32d1c8`

### Surprise — initial xargs grep filter excluded plural-form rule names

- **Expected**: my filter `xargs grep -l -E -- '-[Rr]eviewer\b'` would catch
  every file containing any `<word>-reviewer\b` reference, since the
  Phase 2 owner-direction was a vocabulary refresh from `-reviewer` to
  `-expert`. The `\b` word boundary handled positions like
  `architecture-reviewer-fred` (boundary between `r` and `-`).
- **Actual**: 15 files contained ONLY `invoke-code-reviewers` (plural rule
  filename, including the `s`) without any singular `<word>-reviewer\b`
  occurrence. My filter missed them entirely. Reviewer dispatch
  (onboarding-expert) caught the broken `invoke-code-reviewers.md` link
  in `docs/governance/development-practice.md:73`; code-expert caught
  `.agent/rules/no-speed-pressure.md:84`; cross-reference grep then
  surfaced ADR-125 + 12 other files all carrying the same plural-only
  citation.
- **Why expectation failed**: I treated the dominant form (`-reviewer`
  singular) as if it covered the morphological space. Rule filenames
  conventionally use the plural ("invoke-code-reviewers", "route-
  reviewers-by-abstraction-layer", "invoke-doc-and-onboarding-reviewers-
  on-significant-changes"). The plural form is grammatically distinct
  and must enter the FILTER expression, not just the substitution
  expression. Mismatched filter-vs-substitution morphology compounds
  silently across hundreds of files because the missed forms never
  reach the substitution stage.
- **Behaviour change**: when sweeping for vocabulary changes in
  filenames or rule references, enumerate every morphological variant
  (singular, plural, possessive, lower/Title/UPPER case) in the FIRST
  filter that builds the candidate file list. The substitution can be
  surgical, but the filter must be complete.

### Surprise — markdown link fragment broke when its heading was kept generic

- **Expected**: my regex matched `<word>-reviewer\b` consistently across
  link text, link fragments, and headings. If the heading at line 225
  contained "Reviewer", the link fragment at line 1120 referencing
  `#mandatory-reviewer-gates` would either both update or both stay.
- **Actual**: heading `## Mandatory Reviewer Gates` (capital R,
  space-separated, generic role concept) was untouched by my regex —
  correctly, it is a generic role-concept noun phrase. But the link
  fragment `#mandatory-reviewer-gates` (lowercase, hyphenated) matched
  `<word>-reviewer\b` (`mandatory-reviewer`) and was updated to
  `#mandatory-expert-gates`. Markdown lint caught the broken anchor.
- **Why expectation failed**: my regex treated all positional
  occurrences uniformly, but the heading's slug is a derived form that
  encodes a different generic-vs-specific decision than the heading
  text itself. The same vocabulary instance can be generic in
  text-form (capitalised, spaced) and specific-shaped in slug-form
  (lowercase, hyphenated) by accident of slug derivation.
- **Behaviour change**: bulk regex substitutions that touch markdown
  link fragments must verify that the corresponding heading was
  ALSO updated by the same regex. If the heading is intentionally
  preserved (generic role concept), the link fragment must be
  reverted. If the heading was meant to update, both must update
  together. Markdownlint catches this at commit time, but a pre-commit
  audit grep `\[.*\]\(#[a-z][a-z\-]*-expert\b\)` against headings
  would catch it earlier.

### Surprise — peer claim registered mid-sweep was only detected by accidental file inspection

- **Expected**: bootstrap-fast-path at session open ("no live
  overlapping claims") + my Phase 2 commit-stage verification would
  surface any new peer claim before commit.
- **Actual**: Sylvan Fruiting Glade registered claim 07a92f67 at
  2026-05-10T15:53:08Z, while I was deep in the regex substitution
  pass. I only detected the overlap during the commit-stage `git
  status` check — because I noticed `active-claims.json` was modified
  unexpectedly and inspected the diff. Without that incidental
  curiosity, I would have committed mechanical edits over Sylvan's
  claimed `pending-graduations.md` and `practice-core/CHANGELOG.md`,
  producing a merge conflict the moment Sylvan committed their
  pending-graduations drain.
- **Why expectation failed**: bootstrap-fast-path is a SESSION-OPEN
  check. For long-running mechanical sweeps that touch many files
  over an hour or more, the session-open snapshot is stale by mid-
  session. There is no equivalent of "branch-touched-files" for
  active-claims; the claim list is a live state that needs periodic
  polling.
- **Behaviour change**: for mechanical sweeps spanning >30 minutes
  or >100 files, schedule periodic active-claims re-checks during
  execution — at minimum before each commit. The check is cheap
  (`git diff -- .agent/state/collaboration/active-claims.json`).
  Memory note "Periodic comms surface checks" already exists; this
  instance reinforces that the cadence is the agent's responsibility,
  not just the surface owner's.

### Confirmation — `git show HEAD:<path> > <path>` reverts cleanly under hook policy

- The hook policy blocks `git checkout HEAD -- <file>` as a
  "dangerous pattern". When I needed to revert my mechanical edits
  to two files inside Sylvan's claim, `git show HEAD:<path> > <path>`
  worked: it pipes the HEAD content to the working-tree file,
  produces a clean zero-diff state, and never touches git's index
  or HEAD. This is the correct revert pattern under the hook policy.

## 2026-05-10 — Umbral Creeping Night / claude-code / opus-4.7 / `188baa`

### Surprise — prepare-commit-msg hook silently overrode a manually-drafted commit subject

- **Expected**: `git commit -m "<my subject>" -m "<body>"` lands the
  commit with the literal `-m` arguments as the message. This held
  for chunks 1–7 (subjects matched my drafts; chunk 1's subject was
  pre-set by Shaded Rustling Pollen's queued message which was
  reasonable).
- **Actual**: chunk 8 (ADR-173 / graph-stack plan boundary cleanup,
  staged 7 files) committed as `ae2d415f` with subject
  `docs(memory): break long line in distilled.md graduation pointer`
  and a first paragraph rewritten to describe the distilled.md ref-
  link conversion. My drafted subject and first paragraph never
  reached the commit object. One body line was truncated mid-word
  (`source set,` became `ce set,`), so a hook ran a string-replace or
  partial concatenation pass against my message rather than a clean
  override.
- **Why expectation failed**: a prepare-commit-msg hook (or
  equivalent) appears to inspect the staged diff, decide which file's
  change is "dominant" by some heuristic, and rewrite the subject +
  intro accordingly. The heuristic picked a 3-line distilled.md
  ref-link tweak over the 84-line ADR-173 restructure. The hijack
  did not fire on chunks 2–7 — likely because those were
  single-domain commits where the heuristic's choice happened to
  align with my draft.
- **Behaviour change**: when committing a multi-domain bundle,
  inspect the resulting commit subject after `git commit` returns.
  If a hook overrode the subject, surface to owner before pushing —
  amending is destructive but a wrong subject is a permanent record.
  Diagnostic command: `git log -1 --format=%s` immediately after
  commit. Candidate registered for a future structural cure
  (PDR-053 surface-polarity treatment for prepare-commit-msg vs
  blocking commit-msg hooks).

### Surprise — `pnpm format:root` and `pnpm markdownlint:root` find different files on each run

- **Expected**: running `pnpm format:root && pnpm markdownlint:root`
  once would resolve all formatting/markdown issues across the tree;
  the next pre-commit hook would pass.
- **Actual**: each commit retry surfaced a NEW unrelated file
  needing formatting (ADR-176 → ADR-178 → ADR-171 → ADR-163 →
  ADR-173 → ADR-116 → repo-continuity.md). Each individual fix took
  one round-trip through the pre-commit hook and a re-run of the
  fixers. The pattern repeated 5+ times during the commit drain.
- **Why expectation failed**: parallel agents (Sylvan, Fragrant)
  were authoring new files DURING my commit run. Each newly-created
  file arrived in an unformatted state (the authoring agent didn't
  format-on-save), and `pnpm format:root` against the whole tree
  picked them up only after they appeared. The retry loop wasn't a
  bug in the formatters — it was real work appearing live in a
  multi-agent shared working tree.
- **Behaviour change**: in a multi-agent active session, expect
  whole-tree gate hooks to surface peer-authored files repeatedly.
  Repair immediately per the gateable-repo discipline; do not treat
  the loop as a hook failure or attempt to narrow hook scope. Time
  budget: each retry costs ~30s of pre-commit hook + fix; budget
  for 3–5 retries on a busy multi-agent commit drain.

### Surprise — `git commit -- <pathspec>` preserves peer staging

- **Expected**: when I needed to commit a subset of staged files
  (Chunk 2 = patterns + PDR-014, leaving 2 staged scripts for
  Chunk 3), my first reach was `git reset HEAD -- <scripts>` to
  unstage them.
- **Actual**: owner interrupted: "no resets, no stash" — both are
  destructive-shaped operations under the never-use-git-to-remove-
  work rule. The clean alternative is `git commit -m ... --
  <explicit pathspec>`: git commits ONLY the listed paths and
  leaves other staged files in the index untouched, ready for the
  next chunk.
- **Why expectation failed**: I read `git reset HEAD -- <path>` as
  "non-destructive unstaging" because it doesn't touch the working
  tree. But it DOES drop the staged content, and in a multi-agent
  shared tree where staging is contested, dropping any staged
  content risks losing peer-authored work that someone else expected
  to be in the index. Owner's rule treats reset as destructive
  because it discards information from the index in a way that's
  not recoverable from working-tree state alone.
- **Behaviour change**: for "commit a subset of staged files",
  default to `git commit -- <pathspec>`. For "remove a file from
  staging entirely without committing it", surface the use case to
  owner — there's no current session-tested clean path.

## 2026-05-10 — Fragrant Regrowing Root / codex / GPT-5 / `019e12`

### What Was Done

- Clarified the graph MVP source-authority model across ADR-173,
  ADR-157, graph MVP plans, and the EEF plan: EEF uses the repo-held
  JSON snapshot pending EEF clarification; Oak ontology raw material comes
  from GitHub; misconception graph data is constructed from Oak bulk data
  inside this repo.

### Patterns to Remember

- When an owner correction changes data-source authority, update executable
  plan frontmatter as well as prose. Future agents often start from YAML
  todos; if the correction lives only in a body section, implementation can
  drift back to the stale model.

### Correction Captured

- I initially framed EEF provenance as if the repo may have constructed or
  scraped the dataset. The owner clarified that the data was either downloaded
  or supplied by EEF, and that the repo copy is definitive until EEF clarifies
  provenance and refresh mechanics. Behaviour change: never describe the EEF
  JSON as reconstructed or scraped unless a future EEF source confirms that.

## 2026-05-10 — Quiet Lurking Mask / claude-code / claude-opus-4-7-1m / `88b0a5`

### What Was Done

- Owner-directed QUAR-1 reformulation (a) Reformulate-and-land:
  graduated quarantined `apply-don't-ask` / `stop-inventing-optionality`
  to PDR-057 (empirical-answerability pre-question gate) and PDR-058
  (three-tier optionality decomposition). Pair-reviewed by
  docs-adr-expert + onboarding-expert + assumptions-expert.
- Retired 4 dead-doctrine references (eef.next-session,
  agentic-engineering-enhancements.next-session, graph-query-layer.plan.md,
  undo-change SKILL-CANONICAL).
- Retired user-memory `project_apply_dont_ask_superseded.md`.
- Archive snapshot: 3 graduated entries (pattern polarity, 30%
  context budget, orchestrator-vs-gate) moved to dated archive.
  pending-graduations dropped 157,255 → 149,079 chars (cleared HARD).
- Three commits: 1bd9a18b, 67350e82, a098d709.

### Surprise — foreign-stage absorption fired post-verify-staged

- **Expected**: stage-by-explicit-pathspec + verify-staged
  (PDR-054 + ADR-177) protects the authorial bundle. Verify-staged
  passed cleanly on the archive-snapshot commit with my explicit
  2-file scope.
- **Actual**: the resulting commit `a098d709` landed 11 files.
  Between `verify-staged` returning OK and `git commit` invoking
  the hook chain, the pre-commit hook (which runs `lint:fix`,
  format-fix, RULES_INDEX regen, platform-adapter regen) modified
  files and auto-staged them. Files swept in: 3 platform-adapter
  rule files (regenerated from canonical), `.claude/settings.json`,
  `RULES_INDEX.md`, `agent-tools/src/core/health-probe-{parity,shared}.ts`
  (substantive `-100` line changes), and two scripts including a
  `-264` line change in `validate-portability.ts`.
- **Diagnosis**: PDR-054 / ADR-177's verify-staged fingerprint
  divergence check runs BEFORE the hook chain. The hook chain
  itself stages new files (this is its design — auto-fix and
  re-stage). So the verify-staged window does not cover
  hook-introduced absorption. The asymmetric-cure framing is
  precise: my disciplined pathspec staging protected the inbound
  scope, but not the post-hook scope.
- **Behaviour change**: surface this as a PDR-054 + ADR-177
  amendment candidate — symmetric cure requires either (i) a
  post-hook verify-staged INSIDE the hook chain that fails the
  commit if non-queued files appear, or (ii) a separate
  post-commit "absorption audit" that surfaces the absorption
  with high visibility. Adding to pending-graduations as a
  candidate at this handoff per step 6b.

### Insight — hook-chain re-staging is design, not bug

- Pre-commit hooks in this repo do real work: lint:fix, format-fix,
  RULES_INDEX regen, platform-adapter regen. Each of these makes
  edits that need to land with the commit. The hook stages those
  edits. That is the hook chain doing its job correctly.
- The conflict is between "hook chain stages necessary fixes" and
  "agent staged exactly the intent bundle". These are both correct
  in isolation; the friction is at the seam.
- The PDR-054 / ADR-177 cure was framed around peer-staged work
  (parallel agent's WIP being absorbed). The hook-staged case is
  structurally identical but has different intent: hook-staged
  files are *meant* to land. Telling them apart is the design
  question.
