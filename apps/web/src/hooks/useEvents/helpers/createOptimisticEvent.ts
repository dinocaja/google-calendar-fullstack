import type { CalendarEvent, CreateEventFormInput } from "@app-types/events";

function createOptimisticEvent(input: CreateEventFormInput): CalendarEvent {
  const { title, date, startTime, endTime } = input;
  const startAt = `${date}T${startTime}:00`;
  const endAt = `${date}T${endTime}:00`;

  return {
    id: `optimistic-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title,
    startAt,
    endAt,
    dayKey: date,
    isOptimistic: true,
  };
}

export { createOptimisticEvent };
