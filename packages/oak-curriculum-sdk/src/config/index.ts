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
const apiSchemaUrl: string = new URL(process.env.OAK_API_SCHEMA_URL ?? defaultApiSchemaUrl.v0).href;

const apiUrl: string = new URL(process.env.OAK_API_URL ?? defaultApiUrl.v0).href;

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
