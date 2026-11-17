import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PhotoFieldProps = {
  uri: string | null;
  onChange: (uri: string | null) => void;
};

// "Add photo" box, or the picked photo with an x to remove it
export function PhotoField({ uri, onChange }: PhotoFieldProps) {
  const theme = useTheme();

  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  };

  if (uri) {
    return (
      <View>
        <Pressable
          onPress={pick}
          role="button"
          accessibilityLabel="Change cover photo"
          style={({ pressed }) => pressed && styles.pressed}>
          <Image source={{ uri }} style={styles.photo} contentFit="cover" />
        </Pressable>
        <Pressable
          onPress={() => onChange(null)}
          role="button"
          accessibilityLabel="Remove cover photo"
          hitSlop={8}
          style={({ pressed }) => [
            styles.remove,
            { backgroundColor: theme.iconButton, borderColor: theme.iconButtonBorder },
            pressed && styles.pressed,
          ]}>
          <Image
            source={require('@/assets/icons/x-mark.svg')}
            style={styles.removeIcon}
            tintColor={theme.text}
          />
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      onPress={pick}
      role="button"
      accessibilityLabel="Add cover photo"
      style={({ pressed }) => [styles.empty, { borderColor: theme.text }, pressed && styles.pressed]}>
      <Image source={require('@/assets/icons/plus.svg')} style={styles.plus} tintColor={theme.text} />
      <Text style={[styles.text, { color: theme.text }]}>Add photo</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  empty: {
    height: 128,
    borderWidth: 1.5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  plus: {
    width: 20,
    height: 20,
  },
  text: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
  },
  photo: {
    height: 208,
    borderRadius: 12,
  },
  remove: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    width: 18,
    height: 18,
  },
  pressed: {
    opacity: 0.8,
  },
});
