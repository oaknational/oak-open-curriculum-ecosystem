import type { TSESTree } from '@typescript-eslint/utils';

import { createMessage, type RuleWithReappraisingMessages } from '../reappraising-message.js';

const POSTHOG_VENDOR_PACKAGES = ['posthog-node', '@posthog/mcp'] as const;
const POSTHOG_ADAPTER_PATH = '/packages/libs/posthog-node/';

function isPostHogAdapterFile(filename: string): boolean {
  const normalisedFilename = `/${filename.replaceAll('\\', '/')}`;
  return normalisedFilename.includes(POSTHOG_ADAPTER_PATH);
}

function isPostHogVendorSpecifier(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    POSTHOG_VENDOR_PACKAGES.some(
      (packageName) => value === packageName || value.startsWith(`${packageName}/`),
    )
  );
}

function readLiteralSpecifier(node: TSESTree.Node): string | undefined {
  if (node.type !== 'Literal' || !isPostHogVendorSpecifier(node.value)) {
    return undefined;
  }
  return node.value;
}

/**
 * Enforces the exclusive PostHog vendor-import boundary independently of
 * `no-restricted-imports`.
 *
 * @remarks
 * Flat-config rule values replace earlier values rather than merging them.
 * A dedicated rule therefore keeps this repository-wide boundary active when
 * a workspace later customises `no-restricted-imports` for an unrelated local
 * policy. The sole exemption is the adapter that owns the vendor dependency.
 */
const noPostHogVendorImportsRule: RuleWithReappraisingMessages<'postHogVendorImportBanned'> = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Allow PostHog vendor SDK imports only inside packages/libs/posthog-node.',
    },
    schema: [],
    messages: {
      postHogVendorImportBanned: createMessage({
        prohibition: 'Importing "{{specifier}}" outside packages/libs/posthog-node is forbidden.',
        reappraisal:
          'Consume Oak provider-neutral product-analytics contracts; keep every PostHog vendor import inside packages/libs/posthog-node.',
      }),
    },
  },
  defaultOptions: [],

  create(context) {
    const filename = context.physicalFilename ?? context.filename;
    if (filename && isPostHogAdapterFile(filename)) {
      return {};
    }

    function report(node: TSESTree.Node, source: TSESTree.Node): void {
      const specifier = readLiteralSpecifier(source);
      if (specifier === undefined) {
        return;
      }
      context.report({
        node,
        messageId: 'postHogVendorImportBanned',
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

export { noPostHogVendorImportsRule };
