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

function readEnvFromProcess(key: 'OAK_API_SCHEMA_URL' | 'OAK_API_URL'): string | undefined {
  if (typeof process === 'undefined') {
    return undefined;
  }
  const value = process.env[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readEnvFromGlobal(key: 'OAK_API_SCHEMA_URL' | 'OAK_API_URL'): string | undefined {
  const value = process.env[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readEnvironmentUrl(key: 'OAK_API_SCHEMA_URL' | 'OAK_API_URL', fallback: string): string {
  const override = readEnvFromProcess(key) ?? readEnvFromGlobal(key);
  return new URL(override ?? fallback).href;
}

const apiSchemaUrl = readEnvironmentUrl('OAK_API_SCHEMA_URL', defaultApiSchemaUrl.v0);
const apiUrl = readEnvironmentUrl('OAK_API_URL', defaultApiUrl.v0);

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
