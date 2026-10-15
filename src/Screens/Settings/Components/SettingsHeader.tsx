import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Sparkles, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '../../../Theme/Typographys';
import ResponsivePixels from '../../../Assets/StyleUtilities/ResponsivePixels';
import { useSettingsTheme } from './types';

export const SettingsHeader: React.FC = () => {
  const { isDarkMode, textPrimary, textSecondary } = useSettingsTheme();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {navigation.canGoBack() && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={[
              styles.backButton,
              { backgroundColor: isDarkMode ? '#2A2E36' : '#EFEAE0' },
            ]}
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={22} color={textPrimary} />
          </TouchableOpacity>
        )}
        <View>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>
            Settings
          </Text>
          <Text style={[styles.headerSubtitle, { color: textSecondary }]}>
            Preferences & AI Assistant Configuration
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.headerBadge,
          { backgroundColor: isDarkMode ? '#2A2E36' : '#FFF5B8' },
        ]}
      >
        <Sparkles size={14} color="#F5C518" strokeWidth={2.5} />
        <Text
          style={[
            styles.headerBadgeText,
            { color: isDarkMode ? '#F5C518' : '#1F2228' },
          ]}
        >
          Regius v2.4
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ResponsivePixels.size20,
    paddingTop: ResponsivePixels.size8,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.h1RanadeBold,
    fontSize: 28,
    lineHeight: 32,
  },
  headerSubtitle: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 13,
    marginTop: 2,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  headerBadgeText: {
    ...Typography.bodySmallPoppinsSemiBold,
    fontSize: 11,
  },
});

export default SettingsHeader;
