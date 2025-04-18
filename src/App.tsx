import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MapContainer from './components/MapContainer';
import PinDetailModal from './components/PinDetailModal';
import { loadAllPinData, processLocations } from './services/dataService';
import { CategoryData, EnhancedLocation } from './types';
import './styles/App.css';

const App: React.FC = () => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [locations, setLocations] = useState<EnhancedLocation[]>([]);
    const [selectedPin, setSelectedPin] = useState<EnhancedLocation | null>(null);
    const [language, setLanguage] = useState<'en' | 'se' | 'pt'>('en');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pinData = await loadAllPinData();

                // Extract unique categories
                const uniqueCategories = pinData.map(data => data.category);
                setCategories(uniqueCategories);

                // Set all categories as initially selected
                setSelectedCategories(uniqueCategories.map(cat => cat.id));

                // Process locations to handle multiple category sources
                const processedLocations = processLocations(pinData);
                setLocations(processedLocations);
            } catch (error) {
                console.error("Error loading pin data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategories(prev => {
            if (prev.includes(categoryId)) {
                return prev.filter(id => id !== categoryId);
            } else {
                return [...prev, categoryId];
            }
        });
    };

    const handlePinClick = (location: EnhancedLocation) => {
        setSelectedPin(location);
    };

    const handleCloseModal = () => {
        setSelectedPin(null);
    };

    // Filter locations based on selected categories
    const filteredLocations = locations.filter(location => {
        const hasActiveCategory = location.categories.some(
            category => selectedCategories.includes(category.id)
        );

        console.log(`Location ${location.name} active: ${hasActiveCategory}`, {
            locationCategories: location.categories.map(c => c.id),
            selectedCategories,
        });

        return hasActiveCategory;
    });

    // Log the filtered locations to help debug
    useEffect(() => {
        if (filteredLocations.length > 0) {
            console.log("Filtered Locations:", filteredLocations.map(loc => ({
                name: loc.name,
                categories: loc.categories.map(c => c.id),
                activeCategories: loc.categories
                    .filter(c => selectedCategories.includes(c.id))
                    .map(c => c.id)
            })));
        }
    }, [filteredLocations, selectedCategories]);

    return (
        <div className="app-container">
            <Sidebar
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryToggle={handleCategoryToggle}
                language={language}
                onLanguageChange={setLanguage}
            />
            <MapContainer
                locations={filteredLocations}
                onPinClick={handlePinClick}
                language={language}
                selectedCategories={selectedCategories}
            />
            {selectedPin && (
                <PinDetailModal
                    location={selectedPin}
                    onClose={handleCloseModal}
                    language={language}
                />
            )}
            {isLoading && <div className="loading-overlay">Loading...</div>}
        </div>
    );
};

export default App;
