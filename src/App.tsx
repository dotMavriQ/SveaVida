import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MapContainer from './components/MapContainer';
import PinDetailModal from './components/PinDetailModal';
import { loadAllPinData } from './services/dataService';
import { CategoryData, Location, PinData } from './types';
import './styles/App.css';

const App: React.FC = () => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedPin, setSelectedPin] = useState<Location | null>(null);
    const [language, setLanguage] = useState<'en' | 'se' | 'pt'>('en');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pinData = await loadAllPinData();
                setCategories(pinData.map(data => data.category));

                // Set all categories as initially selected
                setSelectedCategories(pinData.map(data => data.category.id));

                // Flatten all locations across categories
                const allLocations = pinData.flatMap(data =>
                    data.locations.map(location => ({
                        ...location,
                        categoryId: data.category.id
                    }))
                );

                setLocations(allLocations);
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

    const handlePinClick = (location: Location) => {
        setSelectedPin(location);
    };

    const handleCloseModal = () => {
        setSelectedPin(null);
    };

    const filteredLocations = locations.filter(location =>
        selectedCategories.includes(location.categoryId as string)
    );

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
