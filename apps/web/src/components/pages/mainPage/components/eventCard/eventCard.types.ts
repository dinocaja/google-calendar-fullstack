import type { CalendarEvent } from "@app-types/events";

interface EventCardProps {
  event: CalendarEvent;
  isPending?: boolean;
}

export type { EventCardProps };
