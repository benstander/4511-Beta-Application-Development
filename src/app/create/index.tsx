import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { FontFamily, MaxContentWidth, ScreenPadding, Spacing } from '@/constants/theme';
import { useBottomTabInset } from '@/hooks/use-bottom-tab-inset';
import { useTheme } from '@/hooks/use-theme';

const SPORT_EMOJIS = ['🏋️', '🏃', '⚽', '🏀', '🎾', '🏊', '🚴', '🧗'];

export default function CreateIntroScreen() {
  const theme = useTheme();
  const bottomTabInset = useBottomTabInset();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView
        edges={['top', 'left', 'right']}
        style={[styles.safeArea, { paddingBottom: bottomTabInset + Spacing.three }]}>
        <View style={styles.content}>
          <View style={styles.emojis} accessible={false}>
            {[SPORT_EMOJIS.slice(0, 4), SPORT_EMOJIS.slice(4)].map((row) => (
              <View key={row[0]} style={styles.emojiRow}>
                {row.map((emoji) => (
                  <Text key={emoji} style={styles.emoji}>
                    {emoji}
                  </Text>
                ))}
              </View>
            ))}
          </View>
          <Text role="heading" style={[styles.title, { color: theme.text }]}>
            Host your own session
          </Text>
          <Text style={[styles.subtext, { color: theme.textMuted }]}>
            Get your friends together for a game, a run or a workout. Pick the activity, set a
            time and place, and invite who you want.
          </Text>
          <View style={styles.button}>
            <Button label="Create a session" onPress={() => router.push('/create/details')} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    paddingHorizontal: ScreenPadding,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: Spacing.three,
  },
  emojis: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  emojiRow: {
    flexDirection: 'row',
    gap: 12,
  },
  emoji: {
    fontSize: 40,
    lineHeight: 48,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: 700,
    textAlign: 'center',
  },
  subtext: {
    fontFamily: FontFamily.medium,
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
});
