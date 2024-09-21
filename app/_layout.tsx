import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Spinner, TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "../tamagui.config";
import Auth from "@/components/Auth";
import { Session } from "@supabase/supabase-js";
import { Slot } from "expo-router";
import { supabase } from "@/libs/supabase";
import { MenusProvider } from "@/contexts/menusContext";
import { ExercisesProvider } from "@/contexts/exercisesContext";
import { RecordsProvider } from "@/contexts/recordsContext";
import { View } from "react-native";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });
  }, []);

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <ThemeProvider value={DarkTheme}>
        <MenusProvider>
          <ExercisesProvider>
            <RecordsProvider>
              {isLoading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Spinner size="large" color="$green10" />
                </View>
              ) : session && session.user ? (
                <Slot />
              ) : (
                <Auth />
              )}
            </RecordsProvider>
          </ExercisesProvider>
        </MenusProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
