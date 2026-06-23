# Evals and Assurance — Position and Near-Term Actions

**Date:** 2026-06-23
**Type:** Report — names decisions, recommendations, and considerations. Ratification into a principle/directive and execution via a plan are separate, later steps.
**Anchor:** the placeholder principle at [`principles.md` §"Agentic Quality"](../directives/principles.md) (line ~440): *every agentic capability — skills, prompts, MCP tools, sub-agents — must include evaluation definitions, internal-facing as well as those served to external users.* This report is the reasoning behind that principle and the proportionate path to honouring it.

## 1. Purpose

To show, defensibly, that we **understand** evals, have **thought about how we apply them**, are clear on **what we are doing now**, and — equally — on **what we are deliberately not doing, and not doing yet, and why.** The goal is not maximal eval coverage; it is a proportionate, honest assurance practice that earns trust without manufacturing it.

## 2. The frame: test / evaluate / assure

Three distinct things. Collapsing them imports the wrong invariants.

- **Test** — *deterministic*. Proves code does what its spec says. Binary, reproducible; unit of truth is the assertion. This is all of [`testing-strategy.md`](../directives/testing-strategy.md): every rule presupposes a deterministic system under test (no IO, no global state, test+product-code as pairs in one landing).
- **Evaluate** — *probabilistic*. Measures the value and reliability of a judgement-laden capability across a distribution of realistic inputs, graded (metrics or LLM-judge), **relative to a baseline**. Unit of truth is a graded outcome over a corpus plus a delta. Non-determinism is intrinsic (multiple runs, spread).
- **Assure** — the umbrella *trust case*: composes test + evaluate + conformance + UAT + observability + security review + human review into ongoing evidence that the thing is fit for the world.

**The continuity that unifies them:** *describe the outcome you want; never audit the implementation choice.* In testing this is "test behaviour, not implementation." In evals it is the difference between a good assertion ("the chart has labelled axes") and a brittle one ("uses exactly the phrase X"). Our own search ground-truth doctrine states it sharply — *"search might be right; the expected slugs might be wrong"* — humility that the **spec**, not the system, may be the error.

**The load-bearing caveat:** test/evaluate/assure is an **internal-confidence triad**. Every layer grades against an expectation *we* authored. None of it observes whether a teacher actually taught better. **An assurance practice that never closes against real-world use is measuring its own assumptions.** The triad must eventually be closed by a real-world signal (usage telemetry, teacher feedback, ecosystem adoption) or it risks being confidently wrong about value. We name this now and defer building it (§8).

## 3. What an eval is (the nature)

Grounded first-hand from [agentskills.io/skill-creation/evaluating-skills](https://agentskills.io/skill-creation/evaluating-skills) and Anthropic's `skill-creator`:

- A **test case** = a realistic `prompt` + a human-readable `expected_output` + optional input `files`.
- Each case is run **with the capability and without it (baseline)** from a clean context — the baseline is what makes the result mean something.
- **Assertions are authored after the first run** — you do not know what "good" looks like until you have seen the probabilistic output. (This *inverts* TDD's test-first: evals are necessarily iterative against the artefact. Forcing test-first onto evals is a category error.)
- **Grading** records PASS/FAIL with concrete evidence — LLM-judge for qualitative checks, verification scripts for mechanical ones.
- Results aggregate to a **benchmark** with a **delta**: pass-rate gain vs token/latency cost — *does this capability earn its context?*
- **Iterate**: feed failed assertions + human feedback + execution transcripts + the capability definition to an LLM, propose changes, rerun.

**Independence discipline (from our own search practice — the most adjacent exemplar).** The ground-truth/COMMIT protocol requires the evaluator to **commit the expected outcome before observing the system** (known-answer-first), precisely so the eval cannot rationalise whatever the system happened to do. This is the evaluate-layer analogue of test-first — at the *judgement* level, not the code level — and it generalises beyond search.

## 4. Impacts of evals — what they buy and cost

**Buy:**

- **A regression feedback loop** for non-deterministic surfaces that testing structurally cannot give.
- **A value-proof** — the with/without delta answers "does this skill/prompt/tool earn its context cost?"
- **A retirement signal.** As base models improve, a capability's delta *shrinks* (the model internalises what the capability taught). A decaying delta is the signal to **sunset** a surface, not just maintain it. Evals manage a *shrinking* surface, not only a growing one.

**Cost / risk:**

- **Real cost** — multiple LLM runs (with/without, multiple iterations), human review, and ongoing maintenance as model behaviour drifts under us.
- **False assurance** — a green eval suite of weak or self-authored assertions gives confidence without value. "Has evals" is *not* "is good."
- **Oracle fallibility** — every eval rests on an authored expectation that can itself be wrong and itself drifts. Who evals the evals? Mitigated, not solved, by the independence discipline (§3) and ultimately by the real-world loop (§2).

## 5. The instrument landscape, mapped to surfaces

| Surface | Instrument | Layer | Status |
|---|---|---|---|
| Semantic search | Ground-truth / COMMIT (MRR, NDCG, P@3, R@10) | evaluate | **Mature** — our exemplar; generalise it, don't reinvent |
| Skills | `evals/evals.json` convention (agentskills standard) | evaluate | **Not used** — 0/24 Oak skills have `evals/`; easy win |
| MCP server (protocol) | MCPJam `protocol conformance` | test/assure (spec) | Available; not yet run |
| MCP server (widget/Apps) | MCPJam `apps conformance` / `apps render` | conformance/assure | Available; **closes the §13 widget gap** from the 2026-06-23 UAT |
| MCP tools (behaviour) | MCPJam `eval` (hosted, cross-LLM, scheduled) | evaluate | Available; account-bound; not yet wired |
| Prompts (as an agent uses them), sub-agents | — | — | **Uncovered** |
| Diffuse Practice (doctrine, planning, collaboration) | — | — | **Not eval-shaped** — needs a different instrument (retrospective, experience corpus) |

**MCPJam, grounded first-hand from the CLI** (`@mcpjam/cli` v3.10.0, bin `mcpjam`): three instruments —
`protocol conformance` (MCP spec conformance against an HTTP server), `apps conformance`/`render`/`session` (MCP Apps metadata + headless widget render with screenshot + verdict), and `eval` (`create`/`run`/`status`/`iterations`/`trace`/`screenshot`/`schedule`/`cases` — per-iteration pass/fail, tool calls, tokens, latency, with scheduled regression runs). Evals are **hosted in the MCPJam project** (`mcpjam login` or `MCPJAM_API_KEY` required; `mcpjam tunnel` exposes a local server), but a suite is authored from a **local definition JSON** via `eval create --file`, so the *definition* can be version-controlled in-repo.

**Honest boundary:** MCPJam covers only the **MCP-server surface**. It does not reach skills, prompts-as-an-agent-uses-them, sub-agents, or the diffuse Practice. It is necessary, not sufficient. Treating it as the whole answer would be the "the tool we just wired becomes the hammer" trap.

## 6. What we ARE doing now

- Wired MCPJam as a stdio MCP server in [`.mcp.json`](../../.mcp.json) (fixed a misplaced-brace bug that had it outside `mcpServers`).
- Verified the `@mcpjam/cli` command surface first-hand (this report's §5 is grounded, not assumed).
- Probed `oak-local-dev` through MCPJam: clean, conformant OAuth posture (401 + correct `WWW-Authenticate`, PRM + authorization-server metadata resolve, PKCE S256, DCR + preregistered). Recorded as `info`, no finding.
- Authored this report.
- The authenticated **connected validation sweep** (tools/prompts/resources + apps conformance — closing UAT §11/§13/dual-shape) is **staged**, blocked on the local server being restarted (no-auth variant) and is the immediate next step.

## 7. Near-term, proportionate actions (recommended — sized to stakes, not exhaustive)

Sequenced cheapest-and-highest-leverage first:

- **A. MCPJam conformance pass against `oak-local-dev`** once the server is up: `mcpjam protocol conformance` + `mcpjam apps conformance` / `apps render`. Low cost; adds spec-conformance evidence and **closes the §13 widget gap** the manual UAT could not. No account needed.
- **B. One worked MCPJam eval suite for the curriculum MCP server** (the example — §11). In-repo suite-definition JSON → `mcpjam eval create --file` → `eval run` → `eval iterations`. Requires `mcpjam login` (your action) and the server reachable (tunnel or preview/prod). First execution step is **confirm the suite/case JSON schema** (docs are access-gated; do a `--json` probe or read the schema once logged in) — we do not author unverified vendor shapes.
- **C. Pilot the skill `evals/` convention on 1–2 high-value skills** (the "easy win"). In-repo `evals/evals.json`, with/without baseline. Choose by stakes (a teacher-facing or high-traffic skill), not alphabetically. Note: Oak skills use `SKILL-CANONICAL.md`, not the spec's `SKILL.md` — adopting `evals/` is also a nudge toward spec-conformance, which is a separate small decision.

## 8. What we are NOT doing NOW (deferred, with reasoning)

- **Full eval coverage of every surface** — the principle says "all"; stakes are not uniform. Coverage follows risk-tiering (§9), not a flag day.
- **Evals for sub-agents and the diffuse Practice** — much of it is not eval-shaped (§5); the right instrument is undecided. Deferred, not declined.
- **CI eval-gating** — MCPJam supports scheduled/CI runs, but gating PRs on probabilistic evals before we have stable suites and a flake story would block delivery on noise. After suites prove stable.
- **The in-repo-vs-hosted eval-home decision** — skill evals are in-repo (versioned, reviewed); MCPJam evals are hosted (richer, cross-LLM, scheduled) with a version-controllable local definition. Both likely have roles; the boundary is an open question (§10), not yet decided.
- **Closing the real-world outcome loop** (usage telemetry / teacher signal) — named in §2 as the thing that ultimately grounds the whole triad. Deferred, but explicitly *not forgotten*: without it, everything here measures itself.

## 9. What we are NOT doing (declined, with reasoning)

- **A uniform mandate regardless of stakes** — rejected in favour of **risk-tiered assurance**. Rigour is a values call: high where harm to a teacher is asymmetric and irreversible (EEF evidence, pedagogy advice), light where it is cheap and self-correcting (internal formatting tooling). A uniform mandate would be ignored, drown us in maintenance, or produce box-ticking that gives false assurance.
- **Forcing eval-shape onto non-eval-shaped value** — diffuse, long-horizon, cultural capability (doctrine, planning discipline) does not decompose into `prompt → graded output`. Forcing it into `evals/evals.json` is the mirror category error of treating evals as tests.
- **Treating eval-coverage as the goal** — evals are a means; good capabilities are the goal. We will not optimise the proxy (coverage) over the thing.
- **Building bespoke eval infrastructure** where MCPJam (MCP server), the skill `evals/` convention (skills), and the ground-truth system (search) already serve.

## 10. Open questions for ratification (owner / future plan)

1. **Proportionality tiers** — what are the assurance tiers, and which surfaces sit in each?
2. **In-repo vs hosted eval home** — version-controlled `evals/` vs MCPJam-hosted suites; likely both, with a clear boundary.
3. **The real-world signal** — what is it, and is the assurance practice built *around* that loop rather than bolting it on?
4. **The placeholder principle's wording** — tighten the grammar and encode proportionality and the eval-shaped/not-eval-shaped distinction.
5. **Doctrine home** — `testing-strategy.md:28` already names a forthcoming `validation-strategy.md`. Does it widen to a test/evaluate/assure trichotomy, or is the cut deterministic↔distributional × code↔system↔journey? (Resist crystallising prematurely.)

## 11. Worked example — an MCPJam eval suite for the curriculum MCP

Illustrative cases (teacher-perspective, expected tool call named — the eval grades whether the model, given the prompt and the server's tools, makes the right call and returns useful content):

| # | Prompt (realistic teacher message) | Expected behaviour |
|---|---|---|
| 1 | "Find me a KS3 science lesson on photosynthesis." | `search` called with `scope: lessons, query ~ photosynthesis, subject: science, keyStage: ks3`; top hit is the `photosynthesis` lesson |
| 2 | "What should pupils know before the percentages unit?" | `get-prior-knowledge-graph` anchored on `understanding-percentages`; returns prerequisite units |
| 3 | "What's the EEF evidence on feedback?" | `get-eef-evidence` `inspect-strand` `eef-tl-feedback`; surfaces +6mo / Very Low / Extensive **with caveats and attribution intact** (faithfulness assertion) |

Run path (once logged in and the server is reachable):

```bash
mcpjam login                       # your action — browser OAuth, or MCPJAM_API_KEY
# confirm the suite/case JSON schema FIRST (docs gated; --json probe or post-login schema)
mcpjam eval create --file <suite.json> --server <oak-curriculum-mcp>
mcpjam eval run --suite <name>
mcpjam eval iterations --run <id>  # pass/fail, tool calls, tokens, latency
```

Case 3's faithfulness assertion is the highest-value one — it is exactly the asymmetric-trust, teacher-facing risk that justifies rigour (§9).

## 12. Sources (first-hand this session)

2026-06-23 local UAT report; the MCPJam probe of `oak-local-dev`; `@mcpjam/cli` `--help` surface (top-level, `eval`, `apps`, `protocol`, `eval create`, `eval cases`, `whoami`); agentskills.io overview + evaluating-skills; Anthropic `skill-creator` SKILL.md; the `ground-truth-evaluation` skill + `GROUND-TRUTH-GUIDE.md`; `testing-strategy.md`; `principles.md` §Agentic Quality.
