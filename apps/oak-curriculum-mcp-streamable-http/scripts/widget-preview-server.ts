/**
 * Widget Preview Server for local development.
 *
 * Serves the Oak-branded ChatGPT widget with mock data for visual testing
 * and development. This allows rapid iteration on widget styling and
 * functionality without needing to deploy or connect to ChatGPT.
 *
 * @example
 * ```bash
 * # From the oak-curriculum-mcp-streamable-http workspace
 * pnpm widget:preview
 * ```
 *
 * Then visit http://localhost:4580/widget in your browser.
 *
 * @see aggregated-tool-widget.ts - The widget HTML template
 * @see widget-styles.ts - The widget CSS styles
 */

import express from 'express';

import { AGGREGATED_TOOL_WIDGET_HTML } from '../src/aggregated-tool-widget.js';

/**
 * Default port for the widget preview server.
 * This is a development-only script, so a fixed port is acceptable.
 */
const PORT = 4580;

/**
 * Mock data representing typical tool output scenarios.
 * Modify these to test different widget rendering paths.
 */
const MOCK_TOOL_OUTPUT = {
  /** Server overview displayed in the help UI */
  serverOverview: 'Oak National Academy MCP Server',
  /** Tool categories for the help UI */
  toolCategories: [
    {
      category: 'Search',
      tools: ['get-search-lessons', 'get-search-transcripts'],
    },
    {
      category: 'Curriculum',
      tools: ['get-key-stages', 'get-subjects', 'get-units', 'get-lessons'],
    },
    {
      category: 'Lesson Content',
      tools: ['get-lessons-quiz', 'get-lessons-summary', 'get-lessons-transcript'],
    },
  ],
};

/**
 * Mock metadata that would come from tool response annotations.
 */
const MOCK_METADATA = {
  'annotations/title': 'Get Help',
};

const app = express();

/**
 * Serves the widget with injected mock data.
 *
 * The window.openai object is populated with mock data that simulates
 * what ChatGPT would provide when rendering the widget.
 */
app.get('/widget', (req, res) => {
  console.log(`GET ${req.path}`);
  const htmlWithData = AGGREGATED_TOOL_WIDGET_HTML.replace(
    '</head>',
    `<script>
      window.openai = {
        toolOutput: ${JSON.stringify(MOCK_TOOL_OUTPUT, null, 2)},
        toolResponseMetadata: ${JSON.stringify(MOCK_METADATA)}
      };
    </script></head>`,
  );
  res.type('text/html').send(htmlWithData);
});

/**
 * Serves a search results variant for testing the search renderer.
 */
app.get('/widget/search', (req, res) => {
  console.log(`GET ${req.path}`);
  const searchOutput = {
    lessons: [
      {
        lessonTitle: 'Introduction to Fractions',
        lessonSlug: 'introduction-to-fractions',
        unitTitle: 'Fractions',
        subjectTitle: 'Maths',
        keyStageTitle: 'Key Stage 2',
        yearTitle: 'Year 4',
      },
      {
        lessonTitle: 'Adding Fractions',
        lessonSlug: 'adding-fractions',
        unitTitle: 'Fractions',
        subjectTitle: 'Maths',
        keyStageTitle: 'Key Stage 2',
        yearTitle: 'Year 4',
      },
    ],
  };

  const htmlWithData = AGGREGATED_TOOL_WIDGET_HTML.replace(
    '</head>',
    `<script>
      window.openai = {
        toolOutput: ${JSON.stringify(searchOutput, null, 2)},
        toolResponseMetadata: { 'annotations/title': 'Search Lessons' }
      };
    </script></head>`,
  );
  res.type('text/html').send(htmlWithData);
});

/**
 * Serves raw JSON output for testing the fallback JSON renderer.
 */
app.get('/widget/json', (req, res) => {
  console.log(`GET ${req.path}`);
  const jsonOutput = {
    message: 'This is arbitrary JSON data',
    nested: {
      foo: 'bar',
      numbers: [1, 2, 3],
    },
  };

  const htmlWithData = AGGREGATED_TOOL_WIDGET_HTML.replace(
    '</head>',
    `<script>
      window.openai = {
        toolOutput: ${JSON.stringify(jsonOutput, null, 2)},
        toolResponseMetadata: { 'annotations/title': 'JSON Output' }
      };
    </script></head>`,
  );
  res.type('text/html').send(htmlWithData);
});

/**
 * Serves the knowledge graph view for testing the SVG renderer.
 */
app.get('/widget/knowledge-graph', (req, res) => {
  console.log(`GET ${req.path}`);
  const kgOutput = {
    concepts: ['Subject', 'Sequence', 'Unit', 'Lesson'],
    relationships: [{ from: 'Subject', to: 'Sequence' }],
  };

  const htmlWithData = AGGREGATED_TOOL_WIDGET_HTML.replace(
    '</head>',
    `<script>
      window.openai = {
        toolOutput: ${JSON.stringify(kgOutput, null, 2)},
        toolResponseMetadata: { 
          'annotations/title': 'Oak Knowledge Graph',
          toolName: 'get-knowledge-graph'
        }
      };
    </script></head>`,
  );
  res.type('text/html').send(htmlWithData);
});

app.listen(PORT, () => {
  const portStr = String(PORT);
  console.log(`\n🌳 Oak Widget Preview Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\nAvailable routes:`);
  console.log(`  http://localhost:${portStr}/widget                - Help UI (default)`);
  console.log(`  http://localhost:${portStr}/widget/search         - Search results`);
  console.log(`  http://localhost:${portStr}/widget/json           - JSON fallback`);
  console.log(`  http://localhost:${portStr}/widget/knowledge-graph - Knowledge graph SVG`);
  console.log(`\nPress Ctrl+C to stop.\n`);
});
