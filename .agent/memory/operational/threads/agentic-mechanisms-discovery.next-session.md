# Next-Session Record - `agentic-mechanisms-discovery` thread

## Current Continuation

- Branch: `feat/graph-tooling-tidyup`
- Invocation pointer: continue from this record and the promoted current plan at
  [`agent-readiness-discovery-hub.plan.md`](../../../plans/discovery/current/agent-readiness-discovery-hub.plan.md).
- Controlling plan:
  [`agent-readiness-discovery-hub.plan.md`](../../../plans/discovery/current/agent-readiness-discovery-hub.plan.md)
  for Phase 1, backed by verification evidence in
  [`standards-verification-2026-06-01.report.md`](../../../plans/discovery/current/standards-verification-2026-06-01.report.md).
  Strategic source and gated child lanes remain under
  [`agentic-mechanisms-discovery.plan.md`](../../../plans/discovery/future/agentic-mechanisms-discovery.plan.md).
- Related future child plans:
  [`agent-skills-discovery.plan.md`](../../../plans/discovery/future/agent-skills-discovery.plan.md)
  [`mcp-server-cards.plan.md`](../../../plans/discovery/future/mcp-server-cards.plan.md),
  [`dns-aid-discovery.plan.md`](../../../plans/discovery/future/dns-aid-discovery.plan.md),
  [`aila-a2a-agent-card.plan.md`](../../../plans/discovery/future/aila-a2a-agent-card.plan.md),
  [`webmcp-human-site-operability.plan.md`](../../../plans/discovery/future/webmcp-human-site-operability.plan.md),
  and
  [`web-bot-auth-agent-verification.plan.md`](../../../plans/discovery/future/web-bot-auth-agent-verification.plan.md).
- Next safe step: execute `ar1` in the current plan before product edits:
  refresh standards and public Oak endpoint evidence, then proceed through the
  Phase 1 tasks only on the hosts each surface truthfully owns.
- Completed prerequisites: research report written; Agent Skills Discovery plan
  written; parent Agentic Mechanisms Discovery plan written; MCP Server Cards
  plan aligned and corrected against SEP-2127; Oak ticket re-verified into a
  current report; Phase 1 agent-readiness hub plan promoted to `current/`;
  DNS-AID, Aila A2A, WebMCP, and Web Bot Auth child plans added to `future/`;
  docs-review findings resolved; root planning docs overhauled so discovery is
  reachable from both strategic and operational planning entry points.
- Recent relevant commits: none from this session; owner requested no commit.
- Team expectation: sole contributor unless the owner explicitly opens a team
  route.
- Acceptance bar: no readiness claim until the current plan's endpoint checks,
  owning-repo tests, and `pnpm check` have passed.
- Web Bot Auth split: the current Phase 1 plan owns the decision ledger and
  security-evidence cross-link. The future Web Bot Auth child plan owns any
  later enabled-control rollout if Oak ratifies signed-agent verification.

## Session Update (2026-06-01 - Umbral Whispering Silhouette / root planning docs overhaul + light handoff)

Root planning entry points are now refreshed:
[`high-level-plan.md`](../../../plans/high-level-plan.md) is the strategic
programme map, and [`README.md`](../../../plans/README.md) is the operational
collection index. Both explicitly surface the active discovery programme, the
current agent-readiness hub plan, and the Web Bot Auth / robots / sitemap
baseline.

Docs-review feedback from Hubble was resolved before the root-doc overhaul:
the thread pickup now keeps Web Bot Auth visible, stale/broken command links in
security planning docs were repaired, security roadmap dating was refreshed,
and discovery index summaries now state the general official-web-app baseline
for `robots.txt` and sitemaps.

Earlier focused checks passed for the root-doc overhaul:
`pnpm exec markdownlint --dot .agent/plans/high-level-plan.md
.agent/plans/README.md`, `pnpm exec prettier --check
.agent/plans/high-level-plan.md .agent/plans/README.md`, focused
`git diff --check`, and the local markdown-link existence check. No new gates
were run during this light handoff, and no commit was made, by owner direction.

Next safe step remains `ar1-refresh-standards-and-live-estate` in the current
plan. Keep Web Bot Auth as a Phase 1 decision/evidence bridge unless Oak later
ratifies an enabled signed-agent verification rollout from the future child
plan.

## Session Update (2026-06-01 - Umbral Whispering Silhouette / Web Bot Auth correction)

Owner correction applied: Web Bot Auth is now a first-class discovery item, with
security-and-privacy as the evidence/enforcement cross-link. Also corrected the
baseline doctrine: `robots.txt` and sitemap coverage are general requirements
for every official Oak web app, not just apex-specific agent-readiness tasks.

Plan changes:

- Added
  [`web-bot-auth-agent-verification.plan.md`](../../../plans/discovery/future/web-bot-auth-agent-verification.plan.md).
- Updated the current Phase 1 plan with a dedicated Web Bot Auth task,
  acceptance criterion, proof row, and host-scope row.
- Updated the verification report to include Web Bot Auth and the general
  robots/sitemap baseline.
- Cross-linked Web Bot Auth from
  [`security-and-privacy/README.md`](../../../plans/security-and-privacy/README.md)
  and
  [`security-and-privacy/roadmap.md`](../../../plans/security-and-privacy/roadmap.md).

## Session Outcome (2026-06-01 - Umbral Whispering Silhouette / codex / GPT-5 / `019e83`, Oak ticket promotion + re-verification)

**Promotion slice complete, implementation not started.** This session moved the
Oak ticket's actionable Phase 1 agent-readiness work into
[`current/agent-readiness-discovery-hub.plan.md`](../../../plans/discovery/current/agent-readiness-discovery-hub.plan.md)
and created
[`current/standards-verification-2026-06-01.report.md`](../../../plans/discovery/current/standards-verification-2026-06-01.report.md)
as the live evidence record.

The verification checked the repo discovery plans and the Oak ticket against
official/current standards sources and public Oak endpoints. Important results:
the apex `Link` header and API catalog are live; the catalog already anchors
Open API on `open-api.thenational.academy`; the skills relation and skills index
are absent; apex `robots.txt` has no Content Signals; Open API has neither
OAuth protected-resource metadata nor `Auth.md`; `mcp.thenational.academy` does
not resolve; the alpha MCP protected-resource metadata exists; the ticket's MCP
Server Card detail must be corrected from historical SEP-1649 shape/path to the
live SEP-2127 track before implementation.

Additional future plans now cover Oak-ticket surfaces that were not yet tracked
as separate repo plans:

- [`dns-aid-discovery.plan.md`](../../../plans/discovery/future/dns-aid-discovery.plan.md)
- [`aila-a2a-agent-card.plan.md`](../../../plans/discovery/future/aila-a2a-agent-card.plan.md)
- [`webmcp-human-site-operability.plan.md`](../../../plans/discovery/future/webmcp-human-site-operability.plan.md)
- [`web-bot-auth-agent-verification.plan.md`](../../../plans/discovery/future/web-bot-auth-agent-verification.plan.md)

The discovery collection also now has lifecycle indexes for `active/` and
`current/`, and the top-level plans index marks discovery as active plus queued
execution.

**Validation:** focused `pnpm exec markdownlint --dot .agent/plans/discovery
.agent/plans/README.md`, focused `git diff --check`, and `pnpm
format-check:root .agent/plans/discovery .agent/plans/README.md` passed. The
root `pnpm markdownlint-check:root` failed on pre-existing lint errors in
`repo-continuity.md`, which this session did not edit.

**Next safe step:** start the current plan at `ar1-refresh-standards-and-live-estate`.
Do not implement MCP Server Cards, DNS-AID, Aila A2A, or WebMCP until their
future-plan gates are explicitly promoted.

## Session Outcome (2026-06-01 - Luminous Dancing Aurora / codex / GPT-5 / `019e82`, agentic mechanisms discovery planning + light handoff)

**Uncommitted planning slice complete.** This session researched Cloudflare Agent
Skills Discovery against live official standards context, reflected on Oak
mission impact, and wrote the discovery future-planning bundle:

- [`agent-skills-discovery-research.report.md`](../../../plans/discovery/future/agent-skills-discovery-research.report.md)
- [`agent-skills-discovery.plan.md`](../../../plans/discovery/future/agent-skills-discovery.plan.md)
- [`agentic-mechanisms-discovery.plan.md`](../../../plans/discovery/future/agentic-mechanisms-discovery.plan.md)

The existing
[`mcp-server-cards.plan.md`](../../../plans/discovery/future/mcp-server-cards.plan.md)
was then aligned with the new parent/sibling structure: it now has a
`parent_plan`, links to the skills lane, a sibling-relationship section, and a
promotion-seed checklist instead of executable-looking future work.

**Validation:** targeted `markdownlint` and `prettier --check` passed for the
three discovery plans after alignment. No aggregate `pnpm check` was run by
explicit owner direction for this handoff. No commit was made.

**Next safe step:** do not implement discovery endpoints from these files. If
the owner resumes this thread, first decide whether the near-term Oak value is
to promote Agent Skills Discovery; if yes, ratify the first skill catalogue and
trust model before writing the executable `current/` plan.

## Participating agent identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| Umbral Whispering Silhouette | codex | GPT-5 | 019e83 | promotion-and-root-docs-author | 2026-06-01 | 2026-06-01 |
| Luminous Dancing Aurora | codex | GPT-5 | 019e82 | research-and-plan-author | 2026-06-01 | 2026-06-01 |

## Lane State

- **Owning plans:**
  [`agentic-mechanisms-discovery.plan.md`](../../../plans/discovery/future/agentic-mechanisms-discovery.plan.md),
  [`agent-skills-discovery.plan.md`](../../../plans/discovery/future/agent-skills-discovery.plan.md),
  [`mcp-server-cards.plan.md`](../../../plans/discovery/future/mcp-server-cards.plan.md),
  [`dns-aid-discovery.plan.md`](../../../plans/discovery/future/dns-aid-discovery.plan.md),
  [`aila-a2a-agent-card.plan.md`](../../../plans/discovery/future/aila-a2a-agent-card.plan.md),
  [`webmcp-human-site-operability.plan.md`](../../../plans/discovery/future/webmcp-human-site-operability.plan.md),
  [`web-bot-auth-agent-verification.plan.md`](../../../plans/discovery/future/web-bot-auth-agent-verification.plan.md).
- **Current objective:** keep Oak's agent-facing discovery posture coherent
  across Agent Skills, MCP Server Cards, MCP runtime capability discovery, A2A,
  registry metadata, and generic AI discovery proposals.
- **Current state:** Phase 1 apex/Open API work is promoted to `current/`.
  MCP Server Cards, DNS-AID, Aila A2A, WebMCP, and Web Bot Auth remain gated
  future plans. Root planning docs now make the discovery programme reachable
  from the repo's strategic and operational planning entry points.
- **Blockers / low-confidence areas:** external standards are still moving;
  Oak has not ratified the first public skill catalogue, robots/content-signal
  values, Web Bot Auth posture, DNS-AID scope, Aila A2A exposure, or WebMCP
  product goal.
- **Next safe step:** execute the current plan's verification refresh (`ar1`),
  then proceed through the Phase 1 host-owned tasks.
- **Active track links:** none.
- **Promotion watchlist:** Cloudflare Agent Skills Discovery RFC stability; MCP
  Server Cards SEP stability; Oak public remote MCP server publication; DNS-AID
  draft stability and scope choice; any real Oak-hosted remote agent that would
  make A2A relevant; product decision for browser-native page actions; signed
  agent verification posture for official Oak web apps.

## Standing Decisions

- Skills are workflow guidance, not runtime data authority.
- MCP Server Cards discover server connection metadata, not workflow guidance
  or runtime capability lists.
- MCP runtime remains the source for live tools, resources, prompts, and
  current data access.
- A2A stays watched context until Oak has a real remote agent to advertise.
- Public discovery metadata must not leak internal, tenant-specific,
  user-specific, or runtime-only state.

## Session Shape And Grounding Order

For the next session:

1. Read this thread record.
2. Read
   [`agentic-mechanisms-discovery.plan.md`](../../../plans/discovery/future/agentic-mechanisms-discovery.plan.md).
3. Read the current verification report and relevant child plan for the intended
   slice.
4. Re-check the live official standard before making promotion or
   implementation claims.
5. Keep the plan lifecycle boundary: `current/` is queued executable work;
   `future/` is strategic only.
