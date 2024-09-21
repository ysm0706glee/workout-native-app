import { View } from "react-native";
import { useMenus } from "@/contexts/menusContext";
import React from "react";
import { Tables } from "@/types/supabase";
import { FlashList } from "@shopify/flash-list";

type Props = {
  children: (menu: Tables<"menus">) => React.ReactElement;
};

export default function MenuList({ children }: Props) {
  const { menus } = useMenus();

  return (
    <View style={{ height: 200 }}>
      <FlashList
        data={menus}
        renderItem={({ item }) => {
          const MenuComponent = children(item);
          return React.cloneElement(MenuComponent, { key: item.id, item });
        }}
        estimatedItemSize={200}
      />
    </View>
  );
}
