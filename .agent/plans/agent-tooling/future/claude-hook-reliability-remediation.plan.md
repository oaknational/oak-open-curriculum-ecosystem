---
name: "Claude hook reliability remediation"
status: "STRATEGIC — AUTHORITY GATE REQUIRED BEFORE PROMOTION"
created: 2026-07-15
owner: "Practice owner"
lineage:
  concept: "../../../research/developer-experience/codex-hook-context-bounded-non-interactive-exploration-2026-07-15.md"
  architecture: "agent-tools-architecture-standard.plan.md"
  policy: "hook-policy-typescript-and-schema-unification.plan.md"
  matcher: "../../agentic-engineering-enhancements/current/hook-matcher-string-awareness-cure.plan.md"
---

# Claude hook reliability remediation

## End goal

The configured Claude hook estate has truthful, observable behaviour from a fresh checkout:
deterministic guards do not depend on an unavailable runtime, every entry point is root-safe,
scanner errors are distinguishable from clean results, and the validator recomputes the effective
configured estate. This plan completes independently of any Codex experiment.

## Why this is not yet a current execution plan

The missing-`dist` evidence fires the promotion trigger in
[`agent-tools-architecture-standard.plan.md`](agent-tools-architecture-standard.plan.md), whose WS0
owns the source-vs-built-vs-principled-hybrid execution model. The related
[`hook-policy-typescript-and-schema-unification.plan.md`](hook-policy-typescript-and-schema-unification.plan.md)
also owns the loader/runtime boundary and correctly preserves fail-open recovery when a build is
missing. Selecting a tracked bundle here would pre-empt both authorities.

Promotion therefore starts with one architecture disposition, not implementation. The owner may
promote this plan together with architecture WS0, or fold the runtime work into that plan and
promote only the independent hook-observability slice.

## Evidence baseline

- Eight hook-policy test files currently pass 155 tests, and the Bash routing validator passes.
- Bash/Edit/Write guards execute gitignored `agent-tools/dist` output; the local log contained 126
  missing-build fail-open entries in the counted classes.
- The missing-build fail-open is deliberate recovery behaviour. The defect is the runtime
  dependency, not the fallback contract.
- Sonar wrappers block secret-detected exit 51 but normalize other scanner/parse failures to
  success; the common wrapper logs only non-zero exits.
- `SessionStart` is relative while the remaining hook commands use the project-root variable.
- The existing validator does not recompute all configured hooks or the Sonar outcome taxonomy.
- Claude's official hooks reference documents `${CLAUDE_PROJECT_DIR}`, structured command/args,
  matchers, exit-code behaviour, timeouts, and JSON output. Because `PreToolUse` is scoped to tool
  calls and its matcher evaluates `tool_name`, a `Read` route cannot claim coverage of other
  file-ingress mechanisms.
- The separate opt-in Codex reviewer now builds a self-contained adapter and copies it into a
  private, content-addressed local deployment with executable pins. That local, benchmark-gated
  mechanism neither repairs the tracked default hook estate from a fresh checkout nor selects a
  general execution tier for agent-tools.

## Scope and disposition

| Finding | Owning disposition | Independence |
| --- | --- | --- |
| Guards depend on missing gitignored output | Architecture WS0 compares execution tiers and reconciles ADR/plan authority | Blocks only the runtime slice |
| Relative/loosely quoted hook commands | Root with `${CLAUDE_PROJECT_DIR}` and structured command/args where supported | Can ship independently |
| Sonar scanner errors appear clean | Introduce explicit clean/secret/error outcomes and observable wrapper behaviour | Can ship independently |
| Validator covers only one route | Recompute settings and exercise every configured event/matcher/command | Can ship independently |
| `Read` scanner has a platform coverage ceiling | Document the ceiling and avoid complete-coverage language | Can ship independently |
| Bash quoted/heredoc false positives | Existing current string-awareness plan | Out of scope |
| Typed policy/schema redesign | Existing hook-policy unification plan | Coordinate, do not duplicate |
| Semantic model experiment and its private local bundle | Separate Codex feasibility plan; do not generalise its purpose-specific deployment without the authority gate | Must not block this plan |

## Authority gate — runtime execution model

Before runtime implementation, architecture WS0 must compare at least:

1. a tracked generated self-contained bundle with deterministic regenerate-and-diff validation;
2. a zero-dependency, directly executable TypeScript/runtime tier consistent with the repo's
   TypeScript-ESM source rule; and
3. the execution model selected by the broader agent-tools architecture pass.

The decision must name the canonical source, deployment artefact (if any), generator, drift gate,
fresh-checkout behaviour, recovery behaviour, and required ADR supersession/amendment. A new
tracked deployment tier may not become a second canonical runtime.

The semantic reviewer's private content-addressed copy is evidence that a local opt-in deployment
can be fingerprinted and pinned. It is not a fourth pre-selected answer to this gate: this plan's
target is the configured, deterministic fresh-checkout estate, while that copy is created only by
an explicit local benchmark after build and remains gitignored.

## Promoted execution sequence

### H0 — authority reconciliation

- Run architecture WS0 and record the selected execution tier.
- Reconcile ADR-178 and the hook-policy plan explicitly.
- Split runtime implementation from the independent observability work if either can ship sooner.

### H1 — root-safe configured entry points

- Express every repo command from `${CLAUDE_PROJECT_DIR}`.
- Prefer Claude's structured command/args form where the installed schema supports it.
- Route every hook through the canonical observable wrapper without shell-quoting ambiguity.
- Test the commands as configured in `.claude/settings.json`, not only their leaf functions.

### H2 — Sonar outcome contract

- Model `clean`, `secret-detected`, `scanner-error`, and `invalid-input` separately.
- Preserve secret redaction and prohibit payload logging.
- Make scanner and parse failures visible without misreporting them as clean.
- Decide fail-open/fail-closed per route explicitly; do not inherit it accidentally from shell
  exit normalization.

### H3 — effective-estate validator

- Parse the live settings and enumerate every event, matcher, and configured command.
- Recompute route and outcome expectations from source rather than trusting a report.
- Add paired safe and known-dangerous fresh-checkout fixtures for each configured deterministic
  route — Bash, Edit, and Write — without `node_modules` or `dist`.
- Add table-driven Sonar route tests and a drift check for any selected generated runtime.
- Keep normal gates hermetic and network-free.

### H4 — documentation and closeout

- Update hook architecture/operations docs and the effective-estate report.
- State that `PreToolUse/Read` covers `Read` tool calls, not every file-ingress mechanism.
- Run immediate focused tests, hook validators, Markdown/link checks, and the canonical gates.
- Archive this plan only when every in-scope finding is implemented or explicitly transferred to
  a named live owner.

## Acceptance contracts

| ID | Contract | Evidence |
| --- | --- | --- |
| HR-1 | For each Bash, Edit, and Write route, fresh checkout blocks a known-dangerous fixture and allows a safe fixture without install/build | Route-complete black-box integration tests |
| HR-2 | Runtime artefacts have one canonical source and deterministic drift detection | Regenerate-and-diff test plus architecture record |
| HR-3 | Every configured repo command resolves from a non-root working directory | Settings-driven integration test |
| HR-4 | Clean, secret, scanner-error, and invalid-input are distinct for both Sonar routes | Table-driven unit and configured-command tests |
| HR-5 | Validator inventory equals the live settings inventory | Recomputed route manifest assertion |
| HR-6 | No hook or test logs scanned payload content | Log assertion and review |
| HR-7 | Docs state the `Read` coverage ceiling and current failure semantics | Documentation review |

## Rules-tier crosswalk

- `ship-independent-coordinate-dependent`: root/observability/validation slices do not wait for
  Codex or for an unrelated runtime decision.
- `source-is-typescript-esm-only` and ADR-178 / `use-built-agent-tools-cli`: architecture WS0 must
  reconcile the source/runtime tension before implementation.
- `validators-must-recompute`: the validator derives the estate from live settings.
- `test-immediate-fails` and network-free CI: focused tests run first; normal gates never call a
  hosted model or scanner service.
- `no-unbounded-host-load`: validators use bounded fixtures and subprocesses.
- significant-doc reviewer pairing: architecture and completion surfaces receive an independent
  assumptions/reviewer pass.

## Falsifiers and stop conditions

- Reject the runtime cure if fresh checkout still requires install/build to enforce both safe and
  dangerous cases.
- Reject a tracked runtime if regenerate-and-diff is nondeterministic, creates a second source of
  truth, or cannot be reconciled with ADR/plan authority.
- Do not promote implementation while architecture WS0 remains undecided.
- Do not call scanner errors clean, and do not broaden `Read` coverage claims beyond Claude's
  actual event mechanics.

## Promotion trigger

Triggered by the observed build-order/invocation inconsistency. Promotion still requires the
owner to schedule or fold architecture WS0 and name the execution-plan owner. Until that happens,
this remains a strategic plan rather than a ready item in `current/`.
