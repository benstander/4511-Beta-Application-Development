import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { InformationCircleIcon } from 'react-native-heroicons/outline';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { SESSION_TYPES, type SessionType } from '@/types/session';

const DESCRIPTIONS: Record<SessionType, string> = {
  Public: 'Anyone using the app can find this session and join it.',
  Solo: "Just you. Plan your own workout without it showing up for anyone else.",
  'Invite-only': 'Only the people you invite can see the session and join it.',
  'Friends-only': "All your friends can see the session and join it, even if you didn't invite them.",
};

// Info button that explains the session types
export function SessionTypeInfo() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        role="button"
        accessibilityLabel="What do the session types mean?"
        hitSlop={10}
        style={({ pressed }) => pressed && styles.pressed}>
        <InformationCircleIcon size={22} color={theme.text} />
      </Pressable>

      <BottomSheet
        visible={open}
        onClose={() => setOpen(false)}
        header={
          <View style={styles.header}>
            <View style={[styles.grabber, { backgroundColor: theme.buttonSecondaryBorder }]} />
            <Text role="heading" style={[styles.title, { color: theme.text }]}>
              Session types
            </Text>
          </View>
        }>
        <View style={styles.body}>
          {SESSION_TYPES.map((type) => (
            <View key={type} style={styles.section}>
              <Text style={[styles.heading, { color: theme.text }]}>{type}</Text>
              <Text style={[styles.description, { color: theme.textMuted }]}>
                {DESCRIPTIONS[type]}
              </Text>
            </View>
          ))}
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.6,
  },
  header: {
    paddingTop: 12,
    paddingHorizontal: 24,
    gap: 20,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 5,
    borderRadius: 3,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: 24,
    textAlign: 'center',
  },
  body: {
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 20,
  },
  section: {
    gap: 4,
  },
  heading: {
    fontFamily: FontFamily.semiBold,
    fontSize: 18,
  },
  description: {
    fontFamily: FontFamily.medium,
    fontSize: 16,
    lineHeight: 22,
  },
});
