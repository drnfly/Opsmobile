import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/src/components/Screen";
import { Card, Button, SectionLabel } from "@/src/components/ui";
import { useAuth } from "@/src/context/AuthContext";
import { colors, spacing, type as typo } from "@/src/theme";

const ITEMS: { label: string; sub: string; route: string; icon: any; testID: string }[] = [
  { label: "Rentals", sub: "Multi-SKU + delivery tickets", route: "/(app)/rentals", icon: "receipt-outline", testID: "more-rentals" },
  { label: "Bookings", sub: "Tentative pipeline · capacity", route: "/(app)/bookings", icon: "calendar-outline", testID: "more-bookings" },
  { label: "Maintenance", sub: "Service log & repairs", route: "/(app)/maintenance", icon: "build-outline", testID: "more-maintenance" },
  { label: "Vendors", sub: "ICF block supplier directory", route: "/(app)/vendors", icon: "business-outline", testID: "more-vendors" },
  { label: "Site Admin", sub: "Brand, content, logo", route: "/(app)/site-admin", icon: "settings-outline", testID: "more-site-admin" },
];

export default function MoreScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  return (
    <Screen title="More" subtitle={`Signed in as ${user?.name}`} testID="more-screen">
      <View style={styles.userCard}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1690473768476-44b5cebb7d80?crop=entropy&cs=srgb&fm=jpg&w=600&q=80" }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={[typo.h2, { color: "#FFF", fontSize: 18 }]}>{user?.name}</Text>
          <Text style={[typo.label, { color: "#FFF", opacity: 0.6 }]}>{user?.role} · {user?.email}</Text>
        </View>
      </View>

      <SectionLabel>Modules</SectionLabel>
      {ITEMS.map((it) => (
        <TouchableOpacity key={it.route} onPress={() => router.push(it.route as any)} activeOpacity={0.7} testID={it.testID}>
          <Card style={{ marginBottom: spacing.sm, flexDirection: "row", alignItems: "center" }}>
            <View style={styles.iconBox}>
              <Ionicons name={it.icon} size={22} color={colors.ink} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typo.h3, { fontSize: 16 }]}>{it.label}</Text>
              <Text style={[typo.body, { color: colors.inkSecondary, fontSize: 13 }]}>{it.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.inkMuted} />
          </Card>
        </TouchableOpacity>
      ))}

      <View style={{ height: spacing.lg }} />
      <Button title="Sign Out" onPress={logout} variant="outline" testID="logout-btn" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  userCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.ink, padding: spacing.md, gap: 12, marginBottom: spacing.lg },
  avatar: { width: 56, height: 56, backgroundColor: colors.bgMuted },
  iconBox: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, marginRight: spacing.md },
});
