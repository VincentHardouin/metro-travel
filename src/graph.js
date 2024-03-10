function computeSmallestStationsPath({ start, end, stations }) {
  if (!stationExists(stations, start))
    throw new Error('Start station does not exist');

  if (!stationExists(stations, end))
    throw new Error('End station does not exist');

  const graph = computeGraph(stations);
  return graph.dijkstra(start, end);
}

function verifyIfConnected({ start, end, stations }) {
  const graph = computeGraph(stations);
  return graph.isConnectedTo(start, end);
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
    const shortestDistances = {};
    const predecessors = {};
    const unseenNodes = Object.assign({}, this.nodes);

    for (const node in this.nodes)
      shortestDistances[node] = Number.POSITIVE_INFINITY;

    shortestDistances[start] = 0;

    while (Object.keys(unseenNodes).length > 0) {
      const currentNode = this.getMinNode(shortestDistances, unseenNodes);
      const neighbors = this.nodes[currentNode];

      for (const neighbor in neighbors) {
        const distance = neighbors[neighbor];
        if (distance + shortestDistances[currentNode] < shortestDistances[neighbor]) {
          shortestDistances[neighbor] = distance + shortestDistances[currentNode];
          predecessors[neighbor] = currentNode;
        }
      }
      delete unseenNodes[currentNode];
    }

    const path = [end];
    let predecessor = predecessors[end];
    while (predecessor) {
      path.unshift(predecessor);
      predecessor = predecessors[predecessor];
    }

    if (shortestDistances[end] !== Number.POSITIVE_INFINITY) {
      return {
        path,
        distance: shortestDistances[end],
      };
    }
    else {
      return null;
    }
  }

  isConnectedTo(start, end, visited = {}) {
    if (start === end)
      return true;

    visited[start] = true;
    for (const neighbor in this.nodes[start]) {
      if (!visited[neighbor] && this.isConnectedTo(neighbor, end, visited))
        return true;
    }
    return false;
  }

  getMinNode(distances, nodes) {
    let minDistance = Number.POSITIVE_INFINITY;
    let minNode = null;
    for (const node in nodes) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        minNode = node;
      }
    }
    return minNode;
  }
}

export {
  computeSmallestStationsPath,
  verifyIfConnected,
};
