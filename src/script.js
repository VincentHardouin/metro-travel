import * as d3 from "d3";

import arrondissements from "../assets/arrondissements.geojson"
import stationsData from "../assets/stations.geojson"
import linesData from "../assets/lines.geojson"
import {getSeededRandomStations, pickStations} from './pick-stations.js';

const stations = stationsData.features.filter((s) => {
  return s.properties.adjacentStations && s.properties.name;
});
const lines = linesData.features;

const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

const projection = d3.geoMercator()
  .center([2.3522, 48.8566])
  .scale(200000)
  .translate([width / 2, height / 2])

const tooltip = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('position', 'absolute')
  .style('background-color', 'white')
  .style('border', '1px solid black')
  .style('padding', '5px')
  .style('border-radius', '5px')
  .style('visibility', 'hidden');

const addedStations = new Map();

function drawParis() {
  svg.append("g")
    .selectAll("path")
    .data(arrondissements.features)
    .join("path")
    .attr("fill", "grey")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", "none")
}

function createStationsList() {
  const stationsList = stations.map((d) => {
    const el = document.createElement('option')
    el.value = d.properties.name
    return el.outerHTML
  })
  document.getElementById('stations').innerHTML = stationsList;
}

function addStation(stationName) {
  if (addedStations.has(stationName)) {
    return;
  }
  const station = stations.find(d => d.properties.name === stationName);

  drawStation(station);
  addPathBetweenStations(station, addedStations, lines);

  addedStations.set(stationName, station);
}

function drawStation(station) {
  for (const coordinates of station.properties.coordinates) {
    svg.append('circle')
      .attr('class', 'metro-station')
      .attr('cx', projection(coordinates)[0])
      .attr('cy', projection(coordinates)[1])
      .attr('r', 3)
      .style("fill", "#0d47a1")
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

  svg.append('path')
    .attr('d', d3.line()(station.properties.coordinates.map(c => projection(c))))
    .attr('stroke', '#0d47a1')
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

        svg.append('path')
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
    addStation(stationName);
  });
}

function initGame() {
  const date = new Date();
  const dateToSeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const pick = pickStations({ stations, random: getSeededRandomStations(dateToSeed) });
  document.getElementById('instruction').innerText = `Aujourd'hui, nous allons de ${pick.start} jusqu'à ${pick.end}`
}

drawParis();
createStationsList();
handleClickOnTryButton();
initGame();