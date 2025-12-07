import { describe, expect, it } from 'vitest';
import { generateDenseVector, prepareTextForEmbedding } from './dense-vector-generation';

describe('dense-vector-generation', () => {
  describe('generateDenseVector', () => {
    it('should return 384-dimensional vector for valid text', async () => {
      // Simple mock ES client with inference response
      const mockEsClient = {
        inference: {
          inference: async () => ({
            text_embedding: [
              {
                embedding: Array(384).fill(0.1),
              },
            ],
          }),
        },
      };

      const vector = await generateDenseVector(
        mockEsClient as never,
        'Pythagoras theorem lesson content',
      );

      expect(vector).toBeDefined();
      expect(vector).toHaveLength(384);
      expect(vector?.[0]).toBe(0.1);
    });

    it('should call E5 endpoint with correct parameters', async () => {
      let capturedInferenceId: string | undefined;
      let capturedInput: string | undefined;

      const mockEsClient = {
        inference: {
          inference: async (params: { inference_id: string; input: string }) => {
            capturedInferenceId = params.inference_id;
            capturedInput = params.input;
            return {
              text_embedding: [{ embedding: Array(384).fill(0.1) }],
            };
          },
        },
      };

      await generateDenseVector(mockEsClient as never, 'Test content for embedding');

      expect(capturedInferenceId).toBe('.multilingual-e5-small-elasticsearch');
      expect(capturedInput).toBe('Test content for embedding');
    });

    it('should return undefined on inference API error', async () => {
      const mockEsClient = {
        inference: {
          inference: async () => {
            throw new Error('Inference API unavailable');
          },
        },
      };

      const vector = await generateDenseVector(mockEsClient as never, 'Test content');

      expect(vector).toBeUndefined();
    });

    it('should return undefined for empty text', async () => {
      const mockEsClient = {
        inference: {
          inference: async () => ({
            text_embedding: [{ embedding: Array(384).fill(0.1) }],
          }),
        },
      };

      const vector = await generateDenseVector(mockEsClient as never, '');

      expect(vector).toBeUndefined();
    });

    it('should return undefined for whitespace-only text', async () => {
      const mockEsClient = {
        inference: {
          inference: async () => ({
            text_embedding: [{ embedding: Array(384).fill(0.1) }],
          }),
        },
      };

      const vector = await generateDenseVector(mockEsClient as never, '   ');

      expect(vector).toBeUndefined();
    });

    it('should handle malformed API response gracefully', async () => {
      const mockEsClient = {
        inference: {
          inference: async () => ({
            // Missing text_embedding field
            unexpected_field: 'value',
          }),
        },
      };

      const vector = await generateDenseVector(mockEsClient as never, 'Test content');

      expect(vector).toBeUndefined();
    });
  });

  describe('prepareTextForEmbedding', () => {
    it('should combine title, summary, and keywords with descriptions', () => {
      const result = prepareTextForEmbedding({
        title: 'Solving quadratic equations',
        summary: 'Learn to solve ax² + bx + c = 0',
        keywords: [
          {
            keyword: 'quadratic equations',
            description: 'An equation where the highest power of the variable is 2',
          },
          {
            keyword: 'factorisation',
            description: 'Breaking down an expression into product of factors',
          },
        ],
      });

      expect(result).toContain('Solving quadratic equations');
      expect(result).toContain('Learn to solve ax² + bx + c = 0');
      expect(result).toContain(
        'quadratic equations: An equation where the highest power of the variable is 2',
      );
      expect(result).toContain(
        'factorisation: Breaking down an expression into product of factors',
      );
      expect(result).toMatch(/Keywords:/);
    });

    it('should handle title only', () => {
      const result = prepareTextForEmbedding({
        title: 'Introduction to algebra',
      });

      expect(result).toBe('Introduction to algebra');
    });

    it('should handle title and summary without keywords', () => {
      const result = prepareTextForEmbedding({
        title: 'Pythagoras theorem',
        summary: 'Understanding a² + b² = c²',
      });

      expect(result).toBe('Pythagoras theorem\n\nUnderstanding a² + b² = c²');
    });

    it('should handle empty keywords array', () => {
      const result = prepareTextForEmbedding({
        title: 'Test lesson',
        summary: 'Test summary',
        keywords: [],
      });

      expect(result).toBe('Test lesson\n\nTest summary');
      expect(result).not.toContain('Keywords:');
    });

    it('should format multiple keywords with proper separators', () => {
      const result = prepareTextForEmbedding({
        title: 'Geometry basics',
        keywords: [
          { keyword: 'angle', description: 'Space between two intersecting lines' },
          { keyword: 'triangle', description: 'A polygon with three sides' },
          {
            keyword: 'circle',
            description: 'A round shape with all points equidistant from center',
          },
        ],
      });

      expect(result).toContain('angle: Space between two intersecting lines');
      expect(result).toContain('triangle: A polygon with three sides');
      expect(result).toContain('circle: A round shape with all points equidistant from center');
      // Check that keywords are joined with period-space
      expect(result).toMatch(/angle: [^.]+\. triangle: [^.]+\. circle:/);
    });

    it('should use double newlines as section separators', () => {
      const result = prepareTextForEmbedding({
        title: 'Title',
        summary: 'Summary',
        keywords: [{ keyword: 'term', description: 'definition' }],
      });

      // Should have \n\n between title and summary
      expect(result).toContain('Title\n\nSummary');
      // Should have \n\n between summary and keywords
      expect(result).toContain('Summary\n\nKeywords:');
    });
  });
});
