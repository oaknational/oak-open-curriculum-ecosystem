/*
 * AI Doc rendering helpers
 * Pure functions to render TypeDoc JSON shapes to markdown snippets.
 */

import { promises as fs } from 'node:fs';

import type { TDComment, TDReflection, TDSignature, TDSource } from './ai-doc-types';
import { typeToString } from './type-format';

function trimOrEmpty(text?: string): string {
  return typeof text === 'string' ? text.trim() : '';
}

function summaryFromComment(c: TDComment): string {
  if (!Array.isArray(c.summary)) {
    return '';
  }
  const txt = c.summary
    .map((p) => p.text)
    .join('')
    .trim();
  return txt;
}

function exampleBlockFromComment(c: TDComment): string {
  if (!Array.isArray(c.blockTags)) {
    return '';
  }
  const ex = c.blockTags.find((t) => t.tag === '@example');
  if (!ex || !Array.isArray(ex.content) || ex.content.length === 0) {
    return '';
  }
  const exampleText = ex.content
    .map((p) => p.text)
    .join('')
    .trim();
  return exampleText === '' ? '' : 'Example:\n\n```ts\n' + exampleText + '\n```';
}

export function commentToMarkdown(c?: TDComment): string {
  if (!c) {
    return '';
  }
  const parts = [
    trimOrEmpty(c.shortText),
    trimOrEmpty(c.text),
    summaryFromComment(c),
    exampleBlockFromComment(c),
  ].filter((s) => s !== '');
  return parts.join('\n\n');
}

export function signatureToMarkdown(sig: TDSignature): string {
  const params = (sig.parameters ?? []).map((p) => `${p.name}: ${typeToString(p.type)}`).join(', ');
  const ret = typeToString(sig.type);
  const details = '```ts\n' + `function ${sig.name}(${params}): ${ret}` + '\n```';
  const doc = commentToMarkdown(sig.comment);
  return doc ? details + '\n\n' + doc : details;
}

export function groupByKind(reflections: TDReflection[]): Map<string, TDReflection[]> {
  const map = new Map<string, TDReflection[]>();
  const KIND_LABEL: Record<number, string> = {
    4: 'Namespace',
    8: 'Enum',
    32: 'Variable',
    64: 'Function',
    128: 'Class',
    256: 'Interface',
    65536: 'Type literal',
    2097152: 'Type alias',
    4194304: 'Reference',
  };
  const labelFor = (r: TDReflection): string => {
    if (r.kindString && r.kindString.length > 0) return r.kindString;
    if (typeof r.kind === 'number') return KIND_LABEL[r.kind] ?? 'Kind:' + String(r.kind);
    return 'Symbol';
  };
  for (const r of reflections) {
    const k = labelFor(r);
    const g = map.get(k) ?? [];
    g.push(r);
    map.set(k, g);
  }
  return map;
}

function isTypeAlias(r: TDReflection): boolean {
  return r.kindString === 'Type alias' || r.kind === 2097152;
}

function renderSources(sources?: TDSource[]): string {
  if (!Array.isArray(sources) || sources.length === 0) return '';
  const s = sources[0];
  const loc = `${s.fileName}:${String(s.line)}`;
  if (typeof s.url === 'string' && s.url.length > 0) {
    return `Source: [${loc}](${s.url})`;
  }
  return `Source: ${loc}`;
}

export function renderReflection(r: TDReflection): string {
  const title = `### ${r.name}`;
  if (isTypeAlias(r)) {
    const aliased = '```ts\n' + `type ${r.name} = ${typeToString(r.type)}` + '\n```';
    const src = renderSources(r.sources);
    const doc = commentToMarkdown(r.comment);
    return [title, aliased, src, doc].filter((s) => s && s.length > 0).join('\n\n');
  }
  const doc = commentToMarkdown(r.comment);
  const sigs = (r.signatures ?? []).map(signatureToMarkdown).join('\n\n');
  return [title, doc, sigs].filter((s) => s && s.length > 0).join('\n\n');
}

export async function ensureDir(p: string): Promise<void> {
  await fs.mkdir(p, { recursive: true });
}

export function nowIso(): string {
  return new Date().toISOString();
}
