import { format, parseISO, startOfWeek, endOfWeek } from "date-fns";

import type { CalendarEvent, GroupedEvents } from "@app-types/events";

function groupEventsByWeek(events: CalendarEvent[]): GroupedEvents[] {
  const groupMap = new Map<string, CalendarEvent[]>();

  for (const event of events) {
    const date = parseISO(event.dayKey);
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekKey = format(weekStart, "yyyy-MM-dd");

    if (!groupMap.has(weekKey)) {
      groupMap.set(weekKey, []);
    }
    groupMap.get(weekKey)?.push(event);
  }

  const grouped: GroupedEvents[] = Array.from(groupMap.entries())
    .sort(([weekKeyA], [weekKeyB]) => weekKeyA.localeCompare(weekKeyB))
    .map(([weekKey, weekEvents]) => {
      const weekStart = parseISO(weekKey);
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const label = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`;
      
      const sortedEvents = [...weekEvents].sort((a, b) => 
        a.startAt.localeCompare(b.startAt)
      );
      return { label, dateKey: weekKey, events: sortedEvents };
    });

  return grouped;
}

export { groupEventsByWeek };
