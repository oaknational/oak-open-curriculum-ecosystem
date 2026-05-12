# `pnpm check` Profiling Deep Dive — 2026-05-12

## Executive Summary

The owner asked for a profile and analysis of the deliberately exhaustive
`pnpm check` path, with the assurance contract kept explicit. The profile
surface landed before this session and worked for the cheap graph capture:
`pnpm agent-tools:repo-check profile --dry-run` wrote a Turbo dry graph under
`.logs/check-profiles/`.

The full profile needed isolation because the main checkout was already busy
with shared coordination, generated SDK schema drift, and another agent's
fresh skill-documentation claim. The full run was therefore executed in a
detached temporary worktree at `/private/tmp/oak-check-profile-019e1a` and the
profile artifacts were copied back to `.logs/check-profiles/`.

The final escalated profile reached the real check workload: Playwright UI and
a11y tasks passed, and the run then failed on one ordinary Vitest assertion in
`@oaknational/oak-curriculum-mcp-streamable-http#test`. This means the profile
is useful for graph and runtime-shape analysis, but it is not a clean green
baseline.

## Evidence

Raw evidence lives under `.logs/check-profiles/`:

| Artifact | Meaning |
| --- | --- |
| `check-turbo-graph-2026-05-12T05-40-40-595Z.json` | Main-checkout dry-run graph. Useful for warm-cache signal. |
| `check-turbo-graph-2026-05-12T05-46-09-843Z.json` | Isolated-worktree dry-run graph for the final full profile attempt. |
| `check-profile-2026-05-12T05-43-41-268Z.json` | Isolated profile attempt that failed before browser bootstrap was ready. |
| `check-profile-2026-05-12T05-45-58-451Z.json` | Isolated profile attempt after browser install; failed under sandbox browser permissions. |
| `check-profile-2026-05-12T05-47-23-715Z.json` | Escalated full profile attempt; browser tasks passed, Vitest failed. |
| `mcp-turbo-logs-2026-05-12T0547Z/` | Turbo task logs copied from the final MCP package run. |
| `check-profile-analysis-2026-05-12.md` | Compact profile summary kept beside the raw evidence. |

Commands run:

```bash
pnpm agent-tools:repo-check profile --dry-run
git worktree add --detach /private/tmp/oak-check-profile-019e1a HEAD
pnpm install --frozen-lockfile --offline
pnpm install --frozen-lockfile
pnpm check:profile
pnpm exec playwright install chromium
pnpm check:profile
pnpm check:profile # escalated outside sandbox after Chromium launch EPERM
```

## What `pnpm check` Actually Runs

The root script is a sequence of non-Turbo gates, a single broad Turbo run,
then more non-Turbo gates:

```text
pnpm secrets:scan
pnpm clean
pnpm repo-validators:check
turbo run --continue sdk-codegen build type-check doc-gen lint:fix test
  test:widget test:e2e test:ui test:a11y test:widget:ui test:widget:a11y
pnpm lint:shell
pnpm subagents:check
pnpm portability:check
pnpm skills:check
pnpm knip
pnpm depcruise
pnpm markdownlint:root
pnpm format:root
```

The root-script prerequisite is complete at
`fabe99c3 refactor(tooling): retire root scripts`; this analysis did not
reopen root `scripts/` migration.

The profiling command currently captures:

- Turbo dry graph as JSON;
- total wall time for `pnpm check`;
- exit code;
- a pointer from the timing JSON to the dry graph.

It does not yet capture the full inherited stdout/stderr stream, environment
preflight state, or which post-Turbo gates were skipped after an early Turbo
failure. That gap is now recorded as F-20 in the frictions register.

## Turbo Graph Shape

The `pnpm check` Turbo segment uses 12 task families across 19 packages:

```text
sdk-codegen
build
type-check
doc-gen
lint:fix
test
test:widget
test:e2e
test:ui
test:a11y
test:widget:ui
test:widget:a11y
```

Dry graph size:

| Metric | Count |
| --- | ---: |
| Packages | 19 |
| Graph task nodes | 228 |
| Real command nodes | 88 |
| `<NONEXISTENT>` package/task placeholder nodes | 140 |

The placeholder nodes are important: the dry graph contains every package/task
combination, but most packages do not define browser/widget/doc/codegen
commands. Turbo still models those combinations, usually as no-op
`<NONEXISTENT>` nodes, so raw graph-node count overstates real process count.

Real command count by task family:

| Task family | Real commands | Placeholder nodes |
| --- | ---: | ---: |
| `build` | 19 | 0 |
| `type-check` | 19 | 0 |
| `lint:fix` | 19 | 0 |
| `test` | 19 | 0 |
| `sdk-codegen` | 1 | 18 |
| `doc-gen` | 1 | 18 |
| `test:widget` | 1 | 18 |
| `test:e2e` | 5 | 14 |
| `test:ui` | 1 | 18 |
| `test:a11y` | 1 | 18 |
| `test:widget:ui` | 1 | 18 |
| `test:widget:a11y` | 1 | 18 |

The real heavy packages are:

- `@oaknational/oak-curriculum-mcp-streamable-http`, which owns ordinary
  Vitest, e2e, Playwright UI, Playwright a11y, widget, widget UI, and widget
  a11y work;
- `@oaknational/search-cli`, which owns docs and e2e work;
- `@oaknational/sdk-codegen`, which owns schema/code generation.

## Cache Behaviour

The main-checkout dry graph showed warm-cache evidence:

| Task family | Hit | Miss |
| --- | ---: | ---: |
| `test` | 19 | 0 |
| `type-check` | 19 | 0 |
| `build` | 16 | 3 |
| `sdk-codegen` | 1 | 18 |
| `doc-gen` | 0 | 19 |
| `lint:fix` | 0 | 19 |
| browser / widget / e2e families | 0 | all nodes |

The isolated-worktree graph showed every task as a miss. This is valuable as a
maximum-cost profile, but it is not representative of a normal engineer
rerunning after a prior local pass.

Recommendation: once the current failing Vitest assertion is fixed, run a
second full profile in the same worktree without cleaning the cache. That will
separate "cold proof cost" from "warm local rerun cost".

## Many-Process Runtime Shape

The final full profile attempt:

| Phase | Observed result |
| --- | --- |
| `gitleaks` secret scan | about 13.2s, no leaks |
| `pnpm clean` | 19 clean tasks, about 0.5s |
| Turbo segment | 87 successful real tasks, 1 failed real task, 0 cached, 58.494s |
| `pnpm check` profile duration | 73.867s before exit |
| Post-Turbo gates | not reached because Turbo exited 1 |

The runtime is many-process in three nested ways:

1. `pnpm check` is a shell chain of independent gates.
2. The central gate is one Turbo invocation that fans out across package/task
   nodes and respects workspace dependency edges.
3. Several task commands spawn their own processes: codegen invokes schema
   fetch/generation plus Prettier, Vitest fans across suites, and Playwright
   starts browser workers.

The most useful immediate interpretation is therefore not "one command is
slow"; it is "the command is a deliberately broad assurance envelope." Any
speed-up has to say which envelope layer it changes.

## Failure Analysis

Three different failure modes appeared while profiling:

1. `pnpm install --frozen-lockfile --offline` failed because the local pnpm
   store lacked the `@commitlint/cli-21.0.0` tarball. The normal frozen
   install succeeded.
2. The first browser-backed profile failed because Playwright Chromium was not
   installed.
3. After installing Chromium, the sandboxed run failed with macOS Mach-port
   permission errors while launching Chromium. Running outside the sandbox got
   past that environment constraint.

The final escalated profile reached the actual workload and failed here:

```text
@oaknational/oak-curriculum-mcp-streamable-http#test
src/correlation/middleware.integration.test.ts:203
expected [] to deeply equal [['correlation_id', 'undefined']]
```

The important distinction: Playwright/browser bootstrap problems were
environmental profiling constraints; the final blocker is an ordinary Vitest
behaviour failure in the MCP package's correlation middleware/Sentry tagging
test.

## Trigger Surface Map

### Local `pnpm check`

Purpose: exhaustive local engineer proof. It is the broadest local command and
includes checks that mutate or verify generated artifacts, repo policy,
formatting, shell syntax, dependency boundaries, skills, and multiple test
families.

Contract: "I have exercised the whole local assurance envelope before claiming
this change is locally proven."

Tuning rule: keep exhaustive unless a named assurance moves elsewhere.

### Pre-commit

Purpose: guard the history boundary at commit time.

Current shape: still too broad for multi-agent windows because it reads the
ambient tree for root format, knip, depcruise, and full Turbo
`type-check lint test`; only markdownlint has a staged route.

Contract it should have after P0: fast staged-content feedback, not whole-repo
proof. Whole-repo assurance moves to pre-push, CI, or explicit `pnpm check`.

### Pre-push

Purpose: guard the branch-exit boundary before work leaves the local machine.

Current shape: secrets, formatting, markdown, subagents, portability, knip,
depcruise, repo validators, shell lint, and Turbo
`sdk-codegen build type-check lint test test:e2e test:ui`.

Contract: stronger local proof than pre-commit, still cheaper than full
`pnpm check` because it omits some a11y/widget families and post-Turbo skills
coverage differs.

### GitHub Push / PR CI

Purpose: shared reproducible gate on GitHub infrastructure.

Current shape: install dependencies, secret scan with docker fallback, root
format/markdown/subagent/portability/repo-validator/shell checks, Playwright
browser install, Turbo `sdk-codegen build type-check lint test test:e2e
test:ui`, then knip and depcruise, with Turbo summary reporting.

Contract: remote evidence for reviewers and collaborators. This is the right
home for repo-wide checks displaced from pre-commit.

### SonarQube Cloud

Purpose: external static-analysis and quality-gate surface. It covers ratings,
coverage, duplication, security hotspots, and issue classes that are not the
same as local tests.

Contract: no silent quality-gate weakening; findings are fixed or disposed
per-site under the Sonar disposition policy.

### GitHub CodeQL

Purpose: GitHub-side dataflow and taint-tracking security analysis. The repo
does not contain a `.github/workflows/codeql*.yml` file, so treat CodeQL as a
GitHub code-scanning surface configured outside this workflow directory unless
live GitHub settings prove otherwise.

Contract: semantic security alerting, especially cross-function flows. It
complements Sonar; it does not replace build, type, lint, or runtime tests.

## Recommendation Matrix

| Proposal | Speed effect | Assurance preserved | Assurance moved or changed |
| --- | --- | --- | --- |
| Keep `pnpm check` exhaustive | No speed-up | Preserves full local proof command | None |
| Add `repo-check profile` preflights and richer artifacts | Faster diagnosis, not faster checks | Preserves all gates | None |
| Fix current MCP Vitest failure before further tuning | Enables clean baseline | Preserves ordinary test correctness | None |
| Run cold and warm profile pairs | Better measurement | Preserves all gates | None |
| Make pre-commit staged-only under P0 | Faster commits, especially in multi-agent windows | Staged-content formatting/lint feedback | Whole-repo proof moves to pre-push, CI, and explicit `pnpm check` |
| Keep knip/depcruise out of pre-commit if P0 lands | Faster commit boundary | Graph/dependency assurance remains in pre-push/CI | Commit-time graph assurance is intentionally traded for branch/CI assurance |
| Do not remove UI/a11y/widget families from `pnpm check` | No speed-up | Preserves browser/accessibility/widget coverage in full local proof | None |
| If UI/a11y/widget families are omitted from a hook, keep them in CI or explicit `pnpm check` | Faster hook | Browser/accessibility coverage still exists | Hook purpose narrows to faster feedback |

## Tooling Frictions Recorded

The profiling pass exposed a tooling gap now recorded as F-20 in
`frictions-register.md`:

- the profile command records useful graph and timing JSON but not environment
  preflight failures;
- isolated profiling needs pnpm cache state and Playwright browser state made
  explicit;
- browser profiling can require a non-sandboxed run on macOS;
- the current comms inbox command still exposes low-level storage paths and
  has drifted from older `--recipient` muscle memory.

Recommended hardening:

1. `repo-check profile --preflight` or automatic preflight inside `profile`.
2. Include pnpm store/offline-cache availability in the profile artifact.
3. Include Playwright browser availability in the profile artifact.
4. Detect known sandbox/browser launch constraints and explain the rerun path.
5. Capture whether the post-Turbo gates ran or were skipped after Turbo exit.
6. Keep full inherited task logs or provide a `--capture-output` mode that
   stores the stream under `.logs/check-profiles/`.

## Next Safe Steps

1. Fix or route the failing MCP Vitest assertion:
   `src/correlation/middleware.integration.test.ts:203`.
2. Re-run `pnpm check:profile` in the same prepared worktree or a fresh clean
   worktree after the test is fixed.
3. Run a warm-cache second pass without clearing artifacts to measure local
   rerun cost.
4. Land `repo-check profile` hardening under the F-20 route only after the
   current `jc-start-right` / `jc-commit` skill-documentation claim clears or
   in a separately claimed agent-tools slice.
5. Keep cost-of-collaboration P0 as the implementation prerequisite before any
   broader multi-agent implementation window resumes.
