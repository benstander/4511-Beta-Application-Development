import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { useTheme } from '@/hooks/use-theme';
import type { Coordinates } from '@/types/session';

type SessionMapProps = {
  coordinates: Coordinates;
  label: string;
  attached?: boolean;
};

const RADIUS = 12;
const BORDER = 1.5;

// Small map with a pin on the session's location. Can't be moved around
export function SessionMap({ coordinates, label, attached }: SessionMapProps) {
  const theme = useTheme();

  return (
    <View style={[styles.box, attached && styles.boxAttached, { borderColor: theme.text }]}>
      <MapView
        // Map needs its own rounded corners
        style={[styles.map, attached && styles.mapAttached]}
        // Roughly 1km around the pin
        initialRegion={{ ...coordinates, latitudeDelta: 0.012, longitudeDelta: 0.012 }}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        accessibilityLabel={`Map of ${label}`}>
        <Marker coordinate={coordinates} title={label} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    aspectRatio: 370 / 392,
    overflow: 'hidden',
    borderWidth: BORDER,
    borderRadius: RADIUS,
  },
  boxAttached: {
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  map: {
    ...StyleSheet.absoluteFill,
    borderRadius: RADIUS - BORDER,
  },
  mapAttached: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
});
