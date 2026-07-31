/**
 * Host safe-area insets as CSS custom properties for the app shell.
 *
 * @remarks
 * The insets are exposed as `--oak-safe-area-inset-*` custom properties,
 * never as inline `padding`: inline padding beats the `.oak-app` class
 * rule, so a zero-inset host (e.g. ChatGPT desktop) would REPLACE the
 * authored token padding with 0 (MCP-434). The stylesheet composes each
 * inset with the token padding via `calc()`, so zero insets leave the
 * authored padding intact while notched devices still get their extra
 * clearance.
 */
import type { McpUiHostContext } from '@modelcontextprotocol/ext-apps';
import type { CSSProperties } from 'react';

/**
 * Inline style carrying host safe-area insets as CSS custom properties.
 *
 * @remarks
 * `CSSProperties` is a closed type, so the `--oak-safe-area-inset-*`
 * custom property keys are added via intersection rather than assertion.
 */
export type SafeAreaInsetStyle = CSSProperties &
  Record<
    | '--oak-safe-area-inset-top'
    | '--oak-safe-area-inset-right'
    | '--oak-safe-area-inset-bottom'
    | '--oak-safe-area-inset-left',
    string
  >;

/**
 * Builds the shell's inline style from host safe-area insets.
 *
 * @remarks
 * Values carry explicit `px` units because React appends no unit to
 * custom properties (the host reports insets as pixel numbers).
 */
export function safeAreaInsetStyle(
  safeAreaInsets: NonNullable<McpUiHostContext['safeAreaInsets']>,
): SafeAreaInsetStyle {
  return {
    '--oak-safe-area-inset-top': `${safeAreaInsets.top}px`,
    '--oak-safe-area-inset-right': `${safeAreaInsets.right}px`,
    '--oak-safe-area-inset-bottom': `${safeAreaInsets.bottom}px`,
    '--oak-safe-area-inset-left': `${safeAreaInsets.left}px`,
  };
}
