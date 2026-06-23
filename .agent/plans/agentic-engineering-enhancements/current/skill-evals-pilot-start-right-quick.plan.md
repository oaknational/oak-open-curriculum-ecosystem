---
name: "Skill Evals Pilot — start-right-quick"
overview: "Pilot the in-repo skill evals/ convention on the high-traffic start-right-quick grounding skill: establish how to evaluate a grounding skill (behaviour-on-transcript, with/without baseline), measure whether it earns its context cost, and produce a reusable pattern — before generalising the evals regime."
todos:
  - id: ws1-author-cases
    content: "WS1: author evals/evals.json for start-right-quick — 3 realistic session-open test cases + expected grounding behaviour. Eval definitions, not code."
    status: pending
    depends_on: []
  - id: ws2-baseline-runs
    content: "WS2: run each case with-skill and without-skill from clean subagent context; capture transcripts + timing (tokens, duration)."
    status: pending
    depends_on: [ws1-author-cases]
  - id: ws3-assertions-grade
    content: "WS3: author assertions AFTER the first run (observable grounding behaviours); grade PASS/FAIL with transcript evidence (LLM-judge + any mechanical verification scripts); aggregate a benchmark with the with/without delta."
    status: pending
    depends_on: [ws2-baseline-runs]
  - id: ws4-synthesise
    content: "WS4: synthesise — does start-right-quick earn its context? Iterate the skill if signals warrant; write findings; recommend whether/how to generalise the skill-eval pattern."
    status: pending
    depends_on: [ws3-assertions-grade]
isProject: false
---

# Skill Evals Pilot — start-right-quick

**Last Updated**: 2026-06-23
**Status**: 🟡 PLANNING (current/ — queued, not started)
**Scope**: Prove the in-repo skill `evals/` convention on one high-traffic, high-leverage skill — `start-right-quick` — and answer the open questions the evals position report could not: *can a grounding skill be evaluated at all, and does this one earn its context cost?*

> Sibling thread: the MCPJam-driven validation of the **MCP server** surface lives
> in the session record / UAT report. This plan is the **skill** surface, kept
> deliberately separate.

---

## Context

### Problem Statement

`start-right-quick` is invoked constantly (session-open grounding, re-grounding). Its
context and behavioural footprint are therefore large in aggregate, yet we have **no
evidence** that it reliably produces correct grounding, or that it earns its context
cost versus the agent's baseline behaviour. The owner directive
([`principles.md` §"Agentic Quality"](../../../directives/principles.md)) requires
every agentic capability to carry evaluation definitions; this is the highest-leverage
skill to start with, and it stress-tests the hardest case.

**The hard part:** `start-right-quick` is a **grounding** skill, not a task skill with
a gradeable artefact. Its value is *downstream behaviour* — the agent reads the right
directives, registers identity (PDR-027), applies start-right discipline, and proceeds
correctly. The eval grades the **execution transcript**, not an output file.

### Existing Capabilities

- The skill: [`start-right-quick/SKILL-CANONICAL.md`](../../../skills/start-right-quick/SKILL-CANONICAL.md).
- The methodology and decisions: [`evals-and-assurance-position-2026-06-23.md`](../../../reports/evals-and-assurance-position-2026-06-23.md) — the test/evaluate/assure frame, the with/without-baseline delta, and the proportionality and "not-eval-shaped" cautions this pilot tests in practice.
- The standard in-repo mechanism: an `evals/evals.json` directory inside the skill (agentskills.io / `skill-creator`). **No Oak skill uses `evals/` yet** — this pilot establishes the first.

---

## Design Principles

1. **Grade behaviour, not phrasing** — assertions describe observable grounding
   *outcomes* (did it read the canonical directives? register identity? surface
   grounding before acting? did downstream actions honour the practice — repo scripts,
   no skipped gates?), never the exact words the agent used. (The describe-don't-audit
   continuity from the evals report.)
2. **Baseline-relative** — every case runs **with-skill and without-skill** from a clean
   subagent context. The delta is the point: does the skill measurably improve grounding,
   and at what token cost?
3. **In-repo evals** — `evals/evals.json` lives with the skill, versioned and reviewable.
   (This pilot does not touch the hosted-vs-in-repo question for MCP-server evals.)
4. **Proportionate** — this skill is piloted *because* it is high-traffic; the rigour is
   justified by usage, per the report's risk-tiering.

**Non-Goals** (YAGNI):

- A general skill-eval harness or CI eval-gating — this is a single-skill pilot to learn the pattern first.
- Evaluating any other skill — `start-right-quick` only.
- The in-repo-vs-hosted eval-home decision for the MCP server (separate, open).
- Forcing a verdict that the skill must change — "iterate" is one possible outcome; "keep as-is, now evidenced" and "retire/trim" are equally valid.

---

## Plan-body first-principles check

> See [`plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md)

- **TDD-cycle shape is deliberately N/A here.** Per the evals report, eval authoring
  *inverts* test-first — assertions are written **after** the first run, because you do
  not know what good grounding looks like until you have seen the transcript. Forcing
  Red/Green/Refactor onto eval authoring would be the doctrine-by-analogy error
  `testing-strategy.md` is *not* meant to cover. The **unit of landing here is the eval
  iteration** (author → run with/without → assert → grade → benchmark → iterate).
  The *only* TDD-shaped sub-work is any **mechanical verification script** written for an
  objectively-checkable assertion (e.g. "the transcript shows a read of `AGENT.md`") —
  those scripts are authored test-first in the normal way.
- **Vendor-literal**: N/A (no third-party vendor; in-repo evals + subagent runs).
- **Landing path**: each WS produces a reviewable artefact (`evals.json`, run
  transcripts + `timing.json`, `grading.json` + `benchmark.json`, findings) committed as
  it completes.

---

## WS1 — Author `evals/evals.json` for start-right-quick

Create `.agent/skills/start-right-quick/evals/evals.json` with **3** realistic
session-open test cases (prompt + expected grounding behaviour + any input context).
Draft cases:

1. **Cold task** — "Help me fix the failing type-check in the search SDK" issued at
   session open (should trigger grounding before diving in).
2. **Explicit re-ground** — "/oak-start-right-quick" / "re-ground before we continue."
3. **Ambiguous open** — a vague "let's get going" that should still produce grounding
   (identity registration, directive read, start-right discipline) before action.

Each case states the **expected grounding behaviour** in human-readable terms (no
assertions yet — those come in WS3, per the inversion above).

**Acceptance:** `evals/evals.json` exists, parses, and each case has a realistic prompt
and a described expected behaviour. Committed.

---

## WS2 — Baseline runs (with-skill vs without-skill)

For each case, run **twice** from a **clean subagent context** (fresh task = clean
context, per `skill-creator`): once **with** `start-right-quick` available, once
**without** (baseline). Save transcripts and `timing.json` (tokens, duration — capture
immediately from the task-completion notification; not persisted elsewhere). Workspace:
`start-right-quick-evals-workspace/iteration-1/<case>/{with_skill,without_skill}/`.

**Acceptance:** for all 3 cases, both runs completed, transcripts + timing saved.
Parallel-safe across cases.

---

## WS3 — Assertions, grading, benchmark

After seeing the first runs, author **assertions** — specific, observable,
transcript-checkable grounding behaviours, e.g.:

- "The agent read the canonical directives (AGENT.md / the directive set) before acting."
- "The agent registered session identity (PDR-027) / surfaced its agent name."
- "The agent applied a start-right step (e.g. active-area registration, gate awareness) before the first substantive action."
- "Downstream actions honoured the practice (used repo scripts; did not skip/await gates)."

Grade each PASS/FAIL with **transcript evidence** (LLM-judge for behavioural reads;
mechanical verification scripts where objectively checkable — those scripts are TDD'd).
Aggregate `benchmark.json` with the **with/without delta** (grounding pass-rate gain vs
token/latency cost). Remove assertions that pass in *both* configs (they measure nothing).

**Acceptance:** `grading.json` per case with evidence; `benchmark.json` with the delta.
The delta is the headline outcome: does the skill earn its context?

---

## WS4 — Synthesise and recommend

From the delta + transcripts + human review, conclude one of: **keep as-is (now
evidenced)**, **iterate the skill** (tighten/trim instructions where transcripts show
waste or ambiguity, then rerun in `iteration-2/`), or **trim/retire** (if the baseline
already grounds well, the delta is the retirement signal). Write findings, and
**recommend whether and how to generalise the skill-eval pattern** to the next skills —
feeding the evals regime and the report's open questions.

**Acceptance:** a findings note with the benchmark delta, a go/iterate/trim verdict for
`start-right-quick`, and a concrete recommendation on generalising the pattern (or not).

---

## Proof Contract

| Acceptance id | Proof level | Proof |
|---|---|---|
| ws1-author-cases | non-code | `evals/evals.json` parses; 3 realistic cases with expected behaviour |
| ws2-baseline-runs | value-proxy | 6 runs (3 cases × with/without) with saved transcripts + `timing.json` |
| ws3-assertions-grade | value-proxy + unit | `grading.json` with transcript evidence; `benchmark.json` delta; verification scripts (if any) unit-tested |
| ws4-synthesise | non-code | findings + delta + verdict + generalisation recommendation |

Completion = a graded `benchmark.json` with a with/without delta **and** a reasoned
verdict for the skill **and** a generalisation recommendation. The delta is independent
ground truth (baseline vs skill), satisfying the value-proxy independence requirement in
`testing-strategy.md` §Acceptance Value-Proxies.

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Mitigation |
|------|------------|
| A grounding skill proves genuinely not-eval-shaped (behaviour too diffuse to grade) | That is itself a finding — it validates the report's "not-eval-shaped" class and tells us grounding skills need a different instrument (retrospective/experience corpus), not a forced eval. The pilot's job is to learn this cheaply. |
| Transcript grading is subjective / flaky | Anchor assertions to objectively observable acts (a file read, an identity registration) with verification scripts where possible; reserve LLM-judge for genuinely behavioural reads; multiple runs to expose flakiness. |
| Subagent runs don't faithfully reproduce a real session open | Use the most realistic session-open prompts available; treat the pilot as directional, not a perfect oracle; note the fidelity limit in findings. |
| `evals/` placement conflicts with Oak's `SKILL-CANONICAL.md` skill variant | Confirm the `evals/` subdir co-exists with `SKILL-CANONICAL.md`; this pilot also informs the spec-conformance (`SKILL.md` vs `SKILL-CANONICAL.md`) question, recorded as a side-finding. |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- [`principles.md` §Agentic Quality](../../../directives/principles.md) — the directive this pilot serves.
- [`testing-strategy.md`](../../../directives/testing-strategy.md) — referenced for the *contrast*: evals are not TDD (see the first-principles check); the value-proxy independence rule applies.
- [`evals-and-assurance-position-2026-06-23.md`](../../../reports/evals-and-assurance-position-2026-06-23.md) — the frame, methodology, and open questions this pilot operationalises.

---

## Dependencies

**Blocking**: none — runnable now (in-repo evals, subagent runs).

**Beneficial**: ratification of the report's open questions (proportionality tiers; the
broader evals regime) would situate this pilot, but it can proceed and *inform* them.
Minimum shippable shape: WS1–WS3 alone (a graded delta for one skill) is already
evidence; WS4's generalisation recommendation is the bonus.

**Related**: [`evals-and-assurance-position-2026-06-23.md`](../../../reports/evals-and-assurance-position-2026-06-23.md); the MCPJam MCP-server validation (sibling thread, session record).

---

## Consolidation

On completion, run `/oak-consolidate-docs`: graduate the findings, the eval pattern (if
it generalises), and the proportionality/eval-shaped learnings into the evals regime and
the position report; rotate the napkin.
