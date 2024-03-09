import * as bootstrap from 'bootstrap'
import * as d3 from "d3";

import arrondissements from "../assets/arrondissements.geojson"
import stationsData from "../assets/stations.geojson"
import linesData from "../assets/lines.geojson"
import { drawParis } from './map.js';
import { getSeededRandomStations, pickStations } from './pick-stations.js';

const stations = stationsData.features.filter((s) => {
  return s.properties.adjacentStations && s.properties.name;
});
const lines = linesData.features;

const svg = d3.select("svg");

const m = 353;
const b = -2175;
const scale = (x) => m * x + b;

const projection = d3.geoMercator()

function resizeMap() {
  const width = parseInt(svg.style('width'));
  const height = width * 0.825;
  projection
    .center([2.3522, 48.8566])
    .scale(scale(height))
    .translate([width / 2, height / 2])

  svg.attr("width", width).attr("height", height);
}

resizeMap();
window.addEventListener('resize', resizeMap);

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

  drawStation({ station, color });
  addPathBetweenStations(station, addedStations, lines);

  addedStations.set(stationName, station);
}

function drawStation({ station, color = '#0d47a1' }) {
  for (const coordinates of station.properties.coordinates) {
    g.append('circle')
      .attr('class', 'metro-station')
      .attr('cx', projection(coordinates)[0])
      .attr('cy', projection(coordinates)[1])
      .attr('r', 3)
      .style("fill", color)
      .on('mouseover', function (e, d) {
        tooltip.style('visibility', 'visible');
        tooltip.html(station.properties.name);
      })
      .on('mousemove', function (event) {
        const [x, y] = d3.pointer(event)
        tooltip.style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('visibility', 'hidden');
      });
  }

  g.append('path')
    .attr('d', d3.line()(station.properties.coordinates.map(c => projection(c))))
    .attr('stroke', color)
    .attr('stroke-width', 2)
    .attr('fill', 'none');
}

function addPathBetweenStations(newStation, addedStations, lines) {
  for (const newStationLine of newStation.properties.lines) {
    const filteredLines = lines.filter(l => l.properties.name === newStationLine)
    const adjacentStations = newStation.properties.adjacentStations[newStationLine];

    for (const adjacentStationName of adjacentStations) {
      if (!addedStations.has(adjacentStationName)) {
        continue;
      }

      const adjacentStation = addedStations.get(adjacentStationName);
      for (const line of filteredLines) {
        const lineCoordinates = line.geometry.type === 'LineString' ? line.geometry.coordinates : line.geometry.coordinates[0];

        const newStationIndex = newStation.properties.inLineIndex[newStationLine];
        const adjacentStationIndex = adjacentStation.properties.inLineIndex[newStationLine];

        if (lineCoordinates.length < newStationIndex && lineCoordinates.length < adjacentStationIndex) {
          continue;
        }

        let drawLine;
        if (newStationIndex < adjacentStationIndex) {
          drawLine = lineCoordinates.slice(newStationIndex, adjacentStationIndex + 1);
        } else {
          drawLine = lineCoordinates.slice(adjacentStationIndex, newStationIndex + 1);
        }

        g.append('path')
          .attr('d', d3.line()(drawLine.map(c => projection(c))))
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr('fill', 'none');
      }
    }
  }
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

drawParis({ svg, g, arrondissements, projection });
createStationsList();
handleClickOnTryButton();
initGame();