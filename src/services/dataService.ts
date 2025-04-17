import { PinData } from '../types';

// List of all pin data files
const pinFiles = [
  '/pins/ikea.json',
  '/pins/swedishgoods.json',
  '/pins/aivar.json',
  '/pins/nordiccuisine.json',
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
