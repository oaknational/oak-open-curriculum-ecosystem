/**
 * Widget HTML file generator.
 *
 * Generates a complete, ready-to-serve HTML file with all JavaScript embedded.
 * Writes to disk so it can be inspected and served as a static file.
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
  const html = generateWidgetHtml();

  await mkdir(dirname(outputPath), { recursive: true });

  await writeFile(outputPath, html, 'utf-8');
}
