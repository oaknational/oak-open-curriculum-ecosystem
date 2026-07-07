# Working notes: observations, insights, and approaches

Everything understood and learned while building this spike, preserved so the
repository — not just the resulting data — keeps the knowledge. Companion to
[README.md](./README.md) (what the artefacts are) — this file records _why_
and _what we now know_.

## Standing rulings recorded here (owner, 2026-07-07)

1. **All official repository code must be TypeScript, not JavaScript.** The
   three `.mjs` files in this directory are a sanctioned preservation
   exception for this spike only; the integration pass (to be run in a
   Claude Code CLI instance) promotes them to typed, tested workspace
   modules. **Do not merge this PR before that integration decision.**
2. **Licensing posture: academic reuse.** Assume academic rules for now — the
   purpose of the data is reuse — with proper acknowledgement of the authors
   (Gilbride, N., & Jackson, J.) and Ambition Institute. The acknowledgement
   is baked into the data itself (`source.attribution` and
   `source.licenceNote` in `data.json` and the `data.jsonl` meta line), not
   only into prose.

## What we learned about the source document

- **The framework is unusually graph-ready.** Its per-area regularity
  (summary → underpinning ideas → numbered key insights → sample of
  references) maps almost one-to-one onto the graph corpus containment
  pattern (thread → unit → lesson). Documents with this discipline can be
  transcribed rather than mined.
- **The relational prose is the graph's highest-value content.** Sentences
  like "cognitive flexibility … relies on working memory and inhibitory
  control" or "co-regulation precedes self-regulation" become typed
  concept-to-concept edges — exactly the material a prior-knowledge-style
  traversal runs on. When assessing a future source document, scan for this
  relational register first; a document without it yields only containment
  trees.
- **Named constructs behave like the corpus's `keyword` nodes**: terms with
  reader-facing definitions that recur across areas (working memory appears
  in all five). Modelling them once and edge-linking from every mention is
  what makes the graph more useful than the PDF.
- **Some knowledge lives only in images.** The five area divider pages carry
  their specialist-partner attribution solely as logos; a text-layer
  extraction silently loses it. The cure was a visual read of exactly those
  five pages. Generalisation: after text extraction, audit which page
  _types_ carry meaning graphically, and read only those visually.
- **Source defects found** (both preserved rather than silently fixed):
  "predicable" for "predictable" in sensory insight 1's title (twice), and
  the Dockrell et al. (2012) citation naming "RR227" where the actual DfE
  report is DFE-RR247-BCRP4. The citation string is kept verbatim; the
  external-source link points at the true report. Normalisations belong in
  the writeup, never silently in the data.

## What we learned about the graph corpus format

- The generated corpus is **one pretty-printed `data.json`**, not JSONL, and
  its schema lives as **TypeScript interfaces**
  (`graph-corpus-types.ts` in the sdk-codegen bulk generators), not JSON
  Schema or Zod. Zod appears only at the MCP tool-response layer.
- The transferable design grammar: kind-qualified node ids
  (`unit:12-bar-blues`), a discriminated union on `kind`, a small typed
  `{source, type, target}` edge vocabulary, an envelope with **recomputed**
  stats, and honest dropped-work accounting (`droppedEdges`,
  `droppedDuplicates`). This spike mirrors all of it and adds two renderings
  the corpus lacks: JSONL lines and a JSON Schema (the schema plays the
  `graph-corpus-types.ts` role for non-TypeScript consumers).
- Consumption follows ADR-173/ADR-195: anchored, bounded views over one
  corpus (`graph-corpus-sdk`), thin deterministic formatters, complete
  subgraphs within a declared bound. If this data source graduates, a
  concept-anchored view is the natural first consumer.

## Approach decisions and rejected alternatives

- **Text-grounded only.** Every node and edge is grounded in a statement in
  the document. Rejected: inferring insight-level citation edges (the
  document cites per area; mapping references to individual insights is
  plausible for many — Holt 2020 is obviously insight SL-1 — but it is
  inference, and a corpus that mixes transcription with inference without
  marking the difference poisons trust in both).
- **People are not nodes.** Authors, acknowledgement lists, and per-area
  contributors are excluded from the graph; attribution lives in
  `source.attribution`, and published citations stay verbatim in `reference`
  nodes. Organisations are modelled — they are institutional partners, not
  personal data.
- **External links, not external content.** References resolve to terminal
  `externalSource` nodes with a `resolution` provenance marker
  (`doi | publisher | search`) so a consumer knows how much to trust each
  URL mechanically. Rejected: fetching or summarising the referenced papers
  (expands the corpus boundary beyond the original document) and bare URL
  strings on reference nodes (loses the provenance tier and the ability to
  treat links as first-class graph citizens).
- **Crossref as one-off curation, not a build dependency.** The lookup
  script queries `query.bibliographic` once per citation; every match was
  hand-reviewed against author, title, and year before being embedded in the
  generator's `EXTERNAL_SOURCES` table. Builds stay offline and
  deterministic — the same posture the corpus takes to its bulk downloads.
  `crossref-results.json` preserves the raw review evidence.
- **JSONL record design**: each line is
  `{"record": "meta" | "node" | "edge", …}` with the payload byte-identical
  to the envelope entry. Rejected: bare node/edge objects per line (edges
  have no `kind` and a `type` field that collides with any discriminator
  you would add; the wrapper keeps one unambiguous discriminator and lets
  one schema serve both renderings).
- **One schema file, two entry points**: the root validates the envelope;
  `#/$defs/jsonlRecord` validates a line. Rejected: two schema files
  cross-referencing each other (validator `-r` plumbing for no gain).
- **References attach at area level** because that is where the document
  attaches them. Blank et al. (2019) is cited by both sensory and motor and
  becomes one shared node with two `citesReference` edges — the first
  genuinely cross-area evidence node.

## Reference-resolution field notes (Crossref)

- 43 of 49 citations resolved correctly on the first `query.bibliographic`
  pass. Review criterion: first-author family name + title match; a ±1 year
  offset is normal (online-first vs print — Wulf 2010 resolves as 2009,
  Furley 2025 as 2023) and is not a mismatch signal by itself.
- **Grey literature is where bibliographic matching fails**: the DfE research
  report and the EEF review both returned confidently wrong journal papers
  (right authors' field, wrong work). Books (Ericsson & Pool) and working
  papers (Harvard Center on the Developing Child) have no DOI at all.
  Disposition: hand-verified publisher URLs (`resolution: "publisher"`), or
  an honest scholar-search URL (`resolution: "search"`) when no stable
  canonical page exists.
- A no-match or HTTP 500 on the bibliographic query often succeeds on a
  retry with `query.title` + `query.author` split out (Gathercole 2004,
  Unwin 2024 both recovered this way).

## Visualisation approach (graph.svg)

- **Deterministic layered layout** beats force-direction for this shape: the
  graph is nearly multipartite (framework → areas → ideas/insights →
  concepts → references), so five columns with barycentre ordering (each
  node placed at the mean y of its neighbours) kills most crossings without
  any physics, and the output is stable across runs — diffable in git.
- **Accessibility decisions**: `role="img"` + `<title>`/`<desc>` with
  `aria-labelledby`; every node is real text (not paths); the Okabe-Ito
  colour-blind-safe palette; colour is never the sole carrier — area
  membership is also position/grouping, ideas are square-cornered vs rounded
  insights, and the five concept-relation types are dash patterns with a
  legend. Full node text lives in hover `<title>` tooltips.
- **Terminal link nodes render as hyperlinks, not boxes**: each reference
  pill is wrapped in `<a href>` to its external source (with a visible ↗
  affordance and focus styling), which shows 50 `availableAt` edges without
  50 extra nodes of clutter. SVG-as-hypertext is underused.
- Verification: render to PNG (`rsvg-convert`) and actually look at it;
  Graphviz was unavailable on the build machine, which pushed us to the
  hand-rolled layout — in hindsight the better outcome (no dependency, fully
  deterministic, layout logic preserved as code).

## Validation discipline

- The generator **recomputes** stats and refuses to emit on unresolved edge
  endpoints, duplicate ids/edges, self-loops, or non-kind-qualified ids —
  the same validators-recompute posture as the corpus generator. Hand-counted
  numbers appear nowhere.
- Outputs were additionally validated with an independent tool (ajv,
  `--spec=draft2020 -c ajv-formats`) rather than trusting the generator's
  own checks. Note: ajv strict mode rejects `format: "date-time"` without
  the `ajv-formats` plugin even though the 2020-12 spec makes `format`
  annotation-only — the schema is correct; the validator needs the plugin.
- Cheap arithmetic checks earn their keep: 1 meta + 184 nodes + 282 edges =
  467 JSONL lines, `wc -l` confirms.

## Session observations (process and tooling)

- **`commit-queue` is blind to worktree indices** (candidate
  frictions-register entry): `record-staged`/`verify-staged` read the
  primary checkout's index, so a worktree-staged bundle fingerprints as
  empty and verification reports every intended file missing. The skill
  already contemplates worktree commit windows
  (`git:index/head@<worktree>` claims); the queue's git surface does not.
  This session's commit landed via the documented explicit-pathspec path
  with first-hand staged-set verification and the full hook chain green.
- **Identity seeds must be exported once, never retyped**: two hand-typed
  `PRACTICE_AGENT_SESSION_ID_CLAUDE` values drifted mid-session, splitting
  one session across two display names in collaboration state (corrected in
  the closeout comms event).
- **n=1 ruling (owner, 2026-07-07)**: in a solo session, skip the
  multi-agent ceremony (watcher, claims, broadcast events, commit-queue) —
  keep commits, gates, and memory capture. The ceremony exists for
  concurrent agents, not as a rite.
- `pdftotext -layout` handled the two-column "underpinning ideas" pages
  correctly; worth spot-checking that layout mode on any new document
  before trusting the linear text.

## Reproduction

From this directory (Node ≥ 20, no dependencies):

```bash
node build-itf-graph.mjs   # emits data.json, data.jsonl, schema.json
node render-itf-svg.mjs    # emits graph.svg from data.json
node crossref-lookup.mjs   # optional: re-queries Crossref (evidence only)
```

Only `generatedAt` differs between runs; all other output is deterministic.

## Integration checklist (for the Claude Code CLI pass)

1. Promote the generator and renderer to a typed, tested TypeScript module
   in an appropriate workspace (ADR-168 discipline; delete the `.mjs`
   preservation copies in the same change).
2. Decide the canonical home for the data (spike dir vs a generated-data
   location) and whether the corpus gains a `sourceDocument` provenance
   convention shared with the bulk-download corpus.
3. Consider a concept-anchored bounded view (`graph-corpus-sdk` style,
   ADR-173/ADR-195) as the first consumer.
4. Revisit insight-level citation edges only as explicitly-marked inference
   (a distinct edge type or a `derivation: "inferred"` marker), never mixed
   silently with transcription.
5. Carry the licensing statement (`source.attribution`, `source.licenceNote`)
   into whatever surface serves the data.
