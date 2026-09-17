# Release and Publishing

For milestone/service release controls (gate model, snagging protocol,
go/no-go, rollout safety), see
[Milestone Release Runbook](./milestone-release-runbook.md).

## Published Packages

No package is published to a registry today (`npmPublish: false` on both npm
plugin entries in `.releaserc.mjs`; `npm view @oaknational/curriculum-sdk`
returns not-found, checked 2026-09-03). The curriculum SDK
(`@oaknational/curriculum-sdk`) carries the only publishable manifest in the
repository. All other workspaces have `"private": true` in their
`package.json` and are not published. The first live publish, when it
comes, is one multi-package publish of every publishable workspace at the
repository's release version, behind per-package finish checks and an
asserted publish right, with no manual toggle; the plan estate carries its
mechanism and Linear its schedule.

| Package                       | Scope          | Registry  | Status                                  |
| ----------------------------- | -------------- | --------- | --------------------------------------- |
| `@oaknational/curriculum-sdk` | `@oaknational` | npmjs.com | Publishable manifest; not yet published |
| All other workspaces          | n/a            | n/a       | Private                                 |

## Versioning

The SDK uses [semantic-release](https://github.com/semantic-release/semantic-release)
for automated versioning based on
[Conventional Commits](https://www.conventionalcommits.org/). The
version is determined entirely from the commit history — there is no
manual version bumping.

| Commit prefix                                              | Version bump  |
| ---------------------------------------------------------- | ------------- |
| `docs:`, `chore:`, `fix:`, `perf:`                         | Patch (0.0.x) |
| `style:`, `refactor:`, `test:`, `build:`, `ci:`, `revert:` | Patch (0.0.x) |
| `feat:`                                                    | Minor (0.x.0) |
| `BREAKING CHANGE:` (in body/footer)                        | Major (x.0.0) |
| `release:` (automation only)                               | No bump       |

Breaking changes require the `BREAKING CHANGE:` footer: the analyser's
parser (`conventional-changelog-angular`) does not recognise the `type!:`
shorthand, and the commit-msg hook blocks `!` commits anyway.

Every work-commit type permitted by commitlint triggers at least a patch
release, so every deployment from `main` carries a distinct version. The
automation commits each version bump back to `main` as
`release(<version>): <version> [skip ci]` — a dedicated commit type that is
explicitly mapped to no release, so the automation can never trigger itself.
The current version is recorded in the root and SDK `package.json` files,
which `semantic-release` updates together.

## Release Automation

Releases are triggered automatically when commits land on `main`.
The workflow is defined in `.github/workflows/release.yml` and
configured in `.releaserc.mjs`.

The pipeline:

1. CI runs on every push to `main`
2. `semantic-release` analyses commits since the last release
3. If at least one commit matches one of the release rules above (a mapped
   type, or a breaking-change marker on any type), it:
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
- `LICENCE` (copied from monorepo root by `prepublishOnly` script)

No tests, source files, `.env` files, or internal tooling are included.
The `files` field in `packages/sdks/oak-curriculum-sdk/package.json`
controls what is packaged.

---

## Operator Runbook

This section provides step-by-step procedures for release operators.

_Dated note, 2026-09-03: the prerequisites and the first-release steps
below describe the single-package configuration as it stands today, with
publishing disabled. The first live publish is not a manual toggle of
`npmPublish`: it lands as one multi-package publish of every publishable
workspace at the repository's release version, behind per-package finish
checks and an asserted publish right. Prerequisite 4 and step 2 of the
first release are superseded by that mechanism and are kept only so the
current configuration reads true._

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
- Release commits use the dedicated `release` type: the type is explicitly
  mapped to no version bump, and the `[skip ci]` suffix prevents CI loops
- The `release` type is reserved for the automation: it is not in the human
  commitlint enum (hooks reject it in work commits), while the release
  workflow runs `semantic-release` with `HUSKY: 0`, so the generated commit
  bypasses hooks entirely

### Dry Run Procedure

Before enabling real publishing, verify the tarball contents:

```bash
# 1. Ensure the SDK builds cleanly
pnpm sdk-codegen && pnpm build

# 2. Run the dry-run publish (shows what would be published)
pnpm -r publish --dry-run --no-git-checks
```

Expected output (abbreviated):

```text
npm warn publish Package @oaknational/curriculum-sdk not found...
npm notice
npm notice package: @oaknational/curriculum-sdk@CURRENT_VERSION
npm notice Tarball Contents
npm notice   XXXkB  dist/index.js
npm notice   XXXkB  dist/index.d.ts
npm notice   ...
npm notice   XXXkB  package.json
npm notice   XXXkB  README.md
npm notice   XXXkB  LICENCE
npm notice Tarball Details
npm notice   name:          @oaknational/curriculum-sdk
npm notice   version:       CURRENT_VERSION
npm notice   package size:  ...
npm notice   total files:   ...
```

Verify:

- [ ] `dist/` files are present
- [ ] `LICENCE` is present (copied by `prepublishOnly`)
- [ ] `README.md` is present
- [ ] No test files, `.env` files, or source files are included
- [ ] Package name is `@oaknational/curriculum-sdk`

### First Real Release

_Dated note, 2026-09-03: these steps describe today's single-package
configuration; step 2's manual toggle is superseded by the multi-package
first publish named in the note at the head of this runbook._

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

No package is published today (2026-09-03), so no published version
exists to roll back and the unpublish mechanics below are not operable;
they stay as npm reference. The rollback discipline for published packages
— forward-fix by a new release, never unpublishing a version consumers may
already have resolved, with the broken version deprecated so installs
steer past it — lands with the publish mechanism, which also amends the
release-process runbook's rollback clause.

#### Unpublishing (npm mechanics, reference only)

Whether a version can be unpublished, and when, is npm's policy, not this
page's: it depends on the package's age, its public dependants, its download
volume and its ownership, and the current terms are the
[npm unpublish policy](https://docs.npmjs.com/policies/unpublish). The
command, for reference:

```bash
npm unpublish @oaknational/curriculum-sdk@VERSION
```

This repository does not rely on any unpublish window: from the first
publish onward the cure for a broken release is a new version carrying the
fix, with the broken version deprecated.

#### Deprecating a Version

For any version that should no longer be selected:

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

Under the every-merge model the reverting commit itself is releasable and
publishes a new patch release carrying the reverted state — whether it uses
a conventional `revert:` message (the explicit `revert` patch rule) or Git's
default `Revert "…"` message (the analyser's built-in
`{ revert: true, release: 'patch' }` rule matches the
`This reverts commit …` body).

### Troubleshooting

| Problem                        | Likely cause                                         | Fix                                                        |
| ------------------------------ | ---------------------------------------------------- | ---------------------------------------------------------- |
| Release workflow does not run  | Not on `main` branch                                 | Merge to `main`                                            |
| "No releasable commits"        | Commit types are not mapped to a release             | Check that each commit uses the accurate Conventional type |
| npm publish fails with 403     | Token lacks write permission or wrong scope          | Regenerate token with correct permissions                  |
| npm publish fails with 402     | Package is scoped but missing `publishConfig.access` | Already set to `"public"` in SDK `package.json`            |
| `LICENCE` missing from tarball | `prepublishOnly` script failed                       | Run `pnpm build` in the SDK workspace first                |

---

## Future Work

Publishing every publishable workspace (the MCP-family packages, the
logger, the transport and the rest) as public npm packages at the
repository's release version is planned and not yet implemented; the plan
estate's index points at its mechanism, and Linear carries the schedule.
