import { LINKS } from "@/constants/links";
import { FlashList } from "@shopify/flash-list";
import { Link } from "expo-router";
import { View } from "react-native";
import { SizableText } from "tamagui";

export default function HomeScreen() {
  const links = [
    {
      href: LINKS.record,
      label: "Start Workout",
    },
    {
      href: LINKS.menus,
      label: "Manage workout menus",
    },
    {
      href: LINKS.progress,
      label: "View progress",
    },
  ];

  return (
    <View style={{ height: 200 }}>
      <FlashList
        data={links}
        keyExtractor={(item) => item.href}
        renderItem={({ item }) => (
          <Link href={item.href}>
            <SizableText color="white">{item.label}</SizableText>
          </Link>
        )}
        estimatedItemSize={200}
      />
    </View>
  );
}
