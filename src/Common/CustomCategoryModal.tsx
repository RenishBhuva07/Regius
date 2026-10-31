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
import { Check, Sparkles, Plus, X } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

import { Fonts } from '../Theme/fonts';
import { Colors } from '../Assets/StyleUtilities/Colors';
import { Badge, BadgeVariant } from './Badge';
import {
  PictureEmblemIcon,
  OfficeBagIcon,
  HeartEmblemIcon,
  SparkleEmblemIcon,
  FlameEmblemIcon,
} from './EmblemIcons';

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
    bgColor: '#FFFCEB',
    borderColor: '#FFF5B8',
    shadowColor: '#F5C518',
    accentColor: '#FDD835',
    checkColor: '#D97706',
    badgeVariant: 'yellow',
  },
  {
    name: 'Emerald Mint',
    bgColor: '#EDFDF5',
    borderColor: '#C6FFDD',
    shadowColor: '#52D22E',
    accentColor: '#52D22E',
    checkColor: '#1B9A72',
    badgeVariant: 'green',
  },
  {
    name: 'Lavender Orchid',
    bgColor: '#EFF2FE',
    borderColor: '#D8DBFF',
    shadowColor: '#8383D6',
    accentColor: '#8383D6',
    checkColor: '#7059C8',
    badgeVariant: 'purple',
  },
  {
    name: 'Amber Sunset',
    bgColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    shadowColor: '#FB923C',
    accentColor: '#FB923C',
    checkColor: '#EA580C',
    badgeVariant: 'orange',
  },
  {
    name: 'Crimson Rose',
    bgColor: '#FEF2F2',
    borderColor: '#FEE2E2',
    shadowColor: '#EF4444',
    accentColor: '#EF4444',
    checkColor: '#DC2626',
    badgeVariant: 'red',
  },
  {
    name: 'Ocean Azure',
    bgColor: '#F0F9FF',
    borderColor: '#E0F2FE',
    shadowColor: '#38BDF8',
    accentColor: '#38BDF8',
    checkColor: '#0284C7',
    badgeVariant: 'purple',
  },
  {
    name: 'Rose',
    bgColor: '#FFF1F2',
    borderColor: '#FECDD3',
    shadowColor: '#FB7185',
    accentColor: '#FB7185',
    checkColor: '#E11D48',
    badgeVariant: 'purple',
  },
];

export const CATEGORY_ICON_CHOICES = [
  {
    id: 'picture',
    label: 'Art',
    Icon: PictureEmblemIcon,
    defaultColor: '#6270F0',
  },
  { id: 'bag', label: 'Work', Icon: OfficeBagIcon, defaultColor: '#F5C518' },
  {
    id: 'heart',
    label: 'Life',
    Icon: HeartEmblemIcon,
    defaultColor: '#52D22E',
  },
  {
    id: 'sparkles',
    label: 'Focus',
    Icon: SparkleEmblemIcon,
    defaultColor: '#FB923C',
  },
  {
    id: 'flame',
    label: 'Habit',
    Icon: FlameEmblemIcon,
    defaultColor: '#EF4444',
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
              <View style={styles.modalCard}>
                <View style={styles.modalDragHandle} />

                {/* Header Crest Badge & Title */}
                <View style={styles.modalHeaderRow}>
                  <View style={styles.modalHeaderLeft}>
                    <Badge
                      variant="yellow"
                      size="sm"
                      label="CATEGORY STUDIO"
                      icon={<Sparkles size={10} color="#D97706" />}
                    />
                    <Text style={styles.modalHeading}>Craft Category</Text>
                    <Text style={styles.modalSubtitle}>
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
                            width: 16,
                            height: 16,
                            size: 16,
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
                          size={12}
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
                  <Text style={styles.inputLabel}>CATEGORY LABEL</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Finance, Wellness, Client X"
                    placeholderTextColor="#A3A8B1"
                    value={newCatName}
                    onChangeText={setNewCatName}
                    maxLength={24}
                    autoFocus={false}
                  />
                </View>

                {/* Icon Selection */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>CHOOSE ICON</Text>
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
                            isSel && styles.iconChoiceBtnActive,
                          ]}
                          accessibilityLabel={choice.label}
                        >
                          <IconComp
                            size={18}
                            color={isSel ? '#1F2228' : '#77767B'}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Color Palette Presets */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>CHOOSE COLOR HARMONY</Text>
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
                              size={12}
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
                    style={styles.cancelBtn}
                    onPress={onClose}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.createBtn}
                    onPress={handleCreate}
                  >
                    <Plus size={16} color="#FFFFFF" strokeWidth={2.4} />
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
    backgroundColor: 'rgba(18, 20, 23, 0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FAF8F5',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 12,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderTopColor: '#FFFFFF',
    borderLeftColor: '#F0ECE1',
    borderRightColor: '#F0ECE1',
    borderBottomWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#121417',
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
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DCD6C8',
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeaderRow: {
    marginBottom: 12,
  },
  modalHeaderLeft: {
    gap: 3,
  },
  modalHeading: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 20,
    color: '#121417',
    marginTop: 4,
  },
  modalSubtitle: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    color: '#77767B',
  },
  showcaseOuterWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 14,
  },
  categoryCardExact: {
    height: 104,
    borderRadius: 20,
    borderTopRightRadius: 36,
    padding: 10,
    paddingBottom: 12,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryFloatingCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCardBottom: {
    gap: 1,
  },
  categoryCardLabelExact: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13,
  },
  categoryCardCountExact: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 10,
    color: '#8A8D98',
  },
  categoryBottomIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  inputSection: {
    marginBottom: 14,
  },
  inputLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 10,
    color: '#77767B',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    color: '#121417',
  },
  iconChoiceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  iconChoiceBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8E2D5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChoiceBtnActive: {
    borderColor: '#1F2228',
    backgroundColor: '#FFF8D0',
  },
  presetScrollContent: {
    gap: 10,
    paddingVertical: 2,
  },
  presetSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#DCD6C8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 13,
    color: '#77767B',
  },
  createBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E2028',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 6,
    borderWidth: 1,
    borderColor: '#4A4E5C',
    borderBottomWidth: 3,
    borderBottomColor: '#0E1015',
  },
  createBtnText: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13,
    color: '#FFFFFF',
  },
});

export default CustomCategoryModal;
