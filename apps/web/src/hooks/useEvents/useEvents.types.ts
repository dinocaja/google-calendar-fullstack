import type { CalendarEvent, GroupedEvents, CreateEventFormInput, DateRangeType } from "@app-types/events";

interface UseEventsReturn {
  events: CalendarEvent[];
  groupedEvents: GroupedEvents[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  range: DateRangeType;
  setRange: (range: DateRangeType) => void;
  fetchEvents: () => Promise<void>;
  syncEvents: () => Promise<void>;
  createEvent: (input: CreateEventFormInput) => Promise<void>;
  clearError: () => void;
}

export type { UseEventsReturn };
