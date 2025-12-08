/**
 * ChatGPT environment emulation HTML wrapper for widget preview.
 * @module scripts/chatgpt-emulation-wrapper
 */

/**
 * Creates a ChatGPT environment emulation wrapper around a widget.
 */
// eslint-disable-next-line max-lines-per-function -- Dev script generates inline HTML
export function createEmulationWrapper(
  widgetHtml: string,
  // eslint-disable-next-line @typescript-eslint/no-restricted-types -- Dev script accepts any tool output
  toolOutput: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-restricted-types -- Dev script accepts any metadata
  metadata: Record<string, unknown>,
): string {
  const escapedWidgetHtml = widgetHtml.replace(/`/g, '\\`');
  const toolOutputJson = JSON.stringify(toolOutput);
  const metadataJson = JSON.stringify(metadata);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Widget Preview - ChatGPT Emulation</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background: #f7f7f8; color: #2d333a; }
    body.dark { background: #212121; color: #ececec; }
    .controls { margin-bottom: 16px; padding: 12px; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
    body.dark .controls { background: #2f2f2f; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
    .controls label { font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px; }
    .controls select, .controls button { padding: 4px 8px; border-radius: 4px; border: 1px solid #d1d5db; background: white; font-size: 13px; }
    body.dark .controls select, body.dark .controls button { background: #3f3f3f; border-color: #565656; color: #ececec; }
    .controls button { cursor: pointer; }
    .controls button:hover { background: #f3f4f6; }
    body.dark .controls button:hover { background: #4f4f4f; }
    .widget-container { max-width: 800px; margin: 0 auto; position: relative; }
    .widget-frame { background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; position: relative; }
    body.dark .widget-frame { background: #2f2f2f; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .safe-area-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 10000; display: none; }
    .safe-area-overlay.visible { display: block; }
    .safe-area-overlay::before { content: ''; position: absolute; top: var(--safe-top, 24px); right: var(--safe-right, 24px); bottom: var(--safe-bottom, 120px); left: var(--safe-left, 24px); border: 2px dashed rgba(59, 130, 246, 0.5); background: rgba(59, 130, 246, 0.05); }
    iframe { width: 100%; height: 600px; border: none; display: block; }
    .info { margin-top: 12px; padding: 8px 12px; background: rgba(59, 130, 246, 0.1); border-radius: 6px; font-size: 12px; line-height: 1.5; }
    body.dark .info { background: rgba(59, 130, 246, 0.2); }
  </style>
</head>
<body>
  <div class="controls">
    <label>Theme: <select id="theme-select"><option value="light">Light</option><option value="dark">Dark</option></select></label>
    <label>Display Mode: <select id="mode-select"><option value="inline">Inline</option><option value="fullscreen">Fullscreen</option></select></label>
    <label>Safe Area Preset: <select id="safe-area-select"><option value="default">Default (24/24/120/24)</option><option value="fullscreen">Fullscreen (16/16/16/16)</option><option value="mobile">Mobile (44/20/120/20)</option><option value="mobile-landscape">Mobile Landscape (20/44/100/44)</option></select></label>
    <button id="toggle-overlay">Toggle Safe Area Overlay</button>
  </div>
  <div class="widget-container">
    <div class="widget-frame">
      <div class="safe-area-overlay" id="safe-area-overlay"></div>
      <iframe id="widget-iframe" src="about:blank"></iframe>
    </div>
  </div>
  <div class="info">
    <strong>Safe Area Insets:</strong> 
    Top: <span id="info-top">24</span>px, Right: <span id="info-right">24</span>px, Bottom: <span id="info-bottom">120</span>px, Left: <span id="info-left">24</span>px
  </div>
  <script>
    const safeAreaPresets = {
      default: { top: 24, right: 24, bottom: 120, left: 24 },
      fullscreen: { top: 16, right: 16, bottom: 16, left: 16 },
      mobile: { top:  44, right: 20, bottom: 120, left: 20 },
      'mobile-landscape': { top: 20, right: 44, bottom: 100, left: 44 }
    };
    let currentSafeArea = safeAreaPresets.default;
    let currentTheme = 'light';
    let currentMode = 'inline';
    function updateInfo() {
      document.getElementById('info-top').textContent = currentSafeArea.top;
      document.getElementById('info-right').textContent = currentSafeArea.right;
      document.getElementById('info-bottom').textContent = currentSafeArea.bottom;
      document.getElementById('info-left').textContent = currentSafeArea.left;
      const overlay = document.getElementById('safe-area-overlay');
      overlay.style.setProperty('--safe-top', currentSafeArea.top + 'px');
      overlay.style.setProperty('--safe-right', currentSafeArea.right + 'px');
      overlay.style.setProperty('--safe-bottom', currentSafeArea.bottom + 'px');
      overlay.style.setProperty('--safe-left', currentSafeArea.left + 'px');
    }
    function loadWidget() {
      const widgetHtml = \`${escapedWidgetHtml}\`;
      const toolOutput = ${toolOutputJson};
      const metadata = ${metadataJson};
      const injectedHtml = widgetHtml.replace('</head>', \`<script>window.openai={toolOutput:\${JSON.stringify(toolOutput)},toolResponseMetadata:\${JSON.stringify(metadata)},safeArea:{insets:\${JSON.stringify(currentSafeArea)}},theme:"\${currentTheme}",displayMode:"\${currentMode}",locale:"en-US",maxHeight:600};<\\/scri'+'pt></head>\`);
      document.getElementById('widget-iframe').srcdoc = injectedHtml;
    }
    document.getElementById('theme-select').addEventListener('change', (e) => { currentTheme = e.target.value; document.body.className = currentTheme === 'dark' ? 'dark' : ''; loadWidget(); });
    document.getElementById('mode-select').addEventListener('change', (e) => { currentMode = e.target.value; loadWidget(); });
    document.getElementById('safe-area-select').addEventListener('change', (e) => { currentSafeArea = safeAreaPresets[e.target.value]; updateInfo(); loadWidget(); });
    document.getElementById('toggle-overlay').addEventListener('click', () => { document.getElementById('safe-area-overlay').classList.toggle('visible'); });
    updateInfo();
    loadWidget();
  </script>
</body>
</html>`;
}
