import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AppColors } from '@/src/constants/appColors';
import { authStyles } from '@/src/constants/authStyles';

interface AuthHeaderProps {
  currentTab: 'login' | 'register';
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ currentTab }) => {
  const router = useRouter();
  const [tabWidth, setTabWidth] = useState(0);

  const onTabLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width - 8;
    setTabWidth(width);
  };

  return (
    <View>
      {/* ================= HEADER ẢNH & GRADIENT ================= */}
      <View style={authStyles.headerContainer}>
        <Image
          source={require('@/assets/images/images.jpg')}
          style={authStyles.headerImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={[
            'rgba(19, 47, 115, 0.45)',
            'rgba(19, 47, 115, 0.70)',
            'rgba(243, 246, 253, 0.88)',
            AppColors.background,
          ]}
          locations={[0.0, 0.45, 0.8, 1.0]}
          style={authStyles.gradientOverlay}
        />
        <View style={authStyles.brandContainer}>
          <View style={authStyles.brandRow}>
            <View style={authStyles.logoBox}>
              <MaterialIcons name="layers" size={22} color="#FFFFFF" />
            </View>
            <Text style={authStyles.brandTitle}>Smart Campus</Text>
          </View>
          <Text style={authStyles.brandSubtitle}>Cổng Thông Tin Sinh Viên Thông Minh</Text>
        </View>
      </View>

      {/* ================= TAB CHUYỂN ĐỔI ================= */}
      <View style={authStyles.tabOuterPadding}>
        <View style={authStyles.tabTrack} onLayout={onTabLayout}>
          {tabWidth > 0 && (
            <View
              style={[
                authStyles.tabIndicator,
                {
                  width: tabWidth / 2,
                  transform: [
                    { translateX: currentTab === 'login' ? 0 : tabWidth / 2 },
                  ],
                },
              ]}
            />
          )}

          <TouchableOpacity
            style={authStyles.tabItem}
            onPress={() => currentTab !== 'login' && router.replace('/(auth)/login')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                authStyles.tabLabel,
                currentTab === 'login'
                  ? authStyles.tabLabelActive
                  : authStyles.tabLabelInactive,
              ]}
            >
              Đăng Nhập
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={authStyles.tabItem}
            onPress={() => currentTab !== 'register' && router.replace('/(auth)/register')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                authStyles.tabLabel,
                currentTab === 'register'
                  ? authStyles.tabLabelActive
                  : authStyles.tabLabelInactive,
              ]}
            >
              Đăng Ký
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};