import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/src/components/Screen";
import { Card, H3, Mono, SectionLabel, Pill } from "@/src/components/ui";
import { api, apiBaseUrl } from "@/src/api/client";
import { useAuth } from "@/src/context/AuthContext";
import { colors, spacing, type as typo } from "@/src/theme";

type Stats = {
  utilization: number;
  total_quantity: number;
  total_available: number;
  active_rentals: number;
  upcoming_returns: { id: string; customer: string; due_date: string }[];
  upcoming_count: number;
  open_maintenance: number;
  vendors_count: number;
  activity: { type: string; title: string; ts: string }[];
};

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const s = await api<Stats>("/dashboard/stats");
      setStats(s);
    } catch (e) {
      console.warn("stats", e);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    // Try to register push token if permissions granted (non-blocking).
    (async () => {
      if (Platform.OS === "web" || !Device.isDevice) return;
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") return;
        const tok = await Notifications.getDevicePushTokenAsync();
        if (!tok?.data || !user) return;
        await fetch(`${apiBaseUrl()}/register-push`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, platform: Platform.OS, device_token: tok.data }),
        });
      } catch {}
    })();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <Screen
      title={`Hey, ${user?.name || ""}`}
      subtitle="Field Operations Console"
      onRefresh={onRefresh}
      refreshing={refreshing}
      testID="dashboard-screen"
    >
      <View style={styles.grid}>
        <StatTile label="Utilization" value={`${stats?.utilization ?? 0}%`} accent testID="stat-utilization" />
        <StatTile label="Active Rentals" value={`${stats?.active_rentals ?? 0}`} testID="stat-active-rentals" />
        <StatTile label="Returns ≤ 7d" value={`${stats?.upcoming_count ?? 0}`} testID="stat-upcoming-returns" />
        <StatTile label="Open Service" value={`${stats?.open_maintenance ?? 0}`} testID="stat-open-maintenance" />
      </View>

      <SectionLabel>Quick actions</SectionLabel>
      <View style={styles.actionsRow}>
        <ActionTile icon="construct-outline" label="Bracing" onPress={() => router.push("/(app)/(tabs)/bracing")} testID="action-bracing" />
        <ActionTile icon="calculator-outline" label="Calculator" onPress={() => router.push("/(app)/(tabs)/calculator")} testID="action-calculator" />
        <ActionTile icon="cube-outline" label="Equipment" onPress={() => router.push("/(app)/(tabs)/equipment")} testID="action-equipment" />
        <ActionTile icon="receipt-outline" label="Rentals" onPress={() => router.push("/(app)/rentals")} testID="action-rentals" />
      </View>

      <SectionLabel>Upcoming returns</SectionLabel>
      <Card testID="upcoming-returns-card">
        {(stats?.upcoming_returns ?? []).length === 0 ? (
          <Text style={[typo.body, { color: colors.inkMuted }]}>No upcoming returns in the next 7 days.</Text>
        ) : (
          (stats?.upcoming_returns ?? []).map((r) => (
            <View key={r.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[typo.body, { fontWeight: "700" }]}>{r.customer}</Text>
                <Text style={[typo.label, { marginTop: 2 }]}>{new Date(r.due_date).toLocaleDateString()}</Text>
              </View>
              <Pill bg="#FEF3C7" color={colors.warning}>Due</Pill>
            </View>
          ))
        )}
      </Card>

      <View style={{ height: spacing.lg }} />
      <SectionLabel>Recent activity</SectionLabel>
      <Card testID="activity-card">
        {(stats?.activity ?? []).length === 0 ? (
          <Text style={[typo.body, { color: colors.inkMuted }]}>No activity yet.</Text>
        ) : (
          (stats?.activity ?? []).map((a, idx) => (
            <View key={idx} style={styles.row}>
              <Ionicons name={a.type === "rental" ? "receipt-outline" : "construct-outline"} size={18} color={colors.inkSecondary} />
              <Text style={[typo.body, { flex: 1, marginLeft: 10 }]}>{a.title}</Text>
              <Text style={typo.label}>{new Date(a.ts).toLocaleDateString()}</Text>
            </View>
          ))
        )}
      </Card>
    </Screen>
  );
}

const StatTile: React.FC<{ label: string; value: string; accent?: boolean; testID?: string }> = ({ label, value, accent, testID }) => (
  <View style={[styles.tile, accent && { backgroundColor: colors.ink }]} testID={testID}>
    <Text style={[typo.label, accent && { color: "#FFF", opacity: 0.7 }]}>{label}</Text>
    <Mono large style={accent ? { color: colors.orange } : undefined}>{value}</Mono>
  </View>
);

const ActionTile: React.FC<{ icon: any; label: string; onPress: () => void; testID?: string }> = ({ icon, label, onPress, testID }) => (
  <TouchableOpacity onPress={onPress} style={styles.action} testID={testID}>
    <Ionicons name={icon} size={22} color={colors.ink} />
    <Text style={[typo.label, { marginTop: 6 }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: spacing.lg },
  tile: { width: "47.5%", borderWidth: 2, borderColor: colors.ink, padding: 14, backgroundColor: colors.bg },
  actionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: spacing.lg },
  action: { width: "22%", borderWidth: 1, borderColor: colors.border, padding: 12, alignItems: "center", justifyContent: "center", minHeight: 72, flexGrow: 1 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 8 },
});
