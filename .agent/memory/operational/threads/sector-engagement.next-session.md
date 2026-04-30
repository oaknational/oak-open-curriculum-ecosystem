# Next-Session Record — `sector-engagement` thread

**Last refreshed**: 2026-04-29 (Pearly Swimming Atoll / codex / GPT-5 /
`019dd9` — repo-goal narrative refresh aligned public, technical, planning,
Practice, and ADR current-framing surfaces around Oak's wider sector impact,
MCP Apps exploration, hybrid search, knowledge graphs, reusable primitives,
and the self-improving Practice.)

**Prior refresh**: 2026-04-29 (Squally Diving Anchor / codex / GPT-5 /
`019dd8` — sector-engagement taxonomy created and committed as `33b25495`,
then session handoff/light consolidation captured the impact framing and PR
lifecycle skill follow-up.)

---

## Thread Identity

- **Thread**: `sector-engagement`
- **Thread purpose**: Plans, reviews, and partner-facing support surfaces for
  helping external organisations use Oak's open curriculum infrastructure, and
  for deciding how external education data sources should inform Oak's work.
- **Branch**: `fix/build_issues` (planning/docs lane; not the branch-primary
  TS6/Vercel release lane)

## Participating Agent Identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Pearly Swimming Atoll` | `codex` | `GPT-5` | `019dd9` | `repo-goal-narrative-refresh` | 2026-04-29 | 2026-04-29 |
| `Squally Diving Anchor` | `codex` | `GPT-5` | `019dd8` | `sector-engagement-taxonomy-and-handoff` | 2026-04-29 | 2026-04-29 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; matching platform/model/agent_name updates
`last_session`.

---

## Landing Target (per PDR-026)

Landed: the repo-goal narrative now names the sector-impact goal across live
reader-facing surfaces. Oak's openly licenced, fully sequenced and resourced
curriculum is framed as a public sector asset exposed through the Curriculum
SDK, MCP server, MCP Apps, OpenAPI-to-MCP pipeline, hybrid semantic search,
and knowledge graph surfaces, with the Practice described as the reusable
agentic-first engineering framework that keeps the work plain-text and
vendor-portable.

Evidence:

- [Root README](../../../README.md)
- [Vision](../../../docs/foundation/VISION.md)
- [Sector Engagement](../../../plans/sector-engagement/README.md)
- [Sector Engagement Roadmap](../../../plans/sector-engagement/roadmap.md)
- [SDK and MCP Enhancements](../../../plans/sdk-and-mcp-enhancements/README.md)
- [Semantic Search](../../../plans/semantic-search/README.md)
- [Knowledge Graph Integration](../../../plans/knowledge-graph-integration/README.md)
- [MCP server README](../../../../apps/oak-curriculum-mcp-streamable-http/README.md)
- [Curriculum SDK README](../../../../packages/sdks/oak-curriculum-sdk/README.md)
- [Search CLI README](../../../../apps/oak-search-cli/README.md)
- [Search SDK README](../../../../packages/sdks/oak-search-sdk/README.md)

Validation evidence:

- `pnpm format:root`
- `pnpm markdownlint:root`
- `git diff --check`
- `pnpm agent-tools:collaboration-state -- check`
- `rg` sweeps for requested concepts and unwanted reader-facing
  `openly licensed` / `licensed` drift in touched live surfaces

## Next Landing Target

No implementation landing is queued by this handoff. The next sector-
engagement session should choose one concrete impact target before promoting
execution:

1. turn the OEAI review into a partner call brief or explicit no-go;
2. promote Oak OpenAPI / KG convergence into an architecture decision brief;
3. promote one external data-source demonstration into a current plan; or
4. write an adoption/support playbook for external organisations using Oak KG,
   SDK, MCP, semantic-search, or pipeline resources.

## Session Shape and Grounding Order

1. Read
   [repo-continuity](../repo-continuity.md#active-threads) and this thread
   record.
2. Read the sector-engagement
   [collection README](../../../plans/sector-engagement/README.md) and
   [roadmap](../../../plans/sector-engagement/roadmap.md).
3. Read the sub-thread that matches the owner-selected landing:
   [OEAI](../../../plans/sector-engagement/oeai/README.md),
   [external knowledge sources](../../../plans/sector-engagement/external-knowledge-sources/README.md),
   [knowledge graph adoption](../../../plans/sector-engagement/knowledge-graph-adoption/README.md),
   or the relevant `future/` brief.
4. Re-read the owning engineering collection before writing implementation
   work. Sector engagement owns impact and support framing; engineering
   collections own executable delivery.
5. Re-check live branch state before claiming aggregate gates, because this
   thread was created on `fix/build_issues` while the branch also carried
   TS6/Vercel release work.

## Lane State

### Owning Plans

- [Sector Engagement Roadmap](../../../plans/sector-engagement/roadmap.md)
- [OEAI Thread](../../../plans/sector-engagement/oeai/README.md)
- [External Knowledge Sources](../../../plans/sector-engagement/external-knowledge-sources/README.md)
- [Knowledge Graph Adoption](../../../plans/sector-engagement/knowledge-graph-adoption/README.md)
- [Oak OpenAPI Monorepo Integration](../../../plans/sector-engagement/future/oak-openapi-monorepo-integration.plan.md)
- [Oak Curriculum Ontology Workspace Reassessment](../../../plans/knowledge-graph-integration/future/oak-curriculum-ontology-workspace-reassessment.plan.md)

### Current Objective

Clarify how Oak's open curriculum infrastructure becomes useful outside Oak:
which public resources should be reusable, what support external organisations
need, which external datasets or knowledge graphs are worth ingesting, and
which repo-boundary decisions are needed to bring API, MCP, semantic search,
and knowledge-graph work together.

### Current State

- Sector engagement is now a top-level plan collection.
- Existing external material has been triaged and rehomed.
- Live repo-purpose surfaces now make the sector-impact goal explicit, including
  MCP Apps in Claude Cowork and ChatGPT, developer-tool use of the MCP server,
  OpenAPI-to-MCP pipeline reuse, hybrid search, and knowledge graph surfaces.
- OEAI has an initial read-only review but no adoption or engagement decision.
- Internal Oak KG integration remains under `knowledge-graph-integration/`.
- External KG adoption and external KG/source ingestion have distinct homes
  under sector engagement.
- Oak OpenAPI monorepo integration and Oak curriculum ontology workspace
  reassessment are future decision briefs, not executable implementation plans.

### Blockers / Low-Confidence Areas

- Partner needs are not yet prioritised; do not assume OEAI, KG adoption, or
  OpenAPI convergence is the next impact target without owner selection.
- The ontology workspace decision is reopened for organisational-priority
  reasons, but the Python-in-TypeScript-monorepo cognitive-load concern remains
  real evidence to resolve, not a footnote.
- External organisation support depends on licensing, governance, security,
  documentation, and operational maturity of the relevant Oak resource.

### Next Safe Step

Ask the owner which sector impact target should become executable. Then promote
exactly that target to `current/` with acceptance criteria framed around the
external user or organisation, not merely around internal file movement.

### Active Track Links

None.

### Promotion Watchlist

- OEAI follow-up may become a partner call brief, support playbook, or no-go
  decision.
- API/KG convergence may require an ADR or architecture plan if repo topology
  or workspace boundaries change.
- External organisation support patterns may become reusable sector-engagement
  playbook templates after the first concrete partner support case.
