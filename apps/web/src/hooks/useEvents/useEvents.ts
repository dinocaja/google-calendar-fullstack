import { useState, useCallback, useMemo, useEffect } from "react";

import { apiClient } from "@utils/apiClient";
import { groupEventsByDay, groupEventsByWeek } from "@utils/dateUtils";
import { EVENTS_ENDPOINTS } from "@constants/endpoints";
import { DateRange } from "@app-types/events";
import type { CalendarEvent, CreateEventInput, CreateEventFormInput, DateRangeType } from "@app-types/events";
import type { ApiResponse, SyncResult } from "@app-types/api";

import { createOptimisticEvent } from "./helpers";
import type { UseEventsReturn } from "./useEvents.types";

function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<DateRangeType>(DateRange.week);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<ApiResponse<CalendarEvent[]>>(
        `${EVENTS_ENDPOINTS.LIST}?range=${range}`
      );
      setEvents(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch events";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [range]);

  const syncEvents = useCallback(async () => {
    try {
      setIsSyncing(true);
      setError(null);
      // @TODO: Optimisation: have sync return events.
      await apiClient.post<ApiResponse<SyncResult>>(EVENTS_ENDPOINTS.SYNC);
      await fetchEvents();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sync events";
      setError(errorMessage);
    } finally {
      setIsSyncing(false);
    }
  }, [fetchEvents]);

  const createEvent = useCallback(
    async (input: CreateEventFormInput) => {
      const inputWithTimezone: CreateEventInput = {
        ...input,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      
      const optimisticEvent = createOptimisticEvent(input);
      
      // Optimistically add the event
      setEvents((prev) => [...prev, optimisticEvent]);
      setError(null);

      try {
        // @TODO: Optimisation: have create return event.
        await apiClient.post<ApiResponse<CalendarEvent>>(EVENTS_ENDPOINTS.CREATE, inputWithTimezone);
        await fetchEvents();
      } catch (err) {
        // Rollback: remove the optimistic event
        setEvents((prev) => prev.filter((e) => e.id !== optimisticEvent.id));
        const errorMessage = err instanceof Error ? err.message : "Failed to create event";
        setError(errorMessage);
        throw err;
      }
    },
    [fetchEvents]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const groupedEvents = useMemo(() => {
    if (range === DateRange.month) {
      return groupEventsByWeek(events);
    }
    return groupEventsByDay(events);
  }, [events, range]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    groupedEvents,
    isLoading,
    isSyncing,
    error,
    range,
    setRange,
    fetchEvents,
    syncEvents,
    createEvent,
    clearError,
  };
}

export default useEvents;
