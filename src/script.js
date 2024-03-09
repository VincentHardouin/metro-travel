import * as bootstrap from 'bootstrap'
import * as d3 from "d3";

import arrondissements from "../assets/arrondissements.geojson"
import stationsData from "../assets/stations.geojson"
import linesData from "../assets/lines.geojson"
import {addPathBetweenStations, drawParis, drawStation, resizeMap} from './map.js';
import { getSeededRandomStations, pickStations } from './pick-stations.js';

const stations = stationsData.features.filter((s) => {
  return s.properties.adjacentStations && s.properties.name;
});
const lines = linesData.features;

const svg = d3.select("svg");

const projection = d3.geoMercator()

window.addEventListener('resize', () => { resizeMap({ svg, projection }) });

const tooltip = d3.select('body').append('div')
  .attr('class', 'map-tooltip')

const addedStations = new Map();
const g = svg.append("g");

function createStationsList() {
  const sortedStations = stations.map((d) => d.properties.name).sort();
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

const sortedStations = stations.map((d) => d.properties.name).sort();

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

  drawStation({ station, color, g, projection, tooltip });
  addPathBetweenStations({ newStation: station, addedStations, lines, g, projection });

  addedStations.set(stationName, station);
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

resizeMap({ svg, projection });
drawParis({ svg, g, arrondissements, projection});
createStationsList();
handleClickOnTryButton();
initGame();