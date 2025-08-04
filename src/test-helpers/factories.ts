/**
 * Simple test factories for creating mock objects
 * Following testing strategy: simple mocks passed as arguments
 */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { Logger } from '../chora/aither/logging/logger-interface.js';
import type { ServerConfig } from '../chora/stroma/types/dependencies.js';
import type { NotionOperations } from '../chora/stroma/contracts/notion-operations.js';
import type {
  PageObjectResponse,
  DatabaseObjectResponse,
  UserObjectResponse,
} from '@notionhq/client/build/src/api-endpoints.js';
import type { Resource } from '@modelcontextprotocol/sdk/types.js';
import { vi } from 'vitest';

/**
 * Creates a simple mock Logger instance
 */
export function createMockLogger(): Logger {
  return {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    child: vi.fn().mockReturnThis(),
    isLevelEnabled: vi.fn().mockReturnValue(true),
    setLevel: vi.fn(),
    getLevel: vi.fn().mockReturnValue(20), // INFO level
  };
}

/**
 * Creates server configuration for testing
 */
export function createMockServerConfig(overrides?: Partial<ServerConfig>): ServerConfig {
  return {
    name: 'test-server',
    version: '1.0.0',
    ...overrides,
  };
}

/**
 * Creates a mock NotionOperations instance for testing
 */
export function createMockNotionOperations(): NotionOperations {
  return {
    transformers: {
      transformNotionPageToMcpResource: vi.fn((page: PageObjectResponse) => ({
        uri: `notion://pages/${page.id}`,
        name: (() => {
          const titleProp = page.properties?.['title'];
          const nameProp = page.properties?.['Name'];
          return (
            (titleProp && 'title' in titleProp ? titleProp.title?.[0]?.plain_text : '') ||
            (nameProp && 'title' in nameProp ? nameProp.title?.[0]?.plain_text : '') ||
            'Test Page'
          );
        })(),
      })),
      transformNotionDatabaseToMcpResource: vi.fn((db: DatabaseObjectResponse) => ({
        uri: `notion://databases/${db.id}`,
        name: db.title?.[0]?.plain_text || 'Test Database',
      })),
      transformNotionUserToMcpResource: vi.fn((user: UserObjectResponse) => ({
        uri: `notion://users/${user.id}`,
        name: user.name || 'Test User',
      })),
      extractTextFromNotionBlocks: vi.fn(() => 'Page content'),
    },
    formatters: {
      formatSearchResults: vi.fn(
        (
          results: (PageObjectResponse | DatabaseObjectResponse)[],
          query: string,
          resources: Resource[],
        ) => {
          let text = `Found ${results.length} results for "${query}"`;
          if (resources && resources.length > 0) {
            const details = resources.map((r: Resource) => r.name).join('\n');
            text += `\n\n${details}`;
          }
          return text;
        },
      ),
      formatDatabaseList: vi.fn((databases) => {
        const header = `Found ${databases.length} database${databases.length === 1 ? '' : 's'}`;
        const details = databases
          .map((db: DatabaseObjectResponse) => {
            const props = db.properties ? Object.keys(db.properties).join(', ') : '';
            return `${db.title?.[0]?.plain_text || 'Untitled'} - ${props}`;
          })
          .join('\n');
        return `${header}\n\n${details}`;
      }),
      formatUserList: vi.fn((users) => {
        const header = `Found ${users.length} user${users.length === 1 ? '' : 's'}`;
        const details = users
          .map((u: UserObjectResponse) => {
            const name = u.name || 'Unknown';
            const email = u.type === 'person' && u.person?.email ? u.person.email : '';
            // Truncate email like the real formatter does
            const displayEmail =
              email.length > 15
                ? email.substring(0, 3) + '...' + email.substring(email.indexOf('@'))
                : email;
            return `${name}${displayEmail ? ` - ${displayEmail}` : ''}`;
          })
          .join('\n');
        return `${header}\n\n${details}`;
      }),
      formatDatabaseQueryResults: vi.fn((dbResource, pages) => {
        let result = `Database: ${dbResource.name}`;
        if (pages && pages.length > 0) {
          const pageDetails = pages
            .map((page: PageObjectResponse) => {
              const titleProp = page.properties?.['title'];
              const nameProp = page.properties?.['Name'];
              const title =
                (titleProp && 'title' in titleProp ? titleProp.title?.[0]?.plain_text : '') ||
                (nameProp && 'title' in nameProp ? nameProp.title?.[0]?.plain_text : '') ||
                'Untitled';
              const statusProp = page.properties?.['Status'];
              const status =
                statusProp && 'select' in statusProp ? statusProp.select?.name || '' : '';
              return `${title}${status ? ` - Status: ${status}` : ''}`;
            })
            .join('\n');
          result += `\n\n${pageDetails}`;
        }
        return result;
      }),
      formatPageDetails: vi.fn((resource, page, content) => {
        const titleProp = page.properties?.['title'];
        const nameProp = page.properties?.['Name'];
        let result =
          (titleProp && 'title' in titleProp ? titleProp.title?.[0]?.plain_text : '') ||
          (nameProp && 'title' in nameProp ? nameProp.title?.[0]?.plain_text : '') ||
          resource.name;
        if (content) {
          result += `\n\n${content}`;
        }
        return result;
      }),
    },
  };
}
