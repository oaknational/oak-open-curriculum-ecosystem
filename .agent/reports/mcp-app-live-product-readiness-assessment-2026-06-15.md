---
title: "MCP App Live-Product Readiness — Session Assessment"
type: report
status: stable
last_updated: 2026-06-15
scope: >
  First-principles assessment of what it would take to make the Oak Curriculum
  MCP app a live product, plus a fresh-eyes re-assessment of the milestone
  ladder. Self-contained record of all findings from the 2026-06-15 session.
related:
  - ".agent/plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md"
  - ".agent/plans/curriculum-mcp-path-to-ga/roadmap.md"
  - ".agent/milestones/README.md"
  - ".agent/plans/curriculum-mcp-path-to-ga/future/launch-readiness-and-milestone-redefinition.plan.md"
---

# MCP App Live-Product Readiness — Session Assessment

This report captures, in full, the findings of a working session that asked:
**if we launched the Oak Curriculum MCP app as a live product, what product and
other needs would have to be met first?** It records the first-hand
verification, the right/wrong/missing assessment, the general launch-concern
framework, the keystone product decisions taken in-session, and a fresh-eyes
re-assessment of the milestone ladder. It is the durable home of those findings;
the [Launch-Readiness Framework](../plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md)
is the living gate structure derived from it.

**Status note.** The milestone re-assessment in §8 is a verdict for owner
ratification; the prior milestone files have **not** been rewritten. That redraft
is a future plan whose promotion trigger is owner direction to schedule the redraft
pass — see the
[stub future plan](../plans/curriculum-mcp-path-to-ga/future/launch-readiness-and-milestone-redefinition.plan.md).

**Ratification correction (2026-06-17).** This report's original framing of the §7
keystones as "owner-ratified (2026-06-15)" was premature — at the time they were
agent **input**, not ratified (see the 2026-06-15 plan-estate survey §12/§14). The
owner ratified K1–K3 on **2026-06-17** as the **MCP-app stream's** keystones, with
two corrections that supersede the §7 wording below: (1) **K1** — value-proof is a
GA precondition *articulated here and measured by Oak, not instrumented in-repo*
(owner §14.2); the "and its instrumentation" phrasing is withdrawn. (2) **K3** —
readiness is scoped to the app's **real dependency set**, not literally the whole
repo; "whole-estate" readiness holds only at the **portfolio level**. The §7 table
and §8 analysis are left as the dated 2026-06-15 record; the ratified wording lives
in the [Launch-Readiness Framework](../plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md)
and the [Phase-2A decisions brief](../plans/archive/vision-strategy-and-plan-estate.2a-decisions.md)
(archived 2026-06-18; decisions preserved in the controlling plan, framing superseded).

---

## 1. Method, and the corrections that shaped it

The assessment was reshaped twice in-session; both corrections are reusable.

- **Do not relay the planning estate as ground truth.** The first pass risked
  summarising the existing plans (Path-to-GA Programme, milestone files,
  app-submission-standards) as the map of "what's needed." That estate is
  **engineering-and-compliance shaped**; a doc-relay can only return what the
  docs already considered and, by construction, cannot surface what is missing.
  Correction: treat the docs as one fallible input and verify load-bearing
  claims first-hand (§2).
- **Ground the framework in the target build, not the as-is artefact.** An early
  draft minimised graphical UX on the grounds that "the UI is a small host-owned
  rectangle." That mistook a half-built *current state* for a *structural
  constraint*. The intended build is a rich graphical curriculum-search
  experience; graphical product/UI/interaction design is a first-class concern.
  Correction: every readiness dimension is grounded in what we are going to
  build.
- **The reframing insight — the safety boundary is the pupil, not the user.**
  The user is an adult (teacher / curriculum leader); the people who can be
  harmed are the children downstream of the teaching the product shapes. This,
  plus "the brand travels into an AI environment we cannot observe" and "Oak is
  a public body (so accessibility and the Children's Code are statutory)",
  reorganises the whole concern space away from the consumer-app template.

---

## 2. First-hand verification (ground truth)

Verified directly against the live production server and the canonical README,
not taken from the planning docs.

| Check | Finding |
|---|---|
| Live prod MCP responds | Yes — upstream curriculum API at `v0.7.0` (2026-05-21). |
| Upstream rate-limit on the shared key | `limit:0, remaining:0, reset:0` = **unlimited**. No upstream per-key quota ceiling. |
| App README current-stage claim | Header says `Status: private alpha / Next: public alpha` — **contradicts** the milestone tracker (M1 invite-only alpha complete; M2 in progress) and continuity (EEF live by default on the alpha URL). |
| Public availability | README §Authentication: Clerk **test** instance, "Only internal Oak team members are supported… External access is not available." By the project's own words it is **not a public product today**. |
| Tool surface integrity | README admits the **13 aggregated tools (of 37) bypass `ToolExecutionResult`** — missing error handling, logging, and type safety; "architectural debt." |

**Implication of the unlimited key:** with one shared unlimited upstream key,
there is no upstream cost ceiling; abuse/cost protection rests entirely on the
MCP server's own (probabilistic, in-memory, cold-start-resetting) rate limiting
plus a CDN edge (Cloudflare) that is not yet configured/promoted.

---

## 3. What is RIGHT (sound — do not rebuild)

- **Provenance/architecture.** Schema-first codegen from the OpenAPI spec, SDK
  as single source of truth, generation-time tool extraction. The data returned
  is faithfully grounded. Strongest part of the system.
- **Privacy engineering.** The ADR-160 non-bypassable redaction barrier and
  per-sink identity-projection discipline (Clerk ID only to PostHog + guarded
  Sentry) are well-shaped — even though the legal artefacts are not yet written.
- **Security architecture (ADR-158).** Multi-layer, read-only blast radius,
  runtime-aware rate-limit key extraction, OAuth 2.1 + PKCE discovery done
  correctly.
- **Release discipline.** The milestone-release-runbook (R0–R5, G1–G8, severity
  model) and the UAT runbook with a dated production GO record (2026-06-15) are
  real, repeatable artefacts.
- **Accessibility *tooling*.** WCAG 2.2 AA contrast pairings fail the build;
  axe-core tests run on both light and dark themes. This is the floor.

---

## 4. What is WRONG (present but flawed, stale, or self-contradicting)

1. **The front-door doc can't state the product's stage.** Three "authoritative"
   surfaces give three different answers for what stage we are at (§2). A
   product cannot launch whose canonical README contradicts the milestone
   tracker on its most basic fact.
2. **By its own words this is not a public product today** ("external access is
   not available"). Any launch conversation starts from internal-only.
3. **A third of the tool surface is second-class.** The 13 aggregated tools
   bypass the instrumented path, which directly undercuts the "full five-axis
   observability" claim — you cannot observe what does not route through it.
4. **No cost ceiling anywhere** (unlimited upstream key + serverless + ES), and
   the authoritative volumetric defence (Cloudflare WAF) is behind an unpromoted
   security-gate plan with no feature evidence collected.
5. **Operational safety is sequenced after the risk it guards.** The
   SLO/error-budget plan is gated "≥30 days post-launch baseline" — circular.
6. **The plans predate reality.** The migration plan (2026-04-10), the Cloudflare
   gate (2026-04-28), and the Programme (2026-05-26) all predate the EEF ship and
   graph-tools landing, so their status snapshots (e.g. "M2 ~95%") are unaudited.

---

## 5. What is MISSING (no slot in the estate — the real payload)

Categories the engineering-shaped estate has no home for. For an Oak product
they are not optional.

1. **Safeguarding & content-safety posture — the largest gap.** An AI product in
   the children's-education domain. The server returns grounded data; the host
   LLM paraphrases and can hallucinate on top of it. No stated posture on "an AI
   gave wrong guidance attributed to Oak," no safeguarding review, no editorial
   accountability owner, no harm-response runbook.
2. **No definition of "live"/GA and no success metric.** (Resolved in-session —
   see §7 K1.)
3. **No sustainability / funding model.** Publicly funded body; unbounded
   serverless + unlimited-key cost; no cost-per-active-user envelope.
4. **No support or incident operations.** No support channel, on-call, status
   page, harm response, or alerting-before-launch.
5. **No go-to-market / discoverability / teacher onboarding.** The product lives
   in hosts Oak doesn't control; discoverability = directory listing (unstarted,
   with privacy-policy and governance blockers); no non-technical setup path.
6. **Legal artefacts named but unwritten** — privacy notice, terms of service,
   acceptable-use, DPIA, DSAR/deletion runbook, processor agreements.
7. **Product strategy: two products conflated** (end-user vs developer surface).
   (Resolved in-session — see §7 K2.)
8. **No versioning/deprecation policy** for the public tool surface.

---

## 6. The general launch-concern framework

The full, gated framework — concern → open decisions → candidate gate ("how
we'd know") → candidate owner, per dimension — lives in the
[Launch-Readiness Framework](../plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md).
Its shape:

- **Three structural facts** that bend every dimension: safety boundary = the
  pupil; the brand travels into an environment we cannot observe; Oak is a public
  body (accessibility duties and the ICO Children's Code are statutory, not
  optional).
- **Group A — Strategy:** purpose/value/definition-of-done; audience & risk-tiered
  use cases.
- **Group B — Safety, trust & compliance:** pupil-boundary safeguarding;
  trust/brand/provenance; UK GDPR/DPIA/DSAR + Children's Code + public-sector
  accessibility + host directory policies + T&Cs.
- **Group C — Experience:** product & content design; interaction & visual (UI)
  design with accessibility designed in; quality of experience;
  whole-estate production-readiness.
- **Group D — Run & govern:** operations & sustainability; governance &
  accountability.

---

## 7. Keystone decisions — agent input (2026-06-15); ratified 2026-06-17 with corrections

> **Superseded wording.** This table is the dated 2026-06-15 record. The keystones
> were owner-**ratified on 2026-06-17** as the MCP-app stream's keystones, with two
> corrections to the rows below — K1 drops "and its instrumentation" (value-proof is
> articulated here and measured by Oak, not instrumented in-repo, per §14.2); K3 is
> scoped to the app's **real dependency set**, not literally the whole repo
> ("whole-estate" holds only at portfolio level). See the **Ratification correction
> (2026-06-17)** note above and the
> [Launch-Readiness Framework](../plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md)
> for the ratified wording.

| # | Decision | Consequence |
|---|----------|-------------|
| **K1** | **"Live" = full GA, in the world, with real users (teachers and curriculum leaders) using it and demonstrating positive impact.** | "Live" is an **evidence state, not a deploy state.** Value-proof and its instrumentation become a **precondition** of GA, not a post-launch measurement. |
| **K2** | **Primary audience: teachers and curriculum leaders** (for now). | Not developers, not the open public — a professional education audience whose work reaches pupils. Sets the safety bar and the experience design. |
| **K3** | **Surface scope: the MCP app in ChatGPT and Claude — which means the entire estate beneath it must be GA-ready.** | Readiness is **whole-estate**: SDK/codegen, search + Elasticsearch, graph tooling, auth, observability, MCP runtime, and the React experience must each be production-grade (framework dimension C4). |

---

## 8. Milestone ladder re-assessment (fresh eyes)

The owner directed that the prior milestone definitions are **not assumed to
stand**. Re-derived from first principles against K1–K3.

### 8.1 What the inherited ladder actually is

Stripped of labels, M0 → M1 → M2 → M3 is an **auth-posture progression** (test
Clerk → dev Clerk + allowlist → open dev Clerk → prod Clerk). The State
Progression table is keyed on "who can authenticate and how." It is an
*infrastructure* ladder presented as a *product* ladder.

### 8.2 Three structural faults (seen through K1–K3)

1. **No value-proof gate, anywhere.** No milestone asserts evidence of positive
   impact — yet K1 *defines* "live" as exactly that. The ladder is missing its
   most load-bearing gate.
2. **No safety/safeguarding gate, anywhere.** For a product whose output reaches
   pupils, pupil-boundary safety clearance appears in no milestone. "No sev-1
   snags" is engineering hygiene, not safety clearance.
3. **App-scoped, not estate-scoped.** K3's "every workspace beneath is ready"
   has no representation; the gates assert app-surface readiness only.

Softer fault: **"open public alpha/beta" optimises for openness**, which now
contradicts K2 (a controlled cohort of real teachers/curriculum leaders matters
more than "open to anyone"). "M2 ~95%" is 95% of the wrong checklist — discard
the percentage.

### 8.3 The impact-first ladder (proposed)

Working back from K1–K3, GA requires four things to be true **and proven**, in
dependency order:

| Stage | Proves | Gate (how we'd know) |
|---|---|---|
| **1 · Estate production-ready** | Every workspace the app surfaces is GA-grade | Per-workspace readiness checklist green across the GA-critical estate (framework C4) |
| **2 · Safe, lawful, trusted** | Safe at the pupil boundary; lawful for a public body | Safeguarding assessment signed off; provenance in the experience; DPIA + Children's Code + accessibility statement + legal artefacts; host-directory acceptance (framework B1–B3) |
| **3 · Value proven with real users** | A cohort of teachers/curriculum leaders gets positive impact | Instrumented release-and-observe + qualitative feedback clears a pre-agreed impact bar (framework A1, C-group) |
| **4 · GA** | The proven impact sustained, open, supported | Open access; support + incident/harm response live; cost envelope monitored; SLOs holding (framework D-group) |

Stage 3 is the inversion K1 forces: **value-proof is a precondition of GA, not a
post-launch measurement.**

### 8.4 Verdict and mapping

**The prior milestone definitions do not stand.** Keep M0/M1 as historical
record of completed Stage-1 work; M2/M3/M4 should be replaced by the impact-first
ladder (Stages 1–4, named to taste), with value-proof and safeguarding as
first-class GA gates and readiness scoped to the whole estate. Most of M2/M3's
auth/infra gates fold into Stage 1; Stages 2–4 are the load-bearing gates the old
ladder never had.

---

## 9. Artefacts produced or edited this session

- **Created** — [Launch-Readiness Framework](../plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md)
  (the gated dimension structure; keystones K1–K3 integrated; dimension C4
  whole-estate readiness added; milestone ladder flagged for re-derivation).
- **Created** — this report.
- **Created** — [stub future plan](../plans/curriculum-mcp-path-to-ga/future/launch-readiness-and-milestone-redefinition.plan.md):
  the milestone redraft + gate-execution work as a future plan; promotion
  trigger is owner direction to schedule the redraft pass.
- **Wired** — the framework and stub into the plan discovery surfaces
  (`plans/README.md`, `high-level-plan.md`, `curriculum-mcp-path-to-ga/roadmap.md`,
  `milestones/README.md`); this report into `reports/README.md`.

No quality gates were run this session (owner-directed). No milestone files were
rewritten. No commit was made.

---

## 10. Open decisions & recommended next steps

1. **Ratify the impact-first ladder** (§8) and authorise rewriting the milestone
   files + the Programme milestone matrix to Stages 1–4.
2. **Name the load-bearing missing owners:** editorial (curriculum correctness),
   safeguarding, DPO, accessibility, product, and a single go/no-go owner.
3. **Define the Stage-3 impact bar** — the specific qualitative + quantitative
   signals that count as "positive impact realised" for teachers and curriculum
   leaders (framework A1).
4. **Resolve the minors question** — in-scope users or actively out-of-scope, and
   how enforced (framework A2).
5. **Promote the stub future plan** when the redraft pass is scheduled.

---

## 11. Related

- [Launch-Readiness Framework](../plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md)
- [Curriculum MCP Path-to-GA Programme](../plans/curriculum-mcp-path-to-ga/roadmap.md)
- [Milestones index](../milestones/README.md)
- [Stub future plan: launch-readiness & milestone redefinition](../plans/curriculum-mcp-path-to-ga/future/launch-readiness-and-milestone-redefinition.plan.md)
- [MCP App Extension Migration](../plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md)
