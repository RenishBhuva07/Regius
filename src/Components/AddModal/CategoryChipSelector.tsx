import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { Plus, Check } from 'lucide-react-native';
import { Fonts } from '../../Theme/fonts';
import { BadgeVariant } from '../../Common/Badge';

const { width: screenWidth } = Dimensions.get('window');
const categoryCardWidth = Math.min((screenWidth - 48) / 3, 114);

export interface CategoryItem {
  id: string;
  label: string;
  bgColor: string;
  borderColor: string;
  shadowColor: string;
  accentColor: string;
  checkColor: string;
  badgeVariant?: BadgeVariant;
  Icon: React.ComponentType<any>;
}

export interface CategoryChipSelectorProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  onPressAddCategory: () => void;
  heading?: string;
}

export const CategoryChipSelector: React.FC<CategoryChipSelectorProps> =
  React.memo(
    ({
      categories,
      selectedCategory,
      onSelectCategory,
      onPressAddCategory,
      heading = 'Category',
    }) => {
      return (
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeading}>{heading}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onPressAddCategory}
              style={styles.addCategoryHeaderBtn}
              accessibilityRole="button"
              accessibilityLabel="Add new category"
            >
              <View style={styles.addCategoryIconWrap}>
                <Plus size={11} color="#F5C518" strokeWidth={3} />
              </View>
              <Text style={styles.addCategoryHeaderBtnText}>Add Category</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={item => item.id}
            style={styles.categoryFlatList}
            contentContainerStyle={styles.categoryScrollContainer}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            renderItem={({ item: cat }) => {
              const isSelected = selectedCategory === cat.id;
              const CatIcon = cat.Icon;

              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.85}
                  onPress={() => onSelectCategory(cat.id)}
                  style={[
                    styles.categoryCardExact,
                    {
                      backgroundColor: cat.bgColor,
                      width: categoryCardWidth,
                      shadowColor: cat.shadowColor,
                    },
                    isSelected && [
                      styles.categoryCardExactSelected,
                      {
                        borderColor: cat.borderColor,
                      },
                    ],
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`Select category ${cat.label}`}
                >
                  <View style={styles.categoryCardTop}>
                    <View
                      style={[
                        styles.categoryIconWrap,
                        {
                          borderColor: cat.borderColor,
                          shadowColor: cat.shadowColor,
                        },
                      ]}
                    >
                      <CatIcon width={16} height={16} />
                    </View>
                    {isSelected ? (
                      <View
                        style={[
                          styles.categoryFloatingCheckbox,
                          styles.categoryFloatingCheckboxChecked,
                          {
                            borderColor: cat.accentColor,
                            backgroundColor: cat.bgColor,
                            shadowColor: cat.shadowColor,
                          },
                        ]}
                      >
                        <Check
                          size={12}
                          color={cat.checkColor || cat.accentColor}
                          strokeWidth={3}
                        />
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.categoryFloatingCheckbox,
                          styles.categoryFloatingCheckboxUnchecked,
                          {
                            borderColor: cat.borderColor,
                          },
                        ]}
                      />
                    )}
                  </View>

                  <View style={styles.categoryCardBottom}>
                    <Text
                      style={[
                        styles.categoryCardLabel,
                        isSelected && {
                          color: cat.checkColor || '#121417',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {cat.label}
                    </Text>
                  </View>

                  {isSelected && cat.accentColor ? (
                    <View style={styles.categoryAccentWrap}>
                      <View
                        style={[
                          styles.categoryAccent,
                          { backgroundColor: cat.accentColor },
                        ]}
                      />
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      );
    },
  );

const styles = StyleSheet.create({
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeading: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13.5,
    color: '#121417',
    letterSpacing: -0.2,
  },
  addCategoryHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 20,
    backgroundColor: '#1E2028',
    borderWidth: 1,
    borderColor: '#363944',
  },
  addCategoryIconWrap: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(245, 197, 24, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCategoryHeaderBtnText: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 10.5,
    color: '#F5C518',
    letterSpacing: 0.2,
  },
  categoryFlatList: {
    marginHorizontal: -20,
  },
  categoryScrollContainer: {
    paddingHorizontal: 20,
    gap: 10,
    paddingVertical: 4,
  },
  categoryCardExact: {
    height: 104,
    borderRadius: 20,
    borderTopRightRadius: 36,
    padding: 10,
    paddingBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
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
  categoryCardExactSelected: {
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.28,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
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
  categoryFloatingCheckboxChecked: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 1.5 },
        shadowOpacity: 0.22,
        shadowRadius: 2.5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryFloatingCheckboxUnchecked: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  categoryCardBottom: {
    gap: 1,
  },
  categoryCardLabel: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 13,
    color: '#121417',
  },
  categoryAccentWrap: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    alignItems: 'center',
  },
  categoryAccent: {
    width: 36,
    height: 3.5,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

export default CategoryChipSelector;
