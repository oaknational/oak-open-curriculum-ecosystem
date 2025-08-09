/**
 * Data scrubbing utilities for removing sensitive information
 * These are required for privacy protection in responses
 */

/**
 * Scrub email addresses from text
 * Replaces email addresses with a placeholder
 */
export function scrubEmail(text: string): string {
  // Match common email patterns
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  return text.replace(emailRegex, '[email-scrubbed]');
}

/**
 * Scrub various types of sensitive data from text
 * Includes emails, phone numbers, and other PII
 */
export function scrubSensitiveData(text: string): string {
  let result = text;

  // Scrub email addresses
  result = scrubEmail(result);

  // Scrub phone numbers (various formats)
  const phonePatterns = [
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // US format: 123-456-7890
    /\b\(\d{3}\)\s?\d{3}[-.]?\d{4}\b/g, // US format: (123) 456-7890
    /\b\+\d{1,3}\s?\d{1,14}\b/g, // International format
  ];

  phonePatterns.forEach((pattern) => {
    result = result.replace(pattern, '[phone-scrubbed]');
  });

  // Scrub SSN-like patterns
  result = result.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[ssn-scrubbed]');

  // Scrub credit card-like patterns (4 groups of 4 digits)
  result = result.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[cc-scrubbed]');

  // Scrub API keys and tokens (common patterns)
  result = result.replace(
    /\b(api[_-]?key|token|secret)[_-]?[=:]?\s*["']?[\w-]{20,}["']?\b/gi,
    '[api-key-scrubbed]',
  );

  return result;
}
