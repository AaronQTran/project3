import osmnx as ox
import networkx as nx
import queue
import heapq
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

def Dijsktra(graph, start, end):
    minHeap = [(0,start,[])] # distance, source, currentPath
    shortestPath = {} # keeps track of the shortest path to nodes
    visitedNodes = set() # tracks visited nodes

    while minHeap:
        currDistance, currNode, currPath = heapq.heappop(minHeap)
        if (currNode in visitedNodes):
            continue

        visitedNodes.add(currNode)

        currPath = currPath + [currNode]
        shortestPath[currNode] = currDistance

        if (currNode == end):
            return currPath
        
        # going through the adjacent nodes of the current node
        for adjacentNode in graph[currNode]:
            if (adjacentNode not in visitedNodes):
                # edge information
                edge_data = graph[currNode][adjacentNode][0]
                edgeDistance = edge_data.get('length')
                heapq.heappush(minHeap, (currDistance + edgeDistance, adjacentNode, currPath))

    return "no path found"

path = Dijsktra(G_loaded, start_node, end_node)
print(f"Dijsktra Path: {path}")

#COMPARE DIJSKTRA WITH NETWORKS DIJSKTRA
#nx_distance = nx.shortest_path_length(G_loaded, source=start_node, target=end_node, weight='length')
#print(f"NetworkX Dijkstra Distance: {nx_distance}")
