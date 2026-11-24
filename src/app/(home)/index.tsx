import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { Page } from '@/components/layout/page';
import { NotificationsBell } from '@/components/notifications/notifications-bell';
import { FilterPills } from '@/components/session/filter-pills';
import { FilterSheet } from '@/components/session/filter-sheet';
import { SessionCard } from '@/components/session/session-card';
import { CategoryTabs } from '@/components/ui/category-tabs';
import {
  EMPTY_FILTERS,
  applySessionFilters,
  countActiveFilters,
  hasActiveFilters,
  type SessionFilters,
} from '@/data/session-filters';
import { useSessions } from '@/data/session-store';
import { SESSION_CATEGORIES, type SessionCategory } from '@/data/sessions';
import { useTheme } from '@/hooks/use-theme';

export default function SessionsScreen() {
  const theme = useTheme();
  const [category, setCategory] = useState<SessionCategory>('All');
  const [filters, setFilters] = useState<SessionFilters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const now = new Date();
  const allSessions = useSessions().filter((session) => session.endsAt >= now);
  const filtering = hasActiveFilters(filters);

  const inCategory =
    category === 'All'
      ? allSessions
      : allSessions.filter((session) => session.sport === category);
  const sessions = applySessionFilters(inCategory, filters);

  return (
    <Page title="Sessions" headerRight={<NotificationsBell />}>
      <CategoryTabs
        categories={SESSION_CATEGORIES}
        selected={category}
        onSelect={setCategory}
        onFilterPress={() => setFiltersOpen(true)}
        filterCount={countActiveFilters(filters)}
      />
      <FilterPills filters={filters} onChange={setFilters} />
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}>
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
        {sessions.length === 0 && (
          <Text style={[styles.empty, { color: theme.textSecondary }]}>
            {filtering
              ? 'No sessions match your filters.'
              : `No ${category.toLowerCase()} sessions yet.`}
          </Text>
        )}
      </ScrollView>

      <FilterSheet
        visible={filtersOpen}
        filters={filters}
        sessions={allSessions}
        onClose={() => setFiltersOpen(false)}
        onApply={(next) => {
          setFilters(next);
          setFiltersOpen(false);
        }}
      />
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
