---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 20000
fitness_line_length: 100
merge_class: append-only-narrative
fitness_content_role: reference
---

# Closed Claims Archive Curation - 2026-05-27

## Scope

Mode: `dedicated-knowledge-curation`.

Owner objective: process `.agent/state/collaboration/closed-claims.archive.json`
as a knowledge source, do not fabricate evidence summaries or bulk-migrate
legacy closure evidence, route durable knowledge to real homes, then delete the
processed archive content. Secondary objective: reduce `repo-continuity.md`
through consolidation, not line-count trimming.

Claim: `a4c7184a-8820-4599-aa01-edbd3e360eee`

## Corpus Inventory

Archive before curation:

| Measure | Value |
| --- | ---: |
| Claims | 1091 |
| Bytes | 1972103 |
| Lines | 49549 |
| Earliest `claimed_at` | 2026-04-25T16:23:27Z |
| Latest `claimed_at` | 2026-05-27T20:36:16Z |
| Earliest `archived_at` | 2026-04-25 |
| Latest `archived_at` | 2026-05-27 |

Closure kinds:

| Kind | Count |
| --- | ---: |
| explicit | 1067 |
| stale | 17 |
| owner_forced | 7 |

Primary thread distribution:

| Thread | Count |
| --- | ---: |
| `agentic-engineering-enhancements` | 758 |
| `connecting-oak-resources` | 107 |
| `observability-sentry-otel` | 47 |
| `eef` | 43 |
| `agent-tooling` | 19 |
| `main-critical-sonar-remediation` | 17 |

Evidence-shape observation: the archive still carried legacy closure records
from the historical claim lifecycle. The live issue was not missing knowledge;
it was obsolete archive retention creating a substrate-validation decision. The
curation route is therefore not schema migration and not fabricated summaries.

## Method

The archive was parsed end to end as JSON. The pass grouped all entries by
thread, closure kind, area kind, evidence shape, evidence kind, agent identity,
archive date, decision references, and repeated intent / closure-summary
families. High-frequency and anomalous clusters were sampled manually, including
the four owner-forced records with pre-enum `owner-message` evidence.

This was a corpus-level drain of a state archive, not a claim-by-claim attempt
to rewrite history. The item disposition is by evidence family because the
archive is homogeneous lifecycle state: each entry either duplicated an existing
durable home, recorded stale/owner-forced state without new durable knowledge,
or contributed to the single substrate-lifecycle lesson below.

## Durable Knowledge Routed

1. Collaboration state is a source, not storage.
   - Disposition: duplicate.
   - Home: `.agent/memory/active/distilled.md` already says state files should
     be processed as knowledge sources, routed to memory/docs/plans when useful,
     then deleted outside explicit preservation windows.
   - Evidence from this corpus: the 1091-entry archive had become a validation
     liability while its useful knowledge was already homed in thread records,
     plans, ADRs/PDRs, commits, curator reports, `pending-graduations.md`, and
     generated comms history.

2. Closed-claim lifecycle history is operational evidence, not permanent
   documentation.
   - Disposition: graduated into this curation report and the refreshed
     `repo-continuity.md` routing note.
   - Home: this report is the ledger; `repo-continuity.md` is the live resume
     pointer. The live archive file remains only as an empty schema-valid sink
     for future claim-close helpers.

3. Owner-forced stale-claim bulk closure is not itself a governance decision.
   - Disposition: stale-withdrawn as source material.
   - Evidence: 7 owner-forced closures, including 4 records whose only anomaly
     was `owner-message` evidence shape. Their owner direction was local
     lifecycle cleanup, not new doctrine beyond the already-homed collaboration
     state lifecycle lesson.

## Disposition Ledger

| Disposition | Count | Rationale |
| --- | ---: | --- |
| duplicate | 1067 | Explicit closures summarised work already represented in commits, plans, thread records, ADRs/PDRs, rules, curator reports, pending-graduations, or comms events. |
| stale-withdrawn | 17 | Stale closures recorded expired liveness/ownership state and carried no durable knowledge beyond the lifecycle fact that stale state is audit noise. |
| owner-gated/stale-withdrawn | 7 | Owner-forced closures recorded owner cleanup direction; no new owner decision remained live after current `pending-graduations.md` centralisation. |

Total dispositions: 1091 / 1091.

No archive entry was migrated in place. No closure summary was fabricated.

## Archive Outcome

The processed archive content was deleted by clearing
`.agent/state/collaboration/closed-claims.archive.json` to an empty,
schema-valid `claims: []` archive. The file path is retained because current
collaboration-state helpers still require a writable closed-claims sink when
future agents close active claims.

Archive after curation:

| Measure | Value |
| --- | ---: |
| Claims | 0 |
| Schema version | 1.3.0 |

## Repo-Continuity Consolidation

`repo-continuity.md` was consolidated as an operational index:

- stale current-state prose was replaced with live pointers to the EEF thread,
  agentic-engineering thread, this report, and `pending-graduations.md`;
- the deep-consolidation tail was reduced to current routing and archive
  pointers;
- detailed history remains in thread records, plans, prior continuity archives,
  and curator reports rather than duplicated in the repo-wide entry point.

## Closeout Evidence

Targeted evidence to verify this pass:

- `closed-claims.archive.json` parses and contains 0 claims.
- `repo-continuity.md` is below its line target.
- This report records the corpus inventory and dispositions.
- `git diff --check` reports no whitespace errors.
- Targeted markdownlint passes on touched markdown.
