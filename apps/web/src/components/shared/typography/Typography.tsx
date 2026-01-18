import { createElement } from "react";
import { classNames } from "@utils/styleUtils";

import type { TypographyProps, VariantType } from "./typography.types";

import styles from "./typography.module.scss";

const VARIANT_COMPONENT_MAP: Record<VariantType, keyof React.JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  caption: "span",
  label: "label",
  body: "p",
};

function Typography({
  variant = "body",
  children,
  className = "",
  ...rest
}: TypographyProps) {
  const tag = VARIANT_COMPONENT_MAP[variant];

  return createElement(
    tag,
    {
      className: classNames(styles[variant], className),
      ...rest,
    },
    children
  );
}

export default Typography;
