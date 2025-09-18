'use client';

import { createElement, type JSX } from 'react';
import sc from 'styled-components';
import { z } from 'zod';

type AllowedTag = 'em' | 'strong' | 'mark';
const ALLOWED_TAGS: ReadonlySet<string> = new Set(['em', 'strong', 'mark']);

function isAllowedTag(name: string): name is AllowedTag {
  return ALLOWED_TAGS.has(name);
}

function tokenize(html: string): string[] {
  return html.split(/(<\/?[^>]+>)/g).filter(Boolean);
}

function flushUnclosed(
  stack: { type: AllowedTag; children: React.ReactNode[] }[],
  current: () => React.ReactNode[],
): void {
  if (stack.length) {
    const last = stack.pop();
    if (last) {
      current().push(...last.children);
    }
  }
}

function handleToken(
  tok: string,
  stack: { type: AllowedTag; children: React.ReactNode[] }[],
  current: () => React.ReactNode[],
  keyRef: { current: number },
): void {
  const m = tok.match(/^<\/?\s*([a-zA-Z0-9]+)[^>]*>$/);
  if (!m) {
    current().push(tok);
    return;
  }
  const name = m[1].toLowerCase();
  const closing = tok.startsWith('</');
  if (!isAllowedTag(name)) {
    return;
  }
  if (!closing) {
    stack.push({ type: name, children: [] });
  } else {
    const last = stack.pop();
    if (last && last.type === name) {
      current().push(createElement(name, { key: `hl-${keyRef.current++}` }, ...last.children));
    }
  }
}

function renderSafeHighlight(html: string): React.ReactNode[] {
  const tokens = tokenize(html);
  const stack: { type: AllowedTag; children: React.ReactNode[] }[] = [];
  const root: React.ReactNode[] = [];
  const keyRef = { current: 0 };

  const current = (): React.ReactNode[] => (stack.length ? stack[stack.length - 1].children : root);

  for (const tok of tokens) {
    handleToken(tok, stack, current, keyRef);
  }
  flushUnclosed(stack, current);
  return root;
}

const ResultsSection = sc.section`
  margin-top: ${(p) => p.theme.app.space.xl};
`;

const ResultsList = sc.ul`
  list-style: none;
  padding: 0;
  display: grid;
  gap: ${(p) => p.theme.app.space.sm};
`;

const ResultItemLi = sc.li`
  border: 1px solid ${(p) => p.theme.app.colors.borderSubtle};
  padding: ${(p) => p.theme.app.space.sm};
  border-radius: ${(p) => p.theme.app.radii.sm};
`;

const Title = sc.div`
  font-weight: 600;
`;

const Meta = sc.div`
  color: ${(p) => p.theme.app.colors.textMuted};
  font-size: ${(p) => p.theme.app.fontSizes.xs};
`;

const HighlightsList = sc.ul`
  margin-top: ${(p) => p.theme.app.space.sm};
`;

const HighlightItem = sc.li`
  font-size: ${(p) => p.theme.app.fontSizes.xs};
`;

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
  if (subject) {
    parts.push(`Subject: ${subject}`);
  }
  if (keyStage) {
    parts.push(`Key stage: ${keyStage}`);
  }
  const meta = parts.join(' · ');

  return (
    <ResultItemLi>
      <Title>{title}</Title>
      {meta ? <Meta>{meta}</Meta> : null}
      {highlights.length > 0 ? (
        <HighlightsList>
          {highlights.map((h, i) => (
            <HighlightItem key={i}>{renderSafeHighlight(String(h))}</HighlightItem>
          ))}
        </HighlightsList>
      ) : null}
    </ResultItemLi>
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
  if (!parsed.success || parsed.data.length === 0) {
    return null;
  }

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
    <ResultsSection aria-live="polite">
      <ResultsList>
        {parsed.data.map((rec) => (
          <ResultItem
            key={rec.id}
            title={titleFor(rec)}
            subject={subjectFor(rec)}
            keyStage={keyStageFor(rec)}
            highlights={highlightsFor(rec)}
          />
        ))}
      </ResultsList>
    </ResultsSection>
  );
}

export default SearchResults;
