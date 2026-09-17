/**
 * The Practice-projection class marker.
 *
 * A Practice skill's source of truth lives under `.agent/skills/`; every
 * adapter stub this pipeline writes DERIVES from a canonical there and
 * records that derivation in its body as the pointer line built by
 * {@link adapterStubPointerLine}. That recorded derivation — not the
 * directory's name — is what makes an entry at a projection root a member
 * of the Practice class: names are configurable (the generation prefix is
 * a naming parameter), locations are shared with Vendor-class skills the
 * external machinery installs, but only our own emission writes a stub
 * whose whole shape matches.
 *
 * Recognition is STRUCTURAL, not line-scanning: a document merely quoting
 * the pointer line (a fenced example in a foreign SKILL.md) is not a
 * member — {@link parseAdapterStubPointer} requires the full stub shape
 * (frontmatter, one title line, the pointer line as the only other body
 * content) and a clean relative pointer path that targets the generated
 * canonical filename (`SKILL-CANONICAL.md`) — a stub pointing anywhere else is
 * a foreign document we never wrote. One NAMED BOUND is
 * inherent to content-based membership: a byte-faithful copy of one of
 * our stubs (e.g. an Oak-published projection re-installed here by the
 * external machinery) is indistinguishable from ours — the marker records
 * a derivation, not an identity. Closing that would need an identity
 * discriminator and is a recorded design decision, not this module's job.
 *
 * The reconciliation sweep, the clear pass, the emission-target guard,
 * and the portability permission census all recognise class membership by
 * parsing this marker back. Builder and parser live together here so the
 * marker's shape has exactly one home: a change to the line's form is a
 * change to class recognition across every consumer — the round-trip and
 * the literal form are pinned in `adapter-stub.unit.test.ts`. Two
 * environmental dependencies worth knowing: the projection roots are
 * Prettier-ignored (`.prettierignore`), so no formatter reflows stub
 * bodies out of recognition; and a `canonicalRef` containing a backtick
 * or newline cannot round-trip (the built line stops parsing), so emission
 * REFUSES such a canonical ({@link isRoundTrippableCanonicalRef}) rather
 * than writing a stub every later check would reject as foreign — canonical
 * directory names never carry either, and the unit test pins both the
 * round-trip and the refusal.
 */
import { CANONICAL_FILENAME } from './discovery.js';

/**
 * Render the pointer line for an adapter stub body.
 *
 * @param canonicalRef - The canonical's path relative to
 *   `.agent/skills/` (e.g. `cognition/parallax/SKILL-CANONICAL.md`).
 * @returns The marker line recording the stub's derivation.
 */
export function adapterStubPointerLine(canonicalRef: string): string {
  return `Read and follow \`.agent/skills/${canonicalRef}\`.`;
}

const POINTER_LINE_PATTERN = /^Read and follow `\.agent\/skills\/([^`\n]+)`\.$/;
const TITLE_LINE_PATTERN = /^# .+ \(.+\)$/;

/**
 * Parse the class marker from adapter-stub content, structurally.
 *
 * Membership requires the WHOLE stub shape: a frontmatter block, then a
 * body whose only non-empty lines are one title line (a heading naming
 * the skill and its surface) and the pointer line, in that order, with
 * the pointer's captured path a clean relative reference (no empty,
 * dot, dot-dot, or backslash segments; at least two). Anything else — extra
 * body content, a quoted marker inside prose or a fence, a traversal
 * path — is NOT a Practice projection and is outside our tooling's
 * jurisdiction.
 *
 * @param content - The full text of a `SKILL.md` found at a projection
 *   root.
 * @returns The canonical path relative to `.agent/skills/` the stub
 *   derives from, or `undefined` when the content is not a Practice
 *   stub.
 */
export function parseAdapterStubPointer(content: string): string | undefined {
  const lines = stubBodyLinesOrUndefined(content);
  if (lines === undefined || !TITLE_LINE_PATTERN.test(lines.title)) {
    return undefined;
  }
  const canonicalRef = POINTER_LINE_PATTERN.exec(lines.pointer)?.[1];
  if (
    canonicalRef === undefined ||
    !isCleanCanonicalRef(canonicalRef) ||
    !targetsGeneratedCanonical(canonicalRef)
  ) {
    return undefined;
  }
  return canonicalRef;
}

/** The structural pre-check: a required leading frontmatter block, then
 * exactly two non-empty body lines. `undefined` on any other shape. */
function stubBodyLinesOrUndefined(
  content: string,
): { readonly title: string; readonly pointer: string } | undefined {
  const body = /^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/u.exec(content)?.[1];
  if (body === undefined) {
    return undefined;
  }
  const lines = body
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line !== '');
  const [title, pointer] = lines;
  if (lines.length !== 2 || title === undefined || pointer === undefined) {
    return undefined;
  }
  return { title, pointer };
}

function isCleanCanonicalRef(canonicalRef: string): boolean {
  const segments = canonicalRef.split('/');
  return (
    segments.length >= 2 &&
    segments.every(
      (segment) => segment !== '' && segment !== '.' && segment !== '..' && !segment.includes('\\'),
    )
  );
}

/** Membership and round-trip require the pointer to target the generator's own
 * canonical filename (`CANONICAL_FILENAME`, single-sourced from `discovery.ts`):
 * every stub we write points at `<dir>/SKILL-CANONICAL.md`, so a clean ref
 * targeting any other filename (e.g. `vendor/README.md`) is a foreign stub we
 * never emitted and must stay out of the Practice class — and out of `--clear`'s
 * destructive jurisdiction (review round 4, 2026-08-12). */
function targetsGeneratedCanonical(canonicalRef: string): boolean {
  return canonicalRef.split('/').at(-1) === CANONICAL_FILENAME;
}

/**
 * Whether a canonical ref can round-trip through the class marker — the
 * builder must be able to write it AND {@link parseAdapterStubPointer} read
 * it back to the same value. A backtick or newline breaks the pointer-line
 * pattern (the built line stops parsing); the clean-ref rules (≥2 segments;
 * no empty, dot, dot-dot, or backslash segment) are the parser's own
 * acceptance test. Emission checks this before writing so a non-round-trippable
 * canonical (a pathological directory name) is REFUSED, never written as a
 * stub every later check would then reject as foreign.
 */
export function isRoundTrippableCanonicalRef(canonicalRef: string): boolean {
  return (
    !canonicalRef.includes('`') &&
    !canonicalRef.includes('\n') &&
    isCleanCanonicalRef(canonicalRef) &&
    targetsGeneratedCanonical(canonicalRef)
  );
}
