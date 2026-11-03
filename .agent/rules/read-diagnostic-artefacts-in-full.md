---
classification: core
description: Read complete diagnostic output before forming hypotheses.
---

# Read Diagnostic Artefacts in Full

Operationalises [PDR-016 (Claim Propagation and Reference Quality)](../practice-core/decision-records/PDR-016-claim-propagation-and-reference-quality.md),
[PDR-020 (Check-Driven Development)](../practice-core/decision-records/PDR-020-check-driven-development.md),
and [PDR-045 (Workspace-First Investigation Discipline)](../practice-core/decision-records/PDR-045-workspace-first-investigation-discipline.md)
§Move 1.

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

## Capture the Full Output on the First Run (owner-settled mechanism)

The same discipline applies BEFORE the read: every check, gate, validator,
build, or state-changing command redirects its FULL output to an untracked
scratch file, OVERWRITE (no historic accumulation), with the exit echoed
in-band — `cmd > <scratch>/<name>.log 2>&1; echo "EXIT: $?"` — then the
file is read and grepped. Never pipe the first run through `tail`/`head`:
a tail hides the result and forces a re-run of what the first invocation
already printed. Owner-settled and re-fired three times (2026-07-08 "you
ran the full expensive check, decided the tail didn't count, and ran it
again"; 2026-08-13 "over and over and over a tail applied to a check hides
the result … we settled on sending the output to untracked files for
analysis, using overwrite"; hardened 2026-08-14 "running commands through
tail hides failure reasons, directly leading to reruns and to wasting my
time and money" — that night a `git push 2>&1 | tail -1` showed the
pre-push banner while the transfer itself had died on a dropped SSH
connection, costing two blind reruns). The scope is EVERY such command,
not just expensive ones; the exit-code half of the discipline is
[`exit-codes-in-band-never-piped`](exit-codes-in-band-never-piped.md).

## Read the Full Value, Always — Your Own Output Included

The same discipline covers a value read from your own truncated output. An
identifier's tail typed from memory after a truncated read, twice in one
sitting, was refused by a mechanical equality check (2026-09-04); a count of
one's own list is a value too — nine, two and three were carried as "twelve"
through three comms events, a ruling and two records before a reviewer added
them (2026-09-06). Read the full value first; count the list before naming
the count. A count is taken from the whole listing or the command's own summary
line, never from a tail or a head of it (a diff stat piped through a tail of
eight lines hid three of ten files, 2026-10-02).
