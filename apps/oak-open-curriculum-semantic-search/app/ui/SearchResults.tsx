'use client';

import type { JSX } from 'react';
import { z } from 'zod';

function ResultItem({
  title,
  subject,
  keyStage,
  highlights,
}: {
  title: string;
  subject: string;
  keyStage: string;
  highlights: string[];
}): JSX.Element {
  const parts: string[] = [];
  if (subject) parts.push(`Subject: ${subject}`);
  if (keyStage) parts.push(`Key stage: ${keyStage}`);
  const meta = parts.join(' · ');

  return (
    <li style={{ border: '1px solid #ddd', padding: '0.5rem', borderRadius: 4 }}>
      <div style={{ fontWeight: 600 }}>{title}</div>
      {meta ? <div style={{ color: '#666', fontSize: 12 }}>{meta}</div> : null}
      {highlights.length > 0 ? (
        <ul style={{ marginTop: '0.5rem' }}>
          {highlights.map((h, i) => (
            <li key={i} style={{ fontSize: 12 }} dangerouslySetInnerHTML={{ __html: String(h) }} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

const UnitSchema = z
  .object({
    unit_title: z.string().optional(),
    subject_slug: z.string().optional(),
    key_stage: z.string().optional(),
  })
  .partial();
const LessonSchema = z
  .object({
    lesson_title: z.string().optional(),
    subject_slug: z.string().optional(),
    key_stage: z.string().optional(),
  })
  .partial();
const ItemSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform((v) => String(v)),
    unit: UnitSchema.nullable().optional(),
    lesson: LessonSchema.optional(),
    highlights: z.array(z.string()).optional(),
  })
  .strict();
const ResultsSchema = z.array(ItemSchema);

export function SearchResults({ results }: { results: unknown[] }): JSX.Element | null {
  const parsed = ResultsSchema.safeParse(results);
  if (!parsed.success || parsed.data.length === 0) return null;

  function titleFor(rec: z.infer<typeof ItemSchema>): string {
    return rec.lesson?.lesson_title || rec.unit?.unit_title || rec.id;
  }

  function subjectFor(rec: z.infer<typeof ItemSchema>): string {
    return rec.lesson?.subject_slug || rec.unit?.subject_slug || '';
  }

  function keyStageFor(rec: z.infer<typeof ItemSchema>): string {
    return rec.lesson?.key_stage || rec.unit?.key_stage || '';
  }

  function highlightsFor(rec: z.infer<typeof ItemSchema>): string[] {
    return rec.highlights ?? [];
  }

  return (
    <section aria-live="polite" style={{ marginTop: '1.25rem' }}>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.5rem' }}>
        {parsed.data.map((rec) => {
          return (
            <ResultItem
              key={rec.id}
              title={titleFor(rec)}
              subject={subjectFor(rec)}
              keyStage={keyStageFor(rec)}
              highlights={highlightsFor(rec)}
            />
          );
        })}
      </ul>
    </section>
  );
}

export default SearchResults;
