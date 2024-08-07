import { LINKS } from "@/constants/links";
import { Link } from "expo-router";
import { View } from "react-native";

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
    <View>
      {links.map((link) => (
        <View key={link.href}>
          <Link href={link.href}>{link.label}</Link>
        </View>
      ))}
    </View>
  );
}
