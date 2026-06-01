# Next-Session Record - `agentic-mechanisms-discovery` thread

## Current Continuation

- Branch: `feat/graph-tooling-tidyup`
- Invocation pointer: continue from this record and the parent plan at
  [`agentic-mechanisms-discovery.plan.md`](../../../plans/discovery/future/agentic-mechanisms-discovery.plan.md).
- Controlling plan:
  [`agentic-mechanisms-discovery.plan.md`](../../../plans/discovery/future/agentic-mechanisms-discovery.plan.md)
  with child plans
  [`agent-skills-discovery.plan.md`](../../../plans/discovery/future/agent-skills-discovery.plan.md)
  and
  [`mcp-server-cards.plan.md`](../../../plans/discovery/future/mcp-server-cards.plan.md).
- Next safe step: owner decision. Either keep the plans in `future/` for
  standards tracking, or promote a narrow Agent Skills Discovery slice only
  after the first skill catalogue, trust model, public domain, and live data/tool
  routes are ratified.
- Completed prerequisites: research report written; Agent Skills Discovery plan
  written; parent Agentic Mechanisms Discovery plan written; MCP Server Cards
  plan aligned with parent/sibling links and promotion-seed wording.
- Recent relevant commits: none from this session; owner requested no commit.
- Team expectation: sole contributor unless the owner explicitly opens a team
  route.
- Acceptance bar: no implementation until a `future/` plan is promoted to
  `current/` with executable TDD cycles and deterministic validation.

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
| Luminous Dancing Aurora | codex | GPT-5 | 019e82 | research-and-plan-author | 2026-06-01 | 2026-06-01 |

## Lane State

- **Owning plans:**
  [`agentic-mechanisms-discovery.plan.md`](../../../plans/discovery/future/agentic-mechanisms-discovery.plan.md),
  [`agent-skills-discovery.plan.md`](../../../plans/discovery/future/agent-skills-discovery.plan.md),
  [`mcp-server-cards.plan.md`](../../../plans/discovery/future/mcp-server-cards.plan.md).
- **Current objective:** keep Oak's agent-facing discovery posture coherent
  across Agent Skills, MCP Server Cards, MCP runtime capability discovery, A2A,
  registry metadata, and generic AI discovery proposals.
- **Current state:** strategic tracking only. The parent plan owns the layer
  map; child plans own standards-specific surfaces. Skills Discovery is the
  likely first promotion candidate if Oak chooses to publish workflow guidance.
- **Blockers / low-confidence areas:** external standards are still moving;
  Oak has not ratified the first public skill catalogue, trust model, public
  domain, or partner-facing publication posture.
- **Next safe step:** owner/product decision on whether to promote Agent Skills
  Discovery to executable planning, or keep all lanes in future tracking.
- **Active track links:** none.
- **Promotion watchlist:** Cloudflare Agent Skills Discovery RFC stability; MCP
  Server Cards SEP stability; Oak public remote MCP server publication; any real
  Oak-hosted remote agent that would make A2A relevant.

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
3. Read the relevant child plan for the intended slice.
4. Re-check the live official standard before making promotion or
   implementation claims.
5. Keep the plan lifecycle boundary: `future/` is strategic only.
