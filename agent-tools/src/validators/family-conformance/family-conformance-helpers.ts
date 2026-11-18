import { typeSafeEntries } from '@oaknational/type-helpers';

import type { CheckSkeleton, HostValues } from './family-conformance-manifest.js';

/**
 * Pure comparison helpers for the family conformance validator: the root
 * scripts, the `check` skeleton and the aggregate prefixes. Each comparison
 * is one function over strings and parsed objects, returning the drifts it
 * finds; the composition root (`validate-family-conformance.ts`) reads the
 * tree and prints. See `family-conformance-tree-helpers.ts` for the hook,
 * CI, compiler, formatter and package-manager comparisons.
 *
 * @packageDocumentation
 */

/** The surface a drift was found on. */
export type DriftArea =
  'script' | 'check' | 'aggregate' | 'hook' | 'ci' | 'compiler' | 'formatter' | 'package-manager';

/** One divergence between the family manifest and the live tree. */
export interface Drift {
  readonly area: DriftArea;
  readonly message: string;
}

/** The reading of the `check` skeleton: its drifts and what the host put in each slot. */
export interface SkeletonReading {
  readonly drifts: readonly Drift[];
  readonly slotBeforeBuild: readonly string[];
  readonly slotAfterTests: readonly string[];
}

export function drift(area: DriftArea, message: string): Drift {
  return { area, message };
}

/** Replace the manifest's host placeholders with this host's values. */
export function substitutePlaceholders(text: string, host: HostValues): string {
  return text.replaceAll('{scope}', host.scope).replaceAll('{skill_prefix}', host.skill_prefix);
}

/** Split a root script into its `&&`-joined legs, trimmed, empties dropped. */
export function splitLegs(script: string): readonly string[] {
  return script
    .split('&&')
    .map((leg) => leg.trim())
    .filter((leg) => leg.length > 0);
}

function sequenceStartsWith(legs: readonly string[], prefix: readonly string[]): boolean {
  return prefix.every((leg, index) => legs[index] === leg);
}

function sequenceEndsWith(legs: readonly string[], suffix: readonly string[]): boolean {
  const offset = legs.length - suffix.length;
  return offset >= 0 && suffix.every((leg, index) => legs[offset + index] === leg);
}

function indexOfSequence(legs: readonly string[], sequence: readonly string[]): number {
  for (let start = 0; start + sequence.length <= legs.length; start += 1) {
    if (sequence.every((leg, index) => legs[start + index] === leg)) {
      return start;
    }
  }
  return -1;
}

function formatLegs(legs: readonly string[]): string {
  return legs.length === 0 ? '(none)' : legs.map((leg) => `\`${leg}\``).join(', ');
}

/**
 * Compare every declared root script, after placeholder substitution, with
 * the live root `package.json` scripts: a missing script and a differing
 * body are each one drift.
 */
export function compareScripts(
  declared: Readonly<Record<string, string>>,
  host: HostValues,
  live: Readonly<Record<string, string>>,
): readonly Drift[] {
  const drifts: Drift[] = [];
  for (const [name, body] of typeSafeEntries(declared)) {
    const expected = substitutePlaceholders(body, host);
    const actual = live[name];
    if (actual === undefined) {
      drifts.push(
        drift('script', `root script \`${name}\` is missing; the family declares \`${expected}\``),
      );
    } else if (actual !== expected) {
      drifts.push(
        drift(
          'script',
          `root script \`${name}\` reads \`${actual}\`; the family declares \`${expected}\``,
        ),
      );
    }
  }
  return drifts;
}

/**
 * Read the live `check` script against the family skeleton: the head legs
 * open it, the tail legs close it, and the gate legs appear once, in order,
 * between them; whatever the host put before and after the gates are the
 * two slots. A broken head or tail is reported without a slot reading.
 */
export function checkSkeleton(
  skeleton: CheckSkeleton,
  host: HostValues,
  liveCheck: string | undefined,
): SkeletonReading {
  const empty = { slotBeforeBuild: [], slotAfterTests: [] };
  if (liveCheck === undefined) {
    return { drifts: [drift('check', 'root script `check` is missing')], ...empty };
  }
  const legs = splitLegs(liveCheck);
  const head = skeleton.head.map((leg) => substitutePlaceholders(leg, host));
  const gates = skeleton.gates.map((leg) => substitutePlaceholders(leg, host));
  const tail = skeleton.tail.map((leg) => substitutePlaceholders(leg, host));
  const drifts: Drift[] = [];
  if (!sequenceStartsWith(legs, head)) {
    drifts.push(
      drift('check', `\`check\` does not open with the family head legs ${formatLegs(head)}`),
    );
  }
  if (!sequenceEndsWith(legs, tail)) {
    drifts.push(
      drift('check', `\`check\` does not close with the family tail legs ${formatLegs(tail)}`),
    );
  }
  if (drifts.length > 0) {
    return { drifts, ...empty };
  }
  return readGateSlots(legs.slice(head.length, legs.length - tail.length), gates);
}

/**
 * The two host slots around the family gate legs in the middle of `check`:
 * the gates appear exactly once, in order, so a missing or reordered
 * sequence is one drift and a second run of the sequence (a host slot
 * carrying the family's own legs) is another, each without a slot reading.
 */
function readGateSlots(middle: readonly string[], gates: readonly string[]): SkeletonReading {
  const empty = { slotBeforeBuild: [], slotAfterTests: [] };
  const gatesAt = indexOfSequence(middle, gates);
  if (gatesAt === -1) {
    const message = `\`check\` does not run the family gate legs ${formatLegs(gates)} between its head and tail; found ${formatLegs(middle)}`;
    return { drifts: [drift('check', message)], ...empty };
  }
  const slotAfterTests = middle.slice(gatesAt + gates.length);
  if (indexOfSequence(slotAfterTests, gates) !== -1) {
    const message = `\`check\` runs the family gate legs ${formatLegs(gates)} more than once; the family legs appear exactly once between the head and the tail`;
    return { drifts: [drift('check', message)], ...empty };
  }
  return { drifts: [], slotBeforeBuild: middle.slice(0, gatesAt), slotAfterTests };
}

/**
 * Each aggregate script must start with its family legs, in order; host
 * legs may follow. A missing aggregate and a divergent prefix are each one
 * drift, the latter naming the first position that differs.
 */
export function checkAggregates(
  declared: Readonly<Record<string, readonly string[]>>,
  host: HostValues,
  live: Readonly<Record<string, string>>,
): readonly Drift[] {
  const drifts: Drift[] = [];
  for (const [name, familyLegs] of typeSafeEntries(declared)) {
    const script = live[name];
    if (script === undefined) {
      drifts.push(drift('aggregate', `root script \`${name}\` is missing`));
      continue;
    }
    const legs = splitLegs(script);
    const expected = familyLegs.map((leg) => substitutePlaceholders(leg, host));
    const divergence = expected.findIndex((leg, index) => legs[index] !== leg);
    if (divergence !== -1) {
      const found = legs[divergence] === undefined ? '(end of script)' : `\`${legs[divergence]}\``;
      drifts.push(
        drift(
          'aggregate',
          `\`${name}\` leg ${String(divergence + 1)} is ${found}; the family's leg there is \`${expected[divergence] ?? ''}\``,
        ),
      );
    }
  }
  return drifts;
}
