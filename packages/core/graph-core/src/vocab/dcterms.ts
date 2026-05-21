/**
 * DCMI Metadata Terms (Dublin Core) vocabulary terms.
 *
 * Each entry is a const-typed `NamedNodeTerm` constructed via the
 * `DataFactory.namedNode()` helper.
 *
 * @see https://www.dublincore.org/specifications/dublin-core/dcmi-terms/
 */

import { namedNode } from '../data-factory/index.js';

export const DCTERMS = {
  title: namedNode('http://purl.org/dc/terms/title'),
  description: namedNode('http://purl.org/dc/terms/description'),
  creator: namedNode('http://purl.org/dc/terms/creator'),
  contributor: namedNode('http://purl.org/dc/terms/contributor'),
  publisher: namedNode('http://purl.org/dc/terms/publisher'),
  date: namedNode('http://purl.org/dc/terms/date'),
  created: namedNode('http://purl.org/dc/terms/created'),
  modified: namedNode('http://purl.org/dc/terms/modified'),
  issued: namedNode('http://purl.org/dc/terms/issued'),
  identifier: namedNode('http://purl.org/dc/terms/identifier'),
  subject: namedNode('http://purl.org/dc/terms/subject'),
  type: namedNode('http://purl.org/dc/terms/type'),
  language: namedNode('http://purl.org/dc/terms/language'),
  format: namedNode('http://purl.org/dc/terms/format'),
  rights: namedNode('http://purl.org/dc/terms/rights'),
  license: namedNode('http://purl.org/dc/terms/license'),
  source: namedNode('http://purl.org/dc/terms/source'),
  isPartOf: namedNode('http://purl.org/dc/terms/isPartOf'),
  hasPart: namedNode('http://purl.org/dc/terms/hasPart'),
  references: namedNode('http://purl.org/dc/terms/references'),
} as const;
