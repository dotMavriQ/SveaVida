import React, { useState, useEffect } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { EnhancedLocation } from '../types';
import '../styles/MapContainer.css';

interface MapContainerProps {
    locations: EnhancedLocation[];
    onPinClick: (location: EnhancedLocation) => void;
    language: 'en' | 'se' | 'pt';
    selectedCategories: string[]; // Add selected categories prop
}

// Map for category-specific pin icons
const categoryPinMap: Record<string, string> = {
    'ikea': '/assets/images/pin_IKEA.png',
    'aivar': '/assets/images/pin_aivar.png',
    'nordic_cuisine': '/assets/images/pin_nordiccuisine.png',
    'svenska-ravaror': '/assets/images/pin_swedishgoods.png',  // Updated to use swedishgoods pin
    'snus': '/assets/images/pin_snus.png'
};

// This component handles zoom level changes and updates pin sizes
const ZoomHandler = ({ setZoomLevel }: { setZoomLevel: (zoom: number) => void }) => {
    const map = useMap();

    useEffect(() => {
        const handleZoomChange = () => {
            setZoomLevel(map.getZoom());
        };

        map.on('zoomend', handleZoomChange);
        // Set initial zoom level
        setZoomLevel(map.getZoom());

        return () => {
            map.off('zoomend', handleZoomChange);
        };
    }, [map, setZoomLevel]);

    return null;
};

// Custom marker component with simple switching between category pins
const OscillatingMarker: React.FC<{
    location: EnhancedLocation;
    zoomLevel: number;
    onClick: () => void;
    selectedCategories: string[];
}> = ({ location, zoomLevel, onClick, selectedCategories }) => {
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

    // Find which categories are active for this location
    const activeCategories = location.categories
        .filter(category => selectedCategories.includes(category.id))
        .map(category => category.id);

    // Log for debugging
    console.log(`Location ${location.name}:`, {
        activeCategories,
        selectedCategories,
        allCategories: location.categories.map(c => c.id)
    });

    // Calculate pin size based on zoom level
    const getPinSize = (zoom: number): [number, number] => {
        const baseSize = 56;
        const maxSize = 96;

        if (zoom >= 16) {
            return [maxSize, maxSize];
        } else if (zoom >= 12) {
            const zoomFactor = (zoom - 12) / (16 - 12);
            const size = baseSize + zoomFactor * (maxSize - baseSize);
            return [size, size];
        } else {
            return [baseSize, baseSize];
        }
    };

    // Simple switching logic - just cycle through active categories
    useEffect(() => {
        // Reset index when active categories change
        setCurrentCategoryIndex(0);

        // Only setup interval if we have multiple categories
        if (activeCategories.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentCategoryIndex(prev => (prev + 1) % activeCategories.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [activeCategories.join(',')]);

    // Determine which category to show
    const getCategoryToShow = (): string => {
        if (activeCategories.length === 0) {
            // No active categories, use primary (shouldn't happen due to filtering)
            return location.primaryCategoryId;
        }

        if (activeCategories.length === 1) {
            // Only one active category, use that
            return activeCategories[0];
        }

        // Multiple active categories, use the current index
        return activeCategories[currentCategoryIndex];
    };

    const categoryToShow = getCategoryToShow();

    // Create icon for the currently shown category
    const getPinIcon = (categoryId: string, zoom: number): Icon => {
        const iconUrl = categoryId && categoryPinMap[categoryId]
            ? categoryPinMap[categoryId]
            : '/assets/images/pin_cream.png';

        const [width, height] = getPinSize(zoom);

        return new Icon({
            iconUrl,
            iconSize: [width, height],
            iconAnchor: [width / 2, height],
            popupAnchor: [0, -height]
            // No animation class - we'll just switch images
        });
    };

    return (
        <Marker
            position={{ lat: location.geoposition.lat, lng: location.geoposition.lon }}
            icon={getPinIcon(categoryToShow, zoomLevel)}
            eventHandlers={{
                click: onClick
            }}
        />
    );
};

const MapContainer: React.FC<MapContainerProps> = ({
    locations,
    onPinClick,
    language,
    selectedCategories
}) => {
    const [zoomLevel, setZoomLevel] = useState<number>(7);

    // Center of Portugal approximate coordinates
    const portugalCenter = { lat: 39.5, lng: -8.0 };
    const defaultZoom = 7;

    return (
        <div className="map-container">
            <LeafletMapContainer
                center={portugalCenter}
                zoom={defaultZoom}
                scrollWheelZoom={true}
                minZoom={6}
                maxZoom={18}
            >
                <ZoomHandler setZoomLevel={setZoomLevel} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {locations.map(location => (
                    <OscillatingMarker
                        key={location.id}
                        location={location}
                        zoomLevel={zoomLevel}
                        onClick={() => onPinClick(location)}
                        selectedCategories={selectedCategories}
                    />
                ))}
            </LeafletMapContainer>
        </div>
    );
};

export default MapContainer;
