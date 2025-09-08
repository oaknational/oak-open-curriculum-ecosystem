# Workspace Structure Options and Recommendations

Status: Draft for discussion (refinements stage; time‑boxed, minimal changes favored)

## Questions to Answer

- Can apps also be packages? Should apps and packages live in separate folders?
- Does `core` vs `libs` make sense?
- Should we have a top‑level `sdks/` (future multiple SDKs)?
- What should we call MCP servers (apps vs services vs servers)?
- What cohesive, standard layout best supports clarity and onboarding?
- From plan: providers naming, Cloudflare Workers support (web APIs), canonical tiering, onboarding path.

## Option A: Conventional Apps + Packages (current baseline)

- apps/: runnable units (CLI/binaries, servers)
- packages/core/: single core package (contracts/utilities)
- packages/libs/: reusable libraries (logger, transport, env, storage)
- packages/providers/: platform providers (node, workers)
- packages/sdks/: client SDKs (e.g., oak-curriculum-sdk)

Pros

- Familiar monorepo layout; matches many OSS projects
- Clear responsibility boundaries; easy inter‑workspace package imports
- Scales with more SDKs and providers

Cons

- apps vs services naming ambiguity
- providers vs libs can blur if not documented

Recommendation notes

- Keep apps as apps (runnable bundles). They are packages as well (workspace packages), but live under `apps/` for clarity.

## Option B: Domain Buckets by Capability

- servers/: MCP servers and other backends
- clients/: SDKs and CLIs
- core/: contracts/utilities
- adapters/: providers (node/workers)
- libs/: shared libs

Pros

- Groups by capability, clearer for newcomers

Cons

- Diverges from common apps/packages split; more cognitive overhead
- Renames require broad repo churn

## Option C: Flat packages/ with type tags

- packages/: all workspaces with naming convention
  - @oaknational/app-notion-mcp
  - @oaknational/core
  - @oaknational/lib-logger
  - @oaknational/provider-node
  - @oaknational/sdk-curriculum

Pros

- Single place; relies on names for meaning; simplifies tooling

Cons

- Harder to browse; category context in names only
- Editors and scripts lose directory‑based affordances

## Comparative Summary

- Discoverability: A > B > C
- Familiarity: A > C > B
- Future SDKs fit: A≈C > B
- Effort to adopt now: A (lowest, we are already close)

## Recommended Layout (Option A, clarified)

- apps/
  - oak-notion-mcp (MCP server; runnable)
  - oak-curriculum-mcp (MCP server; runnable)
- packages/core/
  - mcp-core (contracts, types, helpers; pure)
- packages/libs/
  - mcp-logger, mcp-env, mcp-storage, mcp-transport (reusable libs)
- packages/providers/
  - mcp-providers-node, mcp-providers-workers (platform adapters)
- packages/sdks/
  - oak-curriculum-sdk (API client)

Naming guidance

- MCP servers are “apps” (runnable). Class name in docs: “MCP server (app)”.
- Providers live in `packages/providers` to set them apart from generic libs.
- SDKs live in `packages/sdks` to scale with future SDKs.

## Rules and Relationships

- Inter‑workspace imports: `@oaknational/*` package specifiers only.
- Intra‑package relatives allowed; avoid private internals.
- Core depends on nothing; libs depend on core; apps depend on libs/core/providers; SDKs depend on libs/core.
- Providers implement `CoreProviders`; core never imports providers.

## Providers Folder Naming (Open Question)

- Keep `providers/` (clear platform adapter meaning)
- Alternatives: `adapters/`, `platforms/`, `runtimes/`
  Suggestion: Stick with `providers/` (most conventional), document clearly in provider-system.md.

## Cloudflare Workers Support (Open Question)

- Action: inventory Node built‑in usage in providers; extract web‑safe surfaces.
- Validation: workers provider + contract tests; CI job targeting workers runtime.

## Canonical Tiering

- apps (servers) → libs → core; providers plug into apps (via core factory) and may be reused by SDK tooling where appropriate.
- Document arrows and ownership in architecture README.

## Onboarding Flow

- Keep onboarding minimal: README → architecture README → provider-system → quick start.
- Link this doc for structure rationale.

## Minimal Changes to Adopt Recommendation

- Create `packages/providers/` (already present for node provider).
- Ensure SDKs live under `packages/sdks/` (curriculum SDK is already there).
- Update docs: architecture README and provider-system links to reflect directories.

## Decision Placeholder

- Adopt Option A clarified as default; revisit naming of `providers/` after Workers POC.
- Track Cloudflare Workers support as a deferred plan (serverless-hosting-plan.md).

## Next Steps (time‑boxed)

1. Confirm `packages/providers/` and `packages/sdks/` placement (no code moves needed if already aligned).
2. Update architecture README with the Recommended Layout and Rules/Relationships.
3. Keep provider-system.md authoritative for DI/runtime composition.
4. Reassess after Workers POC to decide on `providers/` naming.
