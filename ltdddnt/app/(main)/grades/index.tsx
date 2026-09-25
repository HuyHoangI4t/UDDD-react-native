import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppColors } from "../../../src/constants/appColors";
import { mainStyles as s } from "../../../src/constants/globalStyles";

const API_BASE_URL = "http://localhost:5000/api";


const CACHE_KEY_GRADES = "@cache_student_grades_v1";
const CACHE_KEY_CURRENT = "@cache_current_courses_v1";
const CACHE_KEY_TIMESTAMP = "@cache_timestamp_v1";

const CACHE_VALID_DURATION = 8 * 60 * 60 * 1000;

// Helper phân loại màu sắc riêng biệt cho từng loại điểm chữ (A, B, C, D, P, F)
const getLetterGradeBadge = (grade: string) => {
  const g = (grade || "").trim().toUpperCase();
  if (['A'].includes(g)) return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' }; // Xanh lá
  if (['B'].includes(g)) return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' }; // Xanh dương
  if (['C'].includes(g)) return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' }; // Vàng
  if (['D'].includes(g)) return { bg: '#FFEDD5', text: '#C2410C', border: '#FED7AA' }; // Cam
  if (g === 'P') return { bg: '#FCE7F3', text: '#DB2777', border: '#FBCFE8' }; // Hồng/Đỏ hồng cho P
  if (['F','X'].includes(g)) return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' }; // Đỏ tươi cho F
  return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
};

const CurrentCourseCard = ({ course }: { course: any }) => (
  <View style={[s.card, { padding: 16, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }]}>
    <View style={{ flex: 1, gap: 4, paddingRight: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Text style={{ fontSize: 13, fontWeight: "900", color: AppColors.textForeground, flex: 1 }} numberOfLines={1}>
          {course.name}
        </Text>
      </View>
      <Text style={{ fontSize: 11, color: AppColors.textMuted, fontWeight: "700" }}>Số tín chỉ: {course.credits || 3}</Text>
    </View>
    <View style={{ backgroundColor: "#FEF3C7", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
      <Text style={{ fontSize: 11, fontWeight: "900", color: "#D97706" }}>Đang học</Text>
    </View>
  </View>
);

export default function GradesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [loading, setLoading] = useState(false);
  const [gradeData, setGradeData] = useState<any>(null);
  const [currentCourses, setCurrentCourses] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

  const fetchAcademicData = useCallback(async (forceRefresh = false, semesterFilter = selectedSemester, searchKeyword = searchQuery) => {
    try {
      if (!forceRefresh) {
        const cachedGrades = await AsyncStorage.getItem(CACHE_KEY_GRADES);
        const cachedCurrent = await AsyncStorage.getItem(CACHE_KEY_CURRENT);
        const cachedTime = await AsyncStorage.getItem(CACHE_KEY_TIMESTAMP);

        const now = Date.now();
        const isCacheValid = cachedTime && (now - parseInt(cachedTime) < CACHE_VALID_DURATION);

        if (cachedGrades && isCacheValid && !searchKeyword && semesterFilter === null) {
          setGradeData(JSON.parse(cachedGrades));
          if (cachedCurrent) setCurrentCourses(JSON.parse(cachedCurrent));
          return;
        }
      }

      setLoading(true);
      setErrorMessage("");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const [resGrades, resCurrent] = await Promise.all([
        fetch(`${API_BASE_URL}/grades`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            semester: semesterFilter, 
            search: searchKeyword 
          }),
          signal: controller.signal
        }),
        fetch(`${API_BASE_URL}/student/current-courses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal
        })
      ]);

      clearTimeout(timeoutId);

      const dataGrades = await resGrades.json();
      const dataCurrent = await resCurrent.json();

      if (dataGrades.success) {
        setGradeData(dataGrades);
        if (!searchKeyword && semesterFilter === null) {
          await AsyncStorage.setItem(CACHE_KEY_GRADES, JSON.stringify(dataGrades));
          await AsyncStorage.setItem(CACHE_KEY_TIMESTAMP, Date.now().toString());
        }
      } else {
        setErrorMessage(dataGrades.message || "Không thể tải dữ liệu điểm.");
      }

      if (dataCurrent.success) {
        const courses = dataCurrent.currentCourses || [];
        setCurrentCourses(courses);
        await AsyncStorage.setItem(CACHE_KEY_CURRENT, JSON.stringify(courses));
      }
    } catch (error: any) {
      const cachedGrades = await AsyncStorage.getItem(CACHE_KEY_GRADES);
      const cachedCurrent = await AsyncStorage.getItem(CACHE_KEY_CURRENT);
      
      if (cachedGrades) {
        setGradeData(JSON.parse(cachedGrades));
        if (cachedCurrent) setCurrentCourses(JSON.parse(cachedCurrent));
      } else {
        setErrorMessage("Không thể kết nối tới server và chưa có dữ liệu trong cache.");
      }
    } finally {
      setLoading(false);
    }
  }, [selectedSemester, searchQuery]);

  useEffect(() => {
    fetchAcademicData(false, selectedSemester, searchQuery);
  }, [selectedSemester, searchQuery, fetchAcademicData]);

  return (
    <View style={{ flex: 1, backgroundColor: AppColors.background }}>
      {/* Header */}
      <View style={{ 
        paddingHorizontal: 24, 
        paddingTop: Math.max(insets.top + 16, 20), 
        paddingBottom: 20, 
        backgroundColor: AppColors.primary,
        zIndex: 10
      }}>
        <View style={[s.row, { gap: 12, alignItems: "center" }]}>
          <TouchableOpacity 
            onPress={() => router.push("/(main)/home")} 
            style={[s.iconBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}
          >
            <Feather name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 18 }}>Kết quả học tập</Text>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 2 }}>Tra cứu điểm số & GPA tích lũy</Text>
          </View>
          <TouchableOpacity 
            onPress={() => fetchAcademicData(true)} 
            style={[s.iconBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}
          >
            <Feather name="refresh-cw" size={15} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 110 }} 
        showsVerticalScrollIndicator={false}
      >
        {errorMessage ? (
          <View style={[s.card, { backgroundColor: "#FEE2E2", borderColor: "#FCA5A5", padding: 16, borderRadius: 16 }]}>
            <Text style={{ color: "#991B1B", fontWeight: "800", fontSize: 13 }}>{errorMessage}</Text>
          </View>
        ) : null}

        {loading && (
          <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 15 }}>
            <ActivityIndicator size="small" color={AppColors.primary} />
            <Text style={{ color: AppColors.textMuted, fontSize: 11, marginTop: 4 }}>Đang đồng bộ dữ liệu từ server...</Text>
          </View>
        )}

        {gradeData && (
          <>
            {/* Student Info Card */}
            <View style={[s.card, { backgroundColor: AppColors.cardBg, padding: 18, borderRadius: 20, borderLeftWidth: 5, borderLeftColor: AppColors.primary }]}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View style={{ gap: 4, flex: 1 }}>
                  <Text style={{ fontSize: 10, color: AppColors.textMuted, fontWeight: "800", letterSpacing: 0.8 }}>SINH VIÊN</Text>
                  <Text style={{ fontSize: 17, fontWeight: "900", color: AppColors.textForeground }}>{gradeData.fullName}</Text>
                  <Text style={{ fontSize: 12, color: AppColors.primary, fontWeight: "800" }}>MSSV: {gradeData.mssv}</Text>
                </View>
                <View style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center" }}>
                  <Ionicons name="school" size={22} color={AppColors.primary} />
                </View>
              </View>
            </View>

            {/* Search Bar & Semester Filter Chips */}
            <View style={{ gap: 12 }}>
              <View style={[s.inputRow, { borderRadius: 16, paddingHorizontal: 14 }]}>
                <Feather name="search" size={16} color={AppColors.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  style={[s.input, { paddingHorizontal: 0 }]}
                  placeholder="Tìm kiếm theo tên học phần..."
                  placeholderTextColor={AppColors.textSubtle}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Feather name="x" size={16} color={AppColors.textMuted} />
                  </TouchableOpacity>
                ) : null}
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setSelectedSemester(null)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 12,
                    backgroundColor: selectedSemester === null ? AppColors.primary : AppColors.cardBg,
                    borderWidth: 1,
                    borderColor: selectedSemester === null ? AppColors.primary : AppColors.border
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: "900", color: selectedSemester === null ? "#FFF" : AppColors.textForeground }}>
                    Tất cả học kỳ
                  </Text>
                </TouchableOpacity>
                {[2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <TouchableOpacity
                    key={sem}
                    onPress={() => setSelectedSemester(sem)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 12,
                      backgroundColor: selectedSemester === sem ? AppColors.primary : AppColors.cardBg,
                      borderWidth: 1,
                      borderColor: selectedSemester === sem ? AppColors.primary : AppColors.border
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "900", color: selectedSemester === sem ? "#FFF" : AppColors.textForeground }}>
                      Học kỳ {sem}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Current Courses Section */}
            {currentCourses.length > 0 && (
              <View style={{ gap: 10, marginTop: 4 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Ionicons name="book-outline" size={16} color={AppColors.primary} />
                  <Text style={{ fontSize: 14, fontWeight: "900", color: AppColors.textForeground }}>Học phần đang học</Text>
                </View>
                {currentCourses.map((c, idx) => (
                  <CurrentCourseCard key={idx} course={c} />
                ))}
              </View>
            )}

            {/* Grades Table Section: Only Course Name + Letter Grade with custom colored badges */}
            <View style={{ gap: 14, marginTop: 4 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="stats-chart-outline" size={16} color={AppColors.primary} />
                <Text style={{ fontSize: 14, fontWeight: "900", color: AppColors.textForeground }}>Chi tiết điểm học tập</Text>
              </View>

              {!gradeData.tables || gradeData.tables.length === 0 ? (
                <View style={[s.card, { padding: 30, alignItems: "center", justifyContent: "center", borderRadius: 16 }]}>
                  <Feather name="search" size={28} color={AppColors.textMuted} />
                  <Text style={{ fontSize: 13, fontWeight: "800", color: AppColors.textMuted, marginTop: 10 }}>Không tìm thấy học phần phù hợp</Text>
                </View>
              ) : (
                gradeData.tables.map((t: any, tIdx: number) => {
                  const dataRows = t.rows.slice(1);
                  if (dataRows.length === 0) return null;

                  return (
                    <View key={tIdx} style={{ gap: 10 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 4 }}>
                        <Text style={{ fontSize: 11, fontWeight: "700", color: AppColors.textMuted }}>
                          {dataRows.length} học phần
                        </Text>
                      </View>

                      {/* Bảng thu gọn chỉ hiển thị Học phần và Điểm chữ */}
                      <View style={[s.card, { padding: 12, borderRadius: 16 }]}>
                        {t.rows.map((row: string[], rIdx: number) => {
                          const isHeader = rIdx === 0;
                          const courseName = row[2] || "";
                          const letterGrade = row[8] || "";
                          const badge = getLetterGradeBadge(letterGrade);

                          return (
                            <View 
                              key={rIdx} 
                              style={{ 
                                flexDirection: "row", 
                                paddingVertical: 10, 
                                paddingHorizontal: 12,
                                backgroundColor: isHeader ? "#F8FAFC" : "transparent",
                                borderRadius: isHeader ? 8 : 0,
                                borderBottomWidth: isHeader ? 0 : 0.5, 
                                borderBottomColor: AppColors.border,
                                alignItems: "center",
                                justifyContent: "space-between"
                              }}
                            >
                              <Text 
                                style={{ 
                                  flex: 1,
                                  fontSize: 11, 
                                  fontWeight: isHeader ? "900" : "700", 
                                  color: isHeader ? AppColors.primary : AppColors.textForeground,
                                  paddingRight: 10
                                }} 
                                numberOfLines={2}
                              >
                                {isHeader ? "Tên học phần" : courseName}
                              </Text>

                              <View style={{ width: 80, alignItems: "center" }}>
                                {isHeader ? (
                                  <Text style={{ fontSize: 11, fontWeight: "900", color: AppColors.primary }}>Điểm chữ</Text>
                                ) : (
                                  <View style={{ 
                                    paddingHorizontal: 12, 
                                    paddingVertical: 4, 
                                    borderRadius: 8, 
                                    backgroundColor: badge.bg, 
                                    borderWidth: 1, 
                                    borderColor: badge.border,
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}>
                                    <Text style={{ fontSize: 11, fontWeight: "900", color: badge.text }}>
                                      {letterGrade || "-"}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
