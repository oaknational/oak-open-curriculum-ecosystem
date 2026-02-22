# SDK and MCP Enhancements Folder Disposition Ledger

**Last Validated**: 22 February 2026  
**Purpose**: File-by-file disposition authority for `.agent/plans/sdk-and-mcp-enhancements`.

## Policy

1. ADRs are architecture truth.
2. Code is implementation truth.
3. Archived plan files are concept sources only.
4. Active execution should use current execution anchors, not archived numbered plans.

## Dispositions

| Path | Disposition | Authority | Last Validated | Owner | Notes |
| --- | --- | --- | --- | --- | --- |
| `.agent/plans/sdk-and-mcp-enhancements/README.md` | Active governance index | Folder governance | 22 February 2026 | Planning owner | Root execution index and policy statement |
| `.agent/plans/sdk-and-mcp-enhancements/folder-disposition-ledger.md` | Active governance ledger | Folder governance | 22 February 2026 | Planning owner | File-state source of truth |
| `.agent/plans/sdk-and-mcp-enhancements/concept-preservation-and-supersession-map.md` | Active concept map | Folder governance | 22 February 2026 | Architecture owner | Concept preservation and ADR crosswalk |
| `.agent/plans/sdk-and-mcp-enhancements/mcp-extensions-research-and-planning.md` | Active execution plan | Execution anchors | 22 February 2026 | MCP/extensions owner | Post-merge backlog and ADR matrix |
| `.agent/plans/sdk-and-mcp-enhancements/archive/completed/folder-modernisation-meta-plan.md` | Archived completed governance record | Archive policy | 22 February 2026 | Planning owner | Completed orchestration plan retained for provenance |
| `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/01-mcp-tool-metadata-enhancement-plan.md` | Archived legacy concept source | Archive policy | 22 February 2026 | Architecture owner | Legacy numbered plan |
| `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/02-curriculum-ontology-resource-plan.md` | Archived legacy concept source | Archive policy | 22 February 2026 | Architecture owner | Legacy numbered plan |
| `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/03-mcp-infrastructure-advanced-tools-plan.md` | Archived legacy concept source | Archive policy | 22 February 2026 | Architecture owner | Legacy numbered plan |
| `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/04-mcp-prompts-and-agent-guidance-plan.md` | Archived legacy concept source | Archive policy | 22 February 2026 | Architecture owner | Legacy numbered plan |
| `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/04-widget-and-tooling-improvements.md` | Archived legacy concept source | Archive policy | 22 February 2026 | Architecture owner | Legacy numbered plan |
| `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/06-ux-improvements-and-research-plan.md` | Archived legacy concept source | Archive policy | 22 February 2026 | Architecture owner | Legacy numbered plan |
| `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/08b-openai-apps-sdk-part-2-deferred.md` | Archived legacy concept source | Archive policy | 22 February 2026 | Architecture owner | Legacy numbered plan |
| `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/10-quick-wins-from-aila-research.md` | Archived legacy concept source | Archive policy | 22 February 2026 | Architecture owner | Legacy numbered plan |
| `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/11-widget-universal-renderers-plan.md` | Archived legacy concept source | Archive policy | 22 February 2026 | Architecture owner | Legacy numbered plan |
| `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/15a-public-resource-auth-bypass.md` | Archived legacy concept source | Archive policy | 22 February 2026 | Architecture owner | Legacy numbered plan |
| `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/15b-static-widget-shell-optimization.md` | Archived legacy concept source | Archive policy | 22 February 2026 | Architecture owner | Legacy numbered plan |
| `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/16-context-grounding-optimization.md` | Archived legacy concept source | Archive policy | 22 February 2026 | Architecture owner | Legacy numbered plan |
| `.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/18-schema-driven-sdk-adapter-generation-plan.md` | Archived legacy concept source | Archive policy | 22 February 2026 | Architecture owner | Legacy numbered plan |
| `.agent/plans/sdk-and-mcp-enhancements/archive/implemented/17-synonym-enrichment-from-owa-oala.md` | Archived implemented reference | Archive policy | 22 February 2026 | Search owner | Historical implemented plan |
| `.agent/plans/sdk-and-mcp-enhancements/archive/07-widget-playwright-tests-plan.md` | Archived historical reference | Archive policy | 22 February 2026 | Test owner | Legacy archive retained for provenance |
| `.agent/plans/sdk-and-mcp-enhancements/archive/improvements.md` | Archived historical reference | Archive policy | 22 February 2026 | UX owner | Legacy note retained for provenance |
| `.agent/plans/sdk-and-mcp-enhancements/archive/data/ontology-poc-content.json` | Archived data artefact | Archive policy | 22 February 2026 | Data owner | Raw ontology POC artefact |

## Validation Reminder

Run after any folder migration:

```bash
pnpm markdownlint:root
ls -1 .agent/plans/sdk-and-mcp-enhancements | rg '^[0-9].*\.md$'
```
