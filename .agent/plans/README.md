# .agent/plans/ — the planning estate

The repository's home for **intent and mechanism**: why each piece of
work exists, how it is done, what proves it done, and who ratified it.
Everything that moves with the schedule lives in Linear and is pointed
at, never mirrored — the full contract is the
[plan-node schema](plan-node-schema.md).

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

## Layout

| Path | Holds |
| --- | --- |
| [`plan-node-schema.md`](plan-node-schema.md) | The contract every plan conforms to |
| [`impact-areas.md`](impact-areas.md) | The closed, additive registry behind `impact_areas` |
| `strategic/` | Strategic nodes |
| `delivery/` | Delivery plans (steps of the live lanes) |
| `runbooks/` | Operational procedures |
| [`templates/`](templates/README.md) | The three authoring templates, each opening with its ratification block |
| `archive/` | Terminal plans (completed, superseded, or abandoned — each with its disposition) |

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
