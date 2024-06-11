import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "@/libs/supabase";
import Auth from "@/components/Auth";
import { View } from "react-native";
import { Session } from "@supabase/supabase-js";
import { Slot } from "expo-router";
import Header from "@/components/Header";
import { MenusProvider } from "@/contexts/menusContext";
import { ExercisesProvider } from "@/contexts/exercisesContext";
import { RecordsProvider } from "@/contexts/recordsContext";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <MenusProvider>
      <ExercisesProvider>
        <RecordsProvider>
          <View>
            {session && session.user ? (
              <>
                <Header />
                <Slot />
              </>
            ) : (
              <Auth />
            )}
          </View>
        </RecordsProvider>
      </ExercisesProvider>
    </MenusProvider>
  );
}
