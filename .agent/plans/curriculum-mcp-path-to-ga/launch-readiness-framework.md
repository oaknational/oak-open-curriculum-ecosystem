---
title: "Curriculum MCP — Launch-Readiness Framework"
type: readiness-framework
status: draft-keystones-ratified-milestones-under-reassessment
last_updated: 2026-06-17
feeds:
  - ".agent/plans/curriculum-mcp-path-to-ga/roadmap.md (Programme §6 A4)"
  - ".agent/milestones/README.md (M3 → M4/GA gate definitions)"
governing_principles:
  - ".agent/directives/principles.md"
  - "docs/architecture/architectural-decisions/162-observability-first.md"
  - "docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md"
purpose: >
  A first-principles framework for what it means to take the Oak Curriculum
  MCP app live as a product — grounded in the product we are going to build
  (a fresh React MCP App with a first-class graphical curriculum-search
  experience), not the half-built state of today. It names the readiness
  dimensions, the owner decisions each depends on, candidate gates, and a
  candidate accountable owner per dimension. It does not make the product
  decisions; it structures them.
---

# Curriculum MCP — Launch-Readiness Framework

**Status**: 🟡 DRAFT — keystones K1–K3 **owner-ratified 2026-06-17** as the **MCP-app stream's** keystones (§14.2 correction to K1; K3 scoped to the app's real dependency set); milestone ladder under fresh-eyes re-assessment
**Audience**: owner (product + go/no-go), then the collections that own each axis.

This framework answers a different question from the Path-to-GA Programme. The
[Programme](./roadmap.md) sequences the *engineering and compliance* work across
collections. This framework asks the prior, wider question: **what does it mean
for this to be a responsible, good live product at all?** It is the substrate
for Programme backlog item **A4** (the undefined M4/GA milestone definition).

## Grounding principle: build-state, not as-is-state

Every dimension below is grounded in **what we are going to build**, not what
exists today:

- **The target product** is a fresh React MCP App (clean-break rebuild on the
  MCP Apps standard, `@modelcontextprotocol/ext-apps`) whose centrepiece is a
  **first-class, user-first graphical search-and-exploration experience**
  (`user-search`) that makes Oak's hybrid semantic search legible and useful to
  a teacher, delivered inside AI hosts (Claude, ChatGPT, Cursor) and built on
  the Oak design-token system.
- "We don't fully own the surface" and "the conversational channel is also an
  entry point" are **design context** for that experience — they constrain
  *how* we design, not *whether* graphical product, interaction, and visual
  design are first-class concerns. They are.

Where this framework references current state, it does so only to mark a
readiness *gap*, never to lower the bar to today's artefact.

## Three structural facts that bend every dimension

This is not a consumer chatbot, and the standard consumer-app launch template
would mislead. Three facts reshape the work:

1. **The safety boundary is the pupil, not the user.** The user is an adult
   (a teacher); the people who can be harmed are the children downstream of the
   teaching this product shapes. Safety, quality, and accuracy are judged at the
   **pupil boundary**.
2. **The brand travels into an environment we cannot observe.** Oak's name
   reaches a teacher *through* a host LLM that paraphrases on top of Oak data.
   Provenance and attribution are safety features, not polish.
3. **Oak is a public body.** Several "good-practice" items are **statutory**:
   public-sector accessibility duties and the ICO Age Appropriate Design Code
   (the Children's Code) if children are likely users. Assume both apply.

## Keystone decisions — owner-ratified (2026-06-17, MCP-app stream)

The three forks the framework hangs on are now set (owner-ratified 2026-06-17 as
the **MCP-app stream's** keystones — the observed-positive-impact gate is this
stream's alone; the ecosystem and framework streams reach their own readiness on
their own terms, co-equal, not a later phase). This is the decision log; every
dimension below is read in their light.

- **K1 — "Live" = full GA, out in the world, with real users (teachers and
  curriculum leaders) using it and demonstrating positive impact.** "Live" is
  therefore an **evidence state, not a deploy state**: GA cannot be declared
  until positive impact is *observed* in real use, not assumed. Value-proof
  becomes a **precondition** of GA, not a post-launch nicety — **articulated here
  and measured by Oak, not instrumented in-repo** (owner §14.2).
- **K2 — Primary audience: teachers and curriculum leaders** (for now). Not
  "developers building on the surface", and not "the open public" — a
  professional education audience whose work reaches pupils. "For now" is a
  **post-GA non-commitment**: it fixes the current safeguarding bar; no audience
  widening is planned at this stage.
- **K3 — Surface scope: the MCP app in ChatGPT and Claude — which means the app's
  real dependency set must be GA-ready.** Declaring the app live asserts that
  every workspace it actually depends on (SDK/codegen, the curriculum data/API,
  the MCP server runtime, and search/graph and the React experience **as used**,
  plus auth and observability) is itself at production quality. Readiness is
  scoped to the **app's real dependency set**, not literally every workspace in
  the repo; "whole-estate" readiness holds only at the **portfolio level** — each
  value stream reaches its own readiness.

**Consequence for this document.** With K1–K3 set, the prior M0 → M3 → GA
milestone ladder is **no longer assumed to stand**; it is being re-assessed from
first principles (see "How to use this framework").

---

## Group A — Strategy: is it worth doing, and the right thing?

### A1. Purpose, value & definition of done

- **Concern (target-grounded).** The bet: teachers will use AI regardless;
  ground it in Oak's sequenced, evidence-informed, openly-licensed curriculum
  rather than ungrounded AI invention. Intended impact: reduced workload for
  teachers and curriculum leaders **and** protected integrity of what reaches
  pupils. Per K1, "live" is an *evidence* state — GA is gated on *observed*
  positive impact, so the value-proof loop is a GA precondition.
- **Open decisions.** The specific impact bar and the qualitative +
  quantitative signals that count as "positive impact realised" for the K2
  audience.
- **Candidate gate / how we'd know.** Explicit success metrics agreed before
  build-complete; a real-user value-proof period (release-and-observe +
  qualitative feedback from teachers and curriculum leaders) clears the agreed
  bar **before** GA is declared.
- **Candidate owner.** Product owner.

### A2. Audience & target use cases

- **Concern (target-grounded).** Primary audience is decided (K2): **teachers
  and curriculum leaders** — design the graphical experience for their work
  (curriculum leaders skew toward mapping, sequencing, and coherence across a
  whole curriculum; teachers toward planning and adapting individual lessons).
  Account for the **de-facto** audience: because Oak is free and lives in
  consumer AI hosts, children can reach it directly (the OpenAI directory
  already forces a 13+ gate). **Triage target use cases by risk**: lesson
  planning, finding/sequencing, **adapting for SEND/EAL**, curriculum mapping,
  progression/misconceptions, resource pull — anything touching **RSHE/PSHE** or
  vulnerable-pupil adaptation is high-risk and needs a stricter bar than "find a
  maths lesson."
- **Open decisions.** Whether minors are in-scope users or actively
  out-of-scope (and how that is enforced), given the professional primary
  audience.
- **Candidate gate / how we'd know.** A documented primary-audience decision; a
  use-case risk register with a per-tier safety bar.
- **Candidate owner.** Product owner, with safeguarding input.

---

## Group B — Safety, trust & compliance: is it safe and lawful?

### B1. Safety & safeguarding (assessed at the pupil boundary)

- **Concern (target-grounded).** The server returns grounded data; the host LLM
  can still distort it. Needs: a stated posture on "AI gave wrong guidance
  attributed to Oak"; a policy for safeguarding-sensitive content; behaviour
  if a child is the direct user; **a named editorial owner** for "is the
  curriculum guidance Oak emits correct?"; and a **harm-response runbook** for
  the first reported incident.
- **Open decisions.** Risk appetite for AI paraphrasing of safeguarding-adjacent
  content; whether to constrain or annotate high-risk use cases.
- **Candidate gate / how we'd know.** A safeguarding & content-safety assessment
  signed off; harm-response runbook tested; provenance surfaced in the UI (see
  B2).
- **Candidate owner.** Safeguarding lead + editorial owner.

### B2. Trust, brand & provenance

- **Concern (target-grounded).** In the graphical experience and the tool/text
  responses, make **what is Oak-verbatim distinguishable from what the AI
  generated** (citation, source links, "from Oak" markers). Define attribution
  rules for when a host may claim content is "from Oak."
- **Open decisions.** Attribution policy; disclaimer strategy.
- **Candidate gate / how we'd know.** Provenance/citation present and tested in
  the live experience; attribution policy published.
- **Candidate owner.** Product owner + brand/comms.

### B3. Compliance & legal (several statutory)

- **Concern (target-grounded).** UK GDPR + **DPIA** (Clerk + PostHog + Sentry);
  **DSAR/deletion runbook**; processor agreements; **ICO Children's Code**
  (assume in-scope per the three structural facts); **public-sector
  accessibility duties** (WCAG 2.1 AA + accessibility statement by law; Oak's
  own standard is 2.2 AA); **host directory policies** (privacy-policy link,
  token efficiency, age-appropriateness, developer verification) which gate
  discoverability; **terms of service / acceptable use** for a free public
  service. The privacy *engineering* (ADR-160 redaction barrier, per-sink
  identity projection) is sound; the *legal artefacts* are unwritten.
- **Open decisions.** Children's-Code applicability ruling; per-sink identity
  ruling backfill (Programme A5).
- **Candidate gate / how we'd know.** DPIA approved; privacy notice + T&Cs +
  acceptable-use published and linked in server metadata; accessibility
  statement published; directory policy checklist passed.
- **Candidate owner.** DPO + legal, with engineering.

---

## Group C — Experience: will people actually get value, well?

This group is the heart of "what we are going to build." It is a first-class
design surface, not a footnote.

### C1. Product & content design (the experience itself)

- **Concern (target-grounded).** Design the graphical search-and-exploration
  journeys for the primary audience: information architecture of curriculum
  navigation; **how hybrid semantic search is surfaced and made legible** (why
  these results, how to refine, how to go from a result to a lesson/sequence);
  content design and microcopy in Oak's voice; first-run/empty/loading/error
  states a teacher understands; the path from search → plan → adapt that mirrors
  the prompt workflows (`find-lessons`, `lesson-planning`, `adapt-lesson`,
  `continue-progression`).
- **Open decisions.** Scope of the v1 experience; which use-case journeys ship
  first.
- **Candidate gate / how we'd know.** Designed journeys validated with real
  teachers (usability testing); content-design review passed.
- **Candidate owner.** Product + design.

### C2. Interaction & visual (UI) design

- **Concern (target-grounded).** The React MCP App's visual and interaction
  design on the Oak design-token system (palette, semantic light/dark,
  components); responsive behaviour and **graceful variance** across hosts
  (host-supplied CSS custom properties, CSP, light/dark, unknown width);
  graceful degradation to text in non-Apps hosts; coherence between the
  graphical surface and the conversational channel so they feel like one
  product. **Accessibility designed in, not bolted on**: WCAG 2.2 AA, full
  keyboard operation, screen-reader semantics, visible focus, and contrast —
  *within a host-owned iframe*, which is the hard part and must be tested in
  real hosts, not just the dev server.
- **Open decisions.** K3 (a standalone web surface widens what we fully control
  and changes the accessibility-compliance surface).
- **Candidate gate / how we'd know.** Design-system conformance; axe-core +
  manual keyboard/screen-reader passes **in at least two real hosts**; contrast
  gate green; degradation-to-text verified.
- **Candidate owner.** Design + frontend engineering + accessibility reviewer.

### C3. Quality of experience

- **Concern (target-grounded).** Latency/performance (serverless cold start,
  Elasticsearch query time, upstream API, graph fan-out); reliability and a
  defined **SLO/availability target set *before* launch** (today's plan defers
  it to 30 days post-launch — invert that); **correctness/grounding** as the
  QoE metric that matters most here; cross-host consistency; **token
  efficiency** (graph tools currently return full dumps — degrades UX and trips
  host policy).
- **Open decisions.** SLO targets; acceptable latency budget.
- **Candidate gate / how we'd know.** SLOs defined and instrumented; latency
  within budget under representative load; token-efficient responses verified
  against directory policy.
- **Candidate owner.** Engineering + product.

### C4. App-dependency-set production-readiness (K3 consequence)

- **Concern (target-grounded).** Declaring the MCP app live asserts that *every
  workspace it actually depends on* is at production quality — the app is only as
  trustworthy as the dependency set it surfaces. In scope: SDK/codegen
  (`@oaknational/curriculum-sdk` + generators), the curriculum data/API, the MCP
  server runtime, and — **as the app uses them** — search + Elasticsearch, the
  graph tooling, and the React experience, plus auth (Clerk) and observability
  (Sentry/OTel + the ADR-160 redaction barrier). Each must be contract-stable,
  tested, observable, supportable, and free of known sev-1 defects — not just the
  app surface. This is the app's **real dependency set**, not literally the whole
  repo (per the ratified K3; whole-estate readiness holds only at portfolio
  level).
- **Open decisions.** Which workspaces are in the GA-critical path versus
  independently shippable — i.e. the precise boundary of the app's real
  dependency set.
- **Candidate gate / how we'd know.** A per-workspace production-readiness
  checklist (tests, observability, no open sev-1, contract stability) green
  across the GA-critical estate, behind one canonical aggregate gate.
- **Candidate owner.** Engineering, with per-workspace owners.

---

## Group D — Run & govern: can we operate it responsibly over time?

### D1. Operations & sustainability

- **Concern (target-grounded).** A **support channel** for "it broke" / "it gave
  wrong info"; **incident + harm response, on-call, status page, and alerting
  configured before launch**; a **cost/funding envelope** — Oak is publicly
  funded and the current shape (unlimited upstream key + serverless + ES) has no
  cost ceiling and the authoritative volumetric defence (Cloudflare) is not in
  place; a **versioning/deprecation policy** for a tool surface third parties
  depend on; and a **feedback → improvement loop** closing back to A1's value
  proof.
- **Open decisions.** Cost-per-active-teacher target; support model and SLAs.
- **Candidate gate / how we'd know.** Support + incident + harm-response runbooks
  live and tested; alerting + status page operational; cost envelope agreed and
  monitored; deprecation policy published.
- **Candidate owner.** Engineering + operations, with product.

### D2. Governance & accountability

- **Concern (target-grounded).** Named accountable owners — editorial
  (curriculum correctness), DPO (privacy), safeguarding, accessibility, product,
  and a single **go/no-go decision-maker**; a ratified definition of "live"
  (K1); and a decision log so the open forks above are recorded when set.
- **Open decisions.** Who holds each named role.
- **Candidate gate / how we'd know.** RACI agreed; go/no-go owner named; K1–K3
  recorded in a decision log.
- **Candidate owner.** Owner.

---

## How to use this framework

1. **Keystones K1–K3 are owner-ratified** (above, 2026-06-17, as the MCP-app
   stream's keystones), so the framework is read in their light — and the prior
   M0 → M3 → GA milestone ladder is **not assumed to stand**. It is being
   re-assessed from first principles against the ratified definition of "live".
2. **Re-derive the milestone ladder, impact-first.** Because "live" is an
   *evidence* state (real teachers and curriculum leaders + observed positive
   impact) and readiness is scoped to the app's real dependency set (K3), the
   milestone gates re-organise around proof of dependency-set readiness,
   safety/compliance clearance, and real-user value — not around auth posture.
   The re-derived ladder feeds Programme A4 and the milestone files.
3. **Each candidate gate becomes a GA exit criterion** (Programme A4), routed to
   its owning collection (`security-and-privacy/`, `observability/`,
   `sdk-and-mcp-enhancements/`, `compliance/`, a new safeguarding/editorial
   home, and the experience-design work in the WS3/WS4 rebuild).
4. **No gate is satisfied by a passing test alone.** Per Oak doctrine, product
   value and live-experience quality are proven by release-and-observe with real
   teachers, not by green CI.

## Non-goals

- Making the product decisions (K1–K3) — those are the owner's.
- Duplicating sub-plan content — this framework names dimensions and gates and
  cites homes; execution detail lives in the owning collections.
- Redefining milestone gates — it *feeds* the M4/GA definition; the milestone
  files remain the authority once A4 is ratified.

## Related

- [Path-to-GA Programme](./roadmap.md) — engineering/compliance sequencing index
- [Milestones](../../milestones/README.md) — M0–M3 definitions; M4/GA is A4
- [MCP App Extension Migration](../sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md)
  — the target React MCP App + `user-search` graphical experience
