---
id: mcp-101-visible-surface-allowlist
node_type: delivery
name: "Visible-surface allowlist: the app serves exactly and only what we intend"
overview: "Zero served prompts; navigation guidance live as agent resources; creation-oriented content dormant behind one declarative allowlist; every tool titled with read-only hints."
status: archived
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-23
ratified_where: "Planning-sitting part-2 ratification cards, 2026-07-23 (ratified with the served-surface vocabulary amendment); decisions register D11 dated note + D22 lift note"
serves: first-major-release
impact_areas:
  - served-surface
tickets:
  - MCP-101
depends_on: []
last_updated: 2026-07-24
---

# Visible-surface allowlist

## Disposition (archived 2026-07-24)

- 2026-07-24 — COMPLETED and archived (MCP-141 scan, Director nod):
  every acceptance criterion proven — completion evidence is the
  MCP-101 ticket (Done 2026-07-23, five PRs) and the strategic node's
  owner-authored dated note of 2026-07-23 ("M1 COMPLETE: MCP-101 done,
  five PRs, every acceptance criterion proven; the v1 live set
  finalised by the EEF flip"). Archived per the plan-node schema's
  completion prescription (a delivery plan completes and moves to
  `archive/`); content otherwise byte-identical to the ratified plan
  at its prior path. The ratification stamp stands as the historical
  record.

## Vocabulary (owner-set, 2026-07-23 — three things never to conflate)

Three similar-looking concepts cause real confusion and this estate
keeps them distinct on every surface:

- **MCP prompts** — user-invoked templates surfaced by the host UI.
  This release serves **none**: they are a poor user experience for
  teachers. The primitive is unregistered entirely.
- **Skill-like agent guidance** — documents served *to the assistant*
  via MCP tools and resources (this release's live navigation set and
  the served getting-started guidance). **Present in this release;
  nothing generative.**
- **Native agent skills** — skill packages installed into the
  assistant platform itself, outside MCP. **Not in this release; a
  very high priority for the second release.**

This lane implements the boundary between the first two; the third is
out of scope entirely.

## Goal

Assistants see exactly — and only — what we intend, controlled from
one declarative point. When this lands: the app serves no user-invoked
prompt templates at all; the three navigation guides (finding lessons,
exploring the curriculum, following learning progression) are live as
agent-readable resources; the creation-oriented content is retained
but dormant; and every tool declares its title and read-only nature.
This is the state the conformance checks, store screenshots, and
compliance review all trust.

## Mechanism

One structural, registration-time allowlist over tools and resources —
never a runtime flag. The prompt primitive is unregistered entirely;
the seven workflow bodies re-home as resource documents whose
live-vs-dormant state the allowlist governs (the ratified live-set:
navigation three live, creation four dormant). The existing EEF
env-flag gating migrates into the same declarative surface definition
— superseded, not accumulated alongside. The allowlist is the single
point of control the content workspace renders live-vs-dormant from,
and the same point that enforces the branding rule's asset-exposure
audit (no served asset enables Oak-branded generation).

## Acceptance criteria (each with a proof)

1. **The app serves zero prompts.** Proof (`repo-safe`): a test asserts
   the prompts capability is absent/empty at the protocol level, and
   the packaging truth-set records it.
2. **The navigation three are served as agent resources; the creation
   four exist but are not served.** Proof (`repo-safe`): allowlist
   tests assert the exact live resource set; the truth-set snapshot
   matches it.
3. **Every served tool carries a title and a read-only hint.** Proof
   (`repo-safe`): a registration-time test walks the served surface
   and fails on any missing annotation.
4. **One declarative surface definition governs everything served;
   the EEF env flag no longer exists.** Proof (`repo-safe`): the flag
   is absent from the codebase and schema; enabling/disabling any
   surface element is a reviewed change to the one definition, shown
   by test.

## Todos

- Sliced at pickup by the implementer, each slice a single-story PR
  within its round budget (PDR-132).

## Out of scope

- Which content is live: decided (the ratified live-set) — this lane
  implements, it does not re-decide.
- The guidance-content surface: registered through this allowlist but
  delivered by the guidance-pipeline lane.
- The content workspace rendering: consumes the allowlist; built in
  its own lane.
