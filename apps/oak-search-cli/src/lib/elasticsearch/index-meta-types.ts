/**
 * Errors that can occur during index metadata operations.
 */
export type IndexMetaError =
  | { readonly type: 'not_found'; readonly message: string }
  | { readonly type: 'network_error'; readonly message: string }
  | { readonly type: 'mapping_error'; readonly field: string; readonly message: string }
  | { readonly type: 'validation_error'; readonly message: string; readonly details: string }
  | { readonly type: 'unknown'; readonly message: string };
