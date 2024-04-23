import arrondissements from '../assets/arrondissements.geojson';
import { getSeededRandomStations, pickStations } from './pick-stations.js';
import { getAdjacentStops, getRoutes, getStops, getUniqueStops } from './utils.js';
import { ParisMap } from './map.js';
import { verifyIfConnected } from './graph.js';

const stations = getUniqueStops();
const adjacentStops = getAdjacentStops();
const routes = getRoutes();
const stops = getStops();

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class AlreadyAddedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AlreadyAddedError';
  }
}

export class Game {
  constructor(seed) {
    this.pick = pickStations({ stations, adjacentStops, random: getSeededRandomStations(seed) });
    this.instruction = `Aujourd'hui, nous allons de <span class="start">${this.pick.start.stop_name}</span> jusqu'à <span class="end">${this.pick.end.stop_name}</span> en passant par le moins de stations possible.`;
    this.addedStations = new Map();
    this.adjacentStops = adjacentStops;
  }

  init() {
    this.parisMap = new ParisMap({ arrondissements, stations, lines: routes });
    this.addStation({ station: this.pick.start.stop_name, color: '#008a22' });
    this.addStation({ station: this.pick.end.stop_name, color: '#e52228' });
  }

  addStation({ station, color }) {
    const foundStation = stations.find(d => d.stop_name === station);
    if (!foundStation)
      throw new NotFoundError(`Station ${station} not found`);
    const stationUniqueId = foundStation.stop_unique_id;
    if (this.addedStations.has(stationUniqueId))
      throw new AlreadyAddedError(`Station ${station} already added`);

    const foundAdjacentStops = this.findAdjacentStops({
      pickStation: foundStation,
    });
    this.parisMap.addStation({ station: foundStation, color, adjacentStops: foundAdjacentStops });
    this.addedStations.set(stationUniqueId, foundStation);
    return this.isFinished({ addedStations: this.addedStations, pick: this.pick });
  }

  findAdjacentStops({ pickStation }) {
    const filteredAdjacentStationForPickedStation = this.adjacentStops.filter((adjacentStop) => {
      return adjacentStop.from_stop_unique_id === pickStation.stop_unique_id || adjacentStop.to_stop_unique_id === pickStation.stop_unique_id;
    });
    return filteredAdjacentStationForPickedStation.filter((adjacentStop) => {
      return this.addedStations.has(adjacentStop.from_stop_unique_id) || this.addedStations.has(adjacentStop.to_stop_unique_id);
    });
  }

  isFinished() {
    return verifyIfConnected({
      start: this.pick.start.stop_unique_id,
      end: this.pick.end.stop_unique_id,
      stationsToVerify: [...this.addedStations.keys()],
      adjacentStops: this.adjacentStops,
    });
  }

  getInformation() {
    return {
      minTry: this.pick.path.length - 2,
      try: this.addedStations.size - 2,
      stops: this.pick.path.map((stopId) => {
        const { stop_unique_id, route_id } = stops.find(d => d.stop_id === stopId);
        const stopName = stations.find(d => d.stop_unique_id === stop_unique_id).stop_name;
        const line = routes.find(d => d.route_id === route_id);
        return `${stopName} - Ligne ${line.route_short_name}`;
      }),
    };
  }

  getAddedStops() {
    return [...this.addedStations.values()].filter(stop => stop.stop_name !== this.pick.start.stop_name && stop.stop_name !== this.pick.end.stop_name);
  }

  toggleStop(stopId) {
    if (this.addedStations.has(stopId))
      this.removeStation(stopId);
    else
      this.addStation({ station: stations.find(d => d.stop_unique_id === stopId).stop_name });
  }

  removeStation(stopId) {
    this.addedStations.delete(stopId);
    this.parisMap.removeStation(stopId);
  }
}
