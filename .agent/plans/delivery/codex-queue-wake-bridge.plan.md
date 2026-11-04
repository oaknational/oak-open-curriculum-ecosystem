---
id: codex-queue-wake-bridge
node_type: delivery
name: "Codex seat wake through the vendor's queue"
overview: "An idle Codex team seat wakes on a canonical comms event addressed to it, through the vendor-shipped `codex queue` subcommand, with no peer-authored bytes in its input: the first step of a worked Codex membership programme."
status: ratified
ratified_by: Jim Cresswell
ratified_date: 2026-09-24
ratified_where: "Owner card via the Director (Wick binds Temper, ed7b48), about 16:31Z, verbatim: 'Ratify it as it stands', choosing 'The Director relays your stamp to Swallow now, without your reading it first', on the node at 7e9b2cf7f. The co-owner's four accepted review points are seat wording under the stamped shape."
serves: agent-platform-citizenship
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-10-02
---

# Codex seat wake through the vendor's queue

## Goal

A Codex seat that has joined a team session notices a canonical comms event addressed to it
while it is idle, within seconds, without a user prompt, a manual foreground poll or a second
seat. This is the one obstacle to Codex membership measured as specific to Codex. It is the
first step of a worked Codex membership programme under `agent-platform-citizenship`, whose
bet is that "First-class citizenship is behavioural, not a count of matching files".

## Why this step, and why this shape

The concept exploration behind this node ran at the owner's word on 2026-09-24. Its evidence
sits in `.agent/research/agentic-engineering/codex-support-concept-exploration-2026-09-23.md`
and in the lived record of that day.

- **What the day showed.** Two Codex seats worked as members: identity, directed and broadcast
  comms, claims, heartbeats, a pairing channel, bot-identity pushes, a bot-authored pull
  request, TDD cures under full gates, and a reading of vendor source that settled a question a
  Claude seat could not settle by running the binary. What stopped them from being peers was
  timing. A directed cure list sat unread for about fifteen minutes while the Codex seat was in
  another task, because nothing wakes an idle Codex seat. The owner named the goal on
  2026-07-31: "the end goal is that all messages automatically alert the Codex agent when
  appropriate".
- **The inherited shape changed.** The deferred sketch `codex-app-server-idle-wake` designed a
  native extension, with a broker and a proof canary around it. The owner ruled on 2026-08-01:
  "Pinned native extension: NO". That plan waits "until a supported upstream surface exists".
  The latest CLI ships one. `codex queue --thread <id> --message <text>` ("Queue a message for
  an existing session") started a turn on an idle interactive session about five seconds after
  queueing. It held a message behind an active turn, and ran it as a separate turn once that
  turn finished. It kept a message across one clean exit (the concept note, §2.4 and §2.7). A
  vendor-shipped subcommand needs no fork-adjacent code. The owner's ratification of this node
  (2026-09-24) is the owner's reading that the ruling's exit condition is met.
- **First-class means fitting the platform, not copying Claude's machinery.** Claude seats wake
  through their harness's event monitor. Codex seats get the same behaviour through Codex's own
  surface.

## User groups and value

- **The owner**: Codex seats collaborate without supervision. The owner's own test (2026-07-11):
  "if you can't communicate without supervision, you can't collaborate in the team". The
  different way of thinking the owner values in Codex seats reaches the team's work in time.
- **Team seats of any platform**: a directed event reaches a Codex partner in seconds, not
  minutes. Pairings and routed cures stop stalling on an unread channel.
- **The Director**: it reaches Codex seats through the canonical comms every seat reads, with no
  platform-specific channel.
- **Claim boundary**: the value evidence is one day's pairing and the July to August record. The
  concept note leaves open why Codex seats stopped after mid-August. If wake was not the cause,
  this step is necessary but not sufficient.

## Mechanism

1. **A wake companion beside the seat is the sensor.** On codex-cli 0.157.0 Codex denies the
   app-server daemon's socket to every sandbox below full-disk write, so no process a seat starts
   from its own shell can queue into its own thread (the 2026-09-25 review dispositions). The
   terminal command that starts a Codex seat therefore also starts the seat's wake companion,
   outside any Codex sandbox, as the TUI itself is. The companion runs no model and executes no
   peer text. Its one act is queueing a fixed notice into the seat's own thread, and it runs
   only while the TUI's process runs. The seat keeps its own all-channels watcher for delivery
   and its heartbeat; the companion only wakes. The owner approved this on 2026-09-25.
2. **A handshake binds the companion to the seat's own thread.**
   - The launch command creates a fresh directory for this launch under the user's home, at mode
     0700, and grants the seat write access to it with `--add-dir`. It gives the seat the
     directory's path through a channel of this launch alone, never an environment variable: in
     daemon mode a seat's shell environment comes from the one daemon that every seat under a
     `CODEX_HOME` shares, so a variable set for one launch can reach another seat. Todo 1 probes
     both.
   - At session start the seat writes its own `CODEX_THREAD_ID` there, atomically, and only when
     its own identity comes from `CODEX_THREAD_ID` rather than a higher-ranked seed (todo 3).
   - The companion opens the file without following links, checks the open file is a regular
     file owned by the user, not writable by group or others, and at most 128 bytes, and reads it
     once from that handle. It arms only on exactly one lowercase UUID in the 8-4-4-4-12 form.
     The pattern is load-bearing: `codex queue` takes a value that is not a UUID as a session
     name, and looks it up across all active sessions.
   - It never rebinds. A later change to the file writes a tamper line to its status.
   - It derives the seat's identity from the thread id alone, as platform `codex`, through the
     estate's single identity derivation. Nothing looks up recent threads.
3. **Only addressing wakes.** An event wakes the seat only when the canonical classifier puts it
   in the seat's directed or group view: addressed to the seat's exact identity, and not
   self-authored. Broadcasts, observed events, lifecycle events and heartbeats never wake. So a
   routing meant to wake a Codex seat goes by `comms direct` (todo 3). An event id is
   peer-written, so an id that wakes the seat is never marked as not waking, even when another
   event carries it too.
4. **The notice carries no event bytes.** It is a constant with no parameters, so its type
   admits no event bytes. It says coordination events are waiting, names the canonical command
   that reads them, and asks the seat to acknowledge the wake as its start skill describes.
   Queued text arrives as a user-role message. The woken turn reads the events through the
   canonical comms read, as every seat does, and treats their text as untrusted data. The argv
   is `queue`, `--thread=<uuid>` and `--message=<notice>`, in the `=` form so that no value is
   read as a flag. It carries no configuration flags, which would force an embedded server that
   the vendor refuses while a daemon runs.
5. **The companion runs with the least it needs.**
   - It keeps its own state, its cursor included, in a directory of its own under the user's
     home at mode 0700, which no sandboxed seat can write.
   - It spawns `codex` by a path resolved once at arm to its real path, since the installed
     `codex` is a native binary behind links. The checks run on that real path: the file and
     its directory are owned by the user or root and not writable by group or others.
   - It spawns it with a fixed environment (`HOME`, the TUI's `CODEX_HOME`, `PATH` set to
     `/usr/bin:/bin`, `LANG`), no shell, a timeout that ends in `SIGKILL`, and capped output.
     The spawned `codex` runs from the companion's state directory, never the repository, so no
     project configuration layer loads.
   - It reads no file an event names, writes only its cursor and its status, runs nothing but
     `codex queue`, and passes no `-c`, `--remote` or `--profile`.
   - No write of the companion's follows a link. Each write goes to a new temporary file, created
     exclusively without following links, then renamed over its target, since a rename replaces
     a link rather than following it. It reads the `ack` file's time without following a link,
     and a comms file only when it is a regular file under a size cap.
6. **Waking never takes a delivery, and nothing is read twice.**
   - The companion keeps its own cursor, keyed by the thread id, in its state directory: one
     JSON document with a strict parse, never a line-based file, since a peer controls comms
     file names. It is seeded at arm only when no cursor exists for the thread id, so only later
     events count and a relaunch keeps what the last launch left unmarked.
   - The latch, the budget and the backoff live in memory for one launch, since the `ack` file
     belongs to one launch. A relaunch starts them afresh.
   - It never touches the seat's seen file or heartbeat file. So the seat's watcher delivers every
     event, and the claim tool's live-watcher check reads only the seat's own watcher.
   - It marks every examined event that cannot wake at once, and an eligible event only once a
     notice for it has been queued. A held or failed event stays unmarked and is examined again
     on the next pass. So a wake debt never blocks newer events, and it survives a restart.
7. **Wakes are bounded.**
   - Several eligible events in one pass produce one notice.
   - At most one notice is outstanding. The seat acknowledges a wake by touching an `ack` file in
     its handshake directory, which no peer can write. A modification time after the notice
     releases the latch. Comms authorship is self-declared, so no comms event releases it.
   - Without an ack, a second notice may go after a capped interval. After two unacknowledged
     notices, or past a budget of four in any rolling hour, the companion stops queueing and
     writes the fallback to its status. A later ack resets the count, and queueing resumes. The
     vendor holds up to 100 queued messages for a thread that is not running, so the bound
     matters. The exit notice sits outside the budget, since it goes at most once per launch.
   - A failed queue call writes one WAKE FAILED line naming the event ids and the fallback, and
     the wake is retried on a capped backoff. A call counts as queued only when `codex queue`
     exits 0. A timeout, a non-zero exit or output past its cap may still have delivered the
     notice, so each counts against the budget.
   - An ack dated later than now, beyond a few seconds' skew, is ignored, so a file time set in
     the future cannot release every later notice.
8. **The pure core is testable without IO.** Selection, coalescing, the latch, the budget, the
   backoff and the notice are pure. The queue call, the handshake read, the ack read and the
   clock are ports whose runners belong to the IO edge.
9. **Status is written where the seat can read it.** The companion writes a status file in the
   handshake directory, by the rename of mechanism 5: armed, or degraded with its reason, and
   the last WAKE FAILED line. Its own output goes to a log, never to the TUI's terminal. When it
   cannot arm, its status names the fallback, bounded foreground polling, as the operating rule
   states today. Its lines carry no peer text: an event id is written by a peer, so a line names
   one only when it is a UUID, and at most five, counting the rest. That holds for the watch
   loop's own error and exit lines too, which pass through the same status (todo 2).
10. **Stopping is local and visible.**
    - Only the TUI exiting, a signal from the launch shell, a failure to arm, or a pass step
      past its deadline stops the companion. The watch loop rules a late step fatal, so the
      step deadline exceeds the queue call's timeout plus the read budget. No comms content
      stops it, and a malformed event never crashes it.
    - When it stops while the TUI still runs, it queues a fixed exit notice, once, and only
      after any queue call still in flight has settled.
    - After the TUI has gone it queues nothing, since an exited session would run the notice at
      its next resume.
    - It never restarts itself.
11. **The companion is not the trust boundary.** Within one `CODEX_HOME` any thread id names a
    valid target. Any unsandboxed process running as the user can already queue any text into
    any Codex seat. The companion opens no path for peer text; it does not close that existing
    one.

## Acceptance criteria (each with a proof — required)

- **An idle Codex seat wakes on a directed event.** The seat sits idle in its interactive session.
  An external seat sends one directed canonical event to it, and the seat starts a turn and
  replies on comms, with no prompt and no poll, within 60 seconds. Proof:
  - `repo-safe`: the companion's tests, with an in-memory queue port whose recorded notices are
    asserted as state;
  - `owner-held`: a dated live run on the then-latest CLI, recorded with the event id, the queue
    time, the turn's start and the reply's event id, and observed by the owner or a seat at the
    owner's word.
- **No peer-authored bytes reach the seat's input through the bridge.** The notice is a constant
  with no parameters, and the argv holds only the thread id beside it. Proof: `repo-safe`, table
  tests over events that vary in body, title and author, each producing the one notice; and a
  return-value test of the pure argv builder.
- **Only eligible events wake the seat.** Broadcasts, observed and lifecycle events, heartbeats,
  self-authored events, events addressed to another seat, and malformed events never produce a
  notice. Proof: `repo-safe`, table tests over literal events.
- **The companion wakes only the thread its seat named.** It does not arm on a missing handshake;
  on a value that is not exactly one lowercase UUID, including the braced, URN and simple forms;
  on a link; or on a file over 128 bytes, not owned by the user, or writable by others. Proof:
  `repo-safe` tests over the handshake parse and a handshake port.
- **No companion write follows a link.** A link planted where the companion writes its status
  is replaced, not followed, and a link at the `ack` path or in the comms store is never
  followed. Proof: `repo-safe` tests over injected file ports (the flags each call passes, the
  facts it refuses, a link refused as `ELOOP`), since the testing strategy allows no file
  system in a test; and a recorded observation of the thin Node bindings at the slice's cure.
- **Waking never takes a delivery.** After the companion wakes for an event, the seat's own
  watcher still delivers it. Proof: `repo-safe`, one integration test over an in-memory comms
  store.
- **Wakes are bounded.** Eligible events arriving while a notice is outstanding queue no second
  notice until the seat's ack or the capped interval. A seat-authored comms event releases
  nothing. After two unacknowledged notices, or past the hourly budget, the companion stops
  queueing and its status names the fallback. Proof: `repo-safe` tests over the pure core.
- **Failure is visible, never silent.** A missing subcommand, an unknown thread id or a failed
  queue call writes a status line naming the fallback. Proof: `repo-safe` tests over a refusing
  port.
- **A failed wake is named and retried.** When the queue call fails, one WAKE FAILED line names
  the event ids and claims no delivery, and the wake is retried on a capped backoff. Proof:
  `repo-safe` tests over a refusing port, asserting the line's content and the retry;
  `owner-held`, the live run repeated with the queue call failing, recorded with the event id
  the line named.
- **The seat learns its sensor stopped, and only while it runs.** A companion that stops while
  the TUI runs queues the fixed exit notice once; one that stops after the TUI has gone queues
  nothing. Proof: `repo-safe` tests over the queue port and a liveness port.
- **A queued notice never steers an active turn.** Proof: `owner-held`, the §2.7 active-turn run
  repeated on the then-latest CLI and recorded.
- **The seat's own host wakes.** Codex seats run as a `codex` TUI in a terminal, with the
  managed app-server the TUI spawns (the owner, 2026-09-25: "They were both started via the
  terminal with `codex`"). The launch command starts the TUI and its companion together.
  Proof: `owner-held`, the live wake run recorded on that host, on a Codex seat that is not the
  observing seat's own thread.
- **The operating rule names the bridge.** `use-monitor-for-event-driven-wake`, the generated
  `AGENTS.md` block and the team start skill's Codex paragraph name the bridge as the Codex wake
  path, and bounded foreground polling as the fallback only. Proof: `repo-safe`, the projection
  freshness validator.

## Todos

Each slice is one story, within the default round budget.

1. **Probe the open behaviours**, under the owner's standing permission for Codex experiments:
   read-only sandbox, never unlimited permissions, every process closed, CLI version recorded.
   A first probe (2026-09-25, two runs) learned nothing from a daemon-mode run that exited in
   25 seconds with its exit message uncaptured; the re-run captured the TUI's own stdout and
   stderr to a file, killed only what the probe started and compared process sets before and
   after, and showed codex-cli 0.157.0 installing the daemon, then loading for about two
   minutes with no control socket, rollout or thread.
   Each probe runs in an isolated session started for it, never in a live team seat's turn,
   because queued text arrives as user-role input.
   - A user's typing and a queued notice meeting at an idle boundary.
   - A queued notice arriving while the seat drafts a reply to its user.
   - The Codex CLI only (the owner, 2026-09-25 about 11:40Z: "why do we need the ChatGPT
     desktop host? My interest is Codex CLI"): the TUI in a terminal, in the mode seats run it,
     with the managed app-server it spawns; and `codex exec`.
   - Whether `CODEX_THREAD_ID` is present in a seat's shell environment. Observed present on
     2026-09-24 (Luna stirs Radiance, 0.156.1, a terminal `codex` seat).
   - A queued notice to a killed session.
   - Whether a variable set by one launch reaches a second seat's shell while a daemon already
     runs (mechanism 2).
   - Whether `--add-dir` still grants the seat write access to the handshake directory in daemon
     mode (mechanism 2).
   - The launch channel that gives the seat its handshake path, such as the TUI's first prompt.

   The findings are a dated addendum to the concept note. If any finding breaks the mechanism,
   this node returns to the owner before slice 2. Slice 2's code needs none of the last three,
   which shape the launch command in todo 3.
2. **The wake companion**, test-first, as three pull requests after the pre-execution reviews
   of 2026-09-25. None edits a file of the seat's own watcher. The companion composes the
   exported watch loop, `watchCommsLoop`, with injected functions of its own: `drain` selects,
   decides and queues; `emit` writes the companion's status, never the queue, since the loop's
   error and exit lines pass through `emit`; `markSeen` writes the companion's cursor; there is
   no heartbeat tick. The loop marks events only for a pass with output, so every decision that
   queues also returns a line.
   1. **2a, the pure core.** Selection, coalescing, the latch, the budget and the backoff; the
      handshake parse; this node's edit. Commit order, each a failing test then the code: the
      selection table; the decisions (a burst, a hold, the ack release, no release on a comms
      event, the interval, the budget and its rolling hour, a later ack resuming, the backoff,
      one WAKE FAILED line per attempt, and a line with every queue); the handshake parse. The
      ack time and the clock are plain inputs to the core. Reviews: test-expert, focused;
      security-expert, focused on the handshake parse.
   2. **2a-ii, the Codex thread id's owner.** `ThreadId` and `parseThreadId` move from
      `codex-exec/envelope.ts` to `core/codex-thread-id.ts`, with every import updated and no
      re-export. That removes 2a's import of the dialogues' envelope from `collaboration-state`.
      The owner is `core`, a leaf, rather than `codex/`, which already imports from
      `collaboration-state` (architecture-expert-barney's pre-execution read).
      The rollout reader is among the importers, so it is sequenced with the Codex seat's
      slice 1b-iv PR B. Reviews: code-expert; architecture-expert-barney, focused.
   3. **2b, the ports and the loop,** as three pull requests after 2b's pre-execution code-expert
      review and architecture-expert-barney's read of 2026-09-25. Its files sit flat in
      `collaboration-state` beside 2a's, since a directory of their own would import
      `collaboration-state` while the command's dispatch imports it back. They import nothing
      from `codex-exec`; anything shared goes to `core`. Tests read no clock: the time after a
      queue call comes from an injected `now()`.
      1. **2b-i, the queue port.** The notice constants and the pure argv and environment builder
         that is their first consumer; the pure map from an `execFile` outcome to a queue step
         (queued only on no error; an output overflow, a timeout, and a non-zero exit or unknown
         shape count against the budget; `ENOENT` from spawn is not found, after the state
         directory is checked at arm); the pure trust check of the binary's real path; the thin
         `execFile` binding. 2a's line namer, `QueueFailure` (gaining the overflow) and `WakeStep`
         are exported here, at their first consumer.
      2. **2b-ii, the seat and state files.** The no-follow read that two tools already use moves
         into `core` behind a port with code-only failures, first for those two, then gaining
         the mode, size and time facts the handshake and `ack` readers need; the handshake
         reader; the `ack` reader; the cursor and status writers through the exclusive temporary
         file and rename.
      3. **2b-iii, the composition.** The per-file comms reader (a malformed file counted, a
         file whose id differs from its name refused); `drain` (events that cannot wake marked
         first, held ids kept in memory so the batch limit bounds new files read per pass, and
         `settleWake` fed `decideWake`'s state); `emit`, which passes only the text the drain
         last returned and reduces any other loop line to a closed kind, naming only the ids the
         companion last marked; the liveness port with a latch set by the exit event, whose
         binding to the TUI's process belongs to todo 3; and the composition tests (the seat's
         watcher still delivers; a status write fails after a queued notice; the exit notice
         once, or not at all).

      Pinned by 2a's reviews:
      - the companion's `emit` rewrites the loop's own error and exit lines to closed kinds, and
        names ids only through the same UUID-only namer, since those lines carry a raw message
        and raw ids;
      - the drain reads each comms file on its own, skips a malformed one and reports only a
        count, so one bad file cannot stop every wake, and refuses a file whose event id differs
        from its file name;
      - `settleWake` takes the state `decideWake` returned, and the time read after the call;
      - the batch limit applies after every event that cannot wake is marked;
      - a status write that fails after a queued notice is tested.

      Reviews: security-expert, deep; test-expert, focused; architecture-expert-barney, focused,
      on the `core` read port.
   4. **2c, the command.** `comms wake`, with its options, help and dispatch. The help text gets
      a module of its own, since the shared help module is at its line limit. Reviews:
      code-expert; config-expert if a lint or knip entry changes.

   Every pull request gets a code-expert review before and after execution.

   **HELD, 2026-09-25: slice 2 is back with the owner.** Its pre-execution review found a fact
   that breaks the mechanism (comms `dbb48c46`, absorbed by the Director at 15:58:13Z). On
   codex-cli 0.157.0, Codex denies every sandbox below full-disk write any access to the
   app-server daemon's socket directory (`sandboxing/src/seatbelt.rs`, and the vendor's test
   `daemon_sockets_are_denied_despite_network_and_tmp_write_grants`). `codex queue` has no
   no-daemon or embedded-server route while a daemon runs. So a watcher the seat starts from its
   own shell cannot queue into its own thread. The recommended cure, for the owner's word: the
   seat's launch command starts a wake companion beside the TUI, outside the sandbox, bound by a
   thread-id handshake file the seat writes. The companion's one act is the fixed notice. Nothing
   is built until the owner's word.

   **RELEASED, 2026-09-25.** The owner approved the cure, verbatim "1. Approve", relayed by the
   Director as `281b584b` at 17:20:21Z. The mechanism above now describes the companion.
3. **The launch command, the operating rule, the start skill and the generated block**, with the
   live run recorded.
   - The launch command creates the handshake directory, grants it with `--add-dir`, gives the
     seat its path through the channel todo 1 settles, and starts the companion under an empty
     environment with an absolute `node`. It binds the companion to the TUI's process by the
     process's identity, such as waiting on it or a pipe that closes when it exits, never a bare
     process id that can be reused, and stops the companion when the TUI exits.
   - The launch command never passes `--no-daemon` or `-c` to the TUI. Either puts the TUI on an
     embedded server, where no queued notice reaches its thread.
   - The start skill's Codex paragraph has the seat check that its identity comes from
     `CODEX_THREAD_ID`, then write its handshake, and touch the `ack` file after reading a wake.
     It also has the seat read the companion's status at start.
   - A sender clause: a routing meant to wake a Codex seat goes by `comms direct`.

   Citizenship text is shared Practice text, so this slice's doctrine lands as the same bytes in
   the second estate, carried as an exchange row.

## Out of scope

- The pinned native extension and its broker and canary apparatus. The owner ruled it out on
  2026-08-01. This node supersedes the `codex-app-server-idle-wake` sketch.
- An upstream contribution. `codex-upstream-idle-wake-contribution` stays speculative. The
  absence it answered, no supported surface, is answered by the vendor's queue.
- The rest of the membership programme, each a node of its own:
  - `PreToolUse` guard parity: Codex hooks now include `PreToolUse`, and the repository's
    `.codex/config.toml` wires `SessionStart` only;
  - a live acceptance seat running the whole team journey, the programme's capstone proof.
- Invocation mode, the dialogues instrument. It is a different use case by the owner's word ("not
  necessarily the same thing").
- Cross-machine and remote wake (`codex queue --remote`).
- General lifecycle interlocks the day surfaced, which are not Codex-specific: a degraded seat's
  claim path under F-95, and heartbeat gaps between claims. They are routed to the Director.

## Review dispositions

- **2026-09-24, Luna stirs Radiance (01a0d3), the co-owner, the first read from a live Codex seat**
  (the pairing channel, 15:54:00Z). All four points are accepted:
  - `CODEX_THREAD_ID` is present in the seat's shell on the ChatGPT desktop host, and
    `codex queue --help` shows `--thread` and `--message` on 0.156.1. Folded into todo 1 as an
    observation for that host only.
  - The seen cursor advances before the queue call, so a failed call or an exit between the two
    must not read as a delivery. Folded in as mechanism 6 and the acceptance criterion "A failed
    wake loses no event".
  - The probes run in an isolated session, not in a live co-owned turn, because queued text is
    user-role input. Folded into todo 1.
  - The desktop host is tested separately from the editor TUI. Folded into todo 1 and the
    acceptance criterion "Each host wakes".
  - The fixed notice and the exact-self thread binding were confirmed as the right trust
    boundary.
- **2026-09-24, Luna stirs Radiance, a delivery note under the stamped shape** (the pairing
  channel, 16:48:29Z). The watcher marks events seen only after their emit succeeds, so placing
  the wake inside the pass, before mark-seen, keeps a failed wake's events unseen for replay. The
  wake sink stays out of the generic error-line path so a failed wake cannot recurse. Mechanism 6
  is worded to match; the acceptance criterion "A failed wake loses no event" is unchanged.
- **2026-09-25, the owner, relayed by the Director (Wick binds Temper, ed7b48), about 11:40Z.**
  Two words, verbatim. On the desktop-host legs: "why do we need the ChatGPT desktop host? My
  interest is Codex CLI". On the premise that the Codex seats ran in the desktop app: "nope!
  They were both started via the terminal with `codex`". So the node's desktop-host premise,
  taken from the 15:54:00Z read above, was wrong. First-hand parentage agrees: the live Codex
  seat's app-server was spawned by a `codex` TUI in an editor's integrated terminal. Todo 1 and
  the acceptance criterion now name the Codex CLI only: the TUI in a terminal, in the mode seats
  run it with the managed app-server it spawns, and `codex exec`. The desktop legs are out of
  scope and are not run. This is shared citizenship text, so the same bytes are owed to the
  second estate as an exchange row.
- **2026-09-25, slice 2's pre-execution review** (code-expert, then Swallow holds Drift, 516619,
  reading the codex-cli 0.157.0 source), sent to the Director as `dbb48c46` and absorbed at
  15:58:13Z. The Director asked the owner.
  - **The finding that broke the mechanism.** Codex denies file and Unix-socket access to the
    app-server daemon's socket directory, `/tmp/codex-daemon-<uid>`, for every sandbox below
    full-disk write. This is deliberate:
    - `sandboxing/src/seatbelt.rs`, about lines 1063-1068;
    - the vendor's test `daemon_sockets_are_denied_despite_network_and_tmp_write_grants`, which
      asserts it under a `workspace_write` policy.

    `codex queue` also refuses `--no-daemon`, and refuses an embedded server while a daemon runs
    (`tui/src/session_queue_commands.rs`, about lines 31-50). So a watcher the seat starts from
    its own shell can never queue into its own thread.
  - **Retired from source.** A queued message carries text only
    (`app-server-protocol/src/protocol/v2/thread.rs:901-914`), and the turn runs under the
    thread's own loaded config (`app-server/src/request_processors/thread_queue_processor.rs`).
    So the queue argv carries no configuration flags (mechanism 4).
  - **Taken into the mechanism:**
    - eligibility on structured addressing only (mechanism 3), with todo 3's sender clause. Every
      routing sent to a Codex seat on 2026-09-24 was a titled broadcast with no addressing field,
      so none would have woken one;
    - a failed wake retried on a capped backoff, so it is neither replayed every pass nor able
      to block newer events. As first written, a failed wake would have replayed the same batch
      every pass (mechanisms 6 and 7);
    - at most one notice outstanding (mechanism 7);
    - the arm-time binding check (mechanism 2);
    - the exit notice (mechanism 10).
- **2026-09-25, the owner, relayed by the Director (Wick binds Temper, ed7b48) as `281b584b` at
  17:20:21Z.** Verbatim: "1. Approve". The wake companion beside the seat replaces mechanism 1's
  in-seat watcher. With the companion, the seat's own watcher is untouched: the companion keeps a
  cursor of its own (mechanism 6), so the earlier question of when a seen cursor marks a delivery
  no longer arises for the wake. The launch command moves into todo 3.
- **2026-09-25, the pre-execution reviews of the companion** (code-expert and security-expert, on
  the node edit before any code; the security review read the codex-cli 0.157.0 source). Taken
  into the mechanism:
  - The identity. The seat's identity comes from the highest-ranked seed in its environment, and
    `CODEX_THREAD_ID` ranks below the Practice session seeds. So the seat writes its handshake only
    when its identity comes from that id, and the companion derives it from the id alone
    (mechanism 2).
  - The cursor marks every examined event, so a pass does not re-read the whole store. The
    comms directory held 1,327 events. Only eligible events wait for a queued notice
    (mechanism 6).
  - The exit notice goes only while the TUI runs, since an exited session would run it at its
    next resume (mechanism 10).
  - The status file, since the companion's output would otherwise print into the TUI's terminal
    (mechanism 9).
  - The launch path and environment. A `codex` found through a `PATH` that starts in the
    repository could be a peer's shim, run unsandboxed. So the path is absolute and checked, the
    environment is fixed, and the working directory is the companion's own (mechanism 5).
  - The handshake channel. In daemon mode a seat's shell environment is the shared daemon's, so a
    launch variable can reach another seat. The path goes through a channel of the launch alone
    (mechanism 2, todo 1).
  - The handshake location and read. A file in the repository, `/tmp` or `$TMPDIR` is writable by
    every sandboxed peer, and only the sandbox tells same-user processes apart. So the directory
    sits under the home at 0700, granted with `--add-dir`, and the file is read once without
    following links. The strict UUID pattern stops `codex queue` falling through to a session-name
    lookup (mechanism 2).
  - The latch. Comms authorship is self-declared, and heartbeats arrive whether or not the seat
    runs a turn, so a seat-authored event cannot release it. The seat-only `ack` file does, with
    a budget, because the vendor holds up to 100 queued messages for a thread that is not running
    (mechanism 7).
  - The residual trust statement (mechanism 11).

  Slice 2 becomes three pull requests, composing the exported watch loop rather than a second
  loop, with no edit to the watcher files under another seat's claim (todo 2). The property test
  becomes a table test, since no workspace package carries a property-testing library.
- **2026-09-25, the reviewers' confirmation of the revision.** Both confirmed each finding taken
  in. code-expert asked five points pinned, now in mechanisms 5 and 7 and todo 2: a later ack
  resumes queueing, and the budget is a rolling hour; every queueing decision returns a line,
  since the watch loop marks events only for a pass with output; the working directory named is
  the spawned `codex`'s; the exit notice sits outside the budget; the path checks run on the
  resolved real path. security-expert found one new issue, blocking 2b: a cursor under the
  repository, or a status file in the seat-writable handshake directory, lets a planted link
  steer a write of the unsandboxed companion. The cursor moves to the companion's own 0700 state
  directory, every write goes through an exclusive temporary file and a rename, and "No
  companion write follows a link" is an acceptance criterion. Todo 3 gains liveness bound to the
  TUI's process identity, and a launch command that never passes `--no-daemon` or `-c`.
- **2026-09-25, 2a's post-execution reviews on PR 228** (code-expert, test-expert,
  security-expert). Cured in 2a:
  - one lowercase-UUID predicate in `core`, used by the thread id, the runtime session id and the
    wake lines, where three copies of the pattern had been;
  - the shared heartbeat predicate in place of a copy;
  - selection renamed `comms-wake-select`;
  - a borrowed event id can no longer cancel a pending wake;
  - timeouts and non-zero exits count against the budget;
  - a future-dated ack is ignored;
  - a line names at most five ids;
  - the WAKE FAILED line names the fallback;
  - the ack no longer clears a stop, since that branch changed nothing a test could see;
  - the tests the mutants showed missing: both sides of the rolling window, the backoff and its
    cap, failures in a row, a stop named once per stop, the stop ahead of the hold, a heartbeat to
    an audience, and UUID-shaped peer text.

  Routed: the thread id's owner to 2a-ii, and the loop's raw error lines, the per-file drain, the
  file-name check and the settle-state rule to 2b (todo 2).
- **2026-09-25, 2b's pre-execution reviews** (code-expert; architecture-expert-barney). 2b came to
  about 24 files, so it becomes three pull requests (todo 2). Pinned before any code:
  - proofs over injected file ports and a recorded observation of the thin bindings, since the
    testing strategy allows no file system, spawn or clock in a test;
  - a cursor seeded only when none exists, as one strictly parsed JSON document;
  - a late pass step named as a stop cause, with the exit notice after any call in flight;
  - the liveness binding moved to todo 3;
  - the batch limit bounding new files read per pass;
  - an output overflow counted as a possible delivery.

  barney placed 2b flat in `collaboration-state` and the shared no-follow read in `core`.
