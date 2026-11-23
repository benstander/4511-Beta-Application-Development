import { type StyleProp, View, type ViewStyle } from 'react-native';

import type { Person } from '@/types/session';

type AvatarProps = {
  person: Pick<Person, 'avatarColor'>;
  size: number;
  style?: StyleProp<ViewStyle>;
};

// Coloured circle for a person
export function Avatar({ person, size, style }: AvatarProps) {
  return (
    <View
      style={[
        { width: size, height: size, borderRadius: size / 2, backgroundColor: person.avatarColor },
        style,
      ]}
    />
  );
}
