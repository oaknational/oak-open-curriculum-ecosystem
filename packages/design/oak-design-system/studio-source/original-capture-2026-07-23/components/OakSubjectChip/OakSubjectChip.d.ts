import * as React from "react";
/** Subject icon in a pastel circle with 2px black border — used on subject cards and lesson headers. */
export interface OakSubjectChipProps {
  /** built-in subject key (english, maths, science, history, geography, art, music, computing, french, spanish, drama, pe) @default "english" */
  subject?: string;
  /** diameter in px @default 48 */
  size?: number;
  /** override icon name from assets/icons (e.g. "subject-latin" for subjects beyond the built-ins) */
  icon?: string;
  /** override circle colour */
  bg?: string;
  style?: React.CSSProperties;
}
export function OakSubjectChip(props: OakSubjectChipProps): JSX.Element;
