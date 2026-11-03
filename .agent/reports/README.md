# Reports

This directory holds **formal report artefacts**: stable audits, promoted
syntheses, and report-style outputs that should remain distinct from raw
research notes or investigation logs.

## Authority Split

- **Research** in `.agent/research/` records discoveries and source material.
- **Analysis** in `.agent/analysis/` owns investigations and evidence.
- **Reports** in this directory own promoted audits and formal synthesis
  documents once they are stable enough to stand alone.

Research and pre-decision outputs **name decisions and surface
considerations**; they never make, recommend, or steer a call that belongs
to a later owner-ratified deliverable. The test is line-level, not
section-level: for each line, does it pick an answer to a call reserved
for that later deliverable, or lay out the factors? Restating a plan-settled constraint is fine when attributed to
the plan; asserting a new preference is the over-reach — even when the
brief's own section titles ask for "recommendations".

## Review Contract

A formal report intended for independent review must state its review contract
near the top, before the synthesis a reviewer will assess. The compact contract
names:

- the document's purpose and intended impact;
- the substantive questions or acceptance criteria the review should test;
- the evidence standard and authority boundary;
- material non-goals and actions the report does not authorise; and
- what constitutes a successful review, including how missing evidence or a
  contract mismatch should be reported.

This makes the report's intent inspectable rather than asking a reviewer to
infer it from the prose. It does not pre-decide the review verdict or replace
the report's evidence. A substantive review grounds its findings against the
declared contract; stylistic preference alone is not a contract failure.
A census report's reproduction block carries what a re-run needs: the cohort list (each
directory enumerated by hand), the window and how membership is decided, the depth limit,
the prefix-to-canonical mapping, and the aggregation that turns rows into the table's
numbers, with every path written so the shell expands it. The 2026-09-03 skill-usage census
learned each of these in review — a tilde inside quotes did not expand, and a pattern
matching one nesting depth missed two deeper directories and changed twelve rows.

## Current Structure

- [public-service-ai-tuition/pr-66-review-2026-09-06.md](./public-service-ai-tuition/pr-66-review-2026-09-06.md)
  — dated review of PR 66: faithful transfer, source authority, integration,
  evidence qualifications and seven bounded findings; the PR's landing is the owner's
- [public-service-ai-tuition/pr-66-independent-review-2026-09-06.md](./public-service-ai-tuition/pr-66-independent-review-2026-09-06.md)
  — independent review of PR 66 (the ADR-226 tuition import) from a second model
  lineage: external-link census, conformance of tracked executable content,
  scanner controls, authority sourcing, a mapping of the published review's
  findings, and the owner's decisions with factors; every count names its command
- [public-service-ai-tuition/oak-curriculum-infrastructure-delta-2026-09-08.md](./public-service-ai-tuition/oak-curriculum-infrastructure-delta-2026-09-08.md)
  — report of the state on 2026-09-08: upstream OCE `1.178.6`, this line's
  `1.178.5` boundary at that date and Curriculum API `0.11.1`, with semantic, reproducibility,
  deployment and impact limits kept explicit
- [user-value/user-value-specification-pr-relationships-2026-09-26.md](./user-value/user-value-specification-pr-relationships-2026-09-26.md)
  — dated analysis, written on the non-executing host that drafted the `user-value` skill, of
  how that skill, the specification-framework proposal and the pull request's changed
  elements relate: ownership, scale and meaning bridges, evidence limits and the completion
  the successor took on; its CI and blob citations are of the head it reviewed, superseded
  at landing; revision 2 records the later owner ratification, expanded acceptance criteria
  and reconciled projection/intake state
- [practice-exchange/goal-one-residue-census-2026-09-28.md](./practice-exchange/goal-one-residue-census-2026-09-28.md)
  — the first act of goal one's close charter: one line per owed J row, the batch-six triage's
  BRING items minus the landings, read first-hand at both estates on 2026-09-28; the residue
  count is dated in its Recounts section.

- `oak-ecosystem-progress-*` — the progress-report family: point-in-time
  syntheses of where the whole effort stands, for readers who ask "where is it
  now?". Resolve the newest by the date in the filename — and where several
  share a date, the root `README.md`'s progress pointer names the canonical
  one; never assume a remembered filename is the latest
- [spotify-portal-ai-plugins-exploration-2026-09-12.md](./spotify-portal-ai-plugins-exploration-2026-09-12.md)
  — first-hand exploration of Spotify's `portal-ai-plugins` repository at `3c24ca3`: what it
  is (a portal plugin of six Markdown skills plus three host manifests over one external CLI,
  and a second plugin, shunt, that ships hooks, scripts, skills and evals; authored in a
  six-day window), how it is built (one canonical skills directory behind thin per-host
  manifests; a second plugin, shunt, layering PreToolUse hooks over named-argument scripts
  over judgement-only skills), and what value it enables for each of four user groups by what
  mechanism. Separates the subject's own assertions from what was checked: the published
  token-savings table is arithmetically sound but **not reproducible from the repository** —
  its scenarios name 4,014 and 7,408 lines where the committed fixtures hold 602 and 90 — and
  a coverage gap in the Bash hook's allow conditions is derived from source. Nothing in the
  subject was executed; the questions it raises for this estate are named, not answered
- [upstream-and-bulk-alignment-concept-exploration-2026-07-26.md](./upstream-and-bulk-alignment-concept-exploration-2026-07-26.md)
  — fleet-verified concept exploration for MCP-152/MCP-153: the spec delta
  reclassified as shape-novelty (first POST/requestBody/map response the
  generator cannot model; five limit-parameter changes the fingerprint recipe
  missed), the bulk truth decomposed (templates structurally exact, committed
  schema.json never true of its own payload, vocabulary its one correct axis),
  the anti-guard class named, and sixteen warranted, falsifiable proposals
  with the owner-call set
- [mcp-63-succession-notification-and-focused-delivery-2026-07-26.md](./mcp-63-succession-notification-and-focused-delivery-2026-07-26.md)
  — permanent dated record of the MCP-63 custody transfer, Codex notification
  failure and monitoring correction, focused-PR reshaping, and the bounded
  technical evidence for the first three delivery slices
- [architectural-fitness-functions-concept-exploration-2026-07-15.md](./architectural-fitness-functions-concept-exploration-2026-07-15.md)
  — decision-ready exploration of replacing the unwired per-file
  `max-files-per-dir` rule with deterministic, non-blocking, repository-level
  architectural fitness signals whose counts are not limits
- [mutation-testing-incremental-rollout-concept-exploration-2026-07-15.md](./mutation-testing-incremental-rollout-concept-exploration-2026-07-15.md)
  — first-hand re-baseline and staged canary design for making Stryker
  operational against unit and integration tests without treating mutation
  score as an unexamined target or gate
- [oak-integrations/README.md](./oak-integrations/README.md) — report family
  for source-authority-preserving local integration of Oak OpenAPI, Oak
  Curriculum Ontology, Oak Database-Tools, and the adjacent Castr compiler
  through optional pinned submodules and role-specific workspace contracts
- [oak-reusable-curriculum-architecture/README.md](./oak-reusable-curriculum-architecture/README.md)
  — report family for the source-first, authority-aware reusable curriculum
  architecture exploration: strategic synthesis plus separate issue registers
  for this repository and the current Oak data estate, including the canonical
  source-portable Elasticsearch Serverless curriculum-exploration direction
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
  the [`school-data-search` plan collection](../plans-backlog-2026-07/school-data-search/README.md)
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
- [agent-experience-cause-class-analysis-2026-06-21.md](./agent-experience-cause-class-analysis-2026-06-21.md)
  — cause-class synthesis of the 82-entry agent-tooling friction register: the
  eight structural classes the frictions collapse into, the three AX layers, the
  leverage ranking (and the finding that the top cure is already homed), the
  drain-gap diagnosis, and next steps; evidence companion to
  [PDR-111](../practice-core/decision-records/PDR-111-agent-experience-is-first-class.md)
  and [`agent-experience-improvement.plan.md`](../plans-backlog-2026-07/agent-tooling/current/agent-experience-improvement.plan.md)

- [practice-ide-integration-plane-feasibility-2026-06-25.md](./practice-ide-integration-plane-feasibility-2026-06-25.md)
  — feasibility and safe-design report for a Practice-owned, local-install-only
  IDE plugin (`practice-ide-plugin`) that gives the Practice a governed way to
  cause effects in any VS Code-family IDE, driven by new `agent-tools practice-ide`
  commands. First committed capability: spawn a visible interactive terminal and
  run one strictly-vetted, template-built command. Core security argument: blast
  radius bounded by construction to a closed, adversarially-vetted template
  registry (templates are the delivery mechanism, not the safety property); no
  URI surface (workspace file-drop transport), no command strings, no shell
  injection (argv assembly / no-shell launch); three-layer defence-in-depth;
  per-template injection-corpus admission gate; PDR-035/ADR-165 Practice
  positioning; vision-vs-committed-scope split; reasoning/metacognition trace.
  Inverts the vendored `vscode-commands-executor` anti-pattern (generic,
  unauthenticated, globally-reachable command execution)

## Related Surfaces

- [analysis evidence lane](../analysis/README.md)
- [research index](../research/README.md)
- [agentic-engineering hub](../research/agentic-engineering/README.md)
