import { View } from "react-native";
import { useEffect, useState } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import { z } from "zod";
import { useMenus, useMenusDispatch } from "@/contexts/menusContext";
import { LINKS } from "@/constants/links";
import { useExercisesDispatch } from "@/contexts/exercisesContext";
import { useRecords, useRecordsDispatch } from "@/contexts/recordsContext";
import RecordForm from "@/components/RecordForm";
import { SizableText, Spinner } from "tamagui";

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
        <Spinner size="large" color="$green10" />
      ) : recordsForPost && Object.keys(recordsForPost).length > 0 ? (
        <>
          <SizableText color="white">{menu?.name}</SizableText>
          <SizableText color="white">{menu?.memo}</SizableText>
          <RecordForm menuId={numberMenuId} />
        </>
      ) : (
        <View>
          <SizableText color="white">
            No exercises found for this menu.
          </SizableText>
          <Link href={`${LINKS.menus}/${numberMenuId}`}>
            <SizableText color="white">Go to Menu page</SizableText>
          </Link>
        </View>
      )}
    </View>
  );
}
