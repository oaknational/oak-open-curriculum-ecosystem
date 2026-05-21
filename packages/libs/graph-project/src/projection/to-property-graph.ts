/**
 * Forward projection: `DatasetCore` → `PropertyGraph`.
 *
 * Each unique subject in the dataset's default graph becomes a node; each
 * quad whose object is a Literal becomes a node property; each quad
 * whose object is a NamedNode or BlankNode and whose predicate is not
 * `rdf:type` becomes an edge; quads of the shape `<s> rdf:type <iri>`
 * populate the source node's `labels` field.
 *
 * Out-of-scope inputs (per `@oaknational/graph-project/property-graph`):
 *
 * - Quads in named graphs (any graph term that is not `DefaultGraph`)
 *   are ignored.
 * - Quads whose object is a `TripleTerm` (RDF 1.2 statement annotation)
 *   are ignored.
 *
 * Inside the declared scope the projection is reversible via
 * `fromPropertyGraph` — see §Test discipline invariant #6.
 */

import type { DatasetCore } from '@oaknational/graph-core/dataset';
import type {
  BlankNode,
  GraphTerm,
  Literal,
  NamedNode,
  ObjectTerm,
  Quad,
  SubjectTerm,
} from '@oaknational/graph-core/term';

import type {
  PropertyGraph,
  PropertyGraphEdge,
  PropertyGraphNode,
  PropertyGraphNodeId,
  PropertyGraphNodeProperty,
} from '../property-graph/index.js';

import { isRdfTypePredicate } from './rdf-vocab.js';

function isDefaultGraph(graph: GraphTerm): boolean {
  return graph.termType === 'DefaultGraph';
}

function isLiteralObject(object: ObjectTerm): object is Literal {
  return object.termType === 'Literal';
}

function isNodeIdObject(object: ObjectTerm): object is NamedNode | BlankNode {
  return object.termType === 'NamedNode' || object.termType === 'BlankNode';
}

function subjectKey(subject: SubjectTerm): string {
  return `${subject.termType}:${subject.value}`;
}

interface MutableNode {
  readonly id: PropertyGraphNodeId;
  readonly labels: NamedNode[];
  readonly properties: PropertyGraphNodeProperty[];
}

function getOrCreateNode(map: Map<string, MutableNode>, subject: SubjectTerm): MutableNode {
  const key = subjectKey(subject);
  const existing = map.get(key);
  if (existing !== undefined) {
    return existing;
  }
  const created: MutableNode = { id: subject, labels: [], properties: [] };
  map.set(key, created);
  return created;
}

function appendLabel(node: MutableNode, label: NamedNode): void {
  node.labels.push(label);
}

function appendProperty(node: MutableNode, predicate: NamedNode, value: Literal): void {
  node.properties.push({ predicate, value });
}

function isAcceptedQuad(candidate: Quad): boolean {
  return isDefaultGraph(candidate.graph);
}

function projectQuad(
  quad: Quad,
  nodes: Map<string, MutableNode>,
  edges: PropertyGraphEdge[],
): void {
  const source = getOrCreateNode(nodes, quad.subject);

  if (isLiteralObject(quad.object)) {
    appendProperty(source, quad.predicate, quad.object);
    return;
  }

  if (!isNodeIdObject(quad.object)) {
    return;
  }

  if (isRdfTypePredicate(quad.predicate) && quad.object.termType === 'NamedNode') {
    appendLabel(source, quad.object);
    return;
  }

  // Ensure both endpoints exist as nodes even if the target has no other
  // outgoing facts.
  getOrCreateNode(nodes, quad.object);

  edges.push({
    source: quad.subject,
    predicate: quad.predicate,
    target: quad.object,
    properties: [],
  });
}

function freezeNode(node: MutableNode): PropertyGraphNode {
  return {
    id: node.id,
    labels: node.labels,
    properties: node.properties,
  };
}

/**
 * Project an RDF/JS `DatasetCore` to a `PropertyGraph`.
 *
 * Quads in named graphs and quads with `TripleTerm` objects are ignored;
 * see `@oaknational/graph-project/property-graph` for the declared
 * projection scope. Within scope, the projection is reversible by
 * `fromPropertyGraph` per §Test discipline invariant #6.
 */
export function toPropertyGraph(dataset: DatasetCore): PropertyGraph {
  const nodes = new Map<string, MutableNode>();
  const edges: PropertyGraphEdge[] = [];

  for (const candidate of dataset) {
    if (!isAcceptedQuad(candidate)) {
      continue;
    }
    projectQuad(candidate, nodes, edges);
  }

  return {
    nodes: Array.from(nodes.values(), freezeNode),
    edges,
  };
}
