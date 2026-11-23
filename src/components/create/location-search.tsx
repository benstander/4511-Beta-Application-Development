import { Image } from 'expo-image';
import { useEffect, useRef, useState, type ComponentRef } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { SessionMap } from '@/components/session/session-map';
import { fieldBoxStyle } from '@/components/ui/form-field';
import { FontFamily } from '@/constants/theme';
import type { DraftFieldsProps } from '@/data/create-draft';
import { placeLabel, searchPlaces, type Place } from '@/data/places';
import { useTheme } from '@/hooks/use-theme';

type LocationSearchProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSelect: (place: Place) => void;
  picked: boolean;
};

type Results = { query: string; places: Place[] };

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

// Searches real places as you type and shows the top 5
export function LocationSearch({ value, onChangeText, onSelect, picked }: LocationSearchProps) {
  const theme = useTheme();
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<Results>({ query: '', places: [] });

  const query = value.trim();
  const searching = !picked && query.length >= MIN_QUERY_LENGTH;

  useEffect(() => {
    if (!searching) return;
    let stale = false;
    const timer = setTimeout(() => {
      searchPlaces(query)
        // No internet = no results
        .catch(() => [])
        .then((places) => {
          if (!stale) setResults({ query, places });
        });
    }, DEBOUNCE_MS);
    // Cancel the old search if the text changes
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [query, searching]);

  const open = focused && searching;
  const current = results.query === query ? results.places : null;

  const choose = (place: Place) => {
    onSelect(place);
    inputRef.current?.blur();
    Keyboard.dismiss();
  };

  const message = current === null ? 'Searching…' : current.length === 0 ? 'No places found' : null;

  return (
    <View>
      <View style={[fieldBoxStyle, styles.box, { borderColor: theme.text }, open && styles.boxOpen]}>
        <Image
          source={require('@/assets/icons/magnifying-glass.svg')}
          style={styles.icon}
          tintColor={theme.text}
        />
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search for a place"
          placeholderTextColor={theme.text}
          accessibilityLabel="Location"
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="while-editing"
          style={[styles.input, { color: theme.text }]}
        />
      </View>

      {open && (
        <View style={[styles.list, { borderColor: theme.text }]} role="list">
          {message !== null ? (
            <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>
          ) : (
            current?.map((place) => (
              <Pressable
                key={`${place.latitude},${place.longitude}`}
                onPress={() => choose(place)}
                role="button"
                accessibilityLabel={placeLabel(place)}
                style={({ pressed }) => [styles.option, pressed && { backgroundColor: theme.iconButton }]}>
                <Image
                  source={require('@/assets/icons/map-pin.svg')}
                  style={styles.pin}
                  tintColor={theme.text}
                />
                <View style={styles.optionText}>
                  <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
                    {place.name}
                  </Text>
                  {place.area !== '' && (
                    <Text style={[styles.area, { color: theme.textMuted }]} numberOfLines={1}>
                      {place.area}
                    </Text>
                  )}
                </View>
              </Pressable>
            ))
          )}
        </View>
      )}
    </View>
  );
}

// Location search box, with a map once a place is picked
export function LocationField({ draft, onChange }: DraftFieldsProps) {
  const { place } = draft;

  return (
    <View style={styles.field}>
      <LocationSearch
        value={draft.location}
        // Typing again clears the picked place so you have to pick a new one
        onChangeText={(location) => onChange({ location, place: null })}
        onSelect={(picked) => onChange({ place: picked, location: placeLabel(picked) })}
        picked={place !== null}
      />
      {place && (
        <SessionMap
          // New key so the map moves when the place changes
          key={`${place.latitude},${place.longitude}`}
          coordinates={{ latitude: place.latitude, longitude: place.longitude }}
          label={draft.location}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 12,
  },
  box: {
    gap: 12,
  },
  boxOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  icon: {
    width: 18,
    height: 18,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: FontFamily.medium,
    fontSize: 16,
  },
  list: {
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 4,
    gap: 2,
  },
  option: {
    minHeight: 56,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pin: {
    width: 20,
    height: 20,
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: 16,
  },
  area: {
    fontFamily: FontFamily.medium,
    fontSize: 14,
  },
  message: {
    fontFamily: FontFamily.medium,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
});
