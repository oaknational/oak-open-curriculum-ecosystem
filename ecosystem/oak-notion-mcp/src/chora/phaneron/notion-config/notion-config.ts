/**
 * Notion-specific configuration for the phenotype
 */

import type { NotionEnvironment } from './environment.js';

export interface NotionConfig {
  apiKey: string;
  version: string;
}

export function getNotionConfig(env: NotionEnvironment): NotionConfig {
  return {
    apiKey: env.NOTION_API_KEY,
    version: '2022-06-28', // Latest stable Notion API version
  };
}
