---
pdr_kind: governance
---

# PDR-079: PDR-vs-ADR Portability Distinction

**Status**: Accepted
**Date**: 2026-05-24
**Adopted**: 2026-05-24
**Related**:
[PDR-066](PDR-066-comms-events-as-failure-mode-channel.md)
(comms-events as failure-mode channel — composes with this PDR's
distinction by naming the PDR↔ADR pattern for one specific
substrate: PDR-066 is the portable doctrine, the corresponding
ADR records the repo-bound substrate that operationalises it);
[`practice-index.md`](../../practice-index.md)
(host adoption and implementation bridge — the index is itself
the substrate where portable PDRs gain their repo-bound phenotype
references, so cross-references between a PDR and its phenotype
ADR live in the index rather than in the PDR body).

## Context

The practice corpus carries two structurally distinct kinds of
decision record: Practice Decision Records (PDRs), which encode
portable doctrine about how multi-agent practice works, and
Architectural Decision Records (ADRs), which encode this specific
repository's structural choices.

A recurring failure mode in authoring: substance that belongs in an
ADR drifts into a PDR (or vice versa) because the author cannot
cleanly answer the question *"which kind of record is this?"*.
Symptoms include PDRs that name specific commit identifiers as
evidence, PDR §Related sections linking to repo-internal paths that
will not exist in any other repository adopting the practice, and
ADRs that under-claim their repo-specific authority by softening
into portable-vocabulary phrasing that loses operational bite.

The cure is a sharp distinction: PDRs MUST be portable;
ADRs MUST be repo-bound. The line between them is the test of
*"could this record land unchanged in another repository adopting
the same practice?"*. If yes, it belongs in a PDR. If the substance
depends on this repository's git history, file layout, package
names, branch conventions, or specific event identifiers, it belongs
in an ADR.

## Decision

PDRs and ADRs are governed by different content rules:

### PDR Portability Rule

A PDR body MUST NOT contain:

- Commit identifiers (full or short hexadecimal commit hashes,
  including backticked forms).
- Identifier strings unique to this repository's runtime state
  (event UUIDs, intent UUIDs, session identifiers).
- Repository-internal file or directory paths
  (paths containing the practice-core directory prefix, the
  architectural-decisions directory prefix, the agent-tools
  workspace prefix, the apps workspace prefix, the packages
  workspace prefix, or other host-repo namespace fragments).
- Plan filenames or plan-internal anchors
  (filenames carrying the plan-doc suffix; section anchors inside
  plan documents).
- Branch-name conventions
  (the conventional-commits-style prefixes that name *this* repo's
  feature, fix, or chore lanes).
- Workspace identifiers
  (package names, workspace identifiers, project identifiers tied
  to this repository's monorepo layout).

A PDR body MAY contain:

- Cross-references to sibling PDRs by their PDR identifier
  (the PDR-### form is portable practice vocabulary, not a
  repo-path).
- Cross-references to portable practice surfaces inside the
  practice-core area, using *relative* paths internal to the
  decision-records directory (sibling-PDR markdown links).
- Named references to ADRs by their ADR identifier
  (the ADR-### form is portable vocabulary; the ADR file path is
  not, and MUST NOT appear as a markdown link).

### ADR Repo-Boundedness Rule

An ADR body MAY freely contain:

- Commit identifiers (used as evidence anchors with the explicit
  historical-reference marker convention).
- Event identifiers (UUIDs from the comms-event substrate, intent
  identifiers from the commit-queue, claim identifiers from the
  active-claims registry).
- Repo-internal file paths, directory paths, package names, and
  workspace identifiers.
- Branch-name conventions used by this repository.

An ADR is expected to be repository-specific. The portability rule
that constrains PDRs does NOT apply to ADRs — confusing this point
softens ADRs into portable-vocabulary phrasing that loses operational
specificity.

## Mechanism

The decision boundary between the two kinds of record is the
**migration test**: can this record land unchanged in another
repository that adopts the practice?

- *Yes, unchanged* — it is a PDR. Authoring should pass each of the
  portability constraints listed above.
- *No, it names this repository's substrate* — it is an ADR.
  Repo-boundedness is expected and load-bearing.

When authoring substance that wants to embed a commit identifier in
a record, that wanting is a misclassification signal: the substance
belongs in an ADR (where commit identifiers are appropriate
evidence), not in a PDR. The same applies to repo paths, event
identifiers, and the other content classes named under the
portability rule above. The cure is to move the substance to an ADR
and leave a portable claim in the PDR that references the ADR by
ADR identifier (not by path).

## Cascade

This PDR carries one downstream amendment:

The rule file governing the moving-targets-in-permanent-docs
discipline is scope-updated to apply strictly to *portable surfaces*
(PDR files; rule files in the rules directory; pattern files in the
memory/patterns directory) and explicitly NOT to *repo-bound
surfaces* (ADR files). The rule cites this PDR as the governing
distinction. Before this PDR, the rule listed both PDRs and ADRs
in its in-scope surfaces, which conflated the two kinds and made
the rule inadvertently push ADRs toward under-claiming repo-bound
authority.

## Notes

### Cross-reference discipline between PDRs and ADRs

PDRs may cite ADRs by ADR identifier in prose, in §Related sections,
and in cascade items. PDRs may NOT use markdown-link syntax to
embed the ADR file path, because the link target would itself be a
repo-bound path. The discipline yields entries shaped like:

> ADR-### (one-line gloss — what the ADR codifies on the repo side).

The reader resolves the ADR by ADR identifier through the
practice-index bridge, which is the canonical surface for
PDR↔phenotype-ADR cross-references.

ADRs may freely link to PDRs by markdown path
(relative paths into the practice-core decision-records directory
are repo-internal but ADRs are themselves repo-bound, so the link
is consistent with the ADR's class).

### Worked-instance pair

The PDR-066 pair exemplifies the distinction: PDR-066 is the
portable doctrine on comms-events as a failure-mode channel; its
phenotype ADR is the repo-bound substrate that implements the
tagged-event schema. The pair is visible through the practice-index,
which is the authoritative cross-reference surface.

Further worked-instance pairs will materialise as subsequent
portable contracts land alongside their repo-bound phenotype ADRs;
each new pair surfaces in the practice-index when both halves
exist. PDR-079 does not forward-reference unlanded pairs — naming
a pair before both halves exist would itself be a citation to a
moving target.

### History rationale

The distinction emerged from a recurring observation: PDRs that
referenced commit identifiers aged silently, because the SHA either
rotated under amendment cycles or pointed at a commit whose context
had drifted. The rule that fires on hex tokens at write-time was
already in place, but the rule's *scope* erroneously named ADRs
alongside PDRs, which pushed ADR authors to soften repo-bound
evidence into portable-vocabulary equivalents that lost operational
specificity. This PDR sharpens the scope so each kind of record
operates under the constraint that matches its purpose.

## Consequences

### Enables

- Authoring PDRs without smuggling repo-bound evidence into them.
- Authoring ADRs with full repo-bound specificity (commit
  identifiers, event identifiers, repo paths, branch conventions)
  without the friction of having to soften the language.
- A clean migration test for any future record: ask the test
  question, and the classification falls out.

### Forbids

- A PDR that embeds commit identifiers, event identifiers, repo
  paths, plan filenames, plan-internal anchors, branch-name
  conventions, or workspace identifiers.
- An ADR that softens its repo-bound substance into portable
  vocabulary to *appear* PDR-like.
- A markdown link from a PDR body to an ADR file path
  (the link target is itself a repo-path; cite ADR by ADR
  identifier instead).

### Accepted Costs

- Cross-references from a PDR to an ADR carry less navigational
  affordance (the reader resolves through the practice-index).
  Acceptable: the alternative is portability violation.
- PDRs that previously embedded repo paths or commit identifiers
  must be migrated by extracting the repo-bound substance into an
  ADR and leaving a portable claim with an ADR-identifier
  reference in the PDR.

## Falsifiability

This PDR is falsifiable on each side of the distinction:

- A PDR that survives portability auditing while still carrying any
  forbidden content (commit identifiers, repo paths, plan
  filenames, branch prefixes, event identifiers) is a falsifier of
  the rule's enforceability. Each occurrence is direct evidence
  that the rule needs structural enforcement rather than discipline
  alone.
- An ADR that loses operational specificity in service of
  portable-vocabulary phrasing — symptoms include hedged language
  where a commit identifier or repo path would be precise — is a
  falsifier of the scope-distinction. Each occurrence indicates
  that the scope sharpening is incomplete and ADR authors are
  still operating under the broader rule.

The doctrine succeeds when:

- PDRs read as portable practice doctrine that any adopting
  repository can land unchanged.
- ADRs read as repo-bound architectural decisions with full
  specificity, where commit identifiers and repo paths appear as
  appropriate evidence with the historical-reference marker
  convention applied.

## Owner direction (source-of-record)

The portability distinction originated as part of a broader
owner-directed sharpening of the doctrine corpus during a
multi-agent post-completion-milestone tidy-up window. The
governing concern was that the moving-targets-in-permanent-docs
rule had inadvertently extended its scope to ADRs, where repo-bound
evidence is appropriate. The cure is the scope-sharpening codified
here, not a relaxation of the rule on the PDR side.
