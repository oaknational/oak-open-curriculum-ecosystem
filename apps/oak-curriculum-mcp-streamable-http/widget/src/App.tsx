/** Package version from `package.json`, injected at build time by Vite `define`. */
declare const __APP_VERSION__: string;

/**
 * Connected MCP App component and presentational shell.
 *
 * @remarks
 * Host-context styling and runtime state dispatch are composed in a
 * single `onhostcontextchanged` handler registered in `onAppCreated`.
 * The SDK's `useHostStyleVariables` hook is NOT used because it
 * internally registers its own `onhostcontextchanged` handler, and the
 * SDK exposes only one callback slot per notification — a second
 * assignment silently overwrites the first.
 */
import {
  applyDocumentTheme,
  applyHostStyleVariables as applyMcpHostStyleVariables,
  type McpUiHostContext,
  type App as McpApp,
} from '@modelcontextprotocol/ext-apps';
import { useApp } from '@modelcontextprotocol/ext-apps/react';
import { useReducer } from 'react';
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
 * concern cannot poison the runtime state dispatch in the same callback.
 *
 * The MCP Apps SDK constrains host style variable keys to a closed union
 * of 73 specific names (e.g. `--color-background-primary`), none of which
 * overlap with Oak's `--oak-*` token namespace. Namespace collision is
 * therefore prevented at the protocol level.
 */
function syncHostContextStyling(
  hostContext: Partial<McpUiHostContext>,
  dispatch: AppRuntimeDispatch,
): void {
  try {
    if (hostContext.theme) {
      applyDocumentTheme(hostContext.theme);
    }

    if (hostContext.styles?.variables) {
      applyMcpHostStyleVariables(hostContext.styles.variables);
    }
  } catch (error: unknown) {
    dispatch({
      type: 'runtime-error',
      errorMessage: error instanceof Error ? error.message : 'Host styling synchronisation failed',
    });
  }
}

/**
 * Creates a callback that opens an external URL via the MCP Apps SDK.
 *
 * @remarks
 * When `app` is null (not yet connected), the callback does nothing and
 * the native `<a href>` fallback is allowed to navigate. When `app` is
 * connected, `preventDefault` is called before delegating to `openLink`.
 *
 * @param app - The MCP App instance, or null if not yet connected.
 */
function createOpenLinkHandler(app: McpApp | null): (url: string, event: React.MouseEvent) => void {
  return (url, event) => {
    if (!app) {
      return;
    }

    event.preventDefault();
    void app.openLink({ url });
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
  readonly onOpenLink: (url: string, event: React.MouseEvent) => void;
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
 * lifecycle handlers and the composed host-context handler in
 * `onAppCreated`. Delegates rendering to {@link AppView}.
 *
 * Host-context styling (theme + CSS variables) and runtime state
 * dispatch are composed in a single `onhostcontextchanged` handler to
 * avoid the single-callback-slot overwrite problem documented in the
 * module-level TSDoc.
 */
export function App(): React.JSX.Element {
  const [, dispatch] = useReducer(reduceAppRuntimeState, initialAppRuntimeState);
  const { app } = useApp({
    appInfo: {
      name: 'oak-curriculum-mcp-app',
      version: __APP_VERSION__,
    },
    capabilities: {},
    onAppCreated: (createdApp) => {
      registerAppRuntimeHandlers(createdApp, dispatch);

      // Compose styling and state dispatch in a single host-context
      // handler. Each concern is error-isolated: syncHostContextStyling
      // catches internally so a styling failure cannot prevent the
      // state-machine dispatch.
      createdApp.onhostcontextchanged = (updatedHostContext) => {
        syncHostContextStyling(updatedHostContext, dispatch);
        applyHostContextToRuntime(dispatch, updatedHostContext);
      };

      // Apply initial host context if available at creation time.
      const initialContext = createdApp.getHostContext();

      if (initialContext) {
        syncHostContextStyling(initialContext, dispatch);
        applyHostContextToRuntime(dispatch, initialContext);
      }
    },
  });

  return <AppView onOpenLink={createOpenLinkHandler(app)} />;
}
