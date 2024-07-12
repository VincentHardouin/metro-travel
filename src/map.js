import * as d3 from 'd3';

const PARIS_COORDINATES = [2.3522, 48.8566];

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
    this.#svg = d3.select('svg#carte');
    this.#remove();
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
    this.#drawParis();
  }

  #remove() {
    this.#svg.selectAll('g').remove();
    d3.select('.map-tooltip').remove();
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

    d3.select('#map-zoom-in').on('click', () => {
      zoom.scaleBy(this.#svg.transition().duration(750), 1.2);
    });
    d3.select('#map-zoom-out').on('click', () => {
      zoom.scaleBy(this.#svg.transition().duration(750), 0.8);
    });
  }

  #resize() {
    const width = Number.parseInt(this.#svg.style('width'));
    const height = width * 0.625;
    this.#projection = this.#projection
      .center(PARIS_COORDINATES)
      .scale(this.#scale(height))
      .translate([width / 2, height / 2]);

    this.#svg.attr('width', width).attr('height', height);
  }

  addStation({ station, color, adjacentStops }) {
    this.#drawStation({ station, color });
    this.#addPathBetweenStations({ adjacentStops });
  }

  #drawStation({ station, color = '#0d47a1' }) {
    const point = [station.stop_lon, station.stop_lat];
    this.#stationsNode.append('circle')
      .attr('class', 'metro-station')
      .attr('cx', this.#projection(point)[0])
      .attr('cy', this.#projection(point)[1])
      .attr('r', 3)
      .attr('data-stop-id', station.stop_unique_id)
      .style('fill', color)
      .on('mouseover', () => {
        this.#tooltip.style('visibility', 'visible');
        this.#tooltip.html(station.stop_name);
      })
      .on('mousemove', (event) => {
        this.#tooltip.style('top', `${event.pageY - 10}px`)
          .style('left', `${event.pageX + 10}px`);
      })
      .on('mouseout', () => {
        this.#tooltip.style('visibility', 'hidden');
      });
  }

  #addPathBetweenStations({ adjacentStops }) {
    adjacentStops
      .filter(adjacentStop => adjacentStop.path)
      .forEach((adjacentStop) => {
        if (!adjacentStop.path.length || !adjacentStop.route_id)
          return;

        const { route_color: color } = this.#lines.find(line => line.route_id === adjacentStop.route_id);
        this.#stationsNode.append('path')
          .attr('d', d3.line()(adjacentStop.path.map(p => this.#projection(p))))
          .attr('stroke', `#${color}`)
          .attr('stroke-width', 2)
          .attr('fill', 'none')
          .attr('data-stop-ids', `${adjacentStop.from_stop_unique_id},${adjacentStop.to_stop_unique_id}`);
      });
  }

  removeStation(stopId) {
    this.#stationsNode.selectAll(`[data-stop-id="${stopId}"]`).remove();
    this.#stationsNode.selectAll(`[data-stop-ids*="${stopId}"]`).remove();
  }
}

export {
  ParisMap,
};
