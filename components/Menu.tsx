import { Link } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useMenusDispatch } from "@/contexts/menusContext";
import { LINKS } from "@/constants/links";
import { Tables } from "@/types/supabase";
import { Button, SizableText } from "tamagui";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {
  menu: Tables<"menus">;
};

export default function Menu(props: Props) {
  const { getMenus, deleteMenus } = useMenusDispatch();

  const [isDeleteMenusLoading, setIsDeleteMenusLoading] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link href={`${LINKS.menus}/${props.menu.id}`}>
        <SizableText color="white">{props.menu.name}</SizableText>
        <SizableText color="white">{props.menu.memo}</SizableText>
      </Link>
      <Button
        icon={<AntDesign name="delete" size={24} color="red" />}
        chromeless
        disabled={isDeleteMenusLoading}
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
      />
    </View>
  );
}
