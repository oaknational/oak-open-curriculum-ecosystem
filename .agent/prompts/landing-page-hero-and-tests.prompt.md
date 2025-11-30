# Landing Page Hero Text and Playwright Tests

## Task

Implement two enhancements to the MCP server landing page:

1. **Add prominent hero explainer text** at the top of the page, under the title
2. **Add minimal Playwright test** for basic functionality including accessibility

## Context

The landing page is at `apps/oak-curriculum-mcp-streamable-http/src/landing-page.ts`. It renders an HTML page explaining how to connect to the Oak Curriculum MCP server.

## Requirements

### 1. Hero Explainer Text

Add a prominent paragraph immediately after the `<h1>` title that:

- Explains what the Oak Curriculum MCP server does in 1-2 sentences
- Uses clear, welcoming language for teachers/educators
- Fits the existing visual design (dark mode support, Oak branding)

### 2. Playwright Test

Create a minimal Playwright test that:

- Verifies the landing page loads and contains key content
- Runs axe-core accessibility checks
- Lives at `apps/oak-curriculum-mcp-streamable-http/tests/visual/landing-page.spec.ts` (or update existing)
- Follows TDD approach per `.agent/directives-and-memory/testing-strategy.md`

## Rules

Read and follow these before implementation:

- `.agent/directives-and-memory/rules.md` - Core development rules
- `.agent/directives-and-memory/testing-strategy.md` - TDD approach, test types, no complex mocks

Key points:

- Test behaviour, not implementation
- Keep tests minimal and focused on proving useful things
- Use axe-core for accessibility (already available via `@axe-core/playwright`)
- No complex logic in tests

## Verification

After implementation:

1. `pnpm type-check` - no type errors
2. `pnpm lint` - no lint errors
3. `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:ui` - tests pass
4. `pnpm test:all` - all tests pass

## Files to Review

- `apps/oak-curriculum-mcp-streamable-http/src/landing-page.ts` - Current implementation
- `apps/oak-curriculum-mcp-streamable-http/tests/visual/` - Existing Playwright tests
- `apps/oak-curriculum-mcp-streamable-http/playwright.config.ts` - Test configuration
