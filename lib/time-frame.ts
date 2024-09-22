import { sql } from "drizzle-orm";

export type Timeframe =
  | "thisWeek"
  | "thisMonth"
  | "last6Months"
  | "lastYear"
  | "allTime";

export default function getTimeframeCondition(timeframe: Timeframe) {
  const today = new Date();
  let startDate: Date;

  switch (timeframe) {
    case "thisWeek":
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay());
      firstDayOfWeek.setHours(0, 0, 0, 0);
      startDate = firstDayOfWeek;
      break;
    case "thisMonth":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "last6Months":
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 6);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "lastYear":
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "allTime":
    default:
      return new Date(2024, 8, 1);
  }

  return startDate;
}
