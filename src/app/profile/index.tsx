import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Page } from '@/components/layout/page';
import { ProfileIdentity } from '@/components/profile/profile-identity';
import { FontFamily } from '@/constants/theme';
import { useFriends } from '@/data/friends-store';
import { CURRENT_USER } from '@/data/people';
import { useTheme } from '@/hooks/use-theme';

// Profile tab. Only Friends works for now
export default function ProfileScreen() {
  const theme = useTheme();
  const friends = useFriends();

  return (
    <Page title="Profile">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileIdentity person={CURRENT_USER} />

        <View style={styles.cards}>
          <View style={styles.slot}>
            <View style={[styles.card, { borderColor: theme.text }]}>
              <Text style={[styles.cardText, { color: theme.text }]}>Edit profile</Text>
            </View>
          </View>
          <View style={styles.slot}>
            <Pressable
              onPress={() => router.push('/profile/friends')}
              role="button"
              accessibilityLabel={`Friends, ${friends.length}`}
              style={({ pressed }) => [
                styles.card,
                { borderColor: theme.text },
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.cardText, { color: theme.text }]}>Friends</Text>
            </Pressable>
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
  card: {
    height: 56,
    borderWidth: 1.5,
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
