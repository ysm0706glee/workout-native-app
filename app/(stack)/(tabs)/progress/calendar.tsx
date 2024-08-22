import { useRecords, useRecordsDispatch } from "@/contexts/recordsContext";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { FlashList } from "@shopify/flash-list";
import { formateMarkedDates } from "@/libs/format";
import ExerciseName from "@/components/ExerciseName";

export default function CalendarScreen() {
  const { uniqueRecordsDates, formattedCalenderRecords } = useRecords();
  const { getUniqueRecordsDates, getFormattedCalenderRecordsByDate } =
    useRecordsDispatch();

  const markedDates = uniqueRecordsDates
    ? formateMarkedDates(uniqueRecordsDates)
    : {};

  useEffect(() => {
    (async () => {
      try {
        await getUniqueRecordsDates();
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <View>
      <Calendar
        onDayPress={async (day: DateData) => {
          await getFormattedCalenderRecordsByDate(day.dateString);
        }}
        markedDates={markedDates}
      />
      {formattedCalenderRecords &&
      Object.keys(formattedCalenderRecords).length ? (
        <View>
          <View style={{ height: 400 }}>
            <Text>{formattedCalenderRecords.menu.name}</Text>
            <Text>{formattedCalenderRecords.menu.memo}</Text>
            <FlashList
              data={Object.entries(formattedCalenderRecords.records)}
              renderItem={({ item }) => (
                <View>
                  <ExerciseName id={Number(item[0])} />
                  <FlashList
                    data={item[1].records}
                    renderItem={({ item }) => (
                      <View>
                        <Text>
                          Sets: {item.sets} | Reps: {item.reps} | Weight:{" "}
                          {item.weight} kg
                        </Text>
                      </View>
                    )}
                    scrollEnabled={false}
                  />
                  <Text>{item[1].memo}</Text>
                </View>
              )}
              estimatedItemSize={400}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}
