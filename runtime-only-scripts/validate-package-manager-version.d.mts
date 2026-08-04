export interface PackageManagerVersionValidationInput {
  readonly packageManager: unknown;
  readonly userAgent: string | undefined;
}

export type PackageManagerVersionValidationResult =
  { readonly exitCode: 0 } | { readonly exitCode: 1; readonly message: string };

export function validatePackageManagerVersion(
  input: PackageManagerVersionValidationInput,
): PackageManagerVersionValidationResult;

export function runPackageManagerVersionGuard(): PackageManagerVersionValidationResult;
