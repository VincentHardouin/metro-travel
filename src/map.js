import * as d3 from 'd3';

const PARIS_COORDINATES = [2.3522, 48.8566];

const color = {
  '1': '#FFCE00',
  '2': '#0064B0',
  '3': '#9F9825',
  '3bis': '#98D4E2',
  '4': '#C04191',
  '5': '#F28E42',
  '6': '#83C491',
  '7': '#F3A4BA',
  '7bis': '#83C491',
  '8': '#CEADD2',
  '9': '#D5C900',
  '10': '#E3B32A',
  '11': '#8D5E2A',
  '12': '#00814F',
  '13': '#98D4E2',
  '14': '#662483',
  '15': '#B90845',
  '16': '#F3A4BA',
  '17': '#D5C900',
  '18': '#00A88F',
};

class ParisMap {
  #arrondissements;
  #stations;
  #lines;
  #m = 353;
  #b = -2175;
  #scale = x => this.#m * x + this.#b;
  #svg;
  #g;
  #arrondissementsNode;
  #stationsNode;
  #projection;
  #tooltip;

  constructor({ arrondissements, stations, lines }) {
    this.#arrondissements = arrondissements;
    this.#stations = stations;
    this.#lines = lines;
    this.#svg = d3.select('svg');
    this.#g = this.#svg.append('g');
    this.#arrondissementsNode = this.#g.append('g');
    this.#stationsNode = this.#g.append('g');
    this.#stationsNode.attr('class', 'stations-slide-enter-content');
    this.#projection = d3.geoMercator();
    this.#tooltip = d3.select('body').append('div').attr('class', 'map-tooltip');
    window.addEventListener('resize', () => this.#resize());
    this.#draw();
  }

  #draw() {
    this.#resize();
    this.#drawParis({ arrondissements: this.#arrondissements, projection: this.#projection, g: this.#g, svg: this.#svg });
  }

  #drawParis() {
    const sortedArrondissements = this.#arrondissements.features.sort((a, b) => a.properties.c_ar - b.properties.c_ar);
    this.#arrondissementsNode.attr('class', 'slide-enter-content').selectAll('path')
      .data(sortedArrondissements)
      .join('path')
      .attr('fill', '#dee2e6')
      .attr('d', d3.geoPath()
        .projection(this.#projection))
      .style('stroke', '#6c757d')
      .style('stroke-width', 2);

    const zoomed = (event) => {
      this.#g.attr('transform', event.transform);
    };

    const zoom = d3.zoom()
      .scaleExtent([1, 8]) // Set the zoom scale's allowed range
      .on('zoom', zoomed);

    this.#svg.call(zoom);

    this.#svg.on('wheel', (event) => {
      event.preventDefault(); // Prevent the default scroll behavior
      const delta = event.deltaY;
      const scale = delta > 0 ? 1.2 : 0.8; // Determine whether to zoom in or out based on the direction of the scroll
      this.#svg.transition().call(zoom.scaleBy, scale);
    });
  }

  #resize() {
    const width = Number.parseInt(this.#svg.style('width'));
    const height = width * 0.725;
    this.#projection
      .center(PARIS_COORDINATES)
      .scale(this.#scale(height))
      .translate([width / 2, height / 2]);

    this.#svg.attr('width', width).attr('height', height);
  }

  addStation({ station, color, adjacentStations }) {
    this.#drawStation({ station, color });
    this.#addPathBetweenStations({ newStation: station, adjacentStations });
  }

  #drawStation({ station, color = '#0d47a1' }) {
    for (const coordinates of station.properties.coordinates) {
      this.#stationsNode.append('circle')
        .attr('class', 'metro-station')
        .attr('cx', this.#projection(coordinates)[0])
        .attr('cy', this.#projection(coordinates)[1])
        .attr('r', 3)
        .style('fill', color)
        .on('mouseover', () => {
          this.#tooltip.style('visibility', 'visible');
          this.#tooltip.html(station.properties.name);
        })
        .on('mousemove', (event) => {
          this.#tooltip.style('top', `${event.pageY - 10}px`)
            .style('left', `${event.pageX + 10}px`);
        })
        .on('mouseout', () => {
          this.#tooltip.style('visibility', 'hidden');
        });
    }

    this.#stationsNode.append('path')
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

        if (lineCoordinates.length < newStationIndex && lineCoordinates.length < adjacentStationIndex)
          continue;

        if (newStationIndex === undefined || adjacentStationIndex === undefined)
          continue;

        let drawLine;
        if (newStationIndex < adjacentStationIndex)
          drawLine = lineCoordinates.slice(newStationIndex, adjacentStationIndex + 1);
        else
          drawLine = lineCoordinates.slice(adjacentStationIndex, newStationIndex + 1);

        this.#stationsNode.append('path')
          .attr('d', d3.line()(drawLine.map(c => this.#projection(c))))
          .attr('stroke', color[line.properties.ref])
          .attr('stroke-width', 2)
          .attr('fill', 'none');
      }
    }
  }
}

export {
  ParisMap,
};
