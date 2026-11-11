# ADR-230: npm dependencies must be at least seven days old before they can enter the tree

- **Status:** Accepted (2026-11-11, owner directive: align with Oak's
  seven-day policy). Delivered by MCP-858.
- **Date:** 2026-11-11

## Context

The repository resolves npm dependencies with pnpm, using a
`minimumReleaseAge` supply-chain floor set in `pnpm-workspace.yaml`. A
package version younger than the floor is excluded from resolution. A
newly published compromised release therefore cannot enter the dependency
tree until the ecosystem has had time to detect and yank it.

Until this decision the floor was 1440 minutes (24 hours), the same as
pnpm 12's built-in default. Oak's wider supply-chain policy is seven days.
Many compromised packages are detected and removed within hours, but some
take days. A 24-hour window leaves that slower tail open.

The floor binds in two places (mechanism verified on pnpm 12.17.0 and
recorded in the `pnpm-workspace.yaml` comment):

- **At resolution.** pnpm silently picks the newest version older than the
  floor. A request that only a too-young version satisfies fails with
  `ERR_PNPM_NO_MATURE_MATCHING_VERSION`.
- **At frozen-lockfile install (CI).** Every locked version is checked
  against the floor. A violation fails with
  `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`.

## Decision

Set `minimumReleaseAge: 10080` (seven days, in minutes) in
`pnpm-workspace.yaml`. This applies to every dependency, transitive ones
included.

- The setting stays explicit. pnpm's default is shorter (1440 minutes) and
  non-strict: it records too-young picks in `minimumReleaseAgeExclude`
  without asking. Removing the line would weaken the floor in both ways.
- `minimumReleaseAgeExclude` remains the only escape hatch. Each entry is
  its own reviewed decision, for example an urgent security fix that cannot
  wait seven days. Interactive install prompts that offer to approve a
  too-young pick are declined.

## Consequences

- New releases, including security patches, reach this repository about
  six days later than before, unless someone makes a reviewed
  `minimumReleaseAgeExclude` entry.
- `pnpm outdated` computes "latest" under the same floor. Releases younger
  than seven days are invisible to it. Check the publish date with
  `pnpm view <pkg> time` when a newer release is expected.
- Any lockfile resolved without the floor fails CI's frozen install. This
  includes Dependabot's npm lockfile regeneration, which is why npm stays
  out of `.github/dependabot.yml`.
- When the floor was raised, the committed lockfile already passed a
  frozen install under seven days, so no dependency had to be rolled back.

## References

- `pnpm-workspace.yaml`: the setting and its mechanism notes
- [`docs/engineering/build-system.md`](../../engineering/build-system.md) §Dependency updates
- MCP-858
