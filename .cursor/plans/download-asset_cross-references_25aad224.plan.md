---
name: download-asset cross-references
overview: Add cross-references from `get-lessons-assets` to `download-asset` across all four MCP guidance surfaces — tool descriptions, workflow data, documentation resources, and prompt messages — so agents discover the two-step download flow naturally.
todos:
  - id: fix-asset-download-note
    content: Update ASSET_DOWNLOAD_NOTE in tool-description.ts to cross-reference download-asset
    status: completed
  - id: regenerate-tool-defs
    content: Run pnpm sdk-codegen to regenerate tool definitions with updated note
    status: completed
  - id: add-workflow-step
    content: Add download-asset step 6 to lessonPlanning workflow in tool-guidance-workflows.ts
    status: completed
  - id: update-quick-start
    content: Add download step to Quick Start in documentation-resources.ts
    status: completed
  - id: update-prompt-messages
    content: Update lesson-planning prompt in mcp-prompt-messages.ts to include download-asset
    status: completed
  - id: quality-gates
    content: "Run full quality gates: sdk-codegen, build, type-check, lint, test"
    status: completed
  - id: review-mcp
    content: Invoke mcp-reviewer for MCP protocol surface compliance (tools, resources, prompts)
    status: completed
  - id: review-code
    content: Invoke code-reviewer on all changed files
    status: completed
  - id: review-docs
    content: Invoke docs-adr-reviewer for documentation drift check
    status: completed
  - id: remediate-findings
    content: Address any blocking findings from reviewers
    status: completed
isProject: false
---

# Add download-asset Cross-References to MCP Guidance

## Problem

When an agent calls `get-lessons-assets`, the tool description actively steers it to "direct users to the lesson page on the Oak website for downloads" — making no mention of the `download-asset` tool that generates clickable download links. The `lessonPlanning` workflow and the `lesson-planning` prompt also stop at `get-lessons-assets` without a follow-on step. This means agents consistently fail to use `download-asset` even when a user explicitly asks for download links.

## MCP Spec Context

Per the [MCP Tools specification](https://modelcontextprotocol.io/docs/concepts/tools), tools are **model-controlled** — "the language model can discover and invoke tools automatically based on its contextual understanding." The tool `description` field is the primary mechanism for this discovery. When a description actively directs the agent away from a companion tool, the model cannot discover the intended two-step workflow.

Per the [MCP Resources specification](https://modelcontextprotocol.io/docs/concepts/resources), resources provide context that helps models understand how to use tools together. Our `docs://oak/workflows.md` and `docs://oak/getting-started.md` resources serve this role — they must accurately describe complete workflows.

Per the [MCP Prompts specification](https://modelcontextprotocol.io/docs/concepts/prompts), prompts are **user-controlled** templates that "provide structured messages and instructions for interacting with language models." The `lesson-planning` prompt guides the model through a full lesson-planning flow and must include the download step.

## Four Surfaces to Fix

The download workflow guidance must appear in all four places an agent might encounter it:

### 1. Tool description — `ASSET_DOWNLOAD_NOTE` (highest leverage)

**File**: `[packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts](packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts)` (lines 97-99)

**Current** (the `ASSET_DOWNLOAD_NOTE` constant appended to `get-lessons-assets`, `get-key-stages-subject-assets`, and `get-sequences-assets`):

```
NOTE: The asset `url` fields returned by this tool are authenticated API endpoints
and cannot be used as direct browser download links. All lesson assets ... are
freely downloadable on the Oak website. Direct users to the lesson page on the
Oak website for downloads — use the lesson's `canonicalUrl` ...
```

**Change**: Replace the "Direct users to the lesson page" instruction with a cross-reference to `download-asset`, keeping the website as a fallback:

```
NOTE: The asset `url` fields returned by this tool are authenticated API endpoints
and cannot be used as direct browser download links. To generate a clickable
download link for the user, call the `download-asset` tool with the lesson slug
and asset type. If `download-asset` is not available (e.g. stdio transport),
direct users to the lesson page on the Oak website — use the lesson's
`canonicalUrl` (e.g. `https://www.thenational.academy/teachers/lessons/{lessonSlug}`).
```

**Why this is highest leverage**: The MCP spec says tools are model-controlled via their `description`. This is the exact moment the agent decides what to do next — and the current text sends it down the wrong path.

**Regeneration**: After editing, run `pnpm sdk-codegen` to regenerate the tool definition files.

### 2. Workflow data — `lessonPlanning` workflow

**File**: `[packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows.ts](packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows.ts)` (lines 77-118)

**Change**: Add a step 6 to the `lessonPlanning` workflow:

```typescript
{
  step: 6,
  action: 'Generate clickable download links for the user',
  tool: 'download-asset',
  example: 'download-asset({ lesson: "adding-fractions", type: "slideDeck" })',
  returns: 'Short-lived download URL the user can click to save the asset directly',
  note: 'Available on HTTP transport only. Call once per asset type the user wants.',
},
```

This flows automatically into two downstream surfaces:

- The `get-curriculum-model` tool output (via `curriculum-model-data.ts` -> `tool-guidance-data.ts` -> `toolGuidanceWorkflows`)
- The `docs://oak/workflows.md` MCP resource (via `getWorkflowsMarkdown()` in `documentation-resources.ts`)

### 3. Documentation resources — Quick Start

**File**: `[packages/sdks/oak-curriculum-sdk/src/mcp/documentation-resources.ts](packages/sdks/oak-curriculum-sdk/src/mcp/documentation-resources.ts)` (lines 82-85 in `getGettingStartedMarkdown()`)

**Change**: Update the Quick Start section to include the download step:

```markdown
## Quick Start

1. **Search for lessons**: Use the `search` tool to find lessons by topic
2. **Browse curriculum**: Use `get-subjects` and browsing tools to explore structure
3. **Fetch content**: Use `fetch` or specific tools to get detailed lesson content
4. **Download assets**: Use `get-lessons-assets` then `download-asset` for clickable download links
```

This updates the `docs://oak/getting-started.md` MCP resource content.

### 4. Prompt messages — `lesson-planning` prompt

**File**: `[packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompt-messages.ts](packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompt-messages.ts)` (lines 69-98 in `getLessonPlanningMessages`)

**Change**: In the `getLessonPlanningMessages` function, update the steps and output bullets:

Steps section (add step 7):

```
6. Get available assets (slides, worksheets)
7. Use download-asset to generate clickable download links for any assets the user wants
```

Output bullets (update last bullet):

```
- Clickable download links for requested resources (use download-asset)
```

## Non-Goals

- Not changing the `download-asset` tool definition itself (already well-described)
- Not adding a standalone "download assets" workflow (covered by the lessonPlanning workflow step)
- Not changing `find-lessons`, `explore-curriculum`, or `learning-progression` prompts (asset download is a lesson-planning concern)

## Execution Order

### Phase 1: Implement changes

1. Edit `ASSET_DOWNLOAD_NOTE` in `tool-description.ts`
2. Run `pnpm sdk-codegen` to regenerate tool definitions
3. Edit `lessonPlanning` workflow in `tool-guidance-workflows.ts`
4. Edit Quick Start in `documentation-resources.ts`
5. Edit `lesson-planning` prompt in `mcp-prompt-messages.ts`

### Phase 2: Quality gates

Run all gates after changes:

1. `pnpm sdk-codegen` — regenerate tool definitions from the updated `ASSET_DOWNLOAD_NOTE`
2. `pnpm format` — formatting
3. `pnpm type-check` — verify no type errors (24/24 workspaces)
4. `pnpm lint` — verify no lint errors
5. `pnpm test` — verify no test regressions
6. `pnpm build` — verify all workspaces build (14/14)
7. Manual verification: read the generated `get-lessons-assets.ts` tool definition to confirm the cross-reference appears

### Phase 3: Reviewer invocations

Invoke three specialist reviewers in parallel (all read-only):

1. `**mcp-reviewer**` — MCP protocol surface compliance review. Focus areas:

- Tool descriptions follow MCP spec guidance (model-controlled discovery via `description` field)
- Resource content (`docs://oak/workflows.md`, `docs://oak/getting-started.md`) accurately reflects tool capabilities
- Prompt messages (`lesson-planning`) guide the model through a complete workflow per MCP prompts spec
- Cross-tool workflow consistency (no conflicting guidance across surfaces)
- Transport-awareness (download-asset is HTTP-only; guidance handles stdio fallback)

1. `**code-reviewer**` — Code quality and maintainability review. Focus areas:

- All four changed files
- Consistency of new text with existing description patterns
- No dead code or stale references introduced
- TSDoc accuracy on the `ASSET_DOWNLOAD_NOTE` constant

1. `**docs-adr-reviewer**` — Documentation drift review. Focus areas:

- Tool description accurately reflects runtime behaviour
- Workflow step accurately describes download-asset capabilities and constraints
- Quick Start progression is coherent (search -> browse -> fetch -> download)
- Prompt message step numbering and output bullets are consistent
- No documentation elsewhere in the repo contradicts the new guidance

### Phase 4: Remediation

Address any blocking findings from reviewers. Re-run quality gates if changes are made.

## Risk Assessment

| Risk                                                      | Likelihood | Impact | Mitigation                                                                       |
| --------------------------------------------------------- | ---------- | ------ | -------------------------------------------------------------------------------- |
| Existing tests assert on ASSET_DOWNLOAD_NOTE text         | Low        | Medium | Search for test assertions on the note text before editing; update if found      |
| Workflow step count change breaks downstream consumers    | Very Low   | Low    | Workflow data is consumed as structured JSON — step count is not constrained     |
| stdio transport agents confused by download-asset mention | Low        | Low    | Note explicitly says "If download-asset is not available (e.g. stdio transport)" |

## Foundation Alignment

- **principles.md**: Document Everywhere — all four MCP guidance surfaces updated consistently
- **schema-first-execution.md**: All content is static, added at SDK compile time; no runtime changes
- **testing-strategy.md**: No new runtime logic introduced; changes are to static description strings
