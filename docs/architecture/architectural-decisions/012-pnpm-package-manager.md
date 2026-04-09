# ADR-012: Use pnpm as Package Manager

## Status

Accepted

## Context

We need to choose a package manager for dependency management. Options include:

- npm (default Node.js package manager)
- Yarn (classic or berry)
- pnpm (performant npm)

The choice impacts installation speed, disk usage, dependency resolution, and monorepo support.

## Decision

Use pnpm as the package manager for this project.

## Rationale

- **Disk Efficiency**: Uses hard links to save disk space with shared dependencies
- **Speed**: Faster installation times through efficient caching
- **Strictness**: Prevents phantom dependencies by default
- **Monorepo Ready**: Excellent workspace support for future ecosystem growth
- **Security**: Stricter dependency isolation prevents accidental imports
- **Compatibility**: Drop-in replacement for npm commands

## Consequences

### Positive

- Faster CI/CD builds through better caching
- Saves disk space in development environments
- Catches dependency issues early
- Prepared for monorepo evolution
- Better security through isolation

### Negative

- Developers need pnpm installed globally
- Some tools may have compatibility issues
- Different lock file format (pnpm-lock.yaml)
- Slightly different behavior from npm

## Implementation

- Use `pnpm` for all package operations
- Commit `pnpm-lock.yaml` to version control
- Document pnpm requirement in README
- Configure CI/CD to use pnpm
- Prefer `pnpm-workspace.yaml` for install and workspace behaviour; use a
  project `.npmrc` only for npm-compatible registry and auth settings (see
  [build-system.md](../../engineering/build-system.md#pnpm-workspace-configuration))
- Use `pnpm` in all scripts and documentation
