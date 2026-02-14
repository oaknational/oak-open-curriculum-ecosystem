# Oak Curriculum SDK Documentation Pipeline Guide

This guide explains how the SDK generates documentation in multiple formats (HTML, JSON, Markdown, and an AI-friendly single file), how to run it, and how to extend the renderer.

## Overview

Outputs are produced from a single source of truth: TypeDoc JSON generated from the SDK source code.

- HTML docs: `packages/oak-curriculum-sdk/docs/api/`
- TypeDoc JSON: `packages/oak-curriculum-sdk/docs/api/typedoc.json`
- Markdown API docs: `packages/oak-curriculum-sdk/docs/api-md/*.md`
- AI single-file reference (canonical): `packages/oak-curriculum-sdk/docs/api/AI-REFERENCE.md`

The pipeline is plugin-free for the Markdown generation steps and uses small, pure TypeScript helpers.

## Docs structure (authored vs generated)

- Authored docs (hand-written): `docs/*.md` (conceptual guides, usage, decisions).
- Generated docs (build artefacts): `docs/api/**`, `docs/api-md/**`, and `docs/api/typedoc.json`.

### MCP tools deep-dive (authored + generated)

- Authored overview: `docs/mcp/README.md` explains that most MCP tools are thin facades over the Oak Open Curriculum API endpoints, with links back to the relevant SDK functions and types.
- Generated API docs intentionally exclude MCP internals from the main tree to keep the public surface focused and readable.
- For the curious, the authored overview links to MCP-specific deep-dive pages and references to the underlying schema-driven types.

## Prerequisites

- Node.js >= 22
- pnpm

## Commands

From the repo root:

```bash
# Generate HTML docs (TypeDoc UI)
pnpm -F @oaknational/curriculum-sdk -s docs:api:html

# Generate TypeDoc JSON only
pnpm -F @oaknational/curriculum-sdk -s docs:api:json

# Generate AI-focused single-file reference from JSON + generated artifacts
pnpm -F @oaknational/curriculum-sdk -s docs:ai

# Generate Markdown API docs (multi-file) from JSON
pnpm -F @oaknational/curriculum-sdk -s docs:api:md

# Verify outputs (HTML index, JSON, AI doc, and Markdown files)
pnpm -F @oaknational/curriculum-sdk -s docs:verify

# Run the full pipeline (HTML + AI + MD + verify)
pnpm -F @oaknational/curriculum-sdk -s docs:all
```

## Output Map

- HTML: `docs/api/index.html`
- JSON: `docs/api/typedoc.json`
- Markdown: `docs/api-md/index.md`, `functions.md`, `interfaces.md`, `types.md`, `variables.md`, `references.md`
- AI reference: `docs/api/AI-REFERENCE.md`

### Type aliases rendering

Type aliases are rendered as a code block with the underlying type and a source link, for example:

````md
### HttpMethod

```ts
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
```

Source: [validation/types.ts:38](…)
````

Unknown/complex TypeDoc node kinds fall back to a compact placeholder like `<reflection>(…)`, keeping the pipeline resilient.

## Authoring TSdoc/JSDoc

Comments on symbols flow into the outputs. For best results:

```ts
/**
 * Result type for validation operations
 * Discriminated union for type-safe error handling
 *
 * @example
 * validate(input)
 *   .map(x => process(x))
 *   .mapLeft(err => console.error(err))
 */
export type ValidationResult = …
```

- Use `@example` for code snippets; they appear in Markdown and AI docs.
- Keep descriptions concise and actionable.

## Extending the renderer

- JSON schemas and types: `type-gen/lib/ai-doc-types.ts`
- Type formatting helpers: `type-gen/lib/type-format.ts` (exports `typeToString()`)
- Markdown rendering helpers: `type-gen/lib/ai-doc-render.ts`
- Multi-file Markdown generator: `type-gen/generate-markdown-docs.ts`
- AI single-file generator: `type-gen/generate-ai-doc.ts`
- Verification: `type-gen/verify-docs.ts`

Add support for additional TypeDoc node kinds in `type-format.ts` if needed. Avoid broad assertions; prefer small type guards.

## Troubleshooting

- TypeDoc warns about unsupported TypeScript versions: non-blocking; see the repo decision log for future upgrades.
- `typedoc.json` missing: run `docs:api:json` first or `docs:all`.
- JSON validation errors: the Zod schema accepts unknown TypeDoc node kinds via a fallback; if you hit a failure, ensure generation ran with the `*.ai.json` options or open an issue.
- Docs diff in CI: run the full pipeline locally and commit intentional updates.

## CI Integration

A CI workflow runs `docs:all` and fails PRs if verification fails or content changes unexpectedly. Ensure local docs are regenerated and committed when making API or comment changes.

## References

- GO.md: `/.agent/directives/GO.md`
- AGENT.md: `/.agent/directives/AGENT.md`
- TypeDoc: <https://typedoc.org/>

## FAQ

- Q: Where do I see the improved Type alias rendering?
  - A: `docs/api-md/types.md` and the AI reference contain the formatted output with source links.
- Q: Can I add new sections to AI reference?
  - A: Edit `type-gen/generate-ai-doc.ts` to include additional groupings or summaries.
