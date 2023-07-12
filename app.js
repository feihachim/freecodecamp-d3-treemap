"use strict";

const url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
let dataset;

const canvas = d3.select("#canvas");
const tooltip = d3.select("#tooltip");

const drawTreeMap = () => {
  let hierarchy = d3
    .hierarchy(dataset, (node) => node["children"])
    .sum((node) => node["value"])
    .sort((node1, node2) => node2["value"] - node1["value"]);

  const createTreeMap = d3.treemap().size([1000, 600]);

  createTreeMap(hierarchy);
  let movieTitles = hierarchy.leaves();
  console.log(movieTitles);
  let block = canvas
    .selectAll("g")
    .data(movieTitles)
    .enter()
    .append("g")
    .attr("transform", (movie) => `translate(${movie["x0"]},${movie["y0"]})`);

  block
    .append("rect")
    .attr("class", "tile")
    .attr("fill", (movie) => {
      switch (movie["data"]["category"]) {
        case "Action":
          return "orange";
        case "Drama":
          return "lightgreen";
        case "Adventure":
          return "coral";
        case "Family":
          return "lightblue";
        case "Animation":
          return "pink";
        case "Comedy":
          return "khaki";
        case "Biography":
          return "tan";
      }
    })
    .attr("data-name", (movie) => movie["data"]["name"])
    .attr("data-category", (movie) => movie["data"]["category"])
    .attr("data-value", (movie) => movie["data"]["value"])
    .attr("width", (movie) => movie["x1"] - movie["x0"])
    .attr("height", (movie) => movie["y1"] - movie["y0"])
    .on("mouseover", (event, movie) => {
      tooltip.transition().style("visibility", "visible");

      tooltip
        .text(`${movie["data"]["name"]} : $${movie["data"]["value"]}`)
        .attr("data-value", movie["data"]["value"]);
    })
    .on("mouseout", (event, movie) => {
      tooltip.transition().style("visibility", "hidden");
    });

  block
    .append("text")
    .text((movie) => movie["data"]["name"])
    .attr("x", 5)
    .attr("y", 20);
};

d3.json(url).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    dataset = data;

    drawTreeMap();
  }
});
