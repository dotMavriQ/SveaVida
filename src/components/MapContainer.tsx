import React from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

// Create a function to get the correct pin icon for each category
const getPinIcon = (categoryId: string | undefined): Icon => {
    const iconUrl = categoryId && categoryPinMap[categoryId]
        ? categoryPinMap[categoryId]
        : '/assets/images/pin_cream.png'; // Default fallback pin

    return new Icon({
        iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

const MapContainer: React.FC<MapContainerProps> = ({ locations, onPinClick, language }) => {
    // Center of Portugal approximate coordinates
    const portugalCenter = { lat: 39.5, lng: -8.0 };
    const defaultZoom = 7;

    return (
        <div className="map-container">
            <LeafletMapContainer
                center={portugalCenter}
                zoom={defaultZoom}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {locations.map(location => (
                    <Marker
                        key={location.id}
                        position={{ lat: location.geoposition.lat, lng: location.geoposition.lon }}
                        icon={getPinIcon(location.categoryId)}
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
