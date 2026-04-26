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
`OAK_AGENT_SEED`. If neither is set, it exits with code `2`. There is no
personal-email fallback; hashing `git config user.email` would silently use a
personal identifier and could collapse concurrent same-machine agents into one
identity.

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

| Platform    | Status         | Next action                                                                                                                                                             |
| ----------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Code | Deferred       | Use a Claude session with the `update-config` skill to install statusline wiring that passes the harness `session_id` to the built CLI.                                 |
| Codex       | Gap documented | No repo-owned automatic session-stable wrapper surface is confirmed in this pass. Use `--seed` or `OAK_AGENT_SEED` manually until a Codex wrapper surface is designed.  |
| Cursor      | Gap documented | No repo-owned automatic session-stable wrapper surface is confirmed in this pass. Use `--seed` or `OAK_AGENT_SEED` manually until a Cursor wrapper surface is designed. |

A follow-up Claude Code agent review must verify the Claude
`update-config`/statusline path and confirm the Codex/Cursor rows still
match the available host surfaces before platform wrapper installation.

Session-id seeds produce deterministic session display identities. Persistent
PDR-027 identity across sessions requires a deliberately persistent seed or an
explicit owner/operator override.
