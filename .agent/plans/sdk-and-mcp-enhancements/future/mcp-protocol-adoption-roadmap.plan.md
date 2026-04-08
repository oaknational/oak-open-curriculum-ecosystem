---
name: "MCP Protocol Adoption Roadmap"
overview: "Strategic plan for adopting remaining MCP protocol features: resource templates, prompt completion, curriculum asset downloads, and per-primitive icons."
specialist_reviewer: "mcp-reviewer, architecture-reviewer-barney"
isProject: false
todos:
  - id: r1-resource-templates
    content: "Design and implement resource templates for dynamic curriculum access"
    status: pending
  - id: r2-prompt-completion
    content: "Implement completion/complete for prompt argument autocomplete"
    status: pending
  - id: r3-curriculum-downloads
    content: "Expose curriculum asset downloads via MCP App downloadFile and resource links"
    status: pending
  - id: r4-per-primitive-icons
    content: "Add icons to tools, resources, and prompts"
    status: pending
---

# MCP Protocol Adoption Roadmap

**Status**: FUTURE
**Last Updated**: 2026-04-08
**Scope**: Features identified by the MCP protocol audit (2026-04-08) that
are not blocking current work but offer genuine product value.

## Context

The MCP protocol audit against the 2025-06-18 and 2025-11-25 specs
identified four unused feature areas with MEDIUM or higher value. Two
blocking items (server info branding, misconception graph surface) are
tracked in separate active plans. This roadmap captures the remaining
opportunities.

**Source audit**: MCP reviewer grounded in official spec docs
(modelcontextprotocol.io/specification/2025-06-18 and 2025-11-25).

---

## R1: Resource Templates — Dynamic Curriculum Access

**Value**: HIGH
**Spec**: 2025-06-18 `resources/templates/list`

Resource templates enable URI-parameterised access to curriculum data:

```text
curriculum://lesson/{lessonSlug}        → lesson summary, transcript, quiz
curriculum://unit/{unitSlug}            → unit overview with lesson list
curriculum://subject/{subjectSlug}      → subject detail with key stages
curriculum://subject/{subjectSlug}/key-stage/{keyStage} → filtered browse
```

This would make individual curriculum items **directly addressable** as MCP
resources. Clients could bookmark, subscribe to, or inject specific lessons
into context without a tool call. The data is already accessible via
`fetch` and `browse-curriculum` tools — resource templates provide a
declarative alternative that aligns with the MCP resource model.

### Design considerations

- Template URIs use RFC 6570 syntax
- Each template handler calls the same SDK methods as the corresponding
  aggregated tool (no duplicate business logic)
- Resource templates appear in `resources/templates/list` and clients
  resolve them via `resources/read` with the concrete URI
- Combines naturally with `completion/complete` (R2) — clients could
  autocomplete `{lessonSlug}` from the search index

### Prerequisite

Requires design work: which curriculum entities justify direct
addressability? Lesson, unit, and subject seem natural. Thread and
sequence are more niche.

---

## R2: Prompt Argument Completion

**Value**: MEDIUM
**Spec**: 2025-06-18 `completion/complete`

Several prompt arguments have well-known finite value sets:

| Argument | Values | Source |
|----------|--------|--------|
| `keyStage` | ks1, ks2, ks3, ks4 | 4 fixed values |
| `subject` | ~20 subjects | `get-subjects` tool / SDK enum |
| `yearGroup` | year-1 through year-13 | ~13 fixed values |

Implementing `completion/complete` for these would give clients
autocomplete when users invoke prompts like `/find-lessons` or
`/lesson-planning`. The server declares `capabilities.completions`
and handles `completion/complete` requests.

### Design considerations

- Static completions (keyStage, yearGroup) can be hardcoded
- Dynamic completions (subject) should derive from the SDK to stay
  in sync with the OpenAPI schema
- Resource template completions (R1) would also use this mechanism
  for `{lessonSlug}` etc. — potentially search-backed

---

## R3: Curriculum Asset Downloads via MCP

**Value**: HIGH
**Spec**: MCP Apps `app.downloadFile()` + MCP resource `ResourceLink`

Oak lessons include downloadable assets (slides, worksheets, PDFs). The
`download-asset` aggregated tool currently returns a signed URL. Two
additional surfaces could improve the UX:

### R3a: MCP App `downloadFile()` integration

The MCP Apps SDK provides `app.downloadFile({ contents: [...] })` which
delegates downloads to the host, bypassing iframe sandbox restrictions.
Contents can be:

- `EmbeddedResource` — inline text or base64 blob
- `ResourceLink` — URL the host fetches on behalf of the app

For curriculum PDFs with stable public URLs, `ResourceLink` is preferred.
Requires `app.getHostCapabilities()?.downloadFile` check.

Already tracked as B4 in `ws3-mcp-apps-sdk-audit.plan.md` (deferred to
Phase 5). This plan provides the design context.

### R3b: Resource links in tool responses

Tool responses can include `ResourceLink` content blocks referencing
downloadable assets. Hosts with download support can render these as
download buttons. This complements the existing signed-URL approach
with a protocol-native alternative.

### Design considerations

- Asset URLs may require signed tokens (time-limited)
- The `download-asset` tool already handles signing — the question is
  whether to return `ResourceLink` in the tool response alongside the
  current text response
- MCP App `downloadFile()` is a client capability — must be gated

---

## R4: Per-Primitive Icons

**Value**: LOW-MEDIUM
**Spec**: 2025-11-25 `BaseMetadata.icons`

Tools, resources, and prompts all support an `icons` array:

```typescript
icons?: Array<{
  src: string;
  mimeType?: string;
  sizes?: string[];
  theme?: 'light' | 'dark';
}>;
```

Client support is nascent but growing. For a curriculum server with
~25 structurally similar read-only tools, per-tool icons add limited
differentiation. More useful on resources (visual distinction between
curriculum model, prerequisite graph, and documentation) and prompts
(workflow icons in slash-command menus).

### Design considerations

- Server-level icons (active plan: server-info-branding) provide more
  value and should land first
- Per-primitive icons should use a consistent Oak icon set
- Could generate category-based icons (search tools → magnifying glass,
  browse tools → folder, graph tools → network)
- SVG data URIs keep everything self-contained (no CDN dependency)

---

## Priority and sequencing

```text
ACTIVE (blocking PR #76):
  server-info-branding.plan.md          ← server-level branding

ACTIVE (post-merge):
  misconception-graph-mcp-surface.plan.md ← new MCP surface + doc annotations

FUTURE (this plan):
  R1: Resource templates                 ← highest value, needs design
  R3: Curriculum asset downloads         ← high value, pairs with Phase 5
  R2: Prompt completion                  ← medium value, straightforward
  R4: Per-primitive icons                ← low-medium, cosmetic
```

R1 and R3 are the strongest candidates for promotion. R1 requires design
work on which entities to template. R3 dovetails with Phase 5 (interactive
search widget) where users browse and download lesson assets.

## Related

- [server-info-branding.plan.md](server-info-branding.plan.md) — active
- [misconception-graph-mcp-surface.plan.md](misconception-graph-mcp-surface.plan.md) — active
- [ws3-mcp-apps-sdk-audit.plan.md](ws3-mcp-apps-sdk-audit.plan.md) — B4 downloadFile
- [ws3-phase-5-interactive-user-search-view.plan.md](ws3-phase-5-interactive-user-search-view.plan.md) — search UI
- MCP spec: modelcontextprotocol.io/specification/2025-06-18
- MCP spec: modelcontextprotocol.io/specification/2025-11-25
