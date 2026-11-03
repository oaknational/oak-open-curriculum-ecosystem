# .agent/plans/ — the planning estate

The repository's home for **intent and mechanism**: why each piece of
work exists, how it is done, what proves it done, and who ratified it.
Everything that moves with the schedule lives in Linear and is pointed
at, never mirrored; the state of any instance of the code — a deployment,
a dashboard, a console — is that system's own record, never this corpus's,
which records the desired outcome and its owner-held proof (the
repository attests completion only up to its own boundary) — the full
contract is the [plan-node schema](plan-node-schema.md).

Three plan types: **strategic** (the outcome and the bet — long-lived,
few), **delivery** (one step of a lane — short-lived, archived at
completion), **runbook** (a repeatable procedure). Milestones are not a
plan type: they live in Linear as named observable states of the
product, and the strategic layer points at them. Nor is the **lane** a
plan type: it is the unit of work one seat holds (PDR-117, dated
amendment 2026-07-24), and it spans one or more delivery plans and
tickets — its steps.

**Every plan is born `sketch`** and governs no work until it carries a
complete owner-ratification stamp (`ratified_by` + `ratified_date` +
`ratified_where`). Executed is not ratified; the stamp is the
difference, and the estate validator enforces it.

This corpus is the work surface (owner ruling 2026-09-08, verbatim: "we
have an entire, sophisticated, in-repo planning system with multiple
layers of discoverability!"): a lane pointer a seat would leave for a
successor becomes a delivery node or a unit inside an existing node here,
and an owner decision becomes a gate row here — never a board in prose, a
register file, or a queue surface such as repository issues.

_Current OCE read path (10 October 2026): start with the
[programme route](../reports/repo-architecture/oce-rearchitecting/README.md), then
the linked permanent architecture and native bounded nodes. The older
`toolkit-re-architecture` and `oak-open-curriculum-mcp-extraction` records are
superseded history. The strategy index remains the home of wider commitments;
new detailed OCE nodes remain sketches until properly ratified._

## Layout

| Path | Holds |
| --- | --- |
| [`plan-node-schema.md`](plan-node-schema.md) | The contract every plan conforms to |
| [`impact-areas.md`](impact-areas.md) | The closed, additive registry behind `impact_areas` |
| `strategic/` | Strategic nodes |
| `delivery/` | Delivery plans (steps of the live lanes) |
| `runbooks/` | Operational procedures |
| [`templates/`](templates/README.md) | The three authoring templates, each opening with its ratification block |
| `archive/` | Terminal plans (completed or abandoned, each with its disposition); a superseded node keeps its place and names its successor (the schema's status axis) |

Plans are public-repository artefacts: **mechanism only**; anything
internal rides the linked Linear ticket (sensitivity by construction).

## Provenance

The estate structure above was owner-ratified at the planning sitting
(decisions register D23) and its first content ratified at part 2; the
doctrine home is
[ADR-216](../../docs/architecture/architectural-decisions/216-plan-node-estate.md).
Four conserved planning corpora precede this estate, all evidence and
none baselines: the prior 2026-07-21 sketch corpus, archived with
per-artefact dispositions in
[`.agent/plans-v0-sketch-2026-07-21/`](../plans-v0-sketch-2026-07-21/DISPOSITIONS.md);
the conserved pre-reset estate, untouched in
[`.agent/plans-backlog-2026-07/`](../plans-backlog-2026-07/BACKLOG.md);
the archive tier of the generation before it, in
`.agent/plans-old-archive/`; and the paused plan-corpus refounding
programme's working corpus and instruments, in
`.agent/plans-refounding/` (its controlling plan lives in the backlog's
product-development-governance collection). Their incremental
absorption is governed by the
[`planning-and-intent-estate`](strategic/planning-and-intent-estate.plan.md)
strategic node.
