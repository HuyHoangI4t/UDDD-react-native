import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from "../../src/constants/appColors";
import { mainStyles as s } from "../../src/constants/globalStyles";

const CATEGORIES = [
  { id: "facility", label: "Cơ sở vật chất", icon: "home", color: "#F59E0B" },
  { id: "academic", label: "Học vụ & Giảng viên", icon: "book", color: "#3B82F6" },
  { id: "canteen", label: "Căng tin & Dịch vụ", icon: "coffee", color: "#10B981" },
  { id: "wifi", label: "WiFi & Mạng", icon: "wifi", color: "#8B5CF6" },
  { id: "other", label: "Khác", icon: "message-square", color: "#64748B" },
];

export default function FeedbackScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState("facility");
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ tiêu đề và nội dung phản hồi.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: AppColors.background }}>
      {/* Safe Area Header */}
      <View style={{ paddingHorizontal: 24, paddingTop: Math.max(insets.top + 16, 20), paddingBottom: 20, backgroundColor: AppColors.primary }}>
        <View style={[s.row, { gap: 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={[s.iconBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Feather name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 18 }}>Phản hồi & Góp ý</Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 }}>Gửi ý kiến đóng góp đến ban quản lý trường</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, gap: 20, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        {submitted ? (
          <View style={[s.card, { alignItems: "center", padding: 32, gap: 16 }]}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#ECFDF5", alignItems: "center", justifyContent: "center" }}>
              <Feather name="check" size={32} color={AppColors.success} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "900", color: AppColors.textForeground, textAlign: "center" }}>Gửi phản hồi thành công!</Text>
            <Text style={{ fontSize: 13, color: AppColors.textMuted, textAlign: "center", lineHeight: 20 }}>
              Cảm ơn bạn đã đóng góp ý kiến. Phản hồi của bạn đã được chuyển đến bộ phận phụ trách và sẽ được xử lý trong vòng 24 giờ.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSubmitted(false);
                setTitle("");
                setContent("");
                setRating(5);
              }}
              style={[s.primaryBtn, { width: "100%", marginTop: 8 }]}
            >
              <Text style={s.primaryBtnText}>Gửi phản hồi mới</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Category selection */}
            <View>
              <Text style={s.label}>CHỌN LĨNH VỰC</Text>
              <View style={{ gap: 8, marginTop: 4 }}>
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => setCategory(cat.id)}
                      activeOpacity={0.8}
                      style={[
                        s.row,
                        {
                          padding: 14,
                          borderRadius: 14,
                          backgroundColor: AppColors.cardBg,
                          borderWidth: 1.5,
                          borderColor: isSelected ? AppColors.accent : AppColors.border,
                        },
                      ]}
                    >
                      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: cat.color + "15", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                        <Feather name={cat.icon as any} size={18} color={cat.color} />
                      </View>
                      <Text style={{ flex: 1, fontSize: 14, fontWeight: isSelected ? "800" : "600", color: isSelected ? AppColors.primary : AppColors.textForeground }}>
                        {cat.label}
                      </Text>
                      {isSelected && <Feather name="check-circle" size={18} color={AppColors.accent} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Rating */}
            <View style={[s.card, { padding: 16 }]}>
              <Text style={[s.label, { marginBottom: 12 }]}>Đánh giá mức độ hài lòng</Text>
              <View style={[s.row, { justifyContent: "space-around" }]}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)} style={{ padding: 8 }}>
                    <MaterialIcons
                      name={star <= rating ? "star" : "star-border"}
                      size={32}
                      color={star <= rating ? AppColors.warning : AppColors.textMuted}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{ textAlign: "center", fontSize: 12, fontWeight: "700", color: AppColors.textMuted, marginTop: 8 }}>
                {rating === 5 ? "Rất hài lòng ⭐⭐⭐⭐⭐" : rating === 4 ? "Hài lòng ⭐⭐⭐⭐" : rating === 3 ? "Bình thường ⭐⭐⭐" : rating === 2 ? "Chưa hài lòng ⭐⭐" : "Rất tệ ⭐"}
              </Text>
            </View>

            {/* Title & Content */}
            <View style={{ gap: 14 }}>
              <View>
                <Text style={s.label}>TIÊU ĐỀ PHẢN HỒI</Text>
                <TextInput
                  style={s.inputPlain}
                  placeholder="Ví dụ: Máy chiếu phòng học A201 bị hỏng..."
                  placeholderTextColor={AppColors.textMuted}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View>
                <Text style={s.label}>NỘI DUNG CHI TIẾT</Text>
                <TextInput
                  style={[s.inputPlain, { height: 120, textAlignVertical: "top" }]}
                  placeholder="Mô tả chi tiết vấn đề hoặc đề xuất của bạn..."
                  placeholderTextColor={AppColors.textMuted}
                  multiline
                  numberOfLines={5}
                  value={content}
                  onChangeText={setContent}
                />
              </View>
            </View>

            <TouchableOpacity onPress={handleSubmit} style={[s.primaryBtn, { marginTop: 8 }]} activeOpacity={0.85}>
              <Text style={s.primaryBtnText}>Gửi Phản Hồi Ngay</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}
