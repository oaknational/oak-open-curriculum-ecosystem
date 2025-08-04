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
 * Type guard to check if a value is a plain object
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Scrubs sensitive data from a string
 */
function scrubString(str: string): string {
  return scrubEmail(str);
}

/**
 * Scrubs sensitive data from an array
 */
function scrubArray(arr: unknown[]): unknown[] {
  return arr.map((item) => scrubSensitiveData(item));
}

/**
 * Scrubs sensitive data from an object
 */
function scrubObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = scrubSensitiveData(value);
  }
  return result;
}

/**
 * Recursively scrubs sensitive data from any value
 * Currently only scrubs email addresses
 *
 * IMPORTANT: This function preserves the exact structure and type of the input.
 * Only string values are modified (email addresses are scrubbed).
 * All other types (objects, arrays, numbers, etc.) maintain their structure.
 *
 * @example
 * scrubSensitiveData({ email: "test@example.com", count: 5 })
 * // Returns: { email: "tes...@example.com", count: 5 }
 */
export function scrubSensitiveData(data: unknown): unknown {
  // Only strings are actually transformed
  if (typeof data === 'string') {
    return scrubString(data);
  }

  // Arrays: map over elements, preserving structure
  if (Array.isArray(data)) {
    return scrubArray(data);
  }

  // Objects: map over values, preserving keys and structure
  if (isPlainObject(data)) {
    return scrubObject(data);
  }

  // All other types (number, boolean, null, undefined) pass through unchanged
  return data;
}
