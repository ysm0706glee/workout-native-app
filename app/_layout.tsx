import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import Auth from "@/components/Auth";
import { Session } from "@supabase/supabase-js";
import { Slot } from "expo-router";
import { supabase } from "@/libs/supabase";
import { MenusProvider } from "@/contexts/menusContext";
import { ExercisesProvider } from "@/contexts/exercisesContext";
import { RecordsProvider } from "@/contexts/recordsContext";
import { Text, View } from "react-native";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  // TODO:
  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <MenusProvider>
      <ExercisesProvider>
        <RecordsProvider>
          {session && session.user ? <Slot /> : <Auth />}
        </RecordsProvider>
      </ExercisesProvider>
    </MenusProvider>
  );
}
