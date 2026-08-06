/**
 * Data contract for the model-behaviour content workspace — the reviewable
 * rendering of the MCP agent-facing content corpus (MCP-103).
 *
 * @remarks
 * The workspace is a *view* over three governed artefacts (the phase-(a)
 * registry, the current-source projection, and the anchor manifest), never a
 * second copy of the content. Everything here describes what a reviewer is
 * shown; nothing here is authored content in its own right.
 *
 * @packageDocumentation
 */

import type {
  ContentAuthority,
  ContentRevision,
} from '../mcp-content-current-source/current-source-model.js';

/**
 * The part of a registration the workspace reads.
 *
 * @remarks
 * Deliberately narrower than the projection's own `RegistrationEvidence`: the
 * workspace needs to know *whether* an item is served and *through what*, not
 * the anchor-surface bookkeeping that proves it. Keeping the read surface
 * narrow is what lets the projection grow fields without touching the renderer.
 */
export interface ProjectionRegistration {
  readonly state: 'live' | 'dormant';
  readonly selector: string;
}

/** The part of a projection item the workspace reads. */
export interface ProjectionItem {
  readonly id: string;
  readonly authority: ContentAuthority;
  readonly workspaceScope: 'in' | 'out-upstream-api';
  readonly source:
    | {
        readonly state: 'available';
        readonly files: readonly string[];
        readonly evidence: { readonly revision: ContentRevision };
      }
    | { readonly state: 'retired'; readonly files: readonly string[] };
  readonly lineage:
    | { readonly disposition: string; readonly baselineFile: string }
    | { readonly disposition: 'added'; readonly addedAfterBaselineCommit: string };
  readonly registrations: readonly ProjectionRegistration[];
  readonly reviewContext?: {
    readonly title: string;
    readonly reviewDomain: string;
    readonly impactTier: 'high-impact' | 'simple-config';
    readonly behaviouralIntent: string;
  };
}

/** A row of the immutable phase-(a) audit registry (`registry.json`). */
export interface BaselineRegistryItem {
  readonly id: string;
  readonly file: string;
  readonly lines: string;
  readonly identifier: string;
  readonly surface_type: string;
  readonly impact_tier: 'high-impact' | 'simple-config';
  readonly review_domain: string;
  readonly extraction_kind: string;
  readonly source_locus: string;
  readonly behavioural_intent: string;
  readonly snippet: string;
  readonly flags: readonly string[];
  readonly workspace_scope: 'in' | 'out-upstream-api';
}

/** The phase-(a) registry as committed. */
export interface BaselineRegistry {
  readonly meta: { readonly upstream_pointers: Readonly<Record<string, string | null>> };
  readonly items: readonly BaselineRegistryItem[];
}

/**
 * Whether the item's words are reachable by an agent today.
 *
 * @remarks
 * `live` and `dormant` are only claimed where the current-source projection
 * recorded an item-level registration binding. `unbound` says exactly that —
 * the item has current source but no item-level channel binding was recorded
 * yet — and is never rendered as "not served"; the projection's own evidence
 * ceiling states that bindings cover the prompt-to-guidance replacements and
 * that later migration slices add the rest.
 */
export type ServedStatus = 'live' | 'dormant' | 'mixed' | 'unbound' | 'retired';

/** Where the excerpt shown to a reviewer came from. */
export type ExcerptProvenance =
  /** Extracted from current source at the item's verified token anchor. */
  | 'current-source'
  /** The 2026-07-09 baseline snippet — current text was not extractable. */
  | 'baseline-snippet'
  /** No text is available (the item is retired, or carries no snippet). */
  | 'none';

/** One reviewable content item, assembled for rendering. */
export interface WorkspaceItem {
  readonly id: string;
  readonly title: string;
  readonly reviewDomain: string;
  readonly impactTier: 'high-impact' | 'simple-config';
  readonly surfaceType: string;
  readonly behaviouralIntent: string;
  readonly authority: ContentAuthority;
  readonly workspaceScope: 'in' | 'out-upstream-api';
  readonly status: ServedStatus;
  /** Registered selectors (tool names / resource URIs) this item's words reach. */
  readonly registrationSelectors: readonly string[];
  /** Repo-relative current source files, empty when retired. */
  readonly sourceFiles: readonly string[];
  /** The baseline file, for a reviewer tracing a relocation. */
  readonly baselineFile: string | null;
  readonly revision: ContentRevision | 'retired';
  readonly excerpt: string;
  readonly excerptProvenance: ExcerptProvenance;
  readonly excerptTruncated: boolean;
  readonly flags: readonly string[];
}

/** A generated page of the workspace. */
export interface WorkspacePage {
  /** Repo-relative output path. */
  readonly path: string;
  readonly content: string;
}

/** Everything the renderer needs, already read from disk. */
export interface WorkspaceInputs {
  readonly registry: BaselineRegistry;
  readonly current: {
    readonly provenance: { readonly baselineCommit: string };
    readonly items: readonly ProjectionItem[];
    readonly registrationRoots: readonly {
      readonly id: string;
      readonly observation: {
        readonly tools: { readonly live: readonly string[]; readonly dormant: readonly string[] };
        readonly resources: {
          readonly live: readonly string[];
          readonly dormant: readonly string[];
        };
      };
    }[];
  };
  /** Current source text keyed by repo-relative path. */
  readonly sourceText: ReadonlyMap<string, string>;
  /** Item anchors keyed by audit id. */
  readonly anchorsById: ReadonlyMap<string, AnchorTargets>;
  /**
   * Reviewed text for post-baseline additions, keyed by item id.
   *
   * @remarks
   * Additions carry their reviewed content inline in the addition definitions
   * rather than in the anchor manifest, and that content is proven present in
   * current source when the projection is built — so it is current wording,
   * not a baseline snapshot.
   */
  readonly additionTextById: ReadonlyMap<string, string>;
}

/** The anchor evidence for one item. */
export interface AnchorTargets {
  readonly revision: ContentRevision;
  readonly targets: readonly {
    readonly file: string;
    readonly anchors: readonly {
      readonly tokenCount: number;
      readonly tokenSha256: string;
      readonly indexToken: string;
      readonly indexOffset: number;
    }[];
  }[];
}
