import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { readFile, rm } from 'fs/promises';
import { join } from 'path';
import { generateWidgetFile, generatePreviewWidgetFile } from './widget-file-generator.js';

describe('Widget File Generator', () => {
  const testOutputDir = join(process.cwd(), '.test-output');
  const widgetPath = join(testOutputDir, 'widget.html');
  const previewPath = join(testOutputDir, 'preview-widget.html');

  afterAll(async () => {
    // Clean up test files
    await rm(testOutputDir, { recursive: true, force: true });
  });

  describe('generateWidgetFile', () => {
    beforeAll(async () => {
      await generateWidgetFile(widgetPath);
    });

    it('should create the widget HTML file', async () => {
      const content = await readFile(widgetPath, 'utf-8');
      expect(content).toBeTruthy();
    });

    it('should contain valid HTML structure', async () => {
      const content = await readFile(widgetPath, 'utf-8');

      expect(content).toContain('<!DOCTYPE html>');
      expect(content).toContain('<html lang="en">');
      expect(content).toContain('</html>');
    });

    it('should have exactly one script tag', async () => {
      const content = await readFile(widgetPath, 'utf-8');
      const scriptTags = content.match(/<\/script>/gi) || [];

      expect(scriptTags.length).toBe(1);
    });

    it('should not have unescaped script tag breakouts', async () => {
      const content = await readFile(widgetPath, 'utf-8');

      // Extract the script content
      const scriptMatch = content.match(/<script type="module">([\s\S]*?)<\/script>/);
      expect(scriptMatch).toBeTruthy();

      if (scriptMatch) {
        const scriptContent = scriptMatch[1];
        // Should not have unescaped </script> within the script
        expect(scriptContent).not.toContain('</script>');
      }
    });
  });

  describe('generatePreviewWidgetFile', () => {
    const mockToolOutput = { testKey: 'testValue' };
    const mockMetadata = { 'annotations/title': 'Test' };

    beforeAll(async () => {
      await generatePreviewWidgetFile(mockToolOutput, mockMetadata, previewPath);
    });

    it('should create the preview widget file', async () => {
      const content = await readFile(previewPath, 'utf-8');
      expect(content).toBeTruthy();
    });

    it('should inject window.openai data', async () => {
      const content = await readFile(previewPath, 'utf-8');

      expect(content).toContain('window.openai');
      expect(content).toContain('toolOutput');
      expect(content).toContain('testKey');
      expect(content).toContain('testValue');
    });

    it('should preserve HTML structure', async () => {
      const content = await readFile(previewPath, 'utf-8');

      expect(content).toContain('<!DOCTYPE html>');
      expect(content).toContain('</html>');
    });
  });
});
