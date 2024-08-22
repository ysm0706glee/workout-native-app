import ExerciseName from "@/components/ExerciseName";
import { useMenus, useMenusDispatch } from "@/contexts/menusContext";
import { useRecords, useRecordsDispatch } from "@/contexts/recordsContext";
import { Tables } from "@/types/supabase";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { View, Button } from "react-native";
import { LineChart } from "react-native-gifted-charts";

export default function ProgressScreen() {
  const { menus } = useMenus();
  const { getMenus } = useMenusDispatch();
  const { formattedChart } = useRecords();
  const { getFormattedChartByMenuId } = useRecordsDispatch();

  const [selectedMenuId, setSelectedMenuId] = useState<
    Tables<"menus">["id"] | null
  >(null);

  useEffect(() => {
    (async () => {
      try {
        await getMenus();
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedMenuId) {
      (async () => {
        try {
          await getFormattedChartByMenuId(selectedMenuId);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [selectedMenuId]);

  return (
    <View>
      <View style={{ height: 200 }}>
        <FlashList
          data={menus}
          renderItem={({ item }) => (
            <Button
              onPress={() => setSelectedMenuId(item.id)}
              title={item.name}
            />
          )}
          estimatedItemSize={200}
        />
      </View>
      <View style={{ height: 200 }}>
        {formattedChart ? (
          <FlashList
            data={formattedChart}
            renderItem={({ item }) => (
              <View>
                <ExerciseName id={Number(Object.keys(item)[0])} />
                <LineChart data={item[Object.keys(item)[0]]} />
              </View>
            )}
            estimatedItemSize={200}
          />
        ) : null}
      </View>
    </View>
  );
}
