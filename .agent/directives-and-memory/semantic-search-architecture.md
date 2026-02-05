# Semantic Search Architecture — Core Understanding

**Status**: Mandatory directive for all semantic search work.

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
