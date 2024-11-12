import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import the Leaflet CSS

function App() {
  return (
    <div className="App">
      <header className="App-Name">
        <h1>My React Leaflet Map</h1>
      </header>
      <MapContainer 
        center={[51.505, -0.09]} // Set initial coordinates
        zoom={13} // Set initial zoom level
        style={{ height: "100vh", width: "100%" }} // Map dimensions
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Map tile source
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </div>
  );
}

export default App;
