'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { ReactElement } from 'react';

import type { CourseNavTree } from './course-view-model';
import { activeModuleIdOf } from './course-player';
import { useCoursePlayer } from './CoursePlayerContext';
import { NavUnitGroup } from './CourseSidebarNav';

/** The rail head: decorative logo, grey eyebrow, the page `h1`, and the section-progress zero-state. */
function SidebarHeader({
  title,
  sectionTotal,
}: {
  readonly title: string;
  readonly sectionTotal: number;
}): ReactElement {
  return (
    <>
      <div className="px-[22px] pb-4 pt-6">
        <Image src="/oak-logo.svg" alt="" width={90} height={30} className="mb-5 h-[30px] w-auto" />
        <p className="mb-1.5 text-[12px] font-bold uppercase tracking-[0.06em] text-ink-subdued">
          Professional course
        </p>
        <h1 className="text-[21px] font-semibold leading-[27px] tracking-[0.0115rem]">{title}</h1>
      </div>
      <div className="px-[22px] pb-[18px]">
        <div className="mb-[7px] flex items-baseline justify-between">
          <span className="text-[13px] font-bold leading-none">Your progress</span>
          <span className="text-[13px] font-light leading-none text-ink-subdued">
            0 of {sectionTotal} done
          </span>
        </div>
        <div
          className="h-3 overflow-hidden rounded-full border-2 border-line bg-surface"
          aria-hidden="true"
        >
          <div className="h-full w-0 bg-decorative-1" />
        </div>
      </div>
    </>
  );
}

/** The starred intro item: a lemon-shadow box when current, per the export's introNav treatment. */
function IntroItem({
  introId,
  title,
  active,
}: {
  readonly introId: string;
  readonly title: string;
  readonly active: boolean;
}): ReactElement {
  return (
    <a
      href={`#${introId}`}
      aria-current={active ? 'location' : undefined}
      className={`flex items-center gap-[11px] rounded-[10px] border-2 px-3 py-[11px] text-[15px] font-bold leading-[19px] ${
        active
          ? 'border-line bg-surface shadow-accent-brand'
          : 'border-transparent hover:bg-accent-subtle-brand'
      }`}
    >
      <span
        aria-hidden="true"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-line bg-decorative-5 text-[14px] font-bold"
      >
        ★
      </span>
      {title}
    </a>
  );
}

export function CourseSidebar({
  tree,
  title,
}: {
  readonly tree: CourseNavTree;
  readonly title: string;
}): ReactElement {
  const { activeSectionId, entries } = useCoursePlayer();
  const activeModuleId = activeModuleIdOf(activeSectionId, entries) ?? tree.intro.id;
  const sectionTotal = entries.filter((entry) => entry.moduleId !== tree.intro.id).length;
  const [openOverride, setOpenOverride] = useState<{
    anchor: string;
    openId: string | null;
  } | null>(null);
  const openModuleId =
    openOverride !== null && openOverride.anchor === activeModuleId
      ? openOverride.openId
      : activeModuleId;
  const toggleModule = (moduleId: string): void => {
    setOpenOverride({
      anchor: activeModuleId,
      openId: openModuleId === moduleId ? null : moduleId,
    });
  };
  return (
    <div className="shrink-0 border-r-2 border-line bg-surface md:w-[320px]">
      <SidebarHeader title={title} sectionTotal={sectionTotal} />
      <nav aria-label="Course navigation" className="px-3.5 pb-7 pt-1">
        <IntroItem
          introId={tree.intro.id}
          title={tree.intro.title}
          active={activeModuleId === tree.intro.id}
        />
        <div aria-hidden="true" className="mx-1.5 mb-3 mt-2.5 h-0.5 rounded-sm bg-line-soft" />
        <ol>
          {tree.units.map((unit) => (
            <NavUnitGroup
              key={unit.id}
              unit={unit}
              activeModuleId={activeModuleId}
              activeSectionId={activeSectionId}
              openModuleId={openModuleId}
              onToggle={toggleModule}
            />
          ))}
        </ol>
      </nav>
    </div>
  );
}
