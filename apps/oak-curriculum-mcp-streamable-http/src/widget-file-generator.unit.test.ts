import { describe, it, expect, afterAll } from 'vitest';
import { readFile, rm } from 'fs/promises';
import { join } from 'path';
import { generateWidgetFile } from './widget-file-generator.js';

describe('Widget File Generator', () => {
  const testOutputDir = join(process.cwd(), '.test-output');
  const widgetPath = join(testOutputDir, 'widget.html');

  afterAll(async () => {
    await rm(testOutputDir, { recursive: true, force: true });
  });

  describe('generateWidgetFile', () => {
    it('should create the widget HTML file', async () => {
      await generateWidgetFile(widgetPath);
      const content = await readFile(widgetPath, 'utf-8');
      expect(content).toBeTruthy();
    });

    it('should contain valid HTML structure', async () => {
      await generateWidgetFile(widgetPath);
      const content = await readFile(widgetPath, 'utf-8');

      expect(content).toContain('<!DOCTYPE html>');
      expect(content).toContain('<html lang="en">');
      expect(content).toContain('</html>');
    });

    it('should have exactly one script tag', async () => {
      await generateWidgetFile(widgetPath);
      const content = await readFile(widgetPath, 'utf-8');
      const scriptTags = content.match(/<\/script>/gi) || [];

      expect(scriptTags.length).toBe(1);
    });

    it('should not have unescaped script tag breakouts', async () => {
      await generateWidgetFile(widgetPath);
      const content = await readFile(widgetPath, 'utf-8');

      const scriptMatch = content.match(/<script type="module">([\s\S]*?)<\/script>/);
      expect(scriptMatch).toBeTruthy();

      if (scriptMatch) {
        const scriptContent = scriptMatch[1];
        expect(scriptContent).not.toContain('</script>');
      }
    });
  });
});
