# Agent Hook Policy

This directory contains the canonical agent-hook policy for this
repository. Hooks follow the same canonical-first pattern as rules and
skills: policy lives here, shared runtime lives in a workspace-owned command,
and thin native activation lives in platform config.

## Current Status

**Guardrails, identity, and an observer**: the hook layer is intentionally
narrow.

- `preToolUse` — natively enforced for Claude Code Bash calls by invoking the
  single prebuilt policy dispatcher
  (`agent-tools/dist/src/hook-policy/pre-tool-use-dispatch.js`) through the
  verdict shim `.claude/hooks/run-pretooluse-guard.mjs`; blocks
  shell commands that bypass safety guardrails or destroy history (force-push,
  hard reset, `--no-verify`)
- `preToolUseContent` — natively enforced for Claude Code Edit/Write calls
  through the same verdict shim and the **same dispatcher artefact** (the
  three matchers — Bash, Edit, Write — share one artefact; the dispatcher
  routes each payload by shape to the Bash or content policy); blocks the
  path-agnostic owner-approval marker and path-scoped doctrine block groups
  (see "Content guard: concept-grouped doctrine blocks" below)
- `PreCompact` observer — natively registered for Claude Code compactions; an
  observer, not a guard, with no key in `policy.json` (see "PreCompact
  observer" below)
- Codex identity context — a separate native `SessionStart` surface activated
  through the thin `.codex/hooks/practice-session-identity.mjs` adapter; it
  injects the PDR-027 identity block and remains soft/fail-open
- Claude Code `PreCompact` observer — a never-blocking OBSERVER, not a guard,
  activated in `.claude/settings.json` (it has no key in `policy.json`): it
  records what the harness sends at a compaction to a git-ignored log under
  `.claude/logs/`, and is the first hook run directly from TypeScript source
  (`node <source>.ts`, through the `log-hook-errors.sh` wrapper). What it
  guarantees, and why its build dependency remains, is stated once in the
  TSDoc of `agent-tools/src/bin/claude-pre-compact-observe-hook.ts`; the
  contract it has observed is recorded in
  `.agent/memory/executive/cross-platform-agent-surface-matrix.md` §Hook
  Support. Retire it when a `PreCompact` gate replaces it: its
  `systemMessage` shows on every compaction it answers
- `preCommit` — documented policy only; quality-gate reminders already
  live in the workflow and review surfaces

**Activation order** (learned 2026-09-12, at the transplant): land
`.agent/hooks/policy.json` first, make sure `agent-tools/dist` is built
(the `postinstall` bootstrap does it), and only then wire `hooks` into
`.claude/settings.json`. The guard fails closed and reloads the moment the
settings file changes, so in the other order every Bash, Edit and Write
call is refused until the policy file exists. New hooks run from
TypeScript source with no shim (`source-is-typescript-esm-only`; the
`PreCompact` observer above is the worked instance; the owner's word of
2026-09-16: a shim is a last resort), and the surviving hand-authored
`.mjs` shims are deletion candidates, not templates.

The Codex identity hook does **not** activate the canonical `sessionStart`
grounding reminder in `policy.json`, and it does not enforce the canonical
destructive-command or content policy. Those guards remain Claude Code
`PreToolUse` activations until the Codex enforcement vertical is implemented
and verified.

## Policy Spine

The hook layer follows a small Policy Spine. The layers are not peers.

1. **Canonical policy** — `.agent/hooks/policy.json`
   This is the authority for what the repo intends to allow, block, or
   describe.
2. **Native activation** — platform config such as `.claude/settings.json` or
   `.codex/config.toml`
   Tracked project config may activate only supported canonical policy. It
   does not redefine the policy. Hooks that activate no policy are
   registered here without a policy key: the `SessionStart` identity
   adapters (Claude Code, Codex and Cursor) and the Claude Code plan-gate
   drift alert, which add session context; the Read and `UserPromptSubmit`
   secrets scans, which block a read or a prompt that holds a secret; and
   the `PreCompact` observer, which observes and never decides.
3. **Workspace-owned runtime** — the single prebuilt
   `agent-tools/dist/src/hook-policy/pre-tool-use-dispatch.js` dispatcher
   artefact, shared by the Bash, Edit, and Write matchers and invoked through
   the verdict shim `.claude/hooks/run-pretooluse-guard.mjs` by the native
   activation (the `pnpm agent-tools:pre-tool-use-dispatch` script remains as
   a manual / diagnostic entry point to the same TypeScript source).
   The runtime enforces the active policy for the supported native surface.
4. **Explanatory mirrors** — this README and the cross-platform surface matrix
   These must describe the live arrangement, but they never override it.

Failure semantics:

- `override` — a higher-authority canonical layer wins
- `prune` — a missing native surface removes a local activation path without
  changing canonical intent
- `block` — the runtime or validator rejects an unsafe or incoherent state

## Bash guard: four match kinds

`preToolUse.blocked_patterns` guards Bash commands. Each entry names a
`pattern` and, optionally, how it matches (`match`):

- `token-subsequence` (the default) — the pattern's tokens appear in order
  among the command's tokens, so `git push --force` catches
  `git push origin HEAD --force`.
- `substring` — a whitespace-stripped, case-insensitive substring, for shapes
  that hide inside one quoted token (an inline busy-loop).
- `regex` — a case-insensitive regular expression over the raw command, for
  fingerprints that must anchor on a token boundary.
- `argv` — the invocation's PARSED options: the pattern names a command, its
  subcommand and the options the invocation must carry (`git reset --hard`,
  `git worktree remove --force`, `rm -rf`), and the matcher resolves the
  invocation's flags the way the command's own parser does — a long option by
  exact name or unique prefix (`--h` is `--hard`; `--m` is ambiguous and
  selects nothing), short flags split or clustered in either case (`-r -f`,
  `-Rf`, `-rvf`), a spelling that stands for two options met on the same set
  (`git branch -D` is `--delete --force`), an option value never read as a
  flag (`-Skey` is one option; `-e pattern` takes its word), a later option
  cancelling the one it overrides (a forced removal followed by the
  interactive flag is interactive), options in any position, nothing after
  `--`. One `argv` entry therefore names a destructive MODE rather than
  one spelling of it; the option tables live beside the matcher in
  `agent-tools/src/hook-policy/`, and a pattern the tables cannot parse fails
  the canonical-policy test at commit time rather than matching nothing in
  production.

  What `argv` sees: the words as the command receives them (quotes removed,
  so `rm '-rf'` is a forced removal and `"rm -rf"` is one word that invokes
  nothing; the ANSI-C `$'…'` form is a quote whose escapes are decoded; a
  backslash-newline continues the line); one shell segment at a time
  (`&&`, `||`, `|`, `;`, `&`, newline, a bare parenthesis — so a function
  body and a brace group on their own lines are read, while a here-document
  body is the command's data and is dropped, except the substitutions the
  shell runs in a body whose delimiter is unquoted); the
  first few words in a segment whose basename is the command, in any
  position (`/bin/rm`, `sudo rm`, `xargs rm`, `find -exec rm`, `env -i rm`;
  a `.exe` or `.cmd` suffix and a backslash path name the same command),
  except a word that is another known command's own subcommand (`git rm`
  removes from the index, not `rm`);
  a command substitution's body, unquoted or double-quoted (`OUT="$(…)"`,
  balanced past quoted parentheses), and the script a shell interpreter is
  given (the `-c` operand of the sh-like shells, every operand of `eval` and
  `ssh`; quoted, escaped or ANSI-C quoted, however many words precede the
  interpreter — a path handed to `bash` without `-c` is a file) as nested
  commands, two levels deep; a comment dropped. What it does not see, by design:
  variable, tilde and brace expansion (`rm $FLAGS dir`), aliases, shell
  functions and git config aliases, a script on stdin, nesting past two
  levels, and any other command with the same effect (`find -delete`, a
  scripting language, `rimraf`). A stale built guard degrades an `argv`
  entry to its literal spelling under the default mode until the rebuild,
  the same window every match kind has. The guard's promise is PDR-044's
  innate immunity — fast, broad accident prevention that "never silently
  misses a known pathogen" — not resistance to a bypass sought on purpose; a
  seat that wants a destructive effect and hides it behind an expansion has
  left the class the guard exists for. The host treats a hook timeout as an
  allow, so matching is linear in the command line: its cost is never
  driven by the input it judges. Adoption prices each entry's false
  positives (PDR-044 licenses them): an `rm -rf` entry also blocks
  `pnpm rm -r --force <pkg>`, a real package-manager command.

The three string kinds stay beside `argv`; which entries move onto it is a
policy decision taken entry by entry.

## Content guard: concept-grouped doctrine blocks

`preToolUseContent` guards Edit/Write content. It has two surfaces:

- `blocked_patterns` — the path-agnostic owner-approval marker; only the
  project owner may author it.
- `scoped_blocks` — path-scoped doctrine block **groups**. Each group gathers
  the surface patterns for one **concept**, so the citation and the reappraisal
  are authored once per concept rather than once per pattern:

  ```jsonc
  {
    "concept": "expediency-hedging", // names the pattern family
    "kind": "literal", // or "regex"; group-level
    "patterns": ["carve out", "good enough"],
    "include_paths": ["**/*.plan.md"],
    "exclude_paths": ["archive/"], // optional
    "excludes_inline_code": true, // optional; regex groups
    "excludes_lines_with": ["(historical reference)"], // optional; regex groups
    "excludes_other_repositories": true, // optional; this repository's files only
    "citation": "PDR-044; principles.md §...", // the doctrinal anchor
    "reappraisal": "Re-assess whether the design is uniform ..." // positive direction
  }
  ```

  `kind` and the `excludes_*` options are group-level — every pattern in a group
  shares them. A path-scope entry takes one of three forms: a substring of the
  file path (`archive/`), a `**/*` suffix (`**/*.plan.md`), or a root-anchored
  path led by `./` (`./.agent/memory/`), which matches from the repository root
  only, so a nested copy of an exempt path cannot claim its exemption; the
  whole-tree gates that reuse the scoping (lineage names, machine-local paths)
  read the same forms. For the write-hook the root is the session's project
  directory (`CLAUDE_PROJECT_DIR` when set, else the policy's own checkout), so
  a write into another checkout matches no root-anchored exemption and the
  block fires; an absolute path is read with its `..` segments resolved, so a
  path that climbs back out of an exempt directory is scoped where it lands; an
  `apply_patch` path is relative to the payload's `cwd` and is resolved against
  it before scoping, and without a `cwd` it claims no root-anchored exemption
  either: the anchor fails closed, never open.

  `excludes_other_repositories` is for a concept that governs only this
  repository's own files, such as `lineage-name`: another repository's files
  may name what this one must not. A repository is known by its common git
  directory, which every worktree of it shares, so this repository's worktrees
  stay guarded wherever they sit on disk; two common directories are compared
  by identity on disk (device and inode), never by spelling. The walk starts
  where the file really is, following symbolic links, and a git directory
  counts only when git itself would accept it: a valid `HEAD` of its own, and
  `objects/` and `refs/` directories git can enter in its common directory.
  The write-hook drops the group only for a file it positively finds in another
  repository. Anything else keeps the group
  (`agent-tools/src/hook-policy/repository-identity.ts`): a file in no
  repository; a `.git` entry git would not accept, where the climb stops; a
  `.git` entry or `commondir` it cannot read; a link on the path that leads
  nowhere yet, since the write lands wherever it points; a file with another
  hard link, which a path in any repository may share; a path deeper than its
  climb; a path it could not place; or a session root whose own repository it
  cannot tell. A move's source, and a Write's prior content, are read only as
  regular files, never waiting on a pipe, and one request's reads share a byte
  budget, so no read holds the hook past its timeout. The whole-tree gates
  read only this repository's tracked files, so the option never changes what
  they find.

**The deny message carries the reappraisal.** When a group fires, the message
names the concept the matched text is a fingerprint of, states the `reappraisal`
(the positive direction the firing signals), adds the meta-instruction that the
firing is about the concept and not the wording, and ends with the `citation`.
This is the content of PDR-044 §Innate immunity (as amended 2026-06-07): a block
that only says "no" leaves the agent to find a synonym and route around it; a
block that says "no, and here is the concept to reappraise" triggers the right
response. Detection — whether a block fires — depends only on `patterns` +
path-scope + the added-not-in-prior check, never on the `reappraisal`.

**`reappraisal` is enforced at commit-time, not load time.** The load-time
schema (`agent-tools/src/hook-policy/types.ts` `ScopedContentBlockGroupSchema`)
leaves `reappraisal` optional, so a missing value never throws and fails the
guard closed — which would brick the worktree on a stale-`dist`/new-policy
mismatch. Presence is enforced where blocking is safe instead: the
`validate-policy-reappraisal` repo validator
(`agent-tools/src/validators/policy-reappraisal/`), wired into
`repo-validators:check`, fails the commit/push/CI run if any group lacks a
non-empty `reappraisal`. The deny builder defaults a generic reappraisal as a
runtime safety net if one is ever absent.

## Build-Artefact Freshness

The native activation invokes a **prebuilt** artefact
(`agent-tools/dist/src/hook-policy/pre-tool-use-dispatch.js` — one dispatcher
serving the Bash, Edit, and Write matchers), not the
TypeScript source. The PreCompact observer
(`agent-tools/dist/src/bin/claude-pre-compact-observe-hook.js`) is a second
prebuilt artefact under the same two freshness points. `dist/` is gitignored,
so each artefact is materialised by the build, and its freshness is
guaranteed at two points:

- **Install** — the root `package.json` `postinstall` builds `agent-tools`, so a
  fresh clone has the artefact before the first agent session.
- **Commit** — `.husky/pre-commit` runs `build` (turbo-cached, a no-op when the
  guard source is unchanged), so committed guard-source changes are compiled.

**Invariant:** after editing a hook-guard source file
(`agent-tools/src/hook-policy/*.ts`, `policy-loader.ts`, or any other source
the dispatcher imports, such as `agent-tools/src/core/bounded-read.ts`) or the
observer's source (`agent-tools/src/claude/pre-compact-observe/` or
`agent-tools/src/bin/claude-pre-compact-observe-hook.ts`), run a build
(`pnpm agent-tools:build` or any `turbo build`) before
relying on the hook in the active session — until then the running hook
executes the previously-compiled artefact. The failure direction is safe: a
stale guard still blocks every already-published pattern; only a *newly added*
pattern is unenforced until the next build.

The shim `.claude/hooks/run-pretooluse-guard.mjs` takes control of the verdict
when the artefact does not run cleanly — something a direct `node <guard>.js`
cannot do (a direct `node <missing>.js` exits 1, which Claude Code treats as
non-blocking and would *silently allow* the call). It splits the two
artefact-failure shapes:

- **Present but broken** — the guard is built but crashes, is killed, fails its
  module load, or is called with no path: the shim **fails closed** (exit 2),
  blocking the tool call. A built guard that misbehaves is a suspicious signal.
- **Not built** — the artefact is missing (a fresh checkout before install, or a
  branch switch / deleted `dist`): the shim **fails open** (exit 0) and lets the
  call proceed. Blocking here would brick the worktree — it would block the very
  `pnpm install` / `pnpm agent-tools:build` needed to build the guard, an
  unrecoverable catch-22. The allow is loud, not silent: a warning naming the
  artefact and the rebuild command goes to stderr **and** is appended to
  `.claude/logs/hook-errors.log` (the harness does not surface PreToolUse stderr
  on an allow, so the log is the durable, auditable record).

The Read / `UserPromptSubmit` secrets-scan hooks (via
`.claude/hooks/_lib/log-hook-errors.sh`) are deliberately **best-effort /
fail-open**: they `exit 0` when the scanner is unavailable so a session is never
bricked by a missing optional tool, and the allow is loud: with no `sonar` on PATH,
or a scan that exits with an error, the prompt or the Read goes through with a
warning shown to the user that it was not scanned (the Read hook stays silent
for every other tool). That is a broader fail-open posture than the
dangerous-command/content guards above: those fail open *only* for the not-built
case (loudly, as above) and fail **closed** whenever a built guard misbehaves.
They read the payload with `jq` when it is installed; without it, the Read hook
denies a path holding a JSON escape it cannot decode rather than let it through
unscanned. Their commands quote every `${CLAUDE_PROJECT_DIR}`, which the
portability check enforces for every hook and the status line; it also holds
each of those commands to the closed hook-command grammar in
`agent-tools/src/validators/portability/claude-hook-script-anchoring.ts`.

A file a prompt @-mentions never reaches the Read hook. Claude Code puts the
file's content into the conversation as an attachment, with no tool call, and
the `UserPromptSubmit` payload carries only the prompt's text (Claude Code
2.1.274, observed 2026-09-17). The documentation says only that an @-mention
"includes the full content of the file in the conversation"
([Common workflows](https://code.claude.com/docs/en/common-workflows)) and
that `Read` permission rules apply to `@file` mentions on a best-effort basis
([Permissions](https://code.claude.com/docs/en/permissions)). So the prompt
hook hands Sonar every regular file a mention can name, found as Claude Code
finds it: its patterns, read from the 2.1.274 bundle, run on node, the engine
they were written for, so the whitespace set, the word boundary and the `#`
split are Claude Code's own. They take a mention only after the start of the
text, whitespace or a CJK stop (`(^|[\s\u3002\u3001\uFF1F\uFF01])@`), end an
unquoted path at the last word character before whitespace (`@([^\s]+)\b`),
and split the path at its first `#` whatever follows
(`^([^#]+)(?:#L(\d+)(?:-(\d+))?)?(?:#[^#]*)?$`); the hook resolves it against
the payload's `cwd`, `~` or the root. Each file goes by its real path, once,
since Sonar reports a symlink clean without reading its target. When Sonar
is missing or errors, or `node` or `realpath` is missing, exits non-zero or cannot resolve a mentioned file,
the prompt goes through with a warning shown to the user that it was not
scanned. A mentioned file outside the project is read by the scanner
as the model would read it: the Sonar documentation says the scan runs locally
with no server connection
([Secrets detection](https://docs.sonarsource.com/sonarqube-cli/analysis/secrets-detection))
and that telemetry carries no file content, path or command argument
([Telemetry and privacy](https://docs.sonarsource.com/sonarqube-cli/administration/telemetry-and-privacy));
`sonar config telemetry --disabled` opts out of telemetry altogether. Other
content reaches the model without either hook seeing it, among them a nested
`CLAUDE.md`, a connected IDE's selection or open file, an MCP resource, and a
file read by a Bash or Grep call.

Every writer of `.claude/logs/` creates it owner-only: the directory mode 700 and
the logs mode 600. The wrapper and the Node hooks' shared helper
(`_lib/append-owner-only-log.mjs`) also tighten what an earlier version left open
and leave a symlinked, foreign-owned or non-regular log alone; the wrapper says on
stderr when a failure could not be written. In a process with no uid (Node gives
none on Windows or Android) the helper cannot check ownership, and the modes
cannot make a file owner-only on Windows, so it writes nothing. The `PreCompact` observer runs inside
the wrapper and keeps its own log at 600.

## Quoted wrapper paths

Every entry that `.claude/settings.json` registers through
`.claude/hooks/_lib/log-hook-errors.sh` quotes both `${CLAUDE_PROJECT_DIR}`
paths, the wrapper's and the wrapped command's (ADR-167 §Reference instance).
Quoting is right under both ways the harness can run the text:

- **The shell expands the variable.** An unquoted path holding a space splits,
  and the shell exits 127 before the wrapper starts, so nothing is logged and
  the hook silently stops running.
- **The harness pastes the path into the command text before the shell
  runs.** Shell syntax in an unquoted path is a syntax error, exit 2, which
  blocks the call: the read on `PreToolUse:Read`, the prompt on
  `UserPromptSubmit`.

Recorded, not built for: under a harness paste, a `"`, `$` or backtick in the
project path breaks even the quoted form. Most such paths exit 127 and fail
open silently. A few shapes, such as a lone `$(`, exit 2 and block every read
and prompt. A `$(...)` or a backtick pair in a directory name runs as code,
as it would unquoted.

`agent-tools/smoke-tests/hook-wrapper-quoting.smoke.ts` runs the Read and
`UserPromptSubmit` secrets-scan entries in a throwaway project whose name holds
a space, with a stub `sonar` on `PATH` that reports either a clean scan or a
secret. It fails unless each entry exits 0 through the wrapper, with the
script's decision (none, the deny, or the block) on stdout and no failure
logged. `.agent/reference/shell-and-tooling-gotchas.md` records one observed
`sonar auth login` run, on the CLI's login and integrate path, that rewrote
those two lines in place and dropped the wrapper; the smoke fails on such a
rewrite.

## PreCompact observer

The `PreCompact` entry in `.claude/settings.json` registers an observer, not a
guard. It is one of layer 2's registrations without a policy key: it has no key
in `policy.json`, activates no canonical policy, and observes and never
decides. It records the harness's compaction contract (what Claude Code sends a
`PreCompact` hook, and what it does with the answer), so that a later
`PreCompact` gate is built on observed facts rather than on the documentation.

- **Runtime.** The built entry
  `agent-tools/dist/src/bin/claude-pre-compact-observe-hook.js` (source in
  `agent-tools/src/bin/` and `agent-tools/src/claude/pre-compact-observe/`)
  appends one JSON line per compaction to
  `.claude/logs/pre-compact-observe/observations.jsonl`. The line carries the
  raw payload, so the log is owner-only: the observer creates its directory
  at 0o700 and holds the file at 0o600, retightening it on every append. It
  answers `{"continue":true,"systemMessage":"[pre-compact-observe] <marker>"}`,
  and the marker pairs the answer in the transcript with its log line.
- **It never blocks.** Every path it controls answers `continue: true` and
  exits 0; it never exits 2, the one code on which the harness blocks a
  compaction. A failure to record answers
  `[pre-compact-observe] observation failed: <reason>`, and a failed append
  also writes a payload-free block to `.claude/logs/hook-errors.log`
  (ADR-167 §Limitations 6). A thrown Error is answered fail-open with its
  reason. Throws are narrowed through `failureAsError` (owner ruling,
  2026-07-20). A non-Error narrowed at an inner boundary (the stdin read, the
  append's file-system edge) reaches the entry as a TypeError and is answered
  fail-open. One that reaches the entry's catch un-narrowed crashes the hook
  with exit 1, which the wrapper logs. No path exits 2.
- **Missing `dist`.** When the entry is not built, `node` exits 1, the
  `log-hook-errors.sh` wrapper logs it, and the compaction continues.
- **Quoted paths.** The command quotes both `${CLAUDE_PROJECT_DIR}` paths, as
  every wrapper entry does; [Quoted wrapper paths](#quoted-wrapper-paths)
  gives the reasons and the residual caveat. Here, an exit 2 would block the
  compaction.
- **Departures from the concept note.** The observer came from a concept
  note from the second estate's Practice, and departs from it in three ways.
  It runs from the built `dist`, like the `PreToolUse` dispatcher, not from
  TypeScript source. It writes to its own subdirectory,
  `.claude/logs/pre-compact-observe/`, not to a file directly under
  `.claude/logs/`. And its smoke drops the note's unparseable-stdin case,
  because the parse result is feature behaviour, proven in
  `agent-tools/src/claude/pre-compact-observe/payload.unit.test.ts`.
- **Proof.** `agent-tools/smoke-tests/pre-compact-observe.smoke.ts` runs the
  registered command through `/bin/sh -c`, as the harness does, against a
  throwaway project whose name holds a space, under plain Node.
- **Retirement.** Its `systemMessage` shows on every compaction it answers,
  so it retires when a `PreCompact` gate replaces it.

## Platform Support

| Platform | Upstream hook surface | Repo activation |
| --- | --- | --- |
| Claude Code | Native lifecycle hooks | Soft `SessionStart` identity context, `PreToolUse` command/content guards and a never-blocking `PreCompact` observer in tracked `.claude/settings.json` |
| Codex CLI | Stable lifecycle hooks | Soft `SessionStart` identity context in tracked `.codex/config.toml` |
| Cursor | Not reassessed in this Codex research pass as of 2026-07-25 | Soft `sessionStart` identity context in tracked `.cursor/hooks.json`; no canonical policy activation |
| Gemini / Antigravity CLI | Not reassessed in this Codex research pass as of 2026-07-25 | No canonical policy activation |
| GitHub Copilot CLI | Not reassessed in this Codex research pass as of 2026-07-25 | No Copilot-native activation; INHERITS the Claude `PreToolUse` activation and is enforced through the dispatcher's `copilot-compat-string` route (live observation recorded in `policy.json`) |

See `.agent/memory/executive/cross-platform-agent-surface-matrix.md` for the
full local support status. The version-pinned catalogue records the official
evidence and explicit evidence ceiling behind the Codex row.

Cursor and Gemini CLI have no canonical policy activation. GitHub Copilot has
no Copilot-native activation wired, but Copilot CLI inherits the Claude
`PreToolUse` activation and is enforced through the dispatcher's
`copilot-compat-string` route; the live observation and current pin are recorded
in `policy.json`.

The Codex CLI observation pinned in `policy.json` documents stable session,
subagent, tool/approval, compaction, prompt, and stop lifecycle families. The
version-pinned event list and evidence boundary live in the Codex CLI documentation.
Availability upstream is not activation here. In particular, hosted tools such
as Web Search are outside the general local-function hook path.

Additional Claude overrides can stay in `.claude/settings.local.json`, which
is gitignored and additive. Codex user hooks remain under the user's Codex
configuration and are not part of this repo baseline.

## Policy File

`policy.json` is the canonical hook policy. Platform-specific activation
translates this policy into native config. The policy file is the source
of truth; native config files and repo-local scripts are derived from it.

Its `platform_support` block is descriptive, per-platform activation state
with a closed `status` vocabulary: `supported` (canonical policy natively
enforced), `inherited` (enforced through another platform's activation),
`identity-only` (soft identity/context hook only), and `not-activated` (no
project activation wired). The runtime reads only `hooks.*`; the portability
validator and existing health probe read only
`platform_support.claude_code.status`; `validate-claim-freshness` reads every
row's freshness fields as described below.

Every `platform_support` row also implements ADR-223's freshness contract:

- `grounded_at` is the row's own first-hand evidence date; it is never the date
  the metadata was added.
- `review_by` is after `grounded_at` and no more than this registered surface's
  30-day fast-referent, high-reliance ceiling.
- `pin` is a closed declaration. `{ "kind": "pinned", "version": "x.y.z" }`
  creates a named monitoring obligation using the same bare semantic-version
  shape that the landing-2 collector extracts.
  `{ "kind": "not-tracked", "reason": "..." }` records why no version is
  tracked. A not-tracked row is still date-bounded and reviewable; it is not a
  permanent exemption. Legacy `pinned_to`, nulls, mixed arms, and extra keys
  are invalid.

`validate-claim-freshness` enforces that structural contract deterministically
inside `repo-validators:check`. In MCP-476 landing 1 (PR #745), its successful
output is a report-only inventory of pinned obligations and not-tracked rows;
it does not enforce expiry or pin drift. The concrete MCP-476 landing 2 on
`jimcresswell/mcp-476-claim-freshness-session-instrument` adds the sole
SessionStart and health-probe consumers for those clock- and
environment-bearing decisions. Until that successor lands, the estate must not
claim that invisible freshness decay is prevented. Current pin values and
not-tracked reasons are canonical only in `policy.json`. Known residual
version-stamped evidence remains in `.codex/README.md`,
`agent-tools/docs/agent-identity.md`, the cross-platform surface matrix, and
`policy.json` row notes. Those passages are dated or consumer-local evidence,
not alternative current-pin authorities. Landing 2 adds a mirror census that
allows historical observations but rejects an unqualified current-pin mirror
when it disagrees with `platform_support.*.pin` or fails to point there.

## Porting to Native Activation

When wiring hooks for a platform:

1. Read `policy.json` for the canonical policy
2. Create thin native activation in the platform config directory
3. Normalise the vendor payload in a thin adapter; require exactly one
   supported schema match and fail closed for zero or multiple matches
4. Reuse the workspace-owned runtime rather than duplicating policy
5. Evaluate each successfully dispatched write exactly once; do not add a
   pass-through route or a second policy implementation
6. Test real allow, block, malformed-input, missing-build, and trust paths
7. Update the surface matrix to record the supported state
8. Add drift checks to the portability validation script
