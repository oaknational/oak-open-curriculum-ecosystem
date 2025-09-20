/**
 * Types for response augmentation with canonical URLs
 */

export interface ResponseWithCanonicalUrl {
  canonicalUrl?: string;
  [key: string]: unknown;
}

export interface UnitContext {
  subjectSlug?: string;
  phaseSlug?: string;
}

export interface SubjectContext {
  keyStageSlugs?: readonly string[];
}

export interface ResponseContext {
  unit?: UnitContext;
  subject?: SubjectContext;
}

export type ContentType = 'lesson' | 'unit' | 'subject' | 'sequence' | 'thread';
