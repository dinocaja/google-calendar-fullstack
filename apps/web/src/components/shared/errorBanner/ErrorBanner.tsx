import Button from "@shared/button";
import Typography from "@shared/typography";

import type { ErrorBannerProps } from "./errorBanner.types";

import styles from "./errorBanner.module.scss";

function ErrorBanner({ message, onRetry, onDismiss }: ErrorBannerProps) {
  return (
    <div
      className={styles.banner}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={styles.content}>
        <Typography variant="body" className={styles.message}>
          {message}
        </Typography>
        <div className={styles.actions} role="group" aria-label="Error actions">
          {onRetry && (
            <Button
              variant="secondary"
              onClick={onRetry}
              className={styles.button}
              aria-label="Retry the failed action"
            >
              Retry
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="secondary"
              onClick={onDismiss}
              className={styles.dismissButton}
              aria-label="Dismiss error message"
            >
              ×
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorBanner;
