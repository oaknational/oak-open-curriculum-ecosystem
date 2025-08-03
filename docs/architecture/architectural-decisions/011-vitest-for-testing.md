# ADR-011: Use Vitest for Testing

## Status

Accepted

## Context

We need a testing framework that:

- Supports ESM natively
- Has excellent TypeScript support
- Provides fast test execution
- Integrates well with our toolchain
- Supports our "no mocks in unit tests" philosophy

Options considered: Jest, Vitest, Node.js test runner

## Decision

Use Vitest as the testing framework.

## Rationale

- **ESM Native**: Built with ESM support from the ground up
- **Vite Powered**: Leverages Vite's fast transformation pipeline
- **Jest Compatible**: Familiar API for developers coming from Jest
- **TypeScript Support**: First-class TypeScript support without configuration
- **Fast Execution**: Significantly faster than Jest for our use case
- **Watch Mode**: Excellent watch mode with smart test detection

## Consequences

### Positive

- Fast test execution improves developer feedback loop
- No configuration needed for TypeScript/ESM
- Compatible with existing Jest knowledge
- Built-in coverage support
- Excellent IDE integration

### Negative

- Newer tool with smaller ecosystem than Jest
- Some Jest plugins may not be compatible
- Team needs to learn minor API differences

## Implementation

- Use default Vitest configuration
- Organize tests alongside source files
- Use `.test.ts` suffix for test files
- Configure coverage thresholds
- Enable watch mode for development
- Use built-in assertions and matchers
