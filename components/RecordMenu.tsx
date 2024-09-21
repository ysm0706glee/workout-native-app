import { Link } from "expo-router";
import { View } from "react-native";
import { LINKS } from "@/constants/links";
import { Tables } from "@/types/supabase";
import { SizableText } from "tamagui";

type Props = {
  menu: Tables<"menus">;
};

export default function RecordMenu(props: Props) {
  return (
    <View>
      <Link href={`${LINKS.newRecord}/${props.menu.id}`}>
        <SizableText color="white">{props.menu.name}</SizableText>
        <SizableText color="white">{props.menu.memo}</SizableText>
      </Link>
    </View>
  );
}
