import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { Page } from '@/components/layout/page';
import { SessionCard } from '@/components/session/session-card';
import { CategoryTabs } from '@/components/ui/category-tabs';
import { useSessions } from '@/data/session-store';
import { SESSION_CATEGORIES, type SessionCategory } from '@/data/sessions';
import { useTheme } from '@/hooks/use-theme';

export default function SessionsScreen() {
  const theme = useTheme();
  const [category, setCategory] = useState<SessionCategory>('All');
  const allSessions = useSessions();

  const sessions =
    category === 'All'
      ? allSessions
      : allSessions.filter((session) => session.sport === category);

  return (
    <Page title="Sessions">
      <CategoryTabs categories={SESSION_CATEGORIES} selected={category} onSelect={setCategory} />
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}>
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
        {sessions.length === 0 && (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            {`No ${category.toLowerCase()} sessions yet.`}
          </Text>
        )}
      </ScrollView>
    </Page>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    gap: 24,
    paddingTop: 4,
  },
  empty: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 500,
    textAlign: 'center',
    paddingTop: 24,
  },
});
