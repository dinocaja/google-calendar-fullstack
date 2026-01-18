import { classNames } from "@utils/styleUtils";

import type { SpinnerProps } from "./spinner.types";

import styles from "./spinner.module.scss";

function Spinner({ className = "", label = "Loading" }: SpinnerProps) {
  return (
    <div
      className={classNames(styles.spinner, className)}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className={styles.visuallyHidden}>{label}</span>
    </div>
  );
}

export default Spinner;
