# Agent Identity CLI

`agent-identity` derives a deterministic, human-readable agent display name
from an explicit stable seed. It is portable repo tooling: platform wrappers
decide which session seed to pass, while the CLI performs only the
seed-to-name derivation.

## Usage

From the repo root:

```bash
pnpm agent-tools:agent-identity --seed example-session-id-001 --format display
pnpm agent-tools:agent-identity --seed example-session-id-001 --format kebab
pnpm agent-tools:agent-identity --seed example-session-id-001 --format json
```

After building:

```bash
pnpm agent-tools:build
node agent-tools/dist/src/bin/agent-identity.js --seed example-session-id-001 --format display
```

If `--seed` is omitted, the CLI reads `CLAUDE_SESSION_ID`, then
`CODEX_THREAD_ID`, then `OAK_AGENT_SEED`. If none is set, it exits with code
`2`. There is no personal-email fallback; hashing `git config user.email` would
silently use a personal identifier and could collapse concurrent same-machine
agents into one identity.

## Output

Formats:

- `kebab` — lowercase slug, the default: `gnarled-sprouting-fern`
- `display` — human-readable title case: `Gnarled Sprouting Fern`
- `json` — full result including the SHA-256 `seedDigest`

Derived JSON results include `kind: "derived"` plus `group`, `adjective`,
`verb`, `noun`, `displayName`, `slug`, and `seedDigest`.

Operator override:

```bash
OAK_AGENT_IDENTITY_OVERRIDE="Frolicking Toast" \
  node agent-tools/dist/src/bin/agent-identity.js --seed any --format display
```

Override JSON results use `kind: "override"` and include only
`displayName`, `slug`, `seedDigest`, and `override`. They intentionally do
not invent derived word slots.

## Platform Wrapper Status

| Platform    | Status         | Wiring / next action                                                                                                                                                                                                                                          |
| ----------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Code | Wired          | `.claude/settings.json` runs `node .claude/scripts/statusline-identity.mjs`, which delegates to the built adapter `agent-tools/dist/src/claude/statusline-identity.js`. The adapter parses the harness's stdin JSON `session_id` and prints the display name. |
| Codex       | Thread id wired | Codex shell commands receive `CODEX_THREAD_ID`; `agent-identity` consumes it automatically when `--seed` and `CLAUDE_SESSION_ID` are absent. User-facing thread-title mutation is deliberately deferred; the stable thread id already provides deterministic names without adding a separate title-mutation tool. |
| Cursor      | Gap documented | No repo-owned automatic session-stable wrapper surface is confirmed. Use `--seed` or `OAK_AGENT_SEED` manually until a Cursor wrapper surface is designed.                                                                                                    |

### Claude Code statusline wiring

The Claude Code statusline runs once per session at startup and on subsequent
prompt-submit events. The harness pipes a JSON object on stdin containing
`session_id` (and other fields the adapter ignores). The wiring is:

1. `.claude/settings.json` declares
   `"statusLine": { "type": "command", "command": "node .claude/scripts/statusline-identity.mjs" }`.
2. `.claude/scripts/statusline-identity.mjs` is a thin shim that resolves the
   built adapter path under `agent-tools/dist/src/claude/`. If the build
   artefact is missing it exits 0 silently rather than disrupting the session.
3. `agent-tools/dist/src/claude/statusline-identity.js` (built from
   `agent-tools/src/claude/statusline-identity.ts`) parses the stdin JSON,
   extracts `session_id`, and synchronously invokes the built
   `agent-identity` CLI (via `spawnSync`) with
   `--seed <session_id> --format display`.
4. The CLI prints the deterministic name to stdout, which Claude Code renders
   in the statusline.

The adapter is a soft surface: missing input, missing build artefact,
unparseable JSON, or any spawn failure exits 0 with empty stdout. The
`OAK_AGENT_IDENTITY_OVERRIDE` env var still bypasses derivation when the
operator sets it.

Session-id seeds produce deterministic session display identities. Persistent
PDR-027 identity across sessions requires a deliberately persistent seed or an
explicit owner/operator override.

### Codex thread-id wiring

Codex exposes the active thread id to shell commands as `CODEX_THREAD_ID`.
For this platform, running the built CLI without `--seed` is sufficient when
that environment variable is present:

```bash
node agent-tools/dist/src/bin/agent-identity.js --format display
```

The current seed precedence keeps explicit and platform-specific sources
predictable: `--seed`, then `CLAUDE_SESSION_ID`, then `CODEX_THREAD_ID`, then
`OAK_AGENT_SEED`.
