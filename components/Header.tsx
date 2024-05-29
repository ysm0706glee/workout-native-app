import { Button } from "@rneui/themed";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { supabase } from "@/libs/supabase";
import { LINKS } from "@/constants/links";

export default function Header() {
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Link href={LINKS.home}>Home</Link>
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign Out" disabled={loading} onPress={() => signOut()} />
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
