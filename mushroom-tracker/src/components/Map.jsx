import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom mushroom icon
const mushroomIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="25" height="25">
      <circle cx="50" cy="25" r="20" fill="#8B4513" stroke="#654321" stroke-width="2"/>
      <ellipse cx="50" cy="25" rx="25" ry="12" fill="#D2691E" stroke="#8B4513" stroke-width="1"/>
      <rect x="47" y="35" width="6" height="25" fill="#F5DEB3" stroke="#DEB887" stroke-width="1"/>
      <ellipse cx="50" cy="60" rx="8" ry="3" fill="#8B4513"/>
    </svg>
  `),
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
});

const Map = ({ location, mushroomName }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Geocoding function using Nominatim (OpenStreetMap's geocoding service)
  const geocodeLocation = async (locationString) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      } else {
        throw new Error('Location not found');
      }
    } catch (err) {
      throw new Error('Geocoding failed: ' + err.message);
    }
  };

  useEffect(() => {
    const loadLocation = async () => {
      if (!location) {
        setError('No location provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Try to geocode the location
        const coords = await geocodeLocation(location);
        setCoordinates(coords);
      } catch (err) {
        console.error('Error geocoding location:', err);
        setError(err.message);
        // Fallback to a default location (Madison, WI)
        setCoordinates({ lat: 43.0731, lng: -89.4012 });
      } finally {
        setLoading(false);
      }
    };

    loadLocation();
  }, [location]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading map...</span>
        </div>
      </div>
    );
  }

  if (error && !coordinates) {
    return (
      <div className="alert alert-warning" role="alert">
        <strong>Map Error:</strong> {error}
      </div>
    );
  }

  return (
    <div style={{ height: '300px', width: '100%', borderRadius: '0.375rem', overflow: 'hidden' }}>
      <MapContainer
        center={[coordinates.lat, coordinates.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={[coordinates.lat, coordinates.lng]}
          icon={mushroomIcon}
        >
          <Popup>
            <div className="text-center">
              <strong>{mushroomName}</strong>
              <br />
              <small className="text-muted">{location}</small>
              {error && (
                <div className="mt-2">
                  <small className="text-warning">
                    Approximate location shown
                  </small>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
