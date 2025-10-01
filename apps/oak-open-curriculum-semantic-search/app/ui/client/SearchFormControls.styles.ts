import styledComponents from 'styled-components';
import { getAppTheme } from '../themes/app-theme-helpers';

export const PrimarySubmitButton = styledComponents.button`
  align-items: center;
  background-color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDeep};
  border-color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimary};
  color: ${({ theme }) => getAppTheme(theme).uiColors['bg-btn-secondary']};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.pill};
  cursor: pointer;
  display: inline-flex;
  font-family: ${({ theme }) => getAppTheme(theme).app.typography.bodyStrong.fontFamily};
  font-size: ${({ theme }) => getAppTheme(theme).app.typography.bodyStrong.fontSizeRem};
  font-weight: ${({ theme }) => getAppTheme(theme).app.typography.bodyStrong.fontWeight};
  gap: var(--app-gap-cluster);
  justify-content: center;
  line-height: ${({ theme }) => getAppTheme(theme).app.typography.bodyStrong.lineHeight};
  padding-block: calc(var(--app-gap-cluster) / 1.5);
  padding-inline: var(--app-gap-section);
  text-decoration: none;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
    color 0.15s ease-in-out;

  &:hover,
  &:active {
    color: ${({ theme }) => getAppTheme(theme).app.colors.textPrimary};
    background-color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryBright};
    border: 2px solid ${({ theme }) => getAppTheme(theme).app.colors.borderStrong};
  }

  &:disabled {
    background-color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDark};
    border-color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDark};
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryBright};
    outline-offset: 2px;
  }
`;
