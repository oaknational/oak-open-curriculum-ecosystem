import type { NotionDependencies } from '../../chorai/stroma/notion-types/dependencies';
import { scrubEmail } from '../../chorai/aither/scrubbing';

export interface Resource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

interface ResourceHandlers {
  handleListResources(): Promise<{ resources: Resource[] }>;
}

export function createResourceHandlers(deps: NotionDependencies): ResourceHandlers {
  return {
    async handleListResources() {
      deps.logger.info('Listing resources');

      try {
        const response = await deps.notionClient.users.list({});
        deps.logger.debug('Found users', { count: response.results.length });

        const resources: Resource[] = response.results.map((user) => {
          // Apply email scrubbing for privacy
          const scrubbedName = user.name ? scrubEmail(user.name) : `User ${user.id}`;

          return {
            uri: `notion://users/${user.id}`,
            name: scrubbedName,
            description: 'Notion workspace user',
            mimeType: 'application/json',
          };
        });

        return { resources };
      } catch (error) {
        deps.logger.error('Failed to list users', error);
        throw error;
      }
    },
  };
}
