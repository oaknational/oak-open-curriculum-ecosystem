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

**Self-state is the category where this discipline is most often skipped.** Agents
reliably verify a peer's, a sub-agent's, or a bot's claim first-hand, then accept
a reading of *their own* state — "I'm context-spent", "the host is under load",
"I exhausted the rate-limit budget", "I spotted a gap nobody else saw" — without
the same check. The reason is structural: a self-reading arrives *fluently* (it
feels true from the inside), and fluency is exactly what bypasses the situational
check (`fluency-is-a-failure-vector`). The observable cures are the data already
in hand, not introspection: read the harness/`rate_limit`/Activity-Monitor
figure, not the felt level. Treat any claim whose subject is your own capacity,
budget, or completeness as the *highest*-priority claim to verify against an
external artefact, not the one to wave through.

A gate's *green* is itself a claim, not proof the gate works. A completion gate,
validator, or count can read green while silently failing on the very input it
exists to catch — most dangerously at the moment you cite its green as evidence
that work is done. Before trusting a gate's pass, confirm it can go *red* on a
known-bad input; a gate never observed failing has not been verified, only
assumed. This applies hardest to your own completion gates.

Verification reaches the *meaning* of an inherited frame, not only its
existence. A recorded verdict, a continuity note's diagnosis, or a status
label tells you what a prior mind concluded — it does not tell you the role,
meaning, or current correctness of the thing it describes. Before letting
inherited prose define the question you are answering, re-test the verdict
against the live artefact: is this still the right frame, or am I inheriting a
stale diagnosis as my starting premise?

The same discipline covers authorities you are about to cite or copy. Before
writing "this discipline lives in ADR-NNN" into a durable artefact, open the
claimed home and confirm the substance is actually there — citing from a memory
of "where this kind of thing lives" plants a wrong authority that a future
reader follows to nothing (worked failure 2026-06-30: a plan cited ADR-117 for
a discipline that lives in the plan architecture; caught pre-commit). And
before recommending a consistency or "simplify" move on tooling, ground the
**governing** decision (the ADR/PDR that owns the surface), never the sibling
that looks simplest — siblings can themselves be the inconsistency (worked
instance 2026-06-29: "run it via tsx like its siblings" would have violated
ADR-178, which mandates built-`dist` for agent-tools CLIs; the simplest-looking
siblings were the outliers).

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
- Concluding "X does not exist / is untested / is missing" from a subtree
  search. A negative existence claim earns the same whole-package search as a
  positive assertion — a subtree scope is exactly the path-scope exclusion above,
  and a convention the subtree omits (e.g. tests living in a `tests/` tree, not
  colocated in `src/`) is precisely what it misses. The tell is fluency that
  flatters: "I spotted a gap" arrives smoothly because it flatters a gap-spotter
  self-image, and that smoothness is what bypasses the whole-package check.
- Reading a commit's success or failure from the streamed terminal display
  rather than from `git log -1` / `git status`.
- Asserting a whole-file property (size, line count, "all captured") from a
  windowed (offset+limit) read — run the cheap probe (`wc -l`, the fitness
  report) before any whole-file claim.
- Running a generator / codegen / build script to *diagnose* without reading it
  first — a `clean` / `rm -rf` prelude on a command that may crash deletes
  tracked artefacts (a diagnostic `sdk-codegen` once deleted ~100 tracked files
  this way).

## Timestamp-Zone Discipline

Owner-directed, standing (2026-06-29) — all agents, all analysis. A timestamp is a
load-bearing fact; an unlabelled or mis-zoned one is a verification failure.

- **UTC (`Z`) is the canonical analysis clock.** Host / `pmset` / system logs / the
  Monitor wall-clock are in the **host's local zone — determine it (`date +%z`), never
  assume a fixed offset** (it varies by host and by DST). Convert every local source to
  UTC using that actual offset and **show** the conversion (e.g. on a `+0100` host,
  `01:06 +0100 = 00:06Z`).
- **Never compare a `…Z` time against a local-offset time** — the 2026-06-25 false
  58-minute coordinator-less gap came from reading `07:52Z` against an `~08:50` local
  clock on a `+0100` (BST) host, where `07:52Z` *is* `08:52` local.
- **Label every timestamp's zone.** An unlabelled timestamp is a bug.
- **Never infer a timeline from a truncated log view** (`tail` / `head` / capped grep) —
  query the full window first (a `tail`-truncated `pmset` read once reported `00:51Z`
  when the full log gave `00:06Z`).

Composes with the `director-handoff.md` liveness rule (let the tool compute age
UTC-to-UTC; never a local clock).

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
- 2026-06-22 F-84 decision-debt false-green: the pending-graduations decision-debt
  count read a healthy 0 while two live items existed (the item-count parser stripped
  the fenced blocks the live entries used), and that green 0 was cited as
  consolidation-completion evidence. Only a first-hand loss-scan caught it — no
  gate-green ever could. The durable check is to prove a completion gate fails on a
  known-bad input before trusting its green, especially your own.
- 2026-06-23 MCPJam host-header: an enforced check may not live in the
  obviously-named middleware (authed `/mcp` Host validation is in the auth layer
  `getPRMUrl`, not `dnsRebindingProtection`, which is landing-page-only), so
  tracing only the named middleware wrongly concluded `/mcp` was unguarded; and a
  black-box re-run false-passes when an unrelated layer short-circuits (auth 401s
  the probe regardless of Host). Trace every layer to the decisive source, and
  verify a sub-agent's *correction of your own finding* first-hand too.
- Status surfaces are pointers, not facts: thread records, frictions registers,
  plan statuses, and register markers each describe state without being it. A
  frictions register stamped "addressed-in-working-tree" with a never-completed
  "replace with SHA" trigger reads "fixed" for work that may never have
  committed. Before acting on any status, recompute against the current
  code / data / state, not the marker.
- 2026-06-29 `gh` rate-limit signature: a `403` then `401` on a `gh` GraphQL
  call was confabulated as "I exhausted the shared 5,000/hr budget" — primed by
  the harness reminder's "5,000 shared" framing — when the `rate_limit` evidence
  in hand showed the *unauthenticated* signature (`core.limit 60` /
  `graphql.limit 0`, authenticated budget ~94% free minutes later): a transient
  token blip, ~6% used. The durable check is to read the signature in the data
  you already hold and isolate the layer (auth vs volume) before adopting a
  primed frame; on a `401`/unauthenticated signature check `gh auth status` and
  retry, never assume volume. (Tooling cure lives at frictions F-110.)
