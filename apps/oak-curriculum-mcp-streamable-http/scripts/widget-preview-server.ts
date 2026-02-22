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
 * Mock data for widget preview — represents typical search tool output.
 *
 * After Track 1a, only the search renderer exists. Browse and explore
 * mock data will be added in Phases 2-3.
 */
const MOCK_TOOL_OUTPUT = {
  scope: 'lessons',
  total: 3,
  took: 42,
  results: [
    {
      id: 'lesson-photosynthesis',
      rankScore: 0.95,
      lesson: {
        lesson_title: 'Introduction to Photosynthesis',
        lesson_slug: 'introduction-to-photosynthesis',
        subject_slug: 'science',
        subject_title: 'Science',
        key_stage: 'ks3',
        key_stage_title: 'KS3',
        lesson_url: 'https://teachers.thenational.academy/lessons/introduction-to-photosynthesis',
      },
      highlights: [],
    },
    {
      id: 'lesson-light-dependent',
      rankScore: 0.88,
      lesson: {
        lesson_title: 'The Light-Dependent Reactions',
        lesson_slug: 'the-light-dependent-reactions',
        subject_slug: 'biology',
        subject_title: 'Biology',
        key_stage: 'ks4',
        key_stage_title: 'KS4',
        lesson_url: 'https://teachers.thenational.academy/lessons/the-light-dependent-reactions',
      },
      highlights: [],
    },
    {
      id: 'lesson-factors-photosynthesis',
      rankScore: 0.82,
      lesson: {
        lesson_title: 'Factors Affecting Photosynthesis',
        lesson_slug: 'factors-affecting-photosynthesis',
        subject_slug: 'science',
        subject_title: 'Science',
        key_stage: 'ks3',
        key_stage_title: 'KS3',
        lesson_url: 'https://teachers.thenational.academy/lessons/factors-affecting-photosynthesis',
      },
      highlights: [],
    },
  ],
};

const MOCK_METADATA = {
  toolName: 'search',
  'annotations/title': 'Search Curriculum',
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
