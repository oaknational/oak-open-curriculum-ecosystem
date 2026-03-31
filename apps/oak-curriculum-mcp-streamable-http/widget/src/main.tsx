/**
 * MCP App entry point.
 *
 * Renders the Oak curriculum MCP App shell into the root element.
 * This is the single entry point for the self-contained widget HTML resource.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found — MCP App cannot mount');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
