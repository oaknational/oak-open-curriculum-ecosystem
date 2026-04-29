# ADR-168: TypeScript 6 Baseline and Workspace-Script Architectural Rules

**Status**: Accepted
**Date**: 2026-04-29
**Related**:
[ADR-150](150-continuity-surfaces-session-handoff-and-surprise-pipeline.md) —
surprise pipeline; this ADR is the enforcement-layer landing for two
surprises captured in
[`napkin.md` §"2026-04-29 — TS6 migration myopia"](../../../.agent/memory/active/napkin.md):
the workspace-to-root-script architectural smell and the cwd-trap that
would have applied to any vendor `ignoreCommand` shape;
[`.agent/plans/architecture-and-infrastructure/active/typescript-6-migration-and-workspace-script-rules.plan.md`](../../../.agent/plans/architecture-and-infrastructure/active/typescript-6-migration-and-workspace-script-rules.plan.md) —
the executable plan whose closure this ADR records;
[`apps/oak-curriculum-mcp-streamable-http/runtime-only-scripts/`](../../../apps/oak-curriculum-mcp-streamable-http/runtime-only-scripts/) —
canonical reference instance of the dedicated no-compile-no-deps
directory.

## Context

The TypeScript `^5` → `^6` upgrade introduced three breaking-default
changes that surfaced across every workspace in this monorepo:

- **TS5101**: `baseUrl` is deprecated and emits a compiler diagnostic
  in every config that declares it. The repo had `baseUrl: "."`
  declared in `tsconfig.base.json` and re-declared redundantly across
  21 per-workspace tsconfigs. Zero `paths` aliases consume `baseUrl`
  anywhere; under `moduleResolution: "bundler"` the option is inert.
- **`types: []` empty default**: TS6 changed the default `compilerOptions.types`
  from "all `@types/*` packages auto-included" to "no ambient types".
  Every workspace that depended on `@types/node` for `URL`,
  `URLSearchParams`, `node:fs`, `node:path`, or `import.meta.url`
  silently lost those types and had to be retro-fitted with
  `types: ["node"]`.
- **TS5011 stricter `rootDir` inference**: under TS6, build configs
  with `noEmit: true` and an `outDir` triggered different `rootDir`
  inference than under TS5. Four `tsconfig.build.json` files
  (`packages/core/result`, `packages/core/type-helpers`,
  `packages/sdks/oak-search-sdk`, `packages/sdks/oak-curriculum-sdk`)
  had been relying on the implicit inference. Agent-tools'
  `vitest.config.ts` hit a separate TS6059 error because TS6 changed
  the same inference path when `outDir` is set with `noEmit: true`.

A grounded run of `pnpm build` and `pnpm type-check` after the dep
bump revealed all three classes simultaneously. Reading the staged
diff for the rootDir fix surfaced an unrelated **architectural smell**
the owner already wanted addressed:

```jsonc
// apps/oak-curriculum-mcp-streamable-http/package.json
"build": "node ../../scripts/run-tsx-development.mjs esbuild.config.ts",
```

Workspaces were calling scripts from the repo root via
`node ../../scripts/...`. That pattern silently couples each workspace
to its parent's filesystem layout, breaks `pnpm` workspace boundaries
(workspaces are supposed to be self-contained packages addressable by
name, not by relative path), and prevents a workspace from being
extracted, mirrored, or moved without dragging the root along.

A separate question emerged: workspace scripts in `scripts/` and
`build-scripts/` were a heterogeneous mix of `.mjs`, `.js`, and `.ts`
with no contract about which extension means what. The `.mjs`
extension was inherited from a no-compile-no-deps Vercel
`ignoreCommand` constraint (Vercel's ignore script runs **before**
`pnpm install`, so it cannot import from `node_modules` or use a
build step), but it had spread to scripts that had no such constraint.

## Decision

This ADR ratifies four rules plus a pre-existing Husky carve-out, all
of which the `fix/build_issues` branch's five preceding commits have
already implemented (`a34f8402`, `d9018628`, `72bf1d90`, `72c3fe89`,
`1f991a4b` — see History below for the per-commit mapping). The rules
apply repo-wide and are enforced in code review going forward.

### 1. TypeScript 6 baseline (`tsconfig.base.json`)

The canonical base config carries:

```jsonc
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "lib": ["ES2023"],
    "moduleResolution": "bundler",
    "customConditions": ["development"],
    "types": ["node"], // TS6: explicit; was implicit under TS5
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "erasableSyntaxOnly": true, // schema-first execution invariant
    "sourceMap": true,
    "skipLibCheck": true,
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noEmit": true,
  },
}
```

`baseUrl` is **not** declared at any level. Workspaces MUST NOT
re-declare `baseUrl` in their own `tsconfig.json` files. Module
resolution under `moduleResolution: "bundler"` is unaffected by the
removal because no `paths` aliases are configured anywhere.

`rootDir: "./src"` is the canonical convention for **build configs
only** (`tsconfig.build.json`). The workspace-level `tsconfig.json`
does not set `rootDir`; it inherits from the base. Build configs that
emit declarations (`declaration: true`) MUST set `rootDir` explicitly
to avoid TS6's stricter inference picking the workspace root and
emitting `dist/` files at the wrong nesting.

### 2. Workspace-script-ban: workspaces MUST NOT call scripts from the repo root

Workspace `package.json` scripts MUST NOT invoke commands of the form
`node ../../scripts/...`, `node ../../../scripts/...`, or any other
relative path that escapes the workspace boundary. Workspaces are
self-contained packages addressable by name; they do not depend on
their parent's filesystem layout.

The replacement pattern is **`pnpm exec tsx <relative-path-within-workspace>`**:

```jsonc
// Before (banned):
"build": "node ../../scripts/run-tsx-development.mjs esbuild.config.ts"

// After (canonical):
"build": "pnpm exec tsx esbuild.config.ts"
```

If a workspace genuinely needs a helper that lives outside its own
tree, the helper MUST be a workspace package (declared under
`packages/`, `apps/`, or `agent-tools/`) and consumed via its
`@oaknational/*` package name.

### 3. All workspace scripts MUST be TypeScript

Workspace scripts MUST be `.ts` files invoked via `pnpm exec tsx`.
JavaScript (`.js`, `.mjs`) scripts in workspaces are forbidden.

This rule applies to `scripts/`, `build-scripts/`, `smoke-tests/`,
and any other workspace-internal script directory. The TypeScript
constraint exists because:

- Type-checking catches errors at edit time, not invocation time.
- `tsc` and `tsx` understand the same module-resolution rules as
  the rest of the codebase, so imports work identically.
- `pnpm exec tsx` runs the `.ts` source directly without a build
  step, so the development feedback loop is the same as `node`.
- Knip and ESLint can reason about `.ts` files using the workspace's
  TypeScript project; they cannot for `.mjs`.

### 4. The `runtime-only-scripts/` exception

A single legitimate exception exists: scripts that MUST run **before**
`pnpm install` completes (the canonical example is Vercel's
`ignoreCommand`, which runs before any workspace dependencies are
installed). Such scripts cannot have a build step (no `tsc` or `tsx`
is available pre-install) and cannot import from `node_modules`
(no dependencies are installed yet).

These scripts MUST live in a per-workspace dedicated directory named
`runtime-only-scripts/`. The directory name is load-bearing — it
makes the special case visible to readers and prevents the
no-compile-no-deps pattern from spreading to scripts that don't
need it.

`runtime-only-scripts/` files MUST be `.mjs` (not `.ts`) because
`.ts` requires a build step or a runtime stripper. The `.mjs`
extension is the explicit signal that this file runs in a constrained
environment.

The repo's canonical reference instance is:

```text
apps/oak-curriculum-mcp-streamable-http/runtime-only-scripts/
├── README.md                                           # documents the constraint
├── vercel-ignore-production-non-release-build.mjs      # the script itself
├── vercel-ignore-production-non-release-build.d.mts    # types for the .mjs
└── vercel-ignore-production-non-release-build.unit.test.mjs
```

ESLint and TypeScript treat `runtime-only-scripts/` as a tooling tier
with relaxed structural rules (matching the existing
`build-scripts/**/*.{js,mjs}` override) because the no-compile-no-deps
constraint forces inlined vendored helpers and direct `process.env`
access.

### Pre-existing exception: Husky entry points

Husky's hook entry points (`.husky/{pre-commit,commit-msg,pre-push}`,
`scripts/check-commit-message.sh`, `scripts/log-commit-attempt.sh`)
remain `.sh` because Husky requires shell-script entry points. This
is a pre-existing exception, not a new one. The hooks delegate to
TypeScript implementations via `pnpm exec tsx` wherever the work
itself is non-trivial.

## Consequences

### Enforced

- **Code review** rejects any new workspace `package.json` that
  introduces `node ../../scripts/...`-style invocations.
- **Code review** rejects any new `.js` or `.mjs` script in a
  workspace `scripts/` or `build-scripts/` directory.
- `runtime-only-scripts/` directories are explicitly authorised
  per-workspace; new ones require ADR amendment with a documented
  pre-install constraint.

### Carried forward

- **Test config coupling**: 19 workspaces' `vitest.config.ts` files
  import from `../../../vitest.config.base.ts`. This is the same
  shape as the workspace-to-root-script ban but for **configs**,
  not **scripts**. Whether configs are subject to the same ban is
  an open question; this ADR does not resolve it. A separate plan
  ([`config-architecture-standardisation-plan.md`](../../../.agent/plans/architecture-and-infrastructure/current/config-architecture-standardisation-plan.md))
  carries it.
- **`oak-eslint` build pattern**: this commit aligned `oak-eslint`
  to the repo-wide `tsup && tsc --emitDeclarationOnly --project
tsconfig.build.json` pattern. The choice of `tsup` for JS emit
  vs `tsc` for declarations is itself an open architectural
  question; this ADR records the alignment, not the underlying
  choice.

### Trade-offs

- Removing `baseUrl` is reversible if any future workspace introduces
  `paths` aliases under `moduleResolution: "bundler"`. The workspace
  would re-declare `baseUrl` locally; this ADR's repo-wide ban is
  therefore "no `baseUrl` at base AND no redundant per-workspace
  re-declaration", not "no workspace may ever have `baseUrl`".
- The `runtime-only-scripts/` exception is named, not deny-listed.
  A reviewer must verify that any new `runtime-only-scripts/`
  directory genuinely satisfies the pre-install constraint; the
  exception cannot be invoked merely because a script "doesn't need
  TypeScript".
- The all-TS rule means scripts that previously read as imperative
  one-liners now require type imports and (in some cases) explicit
  error narrowing. The cost is paid once at conversion time; the
  benefit accrues on every subsequent edit.

## Future Work

1. Resolve the `vitest.config.base.ts` coupling under the same
   architectural lens (see Carried forward).
2. Extract the workspace-script-ban into a portable Practice-Core
   doctrine if a second repo adopting the practice surfaces the
   same pattern. Currently this ADR is local to this monorepo.
3. Consider linting the `node ../../scripts/` pattern via a
   workspace-aware ESLint rule (today the rule is enforced by
   review; a mechanical check would close the gap on rare misses).

## History

- **2026-04-29** — Original adoption on branch `fix/build_issues`.
  Tasks #1–#8 of the migration plan landed Verdant Swaying Fern's
  session (mid-flight handoff with the working tree fully built but
  not yet committed). Verdant Regrowing Pollen's session split the
  working tree into the following five commits before authoring this
  ADR:

  | Commit     | Subject                                                                         | Scope                      |
  | ---------- | ------------------------------------------------------------------------------- | -------------------------- |
  | `a34f8402` | `chore(deps): bump typescript to ^6 and refresh devdep versions`                | dep bump + lock refresh    |
  | `d9018628` | `fix(build): align rootDir, baseUrl, and types with TypeScript 6`               | TS6 compatibility (Rule 1) |
  | `72bf1d90` | `refactor(arch): ban workspace-to-root scripts; introduce runtime-only-scripts` | Rules 2, 3, 4              |
  | `72c3fe89` | `chore(config): tsconfig audit cleanups`                                        | adjacent audit findings    |
  | `1f991a4b` | `chore(knip): un-export unused types; fix .mjs to .ts test imports`             | follow-on cleanup          |

  This ADR is the closing commit of the arc (the six-commit shape).
  The executable plan
  [`active/typescript-6-migration-and-workspace-script-rules.plan.md`][ts6-plan]
  remains in `active/` until the final quality-gate sweep +
  release-readiness review have run; archival to `archive/completed/`
  is a follow-on step.

[ts6-plan]: ../../../.agent/plans/architecture-and-infrastructure/active/typescript-6-migration-and-workspace-script-rules.plan.md
