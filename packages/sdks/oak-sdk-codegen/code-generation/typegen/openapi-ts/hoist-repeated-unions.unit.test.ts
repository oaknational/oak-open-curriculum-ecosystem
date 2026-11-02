import { describe, expect, it } from 'vitest';

import { hoistRepeatedUnions } from './hoist-repeated-unions.js';

const KEY_STAGES = '"ks1" | "ks2" | "ks3" | "ks4"';

/** A component schema with one property of the given type, repeated `count` times. */
function componentsWith(propertyName: string, type: string, count: number): string {
  const schemas = Array.from(
    { length: count },
    (_, index) => `        Schema${String(index)}: {\n            ${propertyName}: ${type};\n        };`,
  );
  return ['export interface Components {', '    schemas: {', ...schemas, '    };', '}'].join('\n');
}

describe('hoistRepeatedUnions', () => {
  it('declares a union of three or more members once when it recurs at three or more sites', () => {
    const output = hoistRepeatedUnions(componentsWith('keyStage', KEY_STAGES, 3));

    expect(output).toContain(`type KeyStage = ${KEY_STAGES};`);
    expect(output.match(/keyStage: KeyStage;/g)).toHaveLength(3);
    expect(output).not.toContain(`keyStage: ${KEY_STAGES}`);
  });

  it('prepends the alias block before the first declaration', () => {
    const output = hoistRepeatedUnions(componentsWith('keyStage', KEY_STAGES, 3));

    expect(output.indexOf('type KeyStage =')).toBeLessThan(output.indexOf('export interface Components'));
  });

  it('leaves a union that recurs only twice inline', () => {
    const source = componentsWith('keyStage', KEY_STAGES, 2);

    expect(hoistRepeatedUnions(source)).toBe(source);
  });

  it('leaves two-member unions inline however often they recur', () => {
    const source = componentsWith('tier', '"foundation" | "higher"', 4);

    expect(hoistRepeatedUnions(source)).toBe(source);
  });

  it('leaves nullable unions inline however often they recur', () => {
    const source = componentsWith('title', 'string | null | undefined', 4);

    expect(hoistRepeatedUnions(source)).toBe(source);
  });

  it('leaves a union that already sits inside a type alias out of the count', () => {
    const source = [
      `export type Years = ${KEY_STAGES};`,
      componentsWith('keyStage', KEY_STAGES, 2),
    ].join('\n');

    expect(hoistRepeatedUnions(source)).toBe(source);
  });

  it('names an array-element union with an Item suffix and drops its parentheses', () => {
    const source = componentsWith('subjects', `(${KEY_STAGES})[]`, 3);

    const output = hoistRepeatedUnions(source);

    expect(output).toContain(`type SubjectsItem = ${KEY_STAGES};`);
    expect(output.match(/subjects: SubjectsItem\[\];/g)).toHaveLength(3);
  });

  it('names from the two innermost identifier properties, skipping structural containers and the schema name', () => {
    const operations = [
      'export interface Operations {',
      ...['a', 'b', 'c'].map(
        (id) =>
          `    "get-${id}": {\n        parameters: {\n            path: {\n                keyStage: ${KEY_STAGES};\n            };\n        };\n    };`,
      ),
      '}',
    ].join('\n');
    const assets = [
      'export interface Components {',
      '    schemas: {',
      ...['A', 'B', 'C'].map(
        (name) =>
          `        ${name}: {\n            assets: {\n                type: "video" | "worksheet" | "slideDeck";\n            }[];\n        };`,
      ),
      '    };',
      '}',
    ].join('\n');

    const output = hoistRepeatedUnions([operations, assets].join('\n'));

    expect(output).toContain(`type KeyStage = ${KEY_STAGES};`);
    expect(output).toContain('type AssetsType = "video" | "worksheet" | "slideDeck";');
  });

  it('matches unions by their members regardless of member order', () => {
    const source = [
      'export interface Components {',
      '    schemas: {',
      `        A: {\n            keyStage: ${KEY_STAGES};\n        };`,
      '        B: {\n            keyStage: "ks4" | "ks3" | "ks2" | "ks1";\n        };',
      `        C: {\n            keyStage: ${KEY_STAGES};\n        };`,
      '    };',
      '}',
    ].join('\n');

    const output = hoistRepeatedUnions(source);

    expect(output.match(/keyStage: KeyStage;/g)).toHaveLength(3);
  });

  it('hoists a repeated union nested inside another repeated union, referencing the inner alias', () => {
    const question = `{\n                kind: "text";\n                level: ${KEY_STAGES};\n            } | {\n                kind: "image";\n                level: ${KEY_STAGES};\n            } | {\n                kind: "none";\n            }`;
    const source = componentsWith('starterQuiz', `(${question})[]`, 3);

    const output = hoistRepeatedUnions(source);

    expect(output).toContain(`type StarterQuizLevel = ${KEY_STAGES};`);
    expect(output).toContain('type StarterQuizItem = {');
    expect(output).toContain('level: StarterQuizLevel;');
    expect(output.match(/starterQuiz: StarterQuizItem\[\];/g)).toHaveLength(3);
    expect(output).not.toContain(`level: ${KEY_STAGES}`);
  });

  it('names a union after the property most of its sites share, not after its first site', () => {
    const subjects = '"art" | "english" | "maths"';
    const source = [
      'export interface Components {',
      '    schemas: {',
      `        AllSubjectsResponseSchema: (${subjects})[];`,
      `        A: {\n            subject: ${subjects};\n        };`,
      `        B: {\n            subject: ${subjects};\n        };`,
      '    };',
      '}',
    ].join('\n');

    const output = hoistRepeatedUnions(source);

    expect(output).toContain(`type Subject = ${subjects};`);
    expect(output).toContain('AllSubjectsResponseSchema: Subject[];');
    expect(output.match(/subject: Subject;/g)).toHaveLength(2);
  });

  it('names tied sites by the trailing words their property names share', () => {
    const question = '{\n                kind: "text";\n            } | {\n                kind: "image";\n            } | {\n                kind: "none";\n            }';
    const source = [
      'export interface Components {',
      '    schemas: {',
      ...['A', 'B'].map(
        (name) =>
          `        ${name}: {\n            starterQuiz: (${question})[];\n            exitQuiz: (${question})[];\n        };`,
      ),
      '    };',
      '}',
    ].join('\n');

    const output = hoistRepeatedUnions(source);

    expect(output).toContain('type QuizItem = {');
    expect(output.match(/starterQuiz: QuizItem\[\];/g)).toHaveLength(2);
    expect(output.match(/exitQuiz: QuizItem\[\];/g)).toHaveLength(2);
  });

  it('keeps the first site\'s name when tied property names share no words', () => {
    const source = [
      'export interface Components {',
      '    schemas: {',
      ...['A', 'B'].map(
        (name) => `        ${name}: {\n            phase: ${KEY_STAGES};\n            band: ${KEY_STAGES};\n        };`,
      ),
      '    };',
      '}',
    ].join('\n');

    const output = hoistRepeatedUnions(source);

    expect(output).toContain(`type Phase = ${KEY_STAGES};`);
    expect(output.match(/(?:phase|band): Phase;/g)).toHaveLength(4);
  });

  it('widens a colliding alias name to a third enclosing property', () => {
    const source = [
      'export interface Components {',
      '    schemas: {',
      ...['A', 'B', 'C'].map(
        (name) =>
          `        ${name}: {\n            lesson: {\n                slug: "x" | "y" | "z";\n            };\n            unit: {\n                slug: "p" | "q" | "r";\n            };\n        };`,
      ),
      '    };',
      '}',
    ].join('\n');

    const output = hoistRepeatedUnions(source);

    expect(output).toContain('type LessonSlug = "x" | "y" | "z";');
    expect(output).toContain('type UnitSlug = "p" | "q" | "r";');
  });

  it('avoids the names of the module\'s existing declarations', () => {
    const source = [
      'export interface KeyStage {\n    label: string;\n}',
      componentsWith('keyStage', KEY_STAGES, 3),
    ].join('\n');

    const output = hoistRepeatedUnions(source);

    expect(output).not.toContain(`type KeyStage = ${KEY_STAGES};`);
    expect(output).toContain(`type Schema0KeyStage = ${KEY_STAGES};`);
  });
});
