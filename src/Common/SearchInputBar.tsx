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
    const { isDarkMode } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
    const textPrimary = isDarkMode
      ? Colors.PureWhiteText
      : Colors.MidnightInkText;
    const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;
    const borderDefault = isDarkMode ? '#2C3035' : '#EAE5D9';
    const borderActive = isDarkMode ? '#8383D6' : Colors.LavenderPurple;

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
        <Search size={18} color={textSecondary} strokeWidth={2.2} />
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
            <X size={15} color={textSecondary} strokeWidth={2.4} />
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
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
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
    fontSize: 13,
    padding: 0,
  },
  searchClearBtn: {
    padding: 4,
  },
});

export default SearchInputBar;
