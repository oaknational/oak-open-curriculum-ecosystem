# @oaknational/env

Runtime environment helpers for JavaScript runtimes.

## TODO: Package Naming and Scope

**Current State**: This package is named `@oaknational/env`, which suggests it provides shared configuration logic for applications. However, its actual purpose is:

1. **Runtime Adapter**: Provides helpers for environment-dependent behaviors (finding repo root, loading .env files across different JS runtimes)
2. **Configuration Helpers**: Utilities that applications use to build their own config layers
3. **NOT Application Config**: Does NOT provide shared configuration logic or manage app-specific env vars

**Proposed Actions**:

- Consider renaming to better reflect purpose: `@oaknational/runtime-helpers` or `@oaknational/env-helpers`
- Add documentation on recommended config management patterns for applications
- Clarify that each app manages its own configuration (validation, composition, DI)

**Note**: Each application MUST manage its own configuration using patterns like:

- Zod schema validation in app-level `env.ts`
- Config composition in app-level `runtime-config.ts`
- Dependency injection throughout the app

This package provides **tools**, not **policy**.
