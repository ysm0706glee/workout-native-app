import { useEffect, useState } from "react";
import { useExercisesDispatch } from "@/contexts/exercisesContext";
import { Tables } from "@/types/supabase";
import { SizableText } from "tamagui";

export default function ExerciseName({
  id,
  textColor = "white",
}: {
  id: Tables<"exercises">["id"];
  textColor?: string;
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

  return <SizableText color={textColor}>{name}</SizableText>;
}
