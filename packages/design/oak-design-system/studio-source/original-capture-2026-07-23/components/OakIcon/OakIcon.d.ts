import * as React from "react";
/** Flat black stroke icon from the bundled Oak set (assets/icons). See icons.json for the full name map. */
export interface OakIconProps {
  /** icon file name without extension, e.g. "arrow-right", "download", "subject-maths" */
  name: string;
  /** square size in px @default 24 */
  size?: number;
  /** render white (for dark surfaces) @default false */
  invert?: boolean;
  alt?: string;
  style?: React.CSSProperties;
}
export function OakIcon(props: OakIconProps): JSX.Element;
