import { describe, expect, it, vi } from 'vitest';
import { mockMatchMedia } from './SearchPageClient.test-helpers';

describe('mockMatchMedia', () => {
  it('notifies function listeners on change events with the media query context', () => {
    mockMatchMedia(true);
    const listener = vi.fn();
    const mediaQueryList = window.matchMedia('(min-width: 64rem)');

    mediaQueryList.addEventListener('change', listener);
    const event = new Event('change');

    expect(mediaQueryList.dispatchEvent(event)).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
    const [firstCall] = listener.mock.calls;
    expect(firstCall[0]).toMatchObject({ matches: true, media: '(min-width: 64rem)' });
    expect(listener.mock.instances[0]).toBe(mediaQueryList);
  });

  it('supports event listener objects with a handleEvent method', () => {
    mockMatchMedia(false);
    const handleEvent = vi.fn();
    const listener = { handleEvent };
    const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');

    mediaQueryList.addEventListener('change', listener);
    const event = new Event('change');

    expect(mediaQueryList.dispatchEvent(event)).toBe(true);
    expect(handleEvent).toHaveBeenCalledTimes(1);
    const [firstCall] = handleEvent.mock.calls;
    expect(firstCall[0]).toMatchObject({
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
    });
  });

  it('stops notifying listeners once they are removed', () => {
    mockMatchMedia(true);
    const listener = vi.fn();
    const mediaQueryList = window.matchMedia('(max-width: 30rem)');

    mediaQueryList.addEventListener('change', listener);
    mediaQueryList.removeEventListener('change', listener);

    const event = new Event('change');

    expect(mediaQueryList.dispatchEvent(event)).toBe(true);
    expect(listener).not.toHaveBeenCalled();
  });
});
