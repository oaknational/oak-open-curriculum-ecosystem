import { Buffer } from 'node:buffer';

import { describe, expect, it } from 'vitest';

import { ok, unwrapErr } from '@oaknational/result';

import {
  MAX_PROJECTION_BYTES,
  MAX_PROJECTION_LINES,
  SOURCE_PROJECTION_END,
  SOURCE_PROJECTION_START,
  extractTeamAlertProjection,
} from './team-alert-bootstrap.js';

const PROJECTION = `## Codex team-session alert bootstrap

Load \`$oak-start-right-team\` for coordinated Codex work.
`;

function canonicalWith(projection: string): string {
  return [
    '# Rule',
    '',
    SOURCE_PROJECTION_START,
    projection.trimEnd(),
    SOURCE_PROJECTION_END,
    '',
    '## Procedure',
    '',
  ].join('\n');
}

describe('extractTeamAlertProjection', () => {
  it('extracts the one bounded canonical projection byte-for-byte', () => {
    const result = extractTeamAlertProjection(canonicalWith(PROJECTION));

    expect(result).toStrictEqual(ok(PROJECTION));
  });

  it('rejects missing and duplicate source markers', () => {
    const missing = extractTeamAlertProjection('# Rule\n');
    const duplicate = extractTeamAlertProjection(
      `${canonicalWith(PROJECTION)}\n${canonicalWith(PROJECTION)}`,
    );

    expect(unwrapErr(missing).message).toBe(
      `Expected exactly one ${SOURCE_PROJECTION_START} and one ` +
        `${SOURCE_PROJECTION_END}; found 0 and 0.`,
    );
    expect(unwrapErr(duplicate).message).toBe(
      `Expected exactly one ${SOURCE_PROJECTION_START} and one ` +
        `${SOURCE_PROJECTION_END}; found 2 and 2.`,
    );
  });

  it.each([
    ['duplicate start only', `${SOURCE_PROJECTION_START}\n${canonicalWith(PROJECTION)}`, 2, 1],
    ['duplicate end only', `${canonicalWith(PROJECTION)}\n${SOURCE_PROJECTION_END}`, 1, 2],
  ])('rejects %s', (_label, canonical, startCount, endCount) => {
    expect(unwrapErr(extractTeamAlertProjection(canonical)).message).toBe(
      `Expected exactly one ${SOURCE_PROJECTION_START} and one ` +
        `${SOURCE_PROJECTION_END}; found ${startCount} and ${endCount}.`,
    );
  });

  it('rejects source markers that are out of order', () => {
    const canonical = ['# Rule', SOURCE_PROJECTION_END, PROJECTION, SOURCE_PROJECTION_START].join(
      '\n',
    );

    expect(unwrapErr(extractTeamAlertProjection(canonical)).message).toBe(
      'Codex team-alert projection markers are out of order.',
    );
  });

  it.each([
    ['prefixed start marker', SOURCE_PROJECTION_START, `prefix${SOURCE_PROJECTION_START}`],
    ['suffixed start marker', SOURCE_PROJECTION_START, `${SOURCE_PROJECTION_START}suffix`],
    ['prefixed end marker', SOURCE_PROJECTION_END, `prefix${SOURCE_PROJECTION_END}`],
    ['suffixed end marker', SOURCE_PROJECTION_END, `${SOURCE_PROJECTION_END}suffix`],
  ])('rejects a %s', (_label, marker, malformedMarker) => {
    const canonical = canonicalWith(PROJECTION).replace(marker, malformedMarker);

    expect(unwrapErr(extractTeamAlertProjection(canonical)).message).toBe(
      'Codex team-alert projection markers must each sit on their own line.',
    );
  });

  it('accepts the exact byte budget', () => {
    const projection = projectionWithByteCount(MAX_PROJECTION_BYTES);

    expect(extractTeamAlertProjection(canonicalWith(projection))).toStrictEqual(ok(projection));
  });

  it('rejects one byte over budget', () => {
    const byteCount = MAX_PROJECTION_BYTES + 1;
    const result = extractTeamAlertProjection(canonicalWith(projectionWithByteCount(byteCount)));

    expect(unwrapErr(result).message).toBe(
      `Codex team-alert projection exceeds its ${MAX_PROJECTION_BYTES}-byte budget ` +
        `(${byteCount} bytes).`,
    );
  });

  it('accepts the exact line budget', () => {
    const projection = projectionWithLineCount(MAX_PROJECTION_LINES);

    expect(extractTeamAlertProjection(canonicalWith(projection))).toStrictEqual(ok(projection));
  });

  it('rejects one line over budget', () => {
    const lineCount = MAX_PROJECTION_LINES + 1;
    const result = extractTeamAlertProjection(canonicalWith(projectionWithLineCount(lineCount)));

    expect(unwrapErr(result).message).toBe(
      `Codex team-alert projection exceeds its ${MAX_PROJECTION_LINES}-line budget ` +
        `(${lineCount} lines).`,
    );
  });
});

function projectionWithByteCount(byteCount: number): string {
  const prefix = '## Byte budget\n\n';
  const suffix = '\n';
  const fillLength = byteCount - Buffer.byteLength(`${prefix}${suffix}`, 'utf8');
  return `${prefix}${'x'.repeat(fillLength)}${suffix}`;
}

function projectionWithLineCount(lineCount: number): string {
  return `${Array.from({ length: lineCount }, (_value, index) =>
    index === 0 ? '## Line budget' : `line ${index}`,
  ).join('\n')}\n`;
}
