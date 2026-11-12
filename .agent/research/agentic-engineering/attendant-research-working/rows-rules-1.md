### ITEM
SOURCE: .agent/rules/bot-identity-on-third-party-systems.md
DATE: 2026-07-23
OWNER_WORDS: "if we have a bot identity created to represent us on that system, then we MUST always use that identity, exceptions are by user permission only and generally must only be instigated by the user."
AGENT_WAS: Rotating seats posted comments, opened PRs and merged under the ambient owner credentials, so agent PRs showed the owner as author.
WRONG: The default credential was used on third-party systems instead of the bot identity that exists to represent the team.
ABOUT: the piece of work itself
QUESTION: Whose name will this surface display when this write lands?
MOMENT: Immediately before each write to a third-party system (comment, PR creation, label edit, merge).
OWNER_NEEDED: The owner found the agent PRs authored as himself and had to restate the ruling (re-asserted 2026-07-23).

### ITEM
SOURCE: .agent/rules/bot-identity-on-third-party-systems.md
DATE: 2026-07-25
OWNER_WORDS: "do NOT make up identities."
AGENT_WAS: After a compaction, a seat filled in a plausible bot email from memory and pushed three commits under it.
WRONG: The identity values were invented, not derived from an observable source, and the invented email does not exist.
ABOUT: the piece of work itself
QUESTION: Can I point to where I observed this identity value, or am I recalling it?
MOMENT: When composing the author and committer values for the first commit after a compaction.
OWNER_NEEDED: The owner ruled forward-correction only (no mailmap), leaving the fabricated strings on the record.

### ITEM
SOURCE: .agent/rules/check-singleton-per-window.md
DATE: 2026-09-14
OWNER_WORDS: "the commit triggers the gates, there is no point and a fair amount of cost running the gates separately as well, never, ever do that"
AGENT_WAS: Agents ran the whole-repo gates separately beside or after a commit that already triggers them.
WRONG: The gates ran twice, which cost time for no added assurance.
ABOUT: which step the work was at
QUESTION: Does the commit I am about to make already run this gate?
MOMENT: Before starting a separate gate run at or after a commit.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/check-singleton-per-window.md
DATE: 2026-05-22
OWNER_WORDS: "only one agent needs to run check, and one agent already is, so stop check, and record that invariant, and note that we need some kind of record of who is running check when"
AGENT_WAS: Several agents ran the whole-repo check at the same time during a session-handoff window.
WRONG: The duplicated check runs wasted time and risked file collisions between overlapping runs.
ABOUT: which step the work was at
QUESTION: Is another agent already running this check in this working tree?
MOMENT: Before starting a whole-repo check at session close.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/collaboration-is-value-contingent.md
DATE: 2026-07-28
OWNER_WORDS: "that quota was for a specific situation and no longer applies, please do not silently limit yourself, always ask"
AGENT_WAS: A seat stood down its watcher and heartbeat because it inferred a monitoring-cost ruling that was in fact situational.
WRONG: The seat did less than the stated scope on an inferred cost constraint and did not ask the owner first.
ABOUT: how the owner's words were read
QUESTION: Did the owner actually state this constraint, and does it still apply, or am I inferring it?
MOMENT: Before narrowing the scope of the work or dropping a monitor.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/comms-all-channels-watcher.md; .agent/rules/channel-by-audience-lifetime-and-consumer.md
DATE: 2026-08-02
OWNER_WORDS: "just enough for the Director to wake you"
AGENT_WAS: A warm-paused seat kept a full watcher delivering about fifteen empty heartbeat ticks an hour into context, and questions and pings were routed as comms events that woke every watcher.
WRONG: The seat spent context and tokens on signals that had no reader needing them.
ABOUT: the piece of work itself
QUESTION: Who reads each of these ticks and signals, and what do they do with it?
MOMENT: When the seat paused with no active work and when picking the channel for each message.
OWNER_NEEDED: The owner priced the cost and asked for the reduced watcher shape.

### ITEM
SOURCE: .agent/rules/comms-all-channels-watcher.md
DATE: 2026-07-20
OWNER_WORDS: "it is important to monitor comms, and to be responsive to your team mates"
AGENT_WAS: A seat in an owner plan-mode window left three directed Director events unanswered for about fifteen minutes while its watcher had died unnoticed and its heartbeats kept flowing.
WRONG: The seat looked live while being unresponsive, and heads-down mode suspended the comms sweep.
ABOUT: which step the work was at
QUESTION: Is my watcher alive and have I absorbed directed events within one cadence?
MOMENT: At every turn boundary, especially entering a heads-down or plan-mode window.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/comms-all-channels-watcher.md
DATE: 2026-10-13
OWNER_WORDS: NONE
AGENT_WAS: A seat in the sibling estate re-armed its watcher fourteen times over seven idle hours.
WRONG: It kept re-arming monitors with no active work, instead of going into cold pause after an hour of no work.
ABOUT: whether it was worth doing
QUESTION: Is there any work this monitor serves right now?
MOMENT: At each watcher expiry notification on a seat with no active work.
OWNER_NEEDED: The owner asked what useful had happened over those hours.

### ITEM
SOURCE: .agent/rules/comms-all-channels-watcher.md
DATE: 2026-07-25
OWNER_WORDS: NONE
AGENT_WAS: A seat re-armed its watcher as a plain background shell, which consumed three directed events and advanced the cursor with no wake path into the session.
WRONG: The events were silently swallowed, and the seat did not notice before the owner surfaced it.
ABOUT: the piece of work itself
QUESTION: Has an event actually arrived in-session since this re-arm, or has only the cursor moved?
MOMENT: Immediately after re-arming a watcher.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/compute-dont-hope.md
DATE: 2026-09-13
OWNER_WORDS: "nothing should be 'hand kept', ever, manual lists are always going to be wrong eventually, and when they are we have to remember that they exist, this is a general rule, compute don't hope"
AGENT_WAS: Agents kept lists by hand (a bootstrap package list, copies of an exclusion list across three validators, "keep in sync" comments) whose truth lives elsewhere.
WRONG: Hand-kept lists drift, and a gap in one was masked by a warm local build until CI's cold checkout failed.
ABOUT: the piece of work itself
QUESTION: Does the repository already declare this fact somewhere I can compute it from?
MOMENT: When writing or editing any list that restates facts held elsewhere.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/confident-seats-proceed-and-report.md
DATE: 2026-07-27
OWNER_WORDS: "but certainly if an agent is confident in their choice they could have kept going."
AGENT_WAS: A seat froze for nine hours on an exact head awaiting a Director ruling its own analysis already supported, re-pinging into a dead session.
WRONG: The seat blocked by default on a ruling it had already asked for, instead of proceeding on its recorded choice.
ABOUT: which step the work was at
QUESTION: Do I already have a reasoned choice I could proceed on while the ruling is pending?
MOMENT: When a Director ruling was requested and no reply had arrived.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/confident-seats-proceed-and-report.md
DATE: 2026-07-15
OWNER_WORDS: "you have permission to commit — all agents ALL ALWAYS have permission to commit"
AGENT_WAS: A lane sat idle about 25 minutes awaiting per-commit word that had come from a Director relay, not the owner.
WRONG: The agent held the lane for commit authorisation that was already pre-granted inside the claimed boundary.
ABOUT: how the owner's words were read
QUESTION: Does a standing grant already cover this commit?
MOMENT: When the lane stopped to wait for authorisation to commit.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/coordination-branch-24h-lifetime.md
DATE: 2026-07-25
OWNER_WORDS: "that's not a cure, that's papering over a [mistake]. Do not allow code into this repo without a first hand review, not ever"
AGENT_WAS: A seat evaluated dependency pin bumps first-hand and committed them straight to the coordination branch.
WRONG: Code entered the repository without review through a pull request, and self-review was treated as sufficient.
ABOUT: the piece of work itself
QUESTION: Is this change code, so that it needs a branch and a reviewed pull request?
MOMENT: Before committing the dependency pin bumps to the coordination branch.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/coordination-branch-24h-lifetime.md
DATE: 2026-08-06
OWNER_WORDS: "the coordination branch shouldn't be a worktree, it should be the branch in the primary checkout, always"
AGENT_WAS: The coordination branch was held in a snapshot worktree instead of the primary checkout.
WRONG: The coordination branch was placed in a worktree, not the primary checkout's own branch.
ABOUT: the plan
QUESTION: Is the coordination branch the primary checkout's own branch?
MOMENT: When setting up or checking where the coordination branch lives.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/coordination-branch-24h-lifetime.md
DATE: 2026-07-25
OWNER_WORDS: "periodic commits, not too many, just don't let things build up"
AGENT_WAS: Shared-state surfaces (memory, handoff maps, tally ledgers) accrued uncommitted on the coordination branch.
WRONG: Uncommitted state was invisible to peers and blocked other seats' merges and branch switches.
ABOUT: which step the work was at
QUESTION: Is this shared state committed where every other seat can read it?
MOMENT: At quiet windows between cycle commits.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/coordination-branch-24h-lifetime.md
DATE: 2026-10-19
OWNER_WORDS: "the 24 hours is a rough guide, but obviously the actual need varies with how much work is happening, there would be no point in folding every 24 hours if that was the only thing happeneing"
AGENT_WAS: The reviewer seat reported that "the 24-hour fold rule stands", reading the clock alone as making a fold due.
WRONG: The seat read a rough guide as a fixed trigger, so a fold would run on a branch carrying nothing but the clock.
ABOUT: how the owner's words were read
QUESTION: What work does this fold serve beyond the elapsed time?
MOMENT: At the DUE check at session open on a coordination branch.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/cross-estate-work-must-reduce-divergence.md
DATE: 2026-10-01
OWNER_WORDS: "This shouldn't be a question, we are bringing both estates to the same level of capability, anything useful that one has must make it to the other."
AGENT_WAS: A seat asked the owner whether JC.net adopts two OCE tooling families.
WRONG: The seat treated adoption as an open question when the standing aim is to bring both estates to the same capability.
ABOUT: the larger purpose
QUESTION: Does our standing purpose already answer whether, leaving only how and in what order?
MOMENT: Before putting the adoption question to the owner.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/cross-estate-work-must-reduce-divergence.md
DATE: 2026-10-14
OWNER_WORDS: "There is ONE Practice with local instances, if OCE needs an update, it needs an update"
AGENT_WAS: A fold passage was held back from the sibling estate because its merge tool lacked class detection.
WRONG: A divergence was left standing because one estate's tooling lacked what the shared doctrine names.
ABOUT: the larger purpose
QUESTION: Is the tooling gap itself the work to open now, rather than a reason to hold the doctrine back?
MOMENT: When deciding to hold the passage back from the sibling estate.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/cross-estate-work-must-reduce-divergence.md
DATE: 2026-09-30
OWNER_WORDS: NONE
AGENT_WAS: The two-estate consolidation ran a full day without measuring shared-path divergence until its retrospective, after the owner's word.
WRONG: Eight shared files grew more divergent during the day, most through text written into one estate only or wrapped differently.
ABOUT: which step the work was at
QUESTION: What is the divergence baseline at the open, and will I leave both estates more aligned at the close?
MOMENT: At the open of any activity that edits both estates, before the first edit.
OWNER_NEEDED: NONE

### ITEM
SOURCE: .agent/rules/cross-repo-sessions-run-the-join-ceremony.md
DATE: 2026-07-08
OWNER_WORDS: "the inter-Practice protocols are for collaboration, but they are an enhancement, not a blocker, you can just go and look at the files"
AGENT_WAS: Sessions applied the inter-Practice join ceremony to read-only looks at a sibling estate on the same machine.
WRONG: A collaboration ceremony was treated as a blocker on reading files that writes and registers nothing.
ABOUT: how the owner's words were read
QUESTION: Will this action write, register or claim anything in the sibling estate?
MOMENT: Before starting the ceremony for a read-only look at a sibling estate.
OWNER_NEEDED: NONE

EXCLUDED: 2
UNSURE: .agent/rules/cross-repo-sessions-run-the-join-ceremony.md
