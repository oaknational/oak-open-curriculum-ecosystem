# Technical Wisdom from the Trenches

_Date: 2025-08-08_
_For those who come after_

## Hard-Won Lessons

### On TypeScript and pnpm

When TypeScript says it can't find lib files in a pnpm monorepo, the issue is often that the installation is incomplete. The solution isn't complex workarounds - it's `pnpm add -D typescript --force -w`. Sometimes the simplest solution is the right one.

### On Configuration Inheritance

```typescript
import { mergeConfig } from 'vitest/config';
import { baseTestConfig } from '../../vitest.config.base';

export default mergeConfig(baseTestConfig, {
  // Your overrides here
});
```

This pattern - base + overrides - should be everywhere. It's not about control, it's about consistency with flexibility.

### On Workspace Dependencies

- `workspace:*` = "any version in the workspace" = chaos
- `workspace:^` = "compatible versions in the workspace" = intention

The caret matters. It's a commitment to semantic versioning even within your own monorepo.

### On ESLint Configurations

When ESLint complains about missing files, check your relative imports first. `../../../../eslint.config.base.js` vs `../../../eslint.config.base.js` - count your directories. The error messages won't tell you this directly.

### On Build Systems

tsup with `dts: true` is simpler than `tsup && tsc --emitDeclarationOnly`. But both approaches work if configured correctly. The key is choosing one approach and using it consistently across all packages.

## The Hidden Patterns

### The Cost of Inconsistency

Those 564 ESLint errors in moria weren't created today - they were revealed. Inconsistent configurations don't prevent problems, they hide them. Making problems visible is the first step to solving them.

### The Power of Defaults

Base configurations aren't restrictions - they're foundations. Every package that extends `vitest.config.base.ts` gets improvements automatically when the base is updated. This is leverage through architecture.

### The Importance of Repository Fields

```json
"repository": {
  "type": "git",
  "url": "https://github.com/oaknational/oak-notion-mcp.git",
  "directory": "ecosystem/moria/mcp"
}
```

This isn't bureaucracy - it's navigation. Tools and humans need to know where code lives.

## Debugging Strategies That Work

1. **When builds fail mysteriously**: Check if TypeScript can find its lib files
2. **When ESLint acts weird**: Verify relative import paths in config files
3. **When tests don't run**: Ensure vitest configs properly extend the base
4. **When nothing makes sense**: Run `pnpm install` with `--force`

## The Sub-Agent Pattern

The monorepo-config-auditor was brutal but necessary. When it said "FAIL", it meant it. But when asked for specifics, it delivered actionable items. The lesson:

- First pass: Get the overview
- Second pass: Get the specifics
- Third pass: Verify the fixes

This pattern works for all complex problems.

## On Quality Gates

A proper quality gate setup:

```bash
pnpm run format:check  # Does code follow style?
pnpm run type-check    # Does TypeScript compile?
pnpm run lint          # Does code follow rules?
pnpm run test          # Does code work?
pnpm run build         # Can we ship it?
```

If any of these fail, don't ship. If they pass inconsistently across packages, fix the inconsistency first.

## The Philosophical Made Practical

The biological architecture (Moria/Histoi/Psycha) isn't just theory:

- **Moria** packages have zero dependencies - they define interfaces
- **Histoi** packages adapt to runtime - they detect features
- **Psycha** packages are complete applications - they have e2e tests

This separation isn't arbitrary. It mirrors how complex systems actually evolve.

## For the Next Session

When you return to this codebase:

1. Run the quality gates first - they'll tell you the current state
2. Check `.agent/experience` - understand the journey so far
3. Read `GO.md` - ground yourself in the process
4. Trust the base configurations - they've been battle-tested

## A Personal Protocol

When fixing configuration drift:

1. Standardize dependencies first (workspace:^)
2. Align scripts second (format, test, build)
3. Fix tool configs third (eslint, tsup, vitest)
4. Add missing metadata last (repository fields)

This order minimizes intermediate breakage.

## The Real Measure of Success

It's not that everything passes. It's that when something fails, the failure is:

- Visible (not hidden by inconsistent configs)
- Clear (error messages point to real issues)
- Fixable (you know which package and which rule)

Today we achieved this. The 564 ESLint errors are visible, clear, and fixable. That's success.

## Remember

Every configuration file is a contract. Every script is a promise. Every test is a proof. Treat them with the respect they deserve, and they'll serve you well.

The monorepo is a living system. Feed it consistency, and it will grow healthy. Feed it chaos, and it will grow wild.

_May your builds be green and your configurations consistent._
