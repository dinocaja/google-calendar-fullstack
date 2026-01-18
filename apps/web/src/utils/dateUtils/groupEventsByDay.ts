import { format, parseISO } from "date-fns";

import type { CalendarEvent, GroupedEvents } from "@app-types/events";

function groupEventsByDay(events: CalendarEvent[]): GroupedEvents[] {
  const groupMap = new Map<string, CalendarEvent[]>();

  for (const event of events) {
    const { dayKey } = event;
    if (!groupMap.has(dayKey)) {
      groupMap.set(dayKey, []);
    }
    groupMap.get(dayKey)!.push(event);
  }

  const grouped: GroupedEvents[] = Array.from(groupMap.entries())
    .sort(([dayKeyA], [dayKeyB]) => dayKeyA.localeCompare(dayKeyB))
    .map(([dayKey, dayEvents]) => {
      const date = parseISO(dayKey);
      const label = format(date, "EEEE, MMMM d");

      const sortedEvents = [...dayEvents].sort((a, b) => 
        a.startAt.localeCompare(b.startAt)
      );
      return { label, dateKey: dayKey, events: sortedEvents };
    });

  return grouped;
}

export { groupEventsByDay };
