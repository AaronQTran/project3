import osmnx as ox
import networkx as nx
import queue
from extensions import socketio  # Import from the new file
import time

"""
G = ox.graph_from_place('Miami, Florida, USA', network_type='drive')
G1 = ox.graph_from_place('Miami, Florida, USA', network_type='walk')
G2 = nx.compose(G,G1)
ox.save_graphml(G2, 'miami.graphml')
"""
G_loaded = ox.load_graphml("miami.graphml")
adj_list = nx.to_dict_of_lists(G_loaded)
#print(f"Nodes: {len(G_loaded.nodes)}, Edges: {len(G_loaded.edges)}")

start_node = list(adj_list.keys())[0]  # random nodes
#end_node = list(adj_list.keys())[10]   

def find_nearest_node(lon, lat): #in lon lat format, not lat lon
    try:
        nearest_node = ox.distance.nearest_nodes(G_loaded, lon, lat)
        return nearest_node
    except Exception as e:
        socketio.emit('error', {'message': f"Failed to find nearest node: {str(e)}"})
        return None

def bfs(end_coords):
    end_node = find_nearest_node(*end_coords)
    print(end_node)
    q = queue.Queue() 
    q.put(start_node)
    visited = set()  
    visited.add(start_node)
    dist = queue.Queue()
    dist.put(0)

    while not q.empty():
        curr = q.get()
        newd = dist.get()

        #get lat and longof the current node
        curr_lat, curr_lon = G_loaded.nodes[curr]['y'], G_loaded.nodes[curr]['x']
        socketio.emit('bfs_update', {'current_coords': [curr_lat, curr_lon], 'distance': newd})
        
        # time.sleep(0.5)
        socketio.sleep(0.01)

        for neighbor in adj_list[curr]: 
            if neighbor == end_node:
                neighbor_lat, neighbor_lon = G_loaded.nodes[neighbor]['y'], G_loaded.nodes[neighbor]['x']
                socketio.emit('bfs_complete', {'end_coords': [neighbor_lat, neighbor_lon], 'distance': newd + 1})
                print('finished')
                print(end_node)
                return newd + 1
            if neighbor not in visited:
                q.put(neighbor)
                visited.add(neighbor)
                dist.put(newd + 1)

    socketio.emit('bfs_complete', {'message': 'No path found'})
    return "no path"

def dijkstras(end):
    print('dijkstras')

#print(bfs(end_node))


 
