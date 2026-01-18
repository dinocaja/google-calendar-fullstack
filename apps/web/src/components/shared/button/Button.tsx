import { classNames } from "@utils/styleUtils";

import type { ButtonProps } from "./button.types";

import styles from "./button.module.scss";

function Button({
  children,
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={classNames(
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        className
      )}
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      aria-label={ariaLabel}
      {...rest}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}

export default Button;
