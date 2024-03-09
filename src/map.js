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

export {
  drawParis
}