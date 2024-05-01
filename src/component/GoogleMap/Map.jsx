import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const Map = () => {
  const [driverLocation, setDriverLocation] = useState({ lat: -1.939826787816454, lng: 30.0445426438232 });
  const [nextStop, setNextStop] = useState('Stop A');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  const stops = [
    { name: 'Nyabugogo', location: { lat: -1.939826787816454, lng: 30.0445426438232 } },
    { name: 'Stop A', location: { lat: -1.9355377074007851, lng: 30.060163829002217 } },
    { name: 'Stop B', location: { lat: -1.9358808342336546, lng: 30.08024820994666 } },
    { name: 'Stop C', location: { lat: -1.9489196023037583, lng: 30.092607828989397 } },
    { name: 'Stop D', location: { lat: -1.9592132952818164, lng: 30.106684061788073 } },
    { name: 'Stop E', location: { lat: -1.9487480402200394, lng: 30.126596781356923 } },
    { name: 'Kimironko', location: { lat: -1.9365670876910166, lng: 30.13020167024439 } }
  ];

  // Origin and Destination
  const origin = stops[0];
  const destination = stops[stops.length - 1];

  useEffect(() => {
    const timer = setInterval(() => {
      // Update driver's location here
      setDriverLocation(prevLocation => ({
        lat: prevLocation.lat + 0.0001,
        lng: prevLocation.lng + 0.0001
      }));
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Calculate distance and duration from current stop to next stop
    const currentStopIndex = stops.findIndex(stop => stop.name === nextStop);
    if (currentStopIndex !== -1 && currentStopIndex < stops.length - 1) {
      const currentStopLocation = stops[currentStopIndex].location;
      const nextStopLocation = stops[currentStopIndex + 1].location;
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [currentStopLocation],
          destinations: [nextStopLocation],
          travelMode: 'DRIVING'
        },
        (response, status) => {
          if (status === 'OK') {
            setDistance(response.rows[0].elements[0].distance.text);
            setDuration(response.rows[0].elements[0].duration.text);
          }
        }
      );
    }
  }, [nextStop, stops]);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        center={driverLocation}
        zoom={15}
        mapContainerStyle={{ width: '100%', height: '100vh' }}
      >
        <Marker position={driverLocation} icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />
        {stops.map((stop, index) => (
          <Marker key={index} position={stop.location} title={stop.name} />
        ))}
        <DirectionsService
          options={{
            destination: destination.location,
            origin: origin.location,
            travelMode: 'DRIVING'
          }}
          callback={response => {
            if (response !== null) {
              console.log('response: ', response);
            }
          }}
        />
        <div className="absolute w-1/2 text-center top-2 left-2 bg-white p-2 shadow-md">
          <h3>Next Stop: {nextStop}</h3>
          <p>Distance: {distance}</p>
          <p>Duration: {duration}</p>
          <p>Origin: {origin.name}</p>
          <p>Destination: {destination.name}</p>
        </div>
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;

