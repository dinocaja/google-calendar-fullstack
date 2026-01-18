import { format, parseISO } from "date-fns";

import Typography from "@shared/typography";

import type { EventCardProps } from "./eventCard.types";

import styles from "./eventCard.module.scss";

function EventCard({ event }: EventCardProps) {
  const startDate = parseISO(event.startAt);
  const endDate = parseISO(event.endAt);
  const startTime = format(startDate, "h:mm a");
  const endTime = format(endDate, "h:mm a");

  const isPending = event.isOptimistic;
  const cardClassName = isPending
    ? `${styles.card} ${styles.pending}`
    : styles.card;

  return (
    <article
      className={cardClassName}
      aria-label={`${event.title}, from ${startTime} to ${endTime}${isPending ? ", saving" : ""}`}
      aria-busy={isPending}
    >
      <Typography variant="caption" className={styles.time}>
        <time dateTime={event.startAt}>{startTime}</time>
        <span aria-hidden="true"> - </span>
        <span className={styles.visuallyHidden}>to</span>
        <time dateTime={event.endAt}>{endTime}</time>
      </Typography>
      <Typography variant="body" className={styles.title}>
        {event.title}
      </Typography>
      {isPending && (
        <span className={styles.pendingIndicator} aria-hidden="true" />
      )}
    </article>
  );
}

export default EventCard;
