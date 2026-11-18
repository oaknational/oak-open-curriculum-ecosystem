---
name: mcp-content-assessment-methodology-research
overview: >-
  Research programme establishing, from authoritative sources, which evaluation and assessment
  methodologies apply to which seams of the MCP agent-facing content corpus (716 items,
  registry.json), producing an instantiable methodology reference, a ratified per-seam
  recommendation table with a machine-checkable coverage matrix, protocol templates, and a pinned
  evidence register — the sanctioned filler of validation-strategy.md's deferred operational method.
lineage:
  serves_thread: mcp-agent-facing-content
  serves_stream: effectiveness-and-impact
  strategic_choice: >-
    Owner 2026-07-09: high-impact agent-facing content requires review + eval protocols following
    strict researched best practice; both a foundational authoritative-source pass AND
    build-session grounding; research-only (no pilot); education-expert hours arrangeable.
  derives_from:
    - .agent/reports/mcp-agent-facing-content-audit/report.md (§7 owner decisions, §9 gaps)
    - .agent/directives/validation-strategy.md (test/evaluate/assure; assurance tiers; ratified runners)
    - .agent/reports/evals-and-assurance-position-2026-06-23.md
    - .agent/plans/agentic-engineering-enhancements/current/skill-evals-pilot-start-right-quick.plan.md (sibling thread)
todos:
  - id: readiness-review
    content: 'Readiness gate: dispatch the three PENDING readiness reviewers (assumptions-expert, mcp-expert, test-expert) on the plan body, absorb verdicts, mark DECISION-COMPLETE'
    status: pending
  - id: ws0-evidence-standards
    content: 'WS0: evidence-grading scheme, settled-discipline fast-path, source-log discipline, two pre-probes (contamination quiz; MCPJam expressiveness)'
    status: pending
    depends_on: [readiness-review]
  - id: wsv-vertical-slice
    content: 'WS-V: one full vertical (sweep→ratify→template→ground) through M5 retrieval (settled), pedagogy M1/M2 (values), M4 tool-selection (frontier)'
    status: pending
    depends_on: [ws0-evidence-standards]
  - id: ws1-horizontal-sweep
    content: 'WS1: timeboxed methodology sweep M1–M12 + frameworks screening (incl. DSPy), per-family fast-path where settled'
    status: pending
    depends_on: [wsv-vertical-slice]
  - id: ws3-protocol-templates
    content: 'WS3: review-protocol + eval-protocol template shapes (from validation-strategy + skill-evals pilot + PDR-018) — parallel with WS1'
    status: pending
    depends_on: [ws0-evidence-standards]
  - id: ws2-seam-ratification
    content: 'WS2: per-seam recommendation table + machine-checkable coverage matrix + review_domain sample-validation; OWNER RATIFICATION GATE'
    status: pending
    depends_on: [ws1-horizontal-sweep, ws3-protocol-templates]
  - id: ws4-corpus-grounding
    content: 'WS4: ground every recommendation against named registry items (cheap disposable probes allowed; pedagogy grounding via expert workshops)'
    status: pending
    depends_on: [ws2-seam-ratification]
  - id: ws5-completion-and-consolidation
    content: 'Completion: verify A1–A6 acceptance proofs, run the completion review, run/reference the consolidation workflow (lifecycle triggers), archive per ADR-117'
    status: pending
    depends_on: [ws4-corpus-grounding]
---

# MCP Content Assessment-Methodology Research

**Status**: 🟡 PLANNING (current/ — queued; owner directed copy-only landing 2026-07-09;
DECISION-COMPLETE only after the PENDING readiness reviewers run. **Execution is owner-gated —
do not start unprompted.**)

## Context

### Problem statement

Owner decisions (2026-07-09, `.agent/reports/mcp-agent-facing-content-audit/report.md` §7): the
697 high-impact items of the MCP agent-facing content corpus must carry **review protocols and
eval protocols**, and those protocols **must follow strict, researched best practice from
authoritative sources**. "We have evals" is not "our evals are valid": unresearched eval design
fails in known ways (judge bias, weak ground truth, no statistical power, contamination,
measuring the author's assumptions). Nothing in the repo yet says *which* assessment methodology
fits *which* seam of the corpus. The lifecycle ordering stands: review-protocol (ratify shape) →
eval-protocol (measure behaviour) → drift-guard last; this research must not produce a
shape-freezing validator.

### Verified current state (first-hand, 2026-07-09)

**Exists — build on, never reinvent:**

- **The mature exemplar**: the search ground-truth apparatus (`apps/oak-search-cli/src/lib/search-quality/`
  — MRR/NDCG/P@k/R@k engine, graded corpora across lessons/units/threads/sequences, benchmark +
  experiment harness, baselines) and its two skills: `ground-truth-design` (**known-answer-first**)
  and `ground-truth-evaluation` (**COMMIT protocol** — commit judgement before observing output;
  "the spec may be the error"). Encodes repo-native doctrine: commit-before-observe independence,
  graded rubrics, baseline-relative deltas, stratified corpora, oracle humility. **Never abstracted
  beyond search.**
- **Ratified frame**: `validation-strategy.md` (test/evaluate/assure; tiers keyed on harm asymmetry —
  Critical = EEF evidence + pedagogy advice → tests + evals **incl. faithfulness assertion** + human
  review; eval definitions version-controlled in-repo; **MCPJam = ratified runner for the MCP surface,
  "execution, never the source of truth"**; assertions authored AFTER first run) and `principles.md`
  §Agentic Quality (assurance proportionate to harm; non-eval-shaped capabilities take a different
  instrument; **no assurance complete until closed against a real-world value signal**). The strategy
  doc's operational method is a deliberate stub awaiting exactly this research.
- **Reasoning of record**: `evals-and-assurance-position-2026-06-23.md`. **Readiness frame**:
  `curriculum-mcp-path-to-ga/launch-readiness-framework.md` (K1: "live" = evidence state;
  correctness/grounding = "the QoE metric that matters most"). **Tier-3 endpoint**: the
  `mcp-product-analytics` thread (paused, owner-gated) + observability plans.

**Verified gaps this research fills** (estate sweep 2026-07-09): no general non-search eval
methodology; no skill carries evals (0 of 28 skill dirs, recounted 2026-07-13 via
`find .agent/skills -maxdepth 2 -name SKILL-CANONICAL.md | wc -l` — re-derive at execution);
MCPJam available (`@mcpjam/cli` devDependency) but
suite-less; prompts/sub-agents uncovered;
no LLM-as-judge or faithfulness implementation anywhere; validation-strategy operational method
missing; real-world loop unbuilt; `.agent/evaluations/` an empty stub; no non-deterministic
testing doctrine operational; no CI eval-gating; launch-readiness "positive impact" bar undefined.

### The subject and its seams

`registry.json` (SSOT; 716 items, 143 files): `review_domain` × `impact_tier` (697 high / 19
simple-config) × `extraction_kind` × `source_locus` × `audience`, PLUS surfaces existing only in
aggregate (tool selection across the whole set; orient-first compliance; assembled wholes —
`rendered-wholes.md`; prompt-workflow outcomes). **Caveat the mapping must respect:** `review_domain`
is a rule-derived lens, never human-validated — WS2 sample-validates it before ratification.

## Design principles

1. **Methodology from content nature, never fashion.** Every approach is justified by the seam's
   properties; "LLM-as-judge everything" is the named anti-pattern.
2. **Honest frontier labelling.** Where no settled practice exists, the deliverable says
   *frontier — best available evidence*, never cargo-culted authority.
3. **Extend the estate.** The COMMIT/known-answer-first discipline generalises; validation-strategy's
   frame and ratified runners are honoured; the sibling skill-evals pilot's pattern
   (baseline-relative delta, assertions-after-first-run) transfers.
4. **Values before measurement.** Rubric elicitation with Oak's education experts (hours confirmed
   arrangeable, owner 2026-07-09) precedes any scaled grading; no optimiser or judge sits upstream
   of expert-ratified rubrics.
5. **Instantiability.** Research output a build engineer can act on without further research — or
   it has failed (see acceptance criteria).
6. **Synthetic data only.** No real teacher data in eval sets; synthetic-generation methodology is
   in scope (homed in M4, consumed by M6).

### Non-goals (YAGNI)

- No eval infrastructure, harness, CI wiring, or protocol *instantiation* — build-session work.
- **No pilot** (owner 2026-07-09): strictly research.
- No drift-guard/validator (lifecycle ordering; report §1).
- No re-derivation of settled textbook disciplines (WS0 fast-path: cite the standard reference +
  Oak-specific application note).
- No production-telemetry implementation (methodology summarised at placeholder depth only — one
  page + pointers; implementation is gated on the `mcp-product-analytics` lane promotion).
- No re-audit of the corpus (registry.json is the SSOT input).

## Build-vs-buy

MCPJam is the **ratified runner** for MCP-surface evals (validation-strategy) — not re-decided
here. The WS1 frameworks screening assesses **complements** (methodology-informing primitives),
never replacements: **DSPy** (owner-suggested one-of-many, 2026-07-09; screening verdict class:
metric/judge primitives, maturity, and the structural note that optimiser-driven content
presupposes a trusted metric — i.e. DSPy is downstream of this entire programme), UK AISI
`inspect_ai`, OpenAI Evals, HELM/lm-eval-harness, promptfoo, tracing/eval platforms. Screening
depth: one decisive paragraph each, selection criteria from WS0.

## The mapping: methodology families × corpus seams

Deliverable form — each family below becomes a methodology-reference chapter; the per-seam
recommendation table (WS2) assigns approaches to seams with the coverage matrix as proof.

| # | Family | Research targets (source classes) | Applies to |
|---|---|---|---|
| M1 | **Structured expert review** — rubric-based review, inter-rater reliability (κ/α), calibration, double-marking, sampling | psychometrics + education assessment standards; EEF evaluation guidance | education slice (pedagogy 99 + curriculum-accuracy 27 + pedagogy-external 8 = 134); Critical-tier human-review floor |
| M2 | **Rubric elicitation / co-design** — expert values → reliable criteria; anchor examples; scale design | educational assessment + HCI co-design | prerequisite for M1/M3/M12 wherever "good" is a values question; **runs as real workshops (expert hours confirmed)** |
| M3 | **LLM-as-judge** — bias taxonomy, calibration against human labels, pairwise vs absolute, juries; when NOT to use | judge-bias literature (MT-Bench line); major-lab eval guides | scaled regression over M1/M2-ratified rubrics only: prompt outputs, templates, tone. NEVER the values-defining pass |
| M4 | **Behavioural/agentic evals** — golden sets, tool-selection confusion matrices, trajectory vs outcome scoring, ablations, cross-model variance (≥2 models), **synthetic eval-data generation** (persona realism, coverage, self-generated-data bias) | agentic benchmark literature; major-lab agentic-eval guidance | tool-usability (304) incl. server-instructions; recovery-copy behavioural half (retry-vs-fabricate); aggregate surfaces. **Flagship exemplar: the orient-first directive** — 12+ restatements, `OAK_CONTEXT_HINT` on every response; ablation (M4) × token-cost (M8) answers the corpus's cheapest highest-value question |
| M5 | **Retrieval quality** — generalise the existing ground-truth/COMMIT apparatus; contamination-aware ground truths | in-repo doctrine + IR literature | search/user-search/suggest; pattern-donor to M4 |
| M6 | **Adversarial & safety** — injection-resistance protocols, PII-leakage tests, red-team set design (consumes M4 synthetic-data methodology) | OWASP LLM Top 10; lab red-team methodology; NIST AI RMF | interpolation surfaces (166 flagged; `classNotes`); auth/OAuth copy; **C709 `useStubTools` unguarded env flag** (security-config) |
| M7 | **Statistical rigour** — power/sample size, multiple comparisons, contamination detection, eval-set governance (versioning, leakage, refresh) | statistics + ML-eval-methodology | cross-cutting gate on all quantitative claims |
| M8 | **Deterministic/static assessment** — contract checks (names/enums resolve), token/context budgets, readability, **derived-copy drift-checking** (oak-skills adaptations C198/C201 vs their source skills — distinct from the oak-api case), C320 default-metadata | software-testing doctrine; plain-language standards | engineering-structural (90); cross-cutting cheap reports. **Owner-ruling reconciliation:** simple-config (19) carries NO protocol obligation; static checks may still run over them as reports, never gates |
| M9 | **UX & accessibility assessment** — WCAG-EM, plain-language testing | W3C WCAG-EM; readability research | **rendered human surfaces only** (~16–24 items: landing, widget, auth/consent screens) — NOT all `audience: both` (de-scoped from 361 per design review) |
| M10 | **Compliance/attribution audit** — licence-attribution correctness, citation accuracy | OGL/EEF licence terms; legal-review practice (**needs legal input — named resource**) | legal-licensing (19) |
| M11 | **Production/online measurement** — placeholder depth ONLY: one page + pointers (guardrail metrics, interleaving, privacy-preserving telemetry) | online-experimentation literature | tier-3; the real-world-loop closure (doctrine-required) is documented as methodology, with implementation gated on the `mcp-product-analytics` lane promotion (the named owner gate) |
| M12 | **Faithfulness/groundedness evaluation** — claim decomposition, attribution-to-source verification, hallucination/groundedness metrics (RAGAS/attribution-eval class), faithfulness-assertion design | groundedness-eval literature; lab faithfulness guides | **Critical-tier floor**: EEF evidence surfacing + pedagogy advice; the EEF editorial-superlatives finding (report §8.2); the `eef://interpretation` scaffold. Was the doctrine-mandated family the draft missed — caught by tier-floor checking |

**Cross-repo applicability note (two distinct cases):** oak-api-authored items (116, all
high-impact — registry SSOT) → assemble-and-test the *delivered* output here, findings routed
upstream; oak-skills-derived prompts (2) → M8 derived-copy drift-checking against the source skill.

## Workstreams

- **WS0 — Evidence standards (½ day, hard timebox).** The authority-grading scheme (anchors:
  GRADE, EEF padlocks — the recursion is deliberate), **source-independence definition**
  (independent research groups/evidence chains — two blogs citing one paper = one source),
  citation pinning (access dates, versions, archived copies), frontier-honesty rule (lab docs may
  legitimately outrank stale peer review on agentic topics), the **settled-discipline fast-path**,
  per-family timeboxes. Plus two pre-probes whose results steer everything:
  **(P1) contamination quiz** (~30 min: quiz ≥2 models on ~10 curriculum items with tools disabled;
  high accuracy ⇒ contamination-aware design mandatory in every M4/M5 golden set),
  **(P2) MCPJam suite expressiveness** (~½ day, via the repo's MCPJam tooling — `@mcpjam/cli` is a
  root devDependency, invoked as `pnpm exec mcpjam`; any `.mcp.json` MCP-server wiring for it is
  machine-local and gitignored, set up per checkout, never assumed present — plus the current
  MCPJam suite docs; a platform-level `mcp-inspector` skill may assist where the executing agent
  has one, but is NOT in-repo and must not be assumed. Question: can the ratified runner express trajectory scoring,
  ablations, cross-model variance, M7 statistics? Gaps named early, not discovered at build).
- **WS-V — Vertical slice (before any horizontal breadth).** Take THREE seams through the full
  pipeline (sweep → ratify → template → ground): **M5/retrieval** (settled; apparatus exists),
  **pedagogy M1/M2** (values-hardest; books the first expert workshop), **M4/tool-selection**
  (frontier). Proves the pipeline, the done-definition, and per-seam cost before the wide sweep;
  if one vertical exceeds a session, the programme shape is wrong — fix shape, not effort.
- **WS1 — Horizontal methodology sweep** (timeboxed per family; fast-path for settled families;
  web-research fan-out per family + hands-on frameworks screening incl. DSPy). Mandatory named
  questions: generalise the COMMIT/known-answer-first pattern; faithfulness-assertion methodology
  (M12); real-world-loop closure methodology (placeholder depth).
- **WS3 — Protocol templates** (parallel with WS1; depends only on WS0): the review-protocol and
  eval-protocol TEMPLATE shapes, derived from validation-strategy + the skill-evals pilot pattern +
  PDR-018 discipline. Instantiation is build-session work.
- **WS2 — Seam ratification (OWNER GATE).** The per-seam recommendation table; the
  **machine-checkable coverage matrix** (every one of 716 items → ≥1 review methodology; every 697
  high-impact → ≥1 eval methodology; or an explicit named exemption); the `review_domain`
  sample-validation (min(~20, domain size) items/domain — four domains hold fewer than 20 items
  (`other` 2, `pedagogy-external` 8, `ux-accessibility` 16, `legal-licensing` 19), so those are
  validated whole; >10% reassignment ⇒ re-cut seams by behaviour before
  ratifying). **The owner ratifies the table** — it is a values/priorities call, not a researcher
  self-sign-off.
- **WS4 — Corpus grounding.** Every ratified recommendation dry-run against NAMED registry items.
  **Cheap disposable empirical probes are permitted** (one-off scripted model calls; no persistent
  harness) — "paper-only" cannot answer contamination or scoring-feasibility questions. Pedagogy
  grounding uses the arranged expert workshops (real rubric, real calibration round on a sample of
  the 134); where a workshop hasn't happened yet, the entry is labelled **form-fit-validated only**.

## Acceptance criteria (per-seam done-definition)

Each seam entry in the recommendation table MUST carry:

1. Recommended approach + **unit of analysis** (item / assembled whole / end-to-end behaviour);
2. ≥2 **independent** (WS0-defined) authoritative sources, graded and pinned;
3. Known failure modes + what the approach must NOT be used for;
4. **Instantiability**: a worked micro-example against a named registry item (C-id) — a build
   engineer can draft the protocol without further research;
5. **Resource estimate**: expert-hours, sample size (M7-derived), model-run budget, wall-time;
6. **Runner expressibility**: statement of whether the recommendation is expressible in its
   ratified execution home (MCPJam suite JSON / in-repo evals.json), naming any gap;
7. **Executable falsifier**: testable in the build session at stated cost — no production-only
   rhetoric;
8. **Assurance-tier alignment**: names its tier (Critical/Standard/Light) and shows the
   recommendation meets the tier floor (this criterion is what catches missing families
   mechanically);
9. Frontier-vs-settled verdict.

## Proof contract

| id | Acceptance | Level | Proof |
|---|---|---|---|
| A1 | Coverage matrix complete | non-code | coverage checker is a WS2 deliverable (it does NOT exist yet); WS2 lands it at `.agent/reports/mcp-agent-facing-content-audit/generators/check-coverage.mjs`, after which `node .agent/reports/mcp-agent-facing-content-audit/generators/check-coverage.mjs` exits 0 with 716/716 review-mapped, 697/697 eval-mapped or exempted, zero unmapped — independently recomputable from registry.json |
| A2 | Per-seam entries meet all 9 criteria | non-code | checklist audit of the recommendation table; spot-verified by readiness reviewers |
| A3 | Pre-probes run and absorbed | value-proxy | P1 contamination result + P2 MCPJam expressiveness note present and cited by affected entries |
| A4 | Expert workshop evidence | non-code | ≥1 elicitation workshop + calibration round recorded for the pedagogy seam; rubric + IRR figure attached |
| A5 | Owner ratification of WS2 | non-code | dated owner verdict on the seam table (carded, not prose) |
| A6 | Doctrine graduation path | non-code | consolidation note: which findings graduate into validation-strategy.md's operational method |

## Risks (with probes)

1. **Expert availability** — RESOLVED (owner 2026-07-09: arrangeable). Residual: scheduling slip →
   WS-V books the first workshop early; entries label validation state honestly.
2. **Contamination invalidates golden sets** → P1 pre-probe before any sweep.
3. **MCPJam can't express recommended shapes** → P2 pre-probe; gaps become named build-session
   inputs, not late doctrine conflicts.
4. **`review_domain` is a weak seam axis** → WS2 sample-validation with the >10% re-cut trigger.
5. **Sweep sprawl** → WS0 fast-path + per-family timeboxes + WS-V shape-test first.
6. **Frontier laundering** (dressing preprints as settled) → WS0 grading permits honest
   lab-doc-first ranking; entries carry the frontier verdict.

**Named resources:** education-expert hours (confirmed arrangeable — schedule via owner);
model-API budget for probes/screening (≥2 models); MCPJam runtime (in repo); legal input for M10.

## Foundation alignment & first-principles check

- **Shape**: research deliverables prove *Oak-applicable methodology*, not "the literature exists".
  The eval-TDD inversion is doctrine here: eval assertions are authored after first runs
  (validation-strategy); only mechanical verification scripts (e.g. the A1 coverage script) are
  test-first. — fires, handled.
- **Landing-path**: new plan area `effectiveness-and-impact/` created at landing; no tooling
  contract rides on file naming beyond `*.plan.md` conventions. — fires, handled.
- **Vendor-literal**: the one call shape this plan pins was verified at plan-author time —
  `@mcpjam/cli` 3.12.0 (root devDependency) resolves via `pnpm exec mcpjam` (`--version` → 3.12.0,
  verified 2026-07-13). Deeper MCPJam/DSPy/inspect_ai capability claims (suite schema, trajectory
  scoring, statistics) are deliberately not asserted here; P2 verifies them against current
  upstream docs at research time; no capability asserted from memory. — fires, handled.
- **Optionality-surface (PDR-058)**: every deferral names its gate — M11 implementation gates on
  the `mcp-product-analytics` lane promotion; research execution gates on owner-go; the
  content-workspace build gates on owner scheduling. — fires, handled.
- **Rules-tier screen**: no-validator (visibility-before-validation), synthetic-data-only (no-PII),
  eef-corpus-grounding (M12 sources EEF's own standards), present-verdicts-not-menus (WS2 owner
  gate is a carded verdict). — screened.
- **testing-strategy alignment**: the A1 coverage checker is this plan's only code artefact; it
  lands as one TDD cycle (test + script, one commit) per `tdd-as-design.md`. Everything else is
  research prose — the eval-TDD inversion above governs eval assertions. — fires, handled.
- **schema-first-execution alignment**: justified N/A — no MCP tool registration, SDK codegen, or
  runtime validation surface is touched; `registry.json` is consumed as a read-only snapshot.
- **Quality gates**: landed artefacts (plan, reference docs, checker) pass the repo's standard
  gates per `.agent/plans/templates/components/quality-gates.md` — markdownlint, prettier,
  repo-validators, and `pnpm check` as the aggregate before any completion claim.

## Adversarial review

- **Plan-design stress review (Plan agent)** — absorbed 2026-07-09: added M12; homed synthetic
  data; de-scoped M9; disposed `other` items; split the two cross-repo cases; vertical-slice-first;
  WS3 parallelised; owner gate on WS2; WS4 probes; 6 acceptance-criteria additions; settled
  fast-path; M11 placeholder depth; DSPy guardrail; named resources; 116-vs-113 reconciliation.
- **PENDING (before DECISION-COMPLETE):** assumptions-expert (readiness/proportionality; also
  fires on the new plan-area proposal), mcp-expert (MCPJam/runner claims), test-expert
  (evaluate-layer vs test-layer boundary). Dispatch deferred at landing on owner direction
  (copy-only, 2026-07-09) — the first move of the execution session.

## Lifecycle triggers & consolidation

Per [`lifecycle-triggers.md`](../../../plans/templates/components/lifecycle-triggers.md), how execution
sessions pass each required touch point:

- **Session entry**: every execution session opens with `start-right-quick` (or
  `start-right-thorough` for the heavier sittings), reading active claims, recent comms, and the
  [`mcp-agent-facing-content` thread record](../../../memory/operational/threads/paused/mcp-agent-facing-content.next-session.md).
- **Work-shape declaration**: this plan IS the work-shape artefact (executable plan in `current/`).
- **Pre-edit coordination**: the executing seat consults the active-claims registry, registers an
  active claim over the touched areas before any edit, and leaves an observable artefact proving
  the registry was consulted (`register-active-areas-at-session-open`).
- **During work**: direction changes, overlaps, and gate states append to the shared comms log;
  the WS2 owner gate is carded, never prose.
- **Session handoff**: each session closes its claims, updates the thread record, and runs
  `session-handoff` with its consolidation gate.
- **Deep consolidation**: `consolidate-docs` runs at the programme-completion trigger below
  (auditing stale claims, closure history, and decision threads); interim napkin captures ride
  each session per the standing napkin skill.

Sequencing triggers:

- WS2 owner ratification → unblocks WS4.
- Programme completion → dedicated consolidation: graduate the operational method into
  `validation-strategy.md`; register the build-session plan as the successor; ADR candidate for
  the assessment architecture if the build session confirms it.
- The build session (separate, owner-scheduled) instantiates protocols; its open design questions
  are carded then.

## Dependencies

- **Blocking:** owner go (execution is owner-gated), which carries the two WS0-probe resources
  with it — model-API access for ≥2 models (P1 cannot run without it) and MCPJam suite access
  where the suite/case schema is gated (P2). Neither is expected to exist before the go.
- **Beneficial:** education-expert scheduling (first workshop date — minimum shape without it:
  WS-V books the workshop and proceeds on the two non-pedagogy seams).
- **Satisfied:** PR #337 merged 2026-07-09 (the registry is on main; research cites main paths);
  this plan itself landed via PR #338, merged 2026-07-13.
