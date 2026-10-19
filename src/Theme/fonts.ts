import { Platform } from 'react-native';

export const Fonts = {
    ranade: {
        regular: 'Ranade-Regular',
        medium: 'Ranade-Medium',
        semiBold: 'Ranade-SemiBold',
        bold: 'Ranade-Bold',
    },
    poppins: {
        regular: 'Poppins-Regular',
        medium: 'Poppins-Medium',
        semiBold: 'Poppins-SemiBold',
        bold: 'Poppins-Bold',
    },
    transcity: Platform.select({
        ios: 'Transcity',
        android: 'Transcity Demo',
        default: 'Transcity',
    }),
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
};