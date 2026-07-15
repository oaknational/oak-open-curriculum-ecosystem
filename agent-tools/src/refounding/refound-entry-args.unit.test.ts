import { unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  entryUsageText,
  parseEntryArgs,
  parseOutDirArgs,
  prepareOutDirEntry,
} from './refound-entry-args.js';
import { DEFAULT_OUT_DIR } from './refound-freeze-helpers.js';
import { unwrapErr } from './test-helpers.js';

interface ProbeState {
  outDir: string;
  rulePath: string;
}

const USAGE = entryUsageText('refound-probe', '[--rule <path>] [--out <dir>]');

function parseProbe(argv: readonly string[]) {
  return parseEntryArgs<ProbeState>(
    argv,
    USAGE,
    { outDir: 'default-out', rulePath: 'default-rule' },
    {
      '--out': (state, value) => {
        state.outDir = value;
      },
      '--rule': (state, value) => {
        state.rulePath = value;
      },
    },
  );
}

describe('entryUsageText', () => {
  it('composes the usage line with the help flag always last', () => {
    expect(USAGE).toBe('usage: refound-probe [--rule <path>] [--out <dir>] [--help|-h]');
  });

  it('composes a no-option tool as bare usage plus the help flag', () => {
    expect(entryUsageText('refound-bare', '')).toBe('usage: refound-bare [--help|-h]');
  });
});

describe('parseEntryArgs', () => {
  it('applies the supplied defaults on an empty argv, with help false', () => {
    expect(unwrap(parseProbe([]))).toEqual({
      state: { outDir: 'default-out', rulePath: 'default-rule' },
      help: false,
    });
  });

  it('applies value options to the state', () => {
    const value = unwrap(parseProbe(['--rule', 'r.json', '--out', 'somewhere']));
    expect(value.state).toEqual({ outDir: 'somewhere', rulePath: 'r.json' });
    expect(value.help).toBe(false);
  });

  it.each(['--help', '-h'])('recognises %s as a run-nothing short-circuit request', (flag) => {
    expect(unwrap(parseProbe([flag])).help).toBe(true);
  });

  it.each([[['--']], [['--', '--help']], [['--out', 'x', '--']]])(
    'refuses the -- terminator instead of silently swallowing what follows it (argv %j)',
    (argv) => {
      const error = unwrapErr(parseProbe(argv));
      expect(error.message).toContain('takes no positional arguments');
      expect(error.message).toContain(USAGE);
    },
  );

  it('rejects an unknown flag rather than silently ignoring it', () => {
    const error = unwrapErr(parseProbe(['--rules', 'r.json']));
    expect(error.message).toContain('unknown option');
    expect(error.message).toContain(USAGE);
  });

  it('rejects an unexpected positional argument', () => {
    expect(unwrapErr(parseProbe(['stray'])).message).toContain('unexpected positional argument');
  });

  it('rejects a dangling value option with no value', () => {
    expect(unwrapErr(parseProbe(['--rule'])).message).toContain('requires a value');
    expect(parseProbe(['--out']).ok).toBe(false);
  });

  it('rejects a registered option token as an option value (the --out -h footgun)', () => {
    expect(unwrapErr(parseProbe(['--out', '-h'])).message).toContain('requires a value');
    expect(parseProbe(['--rule', '--help']).ok).toBe(false);
  });

  it('supports a tool with no value options at all', () => {
    const bareUsage = entryUsageText('refound-bare', '');
    const helped = unwrap(parseEntryArgs<Record<string, never>>(['--help'], bareUsage, {}, {}));
    expect(helped.help).toBe(true);
    const refused = parseEntryArgs<Record<string, never>>(['--out', 'x'], bareUsage, {}, {});
    expect(refused.ok).toBe(false);
  });
});

describe('parseOutDirArgs (the shared --out-only entry surface)', () => {
  it('applies the documented default with help false', () => {
    expect(unwrap(parseOutDirArgs([], 'refound-inventory'))).toEqual({
      outDir: DEFAULT_OUT_DIR,
      help: false,
    });
  });

  it('honours an --out override', () => {
    expect(unwrap(parseOutDirArgs(['--out', 'somewhere'], 'refound-inventory'))).toEqual({
      outDir: 'somewhere',
      help: false,
    });
  });

  it.each(['--help', '-h'])('recognises %s as a run-nothing short-circuit request', (flag) => {
    expect(unwrap(parseOutDirArgs([flag], 'refound-inventory')).help).toBe(true);
  });

  it('refuses the -- terminator, naming the tool in the usage line', () => {
    const error = unwrapErr(parseOutDirArgs(['--', '--help'], 'refound-residue'));
    expect(error.message).toContain('takes no positional arguments');
    expect(error.message).toContain('usage: refound-residue [--out <dir>] [--help|-h]');
  });

  it('rejects an unknown flag', () => {
    expect(parseOutDirArgs(['--rule', 'r.json'], 'refound-inventory').ok).toBe(false);
  });
});

describe('prepareOutDirEntry — the --out-only preflight', () => {
  it('returns the help verdict BEFORE any path resolution (a bogus root never matters)', () => {
    expect(
      unwrap(prepareOutDirEntry('/nonexistent-root', ['--help'], 'refound-inventory')),
    ).toEqual({ help: true });
  });

  it('propagates a parse refusal without resolving anything', () => {
    const error = unwrapErr(
      prepareOutDirEntry('/nonexistent-root', ['--', '--help'], 'refound-residue'),
    );
    expect(error.message).toContain('takes no positional arguments');
  });
});
