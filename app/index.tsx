import { LINKS } from "@/constants/links";
import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

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
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        {links.map((link) => (
          <View key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
