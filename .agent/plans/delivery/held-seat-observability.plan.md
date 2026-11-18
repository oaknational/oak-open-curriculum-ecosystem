---
id: held-seat-observability
node_type: delivery
name: "Held seats are observable, and the known holding shapes are refused"
overview: >-
  A seat held at a tool call it cannot see is distinguishable from a seat
  working heads-down within one poll of the Director's peer read, and the
  two call shapes that have held seats three times are refused at the guard
  before they can hold.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-09
---

# Held seats are observable, and the known holding shapes are refused

## Goal

Three times in three days (2026-09-07, 08, 09) a lane seat was held for
between three and a half and nine hours at a tool call whose permission
prompt the session itself cannot see, while its liveness surfaces read
fresh; the Director's deadline-and-default carried each lane, at the cost
of thirty or more minutes of silence before the default could be judged
safe to fire. Two of the three holds had the same shape, and the second was
taken with the lesson against it already recorded — a passive lesson does
not fire under a fluent framing. When this lands: a held seat reads
`held since <time> at <tool>` on the Director's peer read within one poll,
so the default fires on evidence rather than on silence and never on a
seat that is merely heads-down; and the two shapes that held seats —
initialising a repository outside the estate's checkouts, and entering a
sibling-directory worktree from a running session — are refused at the
guard with a reason naming this class, so the seat gets a message instead
of a hold.

## User groups and value

- **The Director.** Fires the deadline-and-default on a reading ("held at
  a shell call since 10:44Z") instead of on an absence, and does not fire it
  on a seat that is thirty minutes into a legitimate gate run. Saves the
  silence window on every held lane and the risk of a wrong default on a
  working one.
- **Lane seats.** A refused call costs one message and names the cure; a
  hold cost three and a half, four and nine hours, and the seat learned of
  it only on return. A held seat is also visible to its peers, so its lane
  is picked up sooner.
- **The owner.** The fleet's held state is a fact on the board rather than a
  deduction from silence, which is the observability the owner has asked
  for over speed (`agent-state-observable`, the owner's glance surfaces).

## Mechanism

Two halves, because a prompt the seat cannot see has two cures: remove the
prompts an unattended seat can raise, and make a held seat visible if one
ever recurs. The Director's deadline-and-default remains the response
either way.

**The prevention half — the no-prompts fix, a delivery slice on the
Director's seat that names this node as the plan it serves.** Every `ask`
in the tracked platform settings becomes `deny` (the destructive git
operations, recursive forced removal, forced worktree removal; the revert
command loses its ask), the shell guard gains the same shapes with
reappraisals, and a rule, `unattended-seats-never-prompt`, states the four
disciplines — no ask rules; one plain command per call; no git outside the
registered worktrees; never recursive forced removal — with the Director's
deadline-and-default as the other half of the contract. Its todo row below
takes the pull request number when it lands.

**The observability half — this node's own units.** The seat cannot see its
own prompt, so the fact is written by the one process that runs before it:
the guard.

1. **A call marker, written before the permission decision.** The repo's
   PreToolUse guard already returns a permission decision to the harness
   (`permissionDecision` in the renderer), which is the in-repo evidence
   that it runs ahead of the permission gate; the harness's hooks reference
   (read 2026-09-09) does not state the ordering, so the ordering is
   proven live before it is claimed (criterion 3). A fourth activation,
   matching every tool, writes one marker FILE PER INVOCATION under the
   PRIMARY coordination home, in a directory per seat —
   `.agent/state/collaboration/tool-calls/<canonical routing key>/<tool_use_id>.json`,
   the directory keyed by the id-bearing routing key the peer poll and the
   seen-files already use (display names collide and persist), the file by
   the hook's `tool_use_id`, all untracked by design like the comms
   seen-files — each file holding the seat identity and display name, the
   tool name and a start time, and NEVER the tool input (a command line
   can carry a token path or a secret). Open is a create and close is an
   unlink; no file is ever rewritten, so two parallel hooks cannot race a
   read-modify-write and drop each other's call, and the reading lists the
   directory. Each close removes only its own file, so an early completion
   never erases a call still running or still at a prompt. The marker is closed on every terminal path the repository
   controls: a PostToolUse activation with the same matcher closes the
   entry whose `tool_use_id` it carries (PostToolUse fires only when a call
   succeeds); the guard's own deny writes the close for that entry before
   it returns the decision; and a Stop activation and an `idle_prompt`
   notification activation — the turn has ended, the seat is at its own
   prompt, not held — clear every entry. The one path outside those is a
   tool that ran and errored with no later call in the turn, which the
   Stop close covers at the turn's end. A marker entry that stays open is
   therefore a call that has not come back — a prompt, a crash, or a long
   legitimate run — and each is a state a peer should be able to see. The
   harness also lists `permission_prompt` among its notification matcher
   types without documenting that event's schema; the first slice probes
   it, and if it fires on a prompt it becomes the marker's direct signal
   beside the call-age reading.
2. **A `held` reading on the peer poll.** `comms peer-liveness` gains a
   classification with two signals. The primary is the harness's
   `permission_prompt` notification where the platform delivers it (item 1
   probes it): a seat whose latest such notification has no later close
   reads `held at <tool>` at once. The fallback is the age reading: a seat
   whose OLDEST open marker file has been open longer than the held
   threshold reads `held since <start> at <tool>`, and the threshold is set
   ABOVE the longest routine single call measured in the estate — the full
   gate run, which this node's own opening puts at thirty minutes — so the
   default is forty-five minutes, configurable, and a gate call under it is
   never called held; the rendered line names the tool, so a gate at the
   threshold is legible as one. Either reading holds whatever the seat's
   heartbeat or claim says. Like `retired`, the reading is
   input-to-verify, never a verdict: the F-75 alert recipe in the
   liveness-heartbeat rule emits transitions INTO `held` exactly as it emits
   transitions into `retired`, and the Director's work-evidence cross-check
   stays in front of any default. The two facts stay separate: a heartbeat
   says the seat's loop is alive; a marker says one call has not come back.
3. **Refusal of the two holding shapes the fix's deny set does not carry.**
   The canonical hook policy gains blocked-pattern entries under a
   `held-seat` concept for repository initialisation in a shell call (the
   rule's discipline, made active: a seat runs git only in the registered
   worktrees, and a recipe is proven by file copy and plain shell with no
   repository), and the dispatcher gains a route for the platform's
   worktree-entry tool that refuses a path outside the platform's own
   worktree directory (the documented always-prompting shape; the hold-free
   forms are launching the session inside the sibling worktree, or `git -C`
   from the primary). Each refusal's reappraisal names this class and the
   hold-free form, so the block is the question it is meant to be.

The literal command strings live only in `.agent/hooks/policy.json`, their
canonical home; every other surface, this node included, describes the
shapes generically (`hook-policy-substring-discipline`).

## Acceptance criteria (each with a proof — required)

1. **A held seat reads `held`.** With a fixture prompt signal open, or a
   fixture marker file open past the threshold, and the seat's other
   liveness evidence fresh, `comms peer-liveness` classifies the seat
   `held` naming the tool and the start time; with the marker closed, or
   open for less than the threshold and no prompt signal, it does not. Proof: `repo-safe` — unit tests on the classifier and an
   integration test on the CLI's rendered line.
2. **The marker never carries tool input, and closes per invocation.** A
   marker written for a call whose input contains a sentinel string does
   not contain the sentinel; with two calls open, the first to finish
   closes only its own file and the other stays open (out-of-order
   completion); two hooks writing at the same instant leave both files
   present (simultaneous write). Proof: `repo-safe` — unit tests on the
   marker writer and closer.
3. **The marker is written before the prompt and closed after the call.**
   In a live Claude Code session, a call that raises a permission prompt
   reads `held` on a peer's poll while the prompt stands, and the reading
   clears within one poll of the prompt being answered; a call the guard
   denies, and a call that errors, leave no open entry once the turn ends.
   Proof:
   `owner-held` — the harness's ordering is a platform fact the repository
   cannot prove by test; the owner, or a seat at the owner's word, runs
   the prompting call once and the Director records the two readings with
   their times on the landing PR.
4. **The holding shapes are refused with the class named.** Repository
   initialisation in a shell call, and worktree entry to a path outside the
   platform's worktree directory, are refused by the guard with a
   reappraisal that names the held-seat class and the hold-free form.
   Proof: `repo-safe` — blocked-pattern and dispatcher unit tests, and the
   policy snapshot test.
5. **The alert recipe emits the transition.** The F-75 recipe's extract
   filter passes a `held` line and leaks nothing else, proven against real
   `peer-liveness` output before the rule text changes. Proof: `repo-safe`
   — the recipe's corpus test, as the liveness-heartbeat rule already
   requires for `retired`.

## Todos (optional; proofs on todos optional)

Four slices, each a single-story PR within the default two-round budget;
each opens with the round tally and, for the mixed slices, the PDR-140
intake contract declared at open.

0. **The no-prompts fix** (the prevention half, the Director's seat): the
   settings, the guard shapes and the `unattended-seats-never-prompt` rule.
   Its pull request is #100 (the number is the fix's identity whether or not
   it has landed; this node claims nothing about its landing).
1. **The marker.** Writer and closer in the hook-policy module; the two
   activations in the Claude Code settings; PRIMARY-home resolution reused
   from the collaboration-state tooling; tests for AC 2. Code-class.
2. **The reading.** The `held` classification in `comms peer-liveness`, the
   rendered line, the recipe amendment and its corpus test, the rule text
   in `liveness-heartbeat-cron` and `comms-all-channels-watcher`; tests for
   AC 1 and 5. Mixed. AC 3 is recorded on this slice's PR.
3. **The refusals.** The policy entries, the dispatcher route, the hooks
   README mirror; tests for AC 4. Code-class.

## Out of scope

- **The prompts the fix removes.** Their removal is the fix's slice and
  its rule; this node records the shape and takes the row, nothing more.
- **Suppressing the worktree-entry prompt itself.** The platform documents
  it as unsuppressable short of the permissions-bypass mode; whether to run
  seats in that mode is the owner's settings decision, not this node's.
- **Firing the default automatically from a `held` reading.** The reading
  is input-to-verify; the Director's judgement and the work-evidence
  cross-check stay in front of every default.
- **Codex and Cursor marker writers.** The marker shape and the reader are
  platform-neutral; each other platform adds its own writer as its own
  step when its hook surface is verified.
- **Replacing heartbeats with markers.** Two different facts: a heartbeat
  is the seat's loop alive; a marker is one call in flight.
- **Making the seat see its own prompt.** Impossible by construction; this
  node makes the fact visible to everyone else instead.

## Review dispositions

None yet. One dated row per routed finding, naming the source PR, the
finding in one line, and the routing rationale.
