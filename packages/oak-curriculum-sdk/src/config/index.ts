/**
 * Configuration for Oak Curriculum API
 * Environment-agnostic defaults with override capability
 */

const defaultBaseUrl = 'https://open-api.thenational.academy/';

const defaultApiUrl = {
  v0: new URL('api/v0/', defaultBaseUrl).href,
};

const defaultApiSchemaUrl = {
  v0: new URL('api/v0/swagger.json', defaultBaseUrl).href,
};

// Allow environment override but provide defaults
let apiSchemaUrlOverride: string | undefined;
let apiUrlOverride: string | undefined;

try {
  // Node.js environment
  apiSchemaUrlOverride = process.env.OAK_API_SCHEMA_URL;
  apiUrlOverride = process.env.OAK_API_URL;
} catch (error: unknown) {
  console.log('No overrides found (Node.js environment):', error);
  try {
    // Cloudflare Workers environment - disable some rules because the tooling all assumes Node
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    // @ts-expect-error - Cloudflare Workers environment
    apiSchemaUrlOverride = globalThis.env.OAK_API_SCHEMA_URL;
    // @ts-expect-error - Cloudflare Workers environment
    apiUrlOverride = globalThis.env.OAK_API_URL;
    /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  } catch (error: unknown) {
    console.log('No overrides found (Cloudflare Workers environment):', error);
  }
}

const apiSchemaUrl: string = new URL(apiSchemaUrlOverride ?? defaultApiSchemaUrl.v0).href;

const apiUrl: string = new URL(apiUrlOverride ?? defaultApiUrl.v0).href;

interface Config {
  apiSchemaUrl: typeof apiSchemaUrl;
  apiUrl: typeof apiUrl;
}

const config = {
  apiSchemaUrl,
  apiUrl,
} satisfies Config as Config;

export { apiSchemaUrl, apiUrl };
export default config;
