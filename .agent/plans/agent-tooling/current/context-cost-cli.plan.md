---
name: "Context Cost CLI"
overview: "Deliver a vendor-agnostic agent-tools subcommand that estimates token cost over an arbitrary fileset (chars/4 baseline, swap seam for real tokenizer), so an agent or owner can answer 'what is the token cost of these files?' without bespoke shell pipelines."
todos:
  - id: ws1-cycle-1
    content: "WS1 cycle 1: pure tokenizer estimator. Test estimateTokens(text) returns ceil(text.length / 4) for fixture inputs against the Tokenizer interface. One commit. Tree green."
    status: pending
  - id: ws2-cycle-1
    content: "WS2 cycle 1: per-file row computation. Test tokenizeFile(absolutePath, fs, tokenizer) returns {path, chars, tokens} via the injected ContextCostFileSystem; throws typed FileReadError on missing file. One commit. Tree green."
    status: pending
    depends_on: [ws1-cycle-1]
  - id: ws3-cycle-1
    content: "WS3 cycle 1: glob expansion + aggregate. Test tokenizeGlobs(globs, cwd, fs, tokenizer) returns deterministic rows + aggregate + warnings against a fake ContextCostFileSystem. One commit. Tree green."
    status: pending
    depends_on: [ws2-cycle-1]
  - id: ws4-cycle-1
    content: "WS4 cycle 1: pure CLI option parser. Test parseArgs(argv) returns the discriminated-union ParseResult covering --glob (repeatable), --json, --help, missing --glob, unknown flag. One commit. Tree green."
    status: pending
  - id: ws5-cycle-1
    content: "WS5 cycle 1: CLI integration. Integration test invokes runContextCostCli against a tmp directory and asserts deterministic text + JSON outputs; register context-cost in dispatchTopic; add the runContextCostTopic handler; add tinyglobby dep + workspace pnpm script. One commit. Tree green."
    status: pending
    depends_on: [ws3-cycle-1, ws4-cycle-1]
  - id: ws6-docs
    content: "WS6: documentation slice. agent-tools/README.md subcommand entry; back-link in the strategic source plan §1; reproducibility footnote in practice-context-cost-baseline.md. One commit, no behaviour change."
    status: pending
    depends_on: [ws5-cycle-1]
isProject: false
---

# Context Cost CLI

**Last Updated**: 2026-05-14
**Status**: 🟢 DECISION-COMPLETE / READY FOR EXECUTION
**Scope**: A new `context-cost` subcommand under the unified `agent-tools` binary that, given one or more file globs, returns a deterministic per-file and aggregate estimate of token cost using a chars/4 baseline behind a swappable `Tokenizer` interface.

**Strategic source**:
[memetic-immune-system-and-progressive-disclosure.plan.md §Scope Expansion Register §1](../../agentic-engineering-enhancements/future/memetic-immune-system-and-progressive-disclosure.plan.md)

**Empirical baseline this CLI replaces / unlocks**:
[practice-context-cost-baseline.md](../../../analysis/practice-context-cost-baseline.md)
— the always-on rule tier and skill tier figures in that file were produced by manual `wc -c` plus jq pipelines. The CLI replaces those one-shots with a deterministic command suitable for repeated baselines and ad-hoc per-fileset queries.

---

## Context

### Problem Statement

Agents and the owner periodically need to answer aggregate questions like:

- "What is the token cost of the always-on rule tier (`.agent/rules/*.md`)?"
- "What is the token cost of the active skill estate (`.agent/skills/**/SKILL*.md`)?"
- "What is the token cost of the AGENT.md entry-point graph?"
- "Has rule X grown materially since the baseline?"

Today the answer requires hand-rolled shell pipelines (`find … | xargs wc -c | awk …`) or one-off jq scripts against session JSONLs. The `practice-context-cost-baseline.md` figures were captured this way and are not reproducible without re-deriving the pipeline.

### Existing Capabilities

- The strategic source plan registers this CLI as item §1 of its Scope Expansion Register and names the eventual home as the `agent-tools/` workspace.
- The unified `agent-tools` binary (`agent-tools/src/bin/agent-tools-cli.ts`) registers topics in `dispatchTopic`. New topics add a single `if (input.parsed.topic === '<name>')` block plus a topic handler in `agent-tools-cli-topics.ts` (`runCommitQueueTopic`, `runBranchTouchedFilesTopic`, `runCodexExecTopic` are the precedent shape).
- The Vitest base config at `vitest.config.base.ts` includes `src/**/*.test.ts` and `tests/**/*.test.ts` automatically. Files named `*.unit.test.ts` and `*.integration.test.ts` are picked up by that pattern. E2E lives under `agent-tools/e2e-tests/**/*.e2e.test.ts` in a separate config and is out of scope for this plan.
- `tinyglobby` is not currently in `agent-tools/package.json` deps; the precedent for filesystem walks is `node:fs/promises` `readdir` (e.g. `agent-tools/src/practice-substrate/live-files.ts`). This plan adds `tinyglobby` for glob expansion correctness; see §Settled Decisions.

---

## End Goal

Any agent or the owner can run a single deterministic command to get the token cost of an arbitrary fileset, today against a chars/4 estimator and tomorrow against a real tokenizer through the same surface.

## Mechanism

A pure `Tokenizer` interface with a chars/4 default implementation is wrapped by a thin file-walker and emitter. The CLI composes those parts. Because the tokenizer is an interface, swapping in tiktoken, the Anthropic count_tokens endpoint, or a per-vendor variant later is a constructor change at the CLI composition root, not a refactor across the codebase.

## Means

Six small slices, ordered so each commit greens the tree:

1. pure `Tokenizer` with a `chars/4` default implementation;
2. per-file row computation against an injected `ContextCostFileSystem`;
3. glob expansion + aggregate + warnings;
4. pure CLI option parser;
5. CLI integration: topic handler + dispatchTopic registration + workspace pnpm script + tinyglobby dep + integration test;
6. documentation slice: agent-tools README, strategic-plan back-link, baseline footnote.

## Design Principles

1. **Pure core, IO at the edge** — the tokenizer, per-file computation, glob expansion, and option parser are all pure functions over injected dependencies. Only WS5 touches real IO.
2. **Estimator behind an interface** — the chars/4 estimator is one implementation of `Tokenizer`. A swap to tiktoken or `count_tokens` later is a constructor change, not a refactor.
3. **Glob in, deterministic rows out** — input shape is one or more `--glob` patterns; output shape is a fixed per-file row schema plus an aggregate footer plus per-glob warnings.
4. **Two output modes only** — text (human, tab-separated) and JSON (machine). Matches the existing `branch-touched-files` `--json` convention in the same workspace.
5. **Stay narrow against the strategic register** — this plan delivers §1 only. §2 (frontmatter token fields), §3 (fitness reporter token rendering), and §4 (frontmatter mandation) remain in the strategic plan and promote on their own evidence triggers.

**Non-Goals** (YAGNI):

- Real tokenizer (tiktoken, Anthropic count_tokens, OpenAI tokenizer). Only chars/4 with the swap seam.
- Session JSONL passive harvest as an input mode — different parsing concern (vendor-specific JSONL shape, Read-tool path extraction). Add as a follow-up plan if the harvest use case promotes.
- "Smart" presets such as `--preset always-on-rules` or `--preset skills`. Globs are sufficient and avoid coupling to the rule-index resolution path.
- Output formats beyond text and JSON.
- Frontmatter `fitness_token_target` / `fitness_token_limit` fields — covered by strategic-register §2.
- Fitness reporter integration showing tokens alongside chars — covered by strategic-register §3.
- Mandating frontmatter across rule/skill/command/practice-core files — covered by strategic-register §4.
- Telemetry on the CLI run (no Sentry, no OTel). It is a local read-only command.
- Cross-platform session-log adapters (Claude/Cursor/Codex history) — out of scope; that is the JSONL harvest concern named above.
- E2E test surface. The unit + integration coverage in this plan is sufficient; E2E adds no proof beyond the integration test for a read-only CLI.

---

## Settled Decisions

Every decision required to execute this plan without further planning work is fixed below. WS sections refer back to these.

### D1 — `Tokenizer` interface

```typescript
// agent-tools/src/context-cost/tokenizer.ts
export interface Tokenizer {
  readonly estimate: (text: string) => number;
}

export const charsOverFourTokenizer: Tokenizer = {
  estimate: (text) => Math.ceil(text.length / 4),
};
```

`text.length` is the JavaScript UTF-16 code-unit count. The chars/4 approximation is documented in `.agent/analysis/practice-context-cost-baseline.md` as ~10–15% accurate for English-prose markdown; this plan does not improve the approximation, only stabilises the surface. Empty string returns 0; `Math.ceil` is used so any non-empty text contributes at least 1 token.

### D2 — `ContextCostFileSystem` interface

```typescript
// agent-tools/src/context-cost/file-system.ts
export interface ContextCostFileSystem {
  /**
   * Read a file's UTF-8 contents. May reject with any underlying IO error
   * (ENOENT, EACCES, etc.). Wrapping into ContextCostFileReadError happens
   * once at the tokenizeFile boundary (D3), not here, so the interface stays
   * IO-shape agnostic.
   */
  readonly readFileUtf8: (absolutePath: string) => Promise<string>;
  /**
   * Expand a single glob pattern against `cwd` into absolute file paths
   * (files only — symlinks and directories excluded). Returns [] when the
   * glob matches nothing.
   */
  readonly expandGlob: (cwd: string, pattern: string) => Promise<readonly string[]>;
}

export class ContextCostFileReadError extends Error {
  constructor(public readonly absolutePath: string, cause: unknown) {
    super(`failed to read ${absolutePath}: ${cause instanceof Error ? cause.message : String(cause)}`);
    this.name = 'ContextCostFileReadError';
  }
}
```

Two methods, one interface. Production adapter (`file-system-node.ts`, WS5) wraps:

```typescript
import { glob } from 'tinyglobby';
import { readFile } from 'node:fs/promises';

export const nodeContextCostFileSystem: ContextCostFileSystem = {
  readFileUtf8: (absolutePath) => readFile(absolutePath, 'utf8'),
  expandGlob: (cwd, pattern) =>
    glob([pattern], { cwd, onlyFiles: true, absolute: true }),
};
```

Unit tests inject fakes returning preset arrays; no real-fs touch.

Error-ownership rule: `readFileUtf8` and `expandGlob` may reject with any underlying error verbatim. `tokenizeFile` (D3) is the single place that catches a `readFileUtf8` rejection and re-throws as `ContextCostFileReadError`. `tokenizeGlobs` (D4) does not catch glob expansion errors; it lets them propagate to the CLI which exits 2. This keeps each layer's error contract explicit.

### D3 — `tokenizeFile` signature

```typescript
// agent-tools/src/context-cost/per-file.ts
export interface TokenizedRow {
  /** Path as supplied to the function (relative or absolute; preserved verbatim). */
  readonly path: string;
  readonly chars: number;
  readonly tokens: number;
}

export async function tokenizeFile(
  path: string,
  absolutePath: string,
  fs: ContextCostFileSystem,
  tokenizer: Tokenizer,
): Promise<TokenizedRow>;
```

`path` is the row's display path (relative to `cwd`); `absolutePath` is what the fs reads. `chars = text.length`. `tokens = tokenizer.estimate(text)`.

### D4 — `tokenizeGlobs` signature, dedup, sort, warnings

```typescript
// agent-tools/src/context-cost/tokenize-globs.ts
export interface TokenizeGlobsResult {
  readonly rows: readonly TokenizedRow[];
  readonly aggregate: { readonly files: number; readonly chars: number; readonly tokens: number };
  readonly warnings: readonly { readonly glob: string; readonly reason: 'no-matches' }[];
}

export async function tokenizeGlobs(
  globs: readonly string[],
  cwd: string,
  fs: ContextCostFileSystem,
  tokenizer: Tokenizer,
): Promise<TokenizeGlobsResult>;
```

Behaviour:

- Each glob is expanded once via `fs.expandGlob`. Empty result for a glob produces a `warnings` entry with `reason: 'no-matches'` and contributes nothing else.
- Absolute paths from all globs are deduplicated by absolute-path string equality; each unique file appears in `rows` exactly once.
- `path` field on each row is the file path made relative to `cwd` using forward slashes (POSIX style; on Windows, backslashes are converted to `/` to match the conventions used by `live-files.ts`).
- `rows` are sorted ascending by `path` via `String#localeCompare` (matches `agent-tools/src/branch-touched-files/index.ts:45` and `agent-tools/src/practice-substrate/live-files.ts:36`).
- `aggregate` is computed after dedup over the surviving rows.
- A read failure during file processing throws `ContextCostFileReadError`; it is not caught and silently zeroed (fail-fast per `.agent/rules/replace-dont-bridge.md` ethos).

### D5 — CLI option parser

```typescript
// agent-tools/src/context-cost/cli-options.ts
export interface ContextCostOptions {
  readonly globs: readonly string[];
  readonly json: boolean;
  readonly help: boolean;
}

export type ParseResult =
  | { readonly ok: true; readonly options: ContextCostOptions }
  | { readonly ok: false; readonly error: string };

export function parseArgs(argv: readonly string[]): ParseResult;
```

Behaviour, matching the `agent-tools/src/branch-touched-files/cli.ts:109` parser shape:

- `--glob <pattern>` — repeatable, value-bearing. Accumulates into `options.globs`.
- `--json` — boolean flag.
- `--help`, `-h` — boolean flag (sets `help: true`; no other validation runs when help is set).
- `--` — terminator; remaining args are ignored (no positionals are accepted for this subcommand).
- Unknown `--*` flag → `{ ok: false, error: 'unknown option: <flag>\n\n<usage>' }`.
- Missing `--glob` (and not `--help`) → `{ ok: false, error: '--glob is required\n\n<usage>' }`.
- Pure function — no `process.exit`, no `console.log`, no IO.

### D6 — Output schemas

**Text mode** (default), tab-separated, header row, then one row per file, then a totals footer:

```text
path<TAB>chars<TAB>tokens
.agent/rules/foo.md<TAB>1234<TAB>309
.agent/rules/bar.md<TAB>567<TAB>142
---
total: 2 files, 1801 chars, 451 tokens
```

If there are warnings, they print to **stderr** (not stdout) so text-mode stdout stays machine-cuttable:

```text
warning: glob '.agent/missing/*.md' matched no files
```

**JSON mode** (`--json`), single pretty-printed object on stdout, ending newline. The exact emit is:

```typescript
formatJson(result) === JSON.stringify({
  rows: result.rows,
  aggregate: result.aggregate,
  warnings: result.warnings,
}, null, 2) + '\n';
```

Top-level key order is fixed by the literal object construction above (`rows`, `aggregate`, `warnings`). Row key order is fixed by D3 (`path`, `chars`, `tokens`). Aggregate key order is fixed by D4 (`files`, `chars`, `tokens`). Warning key order is fixed by D4 (`glob`, `reason`). Two-space indentation. Trailing newline. Numbers are integers.

The WS5 integration test asserts both that the stdout parses against the Zod shape schema **and** that it equals the byte-exact expected string (so a future implementor cannot drift the formatting silently).

### D7 — Exit codes

| Outcome | Exit code |
|---|---|
| Success (rows or empty + warnings) | 0 |
| Parser error (unknown flag, missing required) | 2 |
| Read error during file processing (`ContextCostFileReadError`) | 2 |
| Unhandled error | 2 |

Matches existing agent-tools subcommands (`branch-touched-files` returns 2 on error; the `agent-tools` umbrella CLI also returns 2 on unknown topic / unhandled exception per `agent-tools-cli.ts:57`).

### D8 — Help text content

```text
context-cost --glob <pattern> [--glob <pattern> ...] [--json]

Estimate token cost over a fileset using the chars/4 baseline tokenizer.
Token estimate is approximate (~10-15% accuracy band against real tokenizers
for English-prose markdown). See .agent/analysis/practice-context-cost-baseline.md
for methodology.

Options:
  --glob <pattern>   File glob to include. Repeatable. Required unless --help.
  --json             Emit machine-readable JSON to stdout instead of tab-
                     separated text. Warnings still go to stderr.
  -h, --help         Show this help.

Examples:
  agent-tools context-cost --glob '.agent/rules/*.md'
  agent-tools context-cost --glob '.agent/skills/**/SKILL.md' --glob '.agent/skills/**/SKILL-CANONICAL.md'
  agent-tools context-cost --glob '.agent/rules/*.md' --json
```

### D9 — Subcommand registration

Two source-file edits and one package.json edit, all in WS5 cycle 1:

1. `agent-tools/src/context-cost/cli.ts` — exports `runContextCostCli({ argv, cwd, fs, tokenizer, stdout, stderr })` returning `Promise<{ exitCode, stdout, stderr }>` analogous to the unified-CLI shape used elsewhere; composes parser → glob expansion → tokenization → formatting.
2. `agent-tools/src/bin/agent-tools-cli-topics.ts` — adds `runContextCostTopic(input, args)` following the `runBranchTouchedFilesTopic` shape (synchronous wrapper around the cli function with stdout/stderr buffer marshalling).
3. `agent-tools/src/bin/agent-tools-cli.ts` — adds `if (input.parsed.topic === 'context-cost') { return runContextCostTopic(input.input, input.parsed.topicArgs); }` in `dispatchTopic`, and adds `'  context-cost'` to the `usage()` topic list.
4. `agent-tools/package.json` — adds `"context-cost": "cd .. && node agent-tools/dist/src/bin/agent-tools.js context-cost"` to `scripts`, and `"tinyglobby": "^0.2.0"` to `dependencies`.

### D10 — Dependency choice: `tinyglobby` (build-vs-buy attestation for this utility dep)

**Need**: glob expansion supporting `**`, `*`, brace expansion, file-vs-directory discrimination, symlink avoidance. The use case requires this minimum (e.g. `.agent/skills/**/SKILL.md`).

**Build option**: hand-roll a pattern matcher against `node:fs/promises.readdir`. Rejected: implementing `**` correctly with cycle protection and ignoring symlinks reproduces work `tinyglobby` already does, with worse correctness guarantees and an open-ended bug surface.

**Buy option**: `tinyglobby` v0.2.x. Small (~60 KB), zero runtime deps, MIT-licensed, actively maintained, stable `glob(patterns, options)` API across the 0.2.x line. The repo's full template build-vs-buy block (vendor integrations: observability, auth, DB, bundler, CI/CD, hosting, payments, analytics, search, storage, queueing, LLM provider) does not literally name pure-utility libraries; `zod`, `ajv`, and `globals` are precedent for utility deps in the same workspace. This subsection is the build-vs-buy record for this dependency.

**Decision**: buy. Pinned to `^0.2.0` against the v0.2.x API recorded in D2.

### D11 — Test naming + invocation

- New test files: `agent-tools/src/context-cost/<name>.unit.test.ts` and `agent-tools/src/context-cost/cli.integration.test.ts`. Both auto-included by `vitest.config.base.ts`'s `src/**/*.test.ts` pattern.
- Focused per-cycle invocation (matches the napkin lesson `2026-05-10 — Mossy Drifting Glade`):

  ```bash
  pnpm --dir agent-tools exec vitest run src/context-cost/<file>.test.ts
  ```

- Workspace gate after every cycle:

  ```bash
  pnpm --dir agent-tools test
  pnpm --dir agent-tools type-check
  pnpm --dir agent-tools lint
  ```

### D12 — `cwd` resolution

`runContextCostCli` consumes `cwd: string` as a required argument. The topic handler in `agent-tools-cli-topics.ts` passes `input.cwd` (always present per `AgentToolsCliInput`). Globs are resolved against this `cwd`. Repo-root resolution via `git rev-parse` is **not** done — globs are evaluated where the user invoked the command, matching the conventional shell-tool intuition.

---

## Cycle Dependencies and Parallelisation

> See [TDD Cycles component](../../templates/components/tdd-phases.md) §"Atomic, independent cycles for parallel dispatch".

`ws1-cycle-1` and `ws4-cycle-1` are parallel-safe (separate file scopes, no acceptance dependency on each other). `ws2-cycle-1` depends on `ws1-cycle-1` (consumes the `Tokenizer` interface). `ws3-cycle-1` depends on `ws2-cycle-1` (composes per-file rows into an aggregate). `ws5-cycle-1` depends on `ws3-cycle-1` and `ws4-cycle-1` (composes both into the CLI integration). `ws6-docs` depends on `ws5-cycle-1` (documents the landed shape).

Natural decomposition gives WS1 and WS4 as independent cycles; the other dependencies are real, not invented.

---

## WS1 — Pure Tokenizer Estimator

> See [TDD Cycles component](../../templates/components/tdd-phases.md).

### Cycle 1.1: chars/4 tokenizer behind a swap seam

**Parallel-safety**: parallel-safe with `ws4-cycle-1`.

**Starting state**: branch HEAD at dispatch.

**File scope** (this cycle is permitted to touch):

- `agent-tools/src/context-cost/tokenizer.ts` (NEW)
- `agent-tools/src/context-cost/tokenizer.unit.test.ts` (NEW)

**File scope NOT to touch**: anything outside `agent-tools/src/context-cost/`.

**Test** (Red): `tokenizer.unit.test.ts` asserts:

1. `charsOverFourTokenizer.estimate('')` returns `0`.
2. `charsOverFourTokenizer.estimate('1234')` returns `1` (exact 4-char boundary).
3. `charsOverFourTokenizer.estimate('12345')` returns `2` (rounding-up boundary documented).
4. `charsOverFourTokenizer.estimate('a'.repeat(4000))` returns `1000` (deterministic large input).
5. The exported `Tokenizer` type is satisfied by `charsOverFourTokenizer` (a runtime check that calls `estimate` through the interface type).

**Product code** (Green): exactly the code in §D1.

**Acceptance**:

```bash
pnpm --dir agent-tools exec vitest run src/context-cost/tokenizer.unit.test.ts
pnpm --dir agent-tools test
pnpm --dir agent-tools type-check
```

All three exit 0; no skipped tests.

**Reviewer dispatch (mid-cycle)**: `type-expert` for the interface shape (the `readonly` arrow-function declaration is intentional for object-literal compatibility); `test-expert` for TDD shape at the unit boundary.

---

## WS2 — Per-File Row Computation

### Cycle 2.1: tokenizeFile against an injected ContextCostFileSystem

**Parallel-safety**: sequenced after `ws1-cycle-1`.

**Starting state**: after `ws1-cycle-1` lands.

**File scope**:

- `agent-tools/src/context-cost/file-system.ts` (NEW) — interface + error class per §D2.
- `agent-tools/src/context-cost/per-file.ts` (NEW) — `tokenizeFile` per §D3.
- `agent-tools/src/context-cost/per-file.unit.test.ts` (NEW)

**File scope NOT to touch**: anything outside `agent-tools/src/context-cost/`.

**Test** (Red): `per-file.unit.test.ts` against a fake `ContextCostFileSystem`:

1. `tokenizeFile('docs/example.md', '/repo/docs/example.md', fakeFs, charsOverFourTokenizer)` for content `'hello, world'` (12 chars) returns `{ path: 'docs/example.md', chars: 12, tokens: 3 }`.
2. The same call with empty content returns `{ path: 'docs/example.md', chars: 0, tokens: 0 }`.
3. When `fakeFs.readFileUtf8` rejects with an `Error('ENOENT')`, `tokenizeFile` rejects with a `ContextCostFileReadError` whose `absolutePath` matches the input and whose message contains `'failed to read /repo/docs/example.md'`.
4. The fake records every call to `readFileUtf8`; the test asserts exactly one call with the expected absolute path and zero calls to `expandGlob` (per-file does not expand globs).

**Product code** (Green): exactly the shapes in §D2 + §D3.

**Acceptance**:

```bash
pnpm --dir agent-tools exec vitest run src/context-cost/per-file.unit.test.ts
pnpm --dir agent-tools test
pnpm --dir agent-tools type-check
```

All three exit 0; no skipped tests; no `node:fs` import in `per-file.ts` or `file-system.ts` (the production adapter is wired in WS5).

**Reviewer dispatch (mid-cycle)**: `type-expert` for the interface shape; `test-expert` for the no-real-IO assertion.

---

## WS3 — Glob Expansion + Aggregate

### Cycle 3.1: tokenizeGlobs returns deterministic rows + aggregate + warnings

**Parallel-safety**: sequenced after `ws2-cycle-1`.

**Starting state**: after `ws2-cycle-1` lands.

**File scope**:

- `agent-tools/src/context-cost/tokenize-globs.ts` (NEW) — per §D4.
- `agent-tools/src/context-cost/tokenize-globs.unit.test.ts` (NEW)

**File scope NOT to touch**: anything outside `agent-tools/src/context-cost/`.

**Test** (Red): against a fake `ContextCostFileSystem` configured with three files (`/repo/a.md` 4 chars, `/repo/b.md` 8 chars, `/repo/c.md` 12 chars):

1. `tokenizeGlobs(['*.md'], '/repo', fakeFs, charsOverFourTokenizer)` returns:
   - `rows`: `[{path:'a.md',chars:4,tokens:1}, {path:'b.md',chars:8,tokens:2}, {path:'c.md',chars:12,tokens:3}]` in that order (alphabetical via `localeCompare`).
   - `aggregate`: `{files: 3, chars: 24, tokens: 6}`.
   - `warnings`: `[]`.
2. `tokenizeGlobs(['a.md', 'a.md'], '/repo', fakeFs, charsOverFourTokenizer)` deduplicates: `rows.length === 1`, `aggregate.files === 1`.
3. `tokenizeGlobs(['*.md', '*.MD'], '/repo', fakeFsWhereSecondGlobMatchesNothing, charsOverFourTokenizer)` returns `warnings: [{glob:'*.MD', reason:'no-matches'}]`.
4. `tokenizeGlobs([], '/repo', fakeFs, charsOverFourTokenizer)` returns empty rows, zero aggregate, zero warnings (no globs, no work).
5. Display paths use forward slashes regardless of `path.sep` (a fake test forces the absolute path through a backslash converter to assert the conversion).
6. Sort stability: invoking the function twice with the same fake produces byte-identical results.

**Product code** (Green): `tokenize-globs.ts` per §D4. Uses only the injected `ContextCostFileSystem` and `Tokenizer`.

**Acceptance**:

```bash
pnpm --dir agent-tools exec vitest run src/context-cost/tokenize-globs.unit.test.ts
pnpm --dir agent-tools test
pnpm --dir agent-tools type-check
```

All three exit 0; no skipped tests.

**Reviewer dispatch (mid-cycle)**: `test-expert` for deterministic-ordering and dedup coverage; `type-expert` for the `TokenizeGlobsResult` shape.

---

## WS4 — CLI Option Parser (pure)

### Cycle 4.1: parseArgs returns the discriminated-union ParseResult

**Parallel-safety**: parallel-safe with `ws1-cycle-1`.

**Starting state**: branch HEAD at dispatch.

**File scope**:

- `agent-tools/src/context-cost/cli-options.ts` (NEW) — per §D5.
- `agent-tools/src/context-cost/cli-options.unit.test.ts` (NEW)

**File scope NOT to touch**: anything outside `agent-tools/src/context-cost/`.

**Test** (Red): one test per row in this table; each asserts the exact `ParseResult` value.

| argv | Expected `ParseResult` |
|---|---|
| `['--glob', '.agent/rules/*.md']` | `{ ok: true, options: { globs: ['.agent/rules/*.md'], json: false, help: false } }` |
| `['--glob', 'a/*.md', '--glob', 'b/*.md']` | `{ ok: true, options: { globs: ['a/*.md', 'b/*.md'], json: false, help: false } }` |
| `['--glob', '*.md', '--json']` | `{ ok: true, options: { globs: ['*.md'], json: true, help: false } }` |
| `['--help']` | `{ ok: true, options: { globs: [], json: false, help: true } }` |
| `['-h']` | `{ ok: true, options: { globs: [], json: false, help: true } }` |
| `[]` | `{ ok: false, error: a string starting with '--glob is required' }` |
| `['--glob', '*.md', '--unknown']` | `{ ok: false, error: a string starting with 'unknown option: --unknown' }` |
| `['--glob']` (missing value) | `{ ok: false, error: a string starting with '--glob requires a value' }` |
| `['--glob', '*.md', '--', 'positional']` | `{ ok: true, options: { globs: ['*.md'], json: false, help: false } }` (terminator drops the rest) |

**Product code** (Green): `cli-options.ts` per §D5. Modelled on the parser shape in `agent-tools/src/branch-touched-files/cli.ts:109` (FLAG/VALUE handler maps + `consumeArg`), adapted to return a discriminated union instead of throwing. No `process.exit`, no `console.log`, no IO imports.

**Acceptance**:

```bash
pnpm --dir agent-tools exec vitest run src/context-cost/cli-options.unit.test.ts
pnpm --dir agent-tools test
pnpm --dir agent-tools type-check
```

All three exit 0; no skipped tests.

**Reviewer dispatch (mid-cycle)**: `type-expert` for the discriminated-union shape; `test-expert` for parser-error coverage.

---

## WS5 — CLI Integration

### Cycle 5.1: context-cost subcommand wired into agent-tools binary

**Parallel-safety**: sequenced after `ws3-cycle-1` and `ws4-cycle-1`.

**Starting state**: after both prerequisites land.

**File scope**:

- `agent-tools/src/context-cost/format.ts` (NEW) — text formatter (header, rows, footer, warnings-to-stderr) per §D6, plus `formatJson(result)` returning the §D6 JSON shape with stable key order.
- `agent-tools/src/context-cost/cli.ts` (NEW) — `runContextCostCli` per §D9: parse → expand → tokenize → format → emit.
- `agent-tools/src/context-cost/file-system-node.ts` (NEW) — production adapter wrapping `node:fs/promises.readFile` and `tinyglobby.glob`.
- `agent-tools/src/context-cost/cli.integration.test.ts` (NEW) — see test below.
- `agent-tools/src/bin/agent-tools-cli-topics.ts` (MODIFIED) — add `runContextCostTopic` per §D9 step 2, following the `runBranchTouchedFilesTopic` shape.
- `agent-tools/src/bin/agent-tools-cli.ts` (MODIFIED) — single `if` branch in `dispatchTopic` and one line in `usage()` per §D9 step 3.
- `agent-tools/package.json` (MODIFIED) — add `tinyglobby` to `dependencies` and `context-cost` to `scripts` per §D9 step 4.

**File scope NOT to touch**: any source under `agent-tools/src/` outside `context-cost/` and the two specifically listed lines in `agent-tools-cli.ts` and the two specifically listed entries in `agent-tools-cli-topics.ts`.

**Test** (Red): `cli.integration.test.ts` creates a tmp directory under `os.tmpdir()`, writes three known files (`a.md` = "1234", `b.md` = "12345678", `c.md` = "123456789012"), and invokes `runContextCostCli` programmatically (not by spawning a shell). It asserts:

1. **Text mode** with `argv = ['--glob', '*.md']` and `cwd = <tmp>`: the result's `exitCode === 0`, `stderr === ''`, and `stdout` equals exactly:

   ```text
   path<TAB>chars<TAB>tokens
   a.md<TAB>4<TAB>1
   b.md<TAB>8<TAB>2
   c.md<TAB>12<TAB>3
   ---
   total: 3 files, 24 chars, 6 tokens
   ```

   (with literal tabs and a trailing newline).

2. **JSON mode** with `argv = ['--glob', '*.md', '--json']`: `stdout` parses as JSON matching a Zod schema asserting the §D6 shape and the exact row + aggregate values.

3. **No-match warning**: `argv = ['--glob', '*.md', '--glob', '*.MISSING']`: `stdout` contains the three rows and no warning text; `stderr` contains `warning: glob '*.MISSING' matched no files\n`; `exitCode === 0`.

4. **Help**: `argv = ['--help']`: `stdout` equals the §D8 help text plus trailing newline; `exitCode === 0`; `stderr === ''`; no fs activity (the test injects a fake `ContextCostFileSystem` whose methods throw if called).

5. **Missing `--glob`**: `argv = []`: `exitCode === 2`; `stderr` starts with `--glob is required`; `stdout === ''`.

6. **Unknown option**: `argv = ['--glob', '*.md', '--bogus']`: `exitCode === 2`; `stderr` starts with `unknown option: --bogus`; `stdout === ''`.

7. **Read failure**: a fake `ContextCostFileSystem` whose `readFileUtf8` throws for `b.md`: `exitCode === 2`; `stderr` contains `failed to read` and the absolute path of `b.md`; `stdout` is empty.

8. **Topic registration smoke**: importing `runContextCostTopic` from `agent-tools-cli-topics.ts` and invoking it with `{ argv: ['context-cost', '--help'], … }`-equivalent input returns the same help text. (This proves the topic is wired into the dispatcher without spawning a subprocess.)

**Product code** (Green):

- `format.ts` produces the exact strings in §D6.
- `cli.ts` composes parser + production fs adapter + tokenizer + formatter, returning `{ exitCode, stdout, stderr }`. Help short-circuits before any fs call.
- `file-system-node.ts` is the only file in `context-cost/` allowed to import `node:fs/promises` and `tinyglobby`; it satisfies the §D2 interface.
- `agent-tools-cli-topics.ts` adds `runContextCostTopic`, following `runBranchTouchedFilesTopic`'s buffer-marshalling pattern.
- `agent-tools-cli.ts` adds the dispatch branch and the usage line.
- `package.json` adds the dep and the script.

**Acceptance**:

```bash
pnpm --dir agent-tools exec vitest run src/context-cost/cli.integration.test.ts
pnpm --dir agent-tools test
pnpm --dir agent-tools type-check
pnpm --dir agent-tools lint
pnpm --dir agent-tools build
pnpm agent-tools context-cost --help    # from repo root, prints §D8 verbatim, exits 0
```

All exit 0; no skipped tests; no warnings.

**Reviewer dispatch (mid-cycle)**: `architecture-expert-barney` for boundary discipline (only `file-system-node.ts` and the binary touch IO); `test-expert` for the integration shape (programmatic invocation, not subprocess); `type-expert` for the Zod schema in the JSON test.

---

## WS6 — Documentation

### 6.1: agent-tools README + strategic-source back-link + baseline footnote

Pure documentation, no behaviour change. One commit:

- `agent-tools/README.md` — add `context-cost` to the Commands list (after `branch-touched-files` per workspace ordering convention) with one example invocation: ``pnpm agent-tools context-cost --glob '.agent/rules/*.md'``.
- `.agent/plans/agentic-engineering-enhancements/future/memetic-immune-system-and-progressive-disclosure.plan.md` — under §Scope Expansion Register §1, replace the existing 2026-05-14 promotion note with one that links to this plan **as landed** (the execution session writes the WS5 cycle's commit SHA into the note when this WS6 commit is authored) and notes JSONL harvest remains in §1's strategic scope.
- `.agent/analysis/practice-context-cost-baseline.md` — add a footnote under §Method noting that `pnpm agent-tools context-cost --glob '.agent/rules/*.md'` is the new reproducible surface for the always-on rule tier figure (do not restate the figure; the footnote is a pointer).

**Acceptance**:

```bash
rg -n "pnpm agent-tools context-cost" agent-tools/README.md
rg -n "context-cost-cli.plan.md" .agent/plans/agentic-engineering-enhancements/future/memetic-immune-system-and-progressive-disclosure.plan.md
rg -n "agent-tools context-cost" .agent/analysis/practice-context-cost-baseline.md
pnpm markdownlint:root
```

All four exit 0 (rg exit 0 means a match was found; markdownlint exit 0 means clean).

---

## Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md).

Per-cycle gates are listed inline in each WS section. After WS5 lands, before WS6, run the canonical aggregate gate from the repo root:

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
```

(Per the start-right-quick `.agent/skills/start-right-quick/shared/start-right.md` Quality Gates list. `pnpm doc-gen` is not required because no public TSDoc surface lands here. `pnpm test:e2e`, `pnpm test:widget*`, `pnpm test:a11y` are not required because no E2E, widget, or a11y surface is touched.)

---

## Proof Contract

### Value Proxy

**Name**: reproducible per-fileset token estimate is one command away.

**Why this proxy represents value**: the `practice-context-cost-baseline.md` figures took bespoke pipelines to produce and cannot be re-derived without re-discovering those pipelines. After this plan, any agent or the owner can re-derive equivalent numbers for any fileset with a single deterministic command — unlocking ad-hoc questions ("what is my skill estate costing now?") without bespoke shell.

### Acceptance IDs

| ID | Proof level | Cycle | Command or observation |
|---|---|---|---|
| `acc-tokenizer-shape` | unit | ws1-cycle-1 | `pnpm --dir agent-tools exec vitest run src/context-cost/tokenizer.unit.test.ts` exits 0 |
| `acc-per-file-row` | unit | ws2-cycle-1 | `pnpm --dir agent-tools exec vitest run src/context-cost/per-file.unit.test.ts` exits 0 |
| `acc-glob-aggregate` | unit | ws3-cycle-1 | `pnpm --dir agent-tools exec vitest run src/context-cost/tokenize-globs.unit.test.ts` exits 0 |
| `acc-cli-options` | unit | ws4-cycle-1 | `pnpm --dir agent-tools exec vitest run src/context-cost/cli-options.unit.test.ts` exits 0 |
| `acc-cli-integration` | integration | ws5-cycle-1 | `pnpm --dir agent-tools exec vitest run src/context-cost/cli.integration.test.ts` exits 0 |
| `acc-help-text` | value-proxy | ws5-cycle-1 | `pnpm agent-tools context-cost --help` from repo root prints §D8 verbatim, exits 0 |
| `acc-cli-live-parity` | value-proxy | ws6-docs | manual: `pnpm agent-tools context-cost --glob '.agent/rules/*.md'` row count equals `find .agent/rules -maxdepth 1 -name '*.md' \| wc -l`, and the aggregate `chars` value equals the sum of `wc -c` (or `LC_ALL=C wc -c`) over the same fileset, computed in the same shell session. Equality is exact while `.agent/rules/*.md` content remains ASCII (the repo's current state); if the rule estate adopts non-ASCII content, the check must switch to `wc -m` with a fixed locale. The aggregate `tokens` value equals `ceil(chars / 4)` mechanically given the chars match. |

Workstream completion requires every acceptance id above to pass via the named command. Slice landing, session close, or claim close is not completion.

The TDD evidence for `acc-tokenizer-shape` through `acc-cli-integration` is test-first: each cycle's failing test must be observed red before product code lands. Tests added after product code do not satisfy the proof contract for these ids.

---

## Plan-Body First-Principles Check

Per [`.agent/rules/plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md), the three clauses are evaluated below at plan-author time. Implementation sessions must re-evaluate them at edit time and surface any drift before authoring tests or code.

1. **Shape clause.** The WS1–WS4 unit tests assert Oak-authored behaviour: the chars/4 estimator output, the per-file row shape, the aggregation behaviour, the parser's discriminated-union output. The WS5 integration test asserts the composed CLI's stdout/stderr behaviour — Oak-authored shell-of-command — not the registration shape of the upstream subcommand framework. None of the tests assert "Vitest works" or "tinyglobby globs correctly"; they assert what `runContextCostCli` and its pure-core pieces produce.
2. **Landing-path clause.** New test files live under `agent-tools/src/context-cost/` and end in `.unit.test.ts` or `.integration.test.ts`; the existing Vitest base config (`vitest.config.base.ts:32`) includes `src/**/*.test.ts` automatically. The `context-cost` topic registration follows the existing dispatch shape verified at plan-author time in `agent-tools-cli.ts:106-137`. The pnpm script entry follows the existing convention verified in `agent-tools/package.json:17-23`.
3. **Vendor-literal clause.** The only third-party literal in this plan is `tinyglobby`. The expected call shape — `import { glob } from 'tinyglobby'; await glob([pattern], { cwd, onlyFiles: true, absolute: true })` — is pinned in D2 against the current public `tinyglobby` v0.2.x API. WS5 implementation should still run `pnpm list tinyglobby` after `pnpm install` to confirm the installed major.minor matches the planned `^0.2.0`, and a single `tsc` pass to confirm the imported symbol exists with the expected signature. If the installed version's API differs from D2 (rather than a different version inside the same line), surface the drift via a decision-thread before authoring `file-system-node.ts`; do not improvise a different call shape silently. This is drift detection, not deferred decision-making.

---

## Risk Assessment

| Risk | Mitigation |
|---|---|
| chars/4 estimate diverges from real tokenizer enough to mislead decisions. | Tokenizer interface is the swap seam (D1). Help text and README document the ±10–15% accuracy band. A real-tokenizer implementation can be introduced as a follow-up plan without changing the CLI surface. |
| `tinyglobby` v0.2.x export shape drifts from the call shape in D2 between plan-author time and execution. | Vendor-literal clause (Plan-Body First-Principles Check) requires the executor to verify at WS5 time. The fix on drift is a single-line change in `file-system-node.ts`; the public surface is unaffected. |
| Output format changes later break downstream consumers. | Stabilise on text and JSON only. The JSON shape is asserted by an inline Zod schema in the integration test (D6); the schema is the contract. New formats require an explicit second consumer. |
| Test pollution from real filesystem reads in unit tests. | WS1–WS4 unit tests inject fake `ContextCostFileSystem` and `Tokenizer`. Per-file unit test (WS2) explicitly asserts no real-fs call. Only the WS5 integration test touches a real (tmp) directory. |
| Integration test depends on shell tab handling. | The expected stdout in WS5 is asserted byte-equal against literal tab characters in test source (`'\t'`), not via shell parsing. |
| `pnpm agent-tools` behaviour drifts from the `cd .. && node …` script convention. | Acceptance command `pnpm agent-tools context-cost --help` validates the script entry end-to-end after WS5 lands. |
| Adding `tinyglobby` dep accidentally triggers other workspace knip / depcruise gates. | Run `pnpm --dir agent-tools lint` and the canonical aggregate gate (which includes knip/depcruise via root `pnpm check`) at WS5 acceptance, before committing. |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md).

- **`principles.md`** — pure core / IO at the edge (§D1–§D5 are pure; §D9 is the single composition root); First Question ("could it be simpler?") applied at every cycle (six small slices, no extra surfaces, no smart presets, no E2E surface).
- **`testing-strategy.md`** — every cycle is a test+product pair landing in one commit. Tree green at the end of every commit. Unit / integration / value-proxy levels are distinct and each has its own acceptance id. TDD evidence is test-first per the proof contract.
- **`schema-first-execution.md`** — the JSON output shape is asserted by an inline Zod schema in the integration test. The discriminated-union `ParseResult` from the option parser is a typed boundary, not an `unknown`-cast.

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md).

In-plan documentation is captured in WS6. After plan completion and `/jc-consolidate-docs`, propagate the landed shape:

- `agent-tools/README.md` Commands list — landed in WS6.
- Strategic plan §Scope Expansion Register §1 back-link — landed in WS6.
- `practice-context-cost-baseline.md` reproducibility footnote — landed in WS6.

No ADR or directive change is required: this is an internal CLI that does not change architecture or doctrine. If a future plan promotes a real tokenizer with vendor coupling (Anthropic, OpenAI), that plan owns its own ADR consideration.

---

## Consolidation

After all six workstreams land and quality gates pass, run `/jc-consolidate-docs` to:

- record the landed CLI shape under any relevant pattern surfaces if the pure-core / IO-edge subcommand shape has crossed the third-consumer threshold;
- evaluate whether the strategic-source plan items §2/§3/§4 should be re-prioritised with the CLI in hand;
- update the agent-tooling collection `current/README.md` index entry status from `DECISION-COMPLETE` to `COMPLETE`.

---

## Lifecycle Triggers

> See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md).

- **Start-right**: the executing session reads `start-right-quick`, the strategic source plan, and this plan body before WS1 opens.
- **Active-claim**: the executing session opens an active claim against `agent-tools/src/context-cost/**`, `agent-tools/src/bin/agent-tools-cli.ts`, `agent-tools/src/bin/agent-tools-cli-topics.ts`, and `agent-tools/package.json` before any edit.
- **Decision-thread**: none expected. Every implementation choice is in §Settled Decisions; deviation requires a decision thread, not improvisation.
- **Session-handoff**: after each landed cycle commit, refresh the agent-tooling thread record with the cycle id, commit SHA, and remaining cycle queue.
- **Consolidation**: after WS6, run `/jc-consolidate-docs` per the §Consolidation block above.

---

## Dependencies

**Blocking**: none. The strategic source plan is `future/` (strategic) — promotion of this executable plan is itself the satisfaction of the §1 promotion gate.

**Beneficial**: none. The agent-tools binary, test infrastructure, Vitest configurations, and dispatch pattern already exist; this plan adds files within the existing shape and one small dep.

**Related Plans**:

- [memetic-immune-system-and-progressive-disclosure.plan.md](../../agentic-engineering-enhancements/future/memetic-immune-system-and-progressive-disclosure.plan.md) — strategic source; this plan delivers §1 of its Scope Expansion Register. §2, §3, and §4 remain in the strategic register and are explicit non-goals here.
- [cost-of-collaboration.plan.md](cost-of-collaboration.plan.md) — adjacent agent-tooling plan addressing collaboration substrate cost (commit lanes, hooks). Different concern (per-commit / per-coordination cost vs per-file context cost). No dependency in either direction.
- [practice-context-cost-baseline.md](../../../analysis/practice-context-cost-baseline.md) — the empirical baseline this CLI replaces as the reproducible surface for chars/4 estimates.
