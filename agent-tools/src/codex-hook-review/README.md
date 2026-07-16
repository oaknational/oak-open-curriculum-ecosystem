# Codex hook review

This package implements a local, opt-in Claude `PostToolBatch` reviewer. It asynchronously sends
only a bounded successful `Edit`/`Write` delta to a fresh, isolated `codex exec` process. The
tracked implementation is inert until a live local tournament qualifies a candidate and the
owner explicitly enables it. The 279-call tournament path is implemented but production-blocked
until an independent review agrees that its frozen corpus labels fit the bounded-delta rubric.

## Operator flow

Provision ChatGPT login in the dedicated runtime before probing or benchmarking:

```sh
CODEX_HOOK_REVIEW_ROOT="${HOME}/.codex-hook-review"
HOME="${CODEX_HOOK_REVIEW_ROOT}/homes/inline" \
CODEX_HOME="${CODEX_HOOK_REVIEW_ROOT}/codex-home" \
codex -c 'cli_auth_credentials_store="file"' login
```

Then use the root command:

```sh
pnpm agent-tools:codex-hook-review probe
pnpm agent-tools:codex-hook-review benchmark
pnpm agent-tools:codex-hook-review status
pnpm agent-tools:codex-hook-review enable
pnpm agent-tools:codex-hook-review disable
```

`probe` remains an explicit live command. One owner-authorised run on 2026-07-16 returned no viable
two-case lane, and a smaller Codex `PreToolUse` trial demonstrated mechanics without qualifying
speed; the [content-free result](/.agent/research/developer-experience/codex-hook-context-bounded-non-interactive-exploration-2026-07-15.md#codex-to-codex-runtime-result--16-july-2026)
does not grant permission for another run, tournament, or activation. The command runs one malformed
JSON concern and one valid JSON clean case once against the inline Spark, Luna standard, and Luna
Fast lanes: six fresh Codex processes in total. It emits a content-free JSON report to stdout with scanner-plus-reviewer time,
Codex-process time, token usage, protocol outcome, decision, and exact correctness. It cannot
qualify or enable a lane, and its report is neither persisted nor reused as permission to run a
tournament. It clears only previously owned hook/manifest state before the first call so an older
hook cannot run alongside the probe. Exit code 2 means no lane demonstrated basic feasibility.

Every `benchmark` invocation repeats that six-call feasibility gate after authentication and
deactivation and emits the content-free report to stdout. While the independent corpus-label audit
is pending, it then exits 2 even when an inline lane is viable: it makes no tournament call and
persists no probe or qualification state. There is no operator bypass; lifting the stop requires a
reviewed code change to the explicit audit-status constant.

The dormant tournament implementation comprises nine cold probes, a frozen 180-run calibration
stage, and a three-finalist 90-run held-out stage: 279 additional fresh Codex processes, or 285
including the embedded gate. Once independently ratified, every cold probe must complete or the
command writes an explicit non-qualifying report and skips later calls. Cases are the outer loop
and the first cell rotates per case, counterbalancing host/network drift instead of running fixed
cell blocks. Detection is an exact match on verdict, concern kind, and one-based change index; any
concern on a clean case is a false alert. Reported latency covers runtime layout, Gitleaks, Codex,
and decision parsing, not the whole Claude hook/conversation path.

A benchmark clears any previous activation manifest and removes only the marker-owned hook group
after version/authentication preflight but before its first live call. Interruption and
non-qualification therefore remain fully deactivated; unrelated settings are preserved. `enable`
refuses a missing, unqualified, or fingerprint-drifted result. The benchmark deploys the
self-contained hook bundle into a private content-addressed local directory; activation uses that
verified path plus pinned absolute Node, Claude, Codex, and Gitleaks executables. Benchmark/enable
fingerprinting hashes the binaries and records their versions. To keep each hot firing bounded,
runtime verification re-hashes the private adapter bundle and checks each executable's absolute
path, regular non-symlink file status, executable permission, size, and modification time rather
than re-hashing all executables. Preparation also rebuilds the exact Codex command, arguments,
working directory, and current allowlisted environment and rejects an invocation-hash mismatch
before Gitleaks or Codex. The command merges only the owned async marker group into
`.claude/settings.local.json`.

Probe, benchmark, and enable require the private regular, nonempty, owner-only `auth.json` and
preflight it with a bounded isolated `codex login status`. `status` performs that authentication
check only when evaluating an otherwise enabled, current deployment. Benchmarking refuses Claude
Code older than 2.1.202, the release whose hook contract validates
malformed asynchronous JSON output instead of risking a resumable-session crash.

## Runtime boundary

- Raw Claude stdin is capped at 1 MiB; the exact dynamic Codex payload is capped at 4 KiB.
- Prompt, transcript, and Claude `tool_response` content are never forwarded. Documented serialized
  strings and bounded text content-block arrays are normalized only long enough to establish a
  known Edit/Write success signal; unknown or oversized response shapes skip the batch.
- Paths are project-confined, policy-filtered, and rejected when a target or ancestor is a
  symbolic link.
- Gitleaks scans the exact serialized dynamic payload before Codex; any secret, missing scanner,
  timeout, or scanner error skips review.
- A content-free generation marker replaced by temporary-file rename and an exclusive lease
  directory allow no queue and at most one in-flight review per project/session. This is a
  filesystem exclusivity protocol, not one atomic transaction. Eligible subagent writes
  invalidate but never invoke.
- Codex runs ephemerally in a non-repository directory with isolated `HOME`/`CODEX_HOME`, a
  read-only sandbox, low reasoning, controlled discovery/configuration, and explicit suppression of
  app, collaboration-mode, environment, and permissions instruction injection. Bundled skills are
  disabled; automatic skill instructions are disabled for inline/instructions and enabled only for
  the isolated micro-skill lane. Live complete-line JSONL inspection plus closed lifecycle validation
  uses a four-second process timeout and 16 KiB stdout/stderr bounds. Known required fields are
  validated; additional vendor fields are tolerated.
- The child environment is allowlisted and does not inherit the originating `PATH`; pinned
  absolute executable paths are used instead. Claude's outer async command timeout is six seconds,
  leaving bounded adapter/scanner overhead around Codex's four-second process timeout.
- Only a schema-valid definite concern produces fixed hook-authored additional context. Pass,
  uncertain, drift, timeout, protocol changes, and every other failure emit `{}`.

Normal tests use injected runners and make no model, network, or child-process calls. Operational
metrics are content-free and rotate at 1 MiB under `.claude/logs/`.

## Future seam

The implementation is not a shared framework. A future candidate uses a versioned
`ReviewSubject` union (`intent`, `proposed-action`, `delta`, or `result`) and three vendor-specific
roles: origin trigger, reviewer transport/protocol, and feedback delivery. Promotion requires a
second real vendor direction and evidence that the common contracts do not erase vendor mechanics
or add hot-path latency; see the linked concept exploration and evaluation plan for that decision
boundary. Future drift handling is tiered: incompatible official machine-readable schema changes
fail adapter validation, official prose changes raise a human review alert, and explicit bounded
runtime canaries can invalidate activation. None of those tiers is implemented as a general
framework in this MVP.
