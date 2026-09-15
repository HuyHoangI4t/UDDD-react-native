import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppColors } from '@/src/constants/appColors';
import { authStyles } from '@/src/constants/globalStyles';
import { AuthHeader } from '@/src/components/AuthHeader';

export default function AuthScreen() {
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [obscurePassword, setObscurePassword] = useState(true);
  
  // Register State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [obscureRegPassword, setObscureRegPassword] = useState(true);
  const [obscureConfirmPassword, setObscureConfirmPassword] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setIsKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setIsKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleAuthAction = () => {
    setError('');
    if (authType === 'login') {
      if (!email || !password) {
        setError('Vui lòng nhập Email và Mật khẩu.');
        return;
      }
    } else {
      if (!firstName || !lastName || !studentId || !regPassword || !confirmPassword) {
        setError('Vui lòng điền đầy đủ thông tin.');
        return;
      }
      if (regPassword !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp.');
        return;
      }
      const fullEmail = `${studentId.toLowerCase()}@sv.ttn.edu.vn`;
      console.log('Registering with email:', fullEmail, 'Password:', regPassword);
    }
    router.replace(`/`);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={[authStyles.container, { flex: 1 }]} edges={['bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
              {/* Header tự tránh tai thỏ khi mở phím */}
              <AuthHeader 
                currentTab={authType} 
                onTabChange={setAuthType} 
                isKeyboardVisible={isKeyboardVisible}
              />

              <View style={authStyles.formContainer}>
                {error ? (
                  <Text style={{ color: 'red', marginBottom: 8, textAlign: 'center', fontWeight: 'bold' }}>
                    {error}
                  </Text>
                ) : null}

                {authType === 'login' ? (
                  // ================= LOGIN FORM =================
                  <>
                    <Text style={authStyles.label}>EMAIL HOẶC MÃ SINH VIÊN</Text>
                    <View style={authStyles.inputBox}>
                      <Feather name="mail" size={19} color={AppColors.textMuted} style={authStyles.iconPrefix} />
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

                    <View style={{ height: 12 }} />

                    <Text style={authStyles.label}>MẬT KHẨU</Text>
                    <View style={authStyles.inputBox}>
                      <Feather name="lock" size={19} color={AppColors.textMuted} style={authStyles.iconPrefix} />
                      <TextInput
                        style={authStyles.textInput}
                        placeholder="••••••••"
                        placeholderTextColor={AppColors.textMuted}
                        secureTextEntry={obscurePassword}
                        value={password}
                        onChangeText={setPassword}
                      />
                      <TouchableOpacity onPress={() => setObscurePassword(!obscurePassword)} style={authStyles.iconSuffix}>
                        <MaterialIcons name={obscurePassword ? 'visibility' : 'visibility-off'} size={19} color={AppColors.textMuted} />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={authStyles.forgotPassBtn} activeOpacity={0.7}>
                      <Text style={authStyles.forgotPassText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  // ================= REGISTER FORM =================
                  <>
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
                      <View style={{ width: 10 }} />
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

                    <View style={{ height: 10 }} />

                    {/* EMAIL TRƯỜNG CẤP */}
                    <Text style={authStyles.label}>EMAIL TRƯỜNG CẤP</Text>
                    <View style={[authStyles.inputBox, { paddingHorizontal: 12 }]}>
                      <TextInput 
                        style={authStyles.textInput} 
                        placeholder="mssv" 
                        placeholderTextColor={AppColors.textMuted} 
                        value={studentId} 
                        onChangeText={setStudentId} 
                        autoCapitalize="none"
                        keyboardType="numeric"
                      />
                      <Text style={{ color: AppColors.textMuted, fontSize: 13 }}>@sv.ttn.edu.vn</Text>
                    </View>

                    <View style={{ height: 10 }} />
                    
                    {/* MẬT KHẨU */}
                    <Text style={authStyles.label}>MẬT KHẨU</Text>
                    <View style={authStyles.inputBox}>
                      <Feather name="lock" size={19} color={AppColors.textMuted} style={authStyles.iconPrefix} />
                      <TextInput
                        style={authStyles.textInput}
                        placeholder="••••••••"
                        placeholderTextColor={AppColors.textMuted}
                        secureTextEntry={obscureRegPassword}
                        value={regPassword}
                        onChangeText={setRegPassword}
                      />
                      <TouchableOpacity onPress={() => setObscureRegPassword(!obscureRegPassword)} style={authStyles.iconSuffix}>
                        <MaterialIcons name={obscureRegPassword ? 'visibility' : 'visibility-off'} size={19} color={AppColors.textMuted} />
                      </TouchableOpacity>
                    </View>

                    <View style={{ height: 10 }} />
                    
                    {/* XÁC NHẬN MẬT KHẨU */}
                    <Text style={authStyles.label}>XÁC NHẬN MẬT KHẨU</Text>
                    <View style={authStyles.inputBox}>
                      <Feather name="lock" size={19} color={AppColors.textMuted} style={authStyles.iconPrefix} />
                      <TextInput
                        style={authStyles.textInput}
                        placeholder="••••••••"
                        placeholderTextColor={AppColors.textMuted}
                        secureTextEntry={obscureConfirmPassword}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                      />
                      <TouchableOpacity onPress={() => setObscureConfirmPassword(!obscureConfirmPassword)} style={authStyles.iconSuffix}>
                        <MaterialIcons name={obscureConfirmPassword ? 'visibility' : 'visibility-off'} size={19} color={AppColors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  </>
                )}

                <View style={{ height: 16 }} />

                <TouchableOpacity style={authStyles.primaryButton} onPress={handleAuthAction} activeOpacity={0.85}>
                  <Text style={authStyles.primaryBtnText}>
                    {authType === 'login' ? 'Đăng Nhập Vào Campus' : 'Tạo Tài Khoản Mới'}
                  </Text>
                </TouchableOpacity>

                {authType === 'login' && !isKeyboardVisible && (
                  <>
                    <View style={{ height: 10 }} />
                    <View style={authStyles.dividerRow}>
                      <View style={authStyles.dividerLine} />
                      <Text style={authStyles.dividerText}>hoặc</Text>
                      <View style={authStyles.dividerLine} />
                    </View>

                    <View style={{ height: 16 }} />

                    <TouchableOpacity style={authStyles.guestButton} onPress={handleAuthAction} activeOpacity={0.8}>
                      <Text style={authStyles.guestBtnText}>
                        Khách (Giới hạn tính năng)
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}