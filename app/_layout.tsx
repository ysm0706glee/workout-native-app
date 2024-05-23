import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Auth from "@/components/Auth";
import { View } from "react-native";
import { Session } from "@supabase/supabase-js";
import { Slot } from "expo-router";
import Header from "@/components/Header";

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
  );
}
