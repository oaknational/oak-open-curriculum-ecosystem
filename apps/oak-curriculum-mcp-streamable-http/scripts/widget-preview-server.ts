/**
 * Widget Preview Server with ChatGPT environment emulation
 * Watch `src/widget-renderers/*.ts` - save and refresh to see changes.
 * Run: pnpm widget:preview, then visit http://localhost:4580/widget
 */

import { watch } from 'chokidar';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFile } from 'fs/promises';
import { generatePreviewWidgetFile } from '../src/widget-file-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Path to widget renderers directory for file watching. */
const WATCH_PATH = resolve(__dirname, '../src/widget-renderers');

/** Path where generated widget HTML will be written */
const GENERATED_WIDGET_PATH = resolve(__dirname, '../.generated/preview-widget.html');

/** Flag to track if widget needs regeneration */
let widgetNeedsRegeneration = true;

/** Path to widget source files for file watching. */
const WIDGET_SRC_PATH = resolve(__dirname, '../src');

/**
 * Default port for the widget preview server.
 * This is a development-only script, so a fixed port is acceptable.
 */
const PORT = 4580;

/**
 * Mock data for widget preview - represents typical "get-help" tool output.
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

const MOCK_METADATA = {
  'annotations/title': 'Get Help',
};

/** Generates the widget HTML file with mock data */
async function regenerateWidget(): Promise<void> {
  await generatePreviewWidgetFile(MOCK_TOOL_OUTPUT, MOCK_METADATA, GENERATED_WIDGET_PATH);
  widgetNeedsRegeneration = false;
  console.log('✅ Widget regenerated');
}

const app = express();

/**
 * Serves the widget directly.
 */
app.get('/widget', async (req, res) => {
  console.log(`GET ${req.path}`);

  // Regenerate widget if needed
  if (widgetNeedsRegeneration) {
    await regenerateWidget();
  }

  // Serve the widget directly from disk
  const widgetHtml = await readFile(GENERATED_WIDGET_PATH, 'utf-8');

  res
    .type('text/html')
    .set('Cache-Control', 'no-cache, no-store, must-revalidate')
    .set('Pragma', 'no-cache')
    .set('Expires', '0')
    .send(widgetHtml);
});

// Generate initial widget
await regenerateWidget();

app.listen(PORT, () => {
  console.log(`\n🌳 Oak Widget Preview Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\n📂 Watching for changes in:`);
  console.log(`   ${WATCH_PATH}`);
  console.log(`   ${WIDGET_SRC_PATH}`);
  console.log(`\nGenerated widget: ${GENERATED_WIDGET_PATH}`);
  console.log(`\nAvailable at: http://localhost:${PORT}/widget`);
  console.log(`\n💡 Save a file and the widget will regenerate automatically.`);
  console.log(`\nPress Ctrl+C to stop.\n`);
});

const watcher = watch([WATCH_PATH, WIDGET_SRC_PATH], {
  persistent: true,
  ignoreInitial: true,
});

watcher.on('change', (file) => {
  widgetNeedsRegeneration = true;
  console.log(`\n🔄 File changed: ${file}`);
  console.log(`   Widget will regenerate on next request.`);
});

watcher.on('error', (error) => {
  console.error('Watcher error:', error);
});
