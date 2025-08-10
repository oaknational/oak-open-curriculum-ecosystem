/**
 * Oak Curriculum SDK
 *
 * TypeScript SDK for accessing Oak National Academy's Curriculum API.
 * This SDK provides a type-safe, runtime-agnostic client.
 */

export interface OakCurriculumClientConfig {
  apiKey?: string;
  baseUrl: string;
  timeout?: number;
  retries?: number;
}

export class OakCurriculumClient {
  private config: OakCurriculumClientConfig;

  constructor(config: OakCurriculumClientConfig) {
    this.config = config;
    // TODO: Implement client initialization
    // Config will be used for API calls
    void this.config; // Temporary - remove when implementing
  }

  searchLessons(_params: {
    query?: string;
    subject?: string;
    keyStage?: string;
    limit?: number;
  }): Promise<{ id: string; title: string }[]> {
    // TODO: Implement lesson search using this.config and params
    void _params; // Will be used when implementing
    return Promise.resolve([]);
  }

  getLesson(id: string): Promise<{ id: string; title: string; content?: string }> {
    // TODO: Implement lesson retrieval
    return Promise.resolve({ id, title: 'Placeholder' });
  }
}

export type { Lesson, Unit, Programme } from './types/index.js';
export { endpoints } from './endpoints/index.js';
