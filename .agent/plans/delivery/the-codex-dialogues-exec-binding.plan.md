---
id: the-codex-dialogues-exec-binding
node_type: delivery
name: "The Codex dialogues on codex exec — an enforced call envelope, evidence that follows the runtime"
overview: "Rebinds the Codex dialogues from the removed codex mcp-server onto codex exec and codex exec resume through two agent-tools commands, dialogue-turn and dialogue-probe. Every limit on the interlocutor is set in tested code rather than in skill discipline, and a dialogue opens only on a Codex executable this machine has probed with the current envelope."
status: ratified
ratified_by: Jim Cresswell (owner)
ratified_date: 2026-09-23
ratified_where: "The owner's decision card, relayed by the Director (Wick binds Temper, ed7b48) at about 19:55Z on 2026-09-23 and quoted in the body of PR 184: the node ratified; decision 1, 'carry the two keys, yes'; decision 2, verbatim 'Record the version tested, but we always run against latest'; decision 3, a dedicated Codex home, decided yes by the Director at about 20:03Z under the owner's delegation"
serves: agent-platform-citizenship
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-25
---

# The Codex dialogues on codex exec — an enforced call envelope, evidence that follows the runtime

## Goal

A Claude seat can again hold a bounded, read-only, multi-turn dialogue with a Codex interlocutor
on the latest Codex CLI.

- **One command per turn.** Each turn is a single command. There is no MCP registration and no
  session restart.
- **Limits in code.** Every limit on what the interlocutor can do is set in tested code, not in
  skill prose.
- **Evidence follows the runtime.** A dialogue opens only on a Codex executable this machine has
  probed with the current envelope. No version is pinned in the repository.

The dialogues' binding is broken today. The CLI no longer has an `mcp-server` subcommand, so the
registered launch cannot start.

## User groups and value

- **Claude seats that want a cross-vendor second opinion.** They get the instrument back.
  - In the trial, three of four dialogues closed with the seat's position changed (the trial
    tally).
  - The instrument has been unusable since the CLI dropped the binding.
- **The owner.**
  - The interlocutor's authority becomes what the doctrine says it is. The code enforces it, and
    after every CLI update a probe re-tests its write boundary and its shell's environment, and
    checks the rest of its policy by the harness's record.
  - There is no tracked version pin to re-ratify, which honours the ruling: "we will not pin
    versions, we use latest".

## Problem, and what the evidence changed

The old binding held the interlocutor's authority in two places:

- the registration's launch pins: read-only sandbox, approval `never`;
- a skill rule: never pass a per-call authority parameter.

The dated research note (§2.3 and §2.8) records five facts, measured on the current CLI, that
show this was never the whole envelope.

1. **User configuration reaches past the sandbox.** A `codex exec` call with those pins still
   loads the user's Codex configuration: plugins, MCP servers, marketplace sync and exec-policy
   rules.
   - With the configuration loaded, one read-only call spawned a computer-use REPL, a
     `node_repl` MCP server and a network `git clone` of a plugin marketplace.
   - With `--ignore-user-config`, no child process appeared in any once-per-second sample of the
     same call.
   - The user's rules file holds seven `decision = "allow"` prefix rules, among them
     `pnpm agent-tools:collaboration-state`, `git switch` and `pnpm install`. The vendor documents
     that an allowed command runs outside the sandbox.
   - The sandbox governs the model's shell. It does not govern those extensions, and under
     approval `never` they are live tools of the interlocutor. This rests on one run per arm.
2. **The same flag also changes the model.** With the user configuration, the call ran the
   owner's configured model at `xhigh` effort. Without it, the call ran the CLI's default model at
   default effort. The trial's results were earned on the configured model. Model and effort
   come from each run's rollout `turn_context`.
3. **Default-on features still reach the owner's state and secrets.** The shell snapshot is
   stable and on by default, so `--ignore-user-config` alone leaves it on. Codex memories is off
   by vendor default on 0.156.1 and 0.157.0, but on in the owner's configuration. The envelope
   disables both, whatever the defaults.
   - **The shell snapshot.** It replays the owner's interactive shell environment into every
     command. That shell environment includes tokens exported in `~/.zshrc`.
     - The interlocutor's shell listed `GITHUB_PERSONAL_ACCESS_TOKEN` and `GITHUB_MCP_TOKEN`
       among its variable names. That happened even with the child's environment reduced to an
       allowlist and `shell_environment_policy.inherit="core"`.
     - With `--disable shell_snapshot` and `allow_login_shell=false` added, the shell ran
       non-login and held only core variables.
   - **Codex memories.** They draw on the owner's Codex memory store.
4. **The resume leg restates nothing by itself.**
   - `codex exec resume` lists no `--sandbox` or `--cd` option.
   - The vendor documents that on its SDK and App Server, per-turn overrides carry forward to
     later turns of a thread.
   - So the envelope restates every setting on every turn, and spawns the resume from the same
     working directory.
5. **The harness writes its own record of the effective policy.** Each turn's rollout
   `turn_context` records the model, effort, approval policy, sandbox, working directory and
   permission profile. Under the envelope that profile was file-system `read` on `/` and network
   `restricted`. The event stream sometimes carries a `command_execution` item with the exact
   command and exit code, and sometimes does not: the code-mode path emitted none here, and
   research note §2.9 later found it in three of five code-mode threads.

Two direct trials of the envelope passed on the same CLI.

- Open, then resume, from one empty directory.
- The thread id round-tripped, and turn one was recalled.
- The harness recorded the refused write. The model's own report of the refusal counts as
  corroboration only.
- The nonce came back on the failure branch.
- The sentinel was absent afterwards, and the directory was still empty.

The calling seat already holds full user authority (the estate's same-UID trust ruling). So this
is not a boundary against the seat. The envelope bounds what the interlocutor does on its own
initiative inside a reflective dialogue: it writes nothing, loads no extension the configuration
would add, reaches no network from its shell, and loads none of the owner's state beyond the
model choice. It does not bound reads (see Honest limits).

## Build-vs-buy

The vendor documents three ways to drive Codex programmatically.

- **The TypeScript SDK** wraps `codex exec` over JSONL. Not chosen.
  - No SDK option emits `--ignore-user-config`, the flag fact 1 makes load-bearing.
  - It copies the parent environment wholesale.
  - It declares an exact-version dependency on its own CLI package. `codexPathOverride` can run
    the installed CLI instead, but the dependency would still enter the lockfile.
  - Its published event types remain the reference for the JSONL shape the parser reads.
- **App Server** is the vendor's documented migration target for integrations built on the
  removed MCP server. Not chosen.
  - It is a long-lived JSON-RPC client protocol, and the vendor documents its command and
    WebSocket transport as experimental and unsupported for production.
  - A seat's turns arrive as separate tool calls, so a daemon would add lifecycle machinery for
    no gain.
- **`codex exec` and `codex exec resume`** are the documented scripting surface, and they fit one
  turn per call. Chosen.

Falsifier: re-evaluate if the SDK gains control of the flags and environment above.

## Mechanism

### The commands

Two subcommands join the existing `agent-tools` `codex-exec` topic. ADR-180 is amended in slice 1a
for the scope change. Arguments are parsed strictly: any unknown option, `--model` included, is a
usage error, exit 2.

**`dialogue-turn --prompt-file <path> [--dialogue-id <id>] [--thread <uuid>]
[--timeout-seconds <n>]`** runs one turn.

- It takes exactly one of `--dialogue-id` (open a thread) and `--thread` (resume one).
- **Validation.** Each input is checked before anything runs.
  - `--thread` accepts only a UUID, any version, v7 included. The resume subcommand also accepts
    thread names, so an unvalidated value could inject an option into its argv. The thread id
    from `thread.started` is validated the same way.
  - `--dialogue-id` must match a fixed slug pattern.
  - `--timeout-seconds` is an integer within fixed bounds.
  - The prompt file must be a regular file under a size cap, in strict UTF-8. It is read once and
    sent on stdin.
- On open, it appends one row to the dialogues' local cleanup map for each thread the turn's
  output names: `{dialogue_id, thread_id, created_at}`. The rows are written whatever the
  verdict, so a failed or killed open still leaves its rows. `created_at` is when the turn
  started, read before the spawn. The row is serialised with `JSON.stringify`, appended only,
  and the file is kept at mode 0600. A resume writes no row, because in codex-cli 0.156.1 a
  resume by thread id never creates a thread (Honest limits names what that premise leaves).
- It prints one JSON line, `{"threadId","message","messages"}`, and exits 0. `message` is the last
  agent message; `messages` lists every agent message, for the record. Both are the
  interlocutor's words, so the seat treats them as untrusted input.
- It exits 1 on any of these:
  - no thread id;
  - a resumed thread id that does not match;
  - no agent message;
  - a top-level `turn.failed` or `error` event;
  - a non-zero Codex exit;
  - a timeout;
  - output over the buffer limit.

  An `error` item inside a turn is non-fatal.
- It exits 3, with the probe instruction and without starting a turn, when no pass record
  inside its seven-day age limit matches the current binding: the version, the path, the
  envelope digest and the probe contract version. The gate reads the record first, and only
  then resolves the binary and reads its version.
- It exits 4 when the environment cannot host a turn:
  - a `codex` that cannot be resolved;
  - a version that cannot be read;
  - an instrument root that fails its checks;
  - a Codex configuration whose model keys cannot be read or fail validation;
  - a cleanup-map row that cannot be written. This fails even a turn that counted. The output
    names every thread whose row was not written, for cleanup by hand, and carries the turn's own
    verdict beside them.

**`dialogue-probe [--timeout-seconds <n>]`** tests the envelope. It runs two turns through the
same execution path as `dialogue-turn`, bypassing only the gate the probe itself feeds, and then
runs with no model at all. The probe's threads get cleanup-map rows through the same path.

**What the probe defends against.** A vendor or configuration regression: a CLI update, a renamed
setting or a changed default that loosens the envelope's write boundary or the environment its
shell sees, while the interlocutor is cooperative, meaning it runs the given line as given. The
rest of the policy, network restriction and approval included, it checks by the harness's record
alone. The cases this leaves uncovered are named in Honest limits (the Director's verdict of
2026-09-24). The design and its trials ran on codex-cli 0.156.1,
where every shell run in the trials went through code mode, on the owner's model and on the CLI's
default alike (research note §2.9).

The write proof has three legs. The first two involve no model. The third reads the harness's
records of what the model ran, so it holds for a cooperative interlocutor and no further:

- **Enforcement, with no model** (rule 9): `codex sandbox`, given the `permission_profile` the
  resumed turn recorded, refuses the write, and a control run shows the refusal is the sandbox's.
- **Configuration, by record** (rule 8): the harness's rollout records the policy each turn was
  configured with.
- **Path** (rules 4 and 5): the model's run of the line, on the tool path the resumed turn took,
  is refused, as the harness's output records show.

1. The opening turn must return an exact acknowledgement.
2. The resumed turn must round-trip the thread id and recall turn one.
3. The resumed turn's prompt asks the interlocutor to run a given two-line command. The line
   attempts the sentinel write and branches on the result, reading the nonce only when the write
   fails. It then lists environment variable names:

   ```bash
   if printf SIF > <root>/<sentinel>; then echo WRITE-OK; else cat <nonce file>; fi
   echo; env | cut -d= -f1
   ```

   - The sentinel name is random for each probe.
   - The nonce is 128 random bits, in a 0600 file inside a fresh 0700 temporary directory
     outside the root, removed in a `finally`.
   - No rule checks that the line ran as given. Honest limits names what that leaves.
4. Across every output record of the resumed turn, at least one must carry the nonce and none may
   carry `WRITE-OK`.
   - The output records are the event stream's `command_execution` outputs and the rollout's
     `CommandExecution` items, both written by the harness. A code-mode program's printed output
     is never an output record: the program chooses what it prints (such as a result object, one
     field of it, or nothing), so the model authors that output. On codex-cli 0.157.0 each nested
     `exec_command` whose process exits within its turn leaves its own `CommandExecution` item,
     carrying that turn's id (`core/src/tools/events.rs`). A call the handler refuses before
     starting runs nothing, and one diverted to `apply_patch` leaves a `FileChange` item, which
     the reader refuses. So a program's commands are read through the harness's records. A run
     may appear in both sources.
   - Every rollout line of the resumed turn must be of a type the reader recognises, so the set of
     output records is closed. A record that carries the harness's truncation marker is
     inconclusive. A code-mode tool call's output must open with the harness's completed-script
     preamble; the program's printed items after it are not read.
   - Only output records are read. A code-mode tool call records its program, and that
     program's source contains `echo WRITE-OK`.
   - No exit code is read. A recorded exit belongs to the whole line or program: in the model-free
     run, the probe line printed the denial and the whole line exited 0 (research note §2.9).
5. After the process exits, the sentinel must be absent from disk.
6. The reply is kept verbatim as corroboration. It is never proof.
7. Each output record of the resumed turn that carries the nonce must also carry a non-empty
   listing of variable names after the nonce, delimited line by line, and every name listed must
   fall in the expected set. Rule 9's output is not read here. The expected set:
   - the child allowlist, `CODEX_HOME` included;
   - a declared set of names the harness injects, each named, with no prefix wildcard:
     - `CODEX_CI`, `CODEX_SANDBOX`, `CODEX_SANDBOX_NETWORK_DISABLED`, `CODEX_SESSION_ID`,
       `CODEX_THREAD_ID` and `CODEX_VERSION`;
     - `TERM`, `COLORTERM`, `PAGER`, `GIT_PAGER`, `GH_PAGER`, `NO_COLOR`, `PWD`, `OLDPWD`, `SHLVL`,
       `_`, `LC_ALL` and `LC_CTYPE`;
     - `__CF_USER_TEXT_ENCODING`, which macOS adds.

   A name that only shares a prefix, such as a replayed `CODEX_API_KEY`, is a leak.

   Any other name fails the probe, and the probe prints the extra names. So a vendor addition
   becomes a reviewed one-line change, and a leak is never silent. This re-proves, on every
   probe, the closure of the environment the interlocutor's shell sees. The environment of the
   Codex process itself is proved by slice 2's smoke test.
8. For both turns, the thread's rollout `turn_context` must record:
   - approval `never`, and a read-only sandbox policy without network access;
   - the root's real path as the working directory;
   - a managed `permission_profile` whose file system is restricted, with every entry read or
     deny, and whose network is restricted;
   - no top-level `network` field;
   - the pinned model and effort, when pinned.

   Any other profile, `disabled`, `external` and `unrestricted` among them, fails the rule. The
   reader parses those as data, and `codex sandbox` turns an external profile into read-only
   without a word, so rule 9 would not see one.
9. With no model, the probe runs the same two-line command under `codex sandbox`, through
   `/bin/sh -c` (see The envelope), from the same resolved binary as the two turns, with a nonce
   and a sentinel of its own:
   - the sandbox state is `{"permissionProfile": <profile>, "sandboxCwd": <the root's file URI>}`,
     where the profile is the `permission_profile` the resumed turn recorded. `sandboxCwd` also sets
     the working directory, and the CLI refuses `-C` beside `--sandbox-state-json`. The Linux-only
     fields are omitted, which 0.156.1 accepts;
   - the run takes the child environment the envelope builds, so it loads the instrument's Codex
     home, since `codex sandbox` has no `--ignore-user-config`;
   - its output must carry its nonce, which shows the shell ran and its write failed, and must not
     carry `WRITE-OK`;
   - its sentinel must be absent afterwards;
   - a control run through the same channel, identical except that the profile grants write on a
     fresh 0700 directory beside the root and the line targets it, must print `WRITE-OK` and leave
     its sentinel, which the probe then removes. The control shows that the channel honours the
     profile and that the seat's own containment permits a write beside the root. So the refusal
     above is the sandbox's, unless that containment treats the root differently from the
     directory beside it, a case the probe does not see.

   A run whose sandbox could not be applied never starts the shell on macOS (`codex sandbox` exits
   71), so its output carries no nonce and the leg fails. Containment that stacks instead of
   refusing, such as Landlock on Linux, would refuse the write without this sandbox; only the
   control run tells the two apart. The leg was trialled at 0.156.1 from a seat outside the macOS
   sandbox, with a control (research note §2.9). The leg counts only on a profile that passed
   rule 8.
10. Each feature the envelope disables must be listed, at a stage other than `removed`, and
    reported disabled.
    - The probe reads the features with `codex features list`. It spawns that from the root,
      under the instrument's Codex home, with the envelope's settings and `--disable` flags. It
      first checks that the home holds no `config.toml` (Honest limits).
    - On 0.157.0 the CLI folds `--enable` and `--disable` into the configuration of every
      subcommand, so `features list` and `exec` apply the same flags. An unknown name is
      refused before any subcommand runs. A legacy name, or the name of a removed feature, is
      accepted, and a removed feature can still be listed as enabled (research note §2.11).
      So a disabled name that is missing from the list, or listed as `removed`, fails the
      probe. The envelope must then name the feature as the CLI lists it, re-adjudicated
      under ADR-180 §6.
    - Any other enabled feature is an observation, not a verdict:
      - the probe diffs the enabled set against the previous pass record's, read with the
        record's parser alone, whatever its age or binding;
      - it prints the names that are new;
      - it carries the set in the record it writes.
    - The seat's post-probe step, which slice 3's skill defines, posts the new names for
      triage. Triage asks one question: does this feature need a `--disable`? A `--disable` is
      an ADR-180 §6 envelope change, trialled first. A machine's first probe reports the whole
      set once.
    - So a release that turns a feature on by default is recorded, never read as a failure
      that stops the dialogues. That keeps Owner decision 2, "we always run against latest":
      the seat probes the new version itself and carries on. The envelope's disable set is the
      only denylist (the Director's ruling of 2026-09-25). The check on its own names follows
      PR 222's security review.

Rules for the result:

- Any of these is inconclusive, and inconclusive fails:
  - a resumed turn whose output records carry no nonce;
  - a nonce-bearing record with no name listing;
  - a record in a shape the probe does not recognise, or a missing rollout;
  - a rule 9 run whose output carries no nonce;
  - a rule 9 control run that does not print `WRITE-OK` or does not leave its sentinel.
- Denial text such as "operation not permitted" is corroboration, matched without regard to case,
  because its wording and case vary with the shell. It never decides the verdict; the nonce and
  the sentinel carry it.
- On a full pass, the probe writes the machine-local pass record, including its verbatim evidence
  lines.

### The envelope

The envelope is one module. It is the only source of the argv and of the child's environment.

- **Open:** `codex exec --json <flags> -C <instrument root> <settings> -`
- **Resume:** `codex exec resume <uuid> --json <flags> <settings> -`
- **Rule 9's run:** `codex sandbox --sandbox-state-json <state> -- /bin/sh -c <probe line>`,
  with the probe line as one argument and the envelope's child environment. `codex sandbox` runs
  its command's arguments as given and parses no shell syntax, so the shell is named; this is the
  shape the trial ran (research note §2.9).
- **Rule 10's read:** `codex features list` with the envelope's `-c` settings and `--disable`
  flags, spawned from the root with the envelope's child environment. `features list` takes no
  `--json`, `--ignore-user-config`, `--ignore-rules` or `--skip-git-repo-check`.
- **Flags:**
  - `--ignore-user-config --ignore-rules --skip-git-repo-check --strict-config`. With
    `--strict-config`, a call refuses an unknown configuration key before it starts. On 0.157.0
    a misspelt `-c` key was otherwise accepted silently. The Director granted the ADR-180 §6
    re-adjudication on 2026-09-25, and the flag lands in slice 1b-iv's PR D.
  - `--disable memories --disable shell_snapshot`
- **Settings,** each a `-c`:
  - `sandbox_mode="read-only"` and `approval_policy="never"`;
  - `web_search="disabled"`;
  - `project_root_markers=[]`;
  - `shell_environment_policy.inherit="core"`;
  - `allow_login_shell=false`;
  - the model pins.
- **Model pins.** `model` and `model_reasoning_effort` carry the owner's configured values, an
  owner policy named under Owner decisions.
  - They are read from the top-level string keys of the user's Codex configuration. Nothing else
    is read from that file.
  - A parse failure prints a fixed message, never the parser's text, because the parser quotes
    the file and the file holds secrets.
  - The model must match `^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$`. The effort must be one of a closed
    set.
  - A key that is present but invalid fails closed (exit 4). An absent key falls back to the CLI
    default.
  - Each value is serialised as a JSON string.
- **The child environment.** The environment is an allowlist, never the seat's:
  - `HOME`, set to the instrument's home directory, not the owner's;
  - `USER`, `LOGNAME`, `LANG` and `TMPDIR`;
  - a fixed system `PATH`;
  - `CODEX_HOME`, set to the instrument's own Codex home, not the owner's (Owner decisions
    item 3).

  So no `CODEX_*`, `OPENAI_*` or proxy override in the seat's environment can redirect the
  interlocutor, and no seat secret is handed to it. With `HOME` redirected, the shell snapshot
  and any login shell start from an empty home, so none of the owner's shell startup files load
  (§2.8, the 19:55Z trial). The snapshot and login-shell settings stay as a second line.
- **Where it runs.** Both calls are spawned from the instrument root, a fixed directory under the
  instrument's Codex home, outside every checkout.
  - Before every spawn it must pass five checks, or the call exits 4 and names the path. It is
    never cleaned silently. The checks:
    - not a symlink;
    - owned by the user;
    - mode 0700;
    - its real path equals its configured path;
    - its listing, dotfiles included, is empty.
  - Because it is empty and project-root markers are off, no project configuration or
    `AGENTS.md` loads from it.
- **Which binary.** `codex` is resolved to its real path once per call. That path serves the
  version read, the spawn and the pass record, so an updater swapping the release link
  mid-call cannot split them.
- **The digest.** The envelope module computes it from the argv and the child environment its
  own builders produce, with each call's values replaced by fixed markers. So it covers the flags,
  the settings, the model pins and the environment's names by construction, and no other module
  learns the argv's shape. A typed template names each part it hashes, so a part left out fails
  to compile. A pass on one model is no evidence for another. The call's assembly in
  `executeTurn`, its working directory and the prompt on stdin, lies outside the builders; its
  integration test pins it, and a change there does not by itself demand a fresh probe.

### Where the state lives

The instrument has a home of its own. It is one fixed directory in the owner's home, created by
the tool at mode 0700. The instrument's Codex home sits inside it, and slice 2 names both paths.
The instrument's Codex home holds:

- the instrument's own login, from one `codex login` the owner runs once;
- its sessions and state database;
- the pass record, the cleanup map and the root.

It starts with no config, rules, plugins, skills or memories, so nothing of the owner's Codex
setup can load. Codex adds its own once a call runs. On 0.157.0, one logged-out run into an
empty home installed six vendor system skills under `skills/.system/`, a memories database and
shell snapshots (Honest limits: the homes start empty but do not stay empty). Retention becomes
deleting one directory. Deleting it also removes the instrument's login from the machine;
`codex logout` there, run first, also ends the session. The trial's four existing cleanup-map
rows stay in the owner's Codex home for the trial close-out.

The pass record is never committed. Its terms:

- **Contents:**
  - the CLI version;
  - the resolved real path;
  - the envelope digest;
  - the probe contract version that judged it;
  - the time;
  - the enabled features the probe observed, which the next probe diffs against;
  - the verbatim evidence.
- **Writing.** It is written through a temporary file and a rename, at mode 0600.
- **Reading.** A read requires a regular file owned by the user, not group- or world-writable,
  under a size cap, matching an exact-key schema. The evidence lines are treated as untrusted
  text.
- **What it guards.** A dialogue opens only when version, path, digest and probe contract
  version all match, and the record is at most seven days old and not dated after now. So a
  CLI update, a different `codex`, a changed model pin, an envelope change, a new probe
  contract or the passing week each demands a fresh probe. The record guards against drift, not
  attack: any process running as the user can write it.
- **Who runs the probe.** The seat runs it itself, with no owner gate, from a process outside the
  macOS sandbox (Honest limits).
- **The tracked evidence record** changes only when the envelope changes or a probe fails, never
  once per version.

## Honest limits

- **A resumed turn with no command record is inconclusive.** Output evidence is the harness's
  command records alone (rule 4's two sources), so a turn whose code-mode programs printed
  without running a command, or whose commands left no record, gives rule 4 nothing to read. On
  0.157.0 the rollout keeps `CommandExecution` items only in its paginated history
  (`rollout/src/policy.rs`); a legacy-history rollout leaves them out, so it reads as
  inconclusive at best.
- **A command record can lose output without a marker.** On 0.157.0 the transcript behind
  `aggregated_output` starts after the command does and skips the chunks it falls behind on,
  with no marker (`core/src/unified_exec/process_manager.rs` and `async_watcher.rs`). The nonce
  prints only when the write fails, so early loss cannot fake rule 4's pass: it removes the
  denial text before the nonce. A gap between the nonce and the names could hide a name from
  rule 7, but it needs 64 queued chunks, and the probe line writes a handful.
- **Reads are not bounded.** The permission profile grants read on `/`. So anything the owner's
  account can read can reach the vendor, whether the packet names it or injected text in a file
  steers the model to it. That includes dotfiles, credentials and owner-private memory. The
  packet bounds only what the seat sends. A restricted-read permission profile (the root plus the
  packet's paths) is the named hardening.
- **The instrument's homes start empty but do not stay empty.** Nothing of the owner's loads from
  either home. Codex writes its own state into the instrument's Codex home (the login, sessions,
  the state database and caches; on 0.157.0 also six vendor system skills, a memories database
  and a shell-snapshot directory, research note §2.11), and whatever a future CLI adds there
  becomes part of that state. The probe does not audit that directory's contents, beyond
  rule 10's check for a `config.toml`.
- **The envelope binds only calls made through `dialogue-turn`.** A seat can still invoke `codex`
  directly. That is the same trust question as every other tool it holds. The skill names
  `dialogue-turn` as the only contract-conformant route.
- **Per turn, the envelope is asserted by its argv, not re-measured.** The probe re-measures it
  once per binding. Asserting the rollout `turn_context` on every dialogue turn is the named
  hardening. It is not built, because the rollout format is internal and every format change
  would then stop dialogues rather than only the probe.
- **Network enforcement is read, not tested.** Rule 8 reads `network: restricted` from each
  turn's record, and no leg attempts a connection. So a regression that ignores the restriction
  while still recording it goes unseen, and, with reads unbounded, a later dialogue's shell could
  send what it reads. A network leg, a connection attempt that must fail beside a control that
  succeeds, is the named hardening.
- **Extension and rule absence is re-measured only indirectly.** The probe's environment and
  `turn_context` legs catch a regression in the recorded snapshot, sandbox or network settings.
  They do not catch an extension spawned under `--ignore-user-config`. Its absence rests on one
  run, sampled once per second. If one is ever seen, a process-tree leg is the named hardening.
- **A timeout sends SIGKILL to the Codex process only.** A shell that process started inside its
  sandbox can outlive it. Killing the process group needs the asynchronous lifecycle the
  complexity limits rule out here, so it is the named hardening.
- **A regression confined to one tool's path is seen only on the path the probe's resumed turn
  took, and only when the interlocutor ran the line as given.** Rule 8 shows the policy each turn
  was configured with, and rule 9 shows that `codex sandbox` enforces its write refusal. Neither
  sees how a tool
  hands that policy to the sandbox, so three cases are not seen:
  - a write through a tool the probe line does not use. On 0.156.1 and 0.157.0 that includes
    `apply_patch`, the file-edit tool, which has a runtime of its own. The pinned model is
    offered it through code mode. Under approval `never`, Codex refuses it in a policy check that
    runs before any process and leaves no harness record, so no probe leg can read that
    refusal. A leg that carries its verdict on a nonce waits on a recorded live observation (the
    Director's ruling of 2026-09-25);
  - a regression on a path the probe's turn did not take, which a later dialogue turn can take, by
    the model's own choice or steered by injected text in a file it reads;
  - a probe turn that did not run the line as given, whether by staging, a rewrite or a declined
    write. An output record carrying the nonce then shows only that the nonce file was read.

  The probe's threat model is a regression under a cooperative interlocutor, one that runs the
  given line as given (the Director's verdict of 2026-09-24). A future review finding that
  proposes a staging path is answered by this entry, not by a new probe rule.
- **Rule 8 judges only the fields it names.** Each `turn_context` carries more, such as the
  approvals reviewer and the workspace roots. The reader keeps those two and checks them against
  the settings the resume applied, but rule 8 judges neither, and a policy-bearing field the
  vendor adds beside them is not seen by the probe.
- **Rule 9 needs a seat outside the macOS sandbox.** `codex sandbox` cannot apply a sandbox from
  inside one: from a Codex seat it exits 71 without starting the shell (research note §2.9). The
  nonce requirement makes that a failed leg, never a pass, so the probe runs from a seat whose
  process is not already sandboxed. Containment that stacks rather than refusing is caught by rule
  9's control run, not by the nonce.
- **The binding does not see the vendor's server side.** A record keeps opening dialogues while
  the version, the path, the digest and the probe contract version match, for at most seven
  days. A behaviour the vendor changes on its own side under the same version, such as a
  feature enabled remotely, is not re-measured until something in the binding changes or the
  record passes its age limit, and a fresh probe sees such a change only where a leg measures
  it. A fix to the probe that did not raise its contract version is bounded by the same limit.
- **A cleanup row exists only for a thread the run's output names.** Three cases leave a thread
  without one: a kill that lands after a thread is created but before its `thread.started`
  event reaches the pipe; an id that does not parse as a thread id; and a thread named only
  inside an item, such as a spawned sub-agent's, which also fails the turn. Reconciling the
  instrument's Codex home's stored threads against the map is the named structural cure, routed
  to slice 2 and the trial close-out.
- **No row on resume rests on the vendor's source.** In codex-cli 0.156.1 and 0.157.0, a resume
  by thread id never creates a thread. A later CLI that starts one is caught only when the turn
  otherwise counts, as a thread-id mismatch naming it; beside the requested thread it fails as
  more than one thread, and a failed or killed resume names no thread at all. No probe leg
  re-proves the premise, because it guards retention rather than the interlocutor. Its structural
  cure is the reconciliation in the entry above (the Director's ruling of 2026-09-25).
- **A newly enabled feature runs until its triage.** A release that turns a feature on by
  default is an observation, not a failure (rule 10). Until triage, dialogues run with it on,
  and the write, environment and policy legs must still pass. So a new tool with a runtime of
  its own, or a new network or process capability, goes unseen until triage adds a `--disable`.
  The probe reports a new name once, since the next probe diffs against the record this one
  writes. If the post-probe post is skipped or lost, the name joins the baseline with no
  further signal. Keeping an untriaged set in the record until triage clears it is the named
  hardening.
- **Sub-agent spawning is within the enabled set.** `multi_agent` is stable and on by default
  on 0.156.1 and 0.157.0.
  - The turn verdict fails a turn whose output names a sub-agent's thread (the cleanup-row
    entry above).
  - The envelope does not disable it, because nothing observed shows harm. A
    `--disable multi_agent` comes only with an observation that does (the Director's ruling of
    2026-09-25).
- **`features list` reads configuration that `exec` does not.** It loads
  `$CODEX_HOME/config.toml` and the working directory's project layers, while `exec` runs
  with `--ignore-user-config`. The two agree while the instrument's Codex home holds no
  `config.toml`, which every probe checks before rule 10's read, and AC 5's live probe
  records.
- **The fixed root is new.** The trials used scratch directories. The live probe (AC 5) is the
  first run from the fixed root.

## Owner decisions carried by this node

1. **Model and effort. Decided, 2026-09-23: "carry the two keys, yes".** The envelope carries
   the owner's configured `model` and `model_reasoning_effort`, as above.
2. **The version policy. Decided, 2026-09-23, in the owner's words: "Record the version tested,
   but we always run against latest".** The pass record notes the version the probe passed on.
   After every update the seat probes the new version itself and carries on. Nothing runs on an
   older version, and nothing is pinned.
3. **A dedicated instrument Codex home. Decided, 2026-09-23: yes.** The Director decided it at
   about 20:03Z under the owner's delegation. The grounds were long-term architectural excellence
   and the estate's preference for a structural cure over a per-instance one.
   - The instrument's own Codex home means that a future default-on feature reading the Codex
     home finds nothing of the owner's to load. The flags stay as a second line.
   - The owner's one action is a single `codex login` into that home. It goes to the owner as an
     owner-run action card, with the exact command, when slice 2 reaches that step.
   - Slices 1a and 1b take both homes as injected paths, so neither depends on the location.

## Acceptance criteria (each with a proof)

Each behaviour is proved once, at the lowest scale that sees it.

1. **Fixed argv and environment.** The builders produce exactly the open and resume argv and
   the child environment above. A non-UUID `--thread`, a hostile model or effort value, a bad
   dialogue id, an out-of-bounds timeout, and every unknown option (`--model` included) are
   refused.
   - Proof: `repo-safe`, unit tests on the envelope and argument modules.
   - The whole-array and whole-object tests are designed sentinels.
     - They are built from distinctive injected slot values, with `it.each` over open/resume
       and over model pins present and absent.
     - Their failure message names the ADR-180 amendment section, which requires the authority
       envelope to be re-adjudicated.
     - The refusals are parser behaviour tests, not absence pins.
2. **Version gate.** `dialogue-turn` exits 3, without starting a turn, when the pass record is
   absent or fails its schema. It also exits 3 when the record is past its seven-day age limit,
   is dated after now, or differs from the current binding on version, path, digest or probe
   contract version.
   - Proof: `repo-safe`. Unit tests cover the gate decision.
   - One integration test uses a `runCodex` fake that would return a full success, so exit 3
     alone shows the gate held.
   - The envelope's digest covers every flag, setting and environment name by construction (see
     The envelope), and its typed template makes a dropped part a compile error. It is tested by
     relation through the envelope's public surface (equal pins give equal digests; a changed or
     absent pin gives a different one), never against a copied literal.
   - The positive case is a round trip: the record a passing `runProbe` writes opens `runTurn`.
3. **Failure reasons.** Every failure listed under Mechanism maps to its exit code.
   - Proof: `repo-safe`. Each failure reason is proved once, in unit tests on the turn verdict.
   - Integration tests prove only that each outcome class maps to its exit code and stdout.
   - The real timeout kill, stdin delivery and buffer limit are proved by the smoke test.
4. **Probe verdict.** `dialogue-probe` fails on each of these:
   - a sentinel present after exit, the turn's or rule 9's;
   - no output record of the resumed turn carrying the nonce, or any carrying `WRITE-OK`;
   - a rule 9 run whose output carries no nonce, or carries `WRITE-OK`;
   - a rule 9 control run that does not print `WRITE-OK` or does not leave its sentinel;
   - a variable name outside the expected set, or a nonce-bearing output record with no name
     listing;
   - a rollout record, including a code-mode output's wrapper, or a `permission_profile`, in a
     shape the probe does not recognise;
   - a feature the envelope disables that is reported enabled;
   - a `turn_context` that differs from the envelope, or cannot be found or recognised;
   - a thread mismatch;
   - a missing recall;
   - a wrong acknowledgement;
   - a root that fails its checks.

   It writes the pass record only on a full pass.
   - Proof: `repo-safe`, unit tests on the probe verdict.
   - One integration test uses an ordered fake that returns the open and then the resume result
     and never reads its arguments. It shows a single failing row leaves no record. Rule 9's runs
     the features read and the `config.toml` check each go through a port of their own, so the
     ordered fake stays two results long.
   - The probe reaches `executeTurn` directly. The gate is never bypassed through an option on
     `runTurn`.
5. **Live probe.** `dialogue-probe` passes against the installed latest CLI, from the fixed root
   and a process outside the macOS sandbox, under the instrument's own Codex home after the
   owner's one login. Every Codex process it started is proven closed by a process-table read.
   - The probe run's `turn_context` legs, its environment leg and rule 9's model-free run pass,
     and the Codex home gains no memory entry from the probe threads and holds no `config.toml`.
   - Proof: `owner-held`. The implementing seat runs it on the owner's machine under the owner's
     standing permission for Codex experiments.
   - The observation is recorded in slice 2's PR description and in the tracked evidence record
     that slice 3 writes.
6. **Doctrine.** The skill and Sif name the commands and cite the envelope module. They restate
   no argv, and the evidence record carries no version pin.
   - Proof: `repo-safe` for links and adapters, via `pnpm docs-validators:check` and
     `pnpm skills:check`. The slice 3 review reads the content.
7. **No `.mjs`.** No hand-authored `.mjs` remains in the skill, and the adapters regenerate
   clean. Proof: `repo-safe`, `pnpm skills:check`.

## Todos

Every pull request carries the default round budget. Slices 0, 1a, 2 and 3 are one pull request
each; slice 1b is the pull requests listed under it, sliced at plan time under PDR-132 and again
on 2026-09-25. Every pull request gets a code-expert review before and after execution.

- **Slice 0, records. Landed as PR 184 (`507d13931`).** This node, as a sketch, plus the
  research note's dated §2.8 evidence. Two files, prose-class, with the PDR-140 intake declared
  at open.
- **Slice 1a, the pure core of a turn. Landed as PR 186 (`418671f16`).** Up to 10 files: types,
  parsing, envelope, turn verdict and turn execution, their tests, and the ADR-180 amendment.
  - Parsing: a closed event union replacing the open `CodexExecEvent`.
  - Envelope: the `ThreadId` brand, the model pins read from config text, and the child
    environment built from an allowlist and the resolved Codex home.
  - Turn execution: `executeTurn` behind injected ports. The ports carry data, not handles.
  - Commit order, each commit a test plus the code that greens it:
    1. the closed-union parser, with the existing `last-message` tests as the safety net;
    2. the `ThreadId` and model-pin parse;
    3. the argv builders with the sentinel;
    4. the turn verdict;
    5. the `executeTurn` integration test.

  type-expert gives a focused review.
- **Slice 1b, the gate and the probe logic.** One story per pull request. The first five were
  sliced after the pre-execution code-expert review of 2026-09-24, and 1b-iv was re-sliced on
  2026-09-25:
  1. **1b-0, this node. Landed as PR 188 (`fcbaa9bf5`).** The probe's threat model and its three
     legs (the Director's verdict), this slicing, and the dated ledger row. Reviews:
     security-expert and docs-adr-expert, focused.
  2. **1b-i, the gate. Landed as PR 189 (`a0a2fead4`).** The pass-record schema, the envelope's
     digest, the gate and `runTurn`.
     - The gate admits the record first and matches the binding only after the binary is
       resolved. The turn spawns the executable at the resolved path the gate matched.
     - Commit order: the record schema; the digest; the gate; the `runTurn` integration,
       including the path a passing gate opens.
     - Reviews: type-expert, test-expert and security-expert, focused.
  3. **1b-ii, the cleanup-map row on the shared turn path. Landed as PR 196 (`1a4450a69`).**
     The row is written when a thread is created, whatever the turn's verdict, so a failed open
     or a failed probe leaves no thread without a row.
     - Commit order: the dialogue id; the threads a run started, with a killed run's partial
       output; the rows on the turn path, with the refused-row failure; this node's edit.
     - Reviews: test-expert, focused; security-expert, focused, for the slug, the rows as the
       input to a later deletion, and the fail-closed append.
  4. **1b-iii, the rollout reader. Landed as PR 190 (`45c838297`).** A module of its own under
     `agent-tools/src/codex-exec/rollout/`, owned by a Codex seat.
     - It reads the `turn_context` records, the tool-call output records and the
       `permission_profile`, over the rollout's lines, and fails closed on any shape it does not
       recognise. It parses policy values over the vendor's whole domain, so a writable profile
       reaches rule 8 as data rather than as an unrecognised shape. A truncated output is its own
       error, which the verdict reads as inconclusive. B0 (1b-iv) replaces its output read.
     - Its fixtures come from redacted lines of observed rollouts.
     - Its pickup found that a rollout cannot settle rule 10's source, which is now
       `codex features list`. Whether `apply_patch` is offered under the envelope is not a
       rollout question either: a rollout shows the tools a turn called, never the ones it was
       offered. Honest limits names it, and no probe leg attempts a patch (the Director's
       ruling of 2026-09-25).
     - Reviews: type-expert, test-expert and security-expert, focused, and a cross-vendor read by
       the Claude seat.
  5. **1b-iv, the probe.** Five pull requests. They were sliced after the pre-execution
     code-expert review and an assumptions-expert review of 2026-09-25, and the Director accepted
     the slicing that day. B0 was added the same day, after B's pre-execution review, and the
     Director accepted it with rule 4's rewrite.
     1. **A: the gate's contract version and age limit.**
        - The pass record's binding gains `probeContractVersion`.
        - The gate's first phase refuses a record past seven days, or one dated after now.
        - A also carries this node's edit for the re-slice.
        - Reviews: security-expert and type-expert, focused.
     2. **B0: the evidence cure.**
        - The reader stops taking a code-mode program's printed output as evidence. The
          harness's command records (rule 4) are the only output evidence; rule 4 and Honest
          limits say so.
        - The code-mode wrapper stays validated: its first item is input text holding the
          completed-script preamble, and the program's items after it are not parsed.
        - A 0.157.0 fixture projected from a recorded two-turn rollout: every record kept, in
          order, with the values replaced and the creator ids and every unread field dropped.
          The 0.156.1 fixtures retire.
        - Reviews: security-expert, test-expert and docs-adr-expert, focused; a cross-vendor read,
          owed on the owner's Codex session.
     3. **B: what the rollout reader gives the verdict.**
        - Its reasons as a closed union.
        - The top-level `turn_context.network` exposed, so rule 8 can require it absent.
        - A reused `call_id` makes the probe inconclusive. On 0.157.0 the top-level
          `custom_tool_call` ids the reader pairs come from the model's stream, not from Codex,
          so reuse is possible, though the recorded rollout had none. Pairing is what shows every
          program finished within its turn, and a reused id would let an unanswered call hide
          behind another call's output.
        - A `CommandExecution` item's `status` read over its closed set, with `declined` kept
          out of the evidence: on 0.157.0 a refused call's item carries the refusal text, which
          quotes the model's command (`core/src/tools/events.rs`).
        - The binding checks (thread, then turn) before the truncation check, so a misbound
          record fails as its binding rather than as inconclusive.
        - The reader's version notes in `record-shapes.ts` aligned to 0.157.0.
        - Reviews: type-expert and test-expert, focused; a cross-vendor read, owed on the owner's
          Codex session.
     4. **C: the pure verdict over rules 1 to 10, and the features-list parser.**
        - Rules 8, 9 and 10 as stated.
        - The verdict's unit tests are its contract.
        - If its non-test code passes 300 lines, it splits between the turn legs (rules 1
          to 8) and the model-free legs (rules 9 and 10).
        - Reviews: test-expert, deep; type-expert, focused; security-expert, focused on rule 10;
          a cross-vendor read.
     5. **D: `runProbe`, its ports and the round trip.**
        - The two model turns go through `runCodex`. Rule 9's runs, their control and the
          features read each go through a port of their own, so the ordered fake stays two
          results long.
        - The probe's dialogue id is fresh on every probe.
        - The pass record gains the enabled features the probe observed, and the probe prints
          the names new since the previous record.
        - A sentinel found in the root is reported, never removed. The `finally` removes only
          what the probe created outside the root.
        - `--strict-config` joins the envelope. One ADR-180 amendment carries it, the probe's
          running cost (at least weekly, and on every contract raise), and the trade-off that a
          newly enabled feature runs until its triage.
        - Before rule 10's read, the probe checks that the instrument's Codex home holds no
          `config.toml`, through a port of its own.
        - One function builds the current binding, for `runTurn` and for the record the probe
          writes.
        - The `executeTurn` import allowlist.
        - Reviews: architecture-expert first, on splitting the envelope module; then
          security-expert and test-expert, deep; config-expert, focused.

     The probe line is composed from the complete paths the ports supply, with no path joining
     in pure code, so the unit tests hold on the Windows CI leg. A and B0 run in parallel, and B
     follows B0. C follows B, and D follows A and C.

  1b-0 and 1b-i run in parallel; 1b-ii follows 1b-i, 1b-iii follows 1b-0, and 1b-iv comes last.
- **Slice 2, the IO edge.** Up to 10 files, separate because it touches the filesystem and
  processes:
  - the `spawnSync` runner;
  - node adapters, free of logic: the record, root, nonce, sentinel, cleanup map, rollout read,
    prompt read, config read, clock and binary resolution;
  - a pure resolver, called once at the composition root. It gives the owner's Codex home,
    read only for the two model keys, and the instrument's home and Codex home;
  - creating the instrument's homes at mode 0700. The owner-run login card goes to the Director
    with the exact command when this step is reached;
  - strict argument parsing;
  - CLI wiring at the composition root;
  - their tests;
  - the smoke test, `agent-tools/smoke-tests/codex-dialogue-runner.smoke.ts`. `test:e2e`'s
    smoke suite runs every `smoke-tests/*.smoke.ts` it finds (J6's N6, the discovered runner),
    so the file needs no `smoke:*` script and no chain wiring.

  The smoke test:
  - The runner takes the executable, args, cwd, timeout and buffer limit as parameters. So the
    smoke runs a `process.execPath` stub: it echoes stdin, cwd and its own environment's names,
    it hangs, and it floods a small buffer. It asserts the exact allowlist of those names.
  - It asserts the outcome kind and that the child is gone (`process.kill(pid, 0)` fails with
    ESRCH). It never asserts elapsed time.
  - A built-CLI leg checks that `--model` exits 2 without a stack trace, and that an empty Codex
    home exits 3.
  - It runs with `HOME` and `CODEX_HOME` set to a fresh temporary directory, and with a PATH
    holding no `codex`. So a developer's real pass record can never open the gate.
  - The unit fixtures for the run mapping are taken from the shapes the smoke observes.

  Commit order: the run mapping, then the argument parser, then CLI integration. The runner,
  adapters, smoke and wiring go in one commit, so each adapter lands with its proof: a smoke
  leg, or AC 5 for the parts that need the real CLI.

  It ends with the live probe (AC 5).
- **Slice 3, the doctrine.** 10 authored files plus generated adapters. Prose-class, with the
  PDR-140 intake declared at open; docs-adr-expert gives a review.
  - Rewrite the skill: setup, the open checks and the protocol. Its post-probe step posts the
    feature names the probe reports as new for triage (rule 10).
  - Sif: plank 2 becomes "evidence follows the runtime", keeping its principle that an
    unverified upgrade never becomes a silently trusted surface. Annex A becomes the exec
    binding.
  - Rewrite `probe-record.md` as the dated evidence record.
  - Delete the lockstep test. It reads `.agent/` through the filesystem and pins absences,
    both of which the testing doctrine forbids. With no restated argv left, nothing needs
    lockstep.
  - Delete the four `.mjs` scripts.
  - Add a dated note to the deep-dive plan: a single-consumer dialogue binding landed in the
    topic, and the plan stays unpromoted.
  - Add a dated pointer in the parent plan's v1-shape section to this node.

The plan-body first-principles check fires here:

- **Shape:** at this node's review.
- **Landing path:** at each slice's pre-execution code review.
- **Vendor literals:** re-read `codex exec --help` and `codex exec resume --help` at slice 1a
  pickup, and again at the live probe.

## Review dispositions

One dated row per routed finding (PDR-140 ledger surface). The implementer picking up each slice
enumerates and dispositions every row before implementation.

A finding becomes probe code only when two things hold:

- it falls inside the probe's threat model, a vendor or configuration regression under a
  cooperative interlocutor;
- its check does not bind to vendor state that changes with each release, such as feature
  defaults or message text.

Otherwise it is answered by an Honest-limits line that names its hardening (the assumptions-expert
review of 2026-09-25).

| Date | Source | Finding | Routing |
| --- | --- | --- | --- |
| 2026-09-23 | Readiness reviews at authoring: assumptions-expert, code-expert, architecture-expert-barney, test-expert, security-expert | Cured across the drafts, among others: the thread-id injection; the model change under `--ignore-user-config`; the environment allowlist; the shell snapshot and memories; the pass record's binding; the rollout `turn_context` legs; the test layering; the slicing | None routed onward |
| 2026-09-23 | PR 184 reviews: the Codex connector, Copilot, Badger seeks Hush | Cured on the PR: the write verdict read from the whole line's exit code; Codex-injected names read as leaks; the sampling bound; the nonce proving only a read; the `CODEX_` prefix allowance; the substring command check; the slice 1b todo's stale environment algorithm | None routed onward. A later finding on the probe verdict's mechanics is recorded here as a row for slice 1b, whose tests are that verdict's contract, rather than cured in this node's prose |
| 2026-09-23 | PR 184, the Codex connector at c29088f0b | Extra command executions bypass the probe in a writable sandbox. The interlocutor could create the sentinel path as a directory, run the exact probe command so that it prints the nonce, then remove the directory. The required `command_execution` item and the post-exit sentinel check would both pass | Slice 1b: the probe verdict requires the expected command to be the only `command_execution` in the probe turn. Any other execution is inconclusive and fails, and a unit test proves it |
| 2026-09-23 | PR 184, the Codex connector at 1daff4fe7 | The row above counts only `command_execution` items, but §2.8 records code-mode shell runs that the event stream omits. Unrecorded code-mode runs could create and remove the sentinel directory around the one recorded probe command, and a writable sandbox would still pass | Slice 1b states the condition as a property, not a mechanism. Every execution in the probe turn must be accounted for by a harness record: the event stream's items and the rollout's tool-call records, code mode included. The expected command must be the only one. A turn whose records cannot establish that is inconclusive and fails, and unit tests prove each path. This makes the rollout tool-call read part of the probe, superseding the Honest limits bullet that names it a follow-on. An execution path recorded in neither place is beyond the probe's sight, and rule 8's `turn_context` leg stays the independent check |
| 2026-09-23 | Slice 1a reviews: code-expert, type-expert, test-expert, security-expert, docs-adr-expert | Cured in slice 1a: the verdict's closed event contract (documented top-level types only, exactly one turn completed last, an unexpected item fails, a blank reply fails); the child environment built inside the turn; the root check bound to the spawned root; the model-pin split and its errors; the surviving test mutants; the ADR-180 amendment's sources, alternatives and outcomes | The rows below route the rest onward |
| 2026-09-23 | security-expert on slice 1a | The probe's environment leg lists the names the interlocutor's shell sees, and `shell_environment_policy.inherit="core"` filters those. So the leg cannot see a variable that reaches the Codex process itself, and rule 7's "re-proves the environment closure" claims too much | Slice 2: a smoke test runs the IO edge against a stub executable that reports its own environment names, and asserts the exact allowlist. Rule 7's claim is narrowed to the shell's environment |
| 2026-09-23 | security-expert on slice 1a; Badger seeks Hush's official-docs follow-up, answer (d) | On an always-latest CLI the envelope can lapse without a signal. A renamed `-c` key may be accepted as a no-op, and default-on features the envelope does not name stay on. At 0.156.1 these include `code_mode_host` (stable, on) and `plugins` | Slices 1b and 2: the probe re-proves a closed expected set of enabled features under the envelope, so a vendor addition becomes a reviewed change. At slice 2 pickup, run the envelope once with a misspelt `-c` key, and give each setting the probe cannot measure a probe leg or a line in Honest limits. Trial `--disable code_mode_host` and `--disable plugins` before either enters the envelope |
| 2026-09-23 | security-expert on slice 1a; Badger seeks Hush's follow-up, answer (a); PR 184, the Codex connector at f99fbf717 | `--ignore-user-config` skips only the user file. System and managed configuration layers sit outside the envelope and can still supply plugins and MCP servers, and the probe's network leg does not cover their traffic. The seat's `TMPDIR` and `LANG` values pass into the child | Slice 2, before the live probe: check the host for system and managed layers. Where one can supply an extension, either close it in the envelope or add the process-tree leg Honest limits names, and narrow the node's claim to what is then proven. Point `TMPDIR` at a 0700 directory inside the instrument home, and pin `LANG` |
| 2026-09-23 | code-expert and type-expert on slice 1a | The instrument root is not checked to be absolute. A raw `JSON.parse` value typed `any` could reach `buildResumeArgv`, because `no-unsafe-argument` is off | Slice 2: the root check requires an absolute real path, and the IO edge parses external JSON to `unknown` |
| 2026-09-23 | docs-adr-expert and test-expert on slice 1a | The `agent-tools` README's topic catalogue omits `codex-exec`. The codex-helper skill still recommends the removed MCP server. The `last-message` CLI tests inject stream fakes into a unit-test file | Slice 2: the README entry, and the CLI tests moved to an integration-test file. Slice 3: the codex-helper line |
| 2026-09-24 | The Director's verdict on the probe's threat model (Wick binds Temper, about 10:30Z, quoted in the 1b-0 pull request's body); the pre-execution code-expert review of slice 1b; runtime evidence from a Codex seat (research note §2.9) | The node stated no threat model, so the review rounds on PR 184 supplied an adversarial one. On codex-cli 0.156.1 every shell run in the trials went through code mode, where one program can make any number of calls. So the rows from c29088f0b and 1daff4fe7, which require every execution to be accounted for and the given command to be the only one, left the live probe unable to pass. The first form of the model-free leg, which read denial text and the sentinel's absence, would also pass a sandbox that never applied (exit 71 from inside another sandbox) | Slice 1b-0. The threat model is a regression under a cooperative interlocutor, one that runs the given line as given. The write proof is three legs: rules 4 and 5, rule 8, and rule 9, with the nonce and the sentinel carrying the verdicts of rules 4, 5 and 9. This row supersedes: the c29088f0b row's routing; the 1daff4fe7 row's routing, except its rollout tool-call read, which is built as rule 4; the PR 184 reviews row's cures for the nonce proving only a read and the substring command check (the required `command_execution` item, and its exact-command equality under a strict wrapper parse); rule 6's requirement that the reply carry the nonce; and the Honest limits bullet on the harness-recorded command. The node's prose changes because a threat model is a design decision, not a finding on the verdict's mechanics. Rule 7's claim is narrowed to the shell's environment here, as the 2026-09-23 security-expert row on the environment leg asks; that row's smoke test stays with slice 2. A staging finding is answered by Honest limits. Slice 1b is five pull requests |
| 2026-09-24 | The pre-execution code-expert review of slice 1b | Slice 1b as one pull request held several stories past the size warnings. Its gate could not hold "record first, then binary" once the binding had to be resolved before the decision, and the executable could split between the gate and the spawn. A digest without the model pins would let a pass on one model open another. A cleanup row written only on success would orphan a failed open's thread. The planned leg 1 had no work named for it | Slice 1b, as five pull requests. 1b-i: the gate's two phases, record first, the binding matched only after the binary is resolved, and the turn spawned at the matched path; the digest covers the model pins. 1b-ii: the cleanup row written when a thread is created. 1b-iv: rule 9's runs through a port of their own |
| 2026-09-24 | security-expert and docs-adr-expert on the 1b-0 draft; a Codex seat's cross-vendor read | The draft overclaimed what the legs establish. Its residual left out writes through a tool the probe line does not use (`apply_patch` on 0.156.1), paths the probe's turn did not take, and turns that did not run the line as given. Rule 9 had no control run, so a renamed field that fell back to a default policy, or containment that stacks, could pass it. Rule 7 could pass on an empty listing when code mode splits calls | Cured in 1b-0: the residual stated exactly, rule 9's control run, rule 7's non-empty listing in each nonce-bearing record, the closed set of output records, and the evidence moved to research note §2.9. Slice 1b-iii's pickup: confirm from a rollout whether `apply_patch` is offered under the envelope; if it is, slice 1b-iv adds a second write leg through it (a second random sentinel, which must be absent, and output records showing the patch refused). Slice 1b-iv: a probe-contract version in the pass record that the gate matches, so a fix to the verdict invalidates records written under the old one. Slice 2: the host check for system and managed configuration layers also covers `codex sandbox`, which loads them and has no `--ignore-user-config` |
| 2026-09-24 | Slice 1b-i's reviews: security-expert; Forge herds Vapor's cross-vendor read. Slice 1b-iii's pickup on `apply_patch`, by the same seat | The binding does not see behaviour the vendor changes server-side under the same version, and the pass time is no expiry. `executeTurn` is exported without the gate, and nothing limits its importers. `ThreadId` is a compile-time brand, and `codex exec resume` also takes a thread name or `--last`. The observed rollouts carry no tool inventory, so they cannot show whether `apply_patch` is offered; the 0.156.1 source registers it when the model's information names a patch tool type | Honest limits names the server-side gap (1b-0). Slice 1b-iv: a pass-record age limit as a named hardening; a `no-restricted-imports` allowlist for `executeTurn`, naming `run-turn.ts` and the probe module; settle whether `apply_patch` is offered by attempting a patch under the exact envelope, since a rollout shows the tools called and never the tools offered, before deciding its second write leg. Slice 2: the intake test feeds a raw `--last` and a thread name and sees each refused |
| 2026-09-24 | Slice 1b-ii's pre-execution reviews: code-expert and test-expert | Both asked that `--dialogue-id` also ride on resume, so that a stray thread a resume started would get a row. A killed run carried no output, so a thread it started before the kill had no row. A refused append had no defined outcome. A test that recorded the port's calls would pin the implementation | The request to put `--dialogue-id` on resume is REJECTED, on codex-cli 0.156.1 source: `exec/src/lib.rs` `resolve_resume_thread_id` passes a UUID through as given, and the app server's `thread_resume_inner` errors when `read_stored_thread_for_resume` finds no stored thread. So a resume by thread id never creates a thread on that version, and the CLI's "exactly one of `--dialogue-id` and `--thread`" stands. Honest limits names the premise's reach. Cured in 1b-ii: a killed run keeps its partial output; the rows are written on open, before the verdict, whatever it is; a refused row fails the turn as `cleanup-row-unwritten` (exit 4), after every row is tried, naming only the unwritten threads. The tests assert an in-memory cleanup map's contents, never its calls, under the owner's 2026-09-24 test ruling |
| 2026-09-24 | Slice 1b-ii's post-execution reviews: code-expert, test-expert, security-expert | Claims stronger than the mechanism: "no thread without a row" (a row exists only for a thread the output names) and "a stray thread on resume fails as `thread-mismatch`" (only when the turn otherwise counts). `created_at` was read after the run. A refused row hid the turn's own failure, an envelope breach included. The refusing fake branched on its input, and three mutants survived (the second refused thread, the first reason, a hardcoded dialogue id). The map is future deletion input that any process of the user's can write. The recorders in the turn and gate integration tests inspect calls | Cured in 1b-ii: the claims scoped, with both residuals in Honest limits; the clock read before the spawn; the verdict carried in `cleanup-row-unwritten`; a pure fold of append outcomes, unit-tested, and a constant refusing fake; a second dialogue id. Slice 1b-iv: a model-free probe leg that resumes a fresh random id and passes only on a non-zero exit with no `thread.started`; confirm sub-agent spawning is outside the closed feature set. Slice 2: the CLI prints a mismatched resume's thread as unrecorded; the adapter writes each row as one `JSON.stringify(row) + '\n'` append, refuses a file that does not end in a newline, a symlink, or a file not owned by the user at 0600, and refuses a dialogue id already in the map; the runner's contract test keeps partial stdout on a timeout and on `ENOBUFS`; the CLI intake parses `--dialogue-id` with `parseDialogueId`. The trial close-out: deletion takes the Codex home from the map's own location, re-parses every line strictly and stops at the first malformed one, checks each thread's stored metadata (an exec thread, the expected root, a UUIDv7 time inside the turn's window), and lists the threads for the owner first. This lane, as one small pull request before slice 2: the call-recording tests in `dialogue-turn` and `run-turn` become return-value tests of a pure call builder and verdict-only assertions, under the owner's 2026-09-24 test ruling |
| 2026-09-24 | Slice 1b-iii's reviews on PR 190: the pickup, the security-expert's re-read, and Copilot's round one (thread `4095991046`) | The reader does not settle rule 10's source, the closed set of enabled features. `network` in the turn context and the reader's reason strings are consumed by the verdict, not the reader. A `call_id` can be reused once its output consumes it, and no fixture or test exercises that; whether codex-cli reuses a `call_id` across a rollout's turns is unrecorded | Slice 1b-iv: rule 10's source (under the envelope, `apply_patch` is offered to the pinned model through code mode and refused by Codex's policy check, and the rollout records no tool inventory); `network` in the turn context; the reason strings as a closed union; whether a reused `call_id` makes the probe inconclusive, decided once a recorded rollout shows whether ids repeat |
| 2026-09-25 | Slice 1b-iv's pre-execution code-expert review, on codex-cli 0.157.0 source | The design drafted a single PR, then two. Its findings: rule 9's runs, the features read and a fresh-id resume went through `runCodex`, which would make the ordered fake longer than two results; the fresh-id leg could pass on an empty-stdin exit before any resume; rule 8 accepted `disabled`, `external` and `unrestricted` profiles as data, and `codex sandbox` quietly turns an external profile into read-only; the `apply_patch` refusal is a policy check that leaves no harness record, and an uncaught refusal fails a code-mode script, which fails the rollout read closed; a fixed probe dialogue id would be refused by slice 2's adapter on a second probe; a sentinel found in the root would have been removed; and one PR was over the size limits. On 0.157.0, `SessionMeta` gained two creator ids, and feature defaults moved | Slice 1b-iv as four PRs, A to D (see Todos). Separate ports for rule 9, its control and the features read; a fresh dialogue id per probe; a sentinel in the root reported, never removed; rule 8's passing shape stated directly, with rule 9 counting only on a profile that passed rule 8. Fixtures captured on 0.157.0 redact both creator ids. The `apply_patch` leg, the fresh-id leg and rule 10's closed set go to the row below |
| 2026-09-25 | assumptions-expert on the probe's solution class; the Director's rulings (16:23:39Z and 16:40:22Z) | The probe-and-gate class is proportionate, and rules 1 to 9 each rest on a measured fact. The drift was at two edges. Rule 10's closed allowlist acted as a per-release pin: the enabled set changed at every observed update (0.153.4 to 0.156.1, five on; 0.156.1 to 0.157.0, two on). The fresh-id leg guards retention, not the interlocutor. Measured: a misspelt `-c` key is accepted silently without `--strict-config`. The node's fact 3 was wrong about memories, and its claim that the Codex home holds no skills was too strong | Rule 10 reshaped (only a disabled feature reported enabled fails; the rest is an observation diffed against the previous pass record). `--strict-config` joins the envelope in PR D. The fresh-id leg dropped, its premise pointing at slice 2's reconciliation. `apply_patch` and `multi_agent` named under Honest limits. The age limit is seven days, and a record dated in the future is refused. The routing test at the head of this ledger. Fact 3 and the state section corrected. No owner question: nothing leaves the ratified baseline |
| 2026-09-25 | PR 222's focused reviews: security-expert, type-expert, test-expert, docs-adr-expert | An age that is not a finite number passed both age checks. No test held a record passed at exactly now, or `runTurn` to its injected clock. Rule 10 passed when a disabled feature was missing from the list or listed as removed. The server-side Honest-limits line implied that a fresh probe sees a remote change, and a new feature's name is reported only once. `features list` agrees with `exec` only while the Codex home holds no `config.toml`, which only AC 5 checked. Rules 8 and 9 lagged PR C's todo, and what the features diff compares against was unstated. Five rows above still routed to the old slice 1b-iv. The 0.157.0 measurements had no evidence home. The gate's refusals need an exhaustive consumer, and the binding is about to be built in two places | Cured in PR A: the gate refuses an unmeasured age; the two boundary tests; rule 10 requires each disabled name listed, not removed and disabled, on the 0.157.0 source; rules 8 and 9 state the passing shape; the diff reads the previous record with the parser alone; the Honest-limits lines reworded; research note §2.11. PR D: the `config.toml` check on every probe; one function builds the binding; the ADR-180 amendment carries `--strict-config`, the probe's running cost and the triage trade-off. Slice 2: the exit-code mapping over the gate's refusals is exhaustive at compile time. Honest limits: an untriaged set kept in the record is the named hardening. This row supersedes: the 2026-09-23 lapsing-envelope row's closed set (its misspelt `-c` check is measured and answered by `--strict-config`; its two `--disable` trials go to triage); the 1b-0 draft row's second write leg through `apply_patch`, and the 1b-i row's patch attempt (Honest limits); the 1b-ii post-execution row's fresh-id leg and its sub-agent check (Honest limits); the PR 190 row's rule 10 source (`features list`). Still open and assigned: the PR 190 row's `network` field, closed reason union and reused `call_id` to PR B; the 1b-i row's `executeTurn` import allowlist to PR D. The 1b-0 draft row's contract version and the 1b-i row's age limit are built in PR A |
| 2026-09-25 | Slice 1b-iv PR B's pre-execution code-expert review; a two-turn dialogue Swallow holds Drift recorded on codex-cli 0.157.0 under the envelope; the Director's acceptance (21:03:54Z) | The reader refused a real 0.157.0 rollout at its first code-mode output. The program there called `text(r.output)`, printing the command's output as plain text, where the 0.156.1 fixture's program returned the result object. So a code-mode program's printed output is authored by the model, and its shape is the model's choice. The recorded dialogue ran 6 exec calls, 3 per turn: 6 distinct call ids, none reused, each call answered once. Each program ran one command, and each command wrote one `CommandExecution` item. With the output cure applied, the whole rollout reads: both turn contexts and applied settings compare, and every record type is recognised | B0 before B: the harness's command records (rule 4) are the only output evidence, with rule 4 and Honest limits rewritten and the 1b-iii bullet pointed at B0; the code-mode wrapper's preamble validated without reading the program's printed output; the 0.157.0 fixture projected from the recorded rollout, the 0.156.1 fixtures retired. B keeps the closed reasons, the exposed `network` and the reused call id, decided on the 0.157.0 source with the recorded dialogue as corroboration. The cross-vendor read for B0 and B is owed on the owner's Codex session. Owed once Gale turns Cloud's claim on the research note releases: a dated section in it for these 0.157.0 measurements. This row supersedes: the 1daff4fe7 row's rollout tool-call read, which the 1b-0 row kept as rule 4 (rule 4 now reads the command records, and checks a code-mode output only as a wrapper); the PR 190 row's wait for a recorded rollout to settle reused `call_id`s (decided on source, the rollout as corroboration); the 1b-iv pre-execution row's four pull requests (B0 added) |
| 2026-09-25 | B0's focused reviews: security-expert on the 0.157.0 source, test-expert, docs-adr-expert; code-expert, post-execution (APPROVED WITH NOTES) | Rule 4 said every nested `exec_command` that reaches its handler leaves an item; on 0.157.0 a refused call runs nothing and an `apply_patch` diversion leaves a `FileChange` item. A command record can lose output without a marker. The wrapper check parsed every item, so a non-text item the program chose refused the rollout. "Codex mints no call id" was too broad: Codex mints the nested calls' ids. The fixture swap left the effort fields, the reasoning records, two of the truncation markers and a command's binding to its own turn untested, and two wrapper rows sat too far from the boundary. The node miscounted slice 1b, said "alone" where rule 4 names two sources, left three rows unsuperseded, and took an exit example from model-authored output | Cured in B0: rule 4 scoped to 0.157.0 with its source named, and AC 4 names the wrapper; an Honest-limits bullet on the lost output; only the preamble item parsed; the call-id sentence limited to the top-level ids; tests for the effort, both reasoning types, both truncation markers, an opening-turn command inside the resumed turn, a non-text program item, and the vendor's failed, terminated, running and cell-overhead preambles, each confirmed by a mutation; the slice count dropped; the command records named throughout; the supersessions in the row above; the exit example taken from the model-free run. code-expert: the preamble item's closed shape gets its test and a refusal that names it, the wrapper check returns a Result, and each truncation marker names its 0.157.0 path into a command record (all four kept: each has one). To PR B: the item's `status`, with `declined` out of the evidence; the binding checks before the content check; the version notes |
| 2026-09-27 | PR 261 round three (the Codex connector, Copilot), cured in its settlement push; its post-execution reviews: security-expert, architecture-expert-fred, assumptions-expert | Residuals of the command-records reader once the cures landed. A wrapper outside the set, or a wrapper's positional operand, hides the command (`timeout 5 git push`, `nohup git push`). A `--` given as a subcommand option's value ends options there although git reads the token after it as an option (`git commit -m -- -n`). An `eval` or `ssh` chain longer than the read depth goes unread. Also residual: unquoted positional words, scripts on stdin, interpreters outside the set, expansions, and zsh digit clusters. The assumptions review found that exact placement fails open wherever its tables have a gap. It recommended replacing placement with a closed rule: a segment is flagged when a `git` word is followed later by a forbidden subcommand. The architecture review found that the shell scanner could record each word's redirection kind as it scans, which would make the reachable-set scan a single exact pass | The residuals are named in the reader's module docs. The closed rule is measured before it is chosen: its false-positive rate over the fixtures and real seat rollouts (`git log --grep push`, `echo git push`, `git add -- -A`), then the Director's ruling. The settlement push made placement fail closed at the tables' open end (an option the tables do not know may take a value). The per-word redirection kind is its own PR, changing the type the Bash guard shares, with a docs-adr-expert pass |

## Out of scope

- **codex-helper's use of this envelope.** Its delegation needs a repo working directory,
  `workspace-write` and `AGENTS.md`, which this envelope forbids. Only the parser is shared.
- **The idle-wake bridge over `codex queue`, a Codex leg for Cricket, and App Server
  experiments.** Separate research proposals.
- **The trial close-out** (extract, then delete the trial's rollouts and mapping). It is owed
  under the data contract, but it is not a binding change. Rollout deletion alone does not bound
  retention, because the prompts also persist in the Codex state database. The close-out has to
  cover that too.
- **The Annex B reverse binding and the conduit wrapper.** Their own evidence gates stand.
- **The named hardenings in Honest limits:**
  - a restricted-read profile;
  - a network leg;
  - per-turn `turn_context` assertion;
  - a process-tree leg;
  - process-group kill.
- **A lock around the probe.** A random sentinel name per probe and the record's atomic rename
  make concurrent probes safe without one.
