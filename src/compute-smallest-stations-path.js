function computeSmallestStationsPath({ start, end, stations }) {
  if (!stationExists(stations, start)) {
    throw new Error('Start station does not exist');
  }
  if (!stationExists(stations, end)) {
    throw new Error('End station does not exist');
  }
  const graph = computeGraph(stations);
  return graph.dijkstra(start, end);
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

function stationExists(stations, stationName) {
  return stations.some((station) => {
    return station.properties.name === stationName;
  });
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

export {
  computeSmallestStationsPath
}
