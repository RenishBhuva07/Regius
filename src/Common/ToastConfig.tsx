import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseToastProps } from 'react-native-toast-message';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react-native';
import { Colors } from '../Assets/StyleUtilities/Colors';
import ResponsivePixels from '../Assets/StyleUtilities/ResponsivePixels';
import { Typography } from '../Theme/Typographys';

const BaseToast = ({
  text1,
  text2,
  icon,
  bgColor,
  borderColor,
}: {
  text1?: string;
  text2?: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
}) => (
  <View style={[styles.container, { backgroundColor: bgColor, borderColor: borderColor }]}>
    <View style={styles.iconContainer}>
      {icon}
    </View>
    <View style={styles.textContainer}>
      {text1 && <Text style={styles.title}>{text1}</Text>}
      {text2 && <Text style={styles.message}>{text2}</Text>}
    </View>
  </View>
);

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      bgColor="#F2FDF5"
      borderColor={Colors.Success}
      icon={<CheckCircle2 color={Colors.Success} size={ResponsivePixels.size24} />}
    />
  ),
  error: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      bgColor="#FFF5F5"
      borderColor={Colors.CrimsonPulse}
      icon={<XCircle color={Colors.CrimsonPulse} size={ResponsivePixels.size24} />}
    />
  ),
  info: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      bgColor="#F0F7FF"
      borderColor={Colors.PrimaryBlue}
      icon={<Info color={Colors.PrimaryBlue} size={ResponsivePixels.size24} />}
    />
  ),
  warning: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      bgColor="#FFFBEB"
      borderColor="#F59E0B"
      icon={<AlertCircle color="#F59E0B" size={ResponsivePixels.size24} />}
    />
  ),
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: Colors.DefaultWhite,
    borderRadius: ResponsivePixels.size12,
    padding: ResponsivePixels.size12,
    borderLeftWidth: ResponsivePixels.size6,
    shadowColor: Colors.DefaultBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: ResponsivePixels.size10,
  },
  iconContainer: {
    marginRight: ResponsivePixels.size12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: ResponsivePixels.size16,
    fontFamily: Typography.bodyLargeRanadeRegular?.fontFamily || 'System',
    color: Colors.MidnightInkText,
    marginBottom: ResponsivePixels.size2,
    fontWeight: '600',
  },
  message: {
    fontSize: ResponsivePixels.size14,
    fontFamily: Typography.bodyMediumRanadeRegular?.fontFamily || 'System',
    color: Colors.SlateGraphiteText,
  },
});
