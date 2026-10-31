import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Vibration,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Sun, Moon } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import { SubScreenHeader } from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
import { useTheme, THEME_PRESETS, ThemeOption } from '../../Theme/ThemeContext';
import { useMilestones } from '../../Context/MilestoneContext';
import { SettingsBackgroundSvg } from '../Settings/Components/SettingsBackgroundSvg';
import {
  ThemeHeroCard,
  ThemeFilterTabs,
  ThemeFilterTab,
  ThemePresetCard,
  ThemeLockedModal,
} from './Components';

const { width: screenWidth } = Dimensions.get('window');

export const ThemeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const {
    activeThemeId,
    setActiveThemeId,
    isDarkMode,
    toggleTheme,
    themePresets,
  } = useTheme();
  const { currentTier, totalXp, isThemeUnlocked, allTiers, openMilestones } =
    useMilestones();

  const [activeTab, setActiveTab] = useState<ThemeFilterTab>('all');
  const [lockedModalTheme, setLockedModalTheme] = useState<ThemeOption | null>(
    null,
  );

  const { scrollY, isScrolled, handleScroll } = useScrollReactiveHeader();

  // Active theme object
  const activeTheme = useMemo(
    () => themePresets.find(t => t.id === activeThemeId) || themePresets[0],
    [activeThemeId, themePresets],
  );

  // Filter themes based on tab
  const filteredThemes = useMemo(() => {
    return themePresets.filter(theme => {
      const unlocked = isThemeUnlocked(theme.id);
      if (activeTab === 'unlocked') return unlocked;
      if (activeTab === 'locked') return !unlocked;
      return true;
    });
  }, [activeTab, isThemeUnlocked, themePresets]);

  // Counts
  const unlockedCount = useMemo(
    () => themePresets.filter(t => isThemeUnlocked(t.id)).length,
    [isThemeUnlocked, themePresets],
  );

  // Apply Theme Handler
  const handleApplyTheme = useCallback(
    (theme: ThemeOption) => {
      const unlocked = isThemeUnlocked(theme.id);
      if (!unlocked) {
        setLockedModalTheme(theme);
        return;
      }

      if (theme.id === activeThemeId) {
        Toast.show({
          type: 'info',
          text1: 'Theme Already Active',
          text2: `${theme.name} is currently applied.`,
        });
        return;
      }

      // Tactile feedback
      Vibration.vibrate(35);

      setActiveThemeId(theme.id);
      Toast.show({
        type: 'success',
        text1: 'Theme Applied',
        text2: `Switched to ${theme.name} palette.`,
      });
    },
    [activeThemeId, isThemeUnlocked, setActiveThemeId],
  );

  // Swatch Tap info
  const handleSwatchPress = useCallback(
    (themeName: string, label: string, hex: string) => {
      Vibration.vibrate(15);
      Toast.show({
        type: 'info',
        text1: `${themeName} • ${label}`,
        text2: `Color code: ${hex}`,
      });
    },
    [],
  );

  const bgMain = isDarkMode ? '#121417' : Colors.CreamBackground;
  const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;

  return (
    <View style={[styles.container, { backgroundColor: bgMain }]}>
      <SettingsBackgroundSvg />

      {/* Scroll-Reactive Header */}
      <SubScreenHeader
        title="Prestige Themes"
        subtitle="Bespoke Luxury Color Systems"
        scrollY={scrollY}
        isScrolled={isScrolled}
        isAbsolute={false}
        rightAction={scrolled => (
          <View style={styles.headerRightActions}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={toggleTheme}
              style={[
                styles.modeToggleBtn,
                scrolled
                  ? styles.modeToggleBtnScrolled
                  : {
                      backgroundColor: cardBg,
                      borderColor: isDarkMode
                        ? 'rgba(255, 255, 255, 0.12)'
                        : '#FFFFFF',
                      borderBottomColor: isDarkMode ? '#14161A' : '#DCD6CA',
                      shadowColor: isDarkMode
                        ? '#000000'
                        : 'rgba(0, 0, 0, 0.08)',
                    },
              ]}
              accessibilityRole="button"
              accessibilityLabel={
                isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'
              }
            >
              {isDarkMode ? (
                <Sun size={17} color="#F5C518" strokeWidth={2.4} />
              ) : (
                <Moon
                  size={17}
                  color={scrolled ? Colors.DefaultWhite : Colors.LavenderPurple}
                  strokeWidth={2.4}
                />
              )}
            </TouchableOpacity>

            <Badge label="6 PALETTES" variant="yellow" size="sm" />
          </View>
        )}
        backAccessibilityLabel="Back to Settings"
      />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Hero Active Theme Bento Card */}
        <ThemeHeroCard
          activeTheme={activeTheme}
          isDarkMode={isDarkMode}
          unlockedCount={unlockedCount}
          totalThemes={themePresets.length}
          currentTier={currentTier}
          screenWidth={screenWidth}
          insetsTop={insets.top}
        />

        {/* Filter Tabs */}
        <ThemeFilterTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          totalThemes={THEME_PRESETS.length}
          unlockedCount={unlockedCount}
          isDarkMode={isDarkMode}
        />

        {/* Themes List */}
        <View style={styles.themeList}>
          {filteredThemes.map(theme => {
            const isSelected = activeThemeId === theme.id;
            const isUnlocked = isThemeUnlocked(theme.id);
            const reqTier = allTiers.find(
              t => t.level === theme.requiredTierLevel,
            );

            return (
              <ThemePresetCard
                key={theme.id}
                theme={theme}
                isSelected={isSelected}
                isUnlocked={isUnlocked}
                reqTierTitle={reqTier?.title}
                isDarkMode={isDarkMode}
                onApplyTheme={handleApplyTheme}
                onPressLocked={setLockedModalTheme}
                onPressSwatch={handleSwatchPress}
              />
            );
          })}
        </View>
      </Animated.ScrollView>

      {/* Locked Theme Milestone Requirement Modal */}
      <ThemeLockedModal
        visible={lockedModalTheme !== null}
        theme={lockedModalTheme}
        allTiers={allTiers}
        totalXp={totalXp}
        isDarkMode={isDarkMode}
        onClose={() => setLockedModalTheme(null)}
        onUpgradeRoyal={() => {
          setLockedModalTheme(null);
          navigation.navigate('SubscriptionScreen');
        }}
        onOpenMilestones={() => {
          setLockedModalTheme(null);
          openMilestones();
        }}
      />
    </View>
  );
};

export default ThemeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modeToggleBtnScrolled: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
  },
  themeList: {
    paddingHorizontal: ResponsivePixels.size16,
    gap: ResponsivePixels.size16,
  },
});
