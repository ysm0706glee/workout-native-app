import { useRecords, useRecordsDispatch } from "@/contexts/recordsContext";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { FlashList } from "@shopify/flash-list";
import { formateMarkedDates } from "@/libs/format";
import ExerciseName from "@/components/ExerciseName";
import { SizableText, Spinner } from "tamagui";

export default function CalendarScreen() {
  const { uniqueRecordsDates, formattedCalenderRecords } = useRecords();
  const { getUniqueRecordsDates, getFormattedCalenderRecordsByDate } =
    useRecordsDispatch();

  const [
    isLoadingFormattedCalenderRecordsByDate,
    setIsLoadingFormattedCalenderRecordsByDate,
  ] = useState(false);

  const [hasSelectedDay, setHasSelectedDay] = useState(false);

  const markedDates = uniqueRecordsDates
    ? formateMarkedDates(uniqueRecordsDates)
    : {};

  useEffect(() => {
    (async () => {
      try {
        await getUniqueRecordsDates();
      } catch (error) {
        console.error(error);
      } finally {
      }
    })();
  }, []);

  const handleDayPress = async (day: DateData) => {
    setIsLoadingFormattedCalenderRecordsByDate(true);
    setHasSelectedDay(true);
    try {
      await getFormattedCalenderRecordsByDate(day.dateString);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingFormattedCalenderRecordsByDate(false);
    }
  };

  return (
    <View>
      <SizableText color="white">Click to see your record</SizableText>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          calendarBackground: "#333",
          textSectionTitleColor: "#fff",
          dayTextColor: "#fff",
          todayTextColor: "#00adf5",
          selectedDayTextColor: "#00adf5",
          monthTextColor: "#fff",
          selectedDayBackgroundColor: "#00adf5",
          arrowColor: "#fff",
          textDisabledColor: "#666",
          textDayFontWeight: "300",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "300",
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      />
      {isLoadingFormattedCalenderRecordsByDate ? (
        <Spinner size="large" color="$green10" />
      ) : hasSelectedDay &&
        formattedCalenderRecords &&
        Object.keys(formattedCalenderRecords).length ? (
        <View>
          <View style={{ height: 400 }}>
            <SizableText color="white">
              {formattedCalenderRecords.menu.name}
            </SizableText>
            <SizableText color="white">
              {formattedCalenderRecords.menu.memo}
            </SizableText>
            <FlashList
              data={Object.entries(formattedCalenderRecords.records)}
              renderItem={({ item }) => (
                <View>
                  <ExerciseName id={Number(item[0])} />
                  <FlashList
                    data={item[1].records}
                    renderItem={({ item }) => (
                      <View>
                        <SizableText color="white">
                          Sets: {item.sets} | Reps: {item.reps} | Weight:{" "}
                          {item.weight} kg
                        </SizableText>
                      </View>
                    )}
                    scrollEnabled={false}
                  />
                  <SizableText color="white">{item[1].memo}</SizableText>
                </View>
              )}
              estimatedItemSize={400}
            />
          </View>
        </View>
      ) : (
        hasSelectedDay && (
          <SizableText color="white" textAlign="center">
            No records available
          </SizableText>
        )
      )}
    </View>
  );
}
