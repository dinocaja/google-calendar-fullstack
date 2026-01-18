import { useContext } from "react";

import { EventsContext } from "./EventsContext";
import type { EventsContextValue } from "./eventsContext.types";

function useEventsContext(): EventsContextValue {
  const context = useContext(EventsContext);

  if (context === undefined) {
    throw new Error("useEventsContext must be used within an EventsProvider");
  }

  return context;
}

export { useEventsContext };
