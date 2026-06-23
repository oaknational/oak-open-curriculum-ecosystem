# G2 Misconception Mint Rule — Design Verdict (content-hash vs ordinal)

**Author**: Galactic Soaring Nebula (claude / Fable 5 / f01540 /
id d044d04b-b82e-58da-aee2-89db6d126490), G4-seat successor, Director-routed design pull-forward
(directed events 19:07:52Z brief → 19:12:07Z re-confirmation, claim
`5a3b5b87-8f6a-477b-a931-abc94f5cf2ee`).
**Date**: 2026-06-10.
**Status**: read-only analysis; no source edits. The Director folds the verdict into the
canonical plan's `g2-misconception-view` todo (Iridescent §4 pattern).
**Evidence base (pinned)**: fresh bulk snapshot `downloadedAt: 2026-06-10T16:43:00.027Z`
(worktree `oak-wt-umbral-g4`, `apps/oak-search-cli/bulk-downloads/manifest.json`); committed
misconception dataset `sourceVersion: 2026-03-07T16:56:12.520Z`
(`oak-sdk-codegen/src/generated/vocab/misconception-graph/data.json`, 12,858 nodes). Analysis
scripts conserved at `<scratch>/galactic-f01540-mint-rule-analysis{,2}.py` (session-ephemeral; all
result numbers reproduced below with their measurement description).

## Verdict

**Mint `misconception:<lessonSlug>#<hash16(normalise(misconceptionText))>` — content-hash,
lesson-scoped, text-only.** Ordinal minting (`#<n>`) is rejected. The hybrid
(hash + ordinal disambiguator) is rejected as unwarranted by the data.

Components:

- `normalise` = trim + collapse internal whitespace runs to one space + lowercase, applied to
  the **hash input only** (the emitted node keeps the raw display text). No unicode transform:
  the corpus is already NFC-normalised (measured: 0 of 12,858 texts differ under NFC); the
  contract test pins an NFC **assertion**, not a transform layer (do not over-build — the same
  discipline the G4 design record applies to keyword normalisation).
- `hash16` = first 16 hex characters of SHA-256 over the UTF-8 bytes of the normalised text.
  64 bits against ≤2 entries per lesson scope (and ~12.9k corpus-wide) makes collision
  probability negligible (birthday bound ≈ 10⁻¹¹ corpus-wide); the qualifier keeps the only
  identity-critical scope (within-lesson) at ≤2 items.
- **Text-only, response excluded from the hash.** The misconception text IS the identity; the
  response is context-specific payload. Evidence: of the 665 normalised texts shared across
  lessons, 247 (37.1%) carry different responses in different lessons under normalised-response
  comparison (263 / 39.5% comparing raw responses) — response varies independently of
  misconception identity. A response rewrite updates the node payload under a stable id (correct
  semantics: same misconception, improved guidance). Falsifier: a same-text-different-response
  pair WITHIN one lesson would force response into the identity — measured zero instances; if one
  ever appears it surfaces in `droppedDuplicates`, not as silent merging.
- **Lesson-scoped (the `<lessonSlug>` qualifier), exactly as the plan's draft mint.** Cross-lesson
  identical texts (665 texts, max spread 18 lessons) remain distinct nodes, preserving per-lesson
  response context and the extractor's deliberate no-dedup contract
  (`vocab-gen/extractors/misconception-extractor.ts` @remarks). Richness across lessons comes from
  graph traversal, not node merging — consistent with the one-graph decoration-via-edges doctrine.
  **Acknowledged property (review-surfaced): lesson-slug churn is identity churn, by design.** An
  upstream lesson rename or removal mints new ids / orphans old ones for that lesson's
  misconceptions even when texts are unchanged. This is inherited from the ratified lesson-scope
  qualifier — the draft ordinal mint carries the identical `<lessonSlug>` component, so it is not
  a discriminator between the candidates — and it degrades honestly: old ids become absent and
  new ids appear (visible churn); a slug change can never silently re-point an existing id at
  different content. The contract test describes this state (test 2d below).
- **Within-lesson dedup by construction**: identical `(lessonSlug, normalised text)` occurrences
  mint the same id and collapse to one node, idempotently. This is load-bearing today: 473
  lessonSlugs appear in two lesson records each (multi-placement within one sequence file;
  measured: all 473 carry byte-identical misconception+response pairs and identical
  subject/keyStage context). One lesson node (placement-as-edge) + one misconception node is the
  correct emission; ordinal would mint 473 duplicate-content node pairs.
- **Same-text-different-response within one lesson** (measured: zero instances): generator policy
  is keep-first + record in a `droppedDuplicates` provenance array. This shares G1a's
  fail-loud-in-provenance property (`droppedEdges`), with one structural difference the review
  named: G1a drops because a dangling edge would break the corpus (no keep option existed); here
  keep-first is a genuine choice, made because a content-authoring quirk should surface as a
  data-quality signal, not break the regeneration. The contract test describes this state.
- **Emission ordering**: misconception nodes emit **id-sorted** — for this id shape that means
  grouped by lessonSlug, hash-ordered within a lesson — giving the same property G1a gets from
  its slug-sorted unit emission: a deterministic artefact regardless of enumeration order.

The id remains kind-qualified (`misconception:` prefix), materialised as an explicit `id` field
with a template-literal type (`` `misconception:${string}` ``), per the settled identity model
(plan §Identity model; seam report §4.7). `lessonSlug` inside the id is the same scope qualifier
the ratified draft mint (`misconception:<lessonSlug>#<n>`) already carries.

## Why not ordinal — the structural case

The regeneration-pair measurement (below) shows ordinal would have been 100% stable across the
observed window, so the discrimination is structural, not empirical-extrapolative:

1. **Silent re-pointing is ordinal's failure mode and it is undetectable from the artefact.** If
   upstream replaces a lesson's misconception text, `#0` survives pointing at different content —
   id stable, referent changed. Every downstream comparison across regenerations silently lies.
   A content-hash id cannot re-point by construction: content change ⇒ id change (honest churn),
   and id-churn is exactly content-churn, never enumeration noise. Hash ids are also
   self-verifying: the contract test recomputes them from content.
2. **Ordinal renumbering cascades.** An upstream insertion/removal/reorder renumbers every
   subsequent sibling: unchanged content churns its id (false churn) while changed content can
   keep one (false stability). Hash ids localise: only the edited entry's id moves.
3. **The pipeline's enumeration order is not deterministic in general.**
   `discoverBulkFiles` (`src/bulk/reader.ts:44-51`) is a raw `readdir` filter with **no sort**, so
   global encounter order is filesystem-dependent. G1a dodged this by slug-sorting at emission;
   an ordinal misconception id cannot dodge it — the ordinal IS the order. Today the 473
   multi-placement duplicates are same-file (array-order-deterministic), but a future cross-file
   placement makes per-lesson aggregated indexing machine-dependent. The mint rule should not
   carry a latent build-environment sensitivity the corpus shape merely happens not to trigger.
4. **The ordinal carries no information.** Measured per-record distribution: every lesson record
   carries exactly 0 or 1 misconception ({0: 6, 1: 12,858}). The seam report's "max 2 per lesson"
   is the multi-placement artefact above, not a 2-misconception lesson. `#<n>` would be `#0`
   everywhere except as the duplicate-node generator described above.

## Measurements (all first-hand against the pinned snapshots)

**Faithful re-mine determinism + regeneration pair (2026-03-07 source → 2026-06-10 source).**
Replicating `extractMisconceptions` exactly (per-record iteration, per-lesson array order,
skip-empty-trim, no dedup) over the fresh bulk reproduces the committed dataset **exactly**:
12,858 entries; grouped per lessonSlug, **12,385 of 12,385 shared slugs identical in content,
order, and responses (100.000%)**; zero slugs added or removed; entry-level
`(slug, normalised-text)` survival 12,858/12,858. The empty-text guard never fires on current
data (0 skips; keep it — defensive).

**Honesty caveat — what the zero-churn window does and does not prove.** It proves the
extraction pipeline is deterministic given identical input and that the bulk **export** has been
static on this axis for ~3 months. It does **not** prove future content stability: the bulk
export visibly lags the live API on sibling axes (fresh-bulk english-ks4 normalised-distinct
keywords = 1,511 (1,714 raw), byte-stable with the 2026-05-21 snapshot, vs live 2,090;
science-ks4 bulk 1,123 normalised vs live 0 mid-restructure — both re-measured first-hand on the
fresh snapshot; keyword counts are normalised lc+trim distinct). When the export catches up with
live restructures, misconception arrays WILL change; the mint rule is being chosen for that
future. Under churn, hash ids degrade honestly (changed content = new id), ordinals degrade
silently (point 1 above).

**Duplication / collision surface (fresh bulk).** Within-lesson duplicate texts: zero raw, zero
normalised, zero (text+response) — i.e. **zero hash collisions** for either candidate hash input
across all 12,391 distinct lessonSlugs (12,385 of which carry a misconception; 6 carry an empty
`misconceptionsAndCommonMistakes` array — well-formed absence; 12,385 + 473 multi-placement
duplicates = 12,858 entries). The only within-scope duplicates are the 473 multi-placement
identical pairs the rule dedups by design. Cross-lesson: 11,408 distinct normalised texts; 665
(5.83%) appear in >1 lesson; max spread 18. Schema note (review-verified): the field is REQUIRED
on every lesson record with both `misconception` and `response` required strings — the
blank-text skip guard never fires on current data (the 6 empties are empty arrays, not blank
texts); the guard stays as defence.

**Unicode/whitespace surface.** 441/12,858 texts contain non-ASCII (curly apostrophes class);
0 differ under NFC; 63 contain internal whitespace runs (absorbed by the normalise step);
lengths 17–200 chars (median 76).

## Contract-test shape (the stability-across-regenerations contract)

Unit-level, on the mint function and the G2 generator (vocab-gen side), describing system states
per the TDD doctrine:

1. **Order-independence / determinism**: the same logical corpus presented with shuffled file
   order and shuffled record encounter order emits the identical node set — same ids, same
   content, same id-sorted emission order. (Kills enumeration sensitivity; the property ordinal
   cannot satisfy.)
2. **Churn semantics**: (a) a text edit mints a NEW id and the old id is absent from the new
   emission — no silent re-pointing; (b) a response edit preserves the id and updates the
   payload; (c) inserting a new misconception into a lesson leaves every existing id unchanged —
   no renumber cascade; (d) a lesson-slug rename/removal with unchanged text leaves the old ids
   and their `lesson→misconception` edges absent and (on rename) mints the new-slug ids —
   expected honest churn inherited from the lesson-scope qualifier, not a defect.
3. **Dedup idempotence + provenance**: identical `(lessonSlug, text)` occurrences (the
   multi-placement case, encoded from the real 473-lesson shape) collapse to one node; a
   same-text-different-response pair within one lesson keeps the first and records a
   `droppedDuplicates` entry with reason — never two nodes, never silence. The real-corpus
   expectation (473 collapsed, 0 dropped-different) lands in the generator integration test as a
   count guard, not a hardcoded fixture.
4. **Mint-function golden vectors**: pinned normalisation (trim, whitespace-collapse, lowercase),
   pinned hash + prefix length, NFC input assertion, vectors including a curly-apostrophe text
   and an internal-double-space text. The vectors ARE the cross-regeneration stability proof: the
   same content must hash identically forever; any deliberate future change to the mint is forced
   to touch the golden file (a visible contract amendment, ADR-grade).
5. **Edge-end integrity** (G2 generator test, existing pattern): every `lesson→misconception`
   edge endpoint resolves to an emitted node id; corpus constructs in `createGraphView` without
   throwing (zero dangling endpoints, the G1a invariant).

## Rejected alternatives

- **Ordinal `misconception:<lessonSlug>#<n>`** (the draft mint): structural case above.
- **Global content-hash (`misconception:<hash(text)>`, no lesson scope)**: merges the 665
  cross-lesson texts whose responses differ in 37% of cases — forces multi-response nodes or
  context loss; contradicts the extractor's documented no-dedup rationale and the
  decoration-via-edges model.
- **Hash over text+response**: churns identity on guidance rewording (payload, not identity);
  zero collision benefit today (both inputs measured collision-free).
- **Hybrid hash+ordinal disambiguator**: only earns its complexity if same-text-different-response
  within a lesson must mint distinct nodes; measured zero instances; keep-first + provenance is
  simpler and surfaces the data-quality signal instead of hiding it in an id suffix.
- **Unit-scoped (`misconception:<unitSlug>#<hash>`)** (review-surfaced, recorded for
  completeness): unit slugs are G1-emitted identity anchors, which would insulate misconception
  ids from lesson renames — but a lesson can be placed in multiple units (the ratified
  placement-as-edge model exists precisely because of this; the 473 multi-placement slugs are the
  live instance), so unit-scoping would need a canonical-unit-per-lesson choice that the corpus
  model deliberately does not have. Lesson-scope is the coherent choice within the ratified
  frame.

## Adversarial review — verdicts + dispositions (2026-06-10, pre-verdict)

Panel: architecture-expert-betty + assumptions-expert, both briefed to refute and grounded
first-hand against the worktree. Verdicts: **architecture = concerns (no blocker; core
recommendation confirmed sound)**, **assumptions = sound (every quantitative claim reproduced
exactly, including the per-record {0: 6, 1: 12,858} distribution, the 473 byte-identical
multi-placement pairs, the 100.000% re-mine identity, and the unsorted-readdir →
order-sensitivity chain re-traced in source)**. Every finding re-verified first-hand before
folding (`validate-specialist-findings-before-acting`):

- **[architecture, concern] Lesson-slug rename cascades misconception ids — unacknowledged.**
  Accepted in part, refuted in part. The cascade is real and is now acknowledged in the verdict
  bullet + contract test 2d. The "same silent-cascade risk as ordinal via a different path"
  framing is refuted on first-hand grounds: a slug change churns ids honestly (old absent, new
  minted) and can never re-point an id at different content; and the `<lessonSlug>` qualifier is
  carried by BOTH candidates in the ratified draft mint (plan §Identity model), so it does not
  discriminate between them. *(Folded: verdict bullet, test 2d.)*
- **[architecture, concern] Contract tests lacked the slug-rename state.** Accepted. *(Folded:
  test 2d.)*
- **[assumptions, under-specification] Slug-disappearance behaviour unstated.** Accepted —
  converges with the above. *(Folded: verdict bullet, test 2d.)*
- **[assumptions, correction] Response-divergence and keyword figures are normalised counts.**
  Accepted: 247/37.1% is normalised-response comparison (263/39.5% raw); keyword counts are
  lc+trim distinct (english-ks4 1,714 raw / 1,511 normalised). *(Folded: both figures labelled.)*
- **[architecture, minor] G1a droppedEdges analogy over-drawn** (G1a had no keep option; G2
  chooses keep-first). Accepted. *(Folded: droppedDuplicates bullet reframed.)*
- **[architecture, minor] "Id-sorted mirrors slug-sorted" imprecise** for this id shape.
  Accepted. *(Folded: emission-ordering bullet states lessonSlug-grouped, hash-ordered.)*
- **[architecture, minor] Unit-scope alternative unrecorded.** Accepted; reviewer's own grounding
  confirms the multi-unit-placement dismissal. *(Folded: rejected alternatives.)*
- **[assumptions, cosmetic] 12,391 vs 12,385 unreconciled; empty-array vs blank-text conflated.**
  Accepted. *(Folded: duplication paragraph reconciles both.)*

## Open items the verdict does NOT decide (named, not decided — owner/Director surface)

1. **Hash prefix length** is recommended at 16 hex but is a one-line constant; if the team
   prefers full-hash ids for debugging greppability over compactness, nothing above changes.
2. **`droppedDuplicates` surfacing**: provenance array on the corpus artefact (recommended,
   G1a-consistent) vs a generation-time warning log only — G2 execution detail.
3. **Bulk-export staleness vs live** (english-ks4 +38%, science-ks4 inverted) remains the
   standing owner item recorded at G4 Gate-1 and in the thread record; this analysis adds the
   datum that the 2026-06-10 export still serves 2026-05-21-identical content on those axes —
   the lag is in the upstream export, not our download timing.
