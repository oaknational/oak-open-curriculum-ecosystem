---
name: "Oak KG Knowledge Taxonomy MCP Surface"
overview: "Extract the NC-aligned SKOS knowledge taxonomy from the Oak Curriculum Ontology and expose it as an oak-kg-namespaced MCP resource + tool — the smallest meaningful integration of the formal knowledge graph."
parent_plan: "open-education-knowledge-surfaces.plan.md"
sibling_plans:
  - "graph-resource-factory.plan.md"
  - "misconception-graph-mcp-surface.plan.md"
  - "../../sector-engagement/eef/current/eef-evidence-corpus.plan.md"
  - "agent-guidance-consolidation.plan.md"
specialist_reviewer: "mcp-reviewer, code-reviewer, test-reviewer"
isProject: false
todos:
  - id: t1-extraction-script
    content: "Write a build-time script that parses SKOS triples from ontology .ttl files and outputs structured JSON"
    status: pending
  - id: t2-type-definitions
    content: "Create typed interfaces for OakKgKnowledgeTaxonomy, Discipline, Strand, SubStrand, ContentDescriptor"
    status: pending
  - id: t3-resource-constant
    content: "Create oak-kg-knowledge-taxonomy-resource.ts using graph factory"
    status: pending
  - id: t4-aggregated-tool
    content: "Create aggregated-oak-kg-knowledge-taxonomy.ts using graph factory"
    status: pending
  - id: t5-register-definitions
    content: "Add get-oak-kg-knowledge-taxonomy to AGGREGATED_TOOL_DEFS"
    status: pending
  - id: t6-register-executor
    content: "Add handler in AGGREGATED_HANDLERS"
    status: pending
  - id: t7-public-export
    content: "Export resource constant and getter from public/mcp-tools.ts"
    status: pending
  - id: t8-register-resource
    content: "Add registerOakKgKnowledgeTaxonomyResource() in register-resources.ts"
    status: pending
  - id: t9-adr-123-update
    content: "Update ADR-123 with curriculum://oak-kg-knowledge-taxonomy"
    status: pending
  - id: t10-e2e-test
    content: "Add E2E assertions for the taxonomy tool and resource"
    status: pending
  - id: t11-attribution
    content: "Add Mark Hodierne to authors list"
    status: pending
---

# Oak KG Knowledge Taxonomy MCP Surface

**Status**: PENDING
**Last Updated**: 2026-04-11
**Branch**: TBD (same branch as parent plan)
**Parent**: `open-education-knowledge-surfaces.plan.md` (WS-4)
**Strategic context**: This is the smallest meaningful integration of
the [Oak Curriculum Ontology](https://github.com/oaknational/oak-curriculum-ontology)
into the MCP server. All ontology-sourced resources use the `oak-kg-*`
namespace prefix to distinguish them from bulk-API-derived surfaces.

## Credits

- **Oak Curriculum Ontology**: Mark Hodierne (MH)
  `<mark@markhodierne.com>` — primary author (170 commits)

When this plan ships, add MH to the repo's authors list.

## Context

The Oak Curriculum Ontology (v0.1.0) contains a formal SKOS knowledge
taxonomy that does NOT exist anywhere in the bulk API data:

```text
Discipline (e.g. Mathematics)
  → Strand (e.g. Number, Algebra, Geometry)
    → SubStrand (e.g. Place Value, Fractions)
      → ContentDescriptor (e.g. count-to-100-forwards-backwards)
```

This is Oak's representation of curriculum structure, aligned to the
National Curriculum for England (2014). The NC is a separate entity
with separate ownership — Oak's curriculum resources are NC-compliant
but are not the NC itself. The ontology repo explicitly notes it is
"an Oak-developed representation and does not constitute an official
DfE National Curriculum publication." For maths alone there are 356+
content descriptors. The bulk data has only loose
`nationalCurriculumContent` text strings at the unit level — no
hierarchy, no structured relationships.

This taxonomy is genuinely from the knowledge graph, not from the API.
It is the simplest proof that the ontology adds real value to the MCP
server.

## Decision

Extract the SKOS knowledge taxonomy from the ontology's `.ttl` files
into a JSON data file at build time. Expose as
`curriculum://oak-kg-knowledge-taxonomy` resource +
`get-oak-kg-knowledge-taxonomy` tool using the graph resource factory.
The `oak-kg-` prefix signals provenance from the ontology knowledge
graph, distinguishing these surfaces from bulk-API-derived ones.

## Data Source

**Ontology `.ttl` files only.** This plan reads from:

```text
oak-curriculum-ontology/data/subjects/
  mathematics/mathematics-knowledge-taxonomy.ttl
  english/english-knowledge-taxonomy.ttl
  science/biology-knowledge-taxonomy.ttl
  science/chemistry-knowledge-taxonomy.ttl
  science/physics-knowledge-taxonomy.ttl
  history/history-knowledge-taxonomy.ttl
  geography/geography-knowledge-taxonomy.ttl
  citizenship/citizenship-knowledge-taxonomy.ttl
```

It does NOT require Neo4j, SPARQL, or the full ontology.

## Implementation

### Phase 1: Extraction (T1-T2)

**T1: Extraction script**

A Node.js script (or a step in `pnpm sdk-codegen`) that:

1. Reads the knowledge taxonomy `.ttl` files from the ontology repo
   (path configurable via env var or workspace reference)
2. Parses SKOS triples (`skos:narrower`, `rdfs:label`)
3. Builds the 4-tier hierarchy: Discipline → Strand → SubStrand →
   ContentDescriptor
4. Outputs a typed JSON file at
   `packages/sdks/oak-sdk-codegen/src/generated/vocab/oak-kg-knowledge-taxonomy/data.json`

The parser needs to handle:

- `skos:narrower` relationships (parent → child)
- `rdfs:label` for human-readable names
- URI slugs for machine-readable identifiers
- Multiple subjects (8 knowledge taxonomy files)

Options for Turtle parsing:

- Use `n3` npm package (well-established RDF parser for JS)
- Or a simpler regex-based extractor (the SKOS structure is regular
  enough that a full RDF parser may be unnecessary)

**T2: Type definitions**

```typescript
interface ContentDescriptor {
  readonly slug: string;
  readonly label: string;
}

interface SubStrand {
  readonly slug: string;
  readonly label: string;
  readonly contentDescriptors: readonly ContentDescriptor[];
}

interface Strand {
  readonly slug: string;
  readonly label: string;
  readonly subStrands: readonly SubStrand[];
}

interface Discipline {
  readonly slug: string;
  readonly label: string;
  readonly strands: readonly Strand[];
}

interface OakKgKnowledgeTaxonomy {
  readonly version: string;
  readonly ontologyVersion: string;
  readonly generatedAt: string;
  readonly disciplines: readonly Discipline[];
  readonly stats: {
    readonly disciplineCount: number;
    readonly strandCount: number;
    readonly subStrandCount: number;
    readonly contentDescriptorCount: number;
    readonly subjects: readonly string[];
  };
}
```

### Phase 2: MCP surface (T3-T7)

Uses the graph resource factory from `graph-resource-factory.plan.md`.

**T3: Resource constant** — `oak-kg-knowledge-taxonomy-resource.ts`

```typescript
const config: GraphSurfaceConfig = {
  name: 'oak-kg-knowledge-taxonomy',
  title: 'Oak KG Knowledge Taxonomy',
  description:
    `Oak's NC-aligned SKOS knowledge taxonomy from the Oak Curriculum `
    + `Ontology. ${stats.disciplineCount} disciplines, `
    + `${stats.strandCount} strands, ${stats.subStrandCount} sub-strands, `
    + `${stats.contentDescriptorCount} content descriptors across `
    + `${stats.subjects.length} subjects. Sourced from the Oak Curriculum `
    + `Ontology (W3C RDF/OWL/SKOS).`,
  uriSegment: 'oak-kg-knowledge-taxonomy',
  priority: 0.5,
  sourceData: oakKgKnowledgeTaxonomy,
  summary: `Oak KG knowledge taxonomy loaded.`,
};
```

**T4-T7**: Standard factory-driven registration (same as misconception
graph pattern).

### Phase 3: Server surface (T8)

**T8**: Register resource in `register-resources.ts` using factory
registrar.

### Phase 4: Documentation and tests (T9-T11)

**T9**: ADR-123 update with `curriculum://oak-kg-knowledge-taxonomy`.

**T10**: E2E tests verifying tool and resource responses.

**T11**: Add Mark Hodierne to the authors list.

## Size Estimate

~100 lines of extraction script, ~50 lines of types, ~30 lines of
factory config, ~50 lines of tests. ~230 lines total. One new
dependency if using `n3` for Turtle parsing (or zero if regex-based).

## Exit Criteria

1. `get-oak-kg-knowledge-taxonomy` tool appears in `tools/list`
2. Tool returns structured SKOS hierarchy with stats
3. `curriculum://oak-kg-knowledge-taxonomy` resource in `resources/list`
4. Data is sourced from ontology `.ttl` files, not bulk API data
5. ADR-123 updated
6. Mark Hodierne in authors list
7. `pnpm check` passes

## Key Files

| File | Change |
|------|--------|
| `packages/sdks/oak-sdk-codegen/scripts/extract-oak-kg-taxonomy.ts` | NEW (extraction) |
| `packages/sdks/oak-sdk-codegen/src/generated/vocab/oak-kg-knowledge-taxonomy/` | NEW (generated) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/oak-kg-knowledge-taxonomy-resource.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-oak-kg-knowledge-taxonomy.ts` | NEW |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` | Add entry |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts` | Add handler |
| `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` | Add exports |
| `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` | Add resource |
