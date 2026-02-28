# Following the Data

**Date**: 2026-02-28
**Tags**: investigation, elasticsearch, search-quality, triage
**Trigger**: User asked to triage MCP tool exploration findings into the release plan

## What shifted

I expected the thread search issue to be a query-side problem — the
retriever searching the wrong fields, or missing a filter. The initial
analysis pointed there: BM25 queries `thread_title`, ELSER queries
`thread_semantic`, subject is only a filter. The fix seemed obvious:
add subject to the search fields or auto-infer a filter.

Then I checked the actual documents in Elasticsearch. The
`thread_semantic` field doesn't exist on any document. Not empty —
absent. The document builder (`createThreadDocument`) never sets it.
The entire ELSER leg of the 2-way RRF retriever has been operating on
a void across all 164 thread documents.

The query was fine. The data was incomplete.

## What was surprising

The gap between the mapping (which defines `thread_semantic` as
`semantic_text`) and the document builder (which never populates it)
existed in production with no error, no warning, no test failure.
Elasticsearch silently ignores absent optional fields. The 2-way RRF
still returns results via BM25 — just worse ones. The failure mode is
degraded quality, not an error. These are the hardest bugs to find.

## What emerged

The investigation traced through five layers: MCP tool output → search
SDK retriever code → ES query construction → document builder → live
index data. Each layer looked correct in isolation. The bug was in the
gap between layers — the mapping promised a field that the builder
never delivered. The EsCurric `get_document_by_id` tool was the one
that proved it conclusively. Without direct index access, this would
have remained a "the query probably needs tuning" problem.
