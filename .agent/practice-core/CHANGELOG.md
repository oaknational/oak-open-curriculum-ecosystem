# Practice Core Changelog

Changes to the Practice Core files, newest first. Each entry records the repo
that made the change and what was changed. This file travels with the
Practice Core package.

## [castr] 2026-03-09

- Integrated portable Practice Core into a mature local repo Practice rather than a blank-slate hydration
- Confirmed `principles.md` as the authoritative doctrine name and aligned the local canonical-first structure around that distinction
- Added the structural learning that paused workstreams are distinct from `future/` backlog in mature repos
- Clarified that the portable agent architecture is installable in stages: the Core should distinguish canonical reviewer/domain-expert structure from a repo's current installation status
- Added provenance entries for Castr to the travelling trinity files

## [oak-open-curriculum-ecosystem] 2026-03-09

- Integrated new-cv round-trip: adopted Codex model, value traceability, six-file package, practice-context adjunct, napkin threshold 800→500
- Added `.codex/` to platform adapter lists throughout `practice.md` and `practice-bootstrap.md`
- Updated artefact map and review system to include Codex reviewer registration model
- Adopted value traceability as plan workflow point 5
- Replaced templates as required infrastructure with optional supporting artefacts
- Lowered napkin distillation threshold from ~800 to ~500 lines
- Removed repo-specific ADR references from portable files (routed via practice-index)
- Updated ADR directory path to generic "Repo's ADR directory" with practice-index reference
- Adopted expanded learned principles: documentation concurrent, value traceability, local norms, fitness everywhere, self-containment with practice-context
- Added Adaptation Levels, Restructuring path, and Validation scripts sections to `practice-lineage.md`
- Adopted `CHANGELOG.md` as the sixth Practice Core file
- Adopted practice-context adjunct pattern references

## [new-cv] 2026-03-09

- Added value traceability to the portable planning model: non-trivial work now has to state outcome, impact, and value mechanism
- Updated `practice-lineage.md` so the metacognition prompt and `plan` command both carry the outcome-to-value bridge explicitly
- Tightened `practice.md` to treat plan templates as optional supporting artefacts rather than a required `.agent/plans/templates/` layer
- Updated the bootstrap practice-index template so `.agent/plans/` no longer implies a mandatory templates subtree
- Added an optional `.agent/practice-context/` adjunct pattern with sender-maintained `outgoing/` support material and transient receiver-side `incoming/`; clear `incoming/` after integration and let agents consider supporting outgoing files when a changelog entry alone would be too thin

## [new-cv] 2026-03-08

- Clarified the portable Codex model: `.agents/skills/` is for skills and command-shaped workflows, while real Codex reviewer sub-agents live under `.codex/`
- Updated `practice.md` to include `.codex/` in the tooling layer, review-system description, and artefact map
- Updated `practice-bootstrap.md` so its adapter summary and reviewer-roster wording match the `.codex/` reviewer model
- Aligned the portable Practice wording with the repo's current Codex reviewer architecture

## [new-cv] 2026-03-06

- Added "Restructuring an Existing Practice" path to practice-lineage.md
- Expanded Ecosystem Survey to include practice maturity assessment
- Extended "Never overwrite" to cover domain-specific practice mechanisms
- Added routine cohesion audit to consolidation command specification
- Reframed underscore-prefix rule as ecosystem-agnostic principle
- Added this changelog
- Updated all "five files" references to "six files" across the Practice Core
- Removed vestigial ADR numbers (114, 117, 119, 124, 125) from practice.md and practice-bootstrap.md — concepts already described inline
- Fixed broken references: `schema-first-execution.md`, `invoke-code-reviewers`, `pnpm qg`
- Made non-canonical paths generic: ADR directory paths removed from the Practice Core (routed via `practice-index.md`)
- Aligned distillation threshold to ~500 lines across practice.md and practice-bootstrap.md
- Made portability check step ecosystem-agnostic in practice-bootstrap.md

## [new-cv] 2026-03-05

- First restructuring hydration: adopted the Practice Core into a repo with a mature platform-locked Practice
- Added provenance entries for new-cv to all three trinity files

## [oak-open-curriculum-ecosystem] 2026-02-28

- Ecosystem-agnostic hydration: labelled ecosystem-specific content
- Added cold-start path
- Aligned consolidation with concurrent documentation principle

## [oak-open-curriculum-ecosystem] 2026-02-27

- Adopted Practice Core structure, trinity concept, and bootstrap from round-trip

## [cloudinary-icon-ingest-poc] 2026-02-26

- Origin: initial Practice Core files created for short-lived POC

## [oak-open-curriculum-ecosystem] 2026-02-26

- Origin: initial Practice lineage created for production SDK ecosystem
