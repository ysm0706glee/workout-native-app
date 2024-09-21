import ExerciseName from "@/components/ExerciseName";
import RadioGroupItemWithLabel from "@/components/RadioGroupItemWithLabel";
import { useMenus, useMenusDispatch } from "@/contexts/menusContext";
import { useRecords, useRecordsDispatch } from "@/contexts/recordsContext";
import { Tables } from "@/types/supabase";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { RadioGroup, Spinner, Text } from "tamagui";

export default function ProgressScreen() {
  const { menus } = useMenus();
  const { getMenus } = useMenusDispatch();
  const { formattedChart } = useRecords();
  const { getFormattedChartByMenuId } = useRecordsDispatch();

  const [selectedMenuId, setSelectedMenuId] = useState<
    Tables<"menus">["id"] | null
  >(null);
  const [isLoadingMenus, setIsLoadingMenus] = useState(false);
  const [
    isGetFormattedChartByMenuIdLoading,
    setIsGetFormattedChartByMenuIdLoading,
  ] = useState(false);

  const handleValueChange = (value: string) => {
    setSelectedMenuId(Number(value));
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoadingMenus(true);
        await getMenus();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingMenus(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedMenuId) {
      (async () => {
        try {
          setIsGetFormattedChartByMenuIdLoading(true);
          await getFormattedChartByMenuId(selectedMenuId);
        } catch (error) {
          console.error(error);
        } finally {
          setIsGetFormattedChartByMenuIdLoading(false);
        }
      })();
    }
  }, [selectedMenuId]);

  return (
    <View>
      {isLoadingMenus ? (
        <View>
          <Spinner size="large" color="$green10" />
        </View>
      ) : (
        <View>
          <RadioGroup
            value={selectedMenuId ? String(selectedMenuId) : undefined}
            onValueChange={handleValueChange}
            style={{ height: 200 }}
          >
            <FlashList
              data={menus}
              renderItem={({ item }) => (
                <RadioGroupItemWithLabel
                  key={item.id}
                  size="$3"
                  value={String(item.id)}
                  label={item.name}
                />
              )}
              estimatedItemSize={200}
            />
          </RadioGroup>
        </View>
      )}
      <View style={{ height: 200 }}>
        {isGetFormattedChartByMenuIdLoading ? (
          <Spinner size="large" color="$green10" />
        ) : formattedChart && formattedChart.length > 0 ? (
          <FlashList
            data={formattedChart}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: "white" }}>
                <ExerciseName
                  id={Number(Object.keys(item)[0])}
                  textColor="black"
                />
                <LineChart data={item[Object.keys(item)[0]]} />
              </View>
            )}
            estimatedItemSize={200}
          />
        ) : selectedMenuId !== null ? (
          <Text style={{ color: "white" }}>No records available</Text>
        ) : null}
      </View>
    </View>
  );
}
