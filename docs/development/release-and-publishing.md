# Release and Publishing

## Published Packages

Only `@oaknational/curriculum-sdk` is published to npm. All other
workspaces have `"private": true` in their `package.json` and are
not published.

| Package                       | Scope          | Registry  | Status  |
| ----------------------------- | -------------- | --------- | ------- |
| `@oaknational/curriculum-sdk` | `@oaknational` | npmjs.com | Public  |
| All other workspaces          | n/a            | n/a       | Private |

## Versioning

The SDK uses [semantic-release](https://github.com/semantic-release/semantic-release)
for automated versioning based on
[Conventional Commits](https://www.conventionalcommits.org/). The
version is determined entirely from the commit history — there is no
manual version bumping.

| Commit prefix                       | Version bump  |
| ----------------------------------- | ------------- |
| `fix:`                              | Patch (0.0.x) |
| `feat:`                             | Minor (0.x.0) |
| `BREAKING CHANGE:` (in body/footer) | Major (x.0.0) |

The current version is `0.1.0` (pre-1.0 semver).

## Release Automation

Releases are triggered automatically when commits land on `main`.
The workflow is defined in `.github/workflows/release.yml` and
configured in `.releaserc.mjs`.

The pipeline:

1. CI runs on every push to `main`
2. `semantic-release` analyses commits since the last release
3. If releasable commits exist, it:
   - Determines the next version
   - Updates `CHANGELOG.md`
   - Updates `package.json` version
   - Creates a Git tag and GitHub Release
   - Publishes to npm (when enabled)

## npm Publishing

npm publishing is currently **disabled** (`npmPublish: false` in
`.releaserc.mjs`). To enable:

1. Create an npm access token with publish permissions for the
   `@oaknational` scope
2. Add it as `NPM_TOKEN` in GitHub repository secrets
3. Set `npmPublish: true` in `.releaserc.mjs`

## SDK Tarball Contents

The published tarball includes only:

- `dist/` — compiled JavaScript and TypeScript declarations
- `package.json`
- `README.md`
- `LICENSE` (copied from monorepo root by `prepublishOnly` script)

No tests, source files, `.env` files, or internal tooling are included.
The `files` field in `packages/sdks/oak-curriculum-sdk/package.json`
controls what is packaged.

## Dry Run

To verify the tarball without publishing:

```bash
pnpm -r publish --dry-run --no-git-checks
```

## Future Work

Publishing additional packages (MCP servers, logger, transport) as
public npm packages is planned but not yet implemented. See
`.agent/plans/dev-tooling-and-dev-ai-support/sdk-publishing-and-versioning-plan.md`
for the full roadmap.
