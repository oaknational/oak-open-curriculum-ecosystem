# Agent Experience (AX) — Cause-Class Analysis of the Tooling Friction Corpus

**Date**: 2026-06-21
**Author session**: Nova wakes Genesis
**Status**: Stable synthesis. Names decisions and the highest-leverage cures; does
not make product decisions (those are owner-shaped).
**Companion doctrine**: [PDR-111 — Agent Experience Is a First-Class Practice
Optimisation Principle](../practice-core/decision-records/PDR-111-agent-experience-is-first-class.md)
**Companion plan**: [`agent-experience-improvement.plan.md`](../plans/agent-tooling/current/agent-experience-improvement.plan.md)

## Why this report exists

The repository carries an 82-entry agent-tooling friction register
([`frictions-register.md`](../plans/agent-tooling/frictions-register.md)) plus a
spread of session-operations and harness reports. The owner asked which of these
matter for **agent experience (AX)** — how well the substrate agents work in
(CLI, comms, watchers, gates, harness) serves the agents using it — and how to
make the tools work better.

The naive shape of that question (tag 82 frictions for relevance, list 82 fixes) is
wrong on first principles, and the correction is the report's central method:

1. **The register is the AX backlog by construction.** PDR-060 establishes that
   agents are both authors and users of this tooling, so agent-observed friction is
   first-class user feedback. Almost every entry is therefore AX-relevant. The
   discriminator is not *relevance* — it is **leverage**.
2. **An indiscriminate count is a set of cause-classes, not N independent
   problems** (`distilled.md`). 82 frictions collapse into a handful of structural
   shapes. Leading with the landscape, not per-item triage, is the whole value.

All 82 register entries were read first-hand for this report. Two harness-report
claims it relies on (Cursor MCP visibility; the compaction thinking-block bug) were
verified first-hand against their source reports. One sub-agent claim ("F-41 is
addressed") was caught as **false** against register line 1266 and excluded.

## AX has three layers

| Layer | Where it lives | Repo control |
|---|---|---|
| 1. Collaboration-substrate CLI (comms / claims / commit-queue / watchers) | the register, ~75 of 82 | full |
| 2. Harness / MCP transport (compaction, response visibility, file-diversion) | the reports | partial (vendor) |
| 3. Gate / build / hook tier (knip, commitlint, coverage, determinism) | both | full |

## The cause-class landscape

The 82 frictions collapse into eight classes. Friction ids are the first-hand
evidence per class.

### A — Discoverability / CLI-contract opacity (largest, ~19)

F-01, F-02, F-03, F-04, F-09, F-12, F-13, F-30, F-35, F-46, F-49, F-68, F-70, F-71,
F-72, F-76, F-78, F-79, F-80. Sub-shapes: invalid flag does not print full help;
semantic flag names or aliases missing; enum values not enumerated; a required flag
that the tool could default (F-72 `--active`); hidden mode-switches (F-35 heartbeat);
unparseable output (F-13, F-68, F-36); positional-vs-flag and cross-subcommand
inconsistency (F-79, F-80). **One structural cure retires the class.**

### B — Shell-layer hazards (~3)

F-32, F-48, part of F-41: arguments mis-expand (backticks, `$`, unquoted globs)
before the CLI receives them. `--body-file` landed; `--area-pattern-file` and the
glob half remain.

### C — Watcher / monitor correctness and liveness (the highest-safety class)

F-34, F-43, F-44, F-64, F-65, F-66, F-75, F-81, F-82, plus the worktree report's
hang-but-runs and the session-ops report's zombie accumulation. A blind watcher
makes an agent miss a STOP or barge a live peer's claim (F-44 computes freshness
without the heartbeat stream). Partly homed (four plans in `current/`); residuals
unhomed: F-43 (kill-tree / census / dir-scaled budget), F-75 (peer heartbeat-silence
alert), F-44 (heartbeat-aware freshness).

### D — Path / identity resolution across worktrees and fresh state

F-06, F-10, F-23, F-41, F-45, F-47, F-58, F-67, F-69, F-72. The single most
dangerous friction in the corpus is here: **F-41** — a relative path from a stale
cwd silently writes to the *wrong registry behind a green proof line* (the
false-green pattern the session-ops report independently flagged). Corrupting
coordination state invisibly is the worst AX failure mode there is.

### E — Gate / hook coverage drift and false-green

F-27, F-31, F-38, F-39, F-40, F-50, F-54, F-57, F-60, F-61, F-62, F-74, plus the
reports' exit-0-through-pipes and dist-export-broken-yet-green. Checks that live only
in `pnpm check`, not the blocking commit gate, so drift lands committed.

### F — Coordination-protocol races

F-18, F-22, F-24, F-28, F-29: multi-agent timing (a STOP arrives after the commit
hook starts; a directed reply is invisible until render). Protocol-design, not
single-mechanism-curable.

### G — Harness / platform AX (reports only)

The compaction thinking-block crash; Cursor-vs-Claude-Code MCP visibility opposite
halves (Cursor surfaces only `content`, Claude Code only `structuredContent` — both
first-hand verified); Cursor file-diversion; MCP prompts not surfaced to the model.
Mostly vendor-controlled — except the MCP **response shape**, which the repo controls
(dual content+structuredContent already landed, PR `20ad83326`).

### H — Skills / adapter sprawl and generator drift

F-16, F-37, F-52, F-53: homed in the skills-standardisation plan.

## Relevance verdict

The register **is** the AX backlog. Nearly all 82 entries are AX-relevant; the few
that are AX-adjacent rather than core-substrate (F-25 ESLint lib-boundary, F-26 pnpm
purge prompt, F-31/F-74 build determinism, F-51 worktree symlink) are
developer-experience-that-agents-hit, still relevant, lower-substrate. The honest
finding: filter-for-relevance is the wrong cut; the work is an AX-improvement
*strategy* across the corpus.

## How to make the tools work better — leverage ranking

1. **A CLI-ergonomics conformance guard** (Class A). A single test over every
   subcommand asserting full-help-on-invalid, enum enumeration, labelled output,
   well-known-path defaults, cross-command flag consistency. Retires ~19 frictions
   as a class and prevents regressions — the structural-cure-over-doc-patch shape at
   maximum count-leverage. **Already doctrine and already homed**: PDR-055 clauses
   7–10 mandate it, and [`agent-tools-cli-ergonomics.plan.md`](../plans/agent-tooling/current/agent-tools-cli-ergonomics.plan.md)
   (`READY FOR EXECUTION`) carries it as WS6. The right move is to *execute* it, not
   re-plan it.
2. **Coordination-home path resolution and state self-init** (Class D, F-41).
   Resolve the coordination home via repo-root discovery, refuse relative paths
   loudly. Safety-critical; OPEN and unhomed (verified first-hand against register
   line 1266). Reusable seam: `resolveRepoRoot()` in `agent-tools/src/core/repo-root.ts`.
3. **Complete the watcher liveness story** (Class C). The canonicalisation and
   hang-hardening plans are in flight; fund the unhomed residuals (F-43, F-75, F-44).
4. **The `:built` / `:dev` hot-path split** (F-06/F-23/F-36). Agents run uncommitted
   peer edits as the live CLI contract; PDR-055 clause 6 names the cure.
5. **Close the commit-gate coverage gaps and build determinism** (Class E,
   F-54/F-57/F-74/F-61).

## The meta-finding: capture works, drain does not keep up

Of 82 entries, 61 are `open`. The capture discipline (PDR-060) faithfully *records*
friction, but cures accumulate slower than frictions, and the drain is **invisible
and un-mechanised**:

- Cures are dispersed across at least six plans, but the register's status lines lag —
  a friction reads `open` while its cure is mid-flight elsewhere.
- No surface joins friction → plan-home → status.
- Nothing mechanically detects a friction with no home, a dangling plan/commit
  reference, or a stale disposition (a cure that landed while the friction stayed
  `open`).

This is the PDR-098 "mechanical-fire + surface-detect" quadrant left empty for the
register itself: staleness here has a filesystem signature (a cited plan moved to
`archive/`), so a deterministic validator can occupy it — exactly the argument F-69
makes for stale collaboration *state*, and the shape of the sibling repo-validators
F-40/F-50/F-57 already ask for. So "make the tools work better" is, at the system
level, **shift from per-friction patching to class-retiring structural cures, and
mechanise the drain so it cannot silently lag.** That is the companion plan's spine.

## Next steps

1. **Execute the umbrella plan** ([`agent-experience-improvement.plan.md`](../plans/agent-tooling/current/agent-experience-improvement.plan.md)):
   the structural drain-fix (a `frictions-register` validator + generated routing
   index), F-41 path-safety, gate-coverage, and the disposition ledger routing all
   82 frictions to a home; it *drives* the already-homed cli-ergonomics and watcher
   plans rather than duplicating them.
2. **A deeper survey of logs, frustrations, and prior-state logs**
   ([`agent-frustration-corpus-survey.plan.md`](../plans/agent-tooling/future/agent-frustration-corpus-survey.plan.md)):
   mine the corpora that hold friction signal *not yet in the register* — ~93
   archived napkins, the comms corpus (~345 live events plus archive), the
   `agentic-engineering/` WS1–6 failure-mode taxonomy and discoverability audits,
   `analysis/` and `research/`, and git-log friction signals — then dedupe against
   the register and route the residue in. Scoped as a `future/` brief; its own
   output feeds the drain machinery this report's meta-finding installs.
3. **Harness/platform items** (Class G) are recorded as known constraints, not build
   targets: the compaction bug and Cursor MCP visibility are largely vendor-side; the
   repo-controlled MCP response shape is already dual-shaped.
