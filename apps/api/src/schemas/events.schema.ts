import { z } from "zod";

const MAX_TITLE_LENGTH = 1000;

export const createEventSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(MAX_TITLE_LENGTH, `Title must be at most ${MAX_TITLE_LENGTH} characters`)
      .trim(),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
      .refine((date) => {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime());
      }, "Invalid date"),
    startTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Start time must be HH:mm")
      .refine((time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      }, "Invalid time"),
    endTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "End time must be HH:mm")
      .refine((time) => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      }, "Invalid time"),
    timezone: z
      .string()
      .min(1, "Timezone is required"),
  }),
});

export const getEventsSchema = z.object({
  query: z.object({
    range: z.enum(["1", "7", "30"]).default("7"),
  }),
});

export type CreateEventBody = z.infer<typeof createEventSchema>["body"];
export type GetEventsQuery = z.infer<typeof getEventsSchema>["query"];
