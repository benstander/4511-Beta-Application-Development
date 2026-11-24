import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { Page } from '@/components/layout/page';
import { FilterPills } from '@/components/session/filter-pills';
import { FilterSheet } from '@/components/session/filter-sheet';
import { SessionCard } from '@/components/session/session-card';
import { CategoryTabs } from '@/components/ui/category-tabs';
import { EmptyState } from '@/components/ui/empty-state';
import {
  EMPTY_FILTERS,
  applySessionFilters,
  countActiveFilters,
  type SessionFilters,
} from '@/data/session-filters';
import { useMySessions } from '@/data/session-store';

const TABS = ['Going', 'Invited', 'Created', 'History'] as const;
type Tab = (typeof TABS)[number];

const EMPTY: Record<Tab, { message: string; actionLabel: string; href: '/' | '/create' }> = {
  Going: { message: 'Have not joined a session yet.', actionLabel: 'Find a session', href: '/' },
  Invited: { message: 'No invites right now.', actionLabel: 'Find a session', href: '/' },
  Created: {
    message: 'Have not created a session yet.',
    actionLabel: 'Create a session',
    href: '/create',
  },
  History: { message: 'No past sessions yet.', actionLabel: 'Find a session', href: '/' },
};

function isTab(value: unknown): value is Tab {
  return TABS.includes(value as Tab);
}

export default function MySessionsScreen() {
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<Tab>(isTab(tabParam) ? tabParam : 'Going');
  const [lastTabParam, setLastTabParam] = useState(tabParam);
  if (tabParam !== lastTabParam) {
    setLastTabParam(tabParam);
    if (isTab(tabParam)) setTab(tabParam);
  }
  const [filters, setFilters] = useState<SessionFilters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const mySessions = useMySessions();

  const inTab = {
    Going: mySessions.going,
    Invited: mySessions.invited,
    Created: mySessions.created,
    History: mySessions.history,
  }[tab];
  const sessions = applySessionFilters(inTab, filters);
  const filteredOut = inTab.length > 0 && sessions.length === 0;
  const empty = EMPTY[tab];

  return (
    <Page title="My Sessions">
      <CategoryTabs
        categories={TABS}
        selected={tab}
        onSelect={setTab}
        onFilterPress={() => setFiltersOpen(true)}
        filterCount={countActiveFilters(filters)}
      />
      <FilterPills filters={filters} onChange={setFilters} />
      {sessions.length === 0 ? (
        filteredOut ? (
          <EmptyState
            message="No sessions match your filters."
            actionLabel="Clear filters"
            onAction={() => setFilters(EMPTY_FILTERS)}
          />
        ) : (
          <EmptyState
            message={empty.message}
            actionLabel={empty.actionLabel}
            onAction={() => router.navigate(empty.href)}
          />
        )
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}>
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              detailPathname="/my-sessions/session/[id]"
            />
          ))}
        </ScrollView>
      )}

      <FilterSheet
        visible={filtersOpen}
        filters={filters}
        sessions={[
          ...mySessions.going,
          ...mySessions.invited,
          ...mySessions.created,
          ...mySessions.history,
        ]}
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
});
