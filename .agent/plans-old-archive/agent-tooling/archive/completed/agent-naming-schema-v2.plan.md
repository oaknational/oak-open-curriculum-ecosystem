---
name: "Agent Naming Schema v2 — noun-verb-noun micro-sentence names"
overview: "Versioned naming-schema registry; NVN lowercase-middle display names; v1 preserved as a registered era; naming_schema_version on the identity tuple."
todos:
  - id: ws1-cycle-1
    content: "WS1 cycle 1: naming-schema registry types + v1 era freeze + digest pin. One commit. Tree green at end."
    status: completed
  - id: ws1-cycle-2
    content: "WS1 cycle 2: versioned derivation + per-schema render policy; v1 output byte-identical. One commit. Tree green at end."
    status: completed
    depends_on: [ws1-cycle-1]
  - id: ws2-cycle-1
    content: "WS2 cycle 1: data-driven curation gate tests + shared v2 verb pool. One commit. Tree green at end."
    status: completed
    depends_on: [ws1-cycle-2]
  - id: ws2-theme-celestial
    content: "WS2: celestial v2 subject/object noun lists passing curation gates. Landed in the consolidated six-theme commit (solo serial execution; per-theme split was parallel-dispatch shaped)."
    status: completed
    depends_on: [ws2-cycle-1]
  - id: ws2-theme-maritime
    content: "WS2: maritime v2 subject/object noun lists passing curation gates. Landed in the consolidated six-theme commit."
    status: completed
    depends_on: [ws2-cycle-1]
  - id: ws2-theme-botanical
    content: "WS2: botanical v2 subject/object noun lists passing curation gates. Landed in the consolidated six-theme commit."
    status: completed
    depends_on: [ws2-cycle-1]
  - id: ws2-theme-ember
    content: "WS2: ember v2 subject/object noun lists passing curation gates. Landed in the consolidated six-theme commit."
    status: completed
    depends_on: [ws2-cycle-1]
  - id: ws2-theme-aerial
    content: "WS2: aerial v2 subject/object noun lists passing curation gates. Landed in the consolidated six-theme commit."
    status: completed
    depends_on: [ws2-cycle-1]
  - id: ws2-theme-nocturnal
    content: "WS2: nocturnal v2 subject/object noun lists passing curation gates. Landed in the consolidated six-theme commit."
    status: completed
    depends_on: [ws2-cycle-1]
  - id: ws2-assembly
    content: "WS2 cycle 2.8: v2 registry entry + digest pin + render snapshot tests. One commit. Tree green at end."
    status: completed
    depends_on:
      [
        ws2-theme-celestial,
        ws2-theme-maritime,
        ws2-theme-botanical,
        ws2-theme-ember,
        ws2-theme-aerial,
        ws2-theme-nocturnal,
      ]
  - id: ws3-cycle-1
    content: "WS3 cycle 1: naming_schema_version on the collaboration identity tuple; absent reads as v1. One commit. Tree green at end."
    status: completed
    depends_on: [ws1-cycle-2]
  - id: ws4-owner-review
    content: "WS4 checkpoint: owner taste review of all v2 wordlists BEFORE activation. Approved by owner 2026-06-11 in session aba87a."
    status: completed
    depends_on: [ws2-assembly]
  - id: ws4-cycle-1
    content: "WS4 cycle 1: flip active schema to v2; surface tests (CLI, statusline, hooks); live CLI proof. No persistent cache exists to version — see WS4 body note."
    status: completed
    depends_on: [ws4-owner-review, ws3-cycle-1]
  - id: ws5-docs
    content: "WS5: agent-identity.md update, ADR-198, example-name refresh in identity docs."
    status: completed
    depends_on: [ws4-cycle-1]
  - id: ws6-quality-gates-final
    content: "WS6: full quality gate chain on the integrated delivery. Green repeatedly (1,013 tests at d5a2b1a02; 103/103 pre-push tasks at 56ec1dc91 and 3b4599368; seven-check live-green run verified at merge time)."
    status: completed
    depends_on: [ws5-docs]
  - id: ws7-adversarial-review
    content: "WS7: adversarial specialist reviews (code, test, type, docs-adr). Four reviewer verdicts adjudicated; amendments landed in 4159dedb6; two findings refuted with grounding (knip-rejected barrel re-export; registry-as-material-surface in tests)."
    status: completed
    depends_on: [ws6-quality-gates-final]
isProject: false
---

# Agent Naming Schema v2 — Noun-Verb-Noun Micro-Sentence Names

**Last Updated**: 2026-06-11 (status corrected 2026-06-13)
**Status**: ✅ COMPLETE / ARCHIVED — merged PR #189 (`289b3e036`); plan archived PR #194 (`9a74eefd1`).
**Successor**: [`agent-naming-schema-v3.plan.md`](../../current/agent-naming-schema-v3.plan.md)
(era-pinning cure + v3 noun-agentive era), thread
[`agent-naming`](../../../../memory/operational/threads/agent-naming.next-session.md).
**Scope**: Redesign the PDR-027 display-name derivation in
`agent-tools/src/core/agent-identity/` around a versioned naming-schema
registry, ship a noun-verb-noun ("NVN") v2 scheme, and record
`naming_schema_version` on the collaboration identity tuple.

---

## Context

Agent display names ("Swift Gliding Zephyr") are derived deterministically
from the harness session id: SHA-256 of the seed routes through themed
wordlists (`derive.ts`), while the canonical identity is a UUID v5 of the
same seed under a fixed namespace (`collaboration-state/identity.ts`). The
name and the id derive independently, so renaming schemes never disturb
identity continuity.

The owner-ratified design conversation (session `aba87a`, 2026-06-11)
decided a v2 scheme optimised for human uniqueness-spotting at a glance:

1. **Template**: noun–verb–noun micro-sentence ("Comet threads Night").
   Concrete imageable nouns occupy the two high-salience edge positions;
   a short present-tense verb occupies the low-salience middle.
2. **Display**: edge nouns title-case, middle verb lowercase — the
   typography manufactures the U-shaped salience rather than assuming it.
   Slug stays lowercase-hyphenated ("comet-threads-night").
3. **U-shaped allocation**: per theme, 50 subject nouns and 40 object
   nouns (edges, length 4–12); one shared theme-neutral pool of 16 verbs
   (middle, length 4–7). Six existing themes retained. Namespace:
   6 × 50 × 16 × 40 = 192,000 names (~17.6 bits); effective first-word
   cardinality 300 (vs 120 today).
4. **Versioning**: the identity tuple gains `naming_schema_version`.
   The current adjective–verb–noun scheme is preserved as the registered
   v1 era, not replaced; v2 is explicitly set active. Version identifiers
   are descriptive slugs, not bare digits.
5. **Untouched**: the UUID v5 derivation and its namespace constant
   (the namespace is the id-schema version), and `session_id_prefix`
   (kept for record search during debug/resume).

### Problem Statement

- The current grammar places its longest words (participles) in the
  lowest-salience middle slot, and themed correlation caps the namespace
  at 48,000 — first-word clashes occur in ~31% of 10-agent windows.
- Wordlist edits silently re-map every seed→name with no recorded
  provenance, which breaks recompute-style validation
  (`validators-must-recompute-not-just-record`) the day any change lands.

### Existing Capabilities

- `core/agent-identity/`: `deriveIdentity` (hash routing, override path),
  `hash.ts` (SHA-256 + uint32 reads), six themed wordlist modules.
- `collaboration-state/identity.ts`: single v5 derivation site, identity
  tuple writes, Codex anonymous-write guard.
- Tests: `tests/agent-identity/*.test.ts`,
  `tests/collaboration-state/identity*.test.ts`,
  `tests/agent-identity/session-cache.integration.test.ts`.
- No consumer outside the module reads the per-word result fields
  (`adjective`/`verb`/`noun`) — verified by workspace grep 2026-06-11 —
  so the result-shape change is contained to the module, its CLI, and
  tests.

---

## Design Principles

1. **Identity is the seed; the name is a versioned projection** — the
   UUID v5 and `session_id_prefix` never re-map; only the display
   projection versions.
2. **Self-enforcing versions, not declared-and-forgotten** — each
   registered schema pins a content digest of its wordlist material; a
   gate test recomputes the digest, so any wordlist edit without a
   version bump fails the tree. Lists freeze at activation by
   construction.
3. **Manufactured salience** — short lowercase middle word; large,
   shape-diverse edge columns; curation rules encoded as tests.
4. **Closed-shape version field** — `naming_schema_version` is a closed
   union (`v1-adjective-verb-noun | v2-noun-verb-noun | override`), not
   an open string.

**Non-Goals** (YAGNI):

- No change to UUID v5 derivation, its namespace, or
  `session_id_prefix` semantics.
- No new themes (extension beyond the existing six is future work; the
  registry makes it a v3 entry when wanted).
- No renaming or backfill of historical artefacts; recorded names are
  immutable text.
- No alliterative theme binding (destroys initial-bigram diversity).
- No four-word templates (entropy gain marginal; memorability cost real).

---

## Build-vs-Buy Attestation

Off-the-shelf readable-id generators (e.g. `unique-names-generator`)
were considered and ruled out: they provide neither themed coherent
vocabularies, deterministic schema versioning with digest pinning, nor
the per-column render policy this design requires; the existing
in-repo derivation already owns the hash-routing mechanism. No vendor
integration is introduced.

---

## Lifecycle Triggers

> See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md)

Work shape: executable repo plan (this document). Execution sessions
open with `oak-start-right-quick`, register an active claim on
`agent-tools/src/core/agent-identity/` and
`agent-tools/src/collaboration-state/`, use the `oak-commit` skill per
cycle, close with `oak-session-handoff`, and run consolidation at plan
completion.

## Plan-Body First-Principles Check

Per `.agent/rules/plan-body-first-principles-check.md`: before executing
any cycle below, the executor re-derives the shape from the live code
(`derive.ts`, `types.ts`, the test files named in the cycle) rather than
trusting this plan's sketches; the check fires at the start of WS1, WS3,
and WS4 (the cycles that touch interfaces), and before any
plan-prescribed test is written.

---

## WS1 — Naming-Schema Registry and Versioned Derivation

### Cycle 1.1: Registry, v1 era freeze, digest pin

**Parallel-safety**: first cycle; owns the module interface.

**File scope**: `src/core/agent-identity/` (new `schema-registry.ts`,
`schemas/v1/` relocation or re-export of the six existing wordlist
modules), `tests/agent-identity/schema-registry.unit.test.ts` (NEW).

**Test** (Red):

- Registry exposes `v1-adjective-verb-noun` with template metadata and a
  pinned digest constant.
- Recomputing the digest from a canonical serialisation of v1 wordlist
  material equals the pinned constant (the self-enforcement gate).
- A fixed known seed derives the same display name and slug as today
  (era-stability snapshot).

**Product code** (Green): `NamingSchemaId` closed union; registry record
mapping id → `{ template, wordlistMaterial, renderPolicy, digest }`;
v1 entry wrapping the existing wordlists unchanged.

**Acceptance**: registry test passes; whole tree green; existing
`derive.unit.test.ts` untouched and passing.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/agent-tools test
pnpm test
```

### Cycle 1.2: Versioned derivation and per-schema render policy

**Parallel-safety**: sequenced after `ws1-cycle-1`.

**File scope**: `src/core/agent-identity/derive.ts`, `index.ts`,
`tests/agent-identity/derive.unit.test.ts`.

**Test** (Red):

- `deriveIdentity` resolves the active schema by default and accepts an
  explicit schema id; the result carries `naming_schema_version`.
- v1 render output (displayName, slug) is byte-identical to the current
  behaviour for a table of known seeds.
- Render policy is schema-owned: v1 title-cases all words; v2 (entry
  added in WS2) title-cases edges and lowercases the middle word.
- Override results carry `naming_schema_version: 'override'`.

**Product code** (Green): generalise `DerivedIdentityResult` to a
template-aware words tuple plus `naming_schema_version`; route column
selection through the schema's wordlist material; keep `selectByDigest`
and `hash.ts` unchanged. Active pointer remains `v1-adjective-verb-noun`
in this cycle.

**Acceptance**: all WS1 tests pass; CLI behaviour unchanged
(`pnpm agent-tools:agent-identity --format display` renders the same
name for the live session seed); whole tree green.

---

## WS2 — V2 Wordlists and Curation Gates

Curation rules are data-driven tests written once (cycle 2.1) and
applied to every v2 column, so per-theme cycles add only data files and
are parallel-safe with respect to one another.

### Cycle 2.1: Curation gate tests + shared verb pool

**File scope**: `src/core/agent-identity/schemas/v2/verbs.ts` (NEW),
`tests/agent-identity/v2-curation.unit.test.ts` (NEW).

**Test** (Red) — the encoded curation rules, applied to all v2 material:

- Verbs: lowercase a–z, present tense, length 4–7, unique, pool ≥ 16.
- Edge nouns (asserted per theme as theme files land): lowercase a–z,
  length 4–12, unique within column, disjoint across themes per column
  (preserves effective first-word cardinality T × N1), no shared stems
  between a theme's subject and object columns, length variety (≥ 5
  distinct lengths per column), initial-bigram diversity floor (≥ 60%
  unique first bigrams per column).
- Column sizes: subject ≥ 50, object ≥ 40 per theme.

**Product code** (Green): the 16-verb shared pool (e.g. rides, hunts,
weaves, mends, guards, herds, stirs, calls, tracks, holds, lifts,
turns, spins, wakes, seeks, binds — final words chosen at execution
against the gates).

### Cycles 2.2–2.7: Per-theme subject/object noun lists

One cycle per theme (celestial, maritime, botanical, ember, aerial,
nocturnal). Each adds `schemas/v2/<theme>.ts` with 50 subject and 40
object nouns passing every gate in 2.1. Parallel-safe: each cycle owns
exactly one theme file; the shared test file is not edited (data-driven).

**Acceptance per cycle**: curation tests pass for the theme; whole tree
green.

### Cycle 2.8 (final assembly): V2 registry entry, digest pin, snapshots

**File scope**: `src/core/agent-identity/schema-registry.ts`,
`tests/agent-identity/schema-registry.unit.test.ts`.

**Test** (Red): registry exposes `v2-noun-verb-noun` with pinned digest;
digest recomputation gate covers v2; render snapshots for known seeds
show "Edge verb Edge" casing and lowercase-hyphenated slugs; v2 is NOT
yet the active schema.

**Product code** (Green): v2 registry entry assembling the six theme
modules + shared verbs; digest constant.

---

## WS3 — `naming_schema_version` on the Identity Tuple

### Cycle 3.1: Schema field, write path, legacy read

**Parallel-safety**: sequenced after `ws1-cycle-2`; independent of WS2.

**File scope**: `src/collaboration-state/types.ts`,
`src/collaboration-state/identity.ts`,
`tests/collaboration-state/identity.unit.test.ts`,
`tests/collaboration-state/identity-audit.unit.test.ts`.

**Test** (Red):

- `collaborationAgentIdWriteSchema` requires `naming_schema_version`
  (closed union including `override`).
- `deriveCollaborationIdentity` and
  `deriveOverrideCollaborationIdentity` populate it from the derive
  result.
- Read-side schema treats an absent field as `v1-adjective-verb-noun`
  (all pre-field rows are v1 by definition; no backfill).
- Read-side identity validation rejects a row whose recorded
  `naming_schema_version` is not a registered schema id (closed-union
  rejection at the parse boundary). Recompute-from-seed name
  verification over persisted tuples is explicitly out of scope: the
  tuple records only `session_id_prefix` (six characters,
  `identity.ts` `seed.value.slice(0, 6)`), not the full seed, so a
  recorded name cannot be re-derived from stored state. The
  recompute-not-record obligation is satisfied at derivation time
  (WS1 digest gate + WS4 run-the-thing CLI proof), not at audit time.

**Product code** (Green): zod schema additions; write-path plumbing;
read-default; read-side version-field validation.

**Acceptance**: collaboration-state tests pass; whole tree green;
strict-validation-at-boundary preserved (no passthrough widening).

---

## WS4 — Owner Review Checkpoint, Activation, Surfaces

### Checkpoint: owner taste review (BLOCKING for cycle 4.1)

The digest pin freezes wordlists at activation: any post-activation edit
is a new schema version by construction. The owner therefore reviews the
complete v2 wordlists (and the verb pool) BEFORE activation. The gate's
authority: session `aba87a` (2026-06-11), where the owner reserved
wordlist taste as a pre-activation approval while delegating template
and allocation design. Completion artefact (the checkpoint's output,
distinct from its authority): the review verdict recorded in the
session or thread record.

### Cycle 4.1: Activate v2; versioned cache; surface verification

**File scope**: `src/core/agent-identity/schema-registry.ts` (active
pointer), session-cache module,
`tests/agent-identity/session-cache.integration.test.ts`,
`tests/agent-identity/cli.unit.test.ts`, `tests/claude/`,
`tests/cursor/`, `tests/codex/` identity-hook tests.

**Test** (Red):

- Active schema resolves to `v2-noun-verb-noun`; a known seed renders an
  NVN lowercase-middle name end-to-end through the CLI display format.
- Platform hook and statusline tests render the v2 shape.

**Execution note (2026-06-11)**: the "versioned session-cache key" item
dissolved on grounding — no persistent name cache exists. The session
cache is the `OAK_AGENT_IDENTITY_OVERRIDE` env value written once at
SessionStart, which dies with its session; the docs already define it as
a session cache, not a wordlist compatibility layer. An in-flight session
keeps its pre-flip name as override provenance for its lifetime (observed
live: this session stayed "Swift Gliding Zephyr" while its seed freshly
derives "Harrier weaves Stratosphere"); staleness cannot cross sessions
by construction. AC-6 is proven by the existing session-cache integration
test plus that live observation.

**Product code** (Green): active-pointer flip; test fixture updates.

**Acceptance**: `pnpm agent-tools:agent-identity --format display`
renders an NVN name with lowercase middle for the live session seed
(run-the-thing proof, not inference); whole tree green. Note: rebuild
`agent-tools/dist` before exercising hooks — stale local builds
re-create cured defects.

---

## WS5 — Documentation and ADR

No behaviour change; lands after WS4.

- `agent-tools/docs/agent-identity.md`: schema-registry section, v2
  examples, version field, cache keying.
- New ADR: naming-schema versioning and digest-pinned registry (the
  permanent record; this plan is ephemeral and the ADR must not cite
  it as authority — ADRs outlive plans).
- Refresh example names in identity-related docs where the old shape is
  used illustratively (e.g. "Lunar Orbiting Comet" examples in
  TSDoc within the module).
- PDR-027 is portable practice-core and names no wordlists; verify no
  amendment is needed rather than assuming.

---

## WS6 — Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

```bash
pnpm build && pnpm type-check && pnpm lint:fix && pnpm format:root && \
pnpm markdownlint:root && pnpm test && pnpm test:e2e
```

Run from repo root, one gate at a time per start-right discipline.

---

## WS7 — Adversarial Review

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

- `code-expert` (gateway), `test-expert` (curation gates are
  state-describing, not audit-shaped), `type-expert` (closed unions,
  no widening at the zod boundary), `docs-adr-expert` (ADR/doc drift).
- Document findings; BLOCKERs spawn a follow-up plan.

---

## Proof Contract

| Acceptance id | Claim | Proof level | Proof |
|---|---|---|---|
| AC-1 | v1 era reproduces current names exactly | unit | seed-table snapshot test in `schema-registry.unit.test.ts` |
| AC-2 | Wordlist edits cannot land without a version bump | unit | digest recomputation gate test |
| AC-3 | v2 names render NVN with lowercase middle, end to end | e2e | CLI invocation on the live session seed (WS4 acceptance) |
| AC-4 | Identity tuple carries `naming_schema_version`; legacy rows read as v1; unregistered version ids rejected at the parse boundary | unit | collaboration-state schema tests |
| AC-5 | UUID and `session_id_prefix` unchanged across the migration | unit | identity tests assert id derivation untouched by schema flip |
| AC-6 | Stale cached names cannot cross the version boundary | integration | session-cache integration test; no persistent cache exists (env cache is session-scoped — WS4 execution note) |
| AC-7 | Docs and ADR reflect landed behaviour | non-code | docs-adr-expert review verdict in WS7 |

Completion language (plan complete, workstream complete) is valid only
when every AC above is proven at its stated level.

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Wordlist quality is taste-laden and could ship weak names | Curation rules as tests + blocking owner review before activation |
| v1 behaviour drifts during the refactor | Byte-identical seed-table snapshots in WS1 before any v2 work |
| Cached v1 names served after v2 activation | Versioned cache key, integration-tested (AC-6) |
| Readers of shared state break on the new field | Field required on write, defaulted on read; no backfill needed |
| Stale `dist/` build re-creates cured behaviour during hook checks | Rebuild before exercising hooks; noted in WS4 acceptance |
| Mid-flight schema edits after activation | Digest pin makes them structurally impossible without a v3 entry |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- `principles.md`: long-term architectural correctness — versioned
  registry over silent re-mapping; simplest shape that preserves quality
  (six themes kept, no four-word template).
- `testing-strategy.md`: every cycle is a test+code pair landing in one
  commit; curation rules are state descriptions of the wordlists, not
  audits of implementation choices.
- `schema-first-execution.md`: the zod write schema is the boundary
  authority for the new field; types flow from it.

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

WS5 enumerates the doc surfaces; the ADR is the permanent consolidation
record for the versioning decision.

---

## Consolidation

After completion and green gates, run `/oak-consolidate-docs` to
graduate settled design rationale (U-shaped salience, digest-pin
freeze-at-activation) into the ADR and rotate working notes.

---

## Dependencies

**Blocking**: owner taste review of v2 wordlists before activation
(WS4 checkpoint).

**Beneficial**: none identified; all other work is self-contained in
the `@oaknational/agent-tools` workspace. Minimum shippable shape is
the full plan as written.

**Related Plans**: none active in this collection touch
`core/agent-identity/`.
