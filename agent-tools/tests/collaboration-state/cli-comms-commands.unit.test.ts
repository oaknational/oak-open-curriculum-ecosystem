import { describe, expect, it } from 'vitest';

import { resolveCommsBody } from '../../src/collaboration-state/cli-comms-commands';
import { type Options } from '../../src/collaboration-state/cli-options';
import { cliIo } from '../../src/collaboration-state/cli-runtime';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

/**
 * B2 enforcement — comms-event body-length gate (plan §B2 lines 138-143).
 *
 * Cure scope (per assumptions-expert verdict 2026-05-26 on the gate-both-paths
 * vs argv-only question): the plan §B2 names `--body-file` as the advertised
 * cure for long content; gate `--body` argv only, leave `--body-file` content
 * unrestricted. The architectural argument for gating resolved length
 * regardless of source has been surfaced to the owner as a follow-on question
 * and is not implemented self-authorising here.
 */

function makeOptions(values: Record<string, string>): Options {
  return {
    command: 'comms',
    topic: 'append',
    values: new Map(Object.entries(values)),
    files: [],
    areaPatterns: [],
    tags: [],
  };
}

describe('resolveCommsBody — body-length gate (B2 / plan §B2)', () => {
  it('accepts a --body argv at exactly 1500 chars (under the limit, inclusive ceiling)', async () => {
    const fake = createFakeCollaborationRuntime();
    const body = 'a'.repeat(1500);

    const resolved = await resolveCommsBody(makeOptions({ body }), cliIo(fake.runtime));

    expect(resolved).toBe(body);
  });

  it('rejects a --body argv at 1501 chars with a cure-naming error', async () => {
    const fake = createFakeCollaborationRuntime();
    const body = 'a'.repeat(1501);

    await expect(resolveCommsBody(makeOptions({ body }), cliIo(fake.runtime))).rejects.toThrow(
      /1501/,
    );
  });

  it('accepts a --body-file resolving to 5000 chars (escape hatch per plan §B2)', async () => {
    const fake = createFakeCollaborationRuntime();
    const filePath = 'long-body.txt';
    const longContent = 'a'.repeat(5000);
    fake.seedTextFile(filePath, longContent);

    const resolved = await resolveCommsBody(
      makeOptions({ 'body-file': filePath }),
      cliIo(fake.runtime),
    );

    expect(resolved).toBe(longContent);
  });

  it('error message names actual size, the 1500 limit, and --body-file remediation', async () => {
    const fake = createFakeCollaborationRuntime();
    const body = 'a'.repeat(1850);

    let captured: unknown;
    try {
      await resolveCommsBody(makeOptions({ body }), cliIo(fake.runtime));
    } catch (error) {
      captured = error;
    }
    const message = captured instanceof Error ? captured.message : '';

    expect(message).toContain('1850');
    expect(message).toContain('1500');
    expect(message).toContain('--body-file');
  });

  it('rejects 1500 printable chars + 1 trailing space (gate fires on raw pre-trim body)', async () => {
    const fake = createFakeCollaborationRuntime();
    const body = `${'a'.repeat(1500)} `;
    expect(body.length).toBe(1501);

    await expect(resolveCommsBody(makeOptions({ body }), cliIo(fake.runtime))).rejects.toThrow(
      /1501/,
    );
  });

  it('counts string.length (UTF-16 code units) — not byte length or grapheme clusters', async () => {
    const fake = createFakeCollaborationRuntime();
    // 750 two-code-unit characters (each '🌳' is a surrogate pair) = 1500 .length, accepted.
    const acceptedBody = '🌳'.repeat(750);
    expect(acceptedBody.length).toBe(1500);

    const resolved = await resolveCommsBody(
      makeOptions({ body: acceptedBody }),
      cliIo(fake.runtime),
    );
    expect(resolved).toBe(acceptedBody);

    // 751 of the same surrogate-pair chars = 1502 .length, rejected.
    const rejectedBody = '🌳'.repeat(751);
    expect(rejectedBody.length).toBe(1502);

    await expect(
      resolveCommsBody(makeOptions({ body: rejectedBody }), cliIo(fake.runtime)),
    ).rejects.toThrow(/1502/);
  });
});
