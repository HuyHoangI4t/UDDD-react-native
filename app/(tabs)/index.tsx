import {View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Pressable, Alert, Image, Keyboard, ScrollView} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyApp() {
  const [hoTen, setHoTen] = useState('');
  const [daChamVaoHoTen, setDaChamVaoHoTen] = useState(false);
  const coLoiHoTen = daChamVaoHoTen && hoTen.trim() === '';

  const [maSV, setMaSV] = useState('');

  const [email, setEmail] = useState('');
  const [daChamVaoEmail, setDaChamVaoEmail] = useState(false);
  const coLoiEmail = daChamVaoEmail && email.trim() === '';

  const [soDienThoai, setSoDienThoai] = useState('');
  const [matKhau, setMatKhau] = useState('');

  // State theo dõi trạng thái hiển thị của bàn phím
  const [banPhimHien, setBanPhimHien] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setBanPhimHien(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setBanPhimHien(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleKiemTraVaGui = () => {
    setDaChamVaoHoTen(true);
    setDaChamVaoEmail(true);

    if (!hoTen.trim() || !email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các thông tin.');
      return;
    }

    Alert.alert(
      'Xác nhận',
      `Họ và tên: ${hoTen}\nMã SV: ${maSV || 'Chưa nhập'}\nEmail: ${email}\nSố điện thoại: ${soDienThoai || 'Chưa nhập'}\nMật khẩu: ${'•'.repeat(matKhau.length) || 'Chưa nhập'}`,
      [
        { text: 'Chỉnh sửa', style: 'cancel' },
        { text: 'Xác nhận', onPress: () => Alert.alert('Thành công', 'Đã lưu thông tin sinh viên!') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.cardBox}>
            {!banPhimHien && (
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
            )}

            {/* 1. Họ và tên */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Họ và tên</Text>
              <TextInput
                style={[styles.input, coLoiHoTen ? styles.inputError : null]}
                placeholder="Nhập họ và tên..."
                value={hoTen}
                onChangeText={(text) => {
                  setHoTen(text);
                  if (!daChamVaoHoTen) setDaChamVaoHoTen(true);
                }}
                onBlur={() => setDaChamVaoHoTen(true)}
                autoCapitalize="words"
              />
              {coLoiHoTen && (
                <Text style={styles.errorText}>Họ tên không được để trống</Text>
              )}
            </View>

            {/* 2. Mã sinh viên */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mã sinh viên</Text>
              <TextInput
                style={styles.input}
                placeholder="MSSV: 231030.."
                value={maSV}
                onChangeText={(text) => setMaSV(text.toUpperCase())}
                autoCapitalize="characters"
              />
            </View>

            {/* 3. Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, coLoiEmail ? styles.inputError : null]}
                placeholder="Nhập email..."
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (!daChamVaoEmail) setDaChamVaoEmail(true);
                }}
                onBlur={() => setDaChamVaoEmail(true)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {coLoiEmail && (
                <Text style={styles.errorText}>Email không được để trống</Text>
              )}
            </View>

            {/* 4. Số điện thoại */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại..."
                value={soDienThoai}
                onChangeText={setSoDienThoai}
                keyboardType="numeric"
              />
            </View>

            {/* 5. Mật khẩu */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập mật khẩu..."
                value={matKhau}
                onChangeText={setMatKhau}
                secureTextEntry={true}
                autoCapitalize="none"
              />
            </View>

            {/* Nút bấm */}
            <Pressable
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
              ]}
              onPress={handleKiemTraVaGui}
            >
              <Text style={styles.submitButtonText}>Xong</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  cardBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 72,
    height: 72,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#007aff',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonPressed: {
    opacity: 0.8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});