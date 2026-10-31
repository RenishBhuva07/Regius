import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Vibration,
  Modal,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  Palette,
  CheckCircle2,
  Lock,
  Sparkles,
  Check,
  ShieldCheck,
  X,
  Trophy,
  Sun,
  Moon,
  Crown,
  Layers,
} from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Typography } from '../../Theme/Typographys';
import { Fonts } from '../../Theme/fonts';
import { Colors } from '../../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../../Assets/StyleUtilities/ResponsivePixels';
import { Badge } from '../../Common/Badge';
import {
  SubScreenHeader,
  SUB_SCREEN_HEADER_HEIGHT,
} from '../../Common/SubScreenHeader';
import { useScrollReactiveHeader } from '../../Common/useScrollReactiveHeader';
import CustomButton from '../../Common/CustomButton';
import {
  useTheme,
  THEME_PRESETS,
  ThemeOption,
  ThemePresetId,
  isLightColor,
} from '../../Theme/ThemeContext';
import { useMilestones } from '../../Context/MilestoneContext';
import { SettingsBackgroundSvg } from '../Settings/Components/SettingsBackgroundSvg';
import { HeaderPatternSvg } from '../Dashboard/Components/HeaderPatternSvg';

const { width: screenWidth } = Dimensions.get('window');
const HEADER_HEIGHT = SUB_SCREEN_HEADER_HEIGHT;

type FilterTab = 'all' | 'unlocked' | 'locked';

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

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [lockedModalTheme, setLockedModalTheme] = useState<ThemeOption | null>(
    null,
  );

  const { scrollY, isScrolled, handleScroll } = useScrollReactiveHeader();

  // Active theme object
  const activeTheme = useMemo(
    () => themePresets.find(t => t.id === activeThemeId) || themePresets[0],
    [activeThemeId, themePresets],
  );

  // Perceived luminance of the hero card background
  const isHeroLight = isLightColor(activeTheme.previewBg);

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
  const handleSwatchPress = (themeName: string, label: string, hex: string) => {
    Vibration.vibrate(15);
    Toast.show({
      type: 'info',
      text1: `${themeName} • ${label}`,
      text2: `Color code: ${hex}`,
    });
  };

  const bgMain = isDarkMode ? '#121417' : Colors.CreamBackground;
  const cardBg = isDarkMode ? '#1E2228' : Colors.DefaultWhite;
  const textPrimary = isDarkMode
    ? Colors.PureWhiteText
    : Colors.MidnightInkText;
  const textSecondary = isDarkMode ? '#A3A8B1' : Colors.SubtitleGray;
  const borderLight = isDarkMode ? '#2C3035' : '#E8E2D5';
  const surfaceAlt = isDarkMode ? '#171A1F' : '#FAF8F5';

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
                  color={
                    scrolled ? Colors.DefaultWhite : Colors.LavenderPurple
                  }
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
        {/* Hero Active Theme Bento Card (2-Layer Signature Wrapper Pattern) */}
        <View style={styles.heroWrapper}>
          <View style={styles.cardShadowWrapper}>
            <View
              style={[
                styles.heroCardInner,
                {
                  backgroundColor: activeTheme.previewBg,
                  borderColor: isHeroLight
                    ? '#E8E2D5'
                    : 'rgba(255, 255, 255, 0.9)',
                },
              ]}
            >
              <HeaderPatternSvg width={screenWidth} insetsTop={insets.top} />

              <View style={styles.heroTopRow}>
                <View style={styles.heroTitleGroup}>
                  <Badge label="CURRENTLY ACTIVE" variant="yellow" size="sm" />
                  <Text
                    style={[
                      styles.heroThemeName,
                      { color: isHeroLight ? '#121417' : '#FFFFFF' },
                    ]}
                    numberOfLines={1}
                  >
                    {activeTheme.name}
                  </Text>
                </View>
                <View
                  style={[
                    styles.heroAccentOrb,
                    { backgroundColor: activeTheme.accent },
                  ]}
                >
                  <Sparkles
                    size={16}
                    color={
                      isLightColor(activeTheme.accent) ? '#121417' : '#FFFFFF'
                    }
                    strokeWidth={2.4}
                  />
                </View>
              </View>

              <Text
                style={[
                  styles.heroTagline,
                  {
                    color: isHeroLight ? '#444A52' : 'rgba(255, 255, 255, 0.8)',
                  },
                ]}
              >
                {activeTheme.tagline}
              </Text>

              {/* Live Interactive Mini UI Mockup */}
              <View
                style={[
                  styles.heroMockupContainer,
                  isHeroLight && {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderColor: 'rgba(0, 0, 0, 0.08)',
                  },
                ]}
              >
                <View style={styles.mockupHeader}>
                  <View style={styles.mockupDotsRow}>
                    <View
                      style={[styles.mockupDot, { backgroundColor: '#FF5F56' }]}
                    />
                    <View
                      style={[styles.mockupDot, { backgroundColor: '#FFBD2E' }]}
                    />
                    <View
                      style={[styles.mockupDot, { backgroundColor: '#27C93F' }]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.mockupHeaderText,
                      isHeroLight && { color: '#666665' },
                    ]}
                  >
                    Live Palette Preview ({isDarkMode ? 'Dark' : 'Light'})
                  </Text>
                </View>

                <View
                  style={[
                    styles.mockupSurface,
                    {
                      backgroundColor: activeTheme.palette[1].hex,
                      borderWidth: isLightColor(activeTheme.palette[1].hex)
                        ? 1
                        : 0,
                      borderColor: 'rgba(0, 0, 0, 0.08)',
                    },
                  ]}
                >
                  <View style={styles.mockupCardRow}>
                    <View
                      style={[
                        styles.mockupChip,
                        { backgroundColor: activeTheme.accent },
                      ]}
                    >
                      <Text
                        style={[
                          styles.mockupChipText,
                          {
                            color: isLightColor(activeTheme.accent)
                              ? '#121417'
                              : '#FFFFFF',
                          },
                        ]}
                      >
                        FOCUS
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.mockupCardTitle,
                        { color: activeTheme.palette[3].hex },
                      ]}
                    >
                      Review Architecture Plan
                    </Text>
                  </View>

                  <View style={styles.mockupProgressTrack}>
                    <View
                      style={[
                        styles.mockupProgressBar,
                        { backgroundColor: activeTheme.accent, width: '74%' },
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* Stats Footer */}
              <View
                style={[
                  styles.heroFooter,
                  isHeroLight && { borderTopColor: 'rgba(0, 0, 0, 0.08)' },
                ]}
              >
                <View style={styles.heroStatItem}>
                  <Text
                    style={[
                      styles.heroStatLabel,
                      isHeroLight && { color: '#77767B' },
                    ]}
                  >
                    PROGRESS
                  </Text>
                  <Text
                    style={[
                      styles.heroStatValue,
                      isHeroLight && { color: '#121417' },
                    ]}
                  >
                    {unlockedCount} of {themePresets.length} Unlocked
                  </Text>
                </View>
                <View
                  style={[
                    styles.heroDivider,
                    isHeroLight && { backgroundColor: 'rgba(0, 0, 0, 0.12)' },
                  ]}
                />
                <View style={styles.heroStatItem}>
                  <Text
                    style={[
                      styles.heroStatLabel,
                      isHeroLight && { color: '#77767B' },
                    ]}
                  >
                    CURRENT TIER
                  </Text>
                  <Text
                    style={[
                      styles.heroStatValue,
                      isHeroLight && { color: '#121417' },
                    ]}
                  >
                    Tier {currentTier.level}: {currentTier.title}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabsContainer}>
          {(['all', 'unlocked', 'locked'] as FilterTab[]).map(tab => {
            const isActive = activeTab === tab;
            const label =
              tab === 'all'
                ? `All (${THEME_PRESETS.length})`
                : tab === 'unlocked'
                ? `Unlocked (${unlockedCount})`
                : `Rewards (${THEME_PRESETS.length - unlockedCount})`;

            return (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab)}
                style={[
                  styles.filterTabPill,
                  isActive && styles.filterTabPillActive,
                  {
                    backgroundColor: isActive
                      ? isDarkMode
                        ? '#FFFFFF'
                        : Colors.MidnightCharcoal
                      : cardBg,
                    borderColor: isActive ? 'transparent' : borderLight,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Filter ${label}`}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    {
                      color: isActive
                        ? isDarkMode
                          ? '#000000'
                          : Colors.PureWhiteText
                        : textSecondary,
                      fontFamily: isActive
                        ? Fonts.poppins.bold
                        : Fonts.poppins.medium,
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Themes List */}
        <View style={styles.themeList}>
          {filteredThemes.map(theme => {
            const isSelected = activeThemeId === theme.id;
            const isUnlocked = isThemeUnlocked(theme.id);
            const reqTier = allTiers.find(
              t => t.level === theme.requiredTierLevel,
            );

            return (
              <View
                key={theme.id}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: cardBg,
                    borderColor: isSelected
                      ? theme.accent
                      : isDarkMode
                      ? 'rgba(255, 255, 255, 0.12)'
                      : '#FFFFFF',
                    borderBottomColor: isSelected
                      ? theme.accent
                      : isDarkMode
                      ? '#171A20'
                      : '#E2DCD0',
                    shadowColor: isSelected
                      ? theme.accent
                      : isDarkMode
                      ? '#000000'
                      : 'rgba(131, 131, 214, 0.14)',
                  },
                ]}
              >
                {/* Theme Header Row */}
                <View style={styles.themeCardHeader}>
                  <View style={styles.themeTitleLeft}>
                    <View
                      style={[
                        styles.themeDot,
                        { backgroundColor: theme.accent },
                      ]}
                    />
                    <View>
                      <Text
                        style={[styles.themeNameText, { color: textPrimary }]}
                      >
                        {theme.name}
                      </Text>
                      <Text
                        style={[
                          styles.themeTaglineText,
                          { color: textSecondary },
                        ]}
                        numberOfLines={1}
                      >
                        {theme.tagline}
                      </Text>
                    </View>
                  </View>

                  {/* Status Indicator Badges */}
                  <View style={styles.statusBadgeWrap}>
                    {isSelected ? (
                      <Badge label="CURRENT THEME" variant="green" size="sm" />
                    ) : isUnlocked ? (
                      <Badge label="UNLOCKED" variant="neutral" size="sm" />
                    ) : (
                      <Badge
                        label={`TIER ${theme.requiredTierLevel} REQUIRED`}
                        variant="purple"
                        size="sm"
                      />
                    )}
                  </View>
                </View>

                {/* 4 Colors in Round Shape in One Line */}
                <View
                  style={[
                    styles.colorsRowContainer,
                    {
                      backgroundColor: surfaceAlt,
                      borderColor: borderLight,
                    },
                  ]}
                >
                  {theme.palette.map((color, cIdx) => (
                    <TouchableOpacity
                      key={cIdx}
                      activeOpacity={0.7}
                      style={styles.colorSwatchItem}
                      onPress={() =>
                        handleSwatchPress(theme.name, color.label, color.hex)
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`${color.label} color ${color.hex}`}
                    >
                      {/* Round Shape Swatch */}
                      <View
                        style={[
                          styles.colorCircle,
                          {
                            backgroundColor: color.hex,
                            borderColor: isLightColor(color.hex)
                              ? 'rgba(0, 0, 0, 0.18)'
                              : 'rgba(255, 255, 255, 0.25)',
                          },
                        ]}
                      />
                      {/* Hex Code */}
                      <Text
                        style={[styles.colorCodeText, { color: textPrimary }]}
                      >
                        {color.hex.toUpperCase()}
                      </Text>
                      {/* Role Label */}
                      <Text
                        style={[
                          styles.colorRoleLabel,
                          { color: textSecondary },
                        ]}
                      >
                        {color.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Locked Tier Information Banner */}
                {!isUnlocked && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.lockedInfoBanner,
                      {
                        backgroundColor: isDarkMode
                          ? 'rgba(131, 131, 214, 0.12)'
                          : '#F2F0FF',
                        borderColor: isDarkMode
                          ? 'rgba(131, 131, 214, 0.28)'
                          : '#D7D4F5',
                      },
                    ]}
                    onPress={() => setLockedModalTheme(theme)}
                  >
                    <Lock size={13} color="#8383D6" strokeWidth={2.4} />
                    <Text style={styles.lockedInfoText}>
                      Unlocks at Tier {theme.requiredTierLevel} (
                      {reqTier ? reqTier.title : 'Milestone'}) • Tap for details
                    </Text>
                  </TouchableOpacity>
                )}

                {/* Card Action Row */}
                <View style={styles.cardActionRow}>
                  {isSelected ? (
                    <View style={styles.activeAppliedRow}>
                      <CheckCircle2
                        size={16}
                        color="#21AF85"
                        strokeWidth={2.4}
                      />
                      <Text style={styles.activeAppliedText}>
                        Active Palette Applied
                      </Text>
                    </View>
                  ) : isUnlocked ? (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[
                        styles.applyButtonPill,
                        {
                          backgroundColor: isDarkMode
                            ? '#FFFFFF'
                            : Colors.MidnightCharcoal,
                        },
                      ]}
                      onPress={() => handleApplyTheme(theme)}
                      accessibilityRole="button"
                      accessibilityLabel={`Apply ${theme.name} Theme`}
                    >
                      <Check
                        size={14}
                        color={isDarkMode ? '#000000' : Colors.PureWhiteText}
                        strokeWidth={2.4}
                      />
                      <Text
                        style={[
                          styles.applyButtonText,
                          {
                            color: isDarkMode
                              ? '#000000'
                              : Colors.PureWhiteText,
                          },
                        ]}
                      >
                        Apply Theme
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={[
                        styles.unlockButtonPill,
                        {
                          backgroundColor: isDarkMode ? '#2A263D' : '#F5F3FF',
                          borderColor: '#8383D6',
                        },
                      ]}
                      onPress={() => setLockedModalTheme(theme)}
                      accessibilityRole="button"
                      accessibilityLabel={`View unlock requirements for ${theme.name}`}
                    >
                      <Lock size={13} color="#8383D6" strokeWidth={2.4} />
                      <Text style={styles.unlockButtonText}>
                        Unlock Requirements
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </Animated.ScrollView>

      {/* Locked Theme Milestone Requirement Modal */}
      <Modal
        visible={lockedModalTheme !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setLockedModalTheme(null)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: cardBg,
                borderColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.15)'
                  : '#FFFFFF',
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <Trophy size={20} color="#F5C518" strokeWidth={2.2} />
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.modalCloseBtn}
                onPress={() => setLockedModalTheme(null)}
              >
                <X size={18} color={textSecondary} strokeWidth={2.2} />
              </TouchableOpacity>
            </View>

            {lockedModalTheme && (
              <>
                <Text style={[styles.modalTitle, { color: textPrimary }]}>
                  {lockedModalTheme.name}
                </Text>
                <Text style={[styles.modalDesc, { color: textSecondary }]}>
                  {lockedModalTheme.tagline}
                </Text>

                {/* 4 Color Swatches in Modal */}
                <View
                  style={[
                    styles.modalColorsRow,
                    {
                      backgroundColor: surfaceAlt,
                      borderColor: borderLight,
                    },
                  ]}
                >
                  {lockedModalTheme.palette.map((col, idx) => (
                    <View key={idx} style={styles.modalColorCol}>
                      <View
                        style={[
                          styles.modalColorCircle,
                          {
                            backgroundColor: col.hex,
                            borderColor: isLightColor(col.hex)
                              ? 'rgba(0, 0, 0, 0.18)'
                              : 'rgba(255, 255, 255, 0.3)',
                          },
                        ]}
                      />
                      <Text
                        style={[styles.modalColorCode, { color: textPrimary }]}
                      >
                        {col.hex}
                      </Text>
                      <Text
                        style={[
                          styles.modalColorLabel,
                          { color: textSecondary },
                        ]}
                      >
                        {col.label}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Milestone Progress Info Box */}
                <View
                  style={[
                    styles.modalProgressBox,
                    {
                      backgroundColor: surfaceAlt,
                      borderColor: borderLight,
                    },
                  ]}
                >
                  <View style={styles.modalReqRow}>
                    <Badge
                      label={`TIER ${lockedModalTheme.requiredTierLevel}`}
                      variant="yellow"
                      size="sm"
                    />
                    <Text
                      style={[styles.modalReqTitle, { color: textPrimary }]}
                    >
                      {allTiers.find(
                        t => t.level === lockedModalTheme.requiredTierLevel,
                      )?.title || 'Advanced Tier'}
                    </Text>
                  </View>

                  <View style={styles.modalXpProgressRow}>
                    <Text
                      style={[styles.modalXpLabel, { color: textSecondary }]}
                    >
                      Total XP: {totalXp} XP
                    </Text>
                    <Text
                      style={[styles.modalXpLabel, { color: textSecondary }]}
                    >
                      Req:{' '}
                      {allTiers.find(
                        t => t.level === lockedModalTheme.requiredTierLevel,
                      )?.minXp || 0}{' '}
                      XP
                    </Text>
                  </View>

                  <View style={styles.modalProgressBarBg}>
                    <View
                      style={[
                        styles.modalProgressBarFill,
                        {
                          width: `${Math.min(
                            100,
                            Math.round(
                              (totalXp /
                                (allTiers.find(
                                  t =>
                                    t.level ===
                                    lockedModalTheme.requiredTierLevel,
                                )?.minXp || 1)) *
                                100,
                            ),
                          )}%`,
                        },
                      ]}
                    />
                  </View>

                  <Text
                    style={[styles.modalHintText, { color: textSecondary }]}
                  >
                    Earn XP by completing tasks (+15 XP), reminders (+10 XP),
                    and keeping habit streaks!
                  </Text>
                </View>

                {/* Modal CTA Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    activeOpacity={0.88}
                    style={styles.royalUpgradeBtn}
                    onPress={() => {
                      setLockedModalTheme(null);
                      navigation.navigate('SubscriptionScreen');
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Unlock with Regius Royal"
                  >
                    <Crown
                      size={18}
                      color="#1F2228"
                      fill="#F5C518"
                      strokeWidth={2.4}
                    />
                    <Text style={styles.royalUpgradeBtnText}>
                      Unlock Instantly with Royal 👑
                    </Text>
                  </TouchableOpacity>

                  <View style={{ height: 10 }} />

                  <CustomButton
                    title="View Milestone Journey"
                    onPress={() => {
                      setLockedModalTheme(null);
                      openMilestones();
                    }}
                    variant="outlined"
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    paddingTop: ResponsivePixels.size16,
  },
  heroWrapper: {
    paddingHorizontal: 10,
    marginBottom: ResponsivePixels.size20,
  },
  cardShadowWrapper: {
    backgroundColor: Colors.NeroBlack,
    borderRadius: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  heroCardInner: {
    borderRadius: 24,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    padding: ResponsivePixels.size16,
    overflow: 'hidden',
    position: 'relative',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  heroTitleGroup: {
    gap: 6,
  },
  heroThemeName: {
    ...Typography.h1RanadeBold,
    color: '#FFFFFF',
    fontSize: 22,
  },
  heroAccentOrb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  heroTagline: {
    ...Typography.bodySmallPoppinsRegular,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 14,
  },
  heroMockupContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 12,
    marginBottom: 14,
  },
  mockupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mockupDotsRow: {
    flexDirection: 'row',
    gap: 5,
  },
  mockupDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  mockupHeaderText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 0.5,
  },
  mockupSurface: {
    borderRadius: 12,
    padding: 12,
  },
  mockupCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  mockupChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  mockupChipText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 8.5,
    color: '#000000',
  },
  mockupCardTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
  },
  mockupProgressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
  },
  mockupProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
  },
  heroStatItem: {
    flex: 1,
  },
  heroStatLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.8,
  },
  heroStatValue: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
  },
  heroDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  filterTabsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: ResponsivePixels.size16,
    marginBottom: ResponsivePixels.size16,
  },
  filterTabPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 2,
  },
  filterTabPillActive: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterTabText: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  themeList: {
    paddingHorizontal: ResponsivePixels.size16,
    gap: ResponsivePixels.size16,
  },
  themeCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    padding: ResponsivePixels.size16,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  themeCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  themeTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  themeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  themeNameText: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 17,
    letterSpacing: 0.2,
  },
  themeTaglineText: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 11,
    marginTop: 1,
  },
  statusBadgeWrap: {
    alignItems: 'flex-end',
  },
  colorsRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  colorSwatchItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  colorCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 2,
  },
  colorCodeText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10.5,
    letterSpacing: 0.4,
    marginTop: 2,
  },
  colorRoleLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 9.5,
  },
  lockedInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  lockedInfoText: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
    color: '#8383D6',
    flex: 1,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  activeAppliedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(33, 175, 133, 0.12)',
  },
  activeAppliedText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 12,
    color: '#21AF85',
  },
  applyButtonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  applyButtonText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 12,
  },
  unlockButtonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  unlockButtonText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11.5,
    color: '#8383D6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 20,
    marginBottom: 4,
  },
  modalDesc: {
    ...Typography.bodySmallPoppinsRegular,
    fontSize: 12,
    marginBottom: 14,
  },
  modalColorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  modalColorCol: {
    alignItems: 'center',
    flex: 1,
    gap: 3,
  },
  modalColorCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modalColorCode: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 9.5,
  },
  modalColorLabel: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 8.5,
  },
  modalProgressBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  modalReqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalReqTitle: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
  },
  modalXpProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  modalXpLabel: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 11,
  },
  modalProgressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    marginBottom: 8,
  },
  modalProgressBarFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#F5C518',
  },
  modalHintText: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 10.5,
    lineHeight: 14,
  },
  modalActions: {
    marginTop: 4,
  },
  royalUpgradeBtn: {
    backgroundColor: '#F5C518',
    borderRadius: 28,
    paddingVertical: ResponsivePixels.size14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderBottomWidth: 3,
    borderBottomColor: '#D97706',
    ...Platform.select({
      ios: {
        shadowColor: '#F5C518',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  royalUpgradeBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 14,
    color: '#1F2228',
  },
});
