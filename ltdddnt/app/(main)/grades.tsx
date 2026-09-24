import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppColors } from "../../src/constants/appColors";
import { mainStyles as s } from "../../src/constants/globalStyles";

const API_BASE_URL = "http://localhost:5000/api";
const DEFAULT_MSSV = "23103023";

// Offline fallback data for instant 0ms load & offline resilience
const OFFLINE_FALLBACK_GRADES = {
  success: true,
  mssv: DEFAULT_MSSV,
  fullName: "Nguyễn Văn Minh",
  gpaSummary: {
    cumulativeGpa10: "8.35",
    cumulativeGpa4: "3.52",
    totalCredits: "28"
  },
  tables: [
    {
      tableIndex: 2,
      rows: [
        ['STT', 'Mã HP', 'Tên học phần', 'Số TC', 'Điểm QT', 'Điểm Thi', 'Điểm TK', 'DChu'],
        ['1', 'CS201', 'Cấu trúc dữ liệu & Giải thuật', '4', '8.5', '9.0', '8.8', 'A'],
        ['2', 'CS202', 'Lập trình Hướng đối tượng', '3', '9.0', '9.0', '9.0', 'A'],
        ['3', 'CS203', 'Hệ quản trị cơ sở dữ liệu', '3', '8.0', '8.5', '8.3', 'A'],
        ['4', 'MTH202', 'Toán rời rạc', '3', '7.5', '7.0', '7.2', 'B']
      ]
    },
    {
      tableIndex: 1,
      rows: [
        ['STT', 'Mã HP', 'Tên học phần', 'Số TC', 'Điểm QT', 'Điểm Thi', 'Điểm TK', 'DChu'],
        ['1', 'MTH101', 'Toán cao cấp A1', '3', '8.5', '8.0', '8.2', 'A'],
        ['2', 'CS101', 'Tin học đại cương', '2', '9.0', '8.5', '8.7', 'A'],
        ['3', 'ENG101', 'Anh văn cơ bản 1', '3', '7.5', '8.0', '7.8', 'B+'],
        ['4', 'PHI101', 'Triết học Mác-Lênin', '3', '7.0', '7.5', '7.3', 'B']
      ]
    }
  ]
};

const OFFLINE_FALLBACK_CURRENT = [
  { code: 'IT301', name: 'Lập trình Web nâng cao', credits: 3 },
  { code: 'SE302', name: 'Công nghệ phần mềm', credits: 3 },
  { code: 'NT303', name: 'Mạng máy tính', credits: 3 }
];

// Helper to determine color badge based on letter grade
const getLetterGradeBadge = (grade: string) => {
  const g = grade.trim().toUpperCase();
  if (['A+', 'A'].includes(g)) return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' };
  if (['B+', 'B'].includes(g)) return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
  if (['C+', 'C'].includes(g)) return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' };
  if (['D+', 'D'].includes(g)) return { bg: '#FFF7ED', text: '#EA580C', border: '#FFEDD5' };
  if (['F', 'K'].includes(g)) return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' };
  return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
};

// Component con hiển thị thẻ học phần đang học
const CurrentCourseCard = ({ course }: { course: any }) => (
  <View style={[s.card, { padding: 16, borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }]}>
    <View style={{ flex: 1, gap: 4, paddingRight: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View style={{ backgroundColor: AppColors.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
          <Text style={{ fontSize: 10, fontWeight: "900", color: "#FFF" }}>{course.code || 'HP'}</Text>
        </View>
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

// Component hiển thị chi tiết điểm học phần dạng Card hiện đại
const CourseGradeCard = ({ course }: { course: any }) => {
  const [stt, code, name, credits, processGrade, examGrade, totalGrade, letterGrade] = course;
  const badge = getLetterGradeBadge(letterGrade || "");

  return (
    <View style={[s.card, { padding: 14, borderRadius: 16, marginBottom: 12 }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <View style={{ flex: 1, paddingRight: 8, gap: 2 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: "900", color: AppColors.primary }}>{code}</Text>
            <Text style={{ fontSize: 11, color: AppColors.textMuted, fontWeight: "700" }}>• {credits} tín chỉ</Text>
          </View>
          <Text style={{ fontSize: 13, fontWeight: "900", color: AppColors.textForeground, marginTop: 2 }}>
            {name}
          </Text>
        </View>
        <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: badge.bg, borderWidth: 1, borderColor: badge.border, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 14, fontWeight: "900", color: badge.text }}>{letterGrade || '-'}</Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", backgroundColor: AppColors.muted, borderRadius: 10, padding: 8, justifyContent: "space-around", marginTop: 4 }}>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 9, fontWeight: "800", color: AppColors.textMuted }}>Đ.QUÁ TRÌNH</Text>
          <Text style={{ fontSize: 12, fontWeight: "900", color: AppColors.textForeground, marginTop: 2 }}>{processGrade || '-'}</Text>
        </View>
        <View style={{ width: 1, backgroundColor: AppColors.border }} />
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 9, fontWeight: "800", color: AppColors.textMuted }}>Đ.THI</Text>
          <Text style={{ fontSize: 12, fontWeight: "900", color: AppColors.textForeground, marginTop: 2 }}>{examGrade || '-'}</Text>
        </View>
        <View style={{ width: 1, backgroundColor: AppColors.border }} />
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 9, fontWeight: "800", color: AppColors.textMuted }}>Đ.TỔNG KẾT</Text>
          <Text style={{ fontSize: 13, fontWeight: "900", color: AppColors.primary, marginTop: 2 }}>{totalGrade || '-'}</Text>
        </View>
      </View>
    </View>
  );
};

export default function GradesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Instant load with offline fallback cache (0ms loading delay)
  const [loading, setLoading] = useState(false);
  const [gradeData, setGradeData] = useState<any>(OFFLINE_FALLBACK_GRADES);
  const [currentCourses, setCurrentCourses] = useState<any[]>(OFFLINE_FALLBACK_CURRENT);
  const [isOffline, setIsOffline] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<number | null>(2);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const fetchAcademicData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const [resGrades, resCurrent] = await Promise.all([
        fetch(`${API_BASE_URL}/grades`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mssv: DEFAULT_MSSV }),
          signal: controller.signal
        }),
        fetch(`${API_BASE_URL}/student/current-courses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mssv: DEFAULT_MSSV }),
          signal: controller.signal
        })
      ]);

      clearTimeout(timeoutId);

      const dataGrades = await resGrades.json();
      const dataCurrent = await resCurrent.json();

      if (dataGrades.success) {
        setGradeData(dataGrades);
        setIsOffline(false);
      }
      if (dataCurrent.success) {
        setCurrentCourses(dataCurrent.currentCourses || OFFLINE_FALLBACK_CURRENT);
      }
    } catch (error) {
      // Network offline or timeout -> fallback to cached data silently
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcademicData(false);
  }, [fetchAcademicData]);

  // Filtered tables & courses based on search query and selected semester
  const filteredTables = useMemo(() => {
    if (!gradeData || !gradeData.tables) return [];
    
    return gradeData.tables
      .filter((t: any) => selectedSemester === null || t.tableIndex === selectedSemester)
      .map((t: any) => {
        const header = t.rows[0];
        const dataRows = t.rows.slice(1);
        const matchedRows = dataRows.filter((row: string[]) => {
          if (!searchQuery.trim()) return true;
          const query = searchQuery.toLowerCase();
          const code = (row[1] || "").toLowerCase();
          const name = (row[2] || "").toLowerCase();
          return code.includes(query) || name.includes(query);
        });

        return {
          ...t,
          rows: [header, ...matchedRows]
        };
      })
      .filter((t: any) => t.rows.length > 1);
  }, [gradeData, selectedSemester, searchQuery]);

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
            onPress={() => router.push("/(main)")} 
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
        {/* Offline Banner Indicator */}
        {isOffline && (
          <View style={{ backgroundColor: "#FEF3C7", borderWidth: 1, borderColor: "#FDE68A", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Feather name="wifi-off" size={14} color="#D97706" />
            <Text style={{ fontSize: 12, fontWeight: "800", color: "#92400E", flex: 1 }}>
              Đang xem dữ liệu ngoại tuyến (Offline Mode). Không có kết nối mạng.
            </Text>
          </View>
        )}

        {loading && (
          <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 20 }}>
            <ActivityIndicator size="small" color={AppColors.primary} />
            <Text style={{ color: AppColors.textMuted, fontSize: 11, marginTop: 6 }}>Đang đồng bộ dữ liệu mới nhất...</Text>
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

            {/* GPA Summary Cards */}
            {gradeData.gpaSummary && (
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={[s.card, { flex: 1, backgroundColor: AppColors.cardBg, padding: 16, borderRadius: 20, alignItems: "center" }]}>
                  <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "#EEF2FF", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                    <MaterialIcons name="grade" size={20} color={AppColors.primary} />
                  </View>
                  <Text style={{ fontSize: 10, color: AppColors.textMuted, fontWeight: "800" }}>GPA HỆ 10</Text>
                  <Text style={{ fontSize: 24, fontWeight: "900", color: AppColors.primary, marginTop: 2 }}>{gradeData.gpaSummary.cumulativeGpa10}</Text>
                  <Text style={{ fontSize: 10, color: AppColors.success, fontWeight: "800", marginTop: 4 }}>Tích lũy chuẩn</Text>
                </View>
                <View style={[s.card, { flex: 1, backgroundColor: AppColors.cardBg, padding: 16, borderRadius: 20, alignItems: "center" }]}>
                  <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "#ECFDF5", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                    <MaterialIcons name="school" size={20} color={AppColors.success} />
                  </View>
                  <Text style={{ fontSize: 10, color: AppColors.textMuted, fontWeight: "800" }}>GPA HỆ 4</Text>
                  <Text style={{ fontSize: 24, fontWeight: "900", color: AppColors.success, marginTop: 2 }}>{gradeData.gpaSummary.cumulativeGpa4}</Text>
                  <Text style={{ fontSize: 10, color: AppColors.success, fontWeight: "800", marginTop: 4 }}>Xếp loại Giỏi</Text>
                </View>
              </View>
            )}

            {/* Search Bar & View Mode Toggle */}
            <View style={{ gap: 12 }}>
              <View style={[s.inputRow, { borderRadius: 16, paddingHorizontal: 14 }]}>
                <Feather name="search" size={16} color={AppColors.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  style={[s.input, { paddingHorizontal: 0 }]}
                  placeholder="Tìm kiếm theo mã hoặc tên học phần..."
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

              {/* Semester Selector Chips & View Toggle */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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
                  {gradeData.tables?.map((t: any) => (
                    <TouchableOpacity
                      key={t.tableIndex}
                      onPress={() => setSelectedSemester(t.tableIndex)}
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 12,
                        backgroundColor: selectedSemester === t.tableIndex ? AppColors.primary : AppColors.cardBg,
                        borderWidth: 1,
                        borderColor: selectedSemester === t.tableIndex ? AppColors.primary : AppColors.border
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: "900", color: selectedSemester === t.tableIndex ? "#FFF" : AppColors.textForeground }}>
                        Học kỳ {t.tableIndex}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* View Mode Toggle */}
                <View style={{ flexDirection: "row", backgroundColor: AppColors.cardBg, borderRadius: 12, borderWidth: 1, borderColor: AppColors.border, padding: 2, marginLeft: 8 }}>
                  <TouchableOpacity
                    onPress={() => setViewMode("cards")}
                    style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 10, backgroundColor: viewMode === "cards" ? AppColors.primary : "transparent" }}
                  >
                    <Feather name="grid" size={14} color={viewMode === "cards" ? "#FFF" : AppColors.textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setViewMode("table")}
                    style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 10, backgroundColor: viewMode === "table" ? AppColors.primary : "transparent" }}
                  >
                    <Feather name="list" size={14} color={viewMode === "table" ? "#FFF" : AppColors.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>
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

            {/* Grades Section */}
            <View style={{ gap: 14, marginTop: 4 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Ionicons name="stats-chart-outline" size={16} color={AppColors.primary} />
                <Text style={{ fontSize: 14, fontWeight: "900", color: AppColors.textForeground }}>Chi tiết điểm học tập</Text>
              </View>

              {filteredTables.length === 0 ? (
                <View style={[s.card, { padding: 30, alignItems: "center", justifyContent: "center", borderRadius: 16 }]}>
                  <Feather name="search" size={28} color={AppColors.textMuted} />
                  <Text style={{ fontSize: 13, fontWeight: "800", color: AppColors.textMuted, marginTop: 10 }}>Không tìm thấy học phần phù hợp</Text>
                </View>
              ) : (
                filteredTables.map((t: any, tIdx: number) => {
                  const dataRows = t.rows.slice(1);
                  return (
                    <View key={tIdx} style={{ gap: 10 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 4 }}>
                        <Text style={{ fontSize: 13, fontWeight: "900", color: AppColors.primary }}>
                          Bảng học kỳ {t.tableIndex}
                        </Text>
                        <Text style={{ fontSize: 11, fontWeight: "700", color: AppColors.textMuted }}>
                          {dataRows.length} học phần
                        </Text>
                      </View>

                      {viewMode === "cards" ? (
                        dataRows.map((row: string[], rIdx: number) => (
                          <CourseGradeCard key={rIdx} course={row} />
                        ))
                      ) : (
                        <View style={[s.card, { padding: 12, borderRadius: 16 }]}>
                          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={{ minWidth: 650 }}>
                              {t.rows.map((row: string[], rIdx: number) => {
                                const isHeader = rIdx === 0;
                                return (
                                  <View 
                                    key={rIdx} 
                                    style={{ 
                                      flexDirection: "row", 
                                      paddingVertical: 10, 
                                      paddingHorizontal: 8,
                                      backgroundColor: isHeader ? "#F8FAFC" : "transparent",
                                      borderRadius: isHeader ? 8 : 0,
                                      borderBottomWidth: isHeader ? 0 : 0.5, 
                                      borderBottomColor: AppColors.border,
                                      alignItems: "center"
                                    }}
                                  >
                                    {row.map((cell: string, cIdx: number) => {
                                      let colWidth = 70;
                                      if (cIdx === 0) colWidth = 40;
                                      if (cIdx === 1) colWidth = 85;
                                      if (cIdx === 2) colWidth = 220;
                                      if (cIdx === 3) colWidth = 60;

                                      return (
                                        <Text 
                                          key={cIdx} 
                                          style={{ 
                                            width: colWidth,
                                            fontSize: 11, 
                                            fontWeight: isHeader ? "900" : "700", 
                                            color: isHeader ? AppColors.primary : AppColors.textForeground,
                                            textAlign: cIdx === 0 || cIdx >= 3 ? "center" : "left"
                                          }} 
                                          numberOfLines={2}
                                        >
                                          {cell}
                                        </Text>
                                      );
                                    })}
                                  </View>
                                );
                              })}
                            </View>
                          </ScrollView>
                        </View>
                      )}
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
