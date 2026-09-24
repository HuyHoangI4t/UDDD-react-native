import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width: W } = Dimensions.get("window");

// ─── THEME ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#F0F4FF",
  fg: "#0F172A",
  card: "#ffffff",
  primary: "#1E3A8A",
  secondary: "#EEF2FF",
  muted: "#F1F5F9",
  mutedFg: "#64748B",
  accent: "#6366F1",
  border: "rgba(99,102,241,0.12)",
  inputBg: "#F8FAFF",
  red: "#EF4444",
  emerald: "#10B981",
  amber: "#F59E0B",
  blue: "#3B82F6",
  violet: "#7C3AED",
};

// ─── TYPES & DATA ─────────────────────────────────────────────────────────────
type Screen =
  | "login"
  | "signup"
  | "home"
  | "map"
  | "schedule"
  | "feedback"
  | "events"
  | "sos"
  | "profile";

const CAMPUS_BUILDINGS = [
  { id: 1, name: "Engineering Block A", x: 28, y: 32, type: "academic", color: "#6366F1" },
  { id: 2, name: "Central Library", x: 52, y: 20, type: "library", color: "#10B981" },
  { id: 3, name: "Student Cafeteria", x: 68, y: 45, type: "food", color: "#F59E0B" },
  { id: 4, name: "Admin Building", x: 42, y: 58, type: "admin", color: "#1E3A8A" },
  { id: 5, name: "Health Sciences", x: 20, y: 65, type: "academic", color: "#6366F1" },
  { id: 6, name: "Sports Complex", x: 75, y: 68, type: "sports", color: "#EF4444" },
  { id: 7, name: "Arts Faculty", x: 55, y: 72, type: "academic", color: "#6366F1" },
  { id: 8, name: "IT Center", x: 35, y: 48, type: "tech", color: "#22D3EE" },
];

const SCHEDULE = [
  { id: 1, course: "Data Structures & Algorithms", code: "CS301", room: "ENG-B204", time: "08:00 – 09:30", day: "Mon", status: "upcoming", lecturer: "Dr. Amara Osei" },
  { id: 2, course: "Calculus III", code: "MTH302", room: "SCI-A101", time: "10:00 – 11:30", day: "Mon", status: "live", lecturer: "Prof. Kofi Mensah" },
  { id: 3, course: "Technical Writing", code: "ENG201", room: "HUM-C302", time: "12:00 – 13:30", day: "Mon", status: "changed", lecturer: "Ms. Efua Darko" },
  { id: 4, course: "Computer Networks", code: "CS405", room: "IT-Lab 3", time: "14:00 – 15:30", day: "Mon", status: "upcoming", lecturer: "Dr. Samuel Agyei" },
  { id: 5, course: "Software Engineering", code: "CS410", room: "ENG-B301", time: "08:00 – 09:30", day: "Tue", status: "upcoming", lecturer: "Prof. Linda Asante" },
  { id: 6, course: "Database Systems", code: "CS350", room: "IT-Lab 1", time: "10:00 – 11:30", day: "Tue", status: "upcoming", lecturer: "Dr. James Kwarteng" },
];

const EVENTS = [
  { id: 1, title: "Tech Innovation Summit 2025", category: "Technology", date: "Aug 5, 2025", time: "10:00 AM", location: "Grand Hall, Admin Block", attendees: 312, capacity: 400, image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=780&h=256&fit=crop", rsvp: false, description: "Annual showcase of student tech projects and industry keynotes." },
  { id: 2, title: "Study Group Speed Matching", category: "Academic", date: "Aug 3, 2025", time: "3:00 PM", location: "Library Atrium", attendees: 89, capacity: 120, image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=780&h=256&fit=crop", rsvp: true, description: "Match with peers from your department for collaborative study sessions." },
  { id: 3, title: "Campus Mental Health Fair", category: "Wellness", date: "Aug 7, 2025", time: "9:00 AM", location: "Student Center", attendees: 56, capacity: 200, image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=780&h=256&fit=crop", rsvp: false, description: "Connect with counselors, wellness coaches, and mental health resources." },
  { id: 4, title: "Inter-Faculty Football Finals", category: "Sports", date: "Aug 9, 2025", time: "2:00 PM", location: "Sports Complex, Main Pitch", attendees: 480, capacity: 500, image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=780&h=256&fit=crop", rsvp: true, description: "Cheer for your faculty in the season-ending championship match." },
];

const ALERTS = [
  { id: 1, type: "info", text: "Library closes at 8 PM today for maintenance.", time: "2h ago" },
  { id: 2, type: "warning", text: "Room change: CS301 moved to ENG-B204 from ENG-B201.", time: "45m ago" },
  { id: 3, type: "success", text: "Your feedback #204 has been resolved.", time: "1h ago" },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Card({ style, children }: { style?: object; children: React.ReactNode }) {
  return <View style={[s.card, style]}>{children}</View>;
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={s.primaryBtn} activeOpacity={0.85}>
      <Text style={s.primaryBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

function NavHeader({
  title, subtitle, onBack, rightIcon, onRight, bg = C.primary, children,
}: {
  title: string; subtitle?: string; onBack?: () => void;
  rightIcon?: string; onRight?: () => void; bg?: string; children?: React.ReactNode;
}) {
  return (
    <LinearGradient colors={[bg, bg] as [string, string]} style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 }}>
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
    </LinearGradient>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <View style={{ height: 208 }}>
        <Image source={{ uri: "https://images.unsplash.com/photo-1562774053-701939374585?w=780&h=416&fit=crop" }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        <LinearGradient colors={["rgba(30,58,138,0.7)", C.bg] as [string, string]} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        <View style={{ position: "absolute", bottom: 20, left: 24, flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" }}>
            <Feather name="layers" size={16} color="#fff" />
          </View>
          <View>
            <Text style={{ color: "#fff", fontWeight: "900", fontSize: 18 }}>CampusIQ</Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>Smart Campus Companion</Text>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 24, marginTop: -16, paddingBottom: 40, backgroundColor: C.bg, flex: 1 }}>
        {/* Tabs */}
        <View style={{ flexDirection: "row", backgroundColor: C.muted, borderRadius: 16, padding: 4, marginBottom: 24 }}>
          {(["login", "signup"] as const).map((t) => (
            <TouchableOpacity key={t} onPress={() => setTab(t)} style={{ flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center", backgroundColor: tab === t ? "#fff" : "transparent" }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: tab === t ? C.primary : C.mutedFg }}>{t === "login" ? "Sign In" : "Sign Up"}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === "login" ? (
          <View style={{ gap: 16 }}>
            <View>
              <Text style={s.label}>Student Email</Text>
              <View style={s.inputRow}>
                <Feather name="mail" size={16} color={C.mutedFg} style={{ marginLeft: 14 }} />
                <TextInput value={email} onChangeText={setEmail} style={s.input} placeholder="s.kwame@university.edu.gh" placeholderTextColor={C.mutedFg} keyboardType="email-address" autoCapitalize="none" />
              </View>
            </View>
            <View>
              <Text style={s.label}>Password</Text>
              <View style={s.inputRow}>
                <Feather name="lock" size={16} color={C.mutedFg} style={{ marginLeft: 14 }} />
                <TextInput value={pass} onChangeText={setPass} style={[s.input, { paddingRight: 44 }]} placeholder="••••••••" placeholderTextColor={C.mutedFg} secureTextEntry={!showPass} />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 14 }}>
                  <Feather name={showPass ? "eye-off" : "eye"} size={16} color={C.mutedFg} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 6 }}>
                <Text style={{ fontSize: 12, color: C.accent, fontWeight: "700" }}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <PrimaryButton label="Sign In to Campus" onPress={() => onNavigate("home")} />
          </View>
        ) : (
          <View style={{ gap: 16 }}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>First Name</Text>
                <TextInput style={s.inputPlain} placeholder="Kwame" placeholderTextColor={C.mutedFg} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>Last Name</Text>
                <TextInput style={s.inputPlain} placeholder="Asante" placeholderTextColor={C.mutedFg} />
              </View>
            </View>
            <View>
              <Text style={s.label}>Student ID</Text>
              <TextInput style={s.inputPlain} placeholder="UG/2022/3841" placeholderTextColor={C.mutedFg} />
            </View>
            <View>
              <Text style={s.label}>University Email</Text>
              <TextInput style={s.inputPlain} placeholder="s.kwame@university.edu.gh" placeholderTextColor={C.mutedFg} keyboardType="email-address" autoCapitalize="none" />
            </View>
            <PrimaryButton label="Create Account" onPress={() => onNavigate("home")} />
          </View>
        )}

        <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20, gap: 12 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
          <Text style={{ fontSize: 12, color: C.mutedFg, fontWeight: "600" }}>or</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: C.border }} />
        </View>
        <TouchableOpacity onPress={() => onNavigate("home")} style={{ borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingVertical: 12, alignItems: "center" }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: C.mutedFg }}>Continue as Guest (Limited Access)</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const quickActions = [
    { icon: "navigation", label: "Campus Map", screen: "map" as Screen, bg: "#EEF2FF", fg: C.accent },
    { icon: "calendar", label: "Schedule", screen: "schedule" as Screen, bg: "#DBEAFE", fg: C.primary },
    { icon: "message-square", label: "Feedback", screen: "feedback" as Screen, bg: "#FEF3C7", fg: "#D97706" },
    { icon: "users", label: "Events", screen: "events" as Screen, bg: "#D1FAE5", fg: "#059669" },
  ];

  const alertMeta: Record<string, { icon: string; color: string; bg: string; border: string }> = {
    info: { icon: "info", color: C.blue, bg: "#EFF6FF", border: "#BFDBFE" },
    warning: { icon: "alert-triangle", color: C.amber, bg: "#FFFBEB", border: "#FDE68A" },
    success: { icon: "check", color: C.emerald, bg: "#ECFDF5", border: "#A7F3D0" },
  };

  const stats = [
    { label: "Library Seats", value: "34", sub: "Available now", icon: "book-open", color: C.emerald },
    { label: "Cafeteria", value: "8 min", sub: "Queue wait time", icon: "coffee", color: C.amber },
    { label: "Open Events", value: "5", sub: "Happening today", icon: "star", color: C.violet },
    { label: "WiFi Status", value: "Strong", sub: "All zones online", icon: "wifi", color: C.blue },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[C.primary, C.primary] as [string, string]} style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}>
        <View style={[s.row, s.between, { marginBottom: 16 }]}>
          <View>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 }}>Good Morning</Text>
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "900" }}>Kwame Asante 👋</Text>
          </View>
          <View style={s.row}>
            <TouchableOpacity onPress={() => onNavigate("sos")} style={[s.iconBtn, { backgroundColor: C.red, marginRight: 8 }]}>
              <Feather name="shield" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate("profile")} style={[s.iconBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Feather name="user" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Next class */}
        <View style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }}>
          <View style={[s.row, s.between, { marginBottom: 8 }]}>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 }}>Next Class</Text>
            <View style={{ backgroundColor: C.accent, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>Live Now</Text>
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
            <Text style={{ color: "#A5B4FC", fontSize: 12, fontWeight: "700", marginRight: 4 }}>Navigate to class</Text>
            <Feather name="chevron-right" size={12} color="#A5B4FC" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={{ paddingHorizontal: 24, marginTop: -16, gap: 20, paddingBottom: 24 }}>
        {/* Quick actions */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          {quickActions.map(({ icon, label, screen, bg, fg }) => (
            <TouchableOpacity key={screen} onPress={() => onNavigate(screen)} activeOpacity={0.8}
              style={{ flex: 1, backgroundColor: C.card, borderRadius: 16, padding: 12, alignItems: "center", borderWidth: 1, borderColor: C.border, elevation: 2, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: bg, alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <Feather name={icon as any} size={20} color={fg} />
              </View>
              <Text style={{ fontSize: 10, fontWeight: "700", color: C.fg, textAlign: "center" }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Alerts */}
        <View>
          <View style={[s.row, s.between, { marginBottom: 12 }]}>
            <Text style={s.sectionTitle}>Campus Alerts</Text>
            <Text style={s.sectionLink}>View all</Text>
          </View>
          <View style={{ gap: 8 }}>
            {ALERTS.map((a) => {
              const m = alertMeta[a.type];
              return (
                <View key={a.id} style={[s.row, { padding: 12, borderRadius: 12, borderWidth: 1, backgroundColor: m.bg, borderColor: m.border, alignItems: "flex-start" }]}>
                  <Feather name={m.icon as any} size={14} color={m.color} style={{ marginTop: 2 }} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: C.fg, lineHeight: 18 }}>{a.text}</Text>
                    <Text style={{ fontSize: 10, color: C.mutedFg, marginTop: 2 }}>{a.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Stats grid */}
        <View>
          <Text style={[s.sectionTitle, { marginBottom: 12 }]}>Today at a Glance</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {stats.map(({ label, value, sub, icon, color }) => (
              <View key={label} style={{ width: (W - 58) / 2, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, elevation: 2, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 }}>
                <Feather name={icon as any} size={18} color={color} style={{ marginBottom: 8 }} />
                <Text style={{ fontSize: 18, fontWeight: "900", color: C.fg }}>{value}</Text>
                <Text style={{ fontSize: 10, fontWeight: "700", color: C.mutedFg, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>{label}</Text>
                <Text style={{ fontSize: 10, color: C.mutedFg }}>{sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Event teaser */}
        <View>
          <View style={[s.row, s.between, { marginBottom: 12 }]}>
            <Text style={s.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => onNavigate("events")}><Text style={s.sectionLink}>See all</Text></TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => onNavigate("events")} style={{ borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: C.border }} activeOpacity={0.9}>
            <Image source={{ uri: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=780&h=300&fit=crop" }} style={{ width: "100%", height: 128 }} resizeMode="cover" />
            <LinearGradient colors={["transparent", "rgba(30,58,138,0.85)"] as [string, string]} style={{ ...StyleSheet.absoluteFillObject, justifyContent: "flex-end", padding: 16 }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
              <View style={{ backgroundColor: C.accent, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-start", marginBottom: 4 }}>
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>Technology</Text>
              </View>
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 14 }}>Tech Innovation Summit 2025</Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Aug 5 • Grand Hall</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// ─── MAP ──────────────────────────────────────────────────────────────────────
function MapScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [selected, setSelected] = useState<(typeof CAMPUS_BUILDINGS)[0] | null>(null);
  const [filter, setFilter] = useState("all");
  const MAP_H = 280;
  const filters = ["all", "academic", "library", "food", "sports", "tech"];
  const typeLabels: Record<string, string> = {
    academic: "Academic Building", library: "Library", food: "Food & Dining",
    admin: "Administration", sports: "Sports Facility", tech: "Technology Center",
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <NavHeader title="Campus Map" onBack={() => onNavigate("home")} rightIcon="filter">
        <View style={[s.inputRow, { backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)" }]}>
          <Feather name="search" size={14} color="rgba(255,255,255,0.5)" style={{ marginLeft: 14 }} />
          <TextInput style={[s.input, { color: "#fff" }]} placeholder="Search buildings, rooms..." placeholderTextColor="rgba(255,255,255,0.5)" />
        </View>
      </NavHeader>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
        {filters.map((f) => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[s.chip, filter === f && { backgroundColor: C.primary, borderColor: C.primary }]}>
            <Text style={[s.chipText, filter === f && { color: "#fff" }]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Map */}
      <View style={{ marginHorizontal: 16, borderRadius: 16, overflow: "hidden", height: MAP_H, backgroundColor: "#E8EDF5", borderWidth: 1, borderColor: C.border }}>
        <View style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1.5, backgroundColor: "#CBD5E1" }} />
        <View style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1.5, backgroundColor: "#CBD5E1" }} />
        <View style={{ position: "absolute", top: "35%", left: "33%", width: 100, height: 60, borderRadius: 50, backgroundColor: "#D1FAE5" }} />

        {CAMPUS_BUILDINGS.filter((b) => filter === "all" || b.type === filter).map((b) => (
          <TouchableOpacity key={b.id} onPress={() => setSelected(selected?.id === b.id ? null : b)} activeOpacity={0.8}
            style={{ position: "absolute", left: `${b.x}%` as any, top: `${b.y}%` as any, transform: [{ translateX: -16 }, { translateY: -16 }] }}>
            {selected?.id === b.id && (
              <View style={{ position: "absolute", bottom: 36, left: "50%", transform: [{ translateX: -60 }], backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: C.border, width: 120, elevation: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: "700", color: C.fg }}>{b.name}</Text>
              </View>
            )}
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: b.color, alignItems: "center", justifyContent: "center", elevation: 4, shadowColor: b.color, shadowOpacity: 0.4, shadowRadius: 4, transform: [{ scale: selected?.id === b.id ? 1.2 : 1 }] }}>
              <Feather name="map-pin" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ position: "absolute", left: "50%", top: "50%", transform: [{ translateX: -8 }, { translateY: -8 }] }}>
          <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: C.blue, borderWidth: 2, borderColor: "#fff", elevation: 6 }} />
        </View>
        <View style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: 16, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.border, elevation: 4 }}>
          <Feather name="navigation" size={14} color={C.primary} />
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
                <Text style={{ fontSize: 10, fontWeight: "700", color: C.mutedFg }}>{typeLabels[selected.type]}</Text>
                <Text style={{ fontSize: 14, fontWeight: "900", color: C.fg }}>{selected.name}</Text>
              </View>
            </View>
            <TouchableOpacity style={{ backgroundColor: C.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>Navigate</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}
    </View>
  );
}

// ─── SCHEDULE ─────────────────────────────────────────────────────────────────
function ScheduleScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const [activeDay, setActiveDay] = useState("Mon");
  const dayClasses = SCHEDULE.filter((c) => c.day === activeDay);

  const STATUS: Record<string, { bg: string; text: string; border: string; label: string }> = {
    live: { bg: "#ECFDF5", text: "#065F46", border: "#A7F3D0", label: "● Live" },
    upcoming: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE", label: "Upcoming" },
    changed: { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A", label: "Room Changed" },
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <NavHeader title="My Schedule" subtitle="Semester 1 • 2024/2025" onBack={() => onNavigate("home")}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {days.map((d) => (
            <TouchableOpacity key={d} onPress={() => setActiveDay(d)}
              style={{ flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: "center", backgroundColor: activeDay === d ? "#fff" : "rgba(255,255,255,0.15)" }}>
              <Text style={{ fontSize: 12, fontWeight: "900", color: activeDay === d ? C.primary : "rgba(255,255,255,0.7)" }}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </NavHeader>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, gap: 12 }} showsVerticalScrollIndicator={false}>
        {dayClasses.length === 0 && (
          <View style={{ alignItems: "center", justifyContent: "center", height: 160 }}>
            <Feather name="calendar" size={32} color={C.mutedFg} />
            <Text style={{ fontWeight: "700", color: C.mutedFg, fontSize: 14, marginTop: 12 }}>No classes scheduled</Text>
          </View>
        )}
        {dayClasses.map((cls) => {
          const ss = STATUS[cls.status];
          return (
            <Card key={cls.id} style={cls.status === "changed" ? { borderColor: "#FDE68A" } : {}}>
              <View style={{ marginBottom: 8 }}>
                <View style={{ alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, borderWidth: 1, backgroundColor: ss.bg, borderColor: ss.border }}>
                  <Text style={{ fontSize: 10, fontWeight: "700", color: ss.text }}>{ss.label}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 14, fontWeight: "900", color: C.fg, marginBottom: 2 }}>{cls.course}</Text>
              <Text style={{ fontSize: 12, fontWeight: "600", color: C.mutedFg, marginBottom: 12 }}>{cls.code}</Text>
              <View style={{ flexDirection: "row", gap: 16 }}>
                <View style={s.row}><Feather name="clock" size={12} color={C.mutedFg} /><Text style={{ fontSize: 12, fontWeight: "600", color: C.fg, marginLeft: 4 }}>{cls.time}</Text></View>
                <View style={s.row}><Feather name="map-pin" size={12} color={C.mutedFg} /><Text style={{ fontSize: 12, fontWeight: "600", color: C.fg, marginLeft: 4 }}>{cls.room}</Text></View>
              </View>
              {cls.status === "changed" && (
                <View style={[s.row, { marginTop: 12, backgroundColor: "#FFFBEB", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#FDE68A" }]}>
                  <Feather name="alert-triangle" size={12} color="#D97706" />
                  <Text style={{ fontSize: 10, color: "#92400E", fontWeight: "600", marginLeft: 8 }}>Room changed — navigate to new location</Text>
                </View>
              )}
              <View style={[s.row, { marginTop: 12 }]}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "rgba(30,58,138,0.1)", alignItems: "center", justifyContent: "center", marginRight: 8 }}>
                  <Feather name="user" size={10} color={C.primary} />
                </View>
                <Text style={{ fontSize: 12, color: C.mutedFg }}>{cls.lecturer}</Text>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── FEEDBACK ─────────────────────────────────────────────────────────────────
function FeedbackScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [priority, setPriority] = useState("normal");
  const [submitted, setSubmitted] = useState(false);
  const [description, setDescription] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({
    "Broken AC / Heating": false, "Dirty Restroom": false, "Broken Furniture": false,
    "Poor Lighting": false, "Network Issues": false, "Safety Hazard": false,
  });

  const toggleCheck = (k: string) => setChecks((p) => ({ ...p, [k]: !p[k] }));

  if (submitted) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
          <Feather name="check" size={36} color={C.emerald} />
        </View>
        <Text style={{ fontSize: 22, fontWeight: "900", color: C.fg, marginBottom: 8 }}>Request Submitted!</Text>
        <Text style={{ fontSize: 14, color: C.mutedFg, textAlign: "center", marginBottom: 4 }}>
          Your report <Text style={{ fontWeight: "700", color: C.primary }}>#MR-2047</Text> has been received.
        </Text>
        <Text style={{ fontSize: 14, color: C.mutedFg, textAlign: "center", marginBottom: 32 }}>Facilities team will respond within 24 hours.</Text>
        <PrimaryButton label="Back to Home" onPress={() => { setSubmitted(false); onNavigate("home"); }} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <NavHeader title="Facility Feedback" subtitle="Report issues to maintenance" onBack={() => onNavigate("home")} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, gap: 20 }} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={s.label}>Issue Type (select all that apply)</Text>
          <View style={{ gap: 8 }}>
            {Object.entries(checks).map(([label, checked]) => (
              <TouchableOpacity key={label} onPress={() => toggleCheck(label)} activeOpacity={0.8}
                style={[s.row, { padding: 12, borderRadius: 12, borderWidth: 1, backgroundColor: checked ? C.secondary : C.card, borderColor: checked ? "rgba(99,102,241,0.4)" : C.border }]}>
                <Feather name={checked ? "check-square" : "square"} size={16} color={checked ? C.accent : C.mutedFg} style={{ marginRight: 12 }} />
                <Text style={{ fontSize: 14, fontWeight: "600", color: checked ? C.primary : C.fg }}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <Text style={s.label}>Priority Level</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[
              { val: "low", label: "Low", bg: "#ECFDF5", text: "#065F46", border: "#6EE7B7" },
              { val: "normal", label: "Normal", bg: "#EFF6FF", text: "#1D4ED8", border: "#93C5FD" },
              { val: "urgent", label: "Urgent", bg: "#FEF2F2", text: "#991B1B", border: "#FCA5A5" },
            ].map(({ val, label, bg, text, border }) => (
              <TouchableOpacity key={val} onPress={() => setPriority(val)}
                style={{ flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 1, alignItems: "center", backgroundColor: priority === val ? bg : C.card, borderColor: priority === val ? border : C.border }}>
                <Text style={{ fontSize: 12, fontWeight: "900", color: priority === val ? text : C.mutedFg }}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View>
          <Text style={s.label}>Description</Text>
          <TextInput value={description} onChangeText={setDescription} style={[s.inputPlain, { height: 100, textAlignVertical: "top" }]} placeholder="Describe the issue in detail..." placeholderTextColor={C.mutedFg} multiline numberOfLines={4} />
        </View>

        <TouchableOpacity style={{ padding: 24, borderRadius: 12, borderWidth: 2, borderStyle: "dashed", borderColor: C.border, alignItems: "center", gap: 8 }}>
          <Feather name="camera" size={20} color={C.mutedFg} />
          <Text style={{ fontSize: 12, fontWeight: "600", color: C.mutedFg }}>Tap to add photo</Text>
        </TouchableOpacity>

        <PrimaryButton label="Submit Report" onPress={() => setSubmitted(true)} />
      </ScrollView>
    </View>
  );
}

// ─── EVENTS ───────────────────────────────────────────────────────────────────
function EventsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [events, setEvents] = useState(EVENTS);
  const [activeFilter, setActiveFilter] = useState("All");
  const cats = ["All", "Technology", "Academic", "Wellness", "Sports"];

  const toggleRsvp = (id: number) =>
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, rsvp: !e.rsvp, attendees: e.rsvp ? e.attendees - 1 : e.attendees + 1 } : e));

  const filtered = activeFilter === "All" ? events : events.filter((e) => e.category === activeFilter);

  const catColors: Record<string, { bg: string; text: string }> = {
    Technology: { bg: "#EDE9FE", text: "#5B21B6" },
    Academic: { bg: "#DBEAFE", text: "#1E40AF" },
    Wellness: { bg: "#D1FAE5", text: "#065F46" },
    Sports: { bg: "#FEE2E2", text: "#991B1B" },
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <NavHeader title="Event Hub" subtitle={`${events.filter((e) => e.rsvp).length} events joined this week`} onBack={() => onNavigate("home")} rightIcon="search">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {cats.map((c) => (
            <TouchableOpacity key={c} onPress={() => setActiveFilter(c)}
              style={[s.chip, activeFilter === c ? { backgroundColor: "#fff", borderColor: "#fff" } : { backgroundColor: "rgba(255,255,255,0.15)", borderColor: "transparent" }]}>
              <Text style={[s.chipText, activeFilter === c ? { color: C.primary } : { color: "rgba(255,255,255,0.7)" }]}>{c}</Text>
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
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.5)"] as [string, string]} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
                <View style={{ position: "absolute", top: 12, left: 12, backgroundColor: cc.bg, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Text style={{ fontSize: 10, fontWeight: "900", color: cc.text }}>{ev.category}</Text>
                </View>
                {ev.rsvp && (
                  <View style={{ position: "absolute", top: 12, right: 12, width: 24, height: 24, borderRadius: 12, backgroundColor: C.emerald, alignItems: "center", justifyContent: "center" }}>
                    <Feather name="check" size={12} color="#fff" />
                  </View>
                )}
              </View>
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: "900", color: C.fg, marginBottom: 8 }}>{ev.title}</Text>
                <Text style={{ fontSize: 12, color: C.mutedFg, lineHeight: 18, marginBottom: 12 }}>{ev.description}</Text>
                <View style={{ gap: 6, marginBottom: 12 }}>
                  <View style={{ flexDirection: "row", gap: 16 }}>
                    <View style={s.row}><Feather name="calendar" size={11} color={C.mutedFg} /><Text style={{ fontSize: 11, fontWeight: "600", color: C.fg, marginLeft: 4 }}>{ev.date}</Text></View>
                    <View style={s.row}><Feather name="clock" size={11} color={C.mutedFg} /><Text style={{ fontSize: 11, fontWeight: "600", color: C.fg, marginLeft: 4 }}>{ev.time}</Text></View>
                  </View>
                  <View style={s.row}><Feather name="map-pin" size={11} color={C.mutedFg} /><Text style={{ fontSize: 11, fontWeight: "600", color: C.fg, marginLeft: 4 }}>{ev.location}</Text></View>
                </View>
                <View style={[s.row, s.between]}>
                  <View>
                    <View style={[s.row, { marginBottom: 4 }]}>
                      <Feather name="users" size={11} color={C.mutedFg} />
                      <Text style={{ fontSize: 11, fontWeight: "600", color: C.mutedFg, marginLeft: 4 }}>{ev.attendees}/{ev.capacity}</Text>
                    </View>
                    <View style={{ width: 112, height: 6, backgroundColor: C.muted, borderRadius: 3, overflow: "hidden" }}>
                      <View style={{ height: "100%", width: `${(ev.attendees / ev.capacity) * 100}%`, backgroundColor: C.accent, borderRadius: 3 }} />
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => toggleRsvp(ev.id)} activeOpacity={0.85}
                    style={{ backgroundColor: ev.rsvp ? C.emerald : C.primary, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 }}>
                    <Text style={{ color: "#fff", fontSize: 12, fontWeight: "900" }}>{ev.rsvp ? "✓ Joined" : "RSVP"}</Text>
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

// ─── SOS ──────────────────────────────────────────────────────────────────────
function SOSScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [pressed, setPressed] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [alertSent, setAlertSent] = useState(false);

  const handleSOS = () => {
    if (alertSent || pressed) return;
    setPressed(true);
    let c = 3;
    const t = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) { clearInterval(t); setAlertSent(true); setPressed(false); }
    }, 1000);
  };

  const contacts = [
    { name: "Campus Security", number: "+233-30-277-5000", icon: "shield", bg: "#FEE2E2", fg: "#DC2626" },
    { name: "Campus Clinic", number: "+233-30-277-5010", icon: "plus", bg: "#DBEAFE", fg: "#1D4ED8" },
    { name: "Student Affairs Office", number: "+233-30-277-5020", icon: "user", bg: "#EDE9FE", fg: "#6D28D9" },
    { name: "National Emergency", number: "999 / 112", icon: "phone", bg: "#FEF3C7", fg: "#D97706" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <NavHeader title="Campus Safety & SOS" subtitle="Emergency assistance" onBack={() => onNavigate("home")} bg="#DC2626" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, gap: 20 }} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: "center", paddingVertical: 16 }}>
          {alertSent ? (
            <View style={{ alignItems: "center", gap: 12 }}>
              <View style={{ width: 128, height: 128, borderRadius: 64, backgroundColor: "#D1FAE5", borderWidth: 4, borderColor: "#6EE7B7", alignItems: "center", justifyContent: "center" }}>
                <Feather name="check" size={40} color="#059669" />
              </View>
              <Text style={{ fontSize: 20, fontWeight: "900", color: "#059669", textAlign: "center" }}>Alert Sent!</Text>
              <Text style={{ fontSize: 14, color: C.mutedFg, textAlign: "center" }}>Campus security has been notified.{"\n"}Help is on the way.</Text>
              <View style={{ backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 12, alignItems: "center" }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: "#059669" }}>ETA: 3–5 minutes</Text>
                <Text style={{ fontSize: 12, color: C.mutedFg, marginTop: 4 }}>Stay calm and stay visible</Text>
              </View>
              <TouchableOpacity onPress={() => { setAlertSent(false); setCountdown(3); }}>
                <Text style={{ fontSize: 12, color: C.mutedFg, textDecorationLine: "underline" }}>Cancel alert</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ alignItems: "center", gap: 16 }}>
              <TouchableOpacity onPressIn={handleSOS} activeOpacity={0.85}
                style={{ width: 144, height: 144, borderRadius: 72, borderWidth: 4, borderColor: "#FCA5A5", backgroundColor: pressed ? "#B91C1C" : "#EF4444", alignItems: "center", justifyContent: "center", shadowColor: "#EF4444", shadowOpacity: 0.5, shadowRadius: 20, elevation: 12 }}>
                <Feather name="shield" size={28} color="#fff" />
                <Text style={{ color: "#fff", fontSize: 24, fontWeight: "900", marginTop: 4 }}>SOS</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: pressed ? 18 : 14, color: pressed ? "#DC2626" : C.mutedFg, textAlign: "center", fontWeight: pressed ? "900" : "400" }}>
                {pressed ? `Sending in ${countdown}...` : "Press and hold to alert campus security"}
              </Text>
            </View>
          )}
        </View>

        <View>
          <Text style={[s.sectionTitle, { marginBottom: 12 }]}>Quick Contacts</Text>
          <View style={{ gap: 8 }}>
            {contacts.map(({ name, number, icon, bg, fg }) => (
              <Card key={name} style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: bg, alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                  <Feather name={icon as any} size={18} color={fg} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "900", color: C.fg }}>{name}</Text>
                  <Text style={{ fontSize: 12, color: C.mutedFg, fontWeight: "600" }}>{number}</Text>
                </View>
                <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: C.emerald, alignItems: "center", justifyContent: "center" }}>
                  <Feather name="phone" size={15} color="#fff" />
                </TouchableOpacity>
              </Card>
            ))}
          </View>
        </View>

        <View style={{ backgroundColor: "#FFFBEB", borderWidth: 1, borderColor: "#FDE68A", borderRadius: 16, padding: 16 }}>
          <View style={[s.row, { marginBottom: 8 }]}>
            <Feather name="alert-triangle" size={14} color="#D97706" />
            <Text style={{ fontSize: 14, fontWeight: "900", color: "#92400E", marginLeft: 8 }}>Safety Reminders</Text>
          </View>
          {["Stay in well-lit areas at night.", "Walk with a friend after hours.", "Report suspicious activity immediately.", "Keep your student ID visible at all times."].map((t) => (
            <View key={t} style={[s.row, { marginTop: 6 }]}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.amber, marginRight: 8, marginTop: 5 }} />
              <Text style={{ fontSize: 12, color: "#92400E", flex: 1 }}>{t}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfileScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Kwame Asante");
  const [phone, setPhone] = useState("+233-54-881-2023");
  const [notifs, setNotifs] = useState(true);
  const [campusAlerts, setCampusAlerts] = useState(true);

  const info = [
    { label: "Full Name", value: name, editable: true, onChange: setName },
    { label: "Student ID", value: "UG/2022/3841", editable: false },
    { label: "Department", value: "Computer Science", editable: false },
    { label: "Level", value: "300", editable: false },
    { label: "Email", value: "s.kwame@university.edu.gh", editable: false },
    { label: "Phone", value: phone, editable: true, onChange: setPhone },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <LinearGradient colors={[C.primary, C.primary] as [string, string]} style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}>
        <View style={[s.row, s.between]}>
          <TouchableOpacity onPress={() => onNavigate("home")} style={[s.iconBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Feather name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontWeight: "900", fontSize: 18, flex: 1, marginLeft: 12 }}>My Profile</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)} style={[s.iconBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Feather name="edit-3" size={15} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: "center", marginTop: -32, marginBottom: 20 }}>
          <View style={{ position: "relative" }}>
            <View style={{ width: 80, height: 80, borderRadius: 20, backgroundColor: C.accent, alignItems: "center", justifyContent: "center", borderWidth: 4, borderColor: C.bg, elevation: 8, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 8 }}>
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 30 }}>KA</Text>
            </View>
            {editing && (
              <TouchableOpacity style={{ position: "absolute", bottom: -4, right: -4, width: 28, height: 28, borderRadius: 14, backgroundColor: C.primary, borderWidth: 2, borderColor: C.bg, alignItems: "center", justifyContent: "center" }}>
                <Feather name="camera" size={12} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={{ fontSize: 22, fontWeight: "900", color: C.fg, marginTop: 12 }}>{name}</Text>
          <Text style={{ fontSize: 12, fontWeight: "600", color: C.mutedFg }}>UG/2022/3841 • Level 300</Text>
        </View>

        <View style={{ paddingHorizontal: 24, gap: 16 }}>
          <Card style={{ padding: 0 }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.muted + "80" }}>
              <Text style={{ fontSize: 11, fontWeight: "900", color: C.mutedFg, textTransform: "uppercase", letterSpacing: 1 }}>Student Information</Text>
            </View>
            {info.map(({ label, value, editable, onChange }, i) => (
              <View key={label} style={[{ paddingHorizontal: 16, paddingVertical: 12 }, i < info.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.border }]}>
                <Text style={{ fontSize: 10, fontWeight: "900", color: C.mutedFg, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>{label}</Text>
                {editing && editable ? (
                  <TextInput defaultValue={value} onChangeText={onChange} style={{ fontSize: 14, fontWeight: "600", color: C.fg, borderBottomWidth: 1, borderBottomColor: C.accent, paddingVertical: 2 }} />
                ) : (
                  <Text style={{ fontSize: 14, fontWeight: "600", color: C.fg }} numberOfLines={1}>{value}</Text>
                )}
              </View>
            ))}
          </Card>

          <View style={{ flexDirection: "row", gap: 10 }}>
            {[{ label: "Events Joined", value: "12" }, { label: "Reports Filed", value: "3" }, { label: "Study Groups", value: "2" }].map(({ label, value }) => (
              <Card key={label} style={{ flex: 1, alignItems: "center", padding: 12 }}>
                <Text style={{ fontSize: 24, fontWeight: "900", color: C.primary }}>{value}</Text>
                <Text style={{ fontSize: 9, fontWeight: "700", color: C.mutedFg, textTransform: "uppercase", letterSpacing: 0.5, textAlign: "center", marginTop: 2 }}>{label}</Text>
              </Card>
            ))}
          </View>

          <Card style={{ padding: 0 }}>
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.muted + "80" }}>
              <Text style={{ fontSize: 11, fontWeight: "900", color: C.mutedFg, textTransform: "uppercase", letterSpacing: 1 }}>Settings & Preferences</Text>
            </View>
            {[
              { label: "Push Notifications", icon: "bell", toggle: true, val: notifs, set: setNotifs },
              { label: "Campus Alerts", icon: "alert-triangle", toggle: true, val: campusAlerts, set: setCampusAlerts },
              { label: "Privacy Settings", icon: "lock", chevron: true },
              { label: "Help & Support", icon: "info", chevron: true },
            ].map(({ label, icon, toggle, val, set, chevron }, i) => (
              <View key={label} style={[s.row, s.between, { paddingHorizontal: 16, paddingVertical: 14 }, i < 3 && { borderBottomWidth: 1, borderBottomColor: C.border }]}>
                <View style={s.row}>
                  <Feather name={icon as any} size={16} color={C.mutedFg} style={{ marginRight: 12 }} />
                  <Text style={{ fontSize: 14, fontWeight: "600", color: C.fg }}>{label}</Text>
                </View>
                {toggle && (
                  <TouchableOpacity onPress={() => set?.(!val)} style={{ width: 40, height: 20, borderRadius: 10, backgroundColor: val ? C.accent : C.muted, justifyContent: "center", paddingHorizontal: 2 }}>
                    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#fff", alignSelf: val ? "flex-end" : "flex-start" }} />
                  </TouchableOpacity>
                )}
                {chevron && <Feather name="chevron-right" size={14} color={C.mutedFg} />}
              </View>
            ))}
          </Card>

          <TouchableOpacity onPress={() => onNavigate("login")} activeOpacity={0.85}
            style={[s.row, { justifyContent: "center", paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: "#FECACA", backgroundColor: "#FEF2F2", gap: 8 }]}>
            <Feather name="log-out" size={16} color="#DC2626" />
            <Text style={{ fontSize: 14, fontWeight: "900", color: "#DC2626" }}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  between: { justifyContent: "space-between" },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, elevation: 2, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4 },
  iconBtn: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 11, fontWeight: "700", color: C.mutedFg, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: C.inputBg, borderWidth: 1, borderColor: C.border, borderRadius: 12 },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 12, fontSize: 14, color: C.fg },
  inputPlain: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: C.fg },
  primaryBtn: { backgroundColor: C.primary, borderRadius: 16, paddingVertical: 14, alignItems: "center" },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "900", color: C.fg },
  sectionLink: { fontSize: 12, fontWeight: "700", color: C.accent },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, borderWidth: 1, borderColor: C.border, backgroundColor: C.card },
  chipText: { fontSize: 12, fontWeight: "700", color: C.mutedFg },
});

// ─── BOTTOM NAV ───────────────────────────────────────────────────────────────
const NAV = [
  { screen: "home" as Screen, icon: "home", label: "Home" },
  { screen: "map" as Screen, icon: "map-pin", label: "Map" },
  { screen: "schedule" as Screen, icon: "calendar", label: "Schedule" },
  { screen: "events" as Screen, icon: "star", label: "Events" },
  { screen: "profile" as Screen, icon: "user", label: "Profile" },
];

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const showNav = !["login", "signup", "sos"].includes(screen);

  const screens: Record<Screen, React.ReactNode> = {
    login: <LoginScreen onNavigate={setScreen} />,
    signup: <LoginScreen onNavigate={setScreen} />,
    home: <HomeScreen onNavigate={setScreen} />,
    map: <MapScreen onNavigate={setScreen} />,
    schedule: <ScheduleScreen onNavigate={setScreen} />,
    feedback: <FeedbackScreen onNavigate={setScreen} />,
    events: <EventsScreen onNavigate={setScreen} />,
    sos: <SOSScreen onNavigate={setScreen} />,
    profile: <ProfileScreen onNavigate={setScreen} />,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>{screens[screen]}</View>
        {showNav && (
          <View style={{ flexDirection: "row", backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border, paddingHorizontal: 8, paddingVertical: 8, paddingBottom: Platform.OS === "ios" ? 24 : 8 }}>
            {NAV.map(({ screen: sc, icon, label }) => {
              const active = screen === sc;
              return (
                <TouchableOpacity key={sc} onPress={() => setScreen(sc)} style={{ flex: 1, alignItems: "center", gap: 4 }} activeOpacity={0.7}>
                  <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: active ? C.secondary : "transparent", alignItems: "center", justifyContent: "center" }}>
                    <Feather name={icon as any} size={active ? 20 : 18} color={active ? C.primary : C.mutedFg} />
                  </View>
                  <Text style={{ fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.5, color: active ? C.primary : C.mutedFg }}>{label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
