import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from "../../src/constants/appColors";
import { mainStyles as s } from "../../src/constants/globalStyles";

const EVENTS = [
  { id: 1, title: "Tech Innovation Summit 2025", category: "Công nghệ", date: "5 Tháng 8, 2025", time: "10:00 AM", location: "Hội trường chính", attendees: 312, capacity: 400, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=780&h=256&fit=crop", rsvp: false, description: "Sự kiện thường niên giới thiệu các dự án công nghệ của sinh viên và các bài phát biểu chuyên ngành." },
  { id: 2, title: "Kết nối nhóm học tập", category: "Học thuật", date: "3 Tháng 8, 2025", time: "3:00 PM", location: "Thư viện", attendees: 89, capacity: 120, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=780&h=256&fit=crop", rsvp: true, description: "Kết nối với bạn bè cùng khoa để học nhóm." },
  { id: 3, title: "Hội chợ Sức khỏe Tâm thần", category: "Sức khỏe", date: "7 Tháng 8, 2025", time: "9:00 AM", location: "Trung tâm sinh viên", attendees: 56, capacity: 200, image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=780&h=256&fit=crop", rsvp: false, description: "Kết nối với các tư vấn viên và nguồn lực sức khỏe tâm thần." },
  { id: 4, title: "Chung kết bóng đá các khoa", category: "Thể thao", date: "9 Tháng 8, 2025", time: "2:00 PM", location: "Khu thể thao", attendees: 480, capacity: 500, image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=780&h=256&fit=crop", rsvp: true, description: "Cổ vũ cho khoa của bạn trong trận chung kết." },
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

export default function EventsScreen() {
  const router = useRouter();
  const [events, setEvents] = useState(EVENTS);
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const cats = ["Tất cả", "Công nghệ", "Học thuật", "Sức khỏe", "Thể thao"];

  const toggleRsvp = (id: number) =>
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, rsvp: !e.rsvp, attendees: e.rsvp ? e.attendees - 1 : e.attendees + 1 } : e));

  const filtered = activeFilter === "Tất cả" ? events : events.filter((e) => e.category === activeFilter);

  const catColors: Record<string, { bg: string; text: string }> = {
    "Công nghệ": { bg: "#EDE9FE", text: "#5B21B6" },
    "Học thuật": { bg: "#DBEAFE", text: "#1E40AF" },
    "Sức khỏe": { bg: "#D1FAE5", text: "#065F46" },
    "Thể thao": { bg: "#FEE2E2", text: "#991B1B" },
  };

  return (
    <View style={{ flex: 1, backgroundColor: AppColors.background }}>
      <NavHeader title="Sự kiện" subtitle={`${events.filter((e) => e.rsvp).length} sự kiện đã tham gia`} onBack={() => router.push("/(main)")} rightIcon="search">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {cats.map((c) => (
            <TouchableOpacity key={c} onPress={() => setActiveFilter(c)}
              style={[s.chip, activeFilter === c ? { backgroundColor: "#fff", borderColor: "#fff" } : { backgroundColor: "rgba(255,255,255,0.15)", borderColor: "transparent" }]}>
              <Text style={[s.chipText, activeFilter === c ? { color: AppColors.primary } : { color: "rgba(255,255,255,0.7)" }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </NavHeader>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, gap: 16 }} showsVerticalScrollIndicator={false}>
        {filtered.map((ev) => {
          const cc = catColors[ev.category] ?? { bg: "#F3F4F6", text: "#374151" };
          return (
            <Card key={ev.id} style={{ padding: 0, overflow: "hidden" }}>
              <View style={{ height: 128 }}>
                <Image source={{ uri: ev.image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.5)"]} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
                <View style={{ position: "absolute", top: 12, left: 12, backgroundColor: cc.bg, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Text style={{ fontSize: 10, fontWeight: "900", color: cc.text }}>{ev.category}</Text>
                </View>
                {ev.rsvp && (
                  <View style={{ position: "absolute", top: 12, right: 12, width: 24, height: 24, borderRadius: 12, backgroundColor: AppColors.success, alignItems: "center", justifyContent: "center" }}>
                    <Feather name="check" size={12} color="#fff" />
                  </View>
                )}
              </View>
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: "900", color: AppColors.textForeground, marginBottom: 8 }}>{ev.title}</Text>
                <Text style={{ fontSize: 12, color: AppColors.textMuted, lineHeight: 18, marginBottom: 12 }}>{ev.description}</Text>
                <View style={{ gap: 6, marginBottom: 12 }}>
                  <View style={{ flexDirection: "row", gap: 16 }}>
                    <View style={s.row}><Feather name="calendar" size={11} color={AppColors.textMuted} /><Text style={{ fontSize: 11, fontWeight: "600", color: AppColors.textForeground, marginLeft: 4 }}>{ev.date}</Text></View>
                    <View style={s.row}><Feather name="clock" size={11} color={AppColors.textMuted} /><Text style={{ fontSize: 11, fontWeight: "600", color: AppColors.textForeground, marginLeft: 4 }}>{ev.time}</Text></View>
                  </View>
                  <View style={s.row}><Feather name="map-pin" size={11} color={AppColors.textMuted} /><Text style={{ fontSize: 11, fontWeight: "600", color: AppColors.textForeground, marginLeft: 4 }}>{ev.location}</Text></View>
                </View>
                <View style={[s.row, s.between]}>
                  <View>
                    <View style={[s.row, { marginBottom: 4 }]}>
                      <Feather name="users" size={11} color={AppColors.textMuted} />
                      <Text style={{ fontSize: 11, fontWeight: "600", color: AppColors.textMuted, marginLeft: 4 }}>{ev.attendees}/{ev.capacity}</Text>
                    </View>
                    <View style={{ width: 112, height: 6, backgroundColor: AppColors.muted, borderRadius: 3, overflow: "hidden" }}>
                      <View style={{ height: "100%", width: `${(ev.attendees / ev.capacity) * 100}%`, backgroundColor: AppColors.accent, borderRadius: 3 }} />
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => toggleRsvp(ev.id)} activeOpacity={0.85}
                    style={{ backgroundColor: ev.rsvp ? AppColors.success : AppColors.primary, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 }}>
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "900" }}>{ev.rsvp ? "✓ Đã tham gia" : "Tham gia"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}
