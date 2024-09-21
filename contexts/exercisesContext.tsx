import { createContext, useContext, useState } from "react";
import { supabase } from "@/libs/supabase";
import { Tables } from "@/types/supabase";

type ExercisesContext = {
  exercises: Tables<"exercises">[];
};

const ExercisesContext = createContext<ExercisesContext>({
  exercises: [],
});

type ExercisesDispatch = {
  getMenuExercises: (
    menuId: Tables<"menus">["id"]
  ) => Promise<Tables<"exercises">[]>;
  getExerciseById: (
    exerciseId: Tables<"exercises">["id"]
  ) => Promise<Tables<"exercises">>;
  deleteMenusExercises: (
    menuId: Tables<"menus">["id"],
    exercisesId: Tables<"exercises">["id"]
  ) => Promise<void>;
  postExercises: (
    name: Tables<"exercises">["name"],
    memo: Tables<"exercises">["memo"]
  ) => Promise<Tables<"exercises">[]>;
  postMenusExercises: (
    menuId: Tables<"menus">["id"],
    exerciseId: Tables<"exercises">["id"]
  ) => Promise<void>;
};

const ExercisesDispatchContext = createContext<ExercisesDispatch>({
  getMenuExercises: () => {
    throw Error("no default value");
  },
  getExerciseById: () => {
    throw Error("no default value");
  },
  deleteMenusExercises: () => {
    throw Error("no default value");
  },
  postExercises: () => {
    throw Error("no default value");
  },
  postMenusExercises: () => {
    throw Error("no default value");
  },
});

type Props = {
  children: React.ReactNode;
};

export function ExercisesProvider({ children }: Props) {
  const [exercises, setExercises] = useState<Tables<"exercises">[]>([]);

  async function getMenuExercises(menuId: Tables<"menus">["id"]) {
    const { data, error } = await supabase
      .from("menus_exercises")
      .select("exercises (*)")
      .eq("menu_id", menuId);
    if (error) throw error;
    const transformedExercises = data
      .map((x) => x.exercises)
      // TODO: delete type after updating typescript
      .filter((exercise): exercise is Tables<"exercises"> => exercise !== null);
    setExercises(transformedExercises);
    return transformedExercises;
  }

  async function getExerciseById(exerciseId: Tables<"exercises">["id"]) {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("id", exerciseId)
      .single();
    if (error) throw error;
    return data;
  }

  async function deleteMenusExercises(
    menuId: Tables<"menus">["id"],
    exercisesId: Tables<"exercises">["id"]
  ) {
    const { error } = await supabase
      .from("menus_exercises")
      .delete()
      .eq("menu_id", menuId)
      .eq("exercise_id", exercisesId);
    if (error) throw error;
  }

  async function postExercises(
    name: Tables<"exercises">["name"],
    memo: Tables<"exercises">["memo"]
  ) {
    const { data, error } = await supabase
      .from("exercises")
      .insert({ name, memo })
      .select();
    if (error) throw error;
    return data;
  }

  async function postMenusExercises(
    menuId: Tables<"menus">["id"],
    exerciseId: Tables<"exercises">["id"]
  ) {
    const { error } = await supabase
      .from("menus_exercises")
      .insert({ menu_id: menuId, exercise_id: exerciseId });
    if (error) throw error;
  }

  return (
    <ExercisesContext.Provider value={{ exercises }}>
      <ExercisesDispatchContext.Provider
        value={{
          getMenuExercises,
          getExerciseById,
          deleteMenusExercises,
          postExercises,
          postMenusExercises,
        }}
      >
        {children}
      </ExercisesDispatchContext.Provider>
    </ExercisesContext.Provider>
  );
}

export function useExercises() {
  return useContext(ExercisesContext);
}

export function useExercisesDispatch() {
  return useContext(ExercisesDispatchContext);
}
