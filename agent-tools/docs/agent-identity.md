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
`PRACTICE_AGENT_SESSION_ID_GEMINI`,
`PRACTICE_AGENT_SESSION_ID_CODEX`,
then the harness-native `CODEX_THREAD_ID`, then Antigravity's stable
`conversationId` surfaces (`conversationId` or
`ANTIGRAVITY_SOURCE_METADATA.conversationId`). If none is set, it exits with
code `2`. There is no personal-email fallback; hashing `git config user.email`
would silently use a personal identifier and could collapse concurrent
same-machine agents into one identity.

The `PRACTICE_AGENT_SESSION_ID_*` variables are written into the platform's
session-scoped environment by the corresponding platform hook (see
**Platform Wrapper Status** below). The platform suffix matches the platform
that set the variable; the CLI does not care which one is present, only that
exactly one of them resolves to a non-empty seed.

## Identity, Statusline, And Title

Three human-visible surfaces deliberately remain separate:

1. **Derived identity** — `agent-identity` maps a stable session seed to a
   deterministic display name. This name is the source for PDR-027
   `agent_name` when the owner has not assigned one.
2. **Statusline rendering** — Claude Code and Cursor CLI statuslines can render
   the derived name as a prompt/status segment. This is a display surface only:
   it does not rename the session title and it is not the shared-state
   correctness surface.
3. **Session title** — title changes are user-owned host behaviour. Claude Code
   `SessionStart` injects a non-binding `/rename <name> - <intent>` suggestion;
   Codex's `/rename` command changes the UI session label/statusline title when
   the user invokes it. The repo tooling does not treat a title or statusline as
   proof of identity.

Current-state note for Codex CLI: `tui.status_line` in `config.toml` stores the
selected footer item ids, but this repo does not own the allowlist. Use Codex's
`/statusline` picker as the product-supported way to inspect and persist the
current build's footer items. In the Codex CLI 0.137.0 build inspected on
2026-06-06, the allowlist is compiled into the native Codex binary rather than
loaded from repo-local config. Observed item ids included `thread-title`,
`thread-id`, `model-with-reasoning`, `reasoning`, `context-remaining`,
`context-used`, `context-window-size`, `five-hour-limit`, `weekly-limit`,
`git-branch`, `current-dir`, `project`, `project-name`, `codex-version`,
`used-tokens`, `total-input-tokens`, `total-output-tokens`, `fast-mode`,
`pull-request-number`, `branch-changes`, `approval-mode`, and `raw-output`.
Treat that list as a snapshot, not a contract: verify against `/statusline` or
the current Codex source/build before changing automation or documentation that
depends on a specific item id.

For collaboration-state writes, the correctness surface is the full PDR-027
identity block (`agent_name`, `id`, `platform`, `model`,
`session_id_prefix`, and `seed_source`) produced by the appropriate preflight,
not a title string or prompt decoration.

## Output

Formats:

- `kebab` — lowercase slug, the default: `harrier-weaves-stratosphere`
- `display` — human-readable rendering per the active schema's column
  casing: `Harrier weaves Stratosphere` (v2 lowercases the middle verb)
- `json` — full result including the SHA-256 `seedDigest`

Derived JSON results include `kind: "derived"` plus `namingSchemaVersion`,
`group`, `words` (the selected words in column order), `displayName`, `slug`,
and `seedDigest`.

Resolved-name override:

```bash
OAK_AGENT_IDENTITY_OVERRIDE="Frolicking Toast" \
  node agent-tools/dist/src/bin/agent-identity.js --seed any --format display
```

Override JSON results use `kind: "override"` with
`namingSchemaVersion: "override"` and include only `displayName`, `slug`,
`seedDigest`, and `override`. They intentionally do not invent derived word
slots. The same environment variable is used by operator-provided names and by
platform session hooks after they derive a name for the current session.

## Visual-Disambiguator Token

Token-adopting collaboration-state renderers (comms watch and inbox lines,
directed headings, operator CLI query and peer-liveness lines, commit-queue
entries and guard messages, active-agent routing summaries — views where
identities can be confused) display the prefix through the
**visual-disambiguator token**: `<session_id_prefix>-<last 3 of the id>`,
derived at render time from two fields every derived identity block already
carries. A block with no `id` (legacy rows, migration output) renders the
bare prefix — the fallback is structural, inside the renderer helper, not a
per-site default. This is a `collaboration-state` render-time derivation,
not an `agent-identity` CLI output format: `--format kebab|display|json`
never emits it. The Claude Code statusline deliberately does NOT show the
token: it renders one identity and is the operator's paste source for the
join key, so it stays the bare prefix (the PDR-125 clause-5 hold-out). The
TUI active-agents routing-key label renders `name / id:<id>` with no prefix
field — id-shaped by design, nothing to adopt — while the `claims list` and
`claims active-agents` commands serialise full identity blocks, prefix
included.

**Display-only, always.** The token is never persisted, never a join,
lookup, or parse key, and never hand-typed into an authored
`session_id_prefix` cell or flag value — the wire field and cross-estate
join key remain the bare prefix, unchanged (PDR-027 field-role doctrine;
PDR-125 clause 5). The token is not injective over a schema-unbounded
prefix, so nothing may attempt to detect or decode it from a stored value.

The example below is generated: a unit test rebuilds it from the live
renderer and fails on any drift.

<!-- drift-test:visual-disambiguator-example -->

```text
session_id_prefix: 22e835
id:                1bb4df59-58e8-5b71-b41b-eebd1f587dda
rendered:          22e835-dda
rendered (no id):  22e835
```

## Naming Schema Registry (ADR-198)

The seed-to-name projection is versioned. Each era is registered in
`src/core/agent-identity/schema-registry.ts` with its wordlist material,
per-column render casing, and a pinned SHA-256 content digest; a gate test
recomputes the digest so editing registered material without adding a new
schema version fails the tree (material freezes at activation):

- `v1-adjective-verb-noun` — the original adjective–participle–noun scheme,
  all words title-cased (`Gnarled Sprouting Fern`). Frozen; remains
  reproducible via `deriveIdentity(seed, { schemaId: 'v1-adjective-verb-noun' })`.
- `v2-noun-verb-noun` — **active**. Noun–verb–noun micro-sentences with a
  lowercase shared middle verb (`Harrier weaves Stratosphere`): themed
  title-cased edge nouns around a theme-neutral verb pool, U-shaped column
  salience by construction.

Collaboration-state identity tuples record name provenance in an optional
`naming_schema_version` field (a registered era id, or `override`). The two
derivation factories always stamp it; address relays (recipient blocks,
relayed caller identity) omit it because another agent's provenance is
unknowable to the writer. Absence reads as the v1 era via
`namingSchemaVersionOf` — rows written before the field existed are v1 by
definition, with no backfill and no rewriting of immutable historical events.

## Session-Level Name Cache

Platform session-start hooks derive the display name once for the session and
store that resolved name in `OAK_AGENT_IDENTITY_OVERRIDE` alongside the stable
Practice session-id seed (`PRACTICE_AGENT_SESSION_ID_CLAUDE`,
`PRACTICE_AGENT_SESSION_ID_CURSOR`, `PRACTICE_AGENT_SESSION_ID_GEMINI`, or
`PRACTICE_AGENT_SESSION_ID_CODEX`). This is a session cache, not a wordlist
compatibility layer: the wordlists remain the single derivation source for new
sessions, while an already-started session keeps the name it was given even if
the wordlists change during active work.

When both a session seed and `OAK_AGENT_IDENTITY_OVERRIDE` are present, the CLI
uses the seed for `seedDigest` and the override for `displayName` and `slug`.
The JSON result is `kind: "override"` because the name no longer claims derived
word slots. The override alone does not satisfy the seed requirement.

## Platform Wrapper Status

| Platform                 | Status                                                   | Wiring / next action                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------ | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Claude Code              | Wired (statusline + SessionStart)                        | Two hooks. (1) **Statusline**: `.claude/settings.json` runs `node .claude/scripts/statusline-identity.mjs` → `agent-tools/dist/src/claude/statusline-identity.js`; the adapter parses stdin JSON `session_id` and prints the display name. (2) **`SessionStart` hook**: `.claude/hooks/practice-session-identity.mjs` → `agent-tools/dist/src/bin/claude-session-identity-hook.js`; the adapter appends `PRACTICE_AGENT_SESSION_ID_CLAUDE` and the session-level `OAK_AGENT_IDENTITY_OVERRIDE` cache to `$CLAUDE_ENV_FILE` (per the [Claude Code hooks docs](https://code.claude.com/docs/en/hooks)) and emits `additionalContext` carrying the identity row plus a non-binding `/rename <name> - <intent>` suggestion. Title-setting is **not** automated — `SessionStart` cannot set the title, and we deliberately do not run a `UserPromptSubmit` hook for a one-shot effect. |
| Cursor                   | Wired (sessionStart + statusline; global CLI activation) | Project `sessionStart` hook `.cursor/hooks/oak-session-identity.mjs` sets `env.PRACTICE_AGENT_SESSION_ID_CURSOR` and the session-level `OAK_AGENT_IDENTITY_OVERRIDE` cache from the composer `session_id`, then injects derived display name + PDR-027 `session_id_prefix` via `additional_context` (requires `agent-tools` build for the name line). The repo-owned status-line shim `.cursor/scripts/statusline-identity.mjs` delegates to `agent-tools/dist/src/claude/statusline-identity.js` (same pipeline as Claude Code: identity, git branch, dirty/worktree, context %, model). Activate with `pnpm agent-tools:install-cursor-statusline` (writes `statusLine` into `~/.cursor/cli-config.json`) or merge `.cursor/statusline.cli.fragment.json` manually. Terminal may not inherit hook `env`; use injected context for registration when needed.                     |
| Gemini / Antigravity CLI | Seed supported; hook injection not wired                 | `agent-identity` and `collaboration-state identity preflight` now accept `PRACTICE_AGENT_SESSION_ID_GEMINI`, or Antigravity's stable `conversationId` fallback when no Practice variable is present. The current repo does not wire a project-local Antigravity hook to set `PRACTICE_AGENT_SESSION_ID_GEMINI`; that belongs to hooks portability work after fresh verification. Do not use `ANTIGRAVITY_TRAJECTORY_ID` as a seed because it is run-volatile.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Codex                    | Wired (SessionStart context + thread id fallback)        | Project `SessionStart` hook `.codex/hooks/practice-session-identity.mjs` delegates to `agent-tools/dist/src/bin/codex-session-identity-hook.js`. The adapter parses Codex stdin `session_id` and emits `hookSpecificOutput.additionalContext` with the PDR-027 identity block plus the canonical preflight command. Codex shell commands also receive `CODEX_THREAD_ID`; `agent-identity` consumes it as a fallback when no `PRACTICE_AGENT_SESSION_ID_*` is set. Title/statusline text remains optional display convenience, not identity correctness.                                                                                                                                                                                                                                                                                                                           |

### Cursor `sessionStart` wiring

Authoritative behaviour and JSON shapes are defined in Cursor’s **[Hooks](https://cursor.com/docs/hooks)** documentation (`sessionStart`: stdin fields include `session_id`; stdout may include `env` and `additional_context`; session-scoped `env` is documented as available to later hook executions in the same session). Project registration: `.cursor/hooks.json` runs `node .cursor/hooks/oak-session-identity.mjs`. The hook uses `CURSOR_PROJECT_DIR` from [Hook environment variables](https://cursor.com/docs/hooks#environment-variables) to resolve `agent-tools/dist/...`. Injected `additional_context` includes the derived display name (when the CLI is built) and **PDR-027 `session_id_prefix`** (first six characters of `session_id`); it does not echo the full `session_id`.

#### Stable id, derived name, and Composer tab title (human-visible)

- **Stable session id:** the composer `session_id` on `sessionStart` stdin (same as conversation id per the [sessionStart reference](https://cursor.com/docs/hooks)). This is the seed for derivation and `PRACTICE_AGENT_SESSION_ID_CURSOR`.
- **Derived name:** `agent-identity` display format from that seed (same word list as other platforms).
- **Identity surfaces:** hook `env` (`PRACTICE_AGENT_SESSION_ID_CURSOR` plus
  the session-level `OAK_AGENT_IDENTITY_OVERRIDE` cache),
  `additional_context` (agent/system context), PDR-027 registration via
  [register-identity-on-thread-join](../../.agent/rules/register-identity-on-thread-join.md),
  and the optional **`user_message`** field (schema allows it; Cursor may
  surface it to the user — behaviour is not guaranteed).
- **Composer tab title:** the official `sessionStart` output schema documents **`env`** and **`additional_context`** only for machine-driven behaviour; there is **no documented `conversation_title` / tab-rename field**. So the repo cannot set the tab label purely from hooks today. Mitigations implemented in-tree:
  1. **`user_message`** — one-line hint with the suggested title `Oak · {displayName}` (best-effort).
  2. **`.cursor/oak-composer-session.local.json`** — gitignored mirror with `suggestedComposerTabTitle`, `displayName`, `composerSessionId`, and `sessionIdPrefix` for copy/paste rename or tooling. Written when the derived name is available; set `OAK_SKIP_COMPOSER_SESSION_MIRROR=1` to skip (e.g. tests).

For OS-level or editor-level title surfaces, parity with Codex’s `terminal_title` / `status_line` in `~/.codex/config.toml` is a **different product** integration; Cursor would need a future hook field or API for true automatic tab rename.

### Cursor CLI status-line wiring

Cursor documents `statusLine` as a **global** CLI setting (`~/.cursor/cli-config.json`);
project `.cursor/cli.json` holds permissions only. The repo owns the command and
an install helper so activation stays reproducible across checkouts.

**One-time activation (from repo root, after `pnpm agent-tools:build`):**

```bash
pnpm agent-tools:install-cursor-statusline
```

That runs `node .cursor/scripts/install-statusline-cli-config.mjs`, which merges
`statusLine` into `~/.cursor/cli-config.json` with an absolute path to the shim.
Alternatively, copy the `statusLine` block from `.cursor/statusline.cli.fragment.json`
and replace the command path with your checkout root.

The wiring after activation is:

1. `~/.cursor/cli-config.json` points `statusLine.command` at the repo shim.
2. `.cursor/scripts/statusline-identity.mjs` resolves the built adapter under
   `agent-tools/dist/src/claude/`. If the build artefact is missing it exits 0
   silently rather than disrupting the session.
3. `agent-tools/dist/src/claude/statusline-identity.js` (built from
   `agent-tools/src/claude/statusline-identity.ts`) parses the stdin JSON
   (`session_id`, `cwd` / `workspace.current_dir`, `model`, `context_window`, …),
   derives the PDR-027 display name, gathers git state from the working directory,
   and prints the multi-row statusline via `renderStatusline` (same shape as Claude Code).
4. Cursor CLI renders those rows in the status bar.

The adapter is a soft surface: missing input, missing build artefact,
unparseable JSON, or any spawn failure exits 0 with empty stdout. The
`OAK_AGENT_IDENTITY_OVERRIDE` env var still bypasses derivation when present.

### Claude Code statusline wiring

The Claude Code statusline command runs when the session's UI state updates
and on the fixed `refreshInterval` timer configured beside it (the timer keeps
countdowns moving in an idle session). The harness pipes a JSON object on
stdin containing `session_id`, `cwd` / `workspace.current_dir`, `model`,
`context_window`, `effort` (when the model has an effort parameter), and —
for subscriber auth — `rate_limits` (the adapter reads each of these —
see step 3). The wiring is:

1. `.claude/settings.json` declares
   `"statusLine": { "type": "command", "command": "node .claude/scripts/statusline-identity.mjs" }`.
2. `.claude/scripts/statusline-identity.mjs` is a thin shim that resolves the
   built adapter path under `agent-tools/dist/src/claude/`. If the build
   artefact is missing it exits 0 silently rather than disrupting the session.
3. `agent-tools/dist/src/claude/statusline-identity.js` (built from
   `agent-tools/src/claude/statusline-identity.ts`) parses the stdin JSON
   (`session_id`, `cwd` / `workspace.current_dir`, `model`,
   `context_window`, `effort`, `rate_limits`), derives the PDR-027
   display name (via the built `agent-identity` CLI with
   `--seed <session_id> --format display`), gathers git state (branch, dirty,
   linked-worktree name), and resolves the session-coordination shape — own
   role, team shape (solo / peer / directed), and ArcAngel liveness — from two
   cheap reads of the primary checkout (the active-claims registry's optional
   `role` field and the experiments-directory listing; never the comms corpus).
4. `renderStatusline` composes the multi-row glance surface — the identity
   row (with a Director demark when the session's fresh claim carries
   `role: director` and the team-shape / ArcAngel indicators), the model and
   usage-gauge row, the git location rows, the owner-jobs segment, and the
   logo column — which Claude Code renders in the statusline. Each segment
   and each row drop cleanly when absent; the full current-behaviour
   description lives in
   [Developer Experience](../../docs/engineering/developer-experience.md).

The adapter is a soft surface: missing input, missing build artefact,
unparseable JSON, or any spawn failure exits 0 with empty stdout. The
`OAK_AGENT_IDENTITY_OVERRIDE` env var still bypasses derivation when present.

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
   `PRACTICE_AGENT_SESSION_ID_CLAUDE` and `OAK_AGENT_IDENTITY_OVERRIDE` export
   lines to the file path given in `$CLAUDE_ENV_FILE` (per the
   [Claude Code hooks docs](https://code.claude.com/docs/en/hooks)), and
   prints a `hookSpecificOutput` JSON object whose `additionalContext`
   carries the agent identity row and a non-binding `/rename` suggestion.
4. Subsequent Bash tool calls in the session see
   `$PRACTICE_AGENT_SESSION_ID_CLAUDE` and
   `$OAK_AGENT_IDENTITY_OVERRIDE`, so any tool using CLI identity resolution
   (e.g. `pnpm agent-tools:agent-identity --format display`) resolves the
   same cached session identity without `--seed`.

The hook is a soft surface: missing input, missing build artefact,
unparseable JSON, or any spawn failure exits 0 with `{}` on stdout. The
`OAK_AGENT_IDENTITY_OVERRIDE` env var still bypasses derivation when present.

### Codex thread-id wiring

Codex exposes the active thread id to shell commands as `CODEX_THREAD_ID`.
For this platform, running the built CLI without `--seed` is sufficient when
that environment variable is present:

```bash
node agent-tools/dist/src/bin/agent-identity.js --format display
```

The current seed precedence keeps explicit and platform-specific sources
predictable: `--seed`, then `PRACTICE_AGENT_SESSION_ID_CLAUDE`, then
`PRACTICE_AGENT_SESSION_ID_CURSOR`, then `PRACTICE_AGENT_SESSION_ID_GEMINI`,
then `PRACTICE_AGENT_SESSION_ID_CODEX`, then the harness-native
`CODEX_THREAD_ID`, then Antigravity's stable `conversationId` surfaces.

### Codex `SessionStart` wiring

Codex project hooks are enabled in `.codex/config.toml` with
`features.hooks = true` and a `SessionStart` matcher for `startup|resume`.
`hooks` is stable in Codex CLI `0.145.0`; the older `codex_hooks` name is not
the current public configuration key. The hook shape follows the official
[Codex Hooks](https://developers.openai.com/codex/hooks) contract:
command hooks receive JSON on stdin, including `session_id`, and
`SessionStart` supports `hookSpecificOutput.additionalContext`.

Project hooks load only for a trusted project and have their own trust review.
Use `/hooks` to inspect the effective hook set and approve changed project
hooks. The repo activates only this identity `SessionStart` adapter. The
[Codex CLI capability catalogue](../../.agent/reports/agentic-engineering/codex-cli-agentic-capability-catalogue-2026-07-25.md)
records the broader lifecycle surface.

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
