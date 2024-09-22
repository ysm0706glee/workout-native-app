import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useMenusDispatch } from "@/contexts/menusContext";
import {
  useExercises,
  useExercisesDispatch,
} from "@/contexts/exercisesContext";
import { z } from "zod";
import { Button, SizableText, Spinner } from "tamagui";
import { FlashList } from "@shopify/flash-list";

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
  // TODO:
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
    <View style={{ height: 400 }}>
      {isGetMenusAndGetExercisesLoading ? (
        <View>
          <Spinner size="large" color="$green10" />
        </View>
      ) : exercises.length === 0 ? (
        <SizableText color="white">
          No exercises found for this menu.
        </SizableText>
      ) : (
        <FlashList
          data={exercises}
          renderItem={({ item }) => (
            <View>
              <SizableText color="white">{item.name}</SizableText>
              <SizableText color="white">{item.memo}</SizableText>
              <Button
                disabled={isDeleteMenusExercisesLoading}
                onPress={async () => {
                  try {
                    setIsDeleteMenusExercisesLoading(true);
                    await deleteMenusExercises(numberMenuId, item.id);
                    await getMenuExercises(numberMenuId);
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setIsDeleteMenusExercisesLoading(false);
                  }
                }}
              >
                ×
              </Button>
            </View>
          )}
          estimatedItemSize={400}
        />
      )}

      <Button>
        <Link href={`menus/${numberMenuId}/add_exercise_modal`}>
          Add exercise
        </Link>
      </Button>
    </View>
  );
}
