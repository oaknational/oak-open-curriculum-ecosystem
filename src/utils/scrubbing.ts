/**
 * Scrubs email addresses in text to prevent PII exposure
 * Replaces email@example.com with ema...@example.com
 */
export function scrubEmail(text: string): string {
  return text.replace(
    /([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
    (_match, localPart: string, domain: string) => {
      // Keep first 3 chars or full string if shorter
      const visiblePart = localPart.substring(0, 3);
      return `${visiblePart}...@${domain}`;
    },
  );
}

/**
 * Recursively scrubs sensitive data from any value
 * Currently only scrubs email addresses
 */
export function scrubSensitiveData(data: unknown): unknown {
  if (typeof data === 'string') {
    return scrubEmail(data);
  }

  if (Array.isArray(data)) {
    return data.map(scrubSensitiveData);
  }

  if (data && typeof data === 'object') {
    const scrubbed: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      scrubbed[key] = scrubSensitiveData(value);
    }
    return scrubbed;
  }

  // Return primitives as-is
  return data;
}
