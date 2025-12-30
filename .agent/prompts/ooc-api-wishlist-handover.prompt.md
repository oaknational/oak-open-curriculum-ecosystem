# OOC API wishlist work summary

Date: 7 January 2025

## Work carried out
- Added a new RFC for a `/schemas` bundle endpoint, aligned with the existing schema-first SDK generation flow and optional validation use in MCP tooling.
- Split the wishlist examples into topic-focused files and linked them from the index to make each request concrete and actionable.
- Reworked the coordination summary into three tables (bugs, potential gaps, enhancements), with consistent priority/impact labels and constrained effort estimates.
- Added user-impact callouts inside detailed request sections to make prioritisation explicit for the project manager.
- Added API code review findings and cross-references to examples, covering bugs, missing documentation, and behaviour mismatches.
- Kept all edits within `.agent/plans/external/ooc-api-wishlist` and the new prompt, preserving existing information while expanding clarity.

## Intended impact
- Make the handover pack immediately actionable by the API team, with clear context, examples, and prioritisation cues.
- Reduce ambiguity by tying each request to a real API behaviour or gap, plus an example of intended behaviour.
- Support the SDK and MCP lifecycle by proposing a schema bundle that can be generated at build time and consumed at runtime without drift.
- Improve decision-making by explicitly linking each item to user impact, not just technical outcomes.

## Audience
- API engineers implementing fixes and enhancements.
- SDK and MCP engineers generating types, validation, and tool metadata from the OpenAPI schema.
- Curriculum leaders and teachers who need reliable content access and metadata.
- Students and adult learners who depend on accessible, complete content.
- Partner engineers and data consumers integrating with the API.
- Stakeholders focused on equitable access to maths education, including founders and funders.
