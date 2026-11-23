import type { Coordinates } from '@/types/session';

// A place picked from the location search
export type Place = Coordinates & {
  name: string;
  area: string;
};

const SEARCH_URL = 'https://photon.komoot.io/api/';
const NEAR = { lat: -33.8688, lon: 151.2093 };
const MAX_RESULTS = 5;

type PhotonFeature = {
  geometry: { coordinates: [longitude: number, latitude: number] };
  properties: {
    name?: string;
    district?: string;
    city?: string;
  };
};

// e.g. "Fred Caterson Reserve, Castle Hill"
export function placeLabel(place: Pick<Place, 'name' | 'area'>) {
  return place.area && place.area !== place.name ? `${place.name}, ${place.area}` : place.name;
}

// Up to 5 places that match. Throws if there's no internet
export async function searchPlaces(query: string): Promise<Place[]> {
  const params = [
    `q=${encodeURIComponent(query)}`,
    `limit=${MAX_RESULTS * 2}`,
    'lang=en',
    `lat=${NEAR.lat}`,
    `lon=${NEAR.lon}`,
  ].join('&');
  const response = await fetch(`${SEARCH_URL}?${params}`);
  if (!response.ok) throw new Error(`Place search failed (${response.status})`);
  const { features } = (await response.json()) as { features: PhotonFeature[] };

  const places: Place[] = [];
  const seen = new Set<string>();
  for (const { geometry, properties: p } of features) {
    const { name } = p;
    if (!name) continue;
    const area = p.district ?? p.city ?? '';
    const label = placeLabel({ name, area });
    if (seen.has(label)) continue;
    seen.add(label);

    const [longitude, latitude] = geometry.coordinates;
    places.push({ name, area, latitude, longitude });
    if (places.length === MAX_RESULTS) break;
  }
  return places;
}
