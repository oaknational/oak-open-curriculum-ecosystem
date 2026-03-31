/**
 * Unit tests for the MCP App shell component.
 *
 * These tests run in a jsdom environment to verify the React shell renders
 * the expected DOM structure and markers.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App.js';

describe('App shell', () => {
  it('renders the app shell with the expected test id marker', () => {
    render(<App />);
    expect(screen.getByTestId('oak-mcp-app-shell')).toBeDefined();
  });

  it('renders the Oak Curriculum heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /oak curriculum/iu })).toBeDefined();
  });

  it('renders a main content area', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeDefined();
  });
});
