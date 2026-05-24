/**
 * Canonical comms-event tag namespace per
 * [ADR-183](../../../docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md).
 *
 * Tags compose with the structural channel discriminator at render time
 * (`[BROADCAST]` / `[GROUP]` / `[DIRECTED]` / `[LIFECYCLE]`) — they do NOT
 * replace it. The namespace stays small by design: new tags require an
 * ADR amendment with second-instance evidence (PDR-049 + PDR-050
 * additive-extension discipline).
 *
 * This module is the single source of truth for the CLI's namespace
 * whitelist. The JSON schema description in
 * `.agent/state/collaboration/comms-event.schema.json` enumerates the
 * same namespace in prose; both must move together if the namespace
 * grows. The `heartbeat` tag was added operationally by the SKILL §0.5
 * heartbeat contract; the formal ADR-183 amendment to add it to the
 * recorded namespace is a structural-cure lane pending separate from
 * this module.
 */
export const COMMS_EVENT_TAG_NAMESPACE = Object.freeze([
  'failure-mode',
  'behaviour-note',
  'heartbeat',
] as const);

type CommsEventTag = (typeof COMMS_EVENT_TAG_NAMESPACE)[number];

/**
 * Validate that every tag in `tags` is a canonical ADR-183 tag and that
 * no tag is repeated. Returns the input unchanged on success; throws
 * with a precise message on failure. The shape mirrors the schema's
 * `uniqueItems: true` constraint at the CLI boundary so the rejection
 * happens before any event reaches disk.
 */
export function validateCommsEventTags(tags: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  for (const tag of tags) {
    if (!isCanonicalTag(tag)) {
      throw new Error(
        `unknown comms event tag: '${tag}'. Canonical namespace (ADR-183): ${COMMS_EVENT_TAG_NAMESPACE.join(', ')}`,
      );
    }
    if (seen.has(tag)) {
      throw new Error(`duplicate comms event tag: '${tag}'`);
    }
    seen.add(tag);
  }

  return tags;
}

function isCanonicalTag(tag: string): tag is CommsEventTag {
  for (const known of COMMS_EVENT_TAG_NAMESPACE) {
    if (known === tag) {
      return true;
    }
  }
  return false;
}
