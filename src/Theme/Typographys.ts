import { Fonts } from './fonts';

export const Typography = {
  // Ranade fonts

  // Display Large · 36 (Splash Brand)
  displayLargeRanadeBold: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 36,
    lineHeight: 44,
  },

  // H1 · 26
  h1RanadeBold: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 26,
    lineHeight: 28,
  },

  // Body Large  ·  16
  bodyLargeRanadeRegular: {
    fontFamily: Fonts.ranade.regular,
    fontSize: 16,
    lineHeight: 24,
  },

  // Body Medium  ·  14
  bodyMediumRanadeBold: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyMediumRanadeMedium: {
    fontFamily: Fonts.ranade.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyMediumRanadeRegular: {
    fontFamily: Fonts.ranade.regular,
    fontSize: 14,
    lineHeight: 20,
  },

  // Body Small  ·  10
  bodySmallRanadeBold: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 10,
    lineHeight: 16,
  },

  // Display  ·  20  (between H1 and Body Large — no standard bucket)
  displayRanadeBold: {
    fontFamily: Fonts.ranade.bold,
    fontSize: 20,
    lineHeight: 25,
  },

  // Poppins fonts
  // H5 · 20
  h5SemiBold: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 20,
    lineHeight: 25,
  },

  // H6  ·  18
  h6PoppinsSemiBold: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 18,
    lineHeight: 23,
  },
  h6Bold: {
    fontFamily: Fonts.poppins.bold,
    fontSize: 18,
    lineHeight: 23,
  },

  // Body Large  ·  16
  bodyLargePoppinsSemiBold: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyLargePoppinsMedium: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyLargePoppinsRegular: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyLargePoppinsRegularLoose: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyLargePoppinsRegularCompact: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 16,
    lineHeight: 18,
  },

  // Body Medium  ·  14
  bodyMediumPoppinsSemiBold: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyMediumSemiBold: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyMediumPoppinsMedium: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyMediumMedium: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyMediumPoppinsMediumLoose: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  bodyMediumPoppinsRegular: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 14,
    lineHeight: 20,
  },

  // Body Small  ·  13
  bodySmallPoppinsMediumLoose: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 13,
    lineHeight: 27,
  },

  // Body Small  ·  12
  bodySmallPoppinsSemiBold: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 12,
    lineHeight: 18,
  },
  bodySmallPoppinsMedium: {
    fontFamily: Fonts.poppins.medium,
    fontSize: 12,
    lineHeight: 18,
  },
  bodySmallPoppinsRegular: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  bodySmallPoppinsRegularLoose: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 12,
    lineHeight: 18,
  },

  // Body Super Small  ·  11
  bodySuperSmallPoppinsRegularLoose: {
    fontFamily: Fonts.poppins.regular,
    fontSize: 11,
    lineHeight: 16.5,
  },
  bodySuperSmallPoppinsSemiBoldLoose: {
    fontFamily: Fonts.poppins.semiBold,
    fontSize: 11,
    lineHeight: 16.5,
  },

  // Transcity (Brand logo font)
  brandLogoTranscity: {
    fontFamily: Fonts.transcity,
  },
};

import { Platform } from 'react-native';
import { Colors } from '../Assets/StyleUtilities/Colors';

export const ShadowStyles = {
  shadow: {
    shadowColor:
      Platform.OS === 'android' ? Colors.FogGrey : 'rgba(0,0,0,0.07)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 7,
  },
};
