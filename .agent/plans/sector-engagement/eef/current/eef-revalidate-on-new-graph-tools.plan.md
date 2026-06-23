---
name: "EEF Value-Path Re-validation on the New Graph Tools"
overview: "Re-validate the EEF value path against the graph-corpus-sdk replacements of the live Oak graph tools, so the substrate migration cannot silently break the Oak/EEF workflow seam the teacher value depends on. The D7 cover-lesson round trip was proven against the pre-migration tools; this plan re-ran that proof against the landed anchored replacements. EXECUTED 2026-06-11: the value path is intact on the new tools — verdict, evidence, and the two riding decisions (prerequisiteFor multiplicity; G4b on-EEF-path) are recorded in the execution report."
type: seed
status: completed
promoted: "2026-06-11 — owner-decided at Track-G completion (single upstream graph-tools-value-redesign: G1b/G2/G3/G4b landed; all landing signals raised: 334b8a99, 42e5cf0c, db953071, 08abb32a). Riding decisions folded at routing: prerequisiteFor multiplicity (3,452 emitted vs 2,605 unique) and the G4b on-EEF-path determination."
executed: "2026-06-11 — Blustery Buffeting Gale (9819b2), Director routing dccb1d09 (owner-approved). Evidence: ../../../../reports/eef-revalidation-report-2026-06-11.md. Verdict: EEF value path INTACT on the new anchored tools (three signal types, verbatim ground truth, honest insufficiency, provenance unfiltered). Decisions: prerequisiteFor multiplicity → dedup at emission (consumer impact measured at the MCP surface: 22-edge envelope carrying 4 distinct relationships, agent-facing summary misstating the graph; implementation cycle routed to the Director queue); get-keyword-graph NOT on the EEF value path (code + workflow level; no eef-revalidation signal raised; the graph plan's signal-eef-revalidation condition is determined false)."
thread: eef
related_plans:
  - "../current/eef-graph-tool-completion.plan.md"
  - "../../../connecting-oak-resources/knowledge-graph-integration/current/graph-tools-value-redesign.plan.md"
isProject: false
todos:
  - id: track-graph-tool-replacements
    content: "COMPLETE 2026-06-11 (pure recording exercise once the estate settled): the replacement set is get-prior-knowledge-graph (G1b, PR #161, signal 334b8a99), get-misconception-graph (G2, PR #163, signal 42e5cf0c), get-thread-progressions (G3, PR #164 + year-axis re-chain #165, signals db953071 + 08abb32a), and the additional get-keyword-graph (G4b, PR #173, merged c868bb52e — owner-signed-off name). No replacement the EEF value path depends on was dropped; nothing to escalate."
    status: completed
    depends_on: []
  - id: revalidate-eef-value-path
    content: "COMPLETE 2026-06-11: the D7-style cover-lesson round trip re-ran against the live landed estate (origin/main 5310d1e4e, corpus v1.3.0, server dev:observe:noauth, stateless JSON-RPC). Three signal types exercised (misconception via get-misconception-graph lesson anchor; prior knowledge via get-prior-knowledge-graph unit anchor; thread progression via get-thread-progressions year-ordered sequence); eef-tl-feedback corpus values reached the payload verbatim 10/10 (impact 6mo, Very Low, Extensive, headline, definition, eef_url, provenance with original_authors, caveats, answerType); evidence-for-move axis query returned context-subset members with provenance + caveats intact and strict finite-domain boundary validation; eef-tl-learning-styles preserved honest insufficiency (impact_months null, Insufficient, honest headline) verbatim; no teacher-replacing language at the tool layer. The Oak/EEF workflow seam closes on the new tools. Full evidence: ../../../../reports/eef-revalidation-report-2026-06-11.md."
    status: completed
    depends_on: [track-graph-tool-replacements]
---

# EEF Value-Path Re-validation on the New Graph Tools (executed)

## Why this plan exists

The teacher cover-lesson plan
([`../current/eef-graph-tool-completion.plan.md`](../current/eef-graph-tool-completion.plan.md))
proved the EEF value path (D7) against the Oak graph tools that were live before the
knowledge-graph-integration estate replaced them. When the signal-producing tools change, the
EEF value path must be re-validated against the replacements — otherwise the substrate
migration could silently break the seam the teacher value depends on.

## Outcome (2026-06-11)

The re-proof ran against the fully landed estate and **the EEF value path is intact**. The
verdict, the per-round evidence, and the two riding decisions are recorded in
[`eef-revalidation-report-2026-06-11.md`](../../../../reports/eef-revalidation-report-2026-06-11.md):

- **Re-proof**: three signal types (misconception, prior knowledge, thread progression) ×
  verbatim EEF ground truth × honest insufficiency × unfiltered provenance — all green.
- **prerequisiteFor multiplicity → dedup at emission** (the duplicates are byte-identical,
  reach the consumer envelope up to ×8, and make the envelope's own summary misstate the
  graph). The implementing cycle (vocab-gen dedup + drop-count surfacing + emission test) is
  routed to the Director queue; it was not implemented in the analysis lane.
- **get-keyword-graph is NOT on the EEF value path** (code and workflow level) — no
  eef-revalidation signal raised; the upstream plan's `signal-eef-revalidation` condition is
  determined false and closes on the recorded determination.

## Scope (as executed)

- **In scope:** the D7-style round-trip re-proof against the landed replacements; the two
  riding decisions named at routing.
- **Out of scope:** implementing the multiplicity dedup (routed onward); any change to the
  graph tools themselves; delivered-value measurement (owned by
  `../future/eef-outcome-evaluation-infrastructure.plan.md`).
