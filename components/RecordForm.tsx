import React, { useState } from "react";
import { TextInput, View, Text } from "react-native";
import { Button } from "@rneui/themed";
import { Formik } from "formik";
import { ZodError } from "zod";
import { useRecords, useRecordsDispatch } from "@/contexts/recordsContext";
import { Records, recordsSchema } from "@/types/record";
import { useExercises } from "@/contexts/exercisesContext";
import { Tables } from "@/types/supabase";

type Props = {
  menuId: number;
};

function validatePostRecordForm(values: Records) {
  try {
    recordsSchema.parse(values);
  } catch (error) {
    if (error instanceof ZodError) {
      return error.formErrors.fieldErrors;
    }
  }
}

export default function RecordForm(props: Props) {
  const { records } = useRecords();
  const { postRecords } = useRecordsDispatch();
  const { exercises } = useExercises();

  // TODO:
  const [isPostRecordsLoading, setIsPostRecordsLoading] = useState(false);

  function getExerciseNameById(exerciseId: Tables<"exercises">["id"]) {
    return exercises.find((exercise) => exercise.id === exerciseId)?.name || "";
  }

  return (
    <View>
      <Formik
        enableReinitialize={true}
        initialValues={records}
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
          <View>
            {Object.entries(values).map(([exerciseId, { memo, records }]) => (
              <View key={exerciseId}>
                <Text>{getExerciseNameById(Number(exerciseId))}</Text>
                {memo && <Text>{memo}</Text>}
                {records.map((record, recordIndex) => (
                  <View key={recordIndex}>
                    <View>
                      <Text>{recordIndex + 1} sets</Text>
                      <Button
                        title="×"
                        onPress={() => {
                          setFieldValue(
                            `${exerciseId}.records`,
                            records.filter((_, index) => index !== recordIndex)
                          );
                        }}
                      />
                    </View>
                    <TextInput
                      keyboardType="numeric"
                      value={String(record.reps)}
                      onChangeText={(value) => {
                        setFieldValue(
                          `${exerciseId}.records[${recordIndex}].reps`,
                          Number(value)
                        );
                      }}
                    />
                    <TextInput
                      keyboardType="numeric"
                      value={String(record.weight)}
                      onChangeText={(value) => {
                        setFieldValue(
                          `${exerciseId}.records[${recordIndex}].weight`,
                          Number(value)
                        );
                      }}
                    />
                  </View>
                ))}
                <Button
                  title="Add Record"
                  onPress={() => {
                    const latestReps = records[records.length - 1]?.reps || 8;
                    const latestWeight =
                      records[records.length - 1]?.weight || 0;
                    const newRecord = {
                      reps: latestReps,
                      weight: latestWeight,
                    };
                    setFieldValue(`${exerciseId}.records`, [
                      ...records,
                      newRecord,
                    ]);
                  }}
                />
              </View>
            ))}
            <Button onPress={() => handleSubmit()}>Post</Button>
          </View>
        )}
      </Formik>
    </View>
  );
}
