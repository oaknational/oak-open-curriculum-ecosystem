/**
 * User transformation logic
 * Converts Notion users to MCP resources
 */

import type { UserObjectResponse as NotionUser } from '@notionhq/client';
import type { McpResource, EmailScrubber } from './types.js';

/**
 * Default email scrubber - redacts email addresses
 * Pure function for basic email protection
 */
export const defaultEmailScrubber: EmailScrubber = (email: string) => {
  const [localPart, domain] = email.split('@');
  if (!domain || !localPart) return '***@***';

  const redactedLocal =
    localPart.length > 2
      ? localPart.charAt(0) +
        '*'.repeat(localPart.length - 2) +
        localPart.charAt(localPart.length - 1)
      : '*'.repeat(localPart.length);

  return `${redactedLocal}@${domain}`;
};

/**
 * Creates a user transformer with injected email scrubber
 * Factory function for dependency injection
 */
export function createUserTransformer(
  scrubEmail: EmailScrubber = defaultEmailScrubber,
): (user: NotionUser) => McpResource {
  return function transformNotionUserToMcpResource(user: NotionUser): McpResource {
    const name = user.name ?? 'Unknown User';
    const description = user.type === 'bot' ? 'Notion bot user' : 'Notion workspace user';

    const metadata: Record<string, unknown> = {
      type: user.type,
      avatar_url: user.avatar_url,
    };

    // Add email for person users (scrubbed)
    if (user.type === 'person' && user.person.email) {
      metadata['email'] = scrubEmail(user.person.email);
    }

    return {
      uri: `notion://users/${user.id}`,
      name,
      description,
      mimeType: 'application/json',
      metadata,
    };
  };
}

/**
 * Default user transformer instance
 * Uses the default email scrubber
 */
export const transformNotionUserToMcpResource = createUserTransformer();
