import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
      <Tabs.Screen
        name="progress/index"
        options={{
          title: "Chart",
          tabBarIcon: () => (
            <AntDesign name="linechart" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="progress/calendar"
        options={{
          title: "Calendar",
          tabBarIcon: () => (
            <AntDesign name="calendar" size={24} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
