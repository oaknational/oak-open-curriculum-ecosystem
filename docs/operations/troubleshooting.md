---
fitness_line_target: 315
fitness_line_limit: 425
fitness_char_limit: 25500
fitness_line_length: 100
split_strategy: 'Extract workspace-specific troubleshooting to workspace READMEs'
---

# Troubleshooting Guide

## Overview

This guide helps diagnose and resolve common issues with the
Oak Open Curriculum Ecosystem. Follow the steps in order for
each issue.

## Quick Diagnostics

Run these commands from the repo root to check your setup:

```bash
node --version           # Should be 24.x
pnpm --version           # Should be 10.x
pnpm install             # Install dependencies
pnpm sdk-codegen         # Generate types from OpenAPI schema
pnpm build               # Build all workspaces
pnpm type-check          # Verify no type errors
pnpm test                # Run unit and integration tests
```

### Diagnostic evidence discipline

In any diagnostic or experimental thread, evidence discipline overrides the
synthesise-and-conclude reflex:

- **Withhold the verdict until the decisive comparison is observed** — control
  AND treatment under the same conditions. Incomplete data is not a
  conclusion, however fluent the explanation feels.
- **Tag every observation to its layer** in a layered system (shell → terminal
  emulator → host renderer → surface; client → transport → server → store) and
  never let one layer's result stand in for another's. Draw the layer stack
  once, up front.
- **Apply the timestamp-zone discipline** —
  [`verify-dont-trust`](../../.agent/rules/verify-dont-trust.md)
  §Timestamp-Zone Discipline: UTC is the canonical analysis clock, every
  timestamp's zone labelled, conversions shown, and never a timeline
  inferred from a truncated log view.
- **Hand over the exact command you verified**, never a retyped approximation
  — a dropped redirect or flag turns a working probe into "does nothing".
- **Bisect your own diff before theorising about the environment** — when a
  failure appears only where your change is present, the decisive test is
  usually seconds long (run the two invocations separately; revert one hunk);
  an environment theory reaches outward at exactly the moment the change
  under your hand is the obvious suspect (2026-07-25: a worktree-only
  type-check failure spawned a dependency-majors theory; the cause was the
  author's own tsconfig glob, found by a 30-second split run).
- **Before implementing in a code area mid-diagnosis**, check
  `.agent/plans/**/current` and `active` for a governing plan and read it —
  a diagnostic fix built against an active plan's target architecture is
  rework on landing.

## Common Issues

### Credential policy

Real credentials must be kept in local `.env` / `.env.local` files only.
Those files are gitignored and should never be committed.
Use workspace `.env.example` files and other docs as placeholders.

When an agent must edit a secrets-bearing JSON file that the Read hook
blocks (so the Edit tool cannot run — e.g. `~/.claude.json`), use a
surgical jq rewrite instead of hand-editing: timestamped backup → jq the
change to a scratch file → `jq -e .` to validate → a scoped jq comparison
confirming only the target block changed → atomic `mv` into place. Create
the scratch file ALONGSIDE the target (same directory), not in a temp dir:
`mv` is atomic only within one filesystem, and the replaced file adopts the
scratch file's mode — a temp-dir scratch can silently turn a `600`
credentials file into `644`.

### Type Generation Fails

**Symptoms**: `pnpm sdk-codegen` fails or produces unexpected output.

**Steps**:

1. Ensure `OAK_API_KEY` is set in the relevant workspace `.env.local`
2. Check network access to `open-api.thenational.academy`
3. Run `pnpm clean && pnpm sdk-codegen` for a fresh generation

### Build Fails After Type Generation

**Symptoms**: `pnpm build` fails after successful `pnpm sdk-codegen`.

**Steps**:

1. Run `pnpm clean` then `pnpm sdk-codegen && pnpm build` in sequence
2. Check for circular dependencies: generated types should flow from SDK to apps
3. Verify `tsconfig.json` references are correct in the failing workspace

### E2E Tests Fail

**Symptoms**: `pnpm test:e2e` fails with connection or auth errors.

E2E tests use mocks and dependency injection with isolated config, so
they do not require real API keys. If they fail with credential-shaped
errors, the most likely cause is a build artefact or port issue rather
than missing env vars.

**Steps**:

1. Ensure the app builds successfully: `pnpm build`
2. Check that no other process is using port 3333 (streamable-http default)
3. If a Clerk-related error appears, confirm you are running `pnpm test:e2e`

### ESLint Reports Boundary Violations

**Symptoms**: `pnpm lint:fix` reports import boundary errors.

**Steps**:

1. Apps must not import from other apps
2. SDKs must not import from apps
3. Core packages must not import from SDKs or apps
4. Check that imports flow in the correct direction: core -> libs -> sdks -> apps

### Missing Environment Variables

**Symptoms**: App fails to start with "required variable" error.

**Steps**:

1. Copy the example file for the workspace you are running:
   `apps/oak-curriculum-mcp-streamable-http/.env.example` or
   `apps/oak-search-cli/.env.example`
2. Write credentials to that workspace's `.env.local`; there is no root
   `.env.example`
3. See [environment-variables.md](./environment-variables.md) for the complete
   reference

## Search Reindex Boundary

After deploying code that changes search document building or URL generation,
existing indexed documents keep old field values until they are re-ingested.
Symptoms such as legacy `thread_url` values or older `lesson_url` patterns in
search results are stale-index evidence, not necessarily code bugs.

Run the reindex and validation workflow from the `oak-search-cli` ingestion
operations guide:
[Search URL Field Reindex Boundary][ingestion-reindex-boundary].

[ingestion-reindex-boundary]: ../../apps/oak-search-cli/operations/ingestion/README.md#search-url-field-reindex-boundary

## Known Gate Caveats

If `pnpm check` fails, run the affected suite directly and check the latest
issues, ADRs, and active plans before assuming local setup problems.

### Static-analyser gotchas

Static analysers and tooling want **shape and data-flow changes, not runtime
guards or relocations**, and several report stale or silently-green results:

- CodeQL ReDoS findings need a statically-safe regex shape — a runtime guard
  around the same regex does not clear them. CodeQL also RE-KEYS an alert to
  a new number when a fix moves the flagged line: a vanished-plus-new alert
  pair after a refactor is the SAME finding renumbered, not a new finding.
- SonarCloud findings can be stale snapshots of an older analysis — re-check
  against the current branch state before fixing "live" issues.
- dependency-cruiser fires on orphan empty barrels (an `index.ts` left behind
  by a refactor) — delete the barrel, don't exempt it.
- markdownlint silently passes zero files when the glob misses dotdirs — pass
  `--dot` (and note `--fix` can corrupt literal `+` / `#` / `-` characters in
  prose; review its diff before committing).
- knip ignores root-level entries unless `workspaces['.']` is configured.
- knip runs in `pnpm check` / pre-push but NOT the pre-commit hook, so a new
  tsx-spawned or CLI entry file unregistered in `knip.config.ts` passes commit
  and goes red only at closeout — register every new entry point with the
  scaffold, or full-tree knip blocks the next committer.
- `rg` / `fd` skip dotdirs by default — pass `--hidden` when sweeping
  `.agent/` or other dot-directories, and mind `rg -r` (replace) vs `-n`.
  The replace flag also hides inside clusters at ANY position: `-riln`
  parses as `--replace iln`, and `-inr`/`-ilr` parse as `-i -n --replace …`
  — both silently rewrite match output. Spell flags separately; the Bash
  hook policy fingerprints the r-first cluster shape (the observed one),
  not the trailing-r shapes, so those still rest on this habit.
- SonarCloud matches command TEXT, not shell behaviour: curl options
  expanded from a bash array were invisible to its transport rule while
  literal-URL calls were flagged, so a behaviour-identical refactor left
  every finding standing — write the option tokens literally at each call
  site (2026-09-01). Local `sonar verify --file` answers 403 for this
  organisation; the class proof is a per-rule grep plus shellcheck, and the
  gate proof is the PR scan after the push.
- `lint:shell` syntax-checks only `apps/**/scripts/*.sh` and `.husky/*`;
  shell under `.agent/claude-harness-integrations/` is outside it and gets
  shellcheck by hand.
- In a fresh linked worktree `pnpm install` can report `prepare$ husky …
Done` while creating NO `.husky/_` shims, so `core.hooksPath` points at
  nothing and git skips pre-commit and pre-push with zero output (a push
  log of two lines is the tell, 2026-08-30). After install in any linked
  worktree, `ls .husky/_/pre-push` before trusting hook coverage.
- Invisible bytes survive agent tools unreliably: raw ANSI `ESC` (0x1B)
  control bytes render invisibly in the Read tool and do not round-trip
  Write/Edit dependably, so escape sequences composed from read context can
  silently diverge while tests pass; ChatGPT DOCX exports similarly wrap
  citation markers in invisible Unicode PUA characters (U+E200–U+E202).
  Detect with `cat -v` (or `od -c`) against the raw file, never by eye in
  tool output; generate escape sequences from code (`\x1b` literals), not by
  copying rendered context.

### Browser suites prove the BUILT artefact

The showcase Playwright suites run `next start` on `.next` — rebuild before
re-running, or the suite tests the previous code (bit twice in one day,
2026-08-18). When a UI red appears only under one runner or one emulation,
measure before theorising: a CI reflow red pattern-matched to
animation-phase overflow while the a11y suite emulated reduced motion, so
the sway was still and a two-minute probe found the true root. A browser
test that is slow or flaky ONLY in a proxied container is a proxy-CA
mismatch until proven otherwise (the cloud environment doc's provisioning
defects list carries the cure).

### Lockfile desync via pnpm overrides

pnpm overrides (the `overrides:` section of `pnpm-workspace.yaml`, mostly
security floors) rewrite the **effective specifier of direct dependencies**
too, not just transitive pins. Adding a direct dependency that matches an
existing override desyncs the lockfile — the lockfile must record the
override's specifier, not the manifest's — and nothing local catches it,
because no local gate runs a frozen install; CI's
`pnpm install --frozen-lockfile` is the first surface that does
(`ERR_PNPM_OUTDATED_LOCKFILE`, worked instance: esbuild vs the `>=0.28.1`
floor, PR #296). Cure: run `pnpm install` and commit the lockfile; when
adding a direct dep, grep the overrides for its name first.

A lockfile can also be outright corrupted rather than desynced — a bad merge
once left two concatenated YAML documents in `pnpm-lock.yaml`, surfacing as a
baffling remote (Vercel) build failure that invited runtime-shaped
speculation. When a remote build fails mysteriously, check the lockfile is a
single YAML document first: `grep -n '^---' pnpm-lock.yaml` — a healthy pnpm
lockfile has no document separator, so ANY hit means concatenated documents
(this repo's parsers, node `yaml` and python `pyyaml`, are not resolvable at
the root, so the grep is the dependency-free check). Do NOT use
`pnpm install` as the parse check: on this exact corruption it prints
`WARN Ignoring broken lockfile`, exits 0, and silently REWRITES the lockfile
— a false pass that also destroys the diagnostic evidence.

### Type-check undercounts a migration surface

`pnpm type-check` is not the full failure surface for a type or schema
migration: Zod-runtime parse errors on fixtures and recorded data surface only
when the test suite runs. Sizing a migration from the type-check failure count
alone undercounted the real surface roughly 3× on the Result-migration
workstreams (two independent sessions, 2026-05-15 and 2026-05-21) — run the
full test suite before sizing or declaring a migration surface.

### Cache false-greens

Turbo and pre-commit caching can mask failures: a cached result replays green
while the underlying task would now fail, remote-cache poisoning replays stale
errors, and a cached `format:root` reports clean while the hook finds drift.
When diagnosing a gate discrepancy, **never trust a cached result** — re-run
the task with `--force` (or via the authoritative hook) before concluding
anything. See also `docs/engineering/build-system.md` on cache inputs.

## Quick Fixes

| Symptom                                                 | Fix                                                             |
| ------------------------------------------------------- | --------------------------------------------------------------- |
| `pnpm publish --dry-run` fails with uncommitted changes | Add `--no-git-checks` flag                                      |
| `pnpm benchmark` not found                              | The command is `pnpm benchmark` (not `pnpm eval:benchmark`)     |
| E2E `tool-examples-metadata` flaky                      | SSE payload timing issue — retry once before investigating      |
| Test upstream API status codes                          | `curl -s -w "\n%{http_code}" <url>` to see both body and status |

## Quality Gate Failures

If any quality gate fails, run the full chain in order to isolate the issue:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui
```

Each gate may fix issues for subsequent gates (e.g.
`format:root` fixes formatting that `lint:fix` then passes).

### CI Passes Locally but Fails in CI

Check CI logs for "cache hit, replaying logs" — stale remote
Turbo cache. Ensure `turbo.json` `inputs` use `**/*.ts` not
directory enumeration.

### Pre-Commit Hook Output Too Large

Turbo replays all cached logs during the hook. Redirect output
to a file and read the end for the actual error.

### Pre-Commit Blocks Partial Fixes

The hook runs full `type-check lint test` across all packages.
On lint-red branches, fix ALL lint errors before attempting
any commit — partial fixes will still be blocked by errors
elsewhere.

### ESLint Complexity Threshold on Short Functions

`??` and `?.` each count as branches toward the complexity
limit. A 15-line function can hit complexity 10 from nullish
coalescing alone. Extract an options-resolver helper to move
the coalescing out of the main function.

## File Move and Refactoring Issues

### ESLint Rule Overrides After File Moves

When moving files between workspaces, ESLint rule overrides
must also move — otherwise lint errors appear silently in the
destination. Also check that relative links in README files
adjust for directory depth changes (e.g. `../../../docs/` may
become `../../../../docs/`).

### Stale tsup Entry Points

Stale tsup entries match nothing silently after file moves — remove dead entry points promptly.

### Stale ADR File Paths

ADR Implementation sections have file paths that go stale
when packages are moved. Always grep ADRs for old paths after
a move. Similarly, check TSDoc `@see` links for old GitHub
repo URLs when removing a workspace.

### Cross-Package Function Moves

After moving functions between packages (e.g. from
`search-cli` to `curriculum-sdk`), rebuild the source package
(`pnpm --filter <pkg> build`) before downstream tests will
see the new exports via `dist/`. Turborepo cache may hide the
issue until a clean build.

### Second-Level Barrels

When migrating facade imports, check for second-level barrels
(e.g. `oak.ts` re-exporting from the facade) — they add
hidden consumers that do not appear in a direct grep for the
facade file.

### TS2209 rootDir Ambiguity

When `tsconfig.build.json` narrows `include` from a wide
base, add explicit `rootDir: "./src"` for export map
resolution.

### Vitest v4 Test Filtering

`--testPathPattern` fails in vitest v4. Use file paths as
positional args instead:
`pnpm vitest run path/to/test.ts`.

## Agent Workflow Issues

### Statusline Segments Missing, or Payload Diagnosis

When an expected statusline segment does not render (context %, session
or weekly usage %, identity, git location), the question splits: is the
adapter dropping it, or did the harness never send the field? The
adapter deliberately drops absent fields — for example the usage
percentages render only when the payload carries `rate_limits`, which
Claude Code includes only for Claude.ai subscriber auth after the first
model response.

To see exactly what the harness sends, set the diagnosis log and
restart the session:

```json
// .claude/settings.local.json (machine-local, untracked)
{ "env": { "OAK_STATUSLINE_LOG_FILE": ".logs/statusline.log" } }
```

Each statusline invocation then appends one timestamped line with the
payload as received (line breaks collapsed to keep one line per
invocation) to the named `.log` file; `.logs/` is the repo's gitignored
log directory. Read the latest line and check which fields are present.

Reading the outcomes honestly:

- **A set non-blank value that does not end `.log` renders a loud
  statusline warning** and logs nothing — misconfiguration is never
  silent. A blank or whitespace-only value is treated as unset:
  neither a warning nor a log.
- **No file and no warning?** Check the adapter is current before
  concluding anything: the shim runs the BUILT adapter, so a stale
  `agent-tools/dist` silently predates the feature —
  `grep -c OAK_STATUSLINE_LOG_FILE agent-tools/dist/src/claude/statusline-identity.js`
  returning `0` means rebuild (`pnpm --filter @oaknational/agent-tools build`).
  A current adapter can also produce no-file-and-no-warning when the
  destination refuses (unwritable parent, a symlink or non-regular file
  at the path, a file the invoking user cannot own, denied append) —
  refusals are deliberately swallowed, so check the destination is a
  creatable, writable, regular file owned by you before concluding the
  payload never arrived.
- **Hygiene**: the log grows unbounded (one line per refresh) and
  carries session ids and project paths. The destination is a boundary
  (symlinks refuse to open, non-regular files never receive a write, a
  pre-existing file is retightened to owner-only before each append), but
  a pre-existing parent directory's permissions are not retightened —
  prefer a private directory, and delete the file after the diagnosis,
  don't just unset the variable.

Mechanism reference:
[agent-tools README §Claude statusline quick reference](../../agent-tools/README.md#claude-statusline-quick-reference).

### Background Reviewer Agents Not Returned

Reviewer sub-agents dispatched near the end of a conversation
turn may be lost when the turn completes. Re-invoke in the
next session.

### Recovering a Failed Sub-Agent's Work

When a sub-agent terminates mid-task (credits, timeout, error), its full
transcript — every tool call and result — is preserved on disk:

```text
~/.claude/projects/<project>/<session-uuid>/subagents/agent-<agentId>.jsonl
~/.claude/projects/<project>/<session-uuid>/subagents/agent-<agentId>.meta.json
```

`<agentId>` is the 17-char id in the agent's final message. Inspect what
the prior agent already read, then brief a fresh dispatch with the
original task PLUS a "prior agent already read these files" preamble —
the retry warm-starts instead of repeating the reads (worked instance
2026-04-25: a credit-exhausted reviewer's retry delivered in 3 tool uses
after the transcript showed what was already grounded). Useful jq:

```bash
# Every tool call, truncated input
jq -r 'select(.message.role == "assistant") | .message.content[]?
  | select(.type == "tool_use")
  | "TOOL: \(.name)\nINPUT: \(.input | tostring | .[0:200])\n---"' \
  agent-<id>.jsonl
# The agent's own text output
jq -r 'select(.message.role == "assistant") | .message.content[]?
  | select(.type == "text") | .text' agent-<id>.jsonl
```

Prefer `SendMessage` with the agent id to resume when available; the
transcript recovery is the equivalent when it is not.

### MCP App UI Not Rendering in Client

Test with the reference host (`ext-apps basic-host`) first.
Cursor caches MCP tool `_meta` and does not reliably refresh
on disconnect/reconnect. If the reference host renders the
widget but Cursor doesn't, it's a client cache issue, not a
server bug.

### MCP Tool Call Fails with Wrong Param Type

Always read tool descriptors before calling — parameter types
are explicit in the schema. Do not guess parameter shapes.

### Commitlint Rejects Commit

See CONTRIBUTING.md §Code Standards for `subject-case` and `body-max-line-length` rules.

### Worktree Agent Patches Don't Apply to Feature Branch

Worktree agents branch from `main`, not the current feature
branch. When `main` and feature have diverged, manual file
copy and reconciliation is needed.

### Codex Reviewer Not Resolved

Resolve every reviewer with
`pnpm agent-tools:codex-reviewer-resolve <name>` before
trusting a Codex review. The underlying `tsx` call may need
escalation because it opens a local IPC pipe under the
platform temp directory.

### `git merge --abort` Wipes Staged Changes

Any uncommitted staged files (e.g. planning artefacts staged but
not committed) are lost when aborting a merge. Always commit
planning artefacts before attempting a merge.

### Run `pnpm format:root` After Merge

Auto-merged content from main may have inconsistent formatting.
Always run `pnpm format:root` after completing a merge to catch
formatting drift before the pre-commit hook rejects the commit.

### Turbo Graph: Reproduce Under `--force` First

When a quality gate fails but the error doesn't reproduce under
a narrower turbo task, re-run both the narrow turbo shape and the
full gate under `--force` before inventing orchestration fixes.
The turbo cache itself may be the problem.

### StrReplace Fails on Plan Files

Unicode quotes (U+2019, U+201C/D) block exact string
matching. Copy the target string from the file rather than
typing it.

### Reviewer Reports Failures That Seem Wrong

Re-run specific gates to verify — reviewers may read stale
output. Verify reviewer claims with `glob` or `ls`; they
produce consistent false positives on file names and repo
names.

## TSDoc Issues

- `{@link ./path}` is NOT valid TSDoc — use backtick references for module paths.
- Braces `{ }` in TSDoc trigger malformed inline tag errors.
- `>` in TSDoc examples needs backslash escape.
- Never use `\x00` in regex — use string-based placeholders (e.g. `___TSDOC_SAFE_N___`).
- `openapiTS` emits `@constant` as both single-line
  (`/** @constant */`) and multi-line — regex must handle
  both forms.
- ESLint plugins using dynamic file resolution
  (`@microsoft/tsdoc-config`) must be marked `external` in
  tsup bundles.
- `tsdoc.json` `extends` works with
  `@microsoft/tsdoc-config` 0.18.0;
  `TSDocConfigFile.findConfigPathForFolder` stops at
  `package.json`/`tsconfig.json` boundaries — each workspace
  needs its own `tsdoc.json` with `extends`.
