import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

import { createMessage, type RuleWithReappraisingMessages } from '../reappraising-message.js';

/**
 * ESLint rule banning shell-form process launches.
 *
 * @remarks
 * The Sonar disposition policy §S4036 decision criteria accept a command
 * invoked by name only when no external input reaches a shell. Where the
 * analyser's S4036 rule is not applied, nothing else checks that criterion, so
 * this rule checks its shell half at every lint run: a process is launched
 * with an argv array and no shell, or the lint fails.
 *
 * Two shapes are reported.
 *
 * `exec` and `execSync` from `child_process` / `node:child_process` always run
 * their command through a shell. A named import or re-export of either
 * reports, as does reaching either as a member of the module, or
 * destructuring either from it, through a namespace import, a default import
 * or `require(...)`. Detection follows the module binding, so an `exec` method
 * on anything else (`RegExp.prototype.exec`, a database client) is not
 * reported.
 *
 * A `shell` property whose value is not the literal `false`, in any object
 * literal or assigned onto any object, reports. The check is deliberately not
 * limited to objects written inside a launch call: an options object built in
 * one place and passed through a wrapper reaches `spawn` all the same.
 * Type-only positions (an interface member, a destructuring pattern) are not
 * object literals and do not report.
 *
 * The rule reads syntax only. A shell reached through a command name
 * (`spawn('sh', ['-c', text])`), a `shell` property written with a computed
 * key, or an options object built by a function it cannot see is outside what
 * it detects.
 *
 * @example
 * // Invalid: always a shell.
 * import { exec } from 'node:child_process';
 *
 * // Invalid: a shell joins the argv array into one string.
 * spawnSync('git', ['log', ref], { shell: true });
 *
 * // Valid: the input can only ever be an argument.
 * execFileSync('git', ['log', ref], { encoding: 'utf8' });
 */

type MessageId = 'shellRunningFunction' | 'shellOption';

const CHILD_PROCESS_SPECIFIERS = new Set<string>(['child_process', 'node:child_process']);

const SHELL_RUNNING_FUNCTIONS = new Set<string>(['exec', 'execSync']);

const REAPPRAISAL =
  'Pass an argv array to execFile or spawn with no shell option, so input can only ever be an argument; see the Sonar disposition policy §S4036.';

type Context = Readonly<TSESLint.RuleContext<MessageId, []>>;

function isChildProcessSpecifier(source: TSESTree.Node | null | undefined): boolean {
  return (
    source?.type === 'Literal' &&
    typeof source.value === 'string' &&
    CHILD_PROCESS_SPECIFIERS.has(source.value)
  );
}

/** The static name of a property key or a module export name, when it has one. */
function staticName(node: TSESTree.Node, computed: boolean): string | undefined {
  if (node.type === 'Identifier' && !computed) {
    return node.name;
  }
  if (node.type === 'Literal' && typeof node.value === 'string') {
    return node.value;
  }
  return undefined;
}

function reportShellRunningFunction(context: Context, node: TSESTree.Node, name: string): void {
  context.report({ node, messageId: 'shellRunningFunction', data: { name } });
}

/** Report `exec` / `execSync` taken out of the module by a destructuring pattern. */
function reportDestructuredFunctions(context: Context, pattern: TSESTree.ObjectPattern): void {
  for (const property of pattern.properties) {
    if (property.type !== 'Property') {
      continue;
    }
    const name = staticName(property.key, property.computed);
    if (name !== undefined && SHELL_RUNNING_FUNCTIONS.has(name)) {
      reportShellRunningFunction(context, property, name);
    }
  }
}

/**
 * Report what one expression that evaluates to the `child_process` module is
 * used for: member access to a shell-running function, or a destructuring
 * that takes one.
 */
function reportModuleUse(context: Context, moduleExpression: TSESTree.Node): void {
  const parent = moduleExpression.parent;
  if (parent?.type === 'MemberExpression' && parent.object === moduleExpression) {
    const name = staticName(parent.property, parent.computed);
    if (name !== undefined && SHELL_RUNNING_FUNCTIONS.has(name)) {
      reportShellRunningFunction(context, parent, name);
    }
    return;
  }
  if (
    parent?.type === 'VariableDeclarator' &&
    parent.init === moduleExpression &&
    parent.id.type === 'ObjectPattern'
  ) {
    reportDestructuredFunctions(context, parent.id);
  }
}

/** Follow every read of a binding that holds the `child_process` module. */
function reportModuleBindingUses(context: Context, declaration: TSESTree.Node): void {
  for (const variable of context.sourceCode.getDeclaredVariables(declaration)) {
    for (const reference of variable.references) {
      reportModuleUse(context, reference.identifier);
    }
  }
}

function reportImportSpecifier(context: Context, specifier: TSESTree.ImportClause): void {
  if (specifier.type !== 'ImportSpecifier') {
    reportModuleBindingUses(context, specifier);
    return;
  }
  if (specifier.importKind === 'type') {
    return;
  }
  const name = staticName(specifier.imported, false);
  if (name !== undefined && SHELL_RUNNING_FUNCTIONS.has(name)) {
    reportShellRunningFunction(context, specifier, name);
  }
}

function isRequireOfChildProcess(node: TSESTree.CallExpression): boolean {
  return (
    node.callee.type === 'Identifier' &&
    node.callee.name === 'require' &&
    isChildProcessSpecifier(node.arguments[0])
  );
}

function isLiteralFalse(node: TSESTree.Node): boolean {
  return node.type === 'Literal' && node.value === false;
}

const noShellFormProcessLaunchRule: RuleWithReappraisingMessages<MessageId> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ban shell-form process launches (exec, execSync, a shell option) so no input can reach a shell.',
    },
    schema: [],
    messages: {
      shellRunningFunction: createMessage({
        prohibition: 'child_process `{{name}}` always runs its command through a shell.',
        reappraisal: REAPPRAISAL,
      }),
      shellOption: createMessage({
        prohibition:
          'A `shell` option that is not the literal `false` launches the process through a shell.',
        reappraisal: REAPPRAISAL,
      }),
    },
  },
  defaultOptions: [],

  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.importKind === 'type' || !isChildProcessSpecifier(node.source)) {
          return;
        }
        for (const specifier of node.specifiers) {
          reportImportSpecifier(context, specifier);
        }
      },
      ExportNamedDeclaration(node) {
        if (node.exportKind === 'type' || !isChildProcessSpecifier(node.source)) {
          return;
        }
        for (const specifier of node.specifiers) {
          const name = staticName(specifier.local, false);
          if (name !== undefined && SHELL_RUNNING_FUNCTIONS.has(name)) {
            reportShellRunningFunction(context, specifier, name);
          }
        }
      },
      TSImportEqualsDeclaration(node) {
        if (
          node.moduleReference.type === 'TSExternalModuleReference' &&
          isChildProcessSpecifier(node.moduleReference.expression)
        ) {
          reportModuleBindingUses(context, node);
        }
      },
      CallExpression(node) {
        if (!isRequireOfChildProcess(node)) {
          return;
        }
        reportModuleUse(context, node);
        const parent = node.parent;
        if (parent.type === 'VariableDeclarator' && parent.id.type === 'Identifier') {
          reportModuleBindingUses(context, parent);
        }
      },
      Property(node) {
        if (
          node.parent.type === 'ObjectExpression' &&
          staticName(node.key, node.computed) === 'shell' &&
          !isLiteralFalse(node.value)
        ) {
          context.report({ node, messageId: 'shellOption' });
        }
      },
      AssignmentExpression(node) {
        if (
          node.left.type === 'MemberExpression' &&
          staticName(node.left.property, node.left.computed) === 'shell' &&
          !isLiteralFalse(node.right)
        ) {
          context.report({ node, messageId: 'shellOption' });
        }
      },
    };
  },
};

export { noShellFormProcessLaunchRule };
