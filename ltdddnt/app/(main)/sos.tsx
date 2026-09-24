import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Linking } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from "../../src/constants/appColors";
import { mainStyles as s } from "../../src/constants/globalStyles";

const EMERGENCY_CONTACTS = [
  { title: "Bảo vệ khuôn viên", number: "028.3835.xxxx", desc: "Trực 24/7 hỗ trợ an ninh cổng trường", icon: "shield", color: AppColors.danger },
  { title: "Phòng Y tế Trường", number: "028.3835.yyyy", desc: "Sơ cứu, cấp cứu & chăm sóc sức khỏe", icon: "activity", color: AppColors.success },
  { title: "Đường dây nóng sinh viên", number: "028.3835.zzzz", desc: "Hỗ trợ khẩn cấp tâm lý & sự cố", icon: "phone-call", color: AppColors.warning },
  { title: "Cảnh sát 113", number: "113", desc: "Công an khẩn cấp", icon: "alert-octagon", color: "#DC2626" },
];

export default function SosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sosSent, setSosSent] = useState(false);
  const [incidentType, setIncidentType] = useState("An ninh");
  const [locationDesc, setLocationDesc] = useState("");
  const [note, setNote] = useState("");

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert("Gọi điện", `Không thể thực hiện cuộc gọi tới số: ${number}`);
    });
  };

  const handleSendSos = () => {
    setSosSent(true);
    Alert.alert(
      "Đã gửi tín hiệu SOS!",
      "Đội an ninh và y tế đã nhận được vị trí và thông tin của bạn. Lực lượng hỗ trợ đang di chuyển đến vị trí của bạn.",
      [{ text: "Đã hiểu" }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: AppColors.background }}>
      {/* Red Emergency Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: Math.max(insets.top + 16, 20), paddingBottom: 20, backgroundColor: AppColors.danger }}>
        <View style={[s.row, { gap: 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={[s.iconBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Feather name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 18 }}>SOS Khẩn Cấp 🚨</Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 }}>Hỗ trợ an ninh & y tế khẩn cấp trong trường</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, gap: 20 }} showsVerticalScrollIndicator={false}>
        {/* SOS Panic Button Card */}
        <View style={[s.card, { backgroundColor: "#FEF2F2", borderColor: "#FCA5A5", alignItems: "center", padding: 24 }]}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: AppColors.danger, alignItems: "center", justifyContent: "center", marginBottom: 16, elevation: 6, shadowColor: AppColors.danger, shadowOpacity: 0.4, shadowRadius: 10 }}>
            <MaterialIcons name="sos" size={40} color="#fff" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: "900", color: "#DC2626", textAlign: "center", marginBottom: 6 }}>Báo Động Khẩn Cấp</Text>
          <Text style={{ fontSize: 13, color: AppColors.textMuted, textAlign: "center", marginBottom: 16, lineHeight: 18 }}>
            Nhấn nút bên dưới để gửi cảnh báo SOS kèm vị trí hiện tại của bạn đến lực lượng bảo vệ trường ngay lập tức.
          </Text>
          <TouchableOpacity
            onPress={handleSendSos}
            activeOpacity={0.8}
            style={{ width: "100%", height: 52, backgroundColor: AppColors.danger, borderRadius: 16, alignItems: "center", justifyContent: "center", elevation: 4 }}
          >
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 15, textTransform: "uppercase", letterSpacing: 1 }}>
              {sosSent ? "✓ ĐÃ GỬI SOS (Đang hỗ trợ)" : "Gửi Tín Hiệu SOS Ngay"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Contacts */}
        <View>
          <Text style={s.label}>SỐ ĐIỆN THOẠI KHẨN CẤP</Text>
          <View style={{ gap: 10, marginTop: 4 }}>
            {EMERGENCY_CONTACTS.map((c) => (
              <View key={c.title} style={[s.card, s.row, s.between, { padding: 14 }]}>
                <View style={[s.row, { flex: 1, marginRight: 12 }]}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: c.color + "15", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                    <Feather name={c.icon as any} size={20} color={c.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "800", color: AppColors.textForeground }}>{c.title}</Text>
                    <Text style={{ fontSize: 11, color: AppColors.textMuted, marginTop: 2 }}>{c.desc}</Text>
                    <Text style={{ fontSize: 13, fontWeight: "900", color: c.color, marginTop: 4 }}>{c.number}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleCall(c.number)}
                  style={{ backgroundColor: c.color, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Feather name="phone" size={14} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>Gọi</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Report Incident Form */}
        <View style={[s.card, { padding: 16, gap: 14 }]}>
          <Text style={s.label}>BÁO CÁO SỰ CỐ KHẨN CẤP</Text>
          <View>
            <Text style={{ fontSize: 12, fontWeight: "700", color: AppColors.textForeground, marginBottom: 6 }}>Loại sự cố</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {["An ninh", "Y tế", "Cháy nổ", "Tai nạn", "Khác"].map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setIncidentType(type)}
                  style={[s.chip, incidentType === type && { backgroundColor: AppColors.danger, borderColor: AppColors.danger }]}
                >
                  <Text style={[s.chipText, incidentType === type && { color: "#fff" }]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Text style={{ fontSize: 12, fontWeight: "700", color: AppColors.textForeground, marginBottom: 6 }}>Vị trí cụ thể của bạn</Text>
            <TextInput
              style={s.inputPlain}
              placeholder="Ví dụ: Tòa A, tầng 3, gần phòng học A302..."
              placeholderTextColor={AppColors.textMuted}
              value={locationDesc}
              onChangeText={setLocationDesc}
            />
          </View>

          <View>
            <Text style={{ fontSize: 12, fontWeight: "700", color: AppColors.textForeground, marginBottom: 6 }}>Ghi chú thêm (tùy chọn)</Text>
            <TextInput
              style={[s.inputPlain, { height: 80, textAlignVertical: "top" }]}
              placeholder="Mô tả ngắn gọn tình trạng..."
              placeholderTextColor={AppColors.textMuted}
              multiline
              value={note}
              onChangeText={setNote}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              if (!locationDesc.trim()) {
                Alert.alert("Thông báo", "Vui lòng nhập vị trí cụ thể của bạn để đội hỗ trợ tìm thấy nhanh chóng.");
                return;
              }
              Alert.alert("Thành công", "Đã gửi báo cáo sự cố đến ban quản lý an ninh trường.");
              setLocationDesc("");
              setNote("");
            }}
            style={[s.primaryBtn, { backgroundColor: AppColors.danger, marginTop: 4 }]}
          >
            <Text style={s.primaryBtnText}>Gửi Báo Cáo Sự Cố</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
