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

import { getOwnValue } from '../types/helpers.js';

function getEnvironmentVariable(key: 'OAK_API_SCHEMA_URL' | 'OAK_API_URL'): string | undefined {
  // Try Node.js environment first
  if (typeof process !== 'undefined') {
    const value = process.env[key];
    if (typeof value === 'string') {
      return value;
    }
  }

  // Try Cloudflare Workers environment
  // Check if globalThis has an env property dynamically
  const env = getOwnValue(globalThis, 'env');
  const val = getOwnValue(env, key);
  if (typeof val === 'string') {
    return val;
  }

  return undefined;
}

// Allow environment override but provide defaults
const apiSchemaUrlOverride = getEnvironmentVariable('OAK_API_SCHEMA_URL');
const apiUrlOverride = getEnvironmentVariable('OAK_API_URL');

const apiSchemaUrl: string = new URL(apiSchemaUrlOverride ?? defaultApiSchemaUrl.v0).href;

const apiUrl: string = new URL(apiUrlOverride ?? defaultApiUrl.v0).href;

interface Config {
  apiSchemaUrl: typeof apiSchemaUrl;
  apiUrl: typeof apiUrl;
}

const config: Config = {
  apiSchemaUrl,
  apiUrl,
};

export { apiSchemaUrl, apiUrl };
export default config;
