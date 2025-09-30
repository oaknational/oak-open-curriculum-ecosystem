import { JSDOM } from 'jsdom';
import { render } from '@testing-library/react';
import React from 'react';
import { OakThemeProvider, oakDefaultTheme } from '@oaknational/oak-components';
import { SearchResults } from '../apps/oak-open-curriculum-semantic-search/app/ui/SearchResults';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
(globalThis as any).window = dom.window;
(globalThis as any).document = dom.window.document;
(globalThis as any).HTMLElement = dom.window.HTMLElement;
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator });

const sampleMeta = { scope: 'lessons', total: 1, took: 12, timedOut: false } as const;
const sampleResult = {
  id: 'lesson-1',
  lesson: {
    lesson_title: 'Decimals introduction',
    subject_slug: 'maths',
    key_stage: 'ks2',
  },
  highlights: ['<em>decimal</em> place value'],
};

const { container } = render(
  <OakThemeProvider theme={oakDefaultTheme}>
    <SearchResults results={[sampleResult]} meta={sampleMeta} />
  </OakThemeProvider>,
);

globalThis.console.log(container.innerHTML);
