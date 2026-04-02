import type {
  App,
  McpUiHostContext,
  McpUiResourceTeardownResult,
  McpUiToolCancelledNotification,
  McpUiToolInputNotification,
  McpUiToolInputPartialNotification,
} from '@modelcontextprotocol/ext-apps';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

type ToolArguments = McpUiToolInputNotification['params']['arguments'] | null;
type PartialToolArguments = McpUiToolInputPartialNotification['params']['arguments'] | null;

export interface AppRuntimeState {
  readonly currentToolName: string | null;
  readonly theme: McpUiHostContext['theme'] | null;
  readonly toolInput: ToolArguments;
  readonly partialToolInput: PartialToolArguments;
  readonly toolResult: CallToolResult | null;
  readonly cancellationReason: McpUiToolCancelledNotification['params']['reason'] | null;
  readonly teardownRequested: boolean;
  readonly errorMessage: string | null;
}

export type AppRuntimeAction =
  | { readonly type: 'host-context-changed'; readonly hostContext: Partial<McpUiHostContext> }
  | { readonly type: 'tool-input'; readonly toolInput: ToolArguments }
  | { readonly type: 'tool-input-partial'; readonly partialToolInput: PartialToolArguments }
  | { readonly type: 'tool-result'; readonly toolResult: CallToolResult }
  | {
      readonly type: 'tool-cancelled';
      readonly reason: McpUiToolCancelledNotification['params']['reason'] | null;
    }
  | { readonly type: 'teardown-requested' }
  | { readonly type: 'runtime-error'; readonly errorMessage: string };

export type AppRuntimeDispatch = (action: AppRuntimeAction) => void;

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

type HostContextChangedAction = Extract<
  AppRuntimeAction,
  { readonly type: 'host-context-changed' }
>;
type ToolInputAction = Extract<AppRuntimeAction, { readonly type: 'tool-input' }>;
type ToolInputPartialAction = Extract<AppRuntimeAction, { readonly type: 'tool-input-partial' }>;
type ToolResultAction = Extract<AppRuntimeAction, { readonly type: 'tool-result' }>;
type ToolCancelledAction = Extract<AppRuntimeAction, { readonly type: 'tool-cancelled' }>;
type RuntimeErrorAction = Extract<AppRuntimeAction, { readonly type: 'runtime-error' }>;

export function applyHostContextToRuntime(
  dispatch: AppRuntimeDispatch,
  hostContext: Partial<McpUiHostContext>,
): void {
  dispatch({
    type: 'host-context-changed',
    hostContext,
  });
}

export function registerAppRuntimeHandlers(app: App, dispatch: AppRuntimeDispatch): void {
  app.ontoolinput = ({ arguments: toolInput }) => {
    dispatch({
      type: 'tool-input',
      toolInput: toolInput ?? null,
    });
  };

  app.ontoolinputpartial = ({ arguments: partialToolInput }) => {
    dispatch({
      type: 'tool-input-partial',
      partialToolInput: partialToolInput ?? null,
    });
  };

  app.ontoolresult = (toolResult) => {
    dispatch({
      type: 'tool-result',
      toolResult,
    });
  };

  app.ontoolcancelled = ({ reason }) => {
    dispatch({
      type: 'tool-cancelled',
      reason: reason ?? null,
    });
  };

  app.onteardown = async (): Promise<McpUiResourceTeardownResult> => {
    dispatch({
      type: 'teardown-requested',
    });

    return {};
  };

  app.onerror = (error) => {
    dispatch({
      type: 'runtime-error',
      errorMessage: error.message,
    });
  };
}

function reduceHostContextChanged(
  state: AppRuntimeState,
  action: HostContextChangedAction,
): AppRuntimeState {
  return {
    ...state,
    currentToolName: getToolName(action.hostContext) ?? state.currentToolName,
    theme: action.hostContext.theme ?? state.theme,
  };
}

function reduceToolInput(state: AppRuntimeState, action: ToolInputAction): AppRuntimeState {
  return {
    ...state,
    toolInput: action.toolInput,
    partialToolInput: action.toolInput,
    toolResult: null,
    cancellationReason: null,
    teardownRequested: false,
    errorMessage: null,
  };
}

function reduceToolInputPartial(
  state: AppRuntimeState,
  action: ToolInputPartialAction,
): AppRuntimeState {
  return {
    ...state,
    partialToolInput: action.partialToolInput,
    cancellationReason: null,
    teardownRequested: false,
    errorMessage: null,
  };
}

function reduceToolResult(state: AppRuntimeState, action: ToolResultAction): AppRuntimeState {
  return {
    ...state,
    toolResult: action.toolResult,
    cancellationReason: null,
    errorMessage: null,
  };
}

function reduceToolCancelled(state: AppRuntimeState, action: ToolCancelledAction): AppRuntimeState {
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

function reduceRuntimeError(state: AppRuntimeState, action: RuntimeErrorAction): AppRuntimeState {
  return {
    ...state,
    errorMessage: action.errorMessage,
  };
}

export function reduceAppRuntimeState(
  state: AppRuntimeState,
  action: AppRuntimeAction,
): AppRuntimeState {
  if (action.type === 'host-context-changed') {
    return reduceHostContextChanged(state, action);
  }

  if (action.type === 'tool-input') {
    return reduceToolInput(state, action);
  }

  if (action.type === 'tool-input-partial') {
    return reduceToolInputPartial(state, action);
  }

  if (action.type === 'tool-result') {
    return reduceToolResult(state, action);
  }

  if (action.type === 'tool-cancelled') {
    return reduceToolCancelled(state, action);
  }

  if (action.type === 'teardown-requested') {
    return reduceTeardownRequested(state);
  }

  if (action.type === 'runtime-error') {
    return reduceRuntimeError(state, action);
  }

  return state;
}
