import type { NotionClientWrapper } from '../notion/client.js';
import type { Logger } from '../logging/logger.js';

export interface Resource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

interface ResourceHandlers {
  handleListResources(): Promise<{ resources: Resource[] }>;
}

export function createResourceHandlers(deps: {
  notionClient: NotionClientWrapper;
  logger: Logger;
}): ResourceHandlers {
  return {
    async handleListResources() {
      deps.logger.info('Listing resources');

      try {
        const users = await deps.notionClient.listUsers();
        deps.logger.debug('Found users', { count: users.length });

        const resources: Resource[] = users.map((user) => ({
          uri: `notion://users/${user.id}`,
          name: user.name || `User ${user.id}`,
          description: 'Notion workspace user',
          mimeType: 'application/json',
        }));

        return { resources };
      } catch (error) {
        deps.logger.error('Failed to list users', error);
        throw error;
      }
    },
  };
}
