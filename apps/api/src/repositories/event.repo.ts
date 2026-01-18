import { prisma } from "../db/prisma";
import type { Event } from "@prisma/client";

export async function upsertByGoogleEventId(data: {
  googleEventId: string;
  userId: string;
  title: string;
  startAt: Date;
  endAt: Date;
  dayKey: string;
}): Promise<Event> {
  return prisma.event.upsert({
    where: { googleEventId: data.googleEventId },
    update: {
      title: data.title,
      startAt: data.startAt,
      endAt: data.endAt,
      dayKey: data.dayKey,
    },
    create: data,
  });
}

export async function findByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<Event[]> {
  return prisma.event.findMany({
    where: {
      userId,
      startAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      startAt: "asc",
    },
  });
}

export async function deleteByGoogleEventId(googleEventId: string): Promise<void> {
  await prisma.event.deleteMany({
    where: { googleEventId },
  });
}

export async function findByGoogleEventId(googleEventId: string): Promise<Event | null> {
  return prisma.event.findUnique({
    where: { googleEventId },
  });
}
