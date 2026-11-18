# Codex Practice tooling: official documentation follow-up (2026-09-23)

- **Kind:** dated research and concept exploration; no tooling, policy, or runtime decision.
- **Seat:** Badger seeks Hush (01a0ce), Codex. This is a follow-up to Blazar lifts Corona's
  [experiment and estate review](codex-support-concept-exploration-2026-09-23.md), merged in PR #178.
- **Evidence boundary:** OpenAI documentation read on 2026-09-23, plus the merged note and the
  repository files named below. Documentation describes a product interface; it does not prove
  that a Practice integration works. The merged note's CLI experiments are bounded to its tested
  release and session states. The owner preference recorded there is to use the latest CLI, with
  behaviour checked at the point of use.

## What the documentation adds

| Practice job | Documented surface | Meaning for the existing proposals | Limit |
| --- | --- | --- | --- |
| One-shot or resumable dialogue | [`codex exec`](https://learn.chatgpt.com/docs/non-interactive-mode), including `exec resume <SESSION_ID>`, JSON events and schema-constrained final output | The merged note's `exec`/`resume` proposal has a documented CLI carrier. The invocation needs an explicit authority and configuration envelope. | The documentation does not prove the Sif dialogue contract or authority on a future latest release. |
| Application-controlled automation | [Codex SDK](https://learn.chatgpt.com/docs/codex-sdk) | The TypeScript SDK can start, continue and resume local threads; OpenAI recommends SDK for automation and CI. It deserves a comparison with direct `exec` when the dialogue binding is designed. | A recommendation is not evidence that the SDK is the smallest or safest carrier for this estate. |
| Custom client with auth, history, approvals and events | [App Server](https://learn.chatgpt.com/docs/app-server) | This is the documented migration target for integrations built on the removed Codex MCP server. It is JSON-RPC, not MCP. | The command and WebSocket transport are experimental and unsupported for production; deeper integration has a higher maintenance cost. |
| Idle-seat notice | Local `codex queue` experiment in [the merged note](codex-support-concept-exploration-2026-09-23.md#24-codex-queue-starts-a-turn-on-an-idle-interactive-session) | One idle session woke; one active turn queued a later user-role turn; one queued message survived clean exit until explicit resume. | The official pages examined here did not establish a CLI queue contract, cross-machine delivery, crash recovery, or typing priority. Keep those as experimental unknowns. |
| Command/content guard | [Codex hooks](https://learn.chatgpt.com/docs/hooks) | `PreToolUse` can deny or rewrite supported Bash, `apply_patch`, MCP and other local function calls. The repo currently configures a SessionStart identity hook only (`.codex/config.toml`); its Codex command/content guard remains unactivated (`.agent/hooks/policy.json`). | Hosted tools are outside this hook path; `write_stdin` does not rerun `PreToolUse`; specialized paths can opt out. It is a useful guardrail, not a complete authority boundary. |

The [MCP removal notice](https://learn.chatgpt.com/docs/mcp-server) makes a narrow but decisive
distinction. `codex mcp-server` and the standalone server binary are removed, and their old tool
reference and Agents SDK examples are unsupported. Codex **continues to consume external MCP
servers**. The break is in presenting Codex itself as an MCP server, which is exactly the
dialogues binding that failed in the merged note. The App Server uses its own JSON-RPC protocol;
renaming the command would not repair an MCP client.

### Three configuration traps to carry into any later probe

1. In [App Server](https://learn.chatgpt.com/docs/app-server), per-turn model, working directory,
   effort and sandbox overrides become defaults for later turns on the thread. The [Python
   SDK](https://learn.chatgpt.com/docs/codex-sdk) says the same for a sandbox passed to `run`.
   An authority probe must inspect successive turns and set the intended sandbox explicitly,
   especially when resuming a thread.
2. The published Python SDK includes a **pinned Codex CLI runtime dependency** and uses it by
   default; `CodexConfig(codex_bin=...)` deliberately selects a local executable. This creates a
   design question under the owner's latest-runtime preference in the merged note: does
   adopting the latest *SDK release* satisfy that preference, or must the carrier run the
   latest *standalone CLI executable*? The answer is not supplied by either source. It belongs
   in the carrier decision, not in an implicit package choice.
3. A read-only sandbox and approval `never` do not describe the entire configuration envelope.
   OpenAI documents [`--ignore-user-config` and `--ignore-rules`](https://learn.chatgpt.com/docs/non-interactive-mode)
   for controlled `exec` runs. Its [sandbox guide](https://learn.chatgpt.com/docs/sandboxing)
   says execution-policy rules can allow command prefixes outside the sandbox. Therefore, the
   merged note's refused write demonstrates that one attempted command under that session's
   settings; it does not prove that every configured tool or allowed command was read-only.
   A later probe should record loaded configuration and rules, authentication, model and effort,
   enabled tool surfaces, and the effective sandbox before calling the carrier bounded.

For a latest-release-sensitive App Server client, OpenAI documents
[`generate-ts` and `generate-json-schema`](https://learn.chatgpt.com/docs/app-server); each output
matches the CLI version that generated it. That offers a candidate way to inspect protocol drift
at the point of use, but schema compatibility alone would not prove dialogue semantics.

## Follow-up: four `codex exec` envelope questions (2026-09-23)

Blazar lifts Corona's [dated experiment record, §2.8](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/3362140fdf10cb767ebf14a6d7eaf1987a02450c/.agent/research/agentic-engineering/codex-support-concept-exploration-2026-09-23.md#28-the-calls-authority-envelope-1905z-to-1956z)
reports one `codex exec` run per arm on CLI 0.156.1. Both used `codex exec --json
--skip-git-repo-check -C "$D" -c 'sandbox_mode="read-only"' -c 'approval_policy="never"' -`
from an empty directory outside every checkout, with the prompt `Reply with exactly ACK-1 and
nothing else. Do not run any command.`; the
second added `--ignore-user-config`. Blazar sampled the exec process's descendants once per
second. With user configuration loaded, samples included `node_repl`, `cua-repl`, a computer-use
client, and a plugin-marketplace `git clone`; no child appeared in the second arm's samples.
Both returned `ACK-1`. The linked record is a peer-authored account, not a raw process-sampling
transcript, and this seat did not repeat the experiment. The observation is
bounded to those runs and does not prove the cause of each child process. The questions below
answer what the official documentation promises.

### (a) What does `--ignore-user-config` drop?

**Documented:** It prevents loading `$CODEX_HOME/config.toml`; authentication still uses
`CODEX_HOME`. `--ignore-rules` is a separate flag for user and project execution-policy `.rules`
files ([non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode#permissions-and-safety),
[CLI reference](https://learn.chatgpt.com/docs/developer-commands#codex-exec)). The documented
[configuration order](https://learn.chatgpt.com/docs/config-file/config-basic#configuration-precedence)
has project, profile, cloud-managed, system, and built-in layers besides the user file.

| Surface asked about | Answer from the documentation |
| --- | --- |
| `~/.codex/AGENTS.md` | **Not documented as dropped.** Global `AGENTS.md` and `AGENTS.override.md` have their own instruction-discovery path ([AGENTS.md guide](https://learn.chatgpt.com/docs/agent-configuration/agents-md)). |
| Hooks | Inline hooks defined only in the skipped user `config.toml` lose that source **by inference**. Hooks also live in `~/.codex/hooks.json`, project files, and enabled plugins; the flag is **not documented as disabling those** ([hooks](https://learn.chatgpt.com/docs/hooks#where-codex-looks-for-hooks)). |
| Plugins and marketplace sync | User-file marketplace/plugin entries lose that config source **by inference**, but marketplaces may be defined by system, cloud-managed, or trusted-project config. Plugin refresh may install or refresh even a configured disabled plugin. A blanket suppression of installed plugins or startup sync is **not documented** ([config basics](https://learn.chatgpt.com/docs/config-file/config-basic#configuration-precedence), [config reference](https://learn.chatgpt.com/docs/config-file/config-reference)). |
| MCP servers | Direct MCP registrations in the skipped user file lose that source **by inference**. Trusted-project config and enabled plugins can also supply servers, so disabling all MCP is **not documented** ([MCP](https://learn.chatgpt.com/docs/extend/mcp#connect-codex-to-an-mcp-server), [plugin-provided MCP](https://learn.chatgpt.com/docs/extend/mcp#plugin-provided-mcp-servers)). |
| `notify` | A `notify` value defined only in the skipped user file loses that source **by inference**. Whether a value from another active layer remains is governed by config precedence; the flag is **not documented as a general notification switch** ([advanced config](https://learn.chatgpt.com/docs/config-file/config-advanced#notifications), [config basics](https://learn.chatgpt.com/docs/config-file/config-basic#configuration-precedence)). |

### (b) Do shell sandbox and approval `never` bind MCP and plugin calls?

**No blanket guarantee is documented.** OpenAI describes `sandbox_mode` as the technical
boundary for *model-generated commands* and `approval_policy` as when the agent asks before an
action. App and MCP tools have their own approval behaviour; a destructive annotation can require
approval even without a shell command or file edit
([agent approvals and security](https://learn.chatgpt.com/docs/agent-approvals-security#sandbox-and-approvals),
[MCP tool approval settings](https://learn.chatgpt.com/docs/config-file/config-reference)).
The [command network proxy boundary](https://learn.chatgpt.com/docs/agent-approvals-security#traffic-outside-the-command-network-proxy)
explicitly excludes app/connector calls, MCP server connections, browser and Computer Use activity.
That is a statement about **network filtering**, not proof that every local MCP process or file
action escapes every OS sandbox. The universal result of `approval_policy="never"` for every MCP
or plugin tool, and the exact placement of a given plugin's startup processes, are **not
documented** here. The one-run child-process observation above is evidence for that tested setup
only; it does not establish a general shell-only sandbox model.

### (c) What settings apply to `codex exec resume <id>`?

**Not documented for the exact effective working directory, sandbox, or approval policy.** The
[non-interactive guide](https://learn.chatgpt.com/docs/non-interactive-mode#resume-a-non-interactive-session)
documents selecting a session by ID, while the
[CLI reference](https://learn.chatgpt.com/docs/developer-commands#codex-exec) says `--last`
selects from the current working directory unless `--all` is passed. Neither says whether an
explicit-ID resumed turn runs in the resuming process's directory or the recorded directory, or
whether fresh sandbox/approval values replace recorded thread settings. The installed CLI
0.156.1 `codex exec resume --help` accepts `-c` and `--ignore-user-config` but does not list
`-C` or `--sandbox` on that subcommand; this is version-specific help, not a documented
precedence rule. General [`-c` precedence](https://learn.chatgpt.com/docs/config-file/config-basic#configuration-precedence)
does not settle how saved thread state interacts with the resumed turn. Restating the desired
values with `-c` and observing the resumed turn's effective context is therefore a **proposed
verification**, not a promised fix.

### (d) Is there one documented `-c` switch for every plugin and MCP server?

**For plugins, there is a general invocation switch; for all plugins *and* all MCP servers
together, not documented.** The [CLI reference](https://learn.chatgpt.com/docs/developer-commands)
documents repeatable `--disable <feature>` as `-c features.<name>=false` and
`codex features list` as the way to see known flags. The installed CLI 0.156.1 lists `plugins`
as a stable, enabled feature, so `--disable plugins` / `-c features.plugins=false` is a
supported one-off **plugin-feature** override on that version. The
[config reference](https://learn.chatgpt.com/docs/config-file/config-reference) separately
documents `features.remote_plugin=false` for the remote catalog,
`plugins.<plugin>.enabled=false` for a named local-marketplace plugin,
`plugins.<plugin>.mcp_servers.<server>.enabled=false` for a bundled server, and
`mcp_servers.<id>.enabled=false` for a named direct server. The same reference lists
`features.plugins` under administrator requirements to pin managed availability; that placement
does not negate the generic CLI feature override. The documentation reviewed does not specify
that the one-off plugin flag prevents marketplace refresh, overrides workspace-managed plugin
state, or disables direct MCP servers. Per-plugin disablement does not override
workspace-managed enabled states, and marketplace refresh can still occur while a named plugin
is disabled. No documented single `-c` wildcard guarantees that every plugin and direct MCP
server from every layer is off. `--ignore-user-config` also removes only the named user file.

**Conceptual result for the rebind:** `--ignore-user-config` is a supported way to remove one
important source of ambient behaviour. Treating that single flag, or read-only/approval-`never`,
as proof of a closed tool environment would cross the documentation's evidence boundary. The
remaining testable question is which instruction, hook, plugin, MCP, and notification surfaces
actually load in the intended `exec` and `exec resume` processes on the selected release.

## Free-play harvest — associations, not findings

The entry material was the merged experiment record alongside the official documentation
linked in this note. The time-box was this documentation pass; this note is the capture surface.

- **Kept:** The removed MCP server and the surviving external-MCP client look like a reversal of
  direction. It suggested drawing the direction of every connection before selecting a carrier.
- **Kept:** A queued user-role notice and App Server's `toolOutput` look like two ways for external
  events to enter a thread. It suggested separating the *wake* from the *event data* and asking
  which role each appears under. This is an association; their safety or equivalence is unproved.
- **Kept:** The Python SDK's bundled runtime and the owner's latest preference look like a
  release-management problem as much as an API problem. It suggested recording the executable
  actually used alongside each probe result.
- **Discarded after a second look:** Remote TUI over WebSocket means `codex queue` will wake an
  agent across machines. The App Server docs describe a remote TUI connection, not this CLI
  queue's routing or persistence. The analogy supplies no evidence for that claim.

## Concept exploration

### 1. Raw observations

The merged note measured one-shot and multi-turn `exec`, removal of the MCP server, and several
local queue states. Official documentation confirms the removal and documents three different
ways to control Codex: CLI `exec`, SDK, and App Server. It also documents hook interception with
named gaps. The local estate has an experimental dialogue binding that uses the removed server,
an active-turn comms relay, and only a SessionStart Codex hook.

### 2. Problem frame

"Codex support" spans distinct jobs: invoke a bounded second opinion, continue a dialogue,
alert a live seat, preserve event authorship, and enforce local tool policy. A carrier selected
for one job does not automatically supply the others. The immediate broken interface is the
stdio MCP dialogue binding. The larger design risk is treating a successful turn start as proof
of safe role, authority, liveness or release behaviour.

### 3. Changed assumptions

- The MCP break needs a protocol choice, not a command substitution. Direct `exec` remains a
  documented CLI option; the SDK is a documented automation option; App Server serves deeper
  clients. Their relative fit remains to be tested against the Practice contract.
- A notification can be fixed controller-authored text while the seat reads canonical comms
  itself. This is a plausible way to keep peer-authored bytes out of user-role input when using
  the observed queue primitive. It is a **proposal**, not a proven bridge.
- [App Server `turn/start.toolOutput`](https://learn.chatgpt.com/docs/app-server) persists output
  as `functionCallOutput`, and queues it for an active turn. That is a possible role-preserving
  event carrier for a custom client, not an established idle-wake carrier. The docs do not show
  that it wakes an idle TUI, survives exit, preserves the Practice's event provenance, or is
  available to this seat. The deferred idle-wake sketch (`codex-app-server-idle-wake`, archived 2026-09-25)
  explicitly rejects public `turn/start` for automatic wake: a concurrent owner submission can
  turn the wake into same-turn steering. It requires an atomic idle reservation, owner-priority
  fence and capability profile confined to that one wake turn. This sketch is not a ratified
  implementation mandate, but its failure analysis is relevant to every wake candidate.
  `thread/inject_items` persists items without starting a user turn; it is not itself a wake
  claim. `turn/steer` applies only to an active turn and appends **user** input.
- Hooks offer a candidate local guard for supported tool calls. Their documented coverage makes
  a blanket "Codex guard complete" claim false even if such a hook is installed.

### 4. Proposals and falsifiers

1. **Compare dialogue carriers against one Sif contract.** Start with direct `exec`/`resume`
   because it worked locally and is documented. Compare the SDK only where its thread API buys
   a concrete custody or event advantage. Keep App Server as a separate, experimental deeper
   client option. A carrier fails if it cannot preserve multi-turn continuity, bounded authority,
   identity/custody, and a stable output record on the installed latest release.
2. **Keep a wake probe separate from an event-provenance probe.** For `codex queue`, test a fixed
   controller-authored notice with no peer text, then read the canonical comms event in the
   awakened seat. Test atomic owner priority at an idle boundary, what happens throughout an
   automatic wake turn if the owner submits input, capability confinement, crash/forced-exit
   recovery and remote routing before depending on it. The bridge fails if a peer event appears
   as user-role input, an owner submission is steered into the wake turn, wake capabilities
   persist into the owner's turn, or an expected alert is silently lost.
3. **Treat App Server tool output as a role probe only.** If a richer client is justified, a
   small read-only probe could check whether `turn/start.toolOutput` starts an idle turn, how it
   behaves during an active turn, and whether the event retains a tool-output role through
   resume. A passing role probe would not qualify it for automatic wake: the deferred wake
   sketch rejects public `turn/start`, and a qualifying carrier would also need atomic idle
   reservation with owner priority throughout the wake turn and a non-sticky, turn-local
   capability profile. Without a supported way to establish those properties, this candidate
   stops at transport characterization. The App Server's experimental support status remains a
   product risk even if a later mechanism meets the wake contract.
4. **Treat a Codex `PreToolUse` guard as a bounded coverage improvement.** First map required
   command/content rules to the documented interceptable tools, then probe deny, rewrite,
   failure and continuation behaviour on the latest runtime. It fails as a complete guard if
   any required action travels through a documented uncovered path; the existing identity hook
   is no proof of command guard coverage.
5. **Record effective version and authority at every point-of-use probe.** Check the running
   executable, its generated protocol schema where relevant, loaded user configuration and
   rules, model and effort, enabled tools, thread settings, and observed denied write. This fits
   the owner's latest-runtime preference while keeping evidence tied to what actually ran. It
   fails if a probe's passing result can no longer be attributed to the executable and settings
   used for the real call.

These are candidate investigations. This pass performed no new Codex runtime experiment and
made no change to the Sif binding, watcher, hooks, or review gates. The next implementation
decision should be made against the relevant proposal's acceptance evidence, not the existence
of a documented API.

## Open evidence and source links

- Does a later SDK release's bundled CLI meet the owner's use-latest requirement, or should any
  SDK adapter set `codex_bin` to the installed latest executable?
- Does `codex queue` expose a documented supported contract beyond the observed 0.156.1
  behaviour? In particular, what happens across a crash, a remote endpoint, and owner typing?
- Would App Server's tool-output path actually meet the Practice wake and event-authorship
  contract, including atomic reservation and turn-local authority, or should it remain only a
  role-semantics observation? Is its experimental status proportionate for that job?
- Which Codex action paths that matter to this repository fall outside `PreToolUse`?
- After the documented user-config and rules files are skipped, which authentication,
  instruction, hook, MCP/plugin, notification, model and effort settings are **actually
  effective** in the intended `exec` and resumed turns? The four-question follow-up above
  establishes the documented boundary, not this release-specific inventory.

Primary documentation reviewed: [MCP server removal](https://learn.chatgpt.com/docs/mcp-server),
[non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode),
[sandboxing and rules](https://learn.chatgpt.com/docs/sandboxing),
[Codex SDK](https://learn.chatgpt.com/docs/codex-sdk),
[App Server](https://learn.chatgpt.com/docs/app-server), and
[hooks](https://learn.chatgpt.com/docs/hooks).
