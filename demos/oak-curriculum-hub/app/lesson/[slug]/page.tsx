import type { ReactElement } from 'react';
import Link from 'next/link';
import { getLesson, type LessonContent } from '@/lib/curriculum';
import {
  ContextStrip,
  KeyLearningPoints,
  Keywords,
  type LessonKeyword,
} from '@/components/LessonSections';

export const dynamic = 'force-dynamic';

type Summary = LessonContent['summary'];
type Quiz = LessonContent['quiz'];
type Assets = LessonContent['assets'];

interface LessonView {
  title: string;
  hasContent: boolean;
  subject: string | null;
  keyStage: string | null;
  unit: string | null;
  outcome: string | null;
  keyLearningPoints: readonly string[];
  keywords: readonly LessonKeyword[];
  quiz: { starter: number; exit: number } | null;
  assets: readonly { type: string; label: string }[];
  oakUrl: string | undefined;
}

function resolveTitle(summary: Summary, slug: string): string {
  return summary?.lessonTitle ?? summary?.title ?? slug.replaceAll('-', ' ');
}

function resolveOutcome(summary: Summary): string | null {
  return summary?.pupilLessonOutcome ?? null;
}

// The pedagogy fields (C4 seam) are optional at the top level and typed-not-runtime-validated,
// so each is guarded for absence; `.at(0)` yields `T | undefined` so the unit chain stays honest.
function resolveUnit(summary: Summary): string | null {
  return summary?.units?.at(0)?.unitTitle ?? null;
}

function resolveKeyLearningPoints(summary: Summary): readonly string[] {
  return (summary?.keyLearningPoints ?? [])
    .map((k) => k.keyLearningPoint)
    .filter((point) => point.trim() !== '');
}

function resolveKeywords(summary: Summary): readonly LessonKeyword[] {
  return (summary?.lessonKeywords ?? []).filter((k) => k.keyword.trim() !== '');
}

// URL trust boundary (mirrors lib/search-core.ts): only http(s) URLs from the
// content plane reach an anchor.
const isHttpUrl = (url: string | null | undefined): url is string =>
  typeof url === 'string' && /^https?:\/\//i.test(url);

// Oak gates downloads behind signed URLs, so the demo links out to the lesson
// on thenational.academy rather than proxying files. The first candidate that
// passes the trust boundary wins; if none does, there is no link at all.
function resolveOakUrl(summary: Summary, assets: Assets): string | undefined {
  return [assets?.oakUrl, summary?.oakUrl, summary?.canonicalUrl].find(isHttpUrl);
}

function resolveQuiz(quiz: Quiz): { starter: number; exit: number } | null {
  if (!quiz) {
    return null;
  }
  return { starter: quiz.starterQuiz?.length ?? 0, exit: quiz.exitQuiz?.length ?? 0 };
}

function resolveAssets(assets: Assets): readonly { type: string; label: string }[] {
  return assets?.assets ?? [];
}

function resolveSubject(summary: Summary): string | null {
  return summary?.subjectTitle ?? null;
}

function resolveKeyStage(summary: Summary): string | null {
  return summary?.keyStageTitle ?? null;
}

// Split the lesson content into its three parts once, so buildLessonView stays a thin
// assembler over the resolvers (keeps its cyclomatic complexity within the strict ceiling).
function splitLesson(lesson: LessonContent | null): {
  summary: Summary;
  quiz: Quiz;
  assets: Assets;
} {
  return {
    summary: lesson?.summary ?? null,
    quiz: lesson?.quiz ?? null,
    assets: lesson?.assets ?? null,
  };
}

function buildLessonView(data: LessonContent | null, slug: string): LessonView {
  const { summary, quiz, assets } = splitLesson(data);
  return {
    title: resolveTitle(summary, slug),
    hasContent: summary !== null,
    subject: resolveSubject(summary),
    keyStage: resolveKeyStage(summary),
    unit: resolveUnit(summary),
    outcome: resolveOutcome(summary),
    keyLearningPoints: resolveKeyLearningPoints(summary),
    keywords: resolveKeywords(summary),
    quiz: resolveQuiz(quiz),
    assets: resolveAssets(assets),
    oakUrl: resolveOakUrl(summary, assets),
  };
}

export default async function LessonPage({
  params,
}: {
  readonly params: Promise<{ slug: string }>;
}): Promise<ReactElement> {
  const { slug } = await params;
  // Server Component: read the data layer directly. Both react.dev and Next.js 16
  // direct a Server Component to call its data function (credentials stay server-side),
  // not to HTTP-fetch its own Route Handler — which adds a needless hop and breaks off
  // localhost. A failed Result degrades to the "content unavailable" state.
  const result = await getLesson(slug);
  const view = buildLessonView(result.ok ? result.value : null, slug);

  return (
    // No landmark of its own — the app layout owns <main> (the CourseShell nested-main class).
    <div className="mx-auto max-w-[760px] px-6 pt-10 pb-20">
      <Link href="/" className="text-[13px] font-bold text-link hover:text-link-hover">
        ← Back to search
      </Link>

      <ContextStrip subject={view.subject} keyStage={view.keyStage} unit={view.unit} />

      <h1 className="mt-2.5 mb-2.5 text-[30px] font-semibold leading-tight">{view.title}</h1>

      {!view.hasContent && (
        <p className="text-[15px] font-light leading-relaxed text-ink-subdued">
          This lesson&rsquo;s content is unavailable.
        </p>
      )}

      {view.outcome && (
        <p className="mb-6 text-[17px] font-light leading-relaxed text-ink">{view.outcome}</p>
      )}

      {view.keyLearningPoints.length > 0 && <KeyLearningPoints points={view.keyLearningPoints} />}

      {view.keywords.length > 0 && <Keywords items={view.keywords} />}

      {view.quiz && <QuizStats starter={view.quiz.starter} exit={view.quiz.exit} />}

      {view.assets.length > 0 && <LessonResources items={view.assets} oakUrl={view.oakUrl} />}
    </div>
  );
}

function QuizStats({
  starter,
  exit,
}: {
  readonly starter: number;
  readonly exit: number;
}): ReactElement {
  return (
    <div className="mb-6 flex gap-3">
      <Stat n={starter} label="Starter quiz questions" />
      <Stat n={exit} label="Exit quiz questions" />
    </div>
  );
}

function LessonResources({
  items,
  oakUrl,
}: {
  readonly items: readonly { type: string; label: string }[];
  readonly oakUrl: string | undefined;
}): ReactElement {
  return (
    <section>
      <div className="mb-2.5 text-xs font-bold uppercase tracking-[0.05em] text-ink-subdued">
        Resources for this lesson
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {items.map((a) => (
          <span
            key={a.type}
            className="inline-flex items-center rounded-full border-2 border-line-soft px-3 py-[7px] text-[13px] font-semibold text-ink-subdued"
          >
            {a.label}
          </span>
        ))}
      </div>
      {oakUrl && (
        <a
          href={oakUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full border-2 border-line bg-surface px-[18px] py-[11px] text-sm font-bold text-ink no-underline shadow-accent-brand transition-[box-shadow,transform] duration-150 hover:shadow-accent-wide-brand active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          Download these on thenational.academy ↗
        </a>
      )}
    </section>
  );
}

function Stat({ n, label }: { readonly n: number; readonly label: string }): ReactElement {
  return (
    <div className="shadow-accent-brand min-w-[120px] rounded-xl border-2 border-line bg-surface px-[18px] py-3">
      <div className="text-[28px] font-bold leading-none">{n}</div>
      <div className="mt-1 text-xs font-light leading-snug text-ink-subdued">{label}</div>
    </div>
  );
}
