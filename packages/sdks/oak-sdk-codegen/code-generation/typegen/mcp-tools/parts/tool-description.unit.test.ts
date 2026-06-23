import { describe, it, expect } from 'vitest';
import type { OperationObject } from 'openapi3-ts/oas31';
import {
  toToolDescription,
  appendPrerequisiteGuidance,
  appendToolEnhancements,
  normaliseUpstreamDescription,
} from './tool-description.js';

/**
 * Unit tests for toToolDescription pure function.
 *
 * This function builds tool descriptions in git commit message format:
 * - First paragraph: OpenAPI summary (short title/overview)
 * - Blank line
 * - Remaining paragraphs: Full description
 */
describe('toToolDescription', () => {
  describe('git commit message format', () => {
    it('combines summary and description with blank line separator', () => {
      const operation: OperationObject = {
        summary: 'Units within a sequence',
        description:
          'This endpoint returns high-level information for all of the units in a sequence.',
      };
      expect(toToolDescription(operation)).toBe(
        'Units within a sequence\n\nThis tool returns high-level information for all of the units in a sequence.',
      );
    });

    it('replaces "This endpoint" with "This tool" in description', () => {
      const operation: OperationObject = {
        summary: 'Lesson transcript',
        description: 'This endpoint returns the video transcript and video captions file.',
      };
      expect(toToolDescription(operation)).toBe(
        'Lesson transcript\n\nThis tool returns the video transcript and video captions file.',
      );
    });

    it('handles lowercase "this endpoint" replacement', () => {
      const operation: OperationObject = {
        summary: 'Test Tool',
        description: 'Use this endpoint to get data.',
      };
      expect(toToolDescription(operation)).toBe('Test Tool\n\nUse this tool to get data.');
    });
  });

  describe('summary only', () => {
    it('returns just summary when description is missing', () => {
      const operation: OperationObject = {
        summary: 'Key stages',
      };
      expect(toToolDescription(operation)).toBe('Key stages');
    });

    it('returns just summary when description is empty', () => {
      const operation: OperationObject = {
        summary: 'Subjects',
        description: '',
      };
      expect(toToolDescription(operation)).toBe('Subjects');
    });

    it('trims whitespace from summary', () => {
      const operation: OperationObject = {
        summary: '  Trimmed summary  ',
      };
      expect(toToolDescription(operation)).toBe('Trimmed summary');
    });
  });

  describe('description only', () => {
    it('returns just description when summary is missing', () => {
      const operation: OperationObject = {
        description: 'This endpoint returns changelog data.',
      };
      expect(toToolDescription(operation)).toBe('This tool returns changelog data.');
    });

    it('returns just description when summary is empty', () => {
      const operation: OperationObject = {
        summary: '',
        description: 'This endpoint returns rate limit status.',
      };
      expect(toToolDescription(operation)).toBe('This tool returns rate limit status.');
    });
  });

  describe('neither summary nor description', () => {
    it('returns undefined when both are missing', () => {
      const operation: OperationObject = {};
      expect(toToolDescription(operation)).toBeUndefined();
    });

    it('returns undefined when both are empty strings', () => {
      const operation: OperationObject = {
        summary: '',
        description: '',
      };
      expect(toToolDescription(operation)).toBeUndefined();
    });

    it('returns undefined when both are whitespace only', () => {
      const operation: OperationObject = {
        summary: '   ',
        description: '   ',
      };
      expect(toToolDescription(operation)).toBeUndefined();
    });
  });

  describe('whitespace normalization in description', () => {
    it('collapses multiple spaces into single space', () => {
      const operation: OperationObject = {
        summary: 'Test',
        description: 'This   has    multiple   spaces.',
      };
      expect(toToolDescription(operation)).toBe('Test\n\nThis has multiple spaces.');
    });

    it('converts newlines to spaces', () => {
      const operation: OperationObject = {
        summary: 'Test',
        description: 'Line one.\nLine two.\nLine three.',
      };
      expect(toToolDescription(operation)).toBe('Test\n\nLine one. Line two. Line three.');
    });

    it('converts tabs to spaces', () => {
      const operation: OperationObject = {
        summary: 'Test',
        description: 'Tabbed\tcontent\there.',
      };
      expect(toToolDescription(operation)).toBe('Test\n\nTabbed content here.');
    });
  });

  describe('real OpenAPI operations', () => {
    it('handles get-sequences-units operation', () => {
      const operation: OperationObject = {
        summary: 'Units within a sequence',
        description:
          'This endpoint returns high-level information for all of the units in a sequence. Units are returned in the intended sequence order and are grouped by year.',
      };
      expect(toToolDescription(operation)).toBe(
        'Units within a sequence\n\nThis tool returns high-level information for all of the units in a sequence. Units are returned in the intended sequence order and are grouped by year.',
      );
    });

    it('handles get-lessons-assets operation with long description', () => {
      const operation: OperationObject = {
        summary: 'Downloadable lesson assets',
        description:
          "This endpoint returns the types of available assets for a given lesson, and the download endpoints for each. This endpoint contains licence information for any third-party content contained in the lesson's downloadable resources.",
      };
      const result = toToolDescription(operation);
      expect(result).toBe(
        'Downloadable lesson assets\n\n' +
          'This tool returns the types of available assets for a given lesson, and the ' +
          'download endpoints for each. This tool contains licence information for any ' +
          "third-party content contained in the lesson's downloadable resources.",
      );
    });
  });
});

/**
 * Unit tests for appendPrerequisiteGuidance pure function.
 *
 * Proves: protected tools get prerequisite guidance; public tools do not.
 */
describe('appendPrerequisiteGuidance', () => {
  it('appends prerequisite guidance when requiresAuth is true', () => {
    const result = appendPrerequisiteGuidance('Tool summary', true);
    expect(result).toContain('Tool summary');
    expect(result).toContain('PREREQUISITE');
  });

  it('does NOT append prerequisite when requiresAuth is false', () => {
    const result = appendPrerequisiteGuidance('Tool summary', false);
    expect(result).toBe('Tool summary');
    expect(result).not.toContain('PREREQUISITE');
  });

  it('returns undefined when description is undefined regardless of auth', () => {
    expect(appendPrerequisiteGuidance(undefined, true)).toBeUndefined();
    expect(appendPrerequisiteGuidance(undefined, false)).toBeUndefined();
  });

  it('preserves full description content when appending prerequisite', () => {
    const description = 'Lesson summary\n\nThis tool returns a summary for a given lesson';
    const result = appendPrerequisiteGuidance(description, true);
    expect(result).toContain('Lesson summary');
    expect(result).toContain('This tool returns a summary for a given lesson');
    expect(result).toContain('PREREQUISITE');
  });

  it('appends the injected prerequisite guidance for authenticated tools', () => {
    const customGuidance = '\n\nPREREQUISITE: call custom-orientation-tool first.';

    const result = appendPrerequisiteGuidance('Test', true, customGuidance);

    expect(result).toContain('Test');
    expect(result).toContain(customGuidance);
  });
});

describe('appendToolEnhancements', () => {
  it('appends rate-limit semantics note for get-rate-limit', () => {
    const result = appendToolEnhancements('Base description', 'get-rate-limit');

    expect(result).toContain('Base description');
    expect(result).toContain('limit=0');
    expect(result).toContain('unlimited');
  });

  it('returns description unchanged when tool name has no enhancement', () => {
    const result = appendToolEnhancements('Base description', 'get-key-stages');

    expect(result).toBe('Base description');
  });

  it('returns undefined when description is undefined', () => {
    expect(appendToolEnhancements(undefined, 'get-rate-limit')).toBeUndefined();
  });

  describe('asset download guidance', () => {
    it('appends download guidance for get-lessons-assets', () => {
      const result = appendToolEnhancements('Base description', 'get-lessons-assets');

      expect(result).toContain('Base description');
      expect(result).toContain('thenational.academy');
      expect(result).toContain('oakUrl');
    });

    it('appends download guidance for get-key-stages-subject-assets', () => {
      const result = appendToolEnhancements('Base description', 'get-key-stages-subject-assets');

      expect(result).toContain('thenational.academy');
      expect(result).toContain('oakUrl');
    });

    it('appends download guidance for get-sequences-assets', () => {
      const result = appendToolEnhancements('Base description', 'get-sequences-assets');

      expect(result).toContain('thenational.academy');
      expect(result).toContain('oakUrl');
    });

    it('does not append asset guidance to unrelated tools', () => {
      const result = appendToolEnhancements('Base description', 'get-lessons-summary');

      expect(result).toBe('Base description');
    });
  });

  describe('keywords tool disambiguation (G4b)', () => {
    it('appends the when-to-prefer note for get-keywords, naming the graph sibling', () => {
      const result = appendToolEnhancements('Base description', 'get-keywords');

      expect(result).toContain('Base description');
      expect(result).toContain('get-keyword-graph');
      expect(result).toContain('LIVE');
      expect(result).toContain('snapshot');
    });
  });

  describe('large-payload scoping hints', () => {
    it('composes a large-payload narrowing hint onto the asset note for get-sequences-assets', () => {
      const result = appendToolEnhancements('Base description', 'get-sequences-assets');

      // Compose, do not replace: the existing asset-download guidance survives.
      expect(result).toContain('oakUrl');
      // ...and the large-payload hint names this tool's real narrowing (year / type).
      expect(result).toContain('large payload at broad scope');
      expect(result).toContain('`year`');
      expect(result).toContain('`type`');
    });

    it('composes a large-payload narrowing hint onto the asset note for get-key-stages-subject-assets', () => {
      const result = appendToolEnhancements('Base description', 'get-key-stages-subject-assets');

      expect(result).toContain('oakUrl');
      expect(result).toContain('large payload at broad scope');
      // This tool narrows by unit and/or type, not year.
      expect(result).toContain('`unit`');
      expect(result).toContain('`type`');
    });

    it('does not add a large-payload hint to the bounded single-lesson asset tool', () => {
      const result = appendToolEnhancements('Base description', 'get-lessons-assets');

      // get-lessons-assets returns one lesson's assets — bounded; keeps only the asset note.
      expect(result).toContain('oakUrl');
      expect(result).not.toContain('large payload at broad scope');
    });
  });
});

/**
 * Unit tests for normaliseUpstreamDescription pure function.
 *
 * Proves: the transform the tool-description pipeline applies to raw
 * upstream descriptions — "This endpoint" rewritten to "This tool"
 * (case-preserving) and whitespace runs collapsed to single spaces.
 */
describe('normaliseUpstreamDescription', () => {
  it('rewrites "This endpoint" to "This tool" preserving case', () => {
    expect(normaliseUpstreamDescription('This endpoint returns data. Use this endpoint.')).toBe(
      'This tool returns data. Use this tool.',
    );
  });

  it('collapses whitespace runs and trims', () => {
    expect(normaliseUpstreamDescription('  Multi   space\n\ttext  ')).toBe('Multi space text');
  });
});
