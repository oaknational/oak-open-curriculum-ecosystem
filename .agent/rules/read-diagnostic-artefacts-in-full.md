# Read Diagnostic Artefacts in Full

Operationalises [PDR-016 (Verification Before Propagation)](../practice-core/decision-records/PDR-016-verification-before-propagation.md)
and [PDR-020 (Check-Driven Development)](../practice-core/decision-records/PDR-020-check-driven-development.md).

When a tool returns paginated, truncated, filtered, or sampled diagnostic
output, read the complete artefact before forming a diagnostic hypothesis.

Required sequence:

1. Re-call the tool with an explicit high limit, full pagination, or the
   narrowest available complete export.
2. Filter the full artefact by structured signal fields such as `level`,
   `status`, `severity`, error code, or check name.
3. Only then classify the failure or absence of failure.

Speculative diagnosis is legitimate only when the full artefact is silent on
the question. A partial first page is navigation, not evidence.
