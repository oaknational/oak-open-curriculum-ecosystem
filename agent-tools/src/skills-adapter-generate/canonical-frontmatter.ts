/**
 * The canonical skill frontmatter contract: its schema, its parse, and the
 * spec-portable slice both adapter surfaces carry.
 *
 * A canonical's frontmatter is an INPUT at a boundary — hand-authored YAML
 * read by the generator and the drift checker — so it is validated by a
 * schema rather than probed field by field. The schema is the
 * [Agent Skills specification](https://agentskills.io/specification)
 * frontmatter table: `name` and `description` required, `license`,
 * `compatibility`, `metadata` (a string→string map), and `allowed-tools`
 * optional. ADR-125's Layer 2 adapter table makes those four optional
 * fields PASS-THROUGH content for `.claude/skills/` and `.agents/skills/`
 * alike, which is why they are parsed here instead of discarded.
 *
 * Unknown keys are STRIPPED, not rejected: `classification` (ADR-125
 * structural invariant 9), `concern`, and `domain` are canonical-only
 * extensions the specification's own `metadata` guidance leaves us free to
 * keep at top level, and they must never reach a projection. A
 * present-but-malformed spec field is a different matter and fails the
 * parse — see {@link validateCanonicalFrontmatter}.
 *
 * This module validates SHAPE, which is what emission needs: a value the
 * spec does not admit cannot be written as conforming frontmatter. The
 * specification's numeric and format limits (description ≤1024,
 * compatibility ≤500, the `name` regex and directory-name match) are
 * estate-wide contract checks over every canonical rather than
 * per-emission blockers, and this module does not perform them.
 */
import { z } from 'zod';

/**
 * The Agent Skills frontmatter schema. `z.object` strips unknown keys, so
 * the parsed value carries exactly the specification's fields and the
 * canonical-only keys stay behind in the source file.
 */
const canonicalFrontmatterSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  license: z.string().min(1).optional(),
  compatibility: z.string().min(1).optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  'allowed-tools': z.string().min(1).optional(),
});

/** A canonical's frontmatter as the specification defines it. */
export type CanonicalFrontmatter = z.infer<typeof canonicalFrontmatterSchema>;

/**
 * The four optional fields ADR-125's adapter table carries through to both
 * surfaces. Declared as a slice of {@link CanonicalFrontmatter} so the set
 * cannot drift between what the schema admits and what the emitter writes.
 */
export type SpecPortableFrontmatter = Pick<
  CanonicalFrontmatter,
  'license' | 'compatibility' | 'metadata' | 'allowed-tools'
>;

/**
 * Validate a parsed YAML frontmatter value against the specification.
 *
 * Returns undefined when a required field is missing or a declared field
 * holds a value the specification does not admit — a non-string `license`,
 * `compatibility`, or `allowed-tools`, or a `metadata` that is not a
 * string→string map (an unquoted YAML `version: 1.0` parses to a number
 * and is refused; the conforming form is `version: "1.0"`). A malformed
 * field is a REFUSAL rather than a silent drop: emitting the adapter
 * without it would publish a projection that disagrees with its canonical,
 * and dropping it quietly is how a typo'd field stays invisible.
 */
export function validateCanonicalFrontmatter(value: unknown): CanonicalFrontmatter | undefined {
  const result = canonicalFrontmatterSchema.safeParse(value);
  return result.success ? result.data : undefined;
}

/**
 * The spec-portable slice of a canonical's frontmatter, ready to spread
 * into an adapter's emitted frontmatter.
 *
 * Fields are read in the specification's own table order, so both surfaces
 * emit them in a stable order, and an absent field contributes no key at
 * all — an adapter for a canonical that declares none is byte-identical to
 * one emitted before this pass-through existed.
 */
export function specPortableFrontmatter(canonical: CanonicalFrontmatter): SpecPortableFrontmatter {
  const { license, compatibility, metadata } = canonical;
  const allowedTools = canonical['allowed-tools'];
  return {
    ...(license !== undefined && { license }),
    ...(compatibility !== undefined && { compatibility }),
    ...(metadata !== undefined && { metadata }),
    ...(allowedTools !== undefined && { 'allowed-tools': allowedTools }),
  };
}
