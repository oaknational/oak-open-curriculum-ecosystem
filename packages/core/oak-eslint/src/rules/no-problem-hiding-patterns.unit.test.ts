import { noProblemHidingPatternsRule } from './no-problem-hiding-patterns.js';
import { ruleTester } from '../test-support/rule-tester.js';

ruleTester.run('no-problem-hiding-patterns', noProblemHidingPatternsRule, {
  valid: [
    // `void <expression>` for fire-and-forget promise — legitimate
    {
      code: 'function fire(): void { void Promise.resolve(); }',
    },
    // `void <method-call>` to discard return value — legitimate
    {
      code: 'function dispose(closeStream: () => Promise<void>): void { void closeStream(); }',
    },
    // `void <member-expression-call>` — legitimate
    {
      code: 'function go(app: { openLink: (u: string) => void }): void { void app.openLink("/"); }',
    },
    // `_meta` as protocol field name in property access — legitimate
    {
      code: 'function read(x: { _meta: { kind: string } }): string { return x._meta.kind; }',
    },
    // `_meta` as protocol field name in object literal — legitimate
    // (the property key is `_meta`; the rule does not flag property keys)
    { code: 'const tool = { name: "x", _meta: { kind: "y" } };' },
    // Destructure that renames an underscore-prefixed protocol field to
    // a non-underscore local — legitimate (the local binding is `meta`,
    // not `_meta`)
    {
      code: 'function pick(o: { _meta: number; other: string }): string { const { _meta: meta, other } = o; return `${meta}-${other}`; }',
    },
    // Regular parameter — legitimate
    { code: 'function add(a: number, b: number): number { return a + b; }' },
    // Regular const — legitimate
    { code: 'const total: number = 1 + 2; export { total };' },
  ],
  invalid: [
    // void <bare-identifier>; — banned
    {
      code: 'function f(value: number): number { const x = value; void x; return value; }',
      errors: [{ messageId: 'voidUnusedBinding' }],
    },
    // void <bare-identifier>; in destructure-rest pattern — banned
    {
      code: 'function omit<T extends { a: string }>(obj: T): Omit<T, "a"> { const { a, ...rest } = obj; void a; return rest; }',
      errors: [{ messageId: 'voidUnusedBinding' }],
    },
    // _foo parameter rename — banned
    {
      code: 'function handler(_req: { url: string }, res: { send: (s: string) => void }): void { res.send("ok"); }',
      errors: [{ messageId: 'underscorePrefixRename' }],
    },
    // _foo destructure rename — banned
    {
      code: 'function pick(o: { a: string; b: string }): string { const { a: _a, b } = o; return b; }',
      errors: [{ messageId: 'underscorePrefixRename' }],
    },
    // _foo variable declarator rename — banned
    {
      code: 'function compute(value: number): number { const _intermediate = value * 2; return value + 1; }',
      errors: [{ messageId: 'underscorePrefixRename' }],
    },
    // shorthand destructure of underscore-prefixed protocol field —
    // banned (the local binding is `_meta`, regardless of source)
    {
      code: 'function pick(o: { _meta: number }): number { const { _meta } = o; return _meta; }',
      errors: [{ messageId: 'underscorePrefixRename' }],
    },
    // double-underscore Node.js convention name — banned (the leading
    // underscore is the silencer convention; rename the local)
    {
      code: 'declare const fileURLToPath: (u: string) => string; declare const dirname: (p: string) => string; const __dirname: string = dirname(fileURLToPath(import.meta.url)); export { __dirname };',
      errors: [{ messageId: 'underscorePrefixRename' }],
    },
  ],
});
