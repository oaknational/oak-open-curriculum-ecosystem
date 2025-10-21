export interface SmokeContext {
  readonly baseUrl: string;
  readonly devToken: string;
}

export const REQUIRED_ACCEPT = 'application/json, text/event-stream';
export const EXPECTED_TOOLS = ['search', 'fetch', 'get-key-stages-subject-lessons'] as const;
