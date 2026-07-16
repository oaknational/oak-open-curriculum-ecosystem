---
name: 'Context-bounded Codex hook reviewer evaluation'
status: 'FOUNDATION IMPLEMENTED — DIRECT FEASIBILITY RED; TOURNAMENT AUDIT-BLOCKED; NOT ENABLED'
created: 2026-07-15
updated: 2026-07-16
owner: 'Practice owner'
lineage:
  serves_thread: 'Claude hook reliability and semantic review'
  serves_stream: 'Agent tooling'
  strategic_choice: 'Local opt-in, context-bounded post-action review'
  derives_from: '../../../research/developer-experience/codex-hook-context-bounded-non-interactive-exploration-2026-07-15.md'
---

# Context-bounded Codex hook reviewer evaluation

## Status and completion boundary

The adapter, corpus, dormant tournament, local activation CLI, and hermetic tests are implemented. A
deep effort-alignment review found that the implementation reached activation-grade assurance
before collecting enough feasibility evidence. The direct six-call probe has now run once after a
strict-configuration compatibility repair: five cells reached the 4,000 ms safety timeout and the
one correct Luna Fast concern cell exceeded the configured 2,500 ms experience ceiling. No lane
completed both cases. Independent agreement on the frozen tournament labels is also pending, so
the production benchmark stops after its embedded six-call report without calling the 279-run
tournament or writing qualification state. No candidate has qualified and the hook is not enabled.
Implementation is not the same as activation: an unqualified or stale result must leave local
Claude settings unchanged.

**Owner-directed sequence outcome (2026-07-16):** a smaller isolated Codex `PreToolUse` trial
subsequently demonstrated correct clean and concern mechanics, but its 3.7–3.8 second hook durations
did not qualify speed against that run's configured experience ceiling. The trial-only harness was
discarded and the original plan was archived at
`.agent/plans-old-archive/agent-tooling/archive/completed/codex-to-codex-synchronous-hook-review-experiment.plan.md`.
The [research result](/.agent/research/developer-experience/codex-hook-context-bounded-non-interactive-exploration-2026-07-15.md#codex-to-codex-runtime-result--16-july-2026)
is authoritative. This outcome does not enable this hook, lift the corpus-label audit stop, or
weaken any privacy, protocol, qualification, or activation prerequisite here.

## Problem and corrected goal

A general agent invocation can spend most of a hot hook's time and context on machinery that the
review does not need: project instructions, rules, skill discovery, tools, web, memory, plugins,
reasoning, process output, and session persistence. Over-constraining one observed mechanism is
not the outcome.

The end goal is **measured control of context-consuming mechanisms so an automatic review is as
fast as the useful quality floor permits**. “No tools”, “no rules”, “one skill”, and token limits
are candidate controls to test. They are not success criteria in themselves and must not displace
review-envelope latency, exact-labelled concern detection, false-alert rate, reliability, and
privacy.

## End goal, mechanism, and means

- **End goal:** a local, opt-in Claude hook that rapidly reviews a bounded successful Edit/Write
  result and reports only a definite concern, without slowing the originating tool call.
- **Mechanism:** reduce deterministic input before invoking Codex, scan exactly what would leave
  the machine, isolate the Codex runtime, enforce a closed output protocol, and select the
  model/instruction lane from held-out evidence.
- **Means:** a purpose-specific hook adapter, a benchmark-embedded six-call inline feasibility
  gate, then only after independent label agreement a bounded corpus and two-stage tournament, an
  evidence-gated local activation CLI, and content-free operational metrics.

## Effort-alignment checkpoint

The 16 July 2026 concept-exploration pass changed the sequence, not the safety boundary. At the
checkpoint, the implementation comprised 54 source modules and 7,896 source lines, 33 test files
and 3,885 test lines, and a 629,260-byte bundled hook, but had produced no live Spark/Luna,
qualification, activation, Claude UAT, or full-envelope latency evidence. The direction remained
sound; the order of evidence acquisition did not.

Work is therefore separated into two layers:

1. **Learning kernel:** two obvious cases, one clean and one concerning, each run once with the
   inline rubric against Spark standard, Luna standard, and Luna Fast. These six fresh processes
   may record evidence but cannot qualify, enable, or modify Claude settings.
2. **Activation system:** the full mechanism tournament, held-out qualification, fingerprinted
   deployment, settings merge, and durable drift checks. Its code remains dormant until the
   learning kernel establishes that at least one lane can be useful and acceptably fast and an
   independent review agrees that the exact corpus labels fit the bounded-delta rubric.

The privacy and process boundaries remain MVP controls: bounded input, path confinement, exact-
payload Gitleaks, isolated fixed invocation, closed output schema, hard timeouts and output limits,
one lease/generation guard, and content-free measurements. Same-user adversarial race-proofing,
vendored scanner rules, semantic pre-screeners, automatic official-schema ingestion, and the
vendor-neutral framework remain deferred. No additional assurance mechanism should enter the hot
path without measured full-envelope cost or a concrete failure it prevents.

## Vendor mechanics that shape the design

Claude's official [hooks reference](https://code.claude.com/docs/en/hooks) says `PostToolBatch`
runs once after a complete parallel batch resolves and before the next model call. It receives
all `tool_calls`, including a model-visible `tool_response` represented as either a serialized
string or content-block array, and supports no matcher.
The adapter must therefore filter inside the process and must not forward that response.

An async command hook starts in the background, cannot block or decide the completed action, and
can deliver `additionalContext` on the next conversation turn. Each firing creates a separate
background process with no cross-firing deduplication. The local generation-and-lease protocol is
therefore load control, not an assumption about Claude deduplicating work. Claude's
[hook guide](https://code.claude.com/docs/en/hooks-guide) is the companion setup source.
The benchmark refuses Claude Code older than 2.1.202 because the official reference records that
earlier releases could crash and re-crash resumed sessions on malformed async JSON output.

OpenAI's [non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode) defines the
automation controls used here. The
[configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference),
[machine-readable configuration schema](https://learn.chatgpt.com/docs/config-schema.json),
[skills guide](https://learn.chatgpt.com/docs/build-skills), and
[speed guide](https://learn.chatgpt.com/docs/agent-configuration/speed) define the context and
latency controls under test.

## MVP event and input contract

The v1 hook is an async, no-matcher `PostToolBatch` command. It reads at most 1 MiB from stdin,
validates `hook_event_name`, `session_id`, `cwd`, and `CLAUDE_PROJECT_DIR`, then considers only
successful built-in `Edit` and `Write` calls.

It explicitly excludes prompt or intent correlation, transcripts, failed or unknown tool results,
Bash, notebooks, MCP writes, and subagent invocation. Claude `tool_response` content is never
forwarded; its documented representations are inspected only within the bounded hook input to
establish a known Edit/Write success signal. A subagent Edit/Write can invalidate an in-flight
main-agent review but never starts Codex itself.

Eligible changes must:

- resolve beneath `CLAUDE_PROJECT_DIR` from a validated in-project `cwd`;
- have no traversal, NUL byte, symlink target, or symlink ancestor;
- avoid secret, environment, key, VCS, dependency, generated, cache, lockfile, binary, and bulk
  paths or extensions; and
- form one ordered batch of one to three changes.

The exact outbound JSON is version 1 with edit `path`, `before`, and `after`, or write `path` and
`content`. Its UTF-8 serialisation must be at most 4 KiB. Oversized or over-count batches are
skipped, never truncated, split, or coalesced.

## Fast secret-screening compromise

Screening is restricted to one local pass over the exact serialised dynamic payload. The adapter
invokes `gitleaks stdin --ignore-gitleaks-allow --redact=100 --no-banner --no-color
--log-level=error --exit-code=3 --timeout=1`. Its outer deadline is 250 ms.

Only exit code 0 proceeds. A leak, missing binary, timeout, scanner error, unexpected exit, or
output overflow skips the model call. The adapter does not log scanner output or payload content.
Gitleaks runs from the isolated runtime directory with its default configuration so repository
configuration cannot widen or suppress the scan. This is the smallest deterministic detector on
exactly the bytes leaving the machine, with no semantic screening pipeline before the model.

## Load and freshness control

For each project/session, every eligible generation replaces one content-free generation marker
through a temporary file and rename. Only the main Claude agent may acquire the single exclusive
review-lease directory; there is no queue. This is a filesystem exclusivity protocol, not a claim
that marker replacement, lease acquisition, and stale recovery form one atomic transaction.
Later eligible activity advances the generation and invalidates an older result. A lease older
than ten seconds is reclaimable. Child processes run in their own process group and are killed as
a group on timeout or protocol failure.

Before returning context, the hook verifies that it still owns the lease and that its generation
is current. This prevents an obsolete concern from being injected after a newer change.

## Purpose-specific Codex envelope

The implementation follows ADR-180's raw `codex exec` boundary without expanding the general
`agent-tools:codex-exec` adapter. The approval flag precedes the subcommand: `codex -a never exec`.
The remainder of the envelope fixes:

- `--ephemeral`, `--json`, `--output-schema`, `--ignore-user-config`, `--ignore-rules`,
  `--strict-config`, `--skip-git-repo-check`, and `--sandbox read-only`;
- low reasoning, no reasoning summary, low verbosity, and no personality;
- app, collaboration-mode, environment, and permissions instruction injection explicitly disabled;
- `project_doc_max_bytes=0` and an empty fallback-filename list;
- bundled skills disabled, with automatic skill instructions disabled for inline/instructions and
  enabled only for the isolated micro-skill lane;
- web search, apps, goals, hooks, memories, multi-agent, personality, remote plugins, shell
  snapshot/tool, unified exec, and skill dependency installation disabled;
- an isolated non-Git working directory; and
- a fixed instruction prompt on argv with only the Gitleaks-approved payload on stdin.

The process receives an allowlisted environment plus dedicated mode-0700 `HOME` and
`CODEX_HOME`. The owner provisions ChatGPT authentication by running `codex login` against those
exact directories; the adapter never copies auth material or inherits API keys. The allowlist
does not carry the originating `PATH`; the scanner and reviewer use pinned absolute executable
paths.

These controls reduce known context and capability providers. They do not justify a categorical
claim that the hosted request has no base instructions or tool definitions. The benchmark
measures resulting input tokens and wall-clock time instead.

## Output and process protocol

Codex has a four-second process deadline and 16 KiB stdout and stderr limits. Every complete JSONL
line is inspected while the process runs; a malformed line or a capability-bearing, explicitly
orphaned, or unknown event terminates the process immediately. After exit, a closed lifecycle
state machine requires one thread, one turn, optional completed reasoning items, exactly one final
agent message, and one usage-bearing completion in order. Duplicate or out-of-order recognised
events invalidate the result at that final pass. Event schemas require the known fields but
deliberately tolerate additional vendor fields, so this is strict lifecycle/capability validation,
not field-exact schema validation.

The final value follows this closed shape:

| Verdict     | Kind                               |              `change_index` |
| ----------- | ---------------------------------- | --------------------------: |
| `pass`      | `none`                             |                           0 |
| `uncertain` | `none`                             |                           0 |
| `concern`   | one of the six named concern kinds | 1, 2, or 3 within the batch |

The six concern kinds are `syntax-schema`, `runtime`, `logic`, `security`, `data-loss`, and
`contradiction`. The model returns no prose. Only a current
`concern` emits fixed hook-authored `PostToolBatch.additionalContext`; model wording, paths, and
source content are never forwarded.

## Stage zero: six-call feasibility probe

Before any tournament can become eligible, run one valid JSON clean case and one malformed JSON
syntax/schema concern case against the three inline lanes: Spark standard, Luna standard, and Luna
Fast. These cases are self-contained under the exact bounded-delta rubric. Each call uses a fresh
process and the same isolated runtime, Gitleaks boundary, context controls, timeout, event
validation, and output schema intended for production. The emitted report records availability,
scanner-plus-reviewer latency, Codex-process latency, token usage, protocol outcome, and verdict
without source content.

The probe is deliberately non-qualifying. If all lanes are unavailable, exceed four seconds,
emit a dynamic capability event, or fail the protocol, stop. A viable report establishes only
basic feasibility. While independent corpus-label agreement is pending, every `benchmark`
invocation performs this gate after authentication and deactivation, emits the report, then exits
2 without a tournament call or persisted probe/qualification state. A prior standalone `probe`
report is never reused as permission. The probe does not decide which lane to activate.

## Two-stage Spark/Luna tournament

The 279-call path below is implemented but production-blocked by an explicit code-owned
`pending` audit status. There is no operator flag around that stop. Independent reviewers must
agree that the frozen labels are self-contained under the bounded-delta rubric before a reviewed
code change can make this path executable.

The comparison crosses three model lanes with three instruction mechanisms:

| Model lane            | Reasoning | Service  | Mechanisms                                         |
| --------------------- | --------- | -------- | -------------------------------------------------- |
| `gpt-5.3-codex-spark` | low       | standard | inline rubric, tiny instructions file, micro-skill |
| `gpt-5.6-luna`        | low       | standard | inline rubric, tiny instructions file, micro-skill |
| `gpt-5.6-luna`        | low       | Fast     | inline rubric, tiny instructions file, micro-skill |

Fast means the documented `service_tier="fast"` plus `features.fast_mode=true`; standard lanes set
`features.fast_mode=false` and leave service tier unset. The tournament assumes no winner. Spark
is a separate research-preview model; Luna Fast tests whether accelerating the same GPT-5.6 lane
is worth its usage trade-off.

The tracked, secret-free corpus covers code, configuration, documentation, and agent artefacts,
including instruction-like text that remains untrusted data:

- calibration: 20 cases, ten concern and ten clean, split 8 easy / 6 medium / 6 hard;
- held-out: 30 cases, with five concern and five clean at each difficulty.

Each of the nine cells receives one cold probe. All nine must complete before calibration; any
failure writes an explicit `cold-probe-failed` non-qualifying report with empty calibration and
held-out evidence. Successful probes are followed by 20 fresh calibration processes per cell.
Cases are the outer loop and cells rotate their starting position per case, so network/host drift
is counterbalanced rather than confounded with nine fixed cell blocks. The best observed mechanism
is selected independently for each model lane by exact-labelled quality, reliability failures, and
then the latency/token tie-breaks. Those three finalists receive 30 fresh held-out runs each under
the same rotating round-robin order. Held-out labels remain excluded from mechanism selection.

The reported latency is the **scanner-plus-reviewer envelope**: runtime-layout materialisation,
the exact-payload Gitleaks scan, the Codex process, and decision parsing. It excludes Claude stdin
parsing, path policy, generation/lease work, local manifest reads, and Claude's later delivery of
`additionalContext`; it must not be described as full hook or conversation end-to-end latency.
The operational hook metrics remain the place to observe that wider local adapter duration after
activation.

A held-out finalist qualifies only with:

- exact-labelled concern detection at least 80% and false alerts at most 10%;
- p50 at most 2.5 seconds and completed-run p95 at most 4 seconds; and
- zero hard timeouts, schema failures, dynamic-tool events, unknown events, orphan events, or
  process failures.

“Concern detection” is intentionally exact in v1: the decision must return `concern`, the labelled
concern kind, and the labelled one-based change index. A different kind or target does not count
as detected even though production would still emit the same fixed concern notice. Any
`concern` on a clean case is a false alert.

The winner has the lowest p95. Candidates within 100 ms use, in order, lower p50, fewer median
uncached input tokens, then `inline` over `instructions` over `skill`. Total, cached, uncached, and
output tokens are measured; there is no hard token cap. Results preserve difficulty strata and
the Pareto frontier. Hard-case trade-offs are retained in the report for a later experiment; v1
does not add an unimplemented advisory threshold to the activation contract.

If no finalist qualifies, the command writes the report and activates nothing. V1 has no direct
Responses API fallback.

## Local operator and activation contract

The operator surface is:

- `pnpm agent-tools:codex-hook-review probe`
- `pnpm agent-tools:codex-hook-review benchmark`
- `pnpm agent-tools:codex-hook-review enable`
- `pnpm agent-tools:codex-hook-review status`
- `pnpm agent-tools:codex-hook-review disable`

`probe` and `benchmark` are explicitly opt-in and live. `probe` remains available but is no longer
the current owner next step. It runs only the six non-qualifying
inline calls, emits content-free JSON evidence to stdout, and cannot qualify or enable a lane. Its
result is not persisted or reused. It clears only previously owned hook and manifest state before
its first live call. After version and authentication preflight, `benchmark` clears any previous
activation manifest and removes only the marker-owned hook group, then always runs the same
six-call gate. No viable lane returns exit 2 without tournament or probe-state persistence. A
viable lane also returns exit 2 while the code-owned corpus-label audit status is `pending`; the
279-call implementation remains dormant and no qualification state is written. Interruption and
non-qualification therefore remain deactivated while unrelated settings are preserved. After a
future independent label agreement and reviewed status change, a qualifying benchmark writes a new
disabled local manifest at `.claude/codex-review.local.json`, which is gitignored. It also copies
the fingerprinted, self-contained adapter bundle into a private mode-0700, content-addressed local
deployment directory and makes the entry file mode 0500. `enable` accepts only a qualifying winner whose
binary hashes/versions, executable pins, invocation, assets, corpus, scanner, model configuration,
private deployment, and report still match the recorded evidence. Node, Codex, and Gitleaks are
invoked through recorded absolute paths and pinned by path, size, and modification time; their
hashes and versions are part of the wider fingerprint. Claude's resolved binary hash and version
are fingerprinted as benchmark-environment evidence. Benchmarking and enable-time drift checks
compute the full hashes. To avoid adding that I/O to every hot firing, production re-hashes the
private adapter bundle and checks each executable pin's absolute path, non-symlink regular-file
status, executable permission, size, and modification time. Production preparation cheaply rebuilds
and hashes the exact Codex command, arguments, working directory, and current allowlisted child
environment; a mismatch stops before Gitleaks or Codex.

The command idempotently replaces any prior group bearing the stable owned marker, while
preserving unrelated hooks, and installs this no-matcher shape in `.claude/settings.local.json`.
The concrete local file contains absolute paths; generic placeholders are used here deliberately:

```json
{
  "type": "command",
  "command": "/absolute/path/to/pinned/node",
  "args": ["/absolute/private/deployments/<adapter-sha256>/hook.mjs", "--oak-codex-hook-review-v1"],
  "timeout": 6,
  "async": true
}
```

`status` reports qualification, activation, and fingerprint/runtime drift. `disable` removes only
groups carrying the owned marker, including a stale owned-path variant whose manifest has become
unreadable. No tracked `.claude/settings.json` is changed.

Content-free metrics append to `.claude/logs/codex-review.ndjson`, rotate once at 1 MiB, and never
contain paths, source, prompts, responses, credentials, or scanner output.

## Prerequisites and sequencing

- **Blocking for activation:** a built adapter, a provisioned isolated ChatGPT login, Gitleaks,
  independent agreement on the frozen corpus labels, a successful feasibility gate in the same
  benchmark invocation, a complete live tournament, a qualified held-out winner, and a current
  fingerprint. Without any one of these, the minimum safe state is implemented but disabled.
- **Beneficial:** request-level inspection of unavailable base/tool-schema detail. Without it,
  v1 makes only measured context/capability claims and treats emitted dynamic events as fatal.

The standalone six-call probe and smaller Codex `PreToolUse` trial are complete; neither qualified
a lane or authorised activation. Do not run this plan's live tournament until independent
corpus-label agreement has landed as a reviewed code status change. Only then may a fresh benchmark
repeat the six-call gate under a newly declared configuration, run the tournament if that gate is
successful, and produce qualification evidence. Enable only a qualifying current winner, then
perform a manual Claude UAT. Profile the full process-launch-to-JSON envelope before adding any
further hot-path assurance.

## Acceptance criteria

1. Normal tests are child-process and network-free through injected runners and clocks.
2. Raw input, path, payload, scanner, lease, JSONL, verdict, tournament, settings, manifest, and
   metric boundaries have deterministic failure tests.
3. The feasibility probe uses a self-contained valid/invalid JSON pair, is non-qualifying, and
   never installs or enables a hook. Every benchmark invocation reruns it after authentication and
   deactivation. Failure returns exit 2; viability also returns exit 2 while label audit is pending.
   Neither path calls the tournament or persists probe/qualification state. The command may remove
   only previously owned activation state before its first live call.
4. The dormant tournament implements the exact corpus split, fresh-process counts, thresholds,
   tie-breaks, difficulty reporting, and no-qualifier outcome above, but production cannot call it
   before independent label agreement is recorded in code.
5. Enabling is impossible without current qualifying evidence and never changes tracked Claude
   settings.
6. A successful Claude UAT shows no originating-tool delay and injects only fixed concern context
   on a later turn.
7. Final completion requires focused tests, type-check, lint, build, relevant repo validators,
   and post-write expert review to pass.

## Risks and falsifiers

Startup/network latency or poor recall prevents qualification and leaves the hook disabled.
Unhelpful context controls remain measured evidence rather than becoming goals. Missing or slow
Gitleaks skips review; unscreened payloads never proceed. Protocol drift disables the lane through
closed lifecycle/capability validation and fingerprinting, while unsupported deltas stay silent
as `uncertain`.
Thresholds, labels, and tie-breaks must not change after held-out results are visible.
The current corpus balance is structural evidence, not label validity; the production audit stop
must remain until independent reviewers agree the labels against the exact bounded-delta rubric.

## Non-goals

- intent or prompt capture;
- Bash, notebook, MCP, or arbitrary filesystem-write review;
- blocking `PreToolUse`, permission decisions, or auto-fix;
- a queue, daemon, router, persistent session, general runner, or vendor-neutral framework;
- tracked default activation; or
- a v1 Responses API fallback.

## Lifecycle

The implementation can complete while activation remains pending. Foundation completion requires
green code and hermetic gates. Feasibility completion requires a six-call report. Evaluation
cannot begin until independent corpus-label agreement lifts the code-owned stop; after that,
completion requires a live qualifying or honest no-qualifier tournament report. Activation remains
a separate local owner action; then promote or archive this brief through the normal lifecycle.
