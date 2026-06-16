---
plan_id: agent-tools-cli-ergonomics
collection: agent-tooling
lane: current
status: READY FOR EXECUTION (Phase 0 first; implementation scope ratified at the Phase-0 gate)
created: 2026-06-16
owner_thread: agentic-engineering-enhancements
problem_origin: >-
  Recurring agent mis-invocation of the agent-tools CLI (owner-raised 2026-06-16).
  Specimen: `claims open --active <markdown file>` — `--active` reads as "the file
  I'm active on" but means "the active-claims registry JSON path"; the raw
  JSON.parse SyntaxError masked the misuse. Root: the CLI asks callers for values
  the tool already knows, help is a syntax skeleton, errors do not teach — AND
  these properties vary command-to-command, so the CLI is internally INCONSISTENT.
  Fixing only the broken commands perpetuates the problem; the cure is one
  convention applied across the whole surface, structurally guarded.
todos:
  - id: ws0-convention-and-audit
    content: "Phase 0 — define the CLI ergonomics convention; audit EVERY command against it for conformance gaps; mine friction evidence; inventory consumers for backward-compat; ranked recommendation + ratification gate"
    status: pending
  - id: ws1-default-paths
    content: "Default the well-known state paths (--active/--closed/--comms-dir) to canonical locations across ALL commands that take them; keep as overrides"
    status: pending
    depends_on: [ws0-convention-and-audit]
  - id: ws2-env-derivation
    content: "Derive identity/platform/model/now from the hook-set env when omitted, across ALL commands; explicit flags override"
    status: pending
    depends_on: [ws0-convention-and-audit]
  - id: ws3-teaching-help
    content: "Teaching help (per-flag description + default + canonical value + worked example) for EVERY command"
    status: pending
    depends_on: [ws0-convention-and-audit, ws1-default-paths, ws2-env-derivation]
  - id: ws4-actionable-errors
    content: "Commit the seeded registry/archive actionable-error work, then extend the pattern to ALL file-read and JSON-input boundaries"
    status: pending
    depends_on: [ws0-convention-and-audit]
  - id: ws5-single-invocation-form
    content: "Document one canonical invocation form; consolidate standalone command-scripts (e.g. the commit-message check) into the unified CLI; retire the pnpm `--`-passthrough footgun"
    status: pending
    depends_on: [ws0-convention-and-audit]
  - id: ws6-conformance-guard
    content: "A structural conformance check that fails when ANY command (including a future one) violates the convention — the anti-perpetuation cure"
    status: pending
    depends_on: [ws0-convention-and-audit]
  - id: ws7-close
    content: "Propagate docs (start-right, AGENT, use-built-agent-tools-cli rule), run the learning loop, archive"
    status: pending
    depends_on: [ws1-default-paths, ws2-env-derivation, ws3-teaching-help, ws4-actionable-errors, ws5-single-invocation-form, ws6-conformance-guard]
---

# Agent-Tools CLI Ergonomics

## End Goal

An agent (or human) invokes **any** agent-tools command correctly by default —
wrong-argument invocations approach zero — because the **whole CLI follows one
consistent convention**: every command asks only for what only the caller knows,
resolves the rest, and teaches in both help and errors. **Consistency is itself the
value**: a predictable mental model that holds across every command, so learning one
command teaches them all. The user-impact outcome: less wasted owner attention on
mis-invocations, and reliable collaboration primitives agents actually use.

## Mechanism

The recurring errors are a **tool-design problem, not an agent-discipline problem**
(a vigilance cure — "read more carefully" — does not scale, the same reason a prose
reminder did not stop owner-gated re-creeping). Five generators:

1. **Required args for tool-knowable values** (`--active` is a constant path; `--now`
   a readable timestamp; `--platform`/`--model` already resolved from env by
   `identity preflight`) → each is an opportunity to pass the wrong thing.
2. **Flag names encode files, not caller intent** (`--active`/`--closed`).
3. **Help is a syntax skeleton** — shape without meaning, defaults, or examples.
4. **Errors do not teach** — a raw `JSON.parse` SyntaxError gives no correction signal.
5. **Inconsistency across commands is itself a generator.** When `claims` defaults a
   path but `escalation` requires it, or one command's help teaches and another's does
   not, an agent's *correct* model of one command is *wrong* for the next — and the
   mismatch manufactures the error. **Fixing only the broken commands leaves the
   inconsistency, so it perpetuates the problem.**

The cure is therefore not N bespoke fixes: it is **one convention, applied uniformly
across the whole command surface, and a structural conformance guard** so the
convention cannot drift as commands are added or changed. The convention is the spine;
WS1–WS5 are its facets brought to full-surface conformance; WS6 guards it. This
convention is the universal Practice requirement ratified in **PDR-055 clauses 7–10**
(amended 2026-06-16); this plan is its instantiation for this repo's CLIs.

## Means

### WS0 — Convention definition & full-surface audit (Phase 0, blocking gate)

Bounded design work, first-hand, producing a decision — not open-ended analysis.

- **Define the ergonomics convention** — the standard EVERY command must meet:
  required args are caller-knowledge only; tool-knowable values (state paths, now,
  platform/model, session) are defaulted/derived with explicit override; help carries
  per-flag description + default + canonical value + a worked example; file/JSON
  boundaries emit actionable errors (name the surface + expectation, preserve `cause`);
  one documented invocation form.
- **Audit the FULL surface against it.** Enumerate every topic/subcommand of the
  unified entrypoint (`collaboration-state` topics identity/comms/claims/tui/
  conversation/escalation/check; standalone bins — `agent-identity`, `commit-queue`,
  `branch-touched-files`, `comms-archive-move`, …). Produce a **per-command conformance
  matrix** (which convention facets each command violates). This audit, not the list of
  currently-broken commands, defines the implementation scope.
- **Include standalone command-scripts as conformance gaps.** `pnpm agent-tools:*`
  scripts that invoke their own bin/tsx entry instead of a unified-entrypoint subcommand
  (e.g. `check-commit-message`) are themselves an invocation-form inconsistency — a second
  way in, each with its own `--`-passthrough footgun. The audit enumerates them for
  folding into the CLI.
- **Mine real failure evidence** — frictions register F-41..F-59, the commit-format
  friction, this session's `--active` bug — for cases the facets miss.
- **Inventory consumers (backward-compat).** Every place that passes explicit args
  today — hooks (`.claude/hooks`, `.cursor/hooks`), repo scripts, skills/docs — AND
  specifically any consumer passing a **non-canonical** value for a to-be-defaulted flag
  (test fixtures, per-agent dirs, relative paths). Defaults must be additive (fire only
  when omitted); explicit must always override.
- **Deliverable:** a comparative report under `.agent/reports/` that *names the
  decisions* (the convention spec; adopt/defer/reject per facet with rationale; the
  conformance matrix; the consumer inventory; a recommended sequence). Present a
  **recommendation** (verdict with evidence), not a menu. Ratification gate before
  implementation WS land (a legitimate plan-ratification gate — owner-authority PDR-100
  did **not** abolish).

### WS1 — Default well-known state paths (surface-wide)

`--active`/`--closed`/`--comms-dir` (and any sibling state-path flag the audit finds)
resolve canonical `.agent/state/collaboration/...` locations by default across **every**
command that takes them; they remain optional overrides.

### WS2 — Derive identity / now from env (surface-wide)

`--platform`/`--model`/session resolve from the hook-set env when omitted, consistent
with `identity preflight`, across every command; `--now` defaults to current time unless
overridden. Required flags shrink to intent-level everywhere.

### WS3 — Teaching help (every command)

Every command's `--help` carries, per flag: a description, the default (where
defaulted), the canonical value, and a worked example. **Content dependency:** for a
flag that WS1/WS2 newly default, WS3's default/canonical text for that flag lands after
WS1/WS2 land it; description + example content can proceed in parallel.

### WS4 — Actionable boundary errors (every boundary)

WS4's first cycle **commits the seeded, currently-uncommitted** work
(`json.ts` `parseJsonText` + `state-parsers.ts` registry/archive labels + co-located
`state-parsers.unit.test.ts`), then extends the pattern to all remaining file-read and
JSON-input boundaries (comms/conversation/escalation reads; `--entry-json`/`--body-json`).

### WS5 — Single invocation form (consolidate standalone scripts into the CLI)

One canonical, documented invocation; retire or guard the pnpm `--`-passthrough footgun.
**Consolidate standalone command-scripts into the unified CLI as subcommands** so there
is one entrypoint and one invocation form. Worked instance: the commit-message check —
today `agent-tools/src/commit-advisories/check-commit-message.ts`, invoked via
`pnpm agent-tools:check-commit-message -- -m '…'`, where the pnpm wrapper doubles the `--`
passthrough (this session hit exactly that failure) — moves into the unified CLI as a
subcommand (name decided at WS0), retiring the standalone pnpm-script invocation. WS0
enumerates the rest. Update `use-built-agent-tools-cli` and the start-right reading order
to the one form.

### WS6 — Conformance guard (the anti-perpetuation cure)

A structural check (repo-validator/test) asserting every command conforms to the
convention — tool-knowable flags carry a default, help carries description+default+
example, boundary reads use the actionable-error helper — and **failing CI when any
command, including a newly-added one, drifts**. Without this, the next command
reintroduces the inconsistency and the problem returns.

WS1–WS6 share WS0's ratification as their only common gate. WS1, WS2, WS4, WS5, WS6 are
mutually independent (separate surfaces); WS3 has the named content dependency on
WS1/WS2. Sequencing MAY prioritise high-friction commands (claims/identity/comms) for
early value, but **full-surface consistency is the acceptance bar, not a later phase.**
Each WS is delivered as TDD cycles, one commit per cycle, all tests green at every commit.

## Acceptance Criteria (outcome-based)

- **WS0:** the report records the convention spec, a decision per facet with rationale,
  the full per-command conformance matrix, and the consumer inventory (incl.
  non-canonical-value consumers); the sequence is ratified. Proof: `non-code`.
- **WS1:** for every command taking a state path, the command succeeds with the flag
  omitted (canonical location resolved) and an explicit value still overrides. Proof:
  unit + integration + smoke invocation.
- **WS2:** identity/platform/model/now resolve from an **injected** env (passed as an
  explicit argument, never read from `process.env` in tests — `no-global-state-in-tests`)
  when omitted; explicit overrides. Proof: unit test over the pure resolver.
- **WS3:** for every command, `--help` contains a per-flag description, default, and
  worked example. Proof: unit test asserting key content (not a brittle full snapshot).
- **WS4:** the seeded work is committed; every in-scope boundary yields an actionable
  error naming surface + expectation, `cause` preserved. Proof: unit tests.
- **WS5:** exactly one invocation form documented across start-right / AGENT / the rule;
  footgun retired or guarded. Proof: onboarding-expert review + doc check.
- **WS6 (consistency bar):** the conformance guard **passes on the full conforming
  surface and fails on a deliberately non-conforming probe command** (test the checker
  engine, not a snapshot of today's config). Proof: the guard's own unit test + the
  guard wired into the gate sequence.
- **Cross-cutting (backward-compat):** every inventoried consumer still works; the
  regression sweep asserts **explicit-override-wins for every defaulted flag**, not only
  default-fires. Proof: existing agent-tools suite green + the sweep.

## Prerequisites

- **Blocking:** WS0 ratification gates WS1–WS6 (scope/sequence decided there).
- **Beneficial:** none. WS0 can begin immediately against the current CLI.

## Non-Goals

- Not rewriting the unified-entrypoint architecture or adding new bins (no-new-bins).
- Not changing command semantics, output schemas, or collaboration-state file formats.
- Not a TUI redesign.
- **NOT** fencing scope to "currently-broken commands" — that fence is the error this
  plan exists to correct; the convention applies to the whole command surface.
  (Sequencing may order the work; it does not narrow the consistency bar.)

## Foundation Alignment

- [PDR-055 (CLI affordance-set discipline, amended 2026-06-16)](../../../practice-core/decision-records/PDR-055-cli-affordance-set-discipline.md)
  — **the doctrinal basis.** This plan is the repo instantiation of clauses 7–10
  (universal CLI API-surface-design consistency); WS6 is the conformance guard clause 10 requires.
- [`principles.md`](../../../directives/principles.md) — ask only for caller-knowledge;
  `strict-validation-at-boundary`; `replace-dont-bridge` (defaults replace required-flag
  friction, no shim); consistency as a first-class design property.
- [`testing-strategy.md`](../../../directives/testing-strategy.md) — TDD cycles as the
  landing unit; env injected as an explicit argument, never global `process.env` in
  tests; test the conformance engine, not the configuration.
- Practice-Core portability — identity/claim resolution stays platform-independent.

## Plan-Body First-Principles Check

Per [`plan-body-first-principles-check`](../../../rules/plan-body-first-principles-check.md):
the shape-clause fires on **WS0** — "audit" must terminate in a convention spec + ranked
decision + ratification, not open-ended analysis; the scope is defined by the conformance
matrix, not by the broken-command list. The landing-path clause fires on WS1–WS6 — each
is test-first TDD, every commit green. No vendor-literal clause applies (internal CLI).

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Defaulting/deriving breaks a consumer passing a **non-canonical** explicit value | WS0 inventory explicitly includes non-canonical-value consumers; regression sweep asserts explicit-override-wins for every defaulted flag |
| env-derivation tempts `process.env` reads in tests | Pure resolver takes env as an argument; the bin reads env only at the outermost boundary |
| `--now` default introduces non-determinism in tests | Default fires only on the omitted-flag path; tests always pass `--now` explicitly (existing contract) |
| Full-surface scope balloons into a CLI rewrite | Convention defined once and applied uniformly (not N bespoke fixes); WS6 guard makes conformance mechanical; non-goals fence the architecture |
| Help-text tests become brittle snapshots | Assert key content present, not full output |
| Convention drifts as new commands are added | WS6 conformance guard fails CI on any non-conforming command |

## Readiness Reviewers

`assumptions-expert` (proportionality + the WS0-gates relationship) — first pass done,
findings folded in (backward-compat non-canonical consumers; WS3 content dependency;
WS4 seeded-not-landed); re-review after the consistency reframe. `test-expert`
(env-injection + conformance-engine test shape) and an architecture reviewer
(`architecture-expert-betty`) at WS0's design output; `onboarding-expert` for WS5.
Findings assessed first-hand.

## Learning Loop & Lifecycle Triggers

Completion runs the consolidation workflow; lifecycle touch points per
[`lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md)
(session-open grounding, claim registration on the agent-tools surface, per-cycle commit
landing, handoff closure, archival per ADR-117). Mine WS-outcomes into the
`use-built-agent-tools-cli` rule and the start-right reading order — the convention
becomes documented doctrine, not just code.
