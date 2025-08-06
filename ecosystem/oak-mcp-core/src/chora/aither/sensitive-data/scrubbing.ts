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
 * Scrubs sensitive data from strings
 * Currently only scrubs email addresses
 *
 * Following KISS principle: only strings contain scrubable data
 * Non-strings pass through unchanged for type compatibility
 *
 * @example
 * scrubSensitiveData("test@example.com")
 * // Returns: "tes...@example.com"
 */
export function scrubSensitiveData(data: string): string;
export function scrubSensitiveData<T>(data: Exclude<T, string>): T;
export function scrubSensitiveData(data: unknown): unknown {
  // Only strings contain scrubable data
  if (typeof data === 'string') {
    return scrubEmail(data);
  }

  // All other types pass through unchanged
  return data;
}
