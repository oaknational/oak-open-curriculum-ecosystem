/**
 * Semantic Release Configuration
 *
 * Pre-release
 *
 * Currently configured to:
 * - Only release from main branch
 * - NPM publishing is disabled
 *
 * When ready to publish to NPM:
 * - Set npmPublish: true
 * - Install with: npm install @oaknational/oak-notion-mcp
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
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
        // NPM release needs configuring for each released package, not the whole monorepo
        pkgRoot: '.',
        tarballDir: 'dist',
      },
    ],
    '@semantic-release/git',
    '@semantic-release/github',
  ],
};
