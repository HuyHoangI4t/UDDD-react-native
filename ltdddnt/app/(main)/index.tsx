import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from "../../src/constants/appColors";
import { mainStyles as s } from "../../src/constants/globalStyles";

const ALERTS = [
  { id: 1, type: "info", text: "Thư viện đóng cửa lúc 8 giờ tối nay để bảo trì.", time: "2 giờ trước" },
  { id: 2, type: "warning", text: "Đổi phòng: CS301 chuyển sang ENG-B204 từ ENG-B201.", time: "45 phút trước" },
  { id: 3, type: "success", text: "Phản hồi #204 của bạn đã được giải quyết.", time: "1 giờ trước" },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const onNavigate = (screen: string) => {
    if (screen === "home") router.push("/(main)");
    else router.push(`/(main)/${screen}` as any);
  };

  const quickActions = [
    { icon: "navigation", label: "Bản đồ", screen: "map", bg: AppColors.muted, fg: AppColors.accent },
    { icon: "calendar", label: "Lịch học", screen: "schedule", bg: "#DBEAFE", fg: AppColors.primary },
    { icon: "message-square", label: "Phản hồi", screen: "feedback", bg: "#FEF3C7", fg: "#D97706" },
    { icon: "bar-chart-2", label: "Kết quả", screen: "grades", bg: "#D1FAE5", fg: "#059669" },
  ];

  const alertMeta: Record<string, { icon: string; color: string; bg: string; border: string }> = {
    info: { icon: "info", color: AppColors.info, bg: "#EFF6FF", border: "#BFDBFE" },
    warning: { icon: "alert-triangle", color: AppColors.warning, bg: "#FFFBEB", border: "#FDE68A" },
    success: { icon: "check", color: AppColors.success, bg: "#ECFDF5", border: "#A7F3D0" },
  };

  const stats = [
    { label: "Ghế Thư viện", value: "34", sub: "Còn trống", icon: "book-open", color: AppColors.success },
    { label: "Căng tin", value: "8 phút", sub: "Thời gian chờ", icon: "coffee", color: AppColors.warning },
    { label: "Sự kiện", value: "5", sub: "Diễn ra hôm nay", icon: "star", color: AppColors.purple },
    { label: "WiFi", value: "Mạnh", sub: "Tất cả vùng ổn định", icon: "wifi", color: AppColors.info },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: AppColors.background }} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={[AppColors.primary, AppColors.primary]}
        style={{ paddingHorizontal: 24, paddingTop: Math.max(insets.top + 16, 24), paddingBottom: 32 }}
      >
        <View style={[s.row, s.between, { marginBottom: 16 }]}>
          <View>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 }}>Chào buổi sáng</Text>
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "900" }}>Kwame Asante 👋</Text>
          </View>
          <View style={s.row}>
            <TouchableOpacity onPress={() => onNavigate("sos")} style={[s.iconBtn, { backgroundColor: AppColors.danger, marginRight: 8 }]}>
              <Feather name="shield" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate("profile")} style={[s.iconBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Feather name="user" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }}>
          <View style={[s.row, s.between, { marginBottom: 8 }]}>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 }}>Lớp tiếp theo</Text>
            <View style={{ backgroundColor: AppColors.accent, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>Đang diễn ra</Text>
            </View>
          </View>
          <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16, marginBottom: 6 }}>Calculus III</Text>
          <View style={s.row}>
            <Feather name="clock" size={12} color="rgba(255,255,255,0.6)" />
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginLeft: 4, marginRight: 16 }}>10:00 – 11:30</Text>
            <Feather name="map-pin" size={12} color="rgba(255,255,255,0.6)" />
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginLeft: 4 }}>SCI-A101</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigate("map")} style={[s.row, { marginTop: 12 }]}>
            <Text style={{ color: "#A5B4FC", fontSize: 12, fontWeight: "700", marginRight: 4 }}>Đến lớp</Text>
            <Feather name="chevron-right" size={12} color="#A5B4FC" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={{ paddingHorizontal: 24, marginTop: -16, gap: 20, paddingBottom: 110 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          {quickActions.map(({ icon, label, screen, bg, fg }) => (
            <TouchableOpacity key={screen} onPress={() => onNavigate(screen)} activeOpacity={0.8}
              style={{ flex: 1, backgroundColor: AppColors.cardBg, borderRadius: 16, padding: 12, alignItems: "center", borderWidth: 1, borderColor: AppColors.border, elevation: 2, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: bg, alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <Feather name={icon as any} size={20} color={fg} />
              </View>
              <Text style={{ fontSize: 10, fontWeight: "700", color: AppColors.textForeground, textAlign: "center" }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View>
          <View style={[s.row, s.between, { marginBottom: 12 }]}>
            <Text style={s.sectionTitle}>Cảnh báo</Text>
            <Text style={s.sectionLink}>Xem tất cả</Text>
          </View>
          <View style={{ gap: 8 }}>
            {ALERTS.map((a) => {
              const m = alertMeta[a.type];
              return (
                <View key={a.id} style={[s.row, { padding: 12, borderRadius: 12, borderWidth: 1, backgroundColor: m.bg, borderColor: m.border, alignItems: "flex-start" }]}>
                  <Feather name={m.icon as any} size={14} color={m.color} style={{ marginTop: 2 }} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: AppColors.textForeground, lineHeight: 18 }}>{a.text}</Text>
                    <Text style={{ fontSize: 10, color: AppColors.textMuted, marginTop: 2 }}>{a.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View>
          <Text style={[s.sectionTitle, { marginBottom: 12 }]}>Tổng quan hôm nay</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {stats.map(({ label, value, sub, icon, color }) => (
              <View key={label} style={{ width: "47%", backgroundColor: AppColors.cardBg, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: AppColors.border, elevation: 2, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 }}>
                <Feather name={icon as any} size={18} color={color} style={{ marginBottom: 8 }} />
                <Text style={{ fontSize: 18, fontWeight: "900", color: AppColors.textForeground }}>{value}</Text>
                <Text style={{ fontSize: 10, fontWeight: "700", color: AppColors.textMuted, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{label}</Text>
                <Text style={{ fontSize: 10, color: AppColors.textMuted }}>{sub}</Text>
              </View>
            ))}
          </View>
        </View>

        <View>
          <View style={[s.row, s.between, { marginBottom: 12 }]}>
            <Text style={s.sectionTitle}>Sự kiện sắp tới</Text>
            <TouchableOpacity onPress={() => onNavigate("events")}><Text style={s.sectionLink}>Xem tất cả</Text></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => onNavigate("events")} style={{ borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: AppColors.border }} activeOpacity={0.9}>
            <Image source={{ uri: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=780&h=300&fit=crop" }} style={{ width: "100%", height: 128 }} resizeMode="cover" />
            <LinearGradient colors={["transparent", "rgba(30,58,138,0.85)"]} style={{ ...StyleSheet.absoluteFillObject, justifyContent: "flex-end", padding: 16 }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
              <View style={{ backgroundColor: AppColors.accent, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-start", marginBottom: 4 }}>
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>Công nghệ</Text>
              </View>
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 14 }}>Tech Innovation Summit 2025</Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>5 Tháng 8 • Hội trường chính</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
