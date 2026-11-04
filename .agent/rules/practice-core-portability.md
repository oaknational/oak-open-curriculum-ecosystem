---
classification: situational
description: "Editing anything under .agent/practice-core/ (trinity, PDRs, CHANGELOG, incoming): the Core is portable by construction — no host-repo paths (docs/, src/, packages/), no adapter paths (../../skills/), no ADR identifiers, no commit SHAs, no host-context sections; the single permitted outgoing link is the bridge index .agent/practice-index.md. Core-to-Core cross-references and durable external citations (RFCs, vendor specs) stay allowed. Record host adoption in the bridge index and host ADR surface instead. Failure shape: a PDR citing its adopting ADR, dangling in another Practice-bearing repo."
trigger: surface:practice-core
globs:
  - .agent/practice-core/**
---

# Practice-Core Portability Is by Construction

Anything under `.agent/practice-core/` (the trinity, entry points,
CHANGELOG, provenance, `decision-records/`, `incoming/`) MUST be
repo-independent. The Practice-Core package is portable by
construction — host repos adopt it, the Core does not depend on any
host.

This is the **portability axis** of
[PDR-105](../practice-core/decision-records/PDR-105-reference-direction-invariants.md)
(reference-direction invariants) applied to the Core: a portable artefact may
reference only artefacts at least as general as itself, so a Core file referencing a
repo-specific target (an ADR, a host path) would dangle on arrival in another
Practice-bearing repo. This rule is that axis's strictest form.

## The Rule

Files under `.agent/practice-core/` MUST NOT contain:

- Host-repo internal paths: `docs/...`, `src/...`, `packages/...`,
  `apps/...`, `agent-tools/...`, `e2e-tests/...`, or any other
  host-only directory.
- Cross-Practice paths into the host adapter: `../../skills/`,
  `../../commands/`, `../../memory/`, `../../plans/`,
  `../../experience/`, `../../rules/`, etc.
- ADR references: no `ADR-NNN`, no links into the repository's ADR
  directory.
- Commit references: no SHAs, no commit subjects, no
  `commit abcdef0` citations.
- Host-local context sections, "host context note" sections, or
  "this repo only" sections inside any PDR. Host-side adoption is
  recorded in the host's bridge index and ADR surface, not in the
  PDR itself.

The single permitted outgoing link from any file under
`practice-core/` is to the stable bridge index
`.agent/practice-index.md`. Cross-references **between** Core files
(e.g. `practice.md` → `practice-lineage.md`, PDR → PDR) are internal
to the Core package and remain allowed; what is forbidden is
leakage **out** of the Core into the host repo.

## Scope of "Host Leakage"

The constraint targets host-repo internal paths and host-local
identifiers. It does NOT apply to:

- The Practice's own canonical layout: `.agent/skills/`,
  `.agent/rules/`, `.agent/memory/`, `.agent/state/`,
  `.agent/practice-core/`. `.agent/` IS the Practice's canonical
  home; references to the Practice's own surface are not host
  leakage.
- External http(s) citations to durable third-party material:
  RFCs, vendor specifications, public standards. These are not
  host-repo paths and are not in this rule's domain.

## Why Stricter Than Prior Framings

This is stricter than the earlier "Core self-containment" framing
(under PDR-007). The seam is tightened to a **single
permitted outgoing target** — the stable bridge index — because
every additional outgoing surface from the Core into the host is a
future portability defect.

Prior violations ranged across multiple PDRs and `practice.md` /
`practice-lineage.md` / `CHANGELOG.md` / `practice-bootstrap.md`.
The first wave of remediation migrated the trinity to the
post-retirement model; deleted host-context sections across PDRs;
repaired broken cross-Core links; and re-pointed bridge index
references to "(host adoption)" framing. Each violation was
critical-architectural-failure-shaped prior art for this rule.

## What to Do Instead

| Impulse | Wrong move | Right move |
|---|---|---|
| "Cite the ADR that adopts or records this" | An ADR number (`ADR-150`) or a link to a host ADR inside a Core file | Name the concept the ADR records ("the host's continuity-surfaces decision") and record the pairing in the bridge index; when curing an existing citation, keep the sentence and replace only the number |
| "Reference the host README" | `[Host README](../../../README.md)` | Reference the stable bridge index `.agent/practice-index.md`; the bridge index points outward |
| "Note this only applies in this repo" | `## Host context note` inside the PDR | Move the note to the host adapter or the host's ADR; the PDR stays repo-independent |
| "Cite the implementing commit" | `commit abc1234 implemented X` | Date + structural concept; commit SHAs do not belong in any permanent-doc surface (see `no-moving-targets-in-permanent-docs.md`) |

## Doctrinal Anchors

- [PDR-105](../practice-core/decision-records/PDR-105-reference-direction-invariants.md)
  §Axis 2 (portability) — the reference-direction invariant this rule operationalises
- PDR-007 §Core-package contract (the package contract is the
  authority; this rule operationalises it)
- PDR-009 (`.agent/` as canonical Practice home)
- `no-moving-targets-in-permanent-docs.md` (the related citation-
  directionality rule for permanent-doc surfaces generally; this
  rule applies the stricter "single outgoing target" form to the
  Practice-Core package)

## Enforcement

The Edit/Write hook (`.agent/hooks/policy.json`) applies the
related moving-targets prohibition at write-time.

Three gates in `docs-validators:check` enforce parts of this rule:

- `validate-core-adr-citations` enforces the ADR-identifier clause. It
  refuses an ADR identifier written anywhere under `practice-core/`:
  `ADR`, a hyphen, dash or space, then digits, in any letter case. Each
  finding prints its `path:line:column` and the citation as written.
  The cure names the concept the ADR records in place of the number and
  keeps the sentence (PDR-079). Run it alone with
  `pnpm --filter ./agent-tools validate-core-adr-citations` (pnpm's
  directory selector, the same in every estate whatever the package scope).
- `validate-reference-direction` refuses a resolvable link from the
  Core to anything outside it.
- `validate-no-host-names-in-core-headings` enforces the host-name clause
  in the one shape a scanner can hold: a heading in any Core document
  (the changelog excepted, whose entry tags name the writing repository
  by convention) that names a repository the Core has lived in. The names
  are derived from the Core's own records — the provenance chain's `repo`
  fields and the changelog's entry tags — and the scanned tree's origin
  owner and repository; nothing is declared in the gate. The cure moves
  the host's adoption to the host's own decision record, pairs it in the
  bridge index (PDR-079) and heads the Core entry by its date and
  subject alone. With a repository root as its one argument it reads a
  sibling estate's tree by the same rule. Run it alone with
  `pnpm --filter ./agent-tools validate-no-host-names-in-core-headings`.

An automated reviewer does not know this rule: it reads a Core path or a
Core-relative link as "does not exist in this repository" and proposes
localising it (2026-03-06, and again at the 2026-09 transplant). Such a
finding is triaged (`review-feedback-defaults-to-triage`) and rejected with
this rule as the reason; it is never cured by writing a host path into the
Core.

The remaining clauses (host paths written as text, commit references,
host-context sections, a host name in body text) have no scanner yet. PDR-038 pairs every stated
principle with a structural enforcement surface, so that scanner is
their next layer. Until it lands, those clauses are the human-readable
contract that authoring agents apply at write-time.
