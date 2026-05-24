/**
 * Property-graph type definitions.
 *
 * The canonical internal model in `@oaknational/graph-core` is an RDF/JS-aligned
 * quad dataset (per ADR-173 §Design Principles #3 and the research document
 * §11). A property graph is a **derived projection** of that dataset —
 * ergonomic for developer-facing APIs that want GQL-style node/edge/label
 * thinking, but never the canonical truth.
 *
 * The shape here adapts the GQL-influenced sketch in
 * `.agent/research/graph-library.research.md` §11 to this repository's strict
 * typing posture:
 *
 * - The research sketch uses `string` ids and `Record<string, unknown>`
 *   property bags. This file uses the typed `NamedNode | BlankNode` terms
 *   and typed `Literal` property values from `@oaknational/graph-core/term`.
 *   Type information that exists upstream (in graph-core's Term hierarchy)
 *   MUST be preserved here per `.agent/rules/unknown-is-type-destruction.md`.
 * - The structure stays close enough to a GQL-shaped property graph that
 *   the `@oaknational/graph-project/projection` round-trip (this cycle's
 *   §Test discipline invariant #6) can hold without information loss for
 *   the projection's declared scope.
 *
 * **Declared projection scope** (load-bearing for round-trip closure):
 *
 * - Default-graph quads only. Named-graph quads have no representation in
 *   a property graph; the projection ignores them.
 * - Triple-as-term objects (RDF 1.2 statement annotation) have no
 *   representation in a property graph. The projection ignores quads whose
 *   object position carries a `TripleTerm`; carrying such facts through the
 *   PG seam is a future-cycle concern tracked under graph-future / Inc.2
 *   (see ADR-173 §Increments row 7).
 * - The `rdf:type` predicate (IRI
 *   `http://www.w3.org/1999/02/22-rdf-syntax-ns#type`) is the conventional
 *   *label* predicate: quads of the shape `<subject> rdf:type <NamedNode>`
 *   populate the subject's `labels` field. All other predicate→object
 *   shapes become either `properties` (Literal object) or `edges`
 *   (NamedNode/BlankNode object).
 *
 * @example
 * ```typescript
 * import { namedNode, literal } from '@oaknational/graph-core/data-factory';
 * import type { PropertyGraphNode } from '@oaknational/graph-project/property-graph';
 *
 * const aliceLabelIri = namedNode('http://example.test/Person');
 * const alice: PropertyGraphNode = {
 *   id: namedNode('http://example.test/alice'),
 *   labels: [aliceLabelIri],
 *   properties: [
 *     {
 *       predicate: namedNode('http://example.test/name'),
 *       value: literal('Alice'),
 *     },
 *   ],
 * };
 * ```
 */

import type { BlankNode, Literal, NamedNode } from '@oaknational/graph-core/term';

/**
 * Identity term admitted at a property-graph node. Mirrors the subject
 * position of an RDF quad: only NamedNode and BlankNode may stand for a
 * node identity.
 */
export type PropertyGraphNodeId = NamedNode | BlankNode;

/**
 * Literal-valued attribute attached to a property-graph node.
 *
 * The predicate IRI carries the attribute's semantic role; the literal
 * carries the value (with language tag, base direction, and datatype as
 * defined by `@oaknational/graph-core/term`). RDF 1.2 statement
 * annotations are not in scope; predicate-with-IRI-object facts are
 * `PropertyGraphEdge` entries, not properties.
 */
export interface PropertyGraphNodeProperty {
  readonly predicate: NamedNode;
  readonly value: Literal;
}

/**
 * Literal-valued attribute attached to a property-graph edge.
 *
 * Edge properties are reserved for future expansion: a property graph
 * over an RDF 1.2 dataset with statement annotations (triple-as-term)
 * carries per-edge metadata that maps cleanly to this shape. The
 * default projection in this workspace (Inc.1a WS3.2) always emits
 * empty `properties` arrays on edges; populating them is deferred to a
 * later cycle when triple-as-term annotation support lands (see
 * ADR-173 §Increments row 7 and research §8).
 */
export interface PropertyGraphEdgeProperty {
  readonly predicate: NamedNode;
  readonly value: Literal;
}

/**
 * A property-graph node: the projection of every quad whose subject is
 * this node's `id`.
 *
 * - `labels` lists every NamedNode `o` such that `<id> rdf:type <o>`
 *   appears in the projected dataset.
 * - `properties` lists every `(p, lit)` such that `<id> p lit` appears
 *   with a Literal object position. Predicate repetition is preserved;
 *   the same predicate may appear with multiple literal values.
 */
export interface PropertyGraphNode {
  readonly id: PropertyGraphNodeId;
  readonly labels: readonly NamedNode[];
  readonly properties: readonly PropertyGraphNodeProperty[];
}

/**
 * A property-graph edge: the projection of a quad whose object is itself
 * a node identity (NamedNode or BlankNode) and whose predicate is not the
 * conventional label predicate (`rdf:type`).
 *
 * `properties` is reserved for RDF 1.2 statement-annotation carry-over
 * and is always empty under the default projection in this cycle.
 */
export interface PropertyGraphEdge {
  readonly source: PropertyGraphNodeId;
  readonly predicate: NamedNode;
  readonly target: PropertyGraphNodeId;
  readonly properties: readonly PropertyGraphEdgeProperty[];
}

/**
 * Property-graph view over a `DatasetCore`.
 *
 * `PropertyGraph` is the derived shape produced by
 * `@oaknational/graph-project/projection`'s `toPropertyGraph(dataset)`.
 * Within the declared projection scope (default-graph quads, no
 * triple-as-term objects), `fromPropertyGraph(toPropertyGraph(d))` is
 * structurally equivalent to `d` — see §Test discipline invariant #6.
 */
export interface PropertyGraph {
  readonly nodes: readonly PropertyGraphNode[];
  readonly edges: readonly PropertyGraphEdge[];
}
