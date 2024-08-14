import { FormattedCalenderRecords } from "@/types/record";
import { Tables } from "@/types/supabase";

export type RecordsWithMenusAndExercises = Tables<"records"> & {
  menus: Pick<Tables<"menus">, "id" | "name" | "memo">;
  exercises: Tables<"exercises">;
};

export function formateDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formateMarkedDates(dates: string[]) {
  return dates.reduce(
    (acc: Record<string, { marked: boolean }>, date: string) => {
      acc[date] = { marked: true };
      return acc;
    },
    {} as Record<string, { marked: boolean }>
  );
}
