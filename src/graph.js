function computeSmallestStationsPath({ start, end, adjacentStops, mode }) {
  if (!stopExists(adjacentStops, start))
    throw new Error('Start stop does not exist');

  if (!stopExists(adjacentStops, end))
    throw new Error('End stop does not exist');

  const graph = computeGraph(adjacentStops, start, end, mode);
  return graph.dijkstra(start, end);
}

function verifyIfConnected({ start, end, adjacentStops, stationsToVerify }) {
  const filteredAdjacentStops = adjacentStops.filter((stop) => {
    return stationsToVerify.includes(stop.from_stop_unique_id) && stationsToVerify.includes(stop.to_stop_unique_id);
  });
  if (filteredAdjacentStops.length === 0)
    return false;
  const uniqueIds = filteredAdjacentStops
    .map(({ from_stop_unique_id, to_stop_unique_id }) => [from_stop_unique_id, to_stop_unique_id])
    .flat();
  if (!uniqueIds.includes(start) || !uniqueIds.includes(end))
    return false;

  const graph = computeGraph(filteredAdjacentStops, start, end);
  return graph.isConnectedTo(start, end);
}

function computeGraph(adjacentStops, start, end, mode = 'time') {
  const graph = new Graph();

  adjacentStops.forEach(({ from_stop_id, from_stop_unique_id, to_stop_id, to_stop_unique_id, duration }) => {
    graph.addNode(from_stop_id);
    graph.addNode(to_stop_id);
    graph.addEdge(from_stop_id, to_stop_id, mode === 'time' ? duration : 1);

    if (from_stop_unique_id === start || from_stop_unique_id === end) {
      graph.addNode(from_stop_unique_id);
      graph.addEdge(from_stop_unique_id, from_stop_id, 0);
    }

    if (to_stop_unique_id === end || to_stop_unique_id === start) {
      graph.addNode(to_stop_id);
      graph.addEdge(to_stop_id, to_stop_unique_id, 0);
    }
  });

  return graph;
}

function stopExists(adjacentStops, stopId) {
  return adjacentStops.some((stop) => {
    return stop.from_stop_unique_id === stopId || stop.to_stop_unique_id === stopId;
  });
}

class Graph {
  constructor() {
    this.nodes = {};
  }

  addNode(nodeId) {
    if (!this.nodes[nodeId])
      this.nodes[nodeId] = [];
  }

  addEdge(fromNodeId, toNodeId, weight) {
    this.nodes[fromNodeId].push({ to: toNodeId, weight });
  }

  dijkstra(startNodeId, endNodeId) {
    const distances = {};
    const visited = {};
    const previous = {};
    const queue = [];

    for (const nodeId in this.nodes) {
      if (nodeId === startNodeId)
        distances[nodeId] = 0;
      else
        distances[nodeId] = Number.POSITIVE_INFINITY;

      previous[nodeId] = null;
      queue.push(nodeId);
    }

    while (queue.length > 0) {
      queue.sort((a, b) => distances[a] - distances[b]);
      const currentNodeId = queue.shift();
      visited[currentNodeId] = true;

      this.nodes[currentNodeId].forEach((neighbor) => {
        if (!visited[neighbor.to]) {
          const newDistance = distances[currentNodeId] + neighbor.weight;
          if (newDistance < distances[neighbor.to]) {
            distances[neighbor.to] = newDistance;
            previous[neighbor.to] = currentNodeId;
          }
        }
      });
    }

    const path = [];
    let currentNodeId = endNodeId;
    const distance = distances[endNodeId];

    while (currentNodeId) {
      path.unshift(currentNodeId);
      currentNodeId = previous[currentNodeId];
    }

    return this.#formatResult({ path, distance });
  }

  #formatResult({ path, distance }) {
    return {
      path: path.slice(1, -1),
      distance,
    };
  }

  isConnectedTo(start, end, visited = {}) {
    if (start === end)
      return true;

    visited[start] = true;

    for (const neighbor of this.nodes[start]) {
      if (!visited[neighbor.to] && this.isConnectedTo(neighbor.to, end, visited))
        return true;
    }

    return false;
  }
}

export {
  computeSmallestStationsPath,
  verifyIfConnected,
};
