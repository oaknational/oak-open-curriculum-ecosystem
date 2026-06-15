# Reports

This directory holds **formal report artefacts**: stable audits, promoted
syntheses, and report-style outputs that should remain distinct from raw
research notes or investigation logs.

## Authority Split

- **Research** in `.agent/research/` records discoveries and source material.
- **Analysis** in `.agent/analysis/` owns investigations and evidence.
- **Reports** in this directory own promoted audits and formal synthesis
  documents once they are stable enough to stand alone.

## Current Structure

- [agentic-engineering/README.md](./agentic-engineering/README.md) — formal
  report lane for agentic-engineering audits and deep-dive syntheses
- [agentic-engineering/deep-dive-syntheses/governance-concepts-and-integration-report.md](./agentic-engineering/deep-dive-syntheses/governance-concepts-and-integration-report.md)
  — abstracted report on governance-plane concepts, mechanism gaps, and local
  integration routes
- [oak-ontology-mcp-search-integration-report-2026-04-19.md](./oak-ontology-mcp-search-integration-report-2026-04-19.md)
  — cross-boundary synthesis of the official Oak ontology's implications for
  MCP orientation, direct ontology resources, search projections, and service
  governance
- [output-schema-mcp-plan-audit-2026-06-02.md](./output-schema-mcp-plan-audit-2026-06-02.md)
  — 61-agent audit of the `output-schemas-for-mcp-tools` plan against live code:
  claim ledger, drift (stdio removed, 34→35 / 10→11 tools, broken Phase-3 gate),
  EEF relationship, and the corrected S0/W1/W2 decomposition
- [mandate-1-contamination-scan-2026-06-02.md](./mandate-1-contamination-scan-2026-06-02.md)
  — deep contamination scan of the four-commit session-output surface
  (`384b74de`–`52cad7ee`): method (token+concept inventory, 8 refutation-briefed
  reviewers, adversarial verification, known-answer probe), nine fixes, accepted
  refutations, and the routed British-spelling signal
- [school-data-search-synthesis-report-2026-06-03.md](./school-data-search-synthesis-report-2026-06-03.md)
  — self-contained synthesis of the three school-data-search research briefs +
  owner requirements: convergent foundation, divergence matrix (16 named owner
  decisions), collision ledger vs repo doctrine, OpenAPI inversion analysis
  (F-A/F-B/F-C), and the build-time verification ledger; evidence authority for
  the [`school-data-search` plan collection](../plans/school-data-search/README.md)
- [oak-repo-professionalism-engineering-quality-report-2026-06-03.md](./oak-repo-professionalism-engineering-quality-report-2026-06-03.md)
  — detailed live assessment of this repository's professionalism,
  engineering quality, effectiveness, operational friction, verification
  posture, and agentic-practice substrate; includes blunt ratings, evidence
  snapshot, risk modes, and ordered improvement recommendations
- [mcp-app-live-product-readiness-assessment-2026-06-15.md](./mcp-app-live-product-readiness-assessment-2026-06-15.md)
  — first-principles assessment of what it would take to make the Curriculum MCP
  app a live product: first-hand verification, right/wrong/missing, the
  launch-concern framework, the owner-decided keystones (audience, definition of
  "live", whole-estate scope), and a fresh-eyes verdict that the prior milestone
  ladder does not stand
- [graph-team-first-worktree-run-analysis-2026-06-10.md](./graph-team-first-worktree-run-analysis-2026-06-10.md)
  — Director's witness synthesis of the worktree-team shape's first live run:
  the three structurally-dissolved failure modes validated, the rotation
  protocol under live fire, the comms-watch stall incident end to end, two
  evidence-forced de-escalations, adjudication economics across five PRs, and
  Director-pattern observations for the seat's future holders
- [mcp-session-instructions-pedagogical-grounding-process-2026-06-10.md](./mcp-session-instructions-pedagogical-grounding-process-2026-06-10.md)
  — process record for adding session-wide pedagogical / curriculum-rigour
  grounding to the MCP server `instructions` field: where session instructions
  live today, the generator gap (tool-orientation only, no general-prose slot),
  the surface reliability ranking (`instructions` is advisory/client-optional),
  the future-work process, and the verdict — facts/constraints recorded now as
  ADR-058/060 addenda; the grounding decision itself stays out until ratified
- [oak-openapi-bug-report-2026-03-07.md](./oak-openapi-bug-report-2026-03-07.md)
  — existing standalone report
- [claude-code-compaction-thinking-block-bug-2026-05-28.md](./claude-code-compaction-thinking-block-bug-2026-05-28.md)
  — Claude Code 2.1.153 bug report: `/compact` fails deterministically on Opus
  extended-thinking blocks; evidence, root cause, workaround, paste-ready `/feedback` text
- [pr-142-eef-evidence-result-union-type-review-2026-06-09.md](./pr-142-eef-evidence-result-union-type-review-2026-06-09.md)
  — type review of the one Copilot comment on PR #142 (`EefEvidenceResult` root
  union): empirically-verified `EefStrand <: EefStrandHeadline` subtype collapse,
  why the nested-union fix is lossy, and the discriminant-vs-transport-shape
  recommendation for the deferred type review
- [graph-team-first-worktree-run-analysis-2026-06-10.md](./graph-team-first-worktree-run-analysis-2026-06-10.md)
  — witness synthesis of the graph implementation team's first per-worktree
  multi-agent run (2026-06-10)
- [graph-team-session-operations-and-experience-2026-06-10-11.md](./graph-team-session-operations-and-experience-2026-06-10-11.md)
  — team operations and experience report for the full contiguous 38-agent /
  seven-Director session (2026-06-10→11); substrate-under-load findings and
  tooling considerations

## Related Surfaces

- [analysis evidence lane](../analysis/README.md)
- [research index](../research/README.md)
- [agentic-engineering hub](../reference/agentic-engineering/README.md)
