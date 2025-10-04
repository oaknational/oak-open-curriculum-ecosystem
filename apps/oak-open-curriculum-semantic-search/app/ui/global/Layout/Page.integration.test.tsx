import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Providers } from '../../../lib/Providers';
import { PageContainer, PageContent } from './Page';

describe('Page layout primitives', () => {
  it('renders a main container with page content', () => {
    render(
      <Providers initialMode="light">
        <PageContainer as="main" data-testid="page">
          <PageContent>
            <p>child</p>
          </PageContent>
        </PageContainer>
      </Providers>,
    );

    const page = screen.getByTestId('page');
    expect(page.tagName.toLowerCase()).toBe('main');
    expect(screen.getByText('child')).toBeInTheDocument();
  });
});
