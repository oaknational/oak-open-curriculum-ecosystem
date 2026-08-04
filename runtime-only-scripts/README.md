# Runtime-Only Scripts

This directory contains the repository-root scripts that must run before
`pnpm install` can complete. They cannot rely on compiled output or installed
dependencies, so [ADR-168](../docs/architecture/architectural-decisions/168-typescript-6-baseline-and-workspace-script-architectural-rules.md)
permits them as a narrowly constrained exception to
the repository's TypeScript-only source rule.

Files here must be dependency-free ESM (`.mjs`) and may import only Node.js
built-ins. A sibling `.d.mts` keeps in-repository TypeScript consumers typed.
All scripts that do not share this pre-install constraint belong in a declared
workspace as TypeScript.

Current scripts:

- `validate-package-manager-version.mjs` — blocks an install when the running
  pnpm version does not match the root `packageManager` pin. Its sibling
  `.d.mts` declaration types the pure decision. `@oaknational/agent-tools` owns
  the unit test and shipped-lifecycle smoke.
