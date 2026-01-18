import { google, calendar_v3 } from "googleapis";
import { GaxiosError } from "gaxios";
import { getAuthenticatedClient } from "../config/google";
import { AppError } from "../lib/errors";
import { logger } from "../lib/logger";
import * as userRepo from "../repositories/user.repo";
import type { User } from "@prisma/client";
import type { GoogleCalendarEvent } from "../types/google";

function isTokenExpiredError(error: unknown): boolean {
  if (error instanceof GaxiosError) {
    return (
      error.response?.status === 401 ||
      error.code === "401" ||
      error.message?.includes("invalid_grant") ||
      error.message?.includes("Token has been expired")
    );
  }
  return false;
}

function isRateLimitError(error: unknown): boolean {
  if (error instanceof GaxiosError) {
    return error.response?.status === 429 || error.response?.status === 403;
  }
  return false;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (isRateLimitError(error) && attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        logger.warn({ attempt, delay }, "Rate limited, retrying with backoff");
        await sleep(delay);
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
}

async function withTokenRefresh<T>(
  user: User,
  operation: (calendar: calendar_v3.Calendar) => Promise<T>
): Promise<T> {
  const client = getAuthenticatedClient(user);
  const calendar = google.calendar({ version: "v3", auth: client });
  
  const executeOperation = async (cal: calendar_v3.Calendar): Promise<T> => {
    return withRetry(() => operation(cal));
  };
  
  try {
    return await executeOperation(calendar);
  } catch (error: unknown) {
    if (isTokenExpiredError(error)) {
      logger.info({ userId: user.id }, "Refreshing expired access token");
      
      try {
        const { credentials } = await client.refreshAccessToken();
        
        if (!credentials.access_token) {
          throw AppError.googleApiError("Failed to refresh access token");
        }
        
        await userRepo.updateTokens(
          user.id,
          credentials.access_token,
          credentials.refresh_token
        );
        
        client.setCredentials(credentials);
        const newCalendar = google.calendar({ version: "v3", auth: client });
        
        return await executeOperation(newCalendar);
      } catch (refreshError) {
        logger.warn({ userId: user.id }, "Token refresh failed");
        throw AppError.unauthorized("Failed to refresh access token. Please login again.");
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw AppError.googleApiError("Google Calendar API error", { message: errorMessage });
  }
}

export async function listEvents(
  user: User,
  timeMin: Date,
  timeMax: Date
): Promise<GoogleCalendarEvent[]> {
  return withTokenRefresh(user, async (calendar) => {
    const allEvents: GoogleCalendarEvent[] = [];
    let pageToken: string | undefined;
    
    do {
      const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        maxResults: 250,
        singleEvents: true,
        orderBy: "startTime",
        pageToken,
        showDeleted: true,
      });
      
      if (response.data.items) {
        allEvents.push(...response.data.items);
      }
      
      pageToken = response.data.nextPageToken ?? undefined;
    } while (pageToken);
    
    return allEvents;
  });
}

export async function createEvent(
  user: User,
  eventData: {
    title: string;
    startDateTime: string;
    endDateTime: string;
    timezone: string;
  }
): Promise<GoogleCalendarEvent> {
  return withTokenRefresh(user, async (calendar) => {
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: eventData.title,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: eventData.timezone,
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: eventData.timezone,
        },
      },
    });
    
    if (!response.data.id) {
      throw AppError.googleApiError("Event created but no ID returned");
    }
    
    return response.data;
  });
}
