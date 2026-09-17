/**
 * Which custom properties an identity re-declares — the data behind the
 * page's "changes with this identity" column.
 *
 * The kit's white-label contract is that an identity sheet loads AFTER the
 * base and re-points a subset of the same properties (`brand.css`;
 * `consuming-nextjs.md` §5). So the delta is not a design opinion to be
 * written down and kept in step: it is a fact readable from the sheet, and
 * reading it at build time means an identity that gains or loses a property
 * moves this page in the same change that moves the sheet.
 *
 * Parsed with postcss — a real parser, never a brace scanner. The estate
 * records why in `tools/css-literal-values.ts`: nesting and quoted braces
 * defeat regexes, and these sheets nest theme arms and media queries several
 * deep.
 *
 * Declarations are collected from EVERY scope, not just `:root`. A property
 * re-pointed inside `[data-theme='dark']` or a media arm still changes with
 * the identity — narrowing to `:root` would report a smaller delta than the
 * sheet actually carries.
 */
import { parse } from 'postcss';

/** Every custom property the stylesheet declares, in first-declaration
 *  order and de-duplicated. */
export function declaredCustomProperties(css: string): readonly string[] {
  const names = new Set<string>();
  parse(css).walkDecls((decl) => {
    if (decl.prop.startsWith('--')) {
      names.add(decl.prop);
    }
  });
  return [...names];
}

/**
 * The stylesheets this one pulls in through `@import`, as written. The
 * identity sheets split their contract across parts (`brand.css` imports
 * `brand-a.css`), and applying the identity applies both — so the delta is
 * the union, and the union is discovered from the sheet rather than named
 * in a list here that could fall out of step.
 */
// One linear pass, plain string work on the captured body — the parity
// tool's own importTarget (tools/kit-asset-parity.ts) records why: a
// regex grammar here kept trading one Sonar backtracking/complexity
// finding for another, and the string parse ends the class. Deliberately
// DIVERGENT from that sibling in one behaviour: this one KEEPS remote
// targets, because isRemoteStylesheet below skips them BY RULE (the
// Google Fonts import is the documented common case), where the parity
// tool's local-dependency walk filters them at the parser.
const URL_CALL = /^url\(([^)]*)\)/i;

function importTarget(params: string): string | undefined {
  const urlForm = URL_CALL.exec(params);
  const body = urlForm === null ? params : (urlForm[1] ?? '').trim();
  const quote = body[0];
  if ((quote === '"' || quote === "'") && body.length >= 2) {
    const end = body.indexOf(quote, 1);
    return end > 0 ? body.slice(1, end) : undefined;
  }
  return urlForm === null ? undefined : body;
}

export function importedStylesheets(css: string): readonly string[] {
  const targets: string[] = [];
  parse(css).walkAtRules('import', (rule) => {
    const target = importTarget(rule.params.trim());
    if (target !== undefined && target !== '') {
      targets.push(target);
    }
  });
  return targets;
}

/**
 * True for an import that names somewhere other than this repository: a
 * remote sheet, or a protocol-relative one.
 *
 * BOTH identity sheets open with a Google Fonts import, so this is the
 * common case rather than an edge one. It is skipped BY RULE rather than by
 * catching the read failure it would otherwise cause: a font sheet declares
 * no custom properties, so the delta loses nothing, and a rule says so where
 * a swallowed error would only hide the question.
 */
export function isRemoteStylesheet(target: string): boolean {
  return /^[a-z][a-z\d+.-]*:/i.test(target) || target.startsWith('//');
}
