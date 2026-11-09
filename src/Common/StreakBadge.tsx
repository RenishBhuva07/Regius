import React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Flame } from 'lucide-react-native';
import { Badge, BadgeSize, BadgeVariant } from './Badge';

export interface StreakBadgeProps {
  streak?: number;
  count?: number;
  active?: boolean;
  size?: BadgeSize;
  variant?: BadgeVariant;
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  activeOpacity?: number;
  uppercase?: boolean;
}

// Universal 3D Tactile Streak Badge with specular highlight and fire glow
export const StreakBadge: React.FC<StreakBadgeProps> = ({
  streak,
  count,
  active,
  size = 'sm',
  variant,
  iconSize,
  style,
  textStyle,
  onPress,
  activeOpacity = 0.75,
  uppercase = true,
}) => {
  const streakCount = streak ?? count ?? 0;
  const isActive = active !== undefined ? active : streakCount > 0;

  const defaultIconSize = size === 'sm' ? 10.5 : size === 'lg' ? 14 : 12;
  const effectiveIconSize = iconSize ?? defaultIconSize;

  const flameColor = isActive ? '#E65100' : '#8E8E93';
  const badgeVariant: BadgeVariant =
    variant ?? (isActive ? 'orange' : 'neutral');

  return (
    <Badge
      variant={badgeVariant}
      size={size}
      icon={
        <Flame size={effectiveIconSize} color={flameColor} strokeWidth={2.4} />
      }
      label={`${streakCount}d streak`}
      uppercase={uppercase}
      onPress={onPress}
      activeOpacity={activeOpacity}
      style={style}
      textStyle={[!isActive && { color: '#8E8E93' }, textStyle]}
    />
  );
};

export default StreakBadge;
