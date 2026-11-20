---
id: mcp-121-guidance-serving-architecture
node_type: delivery
name: "Guidance serving architecture: one content source, three serving tiers"
overview: "Collapse the duplicated agent-facing instruction strings into one statement-level content model projected onto three cost-tiered serving surfaces, add the owner-sketched rules-and-guidance tool, and review the year-old instructions text for accuracy and token cost."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-23
ratified_where: "Owner zero-open-PRs disposition card (chat, Bonfire seat), 2026-07-23 — ratify-now answer; the guidance sitting narrows to the format/ingest protocol"
serves: first-major-release
impact_areas:
  - served-surface
  - guidance-content
tickets:
  - MCP-121
depends_on:
  - plan: mcp-101-visible-surface-allowlist
    kind: beneficial
last_updated: 2026-07-23
---

# Guidance serving architecture

## Goal

Every instruction the app serves to an assistant comes from one content
source and lands on the tier whose cost and salience fit it: rich
orientation once at connection time, one lean generated line per tool
description, near-nothing per tool response, and the full Oak rules and
guidance readable on demand through a dedicated tool. The duplicated,
long-unreviewed instruction strings collapse into that source; tokens
are saved on every tool call the app ever serves; and expert-authored
guidance (the guidance-pipeline lane) gains its serving home.

## Mechanism

A statement-level content model in the existing
agent-support-tool-metadata module: each entry carries its binding
force (must-follow rule | orientation | cross-reference) and the tiers
it projects to. Pure generators project the model onto the three
serving tiers:

1. **Initialize instructions** — the binding minimum plus pointers.
   This is the only tier the host injects unconditionally, and the
   server is stateless per request (no session identity), so call-order
   can never be enforced server-side — which is exactly why content
   with binding force lives here and nowhere else. `callOrder: 0` in
   the model is a must-read tier marker (owner-set semantics), not a
   sequence position.
2. **Tool-description prerequisite lines** — one short generated
   sentence from one generator, replacing the four hand-kept variants
   (the three prerequisite-guidance constants and the code-generation
   module's domain-prerequisite sibling).
3. **Per-response context hint** — a single short sentence, with
   relevance-scoping (serve it only on content-bearing tool responses)
   evaluated in-lane: the most-served string is the least-read per
   token, so this tier carries the strictest budget.

A new `get-agent-rules-and-guidance` tool (owner-sketched, must-read
tier) serves the full rules and guidance — the ratified
getting-started baseline now, ingested expert guidance when the
guidance pipeline flows — registered through the visible-surface
allowlist with title and read-only annotations. This is the ratified
hybrid placement (owner, 2026-07-23): instructions carry the binding
minimum and the pointer; the tool carries the full text.

## Acceptance criteria (each with a proof)

1. **One source, no survivors.** All agent-facing instruction strings
   (initialize instructions, per-tool prerequisite lines, response
   hint) generate from the one metadata module; the four duplicate
   constants are deleted and their consumers import projections. Proof
   (`repo-safe`): the old exports no longer exist; generator unit
   tests; all eight consumer modules compile against projections only.
2. **Tier budgets are tested, not aspirational.** Each tier's
   generator output carries a budget ceiling asserted by unit test
   (characters as the proxy), with the per-response hint at the
   strictest bound and a recorded before/after token measurement
   showing net saving. Proof (`repo-safe`).
3. **The rules tool is served per the hybrid.** Registered through the
   allowlist, title + read-only hint present (the registration-walk
   test extends to it), serving the ratified getting-started baseline;
   initialize instructions carry the binding minimum plus the pointer
   to it. Proof (`repo-safe`): protocol-level tests; truth-set snapshot
   updated.
4. **The content is reviewed, not just re-plumbed.** The instructions
   text (unreviewed for roughly a year, owner-stated) is re-authored
   through prose and MCP-spec review lenses; the final served text gets
   the owner's glance before production serve. Proof (`repo-safe` for
   the review trail; `owner-held` for the glance).
5. **The content workspace sees everything.** Every served-string
   change lands in the agent-facing content registry/truth-set so the
   reviewable-workspace lane enumerates it. Proof (`repo-safe`).

## Todos

- Sliced at pickup by the implementer, each slice a single-story PR
  within its round budget (PDR-132).

## Out of scope

- The guidance format specifics (schema fields, one-copy-per-domain,
  verbatim-vs-derived, cross-references): settled by the six owner
  rulings recorded on the guidance-pipeline plan (its gate discharged
  2026-07-24); this plan never pre-decides them.
- Ingest mechanics: the guidance-pipeline lane's surface; this plan
  only provides where its output is served.
- Any content-management machinery beyond the statement-tier fields —
  owner word (2026-07-23): nothing too radical at this delicate stage;
  simpler is easier to innovate on.
