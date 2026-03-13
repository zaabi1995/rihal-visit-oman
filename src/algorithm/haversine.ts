const R = 6371; // Earth radius in km

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function totalRouteKm(stops: { lat: number; lng: number }[]): number {
  let total = 0;
  for (let i = 1; i < stops.length; i++) {
    total += haversineKm(stops[i - 1], stops[i]);
  }
  return total;
}

export function detourKm(
  route: { lat: number; lng: number }[],
  candidate: { lat: number; lng: number },
  insertIndex: number
): number {
  if (route.length < 2) return 0;
  const prev = route[insertIndex - 1] || route[0];
  const next = route[insertIndex] || route[route.length - 1];
  const originalDist = haversineKm(prev, next);
  const newDist = haversineKm(prev, candidate) + haversineKm(candidate, next);
  return newDist - originalDist;
}
