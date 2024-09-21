import React, { useState } from "react";
import { View } from "react-native";
import { Formik } from "formik";
import { ZodError } from "zod";
import { useRecords, useRecordsDispatch } from "@/contexts/recordsContext";
import { RecordsForPost, recordsForPostSchema } from "@/types/record";
import { useExercises } from "@/contexts/exercisesContext";
import { Tables } from "@/types/supabase";
import { Button, Input, SizableText } from "tamagui";
import { FlashList } from "@shopify/flash-list";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {
  menuId: number;
};

function validatePostRecordForm(values: RecordsForPost) {
  try {
    recordsForPostSchema.parse(values);
  } catch (error) {
    if (error instanceof ZodError) {
      return error.formErrors.fieldErrors;
    }
  }
}

export default function RecordForm(props: Props) {
  const { recordsForPost } = useRecords();
  const { postRecords } = useRecordsDispatch();
  const { exercises } = useExercises();

  // TODO:
  const [isPostRecordsLoading, setIsPostRecordsLoading] = useState(false);

  const getExerciseNameById = (exerciseId: Tables<"exercises">["id"]) => {
    return exercises.find((exercise) => exercise.id === exerciseId)?.name || "";
  };

  const handleNumericInput = (
    value: string,
    fieldName: string,
    setFieldValue: any
  ) => {
    // Remove any non-numeric characters (no minus sign allowed)
    const sanitizedValue = value.replace(/[^0-9.]/g, "");
    if (sanitizedValue === "") {
      setFieldValue(fieldName, 0);
    } else {
      setFieldValue(fieldName, Number(sanitizedValue));
    }
  };

  return (
    <View>
      <Formik
        enableReinitialize={true}
        initialValues={recordsForPost || {}}
        validate={validatePostRecordForm}
        onSubmit={async (values) => {
          try {
            setIsPostRecordsLoading(true);
            await postRecords(values, props.menuId);
          } catch (error) {
            console.error(error);
          } finally {
            setIsPostRecordsLoading(false);
          }
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <View style={{ height: 400 }}>
            <FlashList
              data={Object.entries(values)}
              renderItem={({ item }) => (
                <View>
                  <SizableText color="white">
                    {getExerciseNameById(Number(item[0]))}
                  </SizableText>
                  <FlashList
                    data={item[1].records}
                    renderItem={({ item: record, index }) => (
                      <View style={{ flexDirection: "column", gap: 4 }}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <SizableText color="white">
                            {index + 1} sets
                          </SizableText>
                          <Button
                            icon={
                              <AntDesign name="delete" size={24} color="red" />
                            }
                            chromeless
                            onPress={() => {
                              setFieldValue(
                                `${item[0]}.records`,
                                item[1].records.filter(
                                  (_, recordIndex) => recordIndex !== index
                                )
                              );
                            }}
                          />
                        </View>
                        <SizableText color="white">reps</SizableText>
                        <Input
                          keyboardType="numeric"
                          value={String(record.reps)}
                          onChangeText={(value) =>
                            handleNumericInput(
                              value,
                              `${item[0]}.records[${index}].reps`,
                              setFieldValue
                            )
                          }
                        />
                        <SizableText color="white">weight</SizableText>
                        <Input
                          keyboardType="numeric"
                          value={String(record.weight)}
                          onChangeText={(value) =>
                            handleNumericInput(
                              value,
                              `${item[0]}.records[${index}].weight`,
                              setFieldValue
                            )
                          }
                        />
                      </View>
                    )}
                    scrollEnabled={false}
                  />
                  <SizableText color="white">{item[1].memo}</SizableText>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      icon={<AntDesign name="plus" size={24} color="white" />}
                      chromeless
                      onPress={() => {
                        const latestReps =
                          item[1].records[item[1].records.length - 1]?.reps ||
                          8;
                        const latestWeight =
                          item[1].records[item[1].records.length - 1]?.weight ||
                          0;
                        const newRecord = {
                          sets: item[1].records.length + 1,
                          reps: latestReps,
                          weight: latestWeight,
                        };
                        setFieldValue(`${item[0]}.records`, [
                          ...item[1].records,
                          newRecord,
                        ]);
                      }}
                    />
                  </View>
                </View>
              )}
              estimatedItemSize={400}
            />
            <Button onPress={() => handleSubmit()}>Save</Button>
          </View>
        )}
      </Formik>
    </View>
  );
}
