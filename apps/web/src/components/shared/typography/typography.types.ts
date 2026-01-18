import type { ReactNode, HTMLAttributes, LabelHTMLAttributes } from "react";

type VariantType = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "caption" | "label";

type TypographyProps = 
  | ({
      variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body" | "caption";
      children: ReactNode;
    } & HTMLAttributes<HTMLElement>)
  | ({
      variant: "label";
      children: ReactNode;
    } & LabelHTMLAttributes<HTMLLabelElement>);

export type { VariantType, TypographyProps };
