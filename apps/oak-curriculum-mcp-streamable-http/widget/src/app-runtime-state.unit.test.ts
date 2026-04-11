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

  it('clears stale lifecycle state when a new tool input arrives', () => {
    const priorState = {
      ...initialAppRuntimeState,
      toolResult: { content: [], structuredContent: { status: 'ok' } },
      cancellationReason: 'user action' as const,
      teardownRequested: true,
      errorMessage: 'something broke',
    };

    const nextState = reduceAppRuntimeState(priorState, {
      type: 'tool-input',
      toolInput: { query: 'photosynthesis' },
    });

    expect(nextState.toolInput).toEqual({ query: 'photosynthesis' });
    expect(nextState.partialToolInput).toEqual({ query: 'photosynthesis' });
    expect(nextState.toolResult).toBeNull();
    expect(nextState.cancellationReason).toBeNull();
    expect(nextState.teardownRequested).toBe(false);
    expect(nextState.errorMessage).toBeNull();
  });

  it('updates partial input and clears downstream lifecycle state', () => {
    const priorState = {
      ...initialAppRuntimeState,
      cancellationReason: 'timeout' as const,
      teardownRequested: true,
      errorMessage: 'stale error',
    };

    const nextState = reduceAppRuntimeState(priorState, {
      type: 'tool-input-partial',
      partialToolInput: { query: 'fractions' },
    });

    expect(nextState.partialToolInput).toEqual({ query: 'fractions' });
    expect(nextState.cancellationReason).toBeNull();
    expect(nextState.teardownRequested).toBe(false);
    expect(nextState.errorMessage).toBeNull();
  });

  it('stores a tool result and clears cancellation and error state', () => {
    const priorState = {
      ...initialAppRuntimeState,
      cancellationReason: 'user action' as const,
      errorMessage: 'stale',
    };

    const nextState = reduceAppRuntimeState(priorState, {
      type: 'tool-result',
      toolResult: {
        content: [],
        structuredContent: { status: 'ok' },
      },
    });

    expect(nextState.toolResult?.structuredContent).toEqual({ status: 'ok' });
    expect(nextState.cancellationReason).toBeNull();
    expect(nextState.errorMessage).toBeNull();
  });

  it('records a cancellation reason', () => {
    const nextState = reduceAppRuntimeState(initialAppRuntimeState, {
      type: 'tool-cancelled',
      reason: 'user action',
    });

    expect(nextState.cancellationReason).toBe('user action');
  });

  it('marks teardown as requested', () => {
    const nextState = reduceAppRuntimeState(initialAppRuntimeState, {
      type: 'teardown-requested',
    });

    expect(nextState.teardownRequested).toBe(true);
  });

  it('records a runtime error message', () => {
    const nextState = reduceAppRuntimeState(initialAppRuntimeState, {
      type: 'runtime-error',
      errorMessage: 'connection lost',
    });

    expect(nextState.errorMessage).toBe('connection lost');
  });
});
