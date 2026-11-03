# @oaknational/graph-corpus-sdk

Oak's typed corpus SDK for the graph substrate. It is the substrate home for
Oak's open-education corpora
([ADR-157](../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md));
the EEF Teaching and Learning Toolkit strands foundation is the first
resident. Every type derives directly from the fixed `as const` corpus
snapshot: the corpus is the single source of truth and its own type
authority.

Transport-agnostic per
[ADR-179](../../../docs/architecture/architectural-decisions/179-transport-agnostic-graph-substrate.md):
this package ships no MCP, HTTP, or CLI types. Surfacing graph capability
through any transport is a consumer-side concern handled by the curriculum
SDK MCP module and the curriculum MCP HTTP app, or by future consumer
workspaces that import this SDK.

## What it provides

The `eef-strands` module is the typed raw-data foundation over
`EEF_TOOLKIT_DATA`, the fixed `as const` corpus snapshot:

- **Strand identity and lookup** — `EefStrand`, `EefStrandId`,
  `EefStrandById`, `strandById`, and the single boundary predicate
  `isValidStrandKey`.
- **Finite raw domains** — the observed applicability domains, the declared
  metadata domains, the declared-vs-observed divergence record, and the raw
  headline-metric domains.
- **Raw edge facts** — `relatedStrandEdges`, derived from each strand's
  `related_strands`.
- **Corpus-level provenance** — `corpusMeta`, `corpusCaveats`,
  `corpusMethodology`, `lastUpdated`.
- **Markdown projection** — `renderEefMarkdownFiles` (the corpus reference
  plus one file per strand, with paths from `strandFilePath` and
  `CORPUS_REFERENCE_FILE`), built on `renderStrandMarkdown` and
  `renderCorpusReferenceMarkdown`: pure, formatter-normal renderings of the
  corpus for consumers that commit the evidence as files with a provenance
  pin naming `corpusMeta.data_version`. The renderers return text and paths;
  the script `scripts/render-eef-markdown.ts` (see §Scripts) writes the set
  into a directory inside the one the command runs from, refusing an output
  root or a target directory that resolves outside it (checked through its
  nearest existing ancestor before anything is created, and again once it
  exists), opening each target without following symbolic links or blocking
  and checking through the descriptor that it is a regular file with a
  single link before truncating it (a symbolic link, a hard link to another
  file, a directory, a pipe, a socket or a device in a target's place is
  refused), and verifies every written file against the
  repository's formatter configuration. It only writes: a file an earlier
  render produced that the current corpus no longer does is the caller's to
  remove.

The MCP schemas are built downstream in their consumer layers; this package
owns the corpus types, the graph-native view and query layer over them, and
their transport-free projections.

## Architectural decisions

- [ADR-154](../../../docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md)
  — framework / consumer separation.
- [ADR-157](../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)
  — multi-source open-education integration.
- [ADR-173](../../../docs/architecture/architectural-decisions/173-graph-stack-topology.md)
  — graph stack topology.
- [ADR-179](../../../docs/architecture/architectural-decisions/179-transport-agnostic-graph-substrate.md)
  — transport-agnostic graph substrate.

## Sub-path exports

- `@oaknational/graph-corpus-sdk` — root barrel; re-exports the foundational
  `GraphView` (from `@oaknational/graph-core`) and `Result` (from
  `@oaknational/result`) types.
- `@oaknational/graph-corpus-sdk/eef-strands` — the EEF strands corpus
  foundation.

## Scripts

```bash
pnpm --filter @oaknational/graph-corpus-sdk type-check
pnpm --filter @oaknational/graph-corpus-sdk lint
pnpm --filter @oaknational/graph-corpus-sdk test
pnpm --filter @oaknational/graph-corpus-sdk build
pnpm --filter @oaknational/graph-corpus-sdk render:eef-markdown --out <dir>   # <dir> inside this package
pnpm exec tsx packages/sdks/graph-corpus-sdk/scripts/render-eef-markdown.ts --out <dir>   # from the root
```

## License

MIT
