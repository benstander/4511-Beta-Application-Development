import { router } from 'expo-router';

import { SessionSummary } from '@/components/create/session-summary';
import { StepScreen } from '@/components/layout/step-screen';
import { Button } from '@/components/ui/button';
import { useCreateDraft } from '@/data/create-draft';
import { findFriend } from '@/data/people';
import { placeLabel } from '@/data/places';
import { dateFromKey } from '@/utils/date-key';
import { createSession } from '@/data/session-store';
import { SPORT_IMAGES } from '@/data/sessions';

function atMinutes(key: string, minutes: number) {
  const date = dateFromKey(key);
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return date;
}

// Step 6: check everything then create it
export default function CreateSummaryScreen() {
  const draft = useCreateDraft();
  const { type, sport, level, date, startMinutes, endMinutes, place } = draft;
  // Can't skip the earlier steps so these should all be filled in
  if (
    !type ||
    !sport ||
    !level ||
    date === null ||
    startMinutes === null ||
    endMinutes === null ||
    !place
  ) {
    return null;
  }

  const startsAt = atMinutes(date, startMinutes);
  const endsAt = atMinutes(date, endMinutes);
  const invited = draft.invitedIds.flatMap((id) => findFriend(id) ?? []);
  const location = placeLabel(place);
  const coordinates = { latitude: place.latitude, longitude: place.longitude };

  const create = () => {
    const id = createSession({
      title: draft.title.trim(),
      sport,
      level,
      type,
      startsAt,
      endsAt,
      location,
      coordinates,
      description: draft.description.trim(),
      invitedIds: draft.invitedIds,
      photoUri: draft.photoUri,
    });
    // Replace this screen so you can't go back to the summary
    router.replace({ pathname: '/create/created', params: { id } });
  };

  return (
    <StepScreen
      title="Session Summary"
      showBack
      centerTitle
      footer={<Button label="Create session" onPress={create} />}>
      <SessionSummary
        title={draft.title.trim()}
        image={draft.photoUri ? { uri: draft.photoUri } : SPORT_IMAGES[sport]}
        type={type}
        level={level}
        invited={invited}
        startsAt={startsAt}
        endsAt={endsAt}
        location={location}
        coordinates={coordinates}
      />
    </StepScreen>
  );
}
