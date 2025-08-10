/**
 * Node.js HTTP adapter implementation
 * This is where Node.js-specific dependencies are isolated
 */

import type { HttpAdapter, HttpOptions, HttpResponse } from './types';

/**
 * Node.js HTTP adapter using the built-in fetch (Node 18+)
 * For older Node versions, would use undici or node-fetch
 */
export const nodeHttpAdapter: HttpAdapter = {
  async request(url: string, options: HttpOptions): Promise<HttpResponse> {
    try {
      // Use native fetch available in Node.js 18+
      const response = await fetch(url, {
        method: options.method,
        headers: options.headers,
        body: options.body,
      });

      // Read the response body as text
      const body = await response.text();

      // Convert headers to plain object
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        status: response.status,
        body,
        headers,
      };
    } catch (error) {
      // Wrap network errors in a more descriptive error
      if (error instanceof Error) {
        throw new Error(`HTTP request failed: ${error.message}`);
      }
      throw new Error('HTTP request failed with unknown error');
    }
  },
};
