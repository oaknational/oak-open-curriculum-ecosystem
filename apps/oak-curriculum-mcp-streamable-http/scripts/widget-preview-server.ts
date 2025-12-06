/**
 * Widget Preview Server with ChatGPT environment emulation
 * Watch `src/widget-renderers/*.ts` - save and refresh to see changes.
 * Run: pnpm widget:preview, then visit http://localhost:4580/widget
 * @module scripts/widget-preview-server
 */

import { watch } from 'chokidar';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createEmulationWrapper } from './chatgpt-emulation-wrapper.js';

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
  serverOverview: {
    name: 'Oak Curriculum MCP Server',
    version: '1.0.0',
    aboutOak:
      "Oak National Academy is the UK's national curriculum body, providing free, high-quality, fully-resourced curriculum resources for teachers and students.",
    oakWebsite: 'https://www.thenational.academy',
    description:
      'Access Oak National Academy curriculum resources including lessons, units, quizzes, transcripts, and teaching materials.',
  },
  toolCategories: {
    discovery: {
      description: 'Find curriculum content by searching or listing.',
      tools: ['search', 'get-subjects', 'get-key-stages'],
    },
    browsing: {
      description: 'Explore curriculum structure systemat ically.',
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
 * Serves the widget with ChatGPT environment emulation.
 */
app.get('/widget', async (req, res) => {
  console.log(`GET ${req.path}`);
  const widgetHtml = await getWidgetHtml();
  const emulationHtml = createEmulationWrapper(widgetHtml, MOCK_TOOL_OUTPUT, MOCK_METADATA);
  res.type('text/html').send(emulationHtml);
});

/**
 * Serves the widget directly (without emulation wrapper) for comparison.
 */
app.get('/widget/direct', async (req, res) => {
  console.log(`GET ${req.path}`);
  const widgetHtml = await getWidgetHtml();
  const htmlWithData = widgetHtml.replace(
    '</head>',
    `<script>
      window.openai = {
        toolOutput: ${JSON.stringify(MOCK_TOOL_OUTPUT, null, 2)},
        toolResponseMetadata: ${JSON.stringify(MOCK_METADATA)},
        safeArea: {
          insets: { top: 24, right: 24, bottom: 120, left: 24 }
        },
        theme: "light",
        displayMode: "inline",
        locale: "en-US",
        maxHeight: 600
      };
    </script></head>`,
  );
  res.type('text/html').send(htmlWithData);
});

/**
 * Set up file watcher for hot reload.
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
  console.log(`  http://localhost:${portStr}/widget        - ChatGPT environment emulation`);
  console.log(`  http://localhost:${portStr}/widget/direct - Widget only (no emulation)`);
  console.log(`\n💡 Save a file and refresh browser to see changes.`);
  console.log(`\nPress Ctrl+C to stop.\n`);
});
