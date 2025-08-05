import { describe, it, expect } from 'vitest';
import {
  buildDatabaseQuery,
  validateDatabaseFilters,
  buildSearchQuery,
  type McpFilters,
  type SearchOptions,
} from './query-builders.js';

describe('buildDatabaseQuery', () => {
  it('should build query with property filters', () => {
    const filters: McpFilters = {
      properties: {
        Status: {
          type: 'select',
          value: 'In Progress',
        },
        Priority: {
          type: 'number',
          value: 5,
          operator: 'greater_than',
        },
      },
    };

    const result = buildDatabaseQuery(filters);

    expect(result).toEqual({
      filter: {
        and: [
          {
            property: 'Status',
            select: {
              equals: 'In Progress',
            },
          },
          {
            property: 'Priority',
            number: {
              greater_than: 5,
            },
          },
        ],
      },
    });
  });

  it('should build query with date filters', () => {
    const filters: McpFilters = {
      properties: {
        'Due Date': {
          type: 'date',
          value: '2024-01-01',
          operator: 'after',
        },
      },
    };

    const result = buildDatabaseQuery(filters);

    expect(result).toEqual({
      filter: {
        and: [
          {
            property: 'Due Date',
            date: {
              after: '2024-01-01',
            },
          },
        ],
      },
    });
  });

  it('should build query with checkbox filter', () => {
    const filters: McpFilters = {
      properties: {
        Completed: {
          type: 'checkbox',
          value: true,
        },
      },
    };

    const result = buildDatabaseQuery(filters);

    expect(result).toEqual({
      filter: {
        and: [
          {
            property: 'Completed',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    });
  });

  it('should build query with text contains filter', () => {
    const filters: McpFilters = {
      properties: {
        Title: {
          type: 'title',
          value: 'Project',
          operator: 'contains',
        },
      },
    };

    const result = buildDatabaseQuery(filters);

    expect(result).toEqual({
      filter: {
        and: [
          {
            property: 'Title',
            title: {
              contains: 'Project',
            },
          },
        ],
      },
    });
  });

  it('should build query with sorting', () => {
    const filters: McpFilters = {
      sorts: [
        {
          property: 'Created',
          direction: 'descending',
        },
        {
          property: 'Priority',
          direction: 'ascending',
        },
      ],
    };

    const result = buildDatabaseQuery(filters);

    expect(result).toEqual({
      sorts: [
        {
          property: 'Created',
          direction: 'descending',
        },
        {
          property: 'Priority',
          direction: 'ascending',
        },
      ],
    });
  });

  it('should build query with pagination', () => {
    const filters: McpFilters = {
      pageSize: 50,
      startCursor: 'cursor-123',
    };

    const result = buildDatabaseQuery(filters);

    expect(result).toEqual({
      page_size: 50,
      start_cursor: 'cursor-123',
    });
  });

  it('should build query with combined filters, sorts, and pagination', () => {
    const filters: McpFilters = {
      properties: {
        Status: {
          type: 'select',
          value: 'Done',
        },
      },
      sorts: [
        {
          property: 'Modified',
          direction: 'descending',
        },
      ],
      pageSize: 25,
    };

    const result = buildDatabaseQuery(filters);

    expect(result).toEqual({
      filter: {
        and: [
          {
            property: 'Status',
            select: {
              equals: 'Done',
            },
          },
        ],
      },
      sorts: [
        {
          property: 'Modified',
          direction: 'descending',
        },
      ],
      page_size: 25,
    });
  });

  it('should handle empty filters', () => {
    const filters: McpFilters = {};

    const result = buildDatabaseQuery(filters);

    expect(result).toEqual({});
  });

  it('should handle is_empty and is_not_empty operators', () => {
    const filters: McpFilters = {
      properties: {
        Assignee: {
          type: 'people',
          operator: 'is_empty',
        },
        Tags: {
          type: 'multi_select',
          operator: 'is_not_empty',
        },
      },
    };

    const result = buildDatabaseQuery(filters);

    expect(result).toEqual({
      filter: {
        and: [
          {
            property: 'Assignee',
            people: {
              is_empty: true,
            },
          },
          {
            property: 'Tags',
            multi_select: {
              is_not_empty: true,
            },
          },
        ],
      },
    });
  });
});

describe('validateDatabaseFilters', () => {
  it('should validate valid filters', () => {
    const filters = {
      properties: {
        Status: {
          type: 'select',
          value: 'To Do',
        },
      },
      sorts: [
        {
          property: 'Created',
          direction: 'ascending',
        },
      ],
      pageSize: 100,
    };

    const result = validateDatabaseFilters(filters);

    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
    expect(result.data).toEqual(filters);
  });

  it('should reject invalid property type', () => {
    const filters = {
      properties: {
        Status: {
          type: 'invalid_type',
          value: 'To Do',
        },
      },
    };

    const result = validateDatabaseFilters(filters);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid property type: invalid_type');
  });

  it('should reject invalid operator', () => {
    const filters = {
      properties: {
        Priority: {
          type: 'number',
          value: 5,
          operator: 'invalid_operator',
        },
      },
    };

    const result = validateDatabaseFilters(filters);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid operator: invalid_operator for type: number');
  });

  it('should reject invalid sort direction', () => {
    const filters = {
      sorts: [
        {
          property: 'Created',
          direction: 'sideways',
        },
      ],
    };

    const result = validateDatabaseFilters(filters);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Each sort must have a property and valid direction');
  });

  it('should reject invalid page size', () => {
    const filters = {
      pageSize: 150,
    };

    const result = validateDatabaseFilters(filters);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Page size must be between 1 and 100');
  });

  it('should reject non-object filters', () => {
    const result = validateDatabaseFilters('not an object');

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Filters must be an object');
  });

  it('should handle null/undefined gracefully', () => {
    const result = validateDatabaseFilters(null);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Filters must be an object');
  });

  it('should validate filters with only pagination', () => {
    const filters = {
      pageSize: 50,
      startCursor: 'abc-123',
    };

    const result = validateDatabaseFilters(filters);

    expect(result.valid).toBe(true);
    expect(result.data).toEqual(filters);
  });
});

describe('buildSearchQuery', () => {
  it('should build basic search query', () => {
    const result = buildSearchQuery('project roadmap');

    expect(result).toEqual({
      query: 'project roadmap',
    });
  });

  it('should build search query with filter type', () => {
    const options: SearchOptions = {
      filter: {
        property: 'object',
        value: 'page',
      },
    };

    const result = buildSearchQuery('meeting notes', options);

    expect(result).toEqual({
      query: 'meeting notes',
      filter: {
        property: 'object',
        value: 'page',
      },
    });
  });

  it('should build search query with sorting', () => {
    const options: SearchOptions = {
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time',
      },
    };

    const result = buildSearchQuery('quarterly report', options);

    expect(result).toEqual({
      query: 'quarterly report',
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time',
      },
    });
  });

  it('should build search query with pagination', () => {
    const options: SearchOptions = {
      pageSize: 25,
      startCursor: 'search-cursor-456',
    };

    const result = buildSearchQuery('budget', options);

    expect(result).toEqual({
      query: 'budget',
      page_size: 25,
      start_cursor: 'search-cursor-456',
    });
  });

  it('should build search query with all options', () => {
    const options: SearchOptions = {
      filter: {
        property: 'object',
        value: 'database',
      },
      sort: {
        direction: 'ascending',
        timestamp: 'last_edited_time',
      },
      pageSize: 10,
    };

    const result = buildSearchQuery('tasks', options);

    expect(result).toEqual({
      query: 'tasks',
      filter: {
        property: 'object',
        value: 'database',
      },
      sort: {
        direction: 'ascending',
        timestamp: 'last_edited_time',
      },
      page_size: 10,
    });
  });

  it('should trim search term', () => {
    const result = buildSearchQuery('  whitespace test  ');

    expect(result).toEqual({
      query: 'whitespace test',
    });
  });

  it('should handle empty search term', () => {
    const result = buildSearchQuery('');

    expect(result).toEqual({
      query: '',
    });
  });
});
