// Standard screen scaffold with sticky header.
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, type as typo } from "@/src/theme";
import { useRouter } from "expo-router";

type Props = {
  title: string;
  subtitle?: string;
  back?: boolean;
  rightAction?: { icon: keyof typeof Ionicons.glyphMap; onPress: () => void; testID?: string };
  children: React.ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  testID?: string;
};

export const Screen: React.FC<Props> = ({ title, subtitle, back, rightAction, children, scroll = true, refreshing, onRefresh, testID }) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const Header = (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <View style={styles.brandTile} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title.toUpperCase()}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {back ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} testID="header-back">
          <Ionicons name="chevron-back" size={24} color={colors.ink} />
        </TouchableOpacity>
      ) : null}
      {rightAction ? (
        <TouchableOpacity onPress={rightAction.onPress} style={styles.iconBtn} testID={rightAction.testID}>
          <Ionicons name={rightAction.icon} size={24} color={colors.ink} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
  return (
    <SafeAreaView edges={["top"]} style={styles.safe} testID={testID}>
      {Header}
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={colors.orange} /> : undefined}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: colors.ink,
    backgroundColor: colors.bg,
  },
  brandTile: { width: 8, height: 28, backgroundColor: colors.orange, marginRight: 10 },
  title: { ...typo.h2, fontSize: 20, letterSpacing: 0.5, color: colors.ink },
  subtitle: { ...typo.label, marginTop: 2 },
  iconBtn: { padding: 8, minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center" },
  scroll: { padding: spacing.lg, paddingBottom: 80 },
});
