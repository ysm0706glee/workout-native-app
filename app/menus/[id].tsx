import { Button, Text } from "@rneui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Formik } from "formik";
import { ZodError, z } from "zod";
import { useMenus, useMenusDispatch } from "@/contexts/menusContext";
import {
  useExercises,
  useExercisesDispatch,
} from "@/contexts/exercisesContext";
import { LINKS } from "@/constants/links";

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

export default function MenuScreen() {
  const { id } = useLocalSearchParams();

  const parsedMenuId = menuIdSchema.safeParse(id);

  if (!parsedMenuId.success || !parsedMenuId.data) {
    return router.replace(LINKS.menus);
  }

  const numberMenuId = parsedMenuId.data;

  const { menu } = useMenus();
  const { getMenu } = useMenusDispatch();
  const { exercises } = useExercises();
  const {
    getMenuExercises,
    deleteMenusExercises,
    postExercises,
    postMenusExercises,
  } = useExercisesDispatch();

  const [
    isGetMenusAndGetExercisesLoading,
    setIsGetMenusAndGetExercisesLoading,
  ] = useState(false);
  const [isDeleteMenusExercisesLoading, setIsDeleteMenusExercisesLoading] =
    useState(false);
  const [isPostExercisesLoading, setIsPostExercisesLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsGetMenusAndGetExercisesLoading(true);
        await getMenu(numberMenuId);
        await getMenuExercises(numberMenuId);
      } catch (error) {
        console.error(error);
      } finally {
        setIsGetMenusAndGetExercisesLoading(false);
      }
    })();
  }, []);

  return (
    <View>
      {isGetMenusAndGetExercisesLoading ? (
        <Text>Loading...</Text>
      ) : (
        exercises?.map((exercise) => (
          <View key={exercise.id}>
            <View>
              <Text>{exercise.name}</Text>
              <Text>{exercise.memo}</Text>
              <Button
                onPress={async () => {
                  try {
                    setIsDeleteMenusExercisesLoading(true);
                    await deleteMenusExercises(numberMenuId);
                    await getMenuExercises(numberMenuId);
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setIsDeleteMenusExercisesLoading(false);
                  }
                }}
                loading={isDeleteMenusExercisesLoading}
              >
                ×
              </Button>
            </View>
          </View>
        ))
      )}
      <Pressable onPress={() => setModalVisible(true)}>
        <Text>Show Modal</Text>
      </Pressable>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
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
                    setModalVisible(false);
                  } catch (error) {
                    console.error(error);
                  } finally {
                    setIsPostExercisesLoading(false);
                  }
                }}
              >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                  <View>
                    <TextInput
                      placeholder="exercise name"
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      value={values.name}
                    />
                    <TextInput
                      placeholder="memo"
                      onChangeText={handleChange("memo")}
                      onBlur={handleBlur("memo")}
                      value={values.memo}
                    />
                    <Button
                      onPress={() => handleSubmit()}
                      loading={isPostExercisesLoading}
                    >
                      Add
                    </Button>
                  </View>
                )}
              </Formik>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
