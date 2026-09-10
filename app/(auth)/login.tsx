import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppColors } from '@/src/constants/appColors';
import { authStyles } from '@/src/constants/authStyles';
import { AuthHeader } from '@/src/components/AuthHeader';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [obscurePassword, setObscurePassword] = useState(true);

  const handleLogin = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={authStyles.scrollContent}
      >
        <AuthHeader currentTab="login" />

        <View style={authStyles.formContainer}>
          <Text style={authStyles.label}>EMAIL HOẶC MÃ SINH VIÊN</Text>
          <View style={authStyles.inputBox}>
            <Feather
              name="mail"
              size={19}
              color={AppColors.textMuted}
              style={authStyles.iconPrefix}
            />
            <TextInput
              style={authStyles.textInput}
              placeholder="mssv@sv.ttn.edu.vn"
              placeholderTextColor={AppColors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={{ height: 16 }} />

          <Text style={authStyles.label}>MẬT KHẨU</Text>
          <View style={authStyles.inputBox}>
            <Feather
              name="lock"
              size={19}
              color={AppColors.textMuted}
              style={authStyles.iconPrefix}
            />
            <TextInput
              style={authStyles.textInput}
              placeholder="••••••••"
              placeholderTextColor={AppColors.textMuted}
              secureTextEntry={obscurePassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setObscurePassword(!obscurePassword)}
              style={authStyles.iconSuffix}
            >
              <MaterialIcons
                name={obscurePassword ? 'visibility' : 'visibility-off'}
                size={19}
                color={AppColors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={authStyles.forgotPassBtn} activeOpacity={0.7}>
            <Text style={authStyles.forgotPassText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />

          <TouchableOpacity
            style={authStyles.primaryButton}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={authStyles.primaryBtnText}>Đăng Nhập Vào Campus</Text>
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
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={authStyles.guestBtnText}>
              Tiếp tục với tư cách Khách (Giới hạn tính năng)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}