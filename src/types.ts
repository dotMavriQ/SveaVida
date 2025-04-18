export interface MultiLanguageText {
  en: string;
  se: string;
  pt: string;
}

export interface CategoryData {
  id: string;
  name: MultiLanguageText;
}

export interface GeoPosition {
  lat: number;
  lon: number;
}

export interface Socials {
  facebook: string | null;
  instagram: string | null;
}

export interface Location {
  id: string;
  name: string;
  geoposition: GeoPosition;
  located: string;
  thumbnail: string | null;
  website: string | null;
  socials: Socials;
  open_hours: string | { [key: string]: string };
  tags: string[];
  description: MultiLanguageText;
  categoryId?: string; // Added when processing data
}

// Enhanced location with multiple category sources
export interface EnhancedLocation extends Location {
  categories: CategoryData[];
  primaryCategoryId: string;
  currentCategoryId?: string;
}

export interface PinData {
  category: CategoryData;
  locations: Location[];
}
