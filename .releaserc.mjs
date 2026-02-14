/**
 * Semantic Release Configuration
 *
 * Publishes @oaknational/curriculum-sdk to npm on merge to main.
 * Only the SDK is published; all other workspaces remain private.
 */

/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: [
    {
      name: 'main',
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
        pkgRoot: 'packages/sdks/oak-curriculum-sdk',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'packages/sdks/oak-curriculum-sdk/package.json'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    '@semantic-release/github',
  ],
};
