import { Redirect } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { View, Text } from "react-native";

export default function Index() {
  const { user, role, loading } = useAuth();

  // Wait until Firebase session + Firestore role are loaded
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading session...</Text>
      </View>
    );
  }

  // Not logged in → go to login screen
  if (!user) return <Redirect href="/login" />;

  // Logged in as admin → go to admin tabs
  if (role === "admin") return <Redirect href="/(adminTabs)/allClaims" />;

  // Logged in as employee (default) → go to normal tabs
  return <Redirect href="/(tabs)/claims" />;
}
