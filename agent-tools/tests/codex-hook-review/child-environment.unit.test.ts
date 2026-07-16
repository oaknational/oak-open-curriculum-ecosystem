import { describe, expect, it } from 'vitest';

import { createReviewChildEnvironment } from '../../src/codex-hook-review/child-environment.js';
import { type ReviewRuntimeLayout } from '../../src/codex-hook-review/review-assets.js';

describe('createReviewChildEnvironment', () => {
  it('passes only the fixed runtime values and narrow operational allowlist', () => {
    const environment = createReviewChildEnvironment(
      {
        PATH: 'bin',
        TMPDIR: 'scratch',
        OPENAI_API_KEY: 'must-not-pass',
        GITLEAKS_CONFIG: 'must-not-pass',
        CLAUDE_TRANSCRIPT_PATH: 'must-not-pass',
      },
      layout(),
    );

    expect(environment).toEqual({
      HOME: 'review-home',
      CODEX_HOME: 'codex-home',
      NO_COLOR: '1',
      TERM: 'dumb',
      RUST_LOG: 'error',
      TMPDIR: 'scratch',
    });
  });
});

function layout(): ReviewRuntimeLayout {
  return {
    baseDirectory: 'base',
    codexHome: 'codex-home',
    homeDirectory: 'review-home',
    workingDirectory: 'work',
    outputSchemaPath: 'schema',
    instructionsPath: 'instructions',
    skillPath: undefined,
  };
}
