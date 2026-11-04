# Cross-Platform Agent Surface Matrix

Operational truth for supported and unsupported agent platform mappings
in this repository. When the Practice Core or local docs reference
platform support, this file is the authoritative local source.

For what each platform itself supports, the platform's **official
documentation is the only source of truth** — feature support varies by
platform and changes rapidly, and in-repo adapter shapes (including this
matrix's rows) reflect when they were written, not necessarily what the
platform currently supports or requires. Before asserting that a feature
exists or that an adapter shape is correct on platform X, check the
current official docs; never generalise across platforms or treat in-repo
precedent as a substitute.

## Copilot CLI: Target Versus Wired

The owner-ratified target is **GitHub Copilot CLI running locally** as an equal
first-class Practice citizen. A target row is not an implementation claim.
GitHub Copilot coding-agent/cloud-execution-specific delivery is outside this
matrix's Copilot scope. Shared repository projections still cover local and
cloud Copilot.

**Parity is the target.** Canonical behaviour and abilities remain available
across vendors wherever each platform exposes an equivalent mechanism; only an
evidenced platform limit justifies divergence.

| Surface | Ratified local-CLI target | Wired and proven in this repository |
| --- | --- | --- |
| Identity | Native `sessionStart` adapter returns honest Copilot identity through `additionalContext` | **No** — canonical identity types and persistence do not yet admit Copilot |
| Deliberate team join | Native bootstrap is useful alone and creates no shared coordination state; any working session, quick-start included, must register a bounded active claim before its first edit under the always-loaded [`register-active-areas-at-session-open`](../../rules/register-active-areas-at-session-open.md) rule, whichever start-right skill ran; `start-right-team` adds only *continuous* team participation — heartbeat emission, the all-channels watcher, and the handoff/retirement lifecycle | **No** — no Copilot launcher or joined/non-joined proof |
| Repo instructions | `.github/copilot-instructions.md` imports `AGENT.md`, giving local and cloud Copilot the full canonical rule set | **Partial** — the file links to `AGENT.md`; validated native import and parity proof remain targets |
| Path-scoped instructions | Generated `.github/instructions/**/*.instructions.md` projections, each with an explicit `cloud-shared` or `cloud-excluded` intent and, where excluded, the documented `excludeAgent: "cloud-agent"` frontmatter — see the `excludeAgent` note below for what that does and does not achieve | **No** |
| Skills | Use `.agents/skills/` under documented `.github/skills` → `.agents/skills` → `.claude/skills` first-found precedence | **Partial** — the portable wrappers exist; clean local Copilot CLI discovery/invocation is not yet an acceptance gate |
| Custom agents | Generated, schema-valid, cloud-safe `.github/agents/*.agent.md` projections from canonical specialists, with `disable-model-invocation: true` unless automatic cloud selection is separately accepted | **No** |
| Policy hooks | Existing inherited PascalCase `PreToolUse` activation feeds exactly one closed Claude/Copilot dispatcher and one canonical policy evaluation | **Partial** — the inherited activation and guards now evaluate Copilot CLI 1.0.75 string-form `apply_patch` payloads with explicit allow/deny decisions; the ratified closed dispatcher, complete schemas, per-host rendering, and acceptance proof remain unwired |
| Settings | `.github/copilot/settings.json` only for documented, tested project settings | **No** |
| Repository MCP | Establish a canonical secret-free server manifest from total dispositions over tracked platform candidates, then generate the Copilot repository projection | **No** — no canonical manifest or tracked Copilot projection exists |
| Communications | Existing local comms substrate plus native wake, re-arm, drain recovery, handoff, and retirement | **No** — the substrate exists, but no Copilot notification/lifecycle projection is wired |
| End-to-end proof | Fresh-checkout validators plus a live local Copilot CLI acceptance run | **No** |

**`excludeAgent` note** (GitHub's repository custom-instructions documentation,
verified 2026-07-25): the keyword accepts exactly one value — `"cloud-agent"`
excludes the Copilot cloud agent, `"code-review"` excludes Copilot code review
— and no array, comma-separated, or repeated-key form is documented. Whichever
value is set, the other surface still reads the file, so a projection marked
`cloud-excluded` is not local-only: Copilot code review continues to read it.
That is a dated fact about the platform, not a gap in this repository's
generator. The `cloud-shared`/`cloud-excluded` labels in the row above record
our intent and the marker emitted for the supplemental modular copy, never a
proven outcome or exclusion of canonical behaviour. The root `AGENT.md` import
still supplies every canonical rule to local and cloud Copilot. Per this file's
preamble, this capability claim expires: re-check the current official
documentation before relying on it.

In OCE the `agent-platform-citizenship` strategic node (formerly
`first-class-copilot-cli-practice-citizenship`) and its serving delivery plans
are authoritative for target and mechanism, with MCP-150, MCP-154, MCP-155 and
MCP-156 as supplementary Linear projections for execution state and sensitive
details; jimcresswell.net carries the target in this matrix alone.

## Adapter Families

| Surface        | Cursor              | Claude Code                                            | Gemini / Antigravity CLI                          | GitHub Copilot CLI                                   | Codex                                                    | `.agents/`             |
| -------------- | ------------------- | ------------------------------------------------------ | ------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------- | ---------------------- |
| **Skills**     | `.agents/skills/`   | `.claude/skills/`                                      | `.agents/skills/`                                 | `.agents/skills/` exists; acceptance target above    | `.agents/skills/oak-*/` loaded as native Codex skills    | `.agents/skills/`      |
| **Commands**   | retired; workflows use `.agents/skills/` | retired; workflows use `.claude/skills/` | `review-*.toml` transitional reviewer adapters only; workflows use `.agents/skills/` | no separate command projection | built-in slash commands; repo workflows use skills | repo workflows use `.agents/skills/oak-*/` |
| **Rules**      | `.cursor/rules/`    | `.claude/rules/`                                       | entry-point chain only                            | full canonical rule chain via `AGENT.md`; supplemental modular projection target | entry-point chain; project exec-policy rules in `.codex/rules/` allow the landing commands | `.agents/rules/`       |
| **Sub-agents** | `.cursor/agents/`   | `.claude/agents/`                                      | native `/agents` upstream; no repo wrappers wired | native custom agents documented; repo target unwired | `.codex/config.toml` → `.codex/agents/*.toml`             | unsupported            |
| **Hooks**      | canonical policy guard unsupported; `.cursor/hooks.json` has tracked soft `sessionStart` identity | `.claude/settings.json` (tracked soft `SessionStart` identity, `PreToolUse` guards, and a never-blocking `PreCompact` observer) | supported upstream; no project-local hook wired | native hooks documented; Copilot-only adapters target unwired; content policy uses inherited activation | tracked project `SessionStart`; no `PreToolUse` guard | unsupported |
| **MCP**        | user-local          | user-local / MCP config                                | supported upstream; no `.agents/mcp_config.json` wired | repository config documented; tracked projection target | two tracked project servers in `.codex/config.toml`       | `.agents/mcp_config.json` target |

## Hook Support

Claude Code currently has a soft native `SessionStart` identity adapter plus
native `PreToolUse` activation for Bash, Edit, and Write calls via the tracked
project `.claude/settings.json`. The command and content guards are backed by
the canonical policy in `.agent/hooks/policy.json` and a single prebuilt
dispatcher artefact `agent-tools/dist/src/hook-policy/pre-tool-use-dispatch.js`
shared by all three matchers, invoked through the verdict shim
`.claude/hooks/run-pretooluse-guard.mjs` so a built-but-broken artefact blocks
the tool call (exit 2), while a not-built artefact fails open (exit 0) with a
loud, logged warning so a fresh checkout is not bricked — well within the
per-tool-call hook timeout. The same file registers a never-blocking
`PreCompact` observer (`agent-tools`' `claude-pre-compact-observe-hook`, through
the `.claude/hooks/_lib/log-hook-errors.sh` wrapper; jimcresswell.net runs it
from the TypeScript source, OCE from the prebuilt `dist` artefact). It is an
observer, not a guard: it has no key in the canonical policy, never blocks a
compaction, and appends what the harness sends at each compaction to a
machine-local, owner-only log,
`.claude/logs/pre-compact-observe/observations.jsonl`. Local additive
overrides, when needed, live in `.claude/settings.local.json`.

The contract the observer saw at its first real compaction is recorded here
because the harness documentation disagreed with itself; it was seen on
2026-09-16 with Claude Code 2.1.273 installed, so re-observe it after a harness
upgrade:

- **Payload** of a bare `/compact`: `session_id`, `transcript_path`, `cwd`,
  `scratchpad_dir`, `prompt_id`, `hook_event_name: "PreCompact"`,
  `trigger: "manual"` and `custom_instructions: null`.
- **Environment**: `CLAUDE_PROJECT_DIR`, `CLAUDE_CODE_SESSION_ID`,
  `CLAUDE_CODE_ENTRYPOINT`, `CLAUDE_CODE_CHILD_SESSION`,
  `CLAUDE_CODE_SESSION_ATTENDED` and `CLAUDE_PID` are present;
  `PRACTICE_AGENT_SESSION_ID_CLAUDE` is not.
- **Response**: JSON stdout is validated against top-level fields only
  (`continue`, `suppressOutput`, `stopReason`, `decision`, `reason`,
  `systemMessage`, `terminalSequence`); a `hookSpecificOutput` fails validation,
  because there is no `PreCompact` variant.
- **Exit codes**, from the event table in the installed binary and not yet
  observed: 0 appends stdout to the compaction as custom instructions, 2 blocks
  the compaction, and any other code shows stderr to the user and continues.

Status by platform:

- **Claude Code**: tracked project `.claude/settings.json` activates a soft
  `SessionStart` identity adapter and `PreToolUse` command/content guards for
  Bash, Edit, and Write through the single dispatcher artefact, plus the
  never-blocking `PreCompact` observer described above.
- **Cursor**: tracked project `.cursor/hooks.json` activates a soft
  `sessionStart` identity adapter. The canonical command/content policy is not
  activated for Cursor, and this Codex-focused research pass did not reassess
  Cursor's broader current upstream event set.
- **Gemini / Antigravity CLI**: native hooks are documented through
  `hooks.json` under the workspace `.agents/` directory or global config, with
  `PreToolUse`, `PostToolUse`, `PreInvocation`, `PostInvocation`, and `Stop`
  events. This repository has no project-local `.agents/hooks.json` wired.
- **GitHub Copilot CLI**: native hooks are documented, including
  `sessionStart`, `preToolUse`, `notification`, `agentStop`, and `sessionEnd`.
  This repository has no native `.github/hooks` activation wired. For MCP-150
  content enforcement, the ratified target is the existing inherited PascalCase
  `.claude/settings.json` `PreToolUse` activation feeding an exact-one
  Claude/Copilot dispatcher, not a second GitHub activation. That activation
  now feeds the wired canonical core and dispatcher: the
  `copilot-compat-string` route evaluates the raw string-form `apply_patch`
  payload observed live on CLI 1.0.75 (2026-07-25) with explicit allow/deny
  decisions. The Copilot-native renderer, supported-version capability probe,
  complete schema acceptance, and end-to-end proof remain unwired. The earlier
  reading — that the inherited hook receives an incompatible shape and is a
  blocking defect — described CLI 1.0.74 and no longer holds.
- **Codex**: lifecycle hooks are stable in Codex CLI `0.145.0`. The tracked
  `.codex/config.toml` enables hooks and registers a soft `SessionStart`
  identity-context adapter. The official event surface includes
  `SessionStart`, `SessionEnd`, `SubagentStart`, `SubagentStop`, `PreToolUse`,
  `PermissionRequest`, `PostToolUse`, `PreCompact`, `PostCompact`,
  `UserPromptSubmit`, and `Stop`. The repository does not yet activate the
  canonical command/content guard on Codex `PreToolUse`.

The Codex product claims and event list above inherit their version pin,
source-authority boundary, and evidence grades from the Codex CLI capability
catalogue kept in OCE.

## Platform Liveness Declaration (PDR-133 §8)

Any agent platform admitted to team operation carries a **Platform Liveness
Declaration**: for every liveness class in
[PDR-133](../../practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md)
§2–§3 (the class set lives there — this matrix never restates it), one of
three answers, each established by dated first-hand observation at a stated
platform version: the certifying primitive with its observed latency; a
**cannot-certify** with the substituting proxy named as a requirement of that
platform's participation; or **certified-but-contract-suspended**, naming the
suspending contract clause. Rows in the never-self-certifiable set (`NOTIFY`,
`LOOP`, `ABSORB`, `CAPABILITY`, `PROGRESS`) need an external observer. Rows
expire when the platform version moves. This section is the declaration's
recording home; PDR-133 §8 holds the binding disciplines.

**Transition state (per PDR-133 §8 Transition — citizenship is unconditional
throughout):** every platform already in operation carries the declaration as
a **named landing owed**, authored at the first liveness question that
platform raises or at a dated backfill. No platform has a complete
declaration set yet. Dated observations already on record:

- **Slack Watcher organ (Slack channel + cloud-harness reminder
  substrate) — full 14-class declaration, 2026-08-24**: recorded
  skill-locally for operational reading in
  `slack-watcher` §6 (authored in OCE; carried to jimcresswell.net on
  2026-10-03) (this ledger points, never restates). Headline rows: `NOTIFY`
  cannot-certify (no dated externally observed wake on record; a
  self-bind reminder records no run history), proxy = the tenure
  status message's staleness; `EMIT` = that status message edited
  every tick. Authored by the 2026-08-24 Watcher estate review.
- **GitHub Copilot CLI 1.0.75 — `NOTIFY`: cannot-certify** (observed
  first-hand 2026-07-25 by the Copilot seat, surfaced externally by the
  owner; PDR-133's founding instance). The detached-bash primitive wakes the
  harness only on process COMPLETION, so a persistent watcher is
  delivery-live and notification-dead by construction. Substituting proxy —
  a short-interval (~1 min) comms poll with its own cursor — is a **named
  requirement** of Copilot seats' team participation, not an optimisation
  (MCP-156 owns the durable cure).
- **Codex CLI 0.146.0 — `NOTIFY`: NOT certified; ACTIVE-TURN ALERT
  certified for the watcher → relay → root composition** (row narrowed
  2026-08-02 by owner-carded doctrine pass, re-observed at the SAME
  version per PDR-133 discipline 5). The 2026-07-29 external-observer
  certification stands as evidence for its path: root **Europa stirs
  Void** was woken through watcher → relay → root by directed event
  `b6a4103c-e7fe-4ac6-9447-0a102d55dbbd` from **Lynx guards Whisper**
  (`2026-07-29T11:43:23.686Z`; corroborated by
  `0a84b103-873d-495c-8aeb-e4d93ecea97c`; `agent-tools 0.1.0`; relay
  watcher-output waits ≤30s). Two later first-hand boundary probes
  (2026-07-31 capability census, 19:14Z: Fulmar's post-final child
  send; Cormorant's blind bounded-poll challenge) showed
  `collaboration.send_message` delivers promptly into an ACTIVE root
  turn but does NOT start a turn on an IDLE root — and PDR-133 defines
  `NOTIFY` independently of `LOOP`, so a mechanism requiring the loop
  already running cannot certify that class. Per PDR-133 discipline 4,
  the substituting proxy is a **named requirement** of Codex seats'
  participation: bounded foreground polling plus the post-restart gap
  sweep, with the relay retained as the active-turn alert mode. Native
  idle activation stays deliberately deferred (owner ruling 2026-08-01;
  independently corroborated by the event-driven-wake inquiry,
  `agent-tools-operational-criticality-event-driven-wake-inquiry-2026-08-01.md`).
  The operational procedure lives in
  [`use-monitor-for-event-driven-wake` § Codex active-turn alert](../../rules/use-monitor-for-event-driven-wake.md#codex-notify-session-relay).
- **Claude Code 2.1.220 — `NOTIFY`: certified for the armed-Monitor
  path** (observed first-hand 2026-07-30 at the receiving implementer
  seat Possum weaves Midnight; external observers the sitting Directors
  — Bora binds Thermal received the primary reply, Falcon hunts Flight
  the corroborating one; MCP-393 slice A). Directed event
  `12294923-d059-440c-aefc-b35b11d5623e` (a Director route, created
  06:11:57Z) woke the receiving seat's reasoning loop through the
  canonical `comms watch` running under the Monitor primitive, with no
  manual poll and no user prompt — the host acceptance test named in
  [`use-monitor-for-event-driven-wake`](../../rules/use-monitor-for-event-driven-wake.md)
  §"The liveness class this rule owns". The external observation is the
  Director-received content-bearing reply
  `640d0a82-3a72-4a79-a935-72d4fd1f4019` at 06:12:30Z (+33 s; per
  PDR-133 §6 instrument 2 a content-engaging reply certifies the whole
  path the challenge traversed). Corroborated same-day by a second
  exchange (`3f1348b6-9641-4181-9d79-ea15a826ac80` → threaded reply
  `1eaa4d16-5b12-4c4b-b429-cc73c61f4883`, ~138 s). The certification is
  **path-scoped** per PDR-133 §4: it covers a seat whose watcher is a
  live Monitor task and is evidence about nothing else — the
  absorption-dark instances below are the same platform with that path
  lapsed.
- **Claude Code 2.1.220 — `ABSORB`: cannot-certify** (recorded
  2026-07-30 per MCP-393's definition of done). No Claude Code primitive
  certifies absorption (`ABSORB` is never-self-certifiable, PDR-133 §5,
  and the platform ships no external-observer machinery for it); three
  dated instances on 2026-07-29 show the failure shape — seats
  process-alive and EMIT-fresh (240 s heartbeats) whose directed events
  went unabsorbed for 17–40+ minutes, each cured by a hand-delivered
  unblock (~16:34Z, a handover instruction absorbed only at the hourly
  sweep; ~17:07–17:40Z, three directed events plus a deadline unread
  ~40 min; 20:47–21:04Z, a merge broadcast unabsorbed ~17 min, unblock
  re-delivered as directed event `ac509d4e` — the one instance whose
  event identifier the founding record preserved). Mechanism
  deliberately unattributed — candidate mechanisms are separately
  attested with their own dates in the watcher rule (the
  plain-background-shell re-arm, 2026-07-25) and the heartbeat rule
  (harness-suspension emitters, 2026-07-20/21). The founding records
  label these instances NOTIFY-dark; the class-honest filing per
  PDR-133 §4 is absorption-absent with mechanism unattributed, since
  `NOTIFY` and `LOOP` failures are indistinguishable from outside. The
  **substituting proxy, a named requirement of Claude Code seats' team
  participation**: the ACK-REQUESTED absorption-ack convention plus the
  outstanding-challenge read in
  [`directed-routing-requires-absorption-ack`](../../rules/directed-routing-requires-absorption-ack.md)
  (MCP-393 owns the durable cure; its slice B adds the mechanical read
  surface). Residual exposure, both halves named: the proxy detects
  absorption-absence at its threshold but cannot wake the seat; and it
  covers DIRECTED challenges only — the third founding instance was a
  BROADCAST whose relevance went unabsorbed, a shape the ack convention
  does not reach and the consumer-side lane-state-from-PR/merge-truth
  discipline covers instead.
- **Claude Code 2.1.220 — every remaining class: explicitly unverified**
  (PDR-133 §8 discipline 2; recorded 2026-07-30 to complete a compliant
  first declaration set). `DISPATCH`, `SUBSTRATE`, `PROCESS`, `BINDING`,
  `CURSOR`, `INTEGRITY`, `DELIVERY`, `LOOP`, `CAPABILITY`, `EMIT`,
  `REGISTRY`, `PROGRESS`: no dated deliberate observation on record for
  any of them on this platform version — the watcher/heartbeat rules
  define check surfaces for several, but a check surface is not a dated
  observation, and rows are never inferred from ambient traffic. Named
  backfill: the MCP-393 slice-B observation pass (ticket MCP-393), which
  exercises the seen-set, sidecar, and heartbeat surfaces these rows
  need.
- **Codex's other liveness classes, Cursor, and Gemini/Antigravity —
  declaration rows owed.** The certified rows above cover the named
  classes on the named paths only.

## Policy Spine

This repo's hook and adapter surfaces follow a small Policy Spine:

| Layer | Role | Can It Override Higher Layers? |
| --- | --- | --- |
| Canonical policy (`.agent/`) | Declares intended behaviour and support | No |
| Native activation (tracked `.claude/settings.json`, `.cursor/hooks.json`, and `.codex/config.toml`) | Activates the supported platform-specific policy or context path in the repo baseline | No |
| Workspace runtime (`agent-tools/dist/src/hook-policy/pre-tool-use-dispatch.js` through the Claude shim, shared by the Bash, Edit, and Write matchers; agent-tools identity adapters through the Cursor and Codex shims) | Enforces the Claude guards and supplies soft Cursor/Codex identity context without duplicating canonical substance | No |
| Explanatory mirrors (this matrix, hook README) | Describe the live state and support contract | No |

Failure semantics:

- `override` — a higher-authority canonical layer wins over a lower mirror or activation hint
- `prune` — a missing native surface removes a local activation path without changing canonical intent
- `block` — validators or runtime enforcement reject an unsafe or incoherent state

## Entry Points

| Platform               | Entry File                                     |
| ---------------------- | ---------------------------------------------- |
| All platforms          | `.agent/directives/AGENT.md`                   |
| Claude Code            | `CLAUDE.md` → `AGENT.md`                       |
| GitHub Copilot CLI     | `.github/copilot-instructions.md` → `AGENT.md`; modular instructions supplement path context |
| Codex host             | `AGENTS.md` → `AGENT.md`                       |
| Gemini CLI             | `GEMINI.md` → `AGENT.md`                       |
| Linear coding sessions | `skills.md` → `AGENT.md`                       |

## Codex CLI: observed behaviour (from the records, 2026-07-31 to 2026-09-27)

Each line names the version it was read on. A line is an observation at that version, never a
contract: re-read it against the running CLI before a design rests on it.

- **Collaboration tools come in two surfaces** (the vendor's source, read 2026-07-31). V1 is
  `spawn_agent`, `send_input`, `resume_agent`, `wait_agent` and `close_agent`, deferrable under
  tool search. V2 is a direct `spawn_agent`, `send_message`, `followup_task`, `wait_agent`,
  `close_agent`, `list_agents` and `interrupt_agent`. With no explicit override, the model
  catalogue's `multi_agent_version` decides. A fresh `codex exec` root on CLI 0.146.0 showed V2
  and no `tool_search` (one probe; a session opened interactively was not probed). Two reported
  failure modes: a resumed thread keeps its older tool surface, and deferred V1 tools are
  unreachable where `tool_search` is unavailable. The vendor's public docs name only the V1
  vocabulary.
- **Config precedence** (0.156.1 source). A trusted project `.codex/config.toml` beats
  `~/.codex/config.toml`; only CLI flags and `-c` override it; there is no local override
  file, include or environment pointer. The project file applies only where the user config
  trusts the repository path. Each project hook needs a per-user `trusted_hash` in the user
  config. Only an MCP always-allow on a project server and `/import` write the project file,
  and `/import` re-emits the whole file.
- **`on-failure` is not a distinct approval policy** (0.156.1): `protocol.rs` reads it only as
  a deserialisation alias of `on-request`.
- **Rollout shapes** (codex-cli 0.157.1). Every successful function-tool output opens with the
  harness's header. An unfinished turn followed by a new one is the harness's normal shape
  (`TurnAborted`), not a defect. A sandbox denial detected after the process has exited emits
  no `CommandExecution` item (one instance). A reader whose record union was captured on
  0.157.0 failed closed on 0.157.1's `response_item.function_call`: an evidence reader follows
  the runtime's version.
- **The patch tool is offered under a read-only sandbox** (one recorded `codex exec` turn): the
  model may attempt `apply_patch`, and the refusal comes from Codex's policy check in the tool
  router, a layer a sandbox test does not exercise.
- **TUI queue behaviour without a daemon** (0.157.0, one run each, 2026-09-25): an idle TUI
  wakes on a queued message; typed input runs before a queued one; a message queued during an
  active turn runs after it; a queue to a killed TUI is accepted and runs only on an explicit
  resume. In managed-daemon mode, a sandbox denies the PID-recording `ps` call and the daemon
  cannot start; outside a sandbox the daemon was healthy and the TUI exited within 25 seconds
  with no rollout. Desktop and editor-terminal hosts are unproven.
- **Codex's automatic approval reviewer can refuse a push**: the push then waits on the
  owner's explicit approval in that Codex session (one instance, September 2026).
- **The bounded-poll challenge** (a convention seats used with a Codex peer; from the comms
  record). To show that a Codex seat hears the stream, a peer posts an event carrying a nonce.
  The Codex seat must find it by its own declared foreground polling, with no relay. Its reply
  records the nonce, the timestamps, the command, the cadence, the state of its turn and what
  it did after its final message.

## Notes

- `.agents/skills/` and `.agents/rules/` are portable skill/command and
  rule-adapter layers, not evidence for blanket `.agents/` parity with
  every platform-native surface.
- Gemini / Antigravity CLI loads the repo's portable skills from
  `.agents/skills/`. The files under `.agents/rules/` are rule wrappers, not
  skills, and are not treated as a native auto-scan surface here unless a
  future verification proves that behaviour. Directory contents and
  `pnpm portability:check`, rather than frozen counts here, are authoritative.
- Antigravity plugins can bundle skills, agents, rules, MCP definitions, and
  hooks, but plugin bundle support is not the same as repo-local wiring.
- User-facing plugin packages (Claude Code, and ChatGPT/Codex) are product
  deliverables, not adapter families, built in oaknational/oak-ai-plugins;
  ADR-125 §Skill classes and validation jurisdiction governs them
  (2026-10-21).
- Tracked project platform config is part of the agentic system contract;
  local overrides are additive where the platform supports them.
- Unsupported states are written down explicitly rather than inferred
  from missing files.
- A rule adapter's `@` import path is written as the vendor documents it, relative to the
  importing file. Whether the platform expands it at launch stays a prediction until a fresh
  session has been seen to do so; record that observation with its date.
- Linear coding sessions run through Claude Code or Codex and inherit
  those entry-point chains; the root `skills.md` is supplementary
  guidance Linear Agent can use during a delegated session (per
  [Linear's coding-sessions docs](https://linear.app/docs/coding-sessions),
  verified 2026-07-13). Linear has no adapter-family or hook surface
  in this repo.
- Portable does not mean symmetrical: each platform has different native
  capabilities and the matrix records what is actually wired.
- Copilot CLI target surfaces are governed by
  PDR-009
  and the linked plan estate; the target table above must not be collapsed into
  an unsupported/supported binary before live acceptance.
