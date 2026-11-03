# A Parallax audit of the Codex lane's findings (2026-09-26)

Swallow holds Drift (516619), at the owner's word of about 10:50Z ("parallax question and record
your findings, this is not session end, this is making knowledge safe"). The seat stays live. This
is the record of the inquiry; the thread record
`.agent/memory/operational/threads/codex-dialogues.next-session.md` points here.

## Target and intended reliance

The target is the set of conclusions this seat reached and acted on between 2026-09-24 and
2026-09-26 while making Codex seats first-class peers: the Codex seat-landing rules (PR 241,
merged `fc645531c`), the rollout evidence reader (PR 244, merged by the owner as `4be54a077` at
11:14Z), the branch guard (PR 246, ready for review),
the wake companion's design (PR 247, merged by the owner), and the follow-up the Director named at
10:21Z, a landing toolkit of `merge-bot` wrappers replacing each git allow. The intended reliance:
the order and shape of the lane's next work, and the evidence the owner's acceptance test should
produce.

## Independence and anchors

This pass is **same-context self-review**. Its only outside inputs are the two bot reviewers'
findings on PR 241, the Director's ruling `bce7a2ea`, and the owner's actions on the repository
this morning. Every frame below was written by the seat whose conclusions it audits, so the
findings that favour the seat's earlier positions are the ones to point outside eyes at: the
Director's decision suite (eight Crickets and the assumptions reviewer) is the instrument the
owner named for the process question, and the owner's own Codex seat is the instrument for the
landing question.

## Depth selected

Core depth on the landing model (finding A), because the seat reversed its own verdict on it twice
in two days and the toolkit is sized from it. Screening depth on the landing process (finding B),
because the Director has already routed it to the owner's suite and this seat holds only partial
evidence, and on membership (finding C), because ratified plan nodes carry that frame. A deeper
pass would cost more than any observation it could produce before condition 5 is run.

## Provisional charter

- **Purpose:** decide what the landing toolkit is for and what evidence orders the lane's work.
- **Decision owner:** the owner; the Director for lens decisions on the order.
- **Affected parties:** the owner's time; Codex and Claude seats that land work; the bot reviewers.
- **Non-goals:** re-deciding PR 241; designing the merge queue; a security review of the sandbox.
- **Constraints:** the owner's test ruling (no call inspection, no config pins); no owner prompt on
  the landing path; the sandbox's write roots; the bot identity on every third-party write.
- **Question types:** A is causal and design; B is causal and normative; C is interpretive.

## Finding A: the landing model (core)

**Frame 1, the one PR 241 landed under.** A Codex seat's exec-policy allow list guards a
cooperative seat, as a Claude seat's permission rules do. The boundary is elsewhere: the sandbox's
write roots, the bot token's scope, the push wrapper's refusal of default branches, and the pull
request door. Evidence: the rules header states the residual; `git commit` already runs
`.husky/pre-commit` from the workspace, so any allowed command can run code the sandbox wrote; the
38-case transcript matches its expected decisions on codex-cli 0.157.0 and 0.157.1.

**Frame 2, the reviewers' frame.** The allow list is the boundary, so every argument tail a prefix
rule cannot bound is an escape: `--upload-pack`, `worktree add <path>`, `--force
--update-head-ok`, `-u`, `-p`, and a trailing `--no-verify`. The discriminating observation: does
an allowed tail reach anything the hooks path cannot? Today, no. Frame 2 becomes true only if the
gates stop running workspace code, which is the falsifier the Director recorded.

**What the audit adds, and neither frame saw.** Frame 1's phrase "a cooperative seat" hides the
actual failure shape of a model under friction. A seat whose commit is refused by a hook does not
turn hostile; it reaches, fluently, for the flag that makes the refusal go away. The metacognition
directive names this as the fluency failure. So the wrappers' warrant is not a boundary and not
tidiness either: a wrapper turns a fluent reach for `--no-verify` or `--amend` into a typed refusal
with a teaching message, where a prefix rule turns it into an allowed command. The hook policy's
reappraisal messages already do this for Claude seats. That is the argument for `merge-bot
commit` first, sized small, and it is measurable.

**Bridge Claim (mechanism to consequence).** From the rule semantics (position-matched tokens,
`rule.rs:16-25`) to what seats actually run: the rollout's `CommandExecution` records, which
PR 244's reader reads as the only admissible evidence. Assumptions: the harness records every
command; a truncated output reads inconclusive, never as absence. Validity: commands the harness
records, on the versions probed. Failure condition: a Codex release that changes what the
rollout records or how a rule matches (the re-probe is one command; it should be tracked).

**Crosswalk Claim (Codex rules to Claude permissions).** Claude Code's permission rules also match
command prefixes, so the class is shared and the header's "unowned in both" is exact. The mapping
is lossy in one direction: a Claude seat's refused command prompts an owner who is present in the
session, while a Codex seat under `approval never` gets no prompt at all, so the same residual
costs the owner attention on one platform and nothing on the other.

**Decision-relevant next steps, each with its falsifier.**

1. Condition 5, the live proof: the owner's next Codex seat commits and pushes through `merge-bot
   push` with no prompt. Opening the pull request is outside PR 241's rules (their header leaves
   it to the default flow), so it is a criterion for the landing toolkit, not for this condition.
   Falsifier: any prompt on the commit or push path.
2. The transcript's cases and runner become tracked files, so the re-probe after a Codex release
   is one command on any seat. Today they live only in this seat's scratchpad and as the table in
   PR 241's body. Falsifier of the need: if no Codex release before the toolkit lands changes a
   decision, the tracked runner cost a file and saved nothing yet.
3. The toolkit's first wrapper is `merge-bot commit`, to the reviewed design in the thread record's
   boundary block, justified by the fluent-reach argument. Falsifier: if Codex seats, over the
   landings the rollout records show, never run a refused-by-doctrine flag, the wrappers are
   tidiness and the sync and stage wrappers can wait.
4. Item 3's measure is pending the command-record reader's own PR: PR 244 (merged `4be54a077`)
   carries only the two-turn rollout reader, and the command-record reader is the reader lane's
   unlanded work (feat/codex-rollout-command-records, opening at its WIP slot); until it lands,
   the command records of a Codex seat's landing cannot be read by the harness's records alone.

**Status:** provisional, until condition 5 is observed.

## Finding B: the landing process (screening)

**Observations this seat holds first-hand.** The owner landed thirteen pull requests by hand between
10:35Z and 10:50Z under the ruleset bypass, including PR 211 and PR 247 of this lane, and four
more from 11:13Z to 11:15Z. PR 241 sat
BLOCKED holding the readiness slot through an eleven-hour pause. Every sync at the slot re-opened a
bot review round on unchanged text (six findings on 241, five on 216, one each on 227 and 229 in
one evening, from the exchange seat's count). Two hands met on PR 211: the owner cured its
conflict through GitHub's branch update at 10:41:47Z and merged it twelve seconds later, while
this seat's local cure of the same conflict was going through the hook gates; the seat's push was
refused as non-fast-forward, and the owner's resolution renumbered a research-note section that
the exec-binding plan node cites twice, so a one-file follow-up now waits. The hold signal
("the owner is landing by hand") reached this seat through the Director nine minutes after the
owner began.

**The main uncertainty.** Whether the assurance that "both legs on the synced head" buys exceeds
its cost at this volume. This seat cannot settle that: it holds the costs and one lane's findings,
not the base rate of real findings that syncs surface.

**The frames the suite should hold apart.** The door as a quality process (assurance per landing);
the door as a queueing system (a serial server with a re-entrant job on every sync, so the
head-of-line blocker is structural); the door as a trust boundary (strict currency exists because
a reviewer's verdict binds a diff against a base that keeps moving). The Director's proposals A
(a merge queue), B (an intake bound) and D (rounds bound to content heads) each live in one of
these frames.

**The datum this seat adds.** The owner's hand is, this morning, the fastest server in the system.
That is the opposite of "push without me": a door slower than the owner's hand will keep being
bypassed, and each bypass can collide with a seat mid-cure. Two small mechanisms would have
changed today's outcome: a visible "owner at the door" signal that every seat's watcher carries,
and a rule that a seat re-reads a pull request's state immediately before any write to it (this
seat edited PR 211's body and requested its legs five minutes after the owner had merged it).

**Status:** inconclusive at this seat; routed as evidence to the Director's suite.

## Finding C: membership (screening)

The wake-bridge node's bet: "first-class citizenship is behavioural, not a count of matching
files". The lane's three behavioural measures are wake (the design landed with PR 247; the code
follows), land (PR 241 landed; condition 5 pending) and evidence (PR 244 merged `4be54a077` at 11:14Z; its first Codex landing to read is pending). A counterframe
the nodes do not carry: citizenship is also the owner's experience of a seat. The owner restarts a
Codex seat and needs it useful within one session. A fourth measure follows: the time from a cold
Codex start to its first landed pull request, observed by the owner at the acceptance test.

**Status:** provisional. The fourth measure is a proposal for the wake-bridge node's owner, not an
edit this seat makes.

## The audit of the audit

- **Inaccessible evidence:** the reviewers' reasoning behind their findings; the owner's intent in
  landing by hand; the other seats' contexts; the base rate of real findings surfaced by syncs.
- **Shared anchors:** every frame here was written from this seat's own records and transcript.
- **Competence limits:** no security review of the sandbox model itself; the Bridge Claim in A rests
  on the harness recording every command, which this seat verified for 0.157.0 and 0.157.1 only.
- **Findings that need empirical validation:** A's fluent-reach measurement (PR 244 landed as
  `4be54a077`; needs Codex landings to read); B's cost model (needs the suite's count of real findings).
- **Overreach risk:** A's third step favours a design this seat authored; the falsifier is stated
  so the design can lose.

## Disposition

**Qualified.** The findings stand as provisional records. No action follows from them beyond the
records and two routed items: the tracked transcript cases (a todo on the exec-binding node's
toolkit item) and the fourth membership measure (a proposal to the wake-bridge node's owner). The
process datum goes to the Director's decision suite as evidence, not as a verdict.

## World-return contract

- **Observation:** the owner's next Codex seat commits and pushes one branch through the rules.
- **Indicators:** zero prompts on commit and push; the rollout's command records show no
  refused-by-doctrine flag.
- **Owner of the observation:** the owner, at the keyboard of that seat; the dated observation
  lands in the exec-binding node's review dispositions.
- **Reopen when:** any prompt fires on the landing path; any Codex release changes a transcript
  decision; the suite's count shows syncs surfacing real findings at a rate that changes B.

## Practice learning signal

Three surprises are routed to the napkin with this report as their source: a section numbered by
position in an append-heavy research note is a shared counter two pull requests both took; a
seat wrote to a pull request five minutes after the owner had merged it, having read its state
once and not again; and the fastest server in this morning's landing system was the owner's
hand. None is a rule at one instance.
