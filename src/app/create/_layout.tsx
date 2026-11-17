import { Stack } from 'expo-router';

// Stack for the create steps
export default function CreateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Session is already made here so there's no swiping back */}
      <Stack.Screen name="created" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
