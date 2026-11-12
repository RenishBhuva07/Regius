import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  Platform,
  Keyboard,
  Dimensions,
} from 'react-native';
import { Check, Sparkles, Plus } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../Theme/fonts';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';
import { useAppTheme } from '../Theme/useAppTheme';
import { Badge, BadgeVariant } from './Badge';
import {
  PictureEmblemIcon,
  OfficeBagIcon,
  HeartEmblemIcon,
  SparkleEmblemIcon,
  FlameEmblemIcon,
} from './EmblemIcons';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';

const { width: screenWidth } = Dimensions.get('window');
const categoryCardWidth = Math.min((screenWidth - 48) / 3, 114);

export interface CategoryPreset {
  name: string;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
  accentColor: string;
  checkColor: string;
  badgeVariant: BadgeVariant;
}

export const CATEGORY_PRESETS: CategoryPreset[] = [
  {
    name: 'Imperial Gold',
    bgColor: Colors.WorkLightBg,
    borderColor: Colors.WorkLightBorder,
    shadowColor: Colors.AccentYellow,
    accentColor: Colors.TaskGoldVivid,
    checkColor: Colors.HabitBurnishedAmber,
    badgeVariant: 'yellow',
  },
  {
    name: 'Emerald Mint',
    bgColor: Colors.WellnessLightBg,
    borderColor: Colors.WellnessLightBorder,
    shadowColor: Colors.AccentGreen,
    accentColor: Colors.AccentGreen,
    checkColor: Colors.GreenGracious,
    badgeVariant: 'green',
  },
  {
    name: 'Lavender Orchid',
    bgColor: Colors.MindfulLightBg,
    borderColor: Colors.MindfulLightBorder,
    shadowColor: Colors.LavenderPurple,
    accentColor: Colors.LavenderPurple,
    checkColor: Colors.MindfulTextAccent,
    badgeVariant: 'purple',
  },
  {
    name: 'Amber Sunset',
    bgColor: Colors.CategoryOrangeBg,
    borderColor: Colors.CategoryOrangeBorder,
    shadowColor: Colors.CategoryOrangeAccent,
    accentColor: Colors.CategoryOrangeAccent,
    checkColor: Colors.CategoryOrangeCheck,
    badgeVariant: 'orange',
  },
  {
    name: 'Crimson Rose',
    bgColor: Colors.CategoryRedBg,
    borderColor: Colors.CategoryRedBorder,
    shadowColor: Colors.CategoryRedAccent,
    accentColor: Colors.CategoryRedAccent,
    checkColor: Colors.CategoryRedCheck,
    badgeVariant: 'red',
  },
  {
    name: 'Ocean Azure',
    bgColor: Colors.CategorySkyBg,
    borderColor: Colors.CategorySkyBorder,
    shadowColor: Colors.CategorySkyAccent,
    accentColor: Colors.CategorySkyAccent,
    checkColor: Colors.CategorySkyCheck,
    badgeVariant: 'purple',
  },
  {
    name: 'Rose',
    bgColor: Colors.CategoryRoseBg,
    borderColor: Colors.CategoryRoseBorder,
    shadowColor: Colors.CategoryRoseAccent,
    accentColor: Colors.CategoryRoseAccent,
    checkColor: Colors.CategoryRoseCheck,
    badgeVariant: 'purple',
  },
];

export const CATEGORY_ICON_CHOICES = [
  {
    id: 'picture',
    label: 'Art',
    Icon: PictureEmblemIcon,
    defaultColor: Colors.EmblemCobaltBlue,
  },
  {
    id: 'bag',
    label: 'Work',
    Icon: OfficeBagIcon,
    defaultColor: Colors.AccentYellow,
  },
  {
    id: 'heart',
    label: 'Life',
    Icon: HeartEmblemIcon,
    defaultColor: Colors.AccentGreen,
  },
  {
    id: 'sparkles',
    label: 'Focus',
    Icon: SparkleEmblemIcon,
    defaultColor: Colors.CategoryOrangeAccent,
  },
  {
    id: 'flame',
    label: 'Habit',
    Icon: FlameEmblemIcon,
    defaultColor: Colors.CategoryRedAccent,
  },
];

export interface CustomCategoryCreated {
  id: string;
  label: string;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
  accentColor: string;
  checkColor: string;
  badgeVariant: BadgeVariant;
  Icon: React.ComponentType<any>;
}

export interface CustomCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateCategory: (category: CustomCategoryCreated) => void;
}

export const CustomCategoryModal: React.FC<CustomCategoryModalProps> =
  React.memo(({ visible, onClose, onCreateCategory }) => {
    const { isDarkMode } = useAppTheme();
    const [newCatName, setNewCatName] = useState('');
    const [newCatPresetIndex, setNewCatPresetIndex] = useState(0);
    const [selectedIconIndex, setSelectedIconIndex] = useState(0);

    const handleCreate = () => {
      const cleanName = newCatName.trim();
      if (!cleanName) {
        Toast.show({
          type: 'error',
          text1: 'Category Name Required',
          text2: 'Please give your custom category a title.',
        });
        return;
      }

      const preset = CATEGORY_PRESETS[newCatPresetIndex];
      const iconDef = CATEGORY_ICON_CHOICES[selectedIconIndex];

      const newCategory: CustomCategoryCreated = {
        id: `custom_${Date.now()}`,
        label: cleanName,
        bgColor: preset.bgColor,
        borderColor: preset.borderColor,
        shadowColor: preset.shadowColor,
        accentColor: preset.accentColor,
        checkColor: preset.checkColor,
        badgeVariant: preset.badgeVariant,
        Icon: iconDef.Icon,
      };

      onCreateCategory(newCategory);
      setNewCatName('');
      onClose();
    };

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View
                style={[
                  styles.modalCard,
                  isDarkMode && {
                    backgroundColor: Colors.DarkCardBackground,
                    borderTopColor: Colors.CarbonSlate,
                    borderLeftColor: Colors.CarbonSlate,
                    borderRightColor: Colors.CarbonSlate,
                  },
                ]}
              >
                <View
                  style={[
                    styles.modalDragHandle,
                    isDarkMode && { backgroundColor: Colors.DarkBorder },
                  ]}
                />

                {/* Header Crest Badge & Title */}
                <View style={styles.modalHeaderRow}>
                  <View style={styles.modalHeaderLeft}>
                    <Badge
                      variant="yellow"
                      size="sm"
                      label="CATEGORY STUDIO"
                      icon={
                        <Sparkles size={ResponsivePixels.size10} color={Colors.HabitBurnishedAmber} />
                      }
                    />
                    <Text
                      style={[
                        styles.modalHeading,
                        isDarkMode && { color: Colors.PureWhite },
                      ]}
                    >
                      Craft Category
                    </Text>
                    <Text
                      style={[
                        styles.modalSubtitle,
                        isDarkMode && { color: Colors.SteelMist },
                      ]}
                    >
                      Curate an iconic visual signature for your focus
                    </Text>
                  </View>
                </View>

                {/* Live Preview Card */}
                <View style={styles.showcaseOuterWrap}>
                  <View
                    style={[
                      styles.categoryCardExact,
                      {
                        backgroundColor:
                          CATEGORY_PRESETS[newCatPresetIndex].bgColor,
                        borderColor:
                          CATEGORY_PRESETS[newCatPresetIndex].borderColor,
                        width: categoryCardWidth,
                        shadowColor:
                          CATEGORY_PRESETS[newCatPresetIndex].shadowColor,
                      },
                    ]}
                  >
                    <View style={styles.categoryCardTop}>
                      <View
                        style={[
                          styles.categoryIconWrap,
                          {
                            borderColor:
                              CATEGORY_PRESETS[newCatPresetIndex].borderColor,
                            shadowColor:
                              CATEGORY_PRESETS[newCatPresetIndex].shadowColor,
                          },
                        ]}
                      >
                        {React.createElement(
                          CATEGORY_ICON_CHOICES[selectedIconIndex].Icon,
                          {
                            width: ResponsivePixels.size16,
                            height: ResponsivePixels.size16,
                            size: ResponsivePixels.size16,
                            color:
                              CATEGORY_PRESETS[newCatPresetIndex].checkColor,
                          },
                        )}
                      </View>

                      <View
                        style={[
                          styles.categoryFloatingCheckbox,
                          {
                            borderColor:
                              CATEGORY_PRESETS[newCatPresetIndex].accentColor,
                            backgroundColor:
                              CATEGORY_PRESETS[newCatPresetIndex].bgColor,
                            shadowColor:
                              CATEGORY_PRESETS[newCatPresetIndex].shadowColor,
                          },
                        ]}
                      >
                        <Check
                          size={ResponsivePixels.size12}
                          color={CATEGORY_PRESETS[newCatPresetIndex].checkColor}
                          strokeWidth={3}
                        />
                      </View>
                    </View>

                    <View style={styles.categoryCardBottom}>
                      <Text
                        style={[
                          styles.categoryCardLabelExact,
                          {
                            color:
                              CATEGORY_PRESETS[newCatPresetIndex].checkColor,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {newCatName.trim() || 'Preview'}
                      </Text>
                      <Text style={styles.categoryCardCountExact}>
                        +0 items
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.categoryBottomIndicator,
                        {
                          backgroundColor:
                            CATEGORY_PRESETS[newCatPresetIndex].accentColor,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* Name Input */}
                <View style={styles.inputSection}>
                  <Text
                    style={[
                      styles.inputLabel,
                      isDarkMode && { color: Colors.SteelMist },
                    ]}
                  >
                    CATEGORY LABEL
                  </Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      isDarkMode && {
                        backgroundColor: Colors.DarkSurfaceAlt,
                        borderColor: Colors.CarbonSlate,
                        color: Colors.PureWhite,
                      },
                    ]}
                    placeholder="e.g. Finance, Wellness, Client X"
                    placeholderTextColor={Colors.SteelMist}
                    value={newCatName}
                    onChangeText={setNewCatName}
                    maxLength={24}
                    autoFocus={false}
                  />
                </View>

                {/* Icon Selection */}
                <View style={styles.inputSection}>
                  <Text
                    style={[
                      styles.inputLabel,
                      isDarkMode && { color: Colors.SteelMist },
                    ]}
                  >
                    CHOOSE ICON
                  </Text>
                  <View style={styles.iconChoiceRow}>
                    {CATEGORY_ICON_CHOICES.map((choice, idx) => {
                      const isSel = idx === selectedIconIndex;
                      const IconComp = choice.Icon;
                      return (
                        <TouchableOpacity
                          key={choice.id}
                          activeOpacity={0.8}
                          onPress={() => setSelectedIconIndex(idx)}
                          style={[
                            styles.iconChoiceBtn,
                            isDarkMode && {
                              backgroundColor: Colors.DarkSurfaceAlt,
                              borderColor: Colors.CarbonSlate,
                            },
                            isSel && styles.iconChoiceBtnActive,
                          ]}
                          accessibilityLabel={choice.label}
                        >
                          <IconComp
                            size={ResponsivePixels.size18}
                            color={
                              isSel
                                ? Colors.MidnightCharcoal
                                : isDarkMode
                                ? Colors.SteelMist
                                : Colors.Grey
                            }
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Color Palette Presets */}
                <View style={styles.inputSection}>
                  <Text
                    style={[
                      styles.inputLabel,
                      isDarkMode && { color: Colors.SteelMist },
                    ]}
                  >
                    CHOOSE COLOR HARMONY
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.presetScrollContent}
                  >
                    {CATEGORY_PRESETS.map((preset, idx) => {
                      const isSel = idx === newCatPresetIndex;
                      return (
                        <TouchableOpacity
                          key={preset.name}
                          activeOpacity={0.8}
                          onPress={() => setNewCatPresetIndex(idx)}
                          style={[
                            styles.presetSwatch,
                            {
                              backgroundColor: preset.bgColor,
                              borderColor: isSel
                                ? preset.checkColor
                                : preset.borderColor,
                            },
                          ]}
                        >
                          {isSel && (
                            <Check
                              size={ResponsivePixels.size12}
                              color={preset.checkColor}
                              strokeWidth={3}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* Actions */}
                <View style={styles.modalActionRow}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[
                      styles.cancelBtn,
                      isDarkMode && {
                        backgroundColor: Colors.DarkCheckboxUnchecked,
                      },
                    ]}
                    onPress={onClose}
                  >
                    <Text
                      style={[
                        styles.cancelBtnText,
                        isDarkMode && { color: Colors.SteelMist },
                      ]}
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.createBtn}
                    onPress={handleCreate}
                  >
                    <Plus
                      size={ResponsivePixels.size16}
                      color={Colors.PureWhite}
                      strokeWidth={2.4}
                    />
                    <Text style={styles.createBtnText}>Create Category</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  });

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: withAlpha(Colors.DarkBackground, 0.45),
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.CreamSurfaceAlt,
    borderTopLeftRadius: ResponsivePixels.size32,
    borderTopRightRadius: ResponsivePixels.size32,
    paddingTop: ResponsivePixels.size12,
    paddingBottom: ResponsivePixels.size32,
    paddingHorizontal: ResponsivePixels.size20,
    borderWidth: 1.5,
    borderTopColor: Colors.PureWhite,
    borderLeftColor: Colors.CreamBorderSubtle,
    borderRightColor: Colors.CreamBorderSubtle,
    borderBottomWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: Colors.DarkBackground,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.16,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalDragHandle: {
    width: ResponsivePixels.size38,
    height: ResponsivePixels.size4,
    borderRadius: ResponsivePixels.size2,
    backgroundColor: Colors.WarmDragHandle,
    alignSelf: 'center',
    marginBottom: ResponsivePixels.size12,
  },
  modalHeaderRow: {
    marginBottom: ResponsivePixels.size12,
  },
  modalHeaderLeft: {
    gap: ResponsivePixels.size3,
  },
  modalHeading: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size20,
    color: Colors.DarkBackground,
    marginTop: ResponsivePixels.size4,
  },
  modalSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12,
    color: Colors.Grey,
  },
  showcaseOuterWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ResponsivePixels.size8,
    marginBottom: ResponsivePixels.size14,
  },
  categoryCardExact: {
    height: ResponsivePixels.size104,
    borderRadius: ResponsivePixels.size20,
    borderTopRightRadius: ResponsivePixels.size36,
    padding: ResponsivePixels.size10,
    paddingBottom: ResponsivePixels.size12,
    borderWidth: 1.5,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  categoryCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  categoryIconWrap: {
    width: ResponsivePixels.size30,
    height: ResponsivePixels.size30,
    borderRadius: ResponsivePixels.size15,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryFloatingCheckbox: {
    width: ResponsivePixels.size20,
    height: ResponsivePixels.size20,
    borderRadius: ResponsivePixels.size10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCardBottom: {
    gap: ResponsivePixels.size1,
  },
  categoryCardLabelExact: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size13,
  },
  categoryCardCountExact: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size10,
    color: Colors.MutedNeutralCount,
  },
  categoryBottomIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: ResponsivePixels.size3,
    borderTopLeftRadius: ResponsivePixels.size3,
    borderTopRightRadius: ResponsivePixels.size3,
  },
  inputSection: {
    marginBottom: ResponsivePixels.size14,
  },
  inputLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size10,
    color: Colors.Grey,
    letterSpacing: 0.8,
    marginBottom: ResponsivePixels.size6,
  },
  textInput: {
    backgroundColor: Colors.PureWhite,
    borderRadius: ResponsivePixels.size14,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    paddingHorizontal: ResponsivePixels.size14,
    paddingVertical: ResponsivePixels.size10,
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size14,
    color: Colors.DarkBackground,
  },
  iconChoiceRow: {
    flexDirection: 'row',
    gap: ResponsivePixels.size10,
  },
  iconChoiceBtn: {
    width: ResponsivePixels.size42,
    height: ResponsivePixels.size42,
    borderRadius: ResponsivePixels.size21,
    backgroundColor: Colors.PureWhite,
    borderWidth: 1.5,
    borderColor: Colors.RingBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChoiceBtnActive: {
    borderColor: Colors.MidnightCharcoal,
    backgroundColor: Colors.BadgeYellowBg,
  },
  presetScrollContent: {
    gap: ResponsivePixels.size10,
    paddingVertical: ResponsivePixels.size2,
  },
  presetSwatch: {
    width: ResponsivePixels.size36,
    height: ResponsivePixels.size36,
    borderRadius: ResponsivePixels.size18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: ResponsivePixels.size10,
    marginTop: ResponsivePixels.size8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size24,
    borderWidth: 1.5,
    borderColor: Colors.WarmDragHandle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size13,
    color: Colors.Grey,
  },
  createBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.DarkElevatedNero,
    paddingVertical: ResponsivePixels.size12,
    borderRadius: ResponsivePixels.size24,
    gap: ResponsivePixels.size6,
    borderWidth: 1,
    borderColor: Colors.DarkBevelTop,
    borderBottomWidth: 3,
    borderBottomColor: Colors.DarkModalBtnBottom,
  },
  createBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size13,
    color: Colors.PureWhite,
  },
});

export default CustomCategoryModal;
