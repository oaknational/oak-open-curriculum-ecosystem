# Impact areas — the closed registry

**Status: sketch** (seed set, born-sketch with the structural minimum;
ratified with it). The registry behind every plan's `impact_areas`
field: which parts of the product a plan changes. **Closed and
additive** — a new area is added here, in a reviewed change, before any
plan may cite it; the estate validator refuses membership drift.

The repository owns **impact structure** (durable — it changes only
when the product changes); Linear owns **delivery grouping** (what
travels together, via milestones). A milestone spans areas; an area
spans milestones; neither duplicates the other.

| Area | What it covers |
| --- | --- |
| `served-surface` | The tools, resources, and allowlist the app serves over MCP |
| `guidance-content` | The served getting-started guidance for AI assistants, and its authoring/ingest pipeline |
| `auth-and-access` | Authentication, sign-in configuration, and access gating |
| `analytics-and-observability` | Usage analytics, error monitoring, and telemetry, under the ratified privacy posture |
| `conformance-and-standards` | Protocol-conformance suites, spec-version compliance, and their CI guards |
| `packaging-and-distribution` | Store listings, submission packages, screenshots, and channel delivery |
| `content-workspace` | The model-behaviour content workspace and its reviewer-facing views |
| `practice-and-estate` | The engineering practice, agent estate, and planning estate itself |
| `design-system` | The Oak Open Curriculum Design System — tokens, themes, identities, class library, the component tier, and its studio sync |
| `innovation-kit` | The cross-demo composition, assurance, evidence, and reuse substrate that turns Oak capabilities into independent working experiences |
