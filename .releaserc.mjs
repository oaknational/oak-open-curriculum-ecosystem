/**
 * Semantic Release Configuration
 *
 * Currently configured to:
 * - Only release from main branch
 * - All versions have -alpha suffix (pre-1.0 development)
 * - NPM publishing is disabled
 *
 * When ready to publish to NPM:
 * - Set npmPublish: true
 * - Alpha versions will automatically publish to @alpha dist-tag
 * - Install with: npm install @oaknational/oak-notion-mcp@alpha
 *
 * To transition to stable releases:
 * - Remove the prerelease configuration from main branch
 * - Or create a separate 'stable' branch
 */

/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: [
    {
      name: 'main',
      prerelease: 'alpha',
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
        // When npmPublish is enabled, alpha releases will use the 'alpha' dist-tag
        // Users will need to explicitly install with @alpha tag
        pkgRoot: '.',
        tarballDir: 'dist',
      },
    ],
    '@semantic-release/git',
    '@semantic-release/github',
  ],
};
