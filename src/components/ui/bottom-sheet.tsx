import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderHandlers,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaxContentWidth, Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  header?: ReactNode;
  children?: ReactNode;
  sheetStyle?: StyleProp<ViewStyle>;
  role?: 'dialog' | 'alertdialog';
};

const USE_NATIVE_DRIVER = Platform.OS !== 'web';
const DISMISS_DISTANCE = 100;
const DISMISS_VELOCITY = 0.8;

// Popup that slides up from the bottom. Tap outside or swipe down to close
export function BottomSheet({
  visible,
  onClose,
  header,
  children,
  sheetStyle,
  role = 'dialog',
}: BottomSheetProps) {
  const [progress] = useState(() => new Animated.Value(0));
  const [drag] = useState(() => new Animated.Value(0));
  const [sheetHeight, setSheetHeight] = useState(() => Dimensions.get('window').height);
  const [rendered, setRendered] = useState(visible);
  if (visible && !rendered) {
    setRendered(true);
  }

  useEffect(() => {
    if (visible) {
      // Reset the drag then slide up
      drag.setValue(0);
      Animated.timing(progress, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    } else {
      // Slide down then hide the Modal
      Animated.timing(progress, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start(({ finished }) => {
        if (finished) setRendered(false);
      });
    }
  }, [visible, progress, drag]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        // Take touches that start outside a button, otherwise the Modal takes them
        // and the swipe never reaches us
        onStartShouldSetPanResponder: () => true,
        // Only react to downward swipes so taps still work
        onMoveShouldSetPanResponder: (_, { dx, dy }) => dy > 6 && Math.abs(dy) > Math.abs(dx),
        onPanResponderMove: (_, { dy }) => drag.setValue(Math.max(0, dy)),
        onPanResponderRelease: (_, { dy, vy }) => {
          if (dy > DISMISS_DISTANCE || vy > DISMISS_VELOCITY) {
            onClose();
          } else {
            Animated.spring(drag, {
              toValue: 0,
              bounciness: 4,
              useNativeDriver: USE_NATIVE_DRIVER,
            }).start();
          }
        },
        onPanResponderTerminate: () =>
          Animated.spring(drag, { toValue: 0, useNativeDriver: USE_NATIVE_DRIVER }).start(),
      }),
    [drag, onClose]
  );

  const translateY = Animated.add(
    progress.interpolate({ inputRange: [0, 1], outputRange: [sheetHeight, 0] }),
    drag
  );

  return (
    <Modal
      visible={rendered}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}>
      {/* Needed so the bottom padding doesn't include the tab bar */}
      <SafeAreaProvider>
        <View style={styles.root}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, { opacity: progress }]}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={onClose}
              accessibilityLabel="Close"
            />
          </Animated.View>

          <SheetPanel
            role={role}
            sheetStyle={sheetStyle}
            translateY={translateY}
            onHeight={setSheetHeight}
            panHandlers={panResponder.panHandlers}>
            {header}
            {children}
          </SheetPanel>
        </View>
      </SafeAreaProvider>
    </Modal>
  );
}

// Separate component so it can use the safe area inside the Modal
function SheetPanel({
  role,
  sheetStyle,
  translateY,
  onHeight,
  panHandlers,
  children,
}: {
  role: 'dialog' | 'alertdialog';
  sheetStyle?: StyleProp<ViewStyle>;
  translateY: Animated.AnimatedAddition;
  onHeight: (height: number) => void;
  panHandlers: GestureResponderHandlers;
  children: ReactNode;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      {...panHandlers}
      role={role}
      onLayout={(event) => onHeight(event.nativeEvent.layout.height)}
      style={[
        styles.sheet,
        {
          backgroundColor: theme.surface,
          paddingBottom: insets.bottom + 16,
          transform: [{ translateY }],
        },
        sheetStyle,
      ]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    backgroundColor: Palette.overlay,
  },
  sheet: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
