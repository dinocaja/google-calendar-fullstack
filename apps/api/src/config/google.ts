import { google, Auth } from "googleapis";
import { env } from "./env";
import type { User } from "@prisma/client";

export function getOAuth2Client(): Auth.OAuth2Client {
  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
  );
}

export function getAuthenticatedClient(user: User): Auth.OAuth2Client {
  const client = getOAuth2Client();
  client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });
  return client;
}
