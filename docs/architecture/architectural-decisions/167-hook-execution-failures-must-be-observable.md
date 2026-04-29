# ADR-167: Hook Execution Failures Must Be Observable

**Status**: Accepted
**Date**: 2026-04-29
**Related**:
[PDR-009](../../../.agent/practice-core/decision-records/PDR-009-canonical-first-cross-platform-architecture.md) —
canonical-first cross-platform architecture; this ADR captures a
host-specific (Claude Code) implementation of a discipline whose
canonical extraction is named under Future Work below;
[ADR-150](150-continuity-surfaces-session-handoff-and-surprise-pipeline.md) —
surprise pipeline (`capture → distil → graduate → enforce`); this ADR is
an enforcement-layer landing for a specific surprise captured in
[`napkin.md` §"2026-04-29 — Misclassified e2e test deletion + coordination-surface skip"](../../../.agent/memory/active/napkin.md);
[ADR-160](160-non-bypassable-redaction-barrier-as-principle.md) —
non-bypassable defensive layers as principle; this ADR addresses a
case where a defensive layer (`sonar-secrets` PreToolUse hook) was
silently bypassed by a config bug;
[`.claude/hooks/_lib/log-hook-errors.sh`](../../../.claude/hooks/_lib/log-hook-errors.sh) —
canonical reference instance for the Claude Code platform;
[`.claude/settings.json`](../../../.claude/settings.json) —
host-specific hook registration that wires the wrapper in.

## Context

Agentic platforms (Claude Code, Cursor, Codex, Gemini CLI) expose a
**hooks** mechanism: shell commands the harness invokes around tool
calls, prompts, and session lifecycle events. Hooks are part of the
agentic system's operational contract — they enforce permissions,
scan for secrets, mutate prompts, and gate destructive actions. They
are infrastructure, not optional ergonomics.

Hooks are typically declared as either **blocking** (a non-zero exit
prevents the wrapped tool call from proceeding) or **non-blocking**
(a non-zero exit is logged and ignored). Non-blocking is the right
choice for _defensive scanning_ hooks where a hook outage should
degrade to "hook didn't run" rather than "tool calls fail" — but the
graceful-degradation contract requires that the outage itself is
**visible**, otherwise defensive hooks fail open without anyone
noticing.

In Claude Code, non-blocking hook failures are recorded in the session
JSONL transcript at `~/.claude/projects/<project>/<session>.jsonl` as
`hook_non_blocking_error` attachments. They are **not** surfaced to the
assistant channel, the terminal stdout, or any user-visible log file.
Discovering one requires (a) knowing the failure mode is possible,
(b) knowing the transcript file exists, (c) knowing the JSON shape to
grep for, (d) reading a multi-megabyte log. Discovery is therefore
adversarial in practice — it requires retrospective forensics rather
than concurrent observability.

**Reference incident** (2026-04-29, session `05f2e932`): the
`sonar-secrets` PreToolUse:Read hook was registered with a _relative_
command path (`.claude/hooks/sonar-secrets/build-scripts/pretool-secrets.sh`)
in `.claude/settings.json`. Claude Code resolves hook commands against
the shell's current working directory, which the agent had changed to
a sub-package (`packages/sdks/oak-sdk-codegen`) to run package-scoped
tests. The `cd` persisted between Bash tool calls per Claude Code's
documented contract. Subsequent `Read` tool calls fired the hook,
which tried to exec `./.claude/hooks/...` from inside the sub-package
where no `.claude/` directory exists. Three exec failures (exit 127,
"No such file or directory") were recorded in the session JSONL as
`hook_non_blocking_error`. Zero of them surfaced to the assistant.
The defensive secrets scanner was non-functional for the duration of
the off-root work, and there was no concurrent signal that anything
was wrong.

The failure mode generalises beyond this specific incident:

- Any hook command using a relative path will silently break under
  cwd changes.
- Any hook script that crashes with an unrelated runtime error
  (missing tool, permission error, syntax error) will fail silently.
- Any hook plugin update that renames or removes a script will fail
  silently until someone notices the protective layer isn't working.
- Any new hook registered without exec-existence verification will
  fail silently on first invocation if the path is wrong.

The structural property is: **non-blocking hook failures are silent
by default in every supported agentic platform's harness.** That is
the right choice for graceful degradation, but it requires an
out-of-band visibility surface to be operationally safe.

## Decision

**Every registered hook command in this repo's tracked agentic
infrastructure MUST route through a logging wrapper that persists
non-zero exits to a known file location with a known structure. The
wrapper writes only on failure; success-path performance and silence
are preserved. The wrapper is responsibility-of-platform but the
discipline is platform-portable.**

### Concrete rules

1. **Non-blocking hook failures MUST be observable in a developer-readable
   log file**, not only in the harness's internal session transcript.

2. **Every hook command registered in tracked configuration MUST use a
   dynamic path rooted at a platform-provided project-root variable**
   (e.g. `${CLAUDE_PROJECT_DIR}` for Claude Code; the analogous
   variable for each other supported platform). The variable is
   expanded by the harness at hook-execution time, so the resolved
   path is correct on every contributor's machine and survives any
   cwd changes during the session. Bare relative paths
   (`.claude/hooks/...`) break under cwd changes and are a
   silent-failure trap; literal absolute paths
   (`/Users/<name>/.../hooks/...`) hard-code one machine's layout
   into version control and break for everyone else on push. The
   correct shape is neither — it is platform-rooted dynamic
   expansion.

3. **Every hook command MUST be invoked through a logging wrapper.** The
   wrapper preserves stdin/stdout pass-through (so hook protocols are
   unaffected), captures stderr, and on non-zero exit appends a
   timestamped diagnostic block to the platform's hook-error log file.
   The wrapper re-emits captured stderr to its own stderr so the
   harness's existing internal logging is not weakened.

4. **The hook-error log file location is platform-local but
   contract-aligned.** For Claude Code: `.claude/logs/hook-errors.log`.
   For other platforms: `.<platform>/logs/hook-errors.log` or the
   platform's analogous adapter directory. Each log file is gitignored
   (machine-local; created on demand).

5. **The diagnostic block MUST include**: ISO-8601 UTC timestamp, exit
   code, full command (including arguments), current working directory,
   resolved project root, and captured stderr. This is the canonical
   message shape across platforms and is the contract a future
   platform-agnostic generalisation extracts.

### Reference instance (Claude Code)

- Wrapper: [`.claude/hooks/_lib/log-hook-errors.sh`](../../../.claude/hooks/_lib/log-hook-errors.sh)
  — POSIX-compatible, executable, ~50 lines.
- Registration: [`.claude/settings.json`](../../../.claude/settings.json)
  hook commands prefixed with the wrapper invocation
  (`${CLAUDE_PROJECT_DIR}/.claude/hooks/_lib/log-hook-errors.sh`)
  followed by the wrapped hook script's path in the same
  `${CLAUDE_PROJECT_DIR}/...`-rooted form as the next argument.
- Log file: `.claude/logs/hook-errors.log` (gitignored).

## Consequences

### Positive

- Defensive hooks fail visibly. A broken `sonar-secrets`,
  `pretool-secrets`, or any future hook leaves a developer-readable
  audit trail rather than a quiet bypass of a protective layer.
- Configuration drift is caught early. The relative-path bug that
  triggered this ADR would have surfaced on the first Read after the
  first sub-package `cd`, not three sessions later as forensic
  archaeology.
- The wrapper is reusable across all hooks in the same platform with
  zero per-hook code duplication. Adding logging to a new hook is a
  one-line registration change.
- Stderr flow to the harness's internal logs is preserved, so
  retrospective forensics are not weakened — the new log surface is
  _additive_.

### Negative

- A small per-hook overhead: one `mkdir -p`, one `mktemp`, one trap
  installation, one fork-exec of the wrapped script. Dominated by the
  wrapped hook's own work; not measurable in steady state.
- Wrapper-itself-not-found is still silent (the wrapper cannot log its
  own absence). Falls back to the harness's existing
  `hook_non_blocking_error` JSONL entry. See Limitations §1.
- A new file (the wrapper script) plus a new gitignored directory
  (`.claude/logs/`) per platform. Marginal repository surface
  expansion.

### Neutral

- Successful hook execution writes nothing to the log; idempotent
  `mkdir -p` of the log directory is the only side effect on
  success-path. Steady-state filesystem footprint is bounded.
- The discipline does not change hook semantics: blocking hooks still
  block, non-blocking hooks still degrade gracefully, decision-emitting
  hooks still emit decision JSON. The wrapper is transparent to the
  hook protocol.

## Alternatives Rejected

- **Inline `2>>logfile` redirect in the hook command string.** Works
  for the simple case but loses the diagnostic context (timestamp,
  exit code, cwd, command). Cannot distinguish stderr-on-success from
  stderr-on-failure. Brittle when commands grow argument complexity.
- **Promote all hooks to blocking.** Replaces silent failure with loud
  failure but gives up the graceful-degradation property the
  non-blocking declaration was chosen for. Defensive scanners
  legitimately need to fail open.
- **Lobby Anthropic to surface non-blocking errors to the assistant
  channel.** Worth doing in parallel as upstream advocacy, but not a
  durable repo-level fix and does not generalise to other agentic
  platforms.
- **Wrap each hook script internally rather than via an external
  wrapper.** Couples logging discipline to every hook author's
  diligence. The external-wrapper choice means the _harness contract_
  carries the discipline rather than each hook author re-implementing
  it.

## Limitations

This ADR is honest about what it does and does not cover:

1. **Wrapper-not-found is still silent.** If the wrapper script itself
   is missing, renamed, or non-executable, the harness logs a
   `hook_non_blocking_error` to its session JSONL but no entry lands
   in `.claude/logs/hook-errors.log` (the wrapper cannot log its own
   absence). Mitigation: the wrapper path is stable
   (`${CLAUDE_PROJECT_DIR}/.claude/hooks/_lib/log-hook-errors.sh`),
   the script is checked in, and a portability validator (Future Work
   §3) can probe its presence and executability.

2. **Claude Code only.** This ADR's reference implementation covers the
   Claude Code platform. Cursor, Codex, Gemini CLI, and any other
   platform's hooks remain out of scope until each platform has its
   own thin wrapper honouring the canonical contract. Per PDR-009
   §"Forbidden: Silent platform additions", this is a deliberate
   decision: a platform is not "covered" simply because the
   discipline applies in principle.

3. **Hooks declared outside `.claude/settings.json` bypass the
   wrapper.** Plugin-managed hooks (the Claude Code plugin loader),
   MCP-server-installed hooks, and hooks injected by skills can register
   their own commands without the wrapper prefix. Mitigation: those
   hooks are not under tracked-repo control, so the failure-visibility
   contract is not enforceable from this repo. A defensive measure
   would be to validate the harness's effective hook table at session
   start, but that requires harness API surface that is not currently
   guaranteed.

4. **The log file is unbounded.** No rotation, no truncation, no TTL.
   For a single developer's machine this is acceptable; the file is
   gitignored and only grows on actual failures, which should be rare
   in steady state. If frequent failures accumulate, manual `rm` is
   the answer until rotation discipline is added (Future Work §4).

5. **Forwarded stderr can be doubled in some harness configurations.**
   The wrapper re-emits captured stderr to its own stderr so the
   harness's internal logging is preserved. If the harness _also_ logs
   the wrapper's stdout/stderr separately, a single failure may appear
   twice across surfaces. This is preferable to losing it; consumers
   reading multiple surfaces should de-duplicate on timestamp+exit-code.

6. **The wrapper does not validate the wrapped script's content.** A
   hook script that returns exit 0 while writing concerning content to
   stdout (a malformed permission decision, a corrupted JSON envelope)
   does not trigger the log. The contract is "non-zero exit is
   visible", not "every form of misbehaviour is visible". Output-shape
   validation belongs in the hook protocol layer, not the wrapper.

7. **`mkdir -p` of the log directory runs unconditionally on every
   hook firing.** Idempotent and cheap, but it does mean
   `.claude/logs/` exists even on a workspace where no hook has ever
   failed. Cosmetic; the directory is gitignored.

## Future Work

The discipline named in this ADR is platform-portable; the
implementation is platform-specific. Per PDR-009's three-layer model
(canonical content + thin platform adapters + entry points), the
following work would generalise this ADR's scope from host-specific to
Practice-portable:

1. **Canonical contract extraction.** The substance of the message
   shape (timestamp + exit + cmd + cwd + project + stderr) and the
   responsibility split (registration uses a platform-rooted dynamic
   path; wrapper logs on failure; success is silent) are
   platform-portable. The platform-root **variable** is by definition
   platform-specific (`${CLAUDE_PROJECT_DIR}`, the Codex equivalent,
   the Cursor equivalent, etc.), but the **discipline** of using one
   is universal — that asymmetry is exactly what PDR-009's three-layer
   model handles. Extract
   to a Practice-Core-shaped surface — likely
   `.agent/practice-core/decision-records/PDR-NNN-agent-infrastructure-failure-visibility.md`
   or a section of an existing PDR (PDR-011's surprise pipeline is the
   nearest existing home, but failure visibility is a distinct
   concern from learning capture). Trigger condition: a second
   platform's adapter implementing the discipline, OR explicit owner
   direction to graduate without waiting.

2. **Per-platform thin wrappers.** Each platform that supports hooks
   (Cursor, Codex, Gemini CLI, future platforms) gets its own wrapper
   honouring the canonical contract. Wrappers remain thin: pass-through
   plus structured logging, no platform-specific logic beyond
   environment-variable discovery (e.g. Codex's project-root convention
   versus Claude Code's `${CLAUDE_PROJECT_DIR}`). The Bash
   implementation in this repo is suitable as a starting point; a
   platform that runs hooks in a different shell or runtime gets an
   equivalent thin script in its native form.

3. **Portability validation coverage.** Extend
   `scripts/validate-portability.mjs` (or its successor) with a check
   that every registered hook command in every tracked platform
   adapter's configuration is wrapped, and that each platform's
   wrapper script exists and is executable. This closes the
   wrapper-not-found Limitation §1 by making it a CI-detectable
   condition rather than a runtime-only condition.

4. **Log rotation discipline.** When a second platform's wrapper lands,
   add a Practice contract for log file size bounds and rotation
   strategy (size-based, age-based, or session-bounded). Until the
   log is portable, per-platform manual cleanup is the operational
   contract.

5. **Aggregated hook-failure surface.** Once two or more platforms
   write hook-error logs, consider an aggregation surface
   (`.agent/state/hook-errors/<platform>-<date>.log` or similar)
   that consolidates per-platform logs into a single browse surface.
   Optional; only worth building if cross-platform hook failures
   become a recurring debugging surface.

6. **PDR graduation watch.** Add the canonical-contract candidate to
   the pending-graduations register at
   [`repo-continuity.md § Deep consolidation status`](../../../.agent/memory/operational/repo-continuity.md)
   so the next consolidation pass sees it as a formal graduation
   candidate when the trigger condition fires (second platform
   implementation OR owner direction).

Until item 1 lands, this ADR's substance remains the authoritative
home for the discipline; future platform implementations should
reference back to this ADR rather than re-deriving the rationale.

## Notes

This ADR is host-specific in its toolchain choices (Claude Code's
hook system, `${CLAUDE_PROJECT_DIR}`, POSIX `bash` for the wrapper)
and is therefore an ADR rather than a PDR at this stage. The
graduation path to a PDR is named in Future Work §1.

The reference incident (session `05f2e932-7e1b-46c1-844f-8a162ec6ad53`,
2026-04-29) is preserved in the napkin entry cited in the Related
links and in the session JSONL transcript on the original developer's
machine. The fix landed in the same session: wrapper script, settings
update, gitignore entry, and end-to-end verification. No commit has
been made at the time of this ADR's authoring; the changes are staged
in the working tree of the `fix/build_issues` branch alongside other
in-flight work.
