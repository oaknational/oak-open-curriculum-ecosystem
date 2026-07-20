import Image from 'next/image';
import Link from 'next/link';
import type { ReactElement } from 'react';

import { HubNavLink } from '@/components/HubNavLink';
import type { HubNavItem } from '@/components/HubNavLink';
import { HubSearch } from '@/components/HubSearch';
import { MobileHubNav } from '@/components/MobileHubNav';

// Hub top-level sections, mirroring the reference prototype's header nav.
// Every entry resolves to a live app route, except the E1 WWW link-out.
const navItems: readonly HubNavItem[] = [
  { label: 'Training courses', href: '/course' },
  { label: 'Quality standards', href: '/standards' },
  { label: 'Rubrics', href: '/rubrics' },
  { label: 'Exemplars', href: '/exemplars' },
  { label: 'Wiki', href: '/wiki' },
  { label: 'Oak website', href: 'https://www.thenational.academy' },
];

const navLinkClass =
  'whitespace-nowrap rounded-card px-[13px] py-[9px] text-[15px] font-semibold leading-none text-ink no-underline transition-colors hover:bg-surface-subtle';

/** The inline sections nav — `md:` up only; small viewports use {@link MobileHubNav}. */
function HubNav(): ReactElement {
  return (
    <nav aria-label="Hub sections" className="ml-3.5 hidden items-center gap-0.5 md:flex">
      {navItems.map((item) => (
        <HubNavLink key={item.label} item={item} className={navLinkClass} />
      ))}
    </nav>
  );
}

/**
 * Oak Curriculum Hub top chrome: sticky white header with the Oak logo, the hub
 * section nav, a hub search affordance and the account avatar. Faithful to the
 * reference prototype's rendered header (sticky, 3px black underline, 1240px
 * content width). Below `md:` the nav and search collapse into the
 * {@link MobileHubNav} disclosure so the header reflows cleanly at 320px
 * (WCAG 1.4.10); the export has no small-width header precedent, so the
 * pattern is designed to tokens on the course drawer's design language.
 */
export default function SiteNav(): ReactElement {
  return (
    // sticky is itself a positioned ancestor — the disclosure panel anchors to it directly.
    <header className="sticky top-0 z-50 border-b-[3px] border-line bg-surface">
      <div className="mx-auto flex max-w-[1240px] items-center gap-5 px-4 py-3.5 md:px-7">
        <Link
          href="/"
          aria-label="Oak Curriculum Hub — home"
          className="flex shrink-0 items-center"
        >
          {/* Official Oak logo (full lockup) from the canonical Claude Design export,
              served from public/. */}
          <Image
            src="/oak-logo.svg"
            alt="Oak National Academy"
            width={74}
            height={34}
            className="h-[34px] w-auto [filter:var(--filter-icon)]"
            unoptimized
            priority
          />
        </Link>
        <HubNav />
        <div className="ml-auto flex items-center gap-3.5">
          <div className="hidden w-[230px] md:block">
            <HubSearch />
          </div>
          {/* role=img: aria-label on a generic span is prohibited (axe aria-prohibited-attr);
              the avatar is one named graphic to AT, its initials decorative. */}
          <span
            role="img"
            aria-label="Your account"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-line bg-decorative-1 text-[14px] font-bold leading-none"
          >
            <span aria-hidden="true">CT</span>
          </span>
          <MobileHubNav items={navItems} />
        </div>
      </div>
    </header>
  );
}
