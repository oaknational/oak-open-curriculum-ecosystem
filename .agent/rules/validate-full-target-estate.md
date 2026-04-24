# Validate the Full Target Estate

Operationalises [PDR-020 (Check-Driven Development)](../practice-core/decision-records/PDR-020-check-driven-development.md)
and the root-gate doctrine in
[`docs/engineering/build-system.md`](../../docs/engineering/build-system.md).

Validation claims must cover the estate they name. If the target estate
contains files hidden from the default search or command context, use a
command that actually enters that estate.

Before claiming an estate is clean:

1. Identify whether the estate is ignored, generated, nested, or outside
   the current command's default include set.
2. Use `rg -uu` or run the relevant check from inside the target directory
   when ignore rules would otherwise hide the files.
3. State the exact estate covered by the evidence.

Default-search silence is not evidence for gitignored or excluded lanes.
False-clean checks are worse than no checks because they teach the next
agent to trust the wrong boundary.
