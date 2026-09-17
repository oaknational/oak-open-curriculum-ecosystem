---
id: post-change-production-validation
node_type: delivery
name: Post-change production validation for the live MCP service
overview: >-
  After significant change sets, the estate mechanically proves the changes
  built and the live MCP app fully works — door, discovery, and an
  authenticated tool call through the attached app connection.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: first-major-release
impact_areas:
  - analytics-and-observability
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-08-08
---

# Post-change production validation for the live MCP service

Owner directive commissioning this plan (2026-08-08, verbatim substance):
the service is live and assumed to have real users — after a significant
change set (for example, a set of eight merges), validate that (1) the
changes resulted in service builds and (2) the live builds resulted in a
fully working MCP app. The concept exploration that shaped this plan ran
the same morning at the Director seat; its immediate probe validated the
overnight set (releases 1.153.8–14, Vercel success, healthy door
signature, self-consistent discovery, authenticated search returning real
curriculum data through the attached connector).

Two owner rulings bound the shape: validation is CHANGE-TRIGGERED only
(no continuous synthetic — environment-side breakage waits for user
signal or later error monitoring), and the authenticated instrument is
the ALREADY-ATTACHED app connection (no provisioned test identity, no
stored credentials).

## Goal

After every significant production change set, the estate knows — from
recorded, first-hand evidence rather than inference — that the deploy
landed and the live app's critical user journey works, with a loud
routed failure when it does not. The blindness window the overnight set
exposed (eight merges, no production instrument until the owner asked)
does not recur.

## Mechanism

1. **Light leg, mechanical**: a CI job on production-deploy completion
   runs the credential-free canary set — the door signature (the 401
   shape with its auth-reason header), the protected-resource metadata
   fetch with self-consistency against the canonical URL, and the
   well-known documents. Failure fails the job loudly.
2. **Build identity**: the served surface exposes its release/sha within
   the `/mcp*` routing scope so "did the changes ship" is one request
   against production. Before building, check whether the platform
   already exposes an unambiguous build identifier on served responses;
   if it does, this part reduces to documenting the check.
3. **Authenticated leg, agent-run**: at significant change boundaries, a
   seat with the attached app connection runs a representative
   authenticated tool call and records the result — the instrument that
   actually proves "fully working". The runbook codifies the call set
   and the recording convention.

## Acceptance criteria (each with a proof — required)

1. A production deploy triggers the light leg automatically and a
   deliberately broken probe target fails it loudly. Proof: `repo-safe`
   — the workflow run records, cited on the implementing PR.
2. One request against the live surface returns the build identity that
   matches the expected release. Proof: `repo-safe` — the recorded
   request/response on the implementing PR.
3. The authenticated-leg runbook exists, names the call set and the
   recording convention, and its first recorded run against a real
   change set is linked. Proof: `repo-safe` — the runbook file plus the
   first run's record.

## Todos

- Slice 1: the light-leg CI job (single-story PR, PDR-132 default
  budget).
- Slice 2: build identity on the served surface, preceded by the
  platform-header check (single-story PR).
- Slice 3: the authenticated-leg runbook under the operations runbook
  index (docs PR).

## Out of scope

- A continuous synthetic monitor — owner-ruled change-triggered only;
  revisiting is a fresh owner decision.
- Stored credentials or provisioned test identities — the attached app
  connection is the instrument.
- Error monitoring (Sentry) — separately owner-gated post-submission on
  Matt's word; this plan neither waits on nor duplicates it.
- Any monitoring platform or SRE programme — the deliverable is one CI
  job, one identity surface, one runbook.

## Review notes

The `plan-body-first-principles-check` shape fires at authoring (this
body); code-expert fires on the slice-1/2 PRs and docs-adr-expert on
slice 3 per the standing reviewer matrix. No vendor build-vs-buy fork:
the light leg composes existing CI primitives, and the platform-header
check in slice 2 is the buy-side question asked first.
