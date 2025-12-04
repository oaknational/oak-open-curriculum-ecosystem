/**
 * Widget Preview Server with hot reload for local development.
 * Watch `src/widget-renderers/*.ts` - save and refresh to see changes.
 * Run: pnpm widget:preview, then visit http://localhost:4580/widget
 * @module scripts/widget-preview-server
 */

import { watch } from 'chokidar';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

/** Dynamically imports the widget HTML, bypassing module cache. */
async function getWidgetHtml(): Promise<string> {
  const timestamp = Date.now();
  const module: unknown = await import(`../src/aggregated-tool-widget.js?t=${String(timestamp)}`);
  if (
    module !== null &&
    typeof module === 'object' &&
    'AGGREGATED_TOOL_WIDGET_HTML' in module &&
    typeof module.AGGREGATED_TOOL_WIDGET_HTML === 'string'
  ) {
    return module.AGGREGATED_TOOL_WIDGET_HTML;
  }
  throw new Error('Invalid widget module');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Path to widget renderers directory for file watching. */
const WATCH_PATH = resolve(__dirname, '../src/widget-renderers');

/** Path to widget source files for file watching. */
const WIDGET_SRC_PATH = resolve(__dirname, '../src');

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
  serverOverview: {
    name: 'Oak Curriculum MCP Server',
    version: '1.0.0',
    aboutOak:
      "Oak National Academy is the UK's national curriculum body, providing free, high-quality, fully-resourced curriculum resources for teachers and students.",
    oakWebsite: 'https://www.thenational.academy',
    description:
      'Access Oak National Academy curriculum resources including lessons, units, quizzes, transcripts, and teaching materials.',
  },
  /** Tool categories for the help UI */
  toolCategories: {
    discovery: {
      description: 'Find curriculum content by searching or listing.',
      tools: ['search', 'get-subjects', 'get-key-stages'],
    },
    browsing: {
      description: 'Explore curriculum structure systematically.',
      tools: ['get-key-stages-subject-units', 'get-key-stages-subject-lessons'],
    },
    fetching: {
      description: 'Get detailed content for specific lessons or units.',
      tools: ['fetch', 'get-lessons-summary', 'get-lessons-transcript'],
    },
  },
  tips: [
    'Use "search" for free-text queries; use browsing tools for structured exploration.',
    'The "fetch" tool uses prefixed IDs: lesson:slug, unit:slug, thread:slug.',
    'Get lesson transcript for detailed content understanding.',
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
app.get('/widget', async (req, res) => {
  console.log(`GET ${req.path}`);
  const widgetHtml = await getWidgetHtml();
  const htmlWithData = widgetHtml.replace(
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
app.get('/widget/search', async (req, res) => {
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

  const widgetHtml = await getWidgetHtml();
  const htmlWithData = widgetHtml.replace(
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
app.get('/widget/json', async (req, res) => {
  console.log(`GET ${req.path}`);
  const jsonOutput = {
    message: 'This is arbitrary JSON data',
    nested: {
      foo: 'bar',
      numbers: [1, 2, 3],
    },
  };

  const widgetHtml = await getWidgetHtml();
  const htmlWithData = widgetHtml.replace(
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
app.get('/widget/knowledge-graph', async (req, res) => {
  console.log(`GET ${req.path}`);
  const kgOutput = {
    concepts: ['Subject', 'Sequence', 'Unit', 'Lesson'],
    relationships: [{ from: 'Subject', to: 'Sequence' }],
  };

  const widgetHtml = await getWidgetHtml();
  const htmlWithData = widgetHtml.replace(
    '</head>',
    `<script>
      window.openai = {
        toolOutput: ${JSON.stringify(kgOutput, null, 2)},
        toolResponseMetadata: { 
          'annotations/title': 'Oak Knowledge Graph',
          toolName: 'get-knowledge-graph'
        }
      };
      // Auto-open details for testing
      window.addEventListener('load', () => {
        setTimeout(() => {
          document.querySelectorAll('details').forEach(d => d.open = true);
        }, 100);
      });
    </script></head>`,
  );
  res.type('text/html').send(htmlWithData);
});

/**
 * Set up file watcher for hot reload.
 * Watches widget-renderers and widget source files.
 * On change, logs a message - the dynamic import handles cache busting.
 */
const watcher = watch([WATCH_PATH, WIDGET_SRC_PATH], {
  ignored: /node_modules|\.test\.ts$/,
  persistent: true,
  ignoreInitial: true,
});

watcher.on('change', (path) => {
  console.log(`\n🔄 File changed: ${path}`);
  console.log('   Refresh browser to see changes.\n');
});

watcher.on('error', (error) => {
  console.error('Watcher error:', error);
});

app.listen(PORT, () => {
  const portStr = String(PORT);
  console.log(`\n🌳 Oak Widget Preview Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\n📂 Watching for changes in:`);
  console.log(`   ${WATCH_PATH}`);
  console.log(`   ${WIDGET_SRC_PATH}`);
  console.log(`\nAvailable routes:`);
  console.log(`  http://localhost:${portStr}/widget                - Help UI (default)`);
  console.log(`  http://localhost:${portStr}/widget/search         - Search results`);
  console.log(`  http://localhost:${portStr}/widget/json           - JSON fallback`);
  console.log(`  http://localhost:${portStr}/widget/knowledge-graph - Knowledge graph SVG`);
  console.log(`\n💡 Save a file and refresh browser to see changes.`);
  console.log(`\nPress Ctrl+C to stop.\n`);
});
