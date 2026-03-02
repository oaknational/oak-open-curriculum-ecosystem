# WS2+WS3: Pedagogical Context Review Checkpoint

**Last Updated**: 2026-03-01
**Status**: Future (review checkpoint after WS1 completion and usage)
**Scope**: Evaluate whether agents need additional pedagogical context beyond
what `get-curriculum-model` already provides.

---

## This Is a Review Checkpoint, Not an Implementation Workstream

The original WS2 proposed embedding ~50 Oak glossary terms as structured data.
The original WS3 proposed evaluating whether WS1+WS2 were sufficient.

On review, WS1 already provides substantial pedagogical context:

- **Entity hierarchy** — defines what "unit", "lesson", "thread" mean in Oak
- **UK education context** — maps years to ages, explains key stages, GCSE
- **Threads** — explains how concepts build across years
- **Canonical URLs** — linking patterns for the Oak website
- **Search guidance tip** — the three-part rule for term handling
- **Tool guidance** — how to use search with correct filters vs text

The question is whether **additional structured glossary data** would
measurably improve agent behaviour, or whether the existing context is
sufficient. This should be answered empirically, not speculatively.

---

## Separate Concern: Search Synonym Infrastructure

The search synonym/alias/phrase infrastructure under
[`03-vocabulary-and-semantic-assets`](../../semantic-search/future/03-vocabulary-and-semantic-assets/)
is about Elasticsearch query expansion — mining curriculum data for synonym
candidates. That is a **search quality concern**, not an agent context concern.

| Concern | Consumer | Mechanism | Location |
|---|---|---|---|
| Agent context | AI agents via MCP | `get-curriculum-model` response | This checkpoint |
| Search expansion | Elasticsearch | Synonym sets, phrase boosters | `semantic-search/future/03-*` |

---

## Evaluation Criteria

After agents have been using `get-curriculum-model` in production:

1. **Term preservation**: Do agents correctly preserve user curriculum terms
   (e.g. "KS4 maths" not rewritten to "GCSE maths")?
2. **Filter mapping**: Do agents correctly map colloquial terms to filters
   (e.g. "GCSE" maps to key stage filter, not search text)?
3. **Pedagogical ambiguity**: Do agents understand domain-specific meanings
   (e.g. "unit" = teaching unit, "lesson" = structured learning episode)?
4. **Gap identification**: If gaps remain, what specific terms or disambiguation
   patterns are missing?

---

## Possible Outcomes

- **Current context is sufficient** — no further work needed. Archive this checkpoint.
- **Targeted additions** — small enhancements to entity definitions or tips.
  Not a new workstream.
- **Structured glossary needed** — create a new targeted plan with evidence
  from this review, scoped to the specific gaps identified.

---

## Promotion Trigger

This checkpoint should be evaluated when:

1. WS1 is complete and deployed (including the data gap fixes)
2. Agents have used `get-curriculum-model` in at least 2 weeks of production
3. Feedback or observation suggests term ambiguity remains a problem

---

## Related Plans

- [WS1: get-curriculum-model](../active/ws1-get-curriculum-model.plan.md) —
  provides the domain model and entity definitions
- [03-vocabulary-and-semantic-assets](../../semantic-search/future/03-vocabulary-and-semantic-assets/) —
  separate search infrastructure concern
