import * as bootstrap from 'bootstrap';
import arrondissements from '../assets/arrondissements.geojson';
import { ParisMap } from './map.js';
import { getSeededRandomStations, pickStations } from './pick-stations.js';
import { verifyIfConnected } from './graph.js';
import { searchStations } from './utils.front.js';
import { getAdjacentStops, getRoutes, getStops, getUniqueStops } from './utils.js';

const stations = getUniqueStops();
const adjacentStops = getAdjacentStops();
const sortedStations = stations.map(d => d.stop_name).sort();
const routes = getRoutes();
const stops = getStops();

const map = new ParisMap({ arrondissements, stations, lines: routes });

const addedStations = new Map();

function createEventsForStationsList() {
  const dropdown = document.getElementById('stations');
  const input = document.getElementById('station');
  input.addEventListener('click', (event) => {
    event.stopPropagation();
    handleDropDownVisibility(input, dropdown);
  });
  input.addEventListener('input', () => {
    input.classList.remove('is-invalid');
    handleDropDownVisibility(input, dropdown);
  });
}

function handleDropDownVisibility(input, dropdown) {
  const value = input.value;
  if (value.length > 0)
    showDropdown(input, dropdown, value);
  else
    hideDropdown(input, dropdown);
}

function hideDropdown(input, dropdown) {
  input.classList.remove('show');
  dropdown.classList.remove('show');
  dropdown.setAttribute('aria-expanded', 'false');
}

function showDropdown(input, dropdown, value) {
  input.classList.add('show');
  dropdown.classList.add('show');
  dropdown.setAttribute('aria-expanded', 'true');
  const filteredStations = searchStations(value, sortedStations).filter(station => !addedStations.has(station));
  dropdown.innerHTML = '';
  filteredStations.forEach((name) => {
    dropdown.appendChild(createDropdownStation(name));
  });
}

function createDropdownStation(stationName) {
  const button = document.createElement('button');
  button.textContent = stationName;
  button.classList.add('dropdown-item');
  button.addEventListener('click', addNameToInput);
  const li = document.createElement('li');
  li.appendChild(button);
  return li;
}

function addNameToInput(event) {
  document.getElementById('station').value = event.target.textContent;
}

function addStation({ station, color }) {
  const stationUniqueId = station.stop_unique_id;
  if (addedStations.has(stationUniqueId))
    return;

  const foundAdjacentStops = findAdjacentStops({
    pickStation: station,
    addedStations,
    adjacentStops,
  });
  map.addStation({ station, color, adjacentStops: foundAdjacentStops });
  addedStations.set(stationUniqueId, station);
}

function findAdjacentStops({ pickStation, addedStations, adjacentStops }) {
  const filteredAdjacentStationForPickedStation = adjacentStops.filter((adjacentStop) => {
    return adjacentStop.from_stop_unique_id === pickStation.stop_unique_id || adjacentStop.to_stop_unique_id === pickStation.stop_unique_id;
  });
  return filteredAdjacentStationForPickedStation.filter((adjacentStop) => {
    return addedStations.has(adjacentStop.from_stop_unique_id) || addedStations.has(adjacentStop.to_stop_unique_id);
  });
}

function handleClickOnTryButton({ pick }) {
  document.getElementById('try').addEventListener('click', () => {
    const input = document.getElementById('station');
    const stationName = input.value;
    const station = stations.find(d => d.stop_name === stationName);
    if (station) {
      addStation({ station });
      input.value = '';
      isFinished({ addedStations, pick });
    }
    else {
      input.classList.add('is-invalid');
    }
  });
}

function isFinished({ addedStations, pick }) {
  const isFinished = verifyIfConnected({
    start: pick.start.stop_unique_id,
    end: pick.end.stop_unique_id,
    stationsToVerify: [...addedStations.keys()],
    adjacentStops,
  });
  if (isFinished) {
    const modal = new bootstrap.Modal(document.getElementById('finish-modal'));
    const result = document.getElementById('result');
    result.innerHTML = `<p>Bravo, tu as réussi à relier les deux stations en ${addedStations.size - 2} stations ! 🎉</p><p>Voici le chemin optimal en ${pick.path.length - 2} stations : </p>`;
    const list = document.createElement('ul');
    for (let i = 0; i < pick.path.length; i++) {
      const stationId = pick.path[i];
      const { stop_unique_id, route_id } = stops.find(d => d.stop_id === stationId);
      const stopName = stations.find(d => d.stop_unique_id === stop_unique_id).stop_name;
      const line = routes.find(d => d.route_id === route_id);
      const li = document.createElement('li');
      li.textContent = `${stopName} - Ligne ${line.route_short_name}`;
      if (i === 0)
        li.classList.add('start');
      else if (i === pick.path.length - 1)
        li.classList.add('end');

      list.appendChild(li);
    }
    result.appendChild(list);
    modal.show();
  }
}

function initGame() {
  const date = new Date();
  const dateToSeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const pick = pickStations({ stations, adjacentStops, random: getSeededRandomStations(dateToSeed) });
  document.getElementById('instruction').innerHTML = `Aujourd'hui, nous allons de <span class="start">${pick.start.stop_name}</span> jusqu'à <span class="end">${pick.end.stop_name}</span> en passant par le moins de stations possible.`;
  addStation({ station: pick.start, color: '#008a22' });
  addStation({ station: pick.end, color: '#e52228' });
  return pick;
}

createEventsForStationsList();
const pick = initGame();
handleClickOnTryButton({ pick });
