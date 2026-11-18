import { StyleSheet, Text, View } from 'react-native';

import { FontFamily, Palette, SessionLevelColors, type SessionLevel } from '@/constants/theme';

const LEVEL_LABELS: Record<SessionLevel, string> = {
  social: 'Social',
  competitive: 'Competitive',
  beginner: 'Beginner',
};

type LevelBadgeProps = {
  level: SessionLevel;
  size?: 'small' | 'large';
};

export function LevelBadge({ level, size = 'small' }: LevelBadgeProps) {
  return (
    <View
      style={[styles.badge, styles[size], { backgroundColor: SessionLevelColors[level] }]}>
      <Text style={[styles.text, size === 'large' ? styles.textLarge : styles.textSmall]}>
        {LEVEL_LABELS[level]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    height: 24,
    paddingHorizontal: 10,
  },
  large: {
    height: 32,
    paddingHorizontal: 12,
  },
  text: {
    fontFamily: FontFamily.semiBold,
    color: Palette.onColor,
  },
  textSmall: {
    fontSize: 12,
  },
  textLarge: {
    fontSize: 14,
  },
});
