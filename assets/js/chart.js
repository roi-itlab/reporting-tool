// https://exchangeratesapi.io/
// need to cache the json data in the future!

var api = "https://api.exchangeratesapi.io/history?start_at=2017-01-01&end_at=2018-10-01&symbols=RUB&base=USD";

document.addEventListener("DOMContentLoaded", function(event) {
  fetch(api)
    .then(function(response) { return response.json(); })
    .then(function(data) { 
      var parsedData = parseData(data["rates"]);
      drawChart(parsedData);
    })
});

Array.prototype.sortOn = function(key){
  this.sort(function(a, b) {
    if(a[key] < b[key]) {
      return -1;
    }
    else if(a[key] > b[key]) {
      return 1;
    }
    return 0;
  });
}

function parseData(data) {
  var arr = [];
  for (let rate in data) {
    arr.push(
      {
        date: new Date(rate),
        value: +data[rate]["RUB"]
      });
  }

  arr.sortOn("date");
  return arr;
}

function drawChart(data) {

  var svgWidth = 600, svgHeight = 400;
  var margin = { top: 20, right: 20, bottom: 60, left: 50 };
  var width = svgWidth - margin.left - margin.right;
  var height = svgHeight - margin.top - margin.bottom;

  var svg = d3.select('svg')
   .attr("width", svgWidth)
   .attr("height", svgHeight);
  
  var g = svg.append("g")
      .attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")"
  );

  var x = d3.scaleTime().rangeRound([0, width]);
  var y = d3.scaleLinear().rangeRound([height, 0]);

  var line = 
    d3.line()
      .x(function(d) { return x(d.date)})
      .y(function(d) { return y(d.value)})
      x.domain(d3.extent(data, function(d) { return d.date }));
      y.domain(d3.extent(data, function(d) { return d.value }));

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "xaxis")
    .call(d3.axisBottom(x).ticks(d3.timeMonth).tickFormat(d3.timeFormat("%Y-%m-%d")))
    .select(".domain");

  // rotate x axis labels
  g.selectAll(".xaxis text")
    .attr("transform", function(d) {
            return "translate(" + 
                    this.getBBox().height*-2 + 
                    "," + 
                    this.getBBox().height + 
                    ")rotate(-45)";
          });

  g.append("g")
    .call(d3.axisLeft(y).ticks(40))
    .append("text")
    .attr("class", "yaxis")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("USD Price (in RUB)");

  g.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);
}