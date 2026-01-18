export interface GoogleCalendarEvent {
  id?: string | null;
  status?: string | null;
  summary?: string | null;
  start?: {
    dateTime?: string | null;
    date?: string | null;
    timeZone?: string | null;
  } | null;
  end?: {
    dateTime?: string | null;
    date?: string | null;
    timeZone?: string | null;
  } | null;
}

export interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
}

export interface CreateEventInput {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
}
