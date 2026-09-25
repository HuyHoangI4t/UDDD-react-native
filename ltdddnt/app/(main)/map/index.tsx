import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from "../../../src/constants/appColors";
import { mainStyles as s } from "../../../src/constants/globalStyles";

const CAMPUS_BUILDINGS = [
  { id: 1, name: "Tòa A Kỹ thuật", x: 28, y: 32, type: "academic", color: AppColors.accent },
  { id: 2, name: "Thư viện trung tâm", x: 52, y: 20, type: "library", color: AppColors.success },
  { id: 3, name: "Căng tin sinh viên", x: 68, y: 45, type: "food", color: AppColors.warning },
  { id: 4, name: "Tòa hành chính", x: 42, y: 58, type: "admin", color: AppColors.primary },
  { id: 5, name: "Khoa Khoa học sức khỏe", x: 20, y: 65, type: "academic", color: AppColors.accent },
  { id: 6, name: "Khu thể thao", x: 75, y: 68, type: "sports", color: AppColors.danger },
  { id: 7, name: "Khoa Nghệ thuật", x: 55, y: 72, type: "academic", color: AppColors.accent },
  { id: 8, name: "Trung tâm CNTT", x: 35, y: 48, type: "tech", color: "#22D3EE" },
];

function Card({ style, children }: { style?: object; children: React.ReactNode }) {
  return <View style={[s.card, style]}>{children}</View>;
}

function NavHeader({
  title, subtitle, onBack, rightIcon, onRight, bg = AppColors.primary, children,
}: {
  title: string; subtitle?: string; onBack?: () => void;
  rightIcon?: string; onRight?: () => void; bg?: string; children?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingHorizontal: 24, paddingTop: Math.max(insets.top + 16, 20), paddingBottom: 20, backgroundColor: bg }}>
      <View style={[s.row, { gap: 12, marginBottom: children ? 16 : 0 }]}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={[s.iconBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Feather name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#fff", fontWeight: "900", fontSize: 18 }}>{title}</Text>
          {subtitle ? <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 }}>{subtitle}</Text> : null}
        </View>
        {rightIcon && (
          <TouchableOpacity onPress={onRight} style={[s.iconBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Feather name={rightIcon as any} size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<(typeof CAMPUS_BUILDINGS)[0] | null>(null);
  const [filter, setFilter] = useState("all");
  const MAP_H = 280;
  const filters = ["all", "academic", "library", "food", "sports", "tech"];
  const filterLabels: Record<string, string> = {
    all: "Tất cả", academic: "Học thuật", library: "Thư viện", food: "Ăn uống", sports: "Thể thao", tech: "CNTT",
  };
  const typeLabels: Record<string, string> = {
    academic: "Tòa học thuật", library: "Thư viện", food: "Ăn uống",
    admin: "Hành chính", sports: "Khu thể thao", tech: "Trung tâm CNTT",
  };

  return (
    <View style={{ flex: 1, backgroundColor: AppColors.background, paddingBottom: 100 }}>
      <NavHeader title="Bản đồ khuôn viên" onBack={() => router.push("/(main)/map")} rightIcon="filter">
        <View style={[s.inputRow, { backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)" }]}>
          <Feather name="search" size={14} color="rgba(255,255,255,0.5)" style={{ marginLeft: 14 }} />
          <TextInput style={[s.input, { color: "#fff" }]} placeholder="Tìm kiếm tòa nhà, phòng..." placeholderTextColor="rgba(255,255,255,0.5)" />
        </View>
      </NavHeader>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
        {filters.map((f) => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[s.chip, filter === f && { backgroundColor: AppColors.primary, borderColor: AppColors.primary }]}>
            <Text style={[s.chipText, filter === f && { color: "#fff" }]}>{filterLabels[f]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ marginHorizontal: 16, borderRadius: 16, overflow: "hidden", height: MAP_H, backgroundColor: "#E8EDF5", borderWidth: 1, borderColor: AppColors.border }}>
        <View style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1.5, backgroundColor: "#CBD5E1" }} />
        <View style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1.5, backgroundColor: "#CBD5E1" }} />
        <View style={{ position: "absolute", top: "35%", left: "33%", width: 100, height: 60, borderRadius: 50, backgroundColor: "#D1FAE5" }} />

        {CAMPUS_BUILDINGS.filter((b) => filter === "all" || b.type === filter).map((b) => (
          <TouchableOpacity key={b.id} onPress={() => setSelected(selected?.id === b.id ? null : b)} activeOpacity={0.8}
            style={{ position: "absolute", left: `${b.x}%` as any, top: `${b.y}%` as any, transform: [{ translateX: -16 }, { translateY: -16 }] }}>
            {selected?.id === b.id && (
              <View style={{ position: "absolute", bottom: 36, left: "50%", transform: [{ translateX: -60 }], backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: AppColors.border, width: 120, elevation: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: AppColors.textForeground }}>{b.name}</Text>
              </View>
            )}
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: b.color, alignItems: "center", justifyContent: "center", elevation: 4, shadowColor: b.color, shadowOpacity: 0.4, shadowRadius: 4, transform: [{ scale: selected?.id === b.id ? 1.2 : 1 }] }}>
              <Feather name="map-pin" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ position: "absolute", left: "50%", top: "50%", transform: [{ translateX: -8 }, { translateY: -8 }] }}>
          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: AppColors.info, borderWidth: 2, borderColor: "#fff", elevation: 6 }} />
        </View>
        <View style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: AppColors.border, elevation: 4 }}>
          <Feather name="navigation" size={14} color={AppColors.primary} />
        </View>
      </View>

      {selected && (
        <Card style={{ margin: 16 }}>
          <View style={[s.row, s.between]}>
            <View style={s.row}>
              <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: selected.color, alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                <Feather name="map-pin" size={12} color="#fff" />
              </View>
              <View>
                <Text style={{ fontSize: 10, fontWeight: "700", color: AppColors.textMuted }}>{typeLabels[selected.type]}</Text>
                <Text style={{ fontSize: 14, fontWeight: "900", color: AppColors.textForeground }}>{selected.name}</Text>
              </View>
            </View>
            <TouchableOpacity style={{ backgroundColor: AppColors.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>Chỉ đường</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}
    </View>
  );
}
