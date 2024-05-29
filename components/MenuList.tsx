import { View } from "react-native";
import Menu from "@/components/Menu";
import { useMenus } from "@/contexts/menusContext";

export default function MenuList() {
  const { menus } = useMenus();

  return (
    <View>
      {menus.map((menu) => (
        <Menu key={menu.id} menu={menu} />
      ))}
    </View>
  );
}
