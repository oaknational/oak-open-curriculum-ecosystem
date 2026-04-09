/**
 * No-op widget HTML validator for in-process tests.
 *
 * Source-imported tests should validate code behaviour, not whether the build
 * pipeline emitted `dist/oak-banner.html`. Build artefact validation belongs
 * in `pnpm build` and built-system coverage.
 */
export function skipWidgetHtmlValidation(widgetHtmlPath: string): void {
  void widgetHtmlPath;
}
