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
  const [destination, setDestination] = useState([25.8253124, -80.1947449]); 
  const [path, setPath] = useState([]);  
  const [shortestPath, setShortestPath] = useState([]);
  const [showMessage, setShowMessage] = useState(true);  
  const [startPoint, setStartPoint] = useState([25.8253124, -80.1947449]);
  const [activeAlgorithm, setActiveAlgorithm] = useState('');
  const handleCloseMessage = () => {
    setShowMessage(false);  
  };

  const handleAlgorithmChange = (event) => {
    setSelectedAlgorithm(event.target.value);
  };

  async function startAlgorithm() {
    console.log("starting algo with dest:", destination);
  
    if (!selectedAlgorithm) {
      alert('Choose an algorithm bruh!');
      return;
    }

    socket.emit('stop_algorithm');

    setActiveAlgorithm(selectedAlgorithm);
    setPath([]);
    setShortestPath([]);
  
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
        console.log(result.message); 
      } else {
        console.log(result.error);
      }
    } catch (error) {
      alert('Failed to start algorithm. Please try again.');
      console.error(error);
    }
  }
  
  
  useEffect(() => {
    socket.on('bfs_update', (data) => { //continues to listen despite running once
      setPath((prevPath) => [...prevPath, data.current_coords]);  //add new coordinates to the path
    });

    socket.on('bfs_complete', (data) => {
      if (data.shortest_path) {
        setShortestPath(data.shortest_path); 
        console.log(`Path found with distance: ${data.distance}`);
      }
    });

    return () => {
      socket.off('bfs_update');
      socket.off('bfs_complete');
      socket.emit('stop_algorithm');
    };
  }, []);

  return (
    <div className="relative h-screen w-screen">
      {showMessage && (
        <div className="absolute top-2 right-2 w-64 bg-white bg-opacity-95 p-4 rounded-lg shadow-md flex items-start space-x-2 z-[1000]">
          <span className="text-gray-800">Welcome to Miami! Place the pin near the starting circle and select a traversal algorithm.</span>
          <button 
            onClick={handleCloseMessage}
            className="text-orange-400 font-bold px-2 py-1 rounded hover:bg-gray-200 transition-colors"
          >
            X
          </button>
        </div>
      )}
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
        zoom={16}
        minZoom={5}
        maxZoom={20}
        style={{ height: '100vh', width: '100vw' }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; Esri &mdash; Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community'
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
        <CircleMarker
          center={startPoint}     
          radius={10}             
          color="purple"           
          fillColor="transparent" 
          weight={4}              
        />
        {shortestPath.length > 1 && ( //if true, do this&*
          <Polyline
            positions={shortestPath} 
            color="green"           
            weight={4}              
          />
        )}

        {path.map((coord, index) => (
          <CircleMarker
            key={index}
            center={coord}
            radius={1.5} 
            color={activeAlgorithm === 'BFS' ? 'blue' : 'red'} 
            fillColor={activeAlgorithm === 'BFS' ? 'blue' : 'red'} 
            fillOpacity={1}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
