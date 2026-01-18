export const SYNC_MONTHS_RANGE = 3;

export const GOOGLE_SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/calendar.events",
];

export const JWT_COOKIE_NAME = "auth_token";
export const STATE_COOKIE_NAME = "oauth_state";

export const JWT_EXPIRES_IN = "30d";
export const STATE_COOKIE_MAX_AGE = 10 * 60 * 1000;
export const AUTH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;

export const SYNC_BATCH_SIZE = 50;
export const GOOGLE_API_MAX_RESULTS = 250;
export const GOOGLE_API_RETRY_ATTEMPTS = 3;
export const GOOGLE_API_RETRY_BASE_DELAY_MS = 1000;

export const MAX_EVENT_TITLE_LENGTH = 1000;
