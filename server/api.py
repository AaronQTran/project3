from flask import Flask, request, jsonify
from flask_cors import CORS
from extensions import socketio
from graph import bfs, dijkstras
from state import running_task, running_algorithm, stop_event
import threading
import heapq

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})  

socketio.init_app(app, cors_allowed_origins="*")  

@app.route('/api/start_algorithm', methods=['POST'])
def start_algorithm():
    global running_task, running_algorithm, stop_event
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    algorithm = data.get('algorithm')
    end_lat = data.get('end_lat')
    end_lon = data.get('end_lon')

    if algorithm is None or end_lat is None or end_lon is None:
        return jsonify({"error": "Missing parameters"}), 400

    end_coords = (end_lon, end_lat)

    if running_task and running_task.is_alive():
        stop_event.set()
        running_task.join()
        stop_event.clear()

    # Start the new task
    running_algorithm = algorithm
    if algorithm == "BFS":
        running_task = threading.Thread(target=bfs, args=(end_coords,))
    elif algorithm == "DJK":
        running_task = threading.Thread(target=dijkstras, args=(end_coords,))
    else:
        return jsonify({"error": "Invalid algorithm"}), 400

    running_task.start()
    return jsonify({"message": f"{algorithm} started"}), 200

@socketio.on('stop_algorithm')
def handle_stop_algorithm():
    global stop_event, running_task
    if running_task and running_task.is_alive():
        stop_event.set()
        running_task.join()
        stop_event.clear()

if __name__ == '__main__':
    print("Server is running on port 5000")
    socketio.run(app, debug=False, host='0.0.0.0', port=5000)  
