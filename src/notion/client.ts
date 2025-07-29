import { Client } from '@notionhq/client';
import { scrubEmail } from '../utils/scrubbing.js';

export interface NotionClientWrapper {
  listUsers(): Promise<{ id: string; name?: string }[]>;
}

export function createNotionClient(apiKey: string): NotionClientWrapper {
  const client = new Client({ auth: apiKey });

  return {
    async listUsers() {
      const response = await client.users.list({});
      return response.results.map((user) => ({
        id: user.id,
        // Scrub email addresses from names
        name: user.name ? scrubEmail(user.name) : undefined,
      }));
    },
  };
}
