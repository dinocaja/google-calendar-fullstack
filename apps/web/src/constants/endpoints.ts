const AUTH_ENDPOINTS = {
  ME: "/auth/me",
  GOOGLE: "/auth/google",
  LOGOUT: "/auth/logout",
} as const;

const EVENTS_ENDPOINTS = {
  LIST: "/events",
  SYNC: "/events/sync",
  CREATE: "/events",
} as const;

export { AUTH_ENDPOINTS, EVENTS_ENDPOINTS };
