import { supabase } from "@/libs/supabase";
import { Stack } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { Button } from "tamagui";

export default function StackLayout() {
  const [isSignOutLoading, setIsSignOutLoading] = useState(false);

  async function signOut() {
    setIsSignOutLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(error.message);
    setIsSignOutLoading(false);
  }

  return (
    <Stack
      screenOptions={{
        headerRight: () => (
          <Button onPress={signOut} disabled={isSignOutLoading}>
            logout
          </Button>
        ),
        headerStyle: {
          backgroundColor: "#000",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="record/index"
        options={{
          title: "Menus",
        }}
      />
      <Stack.Screen
        name="record/new/[id]"
        options={{
          title: "Menu",
        }}
      />
      <Stack.Screen
        name="menus/index"
        options={{
          title: "Menus",
        }}
      />
      <Stack.Screen
        name="menus/[id]/index"
        options={{
          title: "Menu",
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          title: "Record",
        }}
      />
      <Stack.Screen
        name="menus/add_menu_modal"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="menus/[id]/add_exercise_modal"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
