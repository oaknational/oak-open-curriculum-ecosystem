# ADR-217: Server-Rendered HTML in the MCP App

**Status**: Accepted
**Date**: 2026-07-26
**Related**: [ADR-213](213-design-system-integration-and-component-architecture.md) — the design
system is the estate's design source of truth, and static/content UI composes from its class
library; this ADR settles how a Node server produces such HTML and delivers the system to the
browser. [ADR-147](147-browser-accessibility-as-blocking-quality-gate.md) — the accessibility
gate these surfaces are held to. [ADR-192](192-feature-flag-three-stage-lifecycle.md) — the
flag lifecycle the optional-affordance clause instantiates.
[ADR-141](141-mcp-apps-standard-primary.md) — the MCP App widget, a distinct UI surface with
its own bundler.

## Context

`oak-curriculum-mcp-streamable-http` serves HTML directly: a page at `/`, and the same page at
`/mcp` when a browser negotiates for it rather than speaking MCP. This is the app's public face
— reachable by a pasted protocol URL, a shared link, and in time from Oak's main domain.

Two properties of the app shape how that HTML can be produced. It is an Express server bundled
by esbuild for a Node runtime, with no CSS pipeline; and its content is not authored but
derived — the tools and resources it advertises come from the SDK registry filtered by the
served-surface definition, and its endpoint URL from the deployment host.

The design system is CSS, fonts, and mask icons whose `url()` references resolve relative to
the stylesheet that names them. Delivering it to a browser from a server with no asset pipeline
is therefore a distinct problem from consuming it in a bundled app.

## Decision

### 1. Served HTML is a React tree rendered to static markup

HTML the app serves is composed as React components under `src/landing-page/components/` and
rendered with `renderToStaticMarkup` from `react-dom/server`. React is already a runtime
dependency of the workspace.

Escaping is therefore a property of the renderer: every interpolated value — tool names, SDK
descriptions, resource URIs — is escaped by construction, so correctness here does not depend
on each author remembering to escape.

`renderToStaticMarkup` is the specific renderer: these pages do not hydrate, so no React
bookkeeping attributes belong on the wire. The document element itself is a component; only the
doctype is prepended.

### 2. The design system reaches the browser as app-served static assets

A declared manifest (`build-scripts/copy-oak-ds.ts`) copies the design system's runtime files
from the installed `@oaknational/oak-design-system` package into `public/oak-ds/`, mirroring
package-relative layout so `url()` references resolve. The package is a **devDependency**:
consumed at build, dev, and test time, with the copied files — not the package — reaching
production.

**Every asset a served page references resolves within the app's own origin.** Stylesheets,
both font faces with their licence notices, mask icons, logo artwork, and the theme script are
all served from `/oak-ds/`. A page's asset list is a statement about what the app itself
serves.

The copy is wired at the three points that produce a running app — the esbuild composition
root, the dev server, and the Vitest global setup — and the esbuild wiring sits ahead of that
file's build-intent switch so every build arm ships the same assets. Turbo carries the design
system as an input to the app's `#build` **and** `#test` tasks, so a design-system change
re-runs both.

### 3. The manifest is proven against the design system's real dependency closure

The manifest is verified by test against the stylesheet's actual `@import` and `url()` graph,
walked from the package's root stylesheet. A design system that grows a new imported sheet, or
points an existing one at a new asset, fails the app's test suite until the manifest covers it.

Font licence notices are held by a generalised invariant — every font binary has a sibling
notice — so a third font cannot ship licence-bare.

The real IO these tests need lives behind a `test-helpers/` surface (ADR-078's structural
allowlist): the subject under test is a filesystem copy, and a faked filesystem would assert
the fake.

### 4. What a served page says about the served surface is derived

A page that advertises tools, resources, counts, or endpoints derives every one of them at
render time — membership and counts from the served-surface definition, ordering from its
declared order array, the endpoint from the deployment host. The page states what a connected
client would actually find.

This makes captured HTML — a design export, a saved render, a screenshot's markup — **styling
evidence**. Its lists and counts are one render's values and carry no authority over the
served surface.

### 5. An optional affordance is a declared flag, and its machinery ships with it

An affordance not yet offered to the public is a validated key in the app's env schema,
resolved into runtime config and passed to the render as a prop, defaulting to absent. It is
never a raw `process.env` read at the point of use.

**A mechanism that changes a user-visible setting ships only together with the control that
changes it back.** Where a script would alter what a visitor sees — theme, density, motion —
that script is present exactly when its control is. A page that ships the mechanism alone can
put a visitor into a state the page never offered and gives them no way out.

The page therefore declares its own default state explicitly (`data-theme="light"`), so the
served appearance is a property of the page rather than of what the visitor's browser
volunteers.

## Consequences

- Served pages carry Oak's appearance with no CSS pipeline in the app, and no runtime
  dependency on any host outside the deployment.
- The app's own test suite is what catches a design-system change that would break a served
  page; the failure lands at build time on the branch that causes it.
- `public/oak-ds/` is generated and gitignored. It is registered with the dependency-boundary
  checker alongside the other browser-served scripts, which have no importer by construction.
- Adding a served asset means editing the manifest. The closure test covers assets the CSS
  reaches; one referenced only from markup is declared directly and proven by the
  static-serving test.
- Fonts served from the app's origin need no third-party font CSP allowance for these pages.
- A future served surface — a second page, an error page, a status page — inherits all five
  clauses without further decision.
