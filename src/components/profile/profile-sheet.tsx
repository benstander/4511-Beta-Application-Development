import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ProfileIdentity } from '@/components/profile/profile-identity';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
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
  const [confirmingRemove, setConfirmingRemove] = useState(false);

  const close = () => {
    setConfirmingRemove(false);
    onClose();
  };

  const confirmRemove = () => {
    removeFriend(person.id);
    setConfirmingRemove(false);
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={close}
      header={
        <View style={styles.header}>
          <View style={[styles.grabber, { backgroundColor: theme.buttonSecondaryBorder }]} />
        </View>
      }>
      <View style={styles.body}>
        <ProfileIdentity
          person={person}
          title={confirmingRemove ? `Remove ${person.name}?` : undefined}
        />
        {/* Can't add yourself as a friend */}
        {!isYou && confirmingRemove && (
          <View style={styles.confirmRow}>
            <Button
              label="Cancel"
              variant="secondary"
              size="medium"
              flex
              onPress={() => setConfirmingRemove(false)}
            />
            <Button label="Confirm" size="medium" flex onPress={confirmRemove} />
          </View>
        )}
        {!isYou && !confirmingRemove && (
          <Button
            label={friend ? 'Remove friend' : 'Add friend'}
            variant="secondary"
            onPress={() => (friend ? setConfirmingRemove(true) : addFriend(person.id))}
          />
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
  confirmRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
