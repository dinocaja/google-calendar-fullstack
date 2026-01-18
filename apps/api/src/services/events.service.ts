import type { User, Event } from "@prisma/client";
import * as eventRepo from "../repositories/event.repo";
import * as googleCalendarService from "./googleCalendar.service";
import { getDateRangeForSync, getDateRangeForQuery, getDayKey, normalizeAllDayEvent } from "../lib/date";
import { AppError } from "../lib/errors";
import { logger } from "../lib/logger";
import type { SyncResult } from "../types/api";
import type { GoogleCalendarEvent, CreateEventInput } from "../types/google";

function parseGoogleDateTime(dateTime: string, timeZone?: string | null): Date {
  // If dateTime already has timezone info (Z or +/-offset), parse directly
  if (dateTime.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(dateTime)) {
    return new Date(dateTime);
  }
  
  // If dateTime has no offset but we have a timeZone, interpret it in that timezone
  if (timeZone) {
    const match = dateTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
    if (match) {
      const [, year, month, day, hours, minutes, seconds] = match.map(Number);
      
      // Create a date in UTC with these values
      const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
      
      // Calculate the timezone offset
      const utcString = utcDate.toLocaleString("en-US", { timeZone: "UTC" });
      const tzString = utcDate.toLocaleString("en-US", { timeZone });
      
      const utcParsed = new Date(utcString);
      const tzParsed = new Date(tzString);
      
      const offsetMs = tzParsed.getTime() - utcParsed.getTime();
      
      // Convert from timezone local to UTC
      return new Date(utcDate.getTime() - offsetMs);
    }
  }
  
  return new Date(dateTime);
}

function mapGoogleEventToDb(event: GoogleCalendarEvent, userId: string) {
  const title = event.summary || "(No title)";
  
  let startAt: Date;
  let endAt: Date;
  
  if (event.start?.dateTime) {
    startAt = parseGoogleDateTime(event.start.dateTime, event.start.timeZone);
  } else if (event.start?.date) {
    startAt = normalizeAllDayEvent(event.start.date);
  } else {
    throw new Error("Event has no start time");
  }
  
  if (event.end?.dateTime) {
    endAt = parseGoogleDateTime(event.end.dateTime, event.end.timeZone);
  } else if (event.end?.date) {
    endAt = normalizeAllDayEvent(event.end.date);
  } else {
    throw new Error("Event has no end time");
  }
  
  const dayKey = getDayKey(startAt);
  
  return {
    googleEventId: event.id!,
    userId,
    title,
    startAt,
    endAt,
    dayKey,
  };
}

export async function syncUserEvents(user: User): Promise<SyncResult> {
  const { timeMin, timeMax } = getDateRangeForSync();
  
  logger.info(
    { userId: user.id, timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString() },
    "Starting calendar sync"
  );
  
  const googleEvents = await googleCalendarService.listEvents(user, timeMin, timeMax);
  
  const eventsToUpsert: Array<{
    googleEventId: string;
    userId: string;
    title: string;
    startAt: Date;
    endAt: Date;
    dayKey: string;
  }> = [];
  const eventsToDelete: string[] = [];
  let skipped = 0;
  
  for (const googleEvent of googleEvents) {
    if (!googleEvent.id) {
      skipped++;
      continue;
    }
    
    if (googleEvent.status === "cancelled") {
      eventsToDelete.push(googleEvent.id);
    } else {
      try {
        logger.info(
          {
            eventId: googleEvent.id,
            summary: googleEvent.summary,
            startDateTime: googleEvent.start?.dateTime,
            startTimeZone: googleEvent.start?.timeZone,
            endDateTime: googleEvent.end?.dateTime,
            endTimeZone: googleEvent.end?.timeZone,
          },
          "Raw Google event data"
        );
        
        const dbData = mapGoogleEventToDb(googleEvent, user.id);
        
        logger.info(
          {
            eventId: googleEvent.id,
            startAtUtc: dbData.startAt.toISOString(),
            endAtUtc: dbData.endAt.toISOString(),
          },
          "Event converted to UTC"
        );
        
        eventsToUpsert.push(dbData);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        logger.warn(
          { userId: user.id, eventId: googleEvent.id, error: message },
          "Failed to map event"
        );
        skipped++;
      }
    }
  }

  let upserted = 0;
  let deleted = 0;

  const BATCH_SIZE = 50;
  for (let i = 0; i < eventsToUpsert.length; i += BATCH_SIZE) {
    const batch = eventsToUpsert.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map((data) => eventRepo.upsertByGoogleEventId(data)));
    upserted += batch.length;
  }

  for (const googleEventId of eventsToDelete) {
    await eventRepo.deleteByGoogleEventId(googleEventId);
    deleted++;
  }
  
  logger.info(
    { userId: user.id, fetched: googleEvents.length, upserted, deleted, skipped },
    "Calendar sync completed"
  );
  
  return {
    fetched: googleEvents.length,
    upserted,
    deleted,
  };
}

export async function getEventsForRange(
  userId: string,
  range: "1" | "7" | "30"
): Promise<Event[]> {
  const { startDate, endDate } = getDateRangeForQuery(range);
  return eventRepo.findByDateRange(userId, startDate, endDate);
}

export async function createEvent(
  user: User,
  input: CreateEventInput
): Promise<Event> {
  const { title, date, startTime, endTime, timezone } = input;
  
  if (endTime <= startTime) {
    throw AppError.badRequest("End time must be after start time");
  }
  
  const googleEvent = await googleCalendarService.createEvent(user, {
    title,
    startDateTime: `${date}T${startTime}:00`,
    endDateTime: `${date}T${endTime}:00`,
    timezone,
  });
  
  logger.info(
    { 
      googleEventId: googleEvent.id,
      startDateTime: googleEvent.start?.dateTime,
      startTimeZone: googleEvent.start?.timeZone,
      endDateTime: googleEvent.end?.dateTime,
      endTimeZone: googleEvent.end?.timeZone,
    },
    "Google Calendar event created - raw response"
  );
  
  const dbData = mapGoogleEventToDb(googleEvent, user.id);
  
  logger.info(
    {
      googleEventId: googleEvent.id,
      startAtUtc: dbData.startAt.toISOString(),
      endAtUtc: dbData.endAt.toISOString(),
    },
    "Event converted to UTC for database"
  );
  
  return eventRepo.upsertByGoogleEventId(dbData);
}
