/** Package version from `package.json`, injected at build time by Vite `define`. */
declare const __APP_VERSION__: string;

/**
 * Connected MCP App component and presentational shell.
 *
 * @remarks
 * Host context is accumulated in React state with merge semantics so
 * that partial updates (e.g. theme-only, then variables-only) never
 * lose previously received fields. Styling side-effects are applied
 * reactively via `useEffect` on the accumulated state — not
 * imperatively in the callback — following the canonical MCP Apps SDK
 * React pattern from `ext-apps/docs/patterns.md`.
 *
 * The SDK supports both `on*` property setters and `addEventListener`
 * for multi-listener composition. We use a single composed handler
 * for simplicity and error isolation rather than multiple listeners.
 * The convenience hooks (`useHostStyleVariables`, etc.) are not used
 * because we need to compose styling with runtime state dispatch.
 */
import {
  applyDocumentTheme,
  applyHostFonts,
  applyHostStyleVariables as applyMcpHostStyleVariables,
  type McpUiHostContext,
} from '@modelcontextprotocol/ext-apps';
import { useApp } from '@modelcontextprotocol/ext-apps/react';
import { useCallback, useEffect, useReducer, useState } from 'react';
import {
  applyHostContextToRuntime,
  initialAppRuntimeState,
  reduceAppRuntimeState,
  registerAppRuntimeHandlers,
  type AppRuntimeAction,
} from './app-runtime-state.js';
import { BrandBanner } from './BrandBanner.js';

/**
 * Applies host-provided visual styling to the document.
 *
 * @remarks
 * Applies all three host styling channels: document theme attribute,
 * CSS custom properties, and font declarations. Operates on the
 * accumulated host context so that partial updates never lose
 * previously received styling fields.
 *
 * The MCP Apps SDK constrains host style variable keys to a closed union
 * of standard names (e.g. `--color-background-primary`), none of which
 * overlap with Oak's `--oak-*` token namespace. Namespace collision is
 * therefore prevented at the protocol level.
 */
function syncHostContextStyling(hostContext: Partial<McpUiHostContext>): void {
  if (hostContext.theme) {
    applyDocumentTheme(hostContext.theme);
  }

  if (hostContext.styles?.variables) {
    applyMcpHostStyleVariables(hostContext.styles.variables);
  }

  if (hostContext.styles?.css?.fonts) {
    applyHostFonts(hostContext.styles.css.fonts);
  }
}

/**
 * Pure presentational component for the MCP App shell.
 *
 * @remarks
 * Uses `<main>` as the document landmark and includes a visually hidden
 * `<h1>` for screen readers (WCAG landmark-one-main, page-has-heading-one).
 * The banner is the complete view when `get-curriculum-model` fires
 * (a session-start proxy). The curriculum-model data serves the agent
 * via text content; the human sees only the brand banner for orientation.
 *
 * Safe area insets from the host context are applied as inline padding
 * so content is not obscured by device notches or system UI overlays.
 */
export function AppView({
  onOpenLink,
  safeAreaInsets,
}: {
  readonly onOpenLink: (url: string, event: React.MouseEvent) => void;
  readonly safeAreaInsets?: McpUiHostContext['safeAreaInsets'];
}): React.JSX.Element {
  return (
    <main
      className="oak-app"
      data-testid="oak-mcp-app-shell"
      style={
        safeAreaInsets
          ? {
              paddingTop: safeAreaInsets.top,
              paddingRight: safeAreaInsets.right,
              paddingBottom: safeAreaInsets.bottom,
              paddingLeft: safeAreaInsets.left,
            }
          : undefined
      }
    >
      <h1 className="visually-hidden">Oak National Academy Curriculum</h1>
      <BrandBanner onOpenLink={onOpenLink} />
    </main>
  );
}

/**
 * Applies accumulated host context styling as a React side-effect.
 *
 * @remarks
 * Runs reactively whenever the merged host context changes. Errors are
 * caught so a styling failure cannot poison the React render cycle.
 */
function useHostContextStyling(
  hostContext: Partial<McpUiHostContext> | undefined,
  dispatch: React.Dispatch<AppRuntimeAction>,
): void {
  useEffect(() => {
    if (!hostContext) {
      return;
    }

    try {
      syncHostContextStyling(hostContext);
    } catch (error: unknown) {
      dispatch({
        type: 'runtime-error',
        errorMessage:
          error instanceof Error ? error.message : 'Host styling synchronisation failed',
      });
    }
  }, [hostContext, dispatch]);
}

/**
 * Connected MCP App component.
 *
 * @remarks
 * Initialises the MCP Apps React runtime via {@link useApp}, registers
 * lifecycle handlers, and accumulates host context in React state with
 * merge semantics. Styling side-effects are applied reactively via
 * {@link useHostContextStyling}, following the canonical SDK React
 * pattern. Delegates rendering to {@link AppView}.
 */
export function App(): React.JSX.Element {
  const [, dispatch] = useReducer(reduceAppRuntimeState, initialAppRuntimeState);
  const [hostContext, setHostContext] = useState<Partial<McpUiHostContext>>();

  const { app, isConnected, error } = useApp({
    appInfo: {
      name: 'oak-curriculum-mcp-app',
      version: __APP_VERSION__,
    },
    capabilities: {},
    onAppCreated: (createdApp) => {
      registerAppRuntimeHandlers(createdApp, dispatch);

      createdApp.addEventListener('hostcontextchanged', (updatedHostContext) => {
        setHostContext((prev) => ({ ...prev, ...updatedHostContext }));
        applyHostContextToRuntime(dispatch, updatedHostContext);
      });
    },
  });

  // Apply initial host context after connection.
  useEffect(() => {
    if (app) {
      const initialContext = app.getHostContext();

      if (initialContext) {
        setHostContext(initialContext);
        applyHostContextToRuntime(dispatch, initialContext);
      }
    }
  }, [app, dispatch]);

  useHostContextStyling(hostContext, dispatch);

  useEffect(() => {
    if (error) {
      dispatch({ type: 'runtime-error', errorMessage: error.message });
    }
  }, [error, dispatch]);

  const handleOpenLink = useCallback(
    (url: string, event: React.MouseEvent) => {
      if (!app || !isConnected) {
        return;
      }

      const capabilities = app.getHostCapabilities();

      if (!capabilities?.openLinks) {
        return;
      }

      event.preventDefault();
      void app.openLink({ url });
    },
    [app, isConnected],
  );

  return <AppView onOpenLink={handleOpenLink} safeAreaInsets={hostContext?.safeAreaInsets} />;
}
