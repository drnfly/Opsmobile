import { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/src/context/AuthContext";
import { Button, Input, H1, H3 } from "@/src/components/ui";
import { colors, spacing, type as typo } from "@/src/theme";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@concreteform.com");
  const [password, setPassword] = useState("ChangeMe123!");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async () => {
    setErr(null);
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (e: any) {
      setErr(e.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.heroWrap}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1669170930713-f7c778496177?crop=entropy&cs=srgb&fm=jpg&w=1200&q=80" }}
              style={styles.hero}
              resizeMode="cover"
            />
            <View style={styles.heroOverlay} />
            <View style={styles.brandRow}>
              <View style={styles.brandTile} />
              <Text style={styles.brand}>CONCRETE FORM</Text>
            </View>
            <Text style={styles.tagline}>ICF Field Tools</Text>
          </View>

          <View style={styles.form}>
            <H1>SIGN IN</H1>
            <Text style={[typo.body, { color: colors.inkSecondary, marginTop: 4, marginBottom: spacing.lg }]}>
              Built for the field. Built for gloves.
            </Text>

            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              testID="login-email-input"
            />
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              testID="login-password-input"
            />

            {err ? (
              <View style={styles.errBox} testID="login-error">
                <Text style={{ color: colors.error, fontWeight: "700" }}>{err}</Text>
              </View>
            ) : null}

            <Button title="Sign In" onPress={onSubmit} loading={busy} testID="login-submit-button" />

            <View style={styles.hintBox}>
              <H3 style={{ fontSize: 11 }}>SEEDED ADMIN</H3>
              <Text style={[typo.mono, { fontSize: 12, color: colors.inkSecondary }]}>admin@concreteform.com</Text>
              <Text style={[typo.mono, { fontSize: 12, color: colors.inkSecondary }]}>ChangeMe123!</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1 },
  heroWrap: { height: 220, position: "relative", backgroundColor: colors.ink },
  hero: { ...StyleSheet.absoluteFillObject, opacity: 0.55 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(9,9,11,0.45)" },
  brandRow: { position: "absolute", left: spacing.lg, bottom: 48, flexDirection: "row", alignItems: "center" },
  brandTile: { width: 14, height: 28, backgroundColor: colors.orange, marginRight: 10 },
  brand: { color: "#FFF", fontSize: 22, fontWeight: "900", letterSpacing: 1, textTransform: "uppercase" },
  tagline: { position: "absolute", left: spacing.lg, bottom: 24, color: "#FFF", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.85 },
  form: { padding: spacing.lg, paddingTop: spacing.xl },
  errBox: { borderWidth: 2, borderColor: colors.error, backgroundColor: "#FEF2F2", padding: spacing.md, marginBottom: spacing.md },
  hintBox: { marginTop: spacing.xl, padding: spacing.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgMuted },
});
