import { useId } from "react";

import { classNames } from "@utils/styleUtils";
import Typography from "@shared/typography";

import type { InputProps } from "./input.types";

import styles from "./input.module.scss";

function Input({ label, error, className = "", id: providedId, ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = providedId ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={classNames(styles.wrapper, className)}>
      {label && (
        <Typography variant="label" className={styles.label} htmlFor={inputId}>
          {label}
        </Typography>
      )}
      <input
        id={inputId}
        className={classNames(styles.input, error && styles.error)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <Typography
          variant="caption"
          className={styles.errorText}
          id={errorId}
          role="alert"
          aria-live="polite"
        >
          {error}
        </Typography>
      )}
    </div>
  );
}

export default Input;
