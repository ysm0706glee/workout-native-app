import { createContext, useContext, useState } from "react";
import { supabase } from "@/libs/supabase";
import { Tables } from "@/types/supabase";
import { Record, Records } from "@/types/record";
import { formateDate } from "@/libs/date";

type RecordsContext = {
  records: Records;
};

const RecordsContext = createContext<RecordsContext>({
  records: {},
});

type RecordsDispatch = {
  getLatestRecordByExerciseIdSortedBySets: (
    exerciseId: Tables<"exercises">["id"]
  ) => Promise<Tables<"records">[] | null>;
  createRecords: (exercises: Tables<"exercises">[]) => Promise<void>;
  postRecords: (
    records: Records,
    menuId: Tables<"menus">["id"]
  ) => Promise<void>;
};

const RecordsDispatchContext = createContext<RecordsDispatch>({
  getLatestRecordByExerciseIdSortedBySets: () => {
    throw Error("no default value");
  },
  createRecords: () => {
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
  const [records, setRecords] = useState<Records>({});

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

  async function createRecords(exercises: Tables<"exercises">[]) {
    const result: Records = {};
    for (const exercise of exercises) {
      const latestRecords = await getLatestRecordByExerciseIdSortedBySets(
        exercise.id
      );
      const latestRecord = latestRecords ? latestRecords[0] : undefined;
      const newRecord = createRecord(exercise, latestRecord);
      Object.assign(result, newRecord);
    }
    setRecords(result);
  }

  async function postRecords(records: Records, menuId: Tables<"menus">["id"]) {
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
    <RecordsContext.Provider value={{ records }}>
      <RecordsDispatchContext.Provider
        value={{
          getLatestRecordByExerciseIdSortedBySets,
          createRecords,
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
