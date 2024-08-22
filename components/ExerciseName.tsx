import { useEffect, useState } from "react";
import { useExercisesDispatch } from "@/contexts/exercisesContext";
import { Tables } from "@/types/supabase";
import { Text } from "react-native";

export default function ExerciseName({
  id,
}: {
  id: Tables<"exercises">["id"];
}) {
  const { getExerciseById } = useExercisesDispatch();

  const [name, setName] = useState<Tables<"menus">["name"] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const exercise = await getExerciseById(id);
        setName(exercise.name);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return <Text>{name}</Text>;
}
