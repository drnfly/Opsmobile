import { Stack } from "expo-router";
import { Redirect } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";

export default function AppLayout() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Redirect href="/login" />;
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#FFFFFF" } }} />;
}
