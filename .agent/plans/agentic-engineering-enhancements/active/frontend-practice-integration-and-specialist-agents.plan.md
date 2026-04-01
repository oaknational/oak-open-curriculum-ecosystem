---
name: "Frontend Practice Integration and Specialist Agent Suite"
overview: "Integrate incoming frontend Practice evolution, create design token workspaces, and build the full suite of UI/UX/a11y/React specialist agents."
isProject: false
status: DECISION-COMPLETE — ALL REVIEWER FINDINGS RESOLVED — READY FOR EXECUTION
created: 2026-04-01
updated: 2026-04-01
reviewer_rounds:
  - round: 1
    date: 2026-04-01
    reviewers: [barney, betty, fred, wilma, docs-adr-reviewer, code-reviewer, test-reviewer]
    findings: 14 decisions surfaced and resolved (R1-R14)
blocks:
  - ws3-phase-4-curriculum-model-view (token infrastructure must exist)
  - ws3-phase-5-interactive-user-search-view (token infrastructure must exist)
todos:
  - id: render-decision-complete
    content: "Resolve all open questions in Part 5 to make this plan decision-complete."
    status: completed
  - id: phase-1a-core-proposals
    content: "Adopt browser testing taxonomy and UI reviewer roster into portable Practice Core (practice-lineage.md, practice.md, practice-bootstrap.md)."
    status: pending
  - id: phase-1b-local-adoption
    content: "Add browser proof surfaces, 9th quality gate, and UI/Frontend triage to local directives (testing-strategy.md, principles.md, invoke-code-reviewers.md)."
    status: pending
  - id: phase-1c-transferable-patterns
    content: "Adapt accessibility-as-blocking-gate and design-token-governance as local Practice references."
    status: pending
  - id: phase-1d-provenance
    content: "Append provenance index 18, update CHANGELOG, draft UUID evolution proposal."
    status: pending
  - id: phase-1e-clear-incoming
    content: "Clear practice-core/incoming/ and practice-context/incoming/ after integration."
    status: pending
  - id: phase-1f-adr-144
    content: "Author ADR-144: Browser Accessibility as a Blocking Quality Gate."
    status: pending
  - id: phase-1f-adr-145
    content: "Author ADR-145: Design Token Architecture (DTCG JSON, three-tier model, packages/design/ location)."
    status: pending
  - id: phase-1f-adr-146
    content: "Author ADR-146: Frontend Specialist Reviewer Gateway Cluster."
    status: pending
  - id: phase-1f-governance-a11y
    content: "Author docs/governance/accessibility-practice.md (WCAG 2.2 AA, Playwright + axe-core, MCP App HTML resource testing, three-metric frontmatter)."
    status: pending
  - id: phase-1f-governance-tokens
    content: "Author docs/governance/design-token-practice.md (DTCG format, three-tier model, authoring guide, build pipeline)."
    status: pending
  - id: phase-1f-adr-index
    content: "Update ADR index README.md with entries for ADR-144, ADR-145, ADR-146 (flat + categorised sections)."
    status: pending
  - id: phase-1f-amend-041
    content: "Amend ADR-041 to add packages/design/ category with dependency direction rules."
    status: pending
  - id: phase-1f-amend-121
    content: "Amend ADR-121 to add test:a11y row to coverage matrix (CI for UI-shipping workspaces)."
    status: pending
  - id: phase-1f-governance-readme
    content: "Update docs/governance/README.md contents list with the two new governance docs."
    status: pending
  - id: phase-1f-gates-md
    content: "Update .agent/commands/gates.md to include test:a11y position in the canonical gate sequence."
    status: pending
  - id: phase-2a-triplets
    content: "Create three full ADR-129 triplets: accessibility-reviewer, design-system-reviewer, react-component-reviewer."
    status: pending
  - id: phase-2b-gateway
    content: "Add UI/Frontend triage cluster to invoke-code-reviewers.md and update AGENT.md roster."
    status: pending
  - id: phase-2c-adapters
    content: "Create platform adapters for Cursor, Claude Code, Codex, Gemini CLI."
    status: pending
  - id: phase-2d-validate
    content: "Run pnpm subagents:check and pnpm portability:check."
    status: pending
  - id: phase-2e-subagent-architect
    content: "subagent-architect reviews all three triplets for naming, boundary, and duplication consistency."
    status: pending
  - id: phase-3-review
    content: "Invoke all three new agents plus docs-adr-reviewer, test-reviewer, subagent-architect, and multiple non-cohort architecture reviewers to review Phase 1+2 output."
    status: pending
  - id: design-token-infrastructure
    content: "Create two new workspaces with basic token infrastructure — BLOCKS widget UI work."
    status: pending
  - id: design-token-feature-complete
    content: "Iteratively improve token system in tandem with widget design — does NOT block widget."
    status: pending
---

> NOTE: This plan needs a review from the MCP reviewer before execution.

# Frontend Practice Integration and Specialist Agent Suite

**Status**: DECISION-COMPLETE — ALL REVIEWER FINDINGS RESOLVED — READY FOR EXECUTION
**Created**: 2026-04-01
**Updated**: 2026-04-01
**Domain**: Agentic Engineering Enhancements + SDK & MCP Enhancements (cross-cutting)

## Blocking Relationship to WS3 Widget UI Work

This plan is a **blocking prerequisite** for WS3 Phases 4-5 (widget UI),
with nuance:

- **BLOCKS widget work**: The token infrastructure must exist (workspaces
  created, basic palette + semantic layer + theme scaffolding in place,
  build pipeline wired). The widget needs a correct foundation that will
  not be ripped out later.
- **Does NOT block widget work**: Feature-completeness of the token system.
  A basic token set sufficient for a public alpha is the gate, not a
  polished design system.
- **After the gate clears**: The token system and widget design improve
  **in tandem**. Token additions are driven by widget needs; widget design
  adopts new tokens as they land. Neither blocks the other past initial
  scaffolding.

---

## Part 1: Incoming Practice Analysis

### 1.1 What Arrived

Two categories of incoming material from opal-connection-site (2026-03-28):

#### Practice Context Incoming (`.agent/practice-context/incoming/`)

23 files total. Three categories by origin:

| Category | Count | Origin | Status |
|----------|-------|--------|--------|
| Write-back notes (2026-03-23) | 8 | oak-mcp-ecosystem → opal-connection-site → returned | Already known — these originated here |
| Earlier notes (pre-integration) | 9 | Various repos → opal-connection-site → here | Already known — travelled with earlier exchanges |
| **Frontend/UI Practice Notes** | **6** | **opal-connection-site (new)** | **New material — requires full analysis** |

The six new files:

| File | Type | Summary |
|------|------|---------|
| `core-proposal-browser-testing-taxonomy.md` | Core Proposal | Adds 4 browser proof surfaces + 9th quality gate category |
| `core-proposal-ui-reviewer-roster.md` | Core Proposal | Adds accessibility-reviewer + design-system-reviewer guidance |
| `accessibility-as-blocking-gate.md` | Transferable Pattern | Playwright + axe-core WCAG 2.2 AA, zero-tolerance, both themes |
| `testing-strategy-for-static-content-projects.md` | Transferable Pattern | 4-layer proof strategy for content-first projects |
| `design-token-governance.md` | Transferable Pattern | 3-tier tokens (palette → semantic → component), theme proof |
| `static-first-architectural-constraint.md` | Transferable Pattern | Static delivery default, runtime requires justification |

#### Practice Core Incoming (`.agent/practice-core/incoming/practice-core/`)

7-file standard package. Provenance stops at index 17 (oak-open-curriculum-
ecosystem, 2026-03-23). The opal-connection-site is **not** in the provenance
chain — meaning the Core Proposals have NOT been merged into the Core itself.
They remain proposals in the practice-context layer, which is the correct
exchange mechanism.

### 1.2 Incoming Practice Core: Line-by-Line Diff Analysis

The incoming practice-core package (provenance index 17) is the **same version
this repo already has** — it was last touched by oak-open-curriculum-ecosystem
on 2026-03-23, which is the same as the local live copy. There are no new
Practice Core changes to integrate from the Core files themselves.

The value is entirely in the **practice-context/incoming/** layer — the six
frontend/UI documents.

### 1.3 Core Proposal Assessment

#### Core Proposal 1: Browser Testing Taxonomy

**Proposal**: Add four browser proof surfaces (accessibility audit, visual
regression, responsive validation, theme/mode correctness) to the testing
taxonomy. Add a 9th quality gate category: accessibility audit.

**Assessment for this repo**: **ADOPT.** This repo is building React MCP App
views (WS3 Phases 4-5). The testing taxonomy currently has no vocabulary for
browser-specific proof surfaces. The WS3 Phase 2 scaffold already has a
DOM-capable Vitest config, but accessibility auditing is not in the gate
sequence. The 9th gate category is a clean, non-breaking addition.

**Adaptation needed**: MCP App views render inside host-provided iframes.
Accessibility testing may require a different harness than standalone pages.
The testing taxonomy addition is vocabulary-level and does not prescribe
tooling.

#### Core Proposal 2: UI Reviewer Roster

**Proposal**: Add accessibility-reviewer and design-system-reviewer to the
reviewer roster guidance. Gateway code-reviewer triages to them when changes
touch rendered UI.

**Assessment for this repo**: **ADOPT AND EXTEND.** This repo will ship
multiple web interfaces. Two reviewers is the minimum viable frontend roster.
The full suite should include: accessibility-reviewer, design-system-reviewer,
React/component-reviewer, and potentially a responsive/layout-reviewer.

### 1.4 Transferable Pattern Assessment

| Pattern | Applicable? | Notes |
|---------|-------------|-------|
| **Accessibility as blocking gate** | YES — with adaptation | MCP App iframes need a testing harness; standalone React apps can use standard Playwright + axe-core. The principle (zero-tolerance WCAG AA) is universal. |
| **Testing strategy for static content** | PARTIALLY | The 4-layer proof model is sound. Layer 1 (type-check, build, a11y) and Layer 3 (TDD when logic appears) are directly applicable. Layer 2 (theme/interactive) applies to the design token workspaces. Layer 4 (review) already exists. |
| **Design token governance** | YES — foundational | This is the basis for the new design token workspaces. Three-tier architecture, theme correctness proof, and render-blocking delivery are all directly applicable. |
| **Static-first architectural constraint** | PARTIALLY | Not directly applicable to MCP App views (they are interactive by nature). Applicable to any future static web surfaces. The principle of "runtime complexity requires justification" is universally useful. |

### 1.5 Provenance Index Linearity Issue

**Problem**: The provenance index uses linear integers (0, 1, 2, ...). Index
17 in one Practice history is not the same as index 17 in another. When
comparing incoming Practice Core files against local copies, the index
numbers create false equivalence — "both are at 17" does not mean "both have
the same history."

**Proposal**: Switch provenance entries from linear `index: N` to UUIDs.
This removes the implicit ordering confusion and makes each entry globally
unique across all Practice histories.

**Implementation considerations**:

- Old linear indices are not uniquely identifying and could be deleted without information loss (positional order is retained in the array) — this is metadata migration, not a runtime shim (R14)
- The provenance.yml schema in practice-lineage.md would need updating
- All repos carrying the Practice would need to adopt on their next integration
- The `date` field still provides chronological ordering
- UUID generation is trivial in any ecosystem (crypto.randomUUID() in Node.js)

**Action**: Propose this as a Practice Core evolution during integration.

---

## Part 2: Design Token Landscape Survey

### 2.1 How Existing Repos Handle Design Tokens

#### oak-components (official Oak component library)

- **Format**: TypeScript objects, not CSS/JSON/DTCG
- **Tiers**: Palette (`oakColorTokens` → hex) → UI Roles (`OakUiRoleToken` →
  semantic names like `text-primary`, `bg-btn-primary`) → Theme objects
  (`oakDefaultTheme`, `oakDarkTheme` map roles to palette keys)
- **Consumption**: styled-components theme + parser helpers (`parseColor`,
  `parseSpacing`). NOT CSS custom properties
- **Framework-locked**: React + styled-components + Next.js (peer deps)
- **Dark mode**: Two theme objects, explicit provider switching
- **A11y**: Storybook addon-a11y, semantic token usage guidance, no
  automated contrast metadata in tokens
- **Build**: Rollup → ESM + CJS bundle, tokens ship as compiled JS
- **Key insight**: Tokens are TS-first, not CSS-first. No framework-agnostic
  consumption path exists

#### Oak-Web-Application (main Oak web app)

- **Two parallel theme systems**: app-level styled-components theme (colors,
  spacing, fonts) AND oak-components theme (`OakThemeProvider`)
- **Uses oak-components**: `@oaknational/oak-components` ^2.11.1
- **Styling**: styled-components v5, no Tailwind, minimal CSS variables
- **A11y**: Pa11y CI + axe (post-deploy), dev-time @axe-core/react, Storybook
  addon-a11y. Some axe rules ignored (color-contrast, video-caption)
- **Visual regression**: Percy (post-deploy)
- **No WCAG level stated**: Compliance approached via automated checks
- **Key insight**: Dual theme system (app + oak-components) is complex. No
  framework-agnostic token layer

#### oak-ai-lesson-assistant (Oak AI lesson planner)

- **Triple styling stack**: Tailwind + styled-components + Radix Themes
- **Uses oak-components**: `@oaknational/oak-components` ^1.174.1
- **Tokens**: shadcn-style HSL CSS variables on `:root` and `.dark`, Oak-
  named Tailwind palette (`oakGrey*`, `pupils*`, `teachers*`, `mint`)
- **A11y**: Accessibility statement page, alt-text generation prompts. NO
  jsx-a11y ESLint plugin, NO axe suite found
- **Key insight**: Three competing styling systems. No centralised token
  governance

#### opal-connection-site (static Astro site — source of incoming Practice)

- **Format**: CSS custom properties in a single `tokens.css`
- **Tiers**: Palette (`--color-navy-900`) → Semantic (`--bg`, `--text`,
  `--accent` via `[data-theme]` selectors) → Component (`--button-primary-bg`)
- **Consumption**: Plain CSS `var()` references in Astro scoped styles
- **Framework-agnostic**: Pure CSS, no JS dependency
- **Dark mode**: `[data-theme]` attributes + `prefers-color-scheme` fallback
- **A11y**: Playwright + axe-core WCAG 2.2 AA, both themes, zero-tolerance
- **Render-blocking**: Tokens imported as `?raw` and injected via
  `<style set:html>` in `<head>`
- **Key insight**: Clean three-tier token architecture, framework-agnostic,
  accessibility as blocking gate. This is closest to what we want

#### starter-app-spike (Next.js 16 starter app)

- **Format**: Generated CSS (`generated-themes.css`) from TypeScript build
  scripts, 17 `custom-*` semantic tokens as CSS custom properties
- **Tiers**: Oak palette (via oak-components) → Custom semantic layer
  (`--custom-surface-primary`, etc.) → Component consumption
- **12-mode system**: light/dark × standard/high/low/CVD/monochrome
- **Framework**: Next.js 16, React 19, oak-components (feat branch), styled-
  components v6
- **A11y**: Playwright + axe (WCAG 2.1 AA), Pa11y multi-mode sweep, Storybook
  addon-a11y, high-contrast CSS for `prefers-contrast: more`
- **Key insight**: Most sophisticated token system. 12-mode matrix, generated
  CSS, accessibility-first. But tightly coupled to oak-components internals

### 2.2 Design Token Architecture Recommendations

Based on the survey, the new design token system should:

1. **Be framework-agnostic** — CSS custom properties as the delivery format,
   not TS objects or styled-components theme
2. **Use the three-tier model** — palette → semantic → component, with clear
   referencing rules (components → semantic → palette, never skipping tiers)
3. **Be a separate package** — not bundled inside a component library
4. **Support theming** — light/dark as minimum, with extensibility for
   high-contrast and reduced-motion modes
5. **Include contrast metadata** — WCAG AA compliance data in the token
   source, not just as post-hoc testing
6. **Generate multiple outputs** — CSS custom properties (primary), plus
   optional TS types, JSON (DTCG format), and SCSS variables
7. **Test themes automatically** — accessibility audit as a quality gate on
   the token package itself

### 2.3 Proposed New Workspaces

#### Workspace A: `@oaknational/design-token-harness` (or `@oaknational/design-tokens-core`)

**Purpose**: Framework-agnostic design token infrastructure.

- Token schema definition (DTCG-compatible or custom YAML/JSON)
- Build pipeline: source → CSS custom properties + TS types + JSON
- Tier enforcement (palette → semantic → component referencing rules)
- Contrast ratio validation (automated WCAG AA checks on token pairs)
- Theme structure (light/dark/high-contrast mode definitions)
- No runtime dependencies — pure build-time tool

#### Workspace B: `@oaknational/oak-design-tokens`

**Purpose**: Oak-specific design token set built on the harness.

- Oak colour palette, spacing scale, typography scale
- Oak semantic tokens (backgrounds, text, borders, interactive states)
- Oak theme definitions (default, dark, high-contrast)
- Oak component tokens (button, card, input, etc.)
- Generated CSS, TS, JSON outputs
- Accessibility audit gate (contrast ratios across all themes)
- Consumed by: React apps (MCP App views, future web UIs), static sites
  (Astro), potentially Oak-Web-Application and oak-ai-lesson-assistant

---

## Part 3: Specialist Agent Suite

### 3.1 Current State

The repo has **zero** frontend/UI specialist agents. The existing roster is
entirely backend-focused:

- **Standard**: code-reviewer, test-reviewer, type-reviewer, config-reviewer,
  security-reviewer, docs-adr-reviewer, 4× architecture-reviewer
- **Domain**: elasticsearch-reviewer, clerk-reviewer, sentry-reviewer,
  mcp-reviewer
- **Future planned (no UI)**: devx, express, OOCE, cyber-security, web-api-
  security, privacy, web-api-GDPR, TDD, planning

### 3.2 Proposed Frontend Specialist Agent Suite

All agents follow the ADR-129 Domain Specialist Capability Pattern: canonical
template + skill + situational rule + platform adapters.

| Agent | Scope | Key Assessment Areas | Doctrine |
|-------|-------|---------------------|----------|
| **accessibility-reviewer** | WCAG compliance, keyboard navigation, screen reader readiness, colour contrast, ARIA patterns, landmark structure | WCAG 2.2 AA compliance, axe-core rule coverage, theme-aware contrast, focus management, motion sensitivity | WCAG 2.2, WAI-ARIA 1.3, axe-core rules, Inclusive Design Principles |
| **design-system-reviewer** | Token usage consistency, component API correctness, visual regression triage, style containment, tier referencing rules | Token tier violations (palette used directly in components), missing semantic mappings, theme-unaware styles, hardcoded values | Design token governance doc, three-tier model, Oak brand guidelines |
| **react-component-reviewer** | Component architecture, hook patterns, render performance, accessibility integration, prop API design, composition patterns | Unnecessary re-renders, prop drilling vs context, hook rules violations, missing error boundaries, component responsibility | React docs (current), hook rules, composition over inheritance, server/client component boundary |
| **responsive-layout-reviewer** | Viewport adaptation, breakpoint consistency, fluid typography, container queries, mobile-first patterns | Missing breakpoints, inconsistent spacing across viewports, text overflow, touch target sizes, viewport-specific a11y | Responsive design best practices, WCAG 2.2 reflow (1.4.10), touch target size (2.5.8) |
| **css-architecture-reviewer** | Specificity management, cascade layers, custom property scoping, animation performance, theme integration | Specificity wars, !important usage, unscoped styles bleeding, layout shift, paint-heavy animations | CSS architecture patterns, BEM/utility/token approaches, performance budgets |
| **browser-testing-reviewer** | Test coverage across proof surfaces, visual regression baseline management, cross-browser compatibility | Missing a11y audit coverage, stale visual baselines, viewport coverage gaps, theme coverage gaps | Browser testing taxonomy (from incoming Core Proposal), testing strategy |

### 3.3 Relationship to Existing Plans

| Existing Plan | Relationship |
|--------------|--------------|
| **Agent Classification Taxonomy** (`future/`) | The new agents need classification metadata from the start. If the taxonomy plan executes first, the new agents adopt the new naming. If not, they use current naming and rename later. |
| **Reviewer Gateway Upgrade** (`future/`) | The gateway needs a new **UI/Frontend cluster** in its signal-routed triage model. Currently the domain cluster is all backend. |
| **WS3 Phases 4-5** (`active/`) | These phases build the React UI that the new agents would review. The agents should be available before Phase 4 begins. |
| **TDD Specialist** (`future/`) | The TDD specialist's multi-level test guidance should include browser proof surfaces. |

### 3.4 Priority and Sequencing

**Phase 1 (before WS3 Phase 4)**:

- accessibility-reviewer — universal, applicable immediately
- design-system-reviewer — needed for token work and React views
- react-component-reviewer — needed for Phase 4 React views (R3: create now for consistent patterns)

**Phase 2 (alongside WS3 Phase 5)**:

- responsive-layout-reviewer — needed for interactive search UI
- browser-testing-reviewer — needed for test coverage review

**Phase 3 (when CSS architecture matures)**:

- css-architecture-reviewer — needed when the token system is in use

---

## Part 4: Execution Plan

### Phase 0: Render Decision-Complete (estimate: 30 min)

Resolve every open question in Part 5 before implementation begins.
A plan that starts executing with unresolved decisions wastes time
re-deriving intent mid-stream.

1. **Workspace naming** — agree on names for both packages
2. **Token source format** — DTCG JSON vs custom YAML vs TypeScript
3. **Agent naming convention** — current `-reviewer` or new naming
4. **Packages location** — `packages/libs/` vs `packages/design/`
5. **oak-components relationship** — replace or coexist
6. **Provenance UUIDs** — adopt now or defer

### Phase 1: Practice Integration (estimate: 1-2 hours)

1. **Adopt Core Proposal: Browser Testing Taxonomy** — add browser proof
   surfaces to local testing-strategy.md, add 9th quality gate category
2. **Adopt Core Proposal: UI Reviewer Roster** — add accessibility-reviewer
   and design-system-reviewer guidance to invoke-code-reviewers.md
3. **Adopt transferable patterns** — create local references to the four
   pattern documents, adapt to MCP App context
4. **Update Practice Core provenance** — tell the story (R6): how frontend
   practice knowledge travelled from opal-connection-site's exploration,
   through practice-context proposals, into this repo's Practice Core.
   Both repos appear because both are part of the journey. Update CHANGELOG.
   Propose provenance UUID evolution (R14: old indices are not uniquely
   identifying; they could be deleted without information loss because
   positional order is retained — this is metadata, not code)
5. **Clear incoming** — after integration, clear practice-core/incoming/ and
   optionally clean practice-context/incoming/ of non-frontend notes that
   were already known
6. **test-reviewer pass** (R8) — invoke test-reviewer to review the
   testing-strategy.md changes as they are made, not after the fact

### Phase 1F: Documentation and ADRs (estimate: 2-3 hours)

Runs alongside or immediately after Phases 1A-1E. **Phase 1F must complete
before Phase 2 begins** — Phase 2 agents reference the ADRs and governance
docs in their reading requirements. This is a hard blocking prerequisite.

1. **Author ADR-144** — Browser Accessibility as a Blocking Quality Gate
2. **Author ADR-145** — Design Token Architecture
3. **Author ADR-146** — Frontend Specialist Reviewer Gateway Cluster
4. **Amend ADR-041** (R2) — add `packages/design/` category with dependency
   direction rules (see Part 6: ADR-041 Amendment)
5. **Amend ADR-121** (R4) — add `test:a11y` row to coverage matrix (see
   Part 6: ADR-121 Amendment)
6. **Author docs/governance/accessibility-practice.md** — WCAG 2.2 AA,
   Playwright + axe-core, MCP App HTML resource testing (R10), theme-aware.
   Include three-metric frontmatter (R9)
7. **Author docs/governance/design-token-practice.md** — DTCG format,
   three-tier model, authoring guide, build pipeline, consumption patterns.
   Include three-metric frontmatter (R9)
8. **Update ADR index** — add three entries to README.md (flat + categorised)
9. **Update governance README** — add two entries to docs/governance/README.md
10. **Update gates.md** — add `test:a11y` to the canonical gate sequence
    (after `test:ui`, before `smoke:dev:stub`)

All ADRs and governance docs must cross-reference each other. The governance
docs are the durable reference material that future workspace READMEs
(e.g. `packages/design/*/README.md`) will link to. See Part 6 for detail.

### Phase 2: Create Specialist Agents (estimate: 3-5 hours)

**Prerequisite**: Phase 1F must be complete (ADRs and governance docs exist).

1. **Create Phase-1 agents**: accessibility-reviewer, design-system-
   reviewer, react-component-reviewer — following ADR-129 triplet pattern.
   Reviewer reading requirements must include the new ADRs and governance
   docs (ADR-144, ADR-145, accessibility-practice.md, design-token-practice.md).
   Also update the code-reviewer.md template's reading requirements to
   reference the new cluster and its routing triggers
2. **Update gateway triage**: add UI/Frontend cluster to code-reviewer's
   triage model. Update discoverability/inventory (ADR-129 rollout step 5)
3. **Platform adapters**: Cursor, Claude Code, Codex, Gemini CLI adapters
   for all new agents
4. **Validation**: pnpm subagents:check, pnpm portability:check
5. **subagent-architect review** (R11): invoke subagent-architect to review
   all three triplets for naming, boundary, and duplication consistency

### Phase 3: Agent-Review Practice Integration (estimate: 2-3 hours)

The newly created agents review the Phase 1+2 output — the Practice
integration itself becomes the agents' first real review target.

**Cohort reviewers (new agents, exercising themselves):**

1. **accessibility-reviewer** — review the adopted testing taxonomy for
   completeness, check that the 9th gate covers the right axe-core rules.
   Review ADR-144 for completeness, correct WCAG version citation, and
   consistency with docs/governance/accessibility-practice.md
2. **design-system-reviewer** — review the design token governance pattern
   for consistency with the three-tier model. Review ADR-145 for completeness,
   correct DTCG spec citation, and consistency with
   docs/governance/design-token-practice.md

**Non-cohort reviewers (R12: mitigate circularity):**

3. **code-reviewer** — gateway triage of the Practice integration changes,
   exercising the new UI/Frontend cluster routing
4. **docs-adr-reviewer** — review all three ADRs, both governance docs, and
   the ADR-041/121 amendments for completeness, cross-reference consistency,
   and ADR index correctness. Check for drift between what ADRs decide and
   what Phase 1 implemented
5. **test-reviewer** — review the test:a11y integration in ADR-121 coverage
   matrix, gates.md positioning, and CI configuration
6. **subagent-architect** — review triplet quality, naming consistency, and
   boundary overlaps across all three new agents
7. **architecture-reviewer-barney** — simplification check on the overall
   change set; verify ADR-041 amendment is minimal
8. **architecture-reviewer-betty** — cohesion and coupling analysis of the
   new UI/Frontend cluster within the reviewer gateway
9. **architecture-reviewer-fred** — ADR compliance check across ADR-041,
   ADR-121, ADR-129, ADR-135, ADR-144, ADR-145, ADR-146
10. **architecture-reviewer-wilma** — resilience check on failure modes
    (what happens when a cluster agent is unavailable, circularity risks)

This bootstraps the agents with real review work and validates that the
Practice integration, agent definitions, and documentation are aligned.

### Phase 4: Design Token Infrastructure — BLOCKS Widget Work (estimate: 2-4 hours)

This phase must complete before WS3 Phases 4-5 begin. The goal is a
**correct foundation**, not a complete design system.

1. **Research**: Deep dive into DTCG token format, Style Dictionary, and
   modern token pipeline approaches (Cobalt, Tokens Studio)
2. **Create workspace A**: design token harness — token schema, build
   pipeline, tier enforcement, contrast validation
3. **Create workspace B**: Oak design tokens — basic Oak palette, initial
   semantic tokens (enough for widget alpha), light theme minimum
4. **Wire into Turbo**: build pipeline, type-check, lint, test
5. **Wire into WS3**: MCP App views consume the Oak design tokens
6. **Agent review**: design-system-reviewer + accessibility-reviewer
   validate the token foundation

**Gate**: Basic token infrastructure exists, builds, passes a11y checks,
and is consumable by the widget. Widget work may proceed.

### Phase 5: Provenance UUID Proposal (estimate: 30 min)

1. Draft the provenance.yml schema change
2. Document backwards compatibility approach
3. Add to Practice Core evolution considerations for next consolidation

### Phase 6: Tandem Improvement (ongoing, does NOT block widget)

After the gate clears, token system and widget design improve together:

1. **Token additions driven by widget needs** — as new UI patterns emerge
   in the widget, add the semantic and component tokens they require
2. **Widget adopts new tokens as they land** — no waiting for a "complete"
   token set; each token addition is immediately consumed
3. **Phase-2 agents come online** — responsive-layout-reviewer, browser-
   testing-reviewer, css-architecture-reviewer as the frontend matures
4. **Dark theme, high-contrast, and accessibility modes** — extend token
   coverage as the widget approaches production quality
5. **Feature-complete design token set** — eventually covers all Oak brand
   needs, consumable by any framework (React, Astro, static)

---

## Part 5: Resolved Decisions

All six open questions from the research phase have been resolved (2026-04-01).
A second round of 14 reviewer-surfaced decisions was resolved the same day.

### Research-Phase Decisions (Q1-Q6)

| Q | Decision | Rationale |
|---|----------|-----------|
| Q1 Workspace A name | `@oaknational/design-tokens-core` | Lives in `packages/design/` so no collision with `packages/core/` |
| Q2 Token source format | DTCG JSON | W3C emerging standard; framework-agnostic; interoperable with design tools; avoids TS-object trap |
| Q3 Agent naming | Current `-reviewer` convention | Consistent with 15 existing agents; rename later with taxonomy plan |
| Q4 Packages location | `packages/design/` | Design tokens are categorically different from libs (produce CSS, not TS APIs) |
| Q5 oak-components | No formal relationship | New token system is independent; oak-components used for colours/typefaces/sizing as a current convenience only |
| Q6 Provenance UUIDs | Propose now, adopt at next outgoing exchange | Use linear index 18 for opal-connection-site entry; draft UUID schema change as evolution proposal |

### Reviewer-Surfaced Decisions (R1-R14)

| R | Decision | Rationale |
|---|----------|-----------|
| R1 ADR-146 standalone? | Keep standalone | The cluster concept (cohort with overlap boundaries and inter-agent routing) is a new architectural pattern worth recording, distinct from ADR-129's triplet shape |
| R2 packages/design/ topology | Keep; amend ADR-041 | Design tokens are categorically different from libs. ADR-041 must be amended with the new category and dependency direction rules |
| R3 react-component-reviewer timing | Create now | Triplet cost is low; ready when WS3 Phase 4 starts; creating all three together ensures consistent patterns |
| R4 test:a11y in CI? | Yes — Playwright in CI | Use official Playwright patterns; avoid real network calls so GitHub Actions runner is sufficient without internet access |
| R5 Gate 5 vs Gate 9 | Testing reviewer cluster | Make the overall test reviewer a new cluster entry point. Split testing reviewers by test type, with shared principles in the entry point. Accessibility gets a distinct gate position AND a type-specific testing reviewer |
| R6 Provenance attribution | Storytelling, not credit attribution | Tell the story of how knowledge travels. "Think less boardroom, more Dreamtime." Both repos appear in the provenance chain because both are part of the journey |
| R7 ADR-135 naming deviation | Record in Risks | Acknowledge the deviation (new agents use `-reviewer` suffix despite ADR-135 deciding to drop it); commit to include these agents in the taxonomy rename batch |
| R8 test-reviewer involvement | Add to Phase 1 | Review testing-strategy.md changes as they are made, not after the fact |
| R9 Governance doc frontmatter | Full three-metric frontmatter | All new governance docs carry `fitness_line_count`, `fitness_char_count`, `fitness_line_length` |
| R10 MCP App iframe harness | Specify now; direct HTML resource testing | MCP App HTML resources are self-contained. For a11y testing, serve the resource content directly to a Playwright page — do not embed in an iframe. Inject design token CSS, run axe-core. The host's iframe embedding is the host's responsibility, not ours |
| R11 subagent-architect | Add to Phase 2 or Phase 3 | Reviews triplets for naming, boundary, and duplication consistency |
| R12 Phase 3 circularity | Add multiple non-cohort reviewers | Agents reviewing artefacts that define them creates weak circularity. Add architecture reviewers (Barney, Betty, Fred, Wilma) alongside existing non-cohort reviewers |
| R13 DTCG version strategy | Living spec reference | Link to current draft, note pre-W3C-Recommendation status, accept that the format may evolve. No version pin |
| R14 Provenance UUID compatibility | Metadata, not code | Old linear indices are not uniquely identifying — they could be deleted without information loss (positional order is retained). This is metadata migration, not a runtime shim; principles.md's "no compatibility layers" applies to code, not evolving metadata schemas |

---

## Part 6: Documentation and ADRs

This work is brand new UI/UX/a11y architecture. Three ADRs and two governance
docs capture the architectural decisions while they are fresh.

### ADR-144: Browser Accessibility as a Blocking Quality Gate

**File**: `docs/architecture/architectural-decisions/144-browser-accessibility-as-blocking-quality-gate.md`
**Related**: ADR-121 (quality gate surfaces — coverage matrix must be amended), ADR-129 (accessibility-reviewer is the enforcement agent)

Records the decision to:

- Add WCAG 2.2 AA compliance as a 9th blocking quality gate for all UI-shipping workspaces
- Use Playwright + axe-core as the test harness, running in CI (R4)
- Require both light and dark theme passes
- Define the MCP App HTML resource testing approach: serve the resource content directly to a Playwright page, inject design token CSS, run axe-core (R10). No iframe embedding — the host's sandbox is the host's responsibility
- Treat accessibility violations as blocking (zero-tolerance, no `skipRules`)
- Playwright tests must avoid real network calls so GitHub Actions runners can exercise them without internet access (R4)

### ADR-145: Design Token Architecture

**File**: `docs/architecture/architectural-decisions/145-design-token-architecture.md`
**Related**: ADR-041 (workspace structure — amended by this plan to add `packages/design/`), ADR-129 (design-system-reviewer enforces token governance), ADR-141 (MCP Apps standard — tokens must work inside MCP App HTML resources)

Records the decision to:

- Adopt DTCG JSON (W3C Design Tokens Community Group) as the source format
- Use a three-tier model: palette tokens -> semantic tokens -> component tokens
- Locate token workspaces in `packages/design/` (not `packages/libs/` or `packages/core/`)
- Output CSS custom properties as the primary delivery format (framework-agnostic)
- Maintain independence from `oak-components` (no formal relationship)
- Name the core package `@oaknational/design-tokens-core`
- Reference the DTCG spec as a living document (R13): link to the current draft, note that the spec is pre-W3C-Recommendation, accept that the format may evolve

Context section must cover: why not TypeScript objects (oak-components approach),
why not Tailwind config, why not CSS-in-JS, why DTCG over alternatives (Style
Dictionary format, Figma Tokens format). This is a "the industry is moving here"
decision worth recording while the rationale is fresh.

### ADR-146: Frontend Specialist Reviewer Gateway Cluster

**File**: `docs/architecture/architectural-decisions/146-frontend-specialist-reviewer-gateway-cluster.md`
**Related**: ADR-114 (code-reviewer gateway — this extends its routing model), ADR-119 (quality gate framework — cluster must align with gate taxonomy), ADR-125 (reviewer invocation governance), ADR-129 (triplet shape), ADR-135 (agent classification taxonomy — naming deviation acknowledged in Risks)

Records the decision to:

- Add a UI/Frontend triage cluster to the code-reviewer gateway (extending the routing model)
- Create three specialist agents as a cohort: accessibility-reviewer, design-system-reviewer, react-component-reviewer
- Define the routing triggers: rendered UI / CSS / tokens / React components -> UI cluster
- Establish overlap boundaries between the three UI specialists and existing reviewers
- Propose the testing reviewer cluster pattern (R5): make test-reviewer a cluster entry point, split testing reviewers by test type with shared principles in the entry point. This is a future-facing pattern documented here to influence the testing reviewer evolution

This ADR is distinct from ADR-129 because ADR-129 defines the triplet shape;
ADR-146 documents the architectural decision to create a **cluster** of related
specialists with inter-agent routing and overlap boundaries.

### Governance Documentation

Two governance documents provide durable, linkable reference material that future
workspace READMEs (e.g. `packages/design/*/README.md`) will link to.

Both docs carry the full three-metric frontmatter (R9):

```yaml
fitness_line_count: 150
fitness_char_count: 10000
fitness_line_length: 100
split_strategy: 'description of how to split if ceilings are exceeded'
```

**`docs/governance/accessibility-practice.md`**

- Target standard: WCAG 2.2 AA
- Testing approach: Playwright + axe-core in CI (R4)
- Rule configuration: which axe-core rules, why no skipRules
- MCP App HTML resource testing (R10): MCP App views are self-contained HTML. For a11y testing, serve the resource content directly to a Playwright page (not inside an iframe). Inject design token CSS for the target theme. Run axe-core. The host's iframe sandbox/CSP is the host's responsibility, not ours. This is the idiomatic approach — MCP App HTML resources are designed to be independently renderable
- Theme-aware testing: both light and dark themes must pass
- Landmark and contrast requirements
- Links to WCAG 2.2, WAI-ARIA 1.3, axe-core rule reference
- Cross-references ADR-144

**`docs/governance/design-token-practice.md`**

- What DTCG JSON is: W3C Design Tokens Community Group format, current spec status (pre-W3C-Recommendation), link to living spec (R13)
- Three-tier model explained: palette -> semantic -> component, with examples
- Authoring guide: how to write `tokens/*.json` files in DTCG format
- Build pipeline overview: DTCG JSON -> CSS custom properties (and potential future targets)
- Consumption patterns: how downstream packages import the generated CSS
- Relationship to `oak-components`: independent, no coupling
- Links to W3C DTCG spec, Style Dictionary docs, Design Tokens W3C Community Group
- Cross-references ADR-145

### ADR Index Update

Add three entries to `docs/architecture/architectural-decisions/README.md` in both
the flat chronological list **and** the appropriate categorised sections:

```markdown
- [ADR-144: Browser Accessibility as a Blocking Quality Gate](144-browser-accessibility-as-blocking-quality-gate.md)
- [ADR-145: Design Token Architecture](145-design-token-architecture.md)
- [ADR-146: Frontend Specialist Reviewer Gateway Cluster](146-frontend-specialist-reviewer-gateway-cluster.md)
```

### ADR-041 Amendment (R2)

Amend `docs/architecture/architectural-decisions/041-workspace-structure-option-a.md`
to add `packages/design/` as a fifth workspace category. Update the dependency
direction table:

| Importer | design | Constraint |
|----------|--------|------------|
| design | — | No monorepo dependencies outside `design`; builds produce CSS, not TS APIs |
| apps | yes | Apps consume design token CSS |
| core | no | Core is provider-neutral; no visual dependencies |
| libs | no | Libs are runtime libraries; design tokens are consumed by apps |
| sdks | no | SDKs produce data, not visual output |

Update the "Updated" date and add a note in Consequences recording why
`packages/design/` is a distinct category (produces CSS artefacts, not TS APIs;
categorically different from foundation libs, adapter libs, and SDKs).

### ADR-121 Amendment (R4)

Amend `docs/architecture/architectural-decisions/121-quality-gate-surfaces.md` to
add `test:a11y` to the coverage matrix:

| Check | pre-commit | pre-push | CI workflow | pnpm qg | pnpm check |
|-------|------------|----------|-------------|---------|------------|
| test:a11y | -- | Yes | Yes (UI-shipping workspaces) | Yes | Yes |

Add a rationale note: `test:a11y` runs in CI (unlike `test:ui`) because
accessibility regressions are blocking quality gate violations. Playwright tests
use the official Playwright patterns and avoid real network calls, so the GitHub
Actions runner is sufficient without internet access.

### Governance README Update

Update `docs/governance/README.md` contents list to include the two new
governance docs (`accessibility-practice.md`, `design-token-practice.md`).

### Gates Command Update

Update `.agent/commands/gates.md` to include `test:a11y` in the canonical gate
sequence. Position: after `test:ui` and before `smoke:dev:stub`.

---

## Part 7: Quality Gates, Non-Goals, and Risks

### Quality Gates

After each phase, run gates one at a time:

```bash
pnpm subagents:check      # After Phase 2 agent creation
pnpm portability:check    # After Phase 2 adapter creation
pnpm markdownlint:root    # After all Practice doc edits AND after ADR/governance doc creation
pnpm format:root          # After all edits
pnpm practice:fitness:informational  # Soft-ceiling check on edited docs
```

### Non-Goals (Phases 0-3)

- **Token infrastructure** (Phase 4 in this plan) — deferred, not in scope for Phases 0-3. The governance docs and ADR-145 describe the architecture; `packages/design/` workspaces are not created yet
- **Provenance UUID adoption** — proposed only, not adopted this session
- **Phase 2/3 agents** (responsive-layout-reviewer, browser-testing-reviewer, css-architecture-reviewer) — deferred until WS3 Phase 5
- **oak-components migration** — no relationship; out of scope entirely
- **Agent Classification Taxonomy rename** — deferred to future plan

### Risks

| Risk | Mitigation |
|------|------------|
| testing-strategy.md exceeds fitness ceiling after browser proof surfaces addition | Split into companion file if needed; use the split_strategy in its frontmatter |
| Expert skills reference web docs that may not be accessible | Doctrine hierarchy (ADR-129) says "fetched live from the web" — if unavailable, fall back to official package/SDK docs |
| Gateway triage routing may not trigger correctly in Phase 3 | Phase 3 is explicitly a validation step; fix the routing if it fails |
| Practice Core edits create provenance index 18 — must be consistent across all three trinity files | Update all three chains in provenance.yml simultaneously |
| ADRs and governance docs could drift from each other or from the Practice changes | Phase 3 explicitly uses docs-adr-reviewer to check cross-reference consistency |
| DTCG spec is still a draft W3C community report — may evolve | ADR-145 records current spec status; governance doc links to living spec URL (R13) |
| **ADR-135 naming deviation** (R7): New agents use `-reviewer` suffix despite ADR-135 deciding to drop it | Intentional tech debt. All three agents will be included in the taxonomy rename batch when the Agent Classification Taxonomy plan executes. Record this deviation in ADR-146 and reference ADR-135 |
| **Phase 1F temporal coupling to Phase 2**: Phase 2 agents reference Phase 1F ADRs and governance docs in their reading requirements | Hard blocking prerequisite — Phase 1F must complete before Phase 2 begins (made explicit in the execution plan) |
| **ADR-041 amendment scope**: Adding `packages/design/` could be seen as a significant topology change | Amendment is minimal — one new row in the dependency table, one new paragraph in Consequences. The existing four categories are not changed |
| **Testing reviewer cluster evolution** (R5): The proposed pattern of making test-reviewer a cluster entry point is not implemented in this plan | Document the pattern in ADR-146 as a future-facing recommendation. The implementation belongs in a separate plan |
| **Phase 3 reviewer volume**: Ten reviewers in Phase 3 creates a large feedback surface | Accept the cost — this is a one-time validation of a significant architectural expansion. Parallelize reviewer dispatch |
