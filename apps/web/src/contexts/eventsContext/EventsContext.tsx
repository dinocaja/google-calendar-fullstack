import { createContext } from "react";

import useEvents from "@hooks/useEvents";

import type { EventsContextValue, EventsProviderProps } from "./eventsContext.types";

const EventsContext = createContext<EventsContextValue | undefined>(undefined);

function EventsProvider({ children }: EventsProviderProps) {
  const eventsData = useEvents();

  return (
    <EventsContext.Provider value={eventsData}>
      {children}
    </EventsContext.Provider>
  );
}

export { EventsContext, EventsProvider };
