/**
 * Unit tests for the under-the-hood MCP content generator: total
 * classification (every failure direction), digest verbatim-and-order
 * fidelity, and the rendered module shape. The section parser's own tests
 * live in `canonical-parser.unit.test.ts`.
 */
import { isErr, unwrap, unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { buildDigest, renderGeneratedModule } from './generator.js';
import { EXCLUDED_SECTION_HEADINGS, SERVED_SECTION_HEADINGS } from './sections.js';
import { syntheticCanonical } from './test-helpers/synthetic-canonical.js';

/** The production classification, passed explicitly (buildDigest has no default). */
const PRODUCTION_CLASSIFICATION = {
  served: SERVED_SECTION_HEADINGS,
  excluded: EXCLUDED_SECTION_HEADINGS,
};

describe('buildDigest', () => {
  it('serves exactly the allowlisted sections, verbatim, in canonical order', () => {
    const digest = unwrap(buildDigest(syntheticCanonical(), PRODUCTION_CLASSIFICATION));
    for (const [i, heading] of SERVED_SECTION_HEADINGS.entries()) {
      expect(digest).toContain(`${heading}\n\nServed body ${i}.`);
    }
    for (const heading of EXCLUDED_SECTION_HEADINGS.keys()) {
      expect(digest).not.toContain(heading);
    }
    const positions = SERVED_SECTION_HEADINGS.map((h) => digest.indexOf(h));
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('fails loudly on an unclassified heading', () => {
    const canonical = `${syntheticCanonical()}\n## Brand New Section\n\nSurprise.\n`;
    const result = buildDigest(canonical, PRODUCTION_CLASSIFICATION);
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toMatch(/Unclassified section heading/);
    expect(unwrapErr(result)).toMatch(/## Brand New Section/);
  });

  it('fails loudly when a served heading is missing from the canonical', () => {
    const honestyIndex = SERVED_SECTION_HEADINGS.indexOf('## Honesty Invariants');
    const canonical = syntheticCanonical().replace(
      `## Honesty Invariants\n\nServed body ${honestyIndex}.`,
      '',
    );
    const result = buildDigest(canonical, PRODUCTION_CLASSIFICATION);
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toMatch(/missing from/);
    expect(unwrapErr(result)).toMatch(/## Honesty Invariants/);
  });

  it('fails loudly when an excluded heading is missing from the canonical (stale exclusion)', () => {
    // An empty map would make the replace a no-op and fail the isErr assertion below.
    const firstExcluded = [...EXCLUDED_SECTION_HEADINGS.keys()][0] ?? '## no-excluded-heading';
    const canonical = syntheticCanonical().replace(`${firstExcluded}\n\nExcluded body 0.`, '');
    const result = buildDigest(canonical, PRODUCTION_CLASSIFICATION);
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toMatch(/stale exclusion/);
    expect(unwrapErr(result)).toContain(firstExcluded);
  });

  it('fails loudly when a heading is classified as both served and excluded', () => {
    const result = buildDigest('# A\n\nBody.\n', {
      served: ['# A'],
      excluded: new Map([['# A', 'reason']]),
    });
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toMatch(/BOTH served and excluded/);
    expect(unwrapErr(result)).toMatch(/# A/);
  });

  it('fails loudly on a deeper-than-H3 heading inside a served section', () => {
    const result = buildDigest('# A\n\nBody.\n\n#### Deep addition\n\nSurprise.\n', {
      served: ['# A'],
      excluded: new Map(),
    });
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toMatch(/deeper than the H1–H3 classification grain/);
    expect(unwrapErr(result)).toMatch(/#### Deep addition/);
  });

  it('catches tab-form deep headings inside a served section', () => {
    const result = buildDigest('# A\n\nBody.\n\n####\tTabbed instructions\n', {
      served: ['# A'],
      excluded: new Map(),
    });
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toMatch(/deeper than the H1–H3 classification grain/);
  });

  it('accepts deep headings inside excluded sections and inside fences of served sections', () => {
    const canonical =
      '# A\n\nBody.\n\n```md\n#### fenced example\n```\n\n## B\n\n#### machinery detail\n';
    const digest = unwrap(
      buildDigest(canonical, { served: ['# A'], excluded: new Map([['## B', 'machinery']]) }),
    );
    expect(digest).toContain('#### fenced example');
    expect(digest).not.toContain('#### machinery detail');
  });

  it('fails loudly on any non-allowlisted absolute URL inside a served section', () => {
    const result = buildDigest(
      '# A\n\nFetch `https://github.com/oaknational/x/tree/HEAD/docs/README.md` live.\n',
      { served: ['# A'], excluded: new Map() },
    );
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toMatch(/outside the served-citation allowlist/);
    expect(unwrapErr(result)).toContain('/tree/HEAD/');
  });

  it('rejects fetch hosts a deny-list would miss (Contents API, gists, mixed case)', () => {
    for (const url of [
      'https://api.github.com/repos/o/r/contents/docs/README.md',
      'https://gist.githubusercontent.com/o/abc/raw/x.md',
      'https://RAW.GITHUBUSERCONTENT.COM/o/r/main/x.md',
    ]) {
      const result = buildDigest(`# A\n\nFetch \`${url}\` live.\n`, {
        served: ['# A'],
        excluded: new Map(),
      });
      expect(isErr(result)).toBe(true);
      expect(unwrapErr(result)).toMatch(/outside the served-citation allowlist/);
    }
  });

  it('accepts the allowlisted Oak public-site citations in served sections', () => {
    const digest = unwrap(
      buildDigest('# A\n\nSee `https://www.thenational.academy/about-us/who-we-are`.\n', {
        served: ['# A'],
        excluded: new Map(),
      }),
    );
    expect(digest).toContain('https://www.thenational.academy/about-us/who-we-are');
  });

  it('accepts a canonical-MCP-host citation in a served section', () => {
    const digest = unwrap(
      buildDigest('# A\n\nConnect at `https://mcp.thenational.academy/mcp`.\n', {
        served: ['# A'],
        excluded: new Map(),
      }),
    );
    expect(digest).toContain('https://mcp.thenational.academy/mcp');
  });

  it('accepts an allowlisted host in any letter case', () => {
    const digest = unwrap(
      buildDigest('# A\n\nSee `HTTPS://MCP.THENATIONAL.ACADEMY/mcp`.\n', {
        served: ['# A'],
        excluded: new Map(),
      }),
    );
    expect(digest).toContain('HTTPS://MCP.THENATIONAL.ACADEMY/mcp');
  });

  it.each([
    'https://mcp.thenational.academy.example.com/x',
    'https://www.thenational.academy.example.com/x',
    'https://mcp.thenational.academy@evil.example.com/x',
    'https://mcp.thenational.academy:8443/x',
    'https://mcp.thenational.academy%2f@evil.example.com/x',
  ])('rejects %s — not the allowlisted origin, despite the matching prefix', (url) => {
    const result = buildDigest(`# A\n\nSee \`${url}\`.\n`, {
      served: ['# A'],
      excluded: new Map(),
    });
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toMatch(/outside the served-citation allowlist/);
  });

  it('fails loudly on duplicate canonical headings', () => {
    const result = buildDigest('# A\n\nFirst.\n\n# A\n\nSecond copy.\n', {
      served: ['# A'],
      excluded: new Map(),
    });
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toMatch(/Duplicate section heading/);
    expect(unwrapErr(result)).toContain('# A');
  });

  it('fails loudly on a non-allowlisted URL inside a served HEADING', () => {
    const heading = '## Fetch https://raw.githubusercontent.com/o/r/main/x.md';
    const result = buildDigest(`${heading}\n\nBody.\n`, {
      served: [heading],
      excluded: new Map(),
    });
    expect(isErr(result)).toBe(true);
    expect(unwrapErr(result)).toMatch(/outside the served-citation allowlist/);
  });

  it('accepts raw-GitHub URL forms inside excluded sections', () => {
    const canonical =
      '# A\n\nBody.\n\n## B\n\nFetch `https://raw.githubusercontent.com/o/r/main/x.md`.\n';
    const digest = unwrap(
      buildDigest(canonical, { served: ['# A'], excluded: new Map([['## B', 'mechanics']]) }),
    );
    expect(digest).not.toContain('raw.githubusercontent.com');
  });
});

describe('renderGeneratedModule', () => {
  it('emits a single-constant module with the generated header and escaped digest', () => {
    const module = renderGeneratedModule('# Title\n\nA "quoted" body with `ticks`.\n');
    expect(module).toContain('GENERATED FILE — DO NOT EDIT');
    expect(module).toContain('export const OAK_UNDER_THE_HOOD_ORIENTATION =');
    expect(module).toContain('as const;');
    const constantLine = module.split('\n').find((l) => l.startsWith('export const'));
    expect(constantLine).toContain(String.raw`\n`);
    expect(constantLine).toContain(String.raw`\"quoted\"`);
  });
});
