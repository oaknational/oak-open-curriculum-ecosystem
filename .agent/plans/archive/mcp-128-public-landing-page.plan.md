---
id: mcp-128-public-landing-page
node_type: delivery
name: "Public landing page at production values: Oak-family design"
overview: "Raise the app's landing page to main-domain production values — composed from the in-repo design system, in Oak's voice, at the system's accessibility bar."
status: archived
ratified_by: Jim Cresswell
ratified_date: 2026-07-23
ratified_where: "owner card 2026-07-23, answered via the Director's card relay (Forge 398e24)"
serves: first-major-release
impact_areas:
  - served-surface
  - packaging-and-distribution
tickets:
  - MCP-128
depends_on: []
last_updated: 2026-07-26
---

# Public landing page at production values

## Outcome (2026-07-26) — delivered, plan archived

The page is built and pushed: `SHA:a549d491d` on
`jimcresswell/mcp-128-public-landing-page-at-production-values-oak-family-design`.

The design the owner iterated with the studio on 2026-07-23 is what shipped —
Oak site chrome, hero band, connect band, accordion cards, footer — carried into
the app as a server-rendered React tree over the in-repo design system. The
owner holds the copy and edits it directly on the page
(2026-07-25: "the copy cannot be decided by AI").

The durable design decisions this work settled live in
[ADR-217](../../../docs/architecture/architectural-decisions/217-server-rendered-html-in-the-mcp-app.md);
this node's job is finished.

## Goal

A visitor who reaches the app's page — by pasted protocol URL, shared
link, or curiosity once it serves under Oak's main domain — understands
in seconds what this is, how to connect, what it can do, and where to go
meanwhile; and the page looks and reads unmistakably Oak. The page is the
app's first public statement of existence on Oak's front door, so it
carries main-website production values: the same design family, the same
editorial voice, the same accessibility bar.

## Mechanism

**Design by family membership.** The page composes from the in-repo design
system (ADR-213 — the estate's design source of truth, built to make anything
feel unmistakably Oak): tokens and the class library, local Lexend. Matching
the main website means belonging to the same family, which the system exists
to guarantee.

**The design was iterated with the owner in the studio** across the 2026-07-23
session and its follow-ups, and rendered live in his browser at each round.
What the page says about the served surface is derived from the served-surface
definition, and its endpoint from the deployment host, so the page cannot drift
from what a connected client actually sees.

**Content set**: an explainer sentence for educators, the current access
status, connection instructions, the served resources and tools, and
documentation pointers. Editorial voice per `editorial-tone.md` (human,
largely non-technical audience). Sensitivity by construction: the public page
carries no cohort detail, no timing rationale, no stage-ladder dates. The
owner authors and edits this copy directly.

## Acceptance criteria (each with a proof)

1. **Family membership is mechanical.** The page styles resolve through
   design-system tokens and classes — no ad-hoc colours, fonts, or spacing.
   Proof (`repo-safe`): review asserts no out-of-system values.
   **Met** — the page's own layer is token-only; the design system is served
   from the app under a closure-tested manifest.
2. **Accessibility at the system's bar.** WCAG 2.2 AA held: contrast green
   across themes, keyboard and structure reviewed. Proof (`repo-safe`):
   browser accessibility gate; accessibility-expert review recorded on the PR.
   **Partly met** — `test:a11y` (axe, WCAG 2.2 AA) is green on the built page
   and the three blocking findings from the pre-integration audit are cured;
   the expert review pass runs on the PR.
3. **Voice and sensitivity signed off.** Editorial-tone conformance and the
   sensitivity boundary reviewed; the owner's glance on the final copy
   recorded before the www phase can ever be flipped. Proof (`repo-safe` for
   the review trail; `owner-held` for the copy glance).
   **Owner-held** — he holds the copy and the glance.
4. **The design session left no residue.** Session output landed via the
   design-sync runbook as a reviewed PR. Proof (`repo-safe`; `owner-held`
   glance on the design output). **Met** — landed via MCP-133.

## Todos

- Sliced at pickup by the implementer, each slice a single-story PR
  within its round budget (PDR-132).

## Out of scope

- The www edge flip itself: the canonical-address lane's layer (b) —
  this page GATES that flip (the coming-soon phase must be live-ready
  first) but does not perform it.
- The release-phase install CTA content beyond its reviewed copy: the
  flip to "live" happens at release, as its own reviewed edit.
- Any change to the main website or its repositories.
- Design-system extensions beyond what the page needs: gaps found in
  the session land as system components via the runbook, scoped
  minimally.
