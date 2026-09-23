import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { AppColors } from '../constants/appColors';
import { tabBarStyles } from '../constants/globalStyles';

interface CustomBottomNavProps {
  selectedIndex: number;
  onDestinationSelected: (index: number) => void;
}

export function CustomBottomNav({ selectedIndex, onDestinationSelected }: CustomBottomNavProps) {
  const _icons = [
    'home',
    'location-on',
    'calendar-today',
    'star-outline',
    'person-outline',
  ] as const;

  const _labels = [
    'Trang chủ',
    'Bản đồ',
    'Lịch học',
    'Sự kiện',
    'Hồ sơ',
  ];

  return (
    <View style={tabBarStyles.container}>
      <View style={tabBarStyles.navCard}>
        {_labels.map((label, index) => {
          const isSelected = index === selectedIndex;
          return (
            <TouchableOpacity
              key={label}
              onPress={() => onDestinationSelected(index)}
              activeOpacity={0.7}
              style={tabBarStyles.tabItem}
            >
              <View
                style={[
                  tabBarStyles.iconContainer,
                  isSelected && tabBarStyles.selectedIconContainer,
                ]}
              >
                <MaterialIcons
                  name={_icons[index] as any}
                  size={24}
                  color={isSelected ? AppColors.primary : AppColors.textMuted}
                />
              </View>
              <Text
                style={[
                  tabBarStyles.label,
                  {
                    fontWeight: isSelected ? '900' : '800',
                    color: isSelected ? AppColors.primary : AppColors.textMuted,
                  },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
