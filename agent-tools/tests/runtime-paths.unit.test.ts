import { describe, expect, it } from 'vitest';

import { escapedRepoPath, isSessionId } from '../src/core/runtime-paths';

describe('runtime paths', () => {
  it('escapes repo path for claude projects folder', () => {
    expect(escapedRepoPath('/workspace/code/oak/oak-mcp-ecosystem')).toBe(
      '-workspace-code-oak-oak-mcp-ecosystem',
    );
  });

  it('escapes windows-style repo paths', () => {
    expect(escapedRepoPath('C:\\workspace\\dev\\repo')).toBe('C:-workspace-dev-repo');
  });

  it('validates claude session id format', () => {
    expect(isSessionId('ba250735-a6e1-48db-9a5a-fa7bdb2daa06')).toBe(true);
    expect(isSessionId('not-a-session')).toBe(false);
  });
});
