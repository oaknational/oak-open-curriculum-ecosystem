import { describe, expect, it } from 'vitest';

import {
  gatedClaudeSeedsPresent,
  gatedSeedsSentence,
  isClaudePlatform,
} from '../../src/collaboration-state/platform-gate.js';

describe('isClaudePlatform', () => {
  it.each(['claude', 'claude-code', 'Claude-Code', ' claude-code '])(
    'reads %j as a Claude platform',
    (label) => {
      expect(isClaudePlatform(label)).toBe(true);
    },
  );

  it.each(['codex', 'cursor', 'gemini', 'antigravity', 'override', 'claudecode', 'claude_code'])(
    'reads %j as not a Claude platform',
    (label) => {
      expect(isClaudePlatform(label)).toBe(false);
    },
  );
});

describe('gatedClaudeSeedsPresent', () => {
  it('names the Claude seeds that are set, in precedence order, on a non-Claude platform', () => {
    expect(
      gatedClaudeSeedsPresent(
        { CLAUDE_CODE_SESSION_ID: 'claude-cli-session', PRACTICE_AGENT_SESSION_ID_CLAUDE: 'seed' },
        'codex',
      ),
    ).toEqual(['PRACTICE_AGENT_SESSION_ID_CLAUDE', 'CLAUDE_CODE_SESSION_ID']);
  });

  it('names nothing on a Claude platform, and nothing for blank values', () => {
    expect(
      gatedClaudeSeedsPresent({ CLAUDE_CODE_SESSION_ID: 'claude-cli-session' }, 'claude-code'),
    ).toEqual([]);
    expect(gatedClaudeSeedsPresent({ CLAUDE_CODE_SESSION_ID: '   ' }, 'codex')).toEqual([]);
  });
});

describe('gatedSeedsSentence', () => {
  it('is empty when nothing was gated', () => {
    expect(gatedSeedsSentence([], 'codex')).toBe('');
  });

  it('reads as one sentence for one seed and for several', () => {
    expect(gatedSeedsSentence(['CLAUDE_CODE_SESSION_ID'], 'codex')).toBe(
      ' CLAUDE_CODE_SESSION_ID is set but does not count on platform codex.',
    );
    expect(
      gatedSeedsSentence(['PRACTICE_AGENT_SESSION_ID_CLAUDE', 'CLAUDE_CODE_SESSION_ID'], 'cursor'),
    ).toBe(
      ' PRACTICE_AGENT_SESSION_ID_CLAUDE and CLAUDE_CODE_SESSION_ID are set but do not count on platform cursor.',
    );
  });
});
