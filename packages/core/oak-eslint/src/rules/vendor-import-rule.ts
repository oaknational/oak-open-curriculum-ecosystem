import type { TSESTree } from '@typescript-eslint/utils';

import type { ReappraisingMessage, RuleWithReappraisingMessages } from '../reappraising-message.js';

/**
 * Everything one vendor-import fence varies: which specifiers it covers,
 * which file(s) are exempt, and how it teaches the boundary.
 */
interface VendorImportRuleSpec<MessageId extends string> {
  readonly description: string;
  readonly messageId: MessageId;
  readonly messages: Record<MessageId, ReappraisingMessage>;
  readonly isExemptFile: (filename: string) => boolean;
  readonly isVendorSpecifier: (value: unknown) => value is string;
}

/**
 * Builds a vendor-import fence rule: every static and dynamic import form
 * of the vendor specifier set is reported outside the exempt file(s).
 *
 * @remarks
 * The traversal is the invariant half of the vendor-fence family — the
 * import forms covered (import/export/require/dynamic-import/type-import/
 * import-equals) do not vary per vendor, only the specifier set, the
 * exemption, and the taught message do. Homed once so a second fence
 * cannot fork the mechanics (consolidate-at-second-consumer; extracted
 * when `no-vercel-functions-imports` became the family's second member).
 */
export function createVendorImportRule<MessageId extends string>(
  spec: VendorImportRuleSpec<MessageId>,
): RuleWithReappraisingMessages<MessageId> {
  function readStaticSpecifier(node: TSESTree.Node): string | undefined {
    if (node.type === 'Literal') {
      return spec.isVendorSpecifier(node.value) ? node.value : undefined;
    }
    // A no-substitution template literal is as static as a string literal:
    // require(`vendor`) and import(`vendor`) must not slip the fence on
    // quote syntax alone.
    if (
      node.type === 'TemplateLiteral' &&
      node.expressions.length === 0 &&
      node.quasis.length === 1
    ) {
      const value = node.quasis[0]?.value.cooked;
      return spec.isVendorSpecifier(value) ? value : undefined;
    }
    return undefined;
  }

  return {
    meta: {
      type: 'problem',
      docs: {
        description: spec.description,
      },
      schema: [],
      messages: spec.messages,
    },
    create(context) {
      const filename = context.physicalFilename ?? context.filename;
      if (filename && spec.isExemptFile(filename)) {
        return {};
      }

      function report(node: TSESTree.Node, source: TSESTree.Node): void {
        const specifier = readStaticSpecifier(source);
        if (specifier === undefined) {
          return;
        }
        context.report({
          node,
          messageId: spec.messageId,
          data: { specifier },
        });
      }

      return {
        ImportDeclaration(node) {
          report(node, node.source);
        },
        ExportNamedDeclaration(node) {
          if (node.source !== null) {
            report(node, node.source);
          }
        },
        ExportAllDeclaration(node) {
          report(node, node.source);
        },
        ImportExpression(node) {
          report(node, node.source);
        },
        TSImportType(node) {
          report(node, node.source);
        },
        TSImportEqualsDeclaration(node) {
          if (node.moduleReference.type === 'TSExternalModuleReference') {
            report(node, node.moduleReference.expression);
          }
        },
        CallExpression(node) {
          if (
            node.callee.type === 'Identifier' &&
            node.callee.name === 'require' &&
            node.arguments.length > 0
          ) {
            const firstArgument = node.arguments[0];
            if (firstArgument !== undefined && firstArgument.type !== 'SpreadElement') {
              report(node, firstArgument);
            }
          }
        },
      };
    },
  };
}
