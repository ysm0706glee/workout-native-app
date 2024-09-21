import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "white", headerShown: false }}
    >
      <Tabs.Screen
        name="progress/index"
        options={{
          title: "Chart",
          tabBarIcon: ({ color }) => (
            <AntDesign name="linechart" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress/calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <AntDesign name="calendar" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
