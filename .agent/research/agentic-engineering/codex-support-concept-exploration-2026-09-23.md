# Codex support in the Practice — concept exploration and latest-CLI experiments (2026-09-23)

- **Seat**: Blazar lifts Corona (b65a9a), claude-code / claude-opus-5-5, owner-directed; the owner
  placed this research in the seat's charge.
- **Kind**: dated research record. Every experimental and counted fact in §2 to §4 carries the
  command or file that proves it. Attributions name the seat and the time. The proposals in §5
  are proposals; none is a decision.
- **Reviewed before landing** by Badger seeks Hush (01a0ce), a Codex seat (codex / GPT-5), who
  checked it first-hand against the installed CLI and upstream source. Four corrections and one
  resolved question were absorbed: the time-bound comms count, the wake-bridge trust
  qualification, the causality wording, the version-binding distinction, and the rules-fallback
  source reading. The same seat's own experiments are §2.7.
- **Where that review lives**: it travelled as directed comms events to this seat between 13:33Z
  and 13:49Z on 2026-09-23. Those events are instance-tier state, not tracked (ADR-199). Each
  correction is recorded, credited, in the section it changed.
- **Evening addendum**: the same seat added §2.8 the same day, 19:05Z to 19:56Z. It covers the
  authority of a `codex exec` call beyond its sandbox settings.
- **Addendum of 2026-09-24**: the same seat added §2.9, on code mode and the sandbox tested with
  no model, with runtime reads from Forge herds Vapor (01a0d2), a Codex seat.
- **Scope swept**:
  - first-hand reads: the Sif framework, `the-codex-dialogues`, `codex-helper`, `cricket`,
    ADR-180, `.codex/`, `AGENTS.md`, the Codex capability catalogue (2026-07-25) and divergence
    census (2026-07-31), the idle-wake and citizenship plans, the dialogues tally and probe record,
    the review-methodology report (2026-08-09), and `pr-lifecycle`'s bot-reviewer section;
  - three read-only sweeps, whose load-bearing numbers and quotes were re-checked against source:
    doctrine (PDRs, ADRs, rules, directives, executive memory, skills); all four plan estates plus
    reports and research; and the lived record (git log, comms and comms-archive, the claims
    archive, napkins, experience records, `~/.codex/history.jsonl`);
  - experiments on the installed Codex CLI, run under the owner's in-session permission (§2).

## 1. Owner words recorded this session (verbatim)

- Experiments, about 13:0xZ: "the codex cli is installed, I give you permission to invoke it for
  experiments. Please make sure you close down any Codex processes when you are finished with
  them, and do not start any with unlimited permissions".
- Relayed by the Director (Wick binds Temper, ed7b48) at 13:15Z: "the Codex work is happening now,
  I would not have opened a seat for it otherwise". This lifted the hold of about 2026-09-08
  ("do not re-raise the Codex wake before October", `.agent/memory/operational/repo-continuity.md`).
- About 13:23Z: "we in no way care what older Codex CLI versions did or did not do, only what the
  latest version does, we will not pin versions, we use latest".

Earlier owner words that frame the question:

- "you think very differently from the Claude instances in the team, and that is incredibly
  valuable" (2026-07-30, `~/.codex/history.jsonl`).
- "if you can't communicate without supervision, you can't collaborate in the team" (2026-07-11,
  same source).
- "the end goal is that all messages automatically alert the Codex agent when appropriate"
  (2026-07-31, same source).
- "running the codex dialogues approach is high value" (2026-08-09,
  `.agent/memory/active/archive/napkin-2026-08-14.md`).
- Review policy: "a codex or copilot or external claude review is desirable ... but sometimes
  those options are not available, and development still needs to happen" (2026-09-10, `pr-lifecycle`).

## 2. Experiments on the latest CLI (codex-cli 0.156.1, 2026-09-23)

The CLI updated itself at about 12:52Z. `ls -la ~/.local/bin/codex` shows the symlink's mtime.
It points to `~/.codex/packages/standalone/current`, which now resolves to the 0.156.1 release.

Every Codex process started below ran with a read-only sandbox and approval `never`. All were
closed. A process-table read at 13:23:55Z showed only processes that predated the experiments:
Cursor-extension app-servers, and `codex mcp-server` processes launched by Claude sessions before
the update.

### 2.1 `codex exec` works (one-shot)

```bash
codex exec --json --ephemeral --sandbox read-only --skip-git-repo-check -C "$D" \
  --output-last-message "$D/last.txt" "Reply with exactly the text EXEC-OK ..."
```

The run exited 0 and the last message was `EXEC-OK`. Usage was 22,792 input tokens (12,544 cached)
and 7 output tokens: the ambient context of a trivial one-shot.

### 2.2 `codex mcp-server` no longer exists

- **The help diff.** `codex --help` on the release still on disk
  (`~/.codex/packages/standalone/releases/0.153.4-.../bin/codex`) lists
  "mcp-server  Start Codex as an MCP server (stdio)". On 0.156.1 that line is absent, and
  `codex mcp --help` offers only `list|get|add|remove|login|logout`.
- **The failed launch.** `codex mcp-server -c sandbox_mode=read-only -c approval_policy=never`
  exits 1 with `Error: stdin is not a terminal`: the word is taken as a prompt to the interactive
  UI.
- **The probe fails.** `node .agent/skills/the-codex-dialogues/scripts/probe-codex-mcp-server.mjs
  --candidate` prints `PROBE FAIL: server exited (code 1)`.
- **Consequence.** The Sif Annex A binding (stdio MCP) cannot launch on the latest CLI. A Claude
  session whose MCP server started before the update keeps the older binary only until it
  restarts. `lsof -p <pid>` on those processes names the 0.153.4 binary.

### 2.3 `codex exec` plus `codex exec resume` carries a read-only multi-turn thread

```bash
codex exec --json --skip-git-repo-check -C "$D" \
  -c 'sandbox_mode="read-only"' -c 'approval_policy="never"' "Turn 1 ... reply ACK-1"
codex exec resume "$THREAD_ID" --json --skip-git-repo-check \
  -c 'sandbox_mode="read-only"' -c 'approval_policy="never"' "Turn 2 ... attempt one write"
```

Observed: turn 2 reported the same `thread_id` and restated `ACK-1`. The single write attempt
(`printf 'SENTINEL' > resume-sentinel.txt`) was refused with `zsh:1: operation not permitted`, and
the sentinel was absent on disk afterwards. `exec resume` has no `--sandbox` flag, so the `-c`
settings carry the authority. The user-level default in `~/.codex/config.toml` is
`approval_policy = "on-request"` with no `sandbox_mode`.

### 2.4 `codex queue` starts a turn on an idle interactive session

The design, so it can be re-run:

1. **Start an idle session.** In a disposable directory outside every checkout, start one
   interactive session in a pseudo-terminal:

   ```bash
   (sleep 600) | script -q "$D/tui.log" codex --no-alt-screen -C "$D" -s read-only -a never \
     -c 'projects={ "<dir>" = { trust_level = "trusted" } }' "Reply with exactly READY-1 ..."
   ```

   The inline-table `projects` override avoids the "Trust this folder?" screen without saving a
   trust decision. The dotted-key form `projects."<dir>".trust_level` did not take effect, and the
   session stopped at the trust screen.
2. **Let it go idle.** After `READY-1` the session is idle. Take the thread id from the rollout
   under `~/.codex/sessions/`.
3. **Queue a message:**

   ```bash
   codex queue --thread <id> -s read-only --message "Reply with exactly WAKE-OK ..."
   ```

   It returned at once: `Queued message 01a0ce6e-... for thread 01a0ce6d-...`.

Observed (rollout timestamps):

| Event | Time (UTC) |
| --- | --- |
| queued | 13:22:28 |
| `task_started` | 13:22:33.499 |
| `WAKE-OK` `task_complete` | 13:22:38.393 |

No input reached the session. The queued text appears in the rollout as an ordinary user-role
message.

The shared daemon was absent at both inspections: once with the session idle before queueing
(13:22Z) and once after teardown (13:23:55Z). Each time, `codex app-server daemon version` reported
that `app-server-control.sock` does not exist, and the process table showed no daemon. These are
snapshots; no continuous trace of the wake interval was recorded. The write-ahead log of
`~/.codex/queue_1.sqlite` was updated at queue time.

This is a new primitive. It complements the existing relay; it does not replace it. The estate's
standing position, "an ACTIVE-TURN ALERT, not idle wake", concerns the relay's
`collaboration.send_message`, which this run did not exercise. That position was recorded on
0.146.0 and narrowed on 2026-08-02. It is carried by `use-monitor-for-event-driven-wake.md`, the
generated `AGENTS.md` block and the cross-platform surface matrix, and it still stands for the
relay. Bounded foreground polling stays a named requirement until a queue-based bridge is built
and tested. The Codex review on pull request 178 drew both distinctions in this paragraph.

Not tested in this seat's run. Two of these were later tested by Badger seeks Hush (§2.7):

- queueing while a turn is active, and whether a user's typing takes priority;
- queueing to a session whose process has exited;
- queueing across machines or through a remote endpoint.

### 2.5 Close-down

The interactive Codex session and its `codex-code-mode-host` child survived SIGTERM, and each
needed SIGKILL. Any recipe that closes Codex sessions must check the process table afterwards,
not assume a signal worked.

### 2.6 Present on the latest CLI and not exercised here

- `codex agents` (sessions on the shared local app-server daemon);
- `codex app-server daemon start|stop|proxy|...` and `remote-control`;
- `codex review` and `codex exec review`;
- `codex exec fork`;
- feature flags: stable `sleep_tool`, `goals` and `in_app_local_automation`; under-development
  `agent_message_board` and `send_message_to_user_async`; `multi_agent_v2` stable but off by
  default.

### 2.7 Checks run from a Codex seat (Badger seeks Hush, 01a0ce, 13:44Z to 13:49Z)

Run on the same installed CLI, under the same owner constraints. The seat reported every process
exited and a process-table audit found none left.

Proof: the seat ran its disposable sessions under a separate, disposable Codex home, so the
rollouts are machine-local and untracked; they are named here by session id. The queue checks
used `codex queue --thread <session-id> -s read-only --message "<reply-token prompt>"` against
session `01a0ce81-a2e0-7911-9c6b-28c3c670b18a`, whose rollout records the event times below. The
collaboration-surface reading comes from the `turn_context` of the seat's own session,
`01a0ce73-e40d-74c2-86aa-c73cc8d8a6ba`.

- **Collaboration surface.** `collaboration.send_message` is present and worked in both
  directions with the seat's relay child during an active turn. The seat's rollout
  `turn_context` records `multi_agent_version=v2`, model `gpt-6-sol`, effort `xhigh`. The injected
  PDR-027 identity declares GPT-5, so the declared model and the effective model differ, as the
  2026-07-31 census found.
- **Queue during an active turn.** The message was held, not steered into the running turn.
  The running task completed at 13:44:58.374Z, and a separate queued user-role turn started at
  13:44:58.454Z, replying `ACTIVE-QUEUE-OK` at 13:45:00.815Z.
- **Queue to an exited session.** `codex queue` accepted the message, and no turn ran until an
  explicit resume, which replied `EXITED-QUEUE-OK` at 13:46:26.680Z. This is one run: the message
  survived the clean exit of session `01a0ce81-…` in a disposable Codex home. Other exit modes (a
  killed or crashed process), longer gaps, and other session states were not exercised.
- **Not run:** `exec resume` without the sandbox pin. Under the user configuration it could
  broaden permissions, which the owner's constraint forbids.

Still untested: whether a user's typing takes priority over a queued message at an idle
boundary, and queueing across machines or through a remote endpoint.

### 2.8 The call's authority envelope (19:05Z to 19:56Z)

These runs test whether the read-only settings are the whole of a `codex exec` call's authority.
Each ran in a fresh, empty directory outside every checkout, capped at 180 seconds per turn
(240 seconds from 19:34Z). Every Codex
process they started exited by itself. A process-table read afterwards found no `codex exec`
process and none of the child processes listed below.

- **Two single-turn arms, one run each.** Both used `codex exec --json --skip-git-repo-check
  -C "$D" -c 'sandbox_mode="read-only"' -c 'approval_policy="never"' -`, with the prompt "Reply
  with exactly ACK-1 and nothing else. Do not run any command." A shell loop sampled the exec
  process's descendants once a second.
  - **Control, with the user configuration loaded.** The reply was ACK-1, on 22,876 input tokens.
    The rollout's `turn_context` records `gpt-6-sol` at effort `xhigh`, as configured. The exec
    process spawned:
    - `node_repl` and `cua-repl` from the ChatGPT app bundle;
    - a computer-use client process;
    - `git clone https://github.com/anthropics/claude-plugins-official.git` into the Codex home,
      with its `git-remote-https` and `index-pack` children.
  - **The same call with `--ignore-user-config`.** The reply was ACK-1, on 19,188 input tokens.
    The rollout records `gpt-6-astra` with no effort set. No child process appeared in any
    sample.
- **The configuration reaches past the sandbox.**
  - The sandbox settings govern the model's shell. The user configuration adds plugins, MCP
    servers and marketplace sync, which run outside that sandbox. Under approval `never`, those
    extensions are live tools of the called Codex.
  - The same flag that removes them also drops the configured model and effort.
  - `~/.codex/config.toml` has `[mcp_servers.*]` and `[plugins.*]` tables, including computer
    use, Chrome and GitHub. Only the table headers were read.
  - `~/.codex/rules/default.rules` holds seven `decision = "allow"` prefix rules, among them
    `pnpm agent-tools:collaboration-state`, `git switch` and `pnpm install`. The vendor's rules
    documentation says an allowed command runs outside the sandbox. `--ignore-rules` skips
    those files.
- **The full envelope over two turns.** It adds `--ignore-user-config --ignore-rules` to the
  sandbox and approval settings. The open used `-C <root>`. The resume ran from the same root,
  because `codex exec resume` lists no `-C`.
  - Turn 1 returned the exact acknowledgement, on 14,436 input tokens.
  - Turn 2 resumed the same thread id and restated the acknowledgement.
  - Turn 2 ran the given `printf SIF > <root>/sif-probe-sentinel.txt` through the code-mode
    `exec` tool. The rollout records that call with `exit_code: 1`. The reply added
    `zsh:1: operation not permitted`.
  - The sentinel was absent afterwards, and the root was still empty.
- **The event stream does not always carry the shell run.** In this run the shell ran through
  code mode, and `codex exec --json` emitted no `command_execution` item. It emitted none in §2.3's
  run either. Only `agent_message` items appeared, one of them a preamble before the final reply.
  The 19:34Z run below did carry the item. So a write attempt cannot rest on the event stream
  alone. It has to be proven from the disk, the rollout, and output the model could only have got
  by running the command.
- **Default-on features: the shell snapshot and memories (trials at 19:34Z and 19:36Z).**
  `codex features list` shows both as stable and on, so the flags above leave them on.
  - The 19:34Z trial.
    - **Setup.** The full envelope, run with the child environment reduced by `env -i` to `HOME`,
      `USER`, `LOGNAME`, `LANG`, `TMPDIR`, a system `PATH` and `CODEX_HOME`. It added
      `--disable memories`, `-c 'web_search="disabled"'`, `-c 'project_root_markers=[]'`,
      `-c 'shell_environment_policy.inherit="core"'` and the owner's configured model and effort.
    - **Command.** The resumed turn ran `printf SIF > <root>/<random sentinel> || cat <nonce
      file>; echo; env | cut -d= -f1`.
    - **The write.** The event stream carried a `command_execution` item: `/bin/zsh -lc "..."`,
      output `zsh:1: operation not permitted`, then the nonce, then the variable names. The item's
      exit code was 0, from the trailing `env`. The sentinel was absent afterwards.
    - **The variable names** included `GITHUB_PERSONAL_ACCESS_TOKEN`, `GITHUB_MCP_TOKEN` and
      several `NVM_*` and `HOMEBREW_*` names. None of those was in the child's environment. Of
      the shell's startup files, only `~/.zshrc` names the two tokens, and a non-interactive
      login shell does not read it. So these values arrive through the shell snapshot, which
      replays the interactive shell's environment.
    - **The policy record.** Each turn's rollout `turn_context` recorded the configured model and
      effort, approval `never` and sandbox `read-only`. It also recorded `cwd` as the root and a
      permission profile of file-system `read` on the root path `/`, with network `restricted`.
  - **The 19:36Z trial, one turn.** It used the same envelope plus `--disable shell_snapshot` and
    `-c 'allow_login_shell=false'`. The shell ran as `/bin/zsh -c` and listed only `CODEX_CI`,
    `CODEX_SANDBOX`, `CODEX_SANDBOX_NETWORK_DISABLED`, `CODEX_SESSION_ID`, `CODEX_THREAD_ID`,
    `CODEX_VERSION`, `COLORTERM`, `GH_PAGER`, `GIT_PAGER`, `HOME`, `LANG`, `LC_ALL`, `LC_CTYPE`,
    `LOGNAME`, `NO_COLOR`, `OLDPWD`, `PAGER`, `PATH`, `PWD`, `SHLVL`, `TERM`, `TMPDIR`, `USER`
    and `_`. The root stayed empty, and no Codex process remained.
  - **What this shows.** The read-only sandbox does not stop the interlocutor reading the
    owner's shell secrets. Without these two settings they sit in its ambient environment, one
    `env` away from the vendor's context. Reads in general stay unbounded, because the
    permission profile grants read on `/`.
- **Pointing `HOME` at an empty directory (trial at 19:55Z, one turn).** This run used the 19:34Z
  envelope, with the shell snapshot and the login shell left at their defaults. The child's
  `HOME` was a fresh, empty 0700 directory, and `CODEX_HOME` stayed the owner's.
  - The shell ran as `/bin/zsh -lc`, and it listed the same core names as the 19:36Z run plus
    `CODEX_HOME` and `__CF_USER_TEXT_ENCODING`. No token and no `NVM_*` or `HOMEBREW_*` name
    appeared.
  - The empty home stayed empty, the root stayed empty, and no Codex process remained.
  - So the snapshot replays the startup files of whatever `HOME` the process has. An empty
    `HOME` closes this class of leak whatever the snapshot or login-shell settings are.
- **The vendor SDK.** `@openai/codex-sdk` 0.156.1 spawns `codex exec --experimental-json` and maps
  its options onto flags ahead of `resume`. None of its options emits `--ignore-user-config`, and
  it declares an exact dependency on its own `@openai/codex` package. Read from the package
  tarball.

### 2.9 Code mode, and the sandbox tested with no model (2026-09-23 19:12Z to 2026-09-24 11:00Z)

Added on 2026-09-24 by the same seat, with runtime reads from Forge herds Vapor (01a0d2), a Codex
seat. These runs settle two questions: how the harness records a shell run, and whether the
sandbox can be tested with no model at all. Each fact below was read from the named rollout's
records or observed in the named run.

- **Every shell run went through code mode, on both models.** In the five threads of these
  trials, each shell run was recorded as a `custom_tool_call` named `exec`. Its input is a
  JavaScript program that calls `tools.exec_command`, so one program can make any number of calls.
  The output, with its own nested exit code, is in the matching `custom_tool_call_output`.
  - The owner's model ran this way. That is `gpt-6-sol` at effort `xhigh`, in threads `01a0cfc3`,
    `01a0cfc4` and `01a0cfd6` (19:34Z to 19:55Z) and `01a0d039` (21:44Z).
  - So did the CLI's default model, `gpt-6-astra` with no effort set, under `--ignore-user-config`
    without pins (thread `01a0cfaf`, 19:12Z).
  - The event stream's `command_execution` item appeared in three of the five threads (`01a0cfc3`,
    `01a0cfc4` and `01a0cfd6`), and not in the other two.
- **A recorded exit is not a write verdict.**
  - In `01a0cfc3`, the probe line's code-mode output carried a nested `exit_code` of 0. In the same
    output record it printed `zsh:1: operation not permitted` for the sentinel, then the nonce,
    then the environment names.
  - In `01a0cfaf`, a line that only wrote exited 1 with the same denial.
  - The denial came from `zsh`, in lower case.
- **Code mode cannot be turned off.** With `--disable code_mode_host` (thread `01a0d039`), both of
  the model's tool calls returned "code-mode host is disabled", and the model could run nothing.
- **`codex sandbox` tests the sandbox with no model** (21:57Z; an empty `CODEX_HOME`, a fake `HOME`
  and an empty root; no thread started).
  - It requires `--permission-profile <NAME>`. The built-in names are `:read-only`, `:workspace`,
    `:minimal` and `:protocol`.
  - Under `:read-only`, `printf SIF > <root>/<sentinel>` exited 1 with "Operation not permitted" and
    left no sentinel.
  - Under `:workspace` the same write succeeded, and so did a write under the system temporary
    directory.
- **The policy a turn recorded can be run directly.**
  - `--sandbox-state-json` takes the camelCase `SandboxState` that
    `codex-rs/cli/src/debug_sandbox.rs` reads at 0.156.1: `permissionProfile`,
    `codexLinuxSandboxExe`, `sandboxCwd` and `useLegacyLandlock`.
  - A raw `permission_profile` object is refused.
  - `sandboxCwd` is a file URI, and it sets the working directory. `-C` beside
    `--sandbox-state-json` exits 2.
  - Source read and parser runs by Forge herds Vapor.
- **From inside another sandbox, `codex sandbox` cannot apply one.** Forge herds Vapor's process
  runs under the macOS sandbox. From there, the run exited 71 (`sandbox_apply: Operation not
  permitted`) without starting the shell.
- **The recorded policy refuses the write, with no model** (about 11:00Z, from this Claude seat,
  outside the macOS sandbox).
  - The state was `{"permissionProfile": <profile>, "sandboxCwd": "file://<root>"}`. The profile was
    copied from thread `01a0cfc3`'s `turn_context`: managed, file-system `read` on the root path
    `/`, network `restricted`.
  - The call was `codex sandbox --sandbox-state-json <state> -- /bin/sh -c <probe line>`, from the
    resolved real path. `codex sandbox` runs its command's arguments as given, so the shell is
    named.
  - The run took an `env -i` allowlist with an empty `CODEX_HOME`.
  - The two-branch probe line printed `/bin/sh: …: Operation not permitted`, then the nonce once
    and no `WRITE-OK`. The root stayed empty, and the whole line exited 0.
  - Under `--permission-profile :workspace` as the control, the sentinel was written, `WRITE-OK`
    printed and no nonce came back.
  - The shell's environment names were `CODEX_SANDBOX`, `CODEX_SANDBOX_NETWORK_DISABLED`,
    `CODEX_HOME`, `TMPDIR`, `USER`, `__CF_USER_TEXT_ENCODING`, `PATH`, `PWD`, `LANG`, `SHLVL`,
    `HOME`, `LOGNAME` and `_`.
  - A process-table read afterwards found no `codex sandbox` or `sandbox-exec` process.

### 2.10 Queue probe addendum (Titan turns Ether, 2026-09-25 11:17Z to 12:59Z)

The queue evidence below is one local run of the TUI client in a `tmux`
pseudo-terminal, with `--no-daemon`.
It does **not** establish behaviour with the managed app-server used by a live CLI seat. The
installed `codex 0.157.0` matched the latest official release at the start of the run
([`rust-v0.157.0`](https://github.com/openai/codex/releases/tag/rust-v0.157.0)).
The disposable, mode-0700 `CODEX_HOME` held a symlink to the
owner's existing `auth.json`: these sessions ran using the owner's own Codex login. No
credential bytes were copied into this record. In that home, `codex --disable plugins mcp
list --json` returned `[]`. The work directory was a separate empty scratch directory.

The launch shape was `CODEX_HOME=<probe-home> script -q <tui-log> codex --no-daemon
--disable plugins --no-alt-screen -C <scratch> -s read-only -a never -c
'projects={ "<scratch>" = { trust_level = "trusted" } }' <fixed prompt>`, inside `tmux`.
Every queue call used the same home, `--disable plugins --thread <thread-id> -s
read-only --message <fixed notice>`. The thread was
`01a0d848-ee61-7871-bd83-15badd16c0d5`. Its untracked rollout supplied the UTC
event times below and was removed with the disposable home after extraction. Queue
calls reported acceptance with a message id, not delivery.

Observed boundaries, using UTC on 2026-09-25:

- **Idle.** Queue accepted message `01a0d849-e1c1-7cb3-b6a4-e2d1b90880e9` at about
  11:18:31. A separate turn started 11:18:42.620 and completed 11:18:44.464 with
  `WAKE-TUI-1`. The idle TUI woke without a manually submitted prompt.
- **Typed draft at idle.** The unsent `TYPED-TUI-2` draft was visible when queue
  accepted `01a0d84a-a2dd-7fa3-9767-624dca194ccb` at about 11:19:25. Return was
  then sent. The typed turn ran 11:19:25.252–11:19:27.448 (`TYPED-OK-2`); the queued
  turn ran 11:19:27.459–11:19:29.470 (`QUEUED-OK-2`). Both messages ran as separate
  turns, typed first. This does not prove priority for every race timing.
- **Active reply.** An active turn was confirmed started at 11:20:34.668. Queue
  accepted `01a0d84b-eb4a-7db0-8042-18a7e62c74f0` at about 11:20:48–49. The
  active turn completed 11:21:08.419; the queued turn began 11:21:08.422 and completed
  11:21:12.458 with `ACTIVE-QUEUE-OK-4`. The notice waited and then started its own
  turn. An earlier attempt had insufficient queue/start ordering evidence.
- **Killed process.** The probe's Codex PID was killed at 11:21:55; its child was absent
  at the first process audit. Queue accepted `01a0d84d-52ee-7d62-a588-765450666c2c`
  at 11:22:21. No new rollout turn appeared while the process was dead. After explicit
  read-only resume, a turn began 11:23:28.655 and completed 11:23:32.591 with
  `KILLED-QUEUE-OK-5`. The notice survived this killed-process gap and ran on resume.
  No continuous process trace was recorded; this one run is not a persistence guarantee.

**Retained event projection.** Before the disposable rollout was deleted, this seat
extracted every `task_started` and `task_complete` row for the thread above. The
contemporaneous tool output survives in this seat's Codex session
`01a0d829-572f-7572-9731-1552a220eb3f`; its redacted projection is retained here.
Each row keeps the source UTC timestamp and task id. Completion text is reduced to its
fixed reply marker; paths, prompt bodies, auth material and other event types are omitted.
The raw rollout and its hash were not retained, so this projection cannot support a
claim about any omitted field. The `codex queue` command outputs recorded acceptance
for this same thread at about 11:18:31Z (`01a0d849-e1c1-7cb3-b6a4-e2d1b90880e9`),
11:19:25Z (`01a0d84a-a2dd-7fa3-9767-624dca194ccb`), 11:20:48–49Z
(`01a0d84b-eb4a-7db0-8042-18a7e62c74f0`) and 11:22:21Z
(`01a0d84d-52ee-7d62-a588-765450666c2c`). The kill command returned 0 at
11:21:55Z. The projection shows all task boundaries from launch through explicit
resume, including the absence of a task between 11:21:12.458Z and 11:23:28.655Z.

```text
UTC timestamp                 event          task id                               reply marker
2026-09-25T11:17:33.461Z      task_started   01a0d848-ee88-7c20-a610-cb82d706c475  —
2026-09-25T11:17:49.380Z      task_complete  01a0d848-ee88-7c20-a610-cb82d706c475  READY-TUI-1
2026-09-25T11:18:42.620Z      task_started   01a0d849-fca8-7c83-895a-5a92d9afc36a  —
2026-09-25T11:18:44.464Z      task_complete  01a0d849-fca8-7c83-895a-5a92d9afc36a  WAKE-TUI-1
2026-09-25T11:19:25.252Z      task_started   01a0d84a-a331-7ce0-8024-a33df66cb6cd  —
2026-09-25T11:19:27.448Z      task_complete  01a0d84a-a331-7ce0-8024-a33df66cb6cd  TYPED-OK-2
2026-09-25T11:19:27.459Z      task_started   01a0d84a-abdb-7822-96bc-241a72119574  —
2026-09-25T11:19:29.470Z      task_complete  01a0d84a-abdb-7822-96bc-241a72119574  QUEUED-OK-2
2026-09-25T11:20:04.005Z      task_started   01a0d84b-3a46-72c1-8f92-7ece077f22cf  —
2026-09-25T11:20:18.509Z      task_complete  01a0d84b-3a46-72c1-8f92-7ece077f22cf  ACTIVE-START-3
2026-09-25T11:20:18.513Z      task_started   01a0d84b-734f-7ac3-b322-803c0058b222  —
2026-09-25T11:20:22.199Z      task_complete  01a0d84b-734f-7ac3-b322-803c0058b222  ACTIVE-QUEUE-OK-3
2026-09-25T11:20:34.668Z      task_started   01a0d84b-b261-75a3-ae48-22538cf9592c  —
2026-09-25T11:21:08.419Z      task_complete  01a0d84b-b261-75a3-ae48-22538cf9592c  ACTIVE-START-4
2026-09-25T11:21:08.422Z      task_started   01a0d84c-3644-7073-b8ec-22dfbdf3f4fa  —
2026-09-25T11:21:12.458Z      task_complete  01a0d84c-3644-7073-b8ec-22dfbdf3f4fa  ACTIVE-QUEUE-OK-4
2026-09-25T11:23:28.655Z      task_started   01a0d84e-5a0d-7a83-9be1-244190eae296  —
2026-09-25T11:23:32.591Z      task_complete  01a0d84e-5a0d-7a83-9be1-244190eae296  KILLED-QUEUE-OK-5
```

**Design inference, not a probe observation:** queue acceptance while the target was dead
does not mean the target was woken. A watcher that marked events seen on queue success
could therefore miss a wake if it outlived its target. Swallow holds Drift's pairing
note of 11:35:36Z says the current watcher runs under the seat's supervisor, so a
killed seat would stop that watcher too. This run does not establish a bridge defect
or prove the later acceptance criterion that a failed wake loses no event.

The initial TUI environment-presence request produced no boolean result: its nested local
shell failed with `sandbox-exec: sandbox_apply: Operation not permitted`. A separate
read-only TUI attempt outside that outer sandbox stayed on its startup screen, created no
rollout, and was terminated. Therefore `CODEX_THREAD_ID` and
`PRACTICE_AGENT_SESSION_ID_CODEX` presence and equality remain **unobserved** here.
The resumed TUI exited; the stalled retry received SIGTERM. A final process-name audit
showed only the pre-existing `codex` and `codex-code-mode-host` processes. The child of
the killed TUI was not present at the first post-kill audit; its continuous lifetime was
not measured. The disposable home and its auth symlink were then removed without
following the link.

**Scope correction and active-seat shell.** At about 11:40Z on 2026-09-25, the owner told
the Director, "why do we need the ChatGPT desktop host? My interest is Codex CLI", and
corrected the premise about the two seats: "nope! They were both started via the terminal
with `codex`". These owner words reached this note through the Director's relay to
Swallow holds Drift, recorded in the pairing channel at 11:43:41Z. At about 11:43Z,
Swallow read this seat's process parentage first-hand from the process table: its managed
app-server was spawned by a `codex` TUI, under a shell in the editor's terminal host.
The desktop host is outside the corrected todo 1. In this active seat's tool shell, a
presence-only check
found `CODEX_THREAD_ID` set and `PRACTICE_AGENT_SESSION_ID_CODEX` absent; both-present-and-equal
was false. No identifier value was printed. This is the tool-shell environment of the
editor-terminal seat, not a reading of the disposable TUI process's environment.

**Managed-daemon startup gap.** A second disposable home used the same owner login, an empty
scratch directory, read-only sandbox and approval `never`. Its first TUI launch omitted
`--no-daemon` but kept `-c` and `--disable`; the TUI warned that CLI configuration overrides
force embedded mode, so no daemon-mode queue call was made. After closing it, the settings
were placed in the disposable config file. Readback showed plugins disabled and no MCP
servers. A new launch without CLI configuration overrides tried to install the managed
daemon, then exited before a rollout: its `ps` call to record the daemon PID was denied
with `Operation not permitted` by the outer host sandbox. No daemon socket existed. The
named daemon PID was absent on audit, and only pre-existing Codex processes remained.
The disposable home and its auth symlink were removed without following the link. This
is a startup limitation, **not** a negative result for `codex queue` in daemon mode.

**Second seat's managed-daemon attempt.** Swallow holds Drift reported one run in the
pairing channel at 12:26:16Z. This account is attributed to that seat's process and log
inspection, not a first-hand observation by Titan. Swallow used CLI 0.157.0 from a shell
outside a Codex sandbox. A disposable mode-0700 `CODEX_HOME` linked to the owner's own
`auth.json`; its config set read-only sandbox, approval `never`, plugins off, update check
off, and trust for an empty scratch directory. Its MCP list was `[]`. At 12:24:40Z,
Swallow launched `cd <scratch> && CODEX_HOME=<probe-home> codex --no-alt-screen
'<fixed READY-D1 prompt>'` in `tmux`, without command-line configuration overrides.

At 12:24:43Z, the managed daemon started, re-parented to PID 1, and created its control
socket and PID file. Its log showed config loading and a model-list request with auth
attached; its stderr log was empty. The TUI exited within about 25 seconds, before
12:25:08Z, with no rollout or thread id. The pane closed before its exit message was
captured, so the cause is unknown. No queue call or wake leg ran. Swallow stopped under
the one-launch protocol, made no repair or retry, and audited the process set: after a
second SIGKILL took effect on the probe daemon, no probe processes remained and all six
pre-existing `codex` processes remained. The auth symlink was unlinked without touching
the owner's mode-0600 auth file. The remaining disposable home and logs stayed in that
seat's scratch directory; no credential bytes were copied into this note.

**Captured one-launch follow-up.** At the Director's 12:49:18Z route, Titan made one
more isolated attempt, starting at 12:56:28Z. A fresh mode-0700 home linked to the
owner's own `auth.json`; its checked config set read-only sandbox, approval `never`,
plugins off and scratch trust. Its MCP list was `[]`. The launch in the empty scratch
directory used `CODEX_HOME=<probe-home> script -q <capture-log> codex --no-alt-screen
'<fixed READY-D2 prompt>'`, without command-line configuration overrides. This host
launch was elevated so the daemon's startup `ps` call could run; the Codex session's
sandbox and approval settings remained read-only and `never`.

The raw TUI capture remains in this local instance at
`.agent/state/collaboration/_tmp-codex-queue-probe-2026-09-25-01a0d8/tui-capture.log`;
it is not part of this PR. It has 3,239 bytes and SHA-256
`4492fcba82f8f7dd83c471177c34df7f9d0f5b0cd7d2f263282a2ce1572ae05b`
(recomputed by Gale turns Cloud and independently confirmed by Swallow holds Drift in
the pairing channel at 15:06:17Z on 2026-09-25). The run spanned the 12:56:28Z launch
to Titan's Ctrl-C at 12:59:01Z on CLI 0.157.0; its command shape was
`CODEX_HOME=<probe-home> script -q <capture-log> codex --no-alt-screen
'<fixed READY-D2 prompt>'`. Its ANSI-stripped projection is `OpenAI Codex (v0.157.0)`,
`Installing daemon from CLI version 0.157.0 into
<probe-home>/packages/app-server-daemon...`, then `Shutting down...` after Ctrl-C.
No exit error appears in the captured output. Titan's contemporaneous process and file
inspection separately recorded a daemon PID file and two new app-server processes, but
no control socket,
rollout or thread id. The TUI remained at the loading screen for about two minutes.
No queue call was possible or made. Both daemon stderr files were empty. This is a
startup stall in one captured run, not a queue result.

Ctrl-C closed the TUI and capture process. SIGTERM ended one daemon process; the other
required SIGKILL. The final process audit found none of the four probe processes and
all six pre-existing `codex` processes. Titan unlinked only the auth symlink and
verified the owner's auth file remained present, mode 0600. No auth bytes were copied
into this note. The capture contains terminal control bytes and local paths, so the
file and process observations above are a prose projection, not a publicly replayable
transcript. The hash identifies the local capture for a reader who has that file; it
does not independently prove the process observations or the cause of the stall.

The first launch's `ps` denial did not recur in Swallow's shell or in Titan's elevated
captured launch. Neither later launch reached a queue call, for different startup
reasons, so managed-daemon queue behaviour remains unobserved.

The ratified [wake-bridge plan at `f8816970e`](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/f8816970ecb9f04833b85d60095e1b9cee21d8a9/.agent/plans/delivery/codex-queue-wake-bridge.plan.md#L123-L125)
is reachable on the coordination branch and states the corrected host-wake criterion.
Its todo 1 names the CLI TUI with its managed app-server and `codex exec`. No managed-daemon
queue behaviour or new `codex exec` queue probe was observed in this addendum. The
no-daemon TUI run therefore does not satisfy the criterion that the seat's own host wakes.

### 2.11 codex-cli 0.157.0, for slice 1b-iv (2026-09-25)

Swallow holds Drift (516619), with the pre-execution code-expert review and an assumptions-expert
review of slice 1b-iv. The source reads are of the 0.157.0 release's `codex-rs` tree.

- **Feature defaults move at each release.** `codex features list`, run with no configuration,
  enabled five features on 0.156.1 that were off on 0.153.4, and turned two off. On 0.157.0 two
  more were enabled, `daemon_auto_start` and `guardianv2.thread_context`.
- **`memories` is off by vendor default** on 0.156.1 and 0.157.0 (`features/src/lib.rs`). It is
  on in the owner's configuration. `shell_snapshot` and `multi_agent` are stable and on.
- **A misspelt `-c` key is accepted without a word,** unless `--strict-config` is given.
- **`--enable` and `--disable` reach every subcommand.** `cli_main` folds them into the root
  configuration overrides before dispatch, so `exec` and `features list` apply the same flags.
  An unknown name is refused ("Unknown feature flag"), with or without `--strict-config`. A
  legacy name, or the name of a removed feature, is accepted (`cli/src/main.rs`,
  `FeatureToggles::to_overrides` and its tests).
- **`features list` prints every feature the CLI defines,** with its stage and its effective state
  under the loaded configuration, which includes `$CODEX_HOME/config.toml`. A removed feature can
  be listed as enabled: `item_ids` is listed `removed` and `true`.
- **A first run fills an empty Codex home.** One logged-out `codex exec` into an empty home, whose
  flags were not recorded, left:
  - six vendor system skills under `skills/.system/`: imagegen, openai-docs, plugin-creator,
    review-agent, skill-creator and skill-installer;
  - a memories database holding no jobs and no outputs;
  - an empty `shell_snapshots/` directory.

  Its one request to the API was refused as unauthenticated (401), so no model turn ran, and no
  process was left running.
- **`apply_patch` is refused before any process.** Under approval `never`, the pinned model is
  offered `apply_patch` through code mode, and Codex refuses it in a policy check that leaves no
  harness record.

## 3. The participation record

- **Claims.** The claims archive holds 378 Codex claims out of 1,709: July 331, August 46,
  September 1. The last was Phoenix tracks Lustre, 2026-09-09. Recomputed from
  `.agent/state/collaboration/closed-claims.archive.json` by `agent_id.platform`.
- **Comms.** At a count taken about 13:20Z on 2026-09-23, there were 1,191 Codex-authored events
  (833 of them heartbeats) from 25 seats, the last at 2026-08-12T05:05:47Z. Recomputed over
  `comms/` and `comms-archive/` by the author's `platform`; the stream is retained from 2026-07-28.
  A Codex seat, Badger seeks Hush (01a0ce), joined at 13:32Z the same day, after this count.
- **Since mid-August**, Codex reaches this estate almost only as the GitHub PR-review connector.
  Its findings hold up: on #77 all fourteen were real and cured
  (`.agent/memory/active/archive/napkin-2026-09-10.md`). It has repeatedly run out of credit:
  - 2026-09-10 to about 09-16 (`pr-lifecycle`);
  - 2026-09-21, the limit lifted at 12:20Z and was back at 13:39Z (the three-estate exchange
    channel);
  - 2026-09-23, from 11:15:42Z to about 13:03Z (comms events `ac698fc9` and the 13:04:46Z
    broadcast).
- **Tool usage.** The skill usage census of 2026-09-03 records `codex-helper` as never invoked
  under the `oak-` prefix. The dialogues trial closed 4 dialogues, all between 08-02 and 08-06,
  with 3 closing `position-changed` (`the-codex-dialogues-trial-tally-2026-08.md`).

## 4. State of the estate's Codex surfaces (2026-09-23)

- **The dialogue trial.**
  - The trial window ended 2026-08-16. Its close-out was never run:
    `~/.codex/sif-dialogue-cleanup-map.jsonl` still holds 4 rows, last modified 2026-08-06.
  - The probe pins 0.146.1 (`references/probe-record.md`).
  - The local `.mcp.json` names the server `codex-dialogues`, while the tracked template and
    check 1 expect `codex`.
  - The stdio binding itself is now gone (§2.2).
- **Version binding of evidence.** Sif's version gate (plank 2) binds a binding's evidence to the
  version its probe tested. Its dialogue-open check re-runs the probe in candidate mode against
  the installed upgrade; it never requires installing an old version. The owner's ruling (§1)
  settles runtime currency: use the latest. It does not by itself remove the rule that
  unverified behaviour cannot open a dialogue. The break today is that the latest CLI fails the
  candidate probe (§2.2). Badger seeks Hush drew this distinction in review.
- **How rules reach a Codex seat.** Upstream `codex-rs/core/src/agents_md.rs` orders
  `AGENTS.override.md`, then `AGENTS.md`, then the configured fallbacks, and takes the first file
  found in each directory. This repository has a root `AGENTS.md`, so `RULES_INDEX.md` never loads
  through `project_doc_fallback_filenames`. It reaches a Codex seat only because `AGENTS.md` links
  it and says to read it. This is a source reading of upstream `main` by Badger seeks Hush, not a
  runtime probe of 0.156.1.
- **`codex-helper`** carries `-m "codex-auto"` (unverified), names `mcp__codex__codex`, and writes
  `/oak-start-right-quick` where Codex takes `$oak-...`. Its grounded template has the invoked
  Codex run start-right, whose foundation registers an identity and a claim before the first
  edit. That contradicts Sif's rule that an invoked Codex "never registers identity, opens
  claims" (`sif/SKILL-CANONICAL.md`, "Instrument, not citizen"). The template's commit guidance
  is conditional: it sets the footer for any commit the agent makes, and requires none.
- **Cricket.** The Claude panel is four Claude roles and the Codex panel runs only on Codex hosts
  (`cricket/SKILL-CANONICAL.md`). Sif's cell map files "Cricket Codex legs" as cross-vendor one-shot,
  but from a Claude seat Cricket is same-vendor only.
- **ADR-180** says the `run` subcommand is deferred and later refers to "the current `run`
  subcommand". `agent-tools/src/codex-exec/` holds only `last-message`.
- **Guards on Codex seats.** Codex seats run the SessionStart identity hook only, with no
  `PreToolUse` guard (`.codex/config.toml`). The Codex entry in `.agent/hooks/policy.json` carries
  `review_by: 2026-08-24`, now past.
- **Heartbeats.** `liveness-heartbeat-cron.md` names no mechanism for Codex ("the equivalent
  background-task mechanism").
- **Citizenship.** `agent-platform-citizenship` (ratified 2026-08-01) has Copilot CLI as its worked
  instance, with four delivery plans. Codex membership is described only as "live practice".
- **Unbuilt.** `harness-capability-observability` (MCP-456, ratified 2026-08-01) has no
  implementation in `agent-tools`.
- **The review leg that graduated.** On 2026-09-07 the Codex GitHub connector graduated as a review
  leg. The leg the owner rated "high value" on 08-09 was a local dialogue-based leg, which has not
  graduated.

## 5. Synthesis

### Frame

The owner gives one reason for Codex in both modes: a different way of thinking. It reaches the
estate by three routes:

- membership (a Codex seat);
- invocation (Sif tools called from a Claude seat);
- the vendor's PR connector, which Sif's map omits.

Today it arrives almost only through the connector. That route is automatic, but its credits run
out. Codex membership declined after mid-August (§3), and idle wake was its measured obstacle;
why the seats stopped is still open (§6). The invoked tools were unused and then broken.

### Assumptions this changed

1. **One value, several routes.** The question "how do we support Codex" is better asked per job
   (a second opinion, a review, a bounded lane) than per mode. Sif's line between a called tool
   and a team member still holds for authority and records.
2. **First-class means fitting a role, not copying Claude's mechanisms.** Seat support rebuilt
   Claude's machinery for Codex, and it broke exactly where Codex lacked a native primitive: idle
   wake. §2.4 shows the latest CLI has one. That answers the obstacle behind the July
   missed-message failures ("you have new messages, it does not seem like your watcher is alerting
   you"). Whether that obstacle explains the later decline is open.
3. **Currency: run the latest, verify it at the point of use.** The version gates made the tools
   fail safe: they stopped rather than lie. But nothing noticed they had stopped. The owner's ruling
   fixes the runtime to the latest; evidence stays bound to the version it was probed on. The shape
   that fits both is an automatic re-probe against the installed latest at the point of use, which
   keeps the rule that unverified behaviour does not run.
4. **Automatic routes survive; optional tools decay.** The connector is wired into the merge door
   and stayed in use. The optional tools fell to nothing. This matches the estate's pattern
   `passive-guidance-loses-to-artefact-gravity`.

### Proposals (warrant; what would prove it wrong)

1. **Rebind the dialogues to `codex exec` plus `exec resume`, and drop the MCP binding and its
   pin.**
   - *Warrant:* §2.2 and §2.3. This is the tool with the strongest value evidence.
   - *Wrong if:* resumed threads do not keep read-only authority from the `-c` settings across
     releases, which re-probing at the point of use would show.
2. **Run the trial close-out the plan committed to.**
   - Report the tally, compare against the Claude Cricket runs of 08-02 to 08-16, extract what
     the four rollouts teach, then delete them and the cleanup map.
   - *Warrant:* the ratified decision rule, and the data contract's retention clause.
   - *Wrong if:* the comparison cannot be evaluated at four dialogues. It then reports exactly
     that.
3. **Design a wake bridge from the canonical comms watcher to `codex queue`.** §2.4 is evidence
   that a wake is possible. It is not yet a safe event bridge.
   - The queued text arrives as a user-role message. The idle-wake plan, a sketch deferred since
     2026-08-01 and so not ratified authority, names peer-authored event text reaching user-role
     input as a design hazard, and sets as its proposed acceptance bar that it never does
     (`codex-app-server-idle-wake.plan.md`, §Mechanism and §Acceptance). Meeting that bar would
     mean queueing only a fixed, controller-authored notice carrying no event bytes, with the woken
     seat reading the event through its own canonical comms read.
   - *Warrant:* §2.4, and the owner's goal of 2026-07-31.
   - *Wrong if:* a queued notice overrides a user's typing at an idle boundary (untested). The
     active-turn and exited-session runs in §2.7 held once each: a notice waited behind a running
     turn, and one survived a single clean exit. That is not yet a persistence contract. Recovery
     designed around it needs the untested exit modes probed first. Badger seeks Hush raised the
     trust qualification in review.
4. **Once proposal 2 has reported, decide whether Claude's Cricket panel gains one Codex leg**
   (`codex exec --output-schema`, read-only, ephemeral).
   - *Warrant:* assumption 4, so the different view rides the challenge tool seats already use.
   - *Wrong if:* the comparison fails, or connector-style credit outages leave the leg
     undelivered most of the time.
5. **Automate the candidate re-probe against the installed latest at the point of use.** Keep the
   rule that unverified behaviour cannot open a dialogue, so the evidence record follows the
   runtime instead of gating on a remembered version.
   - *Warrant:* the owner's ruling (§1), and the version-binding distinction (§4).
   - *Wrong if:* a silent vendor change passes the re-probe and harms a dialogue.
6. **At `codex-helper`'s migration to Sif, which is already scheduled, settle custody.** One
   candidate model is that an invoked Codex does not claim or commit, and its output is a patch
   that the invoking seat lands.
   - *Warrant:* the conflict recorded in §4. `codex-helper`'s grounded template has the invoked
     Codex run start-right, which registers an identity and a claim, while Sif says an invoked
     Codex "never registers identity, opens claims"; one of the two has to give way. The
     template's commit guidance is conditional, so commit custody is unsettled rather than
     contradicted.
   - *Wrong if:* the owner wants invoked Codex implementers that commit. That would need an
     authority ruling before either model is adopted.
7. **Give Codex membership a worked citizenship programme** following the Copilot CLI instance:
   success criteria plus a live acceptance seat.
   - *Warrant:* the node's own bet: "First-class citizenship is behavioural".
   - *Wrong if:* the owner does not want Codex seats in this estate.

## 6. Open questions

- Why Codex seats stopped after mid-August: owner choice, credits, a move to other repositories,
  or the cost of supervision.
- Whether CLI use shares the connector's credit pool. This decides proposal 4's reliability, and
  whether `codex review --base <branch>`, posted on the PR, could stand as a leg during connector
  outages (the 2026-09-10 ruling allows posted subagent reviews).
- Whether a user's typing takes priority over a queued `codex queue` message at an idle boundary,
  and how the queue behaves across machines.
- The failure record on Codex seats (over-investigating, ceremony) was gathered by selecting for
  Codex. It does not show those failures are specific to the vendor. Idle wake is the one failure
  measured as Codex-specific.

## 7. Housekeeping seen, not acted on

- Future-stub copies of the completed Codex identity plan remain in `plans-backlog-2026-07/` and
  the frozen-v1 snapshot.
- The retired hook experiment's thread record is still under `threads/paused/`.
- The research note on Codex hook review links an archive path that exists only in git history.
- `codex-mcp-server-compatibility.plan.md` predates the Codex desktop app connecting to the
  production Oak MCP server on 2026-09-07.
