import { Image } from 'expo-image';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { SPORT_EMOJIS } from '@/data/sessions';
import { useTheme } from '@/hooks/use-theme';
import type { Session } from '@/types/session';

type CornerStyle = Pick<
  ViewStyle,
  | 'borderRadius'
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderBottomLeftRadius'
  | 'borderBottomRightRadius'
>;

type SessionImageProps = {
  image: Session['image'];
  sport: Session['sport'];
  style?: StyleProp<CornerStyle>;
};

// Session photo, or the sport's emoji if there isn't one
export function SessionImage({ image, sport, style }: SessionImageProps) {
  const theme = useTheme();

  if (image == null) {
    return (
      <View style={[styles.image, styles.empty, { borderColor: theme.border }, style]}>
        <Text style={styles.emoji}>{SPORT_EMOJIS[sport]}</Text>
      </View>
    );
  }

  return (
    <Image
      source={image}
      style={[styles.image, style]}
      contentFit="cover"
      accessibilityIgnoresInvertColors
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 256 / 143.8926,
  },
  empty: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
  },
});
