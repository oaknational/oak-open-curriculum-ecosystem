import type { JSX, PropsWithChildren } from 'react';
import { OakBox } from '@oaknational/oak-components';
import styledComponents from 'styled-components';

import { getSpacingVar, type SpacingToken } from './spacing';

interface ClusterProps {
  readonly gap?: SpacingToken;
  readonly role?: string;
  readonly as?: keyof JSX.IntrinsicElements | typeof OakBox;
  readonly className?: string;
}

const ClusterRoot = styledComponents(OakBox)<{ $gap: SpacingToken }>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ $gap }) => getSpacingVar($gap)};
`;

export function Cluster({
  gap = 'cluster',
  children,
  ...rest
}: PropsWithChildren<ClusterProps>): JSX.Element {
  return (
    <ClusterRoot $gap={gap} {...rest}>
      {children}
    </ClusterRoot>
  );
}
