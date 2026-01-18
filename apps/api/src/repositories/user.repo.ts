import { prisma } from "../db/prisma";
import type { User } from "@prisma/client";

export async function findById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function findByGoogleUserId(googleUserId: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { googleUserId },
  });
}

export async function upsertByGoogleId(data: {
  googleUserId: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken?: string;
}): Promise<User> {
  const existing = await findByGoogleUserId(data.googleUserId);
  
  return prisma.user.upsert({
    where: { googleUserId: data.googleUserId },
    update: {
      email: data.email,
      name: data.name,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? existing?.refreshToken ?? data.accessToken,
    },
    create: {
      googleUserId: data.googleUserId,
      email: data.email,
      name: data.name,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? data.accessToken,
    },
  });
}

export async function updateTokens(
  userId: string,
  accessToken: string,
  refreshToken?: string | null
): Promise<User> {
  const updateData: { accessToken: string; refreshToken?: string } = {
    accessToken,
  };
  
  if (refreshToken) {
    updateData.refreshToken = refreshToken;
  }
  
  return prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
}
