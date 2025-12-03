/**
 * Integration tests for the Knowledge Graph renderer.
 *
 * These tests verify BEHAVIOR: the knowledge graph renderer is correctly
 * integrated into the widget system so that when the get-knowledge-graph
 * tool is called, the appropriate renderer is selected and executed.
 *
 * Per testing-strategy.md, integration tests verify how code units work
 * together when imported - NOT running systems.
 *
 * @see knowledge-graph-renderer.ts - Renderer implementation
 * @see widget-renderer-registry.ts - Tool to renderer mapping
 * @see widget-renderers/index.ts - Renderer exports
 * @see testing-strategy.md - Integration test definitions
 */

import { describe, it, expect } from 'vitest';
import { WIDGET_RENDERER_FUNCTIONS, RENDERER_FUNCTION_NAMES } from './index.js';
import { TOOL_RENDERER_MAP, RENDERER_IDS } from '../widget-renderer-registry.js';
import { WIDGET_SCRIPT } from '../widget-script.js';

describe('Knowledge Graph renderer integration: tool maps to renderer', () => {
  it('get-knowledge-graph tool maps to a renderer in the registry', () => {
    const rendererId = TOOL_RENDERER_MAP['get-knowledge-graph'];
    expect(rendererId).toBeDefined();
    expect(RENDERER_IDS).toContain(rendererId);
  });

  it('the mapped renderer has a corresponding render function', () => {
    const rendererId = TOOL_RENDERER_MAP['get-knowledge-graph'];
    const functionName =
      RENDERER_FUNCTION_NAMES[rendererId as keyof typeof RENDERER_FUNCTION_NAMES];
    expect(functionName).toBeDefined();
    expect(WIDGET_RENDERER_FUNCTIONS).toContain(`function ${functionName}(`);
  });
});

describe('Knowledge Graph renderer integration: renderer available in widget', () => {
  it('the knowledge graph render function is available in WIDGET_RENDERER_FUNCTIONS', () => {
    // The combined renderer functions should include the knowledge graph renderer
    expect(WIDGET_RENDERER_FUNCTIONS).toContain('renderKnowledgeGraph');
  });

  it('the widget script dispatches to the knowledge graph renderer', () => {
    // The RENDERERS object in the widget script should include the mapping
    expect(WIDGET_SCRIPT).toContain('knowledgeGraph');
    expect(WIDGET_SCRIPT).toContain('renderKnowledgeGraph');
  });
});

describe('Knowledge Graph renderer integration: registry coherence', () => {
  it('all required mappings are consistent from tool to render function', () => {
    // Full chain: tool name → renderer ID → function name → actual function
    const toolName = 'get-knowledge-graph';

    // Tool maps to renderer ID
    const rendererId = TOOL_RENDERER_MAP[toolName];
    expect(rendererId).toBe('knowledgeGraph');

    // Renderer ID is valid
    expect(RENDERER_IDS).toContain(rendererId);

    // Renderer ID maps to function name
    const functionName =
      RENDERER_FUNCTION_NAMES[rendererId as keyof typeof RENDERER_FUNCTION_NAMES];
    expect(functionName).toBe('renderKnowledgeGraph');

    // Function exists in combined output
    expect(WIDGET_RENDERER_FUNCTIONS).toContain(`function ${functionName}(`);
  });
});
