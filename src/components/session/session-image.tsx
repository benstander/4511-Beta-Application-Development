import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

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
  style?: StyleProp<CornerStyle>;
};

// Session photo, or a grey box if there isn't one
export function SessionImage({ image, style }: SessionImageProps) {
  const theme = useTheme();

  if (image == null) {
    return (
      <View
        style={[styles.image, { backgroundColor: theme.backgroundSelected }, style]}
        accessibilityLabel="No photo yet"
      />
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
});
