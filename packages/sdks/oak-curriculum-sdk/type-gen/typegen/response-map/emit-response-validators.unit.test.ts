import { describe, expect, it } from 'vitest';
import type { ResponseMapEntry } from './build-response-map.js';
import { emitResponseValidators } from './emit-response-validators.js';

describe('emitResponseValidators (descriptor helpers)', () => {
  it('embeds JSON schema literals and uses concatenation for descriptor keys', () => {
    const entries: readonly ResponseMapEntry[] = [
      {
        operationId: 'listLessons',
        status: '200',
        componentName: 'LessonsResponse',
        zodIdentifier: 'LessonsResponse',
        jsonSchema: { type: 'object', title: 'LessonsResponse' },
        path: '/lessons',
        colonPath: '/lessons',
        method: 'get',
        source: 'component',
      },
    ];

    const generated = emitResponseValidators(entries);

    expect(generated).toContain(`jsonSchema: {"type":"object","title":"LessonsResponse"}`);
    expect(generated).toContain(`const key = operationId + ':' + '200';`);
    expect(generated).not.toContain('${operationId}:200');
    expect(generated).toContain('return { zod, json };');
  });
});
