import { PinData, Location, EnhancedLocation } from '../types';

// List of all pin data files
const pinFiles = [
  '/pins/ikea.json',
  '/pins/swedishgoods.json',
  '/pins/aivar.json',
  '/pins/nordiccuisine.json',
  '/pins/snus.json',  // Add the new snus.json file
];

/**
 * Loads a single JSON file
 */
export const loadPinData = async (filePath: string): Promise<PinData> => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
    throw error;
  }
};

/**
 * Loads all pin data from JSON files
 */
export const loadAllPinData = async (): Promise<PinData[]> => {
  try {
    const promises = pinFiles.map(file => loadPinData(file));
    return await Promise.all(promises);
  } catch (error) {
    console.error("Failed to load all pin data:", error);
    throw error;
  }
};

/**
 * Process pin data to identify and enhance locations with multiple category sources
 */
export const processLocations = (pinData: PinData[]): EnhancedLocation[] => {
  // First pass: collect all locations by ID
  const locationMap = new Map<string, EnhancedLocation>();
  
  // Track which file/category each location was first found in
  const firstSeenInCategory = new Map<string, string>();
  
  // First pass: gather all unique locations
  pinData.forEach(data => {
    const categoryId = data.category.id;
    
    data.locations.forEach(location => {
      // Record the first category this location was found in
      if (!firstSeenInCategory.has(location.id)) {
        firstSeenInCategory.set(location.id, categoryId);
      }
      
      if (!locationMap.has(location.id)) {
        // Initialize with empty categories array
        locationMap.set(location.id, {
          ...location,
          categories: [],
          primaryCategoryId: categoryId
        });
      }
    });
  });
  
  // Second pass: add all category associations
  pinData.forEach(data => {
    const categoryId = data.category.id;
    
    data.locations.forEach(location => {
      const enhancedLocation = locationMap.get(location.id);
      if (enhancedLocation) {
        // Check if this category is already added
        const categoryExists = enhancedLocation.categories.some(c => c.id === categoryId);
        
        if (!categoryExists) {
          // Add this category to the location
          enhancedLocation.categories.push({
            id: categoryId,
            name: data.category.name
          });
        }
        
        // Ensure the primaryCategoryId is the category where we first saw this location
        enhancedLocation.primaryCategoryId = firstSeenInCategory.get(location.id) || categoryId;
      }
    });
  });
  
  return Array.from(locationMap.values());
};
