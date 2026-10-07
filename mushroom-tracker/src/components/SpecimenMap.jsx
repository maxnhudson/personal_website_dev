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

// Custom mushroom icons for different types
const publicSpecimenIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="25" height="25">
      <circle cx="50" cy="25" r="20" fill="#28a745" stroke="#1e7e34" stroke-width="2"/>
      <ellipse cx="50" cy="25" rx="25" ry="12" fill="#34ce57" stroke="#28a745" stroke-width="1"/>
      <rect x="47" y="35" width="6" height="25" fill="#F5DEB3" stroke="#DEB887" stroke-width="1"/>
      <ellipse cx="50" cy="60" rx="8" ry="3" fill="#1e7e34"/>
    </svg>
  `),
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
});

const privateSpecimenIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="25" height="25">
      <circle cx="50" cy="25" r="20" fill="#007bff" stroke="#0056b3" stroke-width="2"/>
      <ellipse cx="50" cy="25" rx="25" ry="12" fill="#3395ff" stroke="#007bff" stroke-width="1"/>
      <rect x="47" y="35" width="6" height="25" fill="#F5DEB3" stroke="#DEB887" stroke-width="1"/>
      <ellipse cx="50" cy="60" rx="8" ry="3" fill="#0056b3"/>
    </svg>
  `),
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
});

const SpecimenMap = ({ specimens, mushroomName }) => {
  const [specimenCoordinates, setSpecimenCoordinates] = useState([]);
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
    const loadSpecimenLocations = async () => {
      if (!specimens || specimens.length === 0) {
        setError('No specimens provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Only process specimens that have actual coordinates - NO GEOCODING
        const specimensWithCoordinates = [];
        
        for (const specimen of specimens) {
          // ONLY use specimens that have explicit coordinates
          if (specimen.hasGeolocation && 
              specimen.latitude !== null && specimen.latitude !== undefined && specimen.latitude !== '' &&
              specimen.longitude !== null && specimen.longitude !== undefined && specimen.longitude !== '') {
            
            specimensWithCoordinates.push({
              ...specimen,
              coordinates: {
                lat: parseFloat(specimen.latitude),
                lng: parseFloat(specimen.longitude)
              },
              hasValidCoordinates: true
            });
          }
        }
        
        if (specimensWithCoordinates.length === 0) {
          setError('No specimens have coordinate data to display on map');
          setSpecimenCoordinates([]);
        } else {
          setSpecimenCoordinates(specimensWithCoordinates);
          setError(null);
        }
      } catch (error) {
        console.error('SpecimenMap: Error in loadSpecimenLocations:', error);
        setError('Error processing specimen locations: ' + error.message);
        setSpecimenCoordinates([]);
      } finally {
        setLoading(false);
      }
    };

    loadSpecimenLocations();
  }, [specimens, mushroomName]);

  // Calculate center point for the map - center on first specimen by date
  const getMapCenter = () => {
    if (specimenCoordinates.length === 0) {
      return [43.0731, -89.4012]; // Default to Madison, WI
    }
    
    // Sort specimens by date (earliest first) and center on the first one
    const sortedByDate = [...specimenCoordinates].sort((a, b) => {
      const dateA = new Date(a.date || a.findDate || a.dateAdded);
      const dateB = new Date(b.date || b.findDate || b.dateAdded);
      return dateA - dateB;
    });
    
    const firstSpecimen = sortedByDate[0];
    return [firstSpecimen.coordinates.lat, firstSpecimen.coordinates.lng];
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading specimen map...</span>
        </div>
      </div>
    );
  }

  if (error && specimenCoordinates.length === 0) {
    return (
      <div className="alert alert-warning" role="alert">
        <strong>Map Error:</strong> {error}
      </div>
    );
  }

  return (
    <div style={{ height: '400px', width: '100%', borderRadius: '0.375rem', overflow: 'hidden' }}>
      <MapContainer
        center={getMapCenter()}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {specimenCoordinates.map((specimen) => (
          <Marker 
            key={specimen.id}
            position={[specimen.coordinates.lat, specimen.coordinates.lng]}
            icon={specimen.privacy === 'private' ? privateSpecimenIcon : publicSpecimenIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>{specimen.name || mushroomName}</strong>
                <br />
                <small className="text-muted">{specimen.location}</small>
                <br />
                <small>
                  Coordinates: {specimen.coordinates.lat.toFixed(4)}, {specimen.coordinates.lng.toFixed(4)}
                </small>
                <br />
                <small>
                  Found: {new Date(specimen.date).toLocaleDateString()}
                </small>
                <br />
                <small>
                  Added by: {specimen.addedBy}
                </small>
                <br />
                <small className={`badge ${specimen.privacy === 'private' ? 'bg-primary' : 'bg-success'}`}>
                  {specimen.privacy === 'private' ? 'Private' : 'Public'} Specimen
                </small>
                {specimen.notes && (
                  <>
                    <br />
                    <small className="text-info">{specimen.notes}</small>
                  </>
                )}
                {error && (
                  <div className="mt-2">
                    <small className="text-warning">
                      Some locations may be approximate
                    </small>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {specimenCoordinates.length > 0 && (
        <div className="mt-2 small text-muted text-center">
          <span className="badge bg-success me-2">●</span>Public specimens
          <span className="badge bg-primary ms-1">●</span>Private specimens
          <span className="ms-2">({specimenCoordinates.length} location{specimenCoordinates.length !== 1 ? 's' : ''})</span>
        </div>
      )}
    </div>
  );
};

export default SpecimenMap;
