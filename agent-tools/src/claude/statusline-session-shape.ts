/**
 * Pure session-shape resolver for the Claude Code statusline.
 *
 * @remarks
 * Answers, from already-gathered values, the glance questions the statusline
 * session-shape indicators render: *am I in a team, what shape is it, is
 * someone directing, and is a rapid (ArcAngel) channel live for me?*
 *
 * Truth sources are deliberately exactly two cheap repo-file reads per tick —
 * the active-claims registry and the experiments-directory listing. The comms
 * corpus is structurally excluded from this path: the statusline ticks
 * constantly and the large-flat-directory scan class has a documented
 * watcher body count. The imperative adapter (`statusline-identity.ts`)
 * gathers the inputs; this module holds no I/O so the semantics are
 * unit-testable over fixture matrices.
 *
 * @packageDocumentation
 */

import { isClaimStale } from '../collaboration-state/claims.js';
import {
  type CollaborationClaim,
  type CollaborationRegistry,
} from '../collaboration-state/types.js';

/**
 * One entry of the experiments-directory listing (ArcAngel rapid channels).
 * `name` is the channel path relative to the experiments directory (so
 * per-pair participant-bearing directory names participate in matching);
 * `mtimeIso` is the file's last-modified instant in ISO 8601 UTC.
 */
export interface ExperimentsEntry {
  readonly name: string;
  readonly mtimeIso: string;
}

/** Inputs for one session-shape resolution; all values explicit, no ambient state. */
export interface SessionShapeInputs {
  /** Own PDR-027 display name (e.g. "Monsoon guards Cirrus"); undefined when identity is unavailable. */
  readonly ownAgentName: string | undefined;
  /** Parsed active-claims registry; undefined when the read or parse failed. */
  readonly registry: CollaborationRegistry | undefined;
  /** Experiments-directory listing; undefined when the directory is absent or unreadable. */
  readonly experimentsListing: readonly ExperimentsEntry[] | undefined;
  /** The resolution instant, ISO 8601 UTC. */
  readonly nowIso: string;
}

/** Resolved coordination shape for one statusline tick. */
export interface SessionShape {
  /**
   * Own session role from the first fresh own claim (by registry array
   * position) that carries one; undefined when no fresh own claim names a
   * role. An agent holding several role-bearing claims mid-transition shows
   * the earliest-registered role until the older claim closes.
   */
  readonly ownRole: string | undefined;
  /**
   * Team shape, read relative to *this* session's membership — a session is
   * "in" a team only when it holds a fresh own claim. `unknown` means the
   * registry could not be read for this tick — the resolver does not claim a
   * confident shape it never saw, so the statusline shows no team icon
   * (distinct from `solo`, a confident peerless reading).
   *
   * For a readable registry the shape is resolved in two stages. First, the
   * membership gate: if this session holds **no** fresh own claim it is not a
   * team member, so the shape is `observing` when any *other* fresh claim
   * exists (the quiet "others are active here, you have not registered" glyph)
   * or `solo` when the registry holds no fresh claim at all. An absent identity
   * cannot be matched to any claim, so it too falls through this non-member
   * gate. Second, for a registered session, in strict priority order:
   * `directed` (any fresh claim whose `role` is exactly the lowercase string
   * `director` — the schema's well-known values are lowercase by convention and
   * matching is case-sensitive) beats `peer` (two or more distinct fresh
   * identities) beats `solo`. A director active among *other* agents while this
   * session holds no claim reads as `observing`, not `directed`: it is not this
   * session's directed team.
   */
  readonly teamShape: 'unknown' | 'solo' | 'peer' | 'directed' | 'observing';
  /** Whether a rapid channel naming this agent was written within the ARC liveness window. */
  readonly arcActive: boolean;
}

/**
 * How recently an experiments channel must have been written to count as a
 * live ArcAngel channel. Claim freshness has its own per-claim TTL; ARC
 * channels have no recorded TTL, so mtime within this window is the proxy.
 * Thirty minutes covers the observed gap between turns in a live rapid
 * channel without keeping the wing up much past a channel quietening; a
 * false wing for a few minutes is harmless for a glance surface. The
 * comparison is inclusive: a write exactly at the window edge still counts.
 */
const ARC_ACTIVE_WINDOW_SECONDS = 1800;

/**
 * Resolve the session's coordination shape from explicit inputs.
 *
 * Stale claims (per the registry's own {@link isClaimStale} predicate) are
 * invisible: a stale director claim does not shape the icon, and a stale own
 * claim carries no role. Missing inputs degrade soft but honestly: an
 * unreadable registry resolves to `unknown` (not a false `solo`), and an
 * unreadable listing reads as no ARC wing — the statusline never fails a tick
 * over an unreadable coordination surface, but it never claims a confident
 * team shape it could not read.
 */
export function resolveSessionShape(inputs: SessionShapeInputs): SessionShape {
  const arcActive = resolveArcActive(inputs.experimentsListing, inputs.ownAgentName, inputs.nowIso);

  if (inputs.registry === undefined) {
    return { ownRole: undefined, teamShape: 'unknown', arcActive };
  }

  const freshClaims = inputs.registry.claims.filter((claim) => !isClaimStale(claim, inputs.nowIso));

  return {
    ownRole: resolveOwnRole(freshClaims, inputs.ownAgentName),
    teamShape: resolveTeamShape(freshClaims, inputs.ownAgentName),
    arcActive,
  };
}

function resolveOwnRole(
  freshClaims: readonly CollaborationClaim[],
  ownAgentName: string | undefined,
): string | undefined {
  if (ownAgentName === undefined) {
    return undefined;
  }
  // Own-claim match is by name alone — kept deliberately in lockstep with the
  // membership gate in resolveTeamShape. If one moves to the composite
  // name|prefix identity key, the other must move with it, or the role demark
  // and the team icon will disagree about whether this session is a member.
  return freshClaims.find(
    (claim) => claim.agent_id.agent_name === ownAgentName && claim.role !== undefined,
  )?.role;
}

function resolveTeamShape(
  freshClaims: readonly CollaborationClaim[],
  ownAgentName: string | undefined,
): SessionShape['teamShape'] {
  // Membership gate: a session is "in" a team only when it holds a fresh own
  // claim (matched by name — kept in lockstep with resolveOwnRole; see the note
  // there before changing either matcher). A non-member — including a session
  // with no resolved identity — reads the registry from the outside:
  // `observing` when any other agent is live, else a confident `solo`. This is
  // what keeps a brand-new, unregistered session from wearing a team icon it
  // has not earned.
  const ownHasFreshClaim =
    ownAgentName !== undefined &&
    freshClaims.some((claim) => claim.agent_id.agent_name === ownAgentName);
  if (!ownHasFreshClaim) {
    return freshClaims.length > 0 ? 'observing' : 'solo';
  }

  if (freshClaims.some((claim) => claim.role === 'director')) {
    return 'directed';
  }
  // Identity is the PDR-027 tuple (name primary, prefix disambiguating):
  // one agent holding several claims contributes one identity. A session
  // restart that changes the prefix briefly reads as two identities (a
  // transient false peer) — accepted for a glance surface; do not "fix"
  // this to name-only keying, which would hide genuine same-name peers.
  const distinctIdentities = new Set(
    freshClaims.map((claim) => `${claim.agent_id.agent_name}|${claim.agent_id.session_id_prefix}`),
  );
  return distinctIdentities.size >= 2 ? 'peer' : 'solo';
}

function resolveArcActive(
  listing: readonly ExperimentsEntry[] | undefined,
  ownAgentName: string | undefined,
  nowIso: string,
): boolean {
  if (listing === undefined || ownAgentName === undefined) {
    return false;
  }
  const ownNeedle = normaliseForFilenameMatch(ownAgentName);
  const nowMs = Date.parse(nowIso);
  return listing.some((entry) => {
    if (!normaliseForFilenameMatch(entry.name).includes(ownNeedle)) {
      return false;
    }
    // Age must fall within [0, window]. A future mtime (clock skew) yields a
    // negative age that would otherwise satisfy `<= window` and raise a false
    // wing; an unparseable mtime yields NaN, which fails both bounds.
    const ageMs = nowMs - Date.parse(entry.mtimeIso);
    return ageMs >= 0 && ageMs <= ARC_ACTIVE_WINDOW_SECONDS * 1000;
  });
}

/**
 * Normalise a display name or channel filename for participant matching:
 * lower-case with every non-alphanumeric run collapsed to a single dash, so
 * "Monsoon guards Cirrus" matches `arc-monsoon-guards-cirrus-and-fern.md`
 * regardless of the separator convention a channel author chose. Substring
 * matching suffices because the per-pair channel convention embeds each
 * participant's PDR-027 display name verbatim in the channel path.
 */
function normaliseForFilenameMatch(value: string): string {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-');
}
