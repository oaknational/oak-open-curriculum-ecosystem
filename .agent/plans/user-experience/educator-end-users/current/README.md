# Current Plans — Educator End Users

Queued, executable plans for the educator (curriculum-assistance) persona.

| Plan | Scope | Status |
|------|-------|--------|
| [external-facing-capability-distribution.plan.md](external-facing-capability-distribution.plan.md) | **Corpus map** for the external-facing-capability plans, plus index routing. Records the decided shape (both directions; cross-vendor bundle; Claude+Codex) and names the open decisions (source-of-truth topology; first-tranche scope) | Queued |
| [oak-skills-ingest-and-resurfacing.plan.md](oak-skills-ingest-and-resurfacing.plan.md) | Direction A of the owner's both-directions distribution decision: this repo ingests `SKILL.md` capability sources and re-surfaces them through the Oak Curriculum MCP app in MCP-native forms, via the latent `sourceType` extension point. Workstream 0 is a design-gate spike; code workstreams queue behind it. Also migrates + deprecates the legacy `workflows` surface (t5) | Queued |
| [plugin-package-creation.plan.md](plugin-package-creation.plan.md) | Create and ship the cross-vendor plugin package: emit Claude + Codex manifests from one source, reference the deployed MCP + agreed skills, clear directory-policy, prove install. Consumes Directions A and B; w0 is a design gate | Queued |
| [app-submission-standards.plan.md](app-submission-standards.plan.md) | App submission required standards for the Claude + OpenAI directories: governance/ADR, privacy-policy surfacing, graph token-efficiency (sub-querying), MCP tool-interface discipline. The directory-policy home referenced by the plugin package's w3 | Queued |
| [position-anchored-teaching-continuity.plan.md](position-anchored-teaching-continuity.plan.md) | A position-anchored MCP prompt ("my class just finished X — what next?") owning position→next resolution and chaining into `lesson-planning` (never a third planning surface), plus one bounded outward impact-language alignment pass with every claim evidence-paired | Ready for execution — c0 ratified (new prompt; name at PR); reviewers absorbed; implementer owner-named |

Persona brief: [../README.md](../README.md)
