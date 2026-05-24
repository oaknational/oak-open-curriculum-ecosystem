---
fitness_line_target: 80
fitness_line_limit: 140
fitness_char_limit: 6000
fitness_line_length: 100
split_strategy: 'Keep concise — this is a routing index, not a content store. Add new repos only when they are part of an Oak teammate working set; remove repos when their relevance is permanently superseded.'
---

# Sibling Repositories

Repositories an Oak teammate working on the Open Curriculum ecosystem will
plausibly clone alongside this one. The list is curated, not exhaustive — only
repos whose contents materially shape work in this ecosystem belong here.

| Repository                                                                                      | Role                                                                                                 |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [`oak-open-curriculum-ecosystem`](https://github.com/oaknational/oak-open-curriculum-ecosystem) | This repository — Curriculum SDK, canonical MCP server, semantic search, the Practice                |
| [`oak-openapi`](https://github.com/oaknational/oak-openapi)                                     | OpenAPI schema for the Oak Curriculum API — the upstream source of truth for SDK code generation     |
| [`oak-curriculum-ontology`](https://github.com/oaknational/oak-curriculum-ontology)             | Oak's formal semantic representation of curriculum structure (RDF/OWL/SKOS/SHACL)                    |
| [`oak-ai-lesson-assistant`](https://github.com/oaknational/oak-ai-lesson-assistant)             | Aila — Oak's AI lesson assistant; consumer of the Curriculum SDK                                     |
| [`oak-ai-moderation-service`](https://github.com/oaknational/oak-ai-moderation-service)         | Moderation pipeline for AI-generated content; relevant when changes here affect moderation contracts |
| [`aila-atomic-concepts`](https://github.com/oaknational/aila-atomic-concepts)                   | Atomic-concept extraction work that feeds curriculum graph thinking                                  |

## Why this list

Schema-first work in this repository depends on `oak-openapi` (Cardinal Rule:
upstream OpenAPI changes flow through `pnpm sdk-codegen`). Knowledge-graph
work intersects `oak-curriculum-ontology`. Aila is the largest internal
consumer of the Curriculum SDK, so SDK contract changes have downstream
implications there.

## Maintenance

- **Owner**: this repository's documentation owners.
- **Review trigger**: when a teammate proposes adding or removing a repo, or
  when an existing entry's role description no longer matches the upstream
  README.
- **Out of scope**: repos a teammate might clone for unrelated personal work,
  or repos that have been permanently archived upstream.
