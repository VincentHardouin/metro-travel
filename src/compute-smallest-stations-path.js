import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

let __dirname = dirname(fileURLToPath(import.meta.url));

function getStations() {
  const stationsPath = join(__dirname, '../assets/stations.geojson');
  const { features: stations } = JSON.parse(fs.readFileSync(stationsPath));
  return stations.filter((s) => {
    return s.properties.adjacentStations && s.properties.name;
  });
}

function main() {
  const start = 'La Fourche';
  const end = 'Europe';

  const filteredStations = getStations();
  const graph = computeGraph(filteredStations);

  let shortestPathInfo = graph.dijkstra(start, end);

  if (shortestPathInfo) {
    console.log(`Le chemin le plus court entre ${start} et ${end} est ${shortestPathInfo.path.join(' -> ')} avec une distance de ${shortestPathInfo.distance}`);
  } else {
    console.log(`Il n'y a pas de chemin entre ${start} et ${end}`);
  }
}

function computeGraph(stations) {
  const graph = new Graph();

  stations.forEach((station) => {
    const adjacentStations = station.properties.adjacentStations;
    const stationName = station.properties.name;

    const newAdjacentStations = {};

    Object.keys(adjacentStations).forEach((line) => {
      const adjacentStationsSet = adjacentStations[line];
      adjacentStationsSet.forEach((adjacentStation) => {
        const adjacentStationName = adjacentStation;
        const distance = 1;
        newAdjacentStations[adjacentStationName] = distance;
      });
    });

    graph.addNode(stationName, newAdjacentStations);
  });
  return graph;
}

class Graph {
  constructor() {
    this.nodes = {};
  }

  addNode(name, edges) {
    this.nodes[name] = edges;
  }

  dijkstra(start, end) {
    let shortestDistances = {};
    let predecessors = {};
    let unseenNodes = Object.assign({}, this.nodes);

    for (let node in this.nodes) {
      shortestDistances[node] = Infinity;
    }
    shortestDistances[start] = 0;

    while (Object.keys(unseenNodes).length > 0) {
      let currentNode = this.getMinNode(shortestDistances, unseenNodes);
      let neighbors = this.nodes[currentNode];

      for (let neighbor in neighbors) {
        let distance = neighbors[neighbor];
        if (distance + shortestDistances[currentNode] < shortestDistances[neighbor]) {
          shortestDistances[neighbor] = distance + shortestDistances[currentNode];
          predecessors[neighbor] = currentNode;
        }
      }
      delete unseenNodes[currentNode];
    }

    let path = [end];
    let predecessor = predecessors[end];
    while (predecessor) {
      path.unshift(predecessor);
      predecessor = predecessors[predecessor];
    }

    if (shortestDistances[end] !== Infinity) {
      return {
        path: path,
        distance: shortestDistances[end]
      };
    } else {
      return null;
    }
  }

  getMinNode(distances, nodes) {
    let minDistance = Infinity;
    let minNode = null;
    for (let node in nodes) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        minNode = node;
      }
    }
    return minNode;
  }
}

main()