export const FUEL_PRICE_PER_LITER = 0.180; // OMR
export const KM_PER_LITER = 12;
export const FOOD_PER_DAY = 6; // OMR

export const HOTEL_RATES: Record<string, number> = {
  low: 20,
  medium: 45,
  luxury: 90,
};

export const INTENSITY_STOPS: Record<string, number> = {
  relaxed: 3,
  balanced: 4,
  packed: 5,
};

export const MAX_DAILY_KM = 250;
export const MAX_DAILY_VISIT_MINUTES = 480;
export const MAX_SAME_CATEGORY_PER_DAY = 2;

export const SCORING_WEIGHTS = {
  interest: 0.30,
  season: 0.20,
  crowd: 0.15,
  cost: 0.10,
  detour: 0.15,
  diversity: 0.10,
};

export const REGIONS = ['muscat', 'dakhiliya', 'sharqiya', 'dhofar', 'batinah', 'dhahira'] as const;
export const CATEGORIES = ['mountain', 'beach', 'culture', 'desert', 'nature', 'food'] as const;
