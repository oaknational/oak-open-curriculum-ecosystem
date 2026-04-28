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

If `--seed` is omitted, the CLI reads (in order)
`PRACTICE_AGENT_SESSION_ID_CLAUDE`,
`PRACTICE_AGENT_SESSION_ID_CURSOR`,
`PRACTICE_AGENT_SESSION_ID_CODEX`,
then the harness-native `CODEX_THREAD_ID`. If none is set, it exits with code
`2`. There is no personal-email fallback; hashing `git config user.email` would
silently use a personal identifier and could collapse concurrent same-machine
agents into one identity.

The `PRACTICE_AGENT_SESSION_ID_*` variables are written into the platform's
session-scoped environment by the corresponding platform hook (see
**Platform Wrapper Status** below). The platform suffix matches the platform
that set the variable; the CLI does not care which one is present, only that
exactly one of them resolves to a non-empty seed.

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

| Platform    | Status                                            | Wiring / next action                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Code | Wired (statusline + SessionStart)                 | Two hooks. (1) **Statusline**: `.claude/settings.json` runs `node .claude/scripts/statusline-identity.mjs` → `agent-tools/dist/src/claude/statusline-identity.js`; the adapter parses stdin JSON `session_id` and prints the display name. (2) **`SessionStart` hook**: `.claude/hooks/practice-session-identity.mjs` → `agent-tools/dist/src/bin/claude-session-identity-hook.js`; the adapter appends `export PRACTICE_AGENT_SESSION_ID_CLAUDE=<id>` to `$CLAUDE_ENV_FILE` (per the [Claude Code hooks docs](https://code.claude.com/docs/en/hooks)) and emits `additionalContext` carrying the identity row plus a non-binding `/rename <name> - <intent>` suggestion. Title-setting is **not** automated — `SessionStart` cannot set the title, and we deliberately do not run a `UserPromptSubmit` hook for a one-shot effect. |
| Cursor      | Wired (code-renamed; live re-test pending)        | Project `sessionStart` hook `.cursor/hooks/oak-session-identity.mjs` sets `env.PRACTICE_AGENT_SESSION_ID_CURSOR` from the composer `session_id` and injects derived display name + PDR-027 `session_id_prefix` via `additional_context` (requires `agent-tools` build for the name line). Terminal may not inherit hook `env`; use injected context for registration when needed. **Future work:** live-test in a Cursor composer session after the env-var rename to confirm the renamed surface still flows end-to-end; once verified, optionally rename the file from `oak-session-identity.mjs` to `practice-session-identity.mjs` for naming consistency.                                                                                                                                                                      |
| Codex       | Wired (SessionStart context + thread id fallback) | Project `SessionStart` hook `.codex/hooks/practice-session-identity.mjs` delegates to `agent-tools/dist/src/bin/codex-session-identity-hook.js`. The adapter parses Codex stdin `session_id` and emits `hookSpecificOutput.additionalContext` with the PDR-027 identity block plus the canonical preflight command. Codex shell commands also receive `CODEX_THREAD_ID`; `agent-identity` consumes it as a fallback when no `PRACTICE_AGENT_SESSION_ID_*` is set. Title/statusline text remains optional display convenience, not identity correctness.                                                                                                                                                                                                                                                                             |

### Cursor `sessionStart` wiring

Authoritative behaviour and JSON shapes are defined in Cursor’s **[Hooks](https://cursor.com/docs/hooks)** documentation (`sessionStart`: stdin fields include `session_id`; stdout may include `env` and `additional_context`; session-scoped `env` is documented as available to later hook executions in the same session). Project registration: `.cursor/hooks.json` runs `node .cursor/hooks/oak-session-identity.mjs`. The hook uses `CURSOR_PROJECT_DIR` from [Hook environment variables](https://cursor.com/docs/hooks#environment-variables) to resolve `agent-tools/dist/...`. Injected `additional_context` includes the derived display name (when the CLI is built) and **PDR-027 `session_id_prefix`** (first six characters of `session_id`); it does not echo the full `session_id`.

#### Stable id, derived name, and Composer tab title (human-visible)

- **Stable session id:** the composer `session_id` on `sessionStart` stdin (same as conversation id per the [sessionStart reference](https://cursor.com/docs/hooks)). This is the seed for derivation and `PRACTICE_AGENT_SESSION_ID_CURSOR`.
- **Derived name:** `agent-identity` display format from that seed (same word list as other platforms).
- **Identity surfaces:** hook `env` (`PRACTICE_AGENT_SESSION_ID_CURSOR`), `additional_context` (agent/system context), PDR-027 registration via [register-identity-on-thread-join](../../.agent/rules/register-identity-on-thread-join.md), and the optional **`user_message`** field (schema allows it; Cursor may surface it to the user — behaviour is not guaranteed).
- **Composer tab title:** the official `sessionStart` output schema documents **`env`** and **`additional_context`** only for machine-driven behaviour; there is **no documented `conversation_title` / tab-rename field**. So the repo cannot set the tab label purely from hooks today. Mitigations implemented in-tree:
  1. **`user_message`** — one-line hint with the suggested title `Oak · {displayName}` (best-effort).
  2. **`.cursor/oak-composer-session.local.json`** — gitignored mirror with `suggestedComposerTabTitle`, `displayName`, `composerSessionId`, and `sessionIdPrefix` for copy/paste rename or tooling. Written when the derived name is available; set `OAK_SKIP_COMPOSER_SESSION_MIRROR=1` to skip (e.g. tests).

For OS-level or editor-level title surfaces, parity with Codex’s `terminal_title` / `status_line` in `~/.codex/config.toml` is a **different product** integration; Cursor would need a future hook field or API for true automatic tab rename.

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

### Claude Code `SessionStart` wiring

The Claude Code `SessionStart` hook fires when the harness starts a new
session or resumes one. The harness pipes a JSON object on stdin containing
`session_id`, `transcript_path`, `cwd`, `hook_event_name`, `source`, and
`model`. The wiring is:

1. `.claude/settings.json` declares a `SessionStart` hook entry running
   `.claude/hooks/practice-session-identity.mjs`.
2. The shim resolves the built adapter at
   `agent-tools/dist/src/bin/claude-session-identity-hook.js`. If the build
   artefact is missing it prints `{}` and exits 0 — the harness sees no
   `additionalContext` and the session continues normally.
3. The adapter parses stdin, derives the deterministic display name, appends
   `export PRACTICE_AGENT_SESSION_ID_CLAUDE=<session_id>` to the file path
   given in `$CLAUDE_ENV_FILE` (per the
   [Claude Code hooks docs](https://code.claude.com/docs/en/hooks)), and
   prints a `hookSpecificOutput` JSON object whose `additionalContext`
   carries the agent identity row and a non-binding `/rename` suggestion.
4. Subsequent Bash tool calls in the session see
   `$PRACTICE_AGENT_SESSION_ID_CLAUDE`, so any tool that relies on the seed
   (e.g. `pnpm agent-tools:agent-identity --format display`) resolves the
   same identity without `--seed`.

The hook is a soft surface: missing input, missing build artefact,
unparseable JSON, or any spawn failure exits 0 with `{}` on stdout. The
`OAK_AGENT_IDENTITY_OVERRIDE` env var still bypasses derivation when the
operator sets it.

### Codex thread-id wiring

Codex exposes the active thread id to shell commands as `CODEX_THREAD_ID`.
For this platform, running the built CLI without `--seed` is sufficient when
that environment variable is present:

```bash
node agent-tools/dist/src/bin/agent-identity.js --format display
```

The current seed precedence keeps explicit and platform-specific sources
predictable: `--seed`, then `PRACTICE_AGENT_SESSION_ID_CLAUDE`, then
`PRACTICE_AGENT_SESSION_ID_CURSOR`, then `PRACTICE_AGENT_SESSION_ID_CODEX`,
then the harness-native `CODEX_THREAD_ID`.

### Codex `SessionStart` wiring

Codex project hooks are enabled in `.codex/config.toml` with
`features.codex_hooks = true` and a `SessionStart` matcher for
`startup|resume`. The hook shape follows the official
[Codex Hooks](https://developers.openai.com/codex/hooks) contract:
command hooks receive JSON on stdin, including `session_id`, and
`SessionStart` supports `hookSpecificOutput.additionalContext`.

The wiring is:

1. `.codex/config.toml` runs `.codex/hooks/practice-session-identity.mjs`.
2. The shim resolves the built adapter at
   `agent-tools/dist/src/bin/codex-session-identity-hook.js`. If the build
   artefact is missing, it prints `{}` and exits 0.
3. The adapter parses stdin, derives the deterministic display name from
   `session_id`, and prints a `hookSpecificOutput` JSON object whose
   `additionalContext` carries:
   - the PDR-027 block (`agent_name`, `platform`, `model`,
     `session_id_prefix`, `seed_source`);
   - the exact command to verify the same block before thread registration or
     shared-state writes.

Use the full preflight for Codex thread rows and shared-state writes:

```bash
pnpm agent-tools:collaboration-state -- identity preflight --platform codex --model GPT-5
```

The hook is a soft surface: missing input, missing build artefact, unparseable
JSON, or adapter failure exits 0 with `{}` on stdout. Title/statusline text is
not treated as correctness; the PDR-027 identity block is.
