import type { Page } from '@playwright/test';

/**
 * Remove the Next.js developer overlay to avoid layout pollution in visual tests.
 */
export async function dismissNextDevOverlay(page: Page): Promise<void> {
  await page.evaluate(() => {
    const removeOverlay = () => {
      const devtoolsButton = document.querySelector<HTMLButtonElement>(
        'button[aria-label="Open Next.js Dev Tools"]',
      );
      if (devtoolsButton) {
        const container =
          devtoolsButton.closest('div[data-nextjs-devtools-root]') ??
          devtoolsButton.parentElement ??
          undefined;
        (container ?? devtoolsButton).remove();
      }
      const issueButton = document.querySelector<HTMLButtonElement>(
        'button[aria-label="Open issues overlay"]',
      );
      if (issueButton) {
        const issueContainer =
          issueButton.closest('div[data-nextjs-devtools-root]') ?? issueButton.parentElement;
        issueContainer?.remove();
      }
    };

    removeOverlay();

    const observer = new MutationObserver(() => removeOverlay());
    const target = document.body ?? document.documentElement;
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    }
  });
}
