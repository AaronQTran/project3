import osmnx as ox
import networkx as nx
import queue
"""
G = ox.graph_from_place('Miami, Florida, USA', network_type='drive')
G1 = ox.graph_from_place('Miami, Florida, USA', network_type='walk')
G2 = nx.compose(G,G1)
ox.save_graphml(G2, 'miami.graphml')
"""
G_loaded = ox.load_graphml("miami.graphml")
adj_list = nx.to_dict_of_lists(G_loaded)
print(f"Nodes: {len(G_loaded.nodes)}, Edges: {len(G_loaded.edges)}")

start_node = list(adj_list.keys())[0]  # random nodes
end_node = list(adj_list.keys())[10]   
def BFS(graph, start, end): 
    q = queue.Queue()  
    
    q.put(start)
    visited = set()  
    visited.add(start)
    dist = queue.Queue()
    dist.put(0)
    while not q.empty():
        curr = q.get()   
        #print q to the map
        newd = dist.get() 
        #Fix distnace to be euclidean distance
        for neighbor in graph[curr]: 
            if neighbor == end:
                return newd
            if neighbor not in visited:
                q.put(neighbor)
                visited.add(neighbor) 
                dist.put(newd+1)

    return "no path"
print(BFS(adj_list,start_node,end_node))


 
