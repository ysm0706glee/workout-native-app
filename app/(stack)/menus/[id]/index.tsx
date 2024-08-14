import { Button, Text } from "@rneui/themed";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useMenusDispatch } from "@/contexts/menusContext";
import {
  useExercises,
  useExercisesDispatch,
} from "@/contexts/exercisesContext";
import { z } from "zod";

const menuIdSchema = z.union([
  z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), {
      message: "Invalid number",
    }),
  z
    .array(z.string())
    .transform((val) => Number(val[0]))
    .refine((val) => !isNaN(val), {
      message: "Invalid number",
    }),
  z.undefined(),
]);

export default function MenuScreen() {
  const router = useRouter();

  const { id } = useLocalSearchParams();

  const parsedMenuId = menuIdSchema.safeParse(id);

  if (!parsedMenuId.success || !parsedMenuId.data) {
    return router.dismiss();
  }

  const numberMenuId = parsedMenuId.data;

  const { getMenuById } = useMenusDispatch();
  const { exercises } = useExercises();
  const { getMenuExercises, deleteMenusExercises } = useExercisesDispatch();

  const [
    isGetMenusAndGetExercisesLoading,
    setIsGetMenusAndGetExercisesLoading,
  ] = useState(false);
  const [isDeleteMenusExercisesLoading, setIsDeleteMenusExercisesLoading] =
    useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsGetMenusAndGetExercisesLoading(true);
        await getMenuById(numberMenuId);
        await getMenuExercises(numberMenuId);
      } catch (error) {
        console.error(error);
      } finally {
        setIsGetMenusAndGetExercisesLoading(false);
      }
    })();
  }, []);

  return (
    <View>
      {isGetMenusAndGetExercisesLoading ? (
        <Text>Loading...</Text>
      ) : (
        exercises?.map((exercise) => (
          <View key={exercise.id}>
            <View>
              <Text>{exercise.name}</Text>
              <Text>{exercise.memo}</Text>
              <Button
                onPress={async () => {
                  try {
                    setIsDeleteMenusExercisesLoading(true);
                    await deleteMenusExercises(numberMenuId);
                    await getMenuExercises(numberMenuId);
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setIsDeleteMenusExercisesLoading(false);
                  }
                }}
                loading={isDeleteMenusExercisesLoading}
              >
                ×
              </Button>
            </View>
          </View>
        ))
      )}
      <Link href={`menus/${numberMenuId}/add_exercise_modal`}>
        Present modal
      </Link>
    </View>
  );
}
