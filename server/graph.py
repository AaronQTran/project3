import osmnx as ox
import networkx as nx
import queue

G_loaded = ox.load_graphml("miami.graphml")
adj_list = nx.to_dict_of_lists(G_loaded)
print(f"Nodes: {len(G_loaded.nodes)}, Edges: {len(G_loaded.edges)}")
start_node = list(adj_list.keys())[0]  # random nodes
end_node = list(adj_list.keys())[10]   
def BFS(graph, start, end): 
    q = queue.Queue([start_node])
    visited = set([start_node]) 
    while not q.empty():
        curr = q.get() 
        for neighbor in graph[curr]: 
            if neighbor is end_node:
                return neighbor
            if neighbor not in visited:
                q.put(neighbor)
                visited.add(neighbor)


    return "no path"
 
