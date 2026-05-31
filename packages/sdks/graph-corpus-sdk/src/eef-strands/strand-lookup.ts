/**
 * EEF strands — typed accessors derived directly from the fixed `as const`
 * corpus snapshot.
 *
 * These are the worked exemplars of the corpus-is-its-own-type-authority
 * doctrine: every type and the runtime lookup derive from
 * {@link EEF_TOOLKIT_DATA} by `typeof` + indexed access and a runtime
 * type-predicate — zero hand-maintained parallel types, zero type assertions,
 * no runtime parse. They live in this gate-checked module (not the
 * duplication-excluded `*.external-data.ts` snapshot) precisely because they
 * are logic and derived types, not raw data.
 */
import { EEF_TOOLKIT_DATA } from './eef-toolkit.external-data.js';

/** The whole toolkit snapshot's static type, inferred from the `as const` literal. */
export type EefToolkitData = typeof EEF_TOOLKIT_DATA;

/**
 * One EEF Teaching and Learning Toolkit strand, narrowed to its *exact*
 * literal shape.
 *
 * Indexing an `as const` tuple with `[number]` yields a union whose members are
 * the individual strand object literals — each keeping its literal `id` and
 * field values — rather than a single widened `{ id: string; ... }`. That
 * per-member precision is the foundation that lets {@link StrandByStrandId} and
 * {@link strandById} hand back one known strand instead of the union of all of
 * them. Lose the `as const` on {@link EEF_TOOLKIT_DATA} and this collapses to a
 * widened shape, taking the precision of everything below it with it.
 */
export type Strand = (typeof EEF_TOOLKIT_DATA.strands)[number];

/**
 * Precisely-keyed lookup from a strand `id` literal to *that* strand's exact
 * type — never a union over all strands.
 *
 * `StrandByStrandId['eef-tl-arts-participation']` resolves to the single
 * arts-participation strand object type, with every literal field intact.
 *
 * @remarks
 * Reusable pattern — **"keyed lookup over a fixed tuple"**. To build the same
 * precise lookup for any other fully-known `as const` sub-structure:
 *
 * 1. Derive the element union: `type T = (typeof DATA.items)[number]`. The
 *    `as const` on the source is mandatory; without it the literal keys and
 *    values widen to `string`/primitives and the precision is gone.
 * 2. Remap the union to a lookup by its discriminant key (here `id`):
 *    `type ByKey = { [E in T as E['key']]: E }`. The key-remapping `as` clause
 *    distributes over each union member, so member `E` stays narrowed to one
 *    element on *both* the key and value sides — that distribution is exactly
 *    what stops the value side from collapsing back into the union.
 *
 * The discriminant must be unique per element (strand `id`s are); a shared key
 * would merge those entries into one.
 *
 * @see {@link strandById} for the runtime counterpart of this type.
 */
export type StrandByStrandId = {
  [S in Strand as S['id']]: S;
};

/**
 * Look up a strand by `id` and get back its *exact* shape, never the union.
 *
 * @typeParam Id - The literal strand id being looked up, inferred from the
 *   argument. The `const Id extends Strand['id']` constraint both rejects
 *   unknown ids at compile time and pins `Id` to the exact literal passed, so
 *   the return type narrows to the single matching strand.
 * @param id - A known strand id (autocompletes to the real ids).
 * @returns The one strand whose `id` equals `id`, typed through
 *   {@link StrandByStrandId} so callers see its full literal shape.
 * @throws Error if `id` matches no strand. Unreachable for well-typed callers
 *   — the constraint forbids unknown ids — but guards erased-type callers where
 *   a `string` reaches this boundary from a JS edge.
 *
 * @example
 * ```ts
 * const arts = strandById('eef-tl-arts-participation');
 * arts.headline.impact_months; // typed as the literal 3 — exact, not a union
 * ```
 *
 * @remarks
 * Reusable pattern — **"assertion-free precise accessor"**. The precision is
 * achieved without a single `as` cast:
 *
 * - The return type `StrandByStrandId[Id]` indexes the keyed lookup
 *   ({@link StrandByStrandId}) by the caller's literal id.
 * - Narrowing inside `.find` uses a type *predicate*
 *   (`strand is StrandByStrandId[Id]`), which is not a type assertion. A
 *   predicate is the one spot the compiler trusts rather than proves, but the
 *   claim is backed by the runtime `strand.id === id` check, so it is sound:
 *   equal ids genuinely mean `strand` is that member.
 *
 * To apply elsewhere, pair a `ByKey` lookup type (see {@link StrandByStrandId})
 * with a generic accessor of the form
 * `fn<const K extends T['key']>(k: K): ByKey[K]`, find with the predicate
 * `(e): e is ByKey[K] => e.key === k`, and throw on miss.
 */
export function strandById<const Id extends Strand['id']>(id: Id): StrandByStrandId[Id] {
  const found = EEF_TOOLKIT_DATA.strands.find(
    (strand): strand is StrandByStrandId[Id] => strand.id === id,
  );
  if (found === undefined) {
    throw new Error(`Unknown EEF strand id: ${id}`);
  }
  return found;
}

/** The corpus `meta.last_updated` literal. */
export const lastUpdated = EEF_TOOLKIT_DATA.meta.last_updated;
