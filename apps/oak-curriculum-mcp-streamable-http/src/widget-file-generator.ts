/**
 * Widget HTML file generator for preview server.
 *
 * Generates a complete, ready-to-serve HTML file with all JavaScript embedded.
 * Writes to disk so it can be inspected and served as a static file.
 *
 */

import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import { generateWidgetHtml } from './aggregated-tool-widget.js';

/**
 * Generates the widget HTML and writes it to a file.
 *
 * @param outputPath - Absolute path where the HTML file should be written
 * @returns Promise that resolves when file is written
 */
export async function generateWidgetFile(outputPath: string): Promise<void> {
  // Generate the complete HTML
  const html = generateWidgetHtml();

  // Ensure output directory exists
  await mkdir(dirname(outputPath), { recursive: true });

  // Write the file
  await writeFile(outputPath, html, 'utf-8');
}

/**
 * Generates widget HTML with injected mock data for preview/testing.
 * This creates a self-contained HTML file for manual inspection.
 *
 * `toolOutput` and `metadata` use `Record<string, unknown>` because this
 * function sits at a preview boundary: it accepts arbitrary JSON from any
 * MCP tool descriptor and serialises it into a `window.openai` script tag.
 * The actual shape varies per tool and is validated at the tool level, not here.
 *
 * @param toolOutput - Arbitrary tool output JSON to inject into the preview
 * @param metadata - Arbitrary metadata JSON to inject into the preview
 * @param outputPath - Where to write the file
 */
export async function generatePreviewWidgetFile(
  // eslint-disable-next-line @typescript-eslint/no-restricted-types -- External preview boundary: accepts any tool output JSON
  toolOutput: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-restricted-types -- External preview boundary: accepts any metadata JSON
  metadata: Record<string, unknown>,
  outputPath: string,
): Promise<void> {
  const widgetHtml = generateWidgetHtml();

  // Inject window.openai data by replacing </head> with script + </head>
  const openaiScript = `
<script>
window.openai = {
  toolOutput: ${JSON.stringify(toolOutput, null, 2)},
  toolResponseMetadata: ${JSON.stringify(metadata, null, 2)},
  safeArea: { insets: { top: 24, right: 24, bottom: 120, left: 24 } },
  theme: "light",
  displayMode: "inline",
  locale: "en-US",
  maxHeight: 600
};
</script>
</head>`;

  const htmlWithData = widgetHtml.replace('</head>', openaiScript);

  // Ensure output directory exists
  await mkdir(dirname(outputPath), { recursive: true });

  // Write the file
  await writeFile(outputPath, htmlWithData, 'utf-8');
}
