import { Platform } from 'react-native';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';
import { Colors, withAlpha } from '../Assets/StyleUtilities/Colors';
import { Fonts } from './fonts';

export const Typography = {
  // Ranade fonts

  // Display Large · 36 (Splash Brand)
  displayLargeRanadeBold: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size36,
    lineHeight: ResponsivePixels.size44,
  },

  // H1 · 26
  h1RanadeBold: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size26,
    lineHeight: ResponsivePixels.size28,
  },

  // Body Large  ·  16
  bodyLargeRanadeRegular: {
    fontFamily: Fonts.ranade.regular,
    fontSize: ResponsivePixels.size16,
    lineHeight: ResponsivePixels.size24,
  },

  // Body Medium  ·  14
  bodyMediumRanadeBold: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size14,
    lineHeight: ResponsivePixels.size20,
  },
  bodyMediumRanadeMedium: {
    fontFamily: Fonts.ranade.medium,
    fontSize: ResponsivePixels.size14,
    lineHeight: ResponsivePixels.size20,
  },
  bodyMediumRanadeRegular: {
    fontFamily: Fonts.ranade.regular,
    fontSize: ResponsivePixels.size14,
    lineHeight: ResponsivePixels.size20,
  },

  // Body Small  ·  10
  bodySmallRanadeBold: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size10,
    lineHeight: ResponsivePixels.size16,
  },

  // Display  ·  20  (between H1 and Body Large — no standard bucket)
  displayRanadeBold: {
    fontFamily: Fonts.ranade.bold,
    fontSize: ResponsivePixels.size20,
    lineHeight: ResponsivePixels.size25,
  },

  // Poppins fonts
  // H5 · 20
  h5SemiBold: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size20,
    lineHeight: ResponsivePixels.size25,
  },

  // H6  ·  18
  h6PoppinsSemiBold: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size18,
    lineHeight: ResponsivePixels.size23,
  },
  h6Bold: {
    fontFamily: Fonts.poppins.bold,
    fontSize: ResponsivePixels.size18,
    lineHeight: ResponsivePixels.size23,
  },

  // Body Large  ·  16
  bodyLargePoppinsSemiBold: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size16,
    lineHeight: ResponsivePixels.size24,
  },
  bodyLargePoppinsMedium: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size16,
    lineHeight: ResponsivePixels.size24,
  },
  bodyLargePoppinsRegular: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size16,
    lineHeight: ResponsivePixels.size24,
  },
  bodyLargePoppinsRegularLoose: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size16,
    lineHeight: ResponsivePixels.size24,
  },
  bodyLargePoppinsRegularCompact: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size16,
    lineHeight: ResponsivePixels.size18,
  },

  // Body Medium  ·  14
  bodyMediumPoppinsSemiBold: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size14,
    lineHeight: ResponsivePixels.size20,
  },
  bodyMediumSemiBold: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size14,
    lineHeight: ResponsivePixels.size20,
  },
  bodyMediumPoppinsMedium: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size14,
    lineHeight: ResponsivePixels.size20,
  },
  bodyMediumMedium: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size14,
    lineHeight: ResponsivePixels.size20,
  },
  bodyMediumPoppinsMediumLoose: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size14,
    lineHeight: ResponsivePixels.size20,
  },
  bodyMediumPoppinsRegular: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size14,
    lineHeight: ResponsivePixels.size20,
  },

  // Body Small  ·  13
  bodySmallPoppinsMediumLoose: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size13,
    lineHeight: ResponsivePixels.size27,
  },

  // Body Small  ·  12
  bodySmallPoppinsSemiBold: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size12,
    lineHeight: ResponsivePixels.size18,
  },
  bodySmallPoppinsMedium: {
    fontFamily: Fonts.poppins.medium,
    fontSize: ResponsivePixels.size12,
    lineHeight: ResponsivePixels.size18,
  },
  bodySmallPoppinsRegular: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12,
    lineHeight: ResponsivePixels.size18,
  },
  bodySmallPoppinsRegularLoose: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size12,
    lineHeight: ResponsivePixels.size18,
  },

  // Body Super Small  ·  11
  bodySuperSmallPoppinsRegularLoose: {
    fontFamily: Fonts.poppins.regular,
    fontSize: ResponsivePixels.size11,
    lineHeight: ResponsivePixels.size16_5,
  },
  bodySuperSmallPoppinsSemiBoldLoose: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: ResponsivePixels.size11,
    lineHeight: ResponsivePixels.size16_5,
  },

  // Transcity (Brand logo font)
  brandLogoTranscity: {
    fontFamily: Fonts.transcity,
  },
};

export const ShadowStyles = {
  shadow: {
    shadowColor:
      Platform.OS === 'android'
        ? Colors.FogGrey
        : withAlpha(Colors.PureBlack, 0.07),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 7,
  },
};
