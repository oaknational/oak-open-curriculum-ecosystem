# ADR-010: Use tsup for Bundling

## Status

Accepted

## Context

We need a build tool that can:

- Bundle TypeScript to JavaScript
- Generate TypeScript declarations
- Support ESM output
- Handle Node.js specifics (shebang, externals)
- Be fast and simple to configure

Options considered: webpack, rollup, esbuild, tsup

## Decision

Use tsup as the bundling tool for the project.

## Rationale

- **Zero Config**: Works out of the box with sensible defaults
- **Built on esbuild**: Extremely fast build times
- **TypeScript First**: Excellent TypeScript support including .d.ts generation
- **ESM Support**: Native support for ESM output
- **Simple Configuration**: Minimal configuration required
- **Active Maintenance**: Well-maintained with regular updates

## Consequences

### Positive

- Fast build times improve developer experience
- Simple configuration reduces maintenance burden
- Built-in TypeScript declaration generation
- Good defaults mean less configuration
- Supports our ESM-only approach

### Negative

- Less flexibility than webpack for complex scenarios
- Another tool to learn (though minimal API)
- Depends on esbuild which may have edge case issues

## Implementation

- Configure in `tsup.config.ts`
- Output ESM format only
- Enable TypeScript declarations
- Bundle dependencies except Node built-ins
- Add shebang for CLI execution
- Use source maps for debugging
