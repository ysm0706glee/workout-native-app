import { Button, Text } from "@rneui/themed";
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
import MenuList from "@/components/MenuList";
import { useMenus, useMenusDispatch } from "@/contexts/menusContext";
import Menu from "@/components/Menu";

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

export default function MenusScreen() {
  const { menus } = useMenus();
  const { getMenus, postMenus } = useMenusDispatch();

  const [isGetMenusLoading, setIsGetMenusLoading] = useState(false);
  const [isPostMenusLoading, setIsPostMenusLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setIsGetMenusLoading(true);
        await getMenus();
      } catch (error) {
        console.error(error);
      } finally {
        setIsGetMenusLoading(false);
      }
    })();
  }, []);

  return (
    <View>
      {isGetMenusLoading ? (
        //  TODO: add loading spinner
        <Text>Loading...</Text>
      ) : menus.length > 0 ? (
        <MenuList>{(menu) => <Menu key={menu.id} menu={menu} />}</MenuList>
      ) : (
        <Text>No menus available</Text>
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
                    setModalVisible(!modalVisible);
                  }
                }}
              >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                  <View>
                    <TextInput
                      placeholder="menu name"
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
                      loading={isPostMenusLoading}
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
