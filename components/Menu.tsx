import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useMenusDispatch } from "@/contexts/menusContext";
import { LINKS } from "@/constants/links";
import { Tables } from "@/types/supabase";
import { Button, SizableText } from "tamagui";

type Props = {
  menu: Tables<"menus">;
};

export default function Menu(props: Props) {
  const { getMenus, deleteMenus } = useMenusDispatch();

  const [isDeleteMenusLoading, setIsDeleteMenusLoading] = useState(false);

  return (
    <View>
      <Link href={`${LINKS.menus}/${props.menu.id}`}>
        <SizableText color="white">{props.menu.name}</SizableText>
        <SizableText color="white">{props.menu.memo}</SizableText>
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
      >
        ×
      </Button>
    </View>
  );
}
