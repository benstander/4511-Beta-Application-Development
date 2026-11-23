import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { LocationSearch } from '@/components/create/location-search';
import { StepScreen } from '@/components/layout/step-screen';
import { SessionMap } from '@/components/session/session-map';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { updateCreateDraft, useCreateDraft } from '@/data/create-draft';
import { placeLabel } from '@/data/places';

// Step 3: location
export default function CreateWhereScreen() {
  const draft = useCreateDraft();
  const { place } = draft;

  return (
    <StepScreen
      title="Where is your session?"
      showBack
      footer={
        <Button
          label="Describe the session"
          disabled={place === null}
          onPress={() => router.push('/create/describe')}
        />
      }>
      <FormField label="Location">
        <View style={styles.field}>
          <LocationSearch
            value={draft.location}
            // Typing again clears the picked place so you have to pick a new one
            onChangeText={(location) => updateCreateDraft({ location, place: null })}
            onSelect={(picked) => updateCreateDraft({ place: picked, location: placeLabel(picked) })}
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
      </FormField>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 12,
  },
});
