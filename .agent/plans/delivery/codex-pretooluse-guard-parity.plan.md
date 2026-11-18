---
id: codex-pretooluse-guard-parity
node_type: delivery
name: "Codex seats run the PreToolUse policy guard"
overview: "A Codex team seat's shell and file-edit calls pass through the same PreToolUse policy guard a Claude seat's do, rendered for Codex's own hook contract, so a refusal is a refusal on either platform and no guard failure becomes a silent allow."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: agent-platform-citizenship
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-24
---

# Codex seats run the PreToolUse policy guard

## Goal

A Codex seat in a team session runs under the same policy guard as a Claude seat. Before a
shell command or a file edit runs, the guard reads it and allows it, or refuses it with its
reason, from the one canonical policy. A guard that is missing, broken or cannot decide never
turns into a silent allow. This is the second step of the Codex membership programme under
`agent-platform-citizenship`, after `codex-queue-wake-bridge`.

## Why this step, and why this shape

- **Today a Codex seat runs unguarded.** The repository's `.codex/config.toml` wires one hook,
  `SessionStart` (the identity hook). A Claude seat routes `Bash`, `Edit` and `Write` through
  `.claude/hooks/run-pretooluse-guard.mjs` to `agent-tools/dist/src/hook-policy/pre-tool-use-dispatch.js`.
  So the policies that refuse, for example, a commit to `main` or a destructive git command on a
  Claude seat do not run on a Codex seat. The seat's own discipline is the only guard.
- **The ratified guard plan left this open.** `claim-freshness-and-guard-degraded-states`
  (ratified 2026-08-11) names "Codex PreToolUse enforcement vertical" under Out of scope. No
  node owns it.
- **The vendor contract fits, with three differences that matter.** Read from codex-cli 0.156.1
  source (`codex-rs/hooks`, `codex-rs/core/src/tools`) on 2026-09-24:
  - The input carries `tool_name` and `tool_input`, beside `session_id`, `turn_id`, `cwd`,
    `model`, `permission_mode`, `tool_use_id` and `transcript_path`
    (`pre-tool-use.command.input.schema.json`).
  - Shell tools serialise as `Bash` (`HookToolName::bash`). `apply_patch` serialises as
    `apply_patch`, with `Write` and `Edit` as matcher aliases (`hook_names.rs`). So the Claude
    matchers select both tools; the payload names differ.
  - A refusal is `hookSpecificOutput.permissionDecision: "deny"` with a non-empty reason, or exit
    2 with a reason on stderr. Any other exit code fails the hook and the tool runs: this fails
    open, as Claude's harness does, so the existing shim's fail-closed handling still applies.
  - **Difference 1:** `permissionDecision: "allow"` without `updatedInput` is refused as
    unsupported. The hook is marked failed and the tool runs. The Claude renderer answers every
    allowed call that way, so a direct port would log a hook failure on every allowed call.
  - **Difference 2:** `permissionDecision: "ask"` is refused as unsupported, and the tool runs.
    The ratified degraded state answers a guard that cannot decide with "ask". On Codex that is
    a silent allow, which that plan forbids.
  - **Difference 3:** `continue: false`, `stopReason` and `suppressOutput` are refused as
    unsupported in a `PreToolUse` output.
  - Code mode's nested tool calls are submitted through the same tool runtime and registry
    dispatch that runs `PreToolUse` (`code_mode/delegate.rs`, `parallel.rs`, `registry.rs`). This
    is read from source, not yet observed.
- **First-class means the platform's own contract.** The policy is shared. The rendering is
  Codex's, as the Copilot port rendered for Copilot's string-form `apply_patch` payload
  (2026-07-25).

## User groups and value

- **The owner**: a Codex seat is held to the same refusals as every other seat, so admitting
  one to a team session does not widen what a seat can do.
- **Team seats of any platform**: a shared rule, such as never committing to `main`, holds
  whichever platform a peer runs on.
- **Claim boundary**: the guard reads the calls Codex routes through its hook. A call that
  reaches no hook, if code mode or a future tool has one, is beyond it. The probe settles code
  mode for 0.156.1.

## Mechanism

1. **One policy, a renderer per platform.** The dispatch's canonical `PolicyDecision` is shared.
   A Codex renderer maps it to Codex's contract:
   - allow is exit 0 with empty output;
   - deny is `permissionDecision: "deny"` with its reason;
   - the degraded state, which asks on Claude, denies on Codex, with the degraded reason and the
     same durable log line.
2. **A Codex input adapter.** It parses Codex's payload strictly: the fields above, `Bash`'s
   `tool_input`, and `apply_patch`'s patch document through the existing `apply_patch`
   structural parser. Any other tool is out of the guard's matchers.
3. **A thin Codex hook adapter,** under `.codex/hooks/`, rooted at the repository top the way
   the `SessionStart` hook is. It routes through the same fail-closed shim logic: a built but
   broken guard blocks, and a guard that is not built fails open into
   `.codex/logs/hook-errors.log` (ADR-167). That fail-open is visible only through the log write.
   The shim swallows a failed log write so the verdict never changes, and a host may hide stderr
   on exit 0. So a not-built guard whose log write also fails is an unobserved allow. The node
   names that residual rather than claiming every not-built allow is observable.
4. **The wiring.** `[[hooks.PreToolUse]]` entries in `.codex/config.toml` with matchers `Bash`
   and `Edit|Write`, which select `apply_patch` through its aliases, as synchronous handlers.
   The routing validator (`validate-pretooluse-guard-routing`) extends to `.codex/config.toml`,
   so a hook that bypasses the shim fails the gate.

## Acceptance criteria (each with a proof — required)

- **A refused command is refused on Codex, on each host.** A command the policy denies, such as
  a commit to `main`, is blocked on a Codex seat with the policy's reason. Proof: `repo-safe`,
  renderer and adapter tests over literal Codex payloads and decisions; `owner-held`, a dated
  live run on the then-latest CLI, recorded separately for the ChatGPT desktop app and for a TUI
  in an editor terminal.
- **An allowed call runs, and logs no hook failure.** Proof: `repo-safe`, the renderer's allow
  output is empty; `owner-held`, the live run's hook status reads completed, not failed.
- **No failure is a silent allow, except the one residual named.** A degraded guard denies on
  Codex; a broken built guard blocks; a guard that is not built fails open with a log line.
  Proof: `repo-safe` tests over each path, the normal log path included. The residual, a
  not-built guard whose log write fails, is stated in the node and the guard's doctrine.
- **File edits are guarded.** An `apply_patch` the content policy refuses is blocked. Proof:
  `repo-safe` tests over literal patch documents; `owner-held`, the live run.
- **Code mode is guarded, or the gap is named, on each host.** Proof: `owner-held`, a live run
  on each host that supports code mode, in which a code-mode program makes a refused shell call,
  recorded with the hook's outcome. If a path bypasses the hook, the parity claim is bounded to
  the paths shown, and the node returns to the owner before any wiring.
- **The wiring cannot drift.** Proof: `repo-safe`, the routing validator over `.codex/config.toml`.

## Todos

1. **Probe the contract on each host**, under the owner's standing permission for Codex
   experiments: a disposable, read-only session per host, never unlimited permissions, every
   process closed, the CLI version recorded. The hosts are the ChatGPT desktop app and a TUI in an
   editor terminal. The 0.156.1 source's registry path does not show how the desktop host routes
   its calls. On each host, a logging hook records Codex's real payloads for `Bash`,
   `apply_patch` and a code-mode nested shell call where the host supports one, and a harmless
   refused command and a refused patch are recorded with the hook's outcome. The findings are a
   dated addendum to the Codex support concept note. If a path bypasses the hook, the parity claim
   is bounded and the node returns to the owner before slice 2.
2. **The Codex renderer and input adapter**, test-first, over the probe's recorded payload
   shapes. Reviews: code-expert before and after; test-expert and security-expert, focused.
3. **The hook adapter, the wiring and the validator**, with the live run recorded. The guard
   doctrine (ADR-167's platform list, the degraded-state plan's porting note) names Codex.

## Out of scope

- New policies. This node ports the existing policy set; a Codex-specific rule is its own node.
- Codex's `PostToolUse`, `PermissionRequest` and `UserPromptSubmit` hooks.
- The wake bridge (`codex-queue-wake-bridge`) and the live acceptance seat, sibling nodes.
- `updatedInput` rewriting. The guard only allows or refuses.

## Review dispositions

- **2026-09-24, Luna stirs Radiance (01a0d3), the co-owner** (the pairing channel, 16:43:00Z).
  The shared policy with a Codex renderer was confirmed as the right mechanism. Accepted and
  folded in:
  - Each host is probed and proven separately. The live Codex seat runs its shell through code
    mode (`functions.exec` wrapping `exec_command`). The CLI source does not prove the desktop
    host routes those calls through `PreToolUse`. Folded into todo 1 and two acceptance
    criteria.
  - The not-built fail-open depends on a durable log write that the shim may swallow, and on
    stderr a host may hide. It is named as a residual in mechanism 3 and the acceptance criteria.
