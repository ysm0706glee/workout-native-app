import { Text } from "@rneui/themed";
import { View } from "react-native";
import { useEffect, useState } from "react";
import { useMenus, useMenusDispatch } from "@/contexts/menusContext";
import MenuList from "@/components/MenuList";
import RecordMenu from "@/components/RecordMenu";

export default function RecordScreen() {
  const { menus } = useMenus();
  const { getMenus } = useMenusDispatch();

  const [isGetMenusLoading, setIsGetMenusLoading] = useState(false);

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
        <MenuList>
          {(menu) => <RecordMenu key={menu.id} menu={menu} />}
        </MenuList>
      ) : (
        <Text>No menus available</Text>
      )}
    </View>
  );
}
