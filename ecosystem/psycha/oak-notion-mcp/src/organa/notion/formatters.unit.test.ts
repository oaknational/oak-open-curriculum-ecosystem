/**
 * Unit tests for pure formatting functions
 */

import { describe, it, expect } from 'vitest';
import {
  formatSearchResults,
  formatPageSummary,
  formatDatabaseSummary,
  formatDatabaseList,
  formatDatabaseQueryResults,
  formatPageProperties,
  formatPageDetails,
  formatUserList,
} from './formatters';
import type { Resource } from './transformers';
import {
  createMockPage,
  createMockDatabase,
  createMockPersonUser,
  createMockBotUser,
} from '../../chora/eidola/notion-mocks';

// Helper to create default annotations for rich text
const defaultAnnotations = {
  bold: false,
  italic: false,
  strikethrough: false,
  underline: false,
  code: false,
  color: 'default' as const,
};

describe('formatSearchResults', () => {
  it('should format empty results', () => {
    const result = formatSearchResults([], 'test query', []);
    expect(result).toBe('Found 0 results for "test query"\n\n');
  });

  it('should format mixed pages and databases', () => {
    const page = createMockPage({ id: 'page-1' });
    const database = createMockDatabase({ id: 'db-1' });
    const results = [page, database];

    const resources: Resource[] = [
      {
        uri: 'notion://pages/page-1',
        name: 'Test Page',
        _meta: {
          url: 'https://notion.so/page-1',
          last_edited_time: '2024-01-02T00:00:00Z',
        },
      },
      {
        uri: 'notion://databases/db-1',
        name: 'Test Database',
        _meta: {
          url: 'https://notion.so/db-1',
          properties: ['Name', 'Status'],
        },
      },
    ];

    const result = formatSearchResults(results, 'test query', resources);
    expect(result).toContain('Found 2 results for "test query"');
    expect(result).toContain('📄 Page: Test Page');
    expect(result).toContain('🗂️ Database: Test Database');
  });
});

describe('formatPageSummary', () => {
  it('should format page with all metadata', () => {
    const resource: Resource = {
      uri: 'notion://pages/page-1',
      name: 'My Page',
      _meta: {
        url: 'https://notion.so/page-1',
        last_edited_time: '2024-01-02T00:00:00Z',
      },
    };

    const result = formatPageSummary(resource);
    expect(result).toContain('📄 Page: My Page');
    expect(result).toContain('URL: https://notion.so/page-1');
    expect(result).toContain('Last edited: 2024-01-02T00:00:00Z');
  });

  it('should handle missing metadata', () => {
    const resource: Resource = {
      uri: 'notion://pages/page-1',
      name: 'My Page',
    };

    const result = formatPageSummary(resource);
    expect(result).toContain('URL: N/A');
    expect(result).toContain('Last edited: N/A');
  });
});

describe('formatDatabaseSummary', () => {
  it('should format database with properties', () => {
    const resource: Resource = {
      uri: 'notion://databases/db-1',
      name: 'Tasks',
      _meta: {
        url: 'https://notion.so/db-1',
        properties: ['Name', 'Status', 'Due Date'],
      },
    };

    const result = formatDatabaseSummary(resource);
    expect(result).toContain('🗂️ Database: Tasks');
    expect(result).toContain('URL: https://notion.so/db-1');
    expect(result).toContain('Properties: Name, Status, Due Date');
  });

  it('should handle empty properties', () => {
    const resource: Resource = {
      uri: 'notion://databases/db-1',
      name: 'Empty DB',
      _meta: {
        properties: [],
      },
    };

    const result = formatDatabaseSummary(resource);
    expect(result).toContain('Properties: None');
  });
});

describe('formatDatabaseQueryResults', () => {
  it('should format query results with pages', () => {
    const dbResource: Resource = {
      uri: 'notion://databases/db-1',
      name: 'Tasks Database',
    };

    const pages = [
      createMockPage({
        id: 'page-1',
        properties: {
          Name: {
            id: 'name',
            type: 'title',
            title: [
              {
                plain_text: 'Task 1',
                type: 'text',
                text: { content: 'Task 1', link: null },
                annotations: defaultAnnotations,
                href: null,
              },
            ],
          },
          Status: {
            id: 'status',
            type: 'select',
            select: { id: 's1', name: 'In Progress', color: 'blue' },
          },
        },
      }),
    ];

    const pageResources: Resource[] = [
      {
        uri: 'notion://pages/page-1',
        name: 'Task 1',
      },
    ];

    const result = formatDatabaseQueryResults(dbResource, pages, pageResources);
    expect(result).toContain('Database: Tasks Database');
    expect(result).toContain('Found 1 page');
    expect(result).toContain('📄 Task 1');
    expect(result).toContain('Status: In Progress');
  });
});

describe('formatDatabaseList', () => {
  it('should format multiple databases', () => {
    const databases = [createMockDatabase({ id: 'db-1' }), createMockDatabase({ id: 'db-2' })];

    const resources: Resource[] = [
      {
        uri: 'notion://databases/db-1',
        name: 'Tasks',
        _meta: {
          url: 'https://notion.so/db-1',
          properties: ['Name', 'Status'],
        },
      },
      {
        uri: 'notion://databases/db-2',
        name: 'Projects',
        _meta: {
          url: 'https://notion.so/db-2',
          properties: ['Title', 'Owner'],
        },
      },
    ];

    const result = formatDatabaseList(databases, resources);
    expect(result).toContain('Found 2 databases');
    expect(result).toContain('🗂️ Tasks');
    expect(result).toContain('ID: db-1');
    expect(result).toContain('🗂️ Projects');
    expect(result).toContain('ID: db-2');
  });

  it('should handle singular database', () => {
    const databases = [createMockDatabase({ id: 'db-1' })];
    const resources: Resource[] = [
      {
        uri: 'notion://databases/db-1',
        name: 'Tasks',
      },
    ];

    const result = formatDatabaseList(databases, resources);
    expect(result).toContain('Found 1 database');
  });
});

describe('formatPageProperties', () => {
  it('should format various property types', () => {
    const page = createMockPage({
      properties: {
        Status: {
          id: 'status',
          type: 'select',
          select: { id: 's1', name: 'In Progress', color: 'blue' },
        },
        Tags: {
          id: 'tags',
          type: 'multi_select',
          multi_select: [
            { id: 't1', name: 'Frontend', color: 'red' },
            { id: 't2', name: 'React', color: 'green' },
          ],
        },
        Priority: {
          id: 'priority',
          type: 'number',
          number: 3,
        },
        Done: {
          id: 'done',
          type: 'checkbox',
          checkbox: true,
        },
      },
    });

    const result = formatPageProperties(page);
    expect(result).toContain('Status: In Progress');
    expect(result).toContain('Tags: Frontend, React');
    expect(result).toContain('Priority: 3');
    expect(result).toContain('Done: ✓');
  });

  it('should skip title and Name properties', () => {
    const page = createMockPage({
      properties: {
        title: {
          id: 'title',
          type: 'title',
          title: [
            {
              plain_text: 'My Page',
              type: 'text',
              text: { content: 'My Page', link: null },
              annotations: defaultAnnotations,
              href: null,
            },
          ],
        },
        Name: {
          id: 'name',
          type: 'rich_text',
          rich_text: [
            {
              plain_text: 'Another Name',
              type: 'text',
              text: { content: 'Another Name', link: null },
              annotations: defaultAnnotations,
              href: null,
            },
          ],
        },
        Description: {
          id: 'desc',
          type: 'rich_text',
          rich_text: [
            {
              plain_text: 'A description',
              type: 'text',
              text: { content: 'A description', link: null },
              annotations: defaultAnnotations,
              href: null,
            },
          ],
        },
      },
    });

    const result = formatPageProperties(page);
    expect(result).not.toContain('title:');
    expect(result).not.toContain('Name:');
    expect(result).toContain('Description: A description');
  });
});

describe('formatPageDetails', () => {
  it('should format page with content', () => {
    const page = createMockPage({
      properties: {
        Status: {
          id: 'status',
          type: 'select',
          select: { id: 's1', name: 'Done', color: 'green' },
        },
      },
    });

    const resource: Resource = {
      uri: 'notion://pages/page-1',
      name: 'My Page',
      _meta: {
        url: 'https://notion.so/page-1',
        created_time: '2024-01-01T00:00:00Z',
        last_edited_time: '2024-01-02T00:00:00Z',
        archived: false,
      },
    };

    const result = formatPageDetails(resource, page, 'This is the page content');
    expect(result).toContain('📄 My Page');
    expect(result).toContain('Created: 2024-01-01T00:00:00Z');
    expect(result).toContain('Archived: No');
    expect(result).toContain('Properties:');
    expect(result).toContain('- Status: Done');
    expect(result).toContain('Content:\nThis is the page content');
  });

  it('should handle missing content', () => {
    const page = createMockPage();
    const resource: Resource = {
      uri: 'notion://pages/page-1',
      name: 'My Page',
    };

    const result = formatPageDetails(resource, page);
    expect(result).not.toContain('Content:');
  });
});

describe('formatUserList', () => {
  it('should format mixed user types', () => {
    const users = [
      {
        ...createMockPersonUser(),
        id: 'user-1',
        name: 'John Doe',
        person: { email: 'joh...@example.com' },
      },
      {
        ...createMockBotUser(),
        id: 'bot-1',
        name: 'Notion Bot',
      },
    ];

    const resources: Resource[] = [
      {
        uri: 'notion://users/user-1',
        name: 'John Doe',
        _meta: {
          email: 'joh...@example.com',
        },
      },
      {
        uri: 'notion://users/bot-1',
        name: 'Notion Bot',
      },
    ];

    const result = formatUserList(users, resources);
    expect(result).toContain('Found 2 users');
    expect(result).toContain('👤 John Doe');
    expect(result).toContain('Type: Person');
    expect(result).toContain('Email: joh...@example.com');
    expect(result).toContain('🤖 Notion Bot');
    expect(result).toContain('Type: Bot');
  });

  it('should handle singular user', () => {
    const users = [{ ...createMockPersonUser(), id: 'user-1', name: 'Solo User' }];
    const resources: Resource[] = [
      {
        uri: 'notion://users/user-1',
        name: 'Solo User',
      },
    ];

    const result = formatUserList(users, resources);
    expect(result).toContain('Found 1 user');
  });
});
