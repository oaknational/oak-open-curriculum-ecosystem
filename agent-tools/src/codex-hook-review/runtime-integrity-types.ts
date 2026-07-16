/** Failures owned by runtime integrity and executable pin verification. */
export type RuntimeIntegrityError =
  | { readonly kind: 'bundle-read-failed'; readonly path: string }
  | { readonly kind: 'bundle-invalid'; readonly path: string }
  | { readonly kind: 'bundle-changed' }
  | { readonly kind: 'deployment-directory-failed'; readonly path: string }
  | { readonly kind: 'deployment-directory-invalid'; readonly path: string }
  | { readonly kind: 'deployment-write-failed'; readonly path: string }
  | { readonly kind: 'deployment-conflict'; readonly path: string }
  | { readonly kind: 'deployment-permission-failed'; readonly path: string }
  | { readonly kind: 'executable-path-invalid'; readonly path: string }
  | { readonly kind: 'executable-read-failed'; readonly path: string }
  | { readonly kind: 'executable-invalid'; readonly path: string }
  | { readonly kind: 'executable-permission-failed'; readonly path: string };
