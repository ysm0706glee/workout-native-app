import { Chart } from "@/types/chart";
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

export function formateChart(
  dateAndWeightRecords: Pick<
    Tables<"records">,
    "date" | "exercise_id" | "weight"
  >[]
) {
  const result: Chart[] = [];
  dateAndWeightRecords.forEach((dateAndWeightRecord) => {
    const { date, exercise_id, weight } = dateAndWeightRecord;
    const idFound = result.find((x) => x[exercise_id]);
    if (idFound) {
      const prevWeight = idFound[exercise_id].slice(-1)[0].value;
      if (prevWeight < weight) {
        idFound[exercise_id].push({ value: weight, label: date });
      }
    } else {
      result.push({ [exercise_id]: [{ value: weight, label: date }] });
    }
  });
  return result;
}
