import { Stack } from 'expo-router';

// Stack so session pages open on top and keep the tab bar
export default function HomeLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
