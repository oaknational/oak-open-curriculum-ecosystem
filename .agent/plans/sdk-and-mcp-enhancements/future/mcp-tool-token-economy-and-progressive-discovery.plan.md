# MCP Tool Token Economy and Progressive Discovery

**Status**: Future strategic brief
**Last Updated**: 2026-04-28

## Problem and Intent

Cloudflare's Code Mode work shows that MCP token cost can be reduced by at
least two orders of magnitude when large tool surfaces are exposed through
progressive discovery and sandboxed execution rather than exhaustive tool
definitions. Oak's current surface is much smaller than Cloudflare's API, but
the pattern matters because Oak is already moving toward generated tools,
external curriculum APIs, graph surfaces, and richer MCP Apps.

This brief records how the reduction works and how the pattern could apply to
Oak. It is strategic context only. Execution decisions are finalised only when
this is promoted to `current/` or `active/`.

## Product Use-Case Hierarchy

The Oak MCP server's primary product use case is supporting end users such as
teachers as they explore, understand, and use Oak's curriculum. Tool economy
work must therefore optimise for teacher-facing curriculum journeys first:
finding lessons, browsing units, understanding progression, retrieving
materials, and using curriculum context inside assistant hosts.

Supporting engineers who are building ed-tech products is also real and
important, but secondary for the MCP server. The SDK speaks more directly to
that engineering use case: typed access, generated clients, direct API
integration, and product-development workflows.

This distinction changes how Code Mode should be interpreted for Oak. A
Cloudflare-style API-management workflow is most directly comparable to the SDK
and engineering case. For the MCP server, the higher-value application is
progressive curriculum discovery and compact result handling that helps
teachers complete curriculum tasks without forcing the model to carry every
tool schema or every intermediate result.

## Source Review

Primary sources reviewed:

1. <https://blog.cloudflare.com/code-mode-mcp/>
2. <https://blog.cloudflare.com/enterprise-mcp/>
3. <https://developers.cloudflare.com/agents/api-reference/codemode/>
4. <https://www.anthropic.com/engineering/code-execution-with-mcp>
5. <https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/code-execution-tool>

## How the Token Reduction Works

The pattern is not mainly compression. It changes where capability detail
lives:

1. Keep full tool/API schemas server-side.
2. Expose a tiny fixed tool surface, usually `search` and `execute`.
3. Let the model write code to inspect only the schema fragments it needs.
4. Let the model write code to call multiple tools or endpoints in one
   sandboxed execution.
5. Return only the filtered, task-relevant result to the model.

Cloudflare's single-API version exposes the whole Cloudflare API through two
tools while keeping the token footprint around 1,000 tokens. Its portal version
collapses multiple upstream MCP servers into two portal tools:
`portal_codemode_search` and `portal_codemode_execute`.

Anthropic's parallel framing names the same mechanism as code execution with
MCP: tools become code APIs, the agent loads definitions on demand, and large
intermediate results can be filtered in the execution environment before they
enter the model context.

## Current Oak Fit

Oak already has unusually good prerequisites:

1. `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/definitions.ts`
   contains 24 generated OpenAPI-backed tool descriptors.
2. `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts`
   currently defines 11 aggregated tool names, for 35 total HTTP-universal
   tools when combined with the generated set.
3. `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/list-tools.ts`
   is the canonical list surface consumed by the HTTP server registration path.
4. `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` registers every
   universal tool with `registerTool` or `registerAppTool`.
5. [`../current/output-schemas-for-mcp-tools.plan.md`](../current/output-schemas-for-mcp-tools.plan.md)
   is already queued to make `structuredContent` contracts machine-visible.
6. [`../active/upstream-api-reference-metadata.plan.md`](../active/upstream-api-reference-metadata.plan.md)
   is already positioned to add method/path/status metadata to generated
   descriptors.

Those points mean Oak can generate a compact discovery index without
hand-authoring tool metadata. The same schema-first rule that protects the
current MCP tools should protect any future token-efficient surface.

## Domain Boundaries

In scope:

1. Token cost of `tools/list` and tool-definition loading.
2. Token cost of intermediate MCP results, especially search, graph, and
   curriculum-model payloads.
3. Generated progressive-discovery indexes for tools and OpenAPI operations.
4. Teacher-facing curriculum workflows as the primary measurement target.
5. Engineering/API workflows as a secondary measurement target, with the SDK as
   the more direct product surface.
6. Cloudflare portal Code Mode as the preferred first evaluation path.
7. Measurement harnesses for current and candidate token footprints.

Out of scope:

1. Adding an unsandboxed `execute(code)` tool to the Vercel Node server.
2. Replacing existing generated descriptors with hand-authored tool docs.
3. Hiding tools without an explicit product/access decision.
4. Treating current 35-tool overhead as if it had the same scale as a
   2,500-endpoint API.
5. Letting developer/API ergonomics displace the teacher-facing curriculum
   exploration path as the MCP server's primary design target.

## Application Patterns for Oak

### Pattern 1: Measure Before Re-architecting

Create a repeatable token-footprint harness that records:

1. current `tools/list` token cost for all HTTP-universal tools;
2. a two-tool Code Mode / portal-style surface estimate;
3. representative teacher-facing workflow cost, including intermediate result
   tokens;
4. representative engineering/API workflow cost as a secondary comparison;
5. result-size hotspots by tool.

This is the simplest first move and avoids architecture driven by borrowed
numbers.

### Pattern 2: Generator-Owned Discovery Index

Generate a compact tool catalogue from the same descriptor source as
`listUniversalTools()`:

1. `name`, `title`, short purpose, operation id, method/path where present;
2. shallow parameter list without full nested schemas;
3. security/read-write/sensitivity hints;
4. result shape summary once output schemas land;
5. detail levels: names only, name plus description, full schema for selected
   tools.

This mirrors Anthropic's `search_tools` detail-level recommendation while
preserving Oak's schema-first contract.

### Pattern 3: Cloudflare Portal Code Mode First

If Cloudflare MCP server portals are available to Oak, evaluate whether the
portal can front the existing Oak MCP server and expose only the two portal
Code Mode tools. That would keep sandboxing, policy, audit, and progressive
discovery in the Cloudflare layer rather than adding generated-code execution
to Oak's application runtime.

### Pattern 4: Result Filtering Before Model Context

For large outputs, especially search and graph tools, investigate server-side
or sandbox-side projection:

1. callers ask for fields, limits, or summaries;
2. code-mode execution can filter intermediate results;
3. final model-visible output is compact;
4. full data remains reachable only through explicit resources or follow-up
   calls where appropriate.

This addresses the second token problem: intermediate results, not just tool
definition bloat.

### Pattern 5: No Oak-Owned Code Executor Without the Security Gate

An Oak-owned `execute(code)` tool should be blocked until the Cloudflare MCP
security gate or an equivalent sandbox decision is satisfied. Required
properties include isolation, no ambient secrets, host-side auth injection,
resource limits, audit logging, output limits, and deterministic failure modes.

## Dependencies and Sequencing Assumptions

1. The output-schemas plan should land before a full discovery index promises
   result shapes.
2. The upstream API reference metadata plan should land before OpenAPI path
   discovery becomes a product contract.
3. The Cloudflare security gate should decide whether portal Code Mode is the
   first implementation path.
4. If the current tool count or aggregated set changes, promotion must re-run
   the inventory from source rather than inherit this brief's numbers.

## Success Signals

This brief is ready to promote when:

1. current `tools/list` and representative workflow token costs are measured;
2. Cloudflare portal Code Mode availability is known;
3. output schemas and upstream API reference metadata are either complete or
   explicitly sequenced as prerequisites;
4. a security owner agrees whether generated-code execution is portal-owned,
   Oak-owned, or out of scope for public beta.

## Risks and Unknowns

| Risk | Why It Matters | Mitigation During Promotion |
|---|---|---|
| Overfitting to Cloudflare scale | Oak's current 35-tool surface may not justify Code Mode by itself | Measure Oak before committing to architecture |
| Unsandboxed execution | Generated code can become a severe security risk | Keep execution behind Cloudflare portal or equivalent sandbox |
| Client compatibility | Some clients may expect ordinary MCP tools and ignore portal Code Mode | Decide whether the public-beta surface is replacement, not hidden dual support |
| Loss of model affordance | Tiny tool surfaces can make simple tasks less obvious | Keep discovery examples and detail levels generated and tested |
| Result under-disclosure | Aggressive filtering can hide useful curriculum context | Define per-tool projection defaults and full-data retrieval rules |

## Promotion Trigger

Promote this brief to `current/` when one of the following happens:

1. Oak's tool surface grows materially beyond the current generated plus
   aggregated inventory.
2. Cloudflare portal Code Mode becomes available for live evaluation.
3. Token-footprint evidence shows current tool definitions or intermediate
   results are materially degrading real teacher-facing workflows.
4. Engineering/API use cases grow enough that the SDK and MCP server boundary
   needs an explicit token-economy decision.

The promoted executable plan must start with measurement, then choose between a
Cloudflare-portal evaluation, a generator-owned discovery index, or a sandboxed
Oak-owned execution prototype.
