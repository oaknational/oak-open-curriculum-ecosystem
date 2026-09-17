/**
 * The facets sidebar: search-this-unit, sort, and the two filter groups.
 *
 * Deliberately NO `<form>` element (a recorded divergence from the export,
 * which used a form neutered by an inline onsubmit): the specimen renders
 * inside the picker's frame, where a stray Enter-submit would re-navigate
 * the frame and break the in-place re-skin's no-reload invariant. The
 * fieldsets, legends and labels carry the semantics without it, and the
 * demo's controls are presentational until filtering is wired.
 */

function LengthFilter(): React.JSX.Element {
  return (
    <fieldset className="oak-stack oak-stack--s facet-group">
      <legend className="oak-body-2">Lesson length</legend>
      <label className="oak-choice">
        <input className="oak-checkbox" type="checkbox" defaultChecked /> 45 minutes
      </label>
      <label className="oak-choice">
        <input className="oak-checkbox" type="checkbox" defaultChecked /> 60 minutes
      </label>
      <label className="oak-choice">
        <input className="oak-checkbox" type="checkbox" /> 90 minutes
      </label>
    </fieldset>
  );
}

function ResourceFilter(): React.JSX.Element {
  return (
    <fieldset className="oak-stack oak-stack--s facet-group">
      <legend className="oak-body-2">Has resources</legend>
      <label className="oak-choice">
        <input className="oak-radio" type="radio" name="res" defaultChecked /> Any
      </label>
      <label className="oak-choice">
        <input className="oak-radio" type="radio" name="res" /> Worksheet
      </label>
      <label className="oak-choice">
        <input className="oak-radio" type="radio" name="res" /> Slide deck
      </label>
    </fieldset>
  );
}

export function FacetsRegion(): React.JSX.Element {
  return (
    <section className="oak-region facets-pad" data-region="facets" aria-label="Filter lessons">
      <div className="oak-stack">
        <div className="oak-stack oak-stack--s">
          <label className="oak-body-2" htmlFor="filter-q">
            Search this unit
          </label>
          <input
            className="oak-input"
            id="filter-q"
            type="search"
            placeholder="e.g. condensation"
          />
        </div>
        <div className="oak-stack oak-stack--s">
          <label className="oak-body-2" htmlFor="sort">
            Sort by
          </label>
          <div className="oak-select-wrap">
            <select className="oak-select" id="sort" defaultValue="Lesson order">
              <option>Lesson order</option>
              <option>Shortest first</option>
              <option>Recently updated</option>
            </select>
          </div>
        </div>
        <LengthFilter />
        <ResourceFilter />
        <button className="oak-btn oak-btn--sm oak-btn--secondary" type="button">
          Clear filters
        </button>
      </div>
    </section>
  );
}
