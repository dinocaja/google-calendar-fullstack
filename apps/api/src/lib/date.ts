export function getDayKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getDateRangeForSync(): { timeMin: Date; timeMax: Date } {
  const now = new Date();
  const timeMin = new Date(now);
  timeMin.setMonth(now.getMonth() - 3);
  
  const timeMax = new Date(now);
  timeMax.setMonth(now.getMonth() + 3);
  
  return { timeMin, timeMax };
}

export function getDateRangeForQuery(
  range: "1" | "7" | "30"
): { startDate: Date; endDate: Date } {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(startDate);
  
  // For range "1", get only today's events (same day)
  // For range "7" or "30", add that many days
  if (range !== "1") {
    endDate.setDate(startDate.getDate() + parseInt(range));
  }
  
  endDate.setHours(23, 59, 59, 999);
  
  return { startDate, endDate };
}

export function normalizeAllDayEvent(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
}
