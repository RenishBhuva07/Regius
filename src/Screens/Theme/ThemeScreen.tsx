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
    Colors: themeColors,
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

  const bgMain =
    themeColors.Background ||
    (isDarkMode ? Colors.DarkBackground : Colors.CreamBackground);
  const cardBg =
    themeColors.CardBackground ||
    (isDarkMode ? Colors.DarkCardBackground : Colors.PureWhite);

  const renderRightAction = useCallback(
    () => (
      <View style={styles.headerRightActions}>
        <Badge
          label={`${themePresets.length} PALETTES`}
          variant="yellow"
          size="sm"
        />
      </View>
    ),
    [themePresets.length],
  );

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
        rightAction={renderRightAction}
        backAccessibilityLabel="Back to Settings"
      />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + ResponsivePixels.size40 },
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
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ResponsivePixels.size8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: ResponsivePixels.size12,
  },
  themeList: {
    paddingHorizontal: ResponsivePixels.size16,
    gap: ResponsivePixels.size16,
  },
});
