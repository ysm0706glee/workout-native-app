import { View } from "react-native";
import { Formik } from "formik";
import { ZodError, z } from "zod";
import { useMenusDispatch } from "@/contexts/menusContext";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Button, Input } from "tamagui";

const postMenuSchema = z.object({
  name: z.string(),
  memo: z.string().optional(),
});

type PostMenus = z.infer<typeof postMenuSchema>;

function validatePostMenuForm(values: PostMenus) {
  try {
    postMenuSchema.parse(values);
  } catch (error) {
    if (error instanceof ZodError) {
      return error.formErrors.fieldErrors;
    }
  }
}

export default function AddMenuModal() {
  const router = useRouter();

  const { postMenus, getMenus } = useMenusDispatch();

  const [isPostMenusLoading, setIsPostMenusLoading] = useState(false);

  const closeAddMenuModal = () => {
    router.dismiss();
  };

  return (
    <View>
      <Formik
        initialValues={{ name: "", memo: "" }}
        validate={validatePostMenuForm}
        onSubmit={async (values) => {
          try {
            setIsPostMenusLoading(true);
            const { name, memo } = values;
            await postMenus(name, memo);
            await getMenus();
          } catch (error) {
            console.error(error);
          } finally {
            setIsPostMenusLoading(false);
            closeAddMenuModal();
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <Input
              placeholder="menu name"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
            />
            <Input
              placeholder="memo"
              onChangeText={handleChange("memo")}
              onBlur={handleBlur("memo")}
              value={values.memo}
            />
            <Button
              disabled={isPostMenusLoading}
              onPress={() => handleSubmit()}
            >
              Add
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
}
