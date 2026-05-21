/**
 * Reverse projection: `PropertyGraph` → `DatasetCore`.
 *
 * Emits one quad per label (`<id> rdf:type <label>`), one quad per node
 * property (`<id> <predicate> <literal>`), and one quad per edge
 * (`<source> <predicate> <target>`). All quads land in the default graph.
 *
 * Together with `toPropertyGraph`, this satisfies the §Test discipline
 * invariant #6 reconstructability contract: for any default-graph
 * dataset `d` whose quads stay inside the projection's declared scope,
 * `fromPropertyGraph(toPropertyGraph(d))` is structurally equivalent to
 * `d`.
 */

import { createDataset, type DatasetCore } from '@oaknational/graph-core/dataset';
import { quad } from '@oaknational/graph-core/data-factory';
import type { Quad } from '@oaknational/graph-core/term';

import type {
  PropertyGraph,
  PropertyGraphEdge,
  PropertyGraphNode,
} from '../property-graph/index.js';

import { rdfType } from './rdf-vocab.js';

function emitLabelQuads(node: PropertyGraphNode): Quad[] {
  return node.labels.map((label) => quad(node.id, rdfType, label));
}

function emitPropertyQuads(node: PropertyGraphNode): Quad[] {
  return node.properties.map((property) => quad(node.id, property.predicate, property.value));
}

function emitEdgeQuad(edge: PropertyGraphEdge): Quad {
  return quad(edge.source, edge.predicate, edge.target);
}

/**
 * Reconstruct a default-graph `DatasetCore` from a `PropertyGraph`.
 *
 * The reverse projection ignores `properties` on edges; those carry
 * RDF 1.2 statement-annotation data that the WS3.2 forward projection
 * does not yet populate.
 */
export function fromPropertyGraph(propertyGraph: PropertyGraph): DatasetCore {
  const dataset = createDataset();

  for (const node of propertyGraph.nodes) {
    for (const labelQuad of emitLabelQuads(node)) {
      dataset.add(labelQuad);
    }
    for (const propertyQuad of emitPropertyQuads(node)) {
      dataset.add(propertyQuad);
    }
  }

  for (const edge of propertyGraph.edges) {
    dataset.add(emitEdgeQuad(edge));
  }

  return dataset;
}
