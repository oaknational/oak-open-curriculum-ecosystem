import { describe, expect, it } from 'vitest';

import { readRepoDocument } from '../../src/collaboration-state/test-helpers/repo-doc.js';

/**
 * Lockstep pins for the codex mcp-server binding evidence (Sif Annex A).
 *
 * Design settled by the instrument's own first dialogue
 * (dlg-20260802-lockstep-pins, outcome position-changed): the probe
 * record's fenced `codex_cli_version` line is the CANONICAL version
 * authority — machine-read by the probe script's version gate and by
 * these tests. Dependent doctrine references that field through
 * resolving links and never restates the literal, so these tests assert
 * reference-PRESENCE (a semantic pointer exists), never value extraction
 * from prose. Deliberately duplicated machine artefacts (the copy-paste
 * registration template vs the script's launch args) stay whole-array
 * equality-pinned. ADR-078 helper-mediated committed-artefact reads.
 */

const RECORD_PATH = '.agent/skills/the-codex-dialogues/references/probe-record.md';
const INSTRUMENT_SKILL_PATH = '.agent/skills/the-codex-dialogues/SKILL-CANONICAL.md';
const SIF_SKILL_PATH = '.agent/skills/sif/SKILL-CANONICAL.md';
const PROBE_SCRIPT_PATH = '.agent/skills/the-codex-dialogues/scripts/probe-codex-mcp-server.mjs';

/** The registration template's launch contract, pinned whole-array. */
const PINNED_REGISTRATION_ARGS = [
  'mcp-server',
  '-c',
  'sandbox_mode=read-only',
  '-c',
  'approval_policy=never',
];

/**
 * The record's fenced pin line is the sole version authority, so the
 * non-duplication guards read the pinned VALUE from the record at test
 * time and assert its exact absence in dependent documents — catching a
 * restatement in ANY prose spelling ("pinned at X.Y.Z", `key: X.Y.Z`),
 * not just the `codex-cli X.Y.Z` form the spelling-class matcher covers
 * (round-7 F1: a single-spelling matcher left every other form green).
 */
async function readCanonicalPin(): Promise<string> {
  const record = await readRepoDocument(RECORD_PATH);
  return /^codex_cli_version: (\d+\.\d+\.\d+)$/m.exec(record)?.[1] ?? 'RECORD-PIN-MISSING';
}

describe('the-codex-dialogues probe evidence lockstep', () => {
  it('parses a canonical codex_cli_version pin from the probe record', async () => {
    const record = await readRepoDocument(RECORD_PATH);
    const pin = await readCanonicalPin();
    expect(pin).toMatch(/^\d+\.\d+\.\d+$/);
    expect(record, 'recorded server identity agrees with the canonical pin').toContain(
      `codex-mcp-server ${pin}`,
    );
  });

  it('keeps the instrument skill referencing the canonical pin, not restating it', async () => {
    const skill = await readRepoDocument(INSTRUMENT_SKILL_PATH);
    const pin = await readCanonicalPin();
    expect(pin, 'canonical pin parses from the record').toMatch(/^\d+\.\d+\.\d+$/);
    expect(skill, 'semantic pointer to the canonical field').toContain(
      'the pinned `codex_cli_version` in',
    );
    expect(skill, 'resolving link to the record').toContain('](./references/probe-record.md)');
    expect(skill, 'no subject-adjacent version literal outside the record').not.toMatch(
      /codex[- ](?:cli|mcp-server)[^\n]{0,24}\d+\.\d+\.\d+/i,
    );
    expect(skill, 'no restatement of the pinned value in any spelling').not.toContain(pin);
  });

  it('keeps the Sif annex referencing the canonical pin, not restating it', async () => {
    const sif = await readRepoDocument(SIF_SKILL_PATH);
    const pin = await readCanonicalPin();
    expect(pin, 'canonical pin parses from the record').toMatch(/^\d+\.\d+\.\d+$/);
    expect(sif, 'semantic pointer to the canonical field').toContain('`codex_cli_version`');
    expect(sif, 'resolving link to the record').toContain(
      '](../the-codex-dialogues/references/probe-record.md)',
    );
    expect(sif, 'no subject-adjacent version literal outside the record').not.toMatch(
      /codex[- ](?:cli|mcp-server)[^\n]{0,24}\d+\.\d+\.\d+/i,
    );
    expect(sif, 'no restatement of the pinned value in any spelling').not.toContain(pin);
  });

  it('pins the tracked registration template to the exact launch contract', async () => {
    const skill = await readRepoDocument(INSTRUMENT_SKILL_PATH);
    // \r?\n: the document is committed LF but a Windows checkout under
    // autocrlf renders it CRLF; the pin binds the content, not the host's
    // line-ending rendering.
    const fenced = /```json\r?\n([\s\S]*?)```/.exec(skill)?.[1] ?? '"TEMPLATE-FENCE-MISSING"';
    const template: unknown = JSON.parse(fenced);
    expect(template).toStrictEqual({
      mcpServers: {
        codex: {
          type: 'stdio',
          command: 'codex',
          args: PINNED_REGISTRATION_ARGS,
        },
      },
    });
  });

  it('pins the probe script launch args to the same contract, whole-array', async () => {
    const script = await readRepoDocument(PROBE_SCRIPT_PATH);
    const declaration = /const LAUNCH_ARGS = \[([\s\S]*?)\];/.exec(script)?.[1] ?? '';
    // The literal extraction alone is blind to non-literal entries — a
    // `...EXTRA_ARGS` spread would leave the extracted array identical to
    // the pins while the probe launches extra arguments. Reject any
    // residual syntax beyond quoted literals, commas, and whitespace
    // BEFORE comparing, so the pin binds the whole declaration.
    const residue = declaration.replaceAll(/'[^']*'/g, '').replaceAll(/[\s,]/g, '');
    expect(residue, 'LAUNCH_ARGS must contain only quoted string literals').toBe('');
    const args = [...declaration.matchAll(/'([^']*)'/g)].map((entry) => entry[1]);
    expect(args).toStrictEqual(PINNED_REGISTRATION_ARGS);
  });
});
