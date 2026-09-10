---
id: first-major-release
node_type: strategic
name: "First major release — Oak distribution-ready in AI assistants"
overview: "Make Oak's curricula discoverable and accessible to teachers inside the AI assistants they already use, released to early users through official one-click routes."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-23
ratified_where: "Planning-sitting part-2 ratification cards, 2026-07-23; decisions register D24 (serves edge) + D22 lift note"
serves: APP-1
impact_areas:
  - served-surface
  - guidance-content
  - auth-and-access
  - analytics-and-observability
  - conformance-and-standards
  - packaging-and-distribution
  - content-workspace
gate_expiry_default: P3D
depends_on: []
owner_gates: []
tickets: []
last_updated: 2026-09-01
---

# First major release — Oak distribution-ready in AI assistants

## Outcome

The Oak app is distribution-ready and live to early users: production
sign-in, safe self-observation of its own use, and published store
listings a teacher reaches in one click through official routes.
Explicitly **not** general availability — GA's bar (real teachers
demonstrably better supported, measured with Oak's research capability)
stays ahead of this release. Dates live on the Linear milestones, never
here.

## The bet

Teachers are already using AI assistants to help them teach. Putting
Oak into that context — the app's high-quality, fully sequenced and
fully resourced curricula, discoverable and accessible where the work
already happens — will improve outcome quality and reduce work.
Shipping enables the meeting; vendor collaboration benefits shipping.

The app presents; it never creates. There is no AI in the app in this
release — a statement of current scope, not a permanent invariant:
generative capability is expected in later releases, and crossing that
line is a deliberate, ratified decision, never a drift (the allowlist
keeps creation-oriented content dormant so enabling it is always an
explicit act).

The app complements Oak's other surfaces: it signposts the main
website for canonical resource access and the curated creation
experience for generative use cases, and they signpost the app where
teacher work is already happening.

## Success looks like

A live listing reached in one click from a shared link; early users
signing in through production Clerk (public beta from the switch —
no invite gate, per the 2026-07-29 ruling below); usage visible under
the ratified privacy posture (no teacher-level identity, no captured
content);
the expert-authored guidance served to assistants and signed off; and
two-way signposting with Oak's web surfaces working.

## Delivery

Delivery plans serving this node declare `serves: first-major-release`
— enumerate them by search, never by a hand-kept list. Milestones are
named observable states of the product, held in Linear with tickets
mapped; this node and those milestones are kept aligned by a roughly
daily lead-AI check, drift surfaced rather than silently corrected.

## Tempo

`gate_expiry_default: P3D` — during this release, no owner-gate waits
silently longer than three days.

## Dated notes (decisions-register projections)

The full decisions register lives with the release project's working
docs in Linear; these dated notes project register-relevant events
onto this node — one line each, pointers never duplicates.

- 2026-07-23 — D11: the lesson-planning guidance placeholder deleted
  outright (owner comment on #486); the creation-oriented dormant set
  is three documents, not four; other prompt-era concepts preserved as
  pointer ticket MCP-124.
- 2026-07-23 — D18 (amended, owner word ~16:45): the canonical-address
  target widens to two options on the table — `www.thenational.academy/mcp`
  (main-domain front door; integrating into the main website adds
  substantial work) and `mcp.thenational.academy` (dedicated subdomain;
  DNS and zone-owner engagement only). Decision deferred to the
  zone-owner engagement; mint-not-move either way (the current host
  keeps serving); the content-negotiation triple proven live in
  production since v1.82.0 is domain-agnostic and serves either. The
  authoritative record is the MCP-122 ticket comment (2026-07-23).
- 2026-09-01 — D18 resolved (owner word): the canonical address is
  `mcp.thenational.academy/mcp`, live behind the Cloudflare edge
  (MCP-172); `www.thenational.academy/mcp` no longer serves (404,
  probed 2026-09-01). The estate-wide reference sweep rides the
  MCP-122 lane. The authoritative record is the MCP-122 ticket
  comment (2026-09-01).
- 2026-07-23 — Release-flow silent stall (new entry): a ruleset split
  dropped the semantic-release bot's bypass, GH013 blocked the
  version-bump push, and production sat on v1.81.3 silently while main
  advanced; the owner restored the bypass at 12:59. Standing cures
  landed: the release-process runbook (the first D23 runbook node) and
  the loud Slack failure alert (#497; alert channel corrected in #500).
- 2026-07-26 — D22 superseded: the PostHog spike's durable evidence is
  absorbed into the ratified MCP-63/MCP-173 plans, ADR-218, and the dated
  probe report on draft PR #568. Closed PR #477 is not an implementation
  source; its annotated tag, worktree, and obsolete branches were deleted.
- 2026-07-23 — MCP-67 and MCP-121 ratified at owner cards; the
  ratification stamps live in those plans themselves.
- 2026-07-23 — M1 COMPLETE: MCP-101 done (five PRs, every acceptance
  criterion proven) and the v1 live set finalised by the EEF flip
  (`get-eef-evidence` + `eef://interpretation` dormant, landed
  aa9f432bc).
- 2026-07-23 — MCP-128 ratified at owner card (Candidate B home-map
  shell; H1 "Oak, in your AI assistant"); the plan is canonical at
  e4e66dfcb.
- 2026-07-23 — The guidance-format owner gate discharged (six rulings
  adopted at owner cards); the authoritative record is the MCP-102
  ticket comment of 2026-07-23.
- 2026-07-24 — M1-note correction (MCP-141 scan; drift surfaced, never
  silently corrected): the 2026-07-23 "M1 COMPLETE" note above
  overstated — it correctly records MCP-101 done and the EEF flip, but
  M1's named state ("the served surface is final") does not hold while
  MCP-121 (guidance serving architecture, mapped to M1) is in flight
  and changes the served surface. The board (M1 in progress) is the
  truth; the note stands as written for what it dates, corrected here.
- 2026-07-29 — Cloud-Config PR #551 review extracted at owner
  direction: every review point (JR's five comments + the owner's
  quoted skip-rules principle) ticketed as MCP-344…MCP-351 plus the
  MCP-172 coverage comment; infrastructure halves INFP-1…INFP-8 in the
  new Infrastructure Platform backlog, cross-linked at every seam.
  Standing rulings from the extraction: MCP-scoped work (llms.txt
  included) lives in the MCP project; MCP work requiring infrastructure
  carries linked tickets across the two projects; none of the extracted
  items are assumed submission blockers.
- 2026-07-29 — OAuth namespace on the canonical domain (owner ruling,
  conditional): prefer collapsing the edge scope to `/mcp*` plus two
  path-scoped well-knowns, leaving root `/.well-known` untouched —
  gated on client-compatibility evidence, general plus Claude and
  ChatGPT by name. First evidence in: the reference MCP TypeScript SDK
  (1.29.0) implements RFC 8414 path-inserted AS discovery. Fallback if
  a named client fails: the PR #551 shape as opened. Authoritative
  record: MCP-344 comment (2026-07-29).
- 2026-07-29 — PostHog scope narrowing NEVER owner-agreed (owner word,
  verbatim: "I never agreed to Posthog scope being narrowed, I was
  explicit, we need visibility of analytics events from day 0"). The
  2026-07-27 MCP-237 narrowing (sink + integration test only) was
  executed, not ratified; the M0 boundary as stated 2026-07-28
  ("events flowing safely") STANDS. Enacted: MCP-117, MCP-242,
  MCP-243, and MCP-354 (event-catalogue owner sign-off) now block
  MCP-309 — day-0 analytics visibility gates the submission; records
  on those tickets.
- 2026-07-29 — Goal-holding mechanism commissioned (owner word: "we
  need a mechanical fix, you need a way to hold the project goals,
  not just what happens to be happening right now") — a derived,
  recomputed-at-read goal-state surface over the milestone/gate
  structure, plus the Director practice leg (owner-facing state
  answers walk the goal surface first, activity second). Ticket in
  the MCP project carries the design.
- 2026-07-29 — Multi-host self-description (owner direction): keep the
  alpha AND www serving correctly if soundly possible; www wins
  otherwise. Nothing hardcoded — every URL/host derives from the
  deployed instance, in BOTH repos (app sweep MCP-351; route
  single-definition locals INFP-8). The Host-override blindness, the
  edge-restored validated-host design, and its security gate (the
  bounded-selection vs header-trust distinction, fresh security pass
  required): authoritative record MCP-307 comment (2026-07-29).
- 2026-07-29 — Capability-baseline ruling (owner): all third-party
  integrations keep working in production; Sentry rides the
  observability sinks alongside PostHog in every environment
  (non-negotiable). Enforcement slice MCP-361; the goal-state surface
  (MCP-355) carries the baseline; SLO formalisation is owner-proposed
  pointer MCP-362. Same day: preview PostHog project 236161
  provisioned; the anonymous identity class admitted (MCP-357,
  sequenced at the MCP-354 sign-off); preview-deployment testability
  named a binding requirement on the MCP-344/307 design (records on
  those tickets).
- 2026-07-29 — Public-beta ruling (owner, at the Clerk-window card):
  "as soon as we switch the MCP server is in public beta" — the
  production Clerk promotion IS the public-beta moment; no app-layer
  invite gate exists or is planned for this phase, and the listings
  not yet existing at the switch is an accepted state. M4's milestone
  text re-trued accordingly; the invite-gate sentence it replaced was
  authored 2026-07-27 and never matched the built estate. Same day:
  the Thursday submission ruled EXTERNAL and fixed on the www endpoint
  ("Thursday is `www`... we cannot simply move an external deadline");
  MCP-354's four-event catalogue signed off unamended; MCP-357 finally
  sequenced post-submission on the corrected authenticated-handshake
  premise. Records: MCP-143, MCP-354, MCP-357, MCP-309 checklist.
- 2026-07-2x — Sensitivity discipline (backfilled 2026-07-31; the rule is
  statable even though its subject matter is not): repo artefacts — PR
  bodies, commits, docs, ADRs, comms — carry NO release dates and NO
  vendor mentions in relation to the release; that detail lives on owner
  surfaces only. A handoff observing that the full sensitivity-tier detail
  "lives exclusively in local memory" is describing this policy WORKING,
  not a homing gap.
- 2026-07-2x — Owner submission-logistics rulings (backfilled 2026-07-31):
  NO AGENT SUBMITS the connector or plugin — submission is a manual human
  act; the listing name is provisionally "Oak National Academy" pending
  human review; listing copy assembles from approved sources under the
  never-invent-public-copy discipline. Records on MCP-292/296/309.
- 2026-07-2x — Clerk production-window ordering (backfilled 2026-07-31):
  the DCR flip is deliberately sequenced LAST in the cutover so the
  open-registration window shrinks to minutes; composes with the
  2026-07-29 public-beta ruling above (the Clerk promotion IS the
  public-beta moment, no app-layer invite gate). Records on MCP-143.
- 2026-07-2x — Owner strategic frame (backfilled 2026-07-31): "engineering
  is nearly out of the critical path; what remains is mostly
  human-judgement gates — our job is to make those gates easy to walk
  through." The frame that prices reviewer-pack, guidance, and
  submission-support work above new engineering surface; the
  reflection-synthesis VISION candidate (Director-held) grows from it.
- 2026-07-21/25 — Owner re-aim (backfilled 2026-07-31 by the comms-corpus
  run; no durable surface carried it): "we have drifted away from moving
  towards the V1 release, we have been lost in detail" — release-chain
  tickets route first; meta lanes sequence behind a named
  release-chains-staffed-and-moving gate; the meta backlog sits under a
  protected research floor; further implementer seats wait on the design
  lane completing. The routing posture that produced the late-July
  outflow discipline.
- 2026-07-25 — Submission framing of record at the time (backfilled
  2026-07-31): first Anthropic-directory submission Wednesday 30 July,
  engineering-complete and production-deployed by Tuesday 29 EOD with
  freeze discipline after; V1 delivery September; guidance chain
  (MCP-102/121) de-gated from initial submission. Superseded in
  sequence (→ Friday 31 July → Thursday 2026-08-06, Matt Gregory
  holding the conn) — kept as the evolution's middle step so the
  register's date arithmetic stays reconstructible.
