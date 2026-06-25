---
fitness_line_target: 200
fitness_line_limit: 400
fitness_char_limit: 24000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard'
merge_class: index-narrative-tables
---

# data-sources-governance Next Session

## Thread Identity

Thread: `data-sources-governance`
Goal: author `docs/governance/DATA-SOURCES.md` — a register of what sources the
MCP + semantic-search apps surface, with adoption date, suitability-review
criteria, last-reviewed, and removal criteria. Owner-CONFIRMED. Routed by
Director Nightjar weaves Moonbeam (2026-06-24). `explain` POINTS to this
register (firewall: explain never bakes review dates — that is WS-B's concern
at ship time, not the register's).

## Participating Agent Identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| claude | claude-opus-4-8[1m] | 3f12b1 | Ferret weaves Nightfall | implementer (grounding only) | 2026-06-24 | 2026-06-25 |

## Landing Target For Next Session

Author `docs/governance/DATA-SOURCES.md` and ship it (own PR off `main`,
ship-independent — same pattern as pr-watch PR #222). NOT authored this session:
the owner redirected the grounding session to closeout before authoring. The
grounding below is complete — the next seat goes straight to authoring.

## Lane State — Grounding (first-hand, complete)

**The source-of-truth is [ADR-157](../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)**
(Multi-Source Open Education Knowledge Integration, status **Proposed**). It
enumerates the sources + licensing + attribution; do NOT re-derive. Licensing
detail is in [`LICENCE-DATA.md`](../../../LICENCE-DATA.md) and
[`ATTRIBUTION.md`](../../../ATTRIBUTION.md) (both exist).

**Sources the apps surface (the register's rows):**

1. **Oak Open Curriculum API** — lessons/units/threads/sequences/quizzes/
   transcripts. Licence OGL v3.0. The original + majority source. Prefixes:
   `oakapi-` (live endpoints), `bulk-` (bulk export). Adoption: the repo's first
   source (inception).
2. **Oak Curriculum Ontology** (github.com/oaknational/oak-curriculum-ontology)
   — NC-aligned knowledge taxonomy, W3C RDF/OWL/SKOS/SHACL. Data OGL v3.0, code
   MIT. Primary author Mark Hodierne. Prefix `onto-`. Adoption per ADR-157
   (2026-04-10, proposed).
3. **EEF Teaching & Learning Toolkit** — 30 evidence-synthesised approaches
   (impact months, cost 1-5, evidence 0-5 padlocks). Attribution REQUIRED (cite
   EEF; see LICENCE-DATA.md for the exact statement). Held in-repo as a versioned
   `as const` snapshot. Prefix `eef-`. Prototype: John Roberts. Adoption per
   ADR-157.
4. **Oak semantic search service** — surfaced by the semantic-search app over
   Oak curriculum content. Prefix `oaksearch-`.

Source-prefix convention (`onto-`/`bulk-`/`oakapi-`/`oaksearch-`/`eef-`) is
owner-ratified 2026-06-04 (ADR-157 §Namespace Convention) — provenance only;
the NC-vs-Oak authority axis is `_meta`, never a prefix.

**KEY FINDING — the register's reason to exist.** ADR-157 deliberately does NOT
define suitability-review / last-reviewed / removal criteria (this is precisely
the governance gap the register fills — ADR-157/ADR-152 lack review+removal). So:

- The **source inventory + adoption dates + licensing/attribution are factual**
  (ground them from ADR-157 / LICENCE-DATA.md / ATTRIBUTION.md).
- The **suitability-review criteria, last-reviewed cadence, and removal criteria
  are NEW governance policy** the register establishes. Feature/governance-
  shaping is the owner's ([[feedback_feature_shaping_is_owner_decision]]) — so
  propose sensible defaults grounded in the apps' purpose + Oak's three pillars,
  but FLAG them as owner-ratification-pending rather than asserting them as
  settled. Do not bake point-in-time review dates into `explain` (the firewall).

## Next Safe Step

A WARM worktree already exists: `/Users/jim/code/oak/oak-data-sources` (branch
`docs/data-sources-governance` off `main`, deps installed — no file authored
yet). The next seat reuses it (or creates fresh), authors
`docs/governance/DATA-SOURCES.md` from the grounding above, dispatches
docs-adr-expert (real-time), gates, PRs direct to main, routes the verdict to
the Director. Note (Whirlwind's F-90 finding): a fresh worktree needs a full
turbo `pnpm build` before gates, not a filtered build. Claim `750f523b` (Ferret)
is CLOSED — the next seat opens its own.
