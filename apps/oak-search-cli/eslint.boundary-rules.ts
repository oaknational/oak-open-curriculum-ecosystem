import type { Linter } from 'eslint';

const sdkInternalPatterns: string[] = [
  '@oaknational/oak-search-sdk/internal',
  '@oaknational/oak-search-sdk/internal/**',
  '@oaknational/oak-search-sdk/dist',
  '@oaknational/oak-search-sdk/dist/**',
];

/**
 * Non-admin CLI surfaces must consume only the read SDK capability.
 */
export const readOnlyCliBoundaryRules: Partial<Linter.RulesRecord> = {
  '@typescript-eslint/no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: '@oaknational/oak-search-sdk',
          message: "Non-admin CLI modules must import from '@oaknational/oak-search-sdk/read'.",
        },
        {
          name: '@oaknational/oak-search-sdk/admin',
          message: 'Non-admin CLI modules must not import admin capability surface.',
        },
      ],
      patterns: [
        {
          group: sdkInternalPatterns,
          message: 'App code must not import SDK internal or deep implementation paths.',
        },
      ],
    },
  ],
};

/**
 * Admin CLI surfaces must consume only the admin SDK capability.
 */
export const adminCliBoundaryRules: Partial<Linter.RulesRecord> = {
  '@typescript-eslint/no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: '@oaknational/oak-search-sdk',
          message: "Admin CLI modules must import from '@oaknational/oak-search-sdk/admin'.",
        },
        {
          name: '@oaknational/oak-search-sdk/read',
          message:
            "Admin CLI modules must not import the read surface; use '@oaknational/oak-search-sdk/admin'.",
        },
      ],
      patterns: [
        {
          group: sdkInternalPatterns,
          message: 'App code must not import SDK internal or deep implementation paths.',
        },
      ],
    },
  ],
};

/**
 * Mixed capability surfaces (evaluation/tooling) may use read or admin,
 * but must never import root or internal/deep SDK paths.
 */
export const mixedCliBoundaryRules: Partial<Linter.RulesRecord> = {
  '@typescript-eslint/no-restricted-imports': [
    'error',
    {
      paths: [
        {
          name: '@oaknational/oak-search-sdk',
          message:
            "Mixed-capability modules must import from '@oaknational/oak-search-sdk/read' or '@oaknational/oak-search-sdk/admin', never root.",
        },
      ],
      patterns: [
        {
          group: sdkInternalPatterns,
          message: 'App code must not import SDK internal or deep implementation paths.',
        },
      ],
    },
  ],
};
