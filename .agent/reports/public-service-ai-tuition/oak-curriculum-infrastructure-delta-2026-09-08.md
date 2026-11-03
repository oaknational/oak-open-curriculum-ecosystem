# Oak curriculum infrastructure delta — 8 September 2026

## Review contract

**Purpose and intended impact:** update the public-service AI-tuition research reader with two verified Oak curriculum-infrastructure changes without rewriting the imported 6 September collection or projecting upstream work into Engraph before it is incorporated.

**Questions for review:**

1. Does the report distinguish Oak upstream release state, current Engraph state and the separate Curriculum API repository?
2. Does it describe authored order without converting sequence adjacency into prerequisite truth or claiming one definitive KS4 board/tier order?
3. Does it preserve the open consumer, corpus-reproducibility, deployment and impact gaps?
4. Does every material statement resolve to a dated primary repository record?

**Evidence standard and authority boundary:** release, pull-request, commit and local repository-state evidence establish code, interface and version facts. They do not independently establish deployment, adoption, educational quality or pupil outcomes. This report is a dated factual supplement; it does not ratify the tuition collection’s proposed architecture or work programme.

**Non-goals:** this report does not sync upstream OCE, change generated artefacts or served-tool documentation, modify Curriculum API code, choose an integration design, approve a release, or make a claim about the UK tutoring cohort, Sovereign Education Benchmark or trial results.

**Successful review:** the two changes and their remaining boundaries can be recovered from this file alone, and no statement exceeds the named evidence. Missing evidence or a mismatch against the contract is a finding, not an invitation to infer completion.

## Current-state summary

| Surface | Verified change | State on 8 September 2026 | Principal boundary |
|---|---|---|---|
| Oak OCE | Upstream `1.178.6` carries authored unit and lesson order in explicit graph-corpus sections; `get-thread-progressions` serves subject-specific curriculum runs | Released upstream | Engraph remains at `1.178.5`; `get-misconception-graph` correction is still open |
| OCE graph corpus | Ordered `sequences` and `unitLessonRuns`; same-year sequencing audit; corpus schema `1.5.0` | Present in upstream release | KS4 board/tier variants are merged; prior bulk snapshot was not retained; synthetic prerequisite-labelled edges remain |
| Oak Curriculum API | `0.11.1` centralises subject validation and admits `combined-science` | Released in the separate API repository | Affected volume and complete live-deployment timing are not stated in the cited release or fix commit |

## 1. OCE 1.178.6 restores authored order at one served boundary

The merged upstream [PR 965](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/965) records that the graph corpus previously discarded two authored orderings. Thread placements were sorted by `(year, unitId)`, making same-year units alphabetical by slug; lesson membership was serialised as a deterministically sorted edge set, so consumers reading array order also received identifier order rather than authored lesson order.

The [1.178.6 release](https://github.com/oaknational/oak-open-curriculum-ecosystem/releases/tag/v1.178.6) changes the representation and one served consumer:

- thread `sequences` are per `(thread, subject)` and preserve years ascending plus Oak’s authored unit order within a year;
- `unitLessonRuns` records authored lesson order separately from the unordered membership edge set;
- `get-thread-progressions` returns the subject-specific runs rather than an interleaved or identifier-sorted chain;
- the sequencing auditor now checks same-year inversions; and
- the corpus schema advances from `1.4.0` to `1.5.0`.

The scale facts need precise interpretation. Oak reports that **90% of thread placements sit in a same-year group** to which the former alphabetical rule applied. This is not a measured 90% misordering rate. At lesson level, the PR reports 25,945 inversions among 56,238 comparable within-programme pairs under the former identifier-derived order, falling to 75 under the selected merged-order rule.

### Boundaries that remain

The authored order is not one universal curriculum sequence. A KS4 unit node merges exam-board and tier variants. Where they disagree, the implementation uses the earliest authored position and a slug tie-break. The [boundary commit](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/3b44c41bec95389e8cf57ec1d1870580af00c7d5) correctly describes this as a bias towards earlier placement, not any board’s definitive order.

The change does not complete every consumer. [`get-misconception-graph` PR 966](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/966) remained open when checked, so that tool must not yet be described as serving the corrected order. Synthetic `prerequisiteFor` adjacency edges also remain pending separate generator work and corpus regeneration. Authored sequence and pedagogical prerequisite remain different relations.

The release also exposes a reproducibility gap. The graph corpus is generated from bulk downloads that are not retained in the repository. PR 965 records that the earlier snapshot was already unavailable, so the regeneration accompanying the ordering change also contains upstream curriculum drift that cannot now be isolated as an ordering-only diff. This narrows reviewability; it does not negate the measured ordering correction.

## 2. Engraph has not yet incorporated 1.178.6

The current Engraph default branch was inspected at `270b8ec6fb82dc6881c10ca101cb8d3c7a242d6e`. Its root package version is `1.178.5`, and the upstream `1.178.6` boundary commit is not an ancestor. Current Engraph code and generated documentation therefore retain the `1.178.5` ordering contract.

The imported chapter [`08-oce-audit-and-engineering-findings.md`](../../research/public-service-ai-tuition/08-oce-audit-and-engineering-findings.md) remains a dated historical audit and must not be silently edited. Read its older OCE facts together with this report:

- its `1.178.4` repository pin remains the correct identity for the evidence it records;
- its statement that the old prerequisite view remained live was superseded by Engraph’s verified `1.178.5` sync through PR 73; and
- the authored-order capability described here remains upstream-only until a separate Engraph sync is reviewed and landed.

A future sync should incorporate upstream changes as a coherent release delta rather than hand-editing generated artefacts or current served-tool descriptions. That implementation decision is outside this report.

## 3. Curriculum API 0.11.1 repairs Combined Science validation

The [Curriculum API 0.11.1 release](https://github.com/oaknational/oak-curriculum-api/releases/tag/v0.11.1) records a defect in which some Combined Science lesson assets returned `404`. The exact [fix commit](https://github.com/oaknational/oak-curriculum-api/commit/900613fbff8735846f101ae2607c584ce7d0eac7) moves allowed-subject checking behind one `isSubjectAllowed` function, includes `combined-science`, and applies the function across:

- lesson asset validation;
- lesson lookup;
- programme lookup;
- question/quiz lookup; and
- sequence-slug parsing.

This establishes the cause and code correction. It does not establish how many resources, requests or users were affected, how long the defect was present, or when every live deployment received the release. The Curriculum API is a separate Oak repository and service; no Engraph product-code change follows merely from this release. Schema or client alignment should continue through the normal generated-contract path when an upstream contract changes.

## 4. Consequences for the tuition research

These changes strengthen a narrow part of the capability chain: machine-readable curriculum interfaces can now expose more faithful sequence information, and a subject-validation defect affecting Combined Science has a released correction. They also show why public infrastructure assessment must track semantics and failure behaviour, not only whether code and endpoints exist.

They do **not** change the public-service tuition collection’s bottom-line maturity:

- no national tutoring service or pupil benefit is established;
- no Sovereign Education Benchmark tasks, method or results are published;
- no official DfE architecture or OCE role is established;
- no independent OCE adoption or educational-effect evidence appears.

## 5. Reopening triggers

Reopen this current-state report when one of the following occurs:

1. Engraph incorporates upstream OCE `1.178.6` or a later release.
2. PR 966 or its successor merges and releases the misconception-graph consumer correction.
3. Synthetic prerequisite-labelled edges are regenerated or retired with migration evidence.
4. Oak publishes a retained, reproducible graph-corpus input snapshot or an equivalent provenance mechanism.
5. Oak publishes Curriculum API incident scope, affected-volume evidence or complete deployment confirmation.
6. Independent consumer, adoption, accessibility, reliability or educational-effect evidence appears for either surface.

## Reopening — 9 September 2026

Trigger 1 is met by the pull request this addendum lands in (EngraphCode #90, the upstream sync carrying `3f1e88cabcd6fc7ce0b64c4437b796bb478b3c1a`, release `1.178.6`): its merge is Engraph's incorporation of `1.178.6`, so section 2's "has not yet incorporated" describes the state before that merge. The sync regenerated the fork's model-behaviour-content workspace from the incoming source and re-trued the two delivery plans whose premise the ordering change altered (`curriculum-structure-true-views`, `upstream-curriculum-data-exposure`). Triggers 2 to 6 stand: at upstream `main` `652718786` (fetched 9 September 2026) PR 966 is not merged, synthetic `prerequisiteFor` edges are still emitted (2,881 in the regenerated corpus), and no retained input snapshot, incident-scope evidence or independent adoption evidence has appeared.

## Reopening — 10 September 2026

Trigger 2 is met by the pull request this addendum lands in (the upstream sync carrying
`216e64c1563354a0b096846e98ea465b8d2321ee`, release `1.181.1`): upstream merged PR 966 as
MCP-682 (commit `8f44de90d`, released in `1.181.1`), so `get-misconception-graph` now serves
curriculum order with the per-board caveat upstream recorded, and section 1's "must not yet be
described as serving the corrected order" describes the state before this merge. The sync
regenerated the fork's model-behaviour-content workspace from the incoming source. Triggers 3
to 6 stand: at `216e64c15` synthetic `prerequisiteFor` edges are still emitted (2,882 in the
regenerated corpus), and no retained input snapshot, incident-scope evidence or independent
adoption evidence has appeared.

## Source register

- [Oak OCE release 1.178.6](https://github.com/oaknational/oak-open-curriculum-ecosystem/releases/tag/v1.178.6), published 8 September 2026
- [Oak OCE PR 965](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/965), merged 8 September 2026
- [Oak OCE KS4/bulk-reader boundary commit](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/3b44c41bec95389e8cf57ec1d1870580af00c7d5)
- [Oak OCE PR 966](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/966), open when checked 8 September 2026
- [Oak Curriculum API release 0.11.1](https://github.com/oaknational/oak-curriculum-api/releases/tag/v0.11.1), published 8 September 2026
- [Oak Curriculum API fix commit](https://github.com/oaknational/oak-curriculum-api/commit/900613fbff8735846f101ae2607c584ce7d0eac7)
- Engraph `origin/engraph` at `270b8ec6fb82dc6881c10ca101cb8d3c7a242d6e`, root package `1.178.5`, inspected 8 September 2026

**Evidence status:** authoritative on the named repository versions, diffs and open/merged state; provisional on deployment and external effects because no independent operational evidence was identified in this bounded update.
