import { useEventsContext } from "@contexts/eventsContext";
import Typography from "@shared/typography";

import EventCard from "../eventCard";

import styles from "./eventsList.module.scss";

function EventsList() {
  const { groupedEvents, isSyncing } = useEventsContext();
  const totalEvents = groupedEvents.reduce((sum, group) => sum + group.events.length, 0);

  if (groupedEvents.length === 0) {
    return (
      <div
        className={styles.emptyContainer}
        role="status"
        aria-live="polite"
      >
        <Typography variant="body" className={styles.empty}>
          No events in this range
        </Typography>
      </div>
    );
  }

  return (
    <section
      className={styles.container}
      aria-busy={isSyncing}
      aria-live="polite"
      aria-label={`Calendar events: ${totalEvents} event${totalEvents !== 1 ? "s" : ""} found`}
    >
      <Typography variant="h2">
        {totalEvents} event{totalEvents !== 1 ? "s" : ""} in selected range
      </Typography>
      {groupedEvents.map((group) => (
        <section
          key={group.dateKey}
          className={styles.group}
          aria-labelledby={`group-${group.dateKey}`}
        >
          <Typography
            variant="h3"
            className={styles.groupLabel}
            id={`group-${group.dateKey}`}
          >
            {group.label}
            <span className={styles.visuallyHidden}>
              , {group.events.length} event{group.events.length !== 1 ? "s" : ""}
            </span>
          </Typography>
          <ul className={styles.events} role="list" aria-label={`Events for ${group.label}`}>
            {group.events.map((event) => (
              <li key={event.id} className={styles.eventItem}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}

export default EventsList;
