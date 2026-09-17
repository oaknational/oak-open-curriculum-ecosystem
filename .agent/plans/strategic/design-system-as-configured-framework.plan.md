---
id: design-system-as-configured-framework
node_type: strategic
name: "The design system as a configured framework"
overview: "The Oak Open Curriculum Design System as a layered, identity-agnostic framework in which Oak itself is configuration: general mechanism below, identity data above, with the constrained (non-MIT) surface kept structurally minimal. Professional-designer visual quality is the acceptance bar for every surface that presents the system."
status: ratified
ratified_by: "Jim Cresswell (owner)"
ratified_date: 2026-08-05
ratified_where: "Owner word, Director session Petrel holds Turbulence (a0892f), 2026-08-05: 'Strategic node ratified' — given in the design-lane reopening sitting with the fix-all-known-issues instruction"
serves: TOOLS-2
impact_areas:
  - design-system
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets: []
last_updated: 2026-08-05
---

# The design system as a configured framework

## Kernel (owner words, 2026-08-02, Director session Magnetar binds Oblivion 74d914)

- "A system broken down into layers. The bottom layers are the most reusable, the top
  layers the most specific."
- "The Oak specific parts are kept as thin as possible, ideally no more than some config
  passed to a general framework."
- The system "trivially" supports an arbitrary number of identities; each identity an
  arbitrary number of themes, with light, dark, and high-contrast non-negotiable and
  colour-safe a sensible default inclusion.
- The visual bar, verbatim: "a way that a professional designer would look at and think
  'wow, that looks good'" — later strengthened to "I want to look at each and every demo
  and think 'wow, that looks _amazing_'".

## Kernel additions (owner words, 2026-08-03, design seat Corsair hunts Surf 4d3282)

Ratified at the owner card (2026-08-03): the goal architecture below is the governing
frame for the completion plan's v2.2 restructure. The three properties, his words:

- **Layer sovereignty**: "A HIGHLY modular design system, extending from tokens to
  basic structures to components to React components, with all the required inbetween
  steps, and each higher layer depending on the lower layers, but being optional, so
  e.g. we could create a static Astro app hosted on Cloudflare without issue and it
  would look exactly as the selected identity intended."
- **Cost-of-change is the product**: "Not all apps need identity switching capability,
  really just the first two demos, we want to fully enable whitelabelling and
  flexibility whilst decreasing the cost of taking advantage of it to near zero, the
  identity switching demonstrates that, but it is not a core feature in its own right,
  low-cost design changes are the core feature." The value beneath the property, his
  words the same day (relayed via Director event 7b00c9e5): "cost of change is
  something very important to me, in the broad systems and system change sense,
  another way of looking at the same thing from my perspective is: enabling rapid
  innovation without compromising quality or stability." Both arms bind whenever this
  strand trades anything: speed of safe change AND the quality/stability floor, never
  one silently for the other. The same owner value carries ADR-222's interim-derive
  contract and PDR-135's cost-of-change gradient — three lanes, one value.
- **Expressive range spans structure**: "We need an additional, small demo, that is
  designed to highlight how much the page layout can be altered by the choices within
  the design system for identical page structure, think <https://csszengarden.com/>
  but modern."

The demo estate, per role (owner card answer, verbatim): "The design system showcase
is the primary demo, the curriculum hub is the first instance of a Claude Design app
ingested and reconstructed with our tools, and yes it should gain identity switching
as a valuable demo, the third and fourth are small demos to prove plain html/css and
styled-components support respectively, the fifth demo is the css zen garden like
demo." (The runtime-switching pair is therefore showcase + hub; the demo census is
five.)

Derived goals ratified with the same card, each an articulation of the kernel rather
than new ambition: the licensing split made practical (MIT code / OGL content /
reserved marks works only because de-branding is cheap and excellent); the
identity-№N guarantee; accessibility as the universality floor across the whole
identity × theme × layout choice space; quality held by structure, not vigilance;
design operable by non-designers and agents (values are data, constraints enforced);
the demos as the falsifier suite — every demo exists to prove a named property of
this kernel, and a demo with no property to prove is scope without warrant.

## Decision records

The decisions this node narrates are recorded canonically in the
[Design Decision Record corpus](../../../docs/design/README.md)
(founded 2026-08-07, MCP-527): the kernel's configured-framework thesis is
[DDR-001](../../../docs/design/design-decisions/001-the-design-system-is-a-configured-framework.md);
the licensing split is
[DDR-005](../../../docs/design/design-decisions/005-licence-follows-provenance.md).
Plans cite DDRs — never the reverse; this node remains the ratified
narrative home the DDRs cite as provenance (PR #782).

## Why strategic

The identity-as-configuration thesis is the same split the licensing model makes legible
(code MIT, content OGL, marks reserved — owner ruling 2026-08-02): the reusability
argument and the constraint-surface argument are one architecture seen from two sides —
the open-by-default bet this node serves (TOOLS-2); the demos it powers are the visual
front door of the MCP-app strand (APP-1), which consumes this strand's outcome without
owning it. (Serves edge re-pointed APP-1 → TOOLS-2, 2026-08-02, v1-review finding E65 —
`.agent/reports/design/plan-review-2026-08-02/findings.v1.json`, array-index convention
per that ledger's preamble: the node's own argument makes the choice.)
Every delivery decision in this strand resolves against the kernel above: mechanism
generalises downward, identity thins upward, and quality claims become structural
(schemas, gates, generated documentation) rather than remembered.

## Falsifiability

The thesis fails if adding or modifying an identity requires framework-code changes
(the identity-№N test), or if the constrained brand surface grows faster than the
general mechanism beneath it. Delivery nodes serving this strand carry the mechanical
forms of these falsifiers.
