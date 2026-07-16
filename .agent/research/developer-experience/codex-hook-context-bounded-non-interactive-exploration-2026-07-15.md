# Context-bounded Codex in a Claude hook — concept exploration

**Date:** 15 July 2026

**Updated:** 16 July 2026

**Status:** Foundation and self-contained probe implemented; live six-call evidence pending;
tournament audit-blocked; hook disabled

**Scope:** The simplest local, asynchronous review of a successful Claude Edit/Write result,
with measured control of Codex context-consuming mechanisms

## Corrected problem frame

The question is not whether Codex can be forced into a slogan such as “no tools, no rules, one
skill”. The desired impact is a review that is fast enough to run automatically while retaining a
useful defect-detection floor and not sending accidental secrets or ambient repository context.

The gap harms the owner in two directions. A broad Codex invocation can spend latency and tokens
on unrelated project instructions, rules, skill discovery, capabilities, reasoning, and session
state. A classifier stripped by mechanism count alone can be fast but too weak to catch the
defects that justify the call.

The corrected end goal is therefore:

> Control and measure context-consuming mechanisms to minimise the hot review-envelope latency
> and maximise speed, subject to an explicit quality, privacy, and reliability floor.

“No tools”, “no rules”, “one skill”, and a token ceiling remain useful experimental controls. None
is the goal, and none can substitute for measured p50/p95 latency, cached and uncached input,
output tokens, concern detection, false alerts, and protocol failures.

## Movement 1 — vendor mechanics before solution shape

### What `PostToolBatch` actually provides

Claude's official [hooks reference](https://code.claude.com/docs/en/hooks) establishes these
load-bearing mechanics:

- `PostToolBatch` fires exactly once after every call in a parallel tool batch resolves and before
  Claude sends the next model request;
- it has no matcher, so adding one is silently ineffective;
- stdin contains the common hook fields plus every entry in `tool_calls`;
- each call includes `tool_name`, `tool_input`, `tool_use_id`, and a serialised, model-visible
  `tool_response`; and
- command hooks can use exec form (`command` plus `args`) to avoid a shell.

The response can be much larger than the change needed for review. The adapter must bound raw
stdin, filter the batch itself, and reconstruct a small payload from successful built-in Edit and
Write inputs. It must not forward the transcript path, prompt, intent, tool-use identifier,
`tool_response`, or unrelated calls.

Claude's async contract is equally important. With `async: true`, the hook process starts and
Claude continues immediately. The hook cannot block or reverse the completed action. If it later
returns `additionalContext`, Claude receives that context on the next conversation turn. Every
firing creates a separate background process; Claude does not deduplicate async executions across
firings.

This makes asynchronous post-action review the right v1 meaning: “flag a definite concern for the
next turn”, not “approve this action before it runs”. It also creates the need for our own
one-review lease and stale-result invalidation.

The reference's security guidance says to validate and sanitise hook input, block traversal, use
absolute paths (including `${CLAUDE_PROJECT_DIR}` in exec form), and skip sensitive files. The MVP
applies those recommendations at the boundary. The official
[hooks guide](https://code.claude.com/docs/en/hooks-guide) remains the companion setup source.

### What `codex exec` can control

OpenAI's official [non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode)
documents the automation surface used by the prototype:

- piped stdin can accompany a fixed prompt argument;
- `--ephemeral` avoids persisted rollout files;
- `--json` exposes JSONL events and `--output-schema` constrains the final response;
- `--sandbox read-only` is the least-permission execution sandbox; and
- `--ignore-user-config` and `--ignore-rules` bypass user config and exec-policy rules.

The [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) also
defines `project_doc_max_bytes`, project-doc fallback filenames, web search, feature switches,
reasoning effort, verbosity, personality, and service tier. The
[machine-readable configuration schema](https://learn.chatgpt.com/docs/config-schema.json) exposes
explicit controls for app, collaboration-mode, environment, and permissions instruction injection,
the automatic skills instruction block, and bundled skills. The MVP pins the four general
instruction sources off, disables bundled skills, and enables automatic skill instructions only
for the isolated micro-skill lane. The
[skills guide](https://learn.chatgpt.com/docs/build-skills) explains progressive disclosure:
discovered skill metadata can consume context before a selected skill body loads.

The public CLI does not expose one total `--no-tools` or `--only-skill` flag. Read-only sandboxing
limits effects but does not prove that no capability schema reached the model. Naming one skill
does not prove that only one skill's metadata was discovered. These remain observations about
individual mechanisms, not reasons to reject the CLI before measuring the controlled envelope.

### Speed surfaces to compare

OpenAI's [speed guide](https://learn.chatgpt.com/docs/agent-configuration/speed) distinguishes two
different hypotheses:

- GPT-5.3-Codex-Spark is a separate, less-capable model optimised for near-instant coding work and
  is currently a research-preview model for eligible ChatGPT Pro users;
- Fast mode accelerates supported models, including GPT-5.6, with increased credit use.

The experiment's fingerprinted model configuration names `gpt-5.6-luna` for the GPT-5.6 lane.
The useful comparison is therefore Spark standard against Luna standard and the same Luna model
with Fast mode, not “Spark versus Fast” as if those were equivalent mechanisms. The live benchmark
must still establish whether those configured model identifiers are available to the dedicated
account at execution time.

### The earlier probe and its evidence ceiling

A disposable local probe on Codex CLI 0.144.4 observed
`gpt-5.3-codex-spark`, low reasoning, no dynamic tool event, 1,900 input tokens, and 1.99 seconds
wall time. Three other instruction/control shapes were slower and consumed more input.

That result proves only that a tightly controlled Spark invocation was plausible in that moment.
It was one call under one account, network, and host state. It does not establish cold or warm
percentiles, reliability, a hard token target, empty capability schemas, or a winner over Luna.

## Movement 2 — assumptions corrected

### “Screen everything before review” would defeat the hot path

A rich content-classification or policy pipeline in front of Codex duplicates semantic work and
adds startup cost even when the model would have completed quickly. A pre-screen must earn its
place by being local, deterministic, narrowly scoped, and materially cheaper than the call.

### “Send it straight to the model” is an avoidable privacy risk

Edit and Write content can contain credentials even after path exclusions. Sending raw eligible
content without a secret detector makes a low-probability, high-impact leak part of normal
operation. Path filters alone cannot inspect the bytes that matter.

### The sensible compromise is Gitleaks on the exact outbound bytes

Gitleaks is already designed for fast local secret detection. The selected compromise performs
one scan of the exact serialised dynamic payload, after all deterministic reduction and before
Codex. It does not scan the repository, prompt, transcript, or raw hook document.

The adapter uses `gitleaks stdin --ignore-gitleaks-allow --redact=100 --no-banner --no-color
--log-level=error --exit-code=3 --timeout=1`, its default rules, and an outer 250 ms deadline. Only
a clean exit proceeds. A finding, missing executable, timeout, error, unexpected exit, or output
overflow skips review without logging source or scanner output. This bounded cost fails private:
availability never authorises sending unscreened content.

The activation preflight also refuses Claude Code older than 2.1.202. The official hook reference
records that earlier releases could crash and repeat that crash after resume on malformed
asynchronous hook JSON, which is incompatible with this fail-soft boundary even though the
adapter itself always attempts to emit one valid JSON object.

### Intent review is a different product

Claude provides no direct, bounded, success-correlated “intent” field for this event. Prompt and
transcript correlation would expand context, privacy exposure, and temporal ambiguity. V1 reviews
the exact result of a successful built-in Edit or Write. Intent review remains out of scope until
it has its own trusted event and value hypothesis.

### A single hard-coded model would hide the real trade-off

Spark could win on latency and lose on difficult defects. Luna Fast could spend more credits
without enough p95 improvement. Instruction transport can also change both latency and quality:
an inline rubric, a tiny instructions file, and an explicit micro-skill do not consume context in
the same way. Selection needs a small tournament rather than model-brand intuition.

## Movement 3 — reopened solution space

### Blocking `PreToolUse` reviewer

Rejected for v1. It places network latency on every selected tool call, needs a pre-action intent
contract, and turns model/network availability into permission availability. The owner asked for
speed, not a new blocking authority layer.

### Async `PostToolUse` for each Edit/Write

Viable but inferior for parallel batches. It creates one process per call and cannot reason about
up to three related changes together. `PostToolBatch` provides one ordered batch and a natural
place for coalesced review, despite requiring in-process filtering.

### Async `PostToolBatch` with no load coordination

Rejected. Official mechanics say separate async firings are not deduplicated. Rapid edits could
produce overlapping calls and stale concern messages.

### Async `PostToolBatch` with generation plus one lease

Selected. Every eligible project/session event replaces one content-free generation marker by a
temporary-file rename. The main agent may acquire one exclusive lease directory; subsequent
events invalidate its result and do not queue. This is a filesystem exclusivity protocol, not one
atomic transaction spanning marker replacement, acquisition, and stale recovery. Subagent writes
advance the generation but never invoke Codex. A ten-second stale lease is reclaimable, and
process-group termination prevents orphaned children.

### Direct Responses API

It could provide a more explicit request surface, including an explicit tools array, but is not a
v1 fallback. The current question is whether the supported Codex CLI can meet the measured speed
and quality goal under controlled context. Introducing a second execution path would blur the
experiment and activation evidence.

## Movement 4 — selected MVP

The smallest version worth iterating is:

1. read no more than 1 MiB of the async no-matcher `PostToolBatch` stdin;
2. validate event/session/cwd/project boundaries and accept only successful built-in Edit/Write;
3. reject traversal, symlinks, sensitive/generated/binary/bulk paths, NULs, more than three
   changes, or exact JSON above 4 KiB;
4. acquire the current project/session lease and scan the exact JSON with Gitleaks;
5. run one isolated, four-second `codex -a never exec` process with the selected fingerprinted
   tournament lane;
6. inspect complete JSONL lines while Codex runs, then validate the full closed lifecycle and
   reject capability/unknown/orphan events, output overflow, stale generations, or any process
   failure; and
7. emit fixed hook-authored `additionalContext` only for a current definite concern.

The dynamic payload is version 1. Edit carries `path`, `before`, and `after`; Write carries `path`
and `content`. Oversize is skipped rather than truncated because truncation changes the review
question while pretending it did not.

The Codex child uses dedicated private `HOME` and `CODEX_HOME` directories, an isolated non-Git
working directory, an allowlisted environment, separately provisioned ChatGPT login, no inherited
API keys, read-only sandbox, ephemeral sessions, zero project-doc bytes, empty fallback names,
low reasoning/verbosity, no personality, explicit suppression of app, collaboration-mode,
environment, and permissions instruction injection, bundled skills disabled, and automatic skill
instructions enabled only for the isolated micro-skill lane. Known web, shell, MCP-adjacent,
memory, plugin, hook, goal, app, and multi-agent providers are also disabled. The allowlist omits
the originating `PATH` and uses pinned absolute scanner/reviewer executables. A fixed instruction
stays on argv; the scanned payload goes via stdin so it does not enter the process list.

The accepted model value has three exact variants:

| Verdict     | Kind                   |              `change_index` |
| ----------- | ---------------------- | --------------------------: |
| `pass`      | `none`                 |                           0 |
| `uncertain` | `none`                 |                           0 |
| `concern`   | one named concern kind | 1, 2, or 3 within the batch |

Concern kinds are syntax/schema, runtime, logic, security, data loss, or contradiction. There is
no model prose, source echo, path, or explanation in Claude context.

## Effort-alignment checkpoint — 16 July 2026

The second concept-exploration pass changed the framing from “finish a hardened activation
system, then learn” to “learn with the smallest safe kernel, then decide whether activation-grade
machinery is warranted.” This was a sequencing correction, not a reversal of the selected hook or
privacy design.

At the checkpoint, the work contained 54 source modules and 7,896 source lines, 33 test files and
3,885 test lines, and a 629,260-byte bundle. It had strong hermetic evidence but no live
Spark/Luna comparison, qualification, activation, Claude UAT, or full process-launch-to-JSON
latency evidence. The implementation was therefore well aligned with a durable local product but
over-invested relative to the unanswered feasibility question.

### What remains load-bearing

- bounded successful Edit/Write parsing, including Claude's documented string and content-block
  response representations;
- path confinement, denylisted surfaces, and static symlink rejection;
- Gitleaks over exactly the outbound bytes, with failure or timeout skipping egress;
- a fixed isolated Codex invocation with explicit context controls;
- hard process/output bounds, closed JSONL and verdict protocols, and fixed hook-authored output;
- one no-queue lease plus generation freshness; and
- content-free timing, token, event, and outcome evidence.

These controls protect the egress, process, freshness, and Claude-output boundaries. They are not
discarded merely because the first useful experiment is smaller.

### What is deferred until evidence earns it

Same-user adversarial TOCTOU defence, vendored Gitleaks rules, semantic or PII pre-screeners,
recursive runtime sealing, more lock machinery, schema auto-ingestion, and a vendor-neutral
adapter framework remain out of scope. Transport comparison is also deferred until inline review
proves viable: instructions files and skills should not multiply the first experiment from three
lanes to nine cells.

### Revised first experiment

Run exactly six fresh processes: one valid JSON clean case and one malformed JSON syntax/schema
concern case with Spark standard, Luna standard, and Luna Fast, all using the inline rubric. The
pair is self-contained under the exact bounded-delta rubric. Record availability,
scanner-plus-reviewer and Codex-process timing, token usage, protocol outcome, schema validity,
and verdict. This probe cannot qualify or enable a lane. Its content-free report is stdout-only,
not persisted permission. It clears only previously owned hook and manifest state before the
first live call so an older hook cannot run alongside the experiment.

Stop if every lane is unavailable, slower than four seconds, emits a dynamic capability event, or
fails the protocol. A viable lane establishes basic feasibility only. Every benchmark invocation
enforces this gate after authentication/deactivation, but production then stops with exit 2 while
independent agreement on the frozen corpus labels is pending. It makes no tournament call and
writes no probe or qualification state. At that checkpoint, the standalone probe was the only
owner evidence step. The implemented 279-call tournament remains dormant activation machinery,
not the prerequisite for learning whether the basic idea works.

### Warrants and falsifiers

- **Warrant:** the six calls directly test the three required speed/model lanes while holding the
  instruction mechanism constant.
- **Warrant:** keeping exact-payload Gitleaks and deterministic bounds preserves the real privacy
  boundary without adding a semantic screening pipeline.
- **Falsifier:** if full non-model envelope overhead is material, move runtime preparation and
  cold integrity work out of the hook before adding more checks.
- **Falsifier:** if inline performance is viable but quality is mechanism-sensitive, reopen the
  instructions-file and micro-skill cells for the full tournament.
- **Falsifier:** if no lane is viable, stop; more activation assurance cannot repair an unsuitable
  reviewer.

## Tournament design

This 279-call path is implemented but production-blocked by an explicit code-owned `pending`
corpus-audit status. Independent reviewers must agree that the labels fit the exact bounded-delta
rubric before a reviewed code change can make the path executable; there is no operator bypass.

Three model lanes cross three instruction mechanisms, producing nine calibration cells:

| Lane                       | Standard/Fast | Instruction mechanisms                      |
| -------------------------- | ------------- | ------------------------------------------- |
| `gpt-5.3-codex-spark`, low | standard      | inline, tiny instructions file, micro-skill |
| `gpt-5.6-luna`, low        | standard      | inline, tiny instructions file, micro-skill |
| `gpt-5.6-luna`, low        | Fast          | inline, tiny instructions file, micro-skill |

Fast sets the documented `service_tier="fast"` and `features.fast_mode=true`; both standard
configurations set `features.fast_mode=false` and leave service tier unset.

The tracked, secret-free calibration corpus has 20 cases: ten concern and ten clean, distributed
8 easy / 6 medium / 6 hard. Each cell receives one cold probe. All nine probes must complete;
otherwise the benchmark records `cold-probe-failed` and makes no calibration or held-out calls.
A successful cold stage is followed by 20 fresh-process runs per cell.

After one cold probe per cell, calibration uses cases as the outer loop and rotates the first cell
for each case. This counterbalanced round-robin order avoids confounding host/network drift with
nine fixed cell blocks. The strongest observed mechanism in each model lane advances by
exact-labelled quality, reliability failures, and then the latency/token tie-breaks.

The three finalists then run the untouched 30-case held-out corpus under the same rotating order.
Each difficulty has five concern and five clean cases. Surfaces include code, configuration,
documentation, and agent artefacts; instruction-like content tests whether the reviewer treats
changes as data.

Qualification applies to held-out evidence: at least 80% exact-labelled concern detection, at
most 10% false alerts, p50 no slower than 2.5 seconds, completed p95 no slower than four seconds,
and zero hard timeouts, schema failures, dynamic-tool events, unknown events, orphan events, or
process failures. Exact-labelled detection requires `concern` plus the expected concern kind and
one-based change index. Any `concern` on a clean case is a false alert. This is deliberately
stricter than production's fixed, prose-free concern notification.

The benchmark latency is the scanner-plus-reviewer envelope: runtime-layout materialisation,
exact-payload Gitleaks, Codex execution, and decision parsing. It excludes Claude hook input/path
validation, generation/lease work, local activation-state reads, and Claude's later context
delivery. It is therefore not a full hook or conversation end-to-end measurement.

Lowest p95 wins. A candidate within 100 ms of that p95 is compared by p50, then median uncached
input tokens, then inline over instructions over skill. The report preserves per-difficulty
quality and the Pareto frontier. There is no hard token cap; total, cached, uncached, and output
tokens explain latency rather than standing in for it.

Per-difficulty evidence and the Pareto frontier preserve hard-case trade-offs for a later
experiment; the implemented v1 does not emit a separate hard-case advisory threshold. If nobody
qualifies, the benchmark reports that result and local activation remains absent.

## Local activation and observability

The explicit operator commands are `probe`, `benchmark`, `enable`, `status`, and `disable` under
`pnpm agent-tools:codex-hook-review`. Live calls never run in normal tests or CI. At this
checkpoint, `probe` was the current owner next step; the later Codex-first correction below
supersedes that ordering. After version and authentication preflight, `benchmark` clears the prior
activation manifest and removes only the marker-owned hook group before its six-call gate, then
stops while corpus label agreement is pending. It cannot call the tournament or write
qualification state in that condition, and unrelated local settings remain intact.

The local manifest records the qualifying winner, report, executable pins, private adapter
deployment, and fingerprints for the adapter, Node/Claude/Codex/Gitleaks binaries and versions,
model configuration, invocation, instructions, schema, corpus, and benchmark. At benchmark time,
the built self-contained adapter is copied into a private mode-0700 content-addressed directory;
its entry file is mode 0500. Node, Claude, Codex, and Gitleaks are pinned by absolute path, size,
and modification time; the hook invokes Node, Codex, and Gitleaks by those recorded paths, while
binary hashes and versions remain in the wider fingerprint. Benchmark and enable-time checks
compute those full hashes. Each hot firing instead
re-hashes the small private adapter and checks executable absolute path, non-symlink regular-file
status, executable permission, size, and modification time, avoiding full executable hashes on
the latency-sensitive path. The state is gitignored.

`enable` refuses stale or non-qualifying evidence and idempotently replaces any prior group with
the stable owned marker in `.claude/settings.local.json`. The installed async no-matcher hook uses
the pinned absolute Node path, the private content-addressed adapter path, a six-second Claude hook
timeout, and the marker argument. `disable` removes owned-marker variants even when their earlier
manifest is unavailable, while preserving unrelated groups. Tracked `.claude/settings.json`
remains unchanged.

Metrics contain timing, tokens, outcome taxonomy, and fingerprints only. They rotate once at
1 MiB and exclude payloads, paths, prompts, responses, scanner output, transcripts, and auth.

## Codex-origin hook test — required delta

The official [Codex hooks reference](https://learn.chatgpt.com/docs/hooks) makes a Codex-origin
experiment possible, but it is not a drop-in reuse of the Claude trigger. The release behaviour
page, rather than the generated `main`-branch schemas, is authoritative when they differ.

| Surface | Current Claude origin | Narrow Codex origin test |
| --- | --- | --- |
| Event | One `PostToolBatch` after a completed parallel batch | One `PostToolUse` after each supported tool call |
| Filtering | No matcher; filter the batch in-process | Matcher can select `apply_patch`, `Edit`, or `Write`, but stdin still reports `tool_name: "apply_patch"` |
| Dynamic input | Ordered Edit/Write calls with serialised responses | `tool_input.command` plus a JSON `tool_response` for one call |
| Scheduling | `async: true` is supported and Claude continues immediately | Command hooks are synchronous; declaring `async` causes Codex to skip the handler |
| Feedback | Later `additionalContext` on the next conversation turn | `PostToolUse` `additionalContext` before the model continues |
| Installation | Owned group in local Claude settings | Merged user/project/plugin hook sources plus exact-definition trust review |

The scheduling difference is the largest product constraint. A Codex-origin reviewer directly
adds its complete process and network time to the agentic loop. The existing four-second process
bound is a safety ceiling, not an acceptable Codex user-experience target. The Codex-origin smoke
must therefore measure wall-clock delay added by the hook and may falsify per-tool model review
even if the same reviewer is useful asynchronously from Claude. Codex currently offers no native
async command-hook path that can return later model-visible feedback. A detached external
notification would be a different product and is not a fallback hidden inside this test.

Most of the reviewer boundary can remain unchanged: exact-outbound-byte Gitleaks, isolated Codex
auth and environment, context controls, process and output limits, JSONL lifecycle validation,
closed verdicts, content-free metrics, and the private pinned runtime. The reviewer child already
sets `features.hooks=false`, which is the required recursion break when Codex is both origin and
reviewer.

The smallest honest Codex-origin slice still requires:

1. a bounded `PostToolUse` input validator for event, working directory, canonical tool name,
   command, and response;
2. one synthetic success and failure runtime capture to establish the concrete `apply_patch`
   response shape, because the release documentation deliberately types `tool_response` only as
   a JSON value;
3. a patch-specific review subject that validates path headers, path count, denylisted surfaces,
   and byte limits without reading repository files or pretending a patch command is Claude's
   Edit/Write schema;
4. a Codex feedback formatter where pass emits no output and a current concern emits only fixed
   `PostToolUse` `additionalContext`; `decision: "block"` is inappropriate because the edit has
   already happened and that decision replaces the tool result rather than reversing it;
5. a local hook definition matching `^apply_patch$`, a short explicit timeout, stable git-root or
   absolute command resolution, project-layer trust when the definition is repo-local, and owner
   review through `/hooks` so the exact definition hash is trusted; and
6. fixture tests for the documented input/output contract plus one owner-run clean/concern UAT
   that records total synchronous delay and confirms the nested reviewer does not fire hooks.

This is one focused vendor-adapter slice, not a new review engine. It should follow, not precede,
the six-call Claude-origin feasibility probe: there is no value adapting a reviewer that has not
yet demonstrated a viable latency and protocol floor. If the desired direction is instead
Codex-originated work reviewed by Claude, more is required: a separately isolated Claude
non-interactive transport, auth and context controls, a closed output protocol, a Claude model
comparison, and new latency evidence. That reciprocal direction is materially larger than the
Codex-origin-to-existing-Codex-reviewer smoke.

## Future vendor-agnostic fast-feedback framework (explicitly non-MVP)

This implementation exposes an emerging seam: one agent runtime emits a bounded change and a
second model runtime reviews it without owning the originating action. That is an observation
from one integration, not enough evidence to ratify a framework or extract shared production
code. Premature abstraction could hide exactly the vendor mechanics that make the hook safe and
fast.

If the seam survives another real integration, the candidate canonical input should be a
versioned `ReviewSubject` discriminated union, not one optional-field “vendor payload” bag:

- **`intent`:** a bounded statement of desired outcome before an action is chosen;
- **`proposed-action`:** a bounded action/tool proposal before execution, including the authority
  available to the reviewer;
- **`delta`:** an ordered content change with operation, bounded before/after data, provenance
  class, and explicit omissions; and
- **`result`:** a bounded completed action or tool result with outcome status and no implied
  pre-action authority.

An adapter must accept only the subject variants its native lifecycle can support and reject an
unsupported schema version rather than infer missing intent or conflate a result with a proposal.
The canonical response can remain a separate closed pass/concern/uncertain result with freshness
and target identity. Content-free telemetry remains orthogonal: latency, tokens, outcome taxonomy,
protocol failures, fingerprints, and quality strata, with no source, path, prompt, response, or
credential fields.

Vendor-specific code would have three explicit adapter roles:

1. **Origin-trigger adapter:** maps a native lifecycle event into one supported `ReviewSubject`,
   preserving correlation/generation identity, batch semantics, synchronous/asynchronous
   authority, and vendor facts that cannot be normalised safely.
2. **Reviewer transport + protocol adapter:** maps the canonical subject to one reviewer's
   invocation/API, isolated auth, context and capability controls, timeout/sandbox posture, and
   closed output protocol.
3. **Feedback-delivery adapter:** maps a current canonical result into the origin vendor's native
   advisory or blocking surface without turning reviewer prose into canonical output.

A Claude origin-trigger adapter would declare `PostToolBatch` batching, no matcher, serialised
responses, async delivery, and no cross-firing deduplication. A Codex reviewer adapter would
declare its non-interactive argv, JSONL protocol, context/capability controls, sandbox, auth, and
model configuration. Additional vendors would declare the same categories before joining.

The seam should support reciprocal pairing without coupling the canonical contracts to today's
direction: Claude-originated work reviewed by Codex, and Codex-originated work reviewed by Claude.
Each direction composes the three roles separately because lifecycle, tool-result shape, reviewer
protocol, and feedback delivery are vendor facts, not portable details.

Every adapter would publish a capability and context budget: maximum input/output bytes, timeout,
process model, project-doc/rule/skill/tool discovery, network and sandbox posture, deduplication,
and what can be disabled versus only observed. Payload and result schemas would be explicitly
versioned. Drift detection needs three evidence tiers rather than one over-broad automation claim:

- **Official machine-readable schema:** snapshot and structurally diff it; an incompatible change
  fails the adapter validator and invalidates activation automatically.
- **Official prose documentation:** monitor the relevant source/section and raise a review alert;
  prose drift requires human interpretation and must not rewrite schemas or code automatically.
- **Runtime canary/protocol probe:** run an explicit, bounded probe outside normal tests, compare
  observed events and capability behaviour with the recorded contract, and invalidate activation
  on incompatible observations.

These tiers remain separate evidence. A prose change can warn before runtime drift is observed;
a runtime canary can falsify an apparently unchanged schema; neither is silently promoted into a
vendor-independent fact.

The framework policy would also make auth, privacy, and secret screening explicit per direction:
isolated credential homes, environment allowlists, data classifications, exact-payload scanning,
retention, and fail-soft behaviour. Missing auth, scanner failure, protocol drift, overload, or a
stale result would yield “no review result”, never silently mean pass and never block the primary
flow by default.

The tournament machinery is a plausible reusable evaluation boundary: vendor/model/instruction
cells, frozen calibration and held-out corpora, latency and quality qualification, Pareto
reporting, and fingerprint-gated activation. Reuse is warranted only if a second consumer needs
the same evidence contract without importing Claude- or Codex-specific semantics.

**Promotion trigger:** a second real vendor integration exists and observation shows stable common
`ReviewSubject`, result, telemetry, privacy, and evaluation contracts plus the three adapter roles
across both directions.

**Falsifier:** the abstraction erases load-bearing vendor semantics, requires lowest-common-
denominator payloads, or adds measurable hot-path latency. Any of those outcomes keeps the logic
purpose-specific. No framework code belongs in this MVP.

## Post-remediation concept evaluation — 16 July 2026

### Movement 1 — raw observations

The settled implementation contains 64 TypeScript source files and 8,601 source lines, plus 45
test files and 5,095 test lines. Its production hook bundle is 640,290 bytes. The full agent-tools
suite passes 307 files and 2,939 tests, and the final specialist and adversarial reviews are clear.
Those reviews found real issues in feasibility gating, local-settings preservation, failed-enable
compensation, bundled-skill context, corpus authority, status truthfulness, operator instructions,
and accidental tournament-corpus inclusion in the production bundle. Their value was corrective,
not evidence that the reviewer model itself works.

The hook remains disabled. No live six-call result, Spark-versus-Luna comparison, Claude UAT, or
full launch-to-feedback latency exists. The full tournament is additionally stopped by a
code-owned pending corpus-label audit. The implementation therefore has strong static evidence
for a safe experiment and no runtime evidence for the product hypothesis.

Codex hooks add a second observation: trigger grain, matcher behaviour, scheduling, trust,
payloads, and feedback authority differ materially by vendor. Only the bounded review subject,
egress policy, reviewer protocol, and evidence vocabulary look plausibly common so far.

### Movement 2 — changed problem frame

The remaining question is not “is the hook implementation complete?” It is:

> Can a tightly context-controlled model review a bounded completed change quickly and reliably
> enough to improve an agent's next action, without sending secrets or ambient context?

The code is now an experimental instrument for that question, not proof of the answer. Static
completion and runtime feasibility must stay separate. Effort alignment now means resisting more
assurance and abstraction work until the cheapest live experiment changes what is known.

The reasoning audit exposes three pressures that previously distorted the sequence: mechanism
count became a proxy for actual context cost, safety hardening became a proxy for product
feasibility, and an attractive cross-vendor architecture encouraged generalisation from one
working direction. The corrections are to measure mechanisms rather than name them, require live
evidence before further assurance, and make a second observed adapter—not architectural
symmetry—the promotion trigger for shared code.

### Movement 3 — reopened paths

- **Keep implementing activation or a framework now:** rejected. It reduces no current
  uncertainty and increases sunk-cost pressure to activate.
- **Run the full tournament now:** rejected. Its labels have not been independently agreed, and
  279 calls are disproportionate before six calls establish basic feasibility.
- **Run only the six-call Claude-origin probe:** selected at this checkpoint as the next evidence
  step. It is the
  smallest reversible test of availability, protocol closure, and the three required speed
  surfaces.
- **Build a narrow Codex-origin adapter after a viable lane appears:** retained as the next useful
  portability test. It tests the emerging seam against a genuinely different lifecycle without
  prematurely extracting a framework.
- **Make Codex-origin review asynchronous by detaching:** rejected for model-visible feedback.
  It would measure an external notification system, not the documented Codex hook contract.

### Movement 4 — synthesis, warrants, and falsifiers

The foundation is complete; feasibility is unknown. The sequence warranted at this checkpoint
was:

1. provision the isolated reviewer account and run the standalone six-call probe only;
2. if a lane is viable, inspect scanner-plus-reviewer and Codex-process latency, token, event, and
   verdict evidence before doing more work;
3. independently audit the frozen corpus labels before any full tournament or activation; and
4. only after reviewer viability, implement the narrow Codex `PostToolUse` adapter and measure its
   synchronous user-visible delay before considering shared code.

The sequence is falsified early if no lane closes the valid/invalid protocol within the existing
four-second safety bound, if context controls still produce dynamic capability events, or if the
feedback is not useful on the two self-contained cases. The Codex-origin path is separately
falsified if its synchronous delay materially disrupts the loop. Framework promotion is falsified
if the second adapter cannot share a review-subject/result seam without erasing vendor scheduling,
authority, or payload facts.

Unresolved evidence is now explicit: actual six-call data, complete process-launch-to-output
latency, the released Codex `apply_patch` success/failure response values, synchronous Codex hook
experience, and—only for reciprocal pairing—a controlled Claude reviewer transport. None is a
reason to add more MVP code before the first probe.

## Owner-directed Codex-first sequence correction — 16 July 2026

The owner subsequently selected a Codex-to-Codex pair as the first integration experiment. This
supersedes the ordering in the preceding checkpoint, not its evidence limits or safety boundaries.
The rationale is stronger experimental isolation: removing Claude attributes event, feedback, and
latency behavior to one released Codex lifecycle plus one nested Codex reviewer. The synchronous
penalty becomes an intentional early falsifier.

The corrected problem is:

> Can either of two synthetic successful `apply_patch` events traverse a strict Codex origin
> adapter, exact-payload Gitleaks, and the existing isolated Codex reviewer, then return fixed
> advisory context before the origin continues, within a predeclared fast-feedback budget?

The smallest honest version first captures the two exact successful wire values plus one failure,
then supports only those two fixture-locked one-file, one-header, one-hunk patch commands. It
preserves the patch in a dedicated versioned payload rather than asserting that arbitrary patch
commands have Claude Edit/Write semantics. Unknown responses, changed patch bytes,
Add/Delete/Move, multiple paths or hunks, sensitive paths, and oversized payloads skip. A general
one-file/one-hunk grammar is deferred until the synchronous mechanism earns further investment.

The comparison is fixed to Spark low/standard, Luna low/standard, and Luna low/Fast with one clean
and one obvious-concern synthetic case per lane. It records every sample and makes no percentile,
reliability, qualification, activation, or production-winner claim. The context goal remains
measured control: input/cached/output tokens, reasoning items, capability events, and latency are
outcomes; disabled mechanisms are configuration evidence only.

Delivery is proven without treating the unstable transcript as an API: a run nonce exists only in
the hook's fixed `additionalContext`, must appear exactly once in the next origin `agent_message`,
and must not trigger another tool call. Timestamp ordering alone cannot qualify origin JSONL as a
causal hook bound. A speed verdict requires either an explicit released-runtime accepted-output and
handler-completion boundary or a controlled post-output-hold canary proving tool completion waits
for handler exit, plus the ordinary-cell bracket. An internal handler duration remains a lower
bound and cannot earn a fast verdict by itself. Missing qualification or bracketing evidence is
INCONCLUSIVE, not silently repaired by subtracting a single baseline.

No vendor-neutral framework code is promoted. The second adapter is evidence from which a future
origin-trigger / reviewer-transport / feedback-delivery seam may later be assessed. The executable
[Codex-to-Codex synchronous hook review plan](../../plans/agent-tooling/active/codex-to-codex-synchronous-hook-review-experiment.plan.md)
owns the strict subset, TDD cycles, CLI-process-session ceiling, latency decision table, stop
conditions, and review sequence.

## Implementation status and remaining evidence

The foundation code boundary is implemented in the dedicated worktree: hook input/path/payload
policy, Gitleaks adapter, lease, content-free metrics, Codex runner, corpus, dormant tournament,
private deployment, settings merge, activation CLI, fail-soft hook composition, and the six-call
feasibility-probe command. The benchmark command enforces that same non-persisted gate and then a
code-owned corpus-audit stop. Current hermetic gates and reviewer settlement remain the immediate
implementation evidence. The Codex-to-Codex plan is the next owner-directed experiment; this
plan's standalone probe remains available but is no longer the immediate next action. The
tournament and any explicit local enablement remain blocked pending independent label agreement.

The feasibility probe is deliberately pending, and the live tournament is additionally
audit-blocked. Until live evidence exists, no claim about Spark versus Luna is warranted; until
independent label agreement permits a benchmark and it produces a qualifying current winner, the
hook must remain disabled. The associated
[evaluation plan](../../plans/agent-tooling/future/codex-hook-semantic-classifier-evaluation.plan.md)
is authoritative for its own qualification thresholds, activation, acceptance, and non-goals.

## Sources

- [Claude Code hooks reference](https://code.claude.com/docs/en/hooks)
- [Claude Code hooks guide](https://code.claude.com/docs/en/hooks-guide)
- [Codex non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode)
- [Codex hooks reference](https://learn.chatgpt.com/docs/hooks)
- [Codex generated hook schemas](https://github.com/openai/codex/tree/main/codex-rs/hooks/schema/generated)
- [Codex configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference)
- [Codex machine-readable configuration schema](https://learn.chatgpt.com/docs/config-schema.json)
- [Build skills for Codex](https://learn.chatgpt.com/docs/build-skills)
- [Codex speed: Fast mode and Codex-Spark](https://learn.chatgpt.com/docs/agent-configuration/speed)
- [Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card)
