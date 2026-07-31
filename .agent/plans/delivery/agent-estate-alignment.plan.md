---
id: agent-estate-alignment
node_type: delivery
name: "Agent-estate alignment — agents as knowledge nodes"
overview: "Structure the sub-agent estate under the knowledge-estate contract (domains as folders, strata and concepts as metadata), overhaul the architect and corpus agents, add the missing Practice and graph experts."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: planning-and-intent-estate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-07-31
---

# Agent-estate alignment — agents as knowledge nodes

## Goal

The sub-agent estate is a governed domain of the knowledge estate
rather than a flat directory: every template carries typed front matter
(identity, stratum, domain, concept annotations, composition edges),
navigable domain folders, and validator-checked structure — and the
estate's known expertise gaps are filled. (No Linear ticket by design:
owner-ruled untracked subtree.)

## Mechanism

Owner direction 2026-07-31 (in-session), shaped by concept
exploration: agents are knowledge artifacts, so the ratified contract
applies to them rather than a bespoke taxonomy — **folders carry the
human-navigation axis (domain: software-engineering / the-practice /
third-party-integrations / knowledge-and-corpus), metadata carries the
graph axes (stratum, concepts, edges)**. Dispatch counts from the
existing review-dispatch and cricket tallies become the computed-
confidence axis for agents, for free. The slices, at pickup order:

1. **`subagent-architect` overhaul first** — fix-the-generator: it
   must teach the new contract (and current vendor standards, refreshed
   from original sources at time of use) so every subsequent agent
   conforms by construction.
2. **Structure + metadata migration** — folders and front matter across
   `.agent/sub-agents/templates/`, wrappers regenerated (the generator
   is the fix point; the Cricket-rename sweep is the worked precedent),
   `validate-subagents`/`validate-portability` green throughout.
3. **corpus-\* agent overhaul** — align the harvest workers to the
   ledger vocabulary (dispositions, provenance pointers, concept-
   candidate outputs) and the Cricket lessons (vendor-neutral naming,
   effort-inversion where judgement is compiled, template-resolution
   health checks in the dispatch path), including their skills and
   workflows. Design input (added 2026-07-31): the owner's tiered-sight
   architecture — foveation ladder, overlap/disagreement-field
   sampling, and the source-access invariant — with run evidence in
   the comms-corpus discovery report
   (`.agent/reports/agentic-engineering/comms-corpus-knowledge-transfer/discovery-report-2026-07-31.md`
   §"Tiered sight"); the overhauled corpus agents are that
   architecture's first standing instantiation surface.
4. **Practice expert** (new) — reviews Practice-doctrine changes for
   strata/direction-law/membrane coherence and rule-vs-PDR homing.
5. **Graph expert** (new) — RDF/SKOS/PROV/SHACL and the estate's laws;
   first consumers exist today (the validator lane, the SDK
   increments).
6. **Knowledge-curation expert: decided NOT YET** — recorded decision,
   not omission: the curator role (PDR-081) plus the Practice expert
   plus docs-adr-expert cover the surface until the ledger's
   disposition-review volume proves a dedicated reviewer at second
   consumer; revisit at ledger implementation.

## Acceptance criteria (each with a proof — required)

- Every template carries conformant front matter and lives in a domain
  folder; zero stale references — `repo-safe`: `validate-subagents`
  extended red-first, plus a grep-clean sweep.
- Wrappers regenerate cleanly from the canonical templates —
  `repo-safe`: the generator run is idempotent in CI.
- The two new experts exist, carry the reviewer read-path discipline
  (PDR-088), and have each been dispatched once on real work —
  `owner-held`: first-dispatch evidence named in the closing report.
- The architect template cites current vendor standards verified at
  overhaul time — `repo-safe`: citations dated in the template.

## Out of scope

New agent capabilities beyond the named experts; changes to the
Agent-dispatch machinery itself; the knowledge-curation expert
(explicitly deferred with its revisit condition above).

## Todos

Sliced at pickup by the implementer — slices 1–6 above are the
pickup-order map, each a single-story step or smaller.
