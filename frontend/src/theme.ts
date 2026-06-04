// Concrete Form — Swiss / high-contrast design tokens.
import { Platform } from "react-native";

export const colors = {
  bg: "#FFFFFF",
  bgMuted: "#F4F4F5",
  ink: "#09090B",
  inkSecondary: "#52525B",
  inkMuted: "#A1A1AA",
  inverse: "#FFFFFF",
  orange: "#FF6A00",
  orangeHover: "#E65C00",
  border: "#E4E4E7",
  borderStrong: "#09090B",
  success: "#16A34A",
  warning: "#F59E0B",
  error: "#DC2626",
  info: "#2563EB",
};

export const radii = { none: 0, sm: 2, md: 4 };

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };

export const fonts = {
  display: Platform.select({ ios: "Helvetica Neue", android: "sans-serif-condensed", default: "System" })!,
  body: Platform.select({ ios: "System", android: "Roboto", default: "System" })!,
  mono: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" })!,
};

export const type = {
  h1: { fontFamily: fonts.display, fontWeight: "900" as const, fontSize: 32, letterSpacing: -0.5, color: colors.ink, textTransform: "uppercase" as const },
  h2: { fontFamily: fonts.display, fontWeight: "800" as const, fontSize: 22, color: colors.ink },
  h3: { fontFamily: fonts.display, fontWeight: "700" as const, fontSize: 18, color: colors.ink, textTransform: "uppercase" as const, letterSpacing: 0.5 },
  body: { fontFamily: fonts.body, fontSize: 15, color: colors.ink },
  label: { fontFamily: fonts.body, fontSize: 11, fontWeight: "700" as const, color: colors.inkSecondary, textTransform: "uppercase" as const, letterSpacing: 1 },
  mono: { fontFamily: fonts.mono, fontSize: 16, color: colors.ink },
  monoLarge: { fontFamily: fonts.mono, fontSize: 28, color: colors.ink, fontWeight: "700" as const },
};
