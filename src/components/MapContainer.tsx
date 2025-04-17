import React, { useEffect } from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Location } from '../types';
import '../styles/MapContainer.css';

interface MapContainerProps {
    locations: Location[];
    onPinClick: (location: Location) => void;
    language: 'en' | 'se' | 'pt';
}

// Create a custom pin icon
const pinIcon = new Icon({
    iconUrl: '/images/pin.svg',  // Make sure this file exists in your public/images folder
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

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
                        icon={pinIcon}
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
