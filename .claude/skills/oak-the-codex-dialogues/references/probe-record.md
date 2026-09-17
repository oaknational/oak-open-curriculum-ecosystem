# Probe record — `codex mcp-server` binding (Sif Annex A)

This record is the durable contract evidence for the binding (the
vendor's MCP reference has drifted; the probe against the installed CLI
is the source of truth). The version pin below is machine-read by
[`scripts/probe-codex-mcp-server.mjs`](../scripts/probe-codex-mcp-server.mjs)
(anchored line match) and by the lockstep test in `agent-tools`; the
skill's dialogue-open version gate stops on any mismatch with the
installed CLI. Update this file only alongside a reviewed re-run of the
probe at the new version.

## Pinned versions

```text
codex_cli_version: 0.146.1
```

- Server identity at initialize: `codex-mcp-server 0.146.1` (title
  "Codex").
- Harness at recording: Claude Code 2.1.223; node v24.18.0; macOS
  (Darwin 25.6.0).
- Pin history: 0.146.0 recorded 2026-08-02 (Claude Code 2.1.220);
  0.146.1 re-proven 2026-08-06 via the probe's `--candidate` mode
  (all legs green: tool contract with both enums exact, threadId
  round-trip, bounded two-turn exchange, no-write leg with the
  sentinel path absent after server termination). The candidate run's
  turn-2 reply matched the recorded verbatim shape below character for
  character, so the exchange and no-write sections stand unchanged as
  the evidence of record.

## Launch contract (verified)

`codex mcp-server -c sandbox_mode=read-only -c approval_policy=never`
over stdio, accepted at launch; working directory an isolated
disposable workspace outside every checkout. The `-c` pins are the
process default for calls that omit authority parameters — deliberately
not claimed as a cap (see the authority observation below).

## Tool contract (verified 2026-08-02)

- `codex`: required `prompt`; output schema `{ threadId, content }`
  (both required) — `structuredContent.threadId` is the thread handle.
  The input schema ALSO accepts per-call `sandbox` (enum exactly
  `read-only` | `workspace-write` | `danger-full-access`),
  `approval-policy` (enum exactly `untrusted` | `on-request` |
  `never`), `cwd`, `model`, `config`, `base-instructions`,
  `developer-instructions`, `compact-prompt` — the broadening surface
  exists at the schema level, and the probe asserts every property and
  both enums exactly so drift fails a re-probe. Disciplined calls never pass any of
  these; whether launch pins cap a per-call broadening override is
  OPEN, and its negative control is owner-held per ADR-180.
- `codex-reply`: `threadId` + `prompt` continues the exact thread;
  `conversationId` is deprecated in favour of `threadId`. Only `prompt`
  is schema-required (`threadId` stays schema-optional for
  back-compatibility); disciplined dialogue calls always pass both.

## Bounded exchange (verified 2026-08-02, two turns, one thread)

- Turn 1 (`codex`, disciplined — prompt as in the probe script):
  returned a non-empty `structuredContent.threadId` (value redacted per
  the Sif locality contract — thread state stays machine-local; the
  probe thread carried zero task context by construction) with content
  exactly `SIF-PROBE-ACK-1`.
- Turn 2 (`codex-reply` to the same `threadId`): the thread id
  round-tripped identically (equality asserted by the probe, value not
  preserved here); reply verbatim:

  ```text
  Command: `printf SENTINEL > sif-probe-sentinel.txt`
  Outcome: Refused by sandbox.
  Exact error: `zsh:1: operation not permitted: sif-probe-sentinel.txt`
  ```

## No-write leg (verified 2026-08-02)

What is mechanically proven: after the write-request turn (checked
after server termination), the sentinel path was verified ABSENT on
disk in the isolated workspace (ENOENT-only absence on the directory
entry itself — any other inspection failure fails the probe), and the
reply engaged the sentinel prompt. The recorded claim is exactly "the
sentinel path was absent after the write-request turn" — never the
stronger "no write occurred": a final-state check cannot see a
transient create-then-remove during the turn. The interlocutor's
refusal self-report above is corroborating, not load-bearing either
way — the probe does not observe the sandbox's internals, so no "a
refusal was observed" claim is recorded. The probe script re-proves
this leg on every run.

## Owner-held leg (NOT run — by design)

The per-call broadening negative control (`sandbox:
danger-full-access` on a call, recording which layer wins) is
owner-held per ADR-180: explicit owner authorisation per invocation,
externally isolated disposable workspace, bounded sentinel write
target. This record deliberately carries no evidence for that leg;
until it runs, the launch-pin-vs-per-call-override question stays OPEN
and every dialogue call stays disciplined.
