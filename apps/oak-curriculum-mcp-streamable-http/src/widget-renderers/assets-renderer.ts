/**
 * Assets renderer for the widget.
 *
 * Renders downloadable assets from lessons, key stages, or sequences.
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 */

/**
 * JavaScript function to render assets data in the widget.
 *
 * Handles the following data shapes:
 * - { assets: Asset[] }
 * - Asset[] directly
 * - { lessonSlug: string, assets: Asset[] }[]
 */
export const ASSETS_RENDERER = `
function renderAssets(data) {
  let h = '';
  
  // Handle different asset structures
  let assets = [];
  let groupedByLesson = false;
  
  if (Array.isArray(data)) {
    // Could be assets array or lessons-with-assets array
    if (data.length > 0 && data[0].assets) {
      groupedByLesson = true;
      assets = data;
    } else {
      assets = data;
    }
  } else if (data.assets && Array.isArray(data.assets)) {
    assets = data.assets;
  }
  
  if (groupedByLesson) {
    // Render assets grouped by lesson
    h += '<div class="sec"><h2 class="sec-ttl">Assets by Lesson<span class="badge">' + assets.length + ' lessons</span></h2>';
    assets.slice(0, 5).forEach(lesson => {
      const lessonAssets = lesson.assets || [];
      h += '<div class="item"><p class="item-ttl">' + esc(lesson.lessonTitle || lesson.lessonSlug || 'Lesson') + '<span class="badge">' + lessonAssets.length + '</span></p>';
      if (lessonAssets.length > 0) {
        h += '<div class="asset-list" style="margin-top:8px">';
        lessonAssets.slice(0, 3).forEach(a => {
          h += renderAssetItem(a);
        });
        if (lessonAssets.length > 3) h += '<p class="meta" style="margin-top:4px">+' + (lessonAssets.length - 3) + ' more assets</p>';
        h += '</div>';
      }
      h += '</div>';
    });
    if (assets.length > 5) h += '<p class="meta" style="text-align:center;margin-top:8px">+' + (assets.length - 5) + ' more lessons</p>';
    h += '</div>';
  } else if (assets.length > 0) {
    // Render flat list of assets
    h += '<div class="sec"><h2 class="sec-ttl">Assets<span class="badge">' + assets.length + '</span></h2><div class="list">';
    assets.slice(0, 10).forEach(a => {
      h += '<div class="item">' + renderAssetItem(a) + '</div>';
    });
    if (assets.length > 10) h += '<p class="meta" style="text-align:center;margin-top:8px">+' + (assets.length - 10) + ' more</p>';
    h += '</div></div>';
  }
  
  if (!h) {
    h = '<div class="empty">No assets available.</div>';
  }
  
  // Canonical URL link (for single lesson assets)
  if (data.canonicalUrl) {
    h += '<div class="sec" style="margin-top:16px;padding-top:16px;border-top:1px solid #e0e0e0">';
    h += '<a class="link" href="' + esc(data.canonicalUrl) + '" target="_blank" onclick="openOnOakWebsite(event, \\'' + esc(data.canonicalUrl) + '\\')">View original Oak resource →</a>';
    h += '</div>';
  }
  
  return h;
}

function renderAssetItem(a) {
  const type = a.type || a.assetType || 'file';
  const icons = { video: '🎬', image: '🖼️', document: '📄', audio: '🎵', pdf: '📑', worksheet: '📝', slideDeck: '📊', default: '📎' };
  const icon = icons[type] || icons.default;
  const title = a.title || a.name || type;
  const url = a.downloadUrl || a.url || '';
  
  let item = '<p class="item-ttl">' + icon + ' ' + esc(title) + '</p>';
  if (a.format) item += '<p class="meta">' + esc(a.format.toUpperCase()) + '</p>';
  if (url) item += '<a class="link" href="' + esc(url) + '" target="_blank">Download →</a>';
  return item;
}
`.trim();
