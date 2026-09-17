/**
 * DTCG token paths as the CSS custom properties that declare them.
 *
 * THE FLATTENING IS A CONTRACT, NOT A CONVENIENCE. `dtcg/README.md` states
 * it: "a token at `text.primary` flattens to `--text-primary` (path segments
 * joined with `-`). This round-trips our CSS names exactly." A name that
 * misses its property is not a cosmetic error on a page like this one — it
 * is a swatch bound to nothing, painting nothing, reading back empty. So the
 * two exceptions live here, named, rather than being discovered at a blank
 * swatch:
 *
 * 1. The palette. Paths are `oak.color.<name>`; the CSS declares
 *    `--oak-<name>`. The same README records this as the "Prefix delta" —
 *    the paths were shaped for another consumer's palette inliner, not for
 *    this kit's own CSS.
 * 2. The font families. Paths are `font.family.<name>`; the CSS declares
 *    `--font-<name>`. This one the README does NOT record. It was found by
 *    checking every flattened name against the kit's own declarations: three
 *    had no property to bind to. The "round-trips exactly" claim holds for
 *    411 of the 414 names.
 *
 * Note that the second exception is narrower than it looks: `font.size.7`
 * keeps its middle segment (`--font-size-7`). Only the family sub-tree drops
 * one, which is why this is a pair of specific rules rather than a general
 * "drop the second segment" one.
 */

/** Icon URL properties: the `--i-*` asset paths and the `--ic-*` roles over
 *  them. Excluded from the catalogue for the reason the kit's export already
 *  excludes them — they are environment-relative `url()`s, not design
 *  decisions (`dtcg/README.md`). Applied here as well so the page's stated
 *  contract stays true if the export ever starts emitting them. */
const ICON_URL_PROPERTY = /^--ic?-/;

const DTCG_REFERENCE = /\{([^{}]+)\}/g;
const SOLE_REFERENCE = /^\{([^{}]+)\}$/;

/** A DTCG dot path as the CSS custom property that declares it. */
export function flattenTokenPath(path: string): string {
  const segments = path.split('.');
  if (segments[0] === 'oak' && segments[1] === 'color') {
    return `--oak-${segments.slice(2).join('-')}`;
  }
  if (segments[0] === 'font' && segments[1] === 'family') {
    return `--font-${segments.slice(2).join('-')}`;
  }
  return `--${segments.join('-')}`;
}

/** True for the icon-URL shapes the catalogue excludes. */
export function isIconUrlProperty(name: string): boolean {
  return ICON_URL_PROPERTY.test(name);
}

/** A DTCG value with its references rewritten as the `var()` calls the CSS
 *  actually holds — so what the page prints before it can read the browser
 *  is the kit's own declaration, not a JSON dialect of it. */
export function withVarReferences(value: string): string {
  return value.replaceAll(
    DTCG_REFERENCE,
    (_match, path: string) => `var(${flattenTokenPath(path)})`,
  );
}

/** The referenced property when a value is exactly one reference and
 *  nothing else — the case where a token IS its referent, and can therefore
 *  take its type. */
export function soleReference(value: string): string | null {
  const match = SOLE_REFERENCE.exec(value.trim());
  return match === null ? null : flattenTokenPath(match[1]);
}
