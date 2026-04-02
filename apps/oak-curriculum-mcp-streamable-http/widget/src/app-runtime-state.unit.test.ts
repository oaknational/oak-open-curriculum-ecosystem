import { describe, expect, it } from 'vitest';
import { initialAppRuntimeState, reduceAppRuntimeState } from './app-runtime-state.js';

describe('reduceAppRuntimeState', () => {
  it('captures the current tool name and theme from host context changes', () => {
    const nextState = reduceAppRuntimeState(initialAppRuntimeState, {
      type: 'host-context-changed',
      hostContext: {
        theme: 'dark',
        toolInfo: {
          tool: {
            inputSchema: {
              type: 'object',
            },
            name: 'get-curriculum-model',
          },
        },
      },
    });

    expect(nextState).toEqual({
      ...initialAppRuntimeState,
      currentToolName: 'get-curriculum-model',
      theme: 'dark',
    });
  });

  it('preserves tool lifecycle state for partial input, result, cancellation, and teardown', () => {
    const withPartialInput = reduceAppRuntimeState(initialAppRuntimeState, {
      type: 'tool-input-partial',
      partialToolInput: {
        query: 'fractions',
      },
    });
    const withResult = reduceAppRuntimeState(withPartialInput, {
      type: 'tool-result',
      toolResult: {
        content: [],
        structuredContent: {
          status: 'ok',
        },
      },
    });
    const withCancellation = reduceAppRuntimeState(withResult, {
      type: 'tool-cancelled',
      reason: 'user action',
    });
    const withTeardown = reduceAppRuntimeState(withCancellation, {
      type: 'teardown-requested',
    });

    expect(withTeardown.partialToolInput).toEqual({ query: 'fractions' });
    expect(withTeardown.toolResult?.structuredContent).toEqual({ status: 'ok' });
    expect(withTeardown.cancellationReason).toBe('user action');
    expect(withTeardown.teardownRequested).toBe(true);
  });
});
