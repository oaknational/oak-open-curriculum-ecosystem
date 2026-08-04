---
id: submission-review-repo-fixes
node_type: delivery
name: "Submission-review repo fixes: served-description hygiene, generated tool table, plugin licence"
overview: "Land the repo-side cures from the 2026-07-30 submission-copy review: strip the embedded model directive from the download-asset description with a regression guard, generate the reviewer-facing tool table from the served surface so it cannot drift again, declare the plugin's code licence in its manifest, record the tool-result-size posture, and verify the already-landed inventory truing."
status: ratified
ratified_by: Jim Cresswell
ratified_date: 2026-07-30
ratified_where: "Owner decision card 2026-07-30 ~16:57Z (session Inferno weaves Kindling 3d8c87), captured verbatim on MCP-440 comment 106dc538 and MCP-441 comment 71045759"
serves: first-major-release
impact_areas:
  - served-surface
  - packaging-and-distribution
tickets:
  - MCP-437
  - MCP-438
  - MCP-439
  - MCP-440
  - MCP-441
  - MCP-442
depends_on: []
owner_gates: []
last_updated: 2026-07-31
---

# Submission-review repo fixes

**Status**: ratified (owner card, 2026-07-30 — see frontmatter). Execution ran on the owner's
direct word ("please move on to the fixes", 2026-07-30); slices 1 and 5 verified complete and
slice 3 in review at the stamp moment. Parent ticket: MCP-437.

## Goal

The Anthropic directory submission can be completed honestly: every attestation the form asks for
is true of the served surface, and the reviewer-facing artefacts (tool table, manifest) match what
the server and plugin actually ship — now and at every future re-capture.

## Mechanism

Three of the five findings are drift between hand-maintained artefacts and the served truth; the
cures therefore prefer generators and guards over spot edits (fix the generator, not the instance).
The remaining two are a one-line manifest gap and a posture decision.

## Slices (each a single-story PR within the PDR-132 round budget)

1. **MCP-438 — served-description hygiene** (class: code). COMPLETE: merged on PR 656 with the
   regression test in the MCP-300 policy walk (sequencing imperatives AND presentation
   directives banned) and the content-audit C163 retirement. The "kalan typo" premise was
   falsified during pre-execution review — `…-kalan` is the live support-site slug — so no
   spelling sweep exists; the URL left the served surface with the directive block. Deployed
   surface verified cured (evidence on the ticket).
2. **MCP-440 — plugin licence** (class: config). COMPLETE: merged on PR 658 (sha-pinned
   `2d9bf9012` → merge commit `848e61e23`). Owner-decided 2026-07-30 (card, verbatim on the
   ticket): the licensing statement mirrors the root README's three-part model — MIT for code,
   OGL v3.0 for Oak curriculum content, the Oak brand-usage guidance for brand assets —
   pointer-style, in BOTH `plugin.json` and the marketplace entry (the pre-execution review
   proved `license` is a recognised marketplace-entry field that was also absent). Both
   manifests pass `claude plugin validate --strict`; field contract verified free-form against
   the current plugins reference. Evidence and residues on the ticket.
3. **MCP-439 — generated tool table** (class: code; ~3 files). COMPLETE: merged on PR 657
   (merge commit `88116fb1e`). The renderer + generator emit the reviewer-facing table from the
   canonical registration walk; the artefact staleness test pins the committed table to the
   served surface, and the committed `served-tool-table.md` carries all 40 live tools.
4. **MCP-441 — result-size posture** (class: decision; no code in this plan). Recorded verdict:
   **disclose, don't bound**. Rationale: bounding changes served behaviour for every existing
   consumer (an assistant that receives the full keyword set today would start receiving a page)
   — a capability subtraction that must not ride a submission-week hygiene lane; disclosure makes
   the form honest immediately (the Connection requirements field exists for exactly these
   notes, and the host enforces its own per-surface limits regardless). Bound-at-source remains
   available as its own deliberate lane if the owner wants the behaviour; the graph tools'
   bounded-with-honest-totals pattern is the template. Owner-confirmed 2026-07-30 (card;
   the gate above is cleared).
   *Premise truing (2026-08-03, upstream update lane):* the rationale's "full keyword set
   today" example was overtaken by upstream — spec 0.7.x now server-paginates `/keywords`
   (enforced default 20), so the paging arrived from upstream, not from us. The VERDICT
   stands on its own grounds (we still never subtract capability in a hygiene lane; the
   MCP-462 cure was disclosure-shaped: served paging guidance, not bounding); the example
   is historical. Recorded by the MCP-462 alignment (PR #735).
5. **MCP-442 — inventory truing** (class: record; no new work). COMPLETE: landed as
   `SHA:34f24834d` before this plan was authored, verified against the ticket's definition of
   done, and closed 2026-07-30 after roll-up PR 659 (merge `81fd98053`) put the truing commit
   into `origin/main` ancestry (verified first-hand at close).

## Acceptance criteria

1. A live `tools/list` read of the deployed surface shows a download-asset description with no
   model-behaviour instructions — proof: repo-safe (the regression test) plus a recorded live
   read on MCP-438.
2. `claude plugin validate` passes with the licence field present — proof: repo-safe.
3. The table generator's output matches the served surface exactly (count, names, titles,
   descriptions, annotations) — proof: repo-safe (the test).
4. MCP-441 carries the recorded decision and rationale; the disclosure text is owner-approved —
   proof: owner-held.
5. MCP-442 closed with verification evidence — proof: repo-safe (the landed commit + DoD check).

## Out of scope

- Any change to the submission document itself (MCP-444 carries those suggestions; humans own
  the fields).
- Bounding tool results at source (only enters scope if the owner overturns the slice-4 verdict).
- The attribution-string convergence and the instructions-field rationale note (conserved on
  MCP-437 as noted-not-ticketed).
- Any change to MCP resources or the widget (the served surface is declared, not altered).

*Authored by Inferno weaves Kindling (3d8c87, agent) at owner word, 2026-07-30.*
