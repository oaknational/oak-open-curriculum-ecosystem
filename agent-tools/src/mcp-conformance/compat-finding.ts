/**
 * What one compat FINDING is — the vendor's `CompatFinding` discriminated
 * union at the pinned SDK, and the enums it is built from. Its own module
 * because a finding is a contract in its own right (the CLI passes the
 * engine's findings to stdout unprojected), and because the report shape in
 * `compat-types.ts` reads better when it consumes "a finding" than when it
 * defines one mid-file.
 */
import { z } from 'zod';

/**
 * Where a host-profile fact came from, weakest to strongest as the vendor
 * ranks them (PROVENANCE_RANK in the engine): `assumed` (a default), `probe`
 * (the host's own capability handshake), `vendor-doc` (published
 * documentation), `observed` (a live run).
 *
 * Kept on the parsed surface because it grades how far a verdict can be
 * trusted — the vendor surfaces it so "a verdict never reads as more
 * authoritative than its weakest source", and the wrapper's summary carries
 * it through to the reader for the same reason.
 */
export const compatProvenanceSchema = z.enum(['observed', 'vendor-doc', 'probe', 'assumed']);

/**
 * Which axis a finding belongs to: `apps` (widget rendering AND widget
 * capability use — the engine files `capability_unsupported` here too) or
 * `server` (protocol-level facts, e.g. protocol version).
 */
const compatLaneSchema = z.enum(['apps', 'server']);

/**
 * What every finding carries, whatever its code. `title`, `detail` and
 * `remediation` are the vendor's own words: parsed so the document
 * round-trips, never compared — the vendor documents them as "default copy,
 * not the contract", and pinning prose would turn a copy edit into a red
 * gate. `provenance` is REQUIRED: the vendor's `CompatFindingBase` types it
 * so, and it grades how far this finding's host fact can be trusted.
 */
const compatFindingBase = {
  lane: compatLaneSchema,
  severity: z.enum(['blocker', 'degraded', 'info']),
  title: z.string(),
  detail: z.string(),
  remediation: z.string().optional(),
  provenance: compatProvenanceSchema,
};

/**
 * The widget capabilities a host can fail to support — the vendor's closed
 * `WidgetCapabilityNeed` vocabulary at the pinned SDK. Pinned as an enum like
 * the finding code: a capability this list does not name means the vendor's
 * model of what a widget can ask for has moved, and that should stop the run
 * for a read rather than flow through as a string nobody adjudicated.
 */
const compatCapabilitySchema = z.enum([
  'serverTools',
  'serverResources',
  'openLinks',
  'downloadFile',
  'updateModelContext',
  'message',
  'logging',
  'sandboxPermissions',
  'cspFrameDomains',
]);

/**
 * One finding, discriminated on the vendor's stable machine key `code`. Each
 * variant requires the evidence its code is about: the three widget-lane
 * codes name the `tools` affected, and `capability_unsupported` names WHICH
 * capability. A flat shape with those fields optional was the previous
 * boundary, and it accepted a `capability_unsupported` finding that named no
 * capability and no tools as a successful capture (review, 2026-09-15).
 *
 * THIS IS THE VENDOR'S PUBLISHED TYPE, AND IT IS THE STOPPING POINT. The CLI
 * passes the engine's `CompatFinding[]` to stdout unprojected, so the SDK's
 * discriminated union (`@mcpjam/sdk@2.4.0` `dist/types-*.d.ts`) IS the
 * stdout contract, and this schema now matches it field for field. Findings
 * that would make it stricter than the vendor's own type — a required
 * `remediation`, a bounded `tools` length, prose validation — are accepted
 * residuals, not defects: the boundary refuses what the vendor's type
 * refuses, and no more.
 *
 * A novel `code` fails the union, deliberately: a new finding class changes
 * what the verdict MEANS, so it must stop the run for adjudication rather
 * than flow through as an unrecognised string (contrast the failure
 * envelope's free-string `code`, where pinning would destroy a diagnostic).
 */
export const compatFindingSchema = z.discriminatedUnion('code', [
  z
    .object({
      ...compatFindingBase,
      code: z.literal('app_only_unrenderable'),
      tools: z.array(z.string().min(1)),
    })
    .strict(),
  z
    .object({
      ...compatFindingBase,
      code: z.literal('widget_text_fallback'),
      tools: z.array(z.string().min(1)),
    })
    .strict(),
  z
    .object({
      ...compatFindingBase,
      code: z.literal('capability_unsupported'),
      capability: compatCapabilitySchema,
      tools: z.array(z.string().min(1)),
    })
    .strict(),
  z.object({ ...compatFindingBase, code: z.literal('protocol_version_mismatch') }).strict(),
]);
