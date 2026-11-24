import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Page } from '@/components/layout/page';
import { ProfileIdentity } from '@/components/profile/profile-identity';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/data/profile-store';

// Profile tab
export default function ProfileScreen() {
  const me = useCurrentUser();

  return (
    <Page title="Profile">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileIdentity person={me} />

        <View style={styles.cards}>
          <View style={styles.slot}>
            <Button
              label="Edit profile"
              variant="secondary"
              onPress={() => router.push('/profile/edit')}
            />
          </View>
          <View style={styles.slot}>
            <Button
              label="Friends"
              variant="secondary"
              onPress={() => router.push('/profile/friends')}
            />
          </View>
        </View>
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 40,
    paddingTop: 16,
  },
  cards: {
    flexDirection: 'row',
    gap: 8,
  },
  slot: {
    flex: 1,
  },
});
