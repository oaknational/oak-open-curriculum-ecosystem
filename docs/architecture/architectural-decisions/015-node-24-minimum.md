# ADR-015: Node.js 24.x Requirement

## Status

Accepted (updated from Node.js 22+)

## Context

We need to decide on the minimum Node.js version to support. This affects:

- Available language features
- API availability
- ESM support quality
- Performance characteristics
- Security updates

## Decision

Require Node.js version 24.x.

This supersedes the original decision of Node.js 22+. The move to 24.x was
made to take advantage of improvements in ESM loader behaviour, native
TypeScript support (via `--experimental-strip-types`), and V8 performance
gains.

## Rationale

- **ESM Maturity**: Node.js 24 has production-quality ESM support
- **Native TypeScript Support**: Experimental type stripping reduces toolchain
  dependencies for simple scripts
- **Modern Features**: Access to latest JavaScript features including
  `Promise.withResolvers`, `Array.fromAsync`, and stable `Intl.Segmenter`
- **Performance**: Significant V8 and garbage collection improvements
- **Security**: Latest security fixes and updates
- **No Legacy Burden**: Can use modern patterns without polyfills

## Consequences

### Positive

- Can use latest JavaScript/TypeScript features
- Better ESM support out of the box
- Improved performance and security
- Cleaner code without compatibility workarounds
- Access to newer Node.js APIs
- Native type stripping available for scripts and CLI tools

### Negative

- Limits adoption by users on older Node versions
- May not work in some enterprise environments
- Requires developers to update Node.js
- Some CI/CD systems may need updates

## Implementation

- Set `"engines": { "node": "24.x" }` in all workspace `package.json` files
- Document requirement in README and CONTRIBUTING
- Configure TypeScript target appropriately
- Use Node.js 24 features freely
- Test against Node.js 24 in CI
- Provide clear error message for older versions
