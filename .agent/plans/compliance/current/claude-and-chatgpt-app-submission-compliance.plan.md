---
name: "Directory Policy Compliance (Anthropic + OpenAI)"
overview: "Codify Anthropic and OpenAI directory policy requirements as permanent architectural and process requirements; resolve compliance gaps (privacy policy, graph token efficiency)."
todos:
  - id: ws1-governance-docs
    content: "WS1: Governance documentation — ADR-159 (both policies), extend safety-and-security.md with architectural requirements and submission checklist."
    status: pending
  - id: ws2-privacy-policy
    content: "WS2: Privacy policy integration — surface Oak privacy/cookie policy links in server metadata, README, and OAuth endpoints."
    status: pending
  - id: ws3-red
    content: "WS3 (RED): Graph sub-querying tests — filtering by subject/keyStage, summary mode, factory extension. Tests MUST fail."
    status: pending
  - id: ws4-green
    content: "WS4 (GREEN): Graph sub-querying implementation — extend factory, add filtering + summary mode to prior-knowledge and misconception graphs."
    status: pending
  - id: ws5-refactor
    content: "WS5 (REFACTOR): TSDoc, NL guidance, README updates, tool description updates, annotations wire-format E2E test, asset tool description guidance."
    status: pending
  - id: ws6-quality-gates
    content: "WS6: Full quality gate chain."
    status: pending
  - id: ws7-adversarial-review
    content: "WS7: Adversarial specialist reviews."
    status: pending
  - id: ws8-doc-propagation
    content: "WS8: Propagate settled outcomes to canonical ADR/directive/reference docs and relevant READMEs."
    status: pending
isProject: false
---

# Directory Policy Compliance (Anthropic + OpenAI)

**Last Updated**: 2026-04-14
**Status**: CURRENT (queued, not yet started)
**Scope**: Codify both directory policies as permanent repo requirements;
resolve compliance gaps (privacy policy, graph token efficiency)

---

## Context

Audits of the Oak Curriculum MCP server against both the
[Anthropic Software Directory Policy](https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy)
and the
[OpenAI ChatGPT App Submission Guidelines](https://developers.openai.com/apps-sdk/app-submission-guidelines)
(2026-04-14) found the server largely compliant across both policy sets.

The two policies overlap substantially but each adds unique requirements.
Both require: privacy policy links, test credentials, minimal data
collection, accurate tool annotations, graceful error handling, no
advertising, no financial transactions, and current dependencies. OpenAI
additionally requires: response minimization (no diagnostic data in
responses), age-appropriate content (13+), screenshots, developer
verification, and has stricter commerce prohibitions.

### Identified Gaps

| Gap | Anthropic | OpenAI | Severity | Owner |
|-----|-----------|--------|----------|-------|
| Missing privacy policy link | 3.A | Privacy section | BLOCKER | Us |
| Graph token efficiency | 5.B | Response minimization | ADVISORY | Us |
| Asset tools lack pagination | 5.B | Response minimization | MEDIUM | Upstream API |
| limit/offset descriptions swapped | 2.B | Tools / Descriptions | MEDIUM | Upstream API bug |
| Annotations not visible to clients | 5.E | Tools / Annotation | INVESTIGATE | Us (verify wire format) |
| Test credentials | 3.D | Authentication section | PROCESS | Us |
| Screenshots for submission | N/A | App Fundamentals | PROCESS | Us |
| Developer verification | N/A | Developer Verification | PROCESS | Us |

### Problem Statement

Neither policy's requirements are documented in our governance layer.
There is no ADR recording the decision to comply, no permanent
architectural requirements derived from the policies, no compliance
mapping in `safety-and-security.md`, and no developer checklist for
directory submission readiness.

The graph tools dump entire datasets on every call. The
[Dec 2025 graph tools plan](../../archive/semantic-search-archive-dec25/part-1-search-excellence/08-mcp-graph-tools.md)
already identified this and proposed filtering by `subject`/`keyStage` plus
summary mode for large graphs. The
[post-merge-tidy-up snag M1-S007](../../sdk-and-mcp-enhancements/future/post-merge-tidy-up.plan.md)
also deferred "Prerequisite sub-graph fetching."

### Existing Capabilities

- **Graph resource factory** (`graph-resource-factory.ts`) already
  provides `createGraphToolDef`, `createGraphToolExecutor`,
  `createGraphResource`, `createGraphJsonGetter`. Currently no-param only.
- **Graph data types** all have `subject` and `keyStage` on every node,
  making filtering straightforward.
- **`safety-and-security.md`** governance doc covers API key security,
  privacy protection, access control, error handling, multi-layer
  architecture — natural home for compliance mapping.
- **Oak privacy policy**: <https://www.thenational.academy/legal/privacy-policy>
- **Oak cookie policy**: <https://www.thenational.academy/legal/cookie-policy>
- **User data scope**: the only user-sourced data processed is the email
  address used to authenticate against Clerk via OAuth 2. No UIs in this
  repo store any data about the user.

---

## Design Principles

1. **Build on existing governance** — extend `safety-and-security.md`
   rather than creating a parallel governance doc; one ADR records the
   decision.
2. **Backwards-compatible filtering** — omitting filter params returns the
   full graph (existing behaviour preserved). Summary mode is an explicit
   opt-in via `mode: 'summary'`.
3. **Factory-level abstraction** — filtering and summary mode are
   implemented in the graph resource factory, not per-tool. Each graph
   surface inherits the capability via configuration.
4. **Schema-first** — input schemas for filter params are Zod-defined and
   flow through the existing generated-tool pipeline pattern.
5. **Shape-honest filtering** — all three graphs MUST be filterable,
   but the filter schema is per-surface, not uniform. Prior-knowledge
   and misconception nodes have `subject: string` and
   `keyStage: string`. Thread progression nodes have
   `subjects: string[]` (plural — a thread can span french/german/
   spanish) and `firstYear`/`lastYear` (year range, not key stage).
   The factory must support per-surface filter schemas so each graph
   declares its own filterable dimensions.

**Non-Goals** (YAGNI):

- Per-node text search within graphs (use the `search` tool instead)
- Graph visualisation or rendering changes
- Changes to graph resource endpoints (only tools get filtering)
- Pagination within filtered sub-graphs
- Testing account preparation (deferred to a future plan)

---

## WS1 — Governance Documentation

No TDD — this is documentation work.

### 1.1: ADR-159 — Directory Policy Compliance

**File**: `docs/architecture/architectural-decisions/159-directory-policy-compliance.md`

**Contents**:

- **Decision**: adopt the Anthropic Software Directory Policy and the
  OpenAI ChatGPT App Submission Guidelines as binding compliance
  requirements for the Oak MCP HTTP server
- **Dual compliance mapping table**: each Anthropic rule (1.A–5.G) and
  each OpenAI section mapped to existing control, gap, or N/A with
  evidence reference
- **Permanent architectural requirements** derived from both policies
  (see §1.3 below)
- **Privacy data handling statement**: the only user-sourced data processed
  is the email address used for Clerk OAuth 2 authentication; no UIs store
  user data; Oak privacy and cookie policies apply
- **`oakContextHint` rationale**: the context hint embedded in
  `structuredContent` is a necessary workaround for MCP clients not yet
  supporting push notifications. Without it, the model cannot be reliably
  guided to load pedagogical context before using curriculum tools, which
  substantially reduces data value to the user. When MCP push
  notifications are available, the hint will be replaced by a one-time
  context push on session start. This is legitimate usage under both
  policies — it guides the model to use the same app's orientation tools,
  does not manipulate app selection or discovery, and does not coerce
  calls to external tools.
- **Token efficiency commitment**: graph tools must support sub-graph
  filtering; full-graph dumps are permitted only as the default when no
  filter is provided
- **Maintenance obligation**: policy compliance must be re-audited when
  the server's feature surface changes materially (new tools, new data
  collection, new auth flows) or when either policy is updated

### 1.2: Extend `docs/governance/safety-and-security.md`

Add a new section **"Directory Policy Compliance"** after the existing
"Compliance Considerations" section:

- Reference ADR-159 for the full dual-policy mapping
- Summarise both policies and our compliance posture
- Document the permanent architectural requirements (§1.3)
- Document the privacy data handling scope (Clerk OAuth email only, no
  user data storage)
- Link Oak privacy policy and cookie policy
- Add a **Directory Submission Checklist** (see §1.4)

### 1.3: Permanent Architectural Requirements

These requirements are derived from both policies but represent good
engineering practice independent of directory listing. They MUST be
codified in ADR-159 and referenced from `safety-and-security.md`.

**Tool contract requirements**:

1. **Annotation completeness** — every MCP tool MUST declare
   `readOnlyHint`, `destructiveHint`, `openWorldHint`, `idempotentHint`,
   and `title`
2. **Tool name length** — tool names MUST NOT exceed 64 characters
3. **Description accuracy** — tool descriptions MUST precisely match
   actual functionality; no undelivered promises, no unexpected features
4. **No hidden behaviour** — all tool behaviour MUST be defined at
   compile time; tools MUST NOT pull behavioural instructions from
   external sources at runtime; all instructions MUST be human-readable

**Response requirements**:

5. **Response minimization** — tool responses MUST NOT include diagnostic
   data (trace IDs, session IDs, request IDs, logging metadata) in
   model-visible fields (`content`, `structuredContent`). Widget-only
   metadata in `_meta` is permitted for UI rendering
6. **Token efficiency** — tool response size MUST be proportionate to
   task complexity. Large datasets MUST support filtering to enable
   scoped retrieval. Full-dataset dumps are permitted only as the
   default when no filter is provided

**Input requirements**:

7. **Input minimization** — tool input schemas MUST collect only data
   necessary for the tool's function. No conversation history, raw
   transcripts, broad context fields, or precise location data

**Privacy requirements**:

8. **Privacy policy surfacing** — privacy and cookie policy links MUST
   be present in OAuth discovery metadata and server documentation
9. **Data handling documentation** — the scope of user data processed
   MUST be documented; changes to data handling scope trigger a
   compliance re-audit

**Infrastructure requirements**:

10. **Transport protocol** — remote MCP servers MUST support Streamable
    HTTP
11. **Graceful error handling** — errors MUST return structured, helpful
    messages without leaking internal implementation details

**Operational constraints** (governance doc and submission checklist
only — these are product/policy constraints, not architectural
decisions, and do NOT belong in ADR-159):

12. **Age-appropriate content** — content suitable for users aged 13+
13. **No advertising** — no advertisements or sponsored content
14. **No financial transactions** — no monetary transactions
15. **Dependency currency** — dependencies reasonably current

### 1.4: Directory Submission Checklist

Add to `safety-and-security.md` alongside the existing Security Checklist:

```markdown
## Directory Submission Checklist

Before submitting to Anthropic or OpenAI directories:

- [ ] ADR-159 architectural requirements verified against current code
- [ ] Privacy policy URI in OAuth discovery metadata responses
- [ ] Data handling scope documented in README
- [ ] Test credentials prepared (Clerk account with appropriate scopes)
- [ ] At least three working example prompts documented
- [ ] Developer identity verified on target platform dashboard
- [ ] Screenshots captured at required dimensions (OpenAI)
- [ ] Support contact information current and accessible
- [ ] All tool annotations complete (readOnly, destructive, openWorld,
      idempotent, title)
- [ ] Tool response minimization verified (no diagnostic data in
      model-visible fields)
- [ ] All tool names ≤ 64 characters
- [ ] No advertising or promotional content
- [ ] No financial transaction capabilities
- [ ] Content suitable for users aged 13+
- [ ] Ownership/control of all API endpoints and domains verified
- [ ] `pnpm check` passes
```

### 1.5: Three-Layer Governance Architecture

The directory policies surface requirements at three levels of
generality. Each level has a natural home in the existing doc hierarchy:

**Layer 1 — Universal principles** (`principles.md`)

Three analog principles that apply to any AI tool interface design,
not just MCP or Oak. Add under "Code Design and Architectural
Principles", after the existing "Fail FAST" bullet.

`principles.md` is at 519 lines with a 525-line fitness limit.
The additions MUST be concise (≤8 lines total). Compensate by trimming
verbosity elsewhere in the file if needed during implementation.

```markdown
- **Model-facing response discipline** — Data visible to AI
  models must contain only what the model needs to reason
  about. No timestamps, trace IDs, session IDs, or diagnostic
  metadata in model-visible responses. Operational data belongs
  in the observability layer; rendering-only data belongs in
  out-of-band metadata channels.
- **Token-proportionate data design** — Large datasets exposed
  to models MUST offer filtering to enable scoped retrieval.
  Response size must be proportionate to task complexity.
- **Input minimality** — Tool inputs must collect only what the
  tool needs to function. No conversation history, raw
  transcripts, broad context fields, or precise location data.
```

Note: these principles are deliberately field-agnostic (no MCP-specific
vocabulary like `structuredContent` or `_meta`). The MCP-specific
instances (which fields are model-visible, which are widget-only) live
in the Layer 2 rule.

**Why principles**: these are the AI tool interface equivalents of
"Fail FAST" (error handling discipline) and "Keep it strict" (no
invented optionality). The compliance policies identified them, but
they are independently good engineering.

**Fitness**: `principles.md` is at 519/525 lines. These additions are
~9 lines. During implementation, identify trimming candidates in the
existing "Document Everywhere" bullet (lines 137-155, 19 lines) which
overlaps substantially with the "Onboarding" bullet and the TSDoc
syntax guidance — the TSDoc syntax detail could move to
`documentation-hygiene.md` rule, recovering ~6 lines.

**Layer 2 — MCP-specific rule** (`.agent/rules/mcp-tool-interface-discipline.md`)

A new rule — one mechanism for operationalising the three universal
principles in the MCP tool interface domain. Follows the existing
pattern: `no-type-shortcuts.md` references `principles.md` §Compiler
Time Types; this rule references `principles.md` §Model-facing
response discipline, §Token-proportionate data design, and §Input
minimality. Other operationalisation mechanisms (sub-agent reviewers,
lint rules, tests) may also enforce these principles independently.

Applies to both the SDK (`packages/sdks/oak-curriculum-sdk/src/mcp/`)
where tool contracts are defined, and the MCP app
(`apps/oak-curriculum-mcp-streamable-http/`) where they are served.

```markdown
# MCP Tool Interface Discipline

MCP tool definitions and responses must follow the model-facing
response, token-proportionate, and input-minimality principles.

## Response shape

Model-visible fields (`content`, `structuredContent`) carry only
data the model reasons about. Prohibited in model-visible fields:
`Date.now()` timestamps, trace/correlation IDs, session IDs,
request IDs, logging metadata, internal status codes. Widget-only
rendering data belongs in `_meta`.

## Token proportionality

Tools returning large static datasets (graphs, catalogues) MUST
accept optional filter parameters (`subject`, `keyStage`, or
domain-appropriate equivalents) and a `mode: 'summary'` option
returning stats without full data. No-filter calls return the
full dataset for backwards compatibility.

## Input minimality

Input schemas declare only parameters the tool needs. No
`conversationHistory`, `rawTranscript`, `userContext`, or
`location` fields. Geolocation, if ever needed, must come via
controlled side channels, not input schemas.

See `principles.md` §Model-facing response discipline,
§Token-proportionate data design, §Input minimality.
See ADR-159 for the compliance rationale, policy mapping, and
any documented temporary deviations (e.g. context-grounding
hints required by absent protocol features).
```

Also create `.claude/rules/mcp-tool-interface-discipline.md` adapter:

```markdown
Read and follow `.agent/rules/mcp-tool-interface-discipline.md`.
```

**Layer 3 — ADR-159 and safety-and-security.md** (domain-specific)

The 15 compliance-derived requirements (§1.3), the dual-policy mapping
table, the `oakContextHint` rationale, and the submission checklist
(§1.4). These are specific to directory-listed MCP servers and do not
belong in principles or rules.

**Acceptance Criteria**:

1. ADR-159 exists with dual-policy mapping and architectural requirements
2. `safety-and-security.md` has the new section with both requirements
   and checklist
3. `principles.md` has the three new principles
4. `pnpm markdownlint:root` passes
5. `pnpm practice:fitness:informational` confirms principles.md is
   within fitness limits
6. `mcp-reviewer` and `security-reviewer` validate the governance
   additions

---

## WS2 — Privacy Policy Integration

No TDD — this is configuration and documentation.

### 2.1: Server metadata

Surface privacy policy link in the MCP server's `ServerInfo` or equivalent
metadata. Check whether the MCP `ServerInfo` type supports a privacy
policy field. If not, add to `_meta` on the server info response.

### 2.2: OAuth discovery endpoints

Add `privacy_policy_uri` and `tos_uri` to the OAuth protected resource
metadata responses at:

- `/.well-known/oauth-protected-resource`
- `/.well-known/oauth-protected-resource/mcp`

Per RFC 8414 / RFC 9728, these are standard optional fields.

**Values**:

```json
{
  "privacy_policy_uri": "https://www.thenational.academy/legal/privacy-policy",
  "tos_uri": "https://www.thenational.academy/legal/cookie-policy"
}
```

### 2.3: README

Add a "Privacy and Data Handling" section to the MCP server README:

- Link to Oak privacy policy and cookie policy
- State the data handling scope: email address via Clerk OAuth only, no
  user data storage, sanitised observability
- Reference ADR-159

**Acceptance Criteria**:

1. Privacy policy URI present in OAuth discovery metadata responses
2. README documents data handling scope
3. `pnpm test:e2e` passes (E2E tests cover OAuth metadata endpoints)
4. `security-reviewer` validates the privacy integration

---

## WS3 — Graph Sub-Querying Tests (RED)

All tests MUST FAIL at the end of WS3.

> See [TDD Phases component](../../templates/components/tdd-phases.md)

### 3.1: Factory filtering tests

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.unit.test.ts`

**Tests**:

- `createFilterableGraphToolExecutor` returns full graph when no filters
  provided (baseline — should pass once GREEN)
- `createFilterableGraphToolExecutor` filters nodes by `subject`
- `createFilterableGraphToolExecutor` filters nodes by `keyStage`
- `createFilterableGraphToolExecutor` filters nodes by `subject` AND
  `keyStage` combined
- `createFilterableGraphToolExecutor` filters edges to only include edges
  where both `from` and `to` nodes are in the filtered set (prior
  knowledge graph specific)
- `createFilterableGraphToolExecutor` in `summary` mode returns stats and
  subject list without node data
- `createFilterableGraphToolExecutor` in `summary` mode respects
  `subject`/`keyStage` filters (scoped summary)
- `createFilterableGraphToolExecutor` with zero-match filter returns
  empty graph structure (empty `nodes`, empty `edges`, zeroed stats)
  with a summary indicating no matches — NOT an error, NOT the full
  graph
- `createFilterableGraphToolExecutor` recomputed stats are consistent
  with filtered node/edge data (tested by comparing stats from summary
  mode against stats derived from full-mode filtered data)
- `createFilterableGraphToolExecutor` `subjectsCovered` in stats is
  sorted lexicographically (deterministic ordering)
- `createFilterableGraphInputSchema` produces valid Zod schema with
  optional `subject`, `keyStage`, and `mode` fields

### 3.2: Per-graph filtering tests

**Files** (all three graphs):

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prior-knowledge-graph.unit.test.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.unit.test.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.unit.test.ts`

**Tests per graph** (prior knowledge + misconception):

- Tool input schema includes optional `subject`, `keyStage`, and `mode`
- Filtering by a known subject returns only nodes for that subject
- Summary mode returns stats object without full node array
- Tool definition description mentions filtering capability

**Tests for thread progressions** (different filter shape):

- Tool input schema includes optional `subject`, `year`, and `mode`
- Filtering by subject matches threads where `subjects` array includes
  the value (e.g. `subject: "maths"` matches a thread with
  `subjects: ["maths"]`)
- Filtering by year matches threads where `firstYear <= year <= lastYear`
- Combined subject + year filter applies both predicates
- Summary mode returns stats without full thread data
- Tool definition description mentions filtering capability

### 3.3: Integration test

**File**: `apps/oak-curriculum-mcp-streamable-http/src/handlers.integration.test.ts`
(or appropriate existing test file)

**Tests** (all three graphs):

- MCP `tools/call` with `subject` filter returns filtered sub-graph
  (prior-knowledge, misconception)
- MCP `tools/call` with `subject` filter on thread progressions uses
  array-contains matching
- MCP `tools/call` with `year` filter on thread progressions uses
  range matching
- MCP `tools/call` with `mode: 'summary'` returns summary response
- MCP `tools/list` shows updated input schemas with per-surface filter
  params

**Acceptance Criteria**:

1. All new tests compile and run
2. All new tests fail for the expected reason (no filtering implementation)
3. No existing tests broken

---

## WS4 — Graph Sub-Querying Implementation (GREEN)

All tests MUST PASS at the end of WS4.

### 4.1: Extend `GraphSurfaceConfig`

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.ts`

Add to `GraphSurfaceConfig<T>`. The accessors MUST use the existing
generic `T` (or types derived from `T`) — NOT `unknown`. Using
`unknown` here would violate the "unknown is type destruction"
principle and contradict the factory's own TSDoc which states that
`unknown` would destroy type information. The exact node/edge types
should be extracted from `T` using conditional types or by extending
the generic constraint.

```typescript
/**
 * Per-surface filter schema (Zod). Each graph surface declares its
 * own filterable dimensions. The factory does NOT assume a fixed
 * { subject, keyStage } shape — thread progressions have
 * subjects: string[] and firstYear/lastYear, requiring different
 * filter params. The factory is generic over the filter shape.
 */
readonly filterSchema?: ZodSchema<F>;

/**
 * Node filter predicate. Given parsed filter args (typed by F),
 * returns whether a node should be included. The node type is
 * derived from T to preserve type safety — never use `unknown`.
 */
readonly nodeFilter?: (node: NodeOf<T>, filters: F) => boolean;

/**
 * Edge filter predicate. Given filtered node identifiers, returns
 * whether an edge should be included. Only relevant for graphs
 * with edges (e.g. prior knowledge graph).
 */
readonly edgeFilter?: (
  edge: EdgeOf<T>,
  filteredNodeIds: ReadonlySet<string>,
) => boolean;

/**
 * Node identifier accessor. Returns the unique ID for a node
 * (used for edge filtering). Required when edgeFilter is provided.
 */
readonly nodeId?: (node: NodeOf<T>) => string;
```

This makes `GraphSurfaceConfig<T, F>` generic over both the data
type `T` and the filter args type `F`. Each graph surface provides
its own `filterSchema` and `nodeFilter` predicate, so the factory
imposes no assumptions about which fields are filterable.

`NodeOf<T>` and `EdgeOf<T>` are conditional types extracting the
element type from `T['nodes']` and `T['edges']` respectively.
The exact type extraction approach is an implementation detail for
WS4; the invariant is that `unknown` MUST NOT appear in these
signatures.

### 4.2: Add `createFilterableGraphToolExecutor`

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.ts`

New factory function, generic over the filter args type `F`:

1. Parses args through the surface's `filterSchema` (which includes
   `mode` alongside the surface-specific filter fields)
2. When filters provided: filters `sourceData.nodes` using the
   surface's `nodeFilter` predicate, filters `sourceData.edges`
   using `edgeFilter` with a `Set<string>` of filtered node IDs
   (O(1) membership check; both `from` and `to` must be in the
   set), recomputes stats via a pure
   `recomputeStats(filteredNodes, filteredEdges)` function
3. When `mode === 'summary'`: returns recomputed stats + sorted
   `subjectsCovered` list, no nodes/edges. `subjectsCovered` MUST be
   sorted lexicographically for deterministic output.
4. When zero matches: returns `{ nodes: [], edges: [], stats: {zeroed} }`
   with a summary like "No nodes match the filter subject=X keyStage=Y"
   — NOT an error, NOT a silent fallback to full graph
5. When no filters and no mode: returns full graph (backwards-compatible)

The `recomputeStats` function MUST be extracted as a pure function and
tested independently to prevent silent inconsistencies between summary
mode and full mode.

### 4.3: Per-surface filter schemas

Each graph surface defines its own filter schema. The factory does NOT
provide a shared schema — each surface knows its own filterable
dimensions. Filter string inputs MUST include length and character
constraints.

**Prior-knowledge and misconception graphs** (nodes have `subject: string`,
`keyStage: string`):

```typescript
z.object({
  subject: z.string().max(100).regex(/^[a-z0-9-]+$/)
    .optional()
    .describe('Filter to a specific subject (e.g. "maths", "science")'),
  keyStage: z.string().max(10).regex(/^ks[1-4]$/)
    .optional()
    .describe('Filter to a specific key stage (e.g. "ks3", "ks4")'),
  mode: z.enum(['full', 'summary']).optional().default('full')
    .describe('Return mode: "full" returns filtered graph, "summary" returns stats only'),
}).strict()
```

**Thread progressions** (nodes have `subjects: string[]`,
`firstYear: number`, `lastYear: number`):

```typescript
z.object({
  subject: z.string().max(100).regex(/^[a-z0-9-]+$/)
    .optional()
    .describe('Filter to threads covering a subject (e.g. "maths"). Matches threads where subjects array includes the value.'),
  year: z.number().int().min(1).max(13)
    .optional()
    .describe('Filter to threads spanning a year (e.g. 7). Matches threads where firstYear <= year <= lastYear.'),
  mode: z.enum(['full', 'summary']).optional().default('full')
    .describe('Return mode: "full" returns filtered graph, "summary" returns stats only'),
}).strict()
```

Note: thread progressions use `subject` (singular, matched against the
`subjects` array via `includes`) and `year` (matched against the
`firstYear`/`lastYear` range), not `keyStage`. The filter dimensions
are honest to the data shape.

### 4.4: Update graph tool consumers

**All three graphs** — every surface produced by the graph resource
factory MUST support filtering. This is an invariant: any graph tool
using the factory gets a per-surface filter schema.

**Files**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prior-knowledge-graph.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts`

**Prior-knowledge graph**:

1. Replace `GET_*_INPUT_SCHEMA: Record<string, never> = {}` with the
   per-surface filter schema (subject + keyStage + mode)
2. Add `nodeFilter` predicate: match `node.subject` and `node.keyStage`
3. Add `edgeFilter` and `nodeId` (edges reference `from`/`to` as
   unit slugs)
4. Replace `createGraphToolExecutor` with
   `createFilterableGraphToolExecutor`

**Misconception graph**:

1. Same schema as prior-knowledge (subject + keyStage + mode)
2. Add `nodeFilter` predicate: match `node.subject` and `node.keyStage`
3. No edge filter needed (misconception graph has no edges)
4. Replace executor

**Thread progressions**:

1. Use per-surface filter schema (subject + year + mode)
2. Add `nodeFilter` predicate: `node.subjects.includes(subject)` for
   subject filter; `node.firstYear <= year && year <= node.lastYear`
   for year filter
3. No edge filter needed (thread progression graph has no edges)
4. Replace executor

### 4.5: Factory invariant

**Any graph surface produced by the graph resource factory MUST
support filtering.** This is the architectural rule, not a per-surface
decision. When a new graph surface is added to the factory in future,
it MUST provide a `filterSchema` and `nodeFilter` predicate. The
factory should enforce this — consider making `filterSchema` and
`nodeFilter` required fields on `GraphSurfaceConfig` rather than
optional, so omission is a compile-time error.

### 4.6: Update tool registration

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts`

Ensure the updated input schemas and executors are picked up by the
universal tool registry. The existing pattern should handle this if the
tool definitions export the new schemas.

**Deterministic Validation**:

```bash
pnpm type-check
# Expected: no type errors

pnpm test -- --filter oak-curriculum-sdk
# Expected: all tests pass including new filtering tests
```

---

## WS5 — Documentation and Polish (REFACTOR)

### 5.1: TSDoc and NL guidance

Update tool descriptions for all three graph tools to mention filtering:

```text
Supports optional filtering:
- subject: Filter to a specific subject (e.g. "maths")
- keyStage: Filter to a specific key stage (e.g. "ks3")
- mode: "summary" returns stats overview without full graph data

Call with no parameters to get the complete graph.
Call with mode: "summary" to get an overview before requesting full data.
```

Add NL mapping examples:

```text
"What misconceptions exist in KS3 science?" → subject: "science", keyStage: "ks3"
"Give me an overview of the prior knowledge graph" → mode: "summary"
"Show me maths prerequisites" → subject: "maths"
```

### 5.2: Thread-progression tool description

Update the `get-thread-progressions` tool description to document the
different filter dimensions: "Supports optional filtering by subject
(matches threads covering that subject) and year (matches threads
spanning that year). Threads can cover multiple subjects and span year
ranges, so filtering uses array-contains and range-overlap matching."

### 5.3: Annotations wire-format verification

An external client-side audit reported "no tool annotations on any tool."
Server-side code confirms all 34 tools have full annotations
(`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`,
`title`) and registration passes them to `server.registerTool`. The
auditor's MCP client likely did not surface the `annotations` field.

Add an E2E test asserting that `tools/list` JSON-RPC responses include
the `annotations` object on every tool. This provides verifiable
evidence for directory reviewers.

### 5.4: limit/offset description swap — upstream API bug

The `get-key-stages-subject-lessons` tool has `limit` and `offset`
parameter descriptions transposed. Verified against the live spec
at `open-api.thenational.academy/api/v0/swagger.json` on 2026-04-14:
the **live spec itself has them swapped**. This is an upstream API
bug, not a stale cache or codegen issue. Our codegen faithfully
reproduces the upstream spec.

Tracked in the companion document
[upstream-api-requests.md](upstream-api-requests.md) as Request 1.
No action on our side until the upstream spec is fixed — running
`pnpm sdk-codegen` will pick up the correction automatically.

**Separately** (DONE, committed 56e92b0d): the codegen silent cache
fallback and version-only comparison bugs were fixed regardless.
Local codegen now always fetches the live spec (the swagger endpoint
is public, no API key needed). `writeSchemaCacheIfChanged` compares
full content, not just the version string. Advisory CI drift check
added.

### 5.5: Asset tool description guidance

The generated tools `get-key-stages-subject-assets` and
`get-sequences-assets` have no `limit`/`offset` parameters — this is
an upstream API limitation (see companion doc for the API team). Until
the upstream API adds pagination, add guidance to these tools'
descriptions at sdk-codegen time:

```text
Tip: Filter by 'type' and/or 'unit' to reduce response size.
Without filters, this returns all assets for the key stage and
subject, which can be large.
```

This is a description-level mitigation only. The upstream API requests
are documented in the companion document at
`upstream-api-requests.md` alongside this plan.

### 5.5: README updates

Update the MCP server README tool listing to reflect the new filter params
on graph tools.

### 5.6: Resolve M1-S007 snag

Mark M1-S007 ("Prerequisite sub-graph fetching") as resolved in
`sdk-and-mcp-enhancements/future/post-merge-tidy-up.plan.md` with a
cross-reference to this plan.

---

## WS6 — Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:widget && pnpm test:ui && pnpm test:e2e && \
pnpm smoke:dev:stub
```

---

## WS7 — Adversarial Review

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

Invoke specialist reviewers after implementation. Minimum roster:

- `mcp-reviewer` — validate tool definitions, input schemas, MCP
  compliance of filtered responses
- `security-reviewer` — validate privacy policy integration, OAuth
  metadata changes, no new data exposure
- `architecture-reviewer-barney` — validate factory extension boundary,
  dependency direction
- `type-reviewer` — validate generic filtering types, no type widening
- `test-reviewer` — validate TDD compliance, test quality
- `docs-adr-reviewer` — validate ADR-159 and governance doc updates

Document findings. Create follow-up plan if BLOCKERs found.

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Factory extension introduces breaking change to existing graph surfaces | HIGH | Backwards-compatible: no-filter returns full graph. Existing no-param calls continue to work. |
| Filtered sub-graph stats are inconsistent with full-graph stats | MEDIUM | Recompute stats from filtered data, not from source stats object. Unit tests assert consistency. |
| Edge filtering is incorrect (orphaned edges or missing edges) | MEDIUM | Edge filter uses a set of filtered node IDs. Test with known graph subsets where expected edges are enumerable. |
| Privacy policy link becomes stale | LOW | Link to institutional policy page, not a specific document version. Oak maintains the canonical URL. |
| Either policy changes after our ADR is written | LOW | ADR includes maintenance obligation clause requiring re-audit on material server changes or policy updates. |
| `oakContextHint` draws reviewer scrutiny | LOW | ADR-159 documents the rationale: necessary workaround for absent MCP push notifications; guides model to same-app orientation tools; does not manipulate app selection. |
| `_meta` timestamp flagged by OpenAI reviewer | LOW | Widget-only (`_meta`), model never sees it. If flagged, move computation to widget client side. |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- **Cardinal Rule**: graph filtering is pure runtime logic on generated
  data. No new types are hand-crafted; filter schemas are Zod-defined.
  `pnpm sdk-codegen` contract unchanged.
- **TDD**: RED/GREEN/REFACTOR for all graph filtering code. WS3 tests
  must fail before WS4 implementation.
- **Separate Framework from Consumer**: factory provides the generic
  filtering mechanism; each graph surface provides the consumer-specific
  config (`nodeFilterFields`, `edgeFilter`, `nodeId`).
- **Fail Fast**: invalid filter values (unknown subject, malformed key
  stage) produce empty results with a clear message, not silent fallback.
- **Schema-First**: filter input schemas are Zod-defined and validated at
  the MCP tool boundary.
- **Token-proportionate data design** (new principle): graph sub-querying
  is the direct application — large graphs offer `subject`/`keyStage`
  filtering and summary mode.
- **Input minimality** (new principle): filter params are the minimum
  needed; no broad context or "just in case" fields.

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

Documents to update or assess:

1. `docs/architecture/architectural-decisions/159-*.md` — NEW (WS1)
2. `docs/governance/safety-and-security.md` — EXTEND with architectural
   requirements and submission checklist (WS1)
3. `apps/oak-curriculum-mcp-streamable-http/README.md` — EXTEND with
   privacy section (WS2) and updated tool docs (WS5)
4. `.agent/plans/sdk-and-mcp-enhancements/future/post-merge-tidy-up.plan.md`
   — UPDATE snag M1-S007 (WS5)
5. `.agent/plans/compliance/roadmap.md` — UPDATE phase statuses
6. `.agent/directives/principles.md` — ADD three new principles under
   "Code Design and Architectural Principles" (see §1.5 below)
7. `.agent/plans/sdk-and-mcp-enhancements/future/post-merge-tidy-up.plan.md`
   or `.agent/plans/compliance/future/` — ADD snag for oakContextHint
   expiry review: "When the MCP SDK gains push notification support,
   re-evaluate and remove the oakContextHint from structuredContent,
   replacing with a one-time context push on session start." This
   ensures the temporary deviation has a trackable review trigger.

---

## Consolidation

After all work is complete and quality gates pass, run `/jc-consolidate-docs`
to graduate settled content, extract reusable patterns, rotate the napkin,
manage fitness, and update the practice exchange.

---

## Dependencies

**Blocking**: none — all three workstreams can begin immediately. WS3-WS5
(graph sub-querying) should follow WS1 (governance) so the ADR exists
before code changes reference it.

**Related Plans**:

- [08-mcp-graph-tools.md (archived)](../../archive/semantic-search-archive-dec25/part-1-search-excellence/08-mcp-graph-tools.md) — original size analysis and filtering proposal (Dec 2025)
- [post-merge-tidy-up.plan.md](../../sdk-and-mcp-enhancements/future/post-merge-tidy-up.plan.md) — M1-S007 snag resolved by this plan
- [graph-resource-factory.plan.md](../../knowledge-graph-integration/active/graph-resource-factory.plan.md) — factory pattern this plan extends
- [open-education-knowledge-surfaces.plan.md](../../knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md) — umbrella for graph surfaces; filtering applies to all factory-produced surfaces
- [upstream-api-requests.md](upstream-api-requests.md) — companion document for the Oak API team requesting upstream changes needed for directory compliance

## Policy References

### Anthropic Software Directory Policy

Source: [Anthropic Software Directory Policy](https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy)

Key sections driving this plan:

- **3.A**: privacy policy link required when collecting user data or
  connecting to remote services
- **5.B**: token efficiency — tool token usage commensurate with task
  complexity
- **5.E**: tool annotations (readOnlyHint, destructiveHint, title)
- **5.C**: tool names ≤ 64 characters
- **2.D**: no coercion of other tools (oakContextHint rationale)
- **2.F**: no dynamic instruction pulling
- **2.G**: no hidden instructions
- **3.D**: testing account with sample data (deferred to future plan)

### OpenAI ChatGPT App Submission Guidelines

Source: [OpenAI App Submission Guidelines](https://developers.openai.com/apps-sdk/app-submission-guidelines)

Key sections driving this plan:

- **Privacy / Data Collection**: response minimization — no diagnostic
  data (trace IDs, timestamps, logging metadata) in responses
- **Privacy / Privacy Policy**: published privacy policy required
- **Tools / Correct Annotation**: readOnlyHint, destructiveHint,
  openWorldHint required
- **Tools / Minimal Inputs**: no conversation history, raw transcripts,
  or broad context fields
- **Safety / Appropriateness**: content suitable for ages 13+
- **Authentication / Test Credentials**: demo account with sample data
- **App Fundamentals / Screenshots**: accurate screenshots required
- **Developer Verification**: verified identity on OpenAI Platform
  Dashboard
