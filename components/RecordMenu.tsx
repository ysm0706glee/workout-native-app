import { Link } from "expo-router";
import { View, Text } from "react-native";
import { LINKS } from "@/constants/links";
import { Tables } from "@/types/supabase";

type Props = {
  menu: Tables<"menus">;
};

export default function RecordMenu(props: Props) {
  return (
    <View>
      <Link href={`${LINKS.newRecord}/${props.menu.id}`}>
        <Text>{props.menu.name}</Text>
        <Text>{props.menu.memo}</Text>
      </Link>
    </View>
  );
}
