import { Destination } from './types';
import dataJson from '../data/destinations.json';

let _destinations: Destination[] | null = null;

export function getDestinations(): Destination[] {
  if (!_destinations) {
    _destinations = dataJson as Destination[];
  }
  return _destinations;
}

export function getDestinationById(id: string): Destination | undefined {
  return getDestinations().find(d => d.id === id);
}

export function getRegions(): string[] {
  return [...new Set(getDestinations().map(d => d.region.en))];
}

export function getCategories(): string[] {
  return [...new Set(getDestinations().flatMap(d => d.categories))];
}
