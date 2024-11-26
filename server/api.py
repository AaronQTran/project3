from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from extensions import socketio
from graph import bfs, dijkstras

app = Flask(__name__)
CORS(app)  
socketio.init_app(app, cors_allowed_origins="http://localhost:3000") #possibly update with frontend url !!!!!!!!!!!!!!!

@app.route('/api/start_algorithm', methods=['POST']) #takes in algo and end coords
def start_algorithm():
    data = request.get_json()
    print("Received data in backend:", data)
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    algorithm = data.get('algorithm')
    end_lat = data.get('end_lat')  
    end_lon = data.get('end_lon')  

    if algorithm is None or end_lat is None or end_lon is None:
        return jsonify({"error": "Missing parameters"}), 400

    end_coords = (end_lon, end_lat) #switch to lon lat 
    print(end_coords)
    
    if algorithm == "BFS":
        socketio.start_background_task(bfs, end_coords)
    elif algorithm == "DJK":
        socketio.start_background_task(dijkstras, end_coords)
    else:
        return jsonify({"error": "Invalid algorithm"}), 400

    return jsonify({"message": f"{algorithm} started"}), 200
    

if __name__ == '__main__':
    print("Server is running on port 5000")  
    socketio.run(app, debug=False, port=5000)


