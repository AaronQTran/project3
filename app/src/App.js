import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; //import the Leaflet CSS
import L from 'leaflet';

// Default icon workaround for markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [destination, setDestination] = useState([44.9778, -93.2650]); //Minneapolis center

  const handleAlgorithmChange = (event) => {
    setSelectedAlgorithm(event.target.value);
  };

  const startAlgorithm = () => {
    if (selectedAlgorithm) {
      alert(`Starting ${selectedAlgorithm} algorithm!`);
    } else {
      alert('Please select an algorithm first!');
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute top-2 left-2 bg-white bg-opacity-95 p-4 rounded-lg shadow-md flex items-center space-x-4 z-[1000]">
        <label htmlFor="algorithm-select" className="text-lg font-medium">Choose an algorithm:</label>
        <select 
          id="algorithm-select" 
          value={selectedAlgorithm} 
          onChange={handleAlgorithmChange}
          className="p-2 border rounded-md text-gray-700"
        >
          <option value="">-- Select an algorithm --</option>
          <option value="Dijkstra's">Dijkstra's</option>
          <option value="Breadth-First Search">Breadth-First Search</option>
        </select>
        <button 
          onClick={startAlgorithm}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Start
        </button>
      </div>

      <MapContainer 
        center={destination} // where camera looks at first
        zoom={12} // Set initial zoom level
        minZoom={10} 
        maxZoom={16} 
        style={{ height: "100vh", width: "100vw" }} 
        scrollWheelZoom={true} 
        maxBounds={[[44.7, -93.5], [45.2, -93.0]]} 
        maxBoundsViscosity={1.0} // Locks the map to the bounds with a strict restriction
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <Marker
          position={destination}
          draggable={true}
          eventHandlers={{
            dragend: (e) => { //dragend, leaflet event specific to leflet
              const { lat, lng } = e.target.getLatLng(); //e = event object
              console.log(lat, lng);
              setDestination([lat, lng]);
            },
          }}
        />
      </MapContainer>
    </div>
  );
}

export default App;
