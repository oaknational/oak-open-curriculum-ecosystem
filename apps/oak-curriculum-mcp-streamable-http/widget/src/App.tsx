/**
 * MCP App shell component.
 *
 * This is the root React component for the Oak MCP App. It provides the
 * shared layout shell and will host routed views for different tool UIs
 * (curriculum model, user search) in later phases.
 *
 * Phase 2 delivers only the shell scaffold. Phase 4+ adds real views.
 */
export function App(): React.JSX.Element {
  return (
    <div className="oak-mcp-app" data-testid="oak-mcp-app-shell">
      <header className="oak-mcp-app-header">
        <h1>Oak Curriculum</h1>
      </header>
      <main className="oak-mcp-app-main">
        <p>MCP App shell ready. Tool views will be added in Phase 4+.</p>
      </main>
    </div>
  );
}
