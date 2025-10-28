import type { JSX, ReactNode } from 'react';
import { OperationsContent, OperationsPage } from './OperationsLayout.styles';

interface OperationsLayoutProps {
  readonly children: ReactNode;
  readonly fixtureNotice?: ReactNode;
  readonly testId?: string;
}

export function OperationsLayout({
  children,
  fixtureNotice,
  testId = 'operations-page',
}: OperationsLayoutProps): JSX.Element {
  return (
    <OperationsPage as="main" data-testid={testId} $background="bg-primary" $color="text-primary">
      {fixtureNotice}
      <OperationsContent>{children}</OperationsContent>
    </OperationsPage>
  );
}

export { OperationsSection, OperationsBanner } from './OperationsLayout.styles';
