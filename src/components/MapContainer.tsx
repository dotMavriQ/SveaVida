import React, { useState, useEffect } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Location } from '../types';
import '../styles/MapContainer.css';

interface MapContainerProps {
    locations: Location[];
    onPinClick: (location: Location) => void;
    language: 'en' | 'se' | 'pt';
}

// Map for category-specific pin icons
const categoryPinMap: Record<string, string> = {
    'ikea': '/assets/images/pin_IKEA.png',
    'aivar': '/assets/images/pin_aivar.png',
    'nordic_cuisine': '/assets/images/pin_nordiccuisine.png',
    'svenska-ravaror': '/assets/images/pin_swedishpastries.png'
    // Add other category-to-pin mappings as needed
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

const MapContainer: React.FC<MapContainerProps> = ({ locations, onPinClick, language }) => {
    const [zoomLevel, setZoomLevel] = useState<number>(7); // Default zoom level

    // Center of Portugal approximate coordinates
    const portugalCenter = { lat: 39.5, lng: -8.0 };
    const defaultZoom = 7;

    // Calculate pin size based on zoom level
    const getPinSize = (zoom: number): [number, number] => {
        // Base size at the default zoom level
        const baseSize = 56;

        // Maximum size when fully zoomed in (at zoom level 18 or higher)
        const maxSize = 96;

        if (zoom >= 16) {
            // Full size when zoomed in close
            return [maxSize, maxSize];
        } else if (zoom >= 12) {
            // Gradually increase size between zoom levels 12-16
            const zoomFactor = (zoom - 12) / (16 - 12);
            const size = baseSize + zoomFactor * (maxSize - baseSize);
            return [size, size];
        } else {
            // Base size for lower zoom levels
            return [baseSize, baseSize];
        }
    };

    // Create a function to get the correct pin icon for each category
    const getPinIcon = (categoryId: string | undefined, zoom: number): Icon => {
        const iconUrl = categoryId && categoryPinMap[categoryId]
            ? categoryPinMap[categoryId]
            : '/assets/images/pin_cream.png'; // Default fallback pin

        const [width, height] = getPinSize(zoom);

        return new Icon({
            iconUrl,
            iconSize: [width, height],
            iconAnchor: [width / 2, height],
            popupAnchor: [0, -height],
        });
    };

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
                    <Marker
                        key={location.id}
                        position={{ lat: location.geoposition.lat, lng: location.geoposition.lon }}
                        icon={getPinIcon(location.categoryId, zoomLevel)}
                        eventHandlers={{
                            click: () => onPinClick(location)
                        }}
                    >
                        <Popup>
                            <div>
                                <h3>{location.name}</h3>
                                <p>{location.description[language]}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </LeafletMapContainer>
        </div>
    );
};

export default MapContainer;
