/**
 * Names for the type aliases `hoist-repeated-unions.ts` declares.
 *
 * @remarks
 * A hoisted union has no name of its own in the schema, so its alias is named
 * from where openapi-typescript emitted it: the two innermost property names
 * on the way up to the enclosing root type, in PascalCase, skipping the
 * OpenAPI structural containers (`parameters`, `path`, `schemas`, `content`
 * and their kin), any key that is not an identifier (operation ids, URL
 * paths, media types, status codes), and the component schema's own name
 * unless it is the only name there is. The site that names the union is the
 * first one under the innermost property name the most sites share (ten
 * `subject` properties outweigh one `AllSubjectsResponseSchema` array); when
 * names tie, the first tied site names it by the trailing words the tied
 * names share, when they share any (`starterQuiz` and `exitQuiz` name a
 * `quiz`). A union that types an array's elements takes an `Item` suffix. On
 * a collision the name widens to a third property, the schema name included.
 * The rule is mechanical so the same schema always yields the same names.
 */

import { isArrayTypeNode, isIdentifier, isInterfaceDeclaration, isParenthesizedTypeNode, isPropertySignature, isSourceFile, isTypeAliasDeclaration } from 'typescript';
import type { Node, PropertySignature, UnionTypeNode } from 'typescript';

/** Property names that organise the document rather than name a value. */
const STRUCTURAL_CONTAINERS: ReadonlySet<string> = new Set([
  'parameters',
  'query',
  'header',
  'path',
  'cookie',
  'requestBody',
  'requestBodies',
  'content',
  'responses',
  'headers',
  'schemas',
  'pathItems',
]);

/** How many property names, innermost first, an alias name is built from. */
const NAME_DEPTH = 2;

function pascalCase(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function isArrayElement(node: Node): boolean {
  const wrapper = isParenthesizedTypeNode(node.parent) ? node.parent : node;
  return isArrayTypeNode(wrapper.parent);
}

/** One enclosing property: its name and whether it names a component schema. */
interface EnclosingProperty {
  readonly name: string;
  readonly isComponentSchema: boolean;
}

/** Whether a property signature is a direct member of `components.schemas`. */
function isComponentSchemaName(property: PropertySignature): boolean {
  const owner = property.parent.parent;
  return isPropertySignature(owner) && isIdentifier(owner.name) && owner.name.text === 'schemas';
}

/** The identifier-named, non-structural properties enclosing a node, innermost first. */
function enclosingProperties(node: Node): readonly EnclosingProperty[] {
  const properties: EnclosingProperty[] = [];
  for (let current = node.parent; !isSourceFile(current); current = current.parent) {
    if (isInterfaceDeclaration(current) || isTypeAliasDeclaration(current)) {
      break;
    }
    if (
      isPropertySignature(current) &&
      isIdentifier(current.name) &&
      !STRUCTURAL_CONTAINERS.has(current.name.text)
    ) {
      properties.push({
        name: current.name.text,
        isComponentSchema: isComponentSchemaName(current),
      });
    }
  }
  return properties;
}

/** Drops the component schema's name when a more specific property names the union. */
function withoutSchemaName(properties: readonly EnclosingProperty[]): readonly EnclosingProperty[] {
  const specific = properties.filter((property) => !property.isComponentSchema);
  return specific.length === 0 ? properties : specific;
}

function joinNames(union: UnionTypeNode, properties: readonly EnclosingProperty[]): string {
  const names = properties.map((property) => pascalCase(property.name)).reverse();
  const stem = names.length === 0 ? 'Union' : names.join('');
  return isArrayElement(union) ? `${stem}Item` : stem;
}

/** One site of a union: the union and its enclosing properties, with and without the schema's name. */
interface NamingSite {
  readonly union: UnionTypeNode;
  /** Innermost first, the component schema's name excluded unless it is the only one. */
  readonly specific: readonly EnclosingProperty[];
  /** Innermost first, every identifier-named, non-structural property. */
  readonly full: readonly EnclosingProperty[];
}

function siteOf(union: UnionTypeNode): NamingSite {
  const full = enclosingProperties(union);
  return { union, full, specific: withoutSchemaName(full) };
}

function innermostName(site: NamingSite): string {
  return site.specific[0]?.name ?? '';
}

/** The camel-case words of a property name, in order. */
function camelWords(name: string): readonly string[] {
  return name.split(/(?=[A-Z])/u);
}

/** The trailing words every name shares, as one lower-camel name; empty when they share none. */
function sharedTrailingWords(names: readonly string[]): string {
  const wordLists = names.map(camelWords);
  const shortest = Math.min(...wordLists.map((words) => words.length));
  const shared: string[] = [];
  for (let back = 1; back <= shortest; back += 1) {
    const [word, ...rest] = wordLists.map((words) => words.at(-back));
    if (word === undefined || rest.some((candidate) => candidate !== word)) {
      break;
    }
    shared.unshift(word);
  }
  const joined = shared.join('');
  return joined.charAt(0).toLowerCase() + joined.slice(1);
}

/** The innermost property names the most sites share: one name, or the names tied for it. */
function leadingNames(sites: readonly NamingSite[]): readonly string[] {
  const counts = new Map<string, number>();
  for (const site of sites) {
    const name = innermostName(site);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const most = Math.max(...counts.values());
  return [...counts].filter(([, count]) => count === most).map(([name]) => name);
}

/** The site with its innermost property renamed, in both chains. */
function renamedInnermost(site: NamingSite, name: string): NamingSite {
  const [innermost] = site.specific;
  if (innermost === undefined) {
    return site;
  }
  const rename = (property: EnclosingProperty): EnclosingProperty =>
    property === innermost ? { ...property, name } : property;
  return { union: site.union, specific: site.specific.map(rename), full: site.full.map(rename) };
}

/**
 * The site that names a union: the first site under the innermost property
 * name the most sites share. When names tie, the first tied site names it by
 * the trailing words the tied names share, when there are any.
 */
function namingSite(unions: readonly [UnionTypeNode, ...UnionTypeNode[]]): NamingSite {
  const sites = unions.map(siteOf);
  const leading = leadingNames(sites);
  const site =
    sites.find((candidate) => leading.includes(innermostName(candidate))) ?? siteOf(unions[0]);
  if (leading.length === 1) {
    return site;
  }
  const shared = sharedTrailingWords(leading);
  return shared === '' ? site : renamedInnermost(site, shared);
}

/**
 * The alias name for a union, before collision handling: the naming site's
 * two innermost enclosing property names, the component schema's name
 * excluded unless it is the only one.
 *
 * @param unions - Every emitted occurrence of the union, in document order
 */
export function unionAliasBaseName(unions: readonly [UnionTypeNode, ...UnionTypeNode[]]): string {
  const site = namingSite(unions);
  return joinNames(site.union, site.specific.slice(0, NAME_DEPTH));
}

/** The alias name widened to three enclosing properties, the schema name included. */
function unionAliasWidenedName(site: NamingSite): string {
  return joinNames(site.union, site.full.slice(0, NAME_DEPTH + 1));
}

/**
 * A unique alias name for a union: the base name, widened to a third property
 * name on a collision and numbered when that still collides.
 *
 * @param unions - Every emitted occurrence of the union, in document order
 * @param taken - Names already declared or assigned in the module
 */
export function uniqueUnionAliasName(
  unions: readonly [UnionTypeNode, ...UnionTypeNode[]],
  taken: ReadonlySet<string>,
): string {
  const site = namingSite(unions);
  const base = joinNames(site.union, site.specific.slice(0, NAME_DEPTH));
  if (!taken.has(base)) {
    return base;
  }
  const widened = unionAliasWidenedName(site);
  if (!taken.has(widened)) {
    return widened;
  }
  let suffix = 2;
  while (taken.has(`${widened}${String(suffix)}`)) {
    suffix += 1;
  }
  return `${widened}${String(suffix)}`;
}
