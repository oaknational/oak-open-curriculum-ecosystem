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

## SDK Tarball Contents

The published tarball includes only:

- `dist/` — compiled JavaScript and TypeScript declarations
- `package.json`
- `README.md`
- `LICENSE` (copied from monorepo root by `prepublishOnly` script)

No tests, source files, `.env` files, or internal tooling are included.
The `files` field in `packages/sdks/oak-curriculum-sdk/package.json`
controls what is packaged.

---

## Operator Runbook

This section provides step-by-step procedures for release operators.

### Prerequisites

Before your first release, ensure these are in place:

1. **npm account**: You need an npm account that is a member of the
   `@oaknational` organisation
2. **npm access token**: Create a Granular Access Token at
   <https://www.npmjs.com/settings/YOUR_USERNAME/tokens>
   - Token type: Granular Access Token
   - Expiration: Set per your organisation's policy
   - Packages: `@oaknational/curriculum-sdk` with Read and Write
   - IP allowlist: Optional (recommended for CI tokens)
3. **GitHub repository secret**: Add the npm token as `NPM_TOKEN` in
   the repository's Settings > Secrets > Actions
4. **Enable publishing**: Set `npmPublish: true` in `.releaserc.mjs`
   (currently `false`)
5. **GitHub token**: The default `GITHUB_TOKEN` provided by GitHub
   Actions is sufficient for creating releases and tags. No additional
   GitHub token is needed unless you use a custom bot account.

### Branch and Commit Conventions

- Releases only trigger from the `main` branch
- All commits to `main` must use Conventional Commits format
- Feature branches merge to `main` via pull request
- The `[skip ci]` suffix on release commits prevents infinite loops

### Dry Run Procedure

Before enabling real publishing, verify the tarball contents:

```bash
# 1. Ensure the SDK builds cleanly
pnpm type-gen && pnpm build

# 2. Run the dry-run publish (shows what would be published)
pnpm -r publish --dry-run --no-git-checks
```

Expected output (abbreviated):

```text
npm warn publish Package @oaknational/curriculum-sdk not found...
npm notice
npm notice package: @oaknational/curriculum-sdk@0.1.0
npm notice Tarball Contents
npm notice   XXXkB  dist/index.js
npm notice   XXXkB  dist/index.d.ts
npm notice   ...
npm notice   XXXkB  package.json
npm notice   XXXkB  README.md
npm notice   XXXkB  LICENSE
npm notice Tarball Details
npm notice   name:          @oaknational/curriculum-sdk
npm notice   version:       0.1.0
npm notice   package size:  ...
npm notice   total files:   ...
```

Verify:

- [ ] `dist/` files are present
- [ ] `LICENSE` is present (copied by `prepublishOnly`)
- [ ] `README.md` is present
- [ ] No test files, `.env` files, or source files are included
- [ ] Package name is `@oaknational/curriculum-sdk`

### First Real Release

1. Confirm the `NPM_TOKEN` secret is set in GitHub repository settings
2. Set `npmPublish: true` in `.releaserc.mjs`
3. Commit and push to `main`:

   ```bash
   git commit -m "chore: enable npm publishing"
   git push origin main
   ```

4. Monitor the release workflow in GitHub Actions
5. Verify the package appears on <https://www.npmjs.com/package/@oaknational/curriculum-sdk>

### Monitoring a Release

1. Go to the repository's Actions tab on GitHub
2. Find the `Release` workflow run
3. Check the `semantic-release` step output for:
   - Version determination (patch/minor/major)
   - npm publish result
   - Git tag creation
   - GitHub Release creation

### Rollback Procedures

#### Unpublishing (within 72 hours)

npm allows unpublishing within 72 hours of publication. This is a
last resort for accidental or broken releases:

```bash
npm unpublish @oaknational/curriculum-sdk@VERSION
```

After 72 hours, you cannot unpublish. Instead, publish a new patch
version with the fix.

#### Deprecating a Version

If a version should not be used but cannot be unpublished:

```bash
npm deprecate @oaknational/curriculum-sdk@VERSION "Known issue: use VERSION instead"
```

#### Reverting a Release Commit

If the release commit needs reverting (e.g., changelog or version
bump was wrong):

```bash
git revert HEAD  # Revert the release commit
git push origin main
```

This triggers a new release workflow run but, since there are no
new releasable commits, `semantic-release` will skip publishing.

### Troubleshooting

| Problem                        | Likely cause                                           | Fix                                             |
| ------------------------------ | ------------------------------------------------------ | ----------------------------------------------- |
| Release workflow does not run  | Not on `main` branch                                   | Merge to `main`                                 |
| "No releasable commits"        | All commits since last release are `chore:` or `docs:` | Add a `fix:` or `feat:` commit                  |
| npm publish fails with 403     | Token lacks write permission or wrong scope            | Regenerate token with correct permissions       |
| npm publish fails with 402     | Package is scoped but missing `publishConfig.access`   | Already set to `"public"` in SDK `package.json` |
| `LICENSE` missing from tarball | `prepublishOnly` script failed                         | Run `pnpm build` in the SDK workspace first     |

---

## Future Work

Publishing additional packages (MCP servers, logger, transport) as
public npm packages is planned but not yet implemented. See
`.agent/plans/dev-tooling-and-dev-ai-support/sdk-publishing-and-versioning-plan.md`
for the full roadmap.
