import {
  applyDocumentTheme,
  applyHostStyleVariables as applyMcpHostStyleVariables,
  type McpUiHostContext,
  type App as McpApp,
} from '@modelcontextprotocol/ext-apps';
import { useApp, useHostStyleVariables } from '@modelcontextprotocol/ext-apps/react';
import { useEffect, useReducer } from 'react';
import {
  applyHostContextToRuntime,
  initialAppRuntimeState,
  reduceAppRuntimeState,
  registerAppRuntimeHandlers,
  type AppRuntimeDispatch,
} from './app-runtime-state.js';
import { BrandBanner } from './BrandBanner.js';

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

/**
 * Creates a callback that opens an external URL via the MCP Apps SDK.
 *
 * @remarks
 * Handles `app` nullability — if the app is not yet connected, the
 * callback is a no-op. The banner link has a real `href` as fallback.
 */
function createOpenLinkHandler(app: McpApp | null): (url: string) => void {
  return (url: string) => {
    void app?.openLink({ url });
  };
}

/**
 * Pure presentational component for the MCP App shell.
 *
 * @remarks
 * Renders the Oak brand banner — logo + "Oak National Academy" link.
 * The banner is the complete view when `get-curriculum-model` fires
 * (a session-start proxy). The curriculum-model data serves the agent
 * via text content; the human sees only the brand banner for orientation.
 */
export function AppView({
  onOpenLink,
}: {
  readonly onOpenLink: (url: string) => void;
}): React.JSX.Element {
  return (
    <div className="oak-app" data-testid="oak-mcp-app-shell">
      <BrandBanner onOpenLink={onOpenLink} />
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
  const [, dispatch] = useReducer(reduceAppRuntimeState, initialAppRuntimeState);
  const { app } = useApp({
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

  return <AppView onOpenLink={createOpenLinkHandler(app)} />;
}
