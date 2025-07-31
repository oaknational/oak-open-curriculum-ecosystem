// Pure function for validation
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export interface NotionConfig {
  apiKey: string;
  version: string;
}

export function validateEnvironmentVariables(
  env: Record<string, string | undefined>,
): ValidationResult {
  const errors: string[] = [];

  if (!env['NOTION_API_KEY'] || env['NOTION_API_KEY'].trim() === '') {
    errors.push('NOTION_API_KEY is required');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export function parseNotionConfig(apiKey: string): NotionConfig {
  return {
    apiKey: apiKey.trim(),
    version: '2022-06-28', // Latest stable Notion API version
  };
}

export interface ServerConfig {
  name: string;
  version: string;
}

export interface McpServerInfo {
  name: string;
  version: string;
}

export function createMcpServerInfo(config: ServerConfig): McpServerInfo {
  return {
    name: config.name,
    version: config.version,
  };
}
