import * as d3 from 'd3';


class ParisMap {

  #arrondissements;
  #stations;
  #lines;
  #m = 353;
  #b = -2175;
  #scale = (x) => this.#m * x + this.#b;
  #svg;
  #g;
  #projection;
  #tooltip;

  constructor({ arrondissements, stations, lines }) {
    this.#arrondissements = arrondissements;
    this.#stations = stations;
    this.#lines = lines;
    this.#svg = d3.select("svg");
    this.#g = this.#svg.append("g");
    this.#projection = d3.geoMercator();
    this.#tooltip = d3.select('body').append('div').attr('class', 'map-tooltip');
    window.addEventListener('resize', () => this.#resize());
    this.#draw();
  }

  #draw() {
    this.#resize()
    this.#drawParis({ arrondissements: this.#arrondissements, projection: this.#projection, g: this.#g, svg: this.#svg });
  }

  #drawParis() {
    this.#g.selectAll("path")
      .data(this.#arrondissements.features)
      .join("path")
      .attr('fill', '#dee2e6')
      .attr("d", d3.geoPath()
        .projection(this.#projection)
      )
      .style("stroke", "#6c757d")
      .style("stroke-width", 2);

    const zoomed = (event) => {
      this.#g.attr("transform", event.transform);
    }

    const zoom = d3.zoom()
      .scaleExtent([1, 8]) // Set the zoom scale's allowed range
      .on("zoom", zoomed);

    this.#svg.call(zoom);

    this.#svg.on("wheel", (event) => {
      event.preventDefault(); // Prevent the default scroll behavior
      const delta = event.deltaY;
      const scale = delta > 0 ? 1.2 : 0.8; // Determine whether to zoom in or out based on the direction of the scroll
      this.#svg.transition().call(zoom.scaleBy, scale);
    });
  }

  #resize() {
    const width = parseInt(this.#svg.style('width'));
    const height = width * 0.825;
    this.#projection
      .center([2.3522, 48.8566])
      .scale(this.#scale(height))
      .translate([width / 2, height / 2])

    this.#svg.attr("width", width).attr("height", height);
  }

  addStation({ station, color, adjacentStations }) {
    this.#drawStation({ station, color });
    this.#addPathBetweenStations({ newStation: station, adjacentStations });
  }

  #drawStation({ station, color = '#0d47a1' }) {
    for (const coordinates of station.properties.coordinates) {
      this.#g.append('circle')
        .attr('class', 'metro-station')
        .attr('cx', this.#projection(coordinates)[0])
        .attr('cy', this.#projection(coordinates)[1])
        .attr('r', 3)
        .style("fill", color)
        .on('mouseover', (e, d) => {
          this.#tooltip.style('visibility', 'visible');
          this.#tooltip.html(station.properties.name);
        })
        .on('mousemove',  (event) => {
          const [x, y] = d3.pointer(event)
          this.#tooltip.style('top', (event.pageY - 10) + 'px')
            .style('left', (event.pageX + 10) + 'px');
        })
        .on('mouseout', () => {
          this.#tooltip.style('visibility', 'hidden');
        });
    }

    this.#g.append('path')
      .attr('d', d3.line()(station.properties.coordinates.map(c => this.#projection(c))))
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('fill', 'none');
  }

  #addPathBetweenStations({ newStation, adjacentStations }) {
    for (const newStationLine of newStation.properties.lines) {
      const line = this.#lines.find(l => l.properties.name === newStationLine);
      for (const adjacentStation of adjacentStations) {
        const lineCoordinates = line.geometry.type === 'LineString' ? line.geometry.coordinates : line.geometry.coordinates[0];

        const newStationIndex = newStation.properties.inLineIndex[newStationLine];
        const adjacentStationIndex = adjacentStation.properties.inLineIndex[newStationLine];

        if (lineCoordinates.length < newStationIndex && lineCoordinates.length < adjacentStationIndex) {
          continue;
        }

        if (newStationIndex === undefined || adjacentStationIndex === undefined) {
          continue;
        }

        let drawLine;
        if (newStationIndex < adjacentStationIndex) {
          drawLine = lineCoordinates.slice(newStationIndex, adjacentStationIndex + 1);
        } else {
          drawLine = lineCoordinates.slice(adjacentStationIndex, newStationIndex + 1);
        }

        this.#g.append('path')
          .attr('d', d3.line()(drawLine.map(c => this.#projection(c))))
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr('fill', 'none');
      }
    }
  }
}

export {
  ParisMap
}