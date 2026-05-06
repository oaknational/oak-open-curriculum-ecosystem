---
name: "2026-05-06 Principles Graduation Pass — Review Snags"
status: open
created: 2026-05-06
authored_by: "Hidden Slipping Moth (claude-code, 4be7b5)"
thread: agentic-engineering-enhancements
overview: >
  Snagging list from the parallel docs-adr-reviewer + code-reviewer
  dispatch over the 2026-05-06 napkin/distilled graduation pass and
  strategic-plan landing. Captures findings deferred to the next
  session because they require owner judgement, scope decisions, or
  cross-rule remediation that would expand this session beyond the
  brief.
---

# 2026-05-06 Principles Graduation Pass — Review Snags

## Source

Both reviewers were dispatched in parallel over commits
`3a2f713f`, `71cf75c9`, `6e17d368`, `57456ce9`, `8d33ea98` (plus
housekeeping `e700b9b8`). Reviewer reports landed during the
session. Two findings were addressed inline; the remainder are
captured here.

## Addressed Inline (this session)

| Finding | Reviewer | Fix |
|---|---|---|
| P0: Broken `PDR-014-knowledge-roles.md` link in strategic plan | docs-adr-reviewer | Replaced with the actual filename `PDR-014-consolidation-and-knowledge-flow-discipline.md` |
| P1: `no-moving-targets-in-permanent-docs.md` `## Source Landing` footer cited a plan + workstream identifier, directly violating the rule's own newly-added Citation Directionality clause | code-reviewer + docs-adr-reviewer | Removed the `## Source Landing` section; provenance lives in git history |

Both fixes land in the same commit as this snagging document.

## Narrow Extraction Note

2026-05-06 compiler-time types extraction moved TypeScript operational
detail from `principles.md` to `docs/governance/typescript-practice.md`.
That lane did not resolve any S-numbered or P-numbered snags here; the
deferred specialist-reviewer recommendations remain out of scope.

## Open Snags — P1 (next-session candidates)

### S1 — Rule scope vs file name mismatch in `no-moving-targets-in-permanent-docs.md`

**Source**: docs-adr-reviewer P1 #1.

The new "Citation Directionality" section subsumes plan-name citation
under the moving-targets rule, but the rule's title and original
framing treat "moving targets" as values that *drift over time*
(SHAs, version numbers, counts). Permanent → ephemeral citation is a
*direction-of-reference* failure: a frozen plan name is forbidden
because the citation direction is wrong, not because the value drifts.

The section's framing acknowledges this is a "broader directionality
principle" subsuming the SHA-specific case. Discoverability is
reduced — readers searching for guidance on plan-name citation will
not search for "moving targets".

**Resolution options**:

1. Rename / retitle the rule to "Permanent-Doc Citation Hygiene" with
   moving-targets and directionality as named sub-rules.
2. Split into two rules: `no-moving-targets-in-permanent-docs` +
   `no-permanent-to-ephemeral-citation`.
3. Leave as-is and rely on the subsumption framing.

**Owner decision required.** The principles-entrypoint-content-homing
plan's Phase 0 contract is the natural place to settle this.

### S2 — Plan-to-plan citation explicit-permission note

**Source**: docs-adr-reviewer P1 #2.

`principles-entrypoint-content-homing.plan.md` cites peer plans heavily.
A `future/` plan is itself ephemeral, and the new Citation
Directionality clause forbids permanent → ephemeral citation. The plan
is in fact compliant (the rule's scope is permanent-docs only; plan-
to-plan citation is in-scope-permitted), but a future reader could
misread the constraint by analogy.

**Action**: Add a one-line clarification to the strategic plan that
plan-to-plan citation is in-scope-permitted; only permanent → ephemeral
is forbidden. Pre-empts the misreading.

### S3 — Frontmatter `session_id_prefix` is a moving-target token

**Source**: docs-adr-reviewer P1 #3.

The strategic plan's frontmatter includes
`authored_by: "Hidden Slipping Moth (claude-code, claude-opus-4-7-1m, 4be7b5)"`.
The `4be7b5` prefix is a hex-shaped ephemeral session identifier — the
exact pattern the plan's own (rule-extension) Citation Directionality
section warns against being baked into permanent-shaped surfaces.

**Resolution options**:

1. Drop the prefix from the plan frontmatter; rely on persona name +
   date.
2. Establish a frontmatter convention exempting structured `authored_by`
   fields (similar to the `provenance.yml` exemption).

Either resolution should be made explicit in the plan's Phase 0
contract and ideally codified in the no-moving-targets rule's exclusions
list.

### S4 — Archive header editorial commentary

**Source**: docs-adr-reviewer P1 #4.

`napkin-2026-05-06-evening.md:9-13` opens with editorial framing about
the archiver's verification act ("Hidden Slipping Moth (`4be7b5`)
archived this entry on 2026-05-06 evening once the routed substance
was independently verified at its destinations"). The convention seen
in past evening archives is a much lighter header.

**Action**: Reduce the archive header to one factual sentence; move
the destinations index under a `## Destinations index` heading;
preserve the verbatim Riverine entry from line 32 unchanged. (Note:
S5 below also touches this file.)

### S5 — Worked-instance grounding lost from `no-speed-pressure` graduation

**Source**: docs-adr-reviewer P1 #5.

The original distilled "Severity is not urgency" entry carried a
worked instance: at session open a fitness signal was framed as a
driver of landing-target choice ("CRITICAL prose-line on napkin → must
address now"). The graduated rule preserves the owner quote but drops
the worked instance. The rule's "Tells" section does not include a
severity-shaped tell to compensate.

**Action**: Add one bullet to the rule's Tells section, e.g.
*"'CRITICAL fitness signal → must remediate this session'"* — restores
the empirical anchor without re-inflating the rule body.

### S6 — Strategic plan does not link the active remediation plan

**Source**: docs-adr-reviewer P1 #7.

`principles-entrypoint-content-homing.plan.md` does not cite
`moving-targets-in-permanent-docs-remediation.plan.md` (in `current/`),
even though they share doctrinal substrate.

**Action**: Add to "Related efforts" block.

## Open Snags — P2

### P-1 — Line-pinned destinations in archive use moving-target line numbers

**Source**: docs-adr-reviewer P2 #1.

`napkin-2026-05-06-evening.md:14-28` cites `pending-graduations.md
(line 1932 entry)` etc. Line numbers are themselves moving targets
within actively-edited files. Cite by anchor (entry headline) instead.

### P-2 — Owner-quote dating in permanent rule bodies

**Source**: code-reviewer P2.

Both rules carry `Owner sharpening 2026-05-05:` prefixes before
verbatim quotes. The date-stamp is a transient instance against the
rule's own spirit ("name structural concepts, not transient instances").
The pattern appears consistent across the rule corpus and may be a
deliberate house convention.

**Owner decision required**: accept the convention or strip the date
across all rule bodies. The principles-entrypoint plan's Phase 0
contract is the natural place to settle this.

### P-3 — Cross-plan dependency coupling

**Source**: code-reviewer P2.

`principles-entrypoint-content-homing.plan.md` declares three
`Related efforts` cross-plan references. If any peer plan (especially
`operating-model-mechanism-taxonomy.plan.md`) is promoted to `current/`
and begins producing mechanism-taxonomy work, Phase 1 (Mechanism
Catalogue) will either duplicate or block on it. Sequence at Phase 0
to avoid coupling debt.

## Specialist-Reviewer Recommendations (deferred until Phase 0 alignment)

`code-reviewer` recommended three further specialist dispatches before
the strategic plan is promoted to `current/`. These are NOT needed
this session because the plan is at `future/` status and Phase 0 owner
alignment is the gate.

| Specialist | Depth | Focus |
|---|---|---|
| `architecture-reviewer-fred` | Focused | PDR alignment of the three-level model against PDR-014 (knowledge roles), PDR-029 (perturbation-mechanism bundle), PDR-044 (memetic immune system), PDR-046 (layered knowledge processing) |
| `architecture-reviewer-wilma` | Focused | Failure modes of partial extraction from a session-open-loaded directive |
| `assumptions-reviewer` | Focused | Proportionality of the plan scope; validity of the 11 surfaced unstated aspects |

`architecture-reviewer-betty` deferred to pre-Phase-1 (cohesion/coupling
analysis is premature before contract alignment).

`architecture-reviewer-barney` not needed for the strategic-brief
status (no boundaries drawn yet).

## Verification

Reviewer-coverage status for the change set:

- docs-adr-reviewer — completed.
- code-reviewer — completed.
- specialist reviewers above — deferred behind plan promotion gate.

Both reviewer reports are referenced in this session's commit-window
claim closures.

The two inline-fixed findings (P0 broken link, P1 self-violation)
land in commit `<filled at commit time>` together with this snagging
document.
