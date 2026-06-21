---
title: 'Strategy — Stream: the MCP app (teachers)'
type: strategy
status: active
last_updated: 2026-06-20
derives_from:
  - VISION.md
governed_by:
  - .agent/plans/product-development-governance/vision-strategy-and-plan-estate.plan.md
---

# Stream — the MCP app (teachers)

_Part of the [Strategy corpus](README.md); derives from the [vision](../../VISION.md).
Serves Oak's **teachers** goal._

**Two co-equal, complementary channels.** Teachers reach Oak through the web and through
AI assistants; the channels reinforce rather than compete, and AI has a place in both.
This repository delivers the AI-assistant channel — a [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) (MCP) [app](https://modelcontextprotocol.io/extensions/apps/overview)
putting Oak inside the assistants teachers already choose, ChatGPT, Claude, Gemini and others — bringing Oak's standards into the
planning and preparation teachers already do there. Which assistant is the teacher's
choice, not ours — as a public body we serve the public good, not any one provider, so we
support the major assistants even-handedly and never partner with one over another.

## How we win

The strategic bets, grounded in the diagnosis (rigour at reach, through a channel we
can't open alone) and Oak's advantages — owner-signed-off (2026-06-20); the strategy
iterates as a living document (PDR-018).

- **APP-1 — Meet teachers inside the assistants they already use.** Bring Oak to where
  planning already happens, rather than building a destination. _Advantage:_ teachers are
  already there — we raise the quality of an existing behaviour, not introduce a new one.
- **APP-2 — Keep Oak recognisable in the host's output.** Grounding, attribution, and
  provenance, so what the teacher sees is traceably Oak, not paraphrase. _Advantage:_
  Oak's sequenced, evidence-informed curriculum is rigour no ungrounded model can achieve.
- **APP-3 — The teacher is the expert; we inform, never decide.** _Advantage:_ aligns
  with the Optional pillar and the teacher-as-expert boundary
  ([ADR-194](../architecture/architectural-decisions/194-teacher-as-expert-product-boundary.md)).
- **APP-4 — Ship through vendor collaboration.** App-like packaging and promotion are
  co-built with the AI vendors.

## What we won't do

- Compete with the [Oak Web Application](https://www.thenational.academy) — the two
  channels are complementary, and both involve AI.
- Present Oak as the only choice — the Optional pillar.
- Trade rigour for reach — all content MUST be grounded in Oak's curriculum and/or standards.

## The launch keystones (K1–K3, owner-ratified 2026-06-17)

These are settled and live in the
[launch-readiness framework](../../.agent/plans/curriculum-mcp-path-to-ga/launch-readiness-framework.md);
they sit inside this stream's strategy as its production-readiness keystones.

- **K1 — "Live" is an evidence state, not a deploy state.** General availability (GA) means real teachers and
  curriculum leaders using the app and demonstrating positive impact. Value proof is a
  precondition of GA — articulated here, measured by Oak, not instrumented in-repo.
- **K2 — Primary audience: teachers and curriculum leaders** (for now). Nothing in the app
  is aimed at students. This is load-bearing for the ICO Children's Code question below and
  must be read with it.
- **K3 — Surface scope: the app in ChatGPT and Claude and Gemini**, which means the app's real
  dependency set must be GA-ready. (This is the ratified _initial release surface_ —
  distinct from the no-favourites principle above, which names ChatGPT, Claude, Gemini and
  others as the teacher's open choice.) The release channel isn't unilateral — app-like
  packaging and promotion need the AI vendors' collaboration (the live status is in the
  release-readiness hand-offs below). Marketing is gated on sufficient mitigation of the third-party-content (TPC) risk:
  Oak's curriculum includes material licensed for the website but not for reuse beyond it, so
  every AI surface must run on the **open** subset with TPC filtered out (what the Open
  Curriculum API serves) — and that filter is not yet proven to the bar we need for public
  release.

## Release-readiness — named hand-offs with accountability

Several go-live gates are owned outside this repository; the strategy's job is to name
them, with an accountable owner, so none is silently assumed done. "Owned in-repo" = a live
plan drives it; "external/tracked" = executed outside the repo and tracked in the
[compliance lane](../../.agent/plans/compliance/roadmap.md); "discussion" = no owner yet.

| Requirement                     | What                                                                                                                                                                                           | Ownership                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Privacy policy / T&Cs surfacing | Links in server metadata + discovery; the decide-and-publish step is legal                                                                                                                     | In-repo (`app-submission-standards` WS2 + compliance Phase 1); decide-and-publish external |
| Host UX                         | The teacher's experience inside the host product                                                                                                                                               | In-repo (`mcp-app-extension-migration` WS3/WS4)                                            |
| ATRS                            | Algorithmic Transparency Recording Standard record, required of an arms-length public body before release                                                                                      | External/tracked — **production blocker**                                                  |
| Detailed DPIA                   | Full data-protection impact assessment across the live flows                                                                                                                                   | External (DPO/legal) — **production blocker**                                              |
| ICO Children's Code             | Applicability ruling + conformance, **cross-linked to the K2 target-audience decision**                                                                                                        | External (legal) + product — discussion open                                               |
| Safeguarding & content-safety   | The teacher is the safety layer; content-safety assessed externally                                                                                                                            | External (safeguarding + editorial) — **production blocker**                               |
| Independent AI-output evals     | Stress-test outputs against Oak's quality and safety benchmarks                                                                                                                                | External (Oak AI Platform) — **production blocker**                                        |
| Lesson-level data availability  | Safely-filtered (TPC-removed) lesson data via the upstream API — DB surfacing is upstream (not our scope) plus a materialised view (the same gate as the TPC filter; see open-questions Q-003) | Discussion — no owner yet                                                                  |
| Go-to-market / school support   | Discoverability and enablement; teachers won't auto-discover or self-install                                                                                                                   | Discussion — no owner yet                                                                  |
| Release channel                 | App-like packaging + promotion across the assistants (ChatGPT / Claude / Gemini, even-handedly)                                                                                                | External-collaboration dependency (vendors aware + agreed)                                 |

The **ICO Children's Code** question is cross-linked to the K2 target-audience decision
(teachers and curriculum leaders; nothing aimed at students) — that link is load-bearing
and must not be lost.

## Measures — proposed candidate (Oak grounds)

Real-use adoption and observed positive impact for teachers and curriculum leaders (K1),
defined and measured with Oak's analytics and research experts. The candidate signal is
ours to propose; the target is Oak's to ground. See the [measures checkpoint](measures.md).
