import * as d3 from "d3";

import arrondissements from "../assets/arrondissements.geojson"
import stationsData from "../assets/stations.geojson"

const stations = stationsData.features;

const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

const projection = d3.geoMercator()
  .center([2.3522, 48.8566])
  .scale(200000)
  .translate([ width/2, height/2 ])

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

function printAllStations() {
  svg.selectAll('.metro-station')
    .data(stations)
    .enter()
    .append('circle')
    .attr('class', 'metro-station')
    .attr('cx', function(d) { return projection(d.geometry.coordinates)[0]; })
    .attr('cy', function(d) { return projection(d.geometry.coordinates)[1]; })
    .attr('r', 3)
    .style("fill", "red")
    .on('mouseover', function(e, d) {
      tooltip.style('visibility', 'visible');
      tooltip.html(d.properties.name);
    })
    .on('mousemove', function(event) {
      const [x, y] = d3.pointer(event)
      tooltip.style('top', (y - 10) + 'px')
        .style('left', (x + 10) + 'px');
    })
    .on('mouseout', function() {
      tooltip.style('visibility', 'hidden');
    });
}

function addStation(stationName) {
  if (addedStations.has(stationName)) {
    return;
  }
  const station = stations.find(d => d.properties.name === stationName);
  addedStations.set(stationName, station);

  svg.append('circle')
    .attr('class', 'metro-station')
    .attr('cx', projection(station.geometry.coordinates)[0])
    .attr('cy', projection(station.geometry.coordinates)[1])
    .attr('r', 3)
    .style("fill", "red")
    .on('mouseover', function(e, d) {
      tooltip.style('visibility', 'visible');
      tooltip.html(station.properties.name);
    })
    .on('mousemove', function(event) {
      const [x, y] = d3.pointer(event)
      tooltip.style('top', (y - 10) + 'px')
        .style('left', (x + 10) + 'px');
    })
    .on('mouseout', function() {
      tooltip.style('visibility', 'hidden');
    });
}

function handleClickOnTryButton() {
  document.getElementById('try').addEventListener('click', function() {
    const stationName = document.getElementById('station').value;
    addStation(stationName);
  });

}

drawParis();
createStationsList();
handleClickOnTryButton();