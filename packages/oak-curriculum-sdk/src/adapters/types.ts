/**
 * Runtime-agnostic HTTP adapter interfaces
 * These types define the boundary between core logic and runtime dependencies
 */

/**
 * HTTP request options
 */
export interface HttpOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: string;
}

/**
 * HTTP response structure
 */
export interface HttpResponse {
  status: number;
  body: string;
  headers: Record<string, string>;
}

/**
 * HTTP adapter interface
 * Implementations will provide runtime-specific HTTP functionality
 */
export interface HttpAdapter {
  /**
   * Make an HTTP request
   * @param url - The URL to request
   * @param options - Request options
   * @returns Promise resolving to the response
   */
  request(url: string, options: HttpOptions): Promise<HttpResponse>;
}

/**
 * Configuration for the Oak client
 */
export interface OakClientConfig {
  baseUrl: string;
  apiKey?: string;
}

/**
 * Dependencies for the Oak client
 */
export interface OakClientDependencies {
  http: HttpAdapter;
  config: OakClientConfig;
}
