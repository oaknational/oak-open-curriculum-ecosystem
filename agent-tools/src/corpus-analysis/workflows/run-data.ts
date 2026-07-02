/**
 * Per-run stage data — substituted at run-artefact build time.
 *
 * @remarks
 * Stage entries import {@link RUN_DATA} and {@link RUN_DATA_STAGE} and narrow them with
 * their stage guard. This default module exports the unseeded sentinels: a stage
 * artefact bundled without the run-data substitution fails its guard immediately with a
 * clear error and zero spend. `build-run-artefact` substitutes this module with the
 * stage discriminant and the checkpoint data — zod-validated and stage-projected at
 * build time, so the sandbox receives exactly the data the Node-side contract approved,
 * tagged with exactly the stage it was approved FOR (a wrong-stage seeding is a typed
 * zero-spend failure, not a garbage run). The transport is the artefact itself: nothing
 * rides through operator context, and the harness script size cap is asserted at build.
 *
 * @packageDocumentation
 */

/** Unseeded stage discriminant — every guard rejects it, naming the cure. */
export const RUN_DATA_STAGE = 'unseeded';

/** Unseeded sentinel — every stage guard rejects it by shape. */
export const RUN_DATA: unknown = { unseeded: true };
