# Practice-Core Portability Is by Construction

Anything under `.agent/practice-core/` (the trinity, entry points,
CHANGELOG, provenance, `decision-records/`, `incoming/`) MUST be
repo-independent. The Practice-Core package is portable by
construction — host repos adopt it, the Core does not depend on any
host.

## The Rule

Files under `.agent/practice-core/` MUST NOT contain:

- Host-repo internal paths: `docs/...`, `src/...`, `packages/...`,
  `apps/...`, `agent-tools/...`, `e2e-tests/...`, or any other
  host-only directory.
- Cross-Practice paths into the host adapter: `../../skills/`,
  `../../commands/`, `../../memory/`, `../../plans/`,
  `../../experience/`, `../../rules/`, etc.
- ADR references: no `ADR-NNN`, no links into
  `docs/architecture/architectural-decisions/`.
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
(under PDR-007 and ADR-124). The seam is tightened to a **single
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
| "Cite the ADR that adopts this PDR" | `[ADR-125](../../docs/architecture/architectural-decisions/125-...md)` inside a PDR | Record the host adoption in the bridge index and the host's ADR surface; the PDR mentions it abstractly as "(host adoption)" if at all |
| "Reference the host README" | `[Host README](../../../README.md)` | Reference the stable bridge index `.agent/practice-index.md`; the bridge index points outward |
| "Note this only applies in this repo" | `## Host context note` inside the PDR | Move the note to the host adapter or the host's ADR; the PDR stays repo-independent |
| "Cite the implementing commit" | `commit abc1234 implemented X` | Date + structural concept; commit SHAs do not belong in any permanent-doc surface (see `no-moving-targets-in-permanent-docs.md`) |

## Doctrinal Anchors

- per-user feedback memory: `feedback_practice_core_portability_strict`
- PDR-007 §Core-package contract (the package contract is the
  authority; this rule operationalises it)
- PDR-009 (`.agent/` as canonical Practice home)
- `no-moving-targets-in-permanent-docs.md` (the related citation-
  directionality rule for permanent-doc surfaces generally; this
  rule applies the stricter "single outgoing target" form to the
  Practice-Core package)

## Enforcement

The Edit/Write hook (`.agent/hooks/policy.json`) applies the
related moving-targets prohibition at write-time. A
structural-enforcement scanner that catches host-path leakage
specifically inside `practice-core/` is the next reinforcing layer
named in PDR-038's Author-time enforcement family. Until that
scanner lands, this rule is the human-readable contract that
authoring agents apply at write-time.
