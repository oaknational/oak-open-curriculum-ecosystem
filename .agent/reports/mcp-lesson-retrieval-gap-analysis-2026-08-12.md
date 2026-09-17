---
title: MCP lesson-retrieval gap — bug-report analysis and source comparison
date: 2026-08-12
author: Skua binds Vortex (claude-code / claude-fable-5 / 027610)
status: >-
  corrected same-day against exact oak-openapi source history; supersedes the
  first draft's verdicts. Split per owner ask: what the MCP layer can and
  cannot handle, and what (if anything) should change in the API.
inputs: >-
  third-party bug report (get-lessons-summary / fetch / search vs
  get-key-stages-subject-lessons); first-hand wire probes; oak-openapi source
  at origin/main 3b4b01e; this estate's bulk artefacts and search index
---

# MCP lesson-retrieval gap — analysis, corrected against source (2026-08-12)

A third-party report stated that 8 lesson slugs are listed by
`get-key-stages-subject-lessons` and live on the website, while
`get-lessons-summary`, `fetch`, and `search` cannot retrieve them. Everything
in the report reproduced first-hand. The full investigation — wire probes,
this estate's bulk artefacts and search index, and an exact read of the
upstream source and its git history — resolves the report completely and
locates every mechanism. This document is the corrected record; its first
draft's verdicts ("upstream bug, high priority", "silent ingest drop") are
superseded by the dated, cited findings below.

## The organising model: availability is a property of (lesson × surface)

A lesson slug is in one of four states per API surface: **unknown** (no such
slug), **restricted** (exists; third-party copyright restriction),
**subject-gated** (exists; its subject is outside what the endpoint serves),
or **served**. The upstream API's own June-era code states its policy for
how these states surface (comment, summary handler, main @ 2026-06-12):

> "…we'll return a 404 instead of a 451. This is because we don't want to
> leak information about what lessons are blocked by returning a different
> status code for blocked vs non-existent lessons."

So upstream deliberately **conflates states at the status-code level** and
**differentiates via the error message** — the anti-leak policy. Every
finding below is an instance of that policy working, drifting, or being
applied inconsistently across surfaces. It is a policy with a written
rationale, not an accident.

## Exact mechanics today (oak-openapi origin/main @ 3b4b01e)

Five distinct database views back the surfaces (`src/lib/owaClient.ts:7-27`),
which is why they can disagree about the same slug:

| Surface | Backing view | Availability gates, in order |
| --- | --- | --- |
| `/lessons/{l}/summary` | `published_mv_lesson_openapi_1_2_3` | rows=0 → 404 "Lesson not found"; then subject allowlist on `data[0].subjectSlug` → the same 404 (`lesson.ts:185-198`). Restriction does NOT gate this endpoint (check commented out, `lesson.ts:139-148`); it only flips `downloadsAvailable` to false (`lesson.ts:248-253`) |
| `/lessons/{l}/transcript` | `published_mv_lesson_content_published_5_0_0` | restriction gate FIRST → 400 "Transcript not available: \"slug\"" + `data.cause` containing "blocked" (`transcript.ts:35-43`); NO existence check — an unknown slug passes the gate and dies at `vtt.replace` on undefined → 500 (`transcript.ts:60-63`) |
| `/lessons/{l}/assets` | `published_mv_openapi_downloads_1_0_0` | restriction gate → 400 "Lesson not available: \"slug\"" (`assets.ts:58-62`) |
| `/lessons/{l}/quiz` | (questions views) | restriction gate → 400 "Lesson (slug) quiz is not available due to restrictions" (`questions.ts:61-65`); an unknown slug returns **200 `{"starterQuiz":[],"exitQuiz":[]}`** — silent empty, no existence check |
| `/lessons/{l}/assets` (missing case) | | unknown slug → 404 "No lessons found" (`assets.ts:101-105`) — the one endpoint pair that fully realises the 404-missing / 400-restricted convention |
| `/key-stages/{ks}/subject/{s}/lessons` | `published_mv_synthetic_unitvariant_lessons_by_year_12_0_0` | no subject allowlist; KS4 science handled via `subject_parent: 'Science'` special case; no per-lesson dedup (12 variant rows per lesson) |
| `/search/lessons` | `published_function__table__mv_lesson_openapi_search_1` + the summary view | no subject gate |
| `/lessons/check-restricted` | `published_mv_lesson_restriction_levels_1` | `_state=published`; response omits unknown slugs (absence = unknown) |
| bulk artefact | `published_view_lesson_open_api_with_transcripts_1` | restricted lessons INCLUDED, marked `restricted: true`, transcripts stripped (`bin/prepare-bulk.ts:102-140`) |

Restriction semantics (`src/lib/queryGate.ts`): a lesson is "restricted" when
the highest of four third-party-content axes (downloadable files, media, quiz
images, works) is RESTRICTED or HIGHLY_RESTRICTED. Wire-verified: the three
sibling endpoints emit three different "not available" message shapes, all
carrying the "blocked" cause string.

## The response-code convention, verified live (2026-08-12)

Clarification recorded at owner request. The API's design convention is
**404 = missing lesson; 400 + a "not available" message = blocked for
copyright (restriction)**. Live matrix, one unknown slug and one restricted
lesson (`pure-substance`) against every lesson endpoint:

| Endpoint | Unknown slug | Restricted lesson |
| --- | --- | --- |
| `/lessons/{l}/assets` | 404 "No lessons found" | 400 "Lesson not available: …" |
| `/lessons/{l}/quiz` | 200 `{"starterQuiz":[],"exitQuiz":[]}` — silent empty | 400 "…quiz is not available due to restrictions" |
| `/lessons/{l}/transcript` | 500 unhandled TypeError | 400 "Transcript not available: …" |
| `/lessons/{l}/summary` | 404 "Lesson not found" | 404 "Lesson not found" (subject gate) — or 200 with `downloadsAvailable:false` where the subject passes the allowlist |

Reading: the convention is fully realised only on `/assets`. `/quiz` and
`/transcript` honour the restricted-400 half but mishandle the missing half
(silent 200-empty; a 500 crash). `/summary` is the sole surface with **no
copyright 400 at all** — and only since era 2 (2026-07-22): its copyright
gate is commented out, restriction there only flips `downloadsAvailable`,
and its 404s conflate missing with subject-gated. Until 2026-07-22, summary
matched the convention too (400 "Lesson (slug) not available for this query
(blocked for copyright text)"). Consumer guidance follows from this: a 400
whose message or cause carries the "not available"/"blocked" vocabulary is
the copyright signal on every endpoint that emits one; a summary 404 is
ambiguous and needs the `check-restricted` oracle to resolve.

## The era history of the summary endpoint (dated from git)

1. **Era 1 — through 2026-07-22.** Copyright gate first, with the anti-leak
   existence check: unknown → 404 "Lesson not found"; exists-but-blocked →
   400 "Lesson (slug) not available for this query (blocked for copyright
   text)". Message-differentiated, per the policy.
2. **Era 2 — PR #309 `fix/lock-subjects`, merged 2026-07-22T13:08:41+01:00.**
   The tpc-database rework (authored 2026-07-07/10) removed the summary
   copyright gate (commented out pending a product decision) and added the
   subject allowlist gate. Two consequences: restricted lessons whose subject
   passes the allowlist now serve 200 summaries (verified: a restricted KS3
   English lesson serves 200 with `downloadsAvailable:false`), and **every
   KS4-science-only lesson now returns 404 "Lesson not found"** — including
   ogl-compatible ones and the reporter's own working control case.

The gate's intent is documented by its own artefacts: its test file
(`__tests__/blocked-subjects.test.ts`) exercises only `financial-education`
blocking; `queryGate.ts:78` exports a `blockedSubjects =
['financial-education']` denylist **with zero consumers** (minted and
abandoned); the shipped allowlist form checks `data[0].subjectSlug` against
the 17 teaching subjects, while KS4 science rows in the summary view carry
programme subjects (`chemistry`, `combined-science`, `biology`, `physics`) —
wire-verified via upstream's own `/search/lessons`, which joins the same
view. The repo contains its own correct pattern for this vocabulary problem
(the listing endpoint's `subject_parent` special case), unused at the gate.
Latent adjacent defect: the gate reads `data[0]` of an unordered,
300-second-cached query — for a slug spanning subjects, the verdict depends
on arbitrary row order.

## The reporter's experience, resolved exactly

- Their tests predate 2026-07-22 (their KS4-science control worked; it
  cannot after era 2).
- In era 1, an existing-but-blocked lesson said "not available". Their 8
  slugs said **"Lesson not found"** — and era 1's code path producing that
  string runs an existence check against the summary view. Their report
  therefore proves the 8 were **absent from
  `published_mv_lesson_openapi_1_2_3` at their test time**. Their "orphaned
  records" hypothesis was correct for their era. (Why the view excluded them
  then and includes them now is answerable only in the OWA/Hasura layer —
  the one precise question left for the API team's data side.)
- The 8 are **8/8 restriction-flagged** (`check-restricted`), and this
  estate's search-index gap is exactly the restricted class (below) — which
  is why search could not surface them either. Every surface they touched
  failed for a restricted-class reason; none of it was random.
- Their "two tickets" suggestion (permanent vs intermittent) does not carve
  at the mechanisms; the split that does is: restricted-class availability
  semantics, the era-2 subject-gate collateral, and this estate's index
  freshness. Their intermittent observation is most plausibly the era
  transition itself crossing their test window, with the `data[0]`
  nondeterminism as a latent additional source; their batch-level pattern is
  not reproducible from here and is not needed to explain anything.

## This estate's search index (framing per owner ruling 2026-08-12)

The live index (`oak_lessons_v2026-07-27-132106`, 11,022 docs) is missing
exactly the restricted-lesson class (sampled: science 34/34 — the reporter's
8 among them — english 177, music 73, history 46, maths 5; every spot-checked
missing lesson is restriction-flagged, every spot-checked present sibling is
ogl-compatible). **This is not an error: it is the consequence of automatic
index updates not having been built yet** — a known infrastructure gap, a
problematic state to fix by investment, not a breakage. Supporting facts:

- Bulk artefact eras: the June-10 artefact predates upstream's
  restriction-marking deployment (zero `restricted` flags, transcripts
  present on everything, including restricted lessons — an exposure upstream
  has since closed); the July-27/August artefacts include-and-mark (79/2090
  science rows flagged, transcripts stripped).
- The principal checkout's bulk data was refreshed 2026-08-12 at owner word
  (delete → download → regenerate → verify): fresh bundle carries all 34,
  plus a new subject pair (`rshe-pshe`); schema unchanged; type-check green.
- The exact mechanism that dropped the restricted class at the 2026-07-27
  build is **unproven**: the schema declared `restricted` three hours before
  the build, and neither the transformer nor API-supplementation has a drop
  path. Surviving candidate: a stale built artefact at ingest time. A
  rebuild from the fresh bundle is simultaneously the cure and the
  falsifier.
- Rebuild is gated on one policy decision (owner-level): whether restricted
  lessons' METADATA belongs in the search index. Recommendation: yes, with
  the `restricted` flag carried into the documents and surfaced in results —
  the website serves these lessons publicly, upstream's own bulk artefact
  deliberately ships their metadata (assets and transcripts already
  stripped), and a search surface that silently omits them recreates the
  reporter's silent-gap experience.

## What the MCP layer CAN handle (no upstream change required)

Split into three buckets by impact and effort (owner ask, 2026-08-12). The
buckets carve a conceptual seam, not just a size gradient: **Bucket 1 stops
losing information we already have; Bucket 2 creates new diagnostic
information at the boundary; Bucket 3 makes freshness and coherence
self-maintaining.**

### Bucket 1 — Now: high impact, small effort (existing machinery)

1. **Rebuild the search index from the fresh bundle.** The bundle is on
   disk (2026-08-12 vintage), the ingest and alias-swap machinery exists,
   and the rebuild restores the entire restricted class (~hundreds of
   lessons, the reporter's 8 included) to search. It is also the falsifier
   for the unproven 2026-07-27 drop mechanism. One policy call gates it:
   whether restricted lessons' metadata is indexed (recommended yes, with
   the `restricted` flag carried into documents and surfaced in results).

   > **Superseded in part — owner ruling 2026-08-12, post-dating this
   > report:** the rebuild proceeds with restricted EXCLUDED behind a
   > documented default-exclude switch. It restores the fresh included
   > corpus, not the restricted class (the reporter's 8 stay out of search
   > by policy), and the restricted-ingestion falsifier does not run at the
   > default. The ratified `lesson-search-freshness-and-error-envelope`
   > plan is the authority; this paragraph stands as the report's original
   > pre-ruling analysis.
2. **Preserve error structure through the envelope** (agreed direction).
   The SDK already classifies upstream errors
   (`classify-error-response.ts`: `RESOURCE_NOT_FOUND`,
   `CONTENT_NOT_AVAILABLE` on the "blocked" cause, `AUTHENTICATION_REQUIRED`,
   `UPSTREAM_*`); the MCP result then flattens everything to a message
   string. Carry `{code, message, upstreamMessage}` as structured content
   for every tool. Classification is transport, not correction — generated
   pass-through tools stay faithful. Falsifier: an MCP client that still
   cannot discriminate the classes mechanically.
3. **Pin the upstream error vocabulary with contract tests** (rides with
   item 2). The message strings are not in the OpenAPI spec, so the
   observed vocabulary is the contract: tests that redden when upstream
   wording drifts, `upstreamMessage` always carried verbatim. Falsifier: an
   upstream wording change that silently reclassifies instead of reddening
   a test.

### Bucket 2 — Next: high impact, moderate effort (the differentiation build)

1. **`fetch` 404 enrichment via the `check-restricted` oracle.** On a
   summary 404, one oracle call differentiates: `restricted` → structured
   CONTENT_NOT_AVAILABLE with the honest explanation and the lesson's
   `oakUrl` (the website serves it); `ogl-compatible` and present in
   listings/our index → "exists in the catalogue but not retrievable here"
   (the self-describing contradiction signal the reporter lacked); absent
   from oracle and catalogue → true not-found. `fetch` is our constructed
   tool (`aggregated-fetch`), fully ours to build. Sequenced after Bucket 1
   item 2 so the enrichment lands as structure, not prose. Falsifier: an
   integrator still unable to tell the three cases apart from the error
   alone.
2. **A coherence canary.** A scheduled probe asserting: every slug the
   listing serves is either fetchable or carries a machine-readable
   unavailability reason. Would have caught era 2 within a day; instead an
   external integrator found it. The probe itself is small (the
   probe-lesson-availability script is its seed); the moderate effort is
   the scheduled home and alert routing.

### Bucket 3 — Invest: structural, larger effort (deliberately scheduled)

1. **Automatic index updates.** Scheduled download → ingest → alias-swap
   with a reconciliation gate that recomputes expected-vs-indexed counts
   against the declared inclusion policy and refuses unexplained shrinkage;
   index metadata and search responses carry the source-snapshot vintage
   (`manifest.downloadedAt`) so staleness is observable instead of silent.
   This is the owner-named infrastructure gap behind the index finding; it
   subsumes Bucket 1's manual rebuild as the steady state. Falsifier: a
   future upstream availability shift reaching consumers before the estate
   notices.
2. **Candidate, owner-gated: degraded-summary fallback from our own index**
   when upstream cannot serve a lesson — provenance-labelled,
   vintage-stamped, and **gated on the restriction oracle**: serving
   restricted content upstream deliberately refuses would be a licensing
   violation, so the fallback may only ever serve what the inclusion policy
   admits. Highest-risk item in this report; carried as a candidate, not a
   commitment.

## What the MCP layer CANNOT handle (inherent limits)

1. **It cannot recover distinctions upstream does not emit.** Today's
   summary 404 is byte-identical for unknown, restricted, and subject-gated
   slugs (verified on the wire, same headers). Anything we add is inference
   from extra calls (the oracle, listings) — good inference, but a second
   request per failure and never upstream truth.
2. **It cannot know upstream intent.** Whether the KS4-science summary
   404s are intended cannot be determined from outside; only the API team
   can adjudicate the gate's collateral.
3. **It cannot serve restricted content.** No fallback may cure deliberate
   unavailability; the MCP layer can only explain it and point at the
   website.
4. **It cannot fix upstream defects** (the transcript 500 on unknown slugs).
5. **It cannot make a snapshot-backed search index real-time.** Without
   upstream change events, staleness is bounded by refresh cadence (the
   bulk freshness contract's 14 days), not eliminated.

## What, if anything, should change in the API

Held as questions and candidates for the API team, not filed defects — with
one exception. The anti-leak policy is respected throughout: nothing below
asks for status-code differentiation.

1. **The KS4-science summary collateral — a question the evidence answers
   strongly.** The gate's intent (its test file, the abandoned denylist, the
   branch name `fix/lock-subjects`) was financial-education-class blocking;
   the allowlist implementation also 404s every KS4-science-only lesson
   because the summary view speaks programme subjects. If unintended, the
   fix is a one-condition vocabulary change (accept subjects whose parent is
   an allowed subject, mirroring the listing endpoint's own
   `subject_parent: 'Science'` case — or use the existing `blockedSubjects`
   denylist as designed). Recommendation: ask, with this evidence attached;
   the blast radius (an entire GCSE subject's lesson metadata) makes it
   worth asking promptly.
2. **Unknown-slug handling is inconsistent across the lesson endpoints —
   one defect, one silent-empty.** The design convention (404 = missing,
   400 + "not available" message = copyright-restricted) is fully realised
   only on `/assets`. On `/transcript`, an unknown slug passes the
   restriction gate and crashes on `vtt.replace(undefined)` → 500 (defect
   by any reading; an existence check restores the intended 404). On
   `/quiz`, an unknown slug returns 200 with empty quiz arrays — a silent
   empty indistinguishable from a real lesson with no quizzes. Both are
   small, safe fixes worth reporting as-is.
3. **Optional, policy-consistent: restore message differentiation on
   summary.** Era 1 differentiated exists-but-blocked via message while
   keeping the status conflated; era 2 dropped it. Restoring an era-1-style
   message for gated/blocked-but-existing lessons (and using the sibling
   endpoints' "not available" vocabulary) would let every consumer handle
   availability without oracle round-trips — status codes untouched.
4. **Optional, documentation-only: enumerate the error vocabulary in the
   OpenAPI spec.** Today the messages are runtime behaviour with "e.g."
   prose; enumerated codes/messages would let consumers derive handling
   from schema instead of observation (and would have made this analysis a
   spec read).
5. **Data-side question (OWA/Hasura layer):** why were the reporter's 8
   absent from `published_mv_lesson_openapi_1_2_3` in their era-1 test
   window, and present now? Their report is the evidence the view's content
   shifted; the view's history is not visible from the API repo.

## Reporter reply (disposition sketch)

Confirm full reproduction; thank them — their control case and their 8-slug
sample were both load-bearing evidence, and their "different backing stores"
hypothesis was correct (five views). Explain the availability reframe: their
8 are restricted-content lessons, their permanent/intermittent split was the
era transition, and the search gap is this estate's index freshness (being
fixed). Note the summary surface's current KS4-science behaviour is under
question with the API team. No need for their 6,550-lookup dataset;
root-cause is closed.

## Bounded unknowns (named, with the instrument that settles each)

- Era-1 view-absence cause for the reporter's 8 → OWA/Hasura view history
  (API team).
- The 2026-07-27 index build's exact drop mechanism → rebuild from the
  fresh bundle (cure and falsifier in one).
- Deployed-revision identity vs origin/main → behaviourally consistent
  today (every wire probe matches the source read); no direct deploy
  introspection from here.

## Evidence trail (re-runnable)

- Probe script: `apps/oak-search-cli/scripts/probe-lesson-availability.ts`
  (three lessons — available, missing, restricted — against summary,
  transcript, and the oracle; run from `apps/oak-search-cli` with
  `pnpm exec tsx scripts/probe-lesson-availability.ts`).
- Wire: `GET {OAK_API_URL}/lessons/<slug>/summary|transcript|assets|quiz`;
  `POST {OAK_API_URL}/lessons/check-restricted`.
- Source (oak-openapi @ origin/main `3b4b01e`): `src/lib/handlers/lesson/`,
  `transcript/`, `assets/`, `questions/`, `keyStageSubjectLessons/`;
  `src/lib/queryGate.ts`; `src/lib/owaClient.ts`; `src/lib/errorResponses.ts`;
  `__tests__/blocked-subjects.test.ts`; `bin/prepare-bulk.ts`. History:
  gate authored `3a2f19b` (2026-07-10), landed via PR #309 merge
  (2026-07-22T13:08:41+01:00); era-1 handler read at `69d2b6c` (2026-06-12).
- This estate: ES index diffs vs bulk artefacts (June-10 in the sibling
  clone; Aug-3 in the `mcp-463-bulk-truing` worktree; fresh 2026-08-12 in
  the principal checkout); `classify-error-response.ts` and
  `aggregated-fetch/execution.ts` for the MCP error path.
