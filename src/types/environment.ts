/**
 * Type-safe representation of process environment variables
 */
export interface ProcessEnv {
  [key: string]: string | undefined;
  NOTION_API_KEY?: string;
  LOG_LEVEL?: string;
  NODE_ENV?: string;
}
