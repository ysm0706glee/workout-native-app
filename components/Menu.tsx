import { Button } from "@rneui/themed";
import { Link } from "expo-router";
import { useState } from "react";
import { View, Text } from "react-native";
import { useMenusDispatch } from "@/contexts/menusContext";
import { LINKS } from "@/constants/links";
import { Tables } from "@/types/supabase";

type Props = {
  menu: Tables<"menus">;
};

export default function Menu(props: Props) {
  const { getMenus, deleteMenus } = useMenusDispatch();

  const [isDeleteMenusLoading, setIsDeleteMenusLoading] = useState(false);

  return (
    <View>
      <Link href={`${LINKS.menus}/${props.menu.id}`}>
        <Text>{props.menu.name}</Text>
        <Text>{props.menu.memo}</Text>
      </Link>
      <Button
        onPress={async () => {
          try {
            setIsDeleteMenusLoading(true);
            await deleteMenus(props.menu.id);
            await getMenus();
          } catch (error) {
            console.error(error);
          } finally {
            setIsDeleteMenusLoading(false);
          }
        }}
        loading={isDeleteMenusLoading}
      >
        ×
      </Button>
    </View>
  );
}
