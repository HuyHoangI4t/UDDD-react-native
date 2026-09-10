// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   StyleSheet,
//   SafeAreaView,
//   LayoutChangeEvent,
//   Modal,
//   FlatList,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { MaterialIcons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// // =========================================================================
// // 1. BẢNG MÃ MÀU GIAO DIỆN (THEME COLORS)
// // =========================================================================
// const AppColors = {
//   // --- MÀU CHỦ ĐẠO & THƯƠNG HIỆU ---
//   primary: '#132F73',        // Xanh Navy đậm (Nút bấm chính, tab đang chọn)
//   primaryLight: '#1E3E8F',   // Xanh Navy lớp kính (Dùng cho gradient banner)
//   accent: '#5B61F4',         // Tím Indigo điểm nhấn (Badge Logo, Link Quên mật khẩu)
//   accentLight: '#818CF8',    // Tím sáng

//   // --- MÀU NỀN & KHUNG NHẬP LIỆU ---
//   background: '#F3F6FD',     // Nền ứng dụng (Xanh khói sáng)
//   cardBg: '#FFFFFF',         // Nền ô input & nền thẻ (Trắng tinh)
//   muted: '#EEF2F9',          // Nền thanh trượt tab (Xám xanh nhạt)
//   border: '#E2E8F0',         // Viền mảnh ô input và đường kẻ ngăn cách

//   // --- MÀU VĂN BẢN (TYPOGRAPHY) ---
//   textForeground: '#0F172A', // Chữ đậm nội dung (Tiêu đề, giá trị nhập)
//   textMuted: '#64748B',      // Chữ nhãn LABEL & placeholder
//   textSubtle: '#94A3B8',     // Chữ chú thích nhỏ & chữ 'hoặc'
// };

// // Danh sách các Khoa / Viện cho mục Đăng ký
// const DEPARTMENTS = [
//   'Khoa Kinh tế',
//   'Khoa Khoa học TN&CN',
//   'Khoa Y Dược',
//   'Khoa Nông Nghiệp',
//   'Khoa Ngoại Ngữ',
//   'Khoa Sư phạm',
//   'Khoa Lý luận Chính trị',
// ];

// export default function IndexScreen() {
//   // 0: Đăng Nhập, 1: Đăng Ký
//   const [activeTab, setActiveTab] = useState<0 | 1>(0);
//   const [obscurePassword, setObscurePassword] = useState(true);
//   const [tabWidth, setTabWidth] = useState(0);

//   // Form State
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [studentId, setStudentId] = useState('');
//   const [regEmail, setRegEmail] = useState('');
//   const [department, setDepartment] = useState('Khoa Khoa học TN&CN');
//   const [modalVisible, setModalVisible] = useState(false);

//   const onTabLayout = (e: LayoutChangeEvent) => {
//     const width = e.nativeEvent.layout.width - 8;
//     setTabWidth(width);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         bounces={false}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* ================= HEADER BANNER & GRADIENT ================= */}
//         <View style={styles.headerContainer}>
//           <Image
//             source={{
//               uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSia8eUdtN1j1wk1pdpRQVANoA2CHF8kslvuf41s72dxg&s=10',
//             }}
//             style={styles.headerImage}
//             resizeMode="cover"
//           />
//           <LinearGradient
//             colors={[
//               'rgba(19, 47, 115, 0.45)',
//               'rgba(19, 47, 115, 0.70)',
//               'rgba(243, 246, 253, 0.88)',
//               AppColors.background,
//             ]}
//             locations={[0.0, 0.45, 0.8, 1.0]}
//             style={styles.gradientOverlay}
//           />
//           <View style={styles.brandContainer}>
//             <View style={styles.brandRow}>
//               <View style={styles.logoBox}>
//                 <MaterialIcons name="layers" size={22} color="#FFFFFF" />
//               </View>
//               <Text style={styles.brandTitle}>CampusIQ</Text>
//             </View>
//             <Text style={styles.brandSubtitle}>Cổng Thông Tin Sinh Viên Thông Minh</Text>
//           </View>
//         </View>

//         {/* ================= TAB SWITCHER (ĐĂNG NHẬP / ĐĂNG KÝ) ================= */}
//         <View style={styles.tabOuterPadding}>
//           <View style={styles.tabTrack} onLayout={onTabLayout}>
//             {tabWidth > 0 && (
//               <View
//                 style={[
//                   styles.tabIndicator,
//                   {
//                     width: tabWidth / 2,
//                     transform: [{ translateX: activeTab === 0 ? 0 : tabWidth / 2 }],
//                   },
//                 ]}
//               />
//             )}

//             <TouchableOpacity
//               style={styles.tabItem}
//               onPress={() => setActiveTab(0)}
//               activeOpacity={0.8}
//             >
//               <Text
//                 style={[
//                   styles.tabLabel,
//                   activeTab === 0 ? styles.tabLabelActive : styles.tabLabelInactive,
//                 ]}
//               >
//                 Đăng Nhập
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.tabItem}
//               onPress={() => setActiveTab(1)}
//               activeOpacity={0.8}
//             >
//               <Text
//                 style={[
//                   styles.tabLabel,
//                   activeTab === 1 ? styles.tabLabelActive : styles.tabLabelInactive,
//                 ]}
//               >
//                 Đăng Ký
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* ================= FORM BODY ================= */}
//         <View style={styles.formContainer}>
//           {activeTab === 0 ? (
//             /* --- FORM 1: ĐĂNG NHẬP --- */
//             <View>
//               <Text style={styles.label}>EMAIL HOẶC MÃ SINH VIÊN</Text>
//               <View style={styles.inputBox}>
//                 <Feather name="mail" size={19} color={AppColors.textMuted} style={styles.iconPrefix} />
//                 <TextInput
//                   style={styles.textInput}
//                   placeholder="mssv@sv.ttn.edu.vn"
//                   placeholderTextColor={AppColors.textMuted}
//                   value={email}
//                   onChangeText={setEmail}
//                   autoCapitalize="none"
//                 />
//               </View>

//               <View style={{ height: 16 }} />

//               <Text style={styles.label}>MẬT KHẨU</Text>
//               <View style={styles.inputBox}>
//                 <Feather name="lock" size={19} color={AppColors.textMuted} style={styles.iconPrefix} />
//                 <TextInput
//                   style={styles.textInput}
//                   placeholder="••••••••"
//                   placeholderTextColor={AppColors.textMuted}
//                   secureTextEntry={obscurePassword}
//                   value={password}
//                   onChangeText={setPassword}
//                 />
//                 <TouchableOpacity
//                   onPress={() => setObscurePassword(!obscurePassword)}
//                   style={styles.iconSuffix}
//                 >
//                   <MaterialIcons
//                     name={obscurePassword ? 'visibility' : 'visibility-off'}
//                     size={19}
//                     color={AppColors.textMuted}
//                   />
//                 </TouchableOpacity>
//               </View>

//               <TouchableOpacity style={styles.forgotPassBtn} activeOpacity={0.7}>
//                 <Text style={styles.forgotPassText}>Quên mật khẩu?</Text>
//               </TouchableOpacity>

//               <View style={{ height: 20 }} />

//               <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
//                 <Text style={styles.primaryBtnText}>Đăng Nhập Vào Campus</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             /* --- FORM 2: ĐĂNG KÝ --- */
//             <View>
//               <View style={styles.row}>
//                 <View style={styles.col}>
//                   <Text style={styles.label}>HỌ VÀ TÊN ĐỆM</Text>
//                   <View style={styles.inputBox}>
//                     <TextInput
//                       style={styles.textInput}
//                       placeholder="Nguyễn Văn"
//                       placeholderTextColor={AppColors.textMuted}
//                       value={firstName}
//                       onChangeText={setFirstName}
//                     />
//                   </View>
//                 </View>

//                 <View style={{ width: 12 }} />

//                 <View style={styles.col}>
//                   <Text style={styles.label}>TÊN</Text>
//                   <View style={styles.inputBox}>
//                     <TextInput
//                       style={styles.textInput}
//                       placeholder="An"
//                       placeholderTextColor={AppColors.textMuted}
//                       value={lastName}
//                       onChangeText={setLastName}
//                     />
//                   </View>
//                 </View>
//               </View>

//               <View style={{ height: 14 }} />

//               <Text style={styles.label}>MÃ SỐ SINH VIÊN</Text>
//               <View style={styles.inputBox}>
//                 <TextInput
//                   style={styles.textInput}
//                   placeholder="23103023"
//                   placeholderTextColor={AppColors.textMuted}
//                   value={studentId}
//                   onChangeText={setStudentId}
//                   autoCapitalize="characters"
//                 />
//               </View>

//               <View style={{ height: 14 }} />

//               <Text style={styles.label}>EMAIL TRƯỜNG CẤP</Text>
//               <View style={styles.inputBox}>
//                 <TextInput
//                   style={styles.textInput}
//                   placeholder="mssv@sv.ttn.edu.vn"
//                   placeholderTextColor={AppColors.textMuted}
//                   value={regEmail}
//                   onChangeText={setRegEmail}
//                   autoCapitalize="none"
//                   keyboardType="email-address"
//                 />
//               </View>

//               <View style={{ height: 14 }} />

//               <Text style={styles.label}>KHOA / NGÀNH HỌC</Text>
//               <TouchableOpacity
//                 style={[styles.inputBox, { justifyContent: 'space-between' }]}
//                 activeOpacity={0.7}
//                 onPress={() => setModalVisible(true)}
//               >
//                 <Text style={styles.dropdownText} numberOfLines={1}>
//                   {department}
//                 </Text>
//                 <MaterialIcons name="keyboard-arrow-down" size={22} color={AppColors.textMuted} />
//               </TouchableOpacity>

//               <View style={{ height: 20 }} />

//               <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
//                 <Text style={styles.primaryBtnText}>Tạo Tài Khoản Mới</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* ================= PHẦN DÙNG CHUNG ================= */}
//           <View style={{ height: 10 }} />
//           <View style={styles.dividerRow}>
//             <View style={styles.dividerLine} />
//             <Text style={styles.dividerText}>hoặc</Text>
//             <View style={styles.dividerLine} />
//           </View>

//           <View style={{ height: 20 }} />

//           <TouchableOpacity style={styles.guestButton} activeOpacity={0.8}>
//             <Text style={styles.guestBtnText}>
//               Tiếp tục với tư cách Khách (Giới hạn tính năng)
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* POPUP MODAL CHỌN KHOA / NGÀNH */}
//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setModalVisible(false)}
//         >
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Chọn Khoa / Ngành Học</Text>
//             <FlatList
//               data={DEPARTMENTS}
//               keyExtractor={(item) => item}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={[
//                     styles.departmentItem,
//                     item === department && styles.departmentItemSelected,
//                   ]}
//                   onPress={() => {
//                     setDepartment(item);
//                     setModalVisible(false);
//                   }}
//                 >
//                   <Text
//                     style={[
//                       styles.departmentText,
//                       item === department && styles.departmentTextSelected,
//                     ]}
//                   >
//                     {item}
//                   </Text>
//                   {item === department && (
//                     <MaterialCommunityIcons name="check" size={18} color={AppColors.primary} />
//                   )}
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// // =========================================================================
// // 2. STYLESHEET CHI TIẾT
// // =========================================================================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: AppColors.background,
//   },
//   scrollContent: {
//     paddingBottom: 32,
//   },

//   /* HEADER */
//   headerContainer: {
//     height: 250,
//     width: '100%',
//     position: 'relative',
//     justifyContent: 'flex-end',
//   },
//   headerImage: {
//     ...StyleSheet.absoluteFillObject,
//     width: '100%',
//     height: '100%',
//   },
//   gradientOverlay: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   brandContainer: {
//     paddingLeft: 28,
//     paddingBottom: 22,
//   },
//   brandRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logoBox: {
//     width: 38,
//     height: 38,
//     borderRadius: 12,
//     backgroundColor: AppColors.accent,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   brandTitle: {
//     fontSize: 22,
//     fontWeight: '900',
//     color: '#FFFFFF',
//     letterSpacing: 0.2,
//     marginLeft: 10,
//   },
//   brandSubtitle: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     marginTop: 4,
//   },

//   /* TAB SWITCHER */
//   tabOuterPadding: {
//     paddingHorizontal: 24,
//     marginVertical: 18,
//   },
//   tabTrack: {
//     height: 48,
//     padding: 4,
//     backgroundColor: 'rgba(238, 242, 249, 0.7)',
//     borderRadius: 30,
//     flexDirection: 'row',
//     position: 'relative',
//   },
//   tabIndicator: {
//     position: 'absolute',
//     top: 4,
//     bottom: 4,
//     left: 4,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 24,
//     shadowColor: AppColors.primary,
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     elevation: 3,
//   },
//   tabItem: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1,
//   },
//   tabLabel: {
//     fontSize: 13.5,
//   },
//   tabLabelActive: {
//     fontWeight: '900',
//     color: AppColors.primary,
//   },
//   tabLabelInactive: {
//     fontWeight: '700',
//     color: AppColors.textMuted,
//   },

//   /* FORM INPUTS */
//   formContainer: {
//     paddingHorizontal: 24,
//   },
//   row: {
//     flexDirection: 'row',
//   },
//   col: {
//     flex: 1,
//   },
//   label: {
//     fontSize: 11,
//     fontWeight: '800',
//     letterSpacing: 0.8,
//     color: AppColors.textMuted,
//     marginBottom: 8,
//   },
//   inputBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: AppColors.cardBg,
//     borderRadius: 20,
//     borderWidth: 1.2,
//     borderColor: AppColors.border,
//     paddingHorizontal: 16,
//     height: 50,
//     shadowColor: AppColors.border,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.4,
//     shadowRadius: 6,
//     elevation: 1,
//   },
//   iconPrefix: {
//     marginRight: 10,
//   },
//   iconSuffix: {
//     padding: 4,
//   },
//   textInput: {
//     flex: 1,
//     fontSize: 14,
//     color: AppColors.textForeground,
//   },
//   dropdownText: {
//     fontSize: 14,
//     color: AppColors.textForeground,
//     flex: 1,
//   },
//   forgotPassBtn: {
//     alignSelf: 'flex-end',
//     marginTop: 10,
//   },
//   forgotPassText: {
//     fontSize: 12.5,
//     fontWeight: '700',
//     color: AppColors.accent,
//   },

//   /* BUTTONS & FOOTER */
//   primaryButton: {
//     width: '100%',
//     height: 52,
//     backgroundColor: AppColors.primary,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   primaryBtnText: {
//     fontSize: 15,
//     fontWeight: '800',
//     color: '#FFFFFF',
//   },
//   dividerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: AppColors.border,
//   },
//   dividerText: {
//     paddingHorizontal: 14,
//     fontSize: 12,
//     color: AppColors.textMuted,
//   },
//   guestButton: {
//     width: '100%',
//     height: 50,
//     borderWidth: 1.2,
//     borderColor: AppColors.border,
//     backgroundColor: 'transparent',
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   guestBtnText: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: AppColors.textMuted,
//   },

//   /* MODAL */
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     justifyContent: 'center',
//     padding: 24,
//   },
//   modalContent: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     padding: 20,
//     maxHeight: '70%',
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: '800',
//     color: AppColors.textForeground,
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   departmentItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: AppColors.border,
//   },
//   departmentItemSelected: {
//     backgroundColor: AppColors.muted,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//   },
//   departmentText: {
//     fontSize: 14,
//     color: AppColors.textForeground,
//   },
//   departmentTextSelected: {
//     fontWeight: '700',
//     color: AppColors.primary,
//   },
// });