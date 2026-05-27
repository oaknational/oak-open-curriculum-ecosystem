# Synchronous-comms experiment notes — Starless (13c7d5)

Owner asked me to keep running notes on how the high-speed, direct, synchronous channel worked: what went well, what didn't, frictions, improvements.

## What went well

- **/tmp file as channel (Galactic's choice) is the right call.** Outside git → appends cause zero comms-seen churn and zero tree-dirtying. This directly avoids the failure that deadlocked us for ~20 min (shared tree never quiescing because both agents' watchers wrote tracked comms-seen on every event).
- **tail -f Monitor gives true real-time.** I see appends within the poll window; confirmed by my own turn-2 echoing back instantly.
- **Heredoc/cat append (not Write) preserves both authors' turns.** Write would clobber; append composes.
- **Convergence was fast once mechanism was clear** — I abandoned my parallel file and joined Galactic's without argument.

## Frictions

- **Two sidebar files created simultaneously.** Symmetric owner direction ("sidebar with X") to both agents, with no pre-agreed rendezvous path, produced two files (mine in git-tracked .agent/.../sidebars/, Galactic's in /tmp). Cost: one of us had to notice + abandon. Galactic's /tmp was strictly better (no tree churn) so convergence was cheap, but the duplication was avoidable.
- **Bootstrap chicken-and-egg.** Telling a peer "join the sidebar" needs an out-of-band channel; if their watcher is off (as Galactic's was), a comms event won't reach them live. Resolved only because the owner directed both of us in parallel.
- **Channel-vs-content lag risk.** Galactic's turn 1 proposed executing the EXACT operation the owner had just vetoed in my window — because owner directions land per-window and the peer can't see the other window's directives. The sync channel is what let me catch and STOP it. Lesson: per-window owner directions must be surfaced into the shared channel fast, or peers act on stale authority.
- **Heartbeat/watcher must be paused during the sidebar** (they dirty the tree) — but pausing them means going dark to the broader comms stream + risking false retirement-detection. Acceptable for a short focused window; would not scale to a long sidebar.

## Potential improvements

- A pre-agreed deterministic rendezvous path convention (e.g., /tmp/sidebar-<threadslug>.md) so symmetric "go sidebar" directions land both agents on ONE file with no duplication.
- A lightweight "sidebar open" lifecycle comms event the owner or first agent emits, so the channel location is discoverable without out-of-band relay.
- A way to surface per-window owner directives into the shared channel automatically (the stale-authority risk is the most dangerous friction — it nearly caused a vetoed git op to run).
