# Verify, Do Not Trust

When live coordination, routing, validation, or completion depends on a claim,
ask for artefacts and inspect them. Do not treat a peer's status statement,
handoff prose, owner recollection, sub-agent summary, or your own prior note as
verified state until the relevant evidence has been checked.

This rule graduates the 2026-05-24 Knowledge Curator finding captured in the
active napkin and `pending-graduations.md`: "verification asks need artefacts,
not trust confirmations".

## Rule

If a decision changes work ownership, route, completion status, gate state, or
knowledge disposition, verify it against the surface that would make it true.
A claim becomes true only when the proving surface is current and visible, not
merely present in a historical, contaminated, in-flight, or superseded artefact.

Ask for and inspect concrete artefacts such as:

- claim IDs and the current `active-claims.json` entry;
- file paths and current file contents;
- comms event IDs and event bodies;
- transcript IDs or reviewer outputs when a review is the evidence;
- staged diff, git status, commit, or branch evidence;
- command output from the gate that actually covers the requirement;
- source-side enumeration output for completeness claims, such as `rg`,
  import graphs, generated indexes, schema inventories, or source corpus lists.

Generic confirmations like "done", "still true", "looks good", "green",
"landed", or "processed" are routing hints, not proof.

Reviewer output is also evidence to test, not another substrate pointer to
trust. When absorbing reviewer findings, verify the highest-stakes claims
against live artefacts, identify reviewer blind spots, and then decide what to
absorb.

Fix verification must also return to the original defect location. A patch that
adds intended cure text elsewhere but leaves the contradicting source text in
place has not fixed the defect. Re-read the original offending line or section,
not only the new-content area, before declaring the tranche complete.

## Apply This Before

- closing or transferring a claim;
- reporting a plan item, gate, reviewer condition, or curation phase complete;
- moving source material to archive;
- accepting a handoff as current state;
- routing a peer based on a claim about another peer's status;
- absorbing sub-agent or reviewer findings into a durable artefact.
- closing a reviewer, revision, or fix tranche that was meant to remove or
  replace a specific defective statement.
- asserting that all siblings, consumers, imports, labels, sections, statuses,
  or file-set members have been found.

## What To Do Instead

1. Name the specific fact that needs proving.
2. Name the artefact that would prove it.
3. Inspect that artefact directly.
4. Report the verdict with the artefact reference.

For curation work, this means a source is not "processed" because a pass log
says so. It is processed only when the source substance has a visible
disposition: permanent home, pending route, explicit duplicate skip, or named
blocker.

For completeness work, start from the source side rather than the claim side.
A spot check scoped to files named by a claim cannot discover unclaimed
consumers or siblings. Enumerate from the code, graph, schema, or source corpus
first, then compare the claim boundary to that discovered set.

Verification applies to your own verification. A sweep, grep, or audit command
is itself a claim-shaped artefact: before trusting its empty result, audit its
filters — any exclusion (`-v`, glob, path scope, type filter) that could remove
the class under test invalidates the sweep. The same discipline covers your own
summarised verdicts: a conclusion you recorded earlier is a claim to re-test at
the point of action, not a fact to inherit.

Verification reaches the *meaning* of an inherited frame, not only its
existence. A recorded verdict, a continuity note's diagnosis, or a status
label tells you what a prior mind concluded — it does not tell you the role,
meaning, or current correctness of the thing it describes. Before letting
inherited prose define the question you are answering, re-test the verdict
against the live artefact: is this still the right frame, or am I inheriting a
stale diagnosis as my starting premise?

The proactive form: before editing *around* an inherited story to repair it,
find the fact that would **falsify** the proposed repair. Locate the fact that
would break your fix before you build it — the diagnostic counterpart to "a
recorded verdict is a claim to test." If you cannot find the falsifying fact,
you have not yet understood the defect well enough to repair it.

A *mutating* sweep needs its set dispositioned before it runs, not only its
filters audited after. Before a broad text-sweep or revert (multi-file
find-replace, bulk revert, a `sed` across a tree), enumerate the planned set and
its per-class disposition when the set spans more than simple live prose —
generated snapshots, immutable records, and peer edits each need explicit
handling. A blanket sweep that treats every class alike corrupts the ones it
should never have touched.

Read the failure surface, never the exit code, for any wrapped, piped, or
output-captured invocation. A pipe, redirect, or background-task wrapper reports
the *wrapper's* exit, not the inner command's: a green hook banner with zero
transfer behind a piped `git push`; a SIGPIPE-141 after a passing gate when the
output is redirected; a background-task wrapper reporting exit 0 while both inner
hooks ran red. Inspect the inner command's actual output, not the wrapper's
status. The full behavioural doctrine is the pattern
`wrapped-exit-codes-false-green`.

## Citation or Silence

A load-bearing claim about current state — what is paused, landed, conserved,
authorised, decided, or merely *exists* — may not stand in your output unless
the same sentence carries a source you inspected **this session**: a
`path:line`, command output, an event ID, or the owner's own turn. If you
cannot cite it, you have two honest moves: read the proving surface, or write
the claim tagged `[unverified]` so it cannot pass as fact.

This is structural, not a matter of vigilance. The failure mode is a claim that
arrives *fluently* — smoothly enough to bypass the instant you would have
checked it — and fluency is exactly what an internal "remember to verify"
intention cannot catch. The missing citation can: it is a visible feature of
the sentence, observable to you as you write and to a reader as they read. Gate
on the artefact the fluent claim omits, not on the feeling you hoped to notice.
The smoother and more convenient the claim, the harder the citation is owed.

## Anti-Patterns

- Asking "are you done?" when the answer needs a claim, diff, event, or gate.
- Accepting silence after a broad status question as evidence.
- Treating a handoff record as live state without checking current claims,
  comms, and git.
- Trusting a sub-agent's cited source without opening the source.
- Calling an archive move a completed curation pass without disposition
  evidence for the archived substance.
- Checking only the intended cure location while the original defect location
  still carries contradictory text.
- Treating a label as live because the token appears in a changelog,
  historical note, superseded plan, or contaminated in-flight artefact.
- Checking only files named by a claim when the assertion is about all
  consumers, siblings, or members of a source set.
- Declaring a sweep clean while the sweep command carried an exclusion filter
  that removed the very class it was meant to inspect.
- Reading a commit's success or failure from the streamed terminal display
  rather than from `git log -1` / `git status`.

## Composition

- [`respect-active-agent-claims`](respect-active-agent-claims.md) — claims are
  a live ownership surface; read them before acting on scope.
- [`use-agent-comms-log`](use-agent-comms-log.md) — comms events are evidence
  surfaces, not just notifications.
- [`present-verdicts-not-menus`](present-verdicts-not-menus.md) — once the
  artefacts prove a verdict, present it instead of asking the owner to choose.
- [`knowledge-preservation-over-fitness-warnings`](knowledge-preservation-over-fitness-warnings.md)
  — process source substance before archive moves, even under fitness pressure.

## Worked Instances

- 2026-05-23 Scorched Director window: "don't trust, verify" was named as a
  deeper Director primitive after repeated trust-propagation failures on peer
  and routing state.
- 2026-05-24 Lanternlit plan refinement: reviewer-pass plus critical analysis
  caught trusted-but-unverified throughput and claim-state assertions.
- 2026-05-24 Knowledge Curator continuation: Shaded's read-only review caught
  a scoping defect in the archive-after-processing rule patch; the finding was
  verified against the rule's Scope section before absorption.
- 2026-05-24 PDR-066 revision: a blocker fix added new cure text while leaving
  the original contradicting statement in place; the durable check is to inspect
  the original defect location before calling the revision complete.
- 2026-06-02 JC4 thread-progressions repair: claim-scoped spot checks missed a
  consumer outside the named set; the durable check is source-side enumeration
  before accepting completeness.
- 2026-06-02 EEF D4 sibling-frontmatter repair: a stale label was present in
  history and contaminated artefacts but not live truth; assertion-time checks
  needed to test whether the cited label was current and visible.
- 2026-05-30 readiness review + 2026-06-09 factory-importer refutation: two
  sweeps reported clean because the command's own exclusion filter (`-v
  .test.ts` in the second instance) removed the class under test; the durable
  check is to audit the sweep's filters before trusting its empty result.
- 2026-06-15 Cursor commit-output truncation: the Cursor agent shell returned
  exit 1 and truncated `git commit` hook output (stopping before the build gate)
  while the commit actually landed; the durable check is to confirm a commit's
  outcome from authoritative git state (`git log -1`, `git status`), never from
  the streamed terminal display — the display was never the source of truth,
  independent of any one platform's truncation behaviour.
- 2026-06-16 long-gate status drift: a long aggregate gate run (`pnpm check`,
  full test/build sweeps) can mutate the working tree (codegen, format, doc-gen);
  claiming "tree clean" or writing handoff state from a pre-gate `git status` is a
  stale-claim failure. The durable check is to rerun `git status --short` *after*
  any long gate, before asserting clean or recording closeout state.
- 2026-06-16 no-commit owner-visibility: a successful file write is proof to the
  writing agent, not to the owner, when the file stays untracked and uncommitted.
  In no-commit sessions a "created X" report carries the path **plus current
  `git status` evidence**. Sibling: after a `git mv` followed by a later
  `Write`-edit of the renamed file, verify the *staged content* (`git show :<path>`),
  not just the rename — a 100%-similarity (`R100`) score is the tripwire that the
  staged blob is the pre-edit original and the real change is unstaged.
- Status surfaces are pointers, not facts: thread records, frictions registers,
  plan statuses, and register markers each describe state without being it. A
  frictions register stamped "addressed-in-working-tree" with a never-completed
  "replace with SHA" trigger reads "fixed" for work that may never have
  committed. Before acting on any status, recompute against the current
  code / data / state, not the marker.
