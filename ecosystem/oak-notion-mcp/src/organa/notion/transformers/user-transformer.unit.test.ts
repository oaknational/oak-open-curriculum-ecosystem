import { describe, it, expect } from 'vitest';
import { transformNotionUserToMcpResource } from './user-transformer.js';
import type { UserObjectResponse } from '@notionhq/client';

describe('transformNotionUserToMcpResource', () => {
  it('should transform a person user', () => {
    const notionUser: UserObjectResponse = {
      object: 'user',
      id: 'user-123',
      type: 'person',
      name: 'John Doe',
      avatar_url: 'https://example.com/avatar.jpg',
      person: {
        email: 'john.doe@example.com',
      },
    };

    const result = transformNotionUserToMcpResource(notionUser);

    expect(result).toEqual({
      uri: 'notion://users/user-123',
      name: 'John Doe',
      description: 'Notion workspace user',
      mimeType: 'application/json',
      _meta: {
        type: 'person',
        avatar_url: 'https://example.com/avatar.jpg',
        email: 'j******e@example.com', // Email should be scrubbed
      },
    });
  });

  it('should transform a bot user', () => {
    const notionUser: UserObjectResponse = {
      object: 'user',
      id: 'bot-123',
      type: 'bot',
      name: 'My Integration',
      avatar_url: null,
      bot: {},
    };

    const result = transformNotionUserToMcpResource(notionUser);

    expect(result).toEqual({
      uri: 'notion://users/bot-123',
      name: 'My Integration',
      description: 'Notion bot user',
      mimeType: 'application/json',
      _meta: {
        type: 'bot',
        avatar_url: null,
      },
    });
  });

  it('should handle user without name', () => {
    const notionUser: UserObjectResponse = {
      object: 'user',
      id: 'user-456',
      type: 'person',
      name: null,
      avatar_url: null,
      person: {
        email: 'anonymous@example.com',
      },
    };

    const result = transformNotionUserToMcpResource(notionUser);

    expect(result.name).toBe('Unknown User');
    expect(result._meta?.email).toBe('a*******s@example.com');
  });
});
