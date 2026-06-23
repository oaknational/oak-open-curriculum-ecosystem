# ADR-198: Naming-Schema Versioning with a Digest-Pinned Registry

**Status**: Accepted
**Date**: 2026-06-11 (design ratified with owner in session `aba87a`)
**Related**: PDR-027 (threads, sessions, and agent identity — the doctrine the
display name serves); PDR-076a (deterministic UUID v5 identity ids and the
`(agent_name, id)` routing key — the continuity anchor this ADR deliberately
leaves untouched).

## Context

Agent display names are a deterministic projection of the harness session id:
SHA-256 of the seed routes through curated wordlists. The projection function
(wordlists + template + casing) previously existed in exactly one unversioned
form (adjective–participle–noun over six themed groups). Any wordlist edit
silently re-mapped every seed-to-name relationship, with three consequences:
recompute-style validation over recorded names becomes impossible the moment
the lists change; recorded names lose their provenance (which function
produced this name?); and improving the scheme at all carries hidden risk.

Separately, the original scheme placed its longest words (participles) in the
perceptually weakest middle position and capped the namespace at 48,000 names,
with first-word clashes in roughly a third of ten-agent working windows.

## Decision

1. **Naming schemas are registered, versioned eras.** A registry
   (`agent-tools/src/core/agent-identity/schema-registry.ts`) maps a closed
   union of descriptive schema ids to frozen material: themed word-group
   columns, per-column render casing, and a pinned SHA-256 content digest.
   Identifiers are descriptive slugs (`v1-adjective-verb-noun`,
   `v2-noun-verb-noun`), never bare digits.
2. **The digest pin is self-enforcing.** A gate test recomputes each schema's
   digest from the live wordlist material and compares it to the pinned
   constant. Editing registered material without registering a new version
   fails the tree. Material therefore freezes at activation by construction —
   owner taste review happens before activation because nothing can change
   after it.
3. **Old eras are preserved, not replaced.** The v1 scheme remains registered
   and reproducible: `deriveIdentity(seed, { schemaId })` re-derives the name
   any seed produced under any registered era, proven by pinned era-snapshot
   tables for both schemas.
4. **The identity tuple records name provenance.** The PDR-027 identity block
   gains an optional `naming_schema_version` field (a registered era id or
   `override` for operator-specified names). The two derivation factories —
   the only sites where provenance is known — always stamp it; address relays
   (recipient blocks built from `--to-*` flags, commit-queue intents relaying
   caller identity) legitimately omit it because another agent's provenance is
   unknowable to the writer. Absence reads as the v1 era via
   `namingSchemaVersionOf` (rows written before the field existed are v1 by
   definition; no backfill). The field is optional rather than defaulted so a
   parse-and-rewrite cycle cannot inject it into immutable historical events.
5. **The id is not versioned by this mechanism.** The UUID v5 derivation and
   its namespace constant are the continuity anchor; the namespace constant
   is already that derivation's version marker. Name eras move freely; ids
   never re-map. `session_id_prefix` is retained for session-record search.
6. **The v2 scheme is noun–verb–noun with manufactured U-shaped salience.**
   Names read as micro-sentences ("Harrier weaves Stratosphere"): themed
   title-cased edge nouns (50 subject / 40 object per theme, length 4–12)
   around a shared lowercase present-tense verb pool (16 verbs, length 4–7).
   The lowercase middle word manufactures the low-salience middle slot
   typographically instead of assuming attention distribution. Curation rules
   are encoded as data-driven tests: per-column uniqueness, cross-theme
   disjointness per column, no subject/object stem-sharing within a theme,
   length variety, and an initial-bigram diversity floor. Namespace: 6 × 50 ×
   16 × 40 = 192,000 names; effective first-word cardinality 300.

## Consequences

- Wordlist evolution is safe and auditable: a change is a new registered era,
  historical names remain reproducible, and validators can recompute any
  recorded name from its seed and recorded era.
- Recompute obligations are satisfied at derivation time (digest gate plus
  end-to-end CLI proof), not over persisted tuples — the stored
  `session_id_prefix` is six characters and deliberately cannot reproduce the
  SHA-256 routing, so stored-name recompute would require persisting the raw
  session id, a privacy trade-off this ADR rejects.
- In-flight sessions keep their pre-change name for their lifetime via the
  session-level `OAK_AGENT_IDENTITY_OVERRIDE` env cache (which dies with the
  session); new sessions derive under the active schema. There is no
  persistent name cache to invalidate.
- Two agents named under different eras can coexist in records; the
  `naming_schema_version` field plus `session_id_prefix` and the UUID v5 id
  keep every row unambiguous.
