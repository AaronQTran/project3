import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet';
import io from 'socket.io-client';

//keeps saying 83, 
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const socket = io("http://localhost:5000");  

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [destination, setDestination] = useState([25.7617, -80.1918]); 
  const [path, setPath] = useState([]);  

  const handleAlgorithmChange = (event) => {
    setSelectedAlgorithm(event.target.value);
  };

  async function startAlgorithm() {
    console.log("starting algo with dest:", destination);
    if (!selectedAlgorithm) {
      alert('Choose an algorithm!');
      return;
    }
  
    const [lat, lon] = destination; 
  
    const data = {
      algorithm: selectedAlgorithm,
      end_lat: lat,
      end_lon: lon,
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/start_algorithm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      if (response.ok) {
        setPath([]);  // Clear previous paths
        alert(result.message);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Failed to start algorithm. Please try again.');
      console.error(error);
    }
  }
  
  

  // Listen for socket data
  useEffect(() => {
    socket.on('bfs_update', (data) => {
      setPath((prevPath) => [...prevPath, data.current_coords]);  // Add new coordinates to the path
    });

    socket.on('bfs_complete', (data) => {
      if (data.message) {
        alert(data.message);  // Handle "no path found"
      } else {
        setPath((prevPath) => [...prevPath, data.end_coords]);
        alert(`Path found with distance: ${data.distance}`);
      }
    });

    // Cleanup the socket connection on component unmount
    return () => {
      socket.off('bfs_update');
      socket.off('bfs_complete');
    };
  }, []);

  // useEffect(() => {
  //   if (path.length > 0 && mapRef.current) {
  //     const lastCoord = path[path.length - 1];
  //     mapRef.current.flyTo(lastCoord, 14);  // Fly to the latest BFS point
  //   }
  // }, [path]);

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
          <option value="DJK">Dijkstra's</option>
          <option value="BFS">Breadth-First Search</option>
        </select>
        <button 
          onClick={startAlgorithm}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
        >
          Start
        </button>
      </div>

      <MapContainer
        center={destination}
        zoom={12}
        minZoom={10}
        maxZoom={16}
        style={{ height: '100vh', width: '100vw' }}
        scrollWheelZoom={true}
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
            dragend: (e) => {
              const { lat, lng } = e.target.getLatLng();
              if (lat < 25.6 || lat > 25.9 || lng < -80.4 || lng > -80.0) {
                alert('Marker is outside the allowed bounds of Miami!');
              } else {
                setDestination([lat, lng]);  
              }
            },
          }}
        />
        {path.map((coord, index) => (
          <CircleMarker
            key={index}
            center={coord}
            radius={1} 
            color="blue"
            fillColor="blue"
            fillOpacity={1}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
