import { useEffect, useState } from "react";
import { View } from "react-native";
import MenuList from "@/components/MenuList";
import { useMenus, useMenusDispatch } from "@/contexts/menusContext";
import Menu from "@/components/Menu";
import { Link } from "expo-router";
import { Button, SizableText, Spinner } from "tamagui";

export default function MenusScreen() {
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
        <Spinner size="large" color="$green10" />
      ) : menus.length > 0 ? (
        <MenuList>{(menu) => <Menu key={menu.id} menu={menu} />}</MenuList>
      ) : (
        <SizableText color="white">No menus available</SizableText>
      )}

      <Button>
        <Link href="menus/add_menu_modal">Add menu</Link>
      </Button>
    </View>
  );
}
