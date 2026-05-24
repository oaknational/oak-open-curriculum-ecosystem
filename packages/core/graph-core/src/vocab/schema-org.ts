/**
 * Schema.org vocabulary terms. Schema.org publishes IRIs over https.
 *
 * Each entry is a const-typed `NamedNodeTerm` constructed via the
 * `DataFactory.namedNode()` helper.
 *
 * @see https://schema.org/
 */

import { namedNode } from '../data-factory/index.js';

export const SCHEMA = {
  Thing: namedNode('https://schema.org/Thing'),
  Person: namedNode('https://schema.org/Person'),
  Organization: namedNode('https://schema.org/Organization'),
  Place: namedNode('https://schema.org/Place'),
  Event: namedNode('https://schema.org/Event'),
  CreativeWork: namedNode('https://schema.org/CreativeWork'),
  Article: namedNode('https://schema.org/Article'),
  Book: namedNode('https://schema.org/Book'),
  Dataset: namedNode('https://schema.org/Dataset'),
  LearningResource: namedNode('https://schema.org/LearningResource'),
  Course: namedNode('https://schema.org/Course'),
  EducationalOrganization: namedNode('https://schema.org/EducationalOrganization'),
  name: namedNode('https://schema.org/name'),
  description: namedNode('https://schema.org/description'),
  identifier: namedNode('https://schema.org/identifier'),
  url: namedNode('https://schema.org/url'),
  inLanguage: namedNode('https://schema.org/inLanguage'),
  dateCreated: namedNode('https://schema.org/dateCreated'),
  dateModified: namedNode('https://schema.org/dateModified'),
  author: namedNode('https://schema.org/author'),
  publisher: namedNode('https://schema.org/publisher'),
  about: namedNode('https://schema.org/about'),
  isPartOf: namedNode('https://schema.org/isPartOf'),
  hasPart: namedNode('https://schema.org/hasPart'),
} as const;
