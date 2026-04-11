import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

/**
 * ESLint rule to discourage exporting trivial type aliases.
 *
 * A trivial type alias is one that simply renames an imported type without adding any value
 * (e.g., `export type MyType = ImportedType;`).
 *
 * @example
 * // Invalid
 * import { Foo } from './foo';
 * export type Bar = Foo;
 *
 * // Valid
 * export { Foo as Bar } from './foo';
 */
const noExportTrivialTypeAliasesRule: TSESLint.RuleModule<'aliasNotAllowed'> = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Discourage exporting type aliases that simply forward another type. Prefer re-exporting the canonical type.',
    },
    schema: [],
    messages: {
      aliasNotAllowed:
        'Avoid exporting trivial aliases (`type {{alias}} = {{target}}`). Import the canonical type where it is required instead.',
    },
  },
  defaultOptions: [],
  create(context) {
    const importedBindings = new Set<string>();

    return {
      ImportDeclaration(node) {
        for (const specifier of node.specifiers) {
          importedBindings.add(specifier.local.name);
        }
      },
      TSTypeAliasDeclaration(node: TSESTree.TSTypeAliasDeclaration) {
        if (!isExportedTypeAlias(node) || aliasHasGenerics(node)) {
          return;
        }

        const typeReference = getTypeReference(node.typeAnnotation);
        if (!typeReference || referenceHasGenerics(typeReference)) {
          return;
        }

        const targetName = extractEntityName(typeReference.typeName);
        if (!targetName) {
          return;
        }

        const rootIdentifier = targetName.split('.')[0];
        if (!importedBindings.has(rootIdentifier) || !startsWithCapitalLetter(rootIdentifier)) {
          return;
        }

        context.report({
          node,
          messageId: 'aliasNotAllowed',
          data: {
            alias: node.id.name,
            target: targetName,
          },
        });
      },
    };
  },
};

function isExportedTypeAlias(node: TSESTree.TSTypeAliasDeclaration): boolean {
  const parent = node.parent;
  return parent !== null && parent.type === AST_NODE_TYPES.ExportNamedDeclaration;
}

function aliasHasGenerics(node: TSESTree.TSTypeAliasDeclaration): boolean {
  const params = node.typeParameters?.params;
  return Array.isArray(params) && params.length > 0;
}

function getTypeReference(annotation: TSESTree.TypeNode): TSESTree.TSTypeReference | null {
  return annotation.type === AST_NODE_TYPES.TSTypeReference ? annotation : null;
}

function referenceHasGenerics(typeReference: TSESTree.TSTypeReference): boolean {
  const params = typeReference.typeArguments?.params;
  return Array.isArray(params) && params.length > 0;
}

function startsWithCapitalLetter(value: string): boolean {
  return /^[A-Z]/u.test(value);
}

function extractEntityName(name: TSESTree.EntityName): string {
  if (name.type === AST_NODE_TYPES.Identifier) {
    return name.name;
  }

  if (name.type === AST_NODE_TYPES.TSQualifiedName) {
    const left = extractEntityName(name.left);
    const right = extractEntityName(name.right);

    if (!left || !right) {
      return '';
    }

    return `${left}.${right}`;
  }

  return '';
}

export { noExportTrivialTypeAliasesRule };
