const DateRange = {
  day: "1",
  week: "7",
  month: "30",
} as const;

type DateRange = typeof DateRange[keyof typeof DateRange];

interface CalendarEvent {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  dayKey: string;
  isOptimistic?: boolean;
}

interface GroupedEvents {
  label: string;
  dateKey: string;
  events: CalendarEvent[];
}

interface CreateEventFormInput {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface CreateEventInput extends CreateEventFormInput {
  timezone: string;
}

export { DateRange };
export type { DateRange as DateRangeType, CalendarEvent, GroupedEvents, CreateEventInput, CreateEventFormInput };
