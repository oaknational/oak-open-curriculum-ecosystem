---
id: mcp-102-guidance-pipeline
node_type: delivery
name: "Guidance pipeline: expert-authored guidance travels into the app"
overview: "Ingest, sanitise, and serve non-engineer-authored guidance with a human-visible pre-live diff — separating the engineering clock from the expert-authoring clock."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-23
ratified_where: "Planning-sitting part-2 ratification cards, 2026-07-23; decisions register D22 lift note (protocol gate expiry 2026-07-26 stands)"
serves: first-major-release
impact_areas:
  - guidance-content
  - served-surface
tickets:
  - MCP-102
depends_on:
  - plan: mcp-101-visible-surface-allowlist
    kind: beneficial
last_updated: 2026-07-24
---

# Guidance pipeline

## Dated notes

- 2026-07-24 — The format/ingest-protocol owner gate is DISCHARGED
  (MCP-141 scan truing): six rulings adopted at owner cards, sitting of
  2026-07-23 ~15:35; the authoritative record is the MCP-102 ticket
  comment of that timestamp (policy/application boundary,
  verbatim-vs-derived contract, five-docs-as-system precedence, additive
  schema evolution, decision-procedure worked examples,
  one-copy + content-hash versioning). Pickup builds to those rulings;
  the gate row is removed as resolved. The out-of-scope line "this
  plan implements the agreed protocol, it does not decide it" now
  points at that record.

## Goal

Guidance written by Oak's experts in plain English travels into the
app automatically: ingested on an explicit trigger, sanitised and
validated at a strict boundary, and served to assistants — with the
authors seeing exactly what will go live before it does. Once proven
with sample content, updating the app's guidance is a routine
re-ingest, never an engineering task: the engineering clock and the
expert-authoring clock are permanently separated.

## Mechanism

Owner-triggered ingest reads Ready-status rows from the authoring
space (never automatic — the authoring surface is not authoritative;
the ingested, reviewed artefact is). A strict schema validates at the
boundary: only the assistant-facing statement fields pass; provenance
(author, date, approver, template version) and a content hash travel
as metadata, so every ingest is auditably distinct and sign-off binds
to a specific version. A human-visible diff of exactly what will be
served precedes any production change. The served surface registers
through the visible-surface allowlist (the beneficial dependency:
integrable before that lane lands, registered through it once it has).

The minimum shippable shape without the allowlist lane: serve through
the existing registration path and migrate registration when the
allowlist lands.

## Acceptance criteria (each with a proof)

1. **Only Ready rows ingest, on an explicit trigger.** Proof
   (`repo-safe`): tests cover Draft/In-review rows refused, Ready rows
   accepted, and no ingest path that runs without the trigger.
2. **The boundary is strict.** Proof (`repo-safe`): red-first tests
   show non-conforming content (missing fields, unexpected structure,
   private-section leakage) rejected at the schema boundary with
   actionable errors.
3. **Provenance and content hash recorded per ingest.** Proof
   (`repo-safe`): the served artefact carries author, date, approver,
   template version, and hash; tests assert their presence and
   stability.
4. **The pre-live diff exists and gates serving.** Proof (`repo-safe`
   for the artefact's generation; `owner-held` for the review act):
   the diff artefact renders exactly what changes; the owner's
   confirming glance is recorded on the ticket before first
   production serve.
5. **End-to-end with sample content.** Proof (`repo-safe`): an
   integration test carries one sample document from authoring shape
   to served output; (`owner-held`): the owner confirms the sample's
   served form matches the authored intent.

## Todos

- Sliced at pickup by the implementer, each slice a single-story PR
  within its round budget (PDR-132).

## Out of scope

- The guidance content itself: authored by Oak's experts on their
  clock; this plan never blocks on it beyond the sample.
- The format/ingest-protocol decision: decided at the discharged gate
  (see Dated notes) — this plan implements the agreed protocol, it
  does not decide it.
- Serving-surface placement detail (app definition vs startup tool):
  confirmed with the owner at the protocol agreement.
