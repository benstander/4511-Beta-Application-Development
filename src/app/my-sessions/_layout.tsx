import { Stack } from 'expo-router';

// Stack so session pages open inside the My Sessions tab
export default function MySessionsLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
