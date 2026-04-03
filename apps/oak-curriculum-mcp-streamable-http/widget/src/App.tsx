import {
  applyDocumentTheme,
  applyHostStyleVariables as applyMcpHostStyleVariables,
  type McpUiHostContext,
} from '@modelcontextprotocol/ext-apps';
import { useApp, useHostStyleVariables } from '@modelcontextprotocol/ext-apps/react';
import { useEffect, useReducer } from 'react';
import {
  applyHostContextToRuntime,
  initialAppRuntimeState,
  reduceAppRuntimeState,
  registerAppRuntimeHandlers,
  type AppRuntimeDispatch,
  type AppRuntimeState,
} from './app-runtime-state.js';

interface AppViewProps {
  readonly state: AppRuntimeState;
  readonly isConnected: boolean;
  readonly error: Error | null;
}

interface ConnectionStatus {
  readonly label: string;
  readonly state: 'error' | 'connected' | 'pending';
}

/**
 * Applies host-provided visual styling to the document.
 *
 * @remarks
 * Sets the document-level theme attribute and host CSS custom properties.
 * Errors are caught and dispatched as runtime errors so that the styling
 * concern cannot poison the state-machine dispatch in the same callback.
 *
 * The MCP Apps SDK constrains host style variable keys to a closed union
 * of 73 specific names (e.g. `--color-background-primary`), none of which
 * overlap with Oak's `--oak-*` token namespace. Namespace collision is
 * therefore prevented at the protocol level.
 */
function syncHostContextStyling(
  hostContext: Partial<McpUiHostContext>,
  dispatch?: AppRuntimeDispatch,
): void {
  try {
    if (hostContext.theme) {
      applyDocumentTheme(hostContext.theme);
    }

    if (hostContext.styles?.variables) {
      applyMcpHostStyleVariables(hostContext.styles.variables);
    }
  } catch (error: unknown) {
    if (dispatch) {
      dispatch({
        type: 'runtime-error',
        errorMessage:
          error instanceof Error ? error.message : 'Host styling synchronisation failed',
      });
    }
  }
}

function getConnectionStatus(error: Error | null, isConnected: boolean): ConnectionStatus {
  if (error) {
    return {
      label: 'MCP host connection failed',
      state: 'error',
    };
  }

  if (isConnected) {
    return {
      label: 'Connected to MCP host',
      state: 'connected',
    };
  }

  return {
    label: 'Waiting for MCP host connection',
    state: 'pending',
  };
}

function AppHeader({
  connectionStatus,
}: {
  readonly connectionStatus: ConnectionStatus;
}): React.JSX.Element {
  return (
    <header className="oak-shell__header">
      <p className="oak-shell__eyebrow">Oak Curriculum MCP App</p>
      <div className="oak-shell__header-row">
        <div>
          <h1 className="oak-shell__title">Oak Curriculum</h1>
          <p className="oak-shell__summary">
            The app runtime is listening for host context, tool input, and tool results through the
            canonical MCP Apps React surface.
          </p>
        </div>
        <p className="oak-status-pill" data-state={connectionStatus.state}>
          {connectionStatus.label}
        </p>
      </div>
    </header>
  );
}

function AppRuntimeGrid({ state }: Pick<AppViewProps, 'state'>): React.JSX.Element {
  return (
    <dl className="oak-runtime-grid">
      <div className="oak-runtime-grid__item">
        <dt>Active tool</dt>
        <dd>{state.currentToolName ?? 'Awaiting tool selection'}</dd>
      </div>
      <div className="oak-runtime-grid__item">
        <dt>Theme</dt>
        <dd>{state.theme ?? 'Awaiting host theme'}</dd>
      </div>
      <div className="oak-runtime-grid__item">
        <dt>Partial input</dt>
        <dd>{state.partialToolInput ? 'Streaming' : 'Idle'}</dd>
      </div>
      <div className="oak-runtime-grid__item">
        <dt>Result</dt>
        <dd>{state.toolResult ? 'Received' : 'Awaiting result'}</dd>
      </div>
    </dl>
  );
}

function AppRuntimeMessages({
  state,
  error,
}: Pick<AppViewProps, 'state' | 'error'>): React.JSX.Element {
  return (
    <>
      {error ? (
        <p className="oak-alert" role="alert">
          {error.message}
        </p>
      ) : null}

      {state.errorMessage ? (
        <p className="oak-alert" role="alert">
          {state.errorMessage}
        </p>
      ) : null}

      {state.cancellationReason ? (
        <p className="oak-note">Last cancellation: {state.cancellationReason}</p>
      ) : null}

      {state.teardownRequested ? (
        <p className="oak-note">The host requested teardown for this app resource.</p>
      ) : null}
    </>
  );
}

/**
 * Pure presentational component for the MCP App shell.
 *
 * @remarks
 * Renders connection status, runtime state grid, and error/notification
 * messages. Separated from {@link App} so that it can be tested in
 * isolation without MCP Apps SDK side effects.
 */
export function AppView({ state, isConnected, error }: AppViewProps): React.JSX.Element {
  const connectionStatus = getConnectionStatus(error, isConnected);

  return (
    <div className="oak-app" data-testid="oak-mcp-app-shell">
      <div className="oak-shell">
        <AppHeader connectionStatus={connectionStatus} />
        <main className="oak-shell__body">
          <AppRuntimeGrid state={state} />
          <AppRuntimeMessages state={state} error={error} />
        </main>
      </div>
    </div>
  );
}

/**
 * Connected MCP App component.
 *
 * @remarks
 * Initialises the MCP Apps React runtime via {@link useApp}, registers
 * lifecycle handlers, and synchronises host context (theme, styles)
 * with the document. Delegates rendering to {@link AppView}.
 */
export function App(): React.JSX.Element {
  const [state, dispatch] = useReducer(reduceAppRuntimeState, initialAppRuntimeState);
  const { app, isConnected, error } = useApp({
    appInfo: {
      name: 'oak-curriculum-mcp-app',
      version: '0.0.0-development',
    },
    capabilities: {},
    onAppCreated: (createdApp) => {
      registerAppRuntimeHandlers(createdApp, dispatch);
    },
  });

  useHostStyleVariables(app, app?.getHostContext());

  useEffect(() => {
    if (!app) {
      return;
    }

    const hostContext = app.getHostContext();

    if (hostContext) {
      syncHostContextStyling(hostContext, dispatch);
      applyHostContextToRuntime(dispatch, hostContext);
    }

    // The SDK currently exposes one host-context callback slot, so we compose
    // host-style application with local runtime-state updates here.
    // Each concern is error-isolated: syncHostContextStyling catches internally,
    // so a styling failure cannot prevent the state-machine dispatch.
    app.onhostcontextchanged = (updatedHostContext) => {
      syncHostContextStyling(updatedHostContext, dispatch);
      applyHostContextToRuntime(dispatch, updatedHostContext);
    };
  }, [app, dispatch]);

  return <AppView state={state} isConnected={isConnected} error={error} />;
}
