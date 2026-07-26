/**
 * Oak Course extraction — the AST literal-evaluator behind the Course generator. The course is
 * authored as JavaScript object literals inside the canonical export (`Oak Course.dc.html`), not
 * JSON, so extraction parses the export's `<script>` with the TypeScript compiler API and
 * evaluates only *literal* nodes: any non-literal (call, variable, template-with-substitution) is
 * an `err` carrying its position, so a computed value can never be silently mis-extracted.
 * Extraction is shape-agnostic — the literal tree is validated against the course schema
 * (`lib/course/schema.ts`) by `generate-course.ts` before any JSON is emitted. Build tooling:
 * imports `typescript`, lives in `scripts/` (never bundled by Next).
 */

import { err, isErr, ok, type Result } from '@oaknational/result';
import {
  createSourceFile,
  forEachChild,
  isArrayLiteralExpression,
  isBinaryExpression,
  isIdentifier,
  isMethodDeclaration,
  isNumericLiteral,
  isObjectLiteralExpression,
  isParenthesizedExpression,
  isPropertyAccessExpression,
  isPropertyAssignment,
  isReturnStatement,
  isStringLiteral,
  isStringLiteralLike,
  ScriptKind,
  ScriptTarget,
  SyntaxKind,
  type ArrayLiteralExpression,
  type BinaryExpression,
  type Expression,
  type Node,
  type ObjectLiteralExpression,
  type PropertyName,
  type SourceFile,
} from 'typescript';

/**
 * A value that can appear in the course content: JSON-shaped, the closed output of the evaluator.
 * Arrays/index are mutable (not `readonly`) so `Array.isArray` narrows the union member out — this
 * is a build-time intermediate representation, serialised straight to JSON, never shared.
 */
type LiteralValue =
  string | number | boolean | null | LiteralValue[] | { [key: string]: LiteralValue };

/** The assembled raw course object, before schema validation in `generate-course.ts`. */
export interface RawCourse {
  readonly units: LiteralValue;
  readonly intro: LiteralValue;
  readonly modules: LiteralValue;
}

/** Describe a node's position (1-based line:col) for fail-loud diagnostics. */
function positionOf(source: SourceFile, node: Node): string {
  const { line, character } = source.getLineAndCharacterOfPosition(node.getStart(source));
  return `${line + 1}:${character + 1}`;
}

/** The static key of a property assignment, or `err` for a computed / non-literal key. */
function propertyKey(source: SourceFile, name: PropertyName): Result<string, string> {
  if (isIdentifier(name) || isStringLiteral(name)) {
    return ok(name.text);
  }
  return err(`course extract: non-literal property key at ${positionOf(source, name)}`);
}

const KEYWORD_VALUES = new Map<SyntaxKind, LiteralValue>([
  [SyntaxKind.TrueKeyword, true],
  [SyntaxKind.FalseKeyword, false],
  [SyntaxKind.NullKeyword, null],
]);

/** Evaluate a primitive literal (string, number, boolean, null), or `undefined` if not primitive. */
function evaluatePrimitive(node: Expression): LiteralValue | undefined {
  if (isStringLiteralLike(node)) {
    return node.text;
  }
  if (isNumericLiteral(node)) {
    return Number(node.text);
  }
  return KEYWORD_VALUES.get(node.kind);
}

/** Evaluate an object literal, `err` on any non-literal (computed / shorthand / spread) property. */
function evaluateObject(
  source: SourceFile,
  node: ObjectLiteralExpression,
): Result<LiteralValue, string> {
  const object: Record<string, LiteralValue> = {};
  for (const property of node.properties) {
    if (!isPropertyAssignment(property)) {
      return err(`course extract: non-literal property at ${positionOf(source, property)}`);
    }
    const key = propertyKey(source, property.name);
    if (isErr(key)) {
      return key;
    }
    const value = evaluateLiteral(source, property.initializer);
    if (isErr(value)) {
      return value;
    }
    object[key.value] = value.value;
  }
  return ok(object);
}

/** Evaluate an array literal element-by-element, propagating the first `err`. */
function evaluateArray(
  source: SourceFile,
  node: ArrayLiteralExpression,
): Result<LiteralValue, string> {
  const values: LiteralValue[] = [];
  for (const element of node.elements) {
    const value = evaluateLiteral(source, element);
    if (isErr(value)) {
      return value;
    }
    values.push(value.value);
  }
  return ok(values);
}

/** Evaluate a `string + string` concatenation, `err` on any other binary operand. */
function evaluateConcatenation(
  source: SourceFile,
  node: BinaryExpression,
): Result<LiteralValue, string> {
  const left = evaluateLiteral(source, node.left);
  if (isErr(left)) {
    return left;
  }
  const right = evaluateLiteral(source, node.right);
  if (isErr(right)) {
    return right;
  }
  if (typeof left.value === 'string' && typeof right.value === 'string') {
    return ok(left.value + right.value);
  }
  return err(`course extract: non-string concatenation at ${positionOf(source, node)}`);
}

/**
 * Evaluate a literal expression to its value. Any non-literal node is an `err` naming its
 * position, so a computed value is a loud extraction failure, never a silent mis-read.
 */
function evaluateLiteral(source: SourceFile, node: Expression): Result<LiteralValue, string> {
  const primitive = evaluatePrimitive(node);
  if (primitive !== undefined) {
    return ok(primitive);
  }
  if (isParenthesizedExpression(node)) {
    return evaluateLiteral(source, node.expression);
  }
  if (isArrayLiteralExpression(node)) {
    return evaluateArray(source, node);
  }
  if (isObjectLiteralExpression(node)) {
    return evaluateObject(source, node);
  }
  if (isBinaryExpression(node) && node.operatorToken.kind === SyntaxKind.PlusToken) {
    return evaluateConcatenation(source, node);
  }
  return err(
    `course extract: unsupported non-literal ${SyntaxKind[node.kind]} at ${positionOf(source, node)}`,
  );
}

/** Extract the `text/x-dc` script body from the export HTML (the app source authored inside it). */
export function extractScript(html: string): Result<string, string> {
  const match = /<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/.exec(html);
  if (match === null) {
    return err('course extract: no <script type="text/x-dc"> block found in the export');
  }
  return ok(match[1]);
}

/** Walk the tree and evaluate the first expression `select` yields, or `err(message)`. */
function evaluateSelected(
  source: SourceFile,
  select: (node: Node) => Expression | undefined,
  message: string,
): Result<LiteralValue, string> {
  let found: Expression | undefined;
  const visit = (node: Node): void => {
    found ??= select(node);
    forEachChild(node, visit);
  };
  visit(source);
  return found === undefined ? err(message) : evaluateLiteral(source, found);
}

/** Select the return expression of a method named `methodName`. */
const methodReturn =
  (methodName: string) =>
  (node: Node): Expression | undefined =>
    isMethodDeclaration(node) &&
    isIdentifier(node.name) &&
    node.name.text === methodName &&
    node.body !== undefined
      ? node.body.statements.find(isReturnStatement)?.expression
      : undefined;

/** Select the right-hand side of a `this.<propertyName> = <expr>` assignment. */
const thisAssignment =
  (propertyName: string) =>
  (node: Node): Expression | undefined =>
    isBinaryExpression(node) &&
    node.operatorToken.kind === SyntaxKind.EqualsToken &&
    isPropertyAccessExpression(node.left) &&
    node.left.expression.kind === SyntaxKind.ThisKeyword &&
    node.left.name.text === propertyName
      ? node.right
      : undefined;

/** Parse the export script and extract the raw course (units + intro + modules) as literal data. */
export function extractCourse(script: string): Result<RawCourse, string> {
  const source = createSourceFile('course.js', script, ScriptTarget.Latest, true, ScriptKind.JS);
  const units = evaluateSelected(
    source,
    thisAssignment('units'),
    'course extract: no this.units = … assignment found',
  );
  if (isErr(units)) {
    return units;
  }
  const intro = evaluateSelected(
    source,
    methodReturn('buildIntro'),
    'course extract: no return expression for method buildIntro()',
  );
  if (isErr(intro)) {
    return intro;
  }
  const modules = evaluateSelected(
    source,
    methodReturn('buildCourse'),
    'course extract: no return expression for method buildCourse()',
  );
  if (isErr(modules)) {
    return modules;
  }
  return ok({ units: units.value, intro: intro.value, modules: modules.value });
}
