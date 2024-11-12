#include <iostream>
#include <unordered_map>
#include <sstream>
#include <map>
#include <iomanip>
#include <string>
#include <vector>
using namespace std;

class AdjacencyList{

    private:
        unordered_map<string, vector<string>> adjList;
        unordered_map<string, int> outdegree;
    public:
        //parse minneaplis.geojson coordinates and turn it into a graph. Do parsing in parse.cpp and then call add_edge. Search up to how parse geojsons, its like looping through a vector. 
        //also before u add an edge u should check if that node is already in the adjList because intersections hold common nodes between two roads. 
        void add_edge(){
            
        }


};
