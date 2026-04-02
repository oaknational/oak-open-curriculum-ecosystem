import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found — MCP App cannot mount');
}

createRoot(rootElement).render(<App />);
