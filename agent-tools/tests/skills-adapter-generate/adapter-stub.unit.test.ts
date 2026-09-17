import { describe, expect, it } from 'vitest';

import {
  adapterStubPointerLine,
  isRoundTrippableCanonicalRef,
  parseAdapterStubPointer,
} from '../../src/skills-adapter-generate/adapter-stub';

const FRONTMATTER = '---\nname: oak-parallax\ndescription: A skill.\n---\n\n';
const TITLE = '# Parallax (Claude Code)\n\n';

/** The one literal pin of the marker's on-disk form: if the builder's
 * output ever changes shape, this line breaks loudly here — every
 * consumer fixture elsewhere derives from the builder on purpose. */
const LITERAL_MARKER = 'Read and follow `.agent/skills/cognition/parallax/SKILL-CANONICAL.md`.';

describe('adapterStubPointerLine ↔ parseAdapterStubPointer', () => {
  it('pins the literal marker form and round-trips it through a whole stub', () => {
    const canonicalRef = 'cognition/parallax/SKILL-CANONICAL.md';

    expect(adapterStubPointerLine(canonicalRef)).toBe(LITERAL_MARKER);
    expect(parseAdapterStubPointer(`${FRONTMATTER}${TITLE}${LITERAL_MARKER}\n`)).toBe(canonicalRef);
  });

  it('cannot round-trip a canonicalRef containing a backtick — the recorded bound: such a stub falls out of jurisdiction', () => {
    const hostile = 'cognition/back`tick/SKILL-CANONICAL.md';

    const content = `${FRONTMATTER}${TITLE}${adapterStubPointerLine(hostile)}\n`;

    expect(parseAdapterStubPointer(content)).toBeUndefined();
  });

  it.each([
    { ref: 'cognition/parallax/SKILL-CANONICAL.md', ok: true, why: 'a clean multi-segment ref' },
    { ref: 'commit/SKILL-CANONICAL.md', ok: true, why: 'a clean two-segment ref' },
    {
      ref: 'cognition/back`tick/SKILL-CANONICAL.md',
      ok: false,
      why: 'a backtick breaks the marker',
    },
    {
      ref: 'cognition/new\nline/SKILL-CANONICAL.md',
      ok: false,
      why: 'a newline breaks the marker',
    },
    { ref: 'SKILL-CANONICAL.md', ok: false, why: 'a single segment is not a projection ref' },
    {
      ref: 'cognition/../escape/SKILL-CANONICAL.md',
      ok: false,
      why: 'a dot-dot segment is unclean',
    },
    {
      ref: String.raw`cognition/back\slash/SKILL-CANONICAL.md`,
      ok: false,
      why: 'a backslash segment is unclean',
    },
    {
      ref: 'vendor/README.md',
      ok: false,
      why: 'a clean ref that does not target the generated canonical filename is not one we emit',
    },
  ])('isRoundTrippableCanonicalRef: $why ($ok)', ({ ref, ok }) => {
    expect(isRoundTrippableCanonicalRef(ref)).toBe(ok);
  });
});

describe('parseAdapterStubPointer — structural recognition', () => {
  const pointer = adapterStubPointerLine('cognition/parallax/SKILL-CANONICAL.md');

  it.each([
    {
      why: 'a marker quoted inside a fenced example is NOT membership',
      content: `${FRONTMATTER}# Vendor Skill\n\nHow Oak stubs look:\n\n\`\`\`md\n${pointer}\n\`\`\`\n`,
    },
    {
      why: 'a marker mentioned mid-prose is NOT membership',
      content: `${FRONTMATTER}${TITLE}This doc explains that ${pointer} is the convention.\n`,
    },
    {
      why: 'extra body content beyond title + pointer is NOT membership',
      content: `${FRONTMATTER}${TITLE}${pointer}\n\nAnd further vendor instructions here.\n`,
    },
    {
      why: 'missing frontmatter is NOT membership',
      content: `${TITLE}${pointer}\n`,
    },
    {
      why: 'a traversal pointer is rejected',
      content: `${FRONTMATTER}${TITLE}Read and follow \`.agent/skills/../../etc/passwd\`.\n`,
    },
    {
      why: 'an absolute-ish single-segment pointer is rejected',
      content: `${FRONTMATTER}${TITLE}Read and follow \`.agent/skills/passwd\`.\n`,
    },
    {
      why: 'plain foreign content is NOT membership',
      content: '# Clerk\n\nVendor skill body.\n',
    },
    {
      why: 'a well-formed stub pointing at a non-SKILL-CANONICAL.md target is NOT ours — a foreign two-line stub must stay out of --clear jurisdiction',
      content: `${FRONTMATTER}${TITLE}${adapterStubPointerLine('vendor/README.md')}\n`,
    },
  ])('$why', ({ content }) => {
    expect(parseAdapterStubPointer(content)).toBeUndefined();
  });

  it('recognises both surface labels the renderer emits', () => {
    const crossTool = `${FRONTMATTER}# Parallax (Cross-tool)\n\n${pointer}\n`;

    expect(parseAdapterStubPointer(crossTool)).toBe('cognition/parallax/SKILL-CANONICAL.md');
  });
});
