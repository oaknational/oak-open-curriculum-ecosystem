/** Reducer-driven runtime state for the Oak MCP App widget. */
import type {
  App,
  McpUiHostContext,
  McpUiResourceTeardownResult,
  McpUiToolCancelledNotification,
  McpUiToolInputNotification,
  McpUiToolInputPartialNotification,
} from '@modelcontextprotocol/ext-apps';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/** Runtime state snapshot for the MCP App widget. */
export interface AppRuntimeState {
  readonly currentToolName: string | null;
  readonly theme: McpUiHostContext['theme'] | null;
  readonly toolInput: McpUiToolInputNotification['params']['arguments'] | null;
  readonly partialToolInput: McpUiToolInputPartialNotification['params']['arguments'] | null;
  readonly toolResult: CallToolResult | null;
  readonly cancellationReason: McpUiToolCancelledNotification['params']['reason'] | null;
  readonly teardownRequested: boolean;
  readonly errorMessage: string | null;
}

/** Discriminated union of all actions the app runtime reducer handles. */
export type AppRuntimeAction =
  | { readonly type: 'host-context-changed'; readonly hostContext: Partial<McpUiHostContext> }
  | {
      readonly type: 'tool-input';
      readonly toolInput: McpUiToolInputNotification['params']['arguments'] | null;
    }
  | {
      readonly type: 'tool-input-partial';
      readonly partialToolInput: McpUiToolInputPartialNotification['params']['arguments'] | null;
    }
  | { readonly type: 'tool-result'; readonly toolResult: CallToolResult }
  | {
      readonly type: 'tool-cancelled';
      readonly reason: McpUiToolCancelledNotification['params']['reason'] | null;
    }
  | { readonly type: 'teardown-requested' }
  | { readonly type: 'runtime-error'; readonly errorMessage: string };

/** Dispatch function for the app runtime reducer. */
export type AppRuntimeDispatch = (action: AppRuntimeAction) => void;

/** Initial state before any host context or tool notifications arrive. */
export const initialAppRuntimeState: AppRuntimeState = {
  currentToolName: null,
  theme: null,
  toolInput: null,
  partialToolInput: null,
  toolResult: null,
  cancellationReason: null,
  teardownRequested: false,
  errorMessage: null,
};

function getToolName(hostContext: Partial<McpUiHostContext>): string | null {
  return hostContext.toolInfo?.tool.name ?? null;
}

/** Dispatches a host-context-changed action from the given host context. */
export function applyHostContextToRuntime(
  dispatch: AppRuntimeDispatch,
  hostContext: Partial<McpUiHostContext>,
): void {
  dispatch({
    type: 'host-context-changed',
    hostContext,
  });
}

/** Dispatch wrapper: catches exceptions and re-dispatches as runtime-error. */
function createSafeDispatch(dispatch: AppRuntimeDispatch): AppRuntimeDispatch {
  return (action) => {
    try {
      dispatch(action);
    } catch (error: unknown) {
      if (action.type !== 'runtime-error') {
        dispatch({
          type: 'runtime-error',
          errorMessage:
            error instanceof Error ? error.message : `Dispatch failed for action "${action.type}"`,
        });
      }
    }
  };
}

/** Registers MCP Apps SDK lifecycle handlers with exception-isolated dispatch. */
export function registerAppRuntimeHandlers(app: App, dispatch: AppRuntimeDispatch): void {
  const safeDispatch = createSafeDispatch(dispatch);

  app.addEventListener('toolinput', ({ arguments: toolInput }) => {
    safeDispatch({
      type: 'tool-input',
      toolInput: toolInput ?? null,
    });
  });

  app.addEventListener('toolinputpartial', ({ arguments: partialToolInput }) => {
    safeDispatch({
      type: 'tool-input-partial',
      partialToolInput: partialToolInput ?? null,
    });
  });

  app.addEventListener('toolresult', (toolResult) => {
    safeDispatch({
      type: 'tool-result',
      toolResult,
    });
  });

  app.addEventListener('toolcancelled', ({ reason }) => {
    safeDispatch({
      type: 'tool-cancelled',
      reason: reason ?? null,
    });
  });

  app.onteardown = async (): Promise<McpUiResourceTeardownResult> => {
    safeDispatch({
      type: 'teardown-requested',
    });

    return {};
  };

  app.onerror = (error) => {
    safeDispatch({
      type: 'runtime-error',
      errorMessage: error.message,
    });
  };
}

function reduceHostContextChanged(
  state: AppRuntimeState,
  action: Extract<AppRuntimeAction, { readonly type: 'host-context-changed' }>,
): AppRuntimeState {
  return {
    ...state,
    currentToolName: getToolName(action.hostContext) ?? state.currentToolName,
    theme: action.hostContext.theme ?? state.theme,
  };
}

function reduceToolInput(
  state: AppRuntimeState,
  action: Extract<AppRuntimeAction, { readonly type: 'tool-input' }>,
): AppRuntimeState {
  return {
    ...state,
    toolInput: action.toolInput,
    // Seed partialToolInput from the full input so consumers see the latest
    // arguments regardless of whether a partial-streaming phase preceded.
    partialToolInput: action.toolInput,
    toolResult: null,
    cancellationReason: null,
    teardownRequested: false,
    errorMessage: null,
  };
}

function reduceToolInputPartial(
  state: AppRuntimeState,
  action: Extract<AppRuntimeAction, { readonly type: 'tool-input-partial' }>,
): AppRuntimeState {
  return {
    ...state,
    partialToolInput: action.partialToolInput,
    cancellationReason: null,
    teardownRequested: false,
    errorMessage: null,
  };
}

function reduceToolResult(
  state: AppRuntimeState,
  action: Extract<AppRuntimeAction, { readonly type: 'tool-result' }>,
): AppRuntimeState {
  return {
    ...state,
    toolResult: action.toolResult,
    cancellationReason: null,
    errorMessage: null,
  };
}

function reduceToolCancelled(
  state: AppRuntimeState,
  action: Extract<AppRuntimeAction, { readonly type: 'tool-cancelled' }>,
): AppRuntimeState {
  return {
    ...state,
    cancellationReason: action.reason ?? null,
  };
}

function reduceTeardownRequested(state: AppRuntimeState): AppRuntimeState {
  return {
    ...state,
    teardownRequested: true,
  };
}

function reduceRuntimeError(
  state: AppRuntimeState,
  action: Extract<AppRuntimeAction, { readonly type: 'runtime-error' }>,
): AppRuntimeState {
  return {
    ...state,
    errorMessage: action.errorMessage,
  };
}

/** Pure reducer — exhaustively checked at compile time via the `never` default. */
export function reduceAppRuntimeState(
  state: AppRuntimeState,
  action: AppRuntimeAction,
): AppRuntimeState {
  switch (action.type) {
    case 'host-context-changed':
      return reduceHostContextChanged(state, action);
    case 'tool-input':
      return reduceToolInput(state, action);
    case 'tool-input-partial':
      return reduceToolInputPartial(state, action);
    case 'tool-result':
      return reduceToolResult(state, action);
    case 'tool-cancelled':
      return reduceToolCancelled(state, action);
    case 'teardown-requested':
      return reduceTeardownRequested(state);
    case 'runtime-error':
      return reduceRuntimeError(state, action);
    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}
