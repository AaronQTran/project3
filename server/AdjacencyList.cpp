#include <iostream>
#include <unordered_map>
#include <sstream>
#include <map>
#include <iomanip>
#include <string>
#include <vector>
#include <unordered_set>
using namespace std;

class AdjacencyList{

    private: 
        unordered_set<pair<double,double>> nodes;
        unordered_map<pair<double,double>, unordered_set<pair<double,double>>> adjList;
        int edges;
    public:
        //parse minneaplis.geojson coordinates and turn it into a graph. Do parsing in parse.cpp and then call add_edge. Search up to how parse geojsons, its like looping through a vector. 
        //also before u add an edge u should check if that node is already in the adjList because intersections hold common nodes between two roads. 
        void add_edge(pair<double,double> node1, pair<double, double> node2){ 
            nodes.insert(node1);
            nodes.insert(node2);
            int sizeBefore = adjList[node1].size(); 
            adjList[node1].insert(node2);
            if(sizeBefore != adjList[node1].size()){
                edges++;
            } 
            sizeBefore = adjList[node2].size(); 
            adjList[node2].insert(node1);
            if(sizeBefore != adjList[node2].size()){
                edges++;
            }
        }


};
