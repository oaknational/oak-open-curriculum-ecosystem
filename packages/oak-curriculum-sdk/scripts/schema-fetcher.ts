/**
 * Schema fetching utilities
 *
 * Fetches OpenAPI schema from remote URL
 */

/**
 * Fetch OpenAPI schema from remote URL
 *
 * @param url - The URL to fetch the schema from
 * @returns The parsed JSON (unknown type - caller must validate)
 */
export async function fetchOpenAPISchema(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${String(response.status)}: ${response.statusText}`);
  }

  return response.json();
}
