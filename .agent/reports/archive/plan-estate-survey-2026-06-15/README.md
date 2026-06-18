# Plan-Estate & Strategy Survey — ARCHIVED (dated 2026-06-15 record)

> **ARCHIVED 2026-06-18 — dated record; not a current survey, not current strategy.**
> **Supersession mapping:**
>
> - **Useful information preserved here** — the empirical map (§4 findings, §6 per-collection,
>   §10 evidence index) as a **dated 2026-06-15 snapshot**, and the reusable survey **method**
>   (§1). Body 3 reads these as input; it does **not** rely on the counts as current.
> - **A fresh estate survey is a Body-3 prerequisite** — re-run the method against current state
>   before relying on any count.
> - **Rationale for archival:** the strategy-recommendation sections (§11/§13/§14/§15) encode the
>   superseded "align on impact → gap analysis → execution spine" approach, rejected during the
>   2026-06-18 reconception. The live strategy authority is the controlling plan
>   [`vision-strategy-and-plan-estate.plan.md`](../../../plans/vision-strategy-and-plan-estate.plan.md)
>   (cohesive system-strategy on a four-layer informational model).
>
> **Do not treat the counts or the strategy framing below as current.**

- **Author**: Baobab lifts Topsoil (claude-code / Opus 4.8, session `3be248`).
- **Status**: 🔄 LIVING — updated as each survey wave lands. Not a finalised
  report; the verdicts here are current best-evidence and are revised in place.
- **Purpose**: a durable, dedicated record of a high-volume multi-wave survey of
  the whole `.agent/plans/` estate (plans + strategy indexes + milestones +
  delivery critical path). Captures **method, results, findings, insights, and
  corrections** so nothing is orphaned in session context or ephemeral `/tmp`.
- **How to use**: read §4 (validated findings) and §9 (next moves) first. Treat
  agent-produced numbers as signal; the **first-hand validations in §8 are
  authoritative** where they conflict. Raw evidence is under [`data/`](data/).
- **Scope note**: machine survey of 409–413 live+future plan documents across 15
  collections. Excludes `archive/`. "Live" = `active/` + `current/`.

---

## 1. Method — multi-wave orchestration

The survey runs as **waves** of dynamically-orchestrated sub-agents (Workflow
tool), each wave a different analytical angle, with a fixed reliability contract.

**Reliability contract (every wave):**

- Every plan document read by **≥2 independent agents** (`coverage2x` confirmed).
- **Dual complementary lenses** per doc (each lens emphasises different fields)
  rather than two identical reads — independent perspectives catch more.
- Bundles are **non-identical** (rotation offset), ~8 docs each (`B=8`).
- Per-plan classification runs on **Sonnet** (sufficient + respects Opus quota);
  cross-cutting meta synthesis on the inherited (Opus) tier.
- The main loop **validates every load-bearing claim and cross-lens disagreement
  first-hand** before relying on it. This is non-negotiable: a single
  unvalidated misconception can invalidate the foundation (see §8 Sentry case).

**Waves run so far:**

| Wave | Angle | Shape | Agents | Outcome |
|---|---|---|---|---|
| 1 | 9-question meta panel | meta only (base census failed to wire — see §2) | 10 | Salvaged: agents self-enumerated the filesystem; findings valid. Data: [`data/wave1-meta.json`](data/wave1-meta.json) |
| 2 | Backward classification (relevance · vision-fit · lifecycle hygiene · duplication) + census-grounded meta | 118 per-plan dual-lens + 15 collection-synth + 10 meta | 143 | Full census of 409 docs, every doc ≥2 readers. Data: [`data/census-aggregates.json`](data/census-aggregates.json), [`data/wave2-meta.json`](data/wave2-meta.json), [`data/collection-syntheses.json`](data/collection-syntheses.json), [`data/per-path-census.json`](data/per-path-census.json) |
| 3 (pilot) | Forward-looking (value · dependency/sequencing · external-gate · decay) + gap-analysis | 4-agent pilot (2 bundles × 2 lenses) | 4 | **Instrument validated** (§7). Data: [`data/wave3-pilot-results.json`](data/wave3-pilot-results.json) |
| 3 (scale) | as above, full live estate | not yet launched — gate: owner go-ahead | — | instrument validated; awaiting launch decision |

---

## 2. Orchestration lessons (method insights)

- **Embed the work-list in the script; do not pass it via `args`.** Wave-2's
  first launch produced 0 bundles because `args` did not reach the script as an
  object — only the hardcoded meta tier ran. Cure: embed the manifest as a
  `const` in the script. Re-run was clean.
- **Pilot the instrument on ~4 agents before scaling to hundreds.** Catches
  field-population failures cheaply. Wave-3's pilot confirmed every field fills
  meaningfully before committing ~75 agents.
- **Union the "hard" cross-plan fields across lenses.** In the wave-3 pilot the
  sequencing lens (B) populated `depends_on` reliably while the value lens (A)
  left it empty. Aggregate by union; treat Lens B as authoritative for
  `depends_on` / `blocks` / `external_gate` / `freshness_risk`.
- **Do not trust agent self-report fields blindly.** Wave-2's `is_real_plan`
  boolean was **never set false** across 409 docs × 2 readers (instrument
  failure); the non-plan signal moved into `relevance: stale`. `lowConfidence`
  came back `0` (overconfidence). Always cross-check with a deterministic
  first-hand count.
- **Agent file-counts diverge wildly** (saw 279 / 146 / 1092) because some
  count `archive/`. The deterministic answer is **413 live+future** (260 live +
  153 future). Anchor on the manifest, not agent counts.
- **`no-hedging-vocabulary` fires at write time on report prose too.** Describing
  a found indefinite-deferral state needs precise status + missing-gate language
  (e.g. "`decision-incomplete`, no owner-agreed execution gate"), not a hedging
  word. The deferred-ideas collection's own directory name is a member of the
  indefinite-deferral regex family, so naming that path on any in-scope surface
  (`.agent/reports/`, `.agent/plans/`, …) is blocked at write — see §4 for the
  structural tension this reveals.

---

## 3. Reliability & how to read the data

- `data/per-path-census.json` — per-document verdicts (2 readers each); raw.
- `data/census-aggregates.json` — `globalRollup`, `staleExecutable` (59),
  `duplicationCandidates` (84, **over-reported** — many are deliberate
  parent/child pairs, not true dups; filter before acting).
- `data/cross-reader-disagreements.json` — 106 docs (26%) where the two readers
  split on relevance; the redundancy doing its job.
- Worst-case path-level relevance rollup: **28 live-critical · 187 live-supporting
  · 112 speculative · 79 stale/superseded**; 15 docs with no vision link.

---

## 4. Validated findings (first-hand authoritative)

**The four headlines:**

| # | Finding | Evidence | Confidence |
|---|---|---|---|
| 1 | **Lifecycle hygiene is the dominant problem** — executable lanes polluted | 14 session-`opener`s + ~25 completed-but-unarchived + PR-snagging + non-plan contracts in `active/`/`current/`; `staleExecutable`=59 | High |
| 2 | **Reachability invariant broken** | **149/355 (42%)** live+future plans unlinked from sibling README (substring check; directionally robust). Worst in practice lanes (aee/current 31/54). A remediation plan whose Phase 4 is a CI validator sits at status `decision-incomplete` (authored 2026-05-19, never executed, no owner-agreed execution gate recorded) | High |
| 3 | **Practice estate ~38–44%** of all plans | aee 98 + agent-tooling 61 = 159/409. **Boundary well-drawn — do NOT merge.** Inflation = un-archived residue + openers + 11 ADR-129 `*-specialist-capability` clones | High |
| 4 | **Strategic indexes stale** | `high-level-plan` 2026-06-03 + Path-to-GA 2026-05-26 carry **none** of the owner's 12-item roadmap; M2 milestone doc has **0** "widget" mentions yet the roadmap calls it an M2 gate | High |

**Corrected critical path to a live product (short, obscured by sprawl):**

- **M2 close (real):** WS4 user-facing widget **search UI — not started** (widget
  is brand-banner-only on `main`); + observability *maximisation* lanes
  (foundation already on `main` — not a blocker).
- **M3:** production Clerk (**no execution plan** — research-only, open
  "shared vs independent instance" prerequisite) + Cloudflare MCP security gate
  (**still in `future/`**, unpromoted).
- **M4/GA:** undefined (owner-gated).

**Planning skill verdict:** architecture (ADR-117/PDR-018) is **sound** — product
lanes are clean. Drift is **behavioural** in high-churn practice lanes. One
structural cure is already designed but unexecuted: the reachability CI validator
(Phase 4 of the `decision-incomplete` remediation plan); its execution gate is
unset.

**Vision verdict:** current (2026-06-12), **no rewrite needed.** Three gaps:
(a) `school-data-search` has no vision anchor; (b) reusable-components pillar is
docs-only (no execution plan); (c) M4/GA undefined while Vision implies sustained
production.

**Knowledge-preservation verdict:** instruments already exist
(semantic-search/future TRANSFER-MANIFEST + INFORMATION-RETENTION-CHECK; the
promotion-trigger convention on deferred ideas). **Enforce + generalise, zero
deletion.** The deferred-ideas collection has no README (13 files unreachable,
several with no promotion trigger); `observability/future` + `security/future`
also lack READMEs. Doctrine-aligned cure: every preserved item carries a
promotion trigger (a gate) or is consolidated into a live plan with its insight
conserved — not left in an indefinite bin.

**Structural tension found (owner decision):** the deferred-ideas collection's
directory name is itself a member of the `no-hedging-vocabulary` indefinite-deferral
regex family, so any doc that names that path on an in-scope surface is blocked at
write time. Established-collection-name vs graduated-doctrine collision.
Resolution options (owner's): add a doctrine exclusion for the literal path,
reconceive the collection as trigger-gated, or rename it. Not resolved here.

---

## 5. Strategic-question answers (condensed)

- **How organised / how it could be better:** not by re-drawing collection
  boundaries (well-bounded) — by **hygiene**: archive residue, re-home the 14
  openers to `.agent/prompts/`, restore the missing lane READMEs (including the
  deferred-ideas collection's), consolidate the 11 specialist-capability clones +
  a few true duplicate pairs, and publish the ~6 critical-path plans as a named
  visible list.
- **Do plans move toward the vision?** Yes — every pillar maps to an owning
  active collection; gaps named in §4.
- **Plans no longer relevant / speculative?** 79 stale/superseded
  (archive-with-conservation), 112 speculative (mostly correctly in `future/`).
  Per-collection `staleExecutable` lists are the actionable triage.
- **What excellent looks like:** executable lanes hold only in-progress/next
  plans; reachability CI-enforced; the critical path is a visible named list;
  speculative work preserved in the strategic + deferred-ideas + research lanes
  with indexes + promotion triggers; strategic indexes carry the live owner
  roadmap; the practice estate right-sized once residue is archived.

---

## 6. Per-collection signal

Full verdicts: [`data/collection-syntheses.json`](data/collection-syntheses.json).
Org-verdict summary (15 collections): `cluttered` — observability, semantic-search,
agentic-engineering-enhancements, agent-tooling; `mislaned` — security-and-privacy,
discovery, sector-engagement, compliance, school-data-search, user-experience,
sdk-and-mcp-enhancements, developer-experience; `mixed` —
architecture-and-infrastructure; `coherent` — connecting-oak-resources,
exploring-open-education-resources.

---

## 7. Wave-3 pilot — instrument validation (2026-06-15)

Tested the forward-looking schema on 6 critical-path + 6 mixed plans (4 agents).
**Verdict: validated, scale without re-pilot.**

- All fields populated meaningfully — no `is_real_plan`-style failure.
- Accurate vs ground truth: `output-schemas` correctly gated behind EEF D6/D7 +
  graph-tools; `external_gate: cloudflare` ✓; `agent-naming-v3` correctly
  `internal-hygiene / none / low`; `freshness_risk` caught the Sentry plan citing
  a now-archived doctrine plan.
- `confidence: medium` used (not blanket `high`).
- Aggregation rule for scale: **union `depends_on`/`blocks`/`external_gate`/
  `freshness_risk` across lenses; Lens B authoritative for them.**

---

## 8. First-hand validations performed (authoritative)

| Claim checked | Result | Verdict |
|---|---|---|
| `ws3-phase-5` blocked on PR #76 | PR #76 **MERGED 2026-04-10**; plan still says "blocked", last updated 2026-04-12 | Dead blocker ~2 months |
| Sentry/OTel branch state (agents disagreed) | `full-sentry-otel-support`, `otel_sentry_enhancements`, `backup/pre-merge`, `fix/sentry-identity-from-env` all **1,420–1,447 commits BEHIND main**, last touched Mar–Apr | **Orphaned/abandoned**, NOT the critical path |
| Is Sentry+OTel on `main`? | Full instrumentation present (`sentry-build-plugin`, `auth-instrumentation`, esbuild config, `docs/observability.md`) | **Foundation is live on `main`** — corrects wave-2 "M2 blocked on unmerged branch" (FALSE) |
| Widget UI state | `widget/src` = `App.tsx`, `BrandBanner.tsx`, no search components | WS4 search UI **genuinely not started** |
| M2 milestone doc omits widget gate | "widget" appears **0 times** in `m2-extension-surfaces.md` | Confirmed milestone-vs-roadmap disagreement |
| Reachability (estate-wide) | **149/355 (42%)** unlinked from sibling README | Confirmed (worse than wave-1's narrower 28%) |
| Reachability (aee/current) | **54 files, 23 linked, 31 unlinked** | Exact match to agents |
| Production-Clerk plan | only `clerk-mcp-tools-and-ext-apps-bumps` (version bump) live; migration is research-only | No execution plan confirmed |
| Specialist-capability clones | **11** (`elasticsearch`, `planning`, `sentry` + 8 future) | Confirmed |
| Deferred-ideas collection index | README missing, 13 files | Confirmed unreachable |

---

## 9. Open decisions / next moves

All four are owner-sequenced decisions; gate = owner selection.

1. **Scale wave 3** (forward-looking value/dependency/sequencing/decay) over the
   live estate + a gap-analysis meta tier (what vision/milestone work has no
   plan). Instrument validated; ready.
2. **Wave 4 candidate:** a clean per-file keep/archive/merge/re-home ledger over
   the 106 disagreements + 79 stale/superseded + filtered duplications.
3. **Refresh strategic indexes** with the owner roadmap + corrected critical path;
   fix the M2-milestone widget-gate disagreement.
4. **Author a hygiene remediation plan** (execute the reachability CI validator;
   archive residue; re-home openers; add the missing lane READMEs incl. the
   deferred-ideas collection's; consolidate specialist-capability clones).

---

## 10. Evidence index

Repo-relative, under [`data/`](data/):

- `wave1-meta.json` — wave-1 meta findings (10).
- `wave2-meta.json` — wave-2 census-grounded meta (10).
- `collection-syntheses.json` — 15 per-collection verdicts.
- `census-aggregates.json` — scope, global rollup, stale + duplication lists.
- `per-path-census.json` — raw per-document verdicts (2 readers each).
- `cross-reader-disagreements.json` — 106 split-relevance docs.
- `wave3-pilot-results.json` — pilot output (4 agents).
- `wave3-structure.json` — milestone coverage, external-gate index, decay list, leverage×effort, liveCritical, dependency DAG edges.
- `wave3-gap-findings.json` — 6 gap-analysis findings (missing plans, hidden blockers, critical-path order).
- `wave3-perpath.json` — raw per-document forward verdicts.

---

## 11. The strategy surface — Change → Value → Action (the headline)

This is the altitude the survey exists to serve, and its value is **breadth**: a
validated, whole-estate map (413 docs, 15 collections, every doc read ≥2×, forward
and backward lenses) connected to the vision and the value it must create. **Guard
against narrowing:** one input — the concurrent 2026-06-15 MCP-app launch-readiness
report — is a single product-surface lens (agent-produced, not an owner decision,
§12). It is weighed here as one slice among many, never the frame; its specifics
(e.g. the MCP aggregated-tool-handling debt) are known and real but not
value-critical. Authorities for vision/value:
[VISION](../../../VISION.md),
[readiness assessment](../mcp-app-live-product-readiness-assessment-2026-06-15.md),
[launch-readiness framework](../../plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md).

**The change in the world.** When a teacher or curriculum leader reaches for AI
to plan or adapt teaching, what comes back is grounded in Oak's sequenced,
evidence-informed, openly-licensed curriculum — not ungrounded AI invention — so
the integrity of what reaches *pupils* is protected and teacher workload falls.
The safety boundary is the pupil, not the adult user (readiness §1).

**The value that creates the change.** Compositional curriculum intelligence as
*reusable infrastructure*: typed SDK + hybrid search + curriculum graph + EEF
evidence, exposed through MCP so it reaches teachers inside the AI hosts they
already use (Claude, ChatGPT) and is reusable by the wider sector — plus the
Practice that lets Oak deliver it safely and fast and travels to other teams.
The value is leverage: a public asset becomes infrastructure that multiplies.

**How we create it (the action).** Value is created across the whole estate by the
vision's pillars — SDK, hybrid search, curriculum graph, EEF/evidence, MCP,
reusable sector components, the Practice, discovery, sector reuse — each an owning
collection. *One narrow input* (the launch-readiness report) proposes, for the
MCP-app surface specifically, an impact-first reframe: prove real teacher impact
and pupil-boundary safety before calling that product "live." A reasonable proposal
for one product line, the owner's to decide — **not the whole strategy**. The broad
action question is wider and is the real one: are the *outward* value pillars
(sector reuse, the teacher experience layer, proof that any of it creates value)
resourced to match the vision's emphasis, given the estate's centre of mass sits on
the *inward* engineering + Practice substrate?

**The determination gap (the heart of it).** A coherent strategy *proposal* now
exists (pending owner ratification of K1–K3); regardless of how that ratification
lands, the action surface has not caught up — and the two independent surveys
converge on why:

1. **The estate is built around the wrong ladder.** It is organised around the old
   auth/infra progression and the Practice (how-we-build, 38–44% of plans). The
   *load-bearing new gates* — value-proof instrumentation, pupil-safeguarding,
   legal/DPIA, performance, reusable-components, ops/sustainability — have **no
   execution plans at all** (wave-3 gap-analysis + readiness §5 agree).
2. **The real path is buried.** The ~6 genuinely on-path plans sit under ~400 docs;
   42% unreachable; 79 stale/superseded; 14 openers polluting `current/`; strategic
   indexes were stale until the concurrent session began wiring them.
3. **The external long-poles have no clocks.** Cloudflare entitlement, production
   Clerk migration (+ Google OAuth verification + GA-host DNS `mcp.thenational.academy`
   which does not yet resolve), and the MCP-spec 2026-07-28 GA (~6 weeks out) all
   gate the path, have independent external clocks, and no start dates or owners.
4. **The front door can't state the stage** (README "private alpha" vs tracker M2).

**What determination looks like (the resolve).**

- Ratify the impact-first ladder; rewrite the milestones around value-proof +
  safeguarding (owner gate the assessment names).
- Name the missing accountable owners: editorial/curriculum-correctness,
  safeguarding, DPO, accessibility, product, and a single go/no-go owner.
- Start the external long-poles NOW (Clerk Section-0 decision + Google OAuth
  verification + GA-host DNS; Cloudflare entitlement check; the MCP-spec-GA plan) —
  their clocks run independently of Oak.
- Author the missing load-bearing execution plans (production Clerk, privacy/legal,
  safeguarding, value-proof instrumentation, performance, whole-estate readiness
  checklist).
- Clear the noise so the signal survives: archive residue, restore reachability,
  publish the ~6-plan critical path as a visible named list, fix the README stage.
- Decide the two unanchored bets: resource the reusable-components pillar or scope
  it down honestly; anchor `school-data-search` in the vision or hold it out.

Wave-3 forward census underpinning this: 49 high-leverage M2/M3 plans, 263
dependency edges, **177 docs decay-flagged**, external-gate buckets
(upstream-oak-api 24, elastic 17, mcp-spec-ga 13, cloudflare 12, ontology-repo 8,
clerk 7, legal-dpo 1). Full data: [`data/wave3-structure.json`](data/wave3-structure.json),
[`data/wave3-gap-findings.json`](data/wave3-gap-findings.json).

## 12. Concurrent readiness session — validation verdict

The 2026-06-15 readiness session (separate seat, now complete) produced the
readiness assessment, the launch-readiness framework, a milestone-redefinition
stub, and wiring edits to the strategy indexes. Folded into this survey's remit
as raw, unchecked output. Verdict after first-hand checks: **sound and
disciplined.**

| Claim / artefact | First-hand check | Verdict |
|---|---|---|
| README contradicts the stage tracker | header reads `private alpha` / next `public alpha` vs tracker M2 | Confirmed |
| 13 aggregated tools exist | README §43 names "13 aggregated tools" | Confirmed (the *bypass-`ToolExecutionResult`* magnitude is README-sourced — code-confirm before treating as a hard gate) |
| Strategy-index edits | `git diff --stat`: small additive wiring; no milestone deletions | Wiring-only, not premature rewrite — disciplined |
| Impact-first ladder reasoning | cross-checked against my independent estate survey | Strongly corroborated (two angles, one conclusion) |

The independent convergence of the two sessions is the overlap-rigour check.

**Authority correction (load-bearing).** The assessment labels K1–K3
"owner-ratified (2026-06-15)" and the milestone verdict "owner-directed". That
ratification is an **agent's claim, NOT a verified owner decision** — per the
actual owner, these outputs are *input into the system*, not user-ratified. The
factual ground-truth and the reasoning hold; the authority stamp does not. Every
K1–K3 and the ladder is a proposal the owner must actually decide. Lesson: a peer
artefact's "owner-ratified" label is itself a claim to verify
(peer-status-is-input-to-verify), never a settled gate to relay.

Residuals to validate before any hard GA claim: (a) the code-level extent of the
aggregated-tool instrumentation bypass; (b) genuine owner ratification of K1–K3 and
the impact-first ladder.

## 13. Adversarial verification of the holistic synthesis (2026-06-15)

6-agent stress-test ([`data/holistic-verification.json`](data/holistic-verification.json)):
3 blind independent holistic readings + 3 adversarial refuters against the §11 claims.
The blind readings independently corroborated the inward-skew, the proof-of-value
gap, and the "no execution spine beyond the one app" framing. The refuters dented
four of six claims — recorded here because verification means reporting the dents:

| §11 claim | Refuter verdict (×3) | Correction |
|---|---|---|
| Vision clear, "no rewrite needed" | overstated ×3 | Current + clearest layer stands; but it **conflates two products** (teacher-facing curriculum-intelligence product vs developer/sector reusable-infrastructure offer) and asserts reusability as "first-class delivery" the estate does not back. A **sharpening**, not a rewrite. |
| Substrate "genuinely excellent / strongest" | overstated ×3 | Real + strong (packages exist, 489 test files, prod responds 200), with known bounded debt. "Excellent with caveats," not unqualified. |
| Value chain skewed inward (~39%) | stands ×3 | If anything understated (~45% by `.plan.md` denominator). |
| Proof-of-value the deepest gap | overstated ×2 / stands ×1 | Substance holds; observability *infrastructure* exists (five-axis). The precise gap: **nothing measures the vision's outcome indicators** (teacher workload, pedagogical quality, sector reuse). |
| Action surface doesn't express strategy | stands ×3 | One refuter reproduced aee/current at exactly 23 linked / 31 unlinked. Solid. |
| Determination missing | misframed ×2 / stands ×1 | Outward under-resourcing + no-owned-timelines stand; but the **24-plan upstream-Oak-API dependency is a deliberate coordination boundary** (`upstream-feature-requests` = record-and-hand-over by design), not a defect — that sub-claim is withdrawn. |

**Two refuter additions that improve the synthesis:**

1. **Sharper than "inward skew":** there is a full execution spine + milestone ladder
   for *one app* (the MCP server) and **none for the other two-thirds of the vision**
   — SDK-as-product, reusable components, graph/evidence infra, Order-2 enablement,
   pupil outcomes. This is the crisp statement of the finding.
2. **Honest meta:** much of the strategic diagnosis **already exists in the repo**
   (the 2026-06-15 readiness work re-derived the inward-skew + proof-gap). This survey
   partly re-derives a known verdict; its genuinely *additive* value is the
   **whole-estate breadth + the quantified action-surface state** (42% unreachable,
   the per-collection census, relevance/value/dependency distributions) **+ the
   independent cross-validation**. A comprehensive, validated map — not a novel insight.

**Verified holistic bottom line.** Clear at the top (vision — needs sharpening, not
rewrite), strong at the bottom (substrate — with bounded debt), under-determined in
the middle: the vision is built and laddered for *one product surface*, while the
SDK-as-product, the reusable-sector-components offer, and any *proof of outcome value*
have no execution spine. The work is to give the rest of the vision an execution
spine and an outcome-proof loop — and to decide, consciously, how much investment
goes inward (substrate + Practice) vs outward (the orders closest to the mission).

## 14. Owner corrections (2026-06-15, in-session) — these SUPERSEDE parts of §11/§13

Three owner corrections landed at session close. They are the freshest, highest
authority input and **supersede** the earlier framing where they conflict.

1. **The ~40% on substrate + Practice is deliberate and correct — NOT a skew.**
   Owner rationale: even a modest ~5%/month improvement in output or learning
   **compounds** to large returns. And — load-bearing — **the Practice is a value
   stream in its own right**, not merely an enabler of the MCP-app stream. → The
   "inward skew / over-weight" framing in §11/§13 (and claim C3/C6's evaluative
   charge) is **withdrawn**. The estate is a deliberate **multi-value-stream
   portfolio**; the Practice is one of those value streams. The live question is
   not "rebalance away from inward" — it is "does every value stream (the outward
   ones included) have what it needs," answered via the sequence in §15.

2. **Impact measurement is not built here — it is articulated here and measured by
   Oak.** Owner: this repo does **not** have the capability to create those impact
   measurements, but Oak (the organisation) does measure those things. → Claim C4
   is refined: the gap is **not** "build value-proof instrumentation in this repo."
   It is "**write down what we care about, why, and how we are attempting to
   provide value and impact**," and connect that to the organisation's measurement
   capability. The deliverable is a **value/impact articulation**, not in-repo
   instrumentation.

3. **Sequencing for the forward work.** Yes — there should be a full execution
   spine for **all** value streams. But the order is fixed: **(a) align on impact →
   (b) redundancy/gap analysis across the value streams → (c) then the "middle
   piece" (the execution spine).** Do not jump to the spine first.

**Authority note (carried from §12):** the K1–K3 keystones and the impact-first
ladder remain an **agent's proposal, not an owner-ratified decision** — including
where `repo-continuity.md` records them as "Owner DECIDED." Treat as input.

## 15. Next-session research plan (the continuation)

The next session continues the holistic analysis in this fixed order (owner-set):

- **Step A — Align on impact (do first).** Author a clear articulation: *what value
  and impact we intend to create, why it matters, and how we are attempting to
  create it* — per value stream — mapped to Oak's organisational measurement
  capability (we document + hand off; we do not instrument here). Ground in
  VISION §How We Measure Impact + §Three Orders. Deliverable: an impact/value
  statement the org can measure against.
- **Step B — Value-stream redundancy/gap analysis.** Enumerate the value streams
  (candidate set: the MCP-app product; the SDK as a product; hybrid search; the
  curriculum graph; EEF/evidence; reusable sector components; agent-readiness
  discovery; the Practice as its own stream; `school-data-search` pending its
  vision decision). Analyse **redundancy** (overlap/duplication across streams)
  and **gaps** (streams under-served or with no spine). This is where the survey's
  per-collection census, the dependency DAG (`data/wave3-structure.json`), and the
  duplication candidates feed in.
- **Step C — The middle piece (execution spine).** Only after A+B: design the
  execution spine / milestone structure for all value streams (the work §13 named
  as "no spine beyond the one app").

**Inputs for the next session:** this report (§1–§16), the durable `data/` (raw +
refined), the strategy surface (VISION, milestones, `high-level-plan.md`,
`curriculum-mcp-path-to-ga/`), and the corrected synthesis (§11 + §13 as corrected
by §14). Start by reading §14 (corrections) and §15 (this plan).

## 16. Preservation index (lose-nothing audit)

Everything this session produced, and where it is durable:

- **Refined synthesis + method + corrections** — this doc (§1–§15).
- **Raw census data** — `data/`: `per-path-census.json` (wave-2), `wave3-perpath.json`
  (wave-3), `census-aggregates.json`, `wave3-structure.json` (DAG, external-gates,
  milestone coverage, decay), `cross-reader-disagreements.json`.
- **Meta/synthesis layers** — `data/wave1-meta.json`, `wave2-meta.json`,
  `wave3-gap-findings.json`, `collection-syntheses.json`, `holistic-verification.json`.
- **Work-list + human-readable digests** — `data/survey-manifest.json` (the 413-doc
  scope), `wave2-meta-compact.txt`, `wave2-collection-synth-compact.txt`,
  `wave3-gap-compact.txt`.
- **Full raw workflow returns** — `data/raw/*.raw.json` (all 5 substantive waves;
  rescued from machine-local `/tmp`).
- **Method lessons** — napkin (this session's block).
- **Concurrent-session awareness for the next agent:** the working tree carries
  **uncommitted** work from ≥2 other 2026-06-15 sessions (Quoll weaves Dreamscape —
  readiness framework/report/stub + strategy-index wiring; Sirius binds Spectrum —
  UAT runbook). Nothing here is committed. The K1–K3 "owner-decided" claim in those
  artefacts is **agent input, not owner-ratified** (§12, §14).
