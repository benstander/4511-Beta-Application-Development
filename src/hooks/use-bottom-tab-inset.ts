import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabBarHeight } from '@/constants/theme';

// Space to leave at the bottom so content isn't under the tab bar.
// On iOS the safe area already includes the tab bar, Android uses a fixed height
export function useBottomTabInset() {
  const { bottom } = useSafeAreaInsets();
  return Platform.OS === 'ios' ? bottom : TabBarHeight;
}
