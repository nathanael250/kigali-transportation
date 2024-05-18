import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '60vh'
};

const center = {
  lat: -1.939826787816454,
  lng: 30.0445426438232
};

const stops = [
  { lat: -1.939826787816454, lng: 30.0445426438232 }, // Starting Point: Nyabugogo
  { lat: -1.9355377074007851, lng: 30.060163829002217 }, // Stop A
  { lat: -1.9358808342336546, lng: 30.08024820994666 }, // Stop B
  { lat: -1.9489196023037583, lng: 30.092607828989397 }, // Stop C
  { lat: -1.9592132952818164, lng: 30.106684061788073 }, // Stop D
  { lat: -1.9487480402200394, lng: 30.126596781356923 }, // Stop E
  { lat: -1.9365670876910166, lng: 30.13020167024439 }  // Ending Point: Kimironko
];

const MapComponent = () => {
  const [response, setResponse] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(center);
  const [eta, setEta] = useState({ distance: '', duration: '', nextStop: '' });

  const directionsCallback = (result, status) => {
    if (status === 'OK') {
      setResponse(result);
      const legs = result.routes[0].legs;
      if (legs.length > 0) {
        setEta({
          distance: legs[0].distance.text,
          duration: legs[0].duration.text,
          nextStop: legs[0].end_address
        });
      }
    } else {
      console.error(`error fetching directions ${result}`);
    }
  };
  console.log('Google Maps API Key:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

  useEffect(() => {
    navigator.geolocation.watchPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      },
      error => console.error(error),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <div>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentLocation}
          zoom={13}
        >
          {stops.length > 1 && (
            <DirectionsService
              options={{
                origin: stops[0],
                destination: stops[stops.length - 1],
                waypoints: stops.slice(1, -1).map(stop => ({ location: stop, stopover: true })),
                travelMode: 'DRIVING'
              }}
              callback={directionsCallback}
            />
          )}
          {response && (
            <DirectionsRenderer
              options={{
                directions: response
              }}
            />
          )}
          <Marker position={currentLocation} label="You are here" />
        </GoogleMap>
      </LoadScript>
      <div style={{ padding: '10px', textAlign: 'center' }}>
        <h2>Nyabugogo - Kimironko</h2>
        <p>Next stop: {eta.nextStop}</p>
        <p>Distance: {eta.distance} | Time: {eta.duration}</p>
        
      </div>
    </div>
    
  );
};

export default MapComponent;
