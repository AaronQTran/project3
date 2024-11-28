import osmnx as ox
import networkx as nx
import queue
from extensions import socketio
from state import stop_event
import heapq

G_loaded = ox.load_graphml("miami.graphml")
adj_list = nx.to_dict_of_lists(G_loaded)

start_node = list(adj_list.keys())[0]  

def find_nearest_node(lon, lat):
    try:
        nearest_node = ox.distance.nearest_nodes(G_loaded, lon, lat)
        return nearest_node
    except Exception as e:
        socketio.emit('error', {'message': f"Failed to find nearest node: {str(e)}"})
        return None

def bfs(end_coords):
    global stop_event
    end_node = find_nearest_node(*end_coords)
    q = queue.Queue()
    q.put(start_node)
    visited = set()
    visited.add(start_node)
    prev = {}

    while not q.empty():
        if stop_event.is_set(): 
            print('event stopped')
            socketio.emit('bfs_complete', {'message': 'Algorithm was canceled.'})
            return

        curr = q.get() 
        curr_lat, curr_lon = G_loaded.nodes[curr]['y'], G_loaded.nodes[curr]['x']
        socketio.emit('bfs_update', {'current_coords': [curr_lat, curr_lon]})
        socketio.sleep(0.01)

        for neighbor in adj_list[curr]:
            if stop_event.is_set():  
                print('thread is stopped')
                socketio.emit('bfs_complete', {'message': 'Algorithm was canceled.'})
                return
            if neighbor == end_node:
                print('shortest path found')
                prev[neighbor] = curr
                path = []
                while neighbor in prev:
                    path.append([G_loaded.nodes[neighbor]['y'], G_loaded.nodes[neighbor]['x']])
                    neighbor = prev[neighbor]
                path.reverse()
                socketio.emit('bfs_complete', {'shortest_path': path, 'distance': len(path)})
                return
            if neighbor not in visited:
                q.put(neighbor)
                visited.add(neighbor)
                prev[neighbor] = curr

    socketio.emit('bfs_complete', {'message': 'No path found.'})

def dijkstras(end_coords):
    global stop_event
    
    end_node = find_nearest_node(*end_coords)
    if end_node is None:
        socketio.emit('error', {'message': 'Failed to find end node.'})
        return

    min_heap = [(0, start_node, [])]  
    visited_nodes = set()
    
    while min_heap:
        if stop_event.is_set():
            socketio.emit('bfs_complete', {'message': 'Algorithm was canceled.'})
            return

        curr_distance, curr_node, curr_path = heapq.heappop(min_heap)
        if curr_node in visited_nodes:
            continue
        
        visited_nodes.add(curr_node)
        curr_path = curr_path + [curr_node]
        
        curr_lat, curr_lon = G_loaded.nodes[curr_node]['y'], G_loaded.nodes[curr_node]['x']
        socketio.emit('bfs_update', {'current_coords': [curr_lat, curr_lon]})
        socketio.sleep(0.01)  

        if curr_node == end_node:
            path_coords = [[G_loaded.nodes[node]['y'], G_loaded.nodes[node]['x']] for node in curr_path]
            socketio.emit('bfs_complete', {'shortest_path': path_coords, 'distance': curr_distance})
            return
        
        for neighbor in adj_list[curr_node]:
            if neighbor not in visited_nodes:
                edge_data = G_loaded[curr_node][neighbor][0]  
                edge_distance = edge_data.get('length', 1)  
                heapq.heappush(min_heap, (curr_distance + edge_distance, neighbor, curr_path))

    socketio.emit('bfs_complete', {'message': 'No path found.'})
