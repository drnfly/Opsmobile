import { useCallback, useEffect, useState } from "react";
import { View, Text, Modal, Alert, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/src/components/Screen";
import { Card, Input, Button, Mono, SectionLabel, Pill, Row, H3 } from "@/src/components/ui";
import { api } from "@/src/api/client";
import { colors, spacing, type as typo } from "@/src/theme";

type V = {
  id: string; name: string; contact_name: string; phone: string; email: string; address: string;
  categories: string[]; freight_terms: string; truck_capacity: string; lead_time_days: number; notes: string;
};

const CAT_OPTIONS = ["NUDURA", "Fox", "Amvic", "BuildBlock", "Standard"];

export default function VendorsScreen() {
  const [vendors, setVendors] = useState<V[]>([]);
  const [editing, setEditing] = useState<Partial<V> | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try { setVendors(await api<V[]>("/vendors")); } catch (e) { console.warn(e); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing?.name) { Alert.alert("Required", "Vendor name"); return; }
    try {
      const body = {
        name: editing.name || "", contact_name: editing.contact_name || "",
        phone: editing.phone || "", email: editing.email || "", address: editing.address || "",
        categories: editing.categories || [], freight_terms: editing.freight_terms || "",
        truck_capacity: editing.truck_capacity || "", lead_time_days: Number(editing.lead_time_days) || 0,
        notes: editing.notes || "",
      };
      if (editing.id) await api(`/vendors/${editing.id}`, { method: "PUT", body: JSON.stringify(body) });
      else await api("/vendors", { method: "POST", body: JSON.stringify(body) });
      setEditing(null); load();
    } catch (e: any) { Alert.alert("Save failed", e.message); }
  };

  const del = async (id: string) => {
    try { await api(`/vendors/${id}`, { method: "DELETE" }); load(); }
    catch (e: any) { Alert.alert("Delete failed", e.message); }
  };

  const toggleCat = (c: string) => {
    setEditing((v) => {
      const cur = v?.categories || [];
      return { ...v!, categories: cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c] };
    });
  };

  return (
    <Screen title="Vendors" subtitle="ICF block supplier directory" back
      rightAction={{ icon: "add", onPress: () => setEditing({ name: "", categories: [] }), testID: "new-vendor-btn" }}
      onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }}
      refreshing={refreshing} testID="vendors-screen">

      {vendors.length === 0 ? (
        <Card><Text style={[typo.body, { color: colors.inkMuted }]}>No vendors yet.</Text></Card>
      ) : vendors.map((v) => (
        <Card key={v.id} style={{ marginBottom: spacing.sm }} testID={`vendor-${v.id}`}>
          <H3>{v.name}</H3>
          {v.contact_name ? <Text style={[typo.label, { marginTop: 2 }]}>{v.contact_name}</Text> : null}
          <Row style={{ marginTop: 8, gap: 8, flexWrap: "wrap" }}>
            {v.categories.map((c) => <Pill key={c}>{c}</Pill>)}
          </Row>
          {(v.phone || v.email) ? (
            <Row style={{ marginTop: 10, gap: spacing.md }}>
              {v.phone ? (
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${v.phone}`)} testID={`call-${v.id}`}>
                  <Row style={{ gap: 4 }}><Ionicons name="call-outline" size={14} color={colors.orange} /><Mono style={{ fontSize: 12 }}>{v.phone}</Mono></Row>
                </TouchableOpacity>
              ) : null}
              {v.email ? (
                <TouchableOpacity onPress={() => Linking.openURL(`mailto:${v.email}`)} testID={`email-${v.id}`}>
                  <Row style={{ gap: 4 }}><Ionicons name="mail-outline" size={14} color={colors.orange} /><Mono style={{ fontSize: 12 }}>{v.email}</Mono></Row>
                </TouchableOpacity>
              ) : null}
            </Row>
          ) : null}
          <Row style={{ marginTop: 8, gap: spacing.md, flexWrap: "wrap" }}>
            {v.freight_terms ? <Text style={typo.label}>Freight <Mono style={{ fontSize: 12 }}>{v.freight_terms}</Mono></Text> : null}
            {v.truck_capacity ? <Text style={typo.label}>Truck <Mono style={{ fontSize: 12 }}>{v.truck_capacity}</Mono></Text> : null}
            {v.lead_time_days > 0 ? <Text style={typo.label}>Lead <Mono style={{ fontSize: 12 }}>{v.lead_time_days}d</Mono></Text> : null}
          </Row>
          <Row style={{ gap: spacing.sm, marginTop: spacing.sm }}>
            <View style={{ flex: 1 }}><Button title="Edit" onPress={() => setEditing(v)} variant="outline" testID={`edit-vendor-${v.id}`} /></View>
            <View style={{ flex: 1 }}><Button title="Delete" onPress={() => del(v.id)} variant="danger" testID={`del-vendor-${v.id}`} /></View>
          </Row>
        </Card>
      ))}

      <Modal visible={!!editing} animationType="slide" onRequestClose={() => setEditing(null)}>
        <Screen title={editing?.id ? "Edit Vendor" : "New Vendor"} back rightAction={{ icon: "close", onPress: () => setEditing(null), testID: "close-vendor-edit" }}>
          <Input label="Name" value={editing?.name || ""} onChangeText={(t) => setEditing({ ...editing!, name: t })} testID="v-name" />
          <Input label="Contact" value={editing?.contact_name || ""} onChangeText={(t) => setEditing({ ...editing!, contact_name: t })} testID="v-contact" />
          <Row style={{ gap: spacing.md }}>
            <View style={{ flex: 1 }}><Input label="Phone" value={editing?.phone || ""} onChangeText={(t) => setEditing({ ...editing!, phone: t })} keyboardType="phone-pad" mono testID="v-phone" /></View>
            <View style={{ flex: 1 }}><Input label="Email" value={editing?.email || ""} onChangeText={(t) => setEditing({ ...editing!, email: t })} keyboardType="email-address" autoCapitalize="none" testID="v-email" /></View>
          </Row>
          <Input label="Address" value={editing?.address || ""} onChangeText={(t) => setEditing({ ...editing!, address: t })} testID="v-address" />
          <SectionLabel>Categories</SectionLabel>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 8 }} style={{ marginBottom: spacing.md }}>
            {CAT_OPTIONS.map((c) => {
              const active = (editing?.categories || []).includes(c);
              return (
                <View key={c} style={{ flexShrink: 0 }}>
                  <Button title={c} onPress={() => toggleCat(c)} variant={active ? "primary" : "outline"} fullWidth={false} testID={`v-cat-${c}`} />
                </View>
              );
            })}
          </ScrollView>
          <Input label="Freight Terms" value={editing?.freight_terms || ""} onChangeText={(t) => setEditing({ ...editing!, freight_terms: t })} testID="v-freight" />
          <Row style={{ gap: spacing.md }}>
            <View style={{ flex: 1 }}><Input label="Truck Capacity" value={editing?.truck_capacity || ""} onChangeText={(t) => setEditing({ ...editing!, truck_capacity: t })} mono testID="v-truck" /></View>
            <View style={{ flex: 1 }}><Input label="Lead (days)" value={String(editing?.lead_time_days ?? 0)} onChangeText={(t) => setEditing({ ...editing!, lead_time_days: Number(t) || 0 })} keyboardType="number-pad" mono testID="v-lead" /></View>
          </Row>
          <Input label="Notes" value={editing?.notes || ""} onChangeText={(t) => setEditing({ ...editing!, notes: t })} testID="v-notes" />
          <Button title="Save" onPress={save} testID="save-vendor-btn" />
        </Screen>
      </Modal>
    </Screen>
  );
}
