// Reusable Swiss/high-contrast UI primitives.
import React from "react";
import {
  View, Text, TouchableOpacity, TextInput, StyleSheet,
  ViewStyle, TextStyle, StyleProp, TextInputProps, ActivityIndicator,
} from "react-native";
import { colors, type as typo, spacing } from "@/src/theme";

export const Card: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle>; testID?: string }> = ({ children, style, testID }) => (
  <View testID={testID} style={[styles.card, style]}>{children}</View>
);

export const SectionLabel: React.FC<{ children: string; style?: StyleProp<TextStyle> }> = ({ children, style }) => (
  <Text style={[typo.label, { marginBottom: spacing.xs }, style]}>{children}</Text>
);

export const H1: React.FC<{ children: React.ReactNode; style?: StyleProp<TextStyle> }> = ({ children, style }) => (
  <Text style={[typo.h1, style]}>{children}</Text>
);
export const H2: React.FC<{ children: React.ReactNode; style?: StyleProp<TextStyle> }> = ({ children, style }) => (
  <Text style={[typo.h2, style]}>{children}</Text>
);
export const H3: React.FC<{ children: React.ReactNode; style?: StyleProp<TextStyle> }> = ({ children, style }) => (
  <Text style={[typo.h3, style]}>{children}</Text>
);
export const Mono: React.FC<{ children: React.ReactNode; large?: boolean; style?: StyleProp<TextStyle> }> = ({ children, large, style }) => (
  <Text style={[large ? typo.monoLarge : typo.mono, style]}>{children}</Text>
);

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
};

export const Button: React.FC<ButtonProps> = ({ title, onPress, variant = "primary", disabled, loading, testID, style, fullWidth = true }) => {
  const v = btnStyles[variant];
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.btnBase, v.bg, fullWidth && { alignSelf: "stretch" }, disabled && { opacity: 0.5 }, style]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg.color as string} />
      ) : (
        <Text style={[styles.btnText, v.fg]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export const Input: React.FC<TextInputProps & { label?: string; mono?: boolean; testID?: string }> = ({ label, mono, style, testID, ...rest }) => (
  <View style={{ marginBottom: spacing.md }}>
    {label ? <SectionLabel>{label}</SectionLabel> : null}
    <TextInput
      testID={testID}
      placeholderTextColor={colors.inkMuted}
      {...rest}
      style={[styles.input, mono && { fontFamily: "monospace", fontSize: 17 }, style]}
    />
  </View>
);

export const Pill: React.FC<{ children: string; color?: string; bg?: string; testID?: string }> = ({ children, color = colors.ink, bg = colors.bgMuted, testID }) => (
  <View testID={testID} style={[styles.pill, { backgroundColor: bg, borderColor: color }]}>
    <Text style={{ color, fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 }}>{children}</Text>
  </View>
);

export const Divider: React.FC<{ vertical?: boolean }> = ({ vertical }) => (
  <View style={vertical ? { width: 1, backgroundColor: colors.border, alignSelf: "stretch" } : { height: 1, backgroundColor: colors.border, marginVertical: spacing.md }} />
);

export const Row: React.FC<{ children: React.ReactNode; style?: StyleProp<ViewStyle> }> = ({ children, style }) => (
  <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>{children}</View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  btnBase: { height: 52, paddingHorizontal: 20, alignItems: "center", justifyContent: "center", borderWidth: 2 },
  btnText: { fontSize: 14, fontWeight: "800", letterSpacing: 1, textTransform: "uppercase" },
  input: { height: 52, borderWidth: 2, borderColor: colors.border, paddingHorizontal: 14, fontSize: 16, color: colors.ink, backgroundColor: colors.bg },
  pill: { paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, alignSelf: "flex-start" },
});

const btnStyles = {
  primary: { bg: { backgroundColor: colors.orange, borderColor: colors.orange }, fg: { color: "#FFF" } },
  secondary: { bg: { backgroundColor: colors.ink, borderColor: colors.ink }, fg: { color: "#FFF" } },
  outline: { bg: { backgroundColor: "transparent", borderColor: colors.ink }, fg: { color: colors.ink } },
  ghost: { bg: { backgroundColor: "transparent", borderColor: "transparent" }, fg: { color: colors.ink } },
  danger: { bg: { backgroundColor: colors.error, borderColor: colors.error }, fg: { color: "#FFF" } },
} as const;
