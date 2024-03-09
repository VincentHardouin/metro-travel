import * as d3 from 'd3';

function drawParis({ svg, g, arrondissements, projection }){
  g.selectAll("path")
    .data(arrondissements.features)
    .join("path")
    .attr("fill", "grey")
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    .style("stroke", "none")

  function zoomed(event) {
    g.attr("transform", event.transform);
  }

  const zoom = d3.zoom()
    .scaleExtent([1, 8]) // Set the zoom scale's allowed range
    .on("zoom", zoomed);

  svg.call(zoom);

  svg.on("wheel", function(event) {
    event.preventDefault(); // Prevent the default scroll behavior
    const delta = event.deltaY;
    const scale = delta > 0 ? 1.2 : 0.8; // Determine whether to zoom in or out based on the direction of the scroll
    svg.transition().call(zoom.scaleBy, scale);
  });
}

const m = 353;
const b = -2175;
const scale = (x) => m * x + b;
function resizeMap({ svg, projection }) {
  const width = parseInt(svg.style('width'));
  const height = width * 0.825;
  projection
    .center([2.3522, 48.8566])
    .scale(scale(height))
    .translate([width / 2, height / 2])

  svg.attr("width", width).attr("height", height);
}

function drawStation({ station, color = '#0d47a1', g, projection, tooltip }) {
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

function addPathBetweenStations({ newStation, addedStations, lines, g, projection }) {
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

export {
  addPathBetweenStations,
  drawParis,
  drawStation,
  resizeMap,
}