'use client';

import { useMemo, useState } from 'react';
import { KEY_STAGES, SUBJECTS } from '../../src/adapters/sdk-guards';

interface StructuredBody {
  scope: 'units' | 'lessons';
  text: string;
  subject?: string;
  keyStage?: string;
  minLessons?: number;
  size?: number;
}

interface NaturalBody {
  q: string;
  scope?: 'units' | 'lessons';
  size?: number;
}

function isSearchResponse(v: unknown): v is { results?: unknown[]; error?: unknown } {
  if (typeof v !== 'object' || v === null) return false;
  const maybe = v as Record<string, unknown>;
  if ('results' in maybe && !Array.isArray(maybe.results)) return false;
  return true;
}

function parseUnknownJson(text: string): unknown {
  try {
    // Cast to unknown to avoid unsafe any; JSON.parse returns any in TS lib
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<'structured' | 'nl'>('structured');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<unknown[]>([]);

  const subjects = useMemo(() => SUBJECTS, []);
  const keyStages = useMemo(() => KEY_STAGES, []);

  const [structured, setStructured] = useState<StructuredBody>({
    scope: 'units',
    text: '',
    subject: '',
    keyStage: '',
    minLessons: 0,
    size: 10,
  });

  const [nl, setNl] = useState<NaturalBody>({ q: '', scope: 'units', size: 10 });

  async function runStructuredSearch(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const body: StructuredBody = {
        scope: structured.scope,
        text: structured.text,
        subject: structured.subject ?? undefined,
        keyStage: structured.keyStage ?? undefined,
        minLessons:
          structured.minLessons && structured.minLessons > 0 ? structured.minLessons : undefined,
        size: structured.size && structured.size > 0 ? structured.size : undefined,
      };
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const parsed: unknown = parseUnknownJson(await res.text());
      if (!res.ok) {
        const errMsg =
          isSearchResponse(parsed) && typeof parsed.error === 'string'
            ? parsed.error
            : 'Search failed';
        throw new Error(errMsg);
      }
      const json = isSearchResponse(parsed) ? parsed : {};
      setResults(Array.isArray(json.results) ? json.results : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function runNlSearch(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const body: NaturalBody = {
        q: nl.q,
        scope: nl.scope,
        size: nl.size && nl.size > 0 ? nl.size : undefined,
      };
      const res = await fetch('/api/search/nl', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const parsed: unknown = parseUnknownJson(await res.text());
      if (!res.ok) {
        const errMsg =
          isSearchResponse(parsed) && typeof parsed.error === 'string'
            ? parsed.error
            : 'Search failed';
        throw new Error(errMsg);
      }
      const json = isSearchResponse(parsed) ? parsed : {};
      setResults(Array.isArray(json.results) ? json.results : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Hybrid Search</h1>
      <p style={{ marginTop: 0, color: '#555' }}>
        Structured vs natural language (no LLM if disabled).
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => {
            setActiveTab('structured');
          }}
          aria-pressed={activeTab === 'structured'}
        >
          Structured
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('nl');
          }}
          aria-pressed={activeTab === 'nl'}
        >
          Natural language
        </button>
      </div>

      {activeTab === 'structured' ? (
        <form
          role="search"
          onSubmit={(ev) => {
            void runStructuredSearch(ev);
          }}
          style={{ display: 'grid', gap: '0.5rem' }}
        >
          <label>
            Scope
            <select
              value={structured.scope}
              onChange={(e) => {
                setStructured((s) => ({
                  ...s,
                  scope: e.target.value as 'units' | 'lessons',
                }));
              }}
            >
              <option value="units">Units</option>
              <option value="lessons">Lessons</option>
            </select>
          </label>

          <label>
            Query
            <input
              type="text"
              value={structured.text}
              onChange={(e) => {
                setStructured((s) => ({ ...s, text: e.target.value }));
              }}
              required
            />
          </label>

          <label>
            Subject
            <select
              value={structured.subject}
              onChange={(e) => {
                setStructured((s) => ({ ...s, subject: e.target.value }));
              }}
            >
              <option value="">(any)</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </label>

          <label>
            Key Stage
            <select
              value={structured.keyStage}
              onChange={(e) => {
                setStructured((s) => ({ ...s, keyStage: e.target.value }));
              }}
            >
              <option value="">(any)</option>
              {keyStages.map((ks) => (
                <option key={ks} value={ks}>
                  {ks}
                </option>
              ))}
            </select>
          </label>

          <label>
            Minimum lessons (units only)
            <input
              type="number"
              min={0}
              value={structured.minLessons ?? 0}
              onChange={(e) => {
                setStructured((s) => ({ ...s, minLessons: Number(e.target.value) }));
              }}
            />
          </label>

          <label>
            Size
            <input
              type="number"
              min={1}
              max={100}
              value={structured.size ?? 10}
              onChange={(e) => {
                setStructured((s) => ({ ...s, size: Number(e.target.value) }));
              }}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
      ) : (
        <form
          role="search"
          onSubmit={(ev) => {
            void runNlSearch(ev);
          }}
          style={{ display: 'grid', gap: '0.5rem' }}
        >
          <label>
            Query
            <input
              type="text"
              value={nl.q}
              onChange={(e) => {
                setNl((s) => ({ ...s, q: e.target.value }));
              }}
              required
            />
          </label>

          <label>
            Scope
            <select
              value={nl.scope}
              onChange={(e) => {
                setNl((s) => ({ ...s, scope: e.target.value as 'units' | 'lessons' }));
              }}
            >
              <option value="units">Units</option>
              <option value="lessons">Lessons</option>
            </select>
          </label>

          <label>
            Size
            <input
              type="number"
              min={1}
              max={100}
              value={nl.size ?? 10}
              onChange={(e) => {
                setNl((s) => ({ ...s, size: Number(e.target.value) }));
              }}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
      )}

      {error ? (
        <p role="alert" style={{ color: 'crimson', marginTop: '1rem' }}>
          {error}
        </p>
      ) : null}

      <section aria-live="polite" style={{ marginTop: '1.25rem' }}>
        {results.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.5rem' }}>
            {results.map((r, idx) => {
              const rec = r as {
                id?: string;
                lesson?: {
                  lesson_title?: string;
                  subject_slug?: string;
                  key_stage?: string;
                };
                unit?: {
                  unit_title?: string;
                  subject_slug?: string;
                  key_stage?: string;
                };
                highlights?: unknown;
              };
              const title =
                rec.lesson?.lesson_title ?? rec.unit?.unit_title ?? rec.id ?? '#' + String(idx);
              const subject = rec.lesson?.subject_slug ?? rec.unit?.subject_slug;
              const ks = rec.lesson?.key_stage ?? rec.unit?.key_stage;
              const hi = Array.isArray(rec.highlights) ? (rec.highlights as unknown[]) : [];
              return (
                <li
                  key={rec.id ?? idx}
                  style={{ border: '1px solid #ddd', padding: '0.5rem', borderRadius: 4 }}
                >
                  <div style={{ fontWeight: 600 }}>{title}</div>
                  <div style={{ color: '#666', fontSize: 12 }}>
                    {subject ? `Subject: ${subject}` : ''} {ks ? ` · Key stage: ${ks}` : ''}
                  </div>
                  {hi.length > 0 && (
                    <ul style={{ marginTop: '0.5rem' }}>
                      {hi.map((h, i) => (
                        <li
                          key={i}
                          style={{ fontSize: 12 }}
                          dangerouslySetInnerHTML={{ __html: String(h) }}
                        />
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
