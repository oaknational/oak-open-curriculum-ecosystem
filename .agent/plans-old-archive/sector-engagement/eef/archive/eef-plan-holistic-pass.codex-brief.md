# Next-session brief (Codex) — EEF live plan holistic pass

**For**: a Codex session. Self-contained; read this in full before starting.
**Authored**: 2026-05-31 by Estuarine Rolling Harbour (Codex GPT-5), at owner
session close. **Scope owner**: the `eef` thread.

## Why This Session Exists

The current session answered the remaining owner-facing D1/D3 questions and
tightened D3 from exploratory "define/decide" wording into two explicit products:
a written MCP contract artefact and a separate SDK/app verification record. The
live plan has received many precise edits across D1, D3, D6, D7, frontmatter
todos, and continuity notes. The owner wants the next session to perform a
holistic pass of the whole live plan to make sure it remains coherent, cohesive,
complete, accurate, and up to date.

The live plan also now sits alongside the predecision graph research report at
`.agent/plans/sector-engagement/eef/current/eef-graph-predecision-research.report.md`.
That report is useful grounding, but it is explicitly predecision research: it
should inform D3/D4/D5 only where the plan has ratified or adopted its findings.
The holistic pass should review the relationship between the plan and the report
so they support rather than contradict each other.

## Task

Review and, where clearly safe, repair
`.agent/plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md` as
a whole, and review
`.agent/plans/sector-engagement/eef/current/eef-graph-predecision-research.report.md`
for its relationship to the plan. Treat this as a plan/report-quality pass, not
implementation.

Check that the plan:

1. Preserves the ratified teacher-value contract: EEF adds evidence-calibrated
   lesson adaptation context to Oak retrieval, preserves uncertainty/caveats, and
   keeps the teacher as the decision-maker.
2. Preserves the settled D3 MCP surface: one deterministic EEF query/fetch tool,
   one interpretation resource/template for applying EEF evidence, and one
   user-facing prompt for starting the teacher workflow.
3. Keeps the deterministic boundary clear: invoking agents may interpret
   free-form teacher language, but the EEF MCP tool receives only finite fixed
   inputs derived from Oak/EEF data.
4. Keeps D3 split into the two remaining products: written MCP contract artefact
   and SDK/app verification record, with `mcp-expert` sign-off still pending.
5. Keeps D4/D5/D6/D7 aligned to the current D3 surface and avoids stale
   `tools/resources` language where `tool/resource/prompt` is meant.
6. Keeps frontmatter todos, ratified decisions, deliverable bodies, acceptance
   criteria, risk/readiness sections, and the Fully Specified End State mutually
   consistent.
7. Distinguishes current truth from history, expected migration residue, and
   superseded old-list implementation details.

Also check that the report:

1. Is still clearly labelled and framed as predecision research, not authority
   over the ratified plan.
2. Does not contradict the plan's settled D1/D3 decisions, especially the
   deterministic MCP input boundary and the tool/resource-template/prompt split.
3. Still accurately describes current code where it claims current-code evidence,
   or is amended/marked if later edits have made a statement stale.
4. Is linked from or referenced by the plan only in the right role: evidence and
   grounding for D3/D4/D5, not a substitute for the written MCP contract,
   SDK/app verification record, or owner-ratified graph capability contract.
5. Has any unresolved reviewer findings either fixed, explicitly deferred, or
   routed to the holistic pass findings.

Reflect explicitly on the plan-report relationship:

- What does the plan own that the report must not own?
- What does the report add that the plan should preserve as evidence?
- Are there report findings the plan has adopted and now needs to cite/encode
  more clearly?
- Are there report claims that should be downgraded, amended, or superseded
  because owner decisions or plan repairs have moved on?

## Read First

- `eef-graph-tool-completion.plan.md`
- `eef-graph-predecision-research.report.md`
- `eef-graph-predecision-report-fix.codex-brief.md`
- `eef-d0-decontamination-ledger.md`
- `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/README.md`
- `.agent/memory/operational/threads/eef.next-session.md`

## Boundaries

- Do not implement D2-D7 code.
- Do not commit unless the owner asks.
- Do not treat old list-shaped EEF code as a behaviour target.
- Do not promote the predecision report into plan authority. The plan owns the
  current contract; the report supplies evidence, cautions, and decision-space
  grounding.
- Do not reopen the owner decisions from this session unless the plan contains a
  direct contradiction that needs owner judgement.

## Output

Produce a concise findings/changes summary. If edits are made, run targeted
markdown/format checks for the touched docs. A full `pnpm check` is not required
for this brief unless the owner asks or code is touched.
