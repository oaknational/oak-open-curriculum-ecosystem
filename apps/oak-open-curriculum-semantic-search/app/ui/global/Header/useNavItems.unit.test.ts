import { describe, expect, it } from 'vitest';
import { useNavItems } from './useNavItems';

describe('useNavItems', () => {
  it('provides Oak home metadata for the logo link', () => {
    const nav = useNavItems();

    expect(nav.home.href).toBe('/');
    expect(nav.home.ariaLabel).toBe('Home');
    expect(nav.home.icon.alt).toBe('Oak National Academy');
    expect(nav.home.icon.width).toBe(32);
    expect(nav.home.icon.height).toBe(32);
  });

  it('lists the primary navigation items with snagging-approved labelling', () => {
    const nav = useNavItems();

    const labels = nav.primary.map((item) => item.label);
    expect(labels).toEqual([
      'Home',
      'Structured search',
      'Natural language search',
      'Admin',
      'Status',
      'Docs',
    ]);

    const routes = nav.primary.map((item) => item.href);
    expect(routes).toEqual([
      '/',
      '/structured_search',
      '/natural_language_search',
      '/admin',
      '/status',
      '/api/docs',
    ]);
  });

  it('exposes utilities metadata including the fixture toggle placeholder', () => {
    const nav = useNavItems();

    const utilityTypes = nav.utilities.map((utility) => utility.type);
    expect(utilityTypes).toContain('theme-select');
    expect(utilityTypes).toContain('fixture-toggle');

    const fixtureToggle = nav.utilities.find((utility) => utility.type === 'fixture-toggle');
    expect(fixtureToggle).toMatchObject({
      label: 'Fixture mode',
      ariaLabel: 'Select fixture mode',
    });
  });
});
