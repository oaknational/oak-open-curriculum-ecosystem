# Testing Strategy for Static and Content Projects

> **Origin**: opal-connection-site, 2026-03-28
> **Source evidence**: static Astro site where primary output is HTML/CSS, not
>   application logic
> **Status**: Transferable pattern for content-first repos

## The Problem

The Practice's testing philosophy assumes the primary output is *code that
executes*: pure functions, state transitions, domain logic. TDD is the default,
and rightly so.

But some projects primarily produce *rendered content*: landing pages, docs
sites, marketing surfaces, design systems. The code is infrastructure for the
content, not the product itself. Applying backend TDD vocabulary directly leads
to either fake tests (asserting that static markup contains literal strings) or
no tests at all (because "there's nothing to TDD").

## The Pattern

Use a layered proof strategy that matches proof surfaces to risk:

### Layer 1: Always blocking (infrastructure correctness)

| Gate | What it proves |
| ---- | -------------- |
| Type-check | Template types, prop contracts, config validity |
| Build | The production artefact assembles without error |
| Accessibility audit | Rendered output meets WCAG compliance |

These gates prove the *output* is correct without testing implementation
details. They run on every change and block unconditionally.

### Layer 2: Blocking when present (behavioural correctness)

| Gate | What it proves |
| ---- | -------------- |
| Theme/mode tests | Alternate visual modes work correctly |
| Interactive behaviour tests | Client-side JS behaves as specified |
| Component integration tests | Composed components render correctly |

These gates prove *behaviour* when the project has interactive elements.
They are blocking when installed but not required for purely static content.

### Layer 3: TDD (when logic appears)

When non-trivial logic, state transitions, data transforms, or reusable
utilities appear, TDD applies with the same rigour as any backend project.
The trigger is the *nature of the code*, not the *type of project*.

### Layer 4: Review and manual verification

Content alignment (does the page say what it should?), visual quality (does it
look right?), and narrative flow (does it persuade?) cannot be automated. These
are verified through reviewer scrutiny and targeted manual checks, documented
in the plan's validation section.

## How It Works Here

```
Layer 1: pnpm typecheck + pnpm build + pnpm test:a11y
Layer 2: Theme behaviour tests in tests/accessibility.spec.ts
Layer 3: Not yet needed — no non-trivial logic
Layer 4: Code-reviewer + content comparison against one-pager
```

The testing-strategy directive (`testing-strategy.md`) makes this explicit:
"For content, layout, and other static-site edits that do not yet justify a
test harness, prove the change with astro check, production build, targeted
manual verification, and reviewer scrutiny."

## When to Adopt

Any project where the primary output is rendered content rather than executable
logic. This includes:

- Landing pages and marketing sites
- Documentation sites
- Design system showcases (Storybook, pattern libraries)
- Email templates
- Static API documentation

## Anti-Patterns

- Writing tests that assert static markup contains literal strings — these are
  tautologies, not proof
- Skipping all testing because "it's just content" — infrastructure gates
  (build, type-check, accessibility) still catch real regressions
- Deferring TDD when logic does appear because the project "isn't that kind
  of project" — TDD triggers on code complexity, not project type
