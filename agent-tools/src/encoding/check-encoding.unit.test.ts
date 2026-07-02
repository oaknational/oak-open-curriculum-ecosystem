import { isErr, isOk } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { parseArgs } from './check-encoding.js';

describe('parseArgs', () => {
  it('defaults to report-only with no flags', () => {
    const result = parseArgs([]);
    expect(isOk(result) && result.value).toStrictEqual({ json: false, help: false, failOn: null });
  });

  it('parses --json and --help', () => {
    const json = parseArgs(['--json']);
    const help = parseArgs(['-h']);
    expect(isOk(json) && json.value.json).toBe(true);
    expect(isOk(help) && help.value.help).toBe(true);
  });

  it('parses a valid --fail-on severity', () => {
    const result = parseArgs(['--fail-on', 'critical']);
    expect(isOk(result) && result.value.failOn).toBe('critical');
  });

  it('errors on an unknown --fail-on severity', () => {
    const result = parseArgs(['--fail-on', 'banana']);
    expect(isErr(result) && result.error).toMatch(/--fail-on requires one of/);
  });

  it('errors on a missing --fail-on value', () => {
    const result = parseArgs(['--fail-on']);
    expect(isErr(result) && result.error).toMatch(/--fail-on requires one of/);
  });

  it('errors on an unknown argument', () => {
    const result = parseArgs(['--nope']);
    expect(isErr(result) && result.error).toMatch(/unknown argument/);
  });
});
