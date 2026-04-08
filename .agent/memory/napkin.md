## Napkin rotation — 2026-04-07

Rotated at 562 lines after P1b validation + P2 SDK alignment
+ documentation/infrastructure pass. Archived to
`archive/napkin-2026-04-07.md`. Merged 2 new entries into
`distilled.md`: MCP Apps CSP content-item placement, contrast
pairing usage context. Graduated 3 entries: `unknown` rule
(already marked), Zod v4 `.merge()` (already marked),
cross-workspace token dev loop (documented in widget
`vite.config.ts` TSDoc + README). Extracted 0 new patterns
(candidates assessed but none met all 4 barrier criteria —
most were domain-specific or single-occurrence). Previous
rotation: 2026-04-06 at 559 lines.

---

### Session 2026-04-08a — MCP protocol audit + tool naming

#### Surprises

**S1: `get-curriculum-model` had an unintended `tool_name` parameter.**
Expected: parameterless orientation tool. Actual: accepted an optional
`tool_name` string that retrieved per-tool help via `getToolSpecificHelp()`.
User confirmed this was never intended — per-tool info is already on each
tool's own description. Removed the parameter, deleted dead
`tool-help-lookup.ts` module and 15 tests.

**S2: MCP spec has two locations for tool display names.**
Expected: `annotations.title` was the canonical field. Actual: the
2025-11-25 spec added a top-level `title` on `BaseMetadata` (shared
across tools, resources, prompts, and server Implementation). The older
`annotations.title` (2025-06-18) remains supported. Our projection now
chains: `tool.title` → `tool.annotations.title` → `tool.name`.

**S3: Generated tools have no human-friendly title at all.**
Expected: generated tools would have titles from the codegen. Actual:
neither `title` nor `annotations.title` is set — the projection falls
back to `tool.name` (kebab-case like `get-lessons-summary`). Hosts
display these machine identifiers to users. Deferred to a codegen
template change.

**S4: 12,858 misconceptions exist but have no MCP surface.**
Expected: misconceptions would be exposed like prerequisites. Actual:
the full data pipeline exists (extractor, generator, typed loader, 6MB
JSON with 20 subjects) but no tool or resource exposes it. Plan created.

**S5: Server `Implementation` only declares `name` and `version`.**
Expected: would include branding. Actual: `icons`, `title`,
`description`, `websiteUrl` all supported by SDK v1.28.0 but not set.
Every MCP host shows "oak-curriculum-http v0.1.0" with no branding.

#### Corrections

- "Get Curriculum Model" → "Oak Curriculum Overview" (teacher-friendly)
- `annotations.title` kept for backwards compatibility but top-level
  `title` is now the primary field per 2025-11-25 spec

**S6: Vercel preview has doubled `dist/dist/` path for widget HTML.**
The error `ENOENT: no such file or directory, open '/var/task/apps/oak-curriculum-mcp-streamable-http/dist/dist/oak-banner.html'`
occurs when `get-curriculum-model` (or any widget tool) is called in
Claude Desktop against the Vercel preview. Root cause: `register-resources.ts`
line 156 uses `resolve(import.meta.dirname, '../dist/oak-banner.html')`.
Locally, `import.meta.dirname` is `src/` so `../dist/` resolves correctly.
On Vercel, tsup bundles to `dist/` so `import.meta.dirname` is already
`dist/`, and `../dist/` becomes `dist/dist/`. The fix needs to account
for the Vercel bundle layout where the built JS runs from `dist/` and
the widget HTML is a sibling in the same `dist/` directory.
Preview URL: `poc-oak-open-curriculum-mcp-git-feat-mcpappui.vercel.thenational.academy`
Vercel deployment: `vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp/6jMHDLVbDvoP8Awp3AB5AXoo4SVX`
Log: `lk99p-1775627562768-61fab88abdd6`

#### Decisions

- Server-info-branding plan is **blocking for PR #76 merge**
- Misconception graph MCP surface is **post-merge**
- Resource templates, prompt completion, per-primitive icons are **future**
- Generated tool titles deferred to codegen template change
