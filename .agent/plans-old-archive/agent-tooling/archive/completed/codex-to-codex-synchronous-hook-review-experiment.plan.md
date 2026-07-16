---
name: 'Codex-to-Codex synchronous hook review experiment'
overview: 'Build and measure the smallest isolated Codex PostToolUse-to-Codex reviewer pair, using two fixture-locked apply_patch cases, exact-payload Gitleaks, and a six-pair Spark/Luna comparison.'
todos:
  - id: ws0-runtime-wire-capture
    content: 'WS0: Preflight isolated auth/model access; capture and sanitise the two exact successful patches plus one failure in a disposable synthetic repository; freeze wire facts and recursion control within the approved process-session cap.'
    status: in_progress
  - id: ws1-cycle-1
    content: 'WS1 cycle 1: fixture-locked PostToolUse adapter, dedicated <=4 KiB patch payload, exact-payload Gitleaks/reviewer composition, six-second whole-hook bound, telemetry, and advisory bin. One test+code commit; tree green.'
    status: pending
    depends_on: [ws0-runtime-wire-capture]
  - id: ws2-cycle-1
    content: 'WS2 cycle 1: opt-in disposable Codex-origin smoke harness, delivery/recursion canaries, private numeric telemetry, and content-free Spark/Luna report. One test+code commit; tree green.'
    status: pending
    depends_on: [ws1-cycle-1]
  - id: ws3-live-comparison
    content: 'WS3: Owner-run no-hook/no-op baselines followed immediately by the six-pair Spark standard/Luna standard/Luna Fast clean-concern matrix. Record content-free evidence; do not qualify, rank, or activate.'
    status: pending
    depends_on: [ws2-cycle-1]
  - id: ws4-decision-and-docs
    content: 'WS4: Apply the predeclared latency/correctness decision table and document the result, including framework notes without extracting shared framework code.'
    status: pending
    depends_on: [ws3-live-comparison]
  - id: ws5-quality-and-review
    content: 'WS5: Focused checks, pnpm check, code-expert gateway, routed specialist reviews, final Betty/Wilma design review, and truthful closeout.'
    status: pending
    depends_on: [ws4-decision-and-docs]
isProject: false
---

> **Archived 2026-07-16 — superseded after a smaller `PreToolUse` trial.** The authoritative content-free runtime result and current boundary live in the [Codex hook context-bounded non-interactive exploration](/.agent/research/developer-experience/codex-hook-context-bounded-non-interactive-exploration-2026-07-15.md#codex-to-codex-runtime-result--16-july-2026); this original plan is retained as historical design evidence and is not an execution instruction. All statuses, examples, and configuration literals below are frozen historical content, not current guidance.

# Codex-to-Codex synchronous hook review experiment

**Last Updated**: 2026-07-16
**Status**: IN EXECUTION — WS0 STATIC PREFLIGHT; NO INFERENCE STARTED
**Scope**: One disposable, advisory Codex `PostToolUse` hook for either of two successful,
fixture-locked, one-file, one-hunk `apply_patch` cases, synchronously reviewed by a fresh
context-bounded Codex process.

**Concept source**:
[Codex hook context-bounded non-interactive exploration](/.agent/research/developer-experience/codex-hook-context-bounded-non-interactive-exploration-2026-07-15.md)

**Foundation reused**:
[Context-bounded Codex hook reviewer evaluation](/.agent/plans/agent-tooling/future/codex-hook-semantic-classifier-evaluation.plan.md)

---

## Decision summary

Proceed with a deliberately synchronous Codex-to-Codex experiment before any Claude UAT. This
owner-directed sequence supersedes the earlier recommendation to run the Claude-shaped six-call
probe first. It does not weaken the established privacy, process, protocol, or activation
boundaries.

The experiment answers one question:

> Can one completed, bounded Codex `apply_patch` be reviewed by an isolated Codex child quickly
> enough for its fixed advisory to reach the origin Codex's next response within budget, without
> ambient repository content reads, recursive hooks, secret egress, result replacement, or
> persistent activation?

This experiment can prove timely causal delivery. It cannot prove that the advisory improves or
corrects a later action because the synthetic origin is forbidden from making another tool call.

Synchronous execution is the measurement instrument. If it is too slow, the experiment has done
its job: it falsifies per-tool nested model review in this form. Detaching the process and calling
that result equivalent would test a different product.

## End goal, mechanism, and means

- **End goal:** determine whether a Codex-origin, Codex-reviewed fast-feedback loop is mechanically
  correct and fast enough to justify a larger experiment.
- **Mechanism:** match one `PostToolUse` `apply_patch`, validate a strict observed subset, scan the
  exact outbound bytes with Gitleaks, invoke one fresh isolated Codex reviewer, and return only a
  fixed advisory when the reviewer identifies a definite concern.
- **Means:** one runtime wire/auth preflight, two small TDD landing cycles, one opt-in disposable
  smoke harness, and the fixed twenty-one-process-session ledger below. Three reviewer preflights
  establish lane access, one reviewer call is the recursion positive control, five origin calls
  capture the two successful patches, one failure, and two baselines, and six full pairs add six
  origin plus six reviewer calls.

The eight timed WS3 origin runs are a feasibility sample, not a benchmark distribution. They
support an early stop and a descriptive per-lane comparison. They do not support p50, p95,
reliability, ranking, or production-winner claims.

## Concept exploration synthesis

### Raw observations

1. The committed foundation already provides bounded input, exact-outbound-byte Gitleaks,
   allowlisted child environment, isolated `HOME`/`CODEX_HOME`/working directory, a four-second
   process limit, closed JSONL validation, structured output, token accounting, and
   `features.hooks=false` for the reviewer child.
2. The released Codex CLI is `0.144.4` in the authoring environment. Its local feature list marks
   `hooks` and Fast mode stable.
3. Official Codex documentation says command hooks are synchronous. An `async` command handler is
   skipped rather than detached.
4. `PostToolUse` can match `apply_patch`, `Edit`, or `Write`, but stdin still reports canonical
   `tool_name: "apply_patch"`. The command is at `tool_input.command`; `tool_response` is only
   specified as a JSON value.
5. `PostToolUse` runs after the side effect. It cannot undo the patch. Blocking or continuation
   output can replace the visible tool result, which is not the desired advisory contract.
6. Matching hook definitions from all active layers run, and matching command hooks start
   concurrently. Exact hook-definition trust and hook-set inspection are therefore part of valid
   latency evidence.
7. The prior one-off Spark observation was about 1.99 seconds and 1,900 input tokens. It proves
   neither a current baseline nor a winner, but it makes a strict synchronous latency test more
   informative than further static hardening.

### Changed problem frame

The goal is not “no tools, no rules, one skill.” Those are candidate controls. The goal is
measured control over every context-consuming mechanism so the useful quality floor is reached
with the least latency.

The first version therefore records both controls and outcomes:

- fixed dynamic input bytes;
- model-visible input-token, cached-token, and output-token counts;
- reasoning-item count;
- dynamic capability and protocol events;
- Gitleaks, reviewer-process, total-handler, no-op-hook, and outer-run time;
- exact clean/concern decision;
- hook firing and recursion-canary counts; and
- whether fixed concern context reaches the origin before it continues.

The code does not claim that base instructions or hosted capability schemas are absent. What
cannot be disabled is observed through token and event evidence.

### Paths reopened and rejected

| Candidate | Decision | Warrant |
| --- | --- | --- |
| Codex `PostToolUse` to isolated `codex exec` | Selected | It is the smallest reciprocal pairing that removes Claude from attribution and exposes the real synchronous penalty. |
| Run the existing Claude-shaped probe first | Superseded for sequencing | The owner explicitly chose Codex-first isolation. Its safety controls remain reusable. |
| Use `codex review` | Rejected | The released command is repository-diff oriented and does not provide this exact bounded stdin-only review contract. |
| Use native hook `prompt` or `agent` handlers | Rejected | Current Codex parses but skips those handler types; command is the only released executable hook handler. |
| Generalise `ReviewSubject` and vendor adapters now | Rejected | A second observed adapter should inform that seam; an imagined symmetrical framework should not shape the MVP. |
| Make Codex feedback async by detaching | Rejected | Detached work cannot return documented model-visible `PostToolUse` feedback in the same interaction. |
| Use a semantic pre-screen before Codex | Rejected | It adds latency and duplicates the model decision. Gitleaks plus deterministic eligibility policy is the compromise. |
| Inspect transcript or outbound model requests for delivery | Rejected | Transcript format is officially unstable, ephemeral exec may not retain it, and origin JSONL does not expose outbound requests. A nonce visible only in hook context and then in the next `agent_message` is the bounded causal proof. |
| Review arbitrary patches or tool results | Rejected | Response and patch semantics are not documented tightly enough. Unknown input must skip. |

### Falsifiers

Stop before the next workstream when any of these occurs:

- released `tool_response` values do not distinguish the captured success and failure safely;
- `tool_input.command` does not preserve a self-contained patch command;
- the exact active hook set cannot be isolated to one intended handler;
- the reviewer child's positive-control hook fires with `features.hooks=false`;
- origin JSONL cannot causally bracket hook entry/output-ready with a tool-start/tool-complete pair;
- the reviewer emits a dynamic capability, unknown, orphan, malformed, duplicate, or incomplete
  protocol event;
- Gitleaks cannot scan the exact outbound payload within its existing bound;
- the fixed concern context replaces the original result, fails to cause exactly one nonce in the
  next agent message, or permits another tool call;
- a hook or origin safety timeout leaves a live recorded process group after identity-checked
  cleanup; or
- no lane satisfies the predeclared correctness and latency decision table.

## Official mechanics and author-time verification

The plan pins the released surfaces verified on 2026-07-16:

- [Codex hooks](https://learn.chatgpt.com/docs/hooks) — source layering, exact-definition trust,
  synchronous command handling, matcher aliases, `PostToolUse` input/output, and release-vs-main
  schema authority.
- [Codex non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode) —
  `codex exec`, `--ephemeral`, `--ignore-user-config`, `--ignore-rules`, JSONL output, structured
  output, least-permission sandboxing, and automation authentication.
- [Codex speed](https://learn.chatgpt.com/docs/agent-configuration/speed) — Spark is a separate,
  less-capable research-preview model; Fast mode accelerates supported models and consumes more
  credits.
- [Codex configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) —
  context-control and feature override keys.

The installed call shapes verified at plan-author time are:

- `codex-cli 0.144.4`;
- `codex exec` supports `--ephemeral`, `--ignore-user-config`, `--ignore-rules`,
  `--output-schema`, `--json`, `--strict-config`, and read-only sandboxing;
- `codex review` accepts repository review targets rather than the required exact dynamic payload;
  and
- `gitleaks 8.30.1 stdin` supports the existing redaction, timeout, exit-code, and ambient-config
  controls.

The installed CLI also accepted this session-layer TOML override shape under strict config
parsing at plan-author time:

```sh
codex -c \
  'hooks.PostToolUse=[{matcher="^apply_patch$",hooks=[{type="command",command="<runtime-resolved-command>",timeout=6}]}]'
```

The smoke harness constructs the equivalent value as one `-c` argument. WS0 still proves that the
released runtime loads and fires it; successful parsing alone is not runtime evidence.
Real absolute Node/bundle paths exist only in generated disposable configuration and never enter
tracked fixtures or reports.

WS0 recorded the installed runtime once at its released static boundary. The checkpoint below is
the current execution record and is not rerun. Any later observed incompatible version or flag
change stops the plan for another plan-body refresh; it is not handled with a compatibility branch.

### WS0 static-preflight checkpoint — 2026-07-16

The released static boundary stopped at its fourth Codex child. The first three children are
version-bound observations, not a passed boundary:

1. `codex --version` reported `codex-cli 0.144.5`.
2. `codex exec --help` exposed every pinned execution-control surface.
3. `codex features list` reported the canonical stable enabled `hooks` and `fast_mode` rows.
4. The isolated strict-config `doctor --json` child accepted the configuration and returned valid
   schema-version-1 JSON, but exited non-zero after checking authentication, terminal, provider,
   and Responses WebSocket health. It therefore violated the intended config-only, zero-network,
   zero-exit probe contract.

The owner ratified this plan-body refresh on 2026-07-16; that ratification released no Gitleaks or
later process.

All four static Codex slots are spent. The first three children are never rerun, `doctor` is never
repeated, and no replacement static Codex child is added. Exact `--strict-config` and effective-hook-set
proof moves to the already-budgeted pre-inference interactive `/hooks` inspection. The two local
Gitleaks metadata children did not run and remain pending and unspent. The guarded private root was
identity-checked, removed, and proven absent; at the cleanup checkpoint, the feature worktree was
clean at `439a4efcf`. No authentication, hook inspection, model access, prompt, or inference
occurred.

## Build-vs-buy attestation

**Vendors**: OpenAI Codex CLI and Gitleaks.

| First-party surface | Adopted / ruled out |
| --- | --- |
| Codex `PostToolUse` command hook | Adopted. It is the released lifecycle surface that can return context before the origin continues. |
| Codex hook `prompt` / `agent` handlers | Ruled out because the current release parses and skips them. |
| `codex exec` with JSONL and output schema | Adopted through the committed isolated runner. It supports the closed payload/result boundary and token evidence. |
| `codex review` | Ruled out because it is repository-change oriented and would reintroduce ambient diff/repository context. |
| Gitleaks `stdin` | Adopted through the committed exact-payload scanner. No new secret-scanning wrapper or ruleset is introduced. |

The bespoke code is limited to the missing origin adapter: released event validation, one narrow
patch subject, feedback formatting, and an experiment harness. It does not replace a first-party
equivalent.

## Scope and non-goals

### In scope

- canonical `PostToolUse` with canonical `tool_name: "apply_patch"`;
- the two captured successful one-file `*** Update File` patches;
- one patch hunk and at most one path;
- a dedicated version-1 patch payload no larger than 4 KiB;
- existing path confinement, denylist, symlink, and exact-payload Gitleaks policy;
- the current POSIX hook-command environment with one tested private launcher;
- inline instructions only;
- Spark low/standard, Luna low/standard, and Luna low/Fast comparison;
- fixed advisory context on a definite concern; and
- a disposable, opt-in, synthetic smoke repository with no persistent hook activation.

### Non-goals

- Claude as origin or reviewer;
- Windows or cross-platform hook-command launching;
- production hook installation, merged settings, persisted trust, or default enablement;
- `PreToolUse`, intent, proposed-action, permission, blocking, or auto-fix review;
- Add/Delete/Move, multiple paths, multiple hunks, binary patches, Bash, MCP, notebooks, or
  arbitrary results;
- ambient repository content reads by the hook or reviewer, retained transcripts, prompt history,
  tool-response content forwarding, or diff discovery; bounded target/ancestor metadata inspection
  is allowed, and the harness alone may read the fixed synthetic target to prove post-state;
- PII screening, a semantic pre-screen, vendored Gitleaks rules, or a replacement secret scanner;
- a queue, daemon, persistent Codex session, direct Responses API, or detached notification path;
- a full corpus, tournament, percentile claim, reliability claim, production model winner, or
  activation decision; and
- vendor-neutral framework code, automatic documentation/schema drift ingestion, or a generic
  adapter registry.

## Live process-session ledger and authority

The hard budget below covers inference-bearing top-level origin and reviewer Codex CLI processes.
It does not pretend that one tool-using origin process equals one hosted inference request.

| Workstream | Origin CLI sessions | Reviewer CLI processes | Purpose |
| --- | ---: | ---: | --- |
| WS0 access and recursion preflight | 0 | 4 | One hooks-on positive control; then one exact hooks-off structured-output call for Spark standard, Luna standard, and Luna Fast requested. |
| WS0 released wire capture | 3 | 0 | Capture the exact clean success, concern success, and deliberate failure `apply_patch` events. |
| WS1–WS2 implementation | 0 | 0 | All normal tests are hermetic. |
| WS3 immediate baselines | 2 | 0 | One no-hook and one no-op-hook origin run immediately before the matrix. |
| WS3 full matrix | 6 | 6 | One clean and one concern Codex-to-Codex pair for each reviewer lane. |
| **Maximum** | **11** | **10** | **21 inference-bearing Codex CLI processes total.** |

These non-inference top-level Codex CLI/TUI processes are separately fixed:

| Workstream | Codex CLI/TUI processes | Exact purpose |
| --- | ---: | --- |
| WS0 static preflight | 4 | Spent once: three version-bound observations plus the failed `doctor` probe-contract observation. No static slot remains. |
| WS0 private auth | 4 | One `login` and one `login status` for each of the origin and reviewer homes. |
| WS0 capture hook inspection | 1 | One pre-inference `--strict-config` `/hooks` inspection proving the exact capture definition and effective set. |
| WS3 effective-set inspection | 3 | Separate interactive `/hooks` inspections proving zero matching handlers for no-hook, exactly one no-op handler, and exactly one review handler. |
| **Maximum** | **12** | **Top-level Codex processes that must make no inference request.** |

The expected clean-path lifecycle is eleven command-handler invocations—one `SessionStart` canary,
three capture handlers, one no-op handler, and six review handlers. Unexpected duplicate handler
processes are observable but OS-process cardinality is not called exact. The per-run and plan-wide
atomic claims in D6 enforce at most six Gitleaks data-scan processes and at most ten reviewer Codex
processes; origin launch slots enforce at most eleven origin Codex processes. An early stop records
its lower actual counts. The two local Gitleaks metadata processes (`version` and `stdin --help`)
are outside the Codex maximum and remain pending and unspent. They wait for a separately
adversarially reviewed two-command ledger and explicit process release after this amendment lands.
Package-manager, login-browser, launcher, shell-interpreter, and OS helper processes are not stable
vendor surfaces and receive no false exact-count claim.

Before WS0's first reviewer call, first origin call, and WS3's first baseline, print the remaining
call ledger, requested model/service configuration, synthetic payload contract, estimated credit
class, and selected D8 latency-configuration ID and values, then obtain explicit owner
confirmation. The owner ratified the initial `codex-hook-latency-v1` values on 2026-07-16. There
are no automatic retries. A malformed, mixed, unavailable, or interrupted sample is preserved as
failed evidence and stops further live calls. Any revised prompt/runtime configuration or
additional call requires a new owner-approved experiment amendment with a new cap; it cannot be
hidden as a retry. Latency-value changes follow D8's between-run versioning rule rather than this
amendment rule.

The released CLI may issue more than one hosted inference request inside a tool-using origin
session. The harness records observed turn/usage-completion counts from JSONL and reports them; it
never converts the 21-process inference cap into a false hosted-request or credit-total claim. Any
unexpected inference event in a non-inference process is a failed sample and stops further live
work.

The lane preflight records both the requested model/service tier and the runtime-observed model or
tier when the released event stream exposes it. If Fast application is not observable, the lane is
labelled `Luna Fast requested`, not confirmed accelerated. All three declared lanes must be
accessible before WS1; otherwise the fixed matrix is INCONCLUSIVE and implementation stops.
This matrix requires ChatGPT-managed Pro authentication because Spark preview availability and
the documented Luna Fast credit multiplier depend on that mode. The report records only
`auth_mode: chatgpt`; API-key auth makes this declared matrix INCONCLUSIVE.

## Settled design

### D1 — Runtime observation precedes normalization

WS0 uses a disposable synthetic Git repository and an owner-reviewed capture command. It records
the exact clean and concern successful updates plus one deliberate context-mismatch failure from
the released CLI. The classifier may accept only a structural success invariant shared by both
successes and absent from the failure. If no such invariant exists, stop.

All live state lives beneath one guarded mode-`0700` private experiment root. Each capture/run uses
a separate subroot; bounded raw event files are mode `0600`, never copied to stdout/stderr, and
deleted immediately after sanitization. The origin and reviewer have separate private
`HOME`/`CODEX_HOME` pairs, allowlisted environments, ignored user/rule config, and disabled
plugins/capabilities. Their owner-only auth homes persist from WS0 through WS3 so no uncounted
re-login is needed; every other WS0 live artefact is removed after capture, and the whole private
root is removed after WS3 or any earlier stop. Failure to prove cleanup is a failed experiment,
not a warning.

The parent origin runner caps captured stdout and stderr at 256 KiB each and each JSONL line at
32 KiB; overflow, invalid UTF-8, or a non-JSON line ends the sample. These are capture limits, not
model context claims. The hook's own stdin retains the existing 1 MiB raw cap before D2 narrows the
outbound payload to 4 KiB.

WS0 copies only the three bounded sanitized fixture candidates into the WS1-scoped test-fixture
paths and leaves them uncommitted. Before that copy, an owner-reviewed standalone residue validator
rejects unknown fields, absolute/local paths, non-synthetic IDs/content, auth/transcript/prompt
fields, and over-cap files. WS1 implements the same closed validation as a test and must revalidate
the candidates before they can enter its commit. Raw evidence is deleted regardless of whether the
copy succeeds.

The tracked fixture may retain:

- field names and JSON types;
- canonical event and tool literals;
- the sanitized outer JSONL tool-start/tool-complete item types, shared synthetic item ID, status,
  and ordering fields needed for D8 bracketing;
- the synthetic patch command;
- the synthetic success/failure response value needed for classification; and
- a recorded CLI version.

It must replace session, turn, tool-use, cwd, transcript, and model values with obvious synthetic
sentinels. It must contain no local path, credential, prompt, transcript, user content, or auth
state. A sanitizer test rejects any fixture containing an absolute/local path, unsanitized
identifier, auth/transcript/prompt field, or non-synthetic content before a tracked write. A
response shape is supported only for the exact operation class captured. Add, delete, move, and
multi-file operations need separate future evidence.

### D2 — Two fixture-locked patch subjects

The parser accepts only:

1. a bounded JSON object whose `hook_event_name` is `PostToolUse`;
2. canonical `tool_name` equal to `apply_patch`;
3. bounded `session_id`, `turn_id`, and `tool_use_id` strings;
4. a `cwd` exactly equal to the fixed disposable project root passed by absolute argv for v0;
5. the expected origin `model` and exact supported `permission_mode`;
6. `transcript_path` as null or a bounded string that is validated and discarded;
7. `tool_input.command` as a bounded string;
8. the captured structural `tool_response` success invariant shared by both successful fixtures
   and absent from the failure fixture; and
9. a `tool_input.command` byte-for-byte equal to either the clean or concern command frozen in D7.

The raw stdin cap is the existing 1 MiB. IDs are at most 256 UTF-8 bytes each; model is at most
128; cwd and transcript path are at most 4 KiB each; command is at most 4 KiB; serialized response
is at most 16 KiB; and the final outbound payload is at most 4 KiB. The captured fixture freezes
the complete released top-level key set and the complete captured key sets of `tool_input` and the
supported `tool_response` objects. An unknown or missing key at any nested level skips the event,
making release drift fail closed instead of flowing into model review.

It rejects failure, unknown response values, matcher aliases on stdin, NULs, every command outside
the two-fixture allowlist, absolute or traversing paths, symlink targets/ancestors, denylisted
paths, and payload overflow. Rejection means no review, not a guessed normalization. The MVP does
not implement a reusable patch grammar: Add/Delete/Move, a second path or hunk, changed context,
and even another otherwise-valid update all skip. A general one-file/one-hunk parser is a possible
follow-up only after GREEN evidence.

Both frozen patch headers contain the same relative portable path. The adapter independently
confirms that path, resolves it beneath the fixed root, applies the existing exclusion policy,
requires the update target to be an existing regular file, and inspects only target/ancestor path
metadata for symlinks and entry kinds. It does not reuse the Claude `Edit | Write` discriminator
and it never reads repository content bytes.

The outbound value is separate from the Claude Edit/Write payload type:

```json
{
  "schema": "codex-post-tool-use-patch-review",
  "version": 1,
  "changes": [
    {
      "operation": "patch",
      "path": "synthetic/config.json",
      "patch": "*** Begin Patch\n...\n*** End Patch"
    }
  ]
}
```

The path is duplicated deliberately: it is the policy-reviewed identity, while `patch` preserves
the exact untrusted change encoding. The total UTF-8 JSON serialization remains at most 4 KiB.
No source file is opened to reconstruct before/after content.

### D3 — Existing reviewer transport, new origin composition

The experiment reuses these committed boundaries directly:

- Gitleaks adapter and its exact-payload invocation;
- private reviewer runtime layout and isolated authentication;
- child environment allowlist;
- fixed inline review instruction and output schema;
- `codex exec` argument and context-control construction;
- four-second process/output limits;
- live JSONL line inspection and closed lifecycle parser; and
- pass/concern/uncertain decision validation and token accounting.

Composition calls the existing outbound scanner and `runCodexHookReview` boundary directly. The
runner's model configuration currently imports lane descriptors from tournament-owned types; this
is acknowledged temporary coupling, not a claim that the experiment routes through the
tournament. Do not move or generalise those types unless live GREEN evidence makes a second
adapter durable.

It does not route through Claude activation, generation/lease, local manifest, benchmark,
tournament, settings merge, private deployment, or durable metrics. Synchronous single-event
delivery removes the freshness problem those Claude-specific mechanisms solve.

### D4 — Context controls are mechanisms, measurements are outcomes

The reviewer retains the committed envelope:

- ephemeral execution;
- ignored user configuration and exec-policy rules;
- zero project-document budget and empty fallbacks;
- disabled bundled skill catalogue and skill instruction injection;
- no configured MCP servers;
- disabled web, app, plugin, memory, multi-agent, shell/tool, workspace-dependency, hook, and
  related optional capabilities;
- low reasoning, low verbosity, no reasoning summary, and no personality;
- isolated non-repository cwd and dedicated `HOME`/`CODEX_HOME`; and
- only the fixed instruction on argv and Gitleaks-approved payload on stdin.

The smoke report records the resulting tokens and events. It does not use the number of disabled
switches as proof of low context.

### D5 — Advisory output only

Exit `0` with zero stdout and stderr bytes is the only pass, uncertain, skip, leak, timeout, drift,
and internal-failure output. A concern also emits zero stderr bytes.

A current definite concern emits exactly one JSON object:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "[OAK_CODEX_REVIEW_CONCERN_V1:<RUN_NONCE>] A rapid review found a definite defect in the completed patch. For this experiment, make no further tool call and include the marker in your next response."
  }
}
```

The harness generates a 128-bit run-unique nonce encoded as exactly 32 lowercase hexadecimal
characters and passes it explicitly to the hook; the output template remains hook-authored. The
marker makes delivery observable without
forwarding model prose or source. The hook
never emits `decision: "block"`, `continue: false`, source, path, verdict kind, scanner output, or
credentials. It does not replace or claim to reverse the completed tool result. The experiment's
one-tool-call instruction is removed or redesigned before any broader user-facing trial.

### D6 — Disposable hook and recursion proof

The smoke harness creates a synthetic repository beneath a per-run subroot of the guarded private
experiment root. Capture, no-op, and review groups supply exactly one session-scoped hook definition
matching `^apply_patch$`, with an explicit six-second whole-hook timeout; the no-hook baseline
supplies none. Its command passes the absolute disposable project root, run nonce, mode-0600
numeric telemetry and process-group-cleanup sidecars, a non-existent per-run invocation-claim path,
the plan-wide reviewer-budget directory, closed `review | noop` execution mode, explicit
reviewer-lane ID, pinned Node path, and built-hook path. Unknown/missing/duplicate argv values skip
before input parsing. The `noop` mode requires the `none` lane and returns before
path/scanner/reviewer work; `review` requires exactly one of the three declared lanes. The
four-second reviewer child deadline remains nested inside the six-second whole-hook ceiling.

V0 is POSIX-only because Codex interprets the hook `command` as a shell command string. The harness
generates a private mode-`0500` launcher beneath the guarded root; the hook command contains only
that launcher's absolute path encoded by one tested POSIX single-quote function. The launcher uses
the same function for the pinned Node/bundle paths and every fixed argv value, then `exec`s Node.
Paths reject NUL/newline; nonce, mode, and lane use closed alphabets. Unit tests cover spaces,
single quotes, shell metacharacters, and leading hyphens in every path-bearing value. No string
concatenation or unquoted interpolation constructs the command.

The origin request builder pins this released invocation shape and unit-tests the complete argv:

> **Historical compatibility note:** Codex CLI `0.144.5` later rejected the
> `tools.view_image=false` line below under `--strict-config`; the current reviewer invocation omits
> it. This frozen example must not be copied as current configuration.

```sh
codex -a never exec \
  --ephemeral \
  --json \
  --ignore-user-config \
  --ignore-rules \
  --strict-config \
  --sandbox workspace-write \
  --dangerously-bypass-hook-trust \
  -C "<synthetic-root>" \
  --model gpt-5.6-luna \
  -c 'model_reasoning_effort="low"' \
  -c 'model_reasoning_summary="none"' \
  -c 'model_verbosity="low"' \
  -c 'model_provider="openai"' \
  -c 'personality="none"' \
  -c 'include_apps_instructions=false' \
  -c 'include_collaboration_mode_instructions=false' \
  -c 'include_environment_context=false' \
  -c 'include_permissions_instructions=false' \
  -c 'project_doc_max_bytes=0' \
  -c 'project_doc_fallback_filenames=[]' \
  -c 'skills.bundled.enabled=false' \
  -c 'skills.include_instructions=false' \
  -c 'mcp_servers={}' \
  -c 'web_search="disabled"' \
  -c 'check_for_update_on_startup=false' \
  -c 'cli_auth_credentials_store="file"' \
  -c 'analytics.enabled=false' \
  -c 'feedback.enabled=false' \
  -c 'features.apps=false' \
  -c 'features.auth_elicitation=false' \
  -c 'features.browser_use=false' \
  -c 'features.browser_use_external=false' \
  -c 'features.browser_use_full_cdp_access=false' \
  -c 'features.code_mode=false' \
  -c 'features.code_mode_host=false' \
  -c 'features.computer_use=false' \
  -c 'features.current_time_reminder=false' \
  -c 'features.default_mode_request_user_input=false' \
  -c 'features.enable_mcp_apps=false' \
  -c 'features.fast_mode=false' \
  -c 'features.goals=false' \
  -c 'features.guardian_approval=false' \
  -c 'features.hooks=true' \
  -c 'features.image_generation=false' \
  -c 'features.in_app_browser=false' \
  -c 'features.memories=false' \
  -c 'features.mentions_v2=false' \
  -c 'features.multi_agent=false' \
  -c 'features.personality=false' \
  -c 'features.plugin_sharing=false' \
  -c 'features.plugins=false' \
  -c 'features.remote_plugin=false' \
  -c 'features.remote_compaction_v2=false' \
  -c 'features.request_permissions_tool=false' \
  -c 'features.shell_snapshot=false' \
  -c 'features.shell_tool=false' \
  -c 'features.skill_mcp_dependency_install=false' \
  -c 'features.tool_call_mcp_elicitation=false' \
  -c 'features.unified_exec=false' \
  -c 'features.tool_suggest=false' \
  -c 'features.terminal_visualization_instructions=false' \
  -c 'features.use_agent_identity=false' \
  -c 'features.workspace_dependencies=false' \
  -c 'tools.view_image=false' \
  -c '<generated-session-hook-value>' \
  '<fixed synthetic one-patch prompt>'
```

The release has no general “only expose apply_patch” flag. The builder disables every known
optional tool/capability source relevant here, while the live JSONL contract requires exactly one
`apply_patch` and rejects any other dynamic tool event. This observed constraint is the proof; the
configuration count is not. The parent JSONL reader terminates its directly owned origin process
group as soon as a second dynamic tool-start arrives; it does not wait for post-run validation.

Immediately before each live group, the owner starts Codex with the same isolated origin home,
`--strict-config`, and session override and opens `/hooks`. Capture, no-op, and review groups must show
exactly one enabled matching handler; the no-hook baseline must show zero. Every group must show no
user/plugin/managed contaminant. The WS0 capture inspection is the already-budgeted execution-time
`--strict-config` and effective-set proof; it is not a replacement static child. Ignored user config
and disabled plugins are supporting controls, not substitutes for this inspection. Any wrong
count, additional matching hook, or managed hook makes the run INCONCLUSIVE.

For this generated and externally vetted one-off definition, the harness may use Codex's
documented automation-only hook-trust override. It never writes user or project trust state and
never installs a hook in the Oak repository.

The reviewer child continues to set `features.hooks=false`, uses an isolated cwd/home, and rejects
dynamic capability events. The recursion canary is a silent `SessionStart` command hook matched on
`^startup$`; it writes only a mode-`0600` integer counter and produces zero stdout/stderr. Its
hooks-on positive call and the Luna-standard hooks-off access call use the same private reviewer
home, config source, cwd, trust posture, canary definition/command, prompt, model, service, and
structured-output request; only `features.hooks=true/false` changes. The positive call must change
the counter from `0` to `1`; the paired hooks-off call and the additional Spark/Luna-Fast hooks-off
calls must leave it at `1`. Remove the canary definition before origin timing. Any unexpected
count, output, or managed policy that forces hooks on makes the experiment INCONCLUSIVE and stops
it.

Every inference-bearing Codex launch consumes a non-replenishing atomic slot before spawn. The
guarded root contains eleven numbered origin slots and ten numbered reviewer slots. A contender
claims the first available slot with `O_CREAT | O_EXCL`, never removes a claimed slot during the
experiment, and does not spawn if no slot remains. The four direct WS0 reviewer preflights and six
nested matrix reviewers share the same ten-slot budget. WS0 capture and WS3 origin sessions share
the eleven-slot origin budget. These on-disk claims survive harness restarts and make the process
ceilings enforceable rather than aspirational.

After argv validation, each no-op or review handler must atomically create its run-unique
invocation claim before reading the event or reaching Gitleaks. The winning invocation owns the
single telemetry record. A duplicate writes no telemetry/stdout/stderr and exits before scanner or
reviewer work; the parent still treats the second dynamic tool-start as failed evidence and
terminates the origin. Claims remain until the entire per-run root is deleted. Immediately before a
reviewer spawn, the winning handler must also claim one plan-wide reviewer slot; exhaustion is a
silent failed outcome with no child. Together, the unique run claim and reviewer slots enforce at
most one scan/reviewer attempt per full cell and the declared six-scan/ten-reviewer limits even if
the origin violates its one-tool instruction.

The telemetry sidecar has this closed version-1 field set and no optional/unknown fields:

```text
schema: codex-post-tool-use-review-telemetry, version: 1, run_id,
mode: review | noop,
lane: none | spark-standard | luna-standard | luna-fast-requested,
scanner_outcome: not-run | clean | rejected | failed,
process_outcome: not-run | exited | timed-out | errored,
decision: none | pass | concern | uncertain,
hook_count, scanner_count, reviewer_count,
dynamic_capability_count, unknown_event_count, orphan_event_count, malformed_line_count,
usage_completion_count, input_tokens, cached_input_tokens, output_tokens, reasoning_item_count,
hook_entry_clock_ms, output_ready_clock_ms,
gitleaks_ms, reviewer_process_ms, handler_body_ms
```

Except for the schema literal, bounded run ID, and closed enums, every value is a non-negative safe
integer; counts that cannot exceed one are validated as `0 | 1`, and durations are monotonic
elapsed milliseconds rounded up. The two clock fields use the same cross-process-comparable
`performance.timeOrigin + performance.now()` projection as the parent JSONL reader. They exist only
in the private sidecar to prove D8 ordering and are discarded rather than copied to the durable
report. The serialized record is at most 4 KiB and otherwise contains no path, source, prompt,
response, Codex identifier, or error text. The hook writes no telemetry to stdout/stderr.

The telemetry and cleanup `run_id` is the D5 32-character nonce. The telemetry sidecar is
pre-created mode `0600` with that value and receives exactly one bounded atomic record
for every handler-owned completion, including parser/scanner failures and the four-second inner
reviewer timeout. A concern is written to stdout only after that telemetry commit succeeds. A
vendor six-second hard kill can prevent JavaScript `finally`; missing telemetry on that path is
failed experiment evidence, not a violated guarantee attributed to the killed handler. The
harness validates run-ID match, exactly-once cardinality, clock inequalities, and caps, then reduces
only content-free fields and deletes the record. Missing, duplicate, malformed, oversized,
mismatched, or impossible telemetry stops further live work even though in-process failures remain
fail-soft to the origin.

The reviewer runner's existing timeout duration ends at successful child close or, on failure, at
the process-group termination request; it is not called an await-reap measurement. A separate
private mode-`0600` cleanup sidecar records the run ID and reviewer process-group ID immediately
after spawn and is atomically cleared on observed child close. The reviewer argv carries a second
ownership factor: its run-unique private output-schema path. WS1 adds only synchronous spawn/close
observers. The four-second deadline is calculated before spawn; the spawn observer writes one
sub-256-byte record to an already-open regular-file descriptor, and its elapsed time reduces the
remaining reviewer budget. Observer failure or exhausted budget terminates the group before review
stdin is sent.

The harness watches the sidecar while the origin runs. Before signalling any apparently live group,
it uses a shell-free process probe to require the current group leader's argv to contain the exact
run-unique output-schema argument; zero matching live processes is already clean. A missing,
ambiguous, or mismatched identity is never signalled: cleanup fails and requires manual inspection.
Only an identity-matched active group receives a final kill, followed by at most one second of
zero-live-descendant polling. The harness then deletes the sidecar and private schema path. Failure
to prove zero live descendants is global RED and blocks closeout until manual cleanup succeeds.

Every inference-bearing origin session—including the three WS0 wire captures—is itself a
shell-free detached child process group directly owned by the capture controller or WS2 harness.
Its fixed twenty-second deadline starts immediately before spawn. On deadline or a second dynamic
tool-start, the parent kills that origin group, awaits child close and zero live descendants for at
most one second, and then always executes the preceding identity-checked nested-reviewer cleanup
before evidence reduction or closeout. Failure to prove both groups clean is global RED and
requires manual cleanup. An origin deadline produces failed/incomplete evidence, stops all later
calls, and is globally INCONCLUSIVE unless a higher-precedence shared RED was already observed. Any
existing lane RED remains that lane's result but does not override the incomplete global matrix.
The twenty-second value is only a runaway-process safety ceiling; it is never hook-latency evidence.

### D7 — Fixed Spark/Luna comparison

Every origin call uses this fixed prompt template; only `<PATCH>` changes, and it is always one of
the three literal synthetic patches below. The template contains no run nonce, reviewer lane, or
expected reviewer decision:

```text
In this synthetic experiment, make exactly one apply_patch call using <PATCH> verbatim.
Make no other tool call. After the tool completes, reply "complete" unless later developer
context asks you to include an experiment marker; if it does, include that exact marker once
and no other text.
```

Each run starts from a fresh `synthetic/config.json` containing exactly:

```json
{"enabled":true,"label":"draft"}
```

The clean patch changes only `"draft"` to `"ready"`. Its exact post-state is
`{"enabled":true,"label":"ready"}` and its expected decision is
`pass / none / change_index 0`.

```text
*** Begin Patch
*** Update File: synthetic/config.json
@@
-{"enabled":true,"label":"draft"}
+{"enabled":true,"label":"ready"}
*** End Patch
```

The concern patch changes only `true` to `tru`. Its exact post-state is
`{"enabled":tru,"label":"draft"}` and its expected decision is
`concern / syntax-schema / change_index 1`.

```text
*** Begin Patch
*** Update File: synthetic/config.json
@@
-{"enabled":true,"label":"draft"}
+{"enabled":tru,"label":"draft"}
*** End Patch
```

The failure capture attempts to change absent `"missing"` to `"ready"`; it must leave the initial
file byte-for-byte unchanged. WS0 stores the exact captured patch command strings as sanitized
fixtures and corroborates response classification against these three filesystem outcomes before
deleting the disposable files.

```text
*** Begin Patch
*** Update File: synthetic/config.json
@@
-{"enabled":true,"label":"missing"}
+{"enabled":true,"label":"ready"}
*** End Patch
```

The six full pair runs use the same origin model, synthetic repository, hook code, prompt shape,
payload cases, instruction mechanism, reasoning effort, and execution order policy. Only the
reviewer lane changes:

| Reviewer lane | Model | Effort | Service |
| --- | --- | --- | --- |
| Spark standard | `gpt-5.3-codex-spark` | low | standard |
| Luna standard | `gpt-5.6-luna` | low | standard |
| Luna Fast | `gpt-5.6-luna` | low | Fast |

The origin is fixed to Luna low/standard because the task is clear and repeatable; it is not part
of the reviewer comparison. The six-cell order is frozen: Spark-clean,
Luna-standard-concern, Luna-Fast-clean, Spark-concern, Luna-standard-clean, then
Luna-Fast-concern. This alternates cases while giving every lane one of each; execution does not
shuffle, rotate, parallelise, or replace a cell.

The report contains per-run facts only:

- availability and exact model configuration;
- Gitleaks, reviewer-process, handler-body, released-hook-span when exposed, causally bracketed
  origin-tool-cycle, and outer wall-clock milliseconds;
- input, cached-input, uncached-input, output, and reasoning-item counts;
- protocol/capability outcome;
- expected and actual closed decision;
- fixed-context delivery result; and
- origin and recursion hook counts.

No source, patch, path, prompt, response, transcript, scanner output, environment, auth, or local
filesystem location enters the report.

The run nonce is absent from the origin prompt, repository, patch, environment, and every model
input except the hook's D5 `additionalContext`; it exists locally only in the generated private
launcher/hook argv and harness expectation. For each concern cell, the next origin JSONL
`agent_message` after the completed tool item must contain that exact nonce once, and the event
stream must contain no second dynamic tool call. For each clean cell, the nonce must be absent.
The harness also corroborates the original completed tool event and exact filesystem post-state.
It persists only marker count, tool-item-completed, result-shape-retained, post-state-match, and
extra-tool-count facts, then deletes raw JSONL. This uses documented `PostToolUse.additionalContext`
behavior and the causal nonce rather than an unstable transcript or unavailable outbound-request
trace. Missing/duplicate markers, another tool, or unobservable result retention makes that lane
INCONCLUSIVE; an observed replaced result is a shared RED defect.

Spark is a separate less-capable research-preview model with its own limits. Luna Fast is the
same Luna model accelerated through Fast service; official documentation currently assigns GPT-5.6
Fast mode a 2.5x ChatGPT credit multiplier. The comparison reports this trade-off rather than
treating Fast and Spark as equivalent mechanisms.

### D8 — Predeclared latency configuration and decision

The two experience thresholds are experiment configuration, not architectural invariants or
vendor facts. The owner ratified this initial configuration on 2026-07-16:

| Field | `codex-hook-latency-v1` value | Meaning |
| --- | ---: | --- |
| `fast_target_ms` | 1,500 | Intentionally aggressive target derived from the goal that synchronous review feel rapid. |
| `feasibility_ceiling_ms` | 2,500 | Maximum tolerable result for this feasibility run; it is not called fast. |

The selected configuration is immutable **within one run**: its ID and both values are recorded
before the first inference call and apply to every comparable baseline and cell. They may be
adjusted **between runs** as real-world usage evidence accumulates without an architectural
amendment or plan rewrite, provided the next configuration has a new ID and both values are
recorded and owner-confirmed before that run's first inference call. A value change after a run
starts ends that run; it does not relabel existing evidence, replenish its process-call budget, or
permit cells from different configuration IDs to be aggregated as one run.

The four-second reviewer deadline, six-second whole-hook timeout, and twenty-second origin
watchdog remain separate process-safety ceilings. They are not part of this tunable
experience-threshold pair.

Use these clock boundaries:

- `reviewer_process_ms`: existing child-process start through successful close or failure-side
  process-group termination request;
- `handler_body_ms`: the hook entry's first statement, before dynamic imports, through the
  output-ready decision immediately before atomic telemetry commit; telemetry commit, final stdout
  write, and process exit are outside this decomposition field;
- `released_hook_span_ms`: vendor-reported pre-launch through accepted output/handler completion,
  only when the released runtime exposes that boundary; and
- `origin_tool_cycle_ms`: parent receipt of the WS0-frozen origin JSONL tool-start event through
  receipt of its corresponding post-hook tool-complete event, a candidate inclusive measure only
  when the same cell proves `start receipt <= hook entry <= output ready <= complete receipt` on
  D6's private clock fields; and
- `outer_origin_ms`: origin CLI spawn through process close, reported descriptively and never used
  as hook-latency proof.

`handler_body_ms` is decomposition and a lower bound: it includes the reviewer child's spawn,
execution, and successful close or termination request, but excludes Codex hook dispatch, the Node
handler's own spawn/final output/exit, context insertion, and origin resumption. It never claims
await-reap on a failure path. Timestamp ordering alone does not qualify `origin_tool_cycle_ms`: it
does not prove that Codex waited for accepted hook output and handler exit. A tool-cycle value may
become a conservative inclusive upper bound only after either (a) the released runtime exposes a
duration whose documented boundary explicitly includes accepted output and handler completion, or
(b) WS0's controlled delayed-handler canary passes.

The canary reuses the designated concern wire-capture origin call, so it adds no inference session.
Its temporary handler emits one run-unique fixed `additionalContext` marker, confirms the stdout
write callback, then remains alive for a fixed 1,000 ms post-output hold before atomically writing
an `exit_ready_clock_ms` sidecar immediately before normal exit. The parent must receive no
tool-complete event during that hold, must receive tool-complete only after the exit-ready clock,
and must then prove by shell-free PID/argv inspection that the exact run-unique canary process is no
longer live. The next origin `agent_message` must contain the marker exactly once with no second
tool. The canary's deliberately delayed duration is never a speed sample. If neither qualification
route is proven, tool-cycle timings remain descriptive and every speed result is INCONCLUSIVE. With
a route proven, the ordinary-cell tool cycle is inclusive because it also contains the tiny
synthetic patch, handler completion, and JSONL transport. The no-op baseline is reported beside it
but is not subtracted as if one sample removed variance. Prefer a qualifying
`released_hook_span_ms`; a larger tool-cycle value still cannot by itself attribute excess time to
the hook. An impossible inequality, live matching canary process after tool-complete, or canary
tool-complete event during the post-output hold is a shared telemetry/causality RED defect.

The no-hook baseline is the same fixed origin model, prompt, synthetic clean patch, and isolation
controls without a hook definition. The no-op-hook baseline uses the same generated hook command,
Node executable, dynamic imports, bounded stdin read, envelope/matcher validation, six-second
timeout, and telemetry write/flush path as the real handler, but returns before path policy,
Gitleaks, or reviewer execution. Both run immediately before the matrix. They are reported for
decomposition and contamination detection; neither is subtracted from a full sample.

Each available reviewer lane has two full samples. Classify each lane independently:

| Lane result | Required evidence | Consequence |
| --- | --- | --- |
| GREEN — iterate | Both decisions exact; causal marker delivery proven; zero protocol/capability/recursion failures; both inclusive released spans or causally bracketed tool-cycle upper bounds at most `fast_target_ms` | Write a follow-up repeated-sample evaluation plan. Do not activate. |
| AMBER — mechanically sound, outside fast target | Both decisions exact and delivery clean; zero protocol/capability/recursion failures; both inclusive spans/upper bounds at most `feasibility_ceiling_ms` but at least one exceeds `fast_target_ms` | Stop implementation and profile transport/process startup before deciding on another experiment. |
| RED — lane configuration no-go | Either decision is wrong, a clean case raises a false alert, the lane emits a dynamic capability/protocol failure, `handler_body_ms` exceeds `feasibility_ceiling_ms`, an explicit `released_hook_span_ms` exceeds `feasibility_ceiling_ms`, or the released origin reports the review hook's six-second timeout | Stop this lane's exact synchronous configuration. Missing handler telemetry after the observed outer timeout cannot weaken this RED to INCONCLUSIVE. Do not infer that another lane failed. |
| INCONCLUSIVE | The lane is unavailable, its marker/result evidence is unobservable, or no inclusive span/upper bound proves either threshold while the handler lower bound remains at most `feasibility_ceiling_ms` | Preserve descriptive evidence without a speed or quality claim. |

Then classify the experiment globally with strict precedence: a shared RED is final even if it
interrupts the matrix; otherwise incomplete or unavailable required evidence is INCONCLUSIVE; only
a complete matrix reaches the GREEN/AMBER/all-lanes-RED aggregation rules.

| Global result | Rule |
| --- | --- |
| GREEN | The matrix is complete, no shared RED defect exists, and at least one lane is GREEN. |
| AMBER | The matrix is complete, no shared RED defect exists, no lane is GREEN, and at least one lane is AMBER. |
| RED | A shared privacy/Gitleaks bypass, recursion, result replacement, hook-count, telemetry-integrity, adapter/protocol, or delayed-canary defect occurs; the capture or no-op shared path reports its six-second hook timeout; cleanup cannot prove zero owned descendants; or the complete matrix leaves all three lanes RED. |
| INCONCLUSIVE | No shared RED exists, but a declared lane is unavailable; active hooks or managed policy contaminate the run; required delivery/timing evidence is unavailable; the twenty-second origin watchdog fires without a stronger observed RED; the matrix is interrupted; or the complete-matrix rules cannot be applied. |

Two samples per lane cannot qualify or rank a model or establish percentile latency. Publish the
six lane-by-case observations, each lane's class, and the separate global class only. Any
unavailable declared lane makes the fixed cross-family matrix globally INCONCLUSIVE even when the
remaining descriptive samples are useful.

## Acceptance criteria and proof levels

Proof levels:

- **P0 — deterministic:** pure/injected tests, no child process or network.
- **P1 — local composition:** build, static configuration, output, and existing scanner/process
  integration evidence.
- **P2 — released-runtime:** disposable real CLI hook capture, hook-set inspection, and recursion
  canary.
- **P3 — live feasibility:** explicit owner-run CLI sessions and content-free timing/decision report.

| ID | Criterion | Proof |
| --- | --- | --- |
| AC-WIRE-1 | Both released success inputs and the failure input are captured, sanitized, versioned as fixtures, and classified by one shared structural success invariant without guessing. | P2 capture + P0 fixture tests |
| AC-INPUT-1 | Only the two supported successful fixture commands reach payload construction; every alternate or unsupported case emits no review. | P0 parser table |
| AC-PATH-1 | Fixed-root/cwd mismatch, absolute, traversal, NUL, symlink, denylisted, missing/non-file, and out-of-root paths cannot reach Gitleaks or Codex; only target/ancestor metadata is inspected. | P0 lexical tests + P1 injected path inspection |
| AC-PRIV-1 | Private capture modes/cleanup and sanitizer rejection are proven; Gitleaks receives the exact serialized payload; any non-clean outcome prevents reviewer invocation; no ambient repository-content/transcript read occurs. | P0/P1 tests + existing scanner integration |
| AC-CONTEXT-1 | Reviewer argv preserves all committed context controls and `features.hooks=false`; tokens and capability events are reported as outcomes. | P0 request tests + P3 report |
| AC-OUTPUT-1 | Pass/uncertain/skip/in-process failure produce zero stdout/stderr bytes; concern produces only the run-unique fixed-template `PostToolUse.additionalContext`; the next agent message repeats the nonce exactly once, no further tool runs, and original result/post-state remain observable. | P0 output tests + P3 clean/concern runs |
| AC-RECURSE-1 | The silent `SessionStart` positive control increments once with hooks on; the otherwise-identical hooks-off reviewer and other lanes leave it unchanged; each origin patch fires exactly one intended handler. | P2 canary + P3 counters |
| AC-MODEL-1 | Spark standard, Luna standard, and Luna Fast requested receive identical cases and produce a content-free per-run comparison without ranking or winner claim. | P3 six-run report |
| AC-LATENCY-1 | No-hook/no-op baselines and all full runs record every D8 boundary; a tool-cycle becomes qualifying only after an explicit released-runtime completion boundary or the controlled post-output-hold canary proves Codex waits for handler exit; otherwise speed remains INCONCLUSIVE. | P2 canary/bracket + P3 report/decision note |
| AC-TIMEOUT-1 | The generated definition fixes a six-second vendor timeout around the four-second reviewer deadline, and every origin has a twenty-second host watchdog; an observed review-hook timeout is lane RED, a shared-path timeout is shared RED, and every timeout completes identity-checked group cleanup. | P0 request/output/cleanup tests + P2 config inspection |
| AC-BUDGET-1 | Non-replenishing atomic origin/reviewer slots and per-run invocation claims enforce the eleven-origin, ten-reviewer, and six-scan ceilings; a duplicate tool-start terminates the origin while duplicate handlers exit before scanner/reviewer work. | P0 claim/race tests + P3 slot/count report |
| AC-SCOPE-1 | No Claude setting, Oak Codex setting, trust store, activation manifest, tournament state, or generic framework code changes. | Diff review |
| AC-GATES-1 | Focused tests, workspace build/type/lint, repository `pnpm check`, and scheduled expert reviews pass. | Command evidence + review records |

## Workstreams and TDD landing cycles

### WS0 — Released wire, access, and recursion preflight

**Type**: evidence-only prerequisite; no product code and no commit by itself.

1. Re-read the official hooks, non-interactive, speed, and configuration pages.
2. Preserve the stopped static ledger above without rerunning it: Codex children 1–3 remain
   version-bound observations, child 4 remains the failed probe-contract observation, and no
   static Codex child remains. The two pending Gitleaks metadata children wait until after this
   amendment lands for a separately adversarially reviewed two-command ledger and explicit process
   release; only then record `gitleaks version` and `gitleaks stdin --help` in the private run log.
3. Provision and validate separate private origin and reviewer authentication homes without
   copying credentials, using exactly one isolated `codex -c
   'cli_auth_credentials_store="file"' login` and one matching `login status` process per home.
   Confirm ChatGPT-managed Pro without recording identity. Create the guarded root and ten atomic
   reviewer launch slots, display the ledger and selected latency-configuration ID and values, and
   obtain owner confirmation, then perform exactly four reviewer calls: the D6 same-config `SessionStart`
   positive control and one exact hooks-off structured-output request for each declared lane. Those
   calls, rather than an inferred catalogue, establish access.
4. Materialize the guarded mode-0700 synthetic repository/root with the D7 JSON file and no
   `AGENTS.md`, rules, plugins, MCP configuration, or existing hooks. Generate a bounded temporary
   capture handler, recursion canary, eleven atomic origin launch slots, and shell-free origin
   capture controller only inside that private root; none becomes product code. Before inference, use an
   injected harmless child to prove the temporary controller's twenty-second timer boundary,
   process-group kill, bounded reap, and no-descendant check without waiting twenty seconds.
5. Start an interactive Codex session with the same isolated origin home, `--strict-config`, and exact
   session hook override; open `/hooks`; and manually verify exactly one enabled `^apply_patch$`
   handler and no ambient or managed matcher. This is the `--strict-config` and effective-set proof
   moved from the retired `doctor` purpose. Exit without a model request. The temporary capture
   handler records private entry/output-ready clock values while the parent timestamps captured
   origin JSONL on the same clock projection.
6. Display the remaining ledger and obtain owner confirmation. Through the owned capture controller,
   run the exact clean success, concern success, and context-mismatch failure once each. The concern
   capture is D8's fixed post-output-hold canary; its delayed duration is excluded from speed data.
   Any extra tool event, alternate patch, retry, mixed capture, origin watchdog, or failed canary is
   a failed sample and stops live calls. Freeze candidate origin tool-start/tool-complete JSONL pairs
   only if every capture proves `start receipt <= hook entry <= output ready <= complete receipt` and
   the canary proves tool-complete did not precede handler exit readiness. Without an explicit
   released completion boundary or the passing canary, D8 has no qualifying inclusive bound and
   implementation stops INCONCLUSIVE.
7. Corroborate the two success responses and one failure response against the exact D7 filesystem
   outcomes. Apply D1's standalone residue validator, copy only the sanitized fixture candidates
   into the uncommitted WS1 paths, delete raw captures, and prove the temporary handler, canary,
   processes, and every per-run subroot are cleaned up. Retain only the two owner-only auth homes
   and non-replenishing launch-budget claims beneath the guarded experiment root until WS3 or an
   earlier-stop closeout.

**Gate**: AC-WIRE-1, AC-RECURSE-1, the D8 delayed-handler canary plus JSONL/hook bracket, all three
requested lanes accessible, exact auth mode, clean effective hook set, enforced launch budgets, and
private cleanup. Otherwise halt code/live work and perform the non-live WS4 decision closeout.

### WS1 cycle 1 — Fixture-locked adapter, review composition, and hook bin

**Starting state**: branch HEAD after WS0 evidence is accepted.
**Parallel safety**: sequenced after WS0; no other cycle may edit the listed files.

**File scope**:

- `agent-tools/src/codex-hook-review/codex-post-tool-use.ts` (new)
- `agent-tools/src/codex-hook-review/codex-patch-payload.ts` (new)
- `agent-tools/src/codex-hook-review/codex-post-tool-use-runtime.ts` (new)
- `agent-tools/src/codex-hook-review/process-runner.ts` (minimal synchronous lifecycle observers)
- `agent-tools/src/bin/codex-post-tool-use-review-hook.ts` (new)
- `agent-tools/tests/fixtures/codex-hooks/post-tool-use-*.json` (three sanitized fixtures, new)
- `agent-tools/tests/codex-hook-review/codex-post-tool-use.unit.test.ts` (new)
- `agent-tools/tests/codex-hook-review/codex-post-tool-use-runtime.integration.test.ts` (new)
- `agent-tools/tests/codex-hook-review/codex-post-tool-use-review-hook.unit.test.ts` (new)
- `agent-tools/tests/codex-hook-review/process-runner.unit.test.ts` (lifecycle-observer additions)

**Files not to touch**:

- Claude `hook-input.ts`, `hook-runtime.ts`, activation, lease, manifest, settings, corpus, and
  tournament modules.

**Red**:

- Freeze the complete sanitized released-runtime envelopes; prove both successes share one
  structural response invariant, the failure lacks it, and filesystem outcomes corroborate all
  three classifications.
- Accept only the exact clean and concern commands. Enumerate unknown/missing envelope keys,
  malformed fields, caps, cwd/root mismatch, unsupported response, alternate patch bytes, NUL,
  traversal, absolute, symlink, denylisted, missing/non-file, and payload-overflow skips.
- Assert the dedicated schema-discriminated payload's exact bytes and 4 KiB bound.
- Prove exact payload identity across serialization, Gitleaks stdin, and reviewer stdin. Every
  parser skip, non-clean scanner result, reviewer pass/uncertain/timeout/drift/error, and internal
  failure writes zero stdout and stderr bytes; concern writes only D5's closed JSON.
- Prove the reviewer request retains every context control, `features.hooks=false`, the selected
  lane, four-second child deadline, bounded output, and fixed inline instruction.
- Prove the hook records exactly one bounded telemetry record for every handler-owned completion,
  including fail-soft in-process paths, commits telemetry before concern output, records the
  spawned reviewer group, and produces expected missing telemetry after an injected outer kill.
- Prove the existing runner's optional synchronous spawn/close observers receive only the positive
  process-group ID, arm/account the four-second deadline before observer work, clear closed groups,
  bind the run-unique output-schema identity, and terminate before review stdin on observer failure
  or exhausted budget.

**Green**:

- Implement the strict envelope plus two-fixture adapter and injected metadata-only path check.
- Serialize the dedicated patch payload only after every boundary passes.
- Compose parser → payload → existing scanner → existing reviewer → fixed output through injected
  dependencies; do not route through activation, lease, benchmark, tournament, or durable metrics.
- Add the smallest synchronous runner seam needed for the private cleanup sidecar and ownership
  identity; do not change successful output/protocol behavior or claim await-reap timing.
- Make the bin exit `0` silently on every non-concern result while completing private telemetry.

**Refactor**:

- Keep vendor literals in the Codex adapter, the payload type closed, and telemetry experiment-only.
- Do not generalise the patch grammar, export parser internals, or introduce a shared framework.

**Deterministic validation**:

```bash
pnpm --filter @oaknational/agent-tools exec vitest run \
  tests/codex-hook-review/codex-post-tool-use.unit.test.ts \
  tests/codex-hook-review/codex-post-tool-use-runtime.integration.test.ts \
  tests/codex-hook-review/codex-post-tool-use-review-hook.unit.test.ts \
  tests/codex-hook-review/process-runner.unit.test.ts
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
```

Expected: all named tests run and pass with no skips, child process, or network; each command exits
`0`.

**Landing**: one commit containing fixtures, tests, product code, and any refactor; tree green.

### WS2 cycle 1 — Disposable live smoke harness

**Starting state**: after WS1 cycle 1 lands.
**Parallel safety**: sequenced; it invokes the built WS1 hook.

**File scope**:

- `agent-tools/src/codex-hook-review/codex-origin-smoke.ts` (new)
- `agent-tools/src/codex-hook-review/codex-origin-smoke-report.ts` (new if separation helps)
- `agent-tools/smoke-tests/codex-to-codex-hook.smoke.ts` (new)
- `agent-tools/tests/codex-hook-review/codex-origin-smoke.unit.test.ts` (new)
- `agent-tools/package.json` and root `package.json` (one explicit opt-in script each)
- `agent-tools/src/codex-hook-review/README.md` (operator warning and command)

**Red**:

- Test the complete D6 origin argv and generated six-second hook definition, including no-hook,
  no-op-hook, recursion-control, Spark standard, Luna standard, and Luna Fast requested cells.
- Test the POSIX launcher/TOML command round-trips every D6 path and closed value under spaces,
  quotes, metacharacters, and leading hyphens without adding an argument or executing shell data.
- Test guarded root, file-mode, allowlisted-environment, signal cleanup, final process-group
  termination, run-unique argv ownership validation, stale/reused-PGID refusal, twenty-second origin
  deadline, and zero-live-descendant behavior through injected boundaries.
- Test atomic non-replenishing origin/reviewer slots, the run-unique invocation claim, duplicate
  handler refusal before scanner/reviewer work, reviewer-budget exhaustion, and immediate origin
  termination on a second dynamic tool-start.
- Test the telemetry sidecar's exactly-once/run-ID/cap/schema rules and report rejection of missing,
  duplicate, malformed, content-bearing, or incomplete evidence.
- Test concern-marker delivery ordering, original-result retention, one-patch/one-hook counts, and
  deletion of transient origin evidence.
- Test D8 lane and global classifications with literal evidence, including a non-default valid
  latency configuration that proves classification consumes the injected configuration rather
  than duplicated threshold literals; there is no winner or tie-break function.
- Test missing binary, auth, model, tier, or hook-set evidence fails the explicit smoke command
  rather than becoming a skipped normal test.

**Green**:

- Materialize and clean up the disposable repository, auth homes, canary, hook config, sidecars,
  and content-free report staging area.
- Materialize one immutable versioned latency-configuration value (`id`, `fastTargetMs`, and
  `feasibilityCeilingMs`) and pass that same value through display, classification, and report;
  threshold values are declared once rather than duplicated across those consumers.
- Run origin Codex as a directly owned bounded process group with fixed model/context controls and
  an exact generated hook definition.
- Collect only validated timings, counts, decisions, auth mode, and JSONL token/protocol facts into
  the content-free report; delete raw JSONL and sidecars in guaranteed cleanup.
- Keep every process/network action behind the explicit smoke command. Normal build/test/CI never
  invokes a model.

**Deterministic validation**:

```bash
pnpm --filter @oaknational/agent-tools exec vitest run \
  tests/codex-hook-review/codex-origin-smoke.unit.test.ts
pnpm --filter @oaknational/agent-tools build
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
```

Expected: deterministic tests and build pass without live calls; commands exit `0`.

**Landing**: one test+code commit; tree green.

**Pre-live review gate**: run `pnpm check`, then send the complete implementation diff first to
`code-expert`. That gateway records the specialist surfaces and routes at minimum `test-expert`,
`security-expert`, and `config-expert`. Fred then checks principles/boundary ownership, Barney
checks simplification/dependency shape, and assumptions-expert checks D8 and effort alignment.
Remediate their findings before Betty and Wilma perform the final pre-live design/failure-mode
pass. WS3 cannot start until this gate is clear.

### WS3 — Owner-run live baselines and matrix

This is an explicit smoke, not a Vitest test and not a CI gate.

```bash
pnpm agent-tools:codex-to-codex-hook-smoke
```

Before the first network call, the command displays the remaining plan-wide ledger, the WS3
maximum of eight origin sessions plus six nested reviewer processes, the three lanes, selected
latency-configuration ID and values, synthetic-only data contract, and private output location.
The owner explicitly starts it. It performs exactly one no-hook and one D8-defined no-op-hook
baseline immediately before the six full pair cells; no earlier baseline is reused. The harness
records observed origin turn and usage-completion counts without claiming a hosted-request
ceiling.

Use three distinct non-inference `/hooks` preflights with the same isolated home: immediately before
the no-hook baseline prove zero matching handlers; before the no-op baseline prove exactly one
generated no-op handler; before the matrix prove exactly one generated review handler and no
contaminant. Each full cell must also satisfy D8's private-clock inequalities. Validate the
post-run report schema and apply D8 exactly. A failed, mixed, interrupted, or unavailable cell ends
new live calls; it is not rerun. A second dynamic tool-start or twenty-second origin watchdog kills
the owned origin group immediately, then runs nested-reviewer cleanup before classification. After
reducing the content-free report staging record, delete both auth homes and the guarded experiment
root and prove zero recorded live descendants before WS4.

### WS4 — Decision and documentation

Create a dated evidence note under `.agent/research/developer-experience/` containing only:

- exact CLI/Gitleaks versions, exact origin/reviewer configuration identifiers, and
  `auth_mode: chatgpt`;
- selected latency-configuration ID plus `fast_target_ms` and `feasibility_ceiling_ms`;
- sanitized supported wire facts and the actual CLI-process/observed-turn ledger;
- the content-free two-baseline and six-pair tables;
- D8 classification for each lane and the separate global classification;
- explicit evidence limits, including the absence of ranking, percentile, reliability, and
  hosted-request-count claims; and
- the next decision dictated by GREEN, AMBER, RED, or INCONCLUSIVE.

Update the active plan status and relevant READMEs. Add vendor-agnostic framework observations
only to the existing future-seam section. Do not create shared framework code or a framework plan
unless this second adapter exposes a stable common contract and the owner promotes it. An early
WS0/WS3 stop still completes cleanup and this decision note; it does not require product code.

### WS5 — Quality gates and final review

> See [Quality Gates](/.agent/plans/templates/components/quality-gates.md) and
> [Evidence and Claims](/.agent/plans/templates/components/evidence-and-claims.md).

Run focused commands after each cycle and the canonical aggregate gate after integration:

```bash
pnpm check
```

After WS4, `code-expert` reviews the final delta and routes only newly affected specialist
surfaces. Remediate any finding, then obtain Betty/Wilma confirmation if design or failure behavior
changed. Finally, `release-readiness-expert` returns GO, GO-WITH-CONDITIONS, or NO-GO for merging
the experimental code. A green review or live GREEN result is not hook-activation permission.

## Lifecycle and coordination

> See [Lifecycle Triggers](/.agent/plans/templates/components/lifecycle-triggers.md).

- **Session entry:** use `oak-start-right-thorough` for implementation because this crosses a
  vendor lifecycle, process, auth, and privacy boundary.
- **Work shape:** this file is the executable active plan. Do not replace it with an informal
  chat checklist during execution.
- **Pre-edit coordination:** claim the exact `agent-tools/src/codex-hook-review/`, test, bin,
  smoke, package-script, and documentation paths before each cycle.
- **During work:** report any change to the supported patch subset, process-session count, selected
  latency configuration, or activation boundary before implementation continues.
- **Stop semantics:** a falsifier or failed sample immediately halts new product code and live
  sessions, but never skips closeout. Terminate every recorded process group, prove zero live
  descendants, remove private homes/raw captures/sidecars, validate that cleanup, reduce only
  content-free facts into WS4, update the plan verdict, and close claims. A retry, lane substitution,
  prompt/runtime-config change requires a newly owner-approved amendment. A latency-value change
  starts a separately identified, owner-confirmed run under D8 and never relabels the current run.
- **Handoff:** close claims, preserve only content-free evidence, and distinguish code complete,
  live experiment complete, and activation explicitly absent.
- **Consolidation:** run the consolidation trigger after the decision note lands; promote only
  settled cross-vendor observations.

## Risk assessment

> See [Risk Assessment](/.agent/plans/templates/components/risk-assessment.md).

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| `tool_response` is unstable or ambiguous | High | Failed patches may be reviewed as successful | Capture success/failure first; accept only an exact observed success class; unknown means skip. |
| Synchronous network/process latency is disruptive | High | Every supported edit stalls the origin loop | Predeclare D8, require a causally bracketed inclusive upper bound, and stop rather than hiding the delay with detachment. |
| Parent JSONL does not causally bracket the hook | Medium | A lower bound is mistaken for user-visible latency | Prove the exact start/entry/output-ready/complete ordering in WS0 and every cell; otherwise stop INCONCLUSIVE. |
| Nested hooks recurse or managed policy overrides controls | Low/Medium | Runaway calls, cost, or deadlock | Isolated cwd/home, ignored user config, `features.hooks=false`, dynamic-event rejection, and positive-control canary. |
| Vendor hard kill bypasses handler cleanup | Low/Medium | Missing telemetry or live reviewer descendant | Treat missing telemetry as failed evidence; use the private process-group sidecar, external final kill, and zero-live-descendant proof. |
| Multiple active hooks contaminate timing | Medium | Invalid latency and behavior attribution | Disposable repo, session-only definition, effective hook-set inspection, exact firing counter. |
| Shell-interpreted command corrupts argv or executes path data | Low/High | Wrong review or code execution | POSIX-only private launcher, one tested quoting function, closed non-path alphabets, and hostile-path unit cases. |
| Patch or source contains a secret | Medium | Sensitive egress | Path denylist plus Gitleaks over exact outbound bytes; any non-clean result stops before Codex. |
| Gitleaks misses non-secret sensitive data | Medium | PII or proprietary content could leave the machine | Synthetic data only in v0; no production activation; record PII policy as unresolved before broader use. |
| Spark is unavailable | Medium | Requested comparison cannot be completed | Return INCONCLUSIVE; do not substitute another model or claim Spark/Luna results. |
| Two samples are overinterpreted | High | False winner or production confidence | Per-run table and lane/global classes only; explicit ban on ranking, percentile, and qualification claims. |
| Framework aspiration expands MVP | Medium | More code before value evidence | Scope cap: two TDD cycles; any generic registry/schema-drift framework requires a new owner-promoted plan. |

Why this matters: a fast reciprocal reviewer could catch a definite defect before an agent compounds
it. If this form is slow or unreliable, knowing that now prevents further assurance and framework
investment around a poor hot-path mechanism.

## Foundation alignment

> See [Foundation Alignment](/.agent/plans/templates/components/foundation-alignment.md).

- **Simplicity:** one event, two fixture-locked changes in one operation class, one path, one hunk,
  one payload, one fixed advisory, and no activation.
- **TDD:** every product-code workstream lands tests and code together in one green commit. Live
  vendor behavior stays in an explicit smoke surface, never a conditional or skipped Vitest test.
- **Schema-first:** vendor input is validated at the boundary from documented plus captured facts;
  the repo-owned output/payload schemas are closed and versioned. Generated `main` hook schemas are
  evidence only when ahead of the release documentation.
- **Type safety:** use discriminated unions and `Result`; no `any`, non-null assertion, unchecked
  cast, or loose `Record<string, unknown>` boundary.
- **No compatibility layer:** incompatible CLI or wire drift stops the experiment. Do not accept
  old and new response forms in parallel.
- **No ambient global tests:** inject clocks, runners, filesystem inspection, and output. Normal
  tests do not touch `process.env`, cwd, child processes, network, or timers.

## Evidence claims and completion language

| Claim | Class | Required evidence | Status before execution |
| --- | --- | --- | --- |
| Released Codex can fire the intended hook with a classifiable patch result for the exact captured CLI/configuration/fixtures | behaviour-change | WS0 sanitized success/failure captures | unverified |
| The adapter never reviews unsupported or unscanned input | security-or-migration-safety | AC-INPUT-1, AC-PATH-1, AC-PRIV-1 | unverified |
| The exact hooks-off reviewer invocation does not fire the same-config canary | validation | AC-RECURSE-1 positive-control evidence | unverified |
| Spark/Luna comparison completed | validation | AC-MODEL-1 six-run report with both model families available | unverified |
| At least one exact synchronous lane is fast enough to justify a repeated-sample plan | behaviour-change | D8 global GREEN evidence | unverified |
| Product code is merge-ready | build-type-lint-pass | focused checks, `pnpm check`, gateway and specialist reviews | unverified |

Allowed closeout verdicts are exact:

- **plan complete; experiment not run**;
- **experimental code complete; live evidence pending**;
- **live experiment globally GREEN / AMBER / RED / INCONCLUSIVE**; or
- **production activation absent**.

Never equate a green build, useful review, or completed smoke with production qualification or
activation.

## Dependencies and lineage

**Blocking prerequisites**:

- committed foundation at or after `884de6863`;
- released Codex CLI with stable hooks and the verified call surface;
- Gitleaks with the verified `stdin` surface;
- provisioned isolated origin and reviewer authentication using ChatGPT-managed Pro;
- Spark standard, Luna standard, and Luna Fast requested availability for a complete comparison;
- owner-ratified versioned latency configuration (`codex-hook-latency-v1` initially); and
- owner consent at each live boundary named in the ledger.

**Related**:

- [Context-bounded Codex hook reviewer evaluation](/.agent/plans/agent-tooling/future/codex-hook-semantic-classifier-evaluation.plan.md)
  — supplies the reusable reviewer boundary; its Claude activation/tournament remain separate.
- [Claude hook reliability remediation](/.agent/plans/agent-tooling/future/claude-hook-reliability-remediation.plan.md) —
  remains outside this experiment.
- [Hooks portability](/.agent/plans/agent-tooling/future/hooks-portability.plan.md) — broader portability background, not an
  implementation dependency.

**Promotion trigger for shared framework work**: only after the Codex-origin adapter has real
runtime evidence and a follow-up analysis identifies common subject/result/telemetry contracts
that do not erase scheduling, authority, payload, trust, or context semantics and do not add
measurable hot-path latency.

**Archive trigger**: global RED closes only the exact fixture-locked synchronous configuration and
latency-configuration version tested here, not every nested-review mechanism. GREEN or AMBER closes
this plan after the evidence note and promotes only the next explicitly warranted experiment.
INCONCLUSIVE closes the attempted run without a feasibility claim; any retry or runtime
configuration change needs a new owner-approved amendment, while a later threshold calibration
follows D8's predeclared between-run versioning rule.
