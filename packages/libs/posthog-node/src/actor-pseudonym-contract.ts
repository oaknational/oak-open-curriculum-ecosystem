/**
 * Public contracts for closed PostHog actor-pseudonym capabilities.
 *
 * @packageDocumentation
 */

import type { ReleaseEnvironment } from '@oaknational/build-metadata';
import type { Result } from '@oaknational/result';

/**
 * Release scope included in every PostHog actor projection.
 *
 * @remarks
 * Production callers use the canonical release environment. The `test` value
 * exists only for isolated contract verification and cannot be produced by
 * the live release resolver.
 */
export type PostHogPseudonymEnvironment = ReleaseEnvironment | 'test';

/**
 * One retained key version used to derive destination-scoped actor identities.
 *
 * @remarks
 * The factory accepts a 32-byte key, copies it during validation, and never
 * places the key material in a projection or failure value. `id` is a
 * non-secret rotation label and forms part of the resulting distinct ID.
 */
export interface PostHogPseudonymKey {
  /** Stable, non-secret identifier for this key version. */
  readonly id: string;
  /** Exactly 32 bytes of key material supplied by the composition root. */
  readonly key: Uint8Array;
}

/**
 * Ambient-free inputs for constructing actor-pseudonym capabilities.
 *
 * @remarks
 * The active key selects new event identity. Every retained key participates
 * in deletion projection so records written before rotation remain
 * addressable.
 */
export interface PostHogPseudonymConfig {
  /** Environment that scopes projections away from other deployments. */
  readonly environment: PostHogPseudonymEnvironment;
  /** Identifier of the key used for new event projections. */
  readonly activeKeyId: string;
  /** Retained, uniquely identified key versions, including the active key. */
  readonly keyring: readonly PostHogPseudonymKey[];
}

/**
 * A PostHog-scoped identity derived from one verified authentication principal.
 *
 * @remarks
 * `distinctId` is pseudonymous personal data. It identifies neither the raw
 * principal nor an authentication, protocol, or conversation session.
 */
export interface PostHogActorPseudonym {
  /** Environment used when deriving this projection. */
  readonly environment: PostHogPseudonymEnvironment;
  /** Non-secret rotation label of the key used for this projection. */
  readonly keyId: string;
  /** Destination-scoped value safe for the closed PostHog event contract. */
  readonly distinctId: string;
}

/**
 * Content-free failure returned when pseudonym configuration is invalid.
 */
export interface PostHogPseudonymConfigurationError {
  readonly kind: 'invalid_posthog_pseudonym_configuration';
}

/**
 * Content-free failure returned when a verified principal cannot be projected.
 */
export interface PostHogIdentityProjectionError {
  readonly kind: 'posthog_identity_projection_failed';
}

/**
 * Projects new events through the currently active key version.
 */
export interface ActivePostHogActorProjector {
  /**
   * Derives the destination-scoped identity for one verified actor.
   *
   * @param principal - Verified authentication principal. The implementation
   * uses it only during synchronous derivation and does not return or retain it.
   * @returns `Ok` with the active projection, or the fixed content-free
   * identity error when the principal or cryptographic operation is invalid.
   */
  project(principal: string): Result<PostHogActorPseudonym, PostHogIdentityProjectionError>;
}

/**
 * Derives every retained key-version identity needed for actor deletion.
 */
export interface PostHogDeletionProjector {
  /**
   * Derives deterministic projections in key-ID code-unit order.
   *
   * @param principal - Verified authentication principal. The implementation
   * uses it only during synchronous derivation and does not return or retain it.
   * @returns `Ok` with one projection per retained key, or the fixed
   * content-free identity error if any projection cannot be derived.
   */
  project(
    principal: string,
  ): Result<readonly PostHogActorPseudonym[], PostHogIdentityProjectionError>;
}

/**
 * Closed identity surface shared by event capture and deletion workflows.
 *
 * @remarks
 * Runtime capture receives only `active`; deletion tooling receives
 * `deletion`. Neither capability exposes key material or a generic
 * destination-independent identifier.
 */
export interface PostHogPseudonymCapabilities {
  /** Projector used for newly captured events. */
  readonly active: ActivePostHogActorProjector;
  /** Projector used to address events written by every retained key version. */
  readonly deletion: PostHogDeletionProjector;
}
