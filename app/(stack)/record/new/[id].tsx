import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { useMenus, useMenusDispatch } from "@/contexts/menusContext";
import { LINKS } from "@/constants/links";
import { useExercisesDispatch } from "@/contexts/exercisesContext";
import { useRecords, useRecordsDispatch } from "@/contexts/recordsContext";
import RecordForm from "@/components/RecordForm";

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

export default function RecordScreen() {
  const { id } = useLocalSearchParams();

  const parsedMenuId = menuIdSchema.safeParse(id);

  if (!parsedMenuId.success || !parsedMenuId.data) {
    return router.replace(LINKS.record);
  }

  const numberMenuId = parsedMenuId.data;

  const { menu } = useMenus();
  const { getMenuById } = useMenusDispatch();
  const { getMenuExercises } = useExercisesDispatch();
  const { recordsForPost } = useRecords();
  const { createRecordsForPost } = useRecordsDispatch();

  // TODO: change name
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const [_menu, exercises] = await Promise.all([
          getMenuById(numberMenuId),
          getMenuExercises(numberMenuId),
        ]);
        await createRecordsForPost(exercises);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <View>
      {isLoading ? (
        //  TODO: add loading spinner
        <Text>Loading...</Text>
      ) : (
        recordsForPost &&
        Object.keys(recordsForPost).length > 0 && (
          <>
            <Text>{menu?.name}</Text>
            <Text>{menu?.memo}</Text>
            <RecordForm menuId={numberMenuId} />
          </>
        )
      )}
    </View>
  );
}
