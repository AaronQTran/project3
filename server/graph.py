import osmnx as ox
import networkx as nx
from collections import deque
import math
import heapq

G_loaded = ox.load_graphml("miami.graphml")
adj_list = nx.to_dict_of_lists(G_loaded)
print(f"Nodes: {len(G_loaded.nodes)}, Edges: {len(G_loaded.edges)}")