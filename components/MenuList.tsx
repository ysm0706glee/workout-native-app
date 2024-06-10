import { View } from "react-native";
import { useMenus } from "@/contexts/menusContext";
import React from "react";
import { Tables } from "@/types/supabase";

type Props = {
  children: (menu: Tables<"menus">) => React.ReactElement;
};

export default function MenuList({ children }: Props) {
  const { menus } = useMenus();

  return (
    <View>
      {menus.map((menu) => {
        const MenuComponent = children(menu);
        return React.cloneElement(MenuComponent, { key: menu.id, menu });
      })}
    </View>
  );
}
