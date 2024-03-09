import * as bootstrap from 'bootstrap'
import arrondissements from "../assets/arrondissements.geojson"
import stationsData from "../assets/stations.geojson"
import linesData from "../assets/lines.geojson"
import { ParisMap } from './map.js';
import { getSeededRandomStations, pickStations } from './pick-stations.js';

const stations = stationsData.features.filter((s) => {
  return s.properties.adjacentStations && s.properties.name;
});
const sortedStations = stations.map((d) => d.properties.name).sort();
const lines = linesData.features;

const map = new ParisMap({ arrondissements, stations, lines });

const addedStations = new Map();

function createEventsForStationsList() {
  const dropdown = document.getElementById('stations')
  const input = document.getElementById('station');
  input.addEventListener('click', function (event) {
    event.stopPropagation();
    handleDropDownVisibility(input, dropdown);
  });
  input.addEventListener('input', function () {
    handleDropDownVisibility(input, dropdown);
  });
}

function handleDropDownVisibility(input, dropdown) {
  const value = input.value;
  if (value.length > 0) {
    showDropdown(input, dropdown, value);
  } else {
    hideDropdown(input, dropdown);
  }
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
  const filteredStations = sortedStations.filter((name) => name.toLowerCase().includes(value.toLowerCase()));
  dropdown.innerHTML = '';
  filteredStations.forEach((name) => {
    dropdown.appendChild(createDropdownStation(name));
  })
}

function createDropdownStation(stationName) {
  const button = document.createElement('button');
  button.innerText = stationName;
  button.classList.add('dropdown-item');
  button.addEventListener('click', addNameToInput);
  const li = document.createElement('li');
  li.appendChild(button);
  return li;
}

function addNameToInput(event) {
  const stationName = event.target.innerText;
  document.getElementById('station').value = stationName;
}

function addStation({ stationName, color }) {
  if (addedStations.has(stationName)) {
    return;
  }
  const station = stations.find(d => d.properties.name === stationName);
  const adjacentStations = findAdjacentStations({ station, lines, addedStations });
  map.addStation({ station, color, adjacentStations });
  addedStations.set(stationName, station);
}

function findAdjacentStations({ station, lines, addedStations }) {
  let adjacentStations = [];
  for (const newStationLine of station.properties.lines) {
    const lineAdjacentStations = station.properties.adjacentStations[newStationLine];

    for (const adjacentStationName of lineAdjacentStations) {
      if (!addedStations.has(adjacentStationName)) {
        continue;
      }
      adjacentStations.push(addedStations.get(adjacentStationName));
    }
  }
  return adjacentStations;
}

function handleClickOnTryButton() {
  document.getElementById('try').addEventListener('click', function () {
    const stationName = document.getElementById('station').value;
    addStation({ stationName });
  });
}

function initGame() {
  const date = new Date();
  const dateToSeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const pick = pickStations({ stations, random: getSeededRandomStations(dateToSeed) });
  document.getElementById('instruction').innerHTML = `Aujourd'hui, nous allons de <span class="start">${pick.start}</span> jusqu'à <span class="end">${pick.end}</span> en passant par le moins de stations possible.`
  addStation({ stationName: pick.start, color: '#008a22' });
  addStation({ stationName: pick.end, color: '#e52228' });
}

createEventsForStationsList();
handleClickOnTryButton();
initGame();