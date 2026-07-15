import { describe, expect, it } from 'vitest';

import {
  entryUsageText,
  parseEntryArgs,
  parseOutDirArgs,
  prepareOutDirEntry,
} from './refound-entry-args.js';
import { DEFAULT_OUT_DIR } from './refound-freeze-helpers.js';

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
    const result = parseProbe([]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({
        state: { outDir: 'default-out', rulePath: 'default-rule' },
        help: false,
      });
    }
  });

  it('applies value options to the state', () => {
    const result = parseProbe(['--rule', 'r.json', '--out', 'somewhere']);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.state).toEqual({ outDir: 'somewhere', rulePath: 'r.json' });
      expect(result.value.help).toBe(false);
    }
  });

  it.each(['--help', '-h'])('recognises %s as a run-nothing short-circuit request', (flag) => {
    const result = parseProbe([flag]);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.help).toBe(true);
    }
  });

  it.each([[['--']], [['--', '--help']], [['--out', 'x', '--']]])(
    'refuses the -- terminator instead of silently swallowing what follows it (argv %j)',
    (argv) => {
      const result = parseProbe(argv);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toContain('takes no positional arguments');
        expect(result.error.message).toContain(USAGE);
      }
    },
  );

  it('rejects an unknown flag rather than silently ignoring it', () => {
    const result = parseProbe(['--rules', 'r.json']);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('unknown option');
      expect(result.error.message).toContain(USAGE);
    }
  });

  it('rejects an unexpected positional argument', () => {
    const result = parseProbe(['stray']);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('unexpected positional argument');
    }
  });

  it('rejects a dangling value option with no value', () => {
    const result = parseProbe(['--rule']);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('requires a value');
    }
    expect(parseProbe(['--out']).ok).toBe(false);
  });

  it('rejects a registered option token as an option value (the --out -h footgun)', () => {
    const result = parseProbe(['--out', '-h']);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('requires a value');
    }
    expect(parseProbe(['--rule', '--help']).ok).toBe(false);
  });

  it('supports a tool with no value options at all', () => {
    const bareUsage = entryUsageText('refound-bare', '');
    const result = parseEntryArgs<Record<string, never>>(['--help'], bareUsage, {}, {});
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.help).toBe(true);
    }
    const refused = parseEntryArgs<Record<string, never>>(['--out', 'x'], bareUsage, {}, {});
    expect(refused.ok).toBe(false);
  });
});

describe('parseOutDirArgs (the shared --out-only entry surface)', () => {
  it('applies the documented default with help false', () => {
    const result = parseOutDirArgs([], 'refound-inventory');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ outDir: DEFAULT_OUT_DIR, help: false });
    }
  });

  it('honours an --out override', () => {
    const result = parseOutDirArgs(['--out', 'somewhere'], 'refound-inventory');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ outDir: 'somewhere', help: false });
    }
  });

  it.each(['--help', '-h'])('recognises %s as a run-nothing short-circuit request', (flag) => {
    const result = parseOutDirArgs([flag], 'refound-inventory');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.help).toBe(true);
    }
  });

  it('refuses the -- terminator, naming the tool in the usage line', () => {
    const result = parseOutDirArgs(['--', '--help'], 'refound-residue');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('takes no positional arguments');
      expect(result.error.message).toContain('usage: refound-residue [--out <dir>] [--help|-h]');
    }
  });

  it('rejects an unknown flag', () => {
    expect(parseOutDirArgs(['--rule', 'r.json'], 'refound-inventory').ok).toBe(false);
  });
});

describe('prepareOutDirEntry — the --out-only preflight', () => {
  it('returns the help verdict BEFORE any path resolution (a bogus root never matters)', () => {
    const prepared = prepareOutDirEntry('/nonexistent-root', ['--help'], 'refound-inventory');
    expect(prepared.ok).toBe(true);
    if (prepared.ok) {
      expect(prepared.value).toEqual({ help: true });
    }
  });

  it('propagates a parse refusal without resolving anything', () => {
    const prepared = prepareOutDirEntry('/nonexistent-root', ['--', '--help'], 'refound-residue');
    expect(prepared.ok).toBe(false);
    if (!prepared.ok) {
      expect(prepared.error.message).toContain('takes no positional arguments');
    }
  });
});
