import type { ReactElement } from 'react';

import { sectionId } from './craft-areas';
import type { CraftAreaGroup } from './token-groups';

/**
 * The jump list, craft area first.
 *
 * A designer navigates on what they are trying to do — pick a colour, set
 * type — and only then on which family holds it, so the areas are the
 * headings and the prefix families sit under them. Four hundred rows are
 * only usable if the way in matches the way a reader already thinks.
 *
 * The area labels here are deliberately NOT headings: the sections below own
 * those, and a second set would put every area title in the document outline
 * twice. Each list is named by its label instead.
 */
export function FamilyNav({
  groups,
}: {
  readonly groups: readonly CraftAreaGroup[];
}): ReactElement {
  return (
    <nav aria-label="Token families by craft area" className="tok-nav">
      {groups.map((group) => {
        const labelId = `tokens-nav-${group.area}`;
        return (
          <div key={group.area} className="tok-nav-group">
            <p className="oak-body-3-bold tok-nav-label" id={labelId}>
              {group.title}
            </p>
            <ul className="oak-cluster oak-cluster--s tok-nav-list" aria-labelledby={labelId}>
              {group.families.map(({ family }) => (
                <li key={family}>
                  <a className="oak-link oak-code-3" href={`#${sectionId(group.area, family)}`}>
                    --{family}-*
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
