import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProfileIdentity } from '@/components/profile/profile-identity';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { FontFamily } from '@/constants/theme';
import { addFriend, isFriend, removeFriend, useFriends } from '@/data/friends-store';
import { CURRENT_USER } from '@/data/people';
import { useTheme } from '@/hooks/use-theme';
import type { Person } from '@/types/session';

type ProfileSheetProps = {
  person: Person;
  visible: boolean;
  onClose: () => void;
};

// Popup with someone's profile
export function ProfileSheet({ person, visible, onClose }: ProfileSheetProps) {
  const theme = useTheme();
  const friends = useFriends();
  const isYou = person.id === CURRENT_USER.id;
  const friend = isFriend(friends, person.id);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      header={
        <View style={styles.header}>
          <View style={[styles.grabber, { backgroundColor: theme.buttonSecondaryBorder }]} />
        </View>
      }>
      <View style={styles.body}>
        <ProfileIdentity person={person} />
        {/* Can't add yourself as a friend */}
        {!isYou && (
          <Pressable
            onPress={() => (friend ? removeFriend(person.id) : addFriend(person.id))}
            role="button"
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: theme.backgroundElement },
              pressed && styles.pressed,
            ]}>
            <Text style={[styles.cardText, { color: theme.text }]}>
              {friend ? 'Remove friend' : 'Add friend'}
            </Text>
          </Pressable>
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 40,
  },
  card: {
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  cardText: {
    fontFamily: FontFamily.medium,
    fontSize: 18,
  },
});
