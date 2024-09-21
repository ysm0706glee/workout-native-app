import { createContext, useContext, useState } from "react";
import { supabase } from "@/libs/supabase";
import { Tables } from "@/types/supabase";
import {
  FormattedCalenderRecords,
  Record,
  RecordsForPost,
} from "@/types/record";
import { formateChart, formateDate } from "@/libs/format";
import { Chart } from "@/types/chart";

type RecordsContext = {
  recordsForPost: RecordsForPost | null;
  uniqueRecordsDates: string[] | null;
  formattedCalenderRecords: FormattedCalenderRecords | null;
  formattedChart: Chart[] | null;
};

const RecordsContext = createContext<RecordsContext>({
  recordsForPost: null,
  uniqueRecordsDates: null,
  formattedCalenderRecords: null,
  formattedChart: null,
});

type RecordsDispatch = {
  getLatestRecordByExerciseIdSortedBySets: (
    exerciseId: Tables<"exercises">["id"]
  ) => Promise<Tables<"records">[] | null>;
  getUniqueRecordsDates: () => Promise<string[] | null>;
  getFormattedCalenderRecordsByDate: (
    date: string
  ) => Promise<FormattedCalenderRecords | null>;
  getFormattedChartByMenuId: (
    menuId: Tables<"menus">["id"]
  ) => Promise<Chart[] | null>;
  createRecordsForPost: (exercises: Tables<"exercises">[]) => Promise<void>;
  postRecords: (
    records: RecordsForPost,
    menuId: Tables<"menus">["id"]
  ) => Promise<void>;
};

const RecordsDispatchContext = createContext<RecordsDispatch>({
  getLatestRecordByExerciseIdSortedBySets: () => {
    throw Error("no default value");
  },
  getUniqueRecordsDates: () => {
    throw Error("no default value");
  },
  getFormattedCalenderRecordsByDate: () => {
    throw Error("no default value");
  },
  getFormattedChartByMenuId: () => {
    throw Error("no default value");
  },
  createRecordsForPost: () => {
    throw Error("no default value");
  },
  postRecords: () => {
    throw Error("no default value");
  },
});

type Props = {
  children: React.ReactNode;
};

export function RecordsProvider({ children }: Props) {
  const [recordsForPost, setRecordsForPost] = useState<RecordsForPost>({});
  const [uniqueRecordsDates, setUniqueRecordsDates] = useState<string[] | null>(
    null
  );
  const [formattedCalenderRecords, setFormattedCalenderRecords] =
    useState<FormattedCalenderRecords | null>(null);
  const [formattedChart, setFormattedChart] = useState<Chart[] | null>(null);

  async function getLatestRecordByExerciseIdSortedBySets(
    exerciseId: Tables<"exercises">["id"]
  ) {
    const { data, error } = await supabase
      .from("records")
      .select("*")
      .eq("exercise_id", exerciseId)
      .order("created_at", { ascending: false })
      .order("sets", { ascending: false });
    if (error) {
      console.error(error);
    }
    return data;
  }

  async function getUniqueRecordsDates() {
    const { data, error } = await supabase.from("records").select("date");
    if (error) {
      console.error(error);
    }
    const uniqueRecordsDates = Array.from(
      new Set(data?.map((data) => data.date))
    );
    setUniqueRecordsDates(uniqueRecordsDates);
    return uniqueRecordsDates;
  }

  async function getRecordsWithMenusAnsExercisesByDate(date: string) {
    const { data, error } = await supabase
      .from("records")
      .select("*, menus (id, name, memo), exercises (*)")
      .eq("date", date);
    if (error) {
      console.error(error);
    }
    return data;
  }

  async function getFormattedCalenderRecordsByDate(date: string) {
    const data = await getRecordsWithMenusAnsExercisesByDate(date);
    if (!data || !data.length || !data[0].menus) {
      setFormattedCalenderRecords(null);
      return null;
    }
    const result: FormattedCalenderRecords = {
      menu: {
        id: data[0].menus.id,
        name: data[0].menus.name,
        memo: data[0].menus.memo,
      },
      records: {},
    };
    data.forEach((x) => {
      const { exercises, sets, reps, weight } = x;
      if (!exercises) {
        return;
      }
      if (!result.records[exercises.id]) {
        result.records[exercises.id] = {
          records: [],
          memo: exercises.memo,
        };
      }
      result.records[exercises.id].records.push({ sets, reps, weight });
    });
    setFormattedCalenderRecords(result);
    return result;
  }

  async function getRecordsByMenuId(menuId: Tables<"menus">["id"]) {
    const { data, error } = await supabase
      .from("records")
      .select("date, exercise_id, weight")
      .eq("menu_id", menuId)
      .order("date", { ascending: true });
    if (error) {
      console.error(error);
    }
    return data;
  }

  async function getFormattedChartByMenuId(menuId: Tables<"menus">["id"]) {
    const data = await getRecordsByMenuId(menuId);
    if (!data) {
      return null;
    }
    const formattedChart = formateChart(data);
    setFormattedChart(formattedChart);
    return formattedChart;
  }

  function createRecord(
    exercise: Tables<"exercises">,
    latestRecord?: Tables<"records">
  ) {
    const { id: exerciseId, memo: exerciseMemo } = exercise;
    const reps = latestRecord?.reps || 8;
    const weight = latestRecord?.weight || 0;
    const newRecord: {
      [exerciseId: Tables<"exercises">["id"]]: {
        memo?: Tables<"exercises">["memo"];
        records: Record[];
      };
    } = {
      [exerciseId]: {
        records: [{ sets: 1, reps, weight }],
      },
    };
    if (exerciseMemo) {
      newRecord[exerciseId].memo = exerciseMemo;
    }
    return newRecord;
  }

  async function createRecordsForPost(exercises: Tables<"exercises">[]) {
    const result: RecordsForPost = {};
    for (const exercise of exercises) {
      const latestRecords = await getLatestRecordByExerciseIdSortedBySets(
        exercise.id
      );
      const latestRecord = latestRecords ? latestRecords[0] : undefined;
      const newRecord = createRecord(exercise, latestRecord);
      Object.assign(result, newRecord);
    }
    setRecordsForPost(result);
  }

  async function postRecords(
    records: RecordsForPost,
    menuId: Tables<"menus">["id"]
  ) {
    const result: Omit<Tables<"records">, "created_at" | "id">[] = [];
    const date = formateDate(new Date());
    for (const [key, value] of Object.entries(records)) {
      value.records.forEach((record) => {
        result.push({
          date,
          exercise_id: Number(key),
          menu_id: menuId,
          sets: record.sets,
          reps: record.reps,
          weight: record.weight,
          memo: value.memo || null,
        });
      });
    }
    const { error } = await supabase.from("records").insert(result);
    if (error) {
      console.error(error);
    }
  }

  return (
    <RecordsContext.Provider
      value={{
        recordsForPost,
        uniqueRecordsDates,
        formattedCalenderRecords,
        formattedChart,
      }}
    >
      <RecordsDispatchContext.Provider
        value={{
          getLatestRecordByExerciseIdSortedBySets,
          getUniqueRecordsDates,
          getFormattedCalenderRecordsByDate,
          getFormattedChartByMenuId,
          createRecordsForPost,
          postRecords,
        }}
      >
        {children}
      </RecordsDispatchContext.Provider>
    </RecordsContext.Provider>
  );
}

export function useRecords() {
  return useContext(RecordsContext);
}

export function useRecordsDispatch() {
  return useContext(RecordsDispatchContext);
}
