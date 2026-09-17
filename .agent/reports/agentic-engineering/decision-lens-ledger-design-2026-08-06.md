# The decision-lens ledger — design brief v2 (Director, for the tooling lane)

**Status**: DESIGN BRIEF v2 — authored, adversarially self-reviewed, then
rewritten through a three-expert panel round (assumptions-expert,
architecture-expert-betty, type-expert, all Opus, 2026-08-06; every
load-bearing panel claim was verified first-hand by the reviewer or
spot-checked by the Director). Executes as a slice of the
agent-tools-watch-commands node (MCP-508 family) at the tooling seat, **with
the full Cricket suite at every key juncture (owner word)**: schema freeze,
validator landing, CLI landing, node-amendment close.

**Owner commission (2026-08-06, verbatim)**: "If we put the lenses in a
ledger, with a schema, then that can move from a personal stance to a
mechanical gate."

## What it is

One schema-validated, **write-once** row per decision-matrix run at the
Director seat. The mechanical gate is threefold: (1) the schema makes an
incomplete or self-contradictory run UNREPRESENTABLE (structure, not
refinement); (2) a validator recomputes the cross-row and cross-surface
invariants; (3) escalations to the owner carry a checkable provenance chain
(row → escalation record → card). What stays honest prose: ground QUALITY is
audited (Cricket, owner spot-reads), never proven — the gate proves
completeness and consistency, not wisdom.

**The named consumers** (the permanent-doc rule's functional test — read to
do work): (a) the Director at question-arrival, searching prior rows for
precedent (record-first-ask-last needs a searchable, TRACKED record); (b)
the audit join (escalations ↔ rows, both tracked, CI-runnable); (c) Cricket
and owner spot-reads of grounds. A row is read before decisions, not merely
written after them.

## Decisions (v2 — panel-cured; the node re-opens any only through
concept-exploration with a stated reason)

1. **Home**: `.agent/state/collaboration/decisions/<row_id>.json` —
   INSIDE the collaboration root (so `state-integrity.ts`'s
   `COLLABORATION_ROOT` enumeration and `collaborationJsonSchemaId()`'s
   directory dispatch extend by one entry, a named code edit, not free
   inheritance). **Repo-tier, TRACKED** — declared in the tier lists in
   `.agent/state/README.md` and the collaboration `.gitignore` comment in
   the same PR (the tracked/untracked axis is what makes this a ledger and
   not a scratchpad: successors, spot-reads, and CI must see it from a
   clean clone). Low-volume class beside `conversations/`; no rotation;
   directory resolution ALWAYS through `resolveCoordinationHomeForOptions`
   (worktree decoy cure), for writes and for every audit read.
2. **Schema authoring — the pair idiom, derive neither**: a hand-authored
   `lens-run.schema.json` (draft 2020-12) beside the existing five,
   `$ref`ing `active-claims.schema.json#/$defs/agent_id` (one identity
   tuple, never a third definition) — filename added to `SCHEMA_FILENAMES`;
   plus a hand-authored Zod mirror in the `state-schemas.ts` idiom
   (`z.strictObject`, discriminated unions) so read-side and write-side
   cannot drift. Panel note recorded: one reviewer proposed Zod-first with
   derivation; two verified the directory is pair-authored — the pair
   stands, and the structural shapes below express identically in both
   (`prefixItems` + `oneOf` + `const` on the JSON side, verified same
   dialect the estate's Ajv runs).
3. **Invariants live in STRUCTURE, not refinements** (executed-verified
   design): `lens_runs` is a **tuple of five per-slot discriminated
   unions**, each slot pinning its lens literal in doctrine order, with
   verdict arms:
   - `{ lens, verdict: 'resolves' | 'does-not-resolve', ground: nonEmpty }`
   - `{ lens, verdict: 'excludes-one-side', ground, excluded_option,
     intent_carried_forward }` — a REAL arm (doctrine: the third option
     captures the excluded side's intent); non-halting for outcome
     purposes, exhaustively checked in code, never a comment.
   - `{ lens, verdict: 'not-reached' }` — strict: a ground here is
     REJECTED.
   This makes wrong arity, wrong order, groundless verdicts, and grounded
   not-reached all unrepresentable, with zero `.refine()` (whose
   constraints verified-vanish from derived JSON Schema — the estate has
   already paid for that).
4. **The verdict-sequence rule is total** (validator-recomputed; one shared
   function): `(reached)* [resolves] (not-reached)*` — a `not-reached`
   BEFORE a `resolves` is invalid (a skipped matrix is the mirror image of
   the failure the ledger catches).
5. **Outcomes — a discriminated union on `kind`** (kebab-case, matching
   the estate's enum corpus):
   - `resolved-at-director { governing_lens }` — exactly one `resolves`,
     `governing_lens` recompute-equals it. A lens-established "wrong
     seat" resolves HERE with the reroute as its resolution.
   - `resolved-by-standing-ruling { ruling_ref }` — ZERO lens runs
     fabricated: precedent-resolved questions cite the ruling (memory
     name, rule path, PDR/ADR id, or prior `row_id`); the citation is
     validator-RESOLVED against its store. A checkable citation is a
     stronger gate than an invented ground.
   - `escalated-lenses-exhausted { }` — all five slots reached WITH
     grounds; no owner-ground needed. The owner's tell as schema: this
     arm cannot exist without five named grounds.
   - `escalated-owner-ground { ground, detail? }` — INDEPENDENT of lens
     verdicts (doctrine is disjunctive: a question whose *how* a lens
     resolves is still the owner's when the ground is constitutively his).
     `ground` is a non-`none` enum (`linear-write | product-scope | spend |
     identity | release-gate | other`); `other` REQUIRES `detail`; the
     audit counts `other` as the enum-evolution falsifier.
   - `rerouted { target_seat, why }` — rerouting precedes the matrix: all
     five slots `not-reached`, `why` non-empty, `target_seat` a valid
     identity tuple (write-schema).
6. **Pre-gates and frame-check are discriminated, not boolean-optional**:
   `formed: false` REQUIRES `concept_exploration: 'ran'` (the doctrinally
   impossible row is unrepresentable); `binary_frame_check` —
   `{ was_binary: false }` or `{ was_binary: true, third_option:
   nonEmpty }`; `proportionate` is a post-gate assertion, not a stored
   false-state.
7. **Rows are write-once — NO post-hoc fields**: `disposition` is DELETED.
   The provenance direction is single: later artefacts cite `row_id` —
   the escalation record cites it, the card-relay comms event cites it,
   a conversation entry cites it. The row keeps only creation-time facts
   (`conversation_ref?` allowed — pattern-bound to the conversation slug
   grammar, never bare nonEmpty). Atomic single write via the existing
   collaboration write path.
8. **Escalation lifecycle rides the EXISTING `escalations/` surface** —
   adjudicated, not parallel-built: the row is the immutable matrix run;
   the escalation record (already schema'd, tracked, CLI-wired, dormant)
   is the live owner-facing case, carrying `owner_action_requested`,
   status open/closed, and now `row_id`. The pairing REVIVES the dormant
   surface with the mandatory trigger it always lacked (the recorded
   reason both decision-provenance surfaces stayed dormant: nothing ever
   REQUIRED a write; this design's trigger is that requirement). No field
   duplication between row and escalation; each is authoritative for its
   own half.
9. **Enforcement — the honest v2 statement**:
   - PROVEN mechanically: row well-formedness (mostly by shape), the
     sequence rule, outcome consistency, reference RESOLUTION (every
     `ruling_ref`, `row_id` citation, `source_event_id`, `conversation_ref`
     resolved against its store — a well-formed-but-fabricated id is the
     named failure mode), `row_id` === filename stem, and the
     escalations↔rows join (both tracked; CI-runnable; no dependence on
     untracked comms).
   - The comms cross-reference is an explicitly instance-local,
     retention-bounded enrichment — never the audit's substrate (a
     detector whose blindness correlates with the failure it detects is
     worse than none; the v1 sweep claim is withdrawn).
   - PREVENTION of naked cards: behavioural today, stated as such. The
     one real mechanical option — a PreToolUse matcher on the card tool
     refusing decision-bearing cards without a resolvable `row_id` — is
     an OWNER-GATED config decision, host-phenotype, verified per host
     before it is ever claimed; it enters the node as an optional slice
     behind the owner's word, not as an assumption.
10. **Doc-sync via the ratified-lists validator** (the estate's existing
    doc↔code list-sync mechanism; owner ruling 2026-07-07 already homes
    such checks in validators): a `DECISION_LENSES_V1` CHECK entry with
    exact ordered-list equality INCLUDING COUNT, against a new
    machine-readable backtick-token line added to principles.md §Decision
    Lenses in the same PR (the five lens ids in order — the prose
    sentences stay prose; the token line is the extractor's target).
    Addition-detection holds because equality is exact-count. The lens
    list lives ONCE as `export const DECISION_LENSES_V1 = [...] as const`
    (a const array BECAUSE it has a second consumer — the check; the
    owner-ground enum stays inline, no second consumer). A doctrine
    change mints `DECISION_LENSES_V2` + a schema-version discriminated
    union arm — v1 rows keep validating as correct records of the
    doctrine that was applied; enum WIDENING is forbidden (silent
    field-meaning change class).
11. **Identifier discipline**: `row_id` and `source_event_id` BRANDED
    (verified non-assignable cross-brand under strict tsc — the audit is
    a join between UUID columns, exactly where brands pay);
    `source_seat` bound to the WRITE identity schema (a new surface is
    not born accepting id-less identities); timestamps in the comms
    idiom (`offset: true`) with `arrived_at <= created_at`
    validator-checked. `failed_lenses[]` is DROPPED (derivable);
    `governing_lens` KEPT (stored + recompute-compared — the
    self-checking scalar shape).
12. **Row trigger — agent-initiated escalation candidacy** (the warrant
    stated honestly: the owner's commission mechanizes the DIRECTOR's
    discipline, not every agent's every lens use): rows are mandatory for
    (a) Implementer-routed questions processed at the Director seat, and
    (b) agent-initiated decision-bearing owner cards from any seat.
    EXEMPT: owner-initiated exchanges (cards clarifying his own live
    instruction — the matrix governs what agents escalate, never what he
    asks), action-moment cards (owner performs a mechanical act), and
    in-lane decisions a seat owns. Extension to every-agent lens use is a
    later ratchet behind its own evidence, never this slice.
13. **CLI**: topic `decision` (singular, per the taxonomy), shaped on the
    `conversation:append` precedent — `decision append --file <path>
    --row-json <json>` through the atomic write + Ajv validation of the
    raw text; typed composition lives in the calling seat's practice, not
    in a flag-vocabulary explosion. `decision validate` and `decision
    list` alongside; list output is a search affordance (id, kind,
    question head, refs) good enough for the precedent-check read.
14. **Migration**: NO back-fill (simpler; matches the no-tombstones
    discipline). The manual antecedent rows on the comms stream
    (512bec18 first) are cited HERE as prose precedent and accepted as
    rotation-mortal — their substance is already conserved in this brief
    and the node; no protection theatre. The obligations BIND at the CLI
    landing; every audit carries a `--since` floor at that timestamp.

## Panel record (finding → disposition; full reports in the session task
outputs and conserved by this section's summaries)

- assumptions B1 (tier unadjudicated) → decision 1 (tracked, declared).
- assumptions B2 (blind detector) → decision 9 (sweep claim withdrawn;
  tracked-join audit; hook option owner-gated).
- assumptions B3 + betty B3 (doc-sync unimplementable as grep) → decision
  10 (ratified-lists mechanism, token line, exact count).
- betty B1 + assumptions 12 vs type-expert (Zod-first contradiction) →
  decision 2 (the pair idiom; contradiction recorded).
- betty B2 + assumptions A4 + type-expert A8 (disposition mutability) →
  decisions 7/8 (write-once; single citation direction; escalations/
  revived).
- type-expert B1 (ESCALATED disjunction) → decision 5's two escalated
  arms (also cures a v1 DOCTRINE error: the biconditional contradicted
  principles.md's "or").
- type-expert B2 (prefix hole; REROUTED unconstrained) + assumptions A6 →
  decisions 4/5.
- type-expert B3 (refinements vanish) → decision 3 (structure-first,
  executed-verified).
- assumptions A5 (no consumer; forced fabrication) → §consumers +
  `resolved-by-standing-ruling`.
- assumptions A7 (migration) → decision 14. assumptions A8/A11 (trigger
  over-capture; jurisdiction warrant) → decision 12. assumptions A9
  (coordination home) → decision 1. assumptions A10 + betty O8
  (escalations/ dormancy) → decision 8 (with the dormancy argument made:
  mandatory trigger is what the dormant surfaces lacked).
- type-expert A4/A5/A6/A7 (excludes-one-side arm; frame-check; owner-ground
  contradiction; pre-gates) → decisions 3/5/6. type-expert A9 (brands,
  write-schema, slug pattern, reference resolution) → decision 11 and 9.
  type-expert O10-O14 (const-array split, timestamp idiom, kind
  discriminant, derivable state, filename binding) → decisions 10/11/5/9.
- betty A5 (CLI taxonomy) → decision 13. betty A7 (audit substrate) →
  decision 9. betty follow-up → wilma pass mandated below.

## Handoff requirements (tooling lane)

- Single-story slices in the node's own discipline; the schema PR carries
  the principles.md token line + the `DECISION_LENSES_V1` check in ONE
  commit (atomic-landing).
- **Cricket at every key juncture (owner word, mandatory)**: schema freeze,
  validator landing, CLI landing, node-amendment close; splits route to
  the Director.
- **A wilma (adversarial-resilience) pass on the multi-seat write path**
  before the validator lands (the atomic-write/retry seam), per betty's
  recommendation.
- Pre-execution expert reviews per standing rules — this brief's panel
  round does not substitute for implementation-time review.
- The PreToolUse card-hook slice exists in the node as OPTIONAL,
  owner-gated, host-verified-first.
