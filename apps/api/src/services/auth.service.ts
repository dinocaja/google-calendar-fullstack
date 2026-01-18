import { randomBytes } from "crypto";
import { google } from "googleapis";
import { getOAuth2Client } from "../config/google";
import { GOOGLE_SCOPES } from "../config/constants";
import { AppError } from "../lib/errors";
import type { GoogleUserInfo } from "../types/google";

export function generateAuthUrl(): { url: string; state: string } {
  const state = randomBytes(32).toString("hex");
  const client = getOAuth2Client();
  
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: GOOGLE_SCOPES,
    prompt: "consent",
    state,
  });
  
  return { url, state };
}

export async function exchangeCode(code: string): Promise<{
  accessToken: string;
  refreshToken?: string;
}> {
  const client = getOAuth2Client();
  
  try {
    const { tokens } = await client.getToken(code);
    
    if (!tokens.access_token) {
      throw AppError.googleApiError("No access token received from Google");
    }
    
    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? undefined,
    };
  } catch (error) {
    throw AppError.googleApiError("Failed to exchange authorization code", error);
  }
}

export async function getUserProfile(accessToken: string): Promise<GoogleUserInfo> {
  const client = getOAuth2Client();
  client.setCredentials({ access_token: accessToken });
  
  try {
    const oauth2 = google.oauth2({ version: "v2", auth: client });
    const { data } = await oauth2.userinfo.get();
    
    if (!data.id || !data.email || !data.name) {
      throw AppError.googleApiError("Incomplete user profile data");
    }
    
    return {
      id: data.id,
      email: data.email,
      name: data.name,
    };
  } catch (error) {
    throw AppError.googleApiError("Failed to fetch user profile", error);
  }
}
