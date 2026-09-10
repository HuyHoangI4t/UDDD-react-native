import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppColors } from '@/src/constants/appColors';
import { authStyles } from '@/src/constants/authStyles';
import { AuthHeader } from '@/src/components/AuthHeader';

const DEPARTMENTS = [
  'Khoa Kinh tế',
  'Khoa Khoa học TN&CN',
  'Khoa Y Dược',
  'Khoa Nông Nghiệp',
  'Khoa Ngoại Ngữ',
  'Khoa Sư phạm',
  'Khoa Lý luận Chính trị',
];

export default function RegisterScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Khoa Khoa học TN&CN');
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegister = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={authStyles.scrollContent}
      >
        <AuthHeader currentTab="register" />

        <View style={authStyles.formContainer}>
          <View style={authStyles.row}>
            <View style={authStyles.col}>
              <Text style={authStyles.label}>HỌ VÀ TÊN ĐỆM</Text>
              <View style={authStyles.inputBox}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder="Nguyễn Văn"
                  placeholderTextColor={AppColors.textMuted}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
            </View>

            <View style={{ width: 12 }} />

            <View style={authStyles.col}>
              <Text style={authStyles.label}>TÊN</Text>
              <View style={authStyles.inputBox}>
                <TextInput
                  style={authStyles.textInput}
                  placeholder="A"
                  placeholderTextColor={AppColors.textMuted}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>
          </View>

          <View style={{ height: 14 }} />

          <Text style={authStyles.label}>MÃ SỐ SINH VIÊN</Text>
          <View style={authStyles.inputBox}>
            <TextInput
              style={authStyles.textInput}
              placeholder="23103023"
              placeholderTextColor={AppColors.textMuted}
              value={studentId}
              onChangeText={setStudentId}
              autoCapitalize="characters"
            />
          </View>

          <View style={{ height: 14 }} />

          <Text style={authStyles.label}>EMAIL TRƯỜNG CẤP</Text>
          <View style={authStyles.inputBox}>
            <TextInput
              style={authStyles.textInput}
              placeholder="mssv@sv.ttn.edu.vn"
              placeholderTextColor={AppColors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={{ height: 14 }} />

          <Text style={authStyles.label}>KHOA / NGÀNH HỌC</Text>
          <TouchableOpacity
            style={[authStyles.inputBox, { justifyContent: 'space-between' }]}
            activeOpacity={0.7}
            onPress={() => setModalVisible(true)}
          >
            <Text style={authStyles.dropdownText} numberOfLines={1}>
              {department}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={22}
              color={AppColors.textMuted}
            />
          </TouchableOpacity>

          <View style={{ height: 20 }} />

          <TouchableOpacity
            style={authStyles.primaryButton}
            onPress={handleRegister}
            activeOpacity={0.85}
          >
            <Text style={authStyles.primaryBtnText}>Tạo Tài Khoản Mới</Text>
          </TouchableOpacity>

          <View style={{ height: 10 }} />
          <View style={authStyles.dividerRow}>
            <View style={authStyles.dividerLine} />
            <Text style={authStyles.dividerText}>hoặc</Text>
            <View style={authStyles.dividerLine} />
          </View>

          <View style={{ height: 20 }} />

          <TouchableOpacity
            style={authStyles.guestButton}
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <Text style={authStyles.guestBtnText}>
              Tiếp tục với tư cách Khách (Giới hạn tính năng)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL CHỌN KHOA */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={authStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={authStyles.modalContent}>
            <Text style={authStyles.modalTitle}>Chọn Khoa / Ngành Học</Text>
            <FlatList
              data={DEPARTMENTS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    authStyles.departmentItem,
                    item === department && authStyles.departmentItemSelected,
                  ]}
                  onPress={() => {
                    setDepartment(item);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      authStyles.departmentText,
                      item === department && authStyles.departmentTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {item === department && (
                    <MaterialCommunityIcons name="check" size={18} color={AppColors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}