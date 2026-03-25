# Semantic Search Architecture — Core Understanding

**Status**: Mandatory directive for all semantic search work.

## Bulk Data

The bulk data is the source of truth for the semantic search system. It is the data that is indexed into the Elasticsearch database. It is downloaded, you can't see it because it is gitignored, use the shell.

## Index operations and CLI checks

When validating Elasticsearch state, distinguish **alias topology** from **document counts**. The `oaksearch admin validate-aliases` command proves that read aliases exist and point at versioned physical indexes; it does not prove that indexed data matches the latest bulk snapshot. True parent counts come from `oaksearch admin count`. See [`apps/oak-search-cli/docs/INDEXING.md`](../../apps/oak-search-cli/docs/INDEXING.md) (_Operational CLI: `validate-aliases` vs `admin count`_) and [ADR-130](../architecture/architectural-decisions/130-blue-green-index-swapping.md).

## Protocol

If you can't follow proper protocol while tuning search, STOP, and explain why, DO NOT work around the protocol.

## The Foundation: Structure-Based Search

**Structure search is the foundation.** This is not negotiable. This is not "good enough". This is what we have, and this is what we are making work.

Every lesson in the curriculum has curated metadata:

- Lesson title
- Unit context
- Keywords
- Key learning points

This metadata is indexed in `lesson_structure` and powers the Structure BM25 and Structure ELSER retrievers.

## Transcripts Are a Bonus

Some lessons (~81%) have video transcripts indexed in `lesson_content`. These enhance search results where available.

**Transcripts are a bonus, not the baseline.** Do not frame Structure-only search as inferior, limited, or needing justification. Structure search covers 100% of lessons — it is the universal foundation.

## Prohibited Framing

Never say or imply:

- "Structure-only subjects may have reduced search quality"
- "Is Structure good enough?"
- "These subjects rely solely on Structure" (as if that's a limitation)
- Any framing that treats Structure as secondary to Content

## Correct Framing

- Structure search is the foundation — 100% coverage
- Content search enhances results where transcripts exist
- All subjects are equally supported by the Structure foundation
- MFL, PE, and other transcript-sparse subjects are fully served by Structure search

## Why This Matters

Incorrect framing creates the false impression that some subjects are second-class citizens in search. They are not. The curriculum team curated excellent metadata for every lesson. That metadata powers Structure search. Structure search works.
