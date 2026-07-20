import Link from 'next/link';
import type { ReactElement, ReactNode } from 'react';

// The hub-section destination cards. The first five are matched to the FRESH canonical Claude
// Design export (Oak Hub.dc.html): real copy, badges, per-card tints, and the verbatim inline
// Lucide-style glyph paths + container spec extracted from the export source (card bg / icon-tile
// bg / border / radius / shadow are the canonical values, so those five reproduce the canonical
// render). The sixth — the live "Oak curriculum" search card — is a deliberate divergence from the
// canonical's five (owner-confirmed) to foreground the live-SDK curriculum search USP; its copy and
// glyph are reused from the old prototype's own curriculum card, on a distinct cream/amber tint.
interface Destination {
  readonly title: string;
  readonly desc: string;
  readonly cta: string;
  readonly href: string;
  readonly badge: string;
  /** Card background tint: a Tailwind utility backed by an Oak decorative-subtle
   *  role (exact-value match to the canonical export hex — see fidelity register
   *  entry global/cards-token-roles-slice4). */
  readonly cardTint: string;
  /** Icon-tile background (Oak decorative token; matches the canonical iconBg hex). */
  readonly tileTint: string;
  /** Inner SVG paths of the canonical card glyph (24×24 viewBox). */
  readonly icon: ReactNode;
}

const destinations: readonly Destination[] = [
  {
    title: 'eLearning training courses',
    desc: 'Self-paced professional courses on how we create lessons — starting with Creating lessons at Oak.',
    cta: 'Start learning',
    href: '/course',
    badge: '1 live',
    cardTint: 'bg-decorative-1-subtle',
    tileTint: 'bg-decorative-1',
    icon: (
      <>
        <path d="M22 10L12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5" />
      </>
    ),
  },
  {
    title: 'Quality standards',
    desc: 'The benchmarks every piece of content is held to — each with clear exemplification of what good looks like.',
    cta: 'Browse standards',
    href: '/standards',
    badge: '685',
    cardTint: 'bg-decorative-3-subtle',
    tileTint: 'bg-decorative-3',
    icon: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
  },
  {
    title: 'Rubrics',
    desc: 'Structured grids for reviewing and grading work consistently against agreed criteria.',
    cta: 'Open rubrics',
    href: '/rubrics',
    badge: 'Hub',
    cardTint: 'bg-decorative-2-subtle',
    tileTint: 'bg-decorative-2',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18" />
      </>
    ),
  },
  {
    title: 'Exemplars',
    desc: 'Worked examples of high-quality content, annotated to show exactly why they work.',
    cta: 'See exemplars',
    href: '/exemplars',
    badge: 'Hub',
    cardTint: 'bg-decorative-4-subtle',
    tileTint: 'bg-decorative-4',
    icon: <path d="M12 2l2.4 5 5.6.8-4 3.9 1 5.5L12 19.6 6 17.2l1-5.5-4-3.9L8.6 7z" />,
  },
  {
    title: 'Wiki',
    desc: 'Shared knowledge, how-tos and definitions — the living reference for how we work at Oak.',
    cta: 'Open the wiki',
    href: '/wiki',
    badge: 'Hub',
    cardTint: 'bg-decorative-5-subtle',
    tileTint: 'bg-decorative-5',
    icon: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>
    ),
  },
  {
    title: 'Oak curriculum',
    desc: "Search live lessons, units and learning threads from Oak's published national curriculum — matched by meaning, not just keywords.",
    cta: 'Explore curriculum search',
    href: '/curriculum',
    badge: 'Live',
    cardTint: 'bg-surface',
    tileTint: 'bg-decorative-6',
    // Reused verbatim from the old prototype's own "Oak curriculum" card glyph — a stacked-layers
    // mark reading as curriculum/content. Deliberate divergence from the canonical's five cards.
    icon: (
      <>
        <path d="M12 3L2 8l10 5 10-5-10-5z" />
        <path d="M2 13l10 5 10-5" />
        <path d="M2 18l10 5 10-5" />
      </>
    ),
  },
];

// Canonical card container: 3px black border, 18px radius, 4px black offset shadow, 240px min
// height, hover lift — verbatim from the export source.
const cardClass =
  'relative flex min-h-[240px] flex-col gap-3 rounded-[18px] border-[3px] border-line px-6 pb-[26px] pt-6 text-ink no-underline shadow-[4px_4px_0_#222222] transition-transform duration-150 hover:-translate-y-1';

function CardBody({ d }: { readonly d: Destination }): ReactElement {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-[54px] w-[54px] items-center justify-center rounded-[14px] border-2 border-line ${d.tileTint}`}
          aria-hidden
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-ink"
          >
            {d.icon}
          </svg>
        </span>
        <span className="rounded-full border-2 border-line bg-surface px-2.5 py-0.5 text-[11px] font-bold">
          {d.badge}
        </span>
      </div>
      <h3 className="text-lg font-semibold leading-tight">{d.title}</h3>
      <p className="flex-1 text-[15px] leading-relaxed text-ink-subdued">{d.desc}</p>
      <span className="text-[14px] font-bold text-link">
        {d.cta} <span aria-hidden>→</span>
      </span>
    </>
  );
}

function DestinationCard({ d }: { readonly d: Destination }): ReactElement {
  return (
    <Link href={d.href} className={`${cardClass} ${d.cardTint}`}>
      <CardBody d={d} />
    </Link>
  );
}

/** Landing "Explore the hub" grid: the six hub-section destination cards, 3-up on wide screens. */
export default function Destinations(): ReactElement {
  return (
    <section aria-labelledby="destinations-heading" className="mx-auto max-w-[1080px] px-6 py-10">
      <h2 id="destinations-heading" className="mb-5 text-[22px] font-semibold leading-tight">
        Explore the hub
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d) => (
          <DestinationCard key={d.title} d={d} />
        ))}
      </div>
    </section>
  );
}
