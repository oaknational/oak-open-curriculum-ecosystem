---
name: PDR-007 Migration — Collapse Three Homes to First-Class Core Surfaces
status: active
overview: |
  Realise the decision in PDR-007 by moving PDRs into
  practice-core/decision-records/, universally-portable patterns into
  practice-core/patterns/, sharpening practice-context/outgoing/ to
  ephemeral-support-only, rewriting the Pattern Exchange mechanism to
  fold into Core travel, and updating the trinity + entry points to
  reflect the new Core contract. Captures eleven PDRs (001-011) and
  ~52 universal pattern candidates.
related_pdrs:
  - PDR-007 (new Core contract)
  - PDR-008, PDR-009, PDR-010, PDR-011 (authored under the new contract)
todos:
  - moves PDRs → practice-core/decision-records/
  - classify patterns, move universal ones → practice-core/patterns/
  - delete outgoing/ duplicates and PDR-shaped topic notes
  - edit trinity for new Core contract
  - edit entry points (README, index, CHANGELOG, practice-verification)
  - update practice-index.md (host bridge)
  - sweep cross-references to zero stale paths
  - rewrite Pattern Exchange section in practice-lineage.md
---

# PDR-007 Migration Plan

## Scope

PDR-007 (Accepted) redefined the Core contract from "eight files" to
"files + required directories." This plan executes the mechanical
migration.

Two new Core directories are created:

- `practice-core/decision-records/` — absorbs `practice-decision-records/`
- `practice-core/patterns/` — receives universally-portable graduated
  patterns from `memory/patterns/`

One directory narrows: `memory/patterns/` retains repo-specific
patterns only. One directory sharpens: `practice-context/outgoing/`
retains ephemeral exchange material only — PDR-shaped topic notes and
pattern duplicates are resolved.

## Ordered execution

Commits run in this order; each is independently reviewable.

### Commit 1 — PDRs move to Core

Move all PDR files and the README from `.agent/practice-decision-records/`
to `.agent/practice-core/decision-records/`.

```
.agent/practice-decision-records/README.md
.agent/practice-decision-records/PDR-001-location-of-practice-decision-records.md
.agent/practice-decision-records/PDR-002-pedagogical-reinforcement-in-foundational-practice-docs.md
.agent/practice-decision-records/PDR-003-sub-agent-protection-of-foundational-practice-docs.md
.agent/practice-decision-records/PDR-004-explorations-as-durable-design-space-tier.md
.agent/practice-decision-records/PDR-005-wholesale-practice-transplantation.md
.agent/practice-decision-records/PDR-006-dev-tooling-per-ecosystem.md
.agent/practice-decision-records/PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md
.agent/practice-decision-records/PDR-008-canonical-quality-gate-naming.md
.agent/practice-decision-records/PDR-009-canonical-first-cross-platform-architecture.md
.agent/practice-decision-records/PDR-010-domain-specialist-capability-pattern.md
.agent/practice-decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md
```
→ `.agent/practice-core/decision-records/<same-filenames>`

Executed via `git mv`. Remove the empty source directory.

### Commit 2 — Universal patterns move to Core

Classification below. `UNIVERSAL` moves to `.agent/practice-core/patterns/`;
`LOCAL` stays in `.agent/memory/patterns/`; `?` is borderline and
flagged for your override.

**Criteria recap (from PDR-007)**:
1. Cross-ecosystem applicable (not TS/Zod/Vitest/MCP/specific-SDK)
2. Practice-relevant
3. Proven across ≥2 instances
4. Stable

| Pattern | Proposed | Note |
|---|---|---|
| accessibility-as-blocking-gate | UNIVERSAL | Any UI project |
| additive-only-schema-decoration | LOCAL | Zod-specific |
| adr-by-reusability-not-diff-size | UNIVERSAL | ADR discipline |
| agentic-surface-separation | UNIVERSAL | Cited by PDR-009 |
| boundary-narrowing-for-schema-types | LOCAL | TS-schema-specific |
| chatgpt-report-normalisation | ? | Niche tool-specific; proposed LOCAL |
| check-driven-development | UNIVERSAL | Quality-gate discipline |
| circular-test-justification | UNIVERSAL | Test discipline |
| cli-flag-env-precedence | UNIVERSAL | CLI design |
| comments-about-externals-degrade | UNIVERSAL | Code-comment discipline |
| conformance-tests-for-library-adoption | UNIVERSAL | Testing strategy |
| const-map-as-type-guard | LOCAL | TS `as const`-specific |
| cross-session-pattern-emergence | UNIVERSAL | Consolidation discipline |
| current-plan-promotion | UNIVERSAL | Plan lifecycle |
| domain-specialist-final-say | UNIVERSAL | Reviewer authority |
| dont-test-sdk-internals | UNIVERSAL | Test-what-you-own |
| drift-detection-test | UNIVERSAL | Generic test pattern |
| end-goals-over-means-goals | UNIVERSAL | Planning discipline |
| evidence-before-classification | UNIVERSAL | Static analysis discipline |
| explicit-di-over-ambient-state | UNIVERSAL | DI principle |
| explicit-missing-resource-state | UNIVERSAL | Architecture principle |
| findings-route-to-lane-or-rejection | UNIVERSAL | Review discipline |
| fix-at-source-not-consumer | UNIVERSAL | Debugging discipline |
| generic-factory-for-di-composition | LOCAL | TS generics-specific |
| governance-claim-needs-a-scanner | UNIVERSAL | Governance discipline |
| ground-before-framing | UNIVERSAL | Framing discipline |
| guarded-fire-and-forget-cleanup | UNIVERSAL | Async discipline |
| indexed-access-subtype-derivation | LOCAL | TS type-specific |
| infrastructure-never-masks-business | UNIVERSAL | Architecture principle |
| interface-segregation-for-test-fakes | UNIVERSAL | Testing pattern |
| json-loader-for-large-datasets | LOCAL | TS/Node-specific |
| library-types-before-local-shapes | LOCAL | TS type-specific |
| monotonic-counter-is-not-quality-indicator | UNIVERSAL | Versioning discipline |
| multi-layer-schema-sync | ? | Schema-sync pattern is broadly applicable; proposed LOCAL; schema tooling varies per ecosystem |
| narrow-re-exports-at-boundaries | LOCAL | TS-specific |
| non-leading-reviewer-prompts | UNIVERSAL | Reviewer design |
| nothing-unplanned-without-a-promotion-trigger | UNIVERSAL | Planning discipline |
| omit-unknown-from-library-types | LOCAL | TS type-specific |
| plain-node-built-artifact-proof | LOCAL | Node-specific |
| platform-config-is-infrastructure | UNIVERSAL | Agent infrastructure |
| pnpm-strict-hoisting-type-resolution | LOCAL | pnpm-specific |
| pre-implementation-plan-review | UNIVERSAL | Review timing |
| prefer-native-sdk-over-custom-plumbing | UNIVERSAL | Engineering discipline |
| preprocess-for-type-preserving-coercion | LOCAL | Zod-specific |
| provider-neutral-types-at-boundaries | UNIVERSAL | Abstraction discipline |
| pure-leaf-extraction | UNIVERSAL | Software architecture |
| rate-limit-upstream-amplification-vectors | UNIVERSAL | Architecture principle |
| re-evaluate-removal-conditions | UNIVERSAL | Workaround hygiene |
| readme-as-index | UNIVERSAL | Documentation discipline |
| repair-workflow-contract-clarity | UNIVERSAL | Workflow design |
| review-intentions-not-just-code | UNIVERSAL | Review discipline |
| reviewer-widening-is-always-wrong | UNIVERSAL | Review anti-pattern |
| route-reviewers-by-abstraction-layer | UNIVERSAL | Review dispatch |
| satisfies-for-mock-completeness | LOCAL | TS `satisfies`-specific |
| scoped-gitignore-for-colliding-directory-names | UNIVERSAL | Git discipline |
| sdk-owned-retriever-delegation | LOCAL | ES-specific |
| shared-strictness-requires-workspace-adoption | ? | Monorepo-specific; proposed UNIVERSAL (monorepos exist in many ecosystems) |
| source-first-adopt-or-explain | UNIVERSAL | Dependency discipline |
| string-codegen-type-safety-gap | ? | Codegen-pattern applies to multi-ecosystem codegen; proposed LOCAL (TS-specific in current form) |
| substance-before-fitness | UNIVERSAL | Practice discipline |
| template-literal-derived-union | LOCAL | TS template-literal-specific |
| test-claim-assertion-parity | UNIVERSAL | Test discipline |
| test-complexity-signals-wrong-level | UNIVERSAL | Testing discipline |
| three-levels-of-reference-quality | UNIVERSAL | Reference/doc discipline |
| tool-output-framing-bias | UNIVERSAL | Cognitive discipline |
| tsdoc-extension-point-for-future-consumers | LOCAL | TSDoc-specific |
| unknown-until-validated | UNIVERSAL | Validation principle |
| ux-predates-visual-design | UNIVERSAL | UX discipline |
| validation-error-severity-separation | UNIVERSAL | Validation discipline |
| verify-before-propagating | UNIVERSAL | Claim verification |
| warning-severity-is-off-severity | UNIVERSAL | Linting discipline |
| wire-format-aware-redaction | UNIVERSAL | Security/redaction principle |
| workaround-debt-compounds-through-rationalisation | UNIVERSAL | Meta-discipline |

**Summary**: 53 UNIVERSAL, 17 LOCAL, 3 borderline (`?`).
**Borderline defaults** (unless you override): chatgpt-report-normalisation → LOCAL; multi-layer-schema-sync → LOCAL; shared-strictness-requires-workspace-adoption → UNIVERSAL; string-codegen-type-safety-gap → LOCAL.

Execution: `git mv` each UNIVERSAL pattern file from
`.agent/memory/patterns/` to `.agent/practice-core/patterns/`. Create
`.agent/practice-core/patterns/README.md` mirroring the existing
README (taxonomy, frontmatter schema, pattern-vs-rule distinction)
adapted to the graduated-universal scope. Update
`.agent/memory/patterns/README.md` to reflect the narrower
repo-specific scope.

### Commit 3 — Outgoing cleanup (revised — full disposition audit)

Per PDR-007, outgoing/ narrows to ephemeral exchange only — any file
carrying substance found nowhere else is a defect. The revised
disposition (owner audit requested):

**DELETE (12) — substance captured in a Core surface**:

| File | Captured in |
|---|---|
| assumption-auditing-meta-level-capability.md | PDR-010 (inverted-hierarchy variant) |
| continuity-handoff-and-surprise-pipeline.md | PDR-011 |
| cross-platform-surface-integration-guide.md | PDR-009 |
| explorations-documentation-tier.md | PDR-004 |
| frontend-review-cluster-pattern.md | PDR-010 + PDR-009 |
| platform-config-is-infrastructure.md | memory/patterns/ duplicate; graduates to practice-core/patterns/ in Commit 2 |
| practice-core-structural-evolution.md | PDR-007 (stale on "eight files") |
| practice-decision-records-peer-directory.md | PDR-001 + PDR-007 |
| architectural-excellence-and-layer-topology.md | Self-declares substance is in practice-lineage.md §Principles and §Learned Principles |
| unknown-is-type-destruction.md | `.agent/rules/unknown-is-type-destruction.md` already carries the rule |
| reviewer-system-guide.md | PDR-009 (three-layer) + PDR-010 (triplet, classification, modes); the guide is a pre-PDR synthesis of that substance |
| handover-prompts-vs-session-skills.md | Substance absorbs into practice-lineage §Artefact types (done in Commit 4 trinity edit) |

Also DELETE the `.agent/practice-context/outgoing/patterns/`
subdirectory (6 pattern files + README) — all are duplicates of
`memory/patterns/` entries that graduate to `practice-core/patterns/`
in Commit 2. The subdirectory's transport purpose is retired by
PDR-007 (Pattern Exchange folds into Core travel).

**ABSORB (1) — into practice-core/patterns/README.md**:

| File | Target |
|---|---|
| pattern-schema-for-discoverability.md | `practice-core/patterns/README.md` §Frontmatter Schema (absorb the dual-schema comparison; done in Commit 4) |

**MOVE-TO-REFERENCE (3) — host-local, not portable Practice**:

| File | New location |
|---|---|
| claude-code-hook-activation.md | `.agent/reference/platform-notes/claude-code-hook-activation.md` (platform-specific; host-local) |
| validation-scripts.md | `.agent/reference/practice-validation-scripts.md` (host-local script-reference implementations) |
| validate-practice-fitness.ts | `.agent/reference/examples/validate-practice-fitness.example.ts` (sample script for re-use; host-local reference) |

These are genuine reference material, not exchange context. They
should not live in `outgoing/`; they should live in a host-local
reference directory.

**RETAIN as future-PDR candidates (5)** — substance not yet captured;
the outgoing/README labels each explicitly as "future PDR candidate"
with the PDR number reserved:

| File | Future PDR | Substance shape |
|---|---|---|
| three-dimension-fitness-functions.md | PDR-012 (Fitness Model) — previously deferred from this session | Three-zone model, CRITICAL_RATIO, loop-health diagnostic |
| cross-repo-transfer-operations.md | PDR-013 (Transfer Operations) | Operational lessons for cross-repo Practice transfers |
| seeding-protocol-guidance.md | PDR-013 (candidate to merge with transfer operations) | Seeding-bundle composition; sender-side discipline |
| two-way-merge-methodology.md | PDR-014 (Core Integration Mechanics) | Two-way merge; ancestor tracking; divergence reconciliation |
| practice-maturity-framework.md | PDR-015 (Practice Maturity Diagnostic) | Four-level depth-vs-scope model |

These five files stay where they are **with an explicit label**:
each one's frontmatter is updated (or a front-matter note added) to
say "Future-PDR candidate, number reserved, session when drafted:
TBD." The `outgoing/README.md` rewrites to list these as staged
material pending PDR drafting rather than indefinite retention.

**RETAIN as future-pattern candidates (3)** — pattern-shaped; need
frontmatter to graduate:

| File | Future target | Reason for deferral |
|---|---|---|
| reviewer-gateway-operations.md | `practice-core/patterns/` | Needs pattern frontmatter (name / use_this_when / category / barrier); reshape minor |
| production-reviewer-scaling.md | `practice-core/patterns/` | Needs pattern frontmatter; reshape minor |
| plan-lifecycle-four-stage.md | `practice-core/patterns/` | Needs pattern frontmatter; reshape minor |

These are cleaner to graduate than the PDR candidates (frontmatter
addition only, not full PDR drafting). **Owner choice**: graduate
them **in this migration** (Commit 2 extends to cover the reshape)
or **retain as labelled candidates** with the migration explicit
about the reshape pending. The frontmatter-addition work is ~10-15
minutes per file; total ~45 min added to the session.

**RETAIN as genuinely ephemeral (3 + subdir)** — exchange context
whose purpose is transient:

| File | Rationale |
|---|---|
| design-token-governance-for-self-contained-ui.md | Domain-specific (UI tokens); short-lived cross-repo exchange context |
| starter-templates.md | Minimum-viable-reviewer templates as starter material for new repos; inherently reference, but genuinely transient exchange form |
| health-probe-and-policy-spine.md | Operational exchange note; domain-specific; not yet matured into pattern |
| agent-collaboration/ (subdir) | Repo-targeted write-back feedback from a specific 2026-04-05 integration; genuinely transient receiver→sender exchange |

These stay in `outgoing/` under the PDR-007 narrowing (ephemeral
exchange only). The outgoing/README.md explicitly scopes this
category.

**ALSO MOVE to reference (1)** — host-specific detailed adapter tables:

| File | New location |
|---|---|
| platform-adapter-reference.md | `.agent/reference/platform-adapter-formats.md` (host-local reference; detailed adapter-file format tables; complements PDR-009's portable substance) |

---

**Summary of Commit 3**:
- DELETE 12 files + 1 subdirectory (7 files) = 19 files removed
- MOVE 4 files → `.agent/reference/` (host-local)
- ABSORB 1 file → `practice-core/patterns/README.md`
- RETAIN 11 files in `outgoing/` (5 future-PDR, 3 future-pattern, 3 ephemeral), with `outgoing/README.md` rewritten to label each explicitly

**Owner decision** (two at this step):
1. For the 3 future-pattern candidates: graduate in this migration
   (adds ~45 min) or retain as labelled candidates?
2. Any file on the DELETE list you want RETAINED, or any on RETAIN
   you want DELETED / absorbed?

### Commit 4 — Trinity edits

Edit the three trinity files to reflect the new Core contract.

#### `.agent/practice-core/practice.md`

- §Artefact Map: add `practice-core/decision-records/` and
  `practice-core/patterns/` as Core surfaces; update the Practice Core
  row's surface list; remove references to the old `.agent/memory/patterns/`
  as the universal-patterns home (it now holds repo-specific only).
- §Plasmid Exchange: update from "eight files" to the new contract
  (files + required directories).
- §Knowledge Flow §Artefact Locations: update Code patterns line to
  distinguish `practice-core/patterns/` (universal) from
  `memory/patterns/` (repo-specific).
- §Sustainability and Scaling: preserve the narrative; adjust any
  file-count references that mention "eight-file Core."

#### `.agent/practice-core/practice-lineage.md`

- §Pattern Exchange: rewrite substantially — the outgoing/patterns
  transport path dissolves; portable patterns travel because they are
  Core content; graduation criterion is the four-part universal bar
  from PDR-007 / PDR-010.
- §Three genesis scenarios: update references from "eight-file Core
  contract" to the new shape.
- Add a brief pointer section (or extend the existing Decision
  Records section) noting that PDRs now live in `practice-core/decision-records/`.

#### `.agent/practice-core/practice-bootstrap.md`

- Add a `Decision Records` section with the PDR template (Title /
  Status / Date / Related / Context / Decision / Rationale /
  Consequences / Notes) and the `pdr_kind` frontmatter variant marker.
- Add a `Universal Patterns` section describing the graduation
  criterion and how a local `memory/patterns/` entry graduates into
  `practice-core/patterns/`.
- Update the §Ecosystem Survey template (if it references the
  eight-file contract) to match the new shape.

#### `.agent/practice-core/practice-verification.md`

- §Bootstrap Checklist: add `decision-records/` and `patterns/` as
  Core surfaces to verify during hydration.
- §Minimum Operational Estate: add required presence of
  `practice-core/decision-records/README.md` (the index) and
  `practice-core/patterns/README.md`.

All trinity edits are substantive. I draft; you review each diff
before commit.

### Commit 5 — Entry points and operational

#### `.agent/practice-core/README.md`

- Update the human-facing hydration how-to: from "drop the eight Core
  files" to "the Core package — files plus required directories."
- Update the peer-companion description: `decision-records/` is now
  inside Core, not a peer.
- Update the human explanation of the Practice Box.

#### `.agent/practice-core/index.md`

- Update the "Practice Core Files" table to the new shape (files +
  directories).
- Update the Cold Start section to reflect the hydration target.
- Update the Boundary Contract to list the new surfaces.
- Remove references to `.agent/practice-decision-records/` as a peer
  directory (it is now `practice-core/decision-records/`).

#### `.agent/practice-core/CHANGELOG.md`

- Add an entry recording the Core contract change per PDR-007 and
  the migration executed by this plan.

#### `.agent/practice-index.md` (host bridge)

- Update references to `practice-decision-records/` to point at the
  new Core-internal location.
- If it references `memory/patterns/` as the home of universal
  patterns, update to point at `practice-core/patterns/` for universal
  and retain `memory/patterns/` for repo-specific.

### Commit 6 — Cross-reference sweep

Run grep across `.agent/**/*.md` and `docs/**/*.md` for:

- `practice-decision-records/` → `practice-core/decision-records/`
- `practice-context/outgoing/patterns/` → (deleted; may reference
  `practice-core/patterns/` where still meaningful)
- "eight-file" / "eight files" → "Core package" or equivalent per
  context
- Any reference to patterns in `memory/patterns/` that was actually
  about a pattern that graduated should update to point at
  `practice-core/patterns/`

Verify: `grep -r "practice-decision-records" .agent/ docs/` returns
zero stale paths. `grep -r "practice-context/outgoing/patterns"
.agent/ docs/` returns zero hits.

### Commit 7 — Rule-file updates and final wrapper sweep

Some `.agent/rules/` files reference the old layout. Sweep:

- `.agent/rules/subagent-practice-core-protection.md` —
  confirm/update surface list to include new Core directories.
- Any rule that cites a PDR by path — update paths.

Run `pnpm subagents:check` and `pnpm portability:check` to verify
no adapter mismatches.

## Acceptance criteria

1. `pnpm check` exits 0 from repo root.
2. `pnpm practice:fitness --strict-hard` — no new hard-zone violations.
3. `grep -r "practice-decision-records" .agent/ docs/ 2>/dev/null`
   returns zero hits (directory is fully migrated).
4. `grep -r "practice-context/outgoing/patterns" .agent/ docs/
   2>/dev/null` returns zero hits.
5. `.agent/practice-decision-records/` no longer exists.
6. `.agent/practice-context/outgoing/patterns/` no longer exists.
7. `.agent/practice-core/decision-records/` contains 12 files
   (11 PDRs + README).
8. `.agent/practice-core/patterns/` contains 53 universal patterns +
   README (subject to your overrides on borderline cases).
9. `.agent/memory/patterns/` contains 17 repo-specific patterns +
   updated README.
10. All trinity files and entry points reflect the new Core contract.
11. Reviewer matrix (`docs-adr-reviewer` + `architecture-reviewer-fred`)
    passes on the migration commits.

## Reviewer matrix

Post-migration reviewer passes (Phase 4):

- **docs-adr-reviewer** — trinity edit coherence; cross-reference
  correctness; new-Core-contract description fidelity.
- **architecture-reviewer-fred** — boundary discipline (PDRs in Core;
  patterns graduation bar; outgoing sharpened); contract shape
  correctness vs. PDR-007.

Reviewer prompts are non-leading; findings actioned unless explicitly
rejected with written rationale.
