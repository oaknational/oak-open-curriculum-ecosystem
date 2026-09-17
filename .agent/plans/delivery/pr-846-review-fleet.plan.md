---
id: pr-846-review-fleet
node_type: delivery
name: "PR #846 review fleet — multi-lens, multi-scale review of the identity-switchboard rebuild"
overview: >-
  An independently verified, adjudicated review verdict on PR #846 and its
  landed doctrine (DDR-009, the reference-first rule, the playbook additions),
  sufficient to decide open-for-review readiness — produced by a goal-blind
  reviewer fleet with category-routed adversarial verification and a
  two-verdict synthesis.
status: ratified
ratified_by: "Jim Cresswell (owner)"
ratified_date: "2026-08-12"
ratified_where: >-
  Owner card answer "Sanction W1 now" at the S2b gateway boundary
  (session d0274e, 2026-08-12 evening); recorded in
  .agent/memory/operational/threads/design-system-integration.next-session.md
  §W1 SANCTIONED.
serves: design-system-as-configured-framework
impact_areas:
  - design-system
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-08-13
---

# PR #846 review fleet — multi-lens, multi-scale review

**Gate discharged 2026-08-12.** The owner sanctioned W1 at the decision card
("Sanction W1 now", ~19:47Z, recorded in the ratification stamp); the
`owner_gates` entry is removed per the plan-schema's discharge-by-removal
shape — the frontmatter carries no cleared state, and consumers must not
read execution as owner-blocked (fold #872 review, 2026-08-13).

> **Revision 2 (2026-08-12, at sanction).** Owner sanctioned W1 by card
> ("Sanction W1 now", session d0274e). Since revision 1 the PR absorbed
> main at owner instruction (`f2eceea9a`) and landed the S2a/S2b
> calibration slices, so the reviewed object gains a part: **P7
> fidelity instrumentation** — `visual-stats` / `visual-calibration` /
> `visual-correlation` / `inverse-normal-cdf` in
> `@oaknational/fidelity-review`, the capture-pair/capture-null/
> capture-shared tooling, and DDR-010's dated amendments. Assigned:
> L1 (S1–S2 code), L5 (test discipline incl. the mutation-check
> claims), L6 (types), L9 (DDR-010 amendment pair-audit); L8 gains the
> capture tooling's failure modes. T3 re-pins BASE/HEAD to the tip at
> sanction (`5243224f9`). Fleet design — legs, phases, schemas, caps,
> the serial instrument lane — is unchanged.
>
> **Revision 1 (2026-08-10, same day).** The five-leg plan-review fleet
> (assumptions-expert, architecture-expert-wilma, test-expert, code-expert,
> frame-challenger; run journal `wf_bd46940f-c97`) returned 5/5 *revise*
> with 44 findings. Every severity-3+ finding is cured in this revision;
> the material changes: the diff range pins to `origin/main` SHAs (the
> stale-local-`main` hazard all five legs caught), Phase-2 verification is
> category-routed with a three-valued empirical verdict and a severity
> floor, Phase 2 gains instrument allocation and integrity checks, the
> export reference rides the repo's two-root overlay server (a single-root
> serve renders the export unstyled — export-server.ts's own docblock), W2
> renders two named verdicts, the knowns instrument is re-labelled to what
> it measures, L10 (prose) is dropped under the plan's own leg-warrant
> test, and the cost estimate now derives from a measured baseline.

## Goal

A trustworthy answer to one question, in two named parts: **is PR #846
ready to open for review, and is the doctrine that landed around it
sound?** Today the only assessor of the rebuilt estate (specimen, picker,
side-by-side, their proof surface, the fidelity register, DDR-009, the
reference-first rule, the playbook additions) is its author. What is true
after this plan lands that is not true now: every part of that estate has
been examined by independent eyes at every scale that matters, every
finding carries a verified failure scenario, a recorded refutation, or a
named judgement-class adjudication, the known open items have each been
engaged or their misses named, and the owner holds a two-verdict synthesis
to rule on. Un-drafting is a cheap, reversible transition into the
standing open-review pipeline — the gate is weighted accordingly, and
"fix-in-the-open" (cure as review commits on the opened PR) is a
first-class disposition.

## First-principles check

- **Could it be simpler?** Yes — a solo re-read, or one code-expert pass.
  Both rejected on the merits: the risk being bought down is precisely
  single-perspective author blindness, which no amount of the same
  perspective cures. The fleet is the smallest instrument that buys
  *independence* across the scales the work spans. Anything larger
  (loop-until-dry finder rounds, mutation seeding) buys thoroughness this
  decision does not need.
- **Ends before means.** The review serves the open-for-review decision
  and the soundness of doctrine other lanes now consume. Every leg exists
  because its absence would leave a defect class invisible to the
  decision (L10 was cut by exactly this test).
- **Goal-blind first, goals injected at adjudication.** Legs L1–L8 and
  L11 judge divergences blind to the owner's rulings; L9 is *partially*
  exposed (its object includes the PR body, which carries the owner's
  framing) and is named as such; L12 is goal-AWARE by design. The
  frame-challenger's question — does the work serve the ruling — cannot
  be asked blind.
- **Verified or refuted, never merely asserted — and the verifier is
  itself calibrated.** Refutation is category-routed (empirical claims
  get empirical refutation; judgement claims get evidence-quality
  refutation plus named seat adjudication), the empirical verdict is
  three-valued so "could not reproduce here" is never laundered into
  "refuted", and the seat re-reads every severity≥3 refutation with power
  to overturn — the overturn count is the Phase-2 calibration signal in
  the report.
- **Vendor call shapes verified at author time.** The Workflow tool's
  `agentType`/`schema`/`effort` options and its support for
  barrier-then-dynamic-fan-out inside one invocation are confirmed
  against the live tool schema this session (the tool's own canonical
  review example is exactly `parallel` finders → deterministic dedup →
  findings-driven verify legs). Every `agentType` below exists verbatim
  in the session's agent registry. T3 re-verifies the session model
  before dispatch (the estate has a recorded silent-downgrade incident,
  F-159).

## Object and manifest (multi-part × multi-scale)

**The reviewed object is pinned by SHA, not by ref name.** At T3 the seat
fetches origin, records `BASE` (the merge-base of the PR branch with
`origin/main`) and `HEAD` (the PR tip), and asserts the resolved
`BASE...HEAD` file count equals the PR's `changedFiles` from the GitHub
API — failing loudly otherwise. (The v1 plan named `main...branch`; in the
execution worktree local `main` is hundreds of commits stale, and that
range resolves to ~906 files against the PR's ~41 — caught by all five
plan-review legs.) Every leg receives the explicit SHA range.

Parts:

| Part | Contents |
| --- | --- |
| P1 product code | specimen regions + CSS, picker (3 controls), side-by-side, shared components/hooks (`useScaledViewport`, `canonical-widths`, brand-identity binding, `LabelledSelect`, `Switchboard` export), brand sheets (studio-source + public copies) |
| P2 proof surface | unit + Playwright suites across the spec files + `apply-state.ts` helpers + `measurement-widths` unit tests (exact cell counts recorded at T3 from a fresh run, not asserted here) |
| P3 design-system conformance | tokens-only discipline, kit class vocabulary, brand recomposition as data, `validate-authored-css` / `validate-kit-assets` coverage |
| P4 fidelity claims | `fidelity-register.json` (6 dispositions) vs the export reference, the fidelity instrument's residual ratios |
| P5 accessibility claims | the identity×theme matrix (3 identities × 4 palette themes = 12 axe cells, + 3 forced-colors cells incl. the axe#3978 contrast disable, + 3 reflow cells = 18), focus/skip-link/sticky cures, picker control semantics |
| P6 doctrine | DDR-009 + README graph, `render-the-reference-before-reproducing` rule + projections, playbook §two governing rules + §Reference first, PR #846 body |

Scales: **S1 micro** (line/declaration/type), **S2 meso** (component/page
composition), **S3 macro** (system shape, boundaries, extractions), **S4
meta** (goal-alignment and frame), **S5 viewport** (the DDR-009 canonical
widths).

Every P×relevant-S cell is assigned to at least one leg below; exclusions
are in **Out of scope** with reasons. That completeness claim is checked
twice: by the plan-review fleet (done — revision 1) and by W2's
completeness critic after the run.

## Mechanism

Two Workflow invocations with the seat adjudicating between them — the
fleet is deterministic orchestration; judgement stays at the seat.

### W1 — goal-blind review + category-routed verification

**Phase 1 (11 legs; parallel except the instrument chain).** Each leg
receives: the worktree path, the pinned `BASE...HEAD` SHA range, its
assigned parts/scales/questions, the shared severity rubric, the access
packet (below), and — for divergence-judging legs — the instruction to
form its own view of each observed export divergence BEFORE reading any
in-repo rationale for it. No leg receives the owner's rulings (exceptions
scoped above), this plan file (legs are instructed not to read
`.agent/plans/delivery/pr-846-review-fleet.plan.md`; at adjudication the
seat greps the leg journals for that path and marks any reader as
contaminated for knowns-scoring purposes), or the knowns list.

| Leg | agentType | Effort | Parts / scales | Charge (summary) |
| --- | --- | --- | --- | --- |
| L1 | `code-expert` | high | P1 S1-S2 | Gateway correctness/maintainability sweep of the diff; name specialist signals |
| L2 | `react-component-expert` | high | P1 S1-S2 | Hooks/effects correctness: frame readiness races, `useScaledViewport`, theme binding, binder re-runs |
| L3 | `design-system-expert` | xhigh | P1+P3 S1,S3 | Token discipline, kit vocabulary fit, brand recomposition, light-dark arm pairing in both counter-brand sheets |
| L4 | `accessibility-expert` | xhigh | P5 S2,S5 | WCAG 2.2 AA: matrix coverage and validity, the forced-colors contrast disable's warrant, reflow probe soundness, focus management, control semantics; probes at canonical widths |
| L5 | `test-expert` | xhigh | P2 all | Describe-vs-audit, atomic landing, what behaviour is unproven, sentinel-pattern strength, helper honesty |
| L6 | `type-expert` | high | P1 S1 | Boundary narrowing (`?brand`, theme/width guards), zero assertions, closed unions |
| L7 | `architecture-expert-barney` | xhigh | P1 S3 | Simplification: the second-consumer extractions, the `canonical-widths` client mirror vs the tools module, module placement |
| L8 | `architecture-expert-wilma` | xhigh | P1+P2 S3 | Adversarial failure modes: cross-document lifecycles, ResizeObserver, dev-vs-prod divergence, the post-merge state with main, the iframe/origin-interception surface |
| L9 | `docs-adr-expert` | high | P6 | DDR-009 pair audit (decision ↔ module), playbook accuracy vs implemented reality, rule projection consistency, register-as-record quality (partially goal-exposed via the PR body — named) |
| L11 | *(default)* fidelity instrument | high | P4 S5 | Run the fidelity pipeline (pinned invocation: `pnpm tool:fidelity` with `--base` at the production server and each canonical width; flags recorded in the report) against the overlay-served export; judge each pair's residual on its own eyes before reading dispositions |
| L12 | *(default)* frame-challenger | xhigh | S4 | Goal-AWARE: given the owner's verbatim rulings, is this estate the right shape — what would a better shape look like, and is the difference worth anything? |

(L10 prose-expert was cut at revision 1: no defect class the
open-for-review decision needs is visible only to a prose-craft lens, and
its output is judgement-class besides. Doctrine prose polish routes as a
post-merge follow-up.)

Model: every leg inherits the session model (exceeds the estate's Opus
floor for reviewer dispatches; the standing fallback rule permits only
capability-upward substitution; T3 re-verifies at dispatch time).

**Shared severity rubric (in every dispatch prompt):** 4 = would mislead
or break a user or consumer of the demo/doctrine (wrong behaviour, wrong
claim, a11y failure); 3 = real defect with a concrete trigger, effect
bounded; 2 = weakness that costs future change or review effort; 1 =
polish. Severity is an integer.

**Dedup (deterministic script code, the one barrier).** Key =
`file :: floor(line/10) :: category` over required fields. A collision
MERGES (never drops): the merged record retains every member claim and
scenario, and each distinct scenario is verified. Cap ordering tie-break:
severity desc → distinct-leg corroboration desc → file asc. If merged
records exceed **40**, the top 40 proceed to verification and the drop
count is `log()`ed loudly; dropped records still reach adjudication
unverified and are marked so.

**Phase 2 (dynamic; expected ~20–50 legs, ≤80 hard).** Verification is
**category-routed** and floored at **severity ≥ 2** (severity-1 findings
go straight to adjudication marked `unverified-polish`):

- *Empirical categories* (`correctness`, `a11y`, `tokens`, `tests`,
  `types`, `fidelity`): two refuters per record — (a) **empirical**,
  which must reproduce the scenario first-hand and returns a
  **three-valued** verdict `confirmed | refuted | not-reproduced`
  (not-reproduced routes to the seat, it never silently kills); (b)
  **evidence-quality** (default-refuted under uncertainty: is the
  scenario concrete, the evidence first-hand, the claim about the
  artefact rather than taste). A record dies only on `refuted`.
- *Judgement categories* (`architecture`, `docs`, `frame`):
  evidence-quality refutation only, then seat adjudication marked
  `judgement-class` — empirical reproduction is structurally unavailable
  and pretending otherwise would kill the class regardless of merit.

Refuter input packet: the finding record (all merged claims), the
originating leg key, the same access packet as Phase 1, and the location
of Phase-1 recorded artefacts (a refuter MAY verify against those instead
of re-running an instrument). A valid refutation names what was
attempted, what was observed, and why that defeats the claim. The VERDICT
schema carries the finding id and an `incidental_findings` slot — defects
a refuter trips over route to adjudication as unverified items.

**Exit criteria.** Single-pass by construction: 11 + (≤2 × ≤40) + zero
loops.

### Between W1 and W2 — adjudication (the seat, inline)

1. **Integrity gate first**: `git status --porcelain` clean (modulo named
   untracked outputs) and `git rev-parse HEAD` == recorded HEAD, in the
   worktree — asserted here and again at report time; any drift fails the
   run loudly.
2. Classify every surviving record on the two axes (correctness,
   goal-alignment — rulings injected here): **fix-now** (blocks opening) /
   **fix-in-the-open** (cure as review commits on the opened PR) /
   **register** / **route** / **refuse**. Every disposition carries its
   verified failure scenario, its recorded refutation, or its named
   judgement-class basis.
3. **Refutation audit**: the seat re-reads every refutation of a
   severity≥3 record and may overturn to `survives, verification
   contested`; the overturn count is reported as the Phase-2 calibration
   signal. `not-reproduced` verdicts are resolved here (instrument gap vs
   genuine irreproducibility).
4. **Knowns attention-coverage scoring** — this instrument measures
   whether each documented open item RECEIVED ATTENTION from the lens
   charged with it; it does not validate lens independence (the register
   is repo-visible, so agreement cannot be distinguished from echo).
   The bar for "engaged": a stated position plus an evidence pointer;
   a bare mention scores as a miss. Expected coverage, pre-declared:
   K1–K6 (the six register dispositions) → L3/L11; K7 (axe#3978
   disable) → L4; K8 (fidelity stdout global-scope gap, routed to the
   claude-design-pipeline lane) → L11; K9 (five-item DS trunk slice,
   routed) → L3/L4; K10 (light-dark substitution oddity, open at this
   lane) → L3; K11 (`canonical-widths` client mirror) → L7; K12 (the two
   ruled divergences carrying most diff mass) → L11. Misses are named in
   the report.
5. Unverified overflow and `unverified-polish` items are dispositioned
   with their marks preserved.

### W2 — synthesis (2 legs)

- **Completeness critic** (default agent, xhigh): receives the manifest,
  what ran, all findings and verdicts, the adjudication record — asks
  what is missing, AND audits the dispositions (any refuse/register
  without a recorded basis; any verified survivor whose impeached surface
  other legs' clean reports relied on, named as coverage caveats).
- **`release-readiness-expert`** (xhigh): receives the adjudication
  record, the RAW Phase-2 verdicts, and the critic's answer. Renders
  **two named verdicts**: (1) open-for-review readiness of #846, priced
  against the reversibility of un-drafting (only defects that would
  mislead reviewers or misrepresent the work justify NO-GO); (2)
  doctrine soundness, with routed cures independent of the PR. Weighting
  instruction: for verdict 1, P3/P4/P5 evidence (conformance, fidelity,
  accessibility — the owner's governing ruling) is primary; P1/P2 support.

**NO-GO path (stated):** the PR stays draft; fix-now items become the
lane's next slices; after cures land, re-run the release-readiness leg
alone against the updated adjudication record. The owner card carries
both verdicts and this path either way.

The seat then writes the final report to
`.agent/reports/design/pr-846-review-fleet/report.md`: header (BASE+HEAD
SHAs, session model, server mode, fresh suite counts), per-leg
token/runtime tally from the journals, the knowns table, every finding —
including refuted ones, with their refutations — and both verdicts. AC2
and AC3 are proven by a small journal-anchored cross-check script
(finding ledger vs verdict ledger; K-row coverage vs the union of leg
attention) whose output is embedded verbatim — recomputed, not
hand-tabulated. Then the owner card is raised.

### Environment and instrument allocation (decision-complete)

- **Pre-flight sequence (T3)**: stop the dev process on port 3020 →
  `pnpm build` → `pnpm start` (production server on 3020; mode recorded
  in the report header) → start the export reference via the repo's own
  **two-root overlay server** (`demos/oak-design-showcase/tools/export-server.ts`,
  invoked per its module contract on **fixed port 3030**) — a single-root
  static serve of the export renders BOTH pages unstyled and still passes
  a naive liveness check (the tool's docblock records this exact hazard)
  → **styled-sentinel assertion**: fetch `specimen.html` from :3030,
  extract its kit-CSS hrefs, assert each fetches 200 with non-trivial
  length; fail the launch loudly otherwise.
- All legs work in the PR-2 worktree, read-only with respect to tracked
  files (instruction, backed by the integrity gate's mechanical check at
  both phase boundaries).
- `vitest` (`pnpm test`) is free for every leg (no ports). Browser and
  port-owning instruments run in **one serial lane**: in Phase 1 the
  script chains L4 → L11 (honest rationale: headless-browser and CPU
  contention plus one-at-a-time server spawning — not port collision,
  which was v1's incorrect claim); in Phase 2, refuters whose
  reproduction needs Playwright or the fidelity pipeline are chained
  serially in the same manner, everything else parallel. The Workflow
  runtime's own concurrency cap (min(16, cores−2)) bounds simultaneous
  legs; combined with the serial instrument lane this satisfies the
  no-unbounded-host-load rule.
- Mid-run instrument failure: any leg or refuter that finds :3020/:3030
  unresponsive reports **instrument-down** (for a refuter, that is
  `not-reproduced`, never `refuted`).
- No leg commits, pushes, or writes tracked files. Fleet outputs live in
  the workflow journals and the seat-authored report.

### Schemas (verbatim, used by the script)

```json
{
  "FINDINGS": {
    "type": "object",
    "required": ["findings", "findings_omitted", "coverage_notes", "decisions_evaluated"],
    "properties": {
      "findings": {
        "type": "array",
        "maxItems": 12,
        "items": {
          "type": "object",
          "required": ["part", "scale", "file", "line", "category", "claim", "evidence", "severity", "failure_scenario"],
          "properties": {
            "part": { "type": "string" },
            "scale": { "type": "string" },
            "file": { "type": "string", "minLength": 1 },
            "line": { "type": "integer", "minimum": 0 },
            "category": { "type": "string", "enum": ["correctness", "a11y", "tokens", "tests", "types", "architecture", "docs", "fidelity", "frame"] },
            "claim": { "type": "string", "minLength": 20 },
            "evidence": { "type": "string", "minLength": 20 },
            "severity": { "type": "integer", "minimum": 1, "maximum": 4 },
            "failure_scenario": { "type": "string", "minLength": 20 }
          }
        }
      },
      "findings_omitted": { "type": "integer", "minimum": 0 },
      "coverage_notes": { "type": "string" },
      "decisions_evaluated": { "type": "array", "items": { "type": "string" } }
    }
  },
  "VERDICT": {
    "type": "object",
    "required": ["finding_id", "verdict", "reasoning", "evidence"],
    "properties": {
      "finding_id": { "type": "string" },
      "verdict": { "type": "string", "enum": ["confirmed", "refuted", "not-reproduced"] },
      "reasoning": { "type": "string", "minLength": 20 },
      "evidence": { "type": "string", "minLength": 20 },
      "incidental_findings": { "type": "array", "items": { "type": "string" } }
    }
  }
}
```

Field conventions: `line: 0` is the whole-file sentinel. `file` for L11
uses the pair namespace `pair:<name>@<width>`; for L12 the sentinel
`(frame)` — the dedup script treats each as its own namespace. For
judgement categories, `failure_scenario` carries the concrete consequence
if unaddressed. Legs exceeding 12 findings keep the highest-severity 12,
set `findings_omitted`, and summarise the dropped classes in
`coverage_notes`. The evidence-quality refuter uses `confirmed | refuted`
only. `decisions_evaluated` free-lists documented decisions the leg
evaluated — the knowns list is never disclosed to legs.

### Cost, derived

Measured baseline (this plan's own review fleet, journal
`wf_bd46940f-c97`): 5 legs, 384k tokens, ~6.8 min wall — ≈77k
tokens/leg at high/xhigh effort with repo access. Applying the band
60–150k/leg for Phase 1's heavier charges and 30–70k for refuters:

- Phase 1: 11 legs → **0.7–1.6M tokens**
- Phase 2 (severity≥2 floor; expected 10–25 verified records × ≤2
  refuters): ~20–50 legs → **0.6–3.0M tokens**
- W2: 2 legs → **~0.2M tokens**

**Totals: 33–63 agents expected (≤91 ceiling), ≈1.5–4.8M tokens.** This
exceeds the default 15-agent workflow guideline deliberately; the owner
gate above is the pricing decision, taken with these numbers visible.

## Acceptance criteria (each with a proof)

1. **Every manifest cell reviewed or excluded-with-reason** — proof
   `repo-safe`: the report's manifest table shows a leg or a named
   exclusion per cell; W2's completeness critic found no unnamed gap.
2. **Every finding carries a verdict or a marked exception** — proof
   `repo-safe`: the journal-anchored cross-check script (its output
   embedded in the report) shows every finding id resolving to a Phase-2
   verdict, a `judgement-class` adjudication, `unverified-polish`, or a
   marked cap overflow — and every refuted finding is listed with its
   refutation.
3. **Every planted known engaged or its miss named** — proof `repo-safe`:
   the same script recomputes the K1–K12 attention table from the leg
   journals against the pre-declared expected-leg map.
4. **Both verdicts delivered and decidable** — proof `owner-held`: Jim
   reads the report and rules on opening #846 for review and on the
   doctrine verdict; the ruling is recorded on the owner card and in the
   thread record.

## Todos

- T1: ✅ Plan-review fleet ran (5 legs, `wf_bd46940f-c97`, 5/5 revise);
  findings adjudicated into revision 1 (this document).
- T2: Present plan + review verdicts + cost to the owner; ratification
  and the execution gate are the owner's word. Mint the thin visibility
  ticket (MCP team) at sanction.
- T3: Pre-flight: fetch origin; record BASE (merge-base with
  `origin/main`) and HEAD SHAs; assert `BASE...HEAD` file count equals
  the PR's `changedFiles`; verify the session model against the claims
  registry (F-159); run the pre-flight server sequence incl. the
  styled-sentinel assertion; run the full suite fresh and record its
  counts; record all of it in the report header.
- T4: Execute W1; integrity gate; adjudicate (incl. refutation audit and
  knowns scoring); execute W2; run the cross-check script; author the
  report; raise the owner card with both verdicts.
- T5: Disposition fix-now findings into single-story slices;
  fix-in-the-open items land as review commits on the opened PR;
  register/route the rest.

## Out of scope

- **Fixing findings** — separate slices under the small-PR discipline;
  this plan produces the adjudicated list, not the cures.
- **A dedicated security leg** — no auth, credentials, or PII in the
  diff; the iframe/origin-interception surface is explicitly in L8's
  adversarial charge. A security signal from L1/L8 routes to
  `security-expert` as a follow-up, per the gateway rule.
- **A dedicated config leg** — the diff touches no tooling config; the
  workspace-config migration arrived from main and was reviewed in its
  own lane (#836).
- **A dedicated prose leg** — cut at revision 1 by the leg-warrant test;
  doctrine prose polish routes as a post-merge follow-up.
- **Onboarding-path review** — no onboarding-path files in the diff.
- **Executing the routed items the fleet may touch (K8, K9, K10)** —
  each is already homed at its named lane; the fleet may engage them as
  review context but their execution belongs to their homes.
- **Cricket protocol runs** — the Cricket quartet ritual is a
  priority-drift instrument, not a code-review lens; invoking it here
  would owe the full quartet-twice protocol without adding a lens the
  roster lacks.
