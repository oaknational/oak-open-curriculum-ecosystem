'use client';

import type { JSX } from 'react';
import sc from 'styled-components';
import { RedocStandalone } from 'redoc';

const Main = sc.main`
  padding: ${(p) => p.theme.app.space.md};
`;
const Header = sc.header`
  margin-bottom: ${(p) => p.theme.app.space.sm};
`;
const H1 = sc.h1`
  margin: 0;
  font-size: ${(p) => p.theme.app.fontSizes.md};
`;
const P = sc.p`
  margin: ${(p) => `${p.theme.app.space.xs} 0 0`};
`;
const LinkA = sc.a`
  text-decoration: underline;
`;
const Frame = sc.div`
  border: 1px solid ${(p) => p.theme.app.colors.headerBorder};
  border-radius: ${(p) => p.theme.app.radii.md};
  overflow: hidden;
`;

export default function ApiDocsPage(): JSX.Element {
  const specUrl = '/api/openapi.json';
  return (
    <Main>
      <Header>
        <H1>Oak Curriculum Search API</H1>
        <P>
          OpenAPI schema:{' '}
          <LinkA href={specUrl} target="_blank" rel="noreferrer">
            {specUrl}
          </LinkA>
        </P>
      </Header>
      <Frame>
        <RedocStandalone
          specUrl={specUrl}
          options={{
            hideDownloadButton: false,
            expandResponses: 'all',
            jsonSampleExpandLevel: 'all',
            pathInMiddlePanel: true,
          }}
        />
      </Frame>
    </Main>
  );
}
