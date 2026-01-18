import type { ReactNode } from "react";
import type { CalendarEvent, GroupedEvents, CreateEventFormInput, DateRangeType } from "@app-types/events";

interface EventsContextValue {
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

interface EventsProviderProps {
  children: ReactNode;
}

export type { EventsContextValue, EventsProviderProps };
