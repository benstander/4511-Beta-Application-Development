import { Stack } from 'expo-router';

export default function CreateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Session is already made here so there's no swiping back */}
      <Stack.Screen name="created" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
