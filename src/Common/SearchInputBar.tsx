import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Fonts } from '../Theme/fonts';
import { Colors } from '../Assets/StyleUtilities/Colors';
import { useTheme } from '../Theme/ThemeContext';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

export interface SearchInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  autoFocus?: boolean;
}

export const SearchInputBar: React.FC<SearchInputBarProps> = React.memo(
  ({
    value,
    onChangeText,
    placeholder = 'Search...',
    onClear,
    containerStyle,
    autoFocus = false,
  }) => {
    const { isDarkMode, Colors: themeColors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const cardBg =
      themeColors.CardBackground ||
      (isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite);
    const textPrimary =
      themeColors.PrimaryText ||
      (isDarkMode ? Colors.PureWhite : Colors.PureBlack);
    const textSecondary =
      themeColors.SecondaryText ||
      (isDarkMode ? Colors.SteelMist : Colors.SubtitleGray);
    const borderDefault =
      themeColors.BorderLight ||
      (isDarkMode ? Colors.CarbonSlate : Colors.WarmParchmentBorder);
    const borderActive =
      themeColors.Accent || Colors.LavenderPurple;

    const handleClear = () => {
      onChangeText('');
      if (onClear) onClear();
    };

    return (
      <View
        style={[
          styles.searchWrap,
          {
            backgroundColor: cardBg,
            borderColor: isFocused ? borderActive : borderDefault,
          },
          containerStyle,
        ]}
      >
        <Search size={ResponsivePixels.size18} color={textSecondary} strokeWidth={2.2} />
        <TextInput
          style={[styles.searchInput, { color: textPrimary }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={textSecondary}
          autoCorrect={false}
          autoCapitalize="none"
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {value.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleClear}
            style={styles.searchClearBtn}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
          >
            <X size={ResponsivePixels.size15} color={textSecondary} strokeWidth={2.4} />
          </TouchableOpacity>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ResponsivePixels.size16,
    borderWidth: 1.5,
    paddingHorizontal: ResponsivePixels.size14,
    height: ResponsivePixels.size48,
    gap: ResponsivePixels.size10,
    marginBottom: ResponsivePixels.size16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.PureBlack,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size13,
    padding: 0,
  },
  searchClearBtn: {
    padding: ResponsivePixels.size4,
  },
});

export default SearchInputBar;
