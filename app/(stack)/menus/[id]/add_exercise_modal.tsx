import { View } from "react-native";
import { Formik } from "formik";
import { ZodError, z } from "zod";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useExercisesDispatch } from "@/contexts/exercisesContext";
import { Button, Input, TextArea } from "tamagui";

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

const postExerciseSchema = z.object({
  name: z.string(),
  memo: z.string().optional(),
});

type PostExercise = z.infer<typeof postExerciseSchema>;

function validatePostExerciseForm(values: PostExercise) {
  try {
    postExerciseSchema.parse(values);
  } catch (error) {
    if (error instanceof ZodError) {
      return error.formErrors.fieldErrors;
    }
  }
}

export default function AddMExerciseModal() {
  const router = useRouter();

  const { id } = useLocalSearchParams();

  const parsedMenuId = menuIdSchema.safeParse(id);

  if (!parsedMenuId.success || !parsedMenuId.data) {
    return router.dismiss();
  }

  const numberMenuId = parsedMenuId.data;

  const { getMenuExercises, postExercises, postMenusExercises } =
    useExercisesDispatch();

  const [isPostExercisesLoading, setIsPostExercisesLoading] = useState(false);

  return (
    <View>
      <Formik
        initialValues={{ name: "", memo: "" }}
        validate={validatePostExerciseForm}
        onSubmit={async (values) => {
          try {
            setIsPostExercisesLoading(true);
            const { name, memo } = values;
            // FIXME: transaction
            const response = await postExercises(name, memo);
            if (!response) return;
            const exerciseId = response[0].id;
            await postMenusExercises(numberMenuId, exerciseId);
            await getMenuExercises(numberMenuId);
          } catch (error) {
            console.error(error);
          } finally {
            setIsPostExercisesLoading(false);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <Input
              placeholder="exercise name"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
            />
            <TextArea
              placeholder="memo"
              onChangeText={handleChange("memo")}
              onBlur={handleBlur("memo")}
              value={values.memo}
            />
            <Button onPress={() => handleSubmit()}>Add</Button>
          </View>
        )}
      </Formik>
    </View>
  );
}
