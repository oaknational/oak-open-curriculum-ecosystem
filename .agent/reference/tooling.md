# Tooling

All tooling MUST use the latest versions. `pnpm outdated` is the first-pass
check — but it computes its "latest" under the workspace's
`minimumReleaseAge` floor, so an age-floored release's row reads current
there (verified 2026-08-11, pnpm 11.20). The exhaustive currency check is
registry reads — `pnpm view <pkg> version` / `pnpm view <pkg> time` — per
the update-dependencies skill's age-floor census.

> `pnpm outdated` / `pnpm run outdated` (the repo's `outdated` script, recursive over the workspace) exits with a
> non-zero code when it finds outdated packages. That is the command's normal
> "updates available" signal, not a failure — scripts and CI must not treat the
> exit code as an error.

## Build System

- [pnpm](https://pnpm.io) - Package manager and workspace orchestration
- [Turborepo](https://turbo.build/repo) - Task runner with caching and dependency management (see [Build System docs](../../docs/engineering/build-system.md))

## Development

- [pnpm](https://pnpm.io)
- [husky](https://typicode.github.io/husky) - [set up with `pnpm dlx husky-init`](https://www.npmjs.com/package/husky-init)
- [lint-staged](https://github.com/okonet/lint-staged)
- [TypeScript](https://www.typescriptlang.org) - with strict settings.
- [Prettier](https://prettier.io)
- [ESLint](https://eslint.org)
- [Vitest](https://vitest.dev)
- [Supertest](https://github.com/visionmedia/supertest)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- [Zod](https://www.npmjs.com/package/zod)
- [tsup](https://tsup.egoist.dev) [package at](https://www.npmjs.com/package/tsup)
- [commitlint](https://commitlint.js.org)

## Running

- [tsx](https://www.npmjs.com/package/tsx) for directly running the TypeScript
- [Node.js](https://nodejs.org) 24.x for running the compiled JavaScript

## External System Tools

These tools are not managed by pnpm but are required by specific workflows:

- [gitleaks](https://github.com/gitleaks/gitleaks) — required for secrets scanning
  (`pnpm secrets:scan`, a `pnpm check` leg, so also at pre-push and in CI)
- [shellcheck](https://www.shellcheck.net) — required for shell script linting
  (`pnpm lint:shell`, a `pnpm check` leg, over every tracked shell script) at the
  version `.agent/setup/install-shellcheck.sh` pins; the script installs it into
  the checkout's ignored `.tools/bin`, which the gate runs before PATH, for
  developers, CI and cloud sessions alike
- [jq](https://jqlang.org) — required by the secrets hook smokes
  (`pnpm agent-tools:test:e2e`, a `pnpm check` leg, so also at pre-push and in
  CI); the smokes prove each hook with jq and without it, and fail with
  installation guidance when it is missing
- [Playwright browsers](https://playwright.dev/docs/browsers) — `pnpm exec playwright install chromium-headless-shell`
  once per checkout, the primary and every lane alike, before `pnpm test:e2e`
  (a lane runs it from the principal scoped with `pnpm --dir <path>`, as step 3
  of [`set-up-worktree-lane`](../skills/set-up-worktree-lane/SKILL-CANONICAL.md)
  does): the binaries sit in one per-user cache, and an install in any checkout
  on the host can remove a revision another needs, since Playwright's cleanup
  prunes a revision whose install links point only at retired worktrees
  (2026-09-25)

Scripts that require these tools should emit explicit installation guidance when
the command is missing.

## Upgrade and lint-configuration traps

Each of these bit once in this repository and is stated here so that it
does not bite again:

- `pnpm up --latest` moves every dependency to its newest release
  regardless of peers: it once moved ESLint past the range Next's own
  lint integration supported. Upgrade the framework-coupled tools
  (Next, ESLint and its Next plugin, Playwright) against the framework's
  declared range, not against the registry's newest.
- An `@playwright/test` update changes the browser build it expects;
  reinstall the browsers (the command above) after the update, before
  reading a "browser not found" failure as a flake.
- A flat ESLint config encodes no local policy on its own: a config that
  only spreads the shared presets enforces nothing this repository
  decided. Every local rule is declared explicitly in the config, and a
  rule the repository relies on is proved by a fixture that fails it.
- `markdownlint-cli2` lints the globs it is given and nothing else; a
  root config with no globs lints nothing silently. Declare the globs
  (and the ignores) explicitly in `.markdownlint-cli2.jsonc`.
- knip flags a plugin that is loaded only by a CLI option (a reporter,
  a preset passed on the command line) as unused. Record it under
  `ignoreDependencies` with a comment naming the command that loads it,
  never by removing the dependency.

## Publishing

- [Vercel](https://vercel.com) — the site deploys from `main`; nothing is
  published to a package registry (the `@engraph/*` packages are private
  workspace packages).

## TSDoc Compliance

TSDoc compliance is enforced at two layers:

1. **Lint-time enforcement**: `eslint-plugin-tsdoc` is installed in
   `@engraph/eslint-plugin-standards`; non-standard tags in hand-written
   code fail lint (no warnings are tolerated).

2. **Custom tag declaration**: `tsdoc.json` configs (root and
   per-workspace) declare `@generated` as a custom modifier tag,
   allowing it to pass the TSDoc parser without triggering warnings.

OCE's third layer — stripping non-standard tags from generated
code at generation time — has no subject here, since no code is generated
from an external schema.

## Validation

- [Claude Code](https://www.npmjs.com/package/@anthropic-ai/claude-code) (installed globally)
