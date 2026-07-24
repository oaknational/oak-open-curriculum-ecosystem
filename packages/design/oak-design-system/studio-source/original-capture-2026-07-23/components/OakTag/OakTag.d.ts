import * as React from "react";
/** Functional tag / badge on a pastel fill. Matches OakTagFunctional. */
export interface OakTagProps {
  children?: React.ReactNode;
  /** pastel family @default "lemon" */
  color?: "lemon" | "mint" | "aqua" | "lavender" | "pink" | "grey" | "white";
  /** leading icon name from assets/icons, e.g. "free-tag" */
  icon?: string;
  /** trailing icon name, e.g. "cross" for dismissible tags */
  trailingIcon?: string;
  style?: React.CSSProperties;
}
export function OakTag(props: OakTagProps): JSX.Element;
