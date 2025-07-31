# API Reference

## Overview

The Oak Notion MCP Server provides read-only access to Notion workspaces through the Model Context Protocol (MCP). This document details all available resources and tools.

## Resources

Resources provide URI-based access to Notion content. Each resource returns data in JSON format.

### notion://discovery

**Description**: Provides a comprehensive overview of the Notion workspace including users, pages, and databases.

**Response Format**:

```json
{
  "uri": "notion://discovery",
  "name": "Notion Workspace Discovery",
  "mimeType": "application/json",
  "text": "# Notion Workspace Discovery\n\n## Summary\n- Users: 5\n- Pages: 42\n- Databases: 3\n\n..."
}
```

**Features**:

- Summary counts of workspace contents
- List of all users (with PII scrubbing)
- Recent pages with metadata
- All accessible databases

### notion://users/{userId}

**Description**: Provides information about a specific Notion user.

**Parameters**:

- `userId` (required): The UUID of the Notion user

**Response Format**:

```json
{
  "uri": "notion://users/27d79ae0-cac2-4c5a-9610-058e07da8eb8",
  "name": "John Doe",
  "mimeType": "application/json",
  "text": "# Notion User: John Doe\n\n- **Type**: person\n- **Email**: joh...@example.com\n..."
}
```

**Features**:

- User type (person or bot)
- Scrubbed email address
- Avatar URL (if available)

### notion://pages/{pageId}

**Description**: Provides access to a specific Notion page and its content.

**Parameters**:

- `pageId` (required): The UUID of the Notion page

**Response Format**:

```json
{
  "uri": "notion://pages/0b76f124-6d3f-4363-b7cd-9c80f8dd5d99",
  "name": "Project Planning",
  "mimeType": "application/json",
  "text": "# Project Planning\n\n**Created**: 2024-01-15\n**Last edited**: 2024-01-20\n\n## Content\n..."
}
```

**Features**:

- Page metadata (dates, authors)
- Full page content (if requested)
- Property values
- URL to Notion UI

### notion://databases/{databaseId}

**Description**: Provides schema and metadata for a specific Notion database.

**Parameters**:

- `databaseId` (required): The UUID of the Notion database

**Response Format**:

```json
{
  "uri": "notion://databases/afaef4da-9447-4958-913c-156b2e979e2a",
  "name": "Task Tracker",
  "mimeType": "application/json",
  "text": "# Database: Task Tracker\n\n**Description**: Track project tasks\n\n## Properties\n- Name (title)\n- Status (select)\n..."
}
```

**Features**:

- Database description
- Complete schema with property types
- Property configurations
- Database metadata

## Tools

Tools enable operations on Notion content. All tools return structured responses.

### notion-search

**Description**: Search for pages and databases across the entire Notion workspace.

**Arguments**:

```typescript
{
  query: string;                    // Required: Search query (1-1000 chars)
  filter?: {
    type?: 'page' | 'database';   // Optional: Filter by object type
  };
  sort?: {
    direction?: 'ascending' | 'descending';  // Optional: Sort direction
    timestamp?: 'last_edited_time';          // Optional: Sort by timestamp
  };
}
```

**Response Example**:

```json
{
  "content": [
    {
      "type": "text",
      "text": "Found 3 results for \"project planning\":\n\n1. **Project Planning Template** (page)\n   Last edited: 2024-01-20\n   URL: https://notion.so/...\n\n2. **Q1 Project Planning** (page)..."
    }
  ]
}
```

### notion-list-databases

**Description**: List all accessible databases in the Notion workspace.

**Arguments**: None

**Response Example**:

```json
{
  "content": [
    {
      "type": "text",
      "text": "## Databases in Workspace\n\n1. **Task Tracker**\n   ID: afaef4da-9447-4958-913c-156b2e979e2a\n   Description: Track project tasks and deliverables\n   Properties: 8\n\n2. **Meeting Notes**..."
    }
  ]
}
```

### notion-query-database

**Description**: Query a specific database with optional filters and sorting.

**Arguments**:

```typescript
{
  database_id: string;              // Required: Database UUID
  filter?: {                        // Optional: Filter conditions
    property: string;
    condition: string;
    value: any;
  };
  sorts?: Array<{                   // Optional: Sort configuration
    property: string;
    direction: 'ascending' | 'descending';
  }>;
  page_size?: number;               // Optional: Results per page (1-100, default 10)
}
```

**Response Example**:

```json
{
  "content": [
    {
      "type": "text",
      "text": "## Query Results: Task Tracker\n\nFound 5 items:\n\n1. **Design System Update**\n   Status: In Progress\n   Assignee: John Doe\n   Due: 2024-02-01\n\n2. **API Documentation**..."
    }
  ]
}
```

### notion-get-page

**Description**: Retrieve a specific page by ID, optionally including its content blocks.

**Arguments**:

```typescript
{
  page_id: string;                  // Required: Page UUID
  include_content?: boolean;        // Optional: Include page content (default false)
}
```

**Response Example**:

```json
{
  "content": [
    {
      "type": "text",
      "text": "# Project Planning\n\n**Type**: page\n**Created**: 2024-01-15T10:30:00Z\n**Last edited**: 2024-01-20T14:45:00Z\n**URL**: https://notion.so/...\n\n## Properties\n- Status: Active\n- Priority: High\n\n## Content\n..."
    }
  ]
}
```

### notion-list-users

**Description**: List all users in the Notion workspace, including both people and bot users.

**Arguments**: None

**Response Example**:

```json
{
  "content": [
    {
      "type": "text",
      "text": "## Notion Workspace Users\n\nFound 5 users:\n\n### People (4)\n1. **John Doe** - joh...@example.com\n2. **Jane Smith** - jan...@example.com\n\n### Bots (1)\n1. **MCP Integration** - Bot user for API access"
    }
  ]
}
```

## Error Responses

All tools and resources use consistent error formatting:

```json
{
  "error": {
    "code": "INVALID_PARAMS",
    "message": "Invalid page_id format. Expected UUID.",
    "details": {
      "field": "page_id",
      "value": "invalid-id"
    }
  }
}
```

### Error Codes

- `INVALID_PARAMS`: Invalid input parameters
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `PERMISSION_DENIED`: Insufficient access rights
- `RATE_LIMITED`: API rate limit exceeded
- `INTERNAL_ERROR`: Unexpected server error

## Data Formats

### UUIDs

All Notion object IDs must be provided as standard UUIDs with hyphens:

- ✅ Correct: `0b76f124-6d3f-4363-b7cd-9c80f8dd5d99`
- ❌ Incorrect: `0b76f1246d3f4363b7cd9c80f8dd5d99`

### Timestamps

All timestamps are in ISO 8601 format:

- Example: `2024-01-20T14:45:00.000Z`

### PII Scrubbing

Email addresses are automatically scrubbed in all responses:

- Input: `john.doe@example.com`
- Output: `joh...@example.com`

## Rate Limits

The Notion API has rate limits that this server respects:

- Requests are automatically retried with exponential backoff
- Rate limit errors return appropriate error codes
- Future versions will implement client-side rate limiting

## Pagination

List operations support pagination:

- Default page size: 10 items
- Maximum page size: 100 items
- Pagination info included in responses when applicable
- Use `page_size` parameter to control results

## Best Practices

1. **Use Specific Queries**: More specific searches return faster
2. **Request Only Needed Data**: Use `include_content` sparingly
3. **Handle Errors Gracefully**: Check for error responses
4. **Respect Rate Limits**: Don't make excessive requests
5. **Cache When Appropriate**: Results can be cached client-side

## Examples

### Search for Project Documents

```javascript
{
  "tool": "notion-search",
  "arguments": {
    "query": "project planning",
    "filter": { "type": "page" },
    "sort": {
      "direction": "descending",
      "timestamp": "last_edited_time"
    }
  }
}
```

### Get Database Schema

```javascript
{
  "resource": "notion://databases/afaef4da-9447-4958-913c-156b2e979e2a"
}
```

### List Recent Tasks

```javascript
{
  "tool": "notion-query-database",
  "arguments": {
    "database_id": "afaef4da-9447-4958-913c-156b2e979e2a",
    "filter": {
      "property": "Status",
      "condition": "equals",
      "value": "In Progress"
    },
    "sorts": [{
      "property": "Due Date",
      "direction": "ascending"
    }],
    "page_size": 20
  }
}
```
