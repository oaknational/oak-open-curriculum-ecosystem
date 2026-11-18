---
name: "Principled ESLint Zoning for Build Tooling and Generated Artefacts"
polarity: pattern
use_this_when: "A workspace's build tooling (generators, extractors) or generated artefacts collide with app-strict lint rules and the reflex is to disable rules or contort the tooling into app-runtime idioms."
category: architecture
layer: family
proven_in: "curriculum-hub-demo eslint.config.ts (2026-07-01, config-expert PASS): the course extractor/generator needed fail-loud throw + deep JSON walks; the zoning mirrored the pre-existing oak-sdk-codegen precedent. Held through the strict-everywhere ruling (2026-07-02) which removed demo-tier EXEMPTIONS while keeping principled per-rule zoning intact."
proven_date: 2026-07-06
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "The two failure modes it forecloses: broad disables (gate-off anti-pattern, violates never-disable-checks) and contorting build tooling into app idioms (Result-threading a recursive parser is worse code than a fail-loud throw at generate time)."
  stable: true
---

# Principled ESLint Zoning for Build Tooling and Generated Artefacts

> **POLARITY: PATTERN.** This is a shape to repeat — it reconciles
> `never-disable-checks` with build-tooling reality by deriving each
> relaxation from the rule's own purpose.

## The shape

Relax a rule ONLY in a scoped flat-config block whose glob matches
build tooling (`scripts/**`) or generated artefacts (`*.generated.ts`),
and justify the relaxation **from the rule's own purpose**:

- `no-throw` exists for app control flow (a thrown error is invisible
  to the type system at runtime call sites). A build script that fails
  LOUD on bad vendored data at generate time uses throw correctly — the
  consumer is the build, and the build must die.
- `max-lines` exists for maintainability of hand-authored code.
  Generated artefacts are not hand-maintained → off for
  `*.generated.ts` ONLY. **Hand-authored tooling KEEPS `max-lines`** —
  split the file, don't exempt it.
- **Exclude `*.test.ts` from every zone** so tests-of-tooling stay
  full-strict.
- App code and real logic are never zoned.

Mirror an in-repo precedent when one exists (the SDK codegen
workspace's config zones its `code-generation/**` and generated types
the same way) — precedent keeps zoning consistent estate-wide.

## The distinction that keeps it honest

Scoping a gate's purview ≠ weakening a rule's strictness. Zoning states
where a rule's purpose genuinely applies; disabling dodges a fix. The
strict-everywhere ruling (owner, 2026-07-02) removed whole-tier
EXEMPTIONS (prettier/knip/markdownlint ignores) and survived contact
with this pattern — the per-rule, purpose-derived zones stayed.

## Related

- `never-disable-checks`; `generator-first-mindset`;
  `docs/engineering/claude-design-conversion-playbook.md`
  §gate-integration (the demo-tier worked example).
