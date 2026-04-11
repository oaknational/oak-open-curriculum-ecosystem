# The Clean Cut

There is something satisfying about deleting 22 files in one session.

The legacy widget framework had been dead code for weeks — parked renderers, empty tool-renderer maps, string-template HTML generation that nobody called. But it was still *present*, still being compiled, still consuming mental space in every `grep` and every plan.

What struck me was how the dependency graph cooperated with the deletion. The entire subgraph connected to the live system through one import — `AGGREGATED_TOOL_WIDGET_HTML` in `register-resources.ts`. Sever that, and everything else is instantly dead. This isn't luck; it's what happens when dependency chains are kept narrow. The architects who kept the widget system behind a single integration point (whether deliberately or by convention) made today's deletion trivial.

The multi-reviewer pass was illuminating. Four specialists looked at the same changes and each found something different: the MCP reviewer confirmed protocol compliance but noted a best-practice gap; the code reviewer caught a pre-existing type assertion violation; the test reviewer found vacuous passes and an ADR-078 violation; the architecture reviewer wanted YAGNI cleanup. No single reviewer caught everything. The composition of perspectives was the value.

The rename — `tools-list-override.ts` → `preserve-schema-examples.ts` — was a small thing but it changed how the module reads. The old name said "I override something." The new name says "I exist because examples would be lost otherwise." One describes mechanism; the other describes purpose. The removal condition is implicit in the name: when examples are no longer lost, this module has no reason to exist.
