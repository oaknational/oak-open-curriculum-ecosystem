# Semantic Search Service Plan (Placeholder)

Scope: Design and implement a hybrid lexical + semantic search service for Oak. This document is a placeholder to capture intent and links; details to be populated later.

## Goals (TBD)

- Provide a Search SDK abstraction that either:
  - surfaces MCP tools directly, or
  - emits an OpenAPI definition from which MCP tools can be generated (potentially within the Curriculum SDK).
- Enable retrieval of lessons/units/threads with semantic ranking and lexical fallbacks.

## Deliverables (TBD)

- Search SDK package and/or OpenAPI spec artifact
- Generated MCP tools (or generation pipeline) consumable by servers
- Minimal demo integration in Curriculum MCP

## Acceptance Criteria (TBD)

- End-to-end access via MCP to the search service
- Unit/integration tests (no external network) for ranking, pagination, and query parsing
- Documentation for usage and configuration

## Dependencies / Notes

- Align with repository rules for strict typing, validation, and test isolation
- Consider shared infra with Curriculum SDK where appropriate

## References

- High-Level Plan item 3
- Existing `docs/` guidance on testing and TypeScript practices
