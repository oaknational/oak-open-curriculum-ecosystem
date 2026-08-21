/**
 * The token catalogue: the kit's DTCG trees flattened into the rows the
 * reference page renders. Pure and IO-free — the trees arrive already
 * parsed from `token-source.ts` — so it is testable without a filesystem
 * and produces the same catalogue in the page render and in the stylesheet
 * route that paints the specimens.
 *
 * WHY A CATALOGUE AND NOT A LIST OF VALUES. The page never reads a token
 * value into JavaScript to display it. It reads the token's NAME, binds a
 * specimen element to `var(--name)`, and lets the cascade decide what that
 * paints. The `declared` value carried on each row is the AUTHORED value
 * from the tree — the text the page shows until the browser can be asked
 * what the token actually resolves to. Treating it as the answer would
 * defeat the page's whole claim.
 *
 * TYPE INHERITANCE. The export's `$type` is heuristic and only literals
 * carry one, so `--btn-min-h: {size.target}` arrives untyped. A token whose
 * value is exactly one reference IS its referent, so it takes that token's
 * type — which is what earns most component tokens a real specimen instead
 * of a bare string. Values composing several references through `calc()` or
 * `clamp()` stay untyped deliberately; `specimen-kind.ts` records why.
 */
import { dtcgLeaves, type DtcgLeaf } from './dtcg-leaves';
import { specimenKind, type SpecimenKind } from './specimen-kind';
import {
  flattenTokenPath,
  isIconUrlProperty,
  soleReference,
  withVarReferences,
} from './token-names';

/** The system's three tiers (`colors_and_type.css` header, README §Tokens):
 *  primitives hold the literals, roles hold themable meaning, component
 *  tokens hold per-part decisions. */
type TokenTier = 1 | 2 | 3;

export interface DtcgTree {
  /** The export's file name, quoted on the page as the token's source. */
  readonly file: string;
  readonly tier: TokenTier;
  /** A theme name when this tree is a theme face of the semantic roles. */
  readonly theme: string | null;
  readonly data: unknown;
}

export interface CatalogueToken {
  /** The CSS custom property, flattened per the contract in token-names.ts. */
  readonly name: string;
  /** The DTCG dot path, kept so the page can cite its source honestly. */
  readonly path: string;
  readonly tier: TokenTier;
  /** The first path segment — the family the page groups by. */
  readonly family: string;
  readonly kind: SpecimenKind;
  /** The resolved `$type`, inherited through single references. */
  readonly type: string | null;
  /** The authored value with references rewritten as `var()`. */
  readonly declared: string;
  /** Theme faces that declare this token, in tree order. */
  readonly themes: readonly string[];
  /** True when the value moves with the theme — declared by any theme
   *  face, or referencing (to any depth) a token that is. */
  readonly themed: boolean;
  /** True when the value carries a CSS function the export passes through
   *  verbatim (`color-mix`, `calc`, `clamp`, `min`, `minmax`). */
  readonly functional: boolean;
}

export interface Catalogue {
  readonly tokens: readonly CatalogueToken[];
  /** Every leaf across every tree, before de-duplication — the theme faces
   *  re-declare the same roles, so this exceeds the token count. */
  readonly leafCount: number;
  /** Icon-URL leaves the exclusion removed. */
  readonly excludedIconCount: number;
}

const FUNCTIONAL_VALUE = /(?:color-mix|calc|clamp|minmax|min|max)\(/;

/** One inheritance pass: every still-untyped token whose value is a single
 *  reference takes the referent's type. Returns whether anything moved, so
 *  the caller can stop at the fixed point instead of a guessed iteration
 *  count. */
function inheritTypesOnce(
  declared: ReadonlyMap<string, DtcgLeaf>,
  types: Map<string, string>,
): boolean {
  let changed = false;
  for (const [name, leaf] of declared) {
    if (types.has(name)) {
      continue;
    }
    const reference = soleReference(leaf.value);
    const referenced = reference === null ? undefined : types.get(reference);
    if (referenced !== undefined) {
      types.set(name, referenced);
      changed = true;
    }
  }
  return changed;
}

/**
 * The type of every token the export could type, plus every token that can
 * inherit one. Bounded by the map's own size, so a reference cycle
 * terminates at the fixed point instead of spinning.
 */
function resolveTypes(declared: ReadonlyMap<string, DtcgLeaf>): ReadonlyMap<string, string> {
  const types = new Map<string, string>();
  for (const [name, leaf] of declared) {
    if (leaf.type !== null) {
      types.set(name, leaf.type);
    }
  }
  for (let pass = 0; pass < declared.size; pass += 1) {
    if (!inheritTypesOnce(declared, types)) {
      break;
    }
  }
  return types;
}

interface FirstDeclaration {
  readonly leaf: DtcgLeaf;
  readonly tree: DtcgTree;
}

interface CollectedLeaves {
  readonly first: ReadonlyMap<string, FirstDeclaration>;
  readonly themes: ReadonlyMap<string, readonly string[]>;
  readonly leafCount: number;
  readonly excludedIconCount: number;
}

/** Walk every tree once, keeping the first declaration of each property and
 *  noting every theme face that declares it. */
function collect(trees: readonly DtcgTree[]): CollectedLeaves {
  const first = new Map<string, FirstDeclaration>();
  const themes = new Map<string, string[]>();
  let leafCount = 0;
  let excludedIconCount = 0;

  for (const tree of trees) {
    for (const leaf of dtcgLeaves(tree.data)) {
      leafCount += 1;
      const name = flattenTokenPath(leaf.path);
      if (isIconUrlProperty(name)) {
        excludedIconCount += 1;
        continue;
      }
      if (!first.has(name)) {
        first.set(name, { leaf, tree });
        themes.set(name, []);
      }
      if (tree.theme !== null) {
        themes.get(name)?.push(tree.theme);
      }
    }
  }

  return { first, themes, leafCount, excludedIconCount };
}

const VAR_REFERENCE = /var\(\s*(--[a-z0-9-]+)/gi;

/**
 * Theme dependence, computed TRANSITIVELY (review round 3): a token is
 * themed when any theme face declares it — one face is enough, since a
 * single-face override already makes the value move with the theme — OR
 * when its declared value references a themed token, to any depth. An
 * alias like `--card-bg: var(--bg-primary)` is declared once yet changes
 * with every theme, and the row's "changes with the theme" marker must
 * not lie by omission about exactly the tokens a reader would alias.
 */
function computeThemedNames(
  first: ReadonlyMap<string, FirstDeclaration>,
  themes: ReadonlyMap<string, readonly string[]>,
): ReadonlySet<string> {
  // Edges come from the page's own canonical rewrite, so DTCG brace
  // references and literal var() calls resolve through one parser.
  const references = new Map<string, readonly string[]>(
    [...first].map(([name, { leaf }]) => [
      name,
      [...withVarReferences(leaf.value).matchAll(VAR_REFERENCE)].map((match) => match[1] ?? ''),
    ]),
  );
  const themed = new Set<string>(
    [...themes].filter(([, faces]) => faces.length >= 1).map(([name]) => name),
  );
  let grew = true;
  while (grew) {
    grew = false;
    for (const [name, refs] of references) {
      if (!themed.has(name) && refs.some((ref) => themed.has(ref))) {
        themed.add(name);
        grew = true;
      }
    }
  }
  return themed;
}

/**
 * Flatten every tree into one de-duplicated catalogue, in the kit's own
 * authoring order. A token declared by several theme faces appears ONCE:
 * the page shows what is applied here and now, and the faces are recorded on
 * the row so a reader knows the value moves with the theme.
 */
export function buildCatalogue(trees: readonly DtcgTree[]): Catalogue {
  const { first, themes, leafCount, excludedIconCount } = collect(trees);
  const types = resolveTypes(new Map([...first].map(([name, entry]) => [name, entry.leaf])));
  const themedNames = computeThemedNames(first, themes);

  const tokens = [...first].map(([name, { leaf, tree }]): CatalogueToken => {
    const type = types.get(name) ?? null;
    return {
      name,
      path: leaf.path,
      tier: tree.tier,
      family: name.replace(/^--/, '').split('-')[0],
      kind: specimenKind(name, type),
      type,
      declared: withVarReferences(leaf.value),
      themes: themes.get(name) ?? [],
      themed: themedNames.has(name),
      functional: FUNCTIONAL_VALUE.test(leaf.value),
    };
  });

  return { tokens, leafCount, excludedIconCount };
}
