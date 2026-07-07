---
fitness_line_target: 200
fitness_line_limit: 400
fitness_char_limit: 24000
fitness_line_length: 100
fitness_content_role: reference
overflow_disposition: 'leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard'
merge_class: index-narrative-tables
---

# itf-knowledge-graph-spike Next Session

## Thread Identity

Thread: `itf-knowledge-graph-spike`
Goal: the Inclusive Teaching Framework (Ambition Institute, March 2026) processed into a
knowledge graph in the repo's graph-corpus design grammar, landed as a candidate data source
(spike now; typed workspace module if it graduates). Owner-directed 2026-07-07: everything —
code, data, evidence, observations, insights — preserved in the PR, because the repo learns.

## Participating Agent Identities

| platform | model | session_id_prefix | agent_name | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| claude-code | claude-fable-5 | 88e2ae | Fern spins Taproot | implementer (solo, n=1) | 2026-07-07 | 2026-07-07 |

(One comms event, `299c286e`, was mis-titled "Zenith tracks Vacuum" — an env-seed slip;
corrected in closeout event `95a479c9`. All registry rows are Fern spins Taproot.)

## Landing Target For Next Session

**The integration pass (owner: run it in a Claude Code CLI instance).** Draft
[PR #319](https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/319) — branch
`claude/nifty-ramanujan-7b1623`, spike at `docs/spikes/inclusive-teaching-framework-knowledge-graph/`
— is complete and deliberately **unmerged**. The next seat executes the integration checklist
in the spike's `NOTES.md` (its §Integration checklist is the authoritative list): promote the
three `.mjs` preservation scripts to a typed, tested TypeScript workspace module (deleting the
copies in the same change), decide the canonical data home, consider a concept-anchored
bounded view (ADR-173/ADR-195), and carry `source.attribution`/`source.licenceNote` into any
serving surface.

## Lane State — Grounded Facts (first-hand, complete)

- Landed commits: `6edcb025a` (spike data + writeup), `bdf8b514f` (full preservation set +
  licensing ruling). Everything reproduces from the spike directory:
  `node build-itf-graph.mjs && node render-itf-svg.mjs` (only `generatedAt` varies).
- **Owner rulings recorded in the spike (README + NOTES)**: all official repo code must be
  TypeScript (the `.mjs` files are a sanctioned spike-only preservation exception); licensing
  is academic reuse with full acknowledgement of the authors (Gilbride & Jackson) and Ambition
  Institute — baked into `source.attribution`/`source.licenceNote` in the data itself.
- Graph: 184 nodes / 282 edges; 9 node kinds; 15 edge types; ajv-validated (draft 2020-12)
  against the committed `schema.json` (exact invocations in NOTES §Validation).
- Completeness bound and modelling decisions (text-grounded only; area-level citations; no
  people nodes; `externalSource` link-out nodes with `resolution` provenance) are all in the
  spike's NOTES.md — read it before touching the data; it carries the rejected alternatives.
- The source PDF is NOT in the repo (deliberate); the canonical link is in the spike README.
  The extraction method (pdftotext + visual read of the five logo-only divider pages) is
  documented; re-extraction needs the PDF from the owner.

## Blockers / Low-Confidence Areas

- None technical. The licensing posture is owner-ruled for now (academic reuse); formalising
  it further is owned by the PR conversation, not this record.

## Next Safe Step

Open PR #319, read the spike README + NOTES end to end (they are the handoff), then run the
NOTES §Integration checklist as the plan for a fresh branch or this one, at the owner's
direction. Do not merge before the TypeScript promotion decision.
