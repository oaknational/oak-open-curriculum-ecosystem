import type { NextConfig } from 'next';

const config: NextConfig = {
  typedRoutes: true,
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
      namespace: 'sc',
    },
  },
  /**
   * Force SWC to transpile Oak components so SSR and client builds share styled-component hashes.
   * Without this, Node resolves the package's precompiled CJS bundle (esm__ class names) while
   * the browser uses the ESM build (sc-* hashes), triggering hydration mismatches.
   * Also transpile workspace packages that use ESM module resolution.
   */
  transpilePackages: ['@oaknational/oak-components', '@oaknational/mcp-logger'],
};
export default config;
