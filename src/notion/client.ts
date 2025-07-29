import { Client } from '@notionhq/client';

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
        name: user.name || undefined,
      }));
    },
  };
}
